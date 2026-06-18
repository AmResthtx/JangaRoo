export type BookingStatus = 'pending' | 'approved' | 'rejected';
export type LessonType = 'class' | 'private';

export interface Studio {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  contact_email: string;
  manager_email: string;
  n8n_webhook_url: string | null;
  payment_link_url: string | null;
  twilio_enabled: boolean;
  created_at: string;
}

export interface Teacher {
  id: string;
  studio_id: string;
  name: string;
  email: string;
  phone: string | null;
  bio: string | null;
  photo_url: string | null;
  active: boolean;
  created_at: string;
}

export interface Room {
  id: string;
  studio_id: string;
  name: string;
  capacity: number | null;
  active: boolean;
}

export interface AvailabilitySlot {
  id: string;
  teacher_id: string;
  room_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_type: LessonType;
  active: boolean;
}

export interface Booking {
  id: string;
  studio_id: string;
  teacher_id: string;
  room_id: string;
  student_name: string;
  student_email: string;
  student_phone: string | null;
  notify_via: string[];
  booking_date: string;
  start_time: string;
  end_time: string;
  lesson_type: LessonType;
  status: BookingStatus;
  manager_notes: string | null;
  payment_status: 'unpaid' | 'paid' | 'waived';
  n8n_run_id: string | null;
  created_at: string;
  updated_at: string;
}
