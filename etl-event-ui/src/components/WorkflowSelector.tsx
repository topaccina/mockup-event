import type { Workflow } from '../types/etl'

type Props = {
  workflows: Workflow[]
  selectedWorkflowId: string
  onWorkflowChange: (workflowId: string) => void
}

export default function WorkflowSelector({
  workflows,
  selectedWorkflowId,
  onWorkflowChange,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium text-neutral-700">Workflow</div>
      <select
        className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 shadow-sm outline-none transition-colors hover:border-neutral-300 focus:border-neutral-400"
        value={selectedWorkflowId}
        onChange={(e) => onWorkflowChange(e.target.value)}
      >
        {workflows.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name} ({w.version})
          </option>
        ))}
      </select>
    </div>
  )
}

