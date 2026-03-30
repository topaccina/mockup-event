export type ParameterType = 'string' | 'enum' | 'boolean' | 'number'

export type ParameterValue = string | number | boolean

export type TriggerPriority = 'HIGH' | 'MEDIUM' | 'LOW'
export type TriggerType = 'schedule' | 'api' | 'manual'

export type WorkflowParameterBase = {
  name: string
  type: ParameterType
  defaultValue: ParameterValue
  description?: string
}

export type WorkflowParameter =
  | (WorkflowParameterBase & {
      type: 'string'
      defaultValue: string
    })
  | (WorkflowParameterBase & {
      type: 'number'
      defaultValue: number
    })
  | (WorkflowParameterBase & {
      type: 'boolean'
      defaultValue: boolean
    })
  | (WorkflowParameterBase & {
      type: 'enum'
      defaultValue: string
      options: string[]
    })

export type Workflow = {
  id: string
  name: string
  version: string
  parameters: WorkflowParameter[]
}

export type ParameterOverrides = Partial<Record<string, ParameterValue>>

export type ScheduleTrigger = {
  id: string
  name: string
  type: 'schedule'
  priority: TriggerPriority
  active: boolean
  description?: string
  schedule: {
    frequency: 'Hourly' | 'Daily' | 'Weekly'
    time: string // e.g. "01:00"
    cron?: string
  }
  parameterOverrides: ParameterOverrides
}

export type ApiTrigger = {
  id: string
  name: string
  type: 'api'
  priority: TriggerPriority
  active: boolean
  description?: string
  api: {
    endpointPath: string // e.g. "/etl/run/sales"
    method: 'POST' | 'GET'
    examplePayload: Record<string, unknown>
  }
  parameterOverrides: ParameterOverrides
}

export type ManualTrigger = {
  id: string
  name: string
  type: 'manual'
  priority: TriggerPriority
  active: boolean
  description?: string
  manual: {
    allowManualExecution: boolean
  }
  parameterOverrides: ParameterOverrides
}

export type Trigger = ScheduleTrigger | ApiTrigger | ManualTrigger

export type ActionCondition = 'onCompletion' | 'onSuccess' | 'onFailure'
export type ActionType = 'sendNotification' | 'triggerWorkflow' | 'callWebhook'

export type Action =
  | {
      id: string
      condition: ActionCondition
      type: 'sendNotification'
      emailRecipients: string
    }
  | {
      id: string
      condition: ActionCondition
      type: 'triggerWorkflow'
      targetWorkflowId: string
    }
  | {
      id: string
      condition: ActionCondition
      type: 'callWebhook'
      webhookUrl: string
    }

export type Environment = 'dev' | 'staging' | 'prod'

export type DeploymentConfig = {
  id: string
  deploymentName: string
  environment: Environment
  active: boolean
  workflowId: string

  // Deployment-level parameter defaults (can be overridden per trigger)
  deploymentParameterOverrides: ParameterOverrides

  triggers: Trigger[]
  actions: Action[]
}

