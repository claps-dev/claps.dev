import { Plugin } from '@nuxt/types'
import Vue from 'vue'
import Router from 'vue-router'

Object.defineProperty(Vue.prototype, '$prevRoutePath', {
  configurable: __DEV__,
  get(this: { $router: Router }) {
    const { previousRoute } = this.$router
    return previousRoute ? previousRoute.fullPath : '/'
  },
})

const routerPlugin: Plugin = ({ app: { router } }) => {
  router.afterEach((_to, from) => {
    router.previousRoute = from
  })
}

export default routerPlugin
