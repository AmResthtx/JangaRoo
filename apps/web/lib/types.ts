export * from '../../packages/db/schema'

export interface BookingFormData {
  teacherId: string
  roomId: string
  bookingDate: string
  startTime: string
  endTime: string
  lessonType: 'class' | 'private'
  studentName: string
  studentEmail: string
  studentPhone: string
  notifyVia: ('email' | 'sms')[]
}
