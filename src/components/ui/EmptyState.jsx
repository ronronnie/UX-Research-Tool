import clsx from 'clsx'

export default function EmptyState({
  icon = '♠',
  title = 'No data yet',
  description,
  action,
  className = '',
}) {
  return (
    <div className={clsx(
      'flex flex-col items-center justify-center py-16 px-6 text-center',
      className
    )}>
      <div className="w-16 h-16 rounded-2xl bg-bg-tertiary border border-border flex items-center justify-center text-3xl mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-text-muted max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
