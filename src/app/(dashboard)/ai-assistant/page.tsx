'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Bot, User, Sparkles } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const EXAMPLE_PROMPTS = [
  'Show me all active employees',
  'Create an employee named Jane Smith, email jane@company.com, job title UX Designer, department Product',
  "Update John Doe's department to Engineering",
  'Generate an employee summary for Jane Smith',
  'Deactivate John Doe',
]

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const bottomRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return
    const userMessage: Message = { role: 'user', content: text }
    const updated = [...messages, userMessage]
    setMessages(updated)
    setInput('')
    setLoading(true)

    // Keep focus on input after sending
    setTimeout(() => inputRef.current?.focus(), 50)

    try {
      const res  = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '❌ Something went wrong. Please try again.' },
      ])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div style={{ maxWidth: '768px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div style={{
            width: '32px', height: '32px', background: 'linear-gradient(135deg, #0099ff, #00d4ff)',
            borderRadius: '10px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', boxShadow: '0 0 12px rgba(0,212,255,0.3)',
          }}>
            <Sparkles size={16} color="white" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#f1f5f9', margin: 0 }}>
            AI HR Assistant
          </h1>
        </div>
        <p style={{ color: '#475569', fontSize: '13px', margin: 0, marginLeft: '40px' }}>
          Powered by Groq — fast AI for HR management
        </p>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', paddingRight: '4px' }}>

        {/* Welcome */}
        {messages.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              background: 'rgba(13,25,50,0.7)', backdropFilter: 'blur(20px)',
              borderRadius: '16px', border: '1px solid rgba(0,212,255,0.15)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)', padding: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '36px', height: '36px',
                  background: 'linear-gradient(135deg, #0099ff, #00d4ff)',
                  borderRadius: '10px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', boxShadow: '0 0 12px rgba(0,212,255,0.3)',
                }}>
                  <Bot size={18} color="white" />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: '600', color: '#e2e8f0', fontSize: '14px' }}>
                    HR AI Assistant
                  </p>
                  <p style={{ margin: 0, color: '#00d4ff', fontSize: '11px' }}>
                    Powered by Groq · Ready to help
                  </p>
                </div>
              </div>
              <p style={{ margin: 0, color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>
                Hello! I can help you manage employee records using natural language.
                Try creating, viewing, updating, or deactivating employees — or ask me to generate a professional summary.
              </p>
            </div>

            {/* Example prompts */}
            <div>
              <p style={{ margin: '0 0 8px 4px', color: '#334155', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>
                Try an example
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {EXAMPLE_PROMPTS.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    style={{
                      textAlign: 'left', fontSize: '13px',
                      background: 'rgba(13,25,50,0.7)',
                      border: '1px solid rgba(0,212,255,0.15)',
                      color: '#64748b', padding: '12px 16px',
                      borderRadius: '12px', cursor: 'pointer',
                      transition: 'all 0.15s',
                      backdropFilter: 'blur(20px)',
                    }}
                    onMouseEnter={e => {
                      const t = e.currentTarget
                      t.style.borderColor = 'rgba(0,212,255,0.4)'
                      t.style.color = '#00d4ff'
                      t.style.background = 'rgba(0,212,255,0.05)'
                    }}
                    onMouseLeave={e => {
                      const t = e.currentTarget
                      t.style.borderColor = 'rgba(0,212,255,0.15)'
                      t.style.color = '#64748b'
                      t.style.background = 'rgba(13,25,50,0.7)'
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex', gap: '10px',
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: msg.role === 'user'
                ? 'rgba(255,255,255,0.08)'
                : 'linear-gradient(135deg, #0099ff, #00d4ff)',
              boxShadow: msg.role === 'user'
                ? 'none'
                : '0 0 10px rgba(0,212,255,0.3)',
            }}>
              {msg.role === 'user'
                ? <User size={16} color="#64748b" />
                : <Bot size={16} color="white" />
              }
            </div>
            <div style={{
              maxWidth: '82%', borderRadius: '16px',
              padding: '12px 16px', fontSize: '14px',
              lineHeight: '1.6', whiteSpace: 'pre-wrap',
              ...(msg.role === 'user'
                ? {
                    background: 'linear-gradient(135deg, #0099ff, #00d4ff)',
                    color: 'white',
                    borderTopRightRadius: '4px',
                    boxShadow: '0 4px 12px rgba(0,180,255,0.3)',
                  }
                : {
                    background: 'rgba(13,25,50,0.7)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0,212,255,0.15)',
                    color: '#94a3b8',
                    borderTopLeftRadius: '4px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  }
              ),
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'linear-gradient(135deg, #0099ff, #00d4ff)',
              borderRadius: '10px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', boxShadow: '0 0 10px rgba(0,212,255,0.3)',
            }}>
              <Bot size={16} color="white" />
            </div>
            <div style={{
              background: 'rgba(13,25,50,0.7)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,212,255,0.15)',
              borderRadius: '16px', borderTopLeftRadius: '4px',
              padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              {[0, 150, 300].map(delay => (
                <div key={delay} style={{
                  width: '8px', height: '8px',
                  background: '#00d4ff', borderRadius: '50%',
                  animation: 'bounce 1s infinite',
                  animationDelay: `${delay}ms`,
                  boxShadow: '0 0 6px rgba(0,212,255,0.5)',
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{
        display: 'flex', gap: '10px',
        background: 'rgba(13,25,50,0.7)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,212,255,0.2)',
        borderRadius: '16px', padding: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about your employees..."
          style={{
            flex: 1, background: 'transparent', border: 'none',
            color: '#e2e8f0', padding: '10px 12px',
            fontSize: '14px', outline: 'none',
            fontFamily: 'system-ui, sans-serif',
          }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          style={{
            background: !input.trim() || loading
              ? 'rgba(255,255,255,0.05)'
              : 'linear-gradient(135deg, #0099ff, #00d4ff)',
            border: 'none', borderRadius: '12px',
            padding: '10px 14px', cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
            boxShadow: !input.trim() || loading ? 'none' : '0 0 12px rgba(0,180,255,0.3)',
          }}
        >
          {loading
            ? <Loader2 size={18} color="#334155" style={{ animation: 'spin 1s linear infinite' }} />
            : <Send size={18} color={!input.trim() ? '#334155' : 'white'} />
          }
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder { color: #334155; }
      `}</style>
    </div>
  )
}