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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

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

  const inputClass = 'w-full bg-white border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-slate-800 rounded-xl px-4 py-2.5 outline-none transition-all text-sm placeholder-slate-400'
  const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Personal */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-5 pb-3 border-b border-slate-100">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Full Name <span className="text-red-400">*</span></label>
            <input name="full_name" required value={formData.full_name} onChange={handleChange} className={inputClass} placeholder="John Doe" />
          </div>
          <div>
            <label className={labelClass}>Email Address <span className="text-red-400">*</span></label>
            <input name="email" type="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder="john@company.com" />
          </div>
          <div>
            <label className={labelClass}>Phone Number</label>
            <input name="phone" value={formData.phone ?? ''} onChange={handleChange} className={inputClass} placeholder="+46 70 123 4567" />
          </div>
          <div>
            <label className={labelClass}>Work Location</label>
            <input name="work_location" value={formData.work_location ?? ''} onChange={handleChange} className={inputClass} placeholder="Stockholm" />
          </div>
        </div>
      </div>

      {/* Employment */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-5 pb-3 border-b border-slate-100">
          Employment Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Job Title <span className="text-red-400">*</span></label>
            <input name="job_title" required value={formData.job_title} onChange={handleChange} className={inputClass} placeholder="Software Engineer" />
          </div>
          <div>
            <label className={labelClass}>Department <span className="text-red-400">*</span></label>
            <input name="department" required value={formData.department} onChange={handleChange} className={inputClass} placeholder="Engineering" />
          </div>
          <div>
            <label className={labelClass}>Employment Type</label>
            <select name="employment_type" value={formData.employment_type} onChange={handleChange} className={inputClass}>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="intern">Intern</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Joining Date</label>
            <input name="joining_date" type="date" value={formData.joining_date ?? ''} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Manager Name</label>
            <input name="manager_name" value={formData.manager_name ?? ''} onChange={handleChange} className={inputClass} placeholder="Sarah Miller" />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl px-6 py-2.5 transition-colors shadow-sm">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEditing ? 'Save Changes' : 'Create Employee'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors text-sm font-medium">
          Cancel
        </button>
      </div>
    </form>
  )
}