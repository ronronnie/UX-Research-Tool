import clsx from 'clsx'

const VARIANTS = {
  primary:   'bg-accent-green hover:bg-accent-green-dim text-white',
  secondary: 'bg-bg-tertiary hover:bg-border text-text-primary border border-border',
  ghost:     'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary',
  danger:    'bg-accent-red/10 hover:bg-accent-red/20 text-accent-red border border-accent-red/30',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
