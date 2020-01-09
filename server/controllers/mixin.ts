import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import { Context } from 'koa'

@Controller
@RequestMapping('/mixin')
export class MixinController {
  @RequestMapping('/oauth')
  oauth(ctx: Context) {
    const { code, state } = ctx.query

    if (!state || state !== ctx.session.uid) {
      ctx.session.mixinToken = null
      return ctx.throw('invalid oauth redirect')
    }

    ctx.session.mixinToken = code

    ctx.redirect(decodeURIComponent(ctx.cookies.get('redirectPath')) || '/')
  }
}
