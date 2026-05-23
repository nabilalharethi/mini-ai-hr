'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, Mail, Lock } from 'lucide-react'

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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b2e 40%, #0a1628 70%, #0d2137 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>

      {/* ── Circuit board SVG background ── */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.25 }}
        xmlns="http://www.w3.org/2000/svg">
        {/* Horizontal lines */}
        <line x1="0" y1="120" x2="600" y2="120" stroke="#00d4ff" strokeWidth="0.8" opacity="0.5" />
        <line x1="0" y1="280" x2="400" y2="280" stroke="#00d4ff" strokeWidth="0.8" opacity="0.4" />
        <line x1="200" y1="450" x2="800" y2="450" stroke="#00d4ff" strokeWidth="0.8" opacity="0.3" />
        <line x1="900" y1="200" x2="1500" y2="200" stroke="#00d4ff" strokeWidth="0.8" opacity="0.4" />
        <line x1="1000" y1="380" x2="1500" y2="380" stroke="#00d4ff" strokeWidth="0.8" opacity="0.3" />
        <line x1="0" y1="600" x2="300" y2="600" stroke="#00d4ff" strokeWidth="0.8" opacity="0.3" />
        <line x1="1100" y1="550" x2="1500" y2="550" stroke="#00d4ff" strokeWidth="0.8" opacity="0.4" />
        <line x1="0" y1="750" x2="500" y2="750" stroke="#00d4ff" strokeWidth="0.8" opacity="0.3" />
        {/* Vertical lines */}
        <line x1="150" y1="0" x2="150" y2="400" stroke="#00d4ff" strokeWidth="0.8" opacity="0.4" />
        <line x1="350" y1="200" x2="350" y2="700" stroke="#00d4ff" strokeWidth="0.8" opacity="0.3" />
        <line x1="1200" y1="0" x2="1200" y2="350" stroke="#00d4ff" strokeWidth="0.8" opacity="0.4" />
        <line x1="1380" y1="150" x2="1380" y2="600" stroke="#00d4ff" strokeWidth="0.8" opacity="0.3" />
        <line x1="80" y1="500" x2="80" y2="900" stroke="#00d4ff" strokeWidth="0.8" opacity="0.3" />
        <line x1="1450" y1="400" x2="1450" y2="900" stroke="#00d4ff" strokeWidth="0.8" opacity="0.3" />
        {/* Circuit nodes (dots) */}
        {[
          [150,120],[350,280],[80,600],[1200,200],[1380,380],[1450,550],
          [150,280],[350,120],[1200,380],[80,750],[1380,200],[350,450],
        ].map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill="#00d4ff" opacity="0.7" />
        ))}
        {/* Small dots */}
        {[
          [150,200],[350,380],[80,680],[1200,280],[1380,460],
          [250,120],[450,280],[180,450],[1300,200],[1480,380],
        ].map(([x,y], i) => (
          <circle key={`s${i}`} cx={x} cy={y} r="2" fill="#00d4ff" opacity="0.5" />
        ))}
        {/* L-shaped connectors */}
        <path d="M150 120 L150 200 L350 200" stroke="#00d4ff" strokeWidth="0.8" fill="none" opacity="0.4" />
        <path d="M350 280 L350 380 L1200 380" stroke="#00d4ff" strokeWidth="0.8" fill="none" opacity="0.3" />
        <path d="M1200 200 L1380 200 L1380 380" stroke="#00d4ff" strokeWidth="0.8" fill="none" opacity="0.4" />
        <path d="M80 600 L80 750 L350 750" stroke="#00d4ff" strokeWidth="0.8" fill="none" opacity="0.3" />
        <path d="M1380 550 L1450 550 L1450 700" stroke="#00d4ff" strokeWidth="0.8" fill="none" opacity="0.3" />
      </svg>

      {/* ── Glowing orbs ── */}
      <div style={{
        position: 'absolute', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(0,150,255,0.08) 0%, transparent 70%)',
        top: '-100px', left: '-100px', borderRadius: '50%',
      }} />
      <div style={{
        position: 'absolute', width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
        bottom: '-50px', right: '200px', borderRadius: '50%',
      }} />

      {/* ── Login Card ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: '100%', maxWidth: '440px',
        margin: '24px',
        background: 'rgba(13, 25, 50, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 212, 255, 0.2)',
        borderRadius: '20px',
        padding: '48px 40px',
        boxShadow: '0 0 60px rgba(0,150,255,0.1), 0 25px 50px rgba(0,0,0,0.5)',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            justifyContent: 'center', marginBottom: '16px',
          }}>
            {/* M+AI logo */}
            <div style={{ position: 'relative' }}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <defs>
                  <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#00d4ff" />
                  </linearGradient>
                </defs>
                {/* M letter */}
                <path d="M8 48 L8 18 L24 36 L40 18 L40 48" stroke="url(#logoGrad)"
                  strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                {/* AI circuit nodes */}
                <circle cx="48" cy="16" r="4" fill="#00d4ff" />
                <circle cx="58" cy="24" r="3" fill="#00d4ff" opacity="0.7" />
                <circle cx="54" cy="34" r="3" fill="#00d4ff" opacity="0.7" />
                <line x1="48" y1="16" x2="58" y2="24" stroke="#00d4ff" strokeWidth="1.5" opacity="0.8" />
                <line x1="58" y1="24" x2="54" y2="34" stroke="#00d4ff" strokeWidth="1.5" opacity="0.8" />
                <line x1="48" y1="16" x2="54" y2="34" stroke="#00d4ff" strokeWidth="1.5" opacity="0.5" />
                {/* AI text */}
                <text x="44" y="52" fontSize="10" fontWeight="bold" fill="#00d4ff">AI</text>
              </svg>
            </div>
          </div>
          <h1 style={{ color: '#e2e8f0', fontSize: '20px', fontWeight: '600', margin: 0 }}>
            Mini AI HR Admin System
          </h1>
        </div>

        {/* Title */}
        <h2 style={{
          color: '#f1f5f9', fontSize: '26px', fontWeight: '700',
          margin: '0 0 28px 0', textAlign: 'center',
        }}>
          Admin Login
        </h2>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5', padding: '12px 16px', borderRadius: '10px', fontSize: '13px',
            }}>
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
              Work Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your work email"
                style={{
                  width: '100%', padding: '13px 44px 13px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(0,212,255,0.25)',
                  borderRadius: '10px', fontSize: '14px',
                  color: '#e2e8f0', outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(0,212,255,0.25)'}
              />
              <Mail size={16} color="#64748b" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••"
                style={{
                  width: '100%', padding: '13px 44px 13px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(0,212,255,0.15)',
                  borderRadius: '10px', fontSize: '14px',
                  color: '#e2e8f0', outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(0,212,255,0.15)'}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', padding: '2px',
                  display: 'flex', alignItems: 'center',
                }}
              >
                <Lock size={16} color="#64748b" />
              </button>
            </div>
          </div>

          {/* Sign In button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(90deg, #0099ff 0%, #00d4ff 100%)',
              border: 'none', borderRadius: '10px',
              color: 'white', fontSize: '16px', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.8 : 1,
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px',
              boxShadow: '0 4px 20px rgba(0,180,255,0.35)',
              marginTop: '4px',
              transition: 'opacity 0.2s, transform 0.1s',
            }}
          >
            {loading && <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Forgot password */}
          <p style={{ textAlign: 'center', margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
            <span style={{ color: '#00d4ff', cursor: 'pointer' }}>Forgot Password?</span>
          </p>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ color: '#475569', fontSize: '12px' }}>or sign in with SSO</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* SSO buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <div style={{
              padding: '8px 14px', background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
              color: '#94a3b8', fontSize: '12px', fontWeight: '600',
              cursor: 'pointer',
            }}>
              SSO
            </div>
            <div style={{
              padding: '8px 14px', background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#00d4ff">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
          </div>

          {/* Authorized only */}
          <p style={{ textAlign: 'center', color: '#475569', fontSize: '12px', margin: '0' }}>
            Authorized HR Admins Only
          </p>

        </form>

        {/* Footer */}
        <p style={{ textAlign: 'center', color: '#334155', fontSize: '12px', marginTop: '24px', marginBottom: 0 }}>
          Secured by Supabase Auth
        </p>

      </div>

      {/* ── Sparkle bottom right ── */}
      <div style={{ position: 'absolute', bottom: '32px', right: '32px', zIndex: 5 }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 2 L17.5 14 L30 16 L17.5 18 L16 30 L14.5 18 L2 16 L14.5 14 Z"
            fill="white" opacity="0.6" />
        </svg>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder { color: #475569; }
      `}</style>
    </div>
  )
}