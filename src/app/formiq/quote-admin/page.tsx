import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '../../../../lib/supabase-server'
import Layout from '../components/Layout'
import QuoteAdminTabs from './components/QuoteAdminTabs'

export default async function QuoteAdminPage() {
  const supabase = await createServerSupabaseClient()
  
  // Check if user is authenticated and approved
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/')
  }

  // Get user data including approval status and admin status
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

  // Check if user is admin or quote admin
  if (!userData?.is_admin && !userData?.is_quote_admin) {
    redirect('/formiq') // Redirect to dashboard if not authorized
  }

  // Fetch all quote components
  const { data: quoteComponents } = await supabase
    .from('quote_components')
    .select('*')
    .order('type', { ascending: true })
    .order('vendor', { ascending: true })

  // Fetch all assemblies with their components
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
    .eq('is_active', true)
    .order('category', { ascending: true })
    .order('name', { ascending: true })

  const breadcrumbs = [
    { label: 'Dashboard', href: '/formiq' },
    { label: 'Quote Administration' }
  ]
  
  return (
    <Layout userData={userData} breadcrumbs={breadcrumbs}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Quote Administration
        </h2>
        <p className="text-gray-600">
          Manage quote components, assemblies, and configurations.
        </p>
      </div>

      <QuoteAdminTabs 
        components={quoteComponents || []} 
        assemblies={assemblies || []}
      />
    </Layout>
  )
} 