import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import { Context } from 'koa'
import { Like } from 'typeorm'

import { Project } from '../entities'

@Controller
@RequestMapping('/projects')
export class ProjectController {
  @RequestMapping()
  async projects(ctx: Context) {
    const { keyword } = ctx.query
    console.log(keyword)
    ctx.body = {
      items: await ctx.conn.getRepository(Project).find({
        where: keyword && {
          name: Like(`%${keyword}%`),
        },
      }),
    }
  }

  @RequestMapping('/:name')
  async project(ctx: Context) {
    ctx.body = await ctx.conn.getRepository(Project).findOne({
      where: {
        name: ctx.params.name,
      },
    })
  }
}
