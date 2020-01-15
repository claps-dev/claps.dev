import { UsersGetAuthenticatedResponse } from '@octokit/rest'

import { Env } from './env'

export interface AuthInfo {
  envs: Env
  user?: UsersGetAuthenticatedResponse
  randomUid?: string
}
