import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity()
export class Bot {
  @PrimaryColumn()
  id: string

  @Column({
    name: 'project_id',
  })
  projectId: number

  @Column({
    name: 'session_id',
  })
  sessionId: string

  @Column({
    name: 'pin_token',
  })
  pinToken: string

  @Column({
    name: 'private_key',
  })
  privateKey: string
}
