import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '../../../../lib/supabase-server'
import Layout from '../components/Layout'
import FramePartsContent from './components/FramePartsContent'

export default async function FramePartsPage() {
  const supabase = await createServerSupabaseClient()
  
  // Check if user is authenticated and approved
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/')
  }

  // Get user data including approval status
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

  // Check if user has frame parts access
  if (!userData?.frame_parts_access || userData.frame_parts_access === 'no_access') {
    redirect('/formiq') // Redirect to dashboard if no access
  }

  const breadcrumbs = [
    { label: 'Dashboard', href: '/formiq' },
    { label: 'Frame Parts' }
  ]
  
  return (
    <Layout userData={userData} breadcrumbs={breadcrumbs}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Frame Parts
        </h2>
        <p className="text-gray-600">
          Manage and track frame parts inventory, specifications, and requirements.
        </p>
      </div>

      <FramePartsContent 
        userAccess={userData.frame_parts_access}
      />
    </Layout>
  )
} 