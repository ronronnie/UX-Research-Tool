import clsx from 'clsx'
import Card from './Card.jsx'

/**
 * Summary metric card used on Dashboard and Analytics.
 * Props: title, value, subtitle, icon, trend, colorKey (green/amber/red/blue/purple/default)
 */
export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  colorKey = 'default',
  className = '',
}) {
  const VALUE_COLORS = {
    green:   'text-accent-green',
    amber:   'text-accent-amber',
    red:     'text-accent-red',
    blue:    'text-accent-blue',
    purple:  'text-accent-purple',
    default: 'text-text-primary',
  }

  const ICON_BG = {
    green:   'bg-accent-green/10 text-accent-green',
    amber:   'bg-accent-amber/10 text-accent-amber',
    red:     'bg-accent-red/10 text-accent-red',
    blue:    'bg-accent-blue/10 text-accent-blue',
    purple:  'bg-accent-purple/10 text-accent-purple',
    default: 'bg-bg-tertiary text-text-secondary',
  }

  return (
    <Card className={clsx('flex flex-col gap-3', className)}>
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-text-secondary">{title}</span>
        {icon && (
          <span className={clsx('w-8 h-8 rounded-lg flex items-center justify-center text-base', ICON_BG[colorKey] ?? ICON_BG.default)}>
            {icon}
          </span>
        )}
      </div>

      <div className="flex items-end gap-2">
        <span className={clsx('text-3xl font-bold leading-none', VALUE_COLORS[colorKey] ?? VALUE_COLORS.default)}>
          {value ?? '—'}
        </span>
        {trend !== undefined && (
          <span className={clsx('text-xs font-medium mb-0.5', trend >= 0 ? 'text-accent-green' : 'text-accent-red')}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}
          </span>
        )}
      </div>

      {subtitle && (
        <span className="text-xs text-text-muted">{subtitle}</span>
      )}
    </Card>
  )
}
