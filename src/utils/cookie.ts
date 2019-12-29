import { SetCookie } from '@/types'

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
