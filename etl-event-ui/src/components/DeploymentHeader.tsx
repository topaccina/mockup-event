import type { Environment } from '../types/etl'

type Props = {
  deploymentName: string
  workflowName: string
  workflowVersion: string
  environment: Environment
  active: boolean
  onEnvironmentChange: (env: Environment) => void
}

export default function DeploymentHeader({
  deploymentName,
  workflowName,
  workflowVersion,
  environment,
  active,
  onEnvironmentChange,
}: Props) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Deployment
        </div>
        <div className="text-lg font-semibold text-neutral-900">
          {deploymentName}
        </div>
        <div className="mt-1 text-sm text-neutral-600">
          {workflowName} <span className="text-neutral-500">{workflowVersion}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Environment
          </div>
          <select
            className="h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 shadow-sm outline-none transition-colors hover:border-neutral-300 focus:border-neutral-400"
            value={environment}
            onChange={(e) => onEnvironmentChange(e.target.value as Environment)}
          >
            {(['dev', 'staging', 'prod'] as Environment[]).map((env) => (
              <option key={env} value={env}>
                {env}
              </option>
            ))}
          </select>
        </div>

        <div
          className={[
            'inline-flex h-10 items-center rounded-xl border px-3 text-sm font-semibold',
            active
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-neutral-200 bg-neutral-50 text-neutral-700',
          ].join(' ')}
        >
          {active ? 'Active' : 'Inactive'}
        </div>
      </div>
    </div>
  )
}

