import clsx from 'clsx'
import Card from './Card.jsx'

/**
 * Summary metric card used on Dashboard and Analytics.
 * Props: title, value, subtitle, icon, trend, tooltip, colorKey (green/amber/red/blue/purple/default)
 */
export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  tooltip,
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
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-text-secondary">{title}</span>
          {tooltip && (
            <div className="relative group/tip">
              <span className="w-4 h-4 rounded-full border border-border text-text-muted
                               flex items-center justify-center text-[10px] font-bold
                               cursor-default hover:border-accent-blue hover:text-accent-blue
                               transition-colors select-none">
                ?
              </span>
              {/* Tooltip box */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56
                              bg-bg-card border border-border rounded-lg px-3 py-2 shadow-card
                              text-xs text-text-secondary leading-relaxed
                              opacity-0 pointer-events-none
                              group-hover/tip:opacity-100
                              transition-opacity duration-150 z-50">
                {tooltip}
                {/* Arrow */}
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4
                                 border-transparent border-t-border" />
              </div>
            </div>
          )}
        </div>
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
