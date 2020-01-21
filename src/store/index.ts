import { Plugin } from '@nuxt/types'
import Vue from 'vue'
import Vuex, { MutationTree, ActionTree } from 'vuex'
import { Asset } from 'mixin-node-sdk'

import { AuthInfo, Project, RootState } from '@/types'

Vue.use(Vuex)

const state = (): RootState => ({
  assets: [],
  envs: {},
  loading: false,
  projects: {},
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
  async fetchAssets({ commit, rootState }) {
    if (rootState.assets.length > 0) {
      return
    }
    const { data } = await rootState.http.get<Asset[]>('/mixin/assets')
    commit(
      'SET_ASSETS',
      data.reduce<Asset[]>((acc, asset) => {
        const index = ASSETS.indexOf(asset.symbol)
        if (index !== -1) {
          acc[index] = asset
        }
        return acc
      }, []),
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
  SET_ASSETS(state, assets: Asset[]) {
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
