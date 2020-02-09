import { promisify } from 'util'

import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import { formatRFC3339 } from 'date-fns'
import { Context } from 'koa'
import { last, uniqBy } from 'lodash'
import { bignumber } from 'mathjs'
import { pki } from 'node-forge'

import { DonationDistribution, unionDisplayName } from '@/utils'

import { Bot, Project, Transaction, Wallet } from '../entities'
import { mixin, mixinBot, randomPin } from '../utils'

const generateKeyPair = promisify(pki.rsa.generateKeyPair)

const DONATION_DISTRIBUTIONS = Object.values(DonationDistribution).filter(
  _ => typeof _ === 'number',
) as DonationDistribution[]

@Controller
@RequestMapping('/admin')
export class AdminController {
  @RequestMapping('/createBot')
  async createBot(ctx: Context) {
    const { projectId } = ctx.query

    if (!projectId) {
      return ctx.throw(400, 'projectId is required')
    }

    const botRepo = ctx.conn.getRepository(Bot)

    const existBots = await botRepo.find({
      relations: ['project'],
      where: {
        projectId,
      },
    })

    if (existBots.length > 0) {
      ctx.body = existBots
      return
    }

    const bots: Bot[] = []

    let projectDisplayName: string

    await Promise.all(
      DONATION_DISTRIBUTIONS.map(async distribution => {
        const { publicKey, privateKey } = await generateKeyPair({
          bits: 1024,
          workers: 2,
        })

        const publicKeyPem = pki.publicKeyToPem(publicKey)
        const privateKeyPem = pki.privateKeyToPem(privateKey)

        const botUser = await mixin.create_user({
          full_name:
            ctx.query.fullName ||
            [
              projectDisplayName ||
                (projectDisplayName = unionDisplayName(
                  await ctx.conn
                    .getRepository(Project)
                    .findOne({ id: projectId }),
                )),
              distribution,
            ].join('_'),
          session_secret: publicKeyPem
            .trim()
            .split(/\r?\n/)
            .slice(1, -1)
            .join(''),
        })

        const bot = {
          id: botUser.user_id,
          distribution,
          pin: '',
          pinToken: botUser.pin_token,
          privateKey: privateKeyPem,
          projectId,
          sessionId: botUser.session_id,
        } as Bot
        const pin = randomPin()
        await mixinBot(bot).pin_update({
          old_pin: bot.pin,
          pin,
        })
        bot.pin = pin
        bots.push(bot)
      }),
    )

    ctx.body = await botRepo.save(bots)
  }

  @RequestMapping('/sync')
  // eslint-disable-next-line sonarjs/cognitive-complexity
  async sync(ctx: Context) {
    const { projectId } = ctx.query

    if (!projectId) {
      return ctx.throw(400, 'projectId is required')
    }

    const bots = await ctx.conn.getRepository(Bot).find({
      where: {
        projectId,
      },
    })

    const walletRepo = ctx.conn.getRepository(Wallet)
    const transactionRepo = ctx.conn.getRepository(Transaction)

    ctx.body = await Promise.all(
      bots.map(async bot => {
        const botMixin = mixinBot(bot)
        const assets = await botMixin.query_assets({})
        return Promise.all(
          assets.map(async asset => {
            let wallet = await walletRepo.findOne({
              where: {
                botId: bot.id,
                assetId: asset.asset_id,
              },
            })

            if (!wallet) {
              wallet = await walletRepo.save({
                botId: bot.id,
                assetId: asset.asset_id,
                assetSymbol: asset.symbol,
                updatedAt: new Date(),
              })
            }

            let snapshots = await botMixin.query_network_snapshots({
              asset: asset.asset_id,
              offset: wallet.syncedAt && formatRFC3339(wallet.syncedAt),
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
                  amount: Number(s.amount),
                  assetSymbol: asset.symbol,
                  createdAt: s.created_at,
                  sender: s.user_id,
                })),
            )

            if (transactions.length === 0) {
              return
            }

            const { total, balance } = transactions.reduce(
              (acc, { amount }) => {
                acc.balance = acc.balance.add(amount)
                if (Number(amount) > 0) {
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
                syncedAt: last(allSnapshots).created_at,
                updatedAt: new Date(),
              }),
            )
          }),
        )
      }),
    )
  }
}
