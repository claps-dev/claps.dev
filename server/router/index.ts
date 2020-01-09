import { proxy } from '@rxts/koa-proxy'
import { injectAllRoutes } from '@rxts/koa-router-decorators'
import consola from 'consola'
import Koa, { DefaultState, Middleware } from 'koa'
import bodyParser from 'koa-bodyparser'
import compose from 'koa-compose'
import Router from 'koa-router'

import '../controllers'
import { session } from '../session'
import { serverHost, serverPort } from '../../build/config'
import { MIXIN_API_HOST } from '../utils'

const router = new Router<DefaultState, Koa.Context>({
  prefix: '/api',
})

injectAllRoutes(router)

export const startRouter = (app?: Koa) => {
  const provided = !!app

  const middlewares: Middleware[] = [
    bodyParser(),
    router.routes(),
    router.allowedMethods(),
    proxy({
      changeOrigin: true,
      target: MIXIN_API_HOST,
      secure: true,
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
