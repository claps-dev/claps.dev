import consola from 'consola'
import Koa, { Context } from 'koa'
import proxy from 'koa-better-http-proxy'
import compose from 'koa-compose'
import compress from 'koa-compress'
import logger from 'koa-logger'
import session from 'koa-session'
import { Nuxt, Builder } from 'nuxt'

import config from '../nuxt.config'
import { serverHost, serverPort } from '../build/config'

import startRouter from './router'

const app = new Koa()

app.keys = (process.env.APP_KEYS || '').split(',')

config.dev = app.env !== 'production'

async function start() {
  const nuxt = new Nuxt(config)

  const sessionMiddleware = session({}, app)

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

  if (config.dev) {
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
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    middlewares.splice(1, 0, compress(), sessionMiddleware, ...startRouter(app))
    await nuxt.ready()
  }

  app.use(compose(middlewares))

  app.listen(serverPort, serverHost)

  consola.ready({
    message: `Server listening on http://${serverHost}:${serverPort}`,
    badge: true,
  })
}

start()
