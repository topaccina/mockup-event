type TabKey = 'triggers' | 'parameters' | 'actions' | 'activation'

type Tab = { key: TabKey; label: string }

const tabs: Tab[] = [
  { key: 'triggers', label: 'Triggers' },
  { key: 'parameters', label: 'Parameters' },
  { key: 'actions', label: 'Actions' },
  { key: 'activation', label: 'Activation' },
]

type Props = {
  activeTab: TabKey
  onTabChange: (tab: TabKey) => void
}

export default function TabsBar({ activeTab, onTabChange }: Props) {
  return (
    <div className="flex w-full gap-2 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={[
              'relative whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold outline-none transition',
              isActive
                ? 'bg-neutral-900 text-white'
                : 'bg-white text-neutral-700 hover:bg-neutral-100',
            ].join(' ')}
          >
            {tab.label}
            {isActive ? (
              <span className="pointer-events-none absolute inset-x-2 -bottom-1 h-0.5 rounded bg-neutral-900" />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

export type { TabKey }

