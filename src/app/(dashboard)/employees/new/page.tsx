import EmployeeForm from '@/components/EmployeeForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewEmployeePage() {
  return (
    <div className="max-w-3xl">
      <Link href="/employees" className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to employees
      </Link>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Add New Employee</h1>
      <EmployeeForm />
    </div>
  )
}