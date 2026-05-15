export interface SchedulingProps {
  id: string
  date: string
  time: string
  clientName: string
  reason: string
}

export class Scheduling {
  constructor(
    readonly id: string,
    readonly date: string,
    readonly time: string,
    readonly clientName: string,
    readonly reason: string,
    readonly createdAt: Date
  ) {}

  static create(props: SchedulingProps): Scheduling {
    return new Scheduling(
      props.id,
      props.date,
      props.time,
      props.clientName,
      props.reason,
      new Date()
    )
  }
}
