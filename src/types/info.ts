import { Octokit } from '@octokit/rest'

import { Env } from './env'

export interface AuthInfo {
  envs: Env
  user?: Octokit.UsersGetAuthenticatedResponse
  randomUid?: string
}
