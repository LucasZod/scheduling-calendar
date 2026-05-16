import { format } from 'date-fns'
import type { Metadata } from 'next'
import React from 'react'
import { fetchMonthSchedulingsAction } from '@/app/(actions)/scheduling.actions'
import { SchedulingCreate } from './SchedulingCreate'
import { SchedulingCreateInitializer } from './SchedulingCreateInitializer'

export const metadata: Metadata = {
  title: 'Agendar horário | Agendamentos',
  description: 'Selecione uma data e horário disponíveis para o agendamento.',
}

export default async function Page() {
  const initialValues = await getInitialValues()
  return (
    <React.Fragment>
      <SchedulingCreateInitializer initialValues={initialValues} />
      <SchedulingCreate />
    </React.Fragment>
  )
}

const getInitialValues = async () => {
  const today = new Date()
  const result = await fetchMonthSchedulingsAction(format(today, 'dd/MM/yyyy'))
  if (!result.success) {
    console.error('Falha ao buscar agendamentos do mês:', result.error)
    return { currentMonth: today, schedulings: [], allowedSlots: [] }
  }
  return {
    currentMonth: today,
    schedulings: result.data.schedulings,
    allowedSlots: result.data.allowedSlots,
  }
}
