import { Env } from './env'
import { User } from './schema'

export interface BasicInfo {
  envs: Env
  user: User
}
