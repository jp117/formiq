import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '../../../../../../../lib/supabase-server'
import Layout from '../../../../components/Layout'
import SwitchboardConfigurator from './components/SwitchboardConfigurator'

interface SwitchboardConfiguratorPageProps {
  params: Promise<{ id: string }>
}

export default async function SwitchboardConfiguratorPage({ params }: SwitchboardConfiguratorPageProps) {
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

  // Fetch the quote data to verify access
  const { data: quote, error } = await supabase
    .from('quotes')
    .select(`
      id,
      quote_number,
      quote_name,
      company_id,
      created_by
    `)
    .eq('id', resolvedParams.id)
    .eq('company_id', userData.company_id)
    .single()

  if (error || !quote) {
    redirect('/formiq/quotes')
  }

  // Fetch available assemblies for switchboards
  const { data: assemblies } = await supabase
    .from('assemblies')
    .select(`
      *,
      assembly_components (
        id,
        quantity,
        is_optional,
        notes,
        component:quote_components (*)
      )
    `)
    .eq('category', 'Switchboard')
    .eq('is_active', true)
    .order('name', { ascending: true })

  // Fetch available components for custom configuration
  const { data: components } = await supabase
    .from('quote_components')
    .select('*')
    .order('type', { ascending: true })
    .order('vendor', { ascending: true })

  const breadcrumbs = [
    { label: 'Dashboard', href: '/formiq' },
    { label: 'Quotes', href: '/formiq/quotes' },
    { label: `Quote ${quote.quote_number}`, href: `/formiq/quotes/${quote.id}` },
    { label: 'Switchboard Configurator' }
  ]

  return (
    <Layout userData={userData} breadcrumbs={breadcrumbs}>
      <SwitchboardConfigurator
        quote={quote}
        assemblies={assemblies || []}
        components={components || []}
        userData={userData}
      />
    </Layout>
  )
} 