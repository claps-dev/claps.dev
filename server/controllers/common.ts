import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import { Context } from 'koa'
import uuid from 'uuid'

import { sha256 } from '../utils'

const STR_ENV_KEYS = [
  'GITHUB_CLIENT_ID',
  'GITHUB_OAUTH_CALLBACK',
  'MIXIN_CLIENT_ID',
]

const STR_ARR_ENV_KEYS: string[] = []

const ENV_KEYS = [...STR_ENV_KEYS, ...STR_ARR_ENV_KEYS]

@Controller
export class CommonController {
  @RequestMapping('/fetchInfo')
  fetchInfo(ctx: Context) {
    const { user, mixinToken } = ctx.session

    let randomUid: string

    if (!user || !mixinToken) {
      randomUid = ctx.session.uuid = uuid()
    }

    let codeChallenge: string

    if (!mixinToken) {
      codeChallenge = sha256(randomUid)
    }

    ctx.body = {
      user,
      codeChallenge,
      randomUid,
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
