import { promisify } from 'util'

import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import { Context } from 'koa'
import { pki } from 'node-forge'

import { mixin, random } from '../utils'
import { Bot } from '../entities'

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

    const bot = await botRepo.findOne({
      where: {
        project_id: projectId,
      },
    })

    if (bot) {
      ctx.body = bot
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

    const botUser = await mixin.create_user({
      full_name: ctx.query.fullName || random(true),
      session_secret: sessionSecret,
    })

    await botRepo.save({
      id: botUser.user_id,
      pinToken: botUser.pin_token,
      privateKey: privateKeyPem,
      projectId,
      sessionId: botUser.session_id,
    })

    ctx.body = botUser
  }
}
