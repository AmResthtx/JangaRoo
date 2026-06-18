import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { payment_status } = await req.json()

  if (!['paid', 'unpaid', 'waived'].includes(payment_status)) {
    return NextResponse.json({ error: 'Invalid payment_status' }, { status: 400 })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('bookings')
    .update({ payment_status })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ booking: data })
}
