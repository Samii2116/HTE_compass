export default function Input({ label, id, className = '', wrapperClassName = '', ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'w-full rounded-lg border border-border bg-surface-overlay px-3 py-2 text-sm text-slate-100',
          'placeholder:text-muted-foreground',
          'transition-colors duration-200',
          'focus:border-accent-blue/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        ].join(' ')}
        {...props}
      />
    </div>
  )
}
