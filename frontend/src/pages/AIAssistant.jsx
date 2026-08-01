import { useState, useRef, useEffect } from 'react'
import { Sparkles, AlertCircle } from 'lucide-react'
import Header from '../components/layout/Header'
import ChatMessage from '../components/chat/ChatMessage'
import ChatInput from '../components/chat/ChatInput'
import TypingIndicator from '../components/ui/TypingIndicator'
import Badge from '../components/ui/Badge'
import { askQuestion } from '../services/api'

const initialMessages = [
  {
    id: 'welcome-1',
    role: 'assistant',
    content:
      "Hello! I'm HTE Compass, your AI-powered administrative assistant for the Higher & Technical Education Department. Ask me anything about uploaded guidelines, circulars, or policies!",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
]

const suggestedPrompts = [
  'Summarize affiliation renewal requirements',
  'What is the policy for faculty recruitment?',
  'Explain budget allocation guidelines',
  'What documents are indexed in the database?',
]

export default function AIAssistant() {
  const [messages, setMessages] = useState(initialMessages)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = async (questionText) => {
    if (!questionText || isTyping) return

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: questionText,
      timestamp: now,
    }

    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    try {
      const response = await askQuestion(questionText)
      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        sourceDocument: response.source_document,
        pageNumber: response.page_number,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (err) {
      console.error('Chat error:', err)
      const errorMsg = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ Could not reach backend: ${err.message || 'Make sure backend server is running at http://127.0.0.1:8000'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

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
              sourceDocument={msg.sourceDocument}
              pageNumber={msg.pageNumber}
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

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSend(prompt)}
                disabled={isTyping}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent-purple/30 hover:text-slate-200 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
          <ChatInput onSend={handleSend} placeholder={isTyping ? "Thinking..." : "Ask HTE Compass anything..."} />
        </div>
      </div>
    </div>
  )
}
