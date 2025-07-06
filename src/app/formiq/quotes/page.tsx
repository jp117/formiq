import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '../../../../lib/supabase-server'
import Layout from '../components/Layout'

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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">The Quotes App</h1>
          
          {/* Description with New Quote button and Search box on the same line */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-gray-600">
              Manage and track your customer quotes and proposals.
            </p>
            
            <div className="flex items-center gap-3">
              {/* Search Box */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search quotes..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* New Quote Button */}
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Quote
              </button>
            </div>
          </div>
        </div>

        {/* Recently Quoted Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recently Quoted</h2>
          
          {/* Grid of Quote Cards - 4 columns wide, 2 rows tall on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Show 8 skeleton cards for now */}
            {Array.from({ length: 8 }).map((_, index) => (
              <QuoteCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

// Skeleton component for quote cards
function QuoteCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
      <div className="space-y-3">
        {/* Quote number skeleton */}
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        
        {/* Customer name skeleton */}
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        
        {/* Amount skeleton */}
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        
        {/* Status skeleton */}
        <div className="flex items-center space-x-2 mt-4">
          <div className="h-2 bg-gray-200 rounded-full w-2"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
        
        {/* Date skeleton */}
        <div className="h-3 bg-gray-200 rounded w-20 mt-2"></div>
      </div>
    </div>
  )
} 