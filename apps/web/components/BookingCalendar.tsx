'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase'

// Dynamically import FullCalendar to avoid SSR issues
const FullCalendarDynamic = dynamic(
  async () => {
    const { default: FullCalendar } = await import('@fullcalendar/react')
    return FullCalendar
  },
  { ssr: false }
)

// Plugins must be imported normally (not lazy) but used inside the dynamic component
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

interface Props {
  studioId: string
  teacherId?: string
}

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  backgroundColor: string
  borderColor: string
}

const TEACHER_COLORS = [
  { bg: '#7C3AED', border: '#6d28d9' },  // purple
  { bg: '#D97706', border: '#b45309' },  // amber
  { bg: '#0891b2', border: '#0e7490' },  // cyan
  { bg: '#16a34a', border: '#15803d' },  // green
  { bg: '#dc2626', border: '#b91c1c' },  // red
  { bg: '#7c3aed', border: '#5b21b6' },  // violet
]

export default function BookingCalendar({ studioId, teacherId }: Props) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true)
      setError(null)
      const supabase = createBrowserClient()

      let query = supabase
        .from('bookings')
        .select('id, booking_date, start_time, end_time, student_name, teacher_id, teachers(name)')
        .eq('studio_id', studioId)
        .eq('status', 'approved')

      if (teacherId) {
        query = query.eq('teacher_id', teacherId)
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        setError(fetchError.message)
        setLoading(false)
        return
      }

      // Build a stable color map by teacher ID
      const teacherColorMap: Record<string, { bg: string; border: string }> = {}
      let colorIndex = 0

      const calEvents: CalendarEvent[] = (data ?? []).map((booking) => {
        const tid = booking.teacher_id
        if (!teacherColorMap[tid]) {
          teacherColorMap[tid] = TEACHER_COLORS[colorIndex % TEACHER_COLORS.length]
          colorIndex++
        }
        const color = teacherColorMap[tid]
        const teacherName =
          (booking.teachers as { name: string } | null)?.name ?? 'Unknown Teacher'

        return {
          id: booking.id,
          title: `${booking.student_name} — ${teacherName}`,
          start: `${booking.booking_date}T${booking.start_time}`,
          end: `${booking.booking_date}T${booking.end_time}`,
          backgroundColor: color.bg,
          borderColor: color.border,
        }
      })

      setEvents(calEvents)
      setLoading(false)
    }

    fetchBookings()
  }, [studioId, teacherId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading calendar...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
      <FullCalendarDynamic
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        slotMinTime="10:00:00"
        slotMaxTime="21:00:00"
        events={events}
        height="auto"
        eventTextColor="#fff"
        allDaySlot={false}
      />
    </div>
  )
}
