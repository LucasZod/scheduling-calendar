export interface SchedulingDto {
  id: string
  startAt: string
  endAt: string
  clientName: string
  reason: string
  createdAt: string
}

export interface MonthSchedulingsResponseDto {
  allowedSlots: string[]
  schedulings: SchedulingDto[]
}

export interface CreateSchedulingDto {
  startAt: string
  clientName: string
  reason: string
}

export interface ApiErrorDto {
  statusCode: number
  error: string
  message: string
}
