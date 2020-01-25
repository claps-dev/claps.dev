import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Project } from './project'

export enum RepositoryType {
  GITHUB = 'GitHub',
  BITBUCKET = 'BitBucket',
  GITLAB = 'GitLab',
  GIT = 'Git',
}

@Entity()
export class Repository {
  @PrimaryColumn()
  id: number

  @Column({
    name: 'project_id',
  })
  projectId: number

  @Column()
  type: RepositoryType

  @Column()
  slug: string

  @Column()
  name: string

  @Column()
  description?: string

  @Column({
    name: 'created_at',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date

  @ManyToOne(
    () => Project,
    project => project.id,
  )
  @JoinColumn({
    name: 'project_id',
  })
  project: Project

  stars = 0
}
