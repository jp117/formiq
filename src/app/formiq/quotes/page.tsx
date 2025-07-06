import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '../../../../lib/supabase-server'
import Layout from '../components/Layout'
import QuotesContent from './components/QuotesContent'

export default async function QuotesPage() {
  const supabase = await createServerSupabaseClient()
  
  // Check if user is authenticated and approved
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/')
  }

  // Get user data including approval status and quotes access
  const { data: userData } = await supabase
    .from('users')
    .select(`
      *,
      company:companies(*)
    `)
    .eq('id', user.id)
    .single()

  if (!userData?.is_approved) {
    redirect('/pending-approval')
  }

  // Check if user has quotes access
  if (!userData?.quotes_access || userData.quotes_access === 'no_access') {
    redirect('/formiq')
  }
  
  return (
    <Layout userData={userData}>
      <QuotesContent />
    </Layout>
  )
} 