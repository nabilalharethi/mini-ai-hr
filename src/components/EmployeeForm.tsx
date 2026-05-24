'use client'

import { useState, useCallback } from 'react'
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

  // useCallback prevents function recreation on every render
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (isEditing) {
        await updateEmployee({ id: employee.id, ...formData })
        toast.success('Employee updated successfully!')
        router.push(`/employees/${employee.id}`)
      } else {
        const created = await createEmployee(formData)
        toast.success('Employee created successfully!')
        router.push(`/employees/${created.id}`)
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(0,212,255,0.15)',
    borderRadius: '10px',
    fontSize: '13px',
    color: '#e2e8f0',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'system-ui, sans-serif',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: '600',
    color: '#475569',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  }

  const sectionStyle: React.CSSProperties = {
    background: 'rgba(13,25,50,0.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(0,212,255,0.15)',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  }

  return (
    <>
      <style>{`
        .form-input:focus {
          border-color: rgba(0,212,255,0.5) !important;
          box-shadow: 0 0 0 3px rgba(0,212,255,0.08) !important;
        }
        .form-input::placeholder { color: #334155; }
        .form-input option { background: #0d1b2e; color: #e2e8f0; }
        .cancel-btn:hover { background: rgba(255,255,255,0.08) !important; color: #e2e8f0 !important; }
        .submit-btn:hover { box-shadow: 0 4px 24px rgba(0,180,255,0.5) !important; transform: translateY(-1px); }
        .submit-btn { transition: all 0.2s; }
      `}</style>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'system-ui, sans-serif' }}
      >

        {/* Personal Information */}
        <div style={sectionStyle}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '24px', paddingBottom: '16px',
            borderBottom: '1px solid rgba(0,212,255,0.08)',
          }}>
            <div style={{ width: '3px', height: '16px', background: 'linear-gradient(180deg, #00d4ff, #0099ff)', borderRadius: '2px' }} />
            <h3 style={{ margin: 0, color: '#e2e8f0', fontSize: '14px', fontWeight: '600' }}>
              Personal Information
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

            <div>
              <label style={labelStyle}>Full Name <span style={{ color: '#ff6b6b' }}>*</span></label>
              <input
                className="form-input"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                style={inputStyle}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label style={labelStyle}>Email Address <span style={{ color: '#ff6b6b' }}>*</span></label>
              <input
                className="form-input"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                style={inputStyle}
                placeholder="john@company.com"
              />
            </div>

            <div>
              <label style={labelStyle}>Phone Number</label>
              <input
                className="form-input"
                name="phone"
                value={formData.phone ?? ''}
                onChange={handleChange}
                style={inputStyle}
                placeholder="+46 70 123 4567"
              />
            </div>

            <div>
              <label style={labelStyle}>Work Location</label>
              <input
                className="form-input"
                name="work_location"
                value={formData.work_location ?? ''}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Stockholm"
              />
            </div>

          </div>
        </div>

        {/* Employment Details */}
        <div style={sectionStyle}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '24px', paddingBottom: '16px',
            borderBottom: '1px solid rgba(0,212,255,0.08)',
          }}>
            <div style={{ width: '3px', height: '16px', background: 'linear-gradient(180deg, #00d4ff, #0099ff)', borderRadius: '2px' }} />
            <h3 style={{ margin: 0, color: '#e2e8f0', fontSize: '14px', fontWeight: '600' }}>
              Employment Details
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

            <div>
              <label style={labelStyle}>Job Title <span style={{ color: '#ff6b6b' }}>*</span></label>
              <input
                className="form-input"
                name="job_title"
                required
                value={formData.job_title}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Software Engineer"
              />
            </div>

            <div>
              <label style={labelStyle}>Department <span style={{ color: '#ff6b6b' }}>*</span></label>
              <input
                className="form-input"
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Engineering"
              />
            </div>

            <div>
              <label style={labelStyle}>Employment Type</label>
              <select
                className="form-input"
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="intern">Intern</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Status</label>
              <select
                className="form-input"
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Joining Date</label>
              <input
                className="form-input"
                name="joining_date"
                type="date"
                value={formData.joining_date ?? ''}
                onChange={handleChange}
                style={{ ...inputStyle, colorScheme: 'dark' }}
              />
            </div>

            <div>
              <label style={labelStyle}>Manager Name</label>
              <input
                className="form-input"
                name="manager_name"
                value={formData.manager_name ?? ''}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Sarah Miller"
              />
            </div>

          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 28px',
              background: loading
                ? 'rgba(0,180,255,0.3)'
                : 'linear-gradient(90deg, #0099ff, #00d4ff)',
              border: 'none', borderRadius: '10px',
              color: 'white', fontSize: '14px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(0,180,255,0.3)',
            }}
          >
            {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
            {isEditing ? 'Save Changes' : 'Create Employee'}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="cancel-btn"
            style={{
              padding: '12px 24px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#475569', fontSize: '14px', fontWeight: '500',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            Cancel
          </button>
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </form>
    </>
  )
}