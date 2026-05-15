import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Env } from '../../../config/env'

@Injectable()
export class SlotService {
  constructor(private readonly config: ConfigService<Env, true>) {}

  buildAllowedSlots(): string[] {
    const { start, end, interval } = this.readConfig()
    const slots: string[] = []
    for (let current = start; current <= end; current += interval) {
      slots.push(this.formatMinutes(current))
    }
    return slots
  }

  isAllowed(time: string): boolean {
    const { start, end, interval } = this.readConfig()
    const target = this.toMinutes(time)
    const inRange = target >= start && target <= end
    const onGrid = (target - start) % interval === 0
    return inRange && onGrid
  }

  private readConfig(): { start: number; end: number; interval: number } {
    return {
      start: this.toMinutes(this.config.getOrThrow('SLOT_START', { infer: true })),
      end: this.toMinutes(this.config.getOrThrow('SLOT_END', { infer: true })),
      interval: this.config.getOrThrow('SLOT_INTERVAL_MINUTES', { infer: true }),
    }
  }

  private toMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number)
    return h * 60 + m
  }

  private formatMinutes(minutes: number): string {
    const h = String(Math.floor(minutes / 60)).padStart(2, '0')
    const m = String(minutes % 60).padStart(2, '0')
    return `${h}:${m}`
  }
}
