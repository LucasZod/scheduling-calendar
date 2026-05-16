export interface SchedulingProps {
  id: string
  startAt: Date
  endAt: Date
  clientName: string
  reason: string
}

export class Scheduling {
  constructor(
    readonly id: string,
    readonly startAt: Date,
    readonly endAt: Date,
    readonly clientName: string,
    readonly reason: string,
    readonly createdAt: Date
  ) {}

  static create(props: SchedulingProps): Scheduling {
    return new Scheduling(
      props.id,
      props.startAt,
      props.endAt,
      props.clientName,
      props.reason,
      new Date()
    )
  }
}
