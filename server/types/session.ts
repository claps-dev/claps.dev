import { Octokit } from '@octokit/rest'
import { Session as _Session } from 'koa-session'

export interface Session extends _Session {
  user: Octokit.UsersGetAuthenticatedResponse
}
