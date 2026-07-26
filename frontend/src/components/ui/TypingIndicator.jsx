export default function TypingIndicator({ className = '' }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`} aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 animate-bounce rounded-full bg-accent-purple"
          style={{ animationDelay: `${i * 150}ms`, animationDuration: '0.8s' }}
        />
      ))}
    </div>
  )
}
