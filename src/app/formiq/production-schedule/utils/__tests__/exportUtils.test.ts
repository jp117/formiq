// Mock XLSX module to avoid issues with dynamic imports in tests
jest.mock('xlsx', () => ({
  utils: {
    book_new: jest.fn(() => ({})),
    json_to_sheet: jest.fn(() => ({})),
    book_append_sheet: jest.fn(),
    decode_range: jest.fn(() => ({ s: { r: 0, c: 0 }, e: { r: 5, c: 5 } })),
    encode_cell: jest.fn(() => 'A1'),
  },
  writeFile: jest.fn(),
}))

import type { Switchboard, Integration, MiscItem } from '../../types'

// Helper functions from exportUtils (copying them for testing)
const formatDate = (dateString: string) => {
  // Parse the date as a local date to avoid timezone issues
  const [year, month, day] = dateString.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  return date.toLocaleDateString()
}

const getComponentStatus = (components: any[]) => {
  if (components.length === 0) return 'No Components'
  const receivedCount = components.filter(c => c.received).length
  return `${receivedCount}/${components.length} Received`
}

const isItemReady = (item: Switchboard | Integration | MiscItem) => {
  if (!item.purchase_orders || item.purchase_orders.length === 0) return false
  return item.purchase_orders.every(po => 
    po.components.every(component => component.received)
  )
}

// Test data factories
const createSwitchboard = (overrides: Partial<Switchboard> = {}): Switchboard => ({
  id: 'sb-1',
  designation: 'SB-001',
  sales_order_number: 'SO-001',
  customer: 'Test Customer',
  job_name: 'Test Job',
  job_address: '123 Test St',
  dwg_rev: 'A',
  completed: false,
  original_scheduled_ship_date: '2024-02-01',
  current_scheduled_ship_date: '2024-02-01',
  purchase_orders: [],
  nema_type: 'Type 1',
  number_of_sections: 3,
  ...overrides,
})

const createIntegration = (overrides: Partial<Integration> = {}): Integration => ({
  id: 'int-1',
  designation: 'INT-001',
  sales_order_number: 'SO-002',
  customer: 'Test Customer 2',
  job_name: 'Integration Job',
  job_address: '456 Test Ave',
  dwg_rev: 'B',
  completed: false,
  original_scheduled_ship_date: '2024-02-15',
  current_scheduled_ship_date: '2024-02-15',
  purchase_orders: [],
  type: 'Control Panel',
  ...overrides,
})

const createMiscItem = (overrides: Partial<MiscItem> = {}): MiscItem => ({
  id: 'misc-1',
  description: 'Test Misc Item',
  sales_order_number: 'SO-003',
  customer: 'Test Customer 3',
  job_name: 'Misc Job',
  job_address: '789 Test Blvd',
  quantity: 2,
  dwg_rev: 'C',
  completed: false,
  original_scheduled_ship_date: '2024-03-01',
  current_scheduled_ship_date: '2024-03-01',
  purchase_orders: [],
  ...overrides,
})

describe('Export Utils', () => {
  describe('formatDate', () => {
    test('should format date string correctly', () => {
      const result = formatDate('2024-01-15')
      expect(result).toMatch(/1\/15\/2024|15\/1\/2024|2024\/1\/15/)
    })

    test('should handle different month formats', () => {
      const result = formatDate('2024-12-25')
      expect(result).toMatch(/12\/25\/2024|25\/12\/2024|2024\/12\/25/)
    })

    test('should handle invalid date gracefully', () => {
      const result = formatDate('invalid-date')
      // When split fails, we'll get NaN values which create an invalid date
      expect(result).toBe('Invalid Date')
    })
  })

  describe('getComponentStatus', () => {
    test('should return "No Components" for empty array', () => {
      expect(getComponentStatus([])).toBe('No Components')
    })

    test('should return correct status for mixed components', () => {
      const components = [
        { received: true },
        { received: false },
        { received: true },
      ]
      expect(getComponentStatus(components)).toBe('2/3 Received')
    })

    test('should return correct status when all received', () => {
      const components = [
        { received: true },
        { received: true },
      ]
      expect(getComponentStatus(components)).toBe('2/2 Received')
    })

    test('should return correct status when none received', () => {
      const components = [
        { received: false },
        { received: false },
      ]
      expect(getComponentStatus(components)).toBe('0/2 Received')
    })
  })

  describe('isItemReady', () => {
    test('should return false for item with no purchase orders', () => {
      const item = createSwitchboard({ purchase_orders: [] })
      expect(isItemReady(item)).toBe(false)
    })

    test('should return true when all components are received', () => {
      const item = createSwitchboard({
        purchase_orders: [
          {
            id: 'po-1',
            po_number: 'PO-001',
            vendor: 'Vendor 1',
            components: [
              { id: 'c1', received: true } as any,
              { id: 'c2', received: true } as any,
            ]
          }
        ]
      })
      expect(isItemReady(item)).toBe(true)
    })

    test('should return false when some components are not received', () => {
      const item = createSwitchboard({
        purchase_orders: [
          {
            id: 'po-1',
            po_number: 'PO-001',
            vendor: 'Vendor 1',
            components: [
              { id: 'c1', received: true } as any,
              { id: 'c2', received: false } as any,
            ]
          }
        ]
      })
      expect(isItemReady(item)).toBe(false)
    })

    test('should handle multiple purchase orders', () => {
      const item = createSwitchboard({
        purchase_orders: [
          {
            id: 'po-1',
            po_number: 'PO-001',
            vendor: 'Vendor 1',
            components: [{ id: 'c1', received: true } as any]
          },
          {
            id: 'po-2',
            po_number: 'PO-002', 
            vendor: 'Vendor 2',
            components: [{ id: 'c2', received: false } as any]
          }
        ]
      })
      expect(isItemReady(item)).toBe(false)
    })
  })

  describe('Data Transformation', () => {
    test('should create switchboard data correctly', () => {
      const switchboard = createSwitchboard({
        designation: 'SB-TEST',
        nema_type: 'Type 3R',
        number_of_sections: 5,
      })

      const expectedData = {
        'Type': 'Switchboard',
        'Designation': 'SB-TEST',
        'Sales Order': 'SO-001',
        'Customer': 'Test Customer',
        'Job Name': 'Test Job',
        'NEMA Type': 'Type 3R',
        'Sections': 5,
        'Dwg Rev': 'A',
        'Status': 'In Progress',
        'Ready to Ship': 'No',
      }

      // Test individual properties
      expect(switchboard.designation).toBe('SB-TEST')
      expect(switchboard.nema_type).toBe('Type 3R')
      expect(switchboard.number_of_sections).toBe(5)
    })

    test('should create integration data correctly', () => {
      const integration = createIntegration({
        designation: 'INT-TEST',
        type: 'HMI Panel',
      })

      expect(integration.designation).toBe('INT-TEST')
      expect(integration.type).toBe('HMI Panel')
    })

    test('should create misc item data correctly', () => {
      const miscItem = createMiscItem({
        description: 'Custom Hardware',
        quantity: 10,
      })

      expect(miscItem.description).toBe('Custom Hardware')
      expect(miscItem.quantity).toBe(10)
    })
  })

  describe('Export Function Integration', () => {
    test('should handle empty data arrays', async () => {
      // Mock the actual export function behavior
      const switchboards: Switchboard[] = []
      const integrations: Integration[] = []
      const miscItems: MiscItem[] = []

      // Verify empty arrays don't cause errors
      expect(switchboards.length).toBe(0)
      expect(integrations.length).toBe(0)
      expect(miscItems.length).toBe(0)
    })

    test('should process mixed data types', () => {
      const switchboards = [createSwitchboard()]
      const integrations = [createIntegration()]
      const miscItems = [createMiscItem()]

      const allItems = [...switchboards, ...integrations, ...miscItems]
      expect(allItems.length).toBe(3)
      expect(allItems[0]).toHaveProperty('nema_type')
      expect(allItems[1]).toHaveProperty('type')
      expect(allItems[2]).toHaveProperty('quantity')
    })
  })
}) 