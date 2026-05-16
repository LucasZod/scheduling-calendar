import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { endOfMonth, isValid, parse, startOfMonth } from 'date-fns'
import {
  SCHEDULING_REPOSITORY,
  type SchedulingRepository,
} from '../../domain/ports/scheduling.repository'
import type {
  MonthSchedulingsResponseDto,
  SchedulingDto,
} from '../../presentation/dtos/month-schedulings.dto'
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
    const reference = this.parseReferenceDate(date)
    const rangeStart = startOfMonth(reference)
    const rangeEnd = endOfMonth(reference)
    const schedulings = await this.repository.findInRange(rangeStart, rangeEnd)
    return {
      allowedSlots: this.slots.getAllowedSlotTimes(),
      schedulings: schedulings.map((s) => this.toDto(s)),
    }
  }

  private parseReferenceDate(raw: string): Date {
    const parsed = parse(raw ?? '', 'dd/MM/yyyy', new Date())
    if (!isValid(parsed)) {
      throw new BadRequestException('Formato de data inválido. Use DD/MM/YYYY.')
    }
    return parsed
  }

  private toDto(scheduling: Scheduling): SchedulingDto {
    return {
      id: scheduling.id,
      startAt: scheduling.startAt.toISOString(),
      endAt: scheduling.endAt.toISOString(),
      clientName: scheduling.clientName,
      reason: scheduling.reason,
      createdAt: scheduling.createdAt.toISOString(),
    }
  }
}
