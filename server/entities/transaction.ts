import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class Transaction {
  @PrimaryColumn()
  id: string

  @Column()
  amount: number

  @Column({
    name: 'asset_id',
  })
  assetId: string

  @Column({
    name: 'asset_symbol',
  })
  assetSymbol: string

  @Column({
    name: 'created_at',
  })
  createdAt: Date

  @Column()
  sender: string
}
