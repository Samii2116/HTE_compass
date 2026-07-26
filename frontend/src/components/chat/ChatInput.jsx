import { useState } from 'react'
import { Send } from 'lucide-react'
import Button from '../ui/Button'

export default function ChatInput({ onSend, placeholder = 'Ask HTE Compass anything...' }) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = message.trim()
    if (!trimmed) return
    onSend?.(trimmed)
    setMessage('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-3 rounded-xl border border-border bg-surface-raised p-3"
    >
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
          }
        }}
        placeholder={placeholder}
        rows={1}
        className={[
          'max-h-32 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2.5 text-sm text-slate-100',
          'placeholder:text-muted-foreground',
          'focus:outline-none',
        ].join(' ')}
      />
      <Button type="submit" size="icon" disabled={!message.trim()} aria-label="Send message">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}
