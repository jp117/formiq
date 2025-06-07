import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '../../../lib/supabase-server'
import Link from 'next/link'
import Layout from './components/Layout'

export default async function FormIQPage() {
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
  
  return (
    <Layout userData={userData}>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Production Schedule Card - Only show if user has access */}
        {userData?.production_schedule_access && userData.production_schedule_access !== 'no_access' && (
          <Link href="/formiq/production-schedule" className="block">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-lg p-2 w-10 h-10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Production Schedule</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Manage and view your production schedules, timelines, and deadlines.
              </p>
            </div>
          </Link>
        )}

        {/* Frame Parts Card - Only show if user has access */}
        {userData?.frame_parts_access && userData.frame_parts_access !== 'no_access' && (
          <Link href="/formiq/frame-parts" className="block">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 rounded-lg p-2 w-10 h-10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Frame Parts</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Manage and track frame parts inventory, specifications, and requirements.
              </p>
            </div>
          </Link>
        )}
      </div>
    </Layout>
  )
} 