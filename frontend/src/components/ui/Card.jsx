export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={[
        'rounded-xl border border-border bg-surface-raised p-5',
        hover && 'transition-colors duration-200 hover:border-accent-blue/30 hover:bg-surface-overlay',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return <div className={`mb-4 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-base font-semibold text-slate-100 ${className}`}>{children}</h3>
  )
}

export function CardDescription({ children, className = '' }) {
  return <p className={`mt-1 text-sm text-muted ${className}`}>{children}</p>
}
