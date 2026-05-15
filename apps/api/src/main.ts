import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import type { Env } from './config/env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  const config = app.get(ConfigService<Env, true>)
  app.enableCors({ origin: config.getOrThrow('CORS_ORIGIN', { infer: true }) })

  await app.listen(config.getOrThrow('PORT', { infer: true }))
}

void bootstrap()
