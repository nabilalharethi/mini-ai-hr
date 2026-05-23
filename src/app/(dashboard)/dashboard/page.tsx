import { createClient } from '@/lib/supabase/server'
import { Users, UserCheck, UserX, Building2, ArrowRight } from 'lucide-react'
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
    { label: 'Total Employees', value: all.length, icon: Users,     bg: 'bg-indigo-50', iconColor: 'text-indigo-600', border: 'border-indigo-100' },
    { label: 'Active',          value: active,      icon: UserCheck, bg: 'bg-green-50',  iconColor: 'text-green-600',  border: 'border-green-100' },
    { label: 'Inactive',        value: inactive,    icon: UserX,     bg: 'bg-red-50',    iconColor: 'text-red-500',    border: 'border-red-100' },
    { label: 'Departments',     value: depts,       icon: Building2, bg: 'bg-blue-50',   iconColor: 'text-blue-600',   border: 'border-blue-100' },
  ]

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back — here's your HR overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, bg, iconColor, border }) => (
          <div key={label} className={`bg-white rounded-2xl border ${border} shadow-sm p-5 flex items-center gap-4`}>
            <div className={`${bg} p-3 rounded-xl`}>
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{value}</p>
              <p className="text-slate-500 text-sm">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent employees */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Recent Employees</h2>
          <Link href="/employees" className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-slate-50">
          {all.slice(0, 6).map(emp => (
            <Link key={emp.id} href={`/employees/${emp.id}`}
              className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm flex-shrink-0">
                  {emp.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-slate-800 font-medium text-sm">{emp.full_name}</p>
                  <p className="text-slate-400 text-xs">{emp.job_title} · {emp.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                  emp.status === 'active'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-600 border-red-200'
                }`}>
                  {emp.status}
                </span>
                {emp.joining_date && (
                  <span className="text-slate-400 text-xs hidden sm:block">
                    {format(new Date(emp.joining_date), 'MMM d, yyyy')}
                  </span>
                )}
              </div>
            </Link>
          ))}
          {all.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No employees yet.</p>
              <Link href="/employees/new" className="inline-block mt-3 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                Add your first employee →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}