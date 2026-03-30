# UI Prototype Requirements
## Event Manager – ETL Workflow Automation

### Objective
Create a frontend-only conceptual UI prototype that allows users to configure automation for ETL workflows.

The UI should demonstrate how users:

- select an ETL workflow
- create a deployment
- define triggers
- assign priority per trigger
- override runtime parameters
- define post-run actions
- visualize relative priority between triggers

No backend integration required.

Use mock data.

---

# Scope

Prototype supports ETL workflows only.

Supported trigger types:
- Schedule
- External API
- Manual

Ignore DPAT, drift monitoring, ML-specific features.

---

# Core UX Concept

Priority is assigned at trigger level.

Each trigger may start the same workflow with different urgency.

Example:

API trigger → HIGH priority
Nightly schedule → LOW priority

Workflow parameters are automatically loaded from the workflow schema and may be overridden at trigger definition time.

Workflows may have:
- zero parameters
- one parameter
- multiple parameters

---

# Navigation Structure

### Main screens

1. Workflow Catalog
2. Deployment Configuration
3. Trigger Configuration
4. Parameter Overrides
5. Actions Configuration
6. Activation Panel

Use tab navigation inside Deployment page.

---

# Screen 1 – Workflow Catalog

Display list of ETL workflows.

Example items:

ETL – Sales Aggregation v2
ETL – Customer Dimension v1
ETL – Product Hierarchy v3

User actions:

Select workflow
Create Deployment
Open Deployment

Mock workflow schema should include runtime parameters.

---

# Screen 2 – Deployment Overview

Displays:

Deployment name
Workflow name
Workflow version
Environment selector (dropdown)

Example:

Deployment: Sales_ETL_prod
Workflow: ETL – Sales Aggregation v2
Environment: prod_eu

Tabs:

Triggers
Parameters
Actions
Activation

---

# Screen 3 – Trigger List

Displays all triggers configured for deployment.

Each trigger card or row must show:

Trigger name
Trigger type
Priority
Active status

Example:

HIGH    API urgent load
MEDIUM  Manual execution
LOW     Nightly schedule

Triggers visually ordered by priority.

User actions:

Add Trigger
Edit Trigger
Enable / disable trigger

---

# Screen 4 – Add / Edit Trigger

Common fields:

Trigger name (text input)

Trigger type (dropdown)
- Schedule
- External API
- Manual

Priority selector (dropdown)
- High
- Medium
- Low

Active toggle (boolean)

Description (optional textarea)

---

## Schedule Trigger Configuration

Fields:

Frequency selector
- Hourly
- Daily
- Weekly

Optional cron expression field

Time selector

Example:

Daily at 01:00

---

## External API Trigger Configuration

Fields:

Endpoint path (text input)

HTTP method dropdown
- POST
- GET

Display example JSON payload

Example:

POST /etl/run/sales

---

## Manual Trigger Configuration

Checkbox:

Allow manual execution

---

# Screen 5 – Runtime Parameter Overrides

Parameters must load automatically when workflow is selected.

Parameters come from workflow schema mock data.

Display parameter table:

Parameter Name
Type
Default Value
Override Value (editable)
Source (optional label)

Example:

| Parameter        | Type   | Default     | Override |
|------------------|--------|------------|----------|
| execution_date   | string | auto       | [      ] |
| load_mode        | enum   | incremental| [ full ] |
| region           | string | EU         | [ EU   ] |

Override fields types:

text input
dropdown
boolean toggle
number input

If override empty → default value used.

Overrides defined per trigger.

---

# Screen 6 – Parameters Tab (Deployment-level defaults)

Displays same parameter table.

Allows optional deployment-level overrides.

These values apply to all triggers unless overridden.

---

# Screen 7 – Actions Configuration

User defines actions triggered after workflow run.

Button:

Add Action

Supported action types:

Send notification
Trigger another workflow
Call webhook

---

## Action configuration fields

Trigger condition dropdown:

On completion
On success
On failure

Action type dropdown:

Send notification
Trigger workflow
Call webhook

Example fields:

Email recipients input
Webhook URL input
Target workflow dropdown

---

# Screen 8 – Activation Panel

Displays deployment status.

Fields:

Status indicator
Active toggle

Summary:

Number of triggers
Number of actions
Default priority policy

Buttons:

Activate deployment
Deactivate deployment

---

# UI Components to Generate

Tabs navigation

Trigger list component

Trigger configuration form

Dynamic parameter form generated from mock schema

Priority dropdown selector

Actions form

Activation status panel

---

# Mock Data Requirements

Provide example workflow schema:

Sales ETL

parameters:

execution_date (string)
load_mode (enum: incremental, full)
region (string)

Example triggers:

Schedule daily 01:00 priority LOW

API trigger priority HIGH

Manual trigger priority MEDIUM

---

# Visual Style

Clean layout
Simple spacing
Form-based configuration
Minimal styling
Readable priority indicators

Optional priority badge colors:

High = red
Medium = orange
Low = grey

---

# Technical Requirements

Frontend only
React preferred
Local state only
No backend calls
No authentication
No persistence required

Mock configuration stored in JSON objects.

---

# Deliverable

Working UI prototype demonstrating:

trigger configuration
priority per trigger
parameter override behavior
action configuration
deployment activation view