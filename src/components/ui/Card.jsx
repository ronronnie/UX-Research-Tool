import clsx from 'clsx'

export default function Card({ children, className = '', padding = 'md', ...props }) {
  const pad = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' }[padding] ?? 'p-5'

  return (
    <div
      className={clsx(
        'bg-bg-card rounded-xl border border-border shadow-card',
        pad,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={clsx('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={clsx('text-base font-semibold text-text-primary', className)}>
      {children}
    </h3>
  )
}

export function SectionTitle({ children, className = '' }) {
  return (
    <h2 className={clsx('text-lg font-semibold text-text-primary mb-4', className)}>
      {children}
    </h2>
  )
}
