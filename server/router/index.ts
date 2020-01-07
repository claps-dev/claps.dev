import { injectAllRoutes } from '@rxts/koa-router-decorators'
import consola from 'consola'
import Koa, { DefaultState } from 'koa'
import bodyParser from 'koa-bodyparser'
import compose from 'koa-compose'
import Router from 'koa-router'

import '../controllers'
import { session } from '../session'
import { serverHost, serverPort } from '../../build/config'

const router = new Router<DefaultState, Koa.Context>({
  prefix: '/api',
})

injectAllRoutes(router)

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
