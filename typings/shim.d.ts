declare module '@1stg/postcss-config' {
  const postcssConfig: () => PostcssConfiguration
  export = postcssConfig
}

declare module 'http' {
  import Koa from 'koa'

  interface IncomingMessage {
    ctx?: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>
  }
}

declare module 'vue/types/vue' {
  import { AxiosInstance } from 'axios'
  import * as utils from '@/utils'

  interface Vue {
    $http: AxiosInstance
    $utils: typeof utils
  }
}
