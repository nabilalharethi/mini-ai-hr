import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  createEmployee,
  updateEmployee,
  deactivateEmployee,
  getEmployees,
  searchEmployees,
} from '@/lib/actions/employees'

const GROQ_API_KEY = process.env.GROQ_API_KEY ?? ''
const MODEL = 'llama-3.3-70b-versatile'

// ── Call Groq API ─────────────────────────────────────────────
async function callGroq(messages: any[]) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.1,
      max_tokens: 1024,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq error: ${err}`)
  }

  const data = await res.json()
  return data
}

// ── Parse JSON from AI response ───────────────────────────────
function parseJSON(text: string): any {
  try {
    // Clean any thinking tags
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
    // 1. Check API key
    if (!GROQ_API_KEY) {
      return NextResponse.json({
        reply: '❌ GROQ_API_KEY is not configured. Please add it to your environment variables.',
      })
    }

    // 2. Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ reply: '❌ Not authenticated. Please log in again.' })
    }

    // 3. Parse messages
    const { messages } = await req.json()
    if (!messages?.length) {
      return NextResponse.json({ reply: 'No message received.' })
    }

    const userMessage = messages[messages.length - 1].content

    // 4. Classify intent
    const classifyMessages = [
      {
        role: 'system',
        content: `You are an HR assistant. Classify the user request into one of these actions and extract data as JSON.

Actions:
- list_employees: user wants to see/show employees
  JSON: {"action":"list_employees","status":"active"|"inactive"|"all"}

- create_employee: user wants to create/add an employee
  JSON: {"action":"create_employee","full_name":"...","email":"...","job_title":"...","department":"...","phone":"...","employment_type":"full-time|part-time|contract|intern","joining_date":"YYYY-MM-DD","status":"active","manager_name":"...","work_location":"..."}

- update_employee: user wants to update/change/edit an employee
  JSON: {"action":"update_employee","search_name":"...","full_name":"...","email":"...","phone":"...","job_title":"...","department":"...","employment_type":"...","joining_date":"...","status":"...","manager_name":"...","work_location":"..."}

- deactivate_employee: user wants to deactivate/remove/fire an employee
  JSON: {"action":"deactivate_employee","search_name":"..."}

- generate_summary: user wants a summary/bio/profile for an employee
  JSON: {"action":"generate_summary","search_name":"..."}

- unknown: none of the above
  JSON: {"action":"unknown"}

CRITICAL RULES:
- Respond with ONLY the JSON object
- No explanation, no markdown code blocks, no extra text
- Just the raw JSON starting with { and ending with }
- Only include fields that were mentioned by the user`,
      },
      { role: 'user', content: userMessage },
    ]

    const classifyResponse = await callGroq(classifyMessages)
    const classifyText = classifyResponse.choices?.[0]?.message?.content ?? ''
    const intent = parseJSON(classifyText)

    // 5. If no intent detected — normal conversation
    if (!intent || intent.action === 'unknown') {
      const chatMessages = [
        {
          role: 'system',
          content: `You are a helpful HR Admin AI assistant for Mini AI HR system. 
Help the HR admin with employee management questions.
Be professional, friendly and concise.
You can help with: creating employees, viewing employees, updating records, deactivating employees, and generating summaries.
If the user wants to perform an action, guide them on how to phrase it.`,
        },
        ...messages.map((m: any) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
      ]
      const chatResponse = await callGroq(chatMessages)
      const reply = chatResponse.choices?.[0]?.message?.content ?? 'I could not understand that request.'
      return NextResponse.json({ reply })
    }

    // 6. Execute the action
    let result = ''

    switch (intent.action) {

      case 'list_employees': {
        const employees = await getEmployees()
        const status = intent.status ?? 'all'
        const filtered = status === 'all'
          ? employees
          : employees.filter((e: any) => e.status === status)

        if (filtered.length === 0) {
          result = `No ${status !== 'all' ? status + ' ' : ''}employees found.`
        } else {
          const list = filtered
            .map((e: any) => `• **${e.full_name}** — ${e.job_title}, ${e.department} (${e.status})`)
            .join('\n')
          result = `Found ${filtered.length} employee(s):\n\n${list}`
        }
        break
      }

      case 'create_employee': {
        const required = ['full_name', 'email', 'job_title', 'department']
        const missing = required.filter(f => !intent[f])
        if (missing.length > 0) {
          result = `I need a bit more information to create this employee. Please provide:\n${missing.map(f => `• ${f.replace('_', ' ')}`).join('\n')}`
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
        result = `✅ Employee **${emp.full_name}** has been created successfully!\n\n• Job Title: ${emp.job_title}\n• Department: ${emp.department}\n• Status: ${emp.status}`
        break
      }

      case 'update_employee': {
        if (!intent.search_name) {
          result = `❌ Please specify which employee you want to update.`
          break
        }
        const results = await searchEmployees(intent.search_name)
        if (results.length === 0) {
          result = `❌ No employee found with name "${intent.search_name}". Please check the name and try again.`
          break
        }
        const fields = [
          'full_name', 'email', 'phone', 'job_title', 'department',
          'employment_type', 'joining_date', 'status', 'manager_name', 'work_location',
        ]
        const clean: Record<string, any> = {}
        fields.forEach(f => {
          if (intent[f] !== undefined && f !== 'search_name') clean[f] = intent[f]
        })
        if (Object.keys(clean).length === 0) {
          result = `❌ No fields to update were found. Please specify what you want to change.`
          break
        }
        const updated = await updateEmployee({ id: results[0].id, ...clean })
        result = `✅ **${updated.full_name}** has been updated successfully!\n\nChanged fields: ${Object.keys(clean).map(f => f.replace('_', ' ')).join(', ')}`
        break
      }

      case 'deactivate_employee': {
        if (!intent.search_name) {
          result = `❌ Please specify which employee you want to deactivate.`
          break
        }
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
        if (!intent.search_name) {
          result = `❌ Please specify which employee you want a summary for.`
          break
        }
        const results = await searchEmployees(intent.search_name)
        if (results.length === 0) {
          result = `❌ No employee found with name "${intent.search_name}".`
          break
        }
        const emp = results[0]
        const summaryMessages = [
          {
            role: 'system',
            content: 'You are an HR writer. Write professional, concise employee bios. Return only the bio text with no extra formatting or explanation.',
          },
          {
            role: 'user',
            content: `Write a professional 2-3 sentence HR bio for this employee:
Name: ${emp.full_name}
Job Title: ${emp.job_title}
Department: ${emp.department}
Employment Type: ${emp.employment_type}
Location: ${emp.work_location ?? 'not specified'}
Manager: ${emp.manager_name ?? 'not specified'}
Joined: ${emp.joining_date ?? 'not specified'}
Status: ${emp.status}`,
          },
        ]
        const summaryResponse = await callGroq(summaryMessages)
        const summary = summaryResponse.choices?.[0]?.message?.content?.trim() ?? ''
        if (!summary) {
          result = `❌ Could not generate summary. Please try again.`
          break
        }
        await updateEmployee({ id: emp.id, summary })
        result = `✅ Summary generated and saved for **${emp.full_name}**:\n\n${summary}\n\nYou can view it on their profile page.`
        break
      }

      default:
        result = 'I could not understand that request. Please try again with a clearer instruction.'
    }

    return NextResponse.json({ reply: result })

  } catch (err: any) {
    console.error('AI route error:', err)
    return NextResponse.json({
      reply: `❌ Error: ${err.message ?? 'Unknown error occurred'}`,
    })
  }
}