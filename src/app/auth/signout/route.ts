import { createServerSupabaseClient } from '../../../../lib/supabase-server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  
  await supabase.auth.signOut()
  
  // Get the origin from the request to build the redirect URL
  const requestUrl = new URL(request.url)
  const redirectUrl = new URL('/', requestUrl.origin)
  
  // Use 303 status to force browser to use GET method for the redirect
  return NextResponse.redirect(redirectUrl, { status: 303 })
} 