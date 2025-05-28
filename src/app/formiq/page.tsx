import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '../../../lib/supabase-server'

export default async function FormIQPage() {
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
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-slate-800 rounded-lg p-2 w-10 h-10 flex items-center justify-center">
                <span className="text-white text-sm font-bold">FIQ</span>
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">FormIQ</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome back, {userData.first_name}!
              </span>
              {userData.company && (
                <span className="text-xs text-gray-500">
                  {userData.company.company_name}
                </span>
              )}
              <form action="/auth/signout" method="post">
                <button 
                  type="submit"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Empty for future development */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to FormIQ
          </h2>
          <p className="text-gray-600">
            Tools and features will be added here soon.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-600">
                © 2024 FormIQ. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <p className="text-sm text-gray-600">
                Powered by <span className="font-medium text-gray-900">Atlas Switch</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 