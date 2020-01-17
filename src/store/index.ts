import { Plugin } from '@nuxt/types'
import Vue from 'vue'
import Vuex, { MutationTree, ActionTree } from 'vuex'
import { Asset } from 'mixin-node-sdk'

import { AuthInfo, RootState } from '@/types'

Vue.use(Vuex)

const state = (): RootState => ({
  assets: [],
  envs: {},
})

const ASSETS = ['BTC', 'BCH', 'ETH', 'EOS', 'XRP', 'XMR']

const actions: ActionTree<RootState, RootState> = {
  async fetchAuthInfo({ commit, rootState }) {
    if (rootState.user) {
      return
    }
    const { data } = await rootState.http.get<AuthInfo>('/authInfo')
    commit('SET_AUTH_INFO', data)
  },
  async fetchAssets({ commit, rootState }) {
    if (rootState.assets.length > 0) {
      return
    }
    const { data } = await rootState.http.get<Asset[]>('/mixin/assets')
    commit(
      'SET_ASSETS',
      ASSETS.map(asset => data.find(({ symbol }) => symbol === asset)).filter(
        Boolean,
      ),
    )
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
  SET_ASSETS(state, assets) {
    state.assets = assets
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
