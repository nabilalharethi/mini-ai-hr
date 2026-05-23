import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'
import {
  createEmployee,
  updateEmployee,
  deactivateEmployee,
  getEmployees,
  searchEmployees,
} from '@/lib/actions/employees'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const tools = [
  {
    functionDeclarations: [
      {
        name: 'create_employee',
        description: 'Create a new employee record in the HR system',
        parameters: {
          type: 'object',
          properties: {
            full_name:       { type: 'string', description: 'Full name' },
            email:           { type: 'string', description: 'Work email' },
            phone:           { type: 'string', description: 'Phone number' },
            job_title:       { type: 'string', description: 'Job title' },
            department:      { type: 'string', description: 'Department name' },
            employment_type: { type: 'string', description: 'full-time, part-time, contract, or intern' },
            joining_date:    { type: 'string', description: 'Start date YYYY-MM-DD' },
            status:          { type: 'string', description: 'active or inactive' },
            manager_name:    { type: 'string', description: 'Manager full name' },
            work_location:   { type: 'string', description: 'City or office' },
          },
          required: ['full_name', 'email', 'job_title', 'department'],
        },
      },
      {
        name: 'search_and_update_employee',
        description: 'Search for an employee by name and update their details',
        parameters: {
          type: 'object',
          properties: {
            search_name:     { type: 'string', description: 'Name to search for' },
            full_name:       { type: 'string' },
            email:           { type: 'string' },
            phone:           { type: 'string' },
            job_title:       { type: 'string' },
            department:      { type: 'string' },
            employment_type: { type: 'string' },
            joining_date:    { type: 'string' },
            status:          { type: 'string' },
            manager_name:    { type: 'string' },
            work_location:   { type: 'string' },
          },
          required: ['search_name'],
        },
      },
      {
        name: 'deactivate_employee',
        description: 'Deactivate an employee by searching their name',
        parameters: {
          type: 'object',
          properties: {
            search_name: { type: 'string', description: 'Name to search for' },
          },
          required: ['search_name'],
        },
      },
      {
        name: 'list_employees',
        description: 'List employees filtered by status',
        parameters: {
          type: 'object',
          properties: {
            status: { type: 'string', description: 'active, inactive, or all' },
          },
        },
      },
      {
        name: 'generate_employee_summary',
        description: 'Generate a professional HR summary for an employee and save it',
        parameters: {
          type: 'object',
          properties: {
            search_name: { type: 'string', description: 'Name of employee' },
          },
          required: ['search_name'],
        },
      },
    ],
  },
] as any

async function executeTool(name: string, args: Record<string, any>): Promise<string> {
  try {
    switch (name) {

      case 'create_employee': {
        const emp = await createEmployee({
          full_name:       args.full_name,
          email:           args.email,
          phone:           args.phone ?? null,
          job_title:       args.job_title,
          department:      args.department,
          employment_type: args.employment_type ?? 'full-time',
          joining_date:    args.joining_date ?? null,
          status:          args.status ?? 'active',
          manager_name:    args.manager_name ?? null,
          work_location:   args.work_location ?? null,
          summary:         null,
        })
        return `SUCCESS: Created employee ${emp.full_name} (${emp.job_title} in ${emp.department}).`
      }

      case 'search_and_update_employee': {
        const { search_name, ...updates } = args
        const results = await searchEmployees(search_name)
        if (results.length === 0) return `ERROR: No employee found with name "${search_name}".`
        const fields = [
          'full_name', 'email', 'phone', 'job_title', 'department',
          'employment_type', 'joining_date', 'status', 'manager_name', 'work_location',
        ]
        const clean: Record<string, any> = {}
        fields.forEach(f => { if (updates[f] !== undefined) clean[f] = updates[f] })
        const updated = await updateEmployee({ id: results[0].id, ...clean })
        return `SUCCESS: Updated ${updated.full_name}. Changed: ${Object.keys(clean).join(', ')}`
      }

      case 'deactivate_employee': {
        const results = await searchEmployees(args.search_name)
        if (results.length === 0) return `ERROR: No employee found with name "${args.search_name}".`
        if (results[0].status === 'inactive') return `NOTE: ${results[0].full_name} is already inactive.`
        await deactivateEmployee(results[0].id)
        return `SUCCESS: ${results[0].full_name} has been deactivated.`
      }

      case 'list_employees': {
        const employees = await getEmployees()
        const filtered = (args.status && args.status !== 'all')
          ? employees.filter((e: any) => e.status === args.status)
          : employees
        if (filtered.length === 0) return `No employees found.`
        const list = filtered
          .map((e: any) => `- ${e.full_name} | ${e.job_title} | ${e.department} | ${e.status}`)
          .join('\n')
        return `Found ${filtered.length} employee(s):\n${list}`
      }

      case 'generate_employee_summary': {
        const results = await searchEmployees(args.search_name)
        if (results.length === 0) return `ERROR: No employee found with name "${args.search_name}".`
        const emp = results[0]
        const summaryModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
        const result = await summaryModel.generateContent(
          `Write a professional 2-3 sentence HR bio for: ${emp.full_name}, ${emp.job_title} in ${emp.department}. Employment: ${emp.employment_type}. Location: ${emp.work_location ?? 'unknown'}. Manager: ${emp.manager_name ?? 'unknown'}. Joined: ${emp.joining_date ?? 'unknown'}. Status: ${emp.status}. Keep it concise and professional.`
        )
        const summary = result.response.text()
        await updateEmployee({ id: emp.id, summary })
        return `SUCCESS: Summary generated and saved for ${emp.full_name}:\n\n"${summary}"`
      }

      default:
        return `ERROR: Unknown tool "${name}"`
    }
  } catch (err: any) {
    return `ERROR: ${err.message}`
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { messages } = await req.json()

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    tools,
    systemInstruction: `You are an HR Admin AI assistant. Help manage employee records.
When asked to perform actions (create, update, deactivate, list, summarize), ALWAYS use the provided tools.
If required info is missing for creating an employee, ask for it clearly.
Confirm every action after completing it. Be professional and concise.`,
  })

  const history = messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }))

  const lastMessage = messages[messages.length - 1]
  const chat = model.startChat({ history })
  const result = await chat.sendMessage(lastMessage.content)
  const response = result.response
  const functionCalls = response.functionCalls()

  if (functionCalls && functionCalls.length > 0) {
    const functionResults = []
    for (const call of functionCalls) {
      const toolResult = await executeTool(call.name, call.args as Record<string, any>)
      functionResults.push({
        functionResponse: {
          name: call.name,
          response: { result: toolResult },
        },
      })
    }
    const finalResult = await chat.sendMessage(functionResults as any)
    return NextResponse.json({ reply: finalResult.response.text() })
  }

  return NextResponse.json({ reply: response.text() })
}