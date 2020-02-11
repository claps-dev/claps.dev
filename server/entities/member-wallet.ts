import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class MemberWallet {
  @PrimaryColumn({
    name: 'project_id',
  })
  projectId: number

  @PrimaryColumn({
    name: 'user_id',
  })
  userId: number

  @PrimaryColumn({
    name: 'bot_id',
  })
  botId: string

  @PrimaryColumn({
    name: 'asset_id',
  })
  assetId: string

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date

  @Column()
  total: number

  @Column()
  balance: number
}
