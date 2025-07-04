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

        {/* Quotes Card - Only show if user has access */}
        {userData?.quotes_access && userData.quotes_access !== 'no_access' && (
          <Link href="/formiq/quotes" className="block">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 rounded-lg p-2 w-10 h-10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Quotes</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Create and manage customer quotes for electrical equipment.
              </p>
            </div>
          </Link>
        )}

        {/* Quote Administration Card - Only show if user is admin or quote admin */}
        {(userData?.is_admin || userData?.is_quote_admin) && (
          <Link href="/formiq/quote-admin" className="block">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 rounded-lg p-2 w-10 h-10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Quote Administration</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Manage quote components, pricing, and configurations.
              </p>
            </div>
          </Link>
        )}
      </div>
    </Layout>
  )
} 