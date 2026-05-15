import { ConfigService } from '@nestjs/config'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import type { Env } from '../config/env'

export const DATABASE_CONNECTION = Symbol('DATABASE_CONNECTION')

export type DatabaseConnection = NodePgDatabase

export const databaseProvider = {
  provide: DATABASE_CONNECTION,
  inject: [ConfigService],
  useFactory: (config: ConfigService<Env, true>): DatabaseConnection => {
    const pool = new Pool({
      connectionString: config.getOrThrow('DATABASE_URL', { infer: true }),
    })
    return drizzle(pool)
  },
}
