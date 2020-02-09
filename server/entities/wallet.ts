import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class Wallet {
  @PrimaryColumn({
    name: 'bot_id',
  })
  botId: string

  @PrimaryColumn({
    name: 'asset_id',
  })
  assetId: string

  @Column({
    name: 'asset_symbol',
  })
  assetSymbol: string

  @Column()
  total: number

  @Column()
  balance: number

  @Column({
    name: 'synced_at',
  })
  syncedAt: Date

  @Column({
    name: 'updated_at',
  })
  updatedAt: Date
}
