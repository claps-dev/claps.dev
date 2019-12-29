import Koa from 'koa'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'

import config from '../nuxt.config'

const app = new Koa()

config.dev = app.env !== 'production'

const HOST = '0.0.0.0'
const PORT = 3000

async function start() {
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || HOST,
    port = process.env.PORT || PORT,
  } = nuxt.options.server

  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use(ctx => {
    ctx.status = 200
    ctx.respond = false
    // ctx.req.ctx = ctx
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port as number, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  })
}

start()
