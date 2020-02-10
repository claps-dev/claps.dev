import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import { Context } from 'koa'

import { Bot } from '../entities'
import { mixinBot } from '../utils'

@Controller
@RequestMapping('/bots')
export class BotController {
  @RequestMapping('/:botId/assets/:assetId')
  async asset(ctx: Context) {
    const bot = await ctx.conn.getRepository(Bot).findOneOrFail({
      where: {
        id: ctx.params.botId,
      },
    })
    ctx.body = await mixinBot(bot).query_assets({
      asset_id: ctx.params.assetId,
    })
  }
}
