declare module '@1stg/postcss-config' {
  const postcssConfig: () => PostcssConfiguration
  export = postcssConfig
}

declare module 'http' {
  import { Context } from 'koa'

  interface IncomingMessage {
    ctx?: Context
  }
}

declare module 'vue/types/vue' {
  import { AxiosInstance } from 'axios'

  interface Vue {
    $http: AxiosInstance
  }
}
