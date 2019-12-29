import axios, { AxiosInstance } from 'axios'
import { Plugin } from '@nuxt/types'

import { SET_COOKIE, parseSetCookies, KOA_SESS_SIG } from '@/utils'

axios.defaults.baseURL = SERVER_PREFIX + 'api'

const setCookieInterceptor = (
  http: AxiosInstance,
  ctx: import('koa').Context,
) =>
  http.interceptors.response.use(
    response => {
      parseSetCookies(response.headers[SET_COOKIE]).forEach(
        ({ name, expires, httponly: httpOnly, path, value }) => {
          if (name !== KOA_SESS_SIG) {
            ctx.cookies.set(name, value, {
              expires: expires && new Date(expires),
              httpOnly,
              path,
            })
          }
        },
      )
      return response
    },
    ({ response }) => {
      ctx.set(response.headers)
      ctx.throw(response)
    },
  )

const httpPlugin: Plugin = (
  { app, req = { ctx: {} as import('koa').Context } },
  inject,
) => {
  const http = axios.create({
    headers: req.ctx.headers,
  })
  inject('http', (app.http = http))
  if (__SERVER__) {
    setCookieInterceptor(http, req.ctx)
  }
}

export default httpPlugin
