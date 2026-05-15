import { Inject, Injectable } from '@nestjs/common'
import { and, eq, sql } from 'drizzle-orm'
import { Scheduling } from '../../domain/entities/scheduling.entity'
import { SchedulingRepository } from '../../domain/ports/scheduling.repository'
import { DATABASE_CONNECTION, type DatabaseConnection } from '../../../database/database.provider'
import { schedulings } from './schema'

@Injectable()
export class DrizzleSchedulingRepository implements SchedulingRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: DatabaseConnection
  ) {}

  async save(scheduling: Scheduling): Promise<void> {
    await this.db.insert(schedulings).values({
      id: scheduling.id,
      date: scheduling.date,
      time: scheduling.time,
      clientName: scheduling.clientName,
      reason: scheduling.reason,
    })
  }

  async findByMonth(year: number, month: number): Promise<Scheduling[]> {
    const prefix = `${year}-${String(month).padStart(2, '0')}`

    const rows = await this.db
      .select()
      .from(schedulings)
      .where(sql`${schedulings.date} LIKE ${`${prefix}%`}`)

    return rows.map(
      (row) => new Scheduling(row.id, row.date, row.time, row.clientName, row.reason, row.createdAt)
    )
  }

  async existsByDateAndTime(date: string, time: string): Promise<boolean> {
    const result = await this.db
      .select({ id: schedulings.id })
      .from(schedulings)
      .where(and(eq(schedulings.date, date), eq(schedulings.time, time)))
      .limit(1)

    return result.length > 0
  }
}
