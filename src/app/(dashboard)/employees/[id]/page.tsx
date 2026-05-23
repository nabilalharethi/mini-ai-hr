import { getEmployee } from '@/lib/actions/employees'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { Pencil, ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, User } from 'lucide-react'

export default async function EmployeeProfilePage({ params }: { params: { id: string } }) {
  let employee
  try { employee = await getEmployee(params.id) }
  catch { notFound() }

  const details = [
    { label: 'Email',           value: employee.email,           icon: Mail },
    { label: 'Phone',           value: employee.phone,           icon: Phone },
    { label: 'Location',        value: employee.work_location,   icon: MapPin },
    { label: 'Joining Date',    value: employee.joining_date ? format(new Date(employee.joining_date), 'MMMM d, yyyy') : null, icon: Calendar },
    { label: 'Employment Type', value: employee.employment_type, icon: Briefcase },
    { label: 'Manager',         value: employee.manager_name,    icon: User },
  ]

  return (
    <div className="max-w-3xl">
      <Link href="/employees" className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to employees
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
              {employee.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{employee.full_name}</h1>
              <p className="text-slate-500 text-sm mt-0.5">{employee.job_title}</p>
              <p className="text-slate-400 text-xs mt-0.5">{employee.department}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-3 py-1.5 rounded-full font-medium border ${
              employee.status === 'active'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-600 border-red-200'
            }`}>
              {employee.status === 'active' ? '● Active' : '● Inactive'}
            </span>
            <Link href={`/employees/${employee.id}/edit`}
              className="flex items-center gap-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl transition-colors shadow-sm">
              <Pencil className="w-3.5 h-3.5" /> Edit
            </Link>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">
        <h2 className="font-semibold text-slate-800 mb-4 pb-3 border-b border-slate-100">Employee Details</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {details.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <dt className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</dt>
                <dd className="text-slate-700 text-sm mt-0.5">{value || '—'}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>

      {/* AI Summary */}
      {employee.summary && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="font-semibold text-indigo-700 text-sm">AI-Generated Summary</h2>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">{employee.summary}</p>
        </div>
      )}
    </div>
  )
}