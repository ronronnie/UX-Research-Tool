import clsx from 'clsx'

export default function Stepper({
  value = 0,
  onChange,
  min = 0,
  max = 99,
  label,
  className = '',
}) {
  const dec = () => onChange(Math.max(min, value - 1))
  const inc = () => onChange(Math.min(max, value + 1))

  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      {label && <span className="text-sm font-medium text-text-secondary">{label}</span>}
      <div className="inline-flex items-center gap-0">
        <button
          type="button"
          onClick={dec}
          disabled={value <= min}
          className="w-9 h-9 flex items-center justify-center rounded-l-lg border border-border
                     bg-bg-tertiary text-text-primary hover:bg-border transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed text-lg font-medium"
        >
          −
        </button>
        <div className="w-12 h-9 flex items-center justify-center border-y border-border
                        bg-bg-secondary text-text-primary text-sm font-semibold">
          {value}
        </div>
        <button
          type="button"
          onClick={inc}
          disabled={value >= max}
          className="w-9 h-9 flex items-center justify-center rounded-r-lg border border-border
                     bg-bg-tertiary text-text-primary hover:bg-border transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed text-lg font-medium"
        >
          +
        </button>
      </div>
    </div>
  )
}
