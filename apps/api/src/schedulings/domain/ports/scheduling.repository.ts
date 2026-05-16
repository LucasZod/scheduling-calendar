import { Scheduling } from '../entities/scheduling.entity'

export const SCHEDULING_REPOSITORY = Symbol('SchedulingRepository')

export interface SchedulingRepository {
  save(scheduling: Scheduling): Promise<void>
  findInRange(rangeStart: Date, rangeEnd: Date): Promise<Scheduling[]>
  existsOverlapping(startAt: Date, endAt: Date): Promise<boolean>
}
