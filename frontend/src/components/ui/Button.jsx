const variants = {
  primary:
    'bg-gradient-accent text-white shadow-glow hover:opacity-90 focus-visible:ring-accent-glow',
  secondary:
    'bg-surface-overlay text-slate-200 border border-border hover:bg-surface-hover focus-visible:ring-accent-blue',
  ghost:
    'bg-transparent text-muted hover:bg-surface-hover hover:text-slate-200 focus-visible:ring-accent-blue',
  danger:
    'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 focus-visible:ring-red-500',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-5 py-2.5 text-base rounded-xl',
  icon: 'p-2 rounded-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
