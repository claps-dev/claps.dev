import consola from 'consola'
import Koa, { Context } from 'koa'
import proxy from 'koa-better-http-proxy'
import compose from 'koa-compose'
import compress from 'koa-compress'
import logger from 'koa-logger'
import { Nuxt, Builder } from 'nuxt'

import config from '../nuxt.config'
import { __DEV__, serverHost, serverPort } from '../build/config'

import { session } from './session'
import { startRouter } from './router'

config.dev = __DEV__

const app = new Koa()
const nuxt = new Nuxt(config)

const sessionMiddleware = session(app)

const middlewares: Koa.Middleware[] = [
  logger(),
  (ctx, next) => {
    if (ctx.method !== 'GET' || ctx.url.startsWith('/api/')) {
      return next()
    }

    ctx.status = 200
    ctx.respond = false
    ctx.req.ctx = ctx as Context
    nuxt.render(ctx.req, ctx.res)
  },
]

async function start() {
  if (__DEV__) {
    middlewares.splice(
      1,
      0,
      sessionMiddleware,
      proxy(serverHost, {
        port: serverPort + 1,
        preserveReqSession: true,
        filter: ctx => ctx.url.startsWith('/api/'),
      }),
    )
    await new Builder(nuxt).build()
  } else {
    middlewares.splice(2, 0, compress(), sessionMiddleware, ...startRouter(app))
    await nuxt.ready()
  }

  app.use(compose(middlewares)).listen(serverPort, serverHost)

  consola.ready({
    message: `Server listening on http://${serverHost}:${serverPort}`,
    badge: true,
  })
}

start()
