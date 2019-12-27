declare module '@1stg/postcss-config' {
  const postcssConfig: () => PostcssConfiguration
  export = postcssConfig
}

declare module 'vue/types/vue' {
  import { AxiosInstance } from 'axios'

  interface Vue {
    $http: AxiosInstance
  }
}
