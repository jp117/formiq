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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">The Quotes App</h1>
          <p className="text-gray-600">
            Manage and track your customer quotes and proposals.
          </p>
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