import { createBrowserClient as _createBrowserClient, createServerClient as _createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

/**
 * Browser (client-side) Supabase client.
 * Uses the anon key and respects RLS.
 */
export function createBrowserClient() {
  return _createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

/**
 * Server-side Supabase client.
 * Uses the service role key when available (API routes / Server Actions),
 * otherwise falls back to the anon key (Server Components with RLS).
 * Reads cookies from next/headers for session passthrough.
 */
export function createServerClient() {
  const cookieStore = cookies()
  const key = SUPABASE_SERVICE_ROLE_KEY ?? SUPABASE_ANON_KEY

  return _createServerClient(SUPABASE_URL, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set() {
        // Service role clients don't need to set cookies
      },
      remove() {
        // Service role clients don't need to remove cookies
      },
    },
  })
}
