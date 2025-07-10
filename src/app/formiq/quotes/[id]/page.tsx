import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '../../../../../lib/supabase-server'
import Layout from '../../components/Layout'
import QuoteDetailsContent from './components/QuoteDetailsContent'

interface QuotePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function QuotePage({ params }: QuotePageProps) {
  const resolvedParams = await params
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

  // Fetch the quote data
  const { data: quote, error } = await supabase
    .from('quotes')
    .select(`
      id,
      quote_number,
      quote_name,
      due_date,
      status,
      total_amount,
      notes,
      domestic_requirements,
      wbe_requirements,
      created_at,
      updated_at,
      created_by,
      version,
      parent_quote_id,
      version_notes
    `)
    .eq('id', resolvedParams.id)
    .eq('company_id', userData.company_id)
    .single()

  if (error || !quote) {
    redirect('/formiq/quotes')
  }

  // Get creator info separately
  const { data: creator } = await supabase
    .from('users')
    .select('id, first_name, last_name, email')
    .eq('id', quote.created_by)
    .single()

  const quoteWithCreator = {
    ...quote,
    creator: creator || { id: '', first_name: '', last_name: '', email: '' }
  }
  
      return (
      <Layout userData={userData}>
        <QuoteDetailsContent quote={quoteWithCreator} userData={userData} />
      </Layout>
    )
} 