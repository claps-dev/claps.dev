import { AxiosInstance } from 'axios'
import { Asset } from 'mixin-node-sdk'

import { AuthInfo } from './info'

import { Project } from '@@/server/entities'

export interface RootState extends AuthInfo {
  assets: Asset[]
  http?: AxiosInstance
  loading: boolean
  projects: Record<string, Project>
}
