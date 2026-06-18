'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase'

interface Teacher {
  id: string
  name: string
  bio: string | null
  photo_url: string | null
  email: string
}

interface Room {
  id: string
  name: string
  capacity: number | null
}

interface AvailabilitySlot {
  id: string
  start_time: string
  end_time: string
}

interface Props {
  studioSlug: string
}

const STEPS = ['Teacher', 'Date & Time', 'Room', 'Your Info', 'Confirm']

function formatTime(time: string): string {
  const [hourStr] = time.split(':')
  const hour = parseInt(hourStr, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  return `${displayHour}:00 ${ampm}`
}

function addOneHour(time: string): string {
  const [hourStr, minStr] = time.split(':')
  const hour = parseInt(hourStr, 10)
  return `${String(hour + 1).padStart(2, '0')}:${minStr}:00`
}

export default function BookingForm({ studioSlug }: Props) {
  const [step, setStep] = useState(0)
  const [studioId, setStudioId] = useState<string | null>(null)

  // Step 1: Teacher
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)

  // Step 2: Date & Time
  const [bookingDate, setBookingDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([])
  const [selectedStartTime, setSelectedStartTime] = useState('')
  const [selectedEndTime, setSelectedEndTime] = useState('')

  // Step 3: Room
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  // Step 4: Student info
  const [studentName, setStudentName] = useState('')
  const [studentEmail, setStudentEmail] = useState('')
  const [studentPhone, setStudentPhone] = useState('')
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifySms, setNotifySms] = useState(false)

  // Submission
  const [submitting, setSubmitting] = useState(false)
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const supabase = createBrowserClient()

  // Fetch studio ID
  useEffect(() => {
    async function fetchStudio() {
      const { data } = await supabase
        .from('studios')
        .select('id')
        .eq('slug', studioSlug)
        .single()
      if (data) setStudioId(data.id)
    }
    fetchStudio()
  }, [studioSlug]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch teachers when studio is known
  useEffect(() => {
    if (!studioId) return
    async function fetchTeachers() {
      const { data } = await supabase
        .from('teachers')
        .select('id, name, bio, photo_url, email')
        .eq('studio_id', studioId!)
        .eq('active', true)
      setTeachers(data ?? [])
    }
    fetchTeachers()
  }, [studioId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch rooms when studio is known
  useEffect(() => {
    if (!studioId) return
    async function fetchRooms() {
      const { data } = await supabase
        .from('rooms')
        .select('id, name, capacity')
        .eq('studio_id', studioId!)
        .eq('active', true)
      setRooms(data ?? [])
    }
    fetchRooms()
  }, [studioId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch availability when teacher + date are selected
  useEffect(() => {
    if (!selectedTeacher || !bookingDate) return
    const dateObj = new Date(bookingDate + 'T00:00:00')
    const dayOfWeek = dateObj.getDay() // 0=Sunday

    async function fetchSlots() {
      const { data } = await supabase
        .from('availability_slots')
        .select('id, start_time, end_time')
        .eq('teacher_id', selectedTeacher!.id)
        .eq('day_of_week', dayOfWeek)
        .eq('active', true)
        .order('start_time')
      setAvailableSlots(data ?? [])
      setSelectedStartTime('')
      setSelectedEndTime('')
    }
    fetchSlots()
  }, [selectedTeacher, bookingDate]) // eslint-disable-line react-hooks/exhaustive-deps

  const today = new Date().toISOString().split('T')[0]

  async function handleSubmit() {
    if (!selectedTeacher || !selectedRoom || !bookingDate || !selectedStartTime) return
    setSubmitting(true)
    setSubmitError(null)

    const notifyVia: string[] = []
    if (notifyEmail) notifyVia.push('email')
    if (notifySms) notifyVia.push('sms')

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studioSlug,
          teacherId: selectedTeacher.id,
          roomId: selectedRoom.id,
          bookingDate,
          startTime: selectedStartTime,
          endTime: selectedEndTime,
          lessonType: 'private',
          studentName,
          studentEmail,
          studentPhone,
          notifyVia,
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        setSubmitError(json.error ?? 'Something went wrong')
        setSubmitting(false)
        return
      }
      setConfirmedBookingId(json.booking.id)
    } catch {
      setSubmitError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmedBookingId) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Booking Submitted!</h2>
        <p className="text-gray-600 mb-4">
          Your booking request has been sent to the studio manager for approval.
          You will receive an email confirmation once it has been reviewed.
        </p>
        <p className="text-sm text-gray-400 font-mono">Booking ID: {confirmedBookingId}</p>
        <a
          href="/"
          className="mt-8 inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Back to Home
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Book a Lesson</h1>
      <p className="text-center text-gray-500 mb-8">Follow the steps below to request your booking.</p>

      {/* Progress bar */}
      <div className="flex items-center justify-between mb-10">
        {STEPS.map((label, index) => (
          <div key={label} className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1 transition-colors ${
                index < step
                  ? 'bg-primary-600 text-white'
                  : index === step
                  ? 'bg-primary-600 text-white ring-4 ring-primary-200'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index < step ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span className={`text-xs hidden sm:block ${index === step ? 'text-primary-600 font-semibold' : 'text-gray-400'}`}>
              {label}
            </span>
            {index < STEPS.length - 1 && (
              <div className={`absolute hidden`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        {/* Step 0: Choose Teacher */}
        {step === 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Your Teacher</h2>
            {teachers.length === 0 && (
              <p className="text-gray-400">Loading teachers...</p>
            )}
            <div className="grid grid-cols-1 gap-4">
              {teachers.map((teacher) => (
                <button
                  key={teacher.id}
                  onClick={() => setSelectedTeacher(teacher)}
                  className={`text-left p-5 rounded-xl border-2 transition-all ${
                    selectedTeacher?.id === teacher.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {teacher.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={teacher.photo_url}
                        alt={teacher.name}
                        className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 text-primary-700 font-bold text-xl">
                        {teacher.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900 text-lg">{teacher.name}</div>
                      {teacher.bio && (
                        <p className="text-gray-500 text-sm mt-1 line-clamp-3">{teacher.bio}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Date & Time */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Pick a Date & Time
              {selectedTeacher && (
                <span className="text-base font-normal text-gray-500 ml-2">
                  with {selectedTeacher.name}
                </span>
              )}
            </h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                min={today}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {bookingDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Available Times
                </label>
                {availableSlots.length === 0 ? (
                  <p className="text-gray-400 text-sm">
                    No available slots for this day. Please choose a different date.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => {
                          setSelectedStartTime(slot.start_time)
                          setSelectedEndTime(addOneHour(slot.start_time))
                        }}
                        className={`py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          selectedStartTime === slot.start_time
                            ? 'border-primary-600 bg-primary-600 text-white'
                            : 'border-gray-200 text-gray-700 hover:border-primary-400 hover:bg-primary-50'
                        }`}
                      >
                        {formatTime(slot.start_time)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Room */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose a Room</h2>
            {rooms.length === 0 && (
              <p className="text-gray-400">Loading rooms...</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`text-left p-5 rounded-xl border-2 transition-all ${
                    selectedRoom?.id === room.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-3xl mb-2">🏢</div>
                  <div className="font-semibold text-gray-900">{room.name}</div>
                  {room.capacity && (
                    <div className="text-sm text-gray-500 mt-1">
                      Capacity: {room.capacity} people
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Student Info */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="+1 555 000 0000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Notification Preferences</p>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.checked)}
                      className="w-4 h-4 accent-primary-600"
                    />
                    <span className="text-gray-700">Notify me via Email</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifySms}
                      onChange={(e) => setNotifySms(e.target.checked)}
                      className="w-4 h-4 accent-primary-600"
                    />
                    <span className="text-gray-700">Notify me via SMS</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Confirm Your Booking</h2>
            <div className="bg-gray-50 rounded-xl p-6 space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Teacher</span>
                <span className="text-gray-900 font-semibold">{selectedTeacher?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Date</span>
                <span className="text-gray-900 font-semibold">{bookingDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Time</span>
                <span className="text-gray-900 font-semibold">
                  {formatTime(selectedStartTime)} – {formatTime(selectedEndTime)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Room</span>
                <span className="text-gray-900 font-semibold">{selectedRoom?.name}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Student</span>
                  <span className="text-gray-900 font-semibold">{studentName}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500 font-medium">Email</span>
                  <span className="text-gray-900">{studentEmail}</span>
                </div>
                {studentPhone && (
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500 font-medium">Phone</span>
                    <span className="text-gray-900">{studentPhone}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500 font-medium">Notify via</span>
                  <span className="text-gray-900">
                    {[notifyEmail && 'Email', notifySms && 'SMS'].filter(Boolean).join(', ') || 'None'}
                  </span>
                </div>
              </div>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm mb-4">
                {submitError}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold py-4 rounded-xl transition-colors text-lg"
            >
              {submitting ? 'Submitting...' : 'Submit Booking Request'}
            </button>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>

          {step < STEPS.length - 1 && (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={
                (step === 0 && !selectedTeacher) ||
                (step === 1 && (!bookingDate || !selectedStartTime)) ||
                (step === 2 && !selectedRoom) ||
                (step === 3 && (!studentName || !studentEmail))
              }
              className="px-6 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
