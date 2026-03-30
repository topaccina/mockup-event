# ETL Event Manager UI (Frontend Prototype)

This is a **frontend-only React + TypeScript + Vite** prototype that lets you configure:

- ETL workflow deployments  
- Triggers (schedule / API / manual) with **priority per trigger**  
- Runtime parameter overrides (deployment-level + per-trigger)  
- Post-run actions (send notification, trigger workflow, call webhook)  
- Deployment activation status and summary  

All data is **mocked in local JSON objects** and stored in React state – there is **no backend**.

---

## 1. Prerequisites

- **Node.js** 18+ (recommended: latest LTS)  
- **npm** (bundled with Node)

Check versions:

```bash
node -v
npm -v
```

---

## 2. Install dependencies

From the project folder:

```bash
cd etl-event-ui
npm install
```

This installs React, Vite, Tailwind CSS v4, and TypeScript.

---

## 3. Run the app in dev mode

```bash
npm run dev
```

Then open the URL shown in the terminal (typically `http://localhost:5173`).

You can now:

- Select different ETL workflows  
- Add / edit triggers with priorities and parameter overrides  
- Configure deployment-level parameters  
- Add post-run actions  
- Toggle deployment activation and see a summary  

Changes are **not persisted** – refreshing the page reloads the initial mock configuration.

---

## 4. Build for production

```bash
npm run build
```

The built assets will be output to the `dist` folder. To preview the production build locally:

```bash
npm run preview
```

---

## 5. Project structure (high level)

- `src/App.tsx` – main layout, header, and tab navigation  
- `src/types/etl.ts` – TypeScript types for workflows, triggers, parameters, actions, deployment  
- `src/mock/mockData.ts` – mock workflows, triggers, deployment, actions  
- `src/components/WorkflowSelector.tsx` – workflow dropdown  
- `src/components/DeploymentHeader.tsx` – deployment name, workflow, environment  
- `src/components/TabsBar.tsx` – tab strip for Triggers / Parameters / Actions / Activation  
- `src/components/tabs/TriggersTab.tsx` – trigger list, add/edit drawer, per-trigger overrides  
- `src/components/tabs/ParametersTab.tsx` – deployment-level parameter overrides  
- `src/components/tabs/ActionsTab.tsx` – actions list + add/edit drawer  
- `src/components/tabs/ActivationTab.tsx` – activation toggle + summary  
- `src/components/ParameterOverrideTable.tsx` – auto-generated parameter table  
- `src/components/PriorityBadge.tsx` – HIGH / MEDIUM / LOW visual badges  

---

## 6. Notes

- This repo is designed as a **UI/UX prototype** for an ETL event manager.  
- All behavior is implemented with local state (`useState`) only.  
- It is safe to publish this project to GitHub; there are no secrets or backend endpoints.
