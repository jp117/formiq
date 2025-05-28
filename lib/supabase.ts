import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Types for our database
export interface Company {
  id: string
  company_name: string
  domain: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  company_id: string | null
  is_approved: boolean
  created_at: string
  updated_at: string
  company?: Company
} 