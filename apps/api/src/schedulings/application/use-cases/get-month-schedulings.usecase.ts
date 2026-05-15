import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import {
  SCHEDULING_REPOSITORY,
  type SchedulingRepository,
} from '../../domain/ports/scheduling.repository'
import type {
  MonthSchedulingsResponseDto,
  SchedulingDto,
} from '../dtos/month-schedulings.dto'
import { Scheduling } from '../../domain/entities/scheduling.entity'
import { SlotService } from '../services/slot.service'

@Injectable()
export class GetMonthSchedulingsUseCase {
  constructor(
    @Inject(SCHEDULING_REPOSITORY)
    private readonly repository: SchedulingRepository,
    private readonly slots: SlotService
  ) {}

  async execute(date: string): Promise<MonthSchedulingsResponseDto> {
    const { year, month } = this.parseMonthDate(date)
    const schedulings = await this.repository.findByMonth(year, month)
    return {
      allowedSlots: this.slots.buildAllowedSlots(),
      schedulings: schedulings.map((s) => this.toDto(s)),
    }
  }

  private parseMonthDate(date: string): { year: number; month: number } {
    const parts = date?.split('/') ?? []
    if (parts.length !== 3) {
      throw new BadRequestException('Formato de data inválido. Use DD/MM/YYYY.')
    }
    const month = Number(parts[1])
    const year = Number(parts[2])
    if (!Number.isInteger(month) || !Number.isInteger(year) || month < 1 || month > 12) {
      throw new BadRequestException('Formato de data inválido. Use DD/MM/YYYY.')
    }
    return { year, month }
  }

  private toDto(scheduling: Scheduling): SchedulingDto {
    return {
      id: scheduling.id,
      date: scheduling.date,
      time: scheduling.time,
      clientName: scheduling.clientName,
      reason: scheduling.reason,
      createdAt: scheduling.createdAt.toISOString(),
    }
  }
}
