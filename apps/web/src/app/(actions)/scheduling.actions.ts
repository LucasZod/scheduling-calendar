'use server'

import type { MonthSchedulingsResponseDto, SchedulingDto } from 'shared-types'
import { http } from '@/api/fetch'
import { createSchedulingInputSchema } from '@/schemas/scheduling.schema'

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

export const fetchMonthSchedulingsAction = async (
  date: string
): Promise<ActionResult<MonthSchedulingsResponseDto>> => {
  try {
    const data = await http.get<MonthSchedulingsResponseDto>('/schedulings', {
      params: { date },
    })
    return { success: true, data }
  } catch (error) {
    return { success: false, error: messageFrom(error) }
  }
}

export const createSchedulingAction = async (
  input: unknown
): Promise<ActionResult<SchedulingDto>> => {
  const parsed = createSchedulingInputSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }
  try {
    const data = await http.post<SchedulingDto>('/schedulings', parsed.data)
    return { success: true, data }
  } catch (error) {
    return { success: false, error: messageFrom(error) }
  }
}

const messageFrom = (error: unknown) =>
  error instanceof Error ? error.message : 'Erro inesperado.'
