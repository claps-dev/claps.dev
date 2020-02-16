import { Plugin } from '@nuxt/types'
import { AxiosInstance } from 'axios'
import { bignumber } from 'mathjs'
import { Asset } from 'mixin-node-sdk'
import Vue from 'vue'
import Vuex, { ActionTree, GetterTree, MutationTree } from 'vuex'

import { AuthInfo, Project, RootState } from '@/types'
import { filterAssets } from '@/utils'

Vue.use(Vuex)

const state = (): RootState => ({
  allAssets: [],
  assets: [],
  envs: {},
  loading: false,
  projects: {},
})

const getters: GetterTree<RootState, RootState> = {
  userPrices(state) {
    return state.assets.reduce(
      (acc, asset) => {
        const amount = state.userAssets?.[asset.asset_id] || 0
        return {
          btc: acc.btc.add(bignumber(amount).mul(asset.price_btc)),
          usd: acc.usd.add(bignumber(amount).mul(asset.price_usd)),
        }
      },
      {
        btc: bignumber(0),
        usd: bignumber(0),
      },
    )
  },
  assetItems(state) {
    return state.assets.map(({ symbol, name, icon_url, asset_id }) => ({
      title: symbol,
      description: name,
      avatar: icon_url,
      value: asset_id,
    }))
  },
}

const actions: ActionTree<RootState, RootState> = {
  async fetchAuthInfo({ commit, rootState }) {
    if (rootState.user) {
      return
    }
    const { data } = await rootState.http.get<AuthInfo>('/authInfo')
    commit('SET_AUTH_INFO', data)
  },
  async getProject({ commit, rootState }, projectName) {
    const originalProject = rootState.projects[projectName]
    if (originalProject) {
      return originalProject
    }
    const { data } = await rootState.http.get<Project>(
      `/projects/${projectName}`,
    )
    commit('SET_PROJECT', data)
    return data
  },
  async getAssets({ commit, rootState }) {
    if (rootState.assets.length > 0) {
      return
    }
    const { data } = await rootState.http.get<Asset[]>('/mixin/assets')
    commit('SET_ALL_ASSETS', data)
  },
  async getUserAssets({ commit, rootState }) {
    if (rootState.userAssets) {
      return
    }
    const { data } = await rootState.http.get<Asset[]>('/user/assets')
    commit('SET_USER_ASSETS', data)
  },
}

const mutations: MutationTree<RootState> = {
  SET_HTTP(state, http: AxiosInstance) {
    state.http = http
  },
  SET_AUTH_INFO(state, authInfo: AuthInfo) {
    Object.assign(state, authInfo)
  },
  SET_LOADING(state, loading: boolean) {
    state.loading = loading
  },
  SET_PROJECT(state, project: Project) {
    state.projects[project.name] = project
  },
  SET_PROJECTS(state, projects: Project[] | Record<string, Project>) {
    if (!Array.isArray(projects)) {
      Object.assign(state.projects, projects)
      return
    }

    projects.forEach(project =>
      Object.assign(state.projects, {
        [project.name]: project,
      }),
    )
  },
  SET_ALL_ASSETS(state, allAssets: Asset[]) {
    state.allAssets = allAssets
    state.assets = filterAssets(allAssets)
  },
  SET_USER_ASSETS(state, userAssets: Record<string, number>) {
    state.userAssets = userAssets
  },
}

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
})

const storePlugin: Plugin = ({ app }) => {
  app.store = store
}

export default storePlugin
