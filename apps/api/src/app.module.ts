import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { validateEnv } from './config/env'
import { DatabaseModule } from './database/database.module'
import { SchedulingsModule } from './schedulings/schedulings.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    DatabaseModule,
    SchedulingsModule,
  ],
})
export class AppModule {}
