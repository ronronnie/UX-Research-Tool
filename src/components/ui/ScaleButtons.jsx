import clsx from 'clsx'

/**
 * Horizontal row of numbered rating buttons.
 * Used for SUS (1–5), SEQ (1–7), and NPS (0–10).
 *
 * Props: min, max, value, onChange, startLabel, endLabel, label, colorScale
 * colorScale: if true, buttons shift from red→green across the range
 */
export default function ScaleButtons({
  min = 1,
  max = 5,
  value,
  onChange,
  startLabel,
  endLabel,
  label,
  colorScale = false,
  className = '',
}) {
  const range = Array.from({ length: max - min + 1 }, (_, i) => i + min)

  const getColor = (n) => {
    if (!colorScale) return null
    const pos = (n - min) / (max - min)
    if (pos < 0.34) return 'selected-red'
    if (pos < 0.67) return 'selected-amber'
    return 'selected-green'
  }

  const colorMap = {
    'selected-red':   'border-accent-red   text-accent-red   bg-accent-red/15',
    'selected-amber': 'border-accent-amber text-accent-amber bg-accent-amber/15',
    'selected-green': 'border-accent-green text-accent-green bg-accent-green/15',
  }

  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      {label && <span className="text-sm font-medium text-text-secondary">{label}</span>}

      <div className="flex flex-wrap gap-1.5">
        {range.map(n => {
          const isSelected = value === n
          const colorKey = getColor(n)

          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={clsx(
                'w-9 h-9 rounded-lg border text-sm font-semibold transition-all',
                isSelected
                  ? colorKey
                    ? colorMap[colorKey]
                    : 'border-accent-green text-accent-green bg-accent-green/15'
                  : 'border-border text-text-muted bg-bg-tertiary hover:border-border-light hover:text-text-primary'
              )}
            >
              {n}
            </button>
          )
        })}
      </div>

      {(startLabel || endLabel) && (
        <div className="flex justify-between">
          <span className="text-xs text-text-muted">{startLabel}</span>
          <span className="text-xs text-text-muted">{endLabel}</span>
        </div>
      )}
    </div>
  )
}
