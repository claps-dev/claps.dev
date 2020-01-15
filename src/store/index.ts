import { Plugin } from '@nuxt/types'
import Vue from 'vue'
import Vuex, { MutationTree, ActionTree } from 'vuex'

import { AuthInfo, RootState } from '@/types'

Vue.use(Vuex)

const state = (): RootState => ({
  envs: {},
})

const actions: ActionTree<RootState, RootState> = {
  async fetchAuthInfo({ commit, rootState }) {
    if (rootState.user) {
      return
    }
    const { data } = await rootState.http.get<AuthInfo>('/authInfo')
    commit('SET_AUTH_INFO', data)
  },
}

const mutations: MutationTree<RootState> = {
  SET_HTTP(state, http) {
    state.http = http
  },
  SET_AUTH_INFO(state, authInfo) {
    Object.assign(state, authInfo)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
}

const store = new Vuex.Store({
  state,
  actions,
  mutations,
})

const storePlugin: Plugin = ({ app }) => {
  app.store = store
}

export default storePlugin
