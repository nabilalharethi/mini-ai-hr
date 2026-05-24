import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  createEmployee,
  updateEmployee,
  deactivateEmployee,
  getEmployees,
  searchEmployees,
} from '@/lib/actions/employees'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? ''

const MODELS = [
  'qwen/qwen3-next-80b-a3b-instruct:free',
]

// ── Call OpenRouter with automatic fallback ───────────────────
async function callOpenRouter(messages: any[]) {
  let lastError = ''

  for (const model of MODELS) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://mini-ai-hr.vercel.app',
          'X-Title': 'Mini AI HR',
        },
        body: JSON.stringify({ model, messages }),
      })

      if (!res.ok) {
        const err = await res.text()
        if (res.status === 429 || res.status === 402) {
          lastError = `${model} unavailable`
          continue
        }
        throw new Error(`OpenRouter error: ${err}`)
      }

      const data = await res.json()
      if (data.choices?.[0]?.message?.content) {
        return data
      }
      lastError = `${model} returned empty response`
      continue

    } catch (err: any) {
      lastError = err.message
      continue
    }
  }

  throw new Error(`All models failed. Last error: ${lastError}`)
}

// ── Parse JSON from AI response ───────────────────────────────
function parseJSON(text: string): any {
  try {
    // Remove thinking tags if present
    const cleaned = text
      .replace(/<think>[\s\S]*?<\/think>/g, '')
      .replace(/<thinking>[\s\S]*?<\/thinking>/g, '')
      .trim()

    const match = cleaned.match(/```json\n?([\s\S]*?)\n?```/) ||
                  cleaned.match(/\{[\s\S]*\}/)
    const jsonStr = match ? (match[1] || match[0]) : cleaned
    return JSON.parse(jsonStr)
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ reply: '❌ OPENROUTER_API_KEY is not configured.' })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ reply: '❌ Not authenticated.' })

    const { messages } = await req.json()
    if (!messages?.length) return NextResponse.json({ reply: 'No message received.' })

    const userMessage = messages[messages.length - 1].content

    // ── Step 1: Classify intent ───────────────────────────────
    const classifyMessages = [
      {
        role: 'system',
        content: `You are an HR assistant. Classify the user request into one of these actions and extract data as JSON.

Actions:
- list_employees: user wants to see employees. JSON: {"action":"list_employees","status":"active"|"inactive"|"all"}
- create_employee: user wants to create an employee. JSON: {"action":"create_employee","full_name":"...","email":"...","job_title":"...","department":"...","phone":"...","employment_type":"...","joining_date":"...","status":"active","manager_name":"...","work_location":"..."}
- update_employee: user wants to update an employee. JSON: {"action":"update_employee","search_name":"...","job_title":"...","department":"...","status":"...","phone":"...","employment_type":"...","joining_date":"...","manager_name":"...","work_location":"...","email":"...","full_name":"..."}
- deactivate_employee: user wants to deactivate. JSON: {"action":"deactivate_employee","search_name":"..."}
- generate_summary: user wants an AI summary. JSON: {"action":"generate_summary","search_name":"..."}
- unknown: none of the above. JSON: {"action":"unknown"}

IMPORTANT: Respond with ONLY the JSON object. No explanation, no markdown, no thinking, just raw JSON.`,
      },
      { role: 'user', content: userMessage },
    ]

    const classifyResponse = await callOpenRouter(classifyMessages)
    const classifyText = classifyResponse.choices?.[0]?.message?.content ?? ''
    const intent = parseJSON(classifyText)

    if (!intent || intent.action === 'unknown') {
      // ── Normal conversation ───────────────────────────────
      const chatMessages = [
        {
          role: 'system',
          content: 'You are a helpful HR Admin AI assistant. Help the HR admin with employee management questions. Be professional and concise. Do not show thinking or reasoning traces.',
        },
        ...messages.map((m: any) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
      ]
      const chatResponse = await callOpenRouter(chatMessages)
      const rawReply = chatResponse.choices?.[0]?.message?.content ?? 'I could not understand that request.'
      // Clean thinking tags from response
      const cleanReply = rawReply
        .replace(/<think>[\s\S]*?<\/think>/g, '')
        .replace(/<thinking>[\s\S]*?<\/thinking>/g, '')
        .trim()
      return NextResponse.json({ reply: cleanReply })
    }

    // ── Step 2: Execute the action ────────────────────────────
    let result = ''

    switch (intent.action) {

      case 'list_employees': {
        const employees = await getEmployees()
        const status = intent.status ?? 'all'
        const filtered = status === 'all'
          ? employees
          : employees.filter((e: any) => e.status === status)
        if (filtered.length === 0) {
          result = `No ${status !== 'all' ? status : ''} employees found.`
        } else {
          const list = filtered.map((e: any) =>
            `• **${e.full_name}** — ${e.job_title}, ${e.department} (${e.status})`
          ).join('\n')
          result = `Found ${filtered.length} employee(s):\n\n${list}`
        }
        break
      }

      case 'create_employee': {
        const required = ['full_name', 'email', 'job_title', 'department']
        const missing = required.filter(f => !intent[f])
        if (missing.length > 0) {
          result = `I need a bit more information. Please provide: ${missing.join(', ')}.`
          break
        }
        const emp = await createEmployee({
          full_name:       intent.full_name,
          email:           intent.email,
          phone:           intent.phone ?? null,
          job_title:       intent.job_title,
          department:      intent.department,
          employment_type: intent.employment_type ?? 'full-time',
          joining_date:    intent.joining_date ?? null,
          status:          intent.status ?? 'active',
          manager_name:    intent.manager_name ?? null,
          work_location:   intent.work_location ?? null,
          summary:         null,
        })
        result = `✅ Employee **${emp.full_name}** has been created successfully as ${emp.job_title} in the ${emp.department} department.`
        break
      }

      case 'update_employee': {
        const results = await searchEmployees(intent.search_name)
        if (results.length === 0) {
          result = `❌ No employee found with name "${intent.search_name}".`
          break
        }
        const fields = [
          'full_name', 'email', 'phone', 'job_title', 'department',
          'employment_type', 'joining_date', 'status', 'manager_name', 'work_location',
        ]
        const clean: Record<string, any> = {}
        fields.forEach(f => { if (intent[f] !== undefined) clean[f] = intent[f] })
        if (Object.keys(clean).length === 0) {
          result = `❌ No fields to update were found in your request.`
          break
        }
        const updated = await updateEmployee({ id: results[0].id, ...clean })
        result = `✅ **${updated.full_name}** has been updated. Changed: ${Object.keys(clean).join(', ')}.`
        break
      }

      case 'deactivate_employee': {
        const results = await searchEmployees(intent.search_name)
        if (results.length === 0) {
          result = `❌ No employee found with name "${intent.search_name}".`
          break
        }
        if (results[0].status === 'inactive') {
          result = `ℹ️ **${results[0].full_name}** is already inactive.`
          break
        }
        await deactivateEmployee(results[0].id)
        result = `✅ **${results[0].full_name}** has been deactivated successfully.`
        break
      }

      case 'generate_summary': {
        const results = await searchEmployees(intent.search_name)
        if (results.length === 0) {
          result = `❌ No employee found with name "${intent.search_name}".`
          break
        }
        const emp = results[0]
        const summaryMessages = [
          {
            role: 'system',
            content: 'You are an HR writer. Write professional employee bios. Return only the bio text with no thinking, no explanation, no extra formatting.',
          },
          {
            role: 'user',
            content: `Write a professional 2-3 sentence HR bio for: ${emp.full_name}, ${emp.job_title} in ${emp.department}. Employment: ${emp.employment_type}. Location: ${emp.work_location ?? 'unknown'}. Manager: ${emp.manager_name ?? 'unknown'}. Joined: ${emp.joining_date ?? 'unknown'}. Status: ${emp.status}.`,
          },
        ]
        const summaryResponse = await callOpenRouter(summaryMessages)
        const rawSummary = summaryResponse.choices?.[0]?.message?.content ?? ''
        const summary = rawSummary
          .replace(/<think>[\s\S]*?<\/think>/g, '')
          .replace(/<thinking>[\s\S]*?<\/thinking>/g, '')
          .trim()
        await updateEmployee({ id: emp.id, summary })
        result = `✅ Summary generated and saved for **${emp.full_name}**:\n\n${summary}`
        break
      }

      default:
        result = 'I could not understand that request. Please try again.'
    }

    return NextResponse.json({ reply: result })

  } catch (err: any) {
    console.error('AI route error:', err)
    return NextResponse.json({
      reply: `❌ Error: ${err.message ?? 'Unknown error'}`,
    })
  }
}