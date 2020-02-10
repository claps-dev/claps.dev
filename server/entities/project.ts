import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Bot } from './bot'
import { Member } from './member'
import { Repository } from './repository'
import { Wallet } from './wallet'

@Entity()
export class Project {
  @PrimaryColumn()
  id: number

  @Column()
  name: string

  @Column({
    name: 'display_name',
  })
  displayName?: string

  @Column()
  description?: string

  @Column({
    name: 'avatar_url',
  })
  avatarUrl?: string

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date

  @OneToMany(
    () => Repository,
    repository => repository.project,
  )
  repositories?: Repository[]

  @OneToMany(
    () => Member,
    member => member.project,
  )
  members?: Member[]

  @OneToMany(
    () => Wallet,
    wallet => wallet.project,
  )
  wallets?: Wallet[]

  @OneToMany(
    () => Bot,
    bot => bot.project,
  )
  bots?: Promise<Bot[]>

  botIds?: string[]

  total = 0

  patrons = 0

  // tslint:disable-next-line: variable-name
  __bots__?: Bot[]
}
