import { getEmployee } from '@/lib/actions/employees'
import EmployeeForm from '@/components/EmployeeForm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function EditEmployeePage({ params }: { params: { id: string } }) {
  let employee
  try { employee = await getEmployee(params.id) }
  catch { notFound() }

  return (
    <div className="max-w-3xl">
      <Link href={`/employees/${params.id}`} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to profile
      </Link>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Edit Employee</h1>
      <EmployeeForm employee={employee} />
    </div>
  )
}