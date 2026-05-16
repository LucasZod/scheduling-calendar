import { IsISO8601, IsString, MinLength } from 'class-validator'
import type { CreateSchedulingDto as ICreateSchedulingDto } from 'shared-types'

export class CreateSchedulingDto implements ICreateSchedulingDto {
  @IsISO8601({}, { message: 'startAt deve estar em formato ISO 8601' })
  startAt!: string

  @IsString()
  @MinLength(2, { message: 'clientName deve ter ao menos 2 caracteres' })
  clientName!: string

  @IsString()
  @MinLength(3, { message: 'reason deve ter ao menos 3 caracteres' })
  reason!: string
}
