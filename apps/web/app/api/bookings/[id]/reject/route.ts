import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { triggerBookingWorkflow } from '@/lib/n8n'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  let notes: string | undefined
  try {
    const body = await request.json()
    notes = typeof body.notes === 'string' ? body.notes : undefined
  } catch {
    // Notes are optional; ignore parse errors
  }

  const supabase = createServerClient()

  // Update booking status to rejected
  const { data: booking, error: updateError } = await supabase
    .from('bookings')
    .update({
      status: 'rejected',
      ...(notes !== undefined ? { manager_notes: notes } : {}),
    })
    .eq('id', id)
    .select()
    .single()

  if (updateError || !booking) {
    return NextResponse.json(
      { error: updateError?.message ?? 'Booking not found' },
      { status: updateError ? 500 : 404 }
    )
  }

  // Fetch related teacher and studio for notification
  const { data: teacher } = await supabase
    .from('teachers')
    .select('name, email')
    .eq('id', booking.teacher_id)
    .single()

  const { data: studio } = await supabase
    .from('studios')
    .select('name, n8n_webhook_url')
    .eq('id', booking.studio_id)
    .single()

  // Trigger n8n rejected workflow
  if (studio?.n8n_webhook_url && teacher) {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (request.headers.get('origin') ?? 'http://localhost:3000')

    try {
      await triggerBookingWorkflow(studio.n8n_webhook_url, {
        action: 'rejected',
        bookingId: booking.id,
        studentName: booking.student_name,
        studentEmail: booking.student_email,
        studentPhone: booking.student_phone ?? undefined,
        notifyVia: booking.notify_via ?? ['email'],
        teacherName: teacher.name,
        teacherEmail: teacher.email,
        studioName: studio.name,
        bookingDate: booking.booking_date,
        startTime: booking.start_time,
        endTime: booking.end_time,
        lessonType: booking.lesson_type,
        managerNotes: notes,
        approveUrl: `${baseUrl}/api/bookings/${id}/approve`,
        rejectUrl: `${baseUrl}/api/bookings/${id}/reject`,
      })
    } catch (webhookError) {
      console.error('n8n webhook error (reject):', webhookError)
    }
  }

  return NextResponse.json({ booking })
}
