'use client'

import { useState } from 'react'

// Inline type for booking prop — avoids deep import path complexity
// Shape mirrors the Supabase join: bookings row + teachers: { name, email } + rooms: { name }
interface BookingProp {
  id: string
  student_name: string
  student_email: string
  student_phone?: string | null
  notify_via?: string[]
  booking_date: string
  start_time: string
  end_time: string
  lesson_type: string
  status: 'pending' | 'approved' | 'rejected'
  manager_notes?: string | null
  created_at: string
  teachers?: { name: string; email: string } | null
  rooms?: { name: string } | null
}

interface Props {
  booking: BookingProp
}

function StatusBadge({ status }: { status: BookingProp['status'] }) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
  }
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function formatTime(time: string): string {
  const [hourStr] = time.split(':')
  const hour = parseInt(hourStr, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  return `${displayHour}:00 ${ampm}`
}

export default function BookingCard({ booking: initialBooking }: Props) {
  const [booking, setBooking] = useState<BookingProp>(initialBooking)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectNotes, setRejectNotes] = useState('')

  async function handleApprove() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/bookings/${booking.id}/approve`, {
        method: 'PATCH',
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Failed to approve booking')
        return
      }
      setBooking((prev) => ({ ...prev, status: 'approved' }))
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleReject() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/bookings/${booking.id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: rejectNotes }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Failed to reject booking')
        return
      }
      setBooking((prev) => ({
        ...prev,
        status: 'rejected',
        manager_notes: rejectNotes || null,
      }))
      setShowRejectForm(false)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{booking.student_name}</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
              <span>{booking.student_email}</span>
              {booking.student_phone && <span>{booking.student_phone}</span>}
              {booking.notify_via && booking.notify_via.length > 0 && (
                <span className="text-gray-400">
                  Notify: {booking.notify_via.join(', ')}
                </span>
              )}
            </div>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 rounded-xl px-4 py-3 text-sm">
          <div>
            <div className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-0.5">Teacher</div>
            <div className="font-medium text-gray-900">{booking.teachers?.name ?? '—'}</div>
          </div>
          <div>
            <div className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-0.5">Room</div>
            <div className="font-medium text-gray-900">{booking.rooms?.name ?? '—'}</div>
          </div>
          <div>
            <div className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-0.5">Date</div>
            <div className="font-medium text-gray-900">{booking.booking_date}</div>
          </div>
          <div>
            <div className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-0.5">Time</div>
            <div className="font-medium text-gray-900">
              {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
          <span className="capitalize bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
            {booking.lesson_type}
          </span>
          <span className="text-gray-300">·</span>
          <span>Submitted {new Date(booking.created_at).toLocaleDateString()}</span>
        </div>

        {booking.manager_notes && (
          <div className="mt-3 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-sm text-red-700">
            <span className="font-medium">Manager note:</span> {booking.manager_notes}
          </div>
        )}

        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Approve / Reject actions — only shown for pending bookings */}
        {booking.status === 'pending' && (
          <div className="mt-5">
            {!showRejectForm ? (
              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2.5 rounded-lg transition-colors"
                >
                  {loading ? 'Processing...' : 'Approve'}
                </button>
                <button
                  onClick={() => setShowRejectForm(true)}
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2.5 rounded-lg transition-colors"
                >
                  Reject
                </button>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection note (optional)
                </label>
                <textarea
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  placeholder="Add a note to send to the student..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none mb-3"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleReject}
                    disabled={loading}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2.5 rounded-lg transition-colors"
                  >
                    {loading ? 'Rejecting...' : 'Confirm Reject'}
                  </button>
                  <button
                    onClick={() => {
                      setShowRejectForm(false)
                      setRejectNotes('')
                    }}
                    disabled={loading}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
