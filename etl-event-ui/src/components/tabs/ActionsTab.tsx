import { useMemo, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { workflows } from '../../mock/mockData'
import type { Action, ActionCondition, ActionType, DeploymentConfig } from '../../types/etl'

type Props = {
  deployment: DeploymentConfig
  setDeployment: Dispatch<SetStateAction<DeploymentConfig>>
}

type ActionDraft = {
  id?: string
  condition: ActionCondition
  type: ActionType
  emailRecipients: string
  targetWorkflowId: string
  webhookUrl: string
}

const conditionLabel: Record<ActionCondition, string> = {
  onCompletion: 'On completion',
  onSuccess: 'On success',
  onFailure: 'On failure',
}

const typeLabel: Record<ActionType, string> = {
  sendNotification: 'Send notification',
  triggerWorkflow: 'Trigger workflow',
  callWebhook: 'Call webhook',
}

function createActionId() {
  return `act_${Math.random().toString(16).slice(2)}`
}

function actionToDraft(action: Action): ActionDraft {
  if (action.type === 'sendNotification') {
    return {
      id: action.id,
      condition: action.condition,
      type: action.type,
      emailRecipients: action.emailRecipients,
      targetWorkflowId: workflows[0]?.id ?? '',
      webhookUrl: '',
    }
  }
  if (action.type === 'triggerWorkflow') {
    return {
      id: action.id,
      condition: action.condition,
      type: action.type,
      emailRecipients: '',
      targetWorkflowId: action.targetWorkflowId,
      webhookUrl: '',
    }
  }

  return {
    id: action.id,
    condition: action.condition,
    type: action.type,
    emailRecipients: '',
    targetWorkflowId: workflows[0]?.id ?? '',
    webhookUrl: action.webhookUrl,
  }
}

export default function ActionsTab({ deployment, setDeployment }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [draftMode, setDraftMode] = useState<'create' | 'edit'>('create')

  const defaultTargetWorkflowId = useMemo(
    () => workflows.find((w) => w.id !== deployment.workflowId)?.id ?? workflows[0]?.id ?? '',
    [deployment.workflowId],
  )

  const [draft, setDraft] = useState<ActionDraft>(() => ({
    condition: 'onFailure',
    type: 'sendNotification',
    emailRecipients: 'alerts@company.com',
    targetWorkflowId: defaultTargetWorkflowId,
    webhookUrl: 'https://hooks.example.com/etl',
  }))

  const openCreate = () => {
    setDraftMode('create')
    setDraft({
      condition: 'onFailure',
      type: 'sendNotification',
      emailRecipients: '',
      targetWorkflowId: defaultTargetWorkflowId,
      webhookUrl: '',
    })
    setDrawerOpen(true)
  }

  const openEdit = (action: Action) => {
    setDraftMode('edit')
    setDraft(actionToDraft(action))
    setDrawerOpen(true)
  }

  const closeDrawer = () => setDrawerOpen(false)

  const saveDraft = () => {
    if (!draft.condition) return

    const nextAction: Action =
      draft.type === 'sendNotification'
        ? {
            id: draftMode === 'create' ? createActionId() : (draft.id as string),
            type: 'sendNotification',
            condition: draft.condition,
            emailRecipients: draft.emailRecipients.trim(),
          }
        : draft.type === 'triggerWorkflow'
          ? {
              id: draftMode === 'create' ? createActionId() : (draft.id as string),
              type: 'triggerWorkflow',
              condition: draft.condition,
              targetWorkflowId: draft.targetWorkflowId,
            }
          : {
              id: draftMode === 'create' ? createActionId() : (draft.id as string),
              type: 'callWebhook',
              condition: draft.condition,
              webhookUrl: draft.webhookUrl.trim(),
            }

    setDeployment((prev) => {
      const nextActions =
        draftMode === 'create'
          ? [...prev.actions, nextAction]
          : prev.actions.map((a) => (a.id === nextAction.id ? nextAction : a))

      return { ...prev, actions: nextActions }
    })

    closeDrawer()
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-neutral-900">Actions</div>
          <div className="mt-1 text-sm text-neutral-600">
            Post-run actions for this deployment. (Currently {deployment.actions.length}{' '}
            configured)
          </div>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="h-10 rounded-xl bg-neutral-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
        >
          Add Action
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="max-h-[420px] overflow-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-neutral-600">
                <th className="px-4 py-3">Condition</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Summary</th>
                <th className="px-4 py-3 text-right"> </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {deployment.actions.map((a) => {
                const summary =
                  a.type === 'sendNotification'
                    ? `Email: ${a.emailRecipients}`
                    : a.type === 'triggerWorkflow'
                      ? `Target: ${workflows.find((w) => w.id === a.targetWorkflowId)?.name ?? a.targetWorkflowId}`
                      : `Webhook: ${a.webhookUrl}`

                return (
                  <tr key={a.id} className="hover:bg-neutral-50/50">
                    <td className="px-4 py-3 text-sm text-neutral-700">
                      {conditionLabel[a.condition]}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-neutral-900">
                      {typeLabel[a.type]}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {summary}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openEdit(a)}
                        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                )
              })}
              {deployment.actions.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-sm text-neutral-600"
                  >
                    No actions configured yet.
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
                  {draftMode === 'create' ? 'Add Action' : 'Edit Action'}
                </div>
                <div className="mt-1 text-sm text-neutral-600">
                  Configure what should happen after this ETL workflow runs.
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
                <label className="sm:col-span-2 text-sm font-semibold text-neutral-700">
                  Condition
                  <select
                    className="mt-1 h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition hover:border-neutral-300 focus:border-neutral-400"
                    value={draft.condition}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        condition: e.target.value as ActionCondition,
                      }))
                    }
                  >
                    <option value="onCompletion">On completion</option>
                    <option value="onSuccess">On success</option>
                    <option value="onFailure">On failure</option>
                  </select>
                </label>

                <label className="text-sm font-semibold text-neutral-700">
                  Action type
                  <select
                    className="mt-1 h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition hover:border-neutral-300 focus:border-neutral-400"
                    value={draft.type}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        type: e.target.value as ActionType,
                      }))
                    }
                  >
                    <option value="sendNotification">Send notification</option>
                    <option value="triggerWorkflow">Trigger workflow</option>
                    <option value="callWebhook">Call webhook</option>
                  </select>
                </label>

                <div />
              </div>

              {draft.type === 'sendNotification' ? (
                <label className="block text-sm font-semibold text-neutral-700">
                  Email recipients
                  <input
                    className="mt-1 h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition hover:border-neutral-300 focus:border-neutral-400"
                    type="text"
                    value={draft.emailRecipients}
                    onChange={(e) => setDraft((prev) => ({ ...prev, emailRecipients: e.target.value }))}
                    placeholder="alerts@company.com"
                  />
                </label>
              ) : null}

              {draft.type === 'triggerWorkflow' ? (
                <label className="block text-sm font-semibold text-neutral-700">
                  Target workflow
                  <select
                    className="mt-1 h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition hover:border-neutral-300 focus:border-neutral-400"
                    value={draft.targetWorkflowId}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, targetWorkflowId: e.target.value }))
                    }
                  >
                    {workflows.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.version})
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              {draft.type === 'callWebhook' ? (
                <label className="block text-sm font-semibold text-neutral-700">
                  Webhook URL
                  <input
                    className="mt-1 h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition hover:border-neutral-300 focus:border-neutral-400"
                    type="text"
                    value={draft.webhookUrl}
                    onChange={(e) => setDraft((prev) => ({ ...prev, webhookUrl: e.target.value }))}
                    placeholder="https://hooks.example.com/etl"
                  />
                </label>
              ) : null}

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
                  className="h-10 rounded-xl bg-neutral-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
                  disabled={
                    draft.type === 'sendNotification'
                      ? draft.emailRecipients.trim().length === 0
                      : draft.type === 'triggerWorkflow'
                        ? draft.targetWorkflowId.trim().length === 0
                        : draft.webhookUrl.trim().length === 0
                  }
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

