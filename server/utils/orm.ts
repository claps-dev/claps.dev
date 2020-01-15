import { createConnection } from 'typeorm'

import { Project } from '../entities'

export const connect = () =>
  createConnection({
    type: 'mysql',
    ...JSON.parse(process.env.DATABASE_CONFIG),
    entities: [Project],
  })
