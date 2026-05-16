'use client'

import {
  initializeSchedulingCreateStore,
  type SchedulingCreateStoreProps,
} from '@/store/scheduling-create.store'

interface Props {
  initialValues: Partial<SchedulingCreateStoreProps>
}

export const SchedulingCreateInitializer = ({ initialValues }: Props) => {
  initializeSchedulingCreateStore({ initialValues })
  return null
}
