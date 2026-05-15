export interface SchedulingDto {
  id: string
  date: string
  time: string
  clientName: string
  reason: string
  createdAt: string
}

export interface MonthSchedulingsResponseDto {
  allowedSlots: string[]
  schedulings: SchedulingDto[]
}

export interface CreateSchedulingDto {
  date: string
  time: string
  clientName: string
  reason: string
}

export interface ApiErrorDto {
  statusCode: number
  error: string
  message: string
}
