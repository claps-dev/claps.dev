import axios from 'axios'
import { Plugin } from '@nuxt/types'

axios.defaults.baseURL = `https://${
  process.env.NODE_ENV === 'development' ? 'dev' : 'api'
}.fox.one/api/v2`

const httpPlugin: Plugin = (_, inject) => inject('http', axios.create({}))

export default httpPlugin
