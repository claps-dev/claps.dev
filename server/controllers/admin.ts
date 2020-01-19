import { writeFile as _writeFile } from 'fs'
import { homedir } from 'os'
import { resolve } from 'path'
import { promisify } from 'util'

import { Controller, RequestMapping } from '@rxts/koa-router-decorators'
import { Context } from 'koa'
import { pki } from 'node-forge'

import { mixin, random } from '../utils'

const generateKeyPair = promisify(pki.rsa.generateKeyPair)
const writeFile = promisify(_writeFile)

const sshDir = resolve(homedir(), '.ssh')

export const PRIVATE_KEY_FILE = resolve(sshDir, 'Claps_rsa')
export const PUBLIC_KEY_FILE = resolve(sshDir, 'Claps_rsa.pub')

export const KEY_ENCODING = {
  format: 'pem',
  type: 'pkcs1',
} as const

@Controller
@RequestMapping('/admin')
export class AdminController {
  @RequestMapping('/createBot')
  async createBot(ctx: Context) {
    const { publicKey, privateKey } = await generateKeyPair({
      bits: 1024,
      workers: 2,
    })

    const publicKeyPem = pki.publicKeyToPem(publicKey)
    const privateKeyPem = pki.privateKeyToPem(privateKey)

    const sessionSecret = publicKeyPem
      .trim()
      .split(/\r?\n/)
      .slice(1, -1)
      .join('')

    await writeFile(PRIVATE_KEY_FILE, privateKeyPem)
    await writeFile(PUBLIC_KEY_FILE, publicKeyPem)

    ctx.body = await mixin.create_user({
      full_name: ctx.query.fullName || random(true),
      session_secret: sessionSecret,
    })
  }
}
