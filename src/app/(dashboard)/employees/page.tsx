import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import { format } from 'date-fns'

export default async function EmployeesPage() {
  const supabase = await createClient()
  const { data: employees } = await supabase
    .from('employees').select('*').order('full_name')

  const all = employees ?? []

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Employees</h1>
          <p className="text-slate-500 mt-1">{all.length} total members</p>
        </div>
        <Link href="/employees/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
          <UserPlus className="w-4 h-4" />
          Add Employee
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['Employee', 'Role', 'Department', 'Status', 'Joined'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {all.map(emp => (
              <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <Link href={`/employees/${emp.id}`} className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm flex-shrink-0">
                      {emp.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-slate-800 font-medium text-sm group-hover:text-indigo-600 transition-colors">
                        {emp.full_name}
                      </p>
                      <p className="text-slate-400 text-xs">{emp.email}</p>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm">{emp.job_title}</td>
                <td className="px-6 py-4 text-slate-600 text-sm">{emp.department}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                    emp.status === 'active'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-red-50 text-red-600 border-red-200'
                  }`}>
                    {emp.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">
                  {emp.joining_date ? format(new Date(emp.joining_date), 'MMM d, yyyy') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {all.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-slate-500 text-sm">No employees found.</p>
            <Link href="/employees/new" className="inline-block mt-3 text-indigo-600 text-sm font-medium">
              Add your first employee →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}