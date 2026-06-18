import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { triggerBookingWorkflow } from '@/lib/n8n'

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const {
    teacherId,
    roomId,
    bookingDate,
    startTime,
    endTime,
    lessonType,
    studentName,
    studentEmail,
    studentPhone,
    notifyVia,
    studioSlug,
  } = body as {
    teacherId?: string
    roomId?: string
    bookingDate?: string
    startTime?: string
    endTime?: string
    lessonType?: string
    studentName?: string
    studentEmail?: string
    studentPhone?: string
    notifyVia?: string[]
    studioSlug?: string
  }

  // Validate required fields
  const missing: string[] = []
  if (!teacherId) missing.push('teacherId')
  if (!roomId) missing.push('roomId')
  if (!bookingDate) missing.push('bookingDate')
  if (!startTime) missing.push('startTime')
  if (!endTime) missing.push('endTime')
  if (!lessonType) missing.push('lessonType')
  if (!studentName) missing.push('studentName')
  if (!studentEmail) missing.push('studentEmail')

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(', ')}` },
      { status: 400 }
    )
  }

  const supabase = createServerClient()

  // Resolve studio_id: prefer studioSlug from body, fall back to env default
  const slug = studioSlug || process.env.NEXT_PUBLIC_DEFAULT_STUDIO_SLUG || 'rhythm'
  const { data: studio, error: studioError } = await supabase
    .from('studios')
    .select('id, name, manager_email, n8n_webhook_url')
    .eq('slug', slug)
    .single()

  if (studioError || !studio) {
    return NextResponse.json({ error: 'Studio not found' }, { status: 404 })
  }

  // Insert booking
  const { data: booking, error: insertError } = await supabase
    .from('bookings')
    .insert({
      studio_id: studio.id,
      teacher_id: teacherId,
      room_id: roomId,
      booking_date: bookingDate,
      start_time: startTime,
      end_time: endTime,
      lesson_type: lessonType,
      student_name: studentName,
      student_email: studentEmail,
      student_phone: studentPhone || null,
      notify_via: notifyVia && notifyVia.length > 0 ? notifyVia : ['email'],
      status: 'pending',
    })
    .select()
    .single()

  if (insertError || !booking) {
    return NextResponse.json(
      { error: insertError?.message ?? 'Failed to create booking' },
      { status: 500 }
    )
  }

  // Fetch teacher details for the notification
  const { data: teacher } = await supabase
    .from('teachers')
    .select('name, email')
    .eq('id', teacherId!)
    .single()

  // Trigger n8n workflow if webhook URL is configured
  if (studio.n8n_webhook_url && teacher) {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (request.headers.get('origin') ?? 'http://localhost:3000')

    try {
      await triggerBookingWorkflow(studio.n8n_webhook_url, {
        action: 'new_booking',
        bookingId: booking.id,
        studentName: studentName!,
        studentEmail: studentEmail!,
        studentPhone: studentPhone,
        notifyVia: notifyVia && notifyVia.length > 0 ? notifyVia : ['email'],
        teacherName: teacher.name,
        teacherEmail: teacher.email,
        studioName: studio.name,
        bookingDate: bookingDate!,
        startTime: startTime!,
        endTime: endTime!,
        lessonType: lessonType!,
        approveUrl: `${baseUrl}/api/bookings/${booking.id}/approve`,
        rejectUrl: `${baseUrl}/api/bookings/${booking.id}/reject`,
      })
    } catch (webhookError) {
      // Log but don't fail the request — booking is already saved
      console.error('n8n webhook error:', webhookError)
    }
  }

  return NextResponse.json({ booking }, { status: 201 })
}
