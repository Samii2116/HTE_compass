import { Bot, User, FileText } from 'lucide-react'

export default function ChatMessage({ role, content, timestamp, sourceDocument, pageNumber }) {
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
            'rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap',
            isAssistant
              ? 'rounded-tl-sm border border-border bg-surface-overlay text-slate-200'
              : 'rounded-tr-sm bg-gradient-accent text-white',
          ].join(' ')}
        >
          {content}
        </div>
        {isAssistant && sourceDocument && (
          <div className="mt-1 flex items-center gap-1.5 rounded-md border border-accent-purple/20 bg-accent-purple/10 px-2.5 py-1 text-xs text-purple-300">
            <FileText className="h-3 w-3 shrink-0 text-purple-400" />
            <span>
              Source: <strong className="font-medium">{sourceDocument}</strong>
              {pageNumber ? ` (Page ${pageNumber})` : ''}
            </span>
          </div>
        )}
        {timestamp && (
          <span className="px-1 text-xs text-muted-foreground">{timestamp}</span>
        )}
      </div>
    </div>
  )
}
