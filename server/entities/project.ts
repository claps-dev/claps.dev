import { Column, Entity, PrimaryColumn } from 'typeorm'

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

  @Column()
  total: number

  @Column()
  patrons: number
}
