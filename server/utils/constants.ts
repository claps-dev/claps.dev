import { Mixin } from 'mixin-node-sdk'
import fs from 'fs'

export const MIXIN_API_HOST = 'https://mixin-api.zeromesh.net/'

export const MIXIN_OAUTH_HOST = 'https://mixin.one/'

export const FOX_ONE_API_HOST = 'https://api1.kumiclub.com/api/v2/'

export const FOX_OAUTH_HOST = 'https://oauth2.kumiclub.com/'

const data = fs.readFileSync(process.env.MIXIN_CLIENT_CONFIG, {
  encoding: 'UTF-8',
})
export const mixin = new Mixin(
  Object.assign(JSON.parse(data), {
    client_secret: process.env.MIXIN_CLIENT_SECRET,
  }),
)
