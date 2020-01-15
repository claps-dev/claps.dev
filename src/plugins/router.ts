import { Plugin } from '@nuxt/types'
import { flatMap, get } from 'lodash'
import Vue from 'vue'
import Router from 'vue-router'

import { normalizeUrl, GITHUB_OAUTH_URL } from '@/utils'

Object.defineProperty(Vue.prototype, '$prevRoutePath', {
  configurable: __DEV__,
  get(this: { $router: Router }) {
    const { previousRoute } = this.$router
    return previousRoute ? previousRoute.fullPath : '/'
  },
})

const routerPlugin: Plugin = async ({
  app: { router, http, store },
  redirect,
}) => {
  store.commit('SET_HTTP', http)
  await store.dispatch('fetchAuthInfo')
  router.beforeEach((to, _from, next) => {
    const { matched } = to
    const metaList: Array<Record<string, unknown>> = flatMap(
      matched,
      ({ components }) =>
        get(components.default || components, ['options', 'meta']),
    ).filter(Boolean)
    if (!metaList.some(meta => meta.auth) || store.state.user) {
      return next()
    }
    const replace = __SERVER__
      ? redirect
      : (url: string) => {
          store.commit('SET_LOADING', true)
          next(false)
          location.replace(url)
        }
    replace(
      normalizeUrl(GITHUB_OAUTH_URL, {
        client_id: store.state.envs.GITHUB_CLIENT_ID,
        state: store.state.randomUid,
        redirect_uri: `${store.state.envs.GITHUB_OAUTH_CALLBACK}?path=${to.fullPath}`,
      }),
    )
  })
  router.afterEach((_to, from) => {
    router.previousRoute = from
  })
}

export default routerPlugin
