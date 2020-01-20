import {
  Column,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm'

import { Repository } from './repository'
import { Member } from './member'
import { Bot } from './bot'

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

  @OneToOne(
    () => Bot,
    bot => bot.project,
  )
  bot?: Promise<Bot>
}
