import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import { Context } from 'koa'
import { Like } from 'typeorm'

import { Project, Transaction } from '../entities'
import { createOctokit, getPatrons, getTotal } from '../utils'

@Controller
@RequestMapping('/projects')
export class ProjectController {
  @RequestMapping()
  async projects(ctx: Context) {
    const { keyword } = ctx.query
    const [projects, patrons] = await Promise.all([
      ctx.conn.getRepository(Project).find({
        relations: ['wallets'],
        where: keyword && {
          name: Like(`%${keyword}%`),
        },
      }),
      getPatrons(),
    ])
    await Promise.all(
      projects.map(p =>
        getTotal(p).then(total => {
          p.patrons = patrons[p.id] || 0
          p.total = total
        }),
      ),
    )
    ctx.body = {
      items: projects,
    }
  }

  @RequestMapping('/:name')
  async project(ctx: Context) {
    const project = await ctx.conn.getRepository(Project).findOneOrFail({
      relations: ['repositories', 'members', 'wallets'],
      where: {
        name: ctx.params.name,
      },
    })

    const [patrons] = await Promise.all<any>([
      getPatrons(project.id),
      project.bots.then(bots => {
        delete project.__bots__
        project.botIds = bots.map(({ id }) => id)
      }),
      ...project.repositories.map(async repository => {
        const [owner, repo] = repository.slug.split('/')
        const { data } = await createOctokit(ctx.session.gitHubToken).repos.get(
          {
            owner,
            repo,
          },
        )
        Object.assign(repository, {
          stars: data.stargazers_count,
          updatedAt: data.updated_at,
        })
      }),
      ...project.members.map(member => member.user),
    ])

    project.patrons = patrons
    project.total = await getTotal(project)

    ctx.body = project
  }

  @RequestMapping('/:name/members')
  async members(ctx: Context) {
    const { members } = await ctx.conn.getRepository(Project).findOne({
      relations: ['members'],
      where: {
        name: ctx.params.name,
      },
    })
    await Promise.all(members.map(member => member.user))
    ctx.body = members
  }

  @RequestMapping('/:name/transactions')
  async transactions(ctx: Context) {
    const project = await ctx.conn.getRepository(Project).findOne({
      where: {
        name: ctx.params.name,
      },
    })

    ctx.body = await ctx.conn.getRepository(Transaction).find({
      where: {
        projectId: project.id,
        assetId: ctx.query.assetId,
      },
    })
  }
}
