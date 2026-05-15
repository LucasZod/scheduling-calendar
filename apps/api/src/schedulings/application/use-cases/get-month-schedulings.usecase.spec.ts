import { BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Scheduling } from '../../domain/entities/scheduling.entity'
import type { SchedulingRepository } from '../../domain/ports/scheduling.repository'
import { SlotService } from '../services/slot.service'
import { GetMonthSchedulingsUseCase } from './get-month-schedulings.usecase'
import type { Env } from '../../../config/env'

const buildConfig = (
  overrides: Partial<Record<keyof Env, unknown>> = {}
): ConfigService<Env, true> => {
  const values: Partial<Record<keyof Env, unknown>> = {
    SLOT_START: '08:00',
    SLOT_END: '10:00',
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

const buildUseCase = (configOverrides: Partial<Record<keyof Env, unknown>> = {}) => {
  const repository: jest.Mocked<SchedulingRepository> = {
    save: jest.fn(),
    findByMonth: jest.fn().mockResolvedValue([]),
    existsByDateAndTime: jest.fn(),
  }
  const useCase = new GetMonthSchedulingsUseCase(
    repository,
    new SlotService(buildConfig(configOverrides))
  )
  return { repository, useCase }
}

describe('GetMonthSchedulingsUseCase', () => {
  it('deve retornar allowedSlots calculados corretamente do config', async () => {
    const { useCase } = buildUseCase()

    const result = await useCase.execute('01/05/2025')

    expect(result.allowedSlots).toEqual(['08:00', '09:00', '10:00'])
  })

  it('deve retornar agendamentos do mês mapeados para SchedulingDto', async () => {
    const { repository, useCase } = buildUseCase()
    const createdAt = new Date('2025-05-15T12:00:00.000Z')
    repository.findByMonth.mockResolvedValue([
      new Scheduling('id-1', '2025-05-15', '09:00', 'Maria', 'consulta', createdAt),
    ])

    const result = await useCase.execute('01/05/2025')

    expect(repository.findByMonth).toHaveBeenCalledWith(2025, 5)
    expect(result.schedulings).toEqual([
      {
        id: 'id-1',
        date: '2025-05-15',
        time: '09:00',
        clientName: 'Maria',
        reason: 'consulta',
        createdAt: createdAt.toISOString(),
      },
    ])
  })

  it('deve lançar BadRequestException se o formato de date for inválido', async () => {
    const { useCase } = buildUseCase()

    await expect(useCase.execute('2025-05-01')).rejects.toBeInstanceOf(BadRequestException)
    await expect(useCase.execute('foo/bar/baz')).rejects.toBeInstanceOf(BadRequestException)
    await expect(useCase.execute('01/13/2025')).rejects.toBeInstanceOf(BadRequestException)
    await expect(useCase.execute('')).rejects.toBeInstanceOf(BadRequestException)
  })
})
