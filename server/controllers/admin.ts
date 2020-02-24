import { promisify } from 'util'

import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import { Context } from 'koa'
import { pki } from 'node-forge'

import { DonationDistribution, unionDisplayName } from '@/utils'

import { Bot, Project, Wallet } from '../entities'
import { getAssets, mixin, mixinBot, randomPin } from '../utils'

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

    const assets = await getAssets()
    const bots: Bot[] = []
    const wallets: Array<Pick<Wallet, 'botId' | 'assetId' | 'projectId'>> = []

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
        const bitMixin = mixinBot(bot)
        const pin = randomPin()
        await bitMixin.pin_update({
          old_pin: bot.pin,
          pin,
        })
        bot.pin = pin
        bots.push(bot)
        assets.forEach(asset =>
          wallets.push({
            projectId: bot.projectId,
            botId: bot.id,
            assetId: asset.asset_id,
          }),
        )
      }),
    )

    ctx.body = await Promise.all([
      botRepo.save(bots),
      ctx.conn.getRepository(Wallet).save(wallets),
    ])
  }
}
