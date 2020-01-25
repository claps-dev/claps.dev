export interface SetCookie {
  name: string
  value: string
  path?: string
  expires?: string
  httponly?: boolean
}

export type Asset = import('mixin-node-sdk').Asset

export type Transaction = import('mixin-node-sdk').Transaction

export type Project = import('@@/server/entities').Project
