import { Module } from '@nestjs/common'
import { SCHEDULING_REPOSITORY } from './domain/ports/scheduling.repository'
import { SlotService } from './application/services/slot.service'
import { CreateSchedulingUseCase } from './application/use-cases/create-scheduling.usecase'
import { GetMonthSchedulingsUseCase } from './application/use-cases/get-month-schedulings.usecase'
import { DrizzleSchedulingRepository } from './infra/database/drizzle-scheduling.repository'
import { SchedulingsController } from './presentation/controllers/schedulings.controller'

@Module({
  controllers: [SchedulingsController],
  providers: [
    SlotService,
    CreateSchedulingUseCase,
    GetMonthSchedulingsUseCase,
    {
      provide: SCHEDULING_REPOSITORY,
      useClass: DrizzleSchedulingRepository,
    },
  ],
})
export class SchedulingsModule {}
