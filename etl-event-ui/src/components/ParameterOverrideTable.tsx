import type {
  ParameterOverrides,
  WorkflowParameter,
  ParameterValue,
} from '../types/etl'

type Props = {
  parameters: WorkflowParameter[]
  overrides: ParameterOverrides
  onOverridesChange: (next: ParameterOverrides) => void
}

function defaultLabel(v: ParameterValue) {
  return typeof v === 'boolean' ? (v ? 'true' : 'false') : String(v)
}

export default function ParameterOverrideTable({
  parameters,
  overrides,
  onOverridesChange,
}: Props) {
  if (parameters.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm text-neutral-600">
        This workflow has no runtime parameters.
      </div>
    )
  }

  const getEffectiveValue = (param: WorkflowParameter): ParameterValue => {
    return (overrides[param.name] as ParameterValue | undefined) ?? param.defaultValue
  }

  const setOverrideIfDifferent = (
    param: WorkflowParameter,
    nextEffectiveValue: ParameterValue,
  ) => {
    const defaultValue = param.defaultValue
    if (nextEffectiveValue === defaultValue) {
      const { [param.name]: _, ...rest } = overrides
      onOverridesChange(rest)
      return
    }

    onOverridesChange({
      ...overrides,
      [param.name]: nextEffectiveValue,
    })
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[640px] divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white text-sm">
        <thead className="bg-neutral-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-neutral-700">
              Parameter
            </th>
            <th className="px-4 py-3 text-left font-semibold text-neutral-700">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-neutral-700">
              Default value
            </th>
            <th className="px-4 py-3 text-left font-semibold text-neutral-700">
              Override
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {parameters.map((param) => {
            const effectiveValue = getEffectiveValue(param)

            return (
              <tr key={param.name}>
                <td className="px-4 py-3 font-medium text-neutral-900">
                  {param.name}
                </td>
                <td className="px-4 py-3 text-neutral-600">{param.type}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {defaultLabel(param.defaultValue)}
                </td>
                <td className="px-4 py-3">
                  {param.type === 'string' ? (
                    <input
                      className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 outline-none transition hover:border-neutral-300 focus:border-neutral-400"
                      type="text"
                      value={String(effectiveValue)}
                      onChange={(e) => {
                        setOverrideIfDifferent(param, e.target.value)
                      }}
                    />
                  ) : param.type === 'enum' ? (
                    <select
                      className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 outline-none transition hover:border-neutral-300 focus:border-neutral-400"
                      value={String(effectiveValue)}
                      onChange={(e) => {
                        setOverrideIfDifferent(param, e.target.value)
                      }}
                    >
                      {param.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : param.type === 'boolean' ? (
                    <label className="inline-flex items-center gap-2">
                      <input
                        className="h-4 w-4 accent-neutral-900"
                        type="checkbox"
                        checked={Boolean(effectiveValue)}
                        onChange={(e) => {
                          setOverrideIfDifferent(param, e.target.checked)
                        }}
                      />
                      <span className="text-neutral-600">
                        {Boolean(effectiveValue) ? 'true' : 'false'}
                      </span>
                    </label>
                  ) : (
                    <input
                      className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 outline-none transition hover:border-neutral-300 focus:border-neutral-400"
                      type="number"
                      value={Number(effectiveValue)}
                      onChange={(e) => {
                        const raw = e.target.value
                        if (raw === '') {
                          const { [param.name]: _, ...rest } = overrides
                          onOverridesChange(rest)
                          return
                        }
                        const num = Number(raw)
                        setOverrideIfDifferent(param, num)
                      }}
                    />
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

