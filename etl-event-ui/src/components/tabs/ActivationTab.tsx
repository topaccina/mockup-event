import { useMemo } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { DeploymentConfig } from '../../types/etl'
import PriorityBadge from '../PriorityBadge'

type Props = {
  deployment: DeploymentConfig
  setDeployment: Dispatch<SetStateAction<DeploymentConfig>>
}

export default function ActivationTab({ deployment, setDeployment }: Props) {
  const triggerCount = deployment.triggers.length
  const actionCount = deployment.actions.length

  const hasHighPriorityTrigger = useMemo(
    () => deployment.triggers.some((t) => t.priority === 'HIGH'),
    [deployment.triggers],
  )

  const anyTriggerActive = useMemo(
    () => deployment.triggers.some((t) => t.active),
    [deployment.triggers],
  )

  const statusPill = deployment.active
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : 'border-neutral-200 bg-neutral-50 text-neutral-700'

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-sm font-semibold text-neutral-900">Activation</div>
          <div className="mt-1 text-sm text-neutral-600">
            Turn the deployment on/off and review a quick configuration summary.
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className={[
                'inline-flex items-center rounded-xl border px-3 py-1 text-sm font-semibold',
                statusPill,
              ].join(' ')}
            >
              {deployment.active ? 'Active' : 'Inactive'}
            </span>
            {hasHighPriorityTrigger ? (
              <PriorityBadge priority="HIGH" />
            ) : (
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-700 ring-1 ring-neutral-200">
                No HIGH triggers
              </span>
            )}
          </div>
        </div>

        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-neutral-900">
                  Deployment state
                </div>
                <div className="mt-1 text-sm text-neutral-600">
                  {anyTriggerActive ? 'Some triggers are enabled.' : 'All triggers are disabled.'}
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-3">
                <span className="text-sm font-semibold text-neutral-700">
                  {deployment.active ? 'Active' : 'Inactive'}
                </span>
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-neutral-900"
                  checked={deployment.active}
                  onChange={() =>
                    setDeployment((prev) => ({ ...prev, active: !prev.active }))
                  }
                />
              </label>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-neutral-200 bg-white p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Triggers
                </div>
                <div className="mt-1 text-2xl font-bold text-neutral-900">
                  {triggerCount}
                </div>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Actions
                </div>
                <div className="mt-1 text-2xl font-bold text-neutral-900">
                  {actionCount}
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-neutral-500">
              Note: This is a front-end-only prototype—switching state updates local mock data only.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

