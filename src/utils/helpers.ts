import {
  differenceInMonths,
  formatDistanceToNow as _formatDistanceToNow,
} from 'date-fns'
import { flatMap, memoize } from 'lodash'
import { BigNumber } from 'mathjs'
import { IStringifyOptions, stringify } from 'qs'

import { Asset } from '@/types'

import { ASSETS, BASE_AUTH_SCOPES } from './constants'

export const encodeUrl = encodeURIComponent

export const normalizeUrl = (
  url: string,
  query?: {},
  options?: IStringifyOptions,
) =>
  url +
  (query ? (url.includes('?') ? '&' : '?') + stringify(query, options) : '')

const genScope = (scope: string, writable = false) =>
  [scope, writable ? 'WRITE' : 'READ'].join(':')

export const authScopes = (scopes = BASE_AUTH_SCOPES, writable = false) =>
  flatMap(scopes, scope =>
    [genScope(scope)].concat(writable ? genScope(scope, true) : []),
  ).join(' ')

export const perMonth = memoize(
  (total: number, createdAt: string) =>
    (total / (differenceInMonths(Date.now(), new Date(createdAt)) + 1)).toFixed(
      2,
    ),
  (total: number, createdAt: string) => [total, createdAt].join('$'),
)

export const formatDistanceToNow = (date: string | Date | number) =>
  _formatDistanceToNow(typeof date === 'string' ? new Date(date) : date)

export const unionDisplayName = (
  {
    name,
    displayName,
  }: {
    name: string
    displayName?: string
  },
  preferDisplayName = true,
) =>
  displayName
    ? preferDisplayName || displayName === name
      ? displayName
      : `${name} (${displayName})`
    : name

export const delay = (milliseconds?: number) =>
  new Promise<void>(resolve => setTimeout(resolve, milliseconds))

export const filterAssets = (assets: Asset[]) => {
  return assets.reduce<Asset[]>((acc, asset) => {
    const index = ASSETS.indexOf(asset.symbol)
    if (index !== -1) {
      acc[index] = asset
    }
    return acc
  }, [])
}

export const numToStr = (num: number | BigNumber) => {
  num = typeof num === 'number' ? num : num.toNumber()
  if (num === 0) {
    return '0'
  }
  return num
    .toLocaleString('fullwide', {
      minimumFractionDigits: 20,
      useGrouping: false,
    })
    .replace(/([^0.])\.?0+$/, '$1')
}
