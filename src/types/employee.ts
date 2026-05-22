// src/types/employee.ts
// Single source of truth for Employee-related types

export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'intern'
export type EmployeeStatus = 'active' | 'inactive'

export interface Employee {
  id: string
  full_name: string
  email: string
  phone: string | null
  job_title: string
  department: string
  employment_type: EmploymentType
  joining_date: string | null    // ISO date: "2026-06-01"
  status: EmployeeStatus
  manager_name: string | null
  work_location: string | null
  summary: string | null         // AI-generated summary
  created_at: string
  updated_at: string
}

// For creating a new employee — no id or timestamps
export type CreateEmployeeInput = Omit<Employee, 'id' | 'created_at' | 'updated_at'>

// For updating — all fields optional, but id is required
export type UpdateEmployeeInput = Partial<CreateEmployeeInput> & { id: string }