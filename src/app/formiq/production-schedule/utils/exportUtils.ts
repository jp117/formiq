import type { Switchboard, Integration, MiscItem, Component } from '../types'

// Helper function to format date for display
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Helper function to get component status
const getComponentStatus = (components: Component[]) => {
  if (components.length === 0) return 'No Components'
  const receivedCount = components.filter(c => c.received).length
  return `${receivedCount}/${components.length} Received`
}

// Helper function to get item readiness
const isItemReady = (item: Switchboard | Integration | MiscItem) => {
  if (!item.purchase_orders || item.purchase_orders.length === 0) return false
  return item.purchase_orders.every(po => 
    po.components.every(component => component.received)
  )
}

export async function exportProductionScheduleToExcel(
  switchboards: Switchboard[],
  integrations: Integration[],
  miscItems: MiscItem[]
) {
  try {
    // Dynamic import to avoid SSR issues
    const XLSX = await import('xlsx')
    
    // Create workbook
    const workbook = XLSX.utils.book_new()
    
    // === SWITCHBOARDS SHEET ===
    const switchboardData = switchboards.map(sb => ({
      'Type': 'Switchboard',
      'Designation': sb.designation,
      'Sales Order': sb.sales_order_number,
      'Customer': sb.customer,
      'Job Name': sb.job_name || '',
      'NEMA Type': sb.nema_type,
      'Sections': sb.number_of_sections,
      'Dwg Rev': sb.dwg_rev || '',
      'Original Ship Date': formatDate(sb.original_scheduled_ship_date),
      'Current Ship Date': formatDate(sb.current_scheduled_ship_date),
      'Status': sb.completed ? 'Completed' : 'In Progress',
      'Ready to Ship': isItemReady(sb) ? 'Yes' : 'No',
      'Component Status': getComponentStatus(sb.purchase_orders?.flatMap(po => po.components) || []),
      'Job Address': sb.job_address || ''
    }))
    
    // === INTEGRATION SHEET ===
    const integrationData = integrations.map(int => ({
      'Type': 'Integration',
      'Designation': int.designation,
      'Sales Order': int.sales_order_number,
      'Customer': int.customer,
      'Job Name': int.job_name || '',
      'Integration Type': int.type,
      'Dwg Rev': int.dwg_rev || '',
      'Original Ship Date': formatDate(int.original_scheduled_ship_date),
      'Current Ship Date': formatDate(int.current_scheduled_ship_date),
      'Status': int.completed ? 'Completed' : 'In Progress',
      'Ready to Ship': isItemReady(int) ? 'Yes' : 'No',
      'Component Status': getComponentStatus(int.purchase_orders?.flatMap(po => po.components) || []),
      'Job Address': int.job_address || ''
    }))
    
    // === MISC SHEET ===
    const miscData = miscItems.map(misc => ({
      'Type': 'Misc',
      'Description': misc.description,
      'Sales Order': misc.sales_order_number,
      'Customer': misc.customer,
      'Job Name': misc.job_name || '',
      'Quantity': misc.quantity,
      'Dwg Rev': misc.dwg_rev || '',
      'Original Ship Date': formatDate(misc.original_scheduled_ship_date),
      'Current Ship Date': formatDate(misc.current_scheduled_ship_date),
      'Status': misc.completed ? 'Completed' : 'In Progress',
      'Ready to Ship': isItemReady(misc) ? 'Yes' : 'No',
      'Component Status': getComponentStatus(misc.purchase_orders?.flatMap(po => po.components) || []),
      'Job Address': misc.job_address || ''
    }))
    
    // === COMBINED OVERVIEW SHEET ===
    const allItems = [
      ...switchboardData,
      ...integrationData,
      ...miscData
    ].sort((a, b) => new Date(a['Current Ship Date']).getTime() - new Date(b['Current Ship Date']).getTime())
    
    // === DETAILED COMPONENTS SHEET ===
    const componentData: Array<Record<string, string | number>> = []
    
    // Add switchboard components
    switchboards.forEach(sb => {
      sb.purchase_orders?.forEach(po => {
        po.components.forEach(comp => {
          componentData.push({
            'Item Type': 'Switchboard',
            'Item Designation': sb.designation,
            'Sales Order': sb.sales_order_number,
            'Customer': sb.customer,
            'PO Number': po.po_number,
            'Vendor': po.vendor || '',
            'Component Name': comp.component_name,
            'Catalog Number': comp.catalog_number || '',
            'Quantity': comp.quantity,
            'Received': comp.received ? 'Yes' : 'No',
            'Original Ship Date': formatDate(comp.original_scheduled_ship_date),
            'Current Ship Date': formatDate(comp.current_scheduled_ship_date),
            'Notes': comp.notes || ''
          })
        })
      })
    })
    
    // Add integration components
    integrations.forEach(int => {
      int.purchase_orders?.forEach(po => {
        po.components.forEach(comp => {
          componentData.push({
            'Item Type': 'Integration',
            'Item Designation': int.designation,
            'Sales Order': int.sales_order_number,
            'Customer': int.customer,
            'PO Number': po.po_number,
            'Vendor': po.vendor || '',
            'Component Name': comp.component_name,
            'Catalog Number': comp.catalog_number || '',
            'Quantity': comp.quantity,
            'Received': comp.received ? 'Yes' : 'No',
            'Original Ship Date': formatDate(comp.original_scheduled_ship_date),
            'Current Ship Date': formatDate(comp.current_scheduled_ship_date),
            'Notes': comp.notes || ''
          })
        })
      })
    })
    
    // Add misc components
    miscItems.forEach(misc => {
      misc.purchase_orders?.forEach(po => {
        po.components.forEach(comp => {
          componentData.push({
            'Item Type': 'Misc',
            'Item Description': misc.description,
            'Sales Order': misc.sales_order_number,
            'Customer': misc.customer,
            'PO Number': po.po_number,
            'Vendor': po.vendor || '',
            'Component Name': comp.component_name,
            'Catalog Number': comp.catalog_number || '',
            'Quantity': comp.quantity,
            'Received': comp.received ? 'Yes' : 'No',
            'Original Ship Date': formatDate(comp.original_scheduled_ship_date),
            'Current Ship Date': formatDate(comp.current_scheduled_ship_date),
            'Notes': comp.notes || ''
          })
        })
      })
    })
    
    // Create worksheets
    const overviewSheet = XLSX.utils.json_to_sheet(allItems)
    const switchboardSheet = XLSX.utils.json_to_sheet(switchboardData)
    const integrationSheet = XLSX.utils.json_to_sheet(integrationData)
    const miscSheet = XLSX.utils.json_to_sheet(miscData)
    const componentsSheet = XLSX.utils.json_to_sheet(componentData)
    
    // Add sheets to workbook
    XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Overview')
    XLSX.utils.book_append_sheet(workbook, switchboardSheet, 'Switchboards')
    XLSX.utils.book_append_sheet(workbook, integrationSheet, 'Integration')
    XLSX.utils.book_append_sheet(workbook, miscSheet, 'Misc')
    XLSX.utils.book_append_sheet(workbook, componentsSheet, 'Components')
    
    // Auto-size columns for better readability
    const sheets = [overviewSheet, switchboardSheet, integrationSheet, miscSheet, componentsSheet]
    sheets.forEach(sheet => {
      const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1')
      const colWidths: number[] = []
      
      for (let C = range.s.c; C <= range.e.c; C++) {
        let maxWidth = 10
        for (let R = range.s.r; R <= range.e.r; R++) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })
          const cell = sheet[cellAddress]
          if (cell && cell.v) {
            const cellLength = cell.v.toString().length
            maxWidth = Math.max(maxWidth, cellLength)
          }
        }
        colWidths[C] = Math.min(maxWidth + 2, 50) // Cap at 50 characters
      }
      
      sheet['!cols'] = colWidths.map(w => ({ width: w }))
    })
    
    // Generate file name with current date
    const now = new Date()
    const fileName = `Production_Schedule_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.xlsx`
    
    // Download file
    XLSX.writeFile(workbook, fileName)
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    alert('Failed to export spreadsheet. Please try again.')
  }
} 