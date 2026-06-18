'use client'

import { useState } from 'react'
import type { BookingWithRelations, BookingStatus } from '@/lib/types'

interface Props {
  booking: BookingWithRelations
}

const statusStyles: Record<BookingStatus, string> = {
  pending:  'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

export default function BookingCard({ booking: initial }: Props) {
  const [booking, setBooking] = useState(initial)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleApprove() {
    setLoading(true)
    const res = await fetch(`/api/bookings/${booking.id}/approve`, { method: 'PATCH' })
    if (res.ok) setBooking(await res.json())
    setLoading(false)
  }

  async function handleReject() {
    setLoading(true)
    const res = await fetch(`/api/bookings/${booking.id}/reject`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    })
    if (res.ok) {
      setBooking(await res.json())
      setRejectOpen(false)
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900">{booking.student_name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[booking.status]}`}>
              {booking.status}
            </span>
          </div>
          <div className="text-sm text-gray-500 space-y-0.5">
            <div>{booking.student_email} {booking.student_phone && `· ${booking.student_phone}`}</div>
            <div>Notify via: {booking.notify_via.join(', ')}</div>
          </div>
        </div>
        <div className="text-right text-sm text-gray-500 shrink-0">
          <div className="font-medium text-gray-700">{booking.booking_date}</div>
          <div>{booking.start_time.slice(0,5)} – {booking.end_time.slice(0,5)}</div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-sm text-gray-600">
        <div><span className="font-medium">Teacher:</span> {booking.teacher.name}</div>
        <div><span className="font-medium">Room:</span> {booking.room.name}</div>
        <div><span className="font-medium">Type:</span> {booking.lesson_type}</div>
      </div>

      {booking.manager_notes && (
        <div className="mt-3 text-sm text-gray-500 italic">
          Notes: {booking.manager_notes}
        </div>
      )}

      {booking.status === 'pending' && (
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleApprove}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
          >
            Approve
          </button>
          <button
            onClick={() => setRejectOpen(!rejectOpen)}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
          >
            Reject
          </button>
        </div>
      )}

      {rejectOpen && (
        <div className="mt-3">
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Optional notes for the student..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
            rows={2}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleReject}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
            >
              Confirm Rejection
            </button>
            <button
              onClick={() => setRejectOpen(false)}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
