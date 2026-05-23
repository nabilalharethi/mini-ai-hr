'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createEmployee, updateEmployee } from '@/lib/actions/employees'
import type { Employee, CreateEmployeeInput } from '@/types/employee'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props { employee?: Employee }

export default function EmployeeForm({ employee }: Props) {
  const router    = useRouter()
  const isEditing = !!employee

  const [formData, setFormData] = useState<CreateEmployeeInput>({
    full_name:       employee?.full_name       ?? '',
    email:           employee?.email           ?? '',
    phone:           employee?.phone           ?? '',
    job_title:       employee?.job_title       ?? '',
    department:      employee?.department      ?? '',
    employment_type: employee?.employment_type ?? 'full-time',
    joining_date:    employee?.joining_date    ?? '',
    status:          employee?.status          ?? 'active',
    manager_name:    employee?.manager_name    ?? '',
    work_location:   employee?.work_location   ?? '',
    summary:         employee?.summary         ?? '',
  })
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (isEditing) {
        await updateEmployee({ id: employee.id, ...formData })
        toast.success('Employee updated!')
        router.push(`/employees/${employee.id}`)
      } else {
        const created = await createEmployee(formData)
        toast.success('Employee created!')
        router.push(`/employees/${created.id}`)
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(0,212,255,0.15)',
    borderRadius: '10px', fontSize: '13px',
    color: '#e2e8f0', outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    fontFamily: 'system-ui, sans-serif',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '11px', fontWeight: '600',
    color: '#475569', marginBottom: '8px',
    textTransform: 'uppercase', letterSpacing: '0.08em',
  }

  const sectionStyle: React.CSSProperties = {
    background: 'rgba(13,25,50,0.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(0,212,255,0.15)',
    borderRadius: '16px', padding: '28px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  }

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`
        .form-input:focus { border-color: rgba(0,212,255,0.5) !important; box-shadow: 0 0 0 3px rgba(0,212,255,0.08); }
        .form-input::placeholder { color: #334155; }
      `}</style>

      {/* Personal */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
          <div style={{ width: '3px', height: '16px', background: 'linear-gradient(180deg, #00d4ff, #0099ff)', borderRadius: '2px' }} />
          <h3 style={{ margin: 0, color: '#e2e8f0', fontSize: '14px', fontWeight: '600' }}>Personal Information</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="Full Name *">
            <input name="full_name" required value={formData.full_name} onChange={handleChange}
              className="form-input" style={inputStyle} placeholder="John Doe" />
          </Field>
          <Field label="Email Address *">
            <input name="email" type="email" required value={formData.email} onChange={handleChange}
              className="form-input" style={inputStyle} placeholder="john@company.com" />
          </Field>
          <Field label="Phone Number">
            <input name="phone" value={formData.phone ?? ''} onChange={handleChange}
              className="form-input" style={inputStyle} placeholder="+46 70 123 4567" />
          </Field>
          <Field label="Work Location">
            <input name="work_location" value={formData.work_location ?? ''} onChange={handleChange}
              className="form-input" style={inputStyle} placeholder="Stockholm" />
          </Field>
        </div>
      </div>

      {/* Employment */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
          <div style={{ width: '3px', height: '16px', background: 'linear-gradient(180deg, #00d4ff, #0099ff)', borderRadius: '2px' }} />
          <h3 style={{ margin: 0, color: '#e2e8f0', fontSize: '14px', fontWeight: '600' }}>Employment Details</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="Job Title *">
            <input name="job_title" required value={formData.job_title} onChange={handleChange}
              className="form-input" style={inputStyle} placeholder="Software Engineer" />
          </Field>
          <Field label="Department *">
            <input name="department" required value={formData.department} onChange={handleChange}
              className="form-input" style={inputStyle} placeholder="Engineering" />
          </Field>
          <Field label="Employment Type">
            <select name="employment_type" value={formData.employment_type} onChange={handleChange}
              className="form-input" style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="intern">Intern</option>
            </select>
          </Field>
          <Field label="Status">
            <select name="status" value={formData.status} onChange={handleChange}
              className="form-input" style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>
          <Field label="Joining Date">
            <input name="joining_date" type="date" value={formData.joining_date ?? ''} onChange={handleChange}
              className="form-input" style={{ ...inputStyle, colorScheme: 'dark' }} />
          </Field>
          <Field label="Manager Name">
            <input name="manager_name" value={formData.manager_name ?? ''} onChange={handleChange}
              className="form-input" style={inputStyle} placeholder="Sarah Miller" />
          </Field>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button type="submit" disabled={loading} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '12px 28px',
          background: 'linear-gradient(90deg, #0099ff, #00d4ff)',
          border: 'none', borderRadius: '10px', color: 'white',
          fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          boxShadow: '0 4px 16px rgba(0,180,255,0.3)',
          transition: 'all 0.2s',
        }}>
          {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
          {isEditing ? 'Save Changes' : 'Create Employee'}
        </button>
        <button type="button" onClick={() => router.back()} style={{
          padding: '12px 24px', borderRadius: '10px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#64748b', fontSize: '14px', fontWeight: '500',
          cursor: 'pointer', transition: 'all 0.2s',
        }}>
          Cancel
        </button>
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </form>
  )
}