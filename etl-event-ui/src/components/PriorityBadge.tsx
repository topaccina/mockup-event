import type { TriggerPriority } from '../types/etl'

type Props = {
  priority: TriggerPriority
}

const labelByPriority: Record<TriggerPriority, string> = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
}

export default function PriorityBadge({ priority }: Props) {
  const cls =
    priority === 'HIGH'
      ? 'bg-red-50 text-red-700 ring-red-200'
      : priority === 'MEDIUM'
        ? 'bg-amber-50 text-amber-700 ring-amber-200'
        : 'bg-neutral-50 text-neutral-700 ring-neutral-200'

  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1',
        cls,
      ].join(' ')}
    >
      {labelByPriority[priority]}
    </span>
  )
}

