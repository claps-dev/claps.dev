import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import axios from 'axios'
import { Context } from 'koa'

import { User } from '../entities'
import { createOctokit } from '../utils'

@Controller
export class GitHubController {
  @RequestMapping('/oauth')
  async oauth(ctx: Context) {
    const { code, path, state } = ctx.query

    if (!state || state !== ctx.session.uid) {
      Object.assign(ctx.session, {
        gitHubToken: null,
        user: null,
      })
      return ctx.throw(400, 'invalid oauth redirect')
    }

    const {
      data: { access_token: gitHubToken, error, error_description },
    } = await axios.post<{
      access_token?: string
      error?: string
      error_description?: string
    }>(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        state,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      },
    )

    if (error) {
      return ctx.throw(400, error_description, error)
    }

    const { data: user } = await createOctokit(
      gitHubToken,
    ).users.getAuthenticated()

    const userRepo = ctx.conn.getRepository(User)

    const userInDb = await userRepo.findOne({ id: user.id })

    if (!userInDb) {
      userRepo.save({
        id: user.id,
        name: user.login,
        displayName: user.name,
        email: user.email,
        avatarUrl: user.avatar_url,
      })
    }

    Object.assign(ctx.session, {
      gitHubToken,
      user,
    })

    ctx.redirect(`${path.replace(/ /g, '%2B')}`)
  }
}
