import { BinaryLike, createHash, randomBytes } from 'crypto'
import { formatRFC3339 } from 'date-fns'
import { last, uniqBy } from 'lodash'
import { bignumber } from 'mathjs'
import { Connection, createConnection } from 'typeorm'

import { filterAssets } from '@/utils'

import * as entities from '../entities'
import { Bot, Transaction, Wallet } from '../entities'

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

let conn: Connection | undefined

export const getConn = async () =>
  conn ||
  (conn = await createConnection({
    type: 'mysql',
    ...JSON.parse(process.env.DATABASE_CONFIG),
    entities: Object.values(entities),
  }))

export const syncTransactions = async (projectId?: string) => {
  const conn = await getConn()
  const assets = filterAssets(await mixin.query_assets({}))
  const bots = await conn.getRepository(Bot).find(
    projectId && {
      where: {
        projectId,
      },
    },
  )
  const walletRepo = conn.getRepository(Wallet)
  const transactionRepo = conn.getRepository(Transaction)

  return Promise.all(
    bots.map(bot => {
      const botMixin = mixinBot(bot)
      return Promise.all(
        assets.map(async asset => {
          const wallet = await walletRepo.findOneOrFail({
            where: {
              botId: bot.id,
              assetId: asset.asset_id,
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

          const transactions = await transactionRepo.save(
            allSnapshots
              .filter(s => s.user_id)
              .map(s => ({
                id: s.snapshot_id,
                projectId: bot.projectId,
                botId: bot.id,
                assetId: asset.asset_id,
                amount: Number(s.amount),
                createdAt: s.created_at,
                sender: s.user_id,
              })),
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

          return walletRepo.save(
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
}
