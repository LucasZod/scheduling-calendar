import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3333),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  DATABASE_URL: z.string().url(),

  SLOT_START: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'SLOT_START deve ter formato HH:MM')
    .default('08:00'),
  SLOT_END: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'SLOT_END deve ter formato HH:MM')
    .default('18:00'),
  SLOT_INTERVAL_MINUTES: z.coerce.number().int().positive().default(60),
})

export type Env = z.infer<typeof envSchema>

export const validateEnv = (raw: Record<string, unknown>): Env => {
  const result = envSchema.safeParse(raw)
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('\n  ')
    throw new Error(`Variáveis de ambiente inválidas:\n  ${issues}`)
  }
  return result.data
}
