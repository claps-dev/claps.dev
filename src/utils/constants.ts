import { Coin, SelectItem, DonationDistribution } from '@/types'

export const SET_COOKIE = 'set-cookie'

export const KOA_SESS_SIG = 'koa:sess.sig'

export const COINS: SelectItem[] = Object.entries(Coin).map(([key, value]) => ({
  title: key,
  description: value,
  value,
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  avatar: require(`@/assets/${key.toLowerCase()}.svg`),
}))

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
