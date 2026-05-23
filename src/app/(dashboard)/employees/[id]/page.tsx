import { getEmployee } from '@/lib/actions/employees'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function EmployeeProfilePage({ params }: { params: { id: string } }) {
  let employee
  try { employee = await getEmployee(params.id) }
  catch { notFound() }

  const details = [
    { label: 'Email',           value: employee.email },
    { label: 'Phone',           value: employee.phone },
    { label: 'Location',        value: employee.work_location },
    { label: 'Joining Date',    value: employee.joining_date ? format(new Date(employee.joining_date), 'MMMM d, yyyy') : null },
    { label: 'Employment Type', value: employee.employment_type },
    { label: 'Manager',         value: employee.manager_name },
  ]

  return (
    <div style={{ maxWidth: '800px', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`
        .edit-btn:hover { box-shadow: 0 4px 20px rgba(0,180,255,0.4) !important; transform: translateY(-1px); }
        .edit-btn { transition: all 0.2s; }
        .back-link:hover { color: #00d4ff !important; }
      `}</style>

      {/* Back */}
      <Link href="/employees" className="back-link" style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        color: '#475569', fontSize: '13px', textDecoration: 'none',
        marginBottom: '24px', transition: 'color 0.2s',
      }}>
        ← Back to employees
      </Link>

      {/* Profile header */}
      <div style={{
        background: 'rgba(13,25,50,0.7)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,212,255,0.15)', borderRadius: '16px',
        padding: '28px', marginBottom: '16px',
        boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Avatar */}
            <div style={{
              width: '64px', height: '64px', borderRadius: '14px', flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(0,153,255,0.4), rgba(0,212,255,0.2))',
              border: '1px solid rgba(0,212,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', fontWeight: '800', color: '#00d4ff',
              boxShadow: '0 0 20px rgba(0,212,255,0.15)',
            }}>
              {employee.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '700', color: '#f1f5f9' }}>
                {employee.full_name}
              </h1>
              <p style={{ margin: '0 0 8px', color: '#64748b', fontSize: '14px' }}>{employee.job_title}</p>
              <span style={{
                fontSize: '11px', fontWeight: '600', padding: '4px 12px',
                borderRadius: '20px', letterSpacing: '0.04em',
                ...(employee.status === 'active'
                  ? { color: '#00ff96', background: 'rgba(0,255,150,0.1)', border: '1px solid rgba(0,255,150,0.25)' }
                  : { color: '#ff6b6b', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.25)' }
                ),
              }}>
                {employee.status === 'active' ? '● Active' : '● Inactive'}
              </span>
            </div>
          </div>
          <Link href={`/employees/${employee.id}/edit`} className="edit-btn" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 20px',
            background: 'linear-gradient(90deg, #0099ff, #00d4ff)',
            borderRadius: '10px', color: 'white', textDecoration: 'none',
            fontSize: '13px', fontWeight: '600',
            boxShadow: '0 4px 16px rgba(0,180,255,0.3)',
          }}>
            ✏ Edit
          </Link>
        </div>
      </div>

      {/* Details */}
      <div style={{
        background: 'rgba(13,25,50,0.7)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,212,255,0.15)', borderRadius: '16px',
        padding: '28px', marginBottom: '16px',
        boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
          <div style={{ width: '3px', height: '16px', background: 'linear-gradient(180deg, #00d4ff, #0099ff)', borderRadius: '2px' }} />
          <h2 style={{ margin: 0, color: '#e2e8f0', fontSize: '14px', fontWeight: '600' }}>Employee Details</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {details.map(({ label, value }) => (
            <div key={label}>
              <p style={{ margin: '0 0 4px', fontSize: '10px', fontWeight: '600', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {label}
              </p>
              <p style={{ margin: 0, fontSize: '14px', color: value ? '#94a3b8' : '#334155' }}>
                {value || '—'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Summary */}
      {employee.summary && (
        <div style={{
          background: 'rgba(0,153,255,0.05)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,212,255,0.2)', borderRadius: '16px',
          padding: '28px', boxShadow: '0 4px 20px rgba(0,180,255,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
              width: '28px', height: '28px',
              background: 'linear-gradient(135deg, #0099ff, #00d4ff)',
              borderRadius: '8px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', boxShadow: '0 0 12px rgba(0,212,255,0.3)',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h2 style={{ margin: 0, color: '#00d4ff', fontSize: '14px', fontWeight: '600' }}>
              AI-Generated Summary
            </h2>
          </div>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px', lineHeight: '1.7' }}>
            {employee.summary}
          </p>
        </div>
      )}
    </div>
  )
}