import { createServerClient } from '@/lib/supabase'
import BookingForm from '@/components/BookingForm'

interface Props {
  params: { studioSlug: string }
}

export default async function StudioBookPage({ params }: Props) {
  const supabase = createServerClient()

  const { data: studio, error } = await supabase
    .from('studios')
    .select('id, slug, name, logo_url')
    .eq('slug', params.studioSlug)
    .single()

  if (error || !studio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Studio Not Found</h1>
          <p className="text-gray-500 mb-6">
            We could not find a studio with the slug &quot;{params.studioSlug}&quot;.
            Please check the URL and try again.
          </p>
          <a
            href="/"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      {studio.logo_url && (
        <div className="flex justify-center mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={studio.logo_url}
            alt={`${studio.name} logo`}
            className="h-16 object-contain"
          />
        </div>
      )}
      <h1 className="text-center text-2xl font-bold text-gray-800 mb-2">
        {studio.name}
      </h1>
      <BookingForm studioSlug={params.studioSlug} />
    </div>
  )
}
