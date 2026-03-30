import { useMemo, useState } from 'react'
import { initialDeployment, workflows } from './mock/mockData'
import type { DeploymentConfig, ParameterOverrides } from './types/etl'
import WorkflowSelector from './components/WorkflowSelector'
import DeploymentHeader from './components/DeploymentHeader'
import TabsBar, { type TabKey } from './components/TabsBar'
import TriggersTab from './components/tabs/TriggersTab'
import ParametersTab from './components/tabs/ParametersTab'
import ActionsTab from './components/tabs/ActionsTab'
import ActivationTab from './components/tabs/ActivationTab'

function filterOverridesToWorkflow(
  deployment: DeploymentConfig,
  nextWorkflowId: string,
) {
  const nextWorkflow = workflows.find((w) => w.id === nextWorkflowId)
  const paramNames = new Set((nextWorkflow?.parameters ?? []).map((p) => p.name))

  const filteredDeploymentOverrides = Object.fromEntries(
    Object.entries(deployment.deploymentParameterOverrides).filter(([k]) =>
      paramNames.has(k),
    ),
  ) as ParameterOverrides

  const filteredTriggers: DeploymentConfig['triggers'] = deployment.triggers.map(
    (t) => ({
      ...t,
      parameterOverrides: Object.fromEntries(
        Object.entries(t.parameterOverrides ?? {}).filter(([k]) =>
          paramNames.has(k),
        ),
      ) as ParameterOverrides,
    }),
  )

  return {
    ...deployment,
    workflowId: nextWorkflowId,
    deploymentParameterOverrides: filteredDeploymentOverrides,
    triggers: filteredTriggers,
  } satisfies DeploymentConfig
}

export default function App() {
  const [deployment, setDeployment] = useState<DeploymentConfig>(initialDeployment)
  const [activeTab, setActiveTab] = useState<TabKey>('triggers')

  const selectedWorkflow = useMemo(
    () => workflows.find((w) => w.id === deployment.workflowId)!,
    [deployment.workflowId],
  )

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-2xl border border-neutral-200 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <WorkflowSelector
              workflows={workflows}
              selectedWorkflowId={deployment.workflowId}
              onWorkflowChange={(nextId) => {
                setDeployment((prev) => filterOverridesToWorkflow(prev, nextId))
                setActiveTab('triggers')
              }}
            />
            <DeploymentHeader
              deploymentName={deployment.deploymentName}
              workflowName={selectedWorkflow.name}
              workflowVersion={selectedWorkflow.version}
              environment={deployment.environment}
              active={deployment.active}
              onEnvironmentChange={(env) =>
                setDeployment((prev) => ({ ...prev, environment: env }))
              }
            />
          </div>

          <div className="mt-5">
            <TabsBar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          <div className="mt-5">
            {activeTab === 'triggers' ? (
              <TriggersTab deployment={deployment} setDeployment={setDeployment} />
            ) : null}
            {activeTab === 'parameters' ? (
              <ParametersTab deployment={deployment} setDeployment={setDeployment} />
            ) : null}
            {activeTab === 'actions' ? (
              <ActionsTab deployment={deployment} setDeployment={setDeployment} />
            ) : null}
            {activeTab === 'activation' ? (
              <ActivationTab deployment={deployment} setDeployment={setDeployment} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
