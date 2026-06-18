import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { messages, studioSlug } = await req.json()

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'messages required' }, { status: 400 })
  }

  // Load studio + teachers for context
  const supabase = createServerClient()
  const slug = studioSlug ?? process.env.NEXT_PUBLIC_DEFAULT_STUDIO_SLUG ?? 'rhythm'

  const { data: studio } = await supabase
    .from('studios')
    .select('name, contact_email')
    .eq('slug', slug)
    .single()

  const { data: teachers } = await supabase
    .from('teachers')
    .select('name, bio')
    .eq('studio_id',
      (await supabase.from('studios').select('id').eq('slug', slug).single()).data?.id ?? ''
    )
    .eq('active', true)

  const teacherList = (teachers ?? [])
    .map(t => `• ${t.name}${t.bio ? ` — ${t.bio}` : ''}`)
    .join('\n')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const bookingUrl = `${appUrl}/book/${slug}`

  const systemPrompt = `You are a friendly booking assistant for ${studio?.name ?? 'this dance studio'}.
Your job is to help students and parents with questions and guide them toward booking a lesson.

Studio info:
- Name: ${studio?.name ?? 'Dance Studio'}
- Booking link: ${bookingUrl}
- Hours: Monday–Friday, 10 AM – 9 PM
- Contact: ${studio?.contact_email ?? 'info@studio.com'}

Our teachers:
${teacherList || '• Contact the studio for teacher info'}

Guidelines:
- Be warm, enthusiastic, and concise (2–3 sentences max per reply)
- Answer questions about teachers, scheduling, and the booking process
- When someone is ready to book, share the booking link: ${bookingUrl}
- You cannot complete bookings directly — always point to the booking form
- Do not discuss pricing (direct them to contact the studio)
- Never make up information not provided above`

  const stream = await anthropic.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    system: systemPrompt,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })

  return new NextResponse(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  })
}
