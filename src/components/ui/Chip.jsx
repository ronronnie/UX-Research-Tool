import clsx from 'clsx'

export default function Chip({
  label,
  selected = false,
  onClick,
  variant = 'default',
  className = '',
  disabled = false,
}) {
  const base = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border cursor-pointer transition-all select-none'

  const styles = {
    default: selected
      ? 'border-accent-green text-accent-green bg-accent-green/10'
      : 'border-border text-text-secondary hover:border-border-light hover:text-text-primary',
    confusion: selected
      ? 'border-accent-amber text-accent-amber bg-accent-amber/10'
      : 'border-border text-text-muted hover:border-accent-amber hover:text-accent-amber',
    delight: selected
      ? 'border-accent-green text-accent-green bg-accent-green/10'
      : 'border-border text-text-muted hover:border-accent-green hover:text-accent-green',
    error: selected
      ? 'border-accent-red text-accent-red bg-accent-red/10'
      : 'border-border text-text-muted hover:border-accent-red hover:text-accent-red',
    question: selected
      ? 'border-accent-blue text-accent-blue bg-accent-blue/10'
      : 'border-border text-text-muted hover:border-accent-blue hover:text-accent-blue',
  }

  return (
    <button
      type="button"
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={clsx(base, styles[variant] ?? styles.default, disabled && 'opacity-40 cursor-not-allowed', className)}
    >
      {label}
    </button>
  )
}
