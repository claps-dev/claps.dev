import { BinaryLike, createHash, randomBytes } from 'crypto'

export const base64 = (data: string | Buffer, uriEncode?: boolean) => {
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

export const random = (uriEncode?: boolean) =>
  base64(randomBytes(32), uriEncode)

export type HexBase64Latin1Encoding = 'latin1' | 'hex' | 'base64'

export const sha256 = (
  buffer: BinaryLike,
  encoding?: HexBase64Latin1Encoding,
): string | Buffer =>
  createHash('sha256')
    .update(buffer)
    .digest(encoding)
