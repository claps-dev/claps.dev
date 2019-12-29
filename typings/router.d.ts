import { Route } from 'vue-router/types/router'

declare module 'vue-router/types/router' {
  export interface VueRouter {
    previousRoute?: Route
  }
}
