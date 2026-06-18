// TODO: Add authentication guard — only authenticated managers should access this page.
// Consider using Supabase Auth with a middleware check on /admin/* routes.

import { createServerClient } from '@/lib/supabase'
import BookingCard from '@/components/BookingCard'

export const revalidate = 0

export default async function AdminDashboardPage() {
  const supabase = createServerClient()

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(
      `
      id,
      student_name,
      student_email,
      student_phone,
      notify_via,
      booking_date,
      start_time,
      end_time,
      lesson_type,
      status,
      manager_notes,
      created_at,
      updated_at,
      teachers ( id, name, email ),
      rooms ( id, name )
    `
    )
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <p className="text-red-600">Error loading bookings: {error.message}</p>
      </div>
    )
  }

  const pending = bookings?.filter((b) => b.status === 'pending') ?? []
  const approved = bookings?.filter((b) => b.status === 'approved') ?? []
  const rejected = bookings?.filter((b) => b.status === 'rejected') ?? []

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Booking Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <div className="text-4xl font-extrabold text-yellow-700">{pending.length}</div>
          <div className="text-sm font-medium text-yellow-600 mt-1">Pending</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="text-4xl font-extrabold text-green-700">{approved.length}</div>
          <div className="text-sm font-medium text-green-600 mt-1">Approved</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-4xl font-extrabold text-red-700">{rejected.length}</div>
          <div className="text-sm font-medium text-red-600 mt-1">Rejected</div>
        </div>
      </div>

      {/* Pending section */}
      {pending.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Pending Approval ({pending.length})
          </h2>
          <div className="space-y-4">
            {pending.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </section>
      )}

      {/* Approved section */}
      {approved.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Approved ({approved.length})
          </h2>
          <div className="space-y-4">
            {approved.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </section>
      )}

      {/* Rejected section */}
      {rejected.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Rejected ({rejected.length})
          </h2>
          <div className="space-y-4">
            {rejected.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </section>
      )}

      {bookings?.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-2xl mb-2">No bookings yet</p>
          <p className="text-sm">Bookings will appear here once students submit requests.</p>
        </div>
      )}
    </div>
  )
}
