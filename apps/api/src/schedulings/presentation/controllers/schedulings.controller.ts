import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common'
import { CreateSchedulingDto } from '../dtos/create-scheduling.dto'
import { CreateSchedulingUseCase } from '../../application/use-cases/create-scheduling.usecase'
import { GetMonthSchedulingsUseCase } from '../../application/use-cases/get-month-schedulings.usecase'

@Controller('schedulings')
export class SchedulingsController {
  constructor(
    private readonly getMonthSchedulings: GetMonthSchedulingsUseCase,
    private readonly createScheduling: CreateSchedulingUseCase
  ) {}

  @Get()
  getMonth(@Query('date') date: string) {
    return this.getMonthSchedulings.execute(date)
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateSchedulingDto) {
    return this.createScheduling.execute(dto)
  }
}
