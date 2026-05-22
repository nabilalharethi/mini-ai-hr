// src/lib/actions/employees.ts
// All employee database operations — runs on server only

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { CreateEmployeeInput, UpdateEmployeeInput } from '@/types/employee'

// ─── GET ALL EMPLOYEES ────────────────────────────────────────
export async function getEmployees() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

// ─── GET ONE EMPLOYEE ─────────────────────────────────────────
export async function getEmployee(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('id', id)
    .single()  // throws if 0 or 2+ rows match

  if (error) throw new Error(error.message)
  return data
}

// ─── CREATE EMPLOYEE ──────────────────────────────────────────
export async function createEmployee(input: CreateEmployeeInput) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('employees')
    .insert(input)
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Invalidate Next.js cache on these pages
  revalidatePath('/dashboard')
  revalidatePath('/employees')
  return data
}

// ─── UPDATE EMPLOYEE ──────────────────────────────────────────
export async function updateEmployee({ id, ...updates }: UpdateEmployeeInput) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('employees')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
  revalidatePath('/employees')
  revalidatePath(`/employees/${id}`)
  return data
}

// ─── DEACTIVATE EMPLOYEE ──────────────────────────────────────
// Sets status = 'inactive' — does NOT delete the row
export async function deactivateEmployee(id: string) {
  return updateEmployee({ id, status: 'inactive' })
}

// ─── SEARCH EMPLOYEES ─────────────────────────────────────────
// Used by the AI to find employees by name or email
export async function searchEmployees(query: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
    .order('full_name')

  if (error) throw new Error(error.message)
  return data
}