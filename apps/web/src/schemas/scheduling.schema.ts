import { z } from 'zod'

export const createSchedulingInputSchema = z.object({
  startAt: z.string().min(1, 'startAt obrigatório.'),
  clientName: z.string().min(2, 'Informe o nome do cliente (mínimo 2 caracteres).'),
  reason: z.string().min(3, 'Informe o motivo (mínimo 3 caracteres).'),
})

export type CreateSchedulingInput = z.infer<typeof createSchedulingInputSchema>
