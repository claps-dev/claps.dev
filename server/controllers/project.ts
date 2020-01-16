import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import { Context } from 'koa'
import { Like } from 'typeorm'

import { Project, Member } from '../entities'
import { octokit } from '../utils'

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
    const project = await ctx.conn.getRepository(Project).findOne({
      relations: ['repositories', 'members'],
      where: {
        name: ctx.params.name,
      },
    })

    if (!project) {
      return ctx.throw(404)
    }

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
    const project = await ctx.conn
      .getRepository(Project)
      .findOne({ name: ctx.params.name })
    const members = await ctx.conn
      .getRepository(Member)
      .find({ where: { projectId: project.id } })
    await Promise.all(members.map(member => member.user))
    ctx.body = members
  }
}
