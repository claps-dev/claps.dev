import { createTokenAuth } from '@octokit/auth-token'
import { Octokit } from '@octokit/rest'
import { Mixin } from 'mixin-node-sdk'

export const MIXIN_API_HOST = 'https://mixin-api.zeromesh.net/'

export const MIXIN_OAUTH_HOST = 'https://mixin.one/'

export const FOX_ONE_API_HOST = 'https://api1.kumiclub.com/api/v2/'

export const FOX_OAUTH_HOST = 'https://oauth2.kumiclub.com/'

export const octokit = new Octokit({
  authStrategy: () => createTokenAuth(process.env.GITHUB_CLIENT_TOKEN),
})

export const mixin = new Mixin(
  Object.assign(JSON.parse(process.env.MIXIN_CLIENT_CONFIG), {
    client_secret: process.env.MIXIN_CLIENT_SECRET,
  }),
)
