import { IsString, Matches, MinLength } from 'class-validator'
import type { CreateSchedulingDto as ICreateSchedulingDto } from 'shared-types'

export class CreateSchedulingDto implements ICreateSchedulingDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date deve estar no formato YYYY-MM-DD' })
  date!: string

  @Matches(/^\d{2}:\d{2}$/, { message: 'time deve estar no formato HH:MM' })
  time!: string

  @IsString()
  @MinLength(2, { message: 'clientName deve ter ao menos 2 caracteres' })
  clientName!: string

  @IsString()
  @MinLength(3, { message: 'reason deve ter ao menos 3 caracteres' })
  reason!: string
}
