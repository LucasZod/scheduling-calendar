import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
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
    this.ensureSlotIsAllowed(dto.time)
    await this.ensureSlotIsAvailable(dto.date, dto.time)

    const scheduling = Scheduling.create({
      id: randomUUID(),
      date: dto.date,
      time: dto.time,
      clientName: dto.clientName,
      reason: dto.reason,
    })

    await this.repository.save(scheduling)
    return this.toDto(scheduling)
  }

  private ensureSlotIsAllowed(time: string): void {
    if (!this.slots.isAllowed(time)) {
      throw new BadRequestException('Horário não permitido.')
    }
  }

  private async ensureSlotIsAvailable(date: string, time: string): Promise<void> {
    const taken = await this.repository.existsByDateAndTime(date, time)
    if (taken) {
      throw new BadRequestException('Este horário já está agendado.')
    }
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
