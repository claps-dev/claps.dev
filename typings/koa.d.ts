import { Connection } from 'typeorm'

declare module 'koa' {
  interface Context {
    conn?: Connection
  }
}
