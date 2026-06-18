import { NextRequest, NextResponse } from 'next/server'

// Vapi sends webhook events for call lifecycle events.
// On call-end we fire an n8n webhook to send the caller an SMS with the booking link.

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-vapi-secret')
  if (process.env.VAPI_WEBHOOK_SECRET && secret !== process.env.VAPI_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { message } = body

  // Only act on call-end events where the caller expressed interest in booking
  if (message?.type !== 'end-of-call-report') {
    return NextResponse.json({ ok: true })
  }

  const callerPhone: string | undefined = message?.call?.customer?.number
  const transcript: string = message?.transcript ?? ''
  const studioSlug = process.env.NEXT_PUBLIC_DEFAULT_STUDIO_SLUG ?? 'rhythm'
  const appUrl     = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const bookingUrl = `${appUrl}/book/${studioSlug}`

  // Heuristic: send booking link if caller mentioned booking/lesson/class
  const wantsToBook = /book|lesson|class|schedule|appoint/i.test(transcript)

  if (wantsToBook && callerPhone && process.env.N8N_VAPI_WEBHOOK_URL) {
    await fetch(process.env.N8N_VAPI_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': process.env.N8N_WEBHOOK_SECRET ?? '',
      },
      body: JSON.stringify({
        action: 'send_booking_sms',
        phone: callerPhone,
        bookingUrl,
        message: `Thanks for calling! Here's your booking link: ${bookingUrl}`,
      }),
    }).catch(console.error)
  }

  return NextResponse.json({ ok: true })
}
