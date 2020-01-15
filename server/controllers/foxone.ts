import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import consola from 'consola'
import { Context, Next } from 'koa'

@Controller
@RequestMapping('/foxone')
export class FoxoneController {
  @RequestMapping('/oauth')
  oauth(ctx: Context, next: Next) {
    consola.log(ctx)
    next()
  }
}
