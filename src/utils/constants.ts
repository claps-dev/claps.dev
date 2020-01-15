import { SelectItem, DonationDistribution } from '@/types'

export const INFINITY_DATE = 'Fri, 31 Dec 9999 23:59:59 GMT'

export const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'

export const MIXIN_OAUTH_URL = 'https://mixin.one/oauth/authorize'

export const FOXONE_OAUTH_URL = 'https://oauth2.kumiclub.com'

export const SET_COOKIE = 'set-cookie'

export const KOA_SESS_SIG = 'koa:sess.sig'

export const DEFAULT_AUTH_SCOPES = ['PHONE', 'PROFILE', 'ASSETS', 'SNAPSHOTS']

export const DONATION_DISTRIBUTIONS: SelectItem[] = [
  {
    title: 'By Persper’s Algorithm',
    description:
      'The algorithm of Persper use code analytics to calculate each developer’s contribution.',
    value: DonationDistribution.PersperAlgorithm,
  },
  {
    title: 'By Commits',
    description: 'More commits, more contributions',
    value: DonationDistribution.Commits,
  },
  {
    title: 'By Changed Lines',
    description: 'More modifications, more contributions',
    value: DonationDistribution.ChangedLines,
  },
  {
    title: 'Identical Amount',
    description: 'All members in this project get the same money',
    value: DonationDistribution.IdenticalAmount,
  },
]
