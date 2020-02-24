import { createTokenAuth } from '@octokit/auth-token'
import { Octokit } from '@octokit/rest'
import { BinaryLike, createHash, randomBytes } from 'crypto'
import { Asset } from 'mixin-node-sdk'
import { Connection, createConnection } from 'typeorm'

import { filterAssets } from '@/utils'

import * as entities from '../entities'

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

  if (!timestamp || timestamp < 999999999 || !parseInt(ts) || !parseInt(ns)) {
    return formatRFC3339Nano()
  }

  return new Date(parseInt(ts + '000')).toISOString().replace('.000', `.${ns}`)
}
