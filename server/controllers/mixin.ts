import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import { Context } from 'koa'

@Controller
@RequestMapping('/mixin')
export class MixinController {
  @RequestMapping('/oauth')
  oauth(ctx: Context) {
    const { state } = ctx.query

    if (!state || state !== ctx.session.uuid) {
      return ctx.throw('invalid oauth redirect')
    }
  }
}
