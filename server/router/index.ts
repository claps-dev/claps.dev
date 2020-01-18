import { proxy } from '@rxts/koa-proxy'
import { injectAllRoutes } from '@rxts/koa-router-decorators'
import consola from 'consola'
import Koa, { DefaultState, Middleware } from 'koa'
import bodyParser from 'koa-bodyparser'
import compose from 'koa-compose'
import Router from 'koa-router'
import { createConnection } from 'typeorm'

import { serverHost, serverPort } from '../../build/config'
import '../controllers'
import { Project, Repository, User, Member } from '../entities'
import { session } from '../session'
import { MIXIN_API_HOST } from '../utils'

export const startRouter = async (app?: Koa) => {
  const router = new Router<DefaultState, Koa.Context>({
    prefix: '/api',
  })

  injectAllRoutes(router)

  const provided = !!app

  const conn = await createConnection({
    type: 'mysql',
    ...JSON.parse(process.env.DATABASE_CONFIG),
    entities: [Member, Project, Repository, User],
  })

  const middlewares: Middleware[] = [
    (ctx, next) => {
      ctx.conn = conn
      const { gitHubToken } = ctx.session
      if (gitHubToken) {
        process.env.GITHUB_CLIENT_TOKEN = gitHubToken
      }
      return next()
    },
    bodyParser(),
    router.routes(),
    router.allowedMethods(),
    proxy({
      changeOrigin: true,
      target: MIXIN_API_HOST,
      secure: true,
      override: ctx => {
        const { mixinToken } = ctx.session
        if (!mixinToken) {
          return
        }
        ctx.req.url = ctx.req.url.replace(/^\/api/, '')
        return {
          headers: {
            Authorization: `Bearer ${mixinToken}`,
          },
        }
      },
    }),
  ]

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
