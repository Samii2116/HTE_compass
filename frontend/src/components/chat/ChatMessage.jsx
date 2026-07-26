import { Bot, User } from 'lucide-react'

export default function ChatMessage({ role, content, timestamp }) {
  const isAssistant = role === 'assistant'

  return (
    <div className={`flex gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}>
      <div
        className={[
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
          isAssistant
            ? 'bg-gradient-accent shadow-glow'
            : 'border border-border bg-surface-overlay',
        ].join(' ')}
      >
        {isAssistant ? (
          <Bot className="h-4 w-4 text-white" />
        ) : (
          <User className="h-4 w-4 text-accent-blue" />
        )}
      </div>

      <div className={`flex max-w-[75%] flex-col gap-1 ${isAssistant ? '' : 'items-end'}`}>
        <div
          className={[
            'rounded-2xl px-4 py-3 text-sm leading-relaxed',
            isAssistant
              ? 'rounded-tl-sm border border-border bg-surface-overlay text-slate-200'
              : 'rounded-tr-sm bg-gradient-accent text-white',
          ].join(' ')}
        >
          {content}
        </div>
        {timestamp && (
          <span className="px-1 text-xs text-muted-foreground">{timestamp}</span>
        )}
      </div>
    </div>
  )
}
