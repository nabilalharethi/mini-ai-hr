import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function EmployeesPage() {
  const supabase = await createClient()
  const { data: employees } = await supabase
    .from('employees').select('*').order('full_name')
  const all = employees ?? []

  return (
    <div style={{ maxWidth: '1200px', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`
        .emp-row:hover { background: rgba(0,212,255,0.04) !important; }
        .add-btn:hover { box-shadow: 0 4px 24px rgba(0,180,255,0.5) !important; transform: translateY(-1px); }
        .add-btn { transition: all 0.2s; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <p style={{ margin: '0 0 4px', color: '#00d4ff', fontSize: '11px', letterSpacing: '0.12em', fontWeight: '600', textTransform: 'uppercase' }}>
            HR Management
          </p>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#f1f5f9', letterSpacing: '-0.02em' }}>
            Employees
          </h1>
          <p style={{ margin: '6px 0 0', color: '#475569', fontSize: '13px' }}>
            {all.length} total records
          </p>
        </div>
        <Link href="/employees/new" className="add-btn" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '11px 20px',
          background: 'linear-gradient(90deg, #0099ff, #00d4ff)',
          borderRadius: '10px', color: 'white', textDecoration: 'none',
          fontSize: '13px', fontWeight: '600',
          boxShadow: '0 4px 16px rgba(0,180,255,0.3)',
        }}>
          + Add Employee
        </Link>
      </div>

      {/* Table */}
      <div style={{
        background: 'rgba(13,25,50,0.7)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,212,255,0.15)', borderRadius: '16px',
        overflow: 'hidden', boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
      }}>
        {/* Column headers */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 100px 120px',
          padding: '14px 24px',
          background: 'rgba(0,212,255,0.03)',
          borderBottom: '1px solid rgba(0,212,255,0.1)',
        }}>
          {['Employee', 'Role', 'Department', 'Status', 'Joined'].map(h => (
            <span key={h} style={{ color: '#334155', fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        <div>
          {all.map((emp, i) => (
            <Link key={emp.id} href={`/employees/${emp.id}`} className="emp-row" style={{
              display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 100px 120px',
              padding: '14px 24px', textDecoration: 'none', alignItems: 'center',
              borderBottom: i < all.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
              transition: 'background 0.15s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '8px', flexShrink: 0,
                  background: 'linear-gradient(135deg, rgba(0,153,255,0.3), rgba(0,212,255,0.15))',
                  border: '1px solid rgba(0,212,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: '700', color: '#00d4ff',
                }}>
                  {emp.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ margin: 0, color: '#e2e8f0', fontSize: '13px', fontWeight: '500' }}>{emp.full_name}</p>
                  <p style={{ margin: 0, color: '#334155', fontSize: '11px' }}>{emp.email}</p>
                </div>
              </div>
              <span style={{ color: '#64748b', fontSize: '13px' }}>{emp.job_title}</span>
              <span style={{ color: '#64748b', fontSize: '13px' }}>{emp.department}</span>
              <span style={{
                fontSize: '11px', fontWeight: '600', padding: '4px 10px',
                borderRadius: '20px', letterSpacing: '0.04em', display: 'inline-block',
                ...(emp.status === 'active'
                  ? { color: '#00ff96', background: 'rgba(0,255,150,0.1)', border: '1px solid rgba(0,255,150,0.25)' }
                  : { color: '#ff6b6b', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.25)' }
                ),
              }}>
                {emp.status === 'active' ? '● Active' : '● Inactive'}
              </span>
              <span style={{ color: '#334155', fontSize: '12px' }}>
                {emp.joining_date ? format(new Date(emp.joining_date), 'MMM d, yyyy') : '—'}
              </span>
            </Link>
          ))}
          {all.length === 0 && (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <p style={{ color: '#334155', margin: '0 0 12px', fontSize: '14px' }}>No employees found</p>
              <Link href="/employees/new" style={{ color: '#00d4ff', fontSize: '13px', textDecoration: 'none' }}>
                Add your first employee →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}