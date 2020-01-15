import { stringify, IStringifyOptions } from 'qs'
import { flatMap } from 'lodash'

import { DEFAULT_AUTH_SCOPES } from './constants'

export const encodeUrl = encodeURIComponent

export const normalizeUrl = (
  url: string,
  query?: {},
  options?: IStringifyOptions,
) =>
  url +
  (query ? (url.includes('?') ? '&' : '?') + stringify(query, options) : '')

const genScope = (scope: string, writable?: boolean) =>
  [scope, writable ? 'WRITE' : 'READ'].join(':')

export const authScopes = (scopes = DEFAULT_AUTH_SCOPES, writable?: boolean) =>
  flatMap(scopes, scope =>
    [genScope(scope)].concat(writable ? genScope(scope, true) : []),
  )
