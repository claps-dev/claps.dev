import { createTokenAuth } from '@octokit/auth-token'
import { Octokit } from '@octokit/rest'
import { BinaryLike, createHash, randomBytes } from 'crypto'
import { BigNumber, bignumber, multiply } from 'mathjs'
import { Asset } from 'mixin-node-sdk'
import { Connection, createConnection } from 'typeorm'

import { filterAssets } from '@/utils'

import * as entities from '../entities'
import { Project, Transaction } from '../entities'

import { mixin } from './constants'

export const base64 = (data: string | Buffer, uriEncode = false) => {
  let result = (typeof data === 'string' ? Buffer.from(data) : data).toString(
    'base64',
  )
  if (uriEncode) {
    result = result
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }
  return result
}

export const random = (uriEncode = false) => base64(randomBytes(32), uriEncode)

export type HexBase64Latin1Encoding = 'latin1' | 'hex' | 'base64'

export function sha256(buffer: BinaryLike): Buffer
export function sha256(
  buffer: BinaryLike,
  encoding: HexBase64Latin1Encoding,
): string
export function sha256(
  buffer: BinaryLike,
  encoding?: HexBase64Latin1Encoding,
): Buffer | string {
  return createHash('sha256')
    .update(buffer)
    .digest(encoding)
}

export const randomPin = (length = 6) => {
  let pin = ''
  for (let i = 0; i < length; i++) {
    pin += Math.floor(Math.random() * 10)
  }
  return pin
}

export const createOctokit = (token = process.env.GITHUB_CLIENT_TOKEN) =>
  new Octokit({
    authStrategy: () => createTokenAuth(token),
  })

let conn: Connection

export const getConn = async () =>
  conn ||
  (conn = await createConnection({
    type: 'mysql',
    ...JSON.parse(process.env.DATABASE_CONFIG),
    entities: Object.values(entities),
  }))

export const getAssets = (() => {
  let assets: Asset[]
  let lastCheck: number
  return async () => {
    const now = Date.now()
    if (assets && lastCheck && now - lastCheck < 30 * 1000) {
      return assets
    }
    lastCheck = now
    return (assets = filterAssets(await mixin.query_assets({})))
  }
})()

export const formatRFC3339Nano = (
  timestamp: number | Date = Date.now() * 1e6,
): string => {
  if (timestamp instanceof Date) {
    timestamp = timestamp.getTime() * 1e6
  }

  const nsReg = /(\d*)(\d{9})/
  const ts = String(timestamp).replace(nsReg, '$1')
  const ns = String(timestamp).replace(nsReg, '$2')

  if (
    !timestamp ||
    timestamp < 999999999 ||
    isNaN(parseInt(ts)) ||
    isNaN(parseInt(ns))
  ) {
    return null
  }

  return new Date(parseInt(ts + '000')).toISOString().replace('.000', `.${ns}`)
}

export const getTotal = async (project: Project) => {
  const assets = await getAssets()
  const assetsMap = new Map<string, Asset>()
  assets.forEach(asset => {
    assetsMap.set(asset.asset_id, asset)
  })
  let total = bignumber(0)
  project.wallets.forEach(w => {
    const asset = assetsMap.get(w.assetId)
    total = total.add(
      multiply(bignumber(asset.price_usd), w.total) as BigNumber,
    )
  })
  delete project.wallets
  return total.toNumber()
}

export function getPatrons(): Promise<Record<string, number>>
export function getPatrons(projectId: number): Promise<number>
export async function getPatrons(projectId?: number) {
  const conn = await getConn()
  const counts: Array<{
    projectId: string
    count: string
  }> = await conn
    .getRepository(Transaction)
    .createQueryBuilder()
    .select('project_id', 'projectId')
    .addSelect('COUNT(1)', 'count')
    .groupBy('projectId')
    .where(
      projectId && {
        projectId,
      },
    )
    .getRawMany()
  return typeof projectId === 'number'
    ? counts.length
      ? Number(counts[0].count)
      : 0
    : counts.reduce(
        (acc, { projectId, count }) =>
          Object.assign(acc, {
            [projectId]: Number(count),
          }),
        {} as Record<string, number>,
      )
}
