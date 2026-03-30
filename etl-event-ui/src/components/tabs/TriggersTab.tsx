import { useMemo, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import ParameterOverrideTable from '../ParameterOverrideTable'
import PriorityBadge from '../PriorityBadge'
import { priorityOrder, workflows } from '../../mock/mockData'
import type {
  DeploymentConfig,
  ParameterOverrides,
  Trigger,
  TriggerPriority,
  TriggerType,
} from '../../types/etl'

type Props = {
  deployment: DeploymentConfig
  setDeployment: Dispatch<SetStateAction<DeploymentConfig>>
}

type TriggerDraft = {
  id?: string
  name: string
  type: TriggerType
  priority: TriggerPriority
  active: boolean
  description?: string
  schedule?: {
    frequency: 'Hourly' | 'Daily' | 'Weekly'
    time: string
    cron?: string
  }
  api?: {
    endpointPath: string
    method: 'POST' | 'GET'
    examplePayload: Record<string, unknown>
  }
  manual?: {
    allowManualExecution: boolean
  }
  parameterOverrides: ParameterOverrides
}

const typeLabel: Record<TriggerType, string> = {
  schedule: 'Schedule',
  api: 'API',
  manual: 'Manual',
}

function createTriggerId() {
  return `trg_${Math.random().toString(16).slice(2)}`
}

function sortByPriority(a: Trigger, b: Trigger) {
  const ai = priorityOrder.indexOf(a.priority)
  const bi = priorityOrder.indexOf(b.priority)
  if (ai !== bi) return ai - bi
  return a.name.localeCompare(b.name)
}

export default function TriggersTab({
  deployment,
  setDeployment,
}: Props) {
  const workflow = useMemo(
    () => workflows.find((w) => w.id === deployment.workflowId)!,
    [deployment.workflowId],
  )

  const sortedTriggers = useMemo(() => {
    return [...deployment.triggers].sort(sortByPriority)
  }, [deployment.triggers])

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [draftMode, setDraftMode] = useState<'create' | 'edit'>('create')
  const [draft, setDraft] = useState<TriggerDraft>(() => ({
    name: '',
    type: 'schedule',
    priority: 'LOW',
    active: true,
    schedule: { frequency: 'Daily', time: '01:00', cron: '' },
    parameterOverrides: {},
  }))

  const openCreate = () => {
    setDraftMode('create')
    setDraft({
      name: '',
      type: 'schedule',
      priority: 'LOW',
      active: true,
      schedule: { frequency: 'Daily', time: '01:00', cron: '' },
      parameterOverrides: {},
    })
    setDrawerOpen(true)
  }

  const openEdit = (trigger: Trigger) => {
    setDraftMode('edit')
    if (trigger.type === 'schedule') {
      setDraft({
        id: trigger.id,
        name: trigger.name,
        type: trigger.type,
        priority: trigger.priority,
        active: trigger.active,
        description: trigger.description,
        schedule: trigger.schedule,
        parameterOverrides: trigger.parameterOverrides,
      })
    } else if (trigger.type === 'api') {
      setDraft({
        id: trigger.id,
        name: trigger.name,
        type: trigger.type,
        priority: trigger.priority,
        active: trigger.active,
        description: trigger.description,
        api: trigger.api,
        parameterOverrides: trigger.parameterOverrides,
      })
    } else {
      setDraft({
        id: trigger.id,
        name: trigger.name,
        type: trigger.type,
        priority: trigger.priority,
        active: trigger.active,
        description: trigger.description,
        manual: trigger.manual,
        parameterOverrides: trigger.parameterOverrides,
      })
    }
    setDrawerOpen(true)
  }

  const closeDrawer = () => setDrawerOpen(false)

  const setDraftType = (nextType: TriggerType) => {
    setDraft((prev) => {
      if (nextType === 'schedule') {
        return {
          ...prev,
          type: nextType,
          schedule: prev.schedule ?? { frequency: 'Daily', time: '01:00', cron: '' },
          api: undefined,
          manual: undefined,
        }
      }

      if (nextType === 'api') {
        return {
          ...prev,
          type: nextType,
          api:
            prev.api ?? ({
              endpointPath: `/etl/run/${deployment.workflowId}`,
              method: 'POST',
              examplePayload: { urgent: true },
            } as TriggerDraft['api']),
          schedule: undefined,
          manual: undefined,
        }
      }

      return {
        ...prev,
        type: nextType,
        manual: prev.manual ?? { allowManualExecution: true },
        schedule: undefined,
        api: undefined,
      }
    })
  }

  const toTrigger = (): Trigger => {
    if (draft.type === 'schedule') {
      return {
        id: draftMode === 'create' ? createTriggerId() : (draft.id as string),
        name: draft.name.trim(),
        type: 'schedule',
        priority: draft.priority,
        active: draft.active,
        description: draft.description,
        schedule: draft.schedule ?? {
          frequency: 'Daily',
          time: '01:00',
          cron: '',
        },
        parameterOverrides: draft.parameterOverrides,
      }
    }

    if (draft.type === 'api') {
      return {
        id: draftMode === 'create' ? createTriggerId() : (draft.id as string),
        name: draft.name.trim(),
        type: 'api',
        priority: draft.priority,
        active: draft.active,
        description: draft.description,
        api: draft.api ?? {
          endpointPath: `/etl/run/${deployment.workflowId}`,
          method: 'POST',
          examplePayload: { urgent: true },
        },
        parameterOverrides: draft.parameterOverrides,
      }
    }

    return {
      id: draftMode === 'create' ? createTriggerId() : (draft.id as string),
      name: draft.name.trim(),
      type: 'manual',
      priority: draft.priority,
      active: draft.active,
      description: draft.description,
      manual: draft.manual ?? { allowManualExecution: true },
      parameterOverrides: draft.parameterOverrides,
    }
  }

  const saveDraft = () => {
    if (!draft.name.trim()) return

    const nextTrigger = toTrigger()
    setDeployment((prev) => {
      const nextTriggers =
        draftMode === 'create'
          ? [...prev.triggers, nextTrigger]
          : prev.triggers.map((t) => (t.id === nextTrigger.id ? nextTrigger : t))

      nextTriggers.sort(sortByPriority)
      return { ...prev, triggers: nextTriggers }
    })

    closeDrawer()
  }

  const toggleTriggerActive = (id: string) => {
    setDeployment((prev) => ({
      ...prev,
      triggers: prev.triggers.map((t) =>
        t.id === id ? { ...t, active: !t.active } : t,
      ),
    }))
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-neutral-900">Triggers</div>
          <div className="mt-1 text-sm text-neutral-600">
            Configure schedule/API/manual triggers. They are ordered by priority
            (High → Medium → Low).
          </div>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="h-10 rounded-xl bg-neutral-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
        >
          Add Trigger
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="max-h-[420px] overflow-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-neutral-600">
                <th className="px-4 py-3">Trigger</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Enabled</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {sortedTriggers.map((t) => (
                <tr key={t.id} className="hover:bg-neutral-50/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900">{t.name}</div>
                    {t.description ? (
                      <div className="mt-1 text-xs text-neutral-500">{t.description}</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700">
                    {typeLabel[t.type]}
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={t.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-neutral-900"
                        checked={t.active}
                        onChange={() => toggleTriggerActive(t.id)}
                      />
                    </label>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(t)}
                      className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}

              {sortedTriggers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-neutral-600">
                    No triggers configured yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-neutral-900/40"
            onClick={closeDrawer}
            role="presentation"
          />

          <div className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold text-neutral-900">
                  {draftMode === 'create' ? 'Add Trigger' : 'Edit Trigger'}
                </div>
                <div className="mt-1 text-sm text-neutral-600">
                  Configure priority, activation, and runtime parameter overrides for{' '}
                  {workflow.name} ({workflow.version}).
                </div>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-neutral-700">
                    Trigger name
                    <input
                      className="mt-1 h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition hover:border-neutral-300 focus:border-neutral-400"
                      type="text"
                      value={draft.name}
                      onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Nightly schedule"
                    />
                  </label>
                </div>

                <label className="text-sm font-semibold text-neutral-700">
                  Trigger type
                  <select
                    className="mt-1 h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition hover:border-neutral-300 focus:border-neutral-400"
                    value={draft.type}
                    onChange={(e) => setDraftType(e.target.value as TriggerType)}
                  >
                    <option value="schedule">Schedule</option>
                    <option value="api">External API</option>
                    <option value="manual">Manual</option>
                  </select>
                </label>

                <label className="text-sm font-semibold text-neutral-700">
                  Priority
                  <select
                    className="mt-1 h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition hover:border-neutral-300 focus:border-neutral-400"
                    value={draft.priority}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        priority: e.target.value as TriggerPriority,
                      }))
                    }
                  >
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </label>

                <label className="text-sm font-semibold text-neutral-700">
                  Enabled
                  <div className="mt-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-neutral-900"
                      checked={draft.active}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, active: e.target.checked }))
                      }
                    />
                  </div>
                </label>
              </div>

              {draft.type === 'schedule' ? (
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="text-sm font-semibold text-neutral-900">
                    Schedule configuration
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label>
                      <div className="text-sm font-semibold text-neutral-700">
                        Frequency
                      </div>
                      <select
                        className="mt-1 h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition hover:border-neutral-300 focus:border-neutral-400"
                        value={draft.schedule?.frequency ?? 'Daily'}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            schedule: {
                              ...(prev.schedule ?? {
                                frequency: 'Daily',
                                time: '01:00',
                                cron: '',
                              }),
                              frequency: e.target.value as 'Hourly' | 'Daily' | 'Weekly',
                            },
                          }))
                        }
                      >
                        <option value="Hourly">Hourly</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                      </select>
                    </label>

                    <label>
                      <div className="text-sm font-semibold text-neutral-700">
                        Time
                      </div>
                      <input
                        className="mt-1 h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition hover:border-neutral-300 focus:border-neutral-400"
                        type="time"
                        value={draft.schedule?.time ?? '01:00'}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            schedule: {
                              ...(prev.schedule ?? {
                                frequency: 'Daily',
                                time: '01:00',
                                cron: '',
                              }),
                              time: e.target.value,
                            },
                          }))
                        }
                      />
                    </label>

                    <label className="sm:col-span-2">
                      <div className="text-sm font-semibold text-neutral-700">
                        Cron expression (optional)
                      </div>
                      <input
                        className="mt-1 h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition hover:border-neutral-300 focus:border-neutral-400"
                        type="text"
                        value={draft.schedule?.cron ?? ''}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            schedule: {
                              ...(prev.schedule ?? {
                                frequency: 'Daily',
                                time: '01:00',
                                cron: '',
                              }),
                              cron: e.target.value,
                            },
                          }))
                        }
                        placeholder="e.g. 0 1 * * *"
                      />
                    </label>
                  </div>
                </div>
              ) : null}

              {draft.type === 'api' ? (
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="text-sm font-semibold text-neutral-900">
                    External API configuration
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="sm:col-span-2">
                      <div className="text-sm font-semibold text-neutral-700">
                        Endpoint path
                      </div>
                      <input
                        className="mt-1 h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition hover:border-neutral-300 focus:border-neutral-400"
                        type="text"
                        value={draft.api?.endpointPath ?? ''}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            api: {
                              ...(prev.api ?? {
                                endpointPath: '',
                                method: 'POST',
                                examplePayload: { urgent: true },
                              }),
                              endpointPath: e.target.value,
                            },
                          }))
                        }
                        placeholder="/etl/run/sales"
                      />
                    </label>

                    <label>
                      <div className="text-sm font-semibold text-neutral-700">
                        HTTP method
                      </div>
                      <select
                        className="mt-1 h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition hover:border-neutral-300 focus:border-neutral-400"
                        value={draft.api?.method ?? 'POST'}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            api: {
                              ...(prev.api ?? {
                                endpointPath: '',
                                method: 'POST',
                                examplePayload: { urgent: true },
                              }),
                              method: e.target.value as 'POST' | 'GET',
                            },
                          }))
                        }
                      >
                        <option value="POST">POST</option>
                        <option value="GET">GET</option>
                      </select>
                    </label>

                    <div className="sm:col-span-1" />

                    <div className="sm:col-span-2">
                      <div className="text-sm font-semibold text-neutral-700">
                        Example payload
                      </div>
                      <pre className="mt-2 max-h-36 overflow-auto rounded-xl border border-neutral-200 bg-white p-3 text-xs text-neutral-800">
                        {JSON.stringify(draft.api?.examplePayload ?? {}, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : null}

              {draft.type === 'manual' ? (
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="text-sm font-semibold text-neutral-900">
                    Manual trigger configuration
                  </div>
                  <label className="mt-3 inline-flex items-center gap-3 text-sm font-semibold text-neutral-700">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-neutral-900"
                      checked={draft.manual?.allowManualExecution ?? true}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          manual: { ...(prev.manual ?? { allowManualExecution: true }), allowManualExecution: e.target.checked },
                        }))
                      }
                    />
                    Allow manual execution
                  </label>
                </div>
              ) : null}

              <div>
                <div className="text-sm font-semibold text-neutral-900">
                  Runtime parameter overrides
                </div>
                <div className="mt-2 text-sm text-neutral-600">
                  Overrides apply only for this trigger. If an override is empty, the
                  workflow default value is used.
                </div>
                <div className="mt-4">
                  <ParameterOverrideTable
                    parameters={workflow.parameters}
                    overrides={draft.parameterOverrides}
                    onOverridesChange={(next) =>
                      setDraft((prev) => ({ ...prev, parameterOverrides: next }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-neutral-200 pt-4">
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="h-10 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveDraft}
                  className="h-10 rounded-xl bg-neutral-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-50"
                  disabled={!draft.name.trim()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

