import { Controller, Method, RequestMapping } from '@rxts/koa-router-decorators'
import consola from 'consola'
import { Context } from 'koa'
import { BigNumber, bignumber } from 'mathjs'
import { FindOperator } from 'typeorm'

import { numToStr } from '@/utils'

import { LoginRequired } from '../decorators'
import {
  Bot,
  Member,
  MemberWallet,
  Project,
  Transfer,
  Wallet,
} from '../entities'
import { createOctokit, getPatrons, getTotal, mixinBot } from '../utils'

@Controller
@RequestMapping('/user')
export class UserController {
  @LoginRequired
  @RequestMapping('/profile')
  async profile(ctx: Context) {
    const {
      gitHubToken,
      user: { id: userId },
    } = ctx.session
    const { data } = await createOctokit(gitHubToken).users.listEmails()
    ctx.body = {
      emails: data,
      projects: await Promise.all(
        (
          await ctx.conn.getRepository(Project).findByIds(
            (
              await ctx.conn.getRepository(Member).find({
                select: ['projectId'],
                where: {
                  userId,
                },
              })
            ).map(({ projectId }) => projectId),
            {
              relations: ['wallets'],
            },
          )
        ).map(async project => {
          project.total = await getTotal(project)
          project.patrons = await getPatrons(project.id)
          return project
        }),
      ),
    }
  }

  @LoginRequired
  @RequestMapping('/assets')
  async assets(ctx: Context) {
    const userId = ctx.session.user.id
    const memberWallets = await ctx.conn.getRepository(MemberWallet).find({
      where: {
        userId,
      },
    })
    ctx.body = memberWallets.reduce<Record<string, BigNumber | number>>(
      (acc, { assetId, balance }, index) => {
        if (acc[assetId] == null) {
          acc[assetId] = bignumber(0)
        }
        acc[assetId] = (acc[assetId] as BigNumber).add(balance)
        if (index === memberWallets.length - 1) {
          acc[assetId] = (acc[assetId] as BigNumber).toNumber()
        }
        return acc
      },
      {},
    )
  }

  @LoginRequired
  @RequestMapping('/withdraw', Method.POST)
  async withdraw(ctx: Context) {
    const { assetId, amount } = ctx.request.body

    if (!assetId || !amount) {
      return ctx.throw(400, 'assetId and amount are required')
    }

    const memberWalletRepo = ctx.conn.getRepository(MemberWallet)

    const memberWallets = await memberWalletRepo.find({
      where: {
        assetId,
        balance: new FindOperator('moreThanOrEqual', 0),
        userId: ctx.session.user.id,
      },
    })

    const balance = memberWallets.reduce(
      (acc, { balance }) => acc.add(balance),
      bignumber(0),
    )

    if (!balance.equals(amount)) {
      return ctx.throw(400, 'Expired balance amount, please refresh')
    }

    const bots = await ctx.conn.getRepository(Bot).find({
      relations: ['project'],
      where: {
        id: new FindOperator(
          'in',
          memberWallets.map(({ botId }) => botId),
        ),
      },
    })

    const walletRepo = ctx.conn.getRepository(Wallet)

    const transfers: Transfer[] = []
    const wallets: Wallet[] = []

    await Promise.all(
      bots.map(async bot => {
        const botMixin = mixinBot(bot)
        const botId = bot.id
        const botWallet = await walletRepo.findOneOrFail({
          where: {
            botId,
            assetId,
          },
        })
        const memberWallet = memberWallets.find(m => m.botId === botId)
        const amount = numToStr(memberWallet.balance)
        if (memberWallet.balance <= 0) {
          return
        }
        const transfer = await botMixin.transfer({
          amount,
          asset_id: assetId,
          opponent_id: ctx.session.mixinUser.user_id,
          memo: ['Claps.dev donation', bot.project.name].join(' - '),
        })
        if ('code' in transfer) {
          consola.error({
            amount,
            asset_id: assetId,
            opponent_id: ctx.session.mixinUser.user_id,
            memo: ['Claps.dev donation', bot.project.name].join(' - '),
          })
          // @ts-ignore
          throw new Error(transfer.description)
        }
        transfers.push({
          snapshotId: transfer.snapshot_id,
          userId: ctx.session.user.id,
          traceId: transfer.trace_id,
          opponentId: transfer.opponent_id,
          assetId: transfer.asset_id,
          amount: -Number(transfer.amount),
          memo: transfer.memo,
          createdAt: new Date(transfer.created_at),
        })
        botWallet.balance = bignumber(botWallet.balance)
          .minus(memberWallet.balance)
          .toNumber()
        wallets.push(botWallet)
      }),
    )

    await ctx.conn.getRepository(Transfer).save(transfers)
    await walletRepo.save(wallets)
    await memberWalletRepo.save(
      memberWallets.map(memberWallet => ({ ...memberWallet, balance: 0 })),
    )

    ctx.status = 200
  }

  @LoginRequired
  @RequestMapping('/transactions')
  async transactions(ctx: Context) {
    const { assetId } = ctx.query

    if (!assetId) {
      return ctx.throw(400, 'assetId is required')
    }

    ctx.body = await ctx.conn.getRepository(Transfer).find({
      where: {
        userId: ctx.session.user.id,
        assetId,
      },
    })
  }
}
