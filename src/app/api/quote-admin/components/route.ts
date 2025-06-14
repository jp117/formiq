import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../../../lib/supabase-server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin or quote admin
    const { data: userData } = await supabase
      .from('users')
      .select('is_admin, is_quote_admin')
      .eq('id', user.id)
      .single()

    if (!userData?.is_admin && !userData?.is_quote_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { type, vendor, catalog_number, description, cost } = await request.json()

    // Validate required fields
    if (!type || !vendor || !catalog_number || !description || cost === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('quote_components')
      .insert({
        type,
        vendor,
        catalog_number,
        description,
        cost
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating component:', error)
      return NextResponse.json({ error: 'Failed to create component' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in POST /api/quote-admin/components:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin or quote admin
    const { data: userData } = await supabase
      .from('users')
      .select('is_admin, is_quote_admin')
      .eq('id', user.id)
      .single()

    if (!userData?.is_admin && !userData?.is_quote_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id, updates } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Component ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('quote_components')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating component:', error)
      return NextResponse.json({ error: 'Failed to update component' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in PATCH /api/quote-admin/components:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin or quote admin
    const { data: userData } = await supabase
      .from('users')
      .select('is_admin, is_quote_admin')
      .eq('id', user.id)
      .single()

    if (!userData?.is_admin && !userData?.is_quote_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Component ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('quote_components')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting component:', error)
      return NextResponse.json({ error: 'Failed to delete component' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/quote-admin/components:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 