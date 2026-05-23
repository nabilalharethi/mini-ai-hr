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
  const bottomRef = useRef<HTMLDivElement>(null)

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
    try {
      const res  = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>

      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">AI HR Assistant</h1>
        </div>
        <p className="text-slate-500 text-sm ml-10">Powered by Google Gemini</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">

        {/* Welcome */}
        {messages.length === 0 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-slate-800 font-semibold text-sm">Gemini HR Assistant</p>
                  <p className="text-slate-400 text-xs">AI-powered · Ready to help</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Hello! I can help you manage employee records using natural language.
                Try creating, viewing, updating, or deactivating employees — or ask me to generate a professional summary.
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wide font-medium mb-2 px-1">Try an example</p>
              <div className="space-y-2">
                {EXAMPLE_PROMPTS.map(prompt => (
                  <button key={prompt} onClick={() => sendMessage(prompt)}
                    className="w-full text-left text-sm bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 px-4 py-3 rounded-xl transition-all shadow-sm">
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bubbles */}
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
              msg.role === 'user' ? 'bg-slate-200' : 'bg-indigo-600'
            }`}>
              {msg.role === 'user'
                ? <User className="w-4 h-4 text-slate-600" />
                : <Bot className="w-4 h-4 text-white" />
              }
            </div>
            <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap shadow-sm ${
              msg.role === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-sm'
                : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3 bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
          placeholder="Ask me anything about your employees..."
          className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 px-3 py-2 text-sm outline-none"
        />
        <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors shadow-sm">
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  )
}