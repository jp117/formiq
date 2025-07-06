import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../../lib/supabase-server'

export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json()
    const { quoteName, dueDate, notes, domesticRequirements, wbeRequirements } = body

    // Validate required fields
    if (!quoteName || !quoteName.trim()) {
      return NextResponse.json({ error: 'Quote name is required' }, { status: 400 })
    }

    if (!domesticRequirements || !['yes', 'no'].includes(domesticRequirements)) {
      return NextResponse.json({ error: 'Domestic requirements selection is required' }, { status: 400 })
    }

    if (!wbeRequirements || !['yes', 'no'].includes(wbeRequirements)) {
      return NextResponse.json({ error: 'WBE requirements selection is required' }, { status: 400 })
    }

    // Insert the quote into the database
    const { data: quote, error } = await supabase
      .from('quotes')
      .insert({
        company_id: userData.company_id,
        quote_name: quoteName.trim(),
        due_date: dueDate || null,
        notes: notes || null,
        domestic_requirements: domesticRequirements,
        wbe_requirements: wbeRequirements,
        status: 'draft',
        total_amount: 0,
        created_by: user.id
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating quote:', error)
      return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      quote: {
        id: quote.id,
        quote_number: quote.quote_number,
        quote_name: quote.quote_name,
        due_date: quote.due_date,
        domestic_requirements: quote.domestic_requirements,
        wbe_requirements: quote.wbe_requirements,
        status: quote.status,
        created_at: quote.created_at
      }
    }, { status: 201 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const createdBy = searchParams.get('created_by')
    const groupByUser = searchParams.get('group_by_user') === 'true'

    // Build the query
    let query = supabase
      .from('quotes')
      .select(`
        id,
        quote_number,
        quote_name,
        due_date,
        status,
        total_amount,
        notes,
        domestic_requirements,
        wbe_requirements,
        created_at,
        updated_at,
        created_by,
        creator:users!created_by(
          id,
          first_name,
          last_name,
          email
        )
      `)
      .eq('company_id', userData.company_id)

    // Filter by creator if specified
    if (createdBy) {
      query = query.eq('created_by', createdBy)
    }

    // Order by creation date
    query = query.order('created_at', { ascending: false })

    const { data: quotes, error } = await query

    if (error) {
      console.error('Error fetching quotes:', error)
      return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 })
    }

    // If grouping by user, organize quotes by creator
    if (groupByUser) {
      const groupedQuotes = quotes.reduce((acc, quote) => {
        const creatorId = quote.created_by
        if (!acc[creatorId]) {
          acc[creatorId] = {
            creator: quote.creator,
            quotes: []
          }
        }
        acc[creatorId].quotes.push(quote)
        return acc
      }, {} as Record<string, { creator: unknown, quotes: unknown[] }>)

      return NextResponse.json({ quotesGroupedByUser: groupedQuotes }, { status: 200 })
    }

    return NextResponse.json({ quotes }, { status: 200 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 