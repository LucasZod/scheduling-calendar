import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { addMinutes, getHours, getMinutes } from 'date-fns'
import type { Env } from '../../../config/env'

@Injectable()
export class SlotService {
  constructor(private readonly config: ConfigService<Env, true>) {}

  getAllowedSlotTimes(): string[] {
    const { startMinutes, endMinutes, interval } = this.readConfig()
    const slots: string[] = []
    for (let minutes = startMinutes; minutes <= endMinutes; minutes += interval) {
      slots.push(this.minutesToHHMM(minutes))
    }
    return slots
  }

  isAlignedToGrid(startAt: Date): boolean {
    const { startMinutes, endMinutes, interval } = this.readConfig()
    const minutesOfDay = getHours(startAt) * 60 + getMinutes(startAt)
    const inRange = minutesOfDay >= startMinutes && minutesOfDay <= endMinutes
    const onGrid = (minutesOfDay - startMinutes) % interval === 0
    return inRange && onGrid
  }

  calculateEndAt(startAt: Date): Date {
    const { interval } = this.readConfig()
    return addMinutes(startAt, interval)
  }

  private readConfig(): { startMinutes: number; endMinutes: number; interval: number } {
    return {
      startMinutes: this.hhmmToMinutes(this.config.getOrThrow('SLOT_START', { infer: true })),
      endMinutes: this.hhmmToMinutes(this.config.getOrThrow('SLOT_END', { infer: true })),
      interval: this.config.getOrThrow('SLOT_INTERVAL_MINUTES', { infer: true }),
    }
  }

  private hhmmToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number)
    return h * 60 + m
  }

  private minutesToHHMM(minutes: number): string {
    const h = String(Math.floor(minutes / 60)).padStart(2, '0')
    const m = String(minutes % 60).padStart(2, '0')
    return `${h}:${m}`
  }
}
