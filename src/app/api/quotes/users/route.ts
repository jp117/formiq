import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../../../lib/supabase-server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user data including company_id
    const { data: userData } = await supabase
      .from('users')
      .select('company_id, quotes_access')
      .eq('id', user.id)
      .single()

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has quotes access
    if (!userData.quotes_access || userData.quotes_access === 'no_access') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // First get unique user IDs who have created quotes
    const { data: quoteCreators, error: quotesError } = await supabase
      .from('quotes')
      .select('created_by')
      .eq('company_id', userData.company_id)

    if (quotesError) {
      console.error('Error fetching quote creators:', quotesError)
      return NextResponse.json({ error: 'Failed to fetch quote creators' }, { status: 500 })
    }

    // Get unique user IDs
    const uniqueCreatorIds = [...new Set(quoteCreators.map(q => q.created_by).filter(Boolean))]

    if (uniqueCreatorIds.length === 0) {
      return NextResponse.json({ users: [] }, { status: 200 })
    }

    // Get users who have created quotes
    const { data: usersWithQuotes, error } = await supabase
      .from('users')
      .select(`
        id,
        first_name,
        last_name,
        email
      `)
      .in('id', uniqueCreatorIds)

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    return NextResponse.json({ users: usersWithQuotes }, { status: 200 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 