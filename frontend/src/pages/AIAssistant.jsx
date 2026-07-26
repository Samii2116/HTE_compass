import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import Header from '../components/layout/Header'
import ChatMessage from '../components/chat/ChatMessage'
import ChatInput from '../components/chat/ChatInput'
import TypingIndicator from '../components/ui/TypingIndicator'
import Badge from '../components/ui/Badge'

const placeholderMessages = [
  {
    id: 1,
    role: 'assistant',
    content:
      'Hello! I\'m HTE Compass, your AI-powered administrative assistant for the Higher & Technical Education Department. How can I help you today?',
    timestamp: '9:00 AM',
  },
  {
    id: 2,
    role: 'user',
    content:
      'What is the current policy for faculty recruitment in government engineering colleges?',
    timestamp: '9:01 AM',
  },
  {
    id: 3,
    role: 'assistant',
    content:
      'Based on the HTE Staff Recruitment Guidelines 2025, faculty recruitment in government engineering colleges follows a centralized process through the Maharashtra Public Service Commission (MPSC). Key requirements include:\n\n• Minimum qualifications as per AICTE/UGC norms\n• NET/SET qualification for Assistant Professor posts\n• Reservation policies as per state government rules\n• Mandatory document verification before appointment\n\nWould you like me to retrieve the full policy document or clarify any specific aspect?',
    timestamp: '9:01 AM',
  },
  {
    id: 4,
    role: 'user',
    content: 'Can you summarize the leave policy for teaching staff?',
    timestamp: '9:03 AM',
  },
]

const suggestedPrompts = [
  'Summarize affiliation renewal requirements',
  'List pending document approvals',
  'Explain budget allocation guidelines',
  'Draft a circular for college principals',
]

export default function AIAssistant() {
  const [messages] = useState(placeholderMessages)
  const [isTyping] = useState(true)

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <Header
        title="AI Assistant"
        description="Intelligent support for HTE administrative queries"
        actions={
          <Badge variant="purple">
            <Sparkles className="mr-1 inline h-3 w-3" />
            AI Powered
          </Badge>
        }
      />

      <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-border bg-surface-raised">
        <div className="flex-1 space-y-6 overflow-y-auto p-6 scrollbar-thin">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-accent shadow-glow">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="rounded-2xl rounded-tl-sm border border-border bg-surface-overlay px-4 py-3">
                <TypingIndicator />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent-purple/30 hover:text-slate-200"
              >
                {prompt}
              </button>
            ))}
          </div>
          <ChatInput onSend={() => {}} />
        </div>
      </div>
    </div>
  )
}
