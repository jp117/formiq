import { createServerSupabaseClient } from '../../../../../lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check if user is authenticated and is admin
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is admin
    const { data: adminUser } = await supabase
      .from('users')
      .select('is_admin, is_approved')
      .eq('id', user.id)
      .single()

    if (!adminUser?.is_admin || !adminUser?.is_approved) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { userId, updates } = await request.json()

    if (!userId || !updates) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Update the user
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user:', error)
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: data })
  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check if user is authenticated and is admin
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is admin
    const { data: adminUser } = await supabase
      .from('users')
      .select('is_admin, is_approved')
      .eq('id', user.id)
      .single()

    if (!adminUser?.is_admin || !adminUser?.is_approved) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 })
    }

    // Prevent admin from deleting themselves
    if (userId === user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
    }

    // Delete from users table (this will cascade and delete from auth.users via trigger)
    const { error: userError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (userError) {
      console.error('Error deleting user from users table:', userError)
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
    }

    // Also delete from auth.users to ensure complete cleanup
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)
    
    if (authError) {
      console.error('Error deleting user from auth:', authError)
      // Don't fail the request if auth deletion fails, as user table deletion succeeded
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 