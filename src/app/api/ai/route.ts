import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  createEmployee,
  updateEmployee,
  deactivateEmployee,
  getEmployees,
  searchEmployees,
} from '@/lib/actions/employees'

// ── OpenRouter config ─────────────────────────────────────────
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? ''
const MODEL = 'meta-llama/llama-3.3-70b-instruct:free' // free model on OpenRouter

// ── Tool definitions (OpenAI-compatible format) ───────────────
const tools = [
  {
    type: 'function',
    function: {
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
          joining_date:    { type: 'string', description: 'Date in YYYY-MM-DD format' },
          status:          { type: 'string', description: 'active or inactive' },
          manager_name:    { type: 'string', description: 'Manager full name' },
          work_location:   { type: 'string', description: 'City or office' },
        },
        required: ['full_name', 'email', 'job_title', 'department'],
      },
    },
  },
  {
    type: 'function',
    function: {
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
  },
  {
    type: 'function',
    function: {
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
  },
  {
    type: 'function',
    function: {
      name: 'list_employees',
      description: 'List employees. Filter by active, inactive, or all.',
      parameters: {
        type: 'object',
        properties: {
          status: { type: 'string', description: 'active, inactive, or all' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'generate_employee_summary',
      description: 'Generate a professional HR summary for an employee and save it to their profile',
      parameters: {
        type: 'object',
        properties: {
          search_name: { type: 'string', description: 'Name of employee' },
        },
        required: ['search_name'],
      },
    },
  },
]

// ── Execute tool ──────────────────────────────────────────────
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
          'full_name','email','phone','job_title','department',
          'employment_type','joining_date','status','manager_name','work_location',
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

        // Call OpenRouter directly for summary
        const summaryRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [{
              role: 'user',
              content: `Write a professional 2-3 sentence HR bio for: ${emp.full_name}, ${emp.job_title} in ${emp.department}. Employment: ${emp.employment_type}. Location: ${emp.work_location ?? 'unknown'}. Manager: ${emp.manager_name ?? 'unknown'}. Joined: ${emp.joining_date ?? 'unknown'}. Status: ${emp.status}. Keep it concise and professional.`,
            }],
          }),
        })
        const summaryData = await summaryRes.json()
        const summary = summaryData.choices?.[0]?.message?.content ?? 'Summary could not be generated.'
        await updateEmployee({ id: emp.id, summary })
        return `SUCCESS: Summary generated and saved for ${emp.full_name}:\n\n"${summary}"`
      }

      default:
        return `ERROR: Unknown tool "${name}"`
    }
  } catch (err: any) {
    return `ERROR in ${name}: ${err.message}`
  }
}

// ── Call OpenRouter ───────────────────────────────────────────
async function callOpenRouter(messages: any[], withTools = true) {
  const body: any = {
    model: MODEL,
    messages,
  }
  if (withTools) body.tools = tools

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://mini-ai-hr.vercel.app',
      'X-Title': 'Mini AI HR',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter error: ${err}`)
  }

  return res.json()
}

// ── Main POST handler ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // 1. Check API key
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { reply: '❌ OPENROUTER_API_KEY is not configured.' },
        { status: 200 }
      )
    }

    // 2. Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { reply: '❌ Not authenticated. Please log in again.' },
        { status: 200 }
      )
    }

    // 3. Parse messages
    const { messages } = await req.json()
    if (!messages?.length) {
      return NextResponse.json({ reply: 'No message received.' }, { status: 200 })
    }

    // 4. Build message history with system prompt
    const openRouterMessages = [
      {
        role: 'system',
        content: `You are an HR Admin AI assistant. Help manage employee records.
When asked to perform actions (create, update, deactivate, list employees, or generate summaries), ALWAYS use the provided tools — never just describe what you would do.
If required info is missing for creating an employee, ask for it.
Confirm every action after completing it. Be professional and concise.`,
      },
      ...messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
    ]

    // 5. First call — let model decide if it needs a tool
    const firstResponse = await callOpenRouter(openRouterMessages)
    const message = firstResponse.choices?.[0]?.message

    if (!message) {
      return NextResponse.json({ reply: '❌ No response from AI.' }, { status: 200 })
    }

    // 6. Handle tool calls
    if (message.tool_calls && message.tool_calls.length > 0) {
      const toolResults = []

      for (const toolCall of message.tool_calls) {
        let args: Record<string, any> = {}
        try {
          args = JSON.parse(toolCall.function.arguments)
        } catch {
          args = {}
        }
        const result = await executeTool(toolCall.function.name, args)
        toolResults.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: result,
        })
      }

      // 7. Second call — send tool results back to get final response
      const finalMessages = [
        ...openRouterMessages,
        message,
        ...toolResults,
      ]

      const finalResponse = await callOpenRouter(finalMessages, false)
      const finalText = finalResponse.choices?.[0]?.message?.content ?? '✅ Action completed.'

      return NextResponse.json({ reply: finalText })
    }

    // 8. No tool call — return text response
    return NextResponse.json({ reply: message.content ?? '✅ Done.' })

  } catch (err: any) {
    console.error('AI route error:', err)
    return NextResponse.json(
      { reply: `❌ Error: ${err.message ?? 'Unknown error'}` },
      { status: 200 }
    )
  }
}