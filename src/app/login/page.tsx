// src/app/login/page.tsx

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router   = useRouter()
  const supabase = createClient()

  const [email,       setEmail]       = useState('')
  const [password,    setPassword]    = useState('')
  const [showPass,    setShowPass]    = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* ── LEFT SIDE — Illustration ─────────────────────────── */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 relative overflow-hidden p-12">

        {/* Background decorative circles */}
        <div className="absolute w-96 h-96 bg-green-200/40 rounded-full -bottom-20 -left-20" />
        <div className="absolute w-64 h-64 bg-blue-200/30 rounded-full top-10 right-10" />

        {/* Illustration content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-md">

          {/* Main SVG Illustration */}
          <svg viewBox="0 0 500 400" className="w-full max-w-lg drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">

            {/* Background card 1 — employee card */}
            <rect x="60" y="60" width="200" height="130" rx="12" fill="white"
              style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.10))' }} />
            {/* Avatar circle */}
            <circle cx="100" cy="100" r="22" fill="#e0e7ff" />
            <circle cx="100" cy="95" r="10" fill="#6366f1" />
            <ellipse cx="100" cy="116" rx="14" ry="8" fill="#6366f1" />
            {/* Text lines */}
            <rect x="130" y="88" width="100" height="8" rx="4" fill="#6366f1" opacity="0.7" />
            <rect x="130" y="102" width="70" height="6" rx="3" fill="#cbd5e1" />
            {/* Progress bar */}
            <rect x="85" y="130" width="155" height="6" rx="3" fill="#e2e8f0" />
            <rect x="85" y="130" width="100" height="6" rx="3" fill="#6366f1" opacity="0.6" />
            {/* Dots row */}
            <circle cx="95" cy="155" r="4" fill="#6366f1" opacity="0.5" />
            <circle cx="110" cy="155" r="4" fill="#10b981" opacity="0.5" />
            <circle cx="125" cy="155" r="4" fill="#f59e0b" opacity="0.5" />

            {/* Background card 2 — stats card top right */}
            <rect x="290" y="40" width="170" height="110" rx="12" fill="white"
              style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.10))' }} />
            <rect x="308" y="58" width="60" height="7" rx="3" fill="#6366f1" opacity="0.6" />
            <rect x="308" y="72" width="120" height="6" rx="3" fill="#e2e8f0" />
            <rect x="308" y="84" width="90" height="6" rx="3" fill="#e2e8f0" />
            {/* Mini bar chart */}
            <rect x="308" y="110" width="14" height="22" rx="3" fill="#6366f1" opacity="0.4" />
            <rect x="328" y="100" width="14" height="32" rx="3" fill="#6366f1" opacity="0.6" />
            <rect x="348" y="106" width="14" height="26" rx="3" fill="#6366f1" opacity="0.5" />
            <rect x="368" y="95"  width="14" height="37" rx="3" fill="#6366f1" opacity="0.8" />
            <rect x="388" y="108" width="14" height="24" rx="3" fill="#6366f1" opacity="0.4" />

            {/* Woman figure */}
            {/* Body */}
            <ellipse cx="200" cy="330" rx="45" ry="12" fill="#e2e8f0" opacity="0.5" />
            {/* Legs */}
            <rect x="185" y="295" width="14" height="40" rx="7" fill="#3b5bdb" />
            <rect x="203" y="295" width="14" height="40" rx="7" fill="#3b5bdb" />
            {/* Skirt/torso */}
            <ellipse cx="200" cy="270" rx="28" ry="35" fill="#4f46e5" />
            {/* Jacket */}
            <ellipse cx="200" cy="245" rx="30" ry="28" fill="#3730a3" />
            {/* Head */}
            <circle cx="200" cy="210" r="24" fill="#fbbf24" opacity="0.85" />
            {/* Hair */}
            <ellipse cx="200" cy="198" rx="24" ry="14" fill="#1e1b4b" />
            {/* Arms */}
            <path d="M172 248 Q150 260 160 280" stroke="#fbbf24" strokeWidth="10"
              strokeLinecap="round" fill="none" opacity="0.85" />
            <path d="M228 248 Q255 255 245 272" stroke="#fbbf24" strokeWidth="10"
              strokeLinecap="round" fill="none" opacity="0.85" />
            {/* Laptop */}
            <rect x="150" y="272" width="52" height="34" rx="5" fill="#e2e8f0" />
            <rect x="153" y="275" width="46" height="26" rx="3" fill="#6366f1" opacity="0.3" />
            <rect x="143" y="306" width="66" height="5" rx="2" fill="#cbd5e1" />

            {/* Robot / AI figure */}
            {/* Body */}
            <rect x="310" y="240" width="60" height="70" rx="12" fill="#06b6d4" opacity="0.85" />
            {/* Head */}
            <rect x="315" y="200" width="50" height="45" rx="12" fill="#0891b2" />
            {/* Eyes */}
            <circle cx="330" cy="218" r="7" fill="white" />
            <circle cx="350" cy="218" r="7" fill="white" />
            <circle cx="331" cy="219" r="4" fill="#06b6d4" />
            <circle cx="351" cy="219" r="4" fill="#06b6d4" />
            {/* Smile */}
            <path d="M328 232 Q340 240 352 232" stroke="white" strokeWidth="2.5"
              strokeLinecap="round" fill="none" />
            {/* Antenna */}
            <line x1="340" y1="200" x2="340" y2="185" stroke="#0891b2" strokeWidth="3" />
            <circle cx="340" cy="182" r="5" fill="#22d3ee" />
            {/* Arms */}
            <rect x="290" y="248" width="22" height="10" rx="5" fill="#0891b2" />
            <rect x="368" y="248" width="22" height="10" rx="5" fill="#0891b2" />
            {/* Legs */}
            <rect x="318" y="308" width="16" height="28" rx="8" fill="#0891b2" />
            <rect x="346" y="308" width="16" height="28" rx="8" fill="#0891b2" />
            {/* AI badge */}
            <circle cx="340" cy="272" r="12" fill="white" opacity="0.3" />
            <text x="340" y="276" textAnchor="middle" fontSize="10"
              fontWeight="bold" fill="white">AI</text>

            {/* Floating sparkles */}
            <circle cx="270" cy="160" r="4" fill="#f59e0b" opacity="0.7" />
            <circle cx="440" cy="180" r="3" fill="#10b981" opacity="0.6" />
            <circle cx="80"  cy="220" r="3" fill="#6366f1" opacity="0.5" />
            <circle cx="420" cy="300" r="5" fill="#f59e0b" opacity="0.4" />

          </svg>

          {/* Caption text */}
          <h2 className="text-2xl font-bold text-slate-700 mt-4">
            Smart HR Management
          </h2>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            Manage your team effortlessly with AI-powered tools.<br />
            Create, update and summarize employee records instantly.
          </p>
        </div>
      </div>

      {/* ── RIGHT SIDE — Login Form ───────────────────────────── */}
      <div className="flex flex-1 items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">

          {/* Logo + Title */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.402 2.798H4.2c-1.432 0-2.402-1.798-1.402-2.798L4.2 15.9" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Mini AI HR Admin System</h1>
            </div>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">HR Admin Login</h2>

            <form onSubmit={handleLogin} className="space-y-5">

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Work Email"
                  className="w-full border-2 border-indigo-400 focus:border-indigo-600 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 outline-none transition-colors bg-white"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full border border-slate-200 focus:border-indigo-400 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 outline-none transition-colors bg-white pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Forgot password */}
              <div className="text-right">
                <span className="text-sm text-indigo-500 hover:text-indigo-700 cursor-pointer">
                  Forgot Password?
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl px-4 py-3.5 transition-colors flex items-center justify-center gap-2 text-base"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

            </form>

            {/* Footer note */}
            <p className="text-center text-slate-400 text-sm mt-6">
              Secured with Supabase Auth
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}