import crypto, { BinaryLike } from 'crypto'

export const sha256 = (buffer: BinaryLike) =>
  crypto
    .createHash('sha256')
    .update(buffer)
    .digest('base64')
