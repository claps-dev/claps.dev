import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import { Context } from 'koa'
import { BigNumber, bignumber, multiply } from 'mathjs'
import { Asset } from 'mixin-node-sdk'
import { Like } from 'typeorm'

import { Project, Transaction } from '../entities'
import { getAssets, getConn } from '../utils'

import { createOctokit } from './../utils/helpers'

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
      this.getPatrons(),
    ])
    await Promise.all(
      projects.map(p =>
        this.getTotal(p).then(total => {
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
      this.getPatrons(project.id),
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
    project.total = await this.getTotal(project)

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

  async getTotal(project: Project) {
    const assets = await getAssets()
    const assetsMap = new Map<string, Asset>()
    assets.forEach(asset => {
      assetsMap.set(asset.asset_id, asset)
    })
    let total = bignumber(0)
    project.wallets.forEach(w => {
      const asset = assetsMap.get(w.assetId)
      total = total.add(
        multiply(bignumber(asset.price_usd), w.total) as BigNumber,
      )
    })
    delete project.wallets
    return total.toNumber()
  }

  getPatrons(): Promise<Record<string, number>>
  getPatrons(projectId: number): Promise<number>
  async getPatrons(projectId?: number) {
    const conn = await getConn()
    const counts: Array<{
      projectId: string
      count: string
    }> = await conn
      .getRepository(Transaction)
      .createQueryBuilder()
      .select('project_id', 'projectId')
      .select('COUNT(DISTINCT(`sender`))', 'count')
      .where(
        projectId && {
          projectId,
        },
      )
      .getRawMany()
    return typeof projectId === 'number'
      ? Number(counts[0].count)
      : counts.reduce(
          (acc, { projectId, count }) =>
            Object.assign(acc, {
              [projectId]: Number(count),
            }),
          {} as Record<string, number>,
        )
  }
}
