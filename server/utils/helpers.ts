import { BinaryLike, createHash, randomBytes } from 'crypto'

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
