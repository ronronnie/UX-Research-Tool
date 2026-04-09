import clsx from 'clsx'

export default function Textarea({
  label,
  error,
  rows = 3,
  className = '',
  containerClass = '',
  ...props
}) {
  return (
    <div className={clsx('flex flex-col gap-1.5', containerClass)}>
      {label && (
        <label className="text-sm font-medium text-text-secondary">{label}</label>
      )}
      <textarea
        rows={rows}
        className={clsx(
          'w-full bg-bg-tertiary border rounded-lg px-3 py-2',
          'text-text-primary placeholder-text-muted text-sm resize-none',
          'focus:outline-none focus:ring-1 transition-colors',
          error
            ? 'border-accent-red focus:border-accent-red focus:ring-accent-red/30'
            : 'border-border focus:border-accent-blue focus:ring-accent-blue/30',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-accent-red">{error}</p>}
    </div>
  )
}
