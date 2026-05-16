import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { isValid, parseISO } from 'date-fns'
import { Scheduling } from '../../domain/entities/scheduling.entity'
import {
  SCHEDULING_REPOSITORY,
  type SchedulingRepository,
} from '../../domain/ports/scheduling.repository'
import { CreateSchedulingDto } from '../../presentation/dtos/create-scheduling.dto'
import type { SchedulingDto } from '../../presentation/dtos/month-schedulings.dto'
import { SlotService } from '../services/slot.service'

@Injectable()
export class CreateSchedulingUseCase {
  constructor(
    @Inject(SCHEDULING_REPOSITORY)
    private readonly repository: SchedulingRepository,
    private readonly slots: SlotService
  ) {}

  async execute(dto: CreateSchedulingDto): Promise<SchedulingDto> {
    const startAt = this.parseStartAt(dto.startAt)
    this.ensureSlotIsAllowed(startAt)
    const endAt = this.slots.calculateEndAt(startAt)
    await this.ensureSlotIsAvailable(startAt, endAt)

    const scheduling = Scheduling.create({
      id: randomUUID(),
      startAt,
      endAt,
      clientName: dto.clientName,
      reason: dto.reason,
    })

    await this.repository.save(scheduling)
    return this.toDto(scheduling)
  }

  private parseStartAt(raw: string): Date {
    const parsed = parseISO(raw)
    if (!isValid(parsed)) {
      throw new BadRequestException('startAt inválido.')
    }
    return parsed
  }

  private ensureSlotIsAllowed(startAt: Date): void {
    if (!this.slots.isAlignedToGrid(startAt)) {
      throw new BadRequestException('Horário não permitido.')
    }
  }

  private async ensureSlotIsAvailable(startAt: Date, endAt: Date): Promise<void> {
    const overlapping = await this.repository.existsOverlapping(startAt, endAt)
    if (overlapping) {
      throw new BadRequestException('Este horário já está agendado.')
    }
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
