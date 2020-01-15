import { AxiosInstance } from 'axios'

import { AuthInfo } from './info'

export interface RootState extends AuthInfo {
  http?: AxiosInstance
  loading?: boolean
}
