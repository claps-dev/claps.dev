/* eslint-disable @typescript-eslint/camelcase */
declare module 'mixin-node-sdk' {
  export interface MixinError {
    status: number
    code: number
    description: string
  }

  export interface MixinResponse<T> {
    data?: T
    error?: MixinError
  }

  export interface ClientConfig {
    client_id: string
    client_secret: string
    pin: string
    session_id: string
    pin_token: string
    private_key: string
  }

  export interface AssetCore {
    type: 'asset'
    asset_id: string
    asset_key: string
    chain_id: string
    icon_url: string
    name: string
    symbol: string
  }

  export interface Asset extends AssetCore {
    type: 'asset'
    balance: string
    destination: string
    tag: string
    price_btc: string
    price_usd: string
    change_btc: string
    change_usd: string
    mixin_id: string
    confirmations: number
    capitalization: number
    public_key: string
    account_name: string
    account_tag: string
  }

  export interface Address {
    type: 'address'
    address_id: string
    asset_id: string
    destination: string
    tag: string
    label: string
    fee: string
    reserve: string
    dust: string
    updated_at: string
  }

  export interface User {
    type: 'user'
    user_id: string
    identity_number: string
    phone: string
    full_name: string
    biography: string
    avatar_url: string
    relationship: string
    mute_until: string
    created_at: string
    is_verified: boolean
    session_id: string
    pin_token: string
    code_id: string
    code_url: string
    has_pin: boolean
    has_emergency_contact: boolean
    receive_message_source: string
    accept_conversation_source: string
    fiat_currency: string
    transfer_notification_threshold: number
  }

  export interface Transaction {
    type: 'transaction'
    transaction_id: string
    transaction_hash: string
    sender: string
    chain_id: string
    asset_id: string
    amount: string
    destination: string
    tag: string
    confirmations: number
    threshold: number
    created_at: string
    public_key: string
    account_name: string
    account_tag: string
  }

  export interface Snapshot {
    amount: string
    type: 'snapshot'
    asset: AssetCore
    created_at: string
    snapshot_id: string
    source: string
    user_id?: string
    trace_id?: string
    opponent_id?: string
    data?: string
  }

  export class Mixin {
    constructor(options: ClientConfig)

    query_assets(params: { asset_id: string }): Promise<Asset>
    query_assets(params: {}): Promise<Asset[]>

    query_network_snapshots(params: { snapshot_id: string }): Promise<Snapshot>
    query_network_snapshots(params: {
      asset?: string
      offset?: string
      order?: 'ASC' | 'DESC'
    }): Promise<Snapshot[]>

    query_my_addresses_by_assetid(params: {
      asset_id: string
    }): Promise<Address[]>

    query_address(params: { address_id: string }): Promise<Address>

    create_user(params: {
      full_name: string
      session_secret: string
    }): Promise<User>

    pin_update(params: { old_pin: string; pin: string }): Promise<User>
  }
}
