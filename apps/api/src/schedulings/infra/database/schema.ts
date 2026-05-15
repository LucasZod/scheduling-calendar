import { pgTable, text, timestamp, unique, varchar } from 'drizzle-orm/pg-core'

export const schedulings = pgTable(
  'schedulings',
  {
    id: text('id').primaryKey(),
    date: varchar('date', { length: 10 }).notNull(),
    time: varchar('time', { length: 5 }).notNull(),
    clientName: text('client_name').notNull(),
    reason: text('reason').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [unique('schedulings_date_time_unique').on(table.date, table.time)]
)
