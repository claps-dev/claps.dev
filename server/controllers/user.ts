import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import axios from 'axios'
import { Context } from 'koa'
import { BigNumber, bignumber } from 'mathjs'
import { MixinResponse, User } from 'mixin-node-sdk'
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
import { mixinBot, octokitMap } from '../utils'

@Controller
@RequestMapping('/user')
export class UserController {
  @LoginRequired
  @RequestMapping('/profile')
  async profile(ctx: Context) {
    const userId = ctx.session.user.id
    const { data } = await octokitMap.get(userId).users.listEmails()
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

    const {
      data: { data: user },
    } = await axios.get<MixinResponse<User>>('https://api.mixin.one/me', {
      headers: {
        Authorization: `Bearer ${ctx.session.mixinToken}`,
      },
    })

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
          opponent_id: user.user_id,
          memo: ['Claps.dev donation', bot.project].join(' - '),
        })
        transfers.push({
          snapshotId: transfer.snapshot_id,
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
}
