import { Mixin } from 'mixin-node-sdk'

import { Bot } from '../entities'

export const mixinBot = (bot: Bot) =>
  new Mixin({
    client_id: bot.id,
    client_secret: process.env.MIXIN_CLIENT_SECRET,
    pin: bot.pin,
    session_id: bot.sessionId,
    pin_token: bot.pinToken,
    private_key: bot.privateKey,
  })
