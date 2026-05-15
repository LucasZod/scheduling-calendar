import * as dotenv from 'dotenv'
import { defineConfig } from 'drizzle-kit'

dotenv.config()

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL não definida — verifique o .env do apps/api.')
}

export default defineConfig({
  schema: './src/schedulings/infra/database/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
})
