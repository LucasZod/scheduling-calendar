import { addMonths, subMonths } from 'date-fns'
import { create, type StoreApi, type UseBoundStore } from 'zustand'
import type { SchedulingDto } from 'shared-types'
import {
  createSchedulingAction,
  fetchMonthSchedulingsAction,
} from '@/app/(actions)/scheduling.actions'

type ValidationField = 'clientName' | 'reason'

export interface SchedulingCreateStoreProps {
  currentMonth: Date
  selectedDay: Date | null
  schedulings: SchedulingDto[]
  allowedSlots: string[]
  modal: {
    open: boolean
    time: string | null
  }
  form: {
    clientName: string
    reason: string
  }
  validationErrors: Partial<Record<ValidationField, string>>
  isSubmitting: boolean
  isLoadingMonth: boolean
  submitError: string | null
  monthError: string | null
}

export interface SchedulingCreateStore extends SchedulingCreateStoreProps {
  setCurrentMonth: (date: Date) => void
  selectDay: (day: Date) => void
  openSlot: (time: string) => void
  closeModal: () => void
  setClientName: (value: string) => void
  setReason: (value: string) => void
  clearValidationError: (field: ValidationField) => void
  setValidationErrors: (errors: Partial<Record<ValidationField, string>>) => void
  startSubmit: () => void
  finishSubmit: (error?: string | null) => void
  resetForm: () => void
  setMonthState: (state: {
    schedulings?: SchedulingDto[]
    allowedSlots?: string[]
    isLoadingMonth?: boolean
    monthError?: string | null
  }) => void
}

const emptyForm = { clientName: '', reason: '' }

const initialState: SchedulingCreateStoreProps = {
  currentMonth: new Date(),
  selectedDay: null,
  schedulings: [],
  allowedSlots: [],
  modal: { open: false, time: null },
  form: emptyForm,
  validationErrors: {},
  isSubmitting: false,
  isLoadingMonth: false,
  submitError: null,
  monthError: null,
}

export let useSchedulingCreateStore: UseBoundStore<StoreApi<SchedulingCreateStore>>

export const initializeSchedulingCreateStore = ({
  initialValues,
}: {
  initialValues?: Partial<SchedulingCreateStoreProps>
}) => {
  useSchedulingCreateStore = create<SchedulingCreateStore>()((set) => ({
    ...initialState,
    ...initialValues,
    setCurrentMonth: (date) => set({ currentMonth: date }),
    selectDay: (day) => set({ selectedDay: day }),
    openSlot: (time) =>
      set({
        modal: { open: true, time },
        form: emptyForm,
        validationErrors: {},
        submitError: null,
      }),
    closeModal: () => set({ modal: { open: false, time: null } }),
    setClientName: (value) =>
      set((state) => ({ form: { ...state.form, clientName: value } })),
    setReason: (value) => set((state) => ({ form: { ...state.form, reason: value } })),
    clearValidationError: (field) =>
      set((state) => {
        const next = { ...state.validationErrors }
        delete next[field]
        return { validationErrors: next }
      }),
    setValidationErrors: (errors) => set({ validationErrors: errors }),
    startSubmit: () => set({ isSubmitting: true, submitError: null }),
    finishSubmit: (error = null) => set({ isSubmitting: false, submitError: error }),
    resetForm: () =>
      set({ form: emptyForm, validationErrors: {}, submitError: null }),
    setMonthState: (state) => set(state),
  }))
}

export const goToPreviousMonth = async () => {
  const current = useSchedulingCreateStore.getState().currentMonth
  await loadMonth(subMonths(current, 1))
}

export const goToNextMonth = async () => {
  const current = useSchedulingCreateStore.getState().currentMonth
  await loadMonth(addMonths(current, 1))
}

const loadMonth = async (target: Date) => {
  const store = useSchedulingCreateStore.getState()
  store.setCurrentMonth(target)
  store.setMonthState({ isLoadingMonth: true, monthError: null })

  const date = formatDdMmYyyy(target)
  const result = await fetchMonthSchedulingsAction(date)

  if (!result.success) {
    store.setMonthState({ isLoadingMonth: false, monthError: result.error })
    return
  }

  store.setMonthState({
    schedulings: result.data.schedulings,
    allowedSlots: result.data.allowedSlots,
    isLoadingMonth: false,
  })
}

export const submitScheduling = async () => {
  const state = useSchedulingCreateStore.getState()
  const errors: Partial<Record<ValidationField, string>> = {}

  if (state.form.clientName.trim().length < 2) {
    errors.clientName = 'Informe o nome do cliente (mínimo 2 caracteres).'
  }
  if (state.form.reason.trim().length < 3) {
    errors.reason = 'Informe o motivo (mínimo 3 caracteres).'
  }
  if (Object.keys(errors).length > 0) {
    state.setValidationErrors(errors)
    return
  }

  if (!state.selectedDay || !state.modal.time) {
    state.finishSubmit('Selecione um dia e horário antes de confirmar.')
    return
  }

  state.startSubmit()

  const result = await createSchedulingAction({
    startAt: composeStartAt(state.selectedDay, state.modal.time),
    clientName: state.form.clientName.trim(),
    reason: state.form.reason.trim(),
  })

  if (!result.success) {
    state.finishSubmit(result.error)
    return
  }

  useSchedulingCreateStore.setState((s) => ({
    schedulings: [...s.schedulings, result.data],
  }))
  state.finishSubmit()
  state.closeModal()
  state.resetForm()
}

const composeStartAt = (day: Date, time: string): string => {
  const [hours, minutes] = time.split(':').map(Number)
  const yyyy = day.getFullYear()
  const mm = String(day.getMonth() + 1).padStart(2, '0')
  const dd = String(day.getDate()).padStart(2, '0')
  const hh = String(hours).padStart(2, '0')
  const mi = String(minutes).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:00`
}

const formatDdMmYyyy = (date: Date): string => {
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}
