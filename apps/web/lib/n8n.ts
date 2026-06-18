export async function triggerBookingWorkflow(
  webhookUrl: string,
  payload: {
    action: 'new_booking' | 'approved' | 'rejected'
    bookingId: string
    studentName: string
    studentEmail: string
    studentPhone?: string
    notifyVia: string[]
    teacherName: string
    teacherEmail: string
    studioName: string
    bookingDate: string
    startTime: string
    endTime: string
    lessonType: string
    managerNotes?: string
    approveUrl: string
    rejectUrl: string
    paymentLink?: string | null
  }
): Promise<void> {
  const secret = process.env.N8N_WEBHOOK_SECRET
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(secret ? { 'x-webhook-secret': secret } : {}),
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error(`n8n webhook failed: ${response.status} ${response.statusText}`)
  }
}
