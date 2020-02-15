import { createTokenAuth } from '@octokit/auth-token'
import { Octokit } from '@octokit/rest'
import { BinaryLike, createHash, randomBytes } from 'crypto'
import { formatRFC3339 } from 'date-fns'
import { last, uniqBy } from 'lodash'
import { bignumber, isPositive } from 'mathjs'
import { Asset } from 'mixin-node-sdk'
import { Connection, createConnection } from 'typeorm'

import { filterAssets } from '@/utils'

import * as entities from '../entities'
import { Bot, Member, MemberWallet, Transaction, Wallet } from '../entities'

import { mixin } from './constants'
import { mixinBot } from './mixin'

export const base64 = (data: string | Buffer, uriEncode = false) => {
  let result = (typeof data === 'string' ? Buffer.from(data) : data).toString(
    'base64',
  )
  if (uriEncode) {
    result = result
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }
  return result
}

export const random = (uriEncode = false) => base64(randomBytes(32), uriEncode)

export type HexBase64Latin1Encoding = 'latin1' | 'hex' | 'base64'

export function sha256(buffer: BinaryLike): Buffer
export function sha256(
  buffer: BinaryLike,
  encoding: HexBase64Latin1Encoding,
): string
export function sha256(
  buffer: BinaryLike,
  encoding?: HexBase64Latin1Encoding,
): Buffer | string {
  return createHash('sha256')
    .update(buffer)
    .digest(encoding)
}

export const randomPin = (length = 6) => {
  let pin = ''
  for (let i = 0; i < length; i++) {
    pin += Math.floor(Math.random() * 10)
  }
  return pin
}

export const createOctokit = (token = process.env.GITHUB_CLIENT_TOKEN) =>
  new Octokit({
    authStrategy: () => createTokenAuth(token),
  })

let conn: Connection

export const getConn = async () =>
  conn ||
  (conn = await createConnection({
    type: 'mysql',
    ...JSON.parse(process.env.DATABASE_CONFIG),
    entities: Object.values(entities),
  }))

export const getAssets = (() => {
  let assets: Asset[]
  let lastCheck: number
  return async () => {
    const now = Date.now()
    if (assets && lastCheck && now - lastCheck < 30 * 1000) {
      return assets
    }
    lastCheck = now
    return (assets = filterAssets(await mixin.query_assets({})))
  }
})()

// eslint-disable-next-line sonarjs/cognitive-complexity
export const syncTransactions = async (projectId?: string) => {
  const [conn, assets] = await Promise.all([getConn(), getAssets()])
  const queryRunner = conn.createQueryRunner()
  await queryRunner.connect()
  const { manager } = queryRunner

  const bots = await manager.find(
    Bot,
    projectId && {
      where: {
        projectId,
      },
    },
  )

  await queryRunner.startTransaction()

  try {
    await Promise.all(
      // eslint-disable-next-line sonarjs/cognitive-complexity
      bots.map(bot => {
        const { id: botId, projectId } = bot
        const botMixin = mixinBot(bot)

        let members: Member[]

        return Promise.all(
          assets.map(async asset => {
            const { asset_id: assetId } = asset
            const wallet = await manager.findOneOrFail(Wallet, {
              where: {
                botId,
                assetId,
              },
            })

            let snapshots = await botMixin.query_network_snapshots({
              asset: asset.asset_id,
              offset: formatRFC3339(wallet.syncedAt || wallet.createdAt),
              order: 'ASC',
            })

            let allSnapshots = snapshots

            while (snapshots.length >= 500) {
              const lastSnapshot = last(snapshots)
              snapshots = await botMixin.query_network_snapshots({
                asset: asset.asset_id,
                offset: lastSnapshot.created_at,
                order: 'ASC',
              })

              const nextSnapshots = uniqBy(
                allSnapshots.concat(snapshots),
                'snapshot_id',
              )

              if (nextSnapshots.length === allSnapshots.length) {
                break
              }
              allSnapshots = nextSnapshots
            }

            const transactions = await manager.save(
              allSnapshots
                .filter(s => s.user_id)
                .map(s =>
                  Object.assign(new Transaction(), {
                    id: s.snapshot_id,
                    projectId,
                    botId,
                    assetId,
                    amount: Number(s.amount),
                    createdAt: s.created_at,
                    sender: s.user_id,
                  }),
                ),
            )

            const { total, balance } = transactions.reduce(
              (acc, { amount }) => {
                acc.balance = acc.balance.add(amount)
                if (amount > 0) {
                  acc.total = acc.total.add(amount)
                }
                return acc
              },
              {
                total: bignumber(0),
                balance: bignumber(0),
              },
            )

            if (isPositive(total)) {
              members =
                members ||
                (members = await manager.find(Member, {
                  where: {
                    projectId,
                  },
                }))

              const memberWallets = await manager.find(MemberWallet, {
                where: {
                  projectId,
                  botId,
                  assetId,
                },
              })

              let newMemberWallets: MemberWallet[]

              // eslint-disable-next-line sonarjs/no-small-switch
              switch (bot.distribution) {
                default: {
                  const amount = total.dividedBy(members.length)
                  newMemberWallets = members.map(m => {
                    const memberWallet =
                      memberWallets.find(({ userId }) => m.userId === userId) ||
                      Object.assign(new MemberWallet(), {
                        projectId,
                        botId: bot.id,
                        assetId,
                        userId: m.userId,
                        total: 0,
                        balance: 0,
                      })

                    memberWallet.total = amount
                      .add(memberWallet.total)
                      .toNumber()
                    memberWallet.balance = amount
                      .add(memberWallet.balance)
                      .toNumber()

                    return memberWallet
                  })
                  break
                }
              }

              manager.save(newMemberWallets)
            }

            return manager.save(
              Object.assign(wallet, {
                total: total.add(wallet.total).toNumber(),
                balance: balance.add(wallet.balance).toNumber(),
                syncedAt: last(allSnapshots)?.created_at,
              }),
            )
          }),
        )
      }),
    )
  } catch {
    await queryRunner.rollbackTransaction()
  } finally {
    await queryRunner.release()
  }
}
