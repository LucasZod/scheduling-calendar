'use client'

import {
  format,
  getDate,
  getHours,
  getMinutes,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Bell, ChevronLeft, ChevronRight, Clock, Lock, User } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/shared/ui/Button'
import { IconButton } from '@/shared/ui/IconButton'
import { Input } from '@/shared/ui/Input'
import { Textarea } from '@/shared/ui/Textarea'
import {
  goToNextMonth,
  goToPreviousMonth,
  submitScheduling,
  useSchedulingCreateStore,
} from '@/store/scheduling-create.store'

export const SchedulingCreate = () => (
  <PageWrapper>
    <Navbar />
    <PageContent>
      <PageHeader />
      <CalendarCard />
      <SlotsPanel />
    </PageContent>
    <ConfirmModal />
  </PageWrapper>
)

const PageWrapper = ({ children }: { children: ReactNode }) => (
  <div className="bg-foreground min-h-screen">{children}</div>
)

const PageContent = ({ children }: { children: ReactNode }) => (
  <main className="mx-auto max-w-5xl px-8 py-10">{children}</main>
)

const Navbar = () => (
  <NavbarBar>
    <NavbarBrand />
    <NavbarLinks />
    <NavbarActions />
  </NavbarBar>
)

const NavbarBar = ({ children }: { children: ReactNode }) => (
  <nav className="bg-primary flex items-center justify-between px-8 py-3 text-white">
    {children}
  </nav>
)

const NavbarBrand = () => <span className="text-base font-bold">Agendamentos</span>

const NavbarLinks = () => (
  <NavbarLinksList>
    <NavLink>Início</NavLink>
    <NavLink active>Calendário</NavLink>
    <NavLink>Clientes</NavLink>
    <NavLink>Configurações</NavLink>
  </NavbarLinksList>
)

const NavbarLinksList = ({ children }: { children: ReactNode }) => (
  <ul className="flex items-center gap-6">{children}</ul>
)

const NavLink = ({ children, active = false }: { children: ReactNode; active?: boolean }) => (
  <li>
    <span className={navLinkClass(active)}>{children}</span>
  </li>
)

const navLinkClass = (active: boolean) =>
  active ? 'border-button border-b-2 pb-0.5 text-sm font-bold text-white' : 'text-sm text-white'

const NavbarActions = () => (
  <NavbarActionsRow>
    <NotificationsButton />
    <ProfileButton />
  </NavbarActionsRow>
)

const NavbarActionsRow = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center gap-3">{children}</div>
)

const NotificationsButton = () => (
  <IconButton variant="nav" aria-label="Notificações">
    <Bell className="h-5 w-5" />
  </IconButton>
)

const ProfileButton = () => (
  <IconButton variant="nav" aria-label="Perfil">
    <User className="h-5 w-5" />
  </IconButton>
)

const PageHeader = () => (
  <PageHeaderSection>
    <PageTitle />
    <PageSubtitle />
  </PageHeaderSection>
)

const PageHeaderSection = ({ children }: { children: ReactNode }) => (
  <header className="mb-6">{children}</header>
)

const PageTitle = () => <h1 className="text-text text-2xl font-bold">Agendar horário</h1>

const PageSubtitle = () => (
  <p className="text-text-muted mt-1 text-sm">
    Selecione uma data e horário disponíveis para o agendamento.
  </p>
)

const CalendarCard = () => (
  <CalendarCardWrapper>
    <CalendarHeader />
    <WeekDaysHeader />
    <DaysGrid />
  </CalendarCardWrapper>
)

const CalendarCardWrapper = ({ children }: { children: ReactNode }) => (
  <section className="bg-surface border-primary mx-auto max-w-[700px] rounded-xl border-l-4 p-6 shadow-sm">
    {children}
  </section>
)

const CalendarHeader = () => (
  <CalendarHeaderRow>
    <PrevMonthButton />
    <MonthLabel />
    <NextMonthButton />
  </CalendarHeaderRow>
)

const CalendarHeaderRow = ({ children }: { children: ReactNode }) => (
  <div className="mb-4 flex items-center justify-between">{children}</div>
)

const PrevMonthButton = () => {
  const isLoading = useSchedulingCreateStore((s) => s.isLoadingMonth)
  return (
    <IconButton onClick={goToPreviousMonth} disabled={isLoading} aria-label="Mês anterior">
      <ChevronLeft className="h-5 w-5" />
    </IconButton>
  )
}

const NextMonthButton = () => {
  const isLoading = useSchedulingCreateStore((s) => s.isLoadingMonth)
  return (
    <IconButton onClick={goToNextMonth} disabled={isLoading} aria-label="Próximo mês">
      <ChevronRight className="h-5 w-5" />
    </IconButton>
  )
}

const MonthLabel = () => {
  const currentMonth = useSchedulingCreateStore((s) => s.currentMonth)
  const label = format(currentMonth, 'MMMM yyyy', { locale: ptBR })
  return <span className="text-primary text-lg font-bold capitalize">{label}</span>
}

const WeekDaysHeader = () => (
  <WeekDaysRow>
    {weekDayLabels.map((day) => (
      <WeekDayCell key={day}>{day}</WeekDayCell>
    ))}
  </WeekDaysRow>
)

const weekDayLabels = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']

const WeekDaysRow = ({ children }: { children: ReactNode }) => (
  <div className="mb-2 grid grid-cols-7 gap-1">{children}</div>
)

const WeekDayCell = ({ children }: { children: ReactNode }) => (
  <span className="text-text-muted text-center text-xs uppercase">{children}</span>
)

const DaysGrid = () => {
  const currentMonth = useSchedulingCreateStore((s) => s.currentMonth)
  const cells = buildMonthCells(currentMonth)
  return (
    <DaysGridContainer>
      {cells.map((cell) => (
        <DayCellWrapper key={cell.date.toISOString()}>
          {cell.inCurrentMonth ? (
            <InMonthDay date={cell.date} />
          ) : (
            <OutOfMonthDay date={cell.date} />
          )}
        </DayCellWrapper>
      ))}
    </DaysGridContainer>
  )
}

const DaysGridContainer = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-7 gap-1">{children}</div>
)

const DayCellWrapper = ({ children }: { children: ReactNode }) => (
  <div className="aspect-video">{children}</div>
)

const InMonthDay = ({ date }: { date: Date }) => {
  const selectedDay = useSchedulingCreateStore((s) => s.selectedDay)
  const schedulings = useSchedulingCreateStore((s) => s.schedulings)
  const selectDay = useSchedulingCreateStore((s) => s.selectDay)

  const todayFlag = isToday(date)
  const selectedFlag = selectedDay ? isSameDay(selectedDay, date) : false
  const hasScheduling = schedulings.some((scheduling) =>
    isSameDay(new Date(scheduling.startAt), date)
  )

  return (
    <button
      type="button"
      onClick={() => selectDay(date)}
      className={inMonthDayClass(selectedFlag)}
      aria-label={`Selecionar dia ${getDate(date)}`}
      aria-pressed={selectedFlag}
    >
      <DayNumber number={getDate(date)} today={todayFlag} selected={selectedFlag} />
      {hasScheduling && <SchedulingDot />}
    </button>
  )
}

const inMonthDayClass = (selected: boolean) => {
  const base =
    'relative flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg transition-colors'
  return selected ? `${base} bg-primary/15` : `${base} hover:bg-primary/10`
}

const DayNumber = ({
  number,
  today,
  selected,
}: {
  number: number
  today: boolean
  selected: boolean
}) => <span className={dayNumberClass(today, selected)}>{number}</span>

const dayNumberClass = (today: boolean, selected: boolean) => {
  if (today) return 'text-button text-sm font-bold'
  if (selected) return 'text-primary text-sm font-bold'
  return 'text-text text-sm'
}

const SchedulingDot = () => (
  <span className="bg-button absolute bottom-1.5 h-1.5 w-1.5 rounded-full" aria-hidden="true" />
)

const OutOfMonthDay = ({ date }: { date: Date }) => (
  <span className="text-disabled-text flex h-full w-full items-center justify-center text-sm">
    {getDate(date)}
  </span>
)

const SlotsPanel = () => {
  const selectedDay = useSchedulingCreateStore((s) => s.selectedDay)
  if (!selectedDay) return null
  return (
    <SlotsPanelSection>
      <SlotsPanelHeader />
      <SlotsList />
    </SlotsPanelSection>
  )
}

const SlotsPanelSection = ({ children }: { children: ReactNode }) => (
  <section className="mx-auto mt-6 max-w-[700px]">{children}</section>
)

const SlotsPanelHeader = () => {
  const selectedDay = useSchedulingCreateStore((s) => s.selectedDay)
  if (!selectedDay) return null
  return (
    <SlotsPanelHeaderRow>
      <Clock className="text-text-muted h-4 w-4" aria-hidden="true" />
      <span className="text-text-muted text-sm">
        Horários disponíveis — {format(selectedDay, 'dd/MM/yyyy')}
      </span>
    </SlotsPanelHeaderRow>
  )
}

const SlotsPanelHeaderRow = ({ children }: { children: ReactNode }) => (
  <div className="mb-3 flex items-center gap-2">{children}</div>
)

const SlotsList = () => {
  const allowedSlots = useSchedulingCreateStore((s) => s.allowedSlots)
  const selectedDay = useSchedulingCreateStore((s) => s.selectedDay)
  const schedulings = useSchedulingCreateStore((s) => s.schedulings)

  if (!selectedDay) return null

  const takenTimes = new Set(
    schedulings
      .filter((scheduling) => isSameDay(new Date(scheduling.startAt), selectedDay))
      .map((scheduling) => formatTimeHHMM(new Date(scheduling.startAt)))
  )

  return (
    <SlotsListRow>
      {allowedSlots.map((time) =>
        takenTimes.has(time) ? (
          <LockedSlotChip key={time} time={time} />
        ) : (
          <AvailableSlotChip key={time} time={time} />
        )
      )}
    </SlotsListRow>
  )
}

const SlotsListRow = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-wrap gap-2">{children}</div>
)

const AvailableSlotChip = ({ time }: { time: string }) => {
  const openSlot = useSchedulingCreateStore((s) => s.openSlot)
  return (
    <button
      type="button"
      onClick={() => openSlot(time)}
      className="bg-surface border-primary text-primary hover:bg-primary/5 cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium"
    >
      {time}
    </button>
  )
}

const LockedSlotChip = ({ time }: { time: string }) => (
  <span
    aria-disabled="true"
    className="bg-disabled text-disabled-text flex cursor-not-allowed items-center gap-1 rounded-lg px-3 py-1.5 text-sm"
  >
    <Lock className="h-3.5 w-3.5" aria-hidden="true" />
    {time}
  </span>
)

const ConfirmModal = () => {
  const open = useSchedulingCreateStore((s) => s.modal.open)
  if (!open) return null
  return (
    <ModalOverlay>
      <ModalCard>
        <ModalTitle />
        <ModalSubtitle />
        <ClientNameField />
        <ReasonField />
        <ModalFooter>
          <CancelButton />
          <ConfirmButton />
        </ModalFooter>
        <SubmitError />
      </ModalCard>
    </ModalOverlay>
  )
}

const ModalOverlay = ({ children }: { children: ReactNode }) => (
  <div
    role="dialog"
    aria-modal="true"
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
  >
    {children}
  </div>
)

const ModalCard = ({ children }: { children: ReactNode }) => (
  <div className="bg-surface w-full max-w-[480px] rounded-xl p-6 shadow-lg">{children}</div>
)

const ModalTitle = () => <h2 className="text-text text-lg font-bold">Confirmar agendamento</h2>

const ModalSubtitle = () => {
  const selectedDay = useSchedulingCreateStore((s) => s.selectedDay)
  const time = useSchedulingCreateStore((s) => s.modal.time)
  if (!selectedDay || !time) return null
  return (
    <p className="text-primary mt-1 text-sm font-bold">
      {format(selectedDay, 'dd/MM/yyyy')} às {time}
    </p>
  )
}

const ClientNameField = () => {
  const value = useSchedulingCreateStore((s) => s.form.clientName)
  const setClientName = useSchedulingCreateStore((s) => s.setClientName)
  const error = useSchedulingCreateStore((s) => s.validationErrors.clientName)
  const clearValidationError = useSchedulingCreateStore((s) => s.clearValidationError)

  return (
    <FieldContainer>
      <FieldLabel htmlFor="clientName">Nome do cliente</FieldLabel>
      <Input
        id="clientName"
        value={value}
        onChange={(event) => {
          setClientName(event.target.value)
          if (error) clearValidationError('clientName')
        }}
        aria-invalid={Boolean(error)}
        aria-label="Nome do cliente"
      />
      {error && <FieldError>{error}</FieldError>}
    </FieldContainer>
  )
}

const ReasonField = () => {
  const value = useSchedulingCreateStore((s) => s.form.reason)
  const setReason = useSchedulingCreateStore((s) => s.setReason)
  const error = useSchedulingCreateStore((s) => s.validationErrors.reason)
  const clearValidationError = useSchedulingCreateStore((s) => s.clearValidationError)

  return (
    <FieldContainer>
      <FieldLabel htmlFor="reason">Motivo do agendamento</FieldLabel>
      <Textarea
        id="reason"
        value={value}
        onChange={(event) => {
          setReason(event.target.value)
          if (error) clearValidationError('reason')
        }}
        aria-invalid={Boolean(error)}
        aria-label="Motivo do agendamento"
      />
      {error && <FieldError>{error}</FieldError>}
    </FieldContainer>
  )
}

const FieldContainer = ({ children }: { children: ReactNode }) => (
  <div className="mt-4">{children}</div>
)

const FieldLabel = ({ htmlFor, children }: { htmlFor: string; children: ReactNode }) => (
  <label htmlFor={htmlFor} className="text-text mb-1 block text-sm font-medium">
    {children}
  </label>
)

const FieldError = ({ children }: { children: ReactNode }) => (
  <span className="mt-1 block text-xs text-red-500">{children}</span>
)

const ModalFooter = ({ children }: { children: ReactNode }) => (
  <div className="mt-6 flex justify-end gap-2">{children}</div>
)

const CancelButton = () => {
  const closeModal = useSchedulingCreateStore((s) => s.closeModal)
  const isSubmitting = useSchedulingCreateStore((s) => s.isSubmitting)
  return (
    <Button variant="ghost" onClick={closeModal} disabled={isSubmitting}>
      Cancelar
    </Button>
  )
}

const ConfirmButton = () => {
  const isSubmitting = useSchedulingCreateStore((s) => s.isSubmitting)
  return (
    <Button
      variant="primary"
      onClick={submitScheduling}
      disabled={isSubmitting}
      aria-busy={isSubmitting}
    >
      {isSubmitting ? 'Aguarde...' : 'Confirmar'}
    </Button>
  )
}

const SubmitError = () => {
  const error = useSchedulingCreateStore((s) => s.submitError)
  if (!error) return null
  return <p className="mt-3 text-sm text-red-500">{error}</p>
}

const buildMonthCells = (reference: Date) => {
  const monthStart = startOfMonth(reference)
  const startDayOfWeek = monthStart.getDay()
  const firstCellDate = new Date(monthStart)
  firstCellDate.setDate(firstCellDate.getDate() - startDayOfWeek)

  const cells: { date: Date; inCurrentMonth: boolean }[] = []
  for (let offset = 0; offset < 42; offset += 1) {
    const date = new Date(firstCellDate)
    date.setDate(firstCellDate.getDate() + offset)
    cells.push({ date, inCurrentMonth: isSameMonth(date, reference) })
  }
  return cells
}

const formatTimeHHMM = (date: Date) => {
  const hours = String(getHours(date)).padStart(2, '0')
  const minutes = String(getMinutes(date)).padStart(2, '0')
  return `${hours}:${minutes}`
}
