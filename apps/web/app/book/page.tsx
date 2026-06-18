import BookingForm from '@/components/BookingForm'

export default function BookPage() {
  const studioSlug = process.env.NEXT_PUBLIC_DEFAULT_STUDIO_SLUG || 'rhythm'
  return (
    <div className="min-h-screen py-8">
      <BookingForm studioSlug={studioSlug} />
    </div>
  )
}
