import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: employees } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false })

  const all      = employees ?? []
  const active   = all.filter(e => e.status === 'active').length
  const inactive = all.filter(e => e.status === 'inactive').length
  const depts    = new Set(all.map(e => e.department)).size

  const stats = [
    { label: 'Total Employees', value: all.length,  color: '#00d4ff', glow: 'rgba(0,212,255,0.3)',  border: 'rgba(0,212,255,0.2)',  bg: 'rgba(0,212,255,0.05)' },
    { label: 'Active',          value: active,       color: '#00ff96', glow: 'rgba(0,255,150,0.3)',  border: 'rgba(0,255,150,0.2)',  bg: 'rgba(0,255,150,0.05)' },
    { label: 'Inactive',        value: inactive,     color: '#ff6b6b', glow: 'rgba(255,107,107,0.3)',border: 'rgba(255,107,107,0.2)',bg: 'rgba(255,107,107,0.05)' },
    { label: 'Departments',     value: depts,        color: '#a78bfa', glow: 'rgba(167,139,250,0.3)',border: 'rgba(167,139,250,0.2)',bg: 'rgba(167,139,250,0.05)' },
  ]

  return (
    <div style={{ maxWidth: '1200px', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px var(--glow) !important; }
        .stat-card { transition: all 0.25s ease; }
        .emp-row:hover { background: rgba(0,212,255,0.04) !important; }
        .emp-row { transition: background 0.15s; }
        .view-all:hover { color: #00d4ff !important; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <p style={{ margin: '0 0 4px 0', color: '#00d4ff', fontSize: '11px', letterSpacing: '0.12em', fontWeight: '600', textTransform: 'uppercase' }}>
            Overview
          </p>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#f1f5f9', letterSpacing: '-0.02em' }}>
            Dashboard
          </h1>
          <p style={{ margin: '6px 0 0', color: '#475569', fontSize: '13px' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link href="/employees/new" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '11px 20px',
          background: 'linear-gradient(90deg, #0099ff, #00d4ff)',
          borderRadius: '10px', color: 'white',
          textDecoration: 'none', fontSize: '13px', fontWeight: '600',
          boxShadow: '0 4px 16px rgba(0,180,255,0.3)',
          letterSpacing: '0.02em',
        }}>
          + New Employee
        </Link>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {stats.map(({ label, value, color, glow, border, bg }) => (
          <div
            key={label}
            className="stat-card"
            style={{
              background: 'rgba(13,25,50,0.7)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${border}`,
              borderRadius: '16px',
              padding: '24px 20px',
              boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px ${border}`,
              '--glow': glow,
            } as React.CSSProperties}
          >
            {/* Top accent line */}
            <div style={{
              height: '2px', width: '40px',
              background: `linear-gradient(90deg, ${color}, transparent)`,
              borderRadius: '2px', marginBottom: '16px',
              boxShadow: `0 0 8px ${color}`,
            }} />
            <p style={{ margin: '0 0 4px', fontSize: '36px', fontWeight: '800', color, letterSpacing: '-0.03em', lineHeight: 1, textShadow: `0 0 20px ${color}` }}>
              {String(value).padStart(2, '0')}
            </p>
            <p style={{ margin: 0, color: '#64748b', fontSize: '12px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent employees table */}
      <div style={{
        background: 'rgba(13,25,50,0.7)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,212,255,0.15)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
      }}>
        {/* Table header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid rgba(0,212,255,0.1)',
          background: 'rgba(0,212,255,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '3px', height: '18px', background: 'linear-gradient(180deg, #00d4ff, #0099ff)', borderRadius: '2px' }} />
            <h2 style={{ margin: 0, color: '#e2e8f0', fontSize: '15px', fontWeight: '600' }}>
              Recent Employees
            </h2>
          </div>
          <Link href="/employees" className="view-all" style={{
            color: '#475569', fontSize: '12px', textDecoration: 'none',
            fontWeight: '500', letterSpacing: '0.04em', transition: 'color 0.2s',
          }}>
            View all →
          </Link>
        </div>

        {/* Column headers */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 100px 120px',
          padding: '10px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          {['Employee', 'Role', 'Department', 'Status', 'Joined'].map(h => (
            <span key={h} style={{ color: '#334155', fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        <div>
          {all.slice(0, 7).map((emp, i) => (
            <Link key={emp.id} href={`/employees/${emp.id}`} className="emp-row" style={{
              display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 100px 120px',
              padding: '14px 24px', textDecoration: 'none',
              borderBottom: i < Math.min(all.length, 7) - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
              alignItems: 'center',
            }}>
              {/* Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '8px', flexShrink: 0,
                  background: 'linear-gradient(135deg, rgba(0,153,255,0.3), rgba(0,212,255,0.15))',
                  border: '1px solid rgba(0,212,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: '700', color: '#00d4ff',
                  boxShadow: '0 0 10px rgba(0,212,255,0.1)',
                }}>
                  {emp.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ margin: 0, color: '#e2e8f0', fontSize: '13px', fontWeight: '500' }}>{emp.full_name}</p>
                  <p style={{ margin: 0, color: '#334155', fontSize: '11px', marginTop: '1px' }}>{emp.email}</p>
                </div>
              </div>
              {/* Role */}
              <span style={{ color: '#64748b', fontSize: '13px' }}>{emp.job_title}</span>
              {/* Department */}
              <span style={{ color: '#64748b', fontSize: '13px' }}>{emp.department}</span>
              {/* Status */}
              <div>
                <span style={{
                  fontSize: '11px', fontWeight: '600', padding: '4px 10px',
                  borderRadius: '20px', letterSpacing: '0.04em',
                  ...(emp.status === 'active'
                    ? { color: '#00ff96', background: 'rgba(0,255,150,0.1)', border: '1px solid rgba(0,255,150,0.25)' }
                    : { color: '#ff6b6b', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.25)' }
                  ),
                }}>
                  {emp.status === 'active' ? '● Active' : '● Inactive'}
                </span>
              </div>
              {/* Date */}
              <span style={{ color: '#334155', fontSize: '12px' }}>
                {emp.joining_date ? format(new Date(emp.joining_date), 'MMM d, yyyy') : '—'}
              </span>
            </Link>
          ))}

          {all.length === 0 && (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px', margin: '0 auto 16px',
                background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="9" cy="7" r="4" stroke="#334155" strokeWidth="2" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <p style={{ color: '#334155', fontSize: '14px', margin: '0 0 12px' }}>No employees yet</p>
              <Link href="/employees/new" style={{
                color: '#00d4ff', fontSize: '13px', textDecoration: 'none', fontWeight: '500',
              }}>
                Add your first employee →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}