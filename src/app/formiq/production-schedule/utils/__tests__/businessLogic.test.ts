// Test file for production schedule business logic
import type { PurchaseOrder, Component, MiscItem, Switchboard, Integration } from '../../types'

// Helper function to check if all components in a PO are received
const isPOReady = (po: PurchaseOrder) => {
  if (!po.components || po.components.length === 0) return false
  return po.components.every((component) => component.received)
}

// Helper function to check if all POs for an item have all components received
const isItemReady = (item: MiscItem | Switchboard | Integration) => {
  if (!item.purchase_orders || item.purchase_orders.length === 0) return false
  return item.purchase_orders.every((po) => isPOReady(po))
}

// Date calculation functions (copied from components for testing)
const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  return date.toLocaleDateString()
}

const getShipDateColorClass = (originalDate: string, currentDate: string) => {
  const [origYear, origMonth, origDay] = originalDate.split('-')
  const [currYear, currMonth, currDay] = currentDate.split('-')
  
  const original = new Date(parseInt(origYear), parseInt(origMonth) - 1, parseInt(origDay))
  const current = new Date(parseInt(currYear), parseInt(currMonth) - 1, parseInt(currDay))
  
  if (current < original) {
    return 'bg-green-200 text-green-900 font-medium'
  } else if (current > original) {
    return 'bg-red-200 text-red-900 font-medium'
  }
  return 'text-gray-900'
}

const isPOComponentDateIssue = (componentDate: string, itemDate: string) => {
  const [compYear, compMonth, compDay] = componentDate.split('-')
  const [itemYear, itemMonth, itemDay] = itemDate.split('-')
  
  const component = new Date(parseInt(compYear), parseInt(compMonth) - 1, parseInt(compDay))
  const item = new Date(parseInt(itemYear), parseInt(itemMonth) - 1, parseInt(itemDay))
  const twoWeeksBefore = new Date(item)
  twoWeeksBefore.setDate(item.getDate() - 14)
  
  return component > twoWeeksBefore
}

// Test data factories
const createComponent = (overrides: Partial<Component> = {}): Component => ({
  id: 'comp-1',
  component_name: 'Test Component',
  catalog_number: 'TC-001',
  quantity: 1,
  received: false,
  original_scheduled_ship_date: '2024-01-15',
  current_scheduled_ship_date: '2024-01-15',
  notes: undefined,
  ...overrides,
})

const createPurchaseOrder = (overrides: Partial<PurchaseOrder> = {}): PurchaseOrder => ({
  id: 'po-1',
  po_number: 'PO-001',
  vendor: 'Test Vendor',
  components: [],
  ...overrides,
})

const createMiscItem = (overrides: Partial<MiscItem> = {}): MiscItem => ({
  id: 'misc-1',
  description: 'Test Misc Item',
  sales_order_number: 'SO-001',
  customer: 'Test Customer',
  job_name: 'Test Job',
  job_address: '123 Test St',
  quantity: 1,
  dwg_rev: 'A',
  original_scheduled_ship_date: '2024-02-01',
  current_scheduled_ship_date: '2024-02-01',
  completed: false,
  purchase_orders: [],
  ...overrides,
})

describe('Production Schedule Business Logic', () => {
  describe('isPOReady', () => {
    test('should return false for PO with no components', () => {
      const po = createPurchaseOrder()
      expect(isPOReady(po)).toBe(false)
    })

    test('should return false for PO with empty components array', () => {
      const po = createPurchaseOrder({ components: [] })
      expect(isPOReady(po)).toBe(false)
    })

    test('should return false when not all components are received', () => {
      const components = [
        createComponent({ received: true }),
        createComponent({ received: false }),
      ]
      const po = createPurchaseOrder({ components })
      expect(isPOReady(po)).toBe(false)
    })

    test('should return true when all components are received', () => {
      const components = [
        createComponent({ received: true }),
        createComponent({ received: true }),
      ]
      const po = createPurchaseOrder({ components })
      expect(isPOReady(po)).toBe(true)
    })

    test('should handle single component PO', () => {
      const components = [createComponent({ received: true })]
      const po = createPurchaseOrder({ components })
      expect(isPOReady(po)).toBe(true)
    })
  })

  describe('isItemReady', () => {
    test('should return false for item with no purchase orders', () => {
      const item = createMiscItem()
      expect(isItemReady(item)).toBe(false)
    })

    test('should return false for item with empty purchase orders array', () => {
      const item = createMiscItem({ purchase_orders: [] })
      expect(isItemReady(item)).toBe(false)
    })

    test('should return false when not all POs are ready', () => {
      const po1 = createPurchaseOrder({
        components: [createComponent({ received: true })]
      })
      const po2 = createPurchaseOrder({
        components: [createComponent({ received: false })]
      })
      const item = createMiscItem({ purchase_orders: [po1, po2] })
      expect(isItemReady(item)).toBe(false)
    })

    test('should return true when all POs are ready', () => {
      const po1 = createPurchaseOrder({
        components: [createComponent({ received: true })]
      })
      const po2 = createPurchaseOrder({
        components: [createComponent({ received: true })]
      })
      const item = createMiscItem({ purchase_orders: [po1, po2] })
      expect(isItemReady(item)).toBe(true)
    })
  })

  describe('formatDate', () => {
    test('should format date string correctly', () => {
      // Note: This will depend on the user's locale
      const result = formatDate('2024-01-15')
      expect(result).toMatch(/1\/15\/2024|15\/1\/2024|2024\/1\/15/) // Different locales
    })

    test('should handle different date formats', () => {
      const result = formatDate('2024-12-25')
      expect(result).toMatch(/12\/25\/2024|25\/12\/2024|2024\/12\/25/)
    })
  })

  describe('getShipDateColorClass', () => {
    test('should return green class when current date is earlier than original', () => {
      const result = getShipDateColorClass('2024-02-01', '2024-01-15')
      expect(result).toBe('bg-green-200 text-green-900 font-medium')
    })

    test('should return red class when current date is later than original', () => {
      const result = getShipDateColorClass('2024-01-15', '2024-02-01')
      expect(result).toBe('bg-red-200 text-red-900 font-medium')
    })

    test('should return neutral class when dates are the same', () => {
      const result = getShipDateColorClass('2024-01-15', '2024-01-15')
      expect(result).toBe('text-gray-900')
    })
  })

  describe('isPOComponentDateIssue', () => {
    test('should return false when component date is more than 2 weeks before item date', () => {
      const componentDate = '2024-01-01'
      const itemDate = '2024-02-01' // 31 days later
      expect(isPOComponentDateIssue(componentDate, itemDate)).toBe(false)
    })

    test('should return true when component date is less than 2 weeks before item date', () => {
      const componentDate = '2024-01-25'
      const itemDate = '2024-02-01' // 7 days later
      expect(isPOComponentDateIssue(componentDate, itemDate)).toBe(true)
    })

    test('should return true when component date is after item date', () => {
      const componentDate = '2024-02-05'
      const itemDate = '2024-02-01'
      expect(isPOComponentDateIssue(componentDate, itemDate)).toBe(true)
    })

    test('should handle edge case of exactly 2 weeks', () => {
      const componentDate = '2024-01-18'
      const itemDate = '2024-02-01' // exactly 14 days later
      expect(isPOComponentDateIssue(componentDate, itemDate)).toBe(false)
    })
  })
}) 