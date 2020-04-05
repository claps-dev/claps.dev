import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'

import { DonationDistribution } from '@/utils'

import { Project } from './project'

@Entity()
export class Bot {
  @PrimaryColumn()
  id: string

  @Column({
    name: 'project_id',
  })
  projectId: number

  @Column({
    type: 'enum',
    enum: DonationDistribution,
  })
  distribution: DonationDistribution

  @Column({
    name: 'session_id',
  })
  sessionId: string

  @Column()
  pin: string

  @Column({
    name: 'pin_token',
  })
  pinToken: string

  @Column({
    name: 'private_key',
  })
  privateKey: string

  @OneToOne(() => Project, project => project.id)
  @JoinColumn({
    name: 'project_id',
  })
  project: Project
}
