import axios from 'axios'
import consola from 'consola'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import compose from 'koa-compose'
import Router from 'koa-router'
import uuid from 'uuid'

import { session } from '../session'
import { serverHost, serverPort } from '../../build/config'

import { User } from '@/types'

const router = new Router<unknown, Koa.Context>({
  prefix: '/api',
})

const STR_ENV_KEYS = ['GITHUB_CLIENT_ID', 'GITHUB_OAUTH_CALLBACK']

const STR_ARR_ENV_KEYS: string[] = []

const ENV_KEYS = [...STR_ENV_KEYS, ...STR_ARR_ENV_KEYS]

router
  .get('/fetchInfo', ctx => {
    const { user } = ctx.session
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
  })
  .get('/oauth', async ctx => {
    const { code, path, state } = ctx.query

    if (!state || state !== ctx.session.uuid) {
      return ctx.throw('invalid oauth redirect')
    }

    const { data } = await axios.post(
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

    if (data.error) {
      return ctx.throw(data)
    }

    const token = data.access_token
    const user = {} as User

    ctx.session.token = token
    ctx.session.user = user

    ctx.redirect(`${path.replace(/ /g, '%2B')}`)
  })

export default (app?: Koa) => {
  const provided = !!app

  const middlewares = [bodyParser(), router.routes(), router.allowedMethods()]

  if (!app) {
    app = new Koa()
    middlewares.unshift(session(app))
  }

  if (provided) {
    return middlewares
  }

  app.use(compose(middlewares))

  app.listen(serverPort + 1, serverHost, () =>
    consola.ready(
      'Router server is now running at %s:%s',
      serverHost,
      serverPort + 1,
    ),
  )
}
