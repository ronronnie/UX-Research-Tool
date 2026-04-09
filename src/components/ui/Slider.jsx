import clsx from 'clsx'

/**
 * Range slider with optional start/end labels and current value display.
 * Props: min, max, step, value, onChange, startLabel, endLabel, showValue, className
 */
export default function Slider({
  min = 1,
  max = 10,
  step = 1,
  value,
  onChange,
  startLabel,
  endLabel,
  showValue = true,
  label,
  className = '',
}) {
  const pct = value != null ? ((value - min) / (max - min)) * 100 : 0

  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-text-secondary">{label}</span>
          {showValue && value != null && (
            <span className="text-sm font-bold text-accent-green">{value}</span>
          )}
        </div>
      )}

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value ?? min}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer
                     bg-bg-tertiary accent-accent-green
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-accent-green
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:shadow-glow"
          style={{
            background: `linear-gradient(to right, #22c55e ${pct}%, #212d42 ${pct}%)`,
          }}
        />
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
