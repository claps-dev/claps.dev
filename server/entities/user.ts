import { Entity, PrimaryColumn, Column, JoinColumn, OneToOne } from 'typeorm'

import { Member } from './member'
import { Project } from './project'

@Entity()
export class User {
  @PrimaryColumn()
  id: number

  @Column()
  name: string

  @Column({
    name: 'display_name',
  })
  displayName?: string

  @Column()
  email?: string

  @Column({
    name: 'avatar_url',
  })
  avatarUrl?: string

  @OneToOne(
    () => Member,
    member => member.user,
  )
  @JoinColumn({
    name: 'id',
  })
  member: Member

  projects: Project[]
}
