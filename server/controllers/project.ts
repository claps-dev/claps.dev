import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import { Context } from 'koa'
import { Like } from 'typeorm'

import { Project } from '../entities'
import { octokit, mixinBot } from '../utils'

@Controller
@RequestMapping('/projects')
export class ProjectController {
  @RequestMapping()
  async projects(ctx: Context) {
    const { keyword } = ctx.query
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
    const project = await ctx.conn.getRepository(Project).findOneOrFail({
      relations: ['repositories', 'members'],
      where: {
        name: ctx.params.name,
      },
    })

    await Promise.all(
      project.repositories
        .map(async repository => {
          const [owner, repo] = repository.slug.split('/')
          const { data } = await octokit.repos.get({
            owner,
            repo,
          })
          Object.assign(repository, {
            stars: data.stargazers_count,
            updatedAt: data.updated_at,
          })
        })
        // @ts-ignore
        .concat(project.members.map(member => member.user)),
    )

    ctx.body = project
  }

  @RequestMapping('/:name/members')
  async members(ctx: Context) {
    const { members } = await ctx.conn.getRepository(Project).findOne({
      relations: ['members'],
      where: { name: ctx.params.name },
    })
    await Promise.all(members.map(member => member.user))
    ctx.body = members
  }

  @RequestMapping('/:name/assets/:assetId')
  async asset(ctx: Context) {
    const { assetId, name } = ctx.params
    const project = await ctx.conn.getRepository(Project).findOne({ name })
    const bot = await project.bot
    ctx.body = Object.assign(
      await mixinBot(bot).query_assets({
        asset_id: assetId,
      }),
      {
        user_id: bot.id,
      },
    )
  }
}
