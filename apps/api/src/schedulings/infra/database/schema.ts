import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const schedulings = pgTable('schedulings', {
  id: text('id').primaryKey(),
  startAt: timestamp('start_at').notNull(),
  endAt: timestamp('end_at').notNull(),
  clientName: text('client_name').notNull(),
  reason: text('reason').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
