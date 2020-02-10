import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Bot } from './bot'
import { Member } from './member'
import { Repository } from './repository'

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

  @Column({
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
  patrons: number

  @OneToMany(
    () => Repository,
    repository => repository.project,
  )
  repositories?: Repository[]

  @OneToMany(
    () => Member,
    member => member.project,
  )
  members: Member[]

  @OneToMany(
    () => Bot,
    bot => bot.project,
  )
  bots?: Promise<Bot[]>

  botIds?: string[]

  // tslint:disable-next-line: variable-name
  __bots__?: Bot[]
}
