import { AxiosInstance } from 'axios'

import { SetCookie } from '@/types'

import { INFINITY_DATE, KOA_SESS_SIG, SET_COOKIE } from './constants'

export const getCookie = (name: string) =>
  decodeURIComponent(
    document.cookie.replace(
      new RegExp(
        '(?:(?:^|.*;)\\s*' +
          encodeURIComponent(name).replace(/[*+-.]/g, '\\$&') +
          '\\s*\\=\\s*([^;]*).*$)|^.*$',
      ),
      '$1',
    ),
  ) || null

export const setCookie = (
  name: string,
  value: string,
  end?: number | string | Date,
  path?: string,
  domain?: string,
  secure = false,
) => {
  if (!name || /^(?:expires|max-age|path|domain|secure)$/i.test(name)) {
    return false
  }
  let sExpires = ''
  if (end) {
    switch (end.constructor) {
      case Number:
        sExpires =
          end === Infinity
            ? `; expires=${INFINITY_DATE}`
            : '; max-age=' + (end as string)
        break
      case String:
        sExpires = '; expires=' + (end as string)
        break
      case Date:
        sExpires = '; expires=' + (end as Date).toUTCString()
        break
    }
  }
  document.cookie =
    encodeURIComponent(name) +
    '=' +
    encodeURIComponent(value == null ? '' : value) +
    sExpires +
    (domain ? '; domain=' + domain : '') +
    (path ? '; path=' + path : '') +
    (secure ? '; secure' : '')
  return true
}

export const parseSetCookies = (setCookies: string | string[]) => {
  if (!Array.isArray(setCookies)) {
    setCookies = [setCookies]
  }
  return setCookies.reduce<SetCookie[]>((acc, cookies) => {
    if (!cookies) {
      return acc
    }
    const [item, ...rests] = cookies.split(/; */)
    const cookie = item.split('=')
    const setCookieItem = {
      name: cookie[0],
      value: cookie[1],
    }
    rests.forEach(rest => {
      const [key, value] = rest.split('=')
      setCookieItem[key as keyof typeof setCookieItem] =
        value == null ? 'true' : value
    })
    acc.push(setCookieItem)
    return acc
  }, [])
}

export const setCookieInterceptor = (
  http: AxiosInstance,
  ctx: import('koa').Context,
) =>
  http.interceptors.response.use(
    response => {
      parseSetCookies(response.headers[SET_COOKIE]).forEach(
        ({ name, expires, httponly: httpOnly, path, value }) => {
          if (name !== KOA_SESS_SIG) {
            ctx.cookies.set(name, value, {
              expires: expires && new Date(expires),
              httpOnly,
              path,
            })
          }
        },
      )
      return response
    },
    ({ response, status }) => {
      ctx.set(response.headers)
      ctx.throw(status || response.status, response.data)
    },
  )
