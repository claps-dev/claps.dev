import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm'

import { Project } from './project'
import { User } from './user'

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
  project: Project

  @OneToOne(
    () => User,
    user => user.id,
  )
  @JoinColumn({
    name: 'user_id',
  })
  user: Promise<User>

  // tslint:disable-next-line: variable-name
  __user__: User
}
