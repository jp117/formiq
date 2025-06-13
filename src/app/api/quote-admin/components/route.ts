import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../../../lib/supabase-server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check if user is authenticated and is admin or quote admin
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is admin or quote admin
    const { data: adminUser } = await supabase
      .from('users')
      .select('is_admin, is_quote_admin, is_approved')
      .eq('id', user.id)
      .single()

    if ((!adminUser?.is_admin && !adminUser?.is_quote_admin) || !adminUser?.is_approved) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const component = await request.json()

    // Validate required fields
    if (!component.type || !component.vendor || !component.catalog_number || 
        !component.description || component.cost === undefined || component.sell_price === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Insert the component
    const { data, error } = await supabase
      .from('quote_components')
      .insert([component])
      .select()
      .single()

    if (error) {
      console.error('Error inserting component:', error)
      return NextResponse.json({ error: 'Failed to insert component' }, { status: 500 })
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
    
    // Check if user is authenticated and is admin or quote admin
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is admin or quote admin
    const { data: adminUser } = await supabase
      .from('users')
      .select('is_admin, is_quote_admin, is_approved')
      .eq('id', user.id)
      .single()

    if ((!adminUser?.is_admin && !adminUser?.is_quote_admin) || !adminUser?.is_approved) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id, updates } = await request.json()

    if (!id || !updates) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Update the component
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
    
    // Check if user is authenticated and is admin or quote admin
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is admin or quote admin
    const { data: adminUser } = await supabase
      .from('users')
      .select('is_admin, is_quote_admin, is_approved')
      .eq('id', user.id)
      .single()

    if ((!adminUser?.is_admin && !adminUser?.is_quote_admin) || !adminUser?.is_approved) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing component ID' }, { status: 400 })
    }

    // Delete the component
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