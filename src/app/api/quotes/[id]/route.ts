import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../../../lib/supabase-server'

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
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

    // Check if user has edit access
    if (!userData.quotes_access || !['edit_access', 'admin_access'].includes(userData.quotes_access)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Parse request body
    const body = await request.json()
    const { quote_name, due_date, notes, domestic_requirements, wbe_requirements } = body

    // Validate required fields
    if (!quote_name || !quote_name.trim()) {
      return NextResponse.json({ error: 'Quote name is required' }, { status: 400 })
    }

    if (!domestic_requirements || !['yes', 'no'].includes(domestic_requirements)) {
      return NextResponse.json({ error: 'Domestic requirements selection is required' }, { status: 400 })
    }

    if (!wbe_requirements || !['yes', 'no'].includes(wbe_requirements)) {
      return NextResponse.json({ error: 'WBE requirements selection is required' }, { status: 400 })
    }

    // Verify quote belongs to user's company and update it
    const { data: quote, error } = await supabase
      .from('quotes')
      .update({
        quote_name: quote_name.trim(),
        due_date: due_date || null,
        notes: notes || null,
        domestic_requirements,
        wbe_requirements,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('company_id', userData.company_id)
      .select()
      .single()

    if (error) {
      console.error('Error updating quote:', error)
      return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 })
    }

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      quote: {
        id: quote.id,
        quote_number: quote.quote_number,
        quote_name: quote.quote_name,
        due_date: quote.due_date,
        notes: quote.notes,
        domestic_requirements: quote.domestic_requirements,
        wbe_requirements: quote.wbe_requirements,
        status: quote.status,
        updated_at: quote.updated_at
      }
    }, { status: 200 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 