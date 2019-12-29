import Octokit, { UsersGetAuthenticatedResponse } from '@octokit/rest'
import axios from 'axios'
import consola from 'consola'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import compose from 'koa-compose'
import Router from 'koa-router'
import uuid from 'uuid'

import { session } from '../session'
import { serverHost, serverPort } from '../../build/config'

const octokit = new Octokit()

const router = new Router<unknown, Koa.Context>({
  prefix: '/api',
})

const STR_ENV_KEYS = ['GITHUB_CLIENT_ID', 'GITHUB_OAUTH_CALLBACK']

const STR_ARR_ENV_KEYS: string[] = []

const ENV_KEYS = [...STR_ENV_KEYS, ...STR_ARR_ENV_KEYS]

router
  .get('/fetchInfo', ctx => {
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
  })
  .get('/oauth', async ctx => {
    const { code, path, state } = ctx.query

    if (!state || state !== ctx.session.uuid) {
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
  })

export const startRouter = (app?: Koa) => {
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
