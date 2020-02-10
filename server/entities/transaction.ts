import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class Transaction {
  @PrimaryColumn()
  id: string

  @Column({
    name: 'project_id',
  })
  projectId: number

  @Column({
    name: 'bot_id',
  })
  botId: string

  @Column({
    name: 'asset_id',
  })
  assetId: string

  @Column()
  amount: number

  @Column({
    name: 'created_at',
  })
  createdAt: Date

  @Column()
  sender: string
}
