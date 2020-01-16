import { Entity, PrimaryColumn, JoinColumn, OneToOne, ManyToOne } from 'typeorm'

import { User } from './user'
import { Project } from './project'

@Entity()
export class Member {
  @PrimaryColumn({
    name: 'project_id',
  })
  projectId: number

  @PrimaryColumn({
    name: 'user_id',
  })
  userId: number

  @ManyToOne(
    () => Project,
    project => project.id,
  )
  @JoinColumn({
    name: 'project_id',
  })
  project: Promise<Project>

  @OneToOne(
    () => User,
    user => user.id,
  )
  @JoinColumn({
    name: 'user_id',
  })
  user: Promise<User>

  __user__: User
}
