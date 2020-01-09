import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import Octokit from '@octokit/rest'
import axios from 'axios'
import { Context } from 'koa'

const octokit = new Octokit()

@Controller
export class GitHubController {
  @RequestMapping('/oauth')
  async oauth(ctx: Context) {
    const { code, path, state } = ctx.query

    if (!state || state !== ctx.session.uid) {
      ctx.session.user = null
      return ctx.throw('invalid oauth redirect')
    }

    const {
      data: { access_token: token, error, error_description },
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
      return ctx.throw(error, error_description)
    }

    const { data: user } = await octokit.users.getAuthenticated({
      headers: {
        authorization: `bearer ${token}`,
      },
    })

    Object.assign(ctx.session, {
      token,
      user,
    })

    ctx.redirect(`${path.replace(/ /g, '%2B')}`)
  }
}
