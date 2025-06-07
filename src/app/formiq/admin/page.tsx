import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '../../../../lib/supabase-server'
import Layout from '../components/Layout'
import AdminContent from './components/AdminContent'

export default async function AdminPage() {
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

  // Check if user is admin
  if (!userData?.is_admin) {
    redirect('/formiq') // Redirect to dashboard if not admin
  }

  // Fetch all users for admin management
  const { data: allUsers } = await supabase
    .from('users')
    .select(`
      *,
      company:companies(*)
    `)
    .order('created_at', { ascending: false })

  const breadcrumbs = [
    { label: 'Dashboard', href: '/formiq' },
    { label: 'Admin Panel' }
  ]
  
  return (
    <Layout userData={userData} breadcrumbs={breadcrumbs}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Admin Panel
        </h2>
        <p className="text-gray-600">
          Manage users, approvals, and access permissions across the system.
        </p>
      </div>

      <AdminContent 
        users={allUsers || []}
      />
    </Layout>
  )
} 