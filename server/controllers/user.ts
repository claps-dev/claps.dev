import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import { Context } from 'koa'
import { BigNumber, bignumber } from 'mathjs'
import { FindOperator } from 'typeorm'

import { LoginRequired } from '../decorators'
import {
  Bot,
  Member,
  MemberWallet,
  Project,
  Transfer,
  Wallet,
} from '../entities'
import { createOctokit, mixinBot } from '../utils'

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
      projects: await ctx.conn.getRepository(Project).findByIds(
        (
          await ctx.conn.getRepository(Member).find({
            select: ['projectId'],
            where: {
              userId,
            },
          })
        ).map(({ projectId }) => projectId),
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
    ctx.body = memberWallets.reduce<Record<string, BigNumber>>(
      (acc, { assetId, balance }) => {
        if (acc[assetId] == null) {
          acc[assetId] = bignumber(0)
        }
        acc[assetId] = acc[assetId].add(balance)
        return acc
      },
      {},
    )
  }

  @LoginRequired
  @RequestMapping('/withdraw')
  async withdraw(ctx: Context) {
    const { assetId, amount } = ctx.query

    if (!assetId || !amount) {
      return ctx.throw(400, 'assetId and amount are required')
    }

    const memberWallets = await ctx.conn.getRepository(MemberWallet).find({
      where: {
        assetId,
        balance: new FindOperator('moreThanOrEqual', 0),
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
        const transfer = await botMixin.transfer({
          amount: memberWallet.balance,
          asset_id: assetId,
          opponent_id: ctx.session.mixUser.user_id,
          memo: ['Claps.dev donation', bot.project].join(' - '),
        })
        transfers.push({
          snapshotId: transfer.snapshot_id,
          userId: ctx.session.user.id,
          traceId: transfer.trace_id,
          opponentId: transfer.opponent_id,
          assetId: transfer.asset_id,
          amount: Number(transfer.amount),
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
