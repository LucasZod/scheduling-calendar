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
  startAt: '2025-05-15T09:00:00',
  clientName: 'Maria Silva',
  reason: 'Consulta de rotina',
}

describe('CreateSchedulingUseCase', () => {
  let repository: jest.Mocked<SchedulingRepository>
  let useCase: CreateSchedulingUseCase

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findInRange: jest.fn(),
      existsOverlapping: jest.fn().mockResolvedValue(false),
    }
    useCase = new CreateSchedulingUseCase(repository, new SlotService(buildConfig()))
  })

  it('deve criar um agendamento em horário válido e disponível', async () => {
    const result = await useCase.execute(validInput)

    expect(repository.existsOverlapping).toHaveBeenCalledTimes(1)
    expect(repository.save).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({
      clientName: validInput.clientName,
      reason: validInput.reason,
    })
    expect(new Date(result.startAt).getTime()).toBe(new Date(validInput.startAt).getTime())
    expect(new Date(result.endAt).getTime() - new Date(result.startAt).getTime()).toBe(
      60 * 60 * 1000
    )
    expect(typeof result.id).toBe('string')
    expect(result.id.length).toBeGreaterThan(0)
  })

  it('deve lançar BadRequestException se startAt for inválido', async () => {
    await expect(
      useCase.execute({ ...validInput, startAt: 'não-é-data' })
    ).rejects.toBeInstanceOf(BadRequestException)
    expect(repository.save).not.toHaveBeenCalled()
  })

  it('deve lançar BadRequestException se o horário não estiver em allowedSlots', async () => {
    await expect(
      useCase.execute({ ...validInput, startAt: '2025-05-15T08:30:00' })
    ).rejects.toBeInstanceOf(BadRequestException)
    expect(repository.existsOverlapping).not.toHaveBeenCalled()
    expect(repository.save).not.toHaveBeenCalled()
  })

  it('deve lançar BadRequestException se o slot já estiver ocupado', async () => {
    repository.existsOverlapping.mockResolvedValue(true)

    await expect(useCase.execute(validInput)).rejects.toBeInstanceOf(BadRequestException)
    expect(repository.save).not.toHaveBeenCalled()
  })
})
