import { generateKeyPair as _generateKeyPair } from 'crypto'
import { writeFile as _writeFile } from 'fs'
import { homedir } from 'os'
import { resolve } from 'path'
import { promisify } from 'util'

import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import { Context } from 'koa'

import { mixin, base64, random } from '../utils'

const generateKeyPair = promisify(_generateKeyPair)
const writeFile = promisify(_writeFile)

const sshDir = resolve(homedir(), '.ssh')

export const PRIVATE_KEY_FILE = resolve(sshDir, 'Claps_rsa')
export const PUBLIC_KEY_FILE = resolve(sshDir, 'Claps_rsa.pub')

export const KEY_ENCODING = {
  format: 'pem',
  type: 'pkcs1',
} as const

const unwrapPublicKey = (publicKey: string) =>
  publicKey
    .replace(/^\s*-----BEGIN RSA PUBLIC KEY-----\s*/, '')
    .replace(/\s*-----END RSA PUBLIC KEY-----\s*$/, '')

@Controller
@RequestMapping('/admin')
export class AdminController {
  @RequestMapping('/createBot')
  async createBot(ctx: Context) {
    const { publicKey, privateKey } = await generateKeyPair('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: KEY_ENCODING,
      privateKeyEncoding: KEY_ENCODING,
    })
    await writeFile(PRIVATE_KEY_FILE, privateKey)
    await writeFile(PUBLIC_KEY_FILE, publicKey)
    ctx.body = await mixin.create_user({
      full_name: random(true),
      session_secret: base64(unwrapPublicKey(publicKey)),
    })
  }
}
