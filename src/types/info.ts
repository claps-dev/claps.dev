import { UsersGetAuthenticatedResponse } from '@octokit/rest'

import { Env } from './env'

export interface BasicInfo {
  envs: Env
  user?: UsersGetAuthenticatedResponse
  randomUid?: string
}
