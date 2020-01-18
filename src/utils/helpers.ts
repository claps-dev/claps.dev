import {
  differenceInMonths,
  formatDistanceToNow as _formatDistanceToNow,
} from 'date-fns'
import { stringify, IStringifyOptions } from 'qs'
import { flatMap, memoize } from 'lodash'

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
  ).join(' ')

export const perMonth = memoize(
  (total: number, createdAt: string) =>
    (total / differenceInMonths(Date.now(), new Date(createdAt))).toFixed(2),
  (total: number, createdAt: string) => [total, createdAt].join('$'),
)

export const formatDistanceToNow = (date: string | Date | number) =>
  _formatDistanceToNow(typeof date === 'string' ? new Date(date) : date)
