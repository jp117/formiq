import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../../../lib/supabase-server'

interface CustomComponent {
  component_id: string
  quantity: number
  is_optional: boolean
  notes: string
}

interface SwitchboardConfiguration {
  name: string
  description: string
  designation: string
  nema_type: string
  number_of_sections: number
  quantity: number
  notes: string
  configuration_method: 'assembly' | 'custom'
  selected_assembly_id: string | null
  custom_components: CustomComponent[]
}

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
    const { quote_id, configuration, total_cost }: {
      quote_id: string
      configuration: SwitchboardConfiguration
      total_cost: number
    } = body

    // Validate required fields
    if (!quote_id || !configuration) {
      return NextResponse.json({ error: 'Quote ID and configuration are required' }, { status: 400 })
    }

    // Verify quote exists and belongs to user's company
    const { data: quote } = await supabase
      .from('quotes')
      .select('id, company_id')
      .eq('id', quote_id)
      .eq('company_id', userData.company_id)
      .single()

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Start a transaction to save the switchboard configuration
    if (configuration.configuration_method === 'assembly' && configuration.selected_assembly_id) {
      // Save as a quote assembly
      const { data: quoteAssembly, error: assemblyError } = await supabase
        .from('quote_assemblies')
        .insert({
          quote_id: quote_id,
          assembly_id: configuration.selected_assembly_id,
          quantity: configuration.quantity,
          custom_name: configuration.name !== '' ? configuration.name : null,
          notes: configuration.notes || null
        })
        .select()
        .single()

      if (assemblyError) {
        console.error('Error creating quote assembly:', assemblyError)
        return NextResponse.json({ error: 'Failed to save assembly configuration' }, { status: 500 })
      }

      // Update quote total
      const { error: updateError } = await supabase
        .from('quotes')
        .update({
          total_amount: total_cost,
          updated_at: new Date().toISOString()
        })
        .eq('id', quote_id)

      if (updateError) {
        console.error('Error updating quote total:', updateError)
        return NextResponse.json({ error: 'Failed to update quote total' }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        assembly: quoteAssembly,
        message: 'Switchboard assembly added to quote successfully'
      }, { status: 201 })

    } else if (configuration.configuration_method === 'custom') {
      // Get all components for calculation
      const { data: componentData } = await supabase
        .from('quote_components')
        .select('*')
        .in('id', configuration.custom_components.map((cc: CustomComponent) => cc.component_id))

      if (!componentData) {
        return NextResponse.json({ error: 'Failed to fetch component data' }, { status: 500 })
      }

      // Calculate components with proper pricing
      const componentsWithPricing = configuration.custom_components.map((cc: CustomComponent) => {
        const component = componentData.find(c => c.id === cc.component_id)
        if (!component) {
          throw new Error(`Component with ID ${cc.component_id} not found`)
        }
        
        return {
          quote_id: quote_id,
          component_name: `${configuration.name} - ${component.description}`,
          description: `${component.vendor} ${component.catalog_number} - ${component.description}`,
          quantity: cc.quantity,
          unit_price: component.cost,
          total_price: component.cost * cc.quantity,
          notes: cc.notes || null,
          switchboard_name: configuration.name,
          switchboard_designation: configuration.designation,
          switchboard_nema_type: configuration.nema_type,
          switchboard_sections: configuration.number_of_sections
        }
      })

      const { error: componentsError } = await supabase
        .from('quote_line_items')
        .insert(componentsWithPricing)

      if (componentsError) {
        console.error('Error creating quote line items:', componentsError)
        return NextResponse.json({ error: 'Failed to save custom configuration' }, { status: 500 })
      }

      // Update quote total
      const { error: updateError } = await supabase
        .from('quotes')
        .update({
          total_amount: total_cost,
          updated_at: new Date().toISOString()
        })
        .eq('id', quote_id)

      if (updateError) {
        console.error('Error updating quote total:', updateError)
        return NextResponse.json({ error: 'Failed to update quote total' }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Custom switchboard configuration added to quote successfully'
      }, { status: 201 })
    }

    return NextResponse.json({ error: 'Invalid configuration method' }, { status: 400 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 