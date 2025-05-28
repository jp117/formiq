import { createClient } from './supabase'
import type { User } from './supabase'

export async function signUp(userData: {
  email: string
  password: string
  firstName: string
  lastName: string
  companyId: string
}) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        first_name: userData.firstName,
        last_name: userData.lastName,
        company_id: userData.companyId,
      },
    },
  })

  return { data, error }
}

export async function signIn(email: string, password: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: userData, error } = await supabase
    .from('users')
    .select(`
      *,
      company:companies(*)
    `)
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching user data:', error)
    return null
  }

  return userData
}

export async function checkUserApproval(userId: string): Promise<boolean> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('is_approved')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error checking user approval:', error)
    return false
  }

  return data?.is_approved || false
}

export async function getCompanies() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('company_name')

  if (error) {
    console.error('Error fetching companies:', error)
    return []
  }

  return data || []
} 