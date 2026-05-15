import { BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { SchedulingRepository } from '../../domain/ports/scheduling.repository'
import { SlotService } from '../services/slot.service'
import { CreateSchedulingUseCase } from './create-scheduling.usecase'
import type { Env } from '../../../config/env'

const buildConfig = (
  overrides: Partial<Record<keyof Env, unknown>> = {}
): ConfigService<Env, true> => {
  const values: Partial<Record<keyof Env, unknown>> = {
    SLOT_START: '08:00',
    SLOT_END: '18:00',
    SLOT_INTERVAL_MINUTES: 60,
    ...overrides,
  }
  return {
    getOrThrow: jest.fn((key: keyof Env) => {
      if (!(key in values)) throw new Error(`config key não mockada: ${String(key)}`)
      return values[key]
    }),
  } as unknown as ConfigService<Env, true>
}

const validInput = {
  date: '2025-05-15',
  time: '09:00',
  clientName: 'Maria Silva',
  reason: 'Consulta de rotina',
}

describe('CreateSchedulingUseCase', () => {
  let repository: jest.Mocked<SchedulingRepository>
  let useCase: CreateSchedulingUseCase

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findByMonth: jest.fn(),
      existsByDateAndTime: jest.fn().mockResolvedValue(false),
    }
    useCase = new CreateSchedulingUseCase(repository, new SlotService(buildConfig()))
  })

  it('deve criar um agendamento em horário válido e disponível', async () => {
    const result = await useCase.execute(validInput)

    expect(repository.existsByDateAndTime).toHaveBeenCalledWith('2025-05-15', '09:00')
    expect(repository.save).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({
      date: validInput.date,
      time: validInput.time,
      clientName: validInput.clientName,
      reason: validInput.reason,
    })
    expect(typeof result.id).toBe('string')
    expect(result.id.length).toBeGreaterThan(0)
    expect(typeof result.createdAt).toBe('string')
    expect(() => new Date(result.createdAt)).not.toThrow()
  })

  it('deve lançar BadRequestException se o horário não estiver em allowedSlots', async () => {
    await expect(useCase.execute({ ...validInput, time: '08:30' })).rejects.toBeInstanceOf(
      BadRequestException
    )
    expect(repository.existsByDateAndTime).not.toHaveBeenCalled()
    expect(repository.save).not.toHaveBeenCalled()
  })

  it('deve lançar BadRequestException se o slot já estiver ocupado', async () => {
    repository.existsByDateAndTime.mockResolvedValue(true)

    await expect(useCase.execute(validInput)).rejects.toBeInstanceOf(BadRequestException)
    expect(repository.save).not.toHaveBeenCalled()
  })
})
