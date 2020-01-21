import { UsersListEmailsResponse } from '@octokit/rest'
import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import { Context } from 'koa'

import { LoginRequired } from '../decorators'
import { octokit } from '../utils'
import { Project, Member } from '../entities'

@Controller
@RequestMapping('/user')
export class UserController {
  @LoginRequired
  @RequestMapping('/profile')
  async profile(ctx: Context) {
    let emails: UsersListEmailsResponse
    try {
      const { data } = await octokit.users.listEmails()
      emails = data
    } catch {
      emails = [
        {
          email: ctx.session.user.email,
          primary: true,
          verified: true,
          visibility: '',
        },
      ]
    }
    ctx.body = {
      emails,
      projects: await ctx.conn.getRepository(Project).findByIds(
        (
          await ctx.conn.getRepository(Member).find({
            select: ['projectId'],
            where: { userId: ctx.session.user.id },
          })
        ).map(({ projectId }) => projectId),
      ),
    }
  }
}
