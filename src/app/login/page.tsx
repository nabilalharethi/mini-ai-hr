'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router   = useRouter()
  const supabase = createClient()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

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
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>

      {/* LEFT — Illustration */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #eff6ff 0%, #eef2ff 50%, #ecfeff 100%)',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', width: '384px', height: '384px',
          background: 'rgba(167,243,208,0.4)', borderRadius: '50%',
          bottom: '-80px', left: '-80px',
        }} />
        <div style={{
          position: 'absolute', width: '256px', height: '256px',
          background: 'rgba(191,219,254,0.3)', borderRadius: '50%',
          top: '40px', right: '40px',
        }} />

        {/* SVG Illustration */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '420px' }}>
          <svg viewBox="0 0 500 400" style={{ width: '100%', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.08))' }} xmlns="http://www.w3.org/2000/svg">
            {/* Employee card */}
            <rect x="40" y="50" width="210" height="140" rx="14" fill="white" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.10))' }} />
            <circle cx="85" cy="95" r="24" fill="#e0e7ff" />
            <circle cx="85" cy="89" r="11" fill="#6366f1" />
            <ellipse cx="85" cy="112" rx="15" ry="9" fill="#6366f1" />
            <rect x="118" y="80" width="105" height="9" rx="4" fill="#6366f1" opacity="0.7" />
            <rect x="118" y="96" width="72" height="7" rx="3" fill="#cbd5e1" />
            <rect x="68" y="128" width="160" height="7" rx="3" fill="#e2e8f0" />
            <rect x="68" y="128" width="105" height="7" rx="3" fill="#6366f1" opacity="0.5" />
            <circle cx="78" cy="162" r="5" fill="#6366f1" opacity="0.5" />
            <circle cx="95" cy="162" r="5" fill="#10b981" opacity="0.5" />
            <circle cx="112" cy="162" r="5" fill="#f59e0b" opacity="0.5" />
            {/* Stats card */}
            <rect x="285" y="30" width="175" height="115" rx="14" fill="white" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.10))' }} />
            <rect x="303" y="50" width="65" height="8" rx="3" fill="#6366f1" opacity="0.6" />
            <rect x="303" y="65" width="125" height="7" rx="3" fill="#e2e8f0" />
            <rect x="303" y="78" width="95" height="7" rx="3" fill="#e2e8f0" />
            <rect x="303" y="102" width="15" height="25" rx="3" fill="#6366f1" opacity="0.4" />
            <rect x="323" y="90"  width="15" height="37" rx="3" fill="#6366f1" opacity="0.7" />
            <rect x="343" y="96"  width="15" height="31" rx="3" fill="#6366f1" opacity="0.5" />
            <rect x="363" y="84"  width="15" height="43" rx="3" fill="#6366f1" opacity="0.9" />
            <rect x="383" y="100" width="15" height="27" rx="3" fill="#6366f1" opacity="0.4" />
            {/* Woman */}
            <ellipse cx="195" cy="335" rx="48" ry="13" fill="#e2e8f0" opacity="0.5" />
            <rect x="180" y="296" width="15" height="42" rx="7" fill="#3b5bdb" />
            <rect x="199" y="296" width="15" height="42" rx="7" fill="#3b5bdb" />
            <ellipse cx="196" cy="272" rx="30" ry="36" fill="#4f46e5" />
            <ellipse cx="196" cy="246" rx="32" ry="30" fill="#3730a3" />
            <circle cx="196" cy="210" r="26" fill="#fbbf24" opacity="0.9" />
            <ellipse cx="196" cy="197" rx="26" ry="15" fill="#1e1b4b" />
            <path d="M166 250 Q143 263 154 284" stroke="#fbbf24" strokeWidth="11" strokeLinecap="round" fill="none" opacity="0.9" />
            <path d="M226 250 Q254 258 243 276" stroke="#fbbf24" strokeWidth="11" strokeLinecap="round" fill="none" opacity="0.9" />
            <rect x="143" y="274" width="55" height="36" rx="6" fill="#e2e8f0" />
            <rect x="146" y="277" width="49" height="28" rx="4" fill="#6366f1" opacity="0.25" />
            <rect x="138" y="309" width="69" height="6" rx="3" fill="#cbd5e1" />
            {/* Robot */}
            <rect x="308" y="238" width="64" height="74" rx="13" fill="#06b6d4" opacity="0.9" />
            <rect x="313" y="196" width="54" height="48" rx="13" fill="#0891b2" />
            <circle cx="328" cy="215" r="8" fill="white" />
            <circle cx="351" cy="215" r="8" fill="white" />
            <circle cx="329" cy="216" r="4.5" fill="#06b6d4" />
            <circle cx="352" cy="216" r="4.5" fill="#06b6d4" />
            <path d="M326 230 Q340 239 354 230" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <line x1="340" y1="196" x2="340" y2="180" stroke="#0891b2" strokeWidth="3.5" />
            <circle cx="340" cy="176" r="6" fill="#22d3ee" />
            <rect x="287" y="246" width="23" height="11" rx="5" fill="#0891b2" />
            <rect x="370" y="246" width="23" height="11" rx="5" fill="#0891b2" />
            <rect x="316" y="310" width="17" height="30" rx="8" fill="#0891b2" />
            <rect x="347" y="310" width="17" height="30" rx="8" fill="#0891b2" />
            <circle cx="340" cy="272" r="13" fill="white" opacity="0.25" />
            <text x="340" y="277" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">AI</text>
            {/* Sparkles */}
            <circle cx="268" cy="158" r="5" fill="#f59e0b" opacity="0.7" />
            <circle cx="445" cy="175" r="4" fill="#10b981" opacity="0.6" />
            <circle cx="75"  cy="225" r="4" fill="#6366f1" opacity="0.5" />
            <circle cx="425" cy="305" r="6" fill="#f59e0b" opacity="0.4" />
          </svg>

          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#334155', marginTop: '16px' }}>
            Smart HR Management
          </h2>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '14px', lineHeight: '1.6' }}>
            Manage your team effortlessly with AI-powered tools.<br />
            Create, update and summarize employee records instantly.
          </p>
        </div>
      </div>

      {/* RIGHT — Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        background: '#ffffff',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Logo + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{
              width: '48px', height: '48px',
              background: '#4f46e5',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
            }}>
              <svg style={{ width: '28px', height: '28px', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
              Mini AI HR Admin System
            </span>
          </div>

          {/* Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            padding: '36px',
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>
              HR Admin Login
            </h2>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Error */}
              {error && (
                <div style={{
                  background: '#fef2f2', border: '1px solid #fecaca',
                  color: '#dc2626', padding: '12px 16px',
                  borderRadius: '10px', fontSize: '14px',
                }}>
                  {error}
                </div>
              )}

              {/* Email */}
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Work Email"
                style={{
                  width: '100%', padding: '14px 16px',
                  border: '2px solid #818cf8',
                  borderRadius: '12px', fontSize: '14px',
                  color: '#1e293b', outline: 'none',
                  background: '#ffffff',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#4f46e5'}
                onBlur={e => e.target.style.borderColor = '#818cf8'}
              />

              {/* Password */}
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  style={{
                    width: '100%', padding: '14px 48px 14px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px', fontSize: '14px',
                    color: '#1e293b', outline: 'none',
                    background: '#ffffff',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = '#818cf8'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: '14px',
                    top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    cursor: 'pointer', color: '#94a3b8', padding: '0',
                  }}
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Forgot */}
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '14px', color: '#6366f1', cursor: 'pointer' }}>
                  Forgot Password?
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '14px',
                  background: loading ? '#818cf8' : '#4f46e5',
                  color: 'white', border: 'none',
                  borderRadius: '12px', fontSize: '16px',
                  fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '8px',
                  boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
                  transition: 'background 0.2s',
                }}
              >
                {loading && <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

            </form>

            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', marginTop: '20px' }}>
              Secured with Supabase Auth
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}