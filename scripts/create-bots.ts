import { promisify } from 'util'

import { Bot, Project, Wallet } from '@@/server/entities'
import { getAssets, getConn, mixin, mixinBot, randomPin } from '@@/server/utils'
import consola from 'consola'
import { pki } from 'node-forge'

import { DonationDistribution, unionDisplayName } from '@/utils'

const DONATION_DISTRIBUTIONS = Object.values(DonationDistribution).filter(
  _ => typeof _ === 'number',
) as DonationDistribution[]

const generateKeyPair = promisify(pki.rsa.generateKeyPair)

// eslint-disable-next-line no-process-exit, unicorn/no-process-exit
const exit = () => process.exit(0)

export const createBots = async (projectId: number) => {
  const conn = await getConn()
  const botRepo = conn.getRepository(Bot)

  const existBots = await botRepo.find({
    relations: ['project'],
    where: {
      projectId,
    },
  })

  if (existBots.length > 0) {
    consola.log('existBots:', existBots)
    exit()
    return
  }

  const assets = await getAssets()
  const bots: Bot[] = []
  const wallets: Array<Pick<Wallet, 'botId' | 'assetId' | 'projectId'>> = []

  let projectDisplayName: string

  await Promise.all(
    DONATION_DISTRIBUTIONS.map(async distribution => {
      const { publicKey, privateKey } = await generateKeyPair({
        bits: 1024,
        workers: 2,
      })

      const publicKeyPem = pki.publicKeyToPem(publicKey)
      const privateKeyPem = pki.privateKeyToPem(privateKey)

      const botUser = await mixin.create_user({
        full_name: [
          projectDisplayName ||
            (projectDisplayName = unionDisplayName(
              await conn.getRepository(Project).findOne({ id: projectId }),
            )),
          distribution,
        ].join('_'),
        session_secret: publicKeyPem
          .trim()
          .split(/\r?\n/)
          .slice(1, -1)
          .join(''),
      })

      const bot = {
        id: botUser.user_id,
        distribution,
        pin: '',
        pinToken: botUser.pin_token,
        privateKey: privateKeyPem,
        projectId,
        sessionId: botUser.session_id,
      } as Bot
      const bitMixin = mixinBot(bot)
      const pin = randomPin()
      await bitMixin.pin_update({
        old_pin: bot.pin,
        pin,
      })
      bot.pin = pin
      bots.push(bot)
      assets.forEach(asset =>
        wallets.push({
          projectId: bot.projectId,
          botId: bot.id,
          assetId: asset.asset_id,
        }),
      )
    }),
  )

  const result = await Promise.all([
    botRepo.save(bots),
    conn.getRepository(Wallet).save(wallets),
  ])

  consola.log('create bots successfully:', result)

  exit()
}

createBots(+process.argv[2])
