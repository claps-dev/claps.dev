import fs from 'fs'
import { resolve } from 'path'

import consola from 'consola'
import { last } from 'lodash'
import { bignumber, isPositive } from 'mathjs'
import { Snapshot } from 'mixin-node-sdk'

import { Bot, Member, MemberWallet, Transaction, Wallet } from '../entities'

import { mixin } from './constants'
import { formatRFC3339Nano, getAssets, getConn } from './helpers'

const PERSISTENCE_DIR = resolve('node_modules/.persistence')

const PERSISTENCE_FILE = resolve(PERSISTENCE_DIR, 'claps.dev.json')

if (!fs.existsSync(PERSISTENCE_DIR)) {
  fs.mkdirSync(PERSISTENCE_DIR)
}

if (!fs.existsSync(PERSISTENCE_FILE)) {
  fs.closeSync(fs.openSync(PERSISTENCE_FILE, 'w'))
}

export interface Persistence {
  syncTime: number
}

export const getPersistence = (): Persistence => {
  const content = fs.readFileSync(PERSISTENCE_FILE, {
    encoding: 'utf-8',
  })
  return content ? JSON.parse(content) : {}
}

export const setPersistence = (persistence: Partial<Persistence>) =>
  fs.writeFileSync(
    PERSISTENCE_FILE,
    JSON.stringify(Object.assign(getPersistence(), persistence)),
  )

let timeoutId: NodeJS.Timer
let lastSyncTime = getPersistence().syncTime

if (!process.env.ROUTER_DEV) {
  process.once('SIGINT', () => {
    // eslint-disable-next-line no-process-exit
    process.exit(0)
  })

  process.once('exit', () => {
    clearTimeout(timeoutId)
    if (lastSyncTime) {
      setPersistence({ syncTime: lastSyncTime })
    }
  })
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const syncTransactions = async () => {
  const [conn, assets] = await Promise.all([getConn(), getAssets()])
  const queryRunner = conn.createQueryRunner()
  await queryRunner.connect()
  const { manager } = queryRunner

  const bots = await manager.find(Bot)
  const botIds = bots.map(bot => bot.id)
  const botMap = bots.reduce<Record<string, Bot>>(
    (acc, bot) =>
      Object.assign(acc, {
        [bot.id]: bot,
      }),
    {},
  )

  const memberMap: Record<string, Member[]> = {}

  try {
    while (true) {
      await queryRunner.startTransaction()

      const offset = formatRFC3339Nano(
        (lastSyncTime || (Date.now() - 30 * 24 * 60 * 60 * 1000) * 1e6) - 1,
      )

      consola.debug('offset:', offset)

      const snapshots = await mixin.query_network_snapshots({
        offset,
        order: 'ASC',
      })

      const validSnapshots = snapshots.reduce<Record<string, Snapshot>>(
        (acc, snapshot) => {
          const botId = botIds.includes(snapshot.user_id)
            ? snapshot.user_id
            : botIds.includes(snapshot.opponent_id)
            ? snapshot.opponent_id
            : null
          if (botId && Number(snapshot.amount) > 0) {
            Object.assign(acc, {
              [botId]: snapshot,
            })
          }
          return acc
        },
        {},
      )

      const transactions = await manager.save(
        Object.entries(validSnapshots).map(([botId, snapshot]) =>
          Object.assign(new Transaction(), {
            id: snapshot.snapshot_id,
            projectId: botMap[botId].projectId,
            botId,
            assetId: snapshot.asset.asset_id,
            amount: Number(snapshot.amount),
            createdAt: snapshot.created_at,
            sender: snapshot.opponent_id,
            receiver: snapshot.user_id,
          }),
        ),
      )

      if (transactions.length > 0) {
        for await (const bot of bots) {
          const botId = bot.id
          const projectId = bot.projectId

          let members = memberMap[projectId]

          if (!members) {
            members = memberMap[projectId] = await manager.find(Member, {
              where: {
                projectId,
              },
            })
          }

          for await (const asset of assets) {
            const assetId = asset.asset_id

            const wallet = await manager.findOneOrFail(Wallet, {
              where: {
                assetId,
                botId,
                projectId,
              },
            })

            const incomeTransactions = transactions.filter(
              t =>
                t.botId === botId &&
                t.botId === t.receiver &&
                t.projectId === projectId &&
                t.assetId === assetId,
            )

            const { total, balance } = incomeTransactions.reduce(
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
                      memberWallets.find(
                        ({ userId, botId }) =>
                          m.userId === userId && bot.id === botId,
                      ) ||
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

            await manager.save(
              Object.assign(wallet, {
                total: total.add(wallet.total).toNumber(),
                balance: balance.add(wallet.balance).toNumber(),
              }),
            )
          }
        }
      }

      if (snapshots.length > 0) {
        lastSyncTime = new Date(last(snapshots).created_at).getTime() * 1e6
      }

      await queryRunner.commitTransaction()

      if (snapshots.length < 500) {
        timeoutId = global.setTimeout(() => {
          syncTransactions()
        }, 30 * 1000)
        break
      }
    }
  } catch (e) {
    consola.error('sync transactions failed:', e)
    await queryRunner.rollbackTransaction()
    timeoutId = global.setTimeout(() => {
      syncTransactions()
    }, 3 * 1000)
  } finally {
    await queryRunner.release()
  }
}

if (!process.env.ROUTER_DEV) {
  syncTransactions()
}
