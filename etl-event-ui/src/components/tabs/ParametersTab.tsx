import { useMemo } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import ParameterOverrideTable from '../ParameterOverrideTable'
import { workflows } from '../../mock/mockData'
import type { DeploymentConfig } from '../../types/etl'

type Props = {
  deployment: DeploymentConfig
  setDeployment: Dispatch<SetStateAction<DeploymentConfig>>
}

export default function ParametersTab({ deployment, setDeployment }: Props) {
  const workflow = useMemo(
    () => workflows.find((w) => w.id === deployment.workflowId)!,
    [deployment.workflowId],
  )

  const paramCount = Object.keys(deployment.deploymentParameterOverrides ?? {}).length

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-neutral-900">Parameters</div>
          <div className="mt-1 text-sm text-neutral-600">
            Deployment-level runtime defaults. They apply to all triggers unless a
            trigger overrides the same parameter.
          </div>
        </div>
        <div className="text-sm text-neutral-600">
          {paramCount} overridden value{paramCount === 1 ? '' : 's'}
        </div>
      </div>

      <div className="mt-4">
        <ParameterOverrideTable
          parameters={workflow.parameters}
          overrides={deployment.deploymentParameterOverrides}
          onOverridesChange={(next) =>
            setDeployment((prev) => ({ ...prev, deploymentParameterOverrides: next }))
          }
        />
      </div>

      <div className="mt-4 text-xs text-neutral-500">
        Precedence: deployment default → trigger override → workflow default (if no
        override exists).
      </div>
    </div>
  )
}

