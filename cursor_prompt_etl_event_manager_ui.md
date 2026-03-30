
# Prompt for Cursor
## Build React UI Prototype – Event Manager for ETL Workflow Automation

Create a frontend-only React UI prototype that allows users to configure automation triggers for ETL workflows.

No backend integration required.
Use mock JSON data stored locally.

The UI must demonstrate how users configure:

- ETL workflow deployment
- triggers
- priority per trigger
- runtime parameter overrides
- post-run actions

Keep layout simple and clean.
Use functional React components.

---

# Core Concept

Triggers start ETL workflows.

Priority is defined at trigger level.

Each workflow may have multiple triggers with different priorities.

Example:

API trigger → HIGH priority  
Schedule trigger → LOW priority  

Workflow parameters must load automatically when workflow is selected.

Parameters can be overridden at trigger level.

Workflows may have:

0 parameters
1 parameter
multiple parameters

---

# Technical Constraints

Use React (functional components)

Use simple CSS or Tailwind

Use local mock JSON data

Do not implement backend calls

Use local state (useState)

No routing required

All data can be stored in one mock configuration object

Keep code modular and readable

---

# Main Layout

Single-page layout with tabs.

Header:
Workflow name
Deployment name
Environment

Tabs:

Triggers
Parameters
Actions
Activation

---

# Components to Implement

## 1. WorkflowSelector

Dropdown or list to select workflow.

When workflow selected:
load parameter schema from mock data.

Mock workflows:

Sales ETL
Customer Dimension ETL
Product Hierarchy ETL

---

## 2. DeploymentHeader

Display:

Deployment name
Workflow name
Workflow version
Environment dropdown

---

## 3. TriggerList

Display list of triggers sorted by priority.

Each trigger shows:

Trigger name
Trigger type
Priority badge
Edit button
Enable toggle

Example:

HIGH    API urgent load
MEDIUM  Manual run
LOW     Nightly schedule

Provide button:

Add Trigger

---

## 4. TriggerForm

Fields:

triggerName (text)

triggerType (dropdown)

Options:

schedule
api
manual

priority (dropdown)

Options:

High
Medium
Low

active toggle

---

### Conditional fields

#### If schedule:

frequency dropdown:

Hourly
Daily
Weekly

time picker input

cron expression optional text field

---

#### If api:

endpointPath text input

method dropdown:

POST
GET

show example payload JSON block

---

#### If manual:

checkbox:

allow manual execution

---

## 5. ParameterOverrideTable

Auto-generated from workflow schema.

Columns:

Parameter name
Type
Default value
Override value input

Override input types:

string → text input
enum → dropdown
boolean → checkbox
number → numeric input

Overrides stored per trigger.

If override empty → use default.

---

## 6. ParametersTab

Allows setting deployment-level defaults.

Same table structure as ParameterOverrideTable.

These values apply to all triggers unless overridden.

---

## 7. ActionsTab

Allow adding actions.

Supported action types:

sendNotification
triggerWorkflow
callWebhook

Fields:

condition dropdown:

onCompletion
onSuccess
onFailure

actionType dropdown

Conditional fields:

email input
webhook URL input
target workflow dropdown

---

## 8. ActivationPanel

Display:

Deployment status indicator

toggle:

Active / Inactive

Summary:

number of triggers
number of actions

---

# Mock Data Schema

Provide local JSON object:

const workflows = [
{
id: "sales_etl",
name: "Sales ETL",
version: "v2",
parameters: [
{
name: "execution_date",
type: "string",
default: "auto"
},
{
name: "load_mode",
type: "enum",
options: ["incremental","full"],
default: "incremental"
},
{
name: "region",
type: "string",
default: "EU"
}
]
}
]

Provide initial mock deployment:

const triggers = [
{
name: "Nightly schedule",
type: "schedule",
priority: "LOW"
},
{
name: "API urgent load",
type: "api",
priority: "HIGH"
}
]

---

# Priority Display

Display priority visually:

High → red badge
Medium → orange badge
Low → grey badge

Sort trigger list by priority automatically.

Order:

High
Medium
Low

---

# UX Behavior

When workflow changes:
parameter table updates automatically.

When trigger added:
new trigger appears in list.

When priority changes:
trigger list reorders.

Forms update local state only.

No persistence required.

---

# Styling Guidance

Use simple card layout.

Clear spacing.

Readable form labels.

Priority badges visually distinct.

Keep layout minimal.

---

# Deliverable

Working React UI showing:

trigger configuration
priority ordering
parameter overrides
action configuration
deployment activation state

No backend required.
