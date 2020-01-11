import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import consola from 'consola'
import { Context } from 'koa'

@Controller
@RequestMapping('/foxone')
export class FoxoneController {
  @RequestMapping('/oauth')
  oauth(ctx: Context) {
    consola.log(ctx)
  }
}
