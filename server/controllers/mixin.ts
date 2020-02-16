import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import axios from 'axios'
import { Context } from 'koa'
import { MixinResponse, User } from 'mixin-node-sdk'

import { mixin } from '../utils'

@Controller
@RequestMapping('/mixin')
export class MixinController {
  @RequestMapping('/oauth')
  async oauth(ctx: Context) {
    const { code, state } = ctx.query

    if (!state || state !== ctx.session.uid) {
      ctx.session.mixinToken = null
      return ctx.throw(400, 'invalid oauth redirect')
    }

    const {
      data: { data, error },
    } = await axios.post<
      MixinResponse<{
        access_token: string
        scope: string
      }>
    >('https://api.mixin.one/oauth/token', {
      client_id: process.env.MIXIN_CLIENT_ID,
      client_secret: process.env.MIXIN_CLIENT_SECRET,
      code,
    })

    if (error) {
      return ctx.throw(error.status, error.description, error.code)
    }

    const mixinToken = data.access_token

    const {
      data: { data: mixinUser },
    } = await axios.get<MixinResponse<User>>('https://api.mixin.one/me', {
      headers: {
        Authorization: `Bearer ${mixinToken}`,
      },
    })

    Object.assign(ctx.session, {
      mixinToken,
      mixinScope: data.scope,
      mixinUser,
    })

    ctx.redirect(decodeURIComponent(ctx.cookies.get('redirectPath')) || '/')
  }

  @RequestMapping('/assets')
  async assets(ctx: Context) {
    ctx.body = await mixin.query_assets({})
  }
}
