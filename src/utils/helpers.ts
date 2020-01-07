import { stringify, IStringifyOptions } from 'qs'

export const encodeUrl = encodeURIComponent

export const normalizeUrl = (
  url: string,
  query?: {},
  options?: IStringifyOptions,
) =>
  url +
  (query ? (url.includes('?') ? '&' : '?') + stringify(query, options) : '')
