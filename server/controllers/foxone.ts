import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import { Context } from 'koa'

@Controller
@RequestMapping('/foxone')
export class FoxoneController {
  @RequestMapping('/oauth')
  oauth(ctx: Context) {
    const { code, state } = ctx.query

    if (!state || state !== ctx.session.uid) {
      ctx.session.mixinToken = null
      return ctx.throw(400, 'invalid oauth redirect')
    }

    ctx.body = code
  }
}
