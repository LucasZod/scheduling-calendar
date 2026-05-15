import { Scheduling } from '../entities/scheduling.entity'

export const SCHEDULING_REPOSITORY = Symbol('SchedulingRepository')

export interface SchedulingRepository {
  save(scheduling: Scheduling): Promise<void>
  findByMonth(year: number, month: number): Promise<Scheduling[]>
  existsByDateAndTime(date: string, time: string): Promise<boolean>
}
