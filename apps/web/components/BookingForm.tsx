'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import type { Teacher, Room, AvailabilitySlot } from '@/lib/types'

interface Props {
  studioSlug: string
}

type Step = 1 | 2 | 3 | 4 | 5

const STEPS = ['Teacher', 'Date & Time', 'Room', 'Your Info', 'Confirm']

function StepBar({ current }: { current: Step }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((label, i) => {
        const n = (i + 1) as Step
        const done = n < current
        const active = n === current
        return (
          <div key={n} className="flex items-center flex-1 last:flex-none">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
              ${done ? 'bg-primary-600 text-white' : active ? 'bg-primary-600 text-white ring-4 ring-primary-200' : 'bg-gray-200 text-gray-500'}`}>
              {done ? '✓' : n}
            </div>
            <span className={`ml-2 text-xs font-medium hidden sm:block ${active ? 'text-primary-700' : 'text-gray-400'}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 ${done ? 'bg-primary-600' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function formatTime(t: string) {
  const [h, m] = t.split(':')
  const hr = parseInt(h)
  return `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}`
}

export default function BookingForm({ studioSlug }: Props) {
  const supabase = createBrowserClient()
  const [step, setStep] = useState<Step>(1)

  // Studio
  const [studioId, setStudioId] = useState<string>('')
  const [studioName, setStudioName] = useState<string>('')

  // Step 1
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)

  // Step 2
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null)

  // Step 3
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  // Step 4
  const [studentName, setStudentName] = useState('')
  const [studentEmail, setStudentEmail] = useState('')
  const [studentPhone, setStudentPhone] = useState('')
  const [notifyVia, setNotifyVia] = useState<('email' | 'sms')[]>(['email'])
  const [lessonType, setLessonType] = useState<'class' | 'private'>('private')

  // Result
  const [submitting, setSubmitting] = useState(false)
  const [confirmedId, setConfirmedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load studio + teachers
  useEffect(() => {
    async function load() {
      const { data: studio } = await supabase
        .from('studios')
        .select('id, name')
        .eq('slug', studioSlug)
        .single()
      if (studio) {
        setStudioId(studio.id)
        setStudioName(studio.name)
        const { data } = await supabase
          .from('teachers')
          .select('*')
          .eq('studio_id', studio.id)
          .eq('active', true)
          .order('name')
        setTeachers(data ?? [])
      }
    }
    load()
  }, [studioSlug, supabase])

  // Load availability when teacher + date selected
  useEffect(() => {
    if (!selectedTeacher || !date) return
    const dow = new Date(date + 'T12:00:00').getDay()
    supabase
      .from('availability_slots')
      .select('*')
      .eq('teacher_id', selectedTeacher.id)
      .eq('day_of_week', dow)
      .eq('active', true)
      .order('start_time')
      .then(({ data }) => {
        setSlots(data ?? [])
        setSelectedSlot(null)
      })
  }, [selectedTeacher, date, supabase])

  // Load rooms when studio known
  useEffect(() => {
    if (!studioId) return
    supabase
      .from('rooms')
      .select('*')
      .eq('studio_id', studioId)
      .eq('active', true)
      .order('name')
      .then(({ data }) => setRooms(data ?? []))
  }, [studioId, supabase])

  function toggleNotify(method: 'email' | 'sms') {
    setNotifyVia(prev =>
      prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]
    )
  }

  async function handleSubmit() {
    if (!studioId || !selectedTeacher || !selectedSlot || !selectedRoom) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studioId,
          teacherId: selectedTeacher.id,
          roomId: selectedRoom.id,
          bookingDate: date,
          startTime: selectedSlot.start_time,
          endTime: selectedSlot.end_time,
          lessonType,
          studentName,
          studentEmail,
          studentPhone,
          notifyVia,
        }),
      })
      if (!res.ok) {
        const { error: msg } = await res.json()
        throw new Error(msg ?? 'Booking failed')
      }
      const booking = await res.json()
      setConfirmedId(booking.id)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmedId) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Submitted!</h2>
        <p className="text-gray-500 mb-4">
          Your request has been sent to the studio for approval. You&apos;ll receive a
          confirmation once it&apos;s reviewed.
        </p>
        <p className="text-xs text-gray-400">Booking ID: {confirmedId}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <StepBar current={step} />

      {/* Step 1: Teacher */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose a Teacher</h2>
          <div className="grid gap-3">
            {teachers.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTeacher(t)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  selectedTeacher?.id === t.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="font-semibold text-gray-900">{t.name}</div>
                {t.bio && <div className="text-sm text-gray-500 mt-1 line-clamp-2">{t.bio}</div>}
              </button>
            ))}
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={() => setStep(2)}
              disabled={!selectedTeacher}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Date & Time */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Pick a Date & Time</h2>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          {date && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Times</label>
              {slots.length === 0 ? (
                <p className="text-gray-400 italic text-sm">No availability on this date. Try another day.</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSlot(s)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border-2 transition-all ${
                        selectedSlot?.id === s.id
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 text-gray-700 hover:border-primary-300'
                      }`}
                    >
                      {formatTime(s.start_time)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2">
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!selectedSlot}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Room */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select a Room</h2>
          <div className="grid gap-3">
            {rooms.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRoom(r)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  selectedRoom?.id === r.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="font-semibold text-gray-900">{r.name}</div>
                {r.capacity && (
                  <div className="text-sm text-gray-500 mt-0.5">Capacity: {r.capacity}</div>
                )}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(2)} className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2">
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={!selectedRoom}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Student Info */}
      {step === 4 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                value={studentEmail}
                onChange={e => setStudentEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
              <input
                type="tel"
                value={studentPhone}
                onChange={e => setStudentPhone(e.target.value)}
                placeholder="+1 555 000 0000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Type</label>
              <div className="flex gap-3">
                {(['private', 'class'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setLessonType(t)}
                    className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                      lessonType === t
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-600 hover:border-primary-300'
                    }`}
                  >
                    {t === 'private' ? 'Private Lesson' : 'Group Class'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notify me via</label>
              <div className="flex gap-4">
                {(['email', 'sms'] as const).map(m => (
                  <label key={m} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyVia.includes(m)}
                      onChange={() => toggleNotify(m)}
                      className="w-4 h-4 accent-primary-600"
                    />
                    <span className="text-sm text-gray-700 capitalize">{m === 'sms' ? 'SMS' : 'Email'}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(3)} className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2">
              Back
            </button>
            <button
              onClick={() => setStep(5)}
              disabled={!studentName || !studentEmail || notifyVia.length === 0}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Review
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Confirm */}
      {step === 5 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Booking</h2>
          <div className="bg-gray-50 rounded-xl border border-gray-200 divide-y divide-gray-200 mb-6">
            {[
              ['Studio', studioName],
              ['Teacher', selectedTeacher?.name],
              ['Date', date],
              ['Time', selectedSlot ? `${formatTime(selectedSlot.start_time)} – ${formatTime(selectedSlot.end_time)}` : ''],
              ['Room', selectedRoom?.name],
              ['Lesson Type', lessonType === 'private' ? 'Private Lesson' : 'Group Class'],
              ['Student', studentName],
              ['Email', studentEmail],
              ['Phone', studentPhone || '—'],
              ['Notify via', notifyVia.join(', ')],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-gray-500 font-medium">{label}</span>
                <span className="text-gray-900">{value}</span>
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex justify-between">
            <button onClick={() => setStep(4)} className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2">
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-gold-600 hover:bg-gold-700 disabled:opacity-50 text-white font-bold px-8 py-2.5 rounded-lg transition-colors"
            >
              {submitting ? 'Submitting…' : 'Submit Booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
