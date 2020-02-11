import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import { Context } from 'koa'

import { random } from '../utils'

const STR_ENV_KEYS = [
  'GITHUB_CLIENT_ID',
  'GITHUB_OAUTH_CALLBACK',
  'MIXIN_CLIENT_ID',
  'FOXONE_CLIENT_ID',
]

const STR_ARR_ENV_KEYS: string[] = []

const ENV_KEYS = [...STR_ENV_KEYS, ...STR_ARR_ENV_KEYS]

@Controller
export class CommonController {
  @RequestMapping('/authInfo')
  authInfo(ctx: Context) {
    const { user = null, mixinToken, foxoneToken } = ctx.session

    let randomUid: string = null

    if (!user || !mixinToken) {
      randomUid = ctx.session.uid = random(true)
    }

    ctx.body = {
      user,
      randomUid,
      mixinAuth: !!mixinToken,
      foxoneAuth: !!foxoneToken,
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
