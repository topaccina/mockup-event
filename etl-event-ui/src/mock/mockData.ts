import type {
  Action,
  DeploymentConfig,
  Environment,
  ParameterOverrides,
  ScheduleTrigger,
  Trigger,
  TriggerPriority,
  Workflow,
} from '../types/etl'

export const environments: Environment[] = ['dev', 'staging', 'prod']

export const priorityOrder: TriggerPriority[] = ['HIGH', 'MEDIUM', 'LOW']

export const workflows: Workflow[] = [
  {
    id: 'sales_etl',
    name: 'Sales ETL',
    version: 'v2',
    parameters: [
      { name: 'execution_date', type: 'string', defaultValue: 'auto', description: 'Run date; use auto for latest' },
      {
        name: 'load_mode',
        type: 'enum',
        defaultValue: 'incremental',
        options: ['incremental', 'full'],
        description: 'Whether to do incremental loads or a full refresh',
      },
      { name: 'region', type: 'string', defaultValue: 'EU', description: 'Target region for extraction' },
    ],
  },
  {
    id: 'customer_dimension_etl',
    name: 'Customer Dimension ETL',
    version: 'v1',
    parameters: [{ name: 'cutoff_date', type: 'string', defaultValue: 'auto' }],
  },
  {
    id: 'product_hierarchy_etl',
    name: 'Product Hierarchy ETL',
    version: 'v3',
    parameters: [],
  },
]

function overrides(input: ParameterOverrides): ParameterOverrides {
  return input
}

const salesSchedule: ScheduleTrigger = {
  id: 'trg_sales_nightly',
  name: 'Nightly schedule',
  type: 'schedule',
  priority: 'LOW',
  active: true,
  schedule: {
    frequency: 'Daily',
    time: '01:00',
    cron: '0 1 * * *',
  },
  parameterOverrides: overrides({}),
}

const salesApi: Trigger = {
  id: 'trg_sales_api_urgent',
  name: 'API urgent load',
  type: 'api',
  priority: 'HIGH',
  active: true,
  description: 'Runs when an external system requests an urgent refresh',
  api: {
    endpointPath: '/etl/run/sales',
    method: 'POST',
    examplePayload: { urgent: true, source: 'external-system' },
  },
  parameterOverrides: overrides({
    region: 'EU',
    load_mode: 'full',
  }),
}

const salesManual: Trigger = {
  id: 'trg_sales_manual',
  name: 'Manual execution',
  type: 'manual',
  priority: 'MEDIUM',
  active: false,
  manual: {
    allowManualExecution: true,
  },
  parameterOverrides: overrides({}),
}

export const initialActionsForSales: Action[] = [
  {
    id: 'act_sales_notify_failure',
    type: 'sendNotification',
    condition: 'onFailure',
    emailRecipients: 'alerts@company.com',
  },
  {
    id: 'act_sales_webhook_on_success',
    type: 'callWebhook',
    condition: 'onSuccess',
    webhookUrl: 'https://hooks.example.com/etl/sales',
  },
  {
    id: 'act_sales_trigger_customer_etl',
    type: 'triggerWorkflow',
    condition: 'onCompletion',
    targetWorkflowId: 'customer_dimension_etl',
  },
]

export const initialDeployment: DeploymentConfig = {
  id: 'dep_sales_prod',
  deploymentName: 'Sales_ETL_prod',
  environment: 'prod',
  active: true,
  workflowId: 'sales_etl',

  // Deployment-level defaults (can be overridden per trigger)
  deploymentParameterOverrides: overrides({
    region: 'US',
    load_mode: 'incremental',
  }),

  triggers: [salesSchedule, salesApi, salesManual],
  actions: initialActionsForSales,
}

