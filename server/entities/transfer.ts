import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class Transfer {
  @PrimaryColumn({
    name: 'snapshot_id',
  })
  snapshotId: string

  @Column({
    name: 'trace_id',
  })
  traceId: string

  @Column({
    name: 'opponent_id',
  })
  opponentId: string

  @Column({
    name: 'asset_id',
  })
  assetId: string

  @Column()
  amount: number

  @Column()
  memo: string

  @Column({
    name: 'created_at',
  })
  createdAt: Date
}
