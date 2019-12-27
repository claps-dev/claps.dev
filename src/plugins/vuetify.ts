import { Plugin } from '@nuxt/types'
import Vue from 'vue'
import Vuetify from 'vuetify'

import vuetifyOptions from '@@/vuetify.options'

Vue.use(Vuetify)

const vuetifyPlugin: Plugin = ({ app }) => {
  app.vuetify = new Vuetify(vuetifyOptions)
}

export default vuetifyPlugin
