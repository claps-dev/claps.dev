import Koa from 'koa'
import koaSession from 'koa-session'

export const session = (app: Koa) => {
  app.keys = (process.env.APP_KEYS || '').split(',')
  return koaSession({}, app)
}
