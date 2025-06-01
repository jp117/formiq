import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '../../../../lib/supabase-server'
import Layout from '../components/Layout'

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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="bg-green-100 rounded-lg p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Frame Parts Tool</h3>
          <p className="text-gray-600 mb-4">
            This section will contain frame parts management functionality.
          </p>
          <p className="text-sm text-gray-500">
            Your access level: <span className="font-medium text-gray-700">{userData.frame_parts_access.replace('_', ' ')}</span>
          </p>
        </div>
      </div>
    </Layout>
  )
} 