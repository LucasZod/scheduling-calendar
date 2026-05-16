import { Inject, Injectable } from '@nestjs/common'
import { and, gt, gte, lt, lte } from 'drizzle-orm'
import { Scheduling } from '../../domain/entities/scheduling.entity'
import { SchedulingRepository } from '../../domain/ports/scheduling.repository'
import {
  DATABASE_CONNECTION,
  type DatabaseConnection,
} from '../../../database/database.provider'
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
      startAt: scheduling.startAt,
      endAt: scheduling.endAt,
      clientName: scheduling.clientName,
      reason: scheduling.reason,
    })
  }

  async findInRange(rangeStart: Date, rangeEnd: Date): Promise<Scheduling[]> {
    const rows = await this.db
      .select()
      .from(schedulings)
      .where(
        and(gte(schedulings.startAt, rangeStart), lte(schedulings.startAt, rangeEnd))
      )

    return rows.map(
      (row) =>
        new Scheduling(
          row.id,
          row.startAt,
          row.endAt,
          row.clientName,
          row.reason,
          row.createdAt
        )
    )
  }

  async existsOverlapping(startAt: Date, endAt: Date): Promise<boolean> {
    const result = await this.db
      .select({ id: schedulings.id })
      .from(schedulings)
      .where(and(lt(schedulings.startAt, endAt), gt(schedulings.endAt, startAt)))
      .limit(1)

    return result.length > 0
  }
}
