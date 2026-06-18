import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, #D97706 0%, transparent 50%),
                                radial-gradient(circle at 80% 20%, #a78bfa 0%, transparent 40%)`,
            }}
          />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6">
            Book Your Dance Class
          </h1>
          <p className="text-xl sm:text-2xl text-primary-200 max-w-2xl mx-auto mb-10">
            Find the perfect teacher, choose a time that works for you, and get
            confirmed in minutes. Dance starts here.
          </p>
          <Link
            href="/book"
            className="inline-block bg-gold-600 hover:bg-gold-700 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg transition-colors duration-200"
          >
            Book Now
          </Link>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          How it works
        </h2>
        <p className="text-center text-gray-500 mb-14 text-lg">
          Three simple steps to your next dance lesson.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-5">
              <span className="text-3xl">💃</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary-600 text-white font-bold flex items-center justify-center text-sm mb-3">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Choose Your Teacher
            </h3>
            <p className="text-gray-500">
              Browse our talented instructors, read their bios, and pick the
              style that excites you most.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mb-5">
              <span className="text-3xl">📅</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gold-600 text-white font-bold flex items-center justify-center text-sm mb-3">
              2
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Pick a Time
            </h3>
            <p className="text-gray-500">
              Select a date and an available time slot that fits your schedule.
              Hourly slots available Monday through Friday.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
              <span className="text-3xl">✅</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-green-600 text-white font-bold flex items-center justify-center text-sm mb-3">
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Get Confirmed
            </h3>
            <p className="text-gray-500">
              Your booking goes to the studio manager for quick approval. You
              and your teacher both receive a confirmation email.
            </p>
          </div>
        </div>

        <div className="text-center mt-14">
          <Link
            href="/book"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg px-10 py-4 rounded-xl shadow transition-colors duration-200"
          >
            Start Booking
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-10">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
          <span className="font-semibold text-primary-600 text-base">JangaRoo</span>
          <span>© {new Date().getFullYear()} JangaRoo. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
