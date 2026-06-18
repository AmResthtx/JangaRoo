import { createServerClient } from '@/lib/supabase'

export const revalidate = 0

export default async function TeachersPage() {
  const supabase = createServerClient()

  const studioSlug = process.env.NEXT_PUBLIC_DEFAULT_STUDIO_SLUG || 'rhythm'

  const { data: studio } = await supabase
    .from('studios')
    .select('id, name')
    .eq('slug', studioSlug)
    .single()

  const { data: teachers, error } = studio
    ? await supabase
        .from('teachers')
        .select('id, name, email, phone, bio, active, created_at')
        .eq('studio_id', studio.id)
        .order('name')
    : { data: [], error: null }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <p className="text-red-600">Error loading teachers: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
          {studio && (
            <p className="text-gray-500 mt-1">{studio.name}</p>
          )}
        </div>
        <span className="bg-primary-100 text-primary-700 font-semibold px-4 py-2 rounded-lg text-sm">
          {teachers?.length ?? 0} teacher{teachers?.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Name</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Email</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Phone</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Bio</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {teachers && teachers.length > 0 ? (
              teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{teacher.name}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <a
                      href={`mailto:${teacher.email}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {teacher.email}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {teacher.phone ?? <span className="text-gray-400 italic">—</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs">
                    {teacher.bio ? (
                      <span className="line-clamp-2">{teacher.bio}</span>
                    ) : (
                      <span className="text-gray-400 italic">No bio</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {teacher.active ? (
                      <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 font-medium px-3 py-1 rounded-full text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 font-medium px-3 py-1 rounded-full text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
                        Inactive
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-gray-400">
                  No teachers found. Add teachers in Supabase to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
