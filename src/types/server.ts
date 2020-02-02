/* eslint-disable sonarjs/no-duplicate-string */
export interface SetCookie {
  name: string
  value: string
  path?: string
  expires?: string
  httponly?: boolean
}

export type Project = import('@@/server/entities').Project

export type MixinResponse<T> = import('mixin-node-sdk').MixinResponse<T>

export type Asset = import('mixin-node-sdk').Asset

export type Snapshot = import('mixin-node-sdk').Snapshot

export type Transaction = import('mixin-node-sdk').Transaction
