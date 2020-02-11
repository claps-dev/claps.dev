import Koa from 'koa'
import koaSession from 'koa-session'

import { Session } from './types'
import { octokitMap } from './utils'

export const session = (app: Koa) => {
  app.keys = (process.env.APP_KEYS || '').split(',')
  app.on('session:expired', (key: string, value: unknown) => {
    if (key !== 'user') {
      return
    }
    const user = value as Session['user']
    octokitMap.delete(user.id)
  })
  return koaSession({}, app)
}
