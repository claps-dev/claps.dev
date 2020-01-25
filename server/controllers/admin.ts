import { promisify } from 'util'

import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import { Context } from 'koa'
import { pki } from 'node-forge'

import { unionDisplayName } from '../../src/utils'
import { Bot, Project } from '../entities'
import { mixin, mixinBot, randomPin } from '../utils'

const generateKeyPair = promisify(pki.rsa.generateKeyPair)

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

    const existBot = await botRepo.findOne({
      relations: ['project'],
      where: {
        projectId,
      },
    })

    if (existBot) {
      ctx.body = existBot
      return
    }

    const { publicKey, privateKey } = await generateKeyPair({
      bits: 1024,
      workers: 2,
    })

    const publicKeyPem = pki.publicKeyToPem(publicKey)
    const privateKeyPem = pki.privateKeyToPem(privateKey)

    const sessionSecret = publicKeyPem
      .trim()
      .split(/\r?\n/)
      .slice(1, -1)
      .join('')

    let botUser = await mixin.create_user({
      full_name:
        ctx.query.fullName ||
        unionDisplayName(await ctx.conn.getRepository(Project).findOne()),
      session_secret: sessionSecret,
    })

    const bot = {
      id: botUser.user_id,
      pin: '',
      pinToken: botUser.pin_token,
      privateKey: privateKeyPem,
      projectId,
      sessionId: botUser.session_id,
    } as Bot
    const pin = randomPin()
    botUser = await mixinBot(bot).pin_update({
      old_pin: bot.pin,
      pin,
    })
    bot.pin = pin
    await botRepo.save(bot)

    ctx.body = botUser
  }
}
