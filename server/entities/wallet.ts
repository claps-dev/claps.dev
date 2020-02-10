import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

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

  @Column()
  total: number

  @Column()
  balance: number

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date

  @Column({
    name: 'synced_at',
  })
  syncedAt?: Date
}
