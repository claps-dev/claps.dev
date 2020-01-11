/* eslint-disable @typescript-eslint/camelcase */
declare module 'mixin-node-sdk' {
  export interface ClientConfig {
    client_id: string
    client_secret: string
    pin: string
    session_id: string
    pin_token: string
    private_key: string
  }

  export interface Asset {
    type: 'asset'
    asset_id: string
    chain_id: string
    symbol: string
    name: string
    icon_url: string
    balance: string
    destination: string
    tag: string
    price_btc: string
    price_usd: string
    change_btc: string
    change_usd: string
    asset_key: string
    mixin_id: string
    confirmations: number
    capitalization: number
    public_key: string
    account_name: string
    account_tag: string
  }

  export class Mixin {
    constructor(options: ClientConfig)

    query_assets(params: {}): Promise<Asset[]>
    query_assets(params: { asset_id: string }): Promise<Asset>
  }
}
