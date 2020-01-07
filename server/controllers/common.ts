import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import { UsersGetAuthenticatedResponse } from '@octokit/rest'
import { Context } from 'koa'
import uuid from 'uuid'

const STR_ENV_KEYS = ['GITHUB_CLIENT_ID', 'GITHUB_OAUTH_CALLBACK']

const STR_ARR_ENV_KEYS: string[] = []

const ENV_KEYS = [...STR_ENV_KEYS, ...STR_ARR_ENV_KEYS]

@Controller
export class CommonController {
  @RequestMapping('/fetchInfo')
  fetchInfo(ctx: Context) {
    const user: UsersGetAuthenticatedResponse = ctx.session.user

    let sessionID

    if (!user) {
      sessionID = uuid()
      ctx.session.uuid = sessionID
    }

    ctx.body = {
      user: user || {
        uuid: sessionID,
      },
      envs: ENV_KEYS.reduce((envs, key) => {
        let value: string | string[] = process.env[key]

        if (STR_ARR_ENV_KEYS.includes(key)) {
          value = value ? value.split(',') : []
        }

        return Object.assign(envs, {
          [key]: value,
        })
      }, {}),
    }
  }
}
