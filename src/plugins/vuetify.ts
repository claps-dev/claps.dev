import vuetifyOptions from '@@/vuetify.options'
import { Plugin } from '@nuxt/types'
import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

const vuetifyPlugin: Plugin = ({ app }) => {
  app.vuetify = new Vuetify(vuetifyOptions)
}

export default vuetifyPlugin
