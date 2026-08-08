'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, Minimize2, Maximize2 } from 'lucide-react'
import useStore from '@/store/useStore'
import type { Brand } from '@/types'
import { sendChatMessage } from '@/lib/api'

interface Message { id: number; from: 'user' | 'bot'; text: string }

const QUICK = [
  { label: 'Mall Hours',      q: 'What are the mall hours?' },
  { label: 'Brand Directory', q: 'Tell me about the brands' },
  { label: 'Loyalty Program', q: 'How does the loyalty program work?' },
  { label: 'Parking',         q: 'Where can I park?' },
]

export default function AssistantWidget() {
  const { chatOpen, setChatOpen } = useStore()
  const [expanded, setExpanded] = useState(false)
  const [input,    setInput]    = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: 'bot', text: "Welcome to **Zivanta**! I'm your personal concierge. Ask me about stores, events, hours, or services." }
  ])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

  const sendMessage = async (text = input.trim()) => {
    if (!text || isTyping) return
    const userMsgId = Date.now()
    setMessages(m => [...m, { id: userMsgId, from: 'user', text }])
    setInput('')
    setIsTyping(true)

    try {
      const historyPayload = messages.map(m => ({
        from: m.from,
        text: m.text
      }))
      const res = await sendChatMessage(text, historyPayload)
      setMessages(m => [...m, { id: Date.now(), from: 'bot', text: res.response }])
    } catch (err) {
      console.error(err)
      setMessages(m => [...m, { 
        id: Date.now(), 
        from: 'bot', 
        text: "I'm sorry, I encountered a temporary connection issue. Please make sure the backend server is running and try again." 
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const renderText = (text: string) => {
    return text
      // Headers
      .replace(/^### (.*?)(?:\n|$)/gm, '<h4 style="font-weight: 600; color: var(--gold); margin-top: 8px; margin-bottom: 4px;">$1</h4>')
      .replace(/^## (.*?)(?:\n|$)/gm, '<h3 style="font-weight: 700; color: var(--gold); margin-top: 12px; margin-bottom: 4px;">$1</h3>')
      .replace(/^# (.*?)(?:\n|$)/gm, '<h2 style="font-weight: 800; color: var(--gold); margin-top: 16px; margin-bottom: 6px;">$1</h2>')
      // Bullet list items with bolding (e.g. - **Item**: Desc)
      .replace(/^[-*]\s+\*\*(.*?)\*\*(.*?)(?:\n|$)/gm, '<span style="display: block; margin-left: 8px; margin-bottom: 2px;">• <strong>$1</strong>$2</span>')
      // Bullet list items without bolding (e.g. - Item)
      .replace(/^[-*]\s+(.*?)(?:\n|$)/gm, '<span style="display: block; margin-left: 8px; margin-bottom: 2px;">• $1</span>')
      // Numbered list items (e.g. 1. Item)
      .replace(/^(\d+)\.\s+(.*?)(?:\n|$)/gm, '<span style="display: block; margin-left: 8px; margin-bottom: 2px;">$1. $2</span>')
      // Generic bolding for remaining parts
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Newlines
      .replace(/\n/g, '<br/>')
  }

  return (
    <AnimatePresence>
      {chatOpen && (
        <motion.div
          className={`fixed bottom-24 right-6 z-40 flex flex-col rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${expanded ? 'w-[420px] h-[520px]' : 'w-[360px] h-[420px]'}`}
          style={{ background: 'var(--bg-accent)', border: '1px solid rgba(201,168,76,0.2)' }}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(201,168,76,0.1)]" style={{ background: 'var(--bg-card)' }}>
            <div className="relative">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.15)' }}>
                <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                  <path d="M16 2L19.5 10H28L21.5 15L24 23L16 18L8 23L10.5 15L4 10H12.5L16 2Z" fill="url(#wGold)" />
                  <defs>
                    <linearGradient id="wGold" x1="4" y1="2" x2="28" y2="23">
                      <stop stopColor="#E8C97A" /><stop offset="1" stopColor="#A07830" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2" style={{ borderColor: 'var(--bg-card)' }} />
            </div>
            <div className="flex-1">
              <p className="text-text-primary text-sm font-medium">Zivanta Concierge</p>
              <p className="text-text-muted text-[11px]">Online · Here to assist</p>
            </div>
            <button className="text-text-muted hover:text-text-secondary transition-colors p-1" onClick={() => setExpanded(v => !v)}>
              {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button className="text-text-muted hover:text-text-secondary transition-colors p-1" onClick={() => setChatOpen(false)}>
              <X size={14} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={{
                    background: msg.from === 'user' ? 'linear-gradient(135deg, #C9A84C, #A07830)' : 'var(--bg-card)',
                    color: msg.from === 'user' ? '#08071A' : 'var(--text-primary)',
                    border: msg.from === 'bot' ? '1px solid rgba(201,168,76,0.1)' : 'none',
                    borderRadius: msg.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  }}
                  dangerouslySetInnerHTML={{ __html: renderText(msg.text) }}
                />
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div
                  className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid rgba(201,168,76,0.1)',
                    borderRadius: '18px 18px 18px 4px',
                    color: 'var(--text-primary)',
                  }}
                >
                  <div className="flex items-center gap-1 py-1 px-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick actions */}
          {messages.length <= 2 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {QUICK.map(a => (
                <button key={a.label}
                  className="px-2.5 py-1 rounded-full text-[11px] border border-[rgba(201,168,76,0.2)] text-text-muted hover:text-gold hover:border-gold/40 transition-colors"
                  onClick={() => sendMessage(a.q)}
                  disabled={isTyping}>{a.label}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-3 border-t border-[rgba(201,168,76,0.1)]">
            <input
              className="flex-1 px-3 py-2 rounded-xl text-sm text-text-primary placeholder:text-text-muted outline-none disabled:opacity-50"
              style={{ background: 'var(--bg-card)', border: '1px solid rgba(201,168,76,0.1)' }}
              placeholder="Ask anything about Zivanta…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              disabled={isTyping}
            />
            <button
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all disabled:opacity-40"
              style={{ background: (input.trim() && !isTyping) ? 'linear-gradient(135deg, #C9A84C, #A07830)' : 'var(--bg-card)' }}
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}>
              <Send size={15} style={{ color: (input.trim() && !isTyping) ? 'white' : 'var(--text-muted)' }} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
