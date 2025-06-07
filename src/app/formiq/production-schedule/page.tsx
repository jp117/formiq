import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '../../../../lib/supabase-server'
import Layout from '../components/Layout'
import ProductionScheduleContent from './components/ProductionScheduleContent'

export default async function ProductionSchedulePage() {
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

  // Check if user has production schedule access
  if (!userData?.production_schedule_access || userData.production_schedule_access === 'no_access') {
    redirect('/formiq') // Redirect to dashboard if no access
  }

  // Fetch production schedule data (only non-completed items)
  const { data: switchboards } = await supabase
    .from('switchboards')
    .select(`
      *,
      purchase_orders(
        *,
        components(*)
      )
    `)
    .eq('company_id', userData.company_id)
    .eq('completed', false)

  const { data: integrations } = await supabase
    .from('integration')
    .select(`
      *,
      purchase_orders(
        *,
        components(*)
      )
    `)
    .eq('company_id', userData.company_id)
    .eq('completed', false)

  const { data: miscItems } = await supabase
    .from('misc')
    .select(`
      *,
      purchase_orders(
        *,
        components(*)
      )
    `)
    .eq('company_id', userData.company_id)
    .eq('completed', false)

  const breadcrumbs = [
    { label: 'Dashboard', href: '/formiq' },
    { label: 'Production Schedule' }
  ]
  
  return (
    <Layout userData={userData} breadcrumbs={breadcrumbs}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Production Schedule
        </h2>
        <p className="text-gray-600">
          Manage your production schedules, timelines, and deadlines.
        </p>
      </div>

      <ProductionScheduleContent 
        switchboards={switchboards || []}
        integrations={integrations || []}
        miscItems={miscItems || []}
        companyId={userData.company_id}
        userAccess={userData.production_schedule_access}
      />
    </Layout>
  )
} 