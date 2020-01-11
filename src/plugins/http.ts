import axios, { AxiosInstance } from 'axios'
import { Plugin } from '@nuxt/types'

import { setCookieInterceptor } from '@/utils'

axios.defaults.baseURL = SERVER_PREFIX + 'api'

const httpPlugin: Plugin = ({ app, req }, inject) => {
  let http: AxiosInstance = axios

  if (__SERVER__) {
    http = axios.create({
      headers: req.ctx.headers,
    })
    setCookieInterceptor(http, req.ctx)
  }

  inject('http', (app.http = http))
}

export default httpPlugin
