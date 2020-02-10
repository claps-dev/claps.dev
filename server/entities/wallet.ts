import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Project } from './project'

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
    name: 'project_id',
  })
  projectId: number

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

  @ManyToOne(
    () => Project,
    project => project.id,
  )
  @JoinColumn({
    name: 'project_id',
  })
  project?: Project
}
