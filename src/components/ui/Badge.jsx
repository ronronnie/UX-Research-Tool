import clsx from 'clsx'

// ── Skill Level Badge ─────────────────────────────────────────────────────────
const SKILL_STYLES = {
  beginner:     'bg-accent-blue/15 text-accent-blue border-accent-blue/30',
  intermediate: 'bg-accent-amber/15 text-accent-amber border-accent-amber/30',
  pro:          'bg-accent-purple/15 text-accent-purple border-accent-purple/30',
}

export function SkillBadge({ level, className = '' }) {
  return (
    <span className={clsx(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize',
      SKILL_STYLES[level] ?? 'bg-bg-tertiary text-text-muted border-border',
      className
    )}>
      {level}
    </span>
  )
}

// ── SUS Grade Badge ───────────────────────────────────────────────────────────
const SUS_STYLES = {
  excellent: 'bg-accent-green/15 text-accent-green border-accent-green/30',
  good:      'bg-accent-blue/15 text-accent-blue border-accent-blue/30',
  okay:      'bg-accent-amber/15 text-accent-amber border-accent-amber/30',
  poor:      'bg-accent-red/15 text-accent-red border-accent-red/30',
}

export function SUSBadge({ score, label, className = '' }) {
  const key = label?.toLowerCase() ?? 'okay'
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
      SUS_STYLES[key] ?? SUS_STYLES.okay,
      className
    )}>
      {score !== undefined && <span>{score}</span>}
      {label && <span>{label}</span>}
    </span>
  )
}

// ── Severity Badge ────────────────────────────────────────────────────────────
const SEVERITY_STYLES = {
  critical: 'bg-accent-red/15 text-accent-red border-accent-red/30',
  major:    'bg-accent-amber/15 text-accent-amber border-accent-amber/30',
  minor:    'bg-accent-blue/15 text-accent-blue border-accent-blue/30',
}

export function SeverityBadge({ severity, className = '' }) {
  return (
    <span className={clsx(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize',
      SEVERITY_STYLES[severity?.key ?? severity] ?? SEVERITY_STYLES.minor,
      className
    )}>
      {severity?.label ?? severity}
    </span>
  )
}

// ── NPS Category Badge ────────────────────────────────────────────────────────
const NPS_STYLES = {
  promoter:  'bg-accent-green/15 text-accent-green border-accent-green/30',
  passive:   'bg-accent-amber/15 text-accent-amber border-accent-amber/30',
  detractor: 'bg-accent-red/15 text-accent-red border-accent-red/30',
}

export function NPSBadge({ category, className = '' }) {
  return (
    <span className={clsx(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize',
      NPS_STYLES[category] ?? 'bg-bg-tertiary text-text-muted border-border',
      className
    )}>
      {category}
    </span>
  )
}

// ── Generic Badge ─────────────────────────────────────────────────────────────
export default function Badge({ children, variant = 'default', className = '' }) {
  const VARIANTS = {
    default: 'bg-bg-tertiary text-text-secondary border-border',
    green:   'bg-accent-green/15 text-accent-green border-accent-green/30',
    amber:   'bg-accent-amber/15 text-accent-amber border-accent-amber/30',
    red:     'bg-accent-red/15 text-accent-red border-accent-red/30',
    blue:    'bg-accent-blue/15 text-accent-blue border-accent-blue/30',
    purple:  'bg-accent-purple/15 text-accent-purple border-accent-purple/30',
  }
  return (
    <span className={clsx(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
      VARIANTS[variant] ?? VARIANTS.default,
      className
    )}>
      {children}
    </span>
  )
}
