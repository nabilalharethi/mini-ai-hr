import { NextRequest, NextResponse } from 'next/server'
import {
  GoogleGenerativeAI,
  FunctionDeclarationSchemaType,
  type FunctionDeclaration,
  type Tool,
} from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'
import { createEmployee, updateEmployee, deactivateEmployee, getEmployees, searchEmployees } from '@/lib/actions/employees'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const tools: Tool[] = [{
  functionDeclarations: [
    {
      name: 'create_employee',
      description: 'Create a new employee record in the HR system',
      parameters: {
        type: FunctionDeclarationSchemaType.OBJECT,
        properties: {
          full_name:       { type: FunctionDeclarationSchemaType.STRING, description: 'Full name' },
          email:           { type: FunctionDeclarationSchemaType.STRING, description: 'Work email' },
          phone:           { type: FunctionDeclarationSchemaType.STRING, description: 'Phone number' },
          job_title:       { type: FunctionDeclarationSchemaType.STRING, description: 'Job title' },
          department:      { type: FunctionDeclarationSchemaType.STRING, description: 'Department name' },
          employment_type: { type: FunctionDeclarationSchemaType.STRING, description: 'full-time, part-time, contract, or intern' },
          joining_date:    { type: FunctionDeclarationSchemaType.STRING, description: 'Start date YYYY-MM-DD' },
          status:          { type: FunctionDeclarationSchemaType.STRING, description: 'active or inactive' },
          manager_name:    { type: FunctionDeclarationSchemaType.STRING, description: 'Manager full name' },
          work_location:   { type: FunctionDeclarationSchemaType.STRING, description: 'City or office' },
        },
        required: ['full_name', 'email', 'job_title', 'department'],
      },
    } as FunctionDeclaration,
    {
      name: 'search_and_update_employee',
      description: 'Search for an employee by name and update their details',
      parameters: {
        type: FunctionDeclarationSchemaType.OBJECT,
        properties: {
          search_name:     { type: FunctionDeclarationSchemaType.STRING, description: 'Name to search for' },
          full_name:       { type: FunctionDeclarationSchemaType.STRING },
          email:           { type: FunctionDeclarationSchemaType.STRING },
          phone:           { type: FunctionDeclarationSchemaType.STRING },
          job_title:       { type: FunctionDeclarationSchemaType.STRING },
          department:      { type: FunctionDeclarationSchemaType.STRING },
          employment_type: { type: FunctionDeclarationSchemaType.STRING },
          joining_date:    { type: FunctionDeclarationSchemaType.STRING },
          status:          { type: FunctionDeclarationSchemaType.STRING },
          manager_name:    { type: FunctionDeclarationSchemaType.STRING },
          work_location:   { type: FunctionDeclarationSchemaType.STRING },
        },
        required: ['search_name'],
      },
    } as FunctionDeclaration,
    {
      name: 'deactivate_employee',
      description: 'Deactivate an employee by searching their name',
      parameters: {
        type: FunctionDeclarationSchemaType.OBJECT,
        properties: {
          search_name: { type: FunctionDeclarationSchemaType.STRING, description: 'Name to search for' },
        },
        required: ['search_name'],
      },
    } as FunctionDeclaration,
    {
      name: 'list_employees',
      description: 'List employees filtered by status',
      parameters: {
        type: FunctionDeclarationSchemaType.OBJECT,
        properties: {
          status: { type: FunctionDeclarationSchemaType.STRING, description: 'active, inactive, or all' },
        },
      },
    } as FunctionDeclaration,
    {
      name: 'generate_employee_summary',
      description: 'Generate a professional HR summary for an employee and save it',
      parameters: {
        type: FunctionDeclarationSchemaType.OBJECT,
        properties: {
          search_name: { type: FunctionDeclarationSchemaType.STRING, description: 'Name of employee' },
        },
        required: ['search_name'],
      },
    } as FunctionDeclaration,
  ],
}]

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
        const fields = ['full_name','email','phone','job_title','department','employment_type','joining_date','status','manager_name','work_location']
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
          ? employees.filter(e => e.status === args.status)
          : employees
        if (filtered.length === 0) return `No employees found.`
        const list = filtered.map(e => `- ${e.full_name} | ${e.job_title} | ${e.department} | ${e.status}`).join('\n')
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
        functionResponse: { name: call.name, response: { result: toolResult } },
      })
    }
    const finalResult = await chat.sendMessage(functionResults)
    return NextResponse.json({ reply: finalResult.response.text() })
  }

  return NextResponse.json({ reply: response.text() })
}