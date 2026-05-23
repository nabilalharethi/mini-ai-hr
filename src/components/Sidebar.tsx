'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Users, UserPlus, MessageSquareText, LogOut } from 'lucide-react'

const navItems = [
  { href: '/dashboard',     label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/employees',     label: 'Employees',    icon: Users },
  { href: '/employees/new', label: 'Add Employee', icon: UserPlus },
  { href: '/ai-assistant',  label: 'AI Assistant', icon: MessageSquareText },
]

export default function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      <style>{`
        .nav-link { transition: all 0.2s; }
        .nav-link:hover { background: rgba(0,212,255,0.08) !important; color: #00d4ff !important; }
        .logout-btn:hover { background: rgba(255,60,60,0.1) !important; color: #ff6b6b !important; }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <aside style={{
        position: 'fixed', left: 0, top: 0,
        height: '100vh', width: '260px',
        background: 'rgba(8,15,35,0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(0,212,255,0.15)',
        display: 'flex', flexDirection: 'column',
        zIndex: 100,
        boxShadow: '4px 0 30px rgba(0,0,0,0.4)',
      }}>

        {/* Logo */}
        <div style={{
          padding: '28px 24px',
          borderBottom: '1px solid rgba(0,212,255,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Logo icon */}
            <div style={{
              width: '40px', height: '40px',
              background: 'linear-gradient(135deg, #0099ff, #00d4ff)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(0,212,255,0.4)',
              flexShrink: 0,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 20 L4 8 L12 14 L20 8 L20 20" stroke="white"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="18" cy="5" r="2.5" fill="white" opacity="0.9" />
                <line x1="20" y1="6.5" x2="22" y2="4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: '700', color: '#e2e8f0', fontSize: '14px', letterSpacing: '0.02em' }}>
                Mini AI HR
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#00d4ff',
                  animation: 'pulse-dot 2s ease-in-out infinite',
                  boxShadow: '0 0 6px #00d4ff',
                }} />
                <p style={{ margin: 0, color: '#00d4ff', fontSize: '10px', letterSpacing: '0.08em', fontWeight: '500' }}>
                  ADMIN PORTAL
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className="nav-link"
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '11px 14px', borderRadius: '10px',
                  fontSize: '13.5px', fontWeight: active ? '600' : '500',
                  textDecoration: 'none',
                  color: active ? '#00d4ff' : '#64748b',
                  background: active
                    ? 'linear-gradient(90deg, rgba(0,153,255,0.15), rgba(0,212,255,0.08))'
                    : 'transparent',
                  borderLeft: active ? '2px solid #00d4ff' : '2px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={16} />
                {label}
                {active && (
                  <div style={{
                    marginLeft: 'auto', width: '6px', height: '6px',
                    borderRadius: '50%', background: '#00d4ff',
                    boxShadow: '0 0 8px #00d4ff',
                  }} />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User + logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(0,212,255,0.1)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', marginBottom: '8px',
            background: 'rgba(0,212,255,0.04)',
            borderRadius: '10px', border: '1px solid rgba(0,212,255,0.08)',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #0099ff, #00d4ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: '700', color: 'white',
              flexShrink: 0, boxShadow: '0 0 10px rgba(0,212,255,0.3)',
            }}>
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <p style={{ margin: 0, color: '#64748b', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userEmail}
            </p>
          </div>
          <button
            className="logout-btn"
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              color: '#475569', fontSize: '13px', fontWeight: '500',
              width: '100%', padding: '10px 14px', borderRadius: '10px',
              background: 'none', border: 'none', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}