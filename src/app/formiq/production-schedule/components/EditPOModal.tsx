'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../../../../lib/supabase'

interface Component {
  id: string
  component_name: string
  catalog_number?: string
  quantity: number
  received: boolean
  notes?: string
  original_scheduled_ship_date: string
  current_scheduled_ship_date: string
}

interface PurchaseOrder {
  id: string
  po_number: string
  vendor?: string
  components: Component[]
}

interface EditPOModalProps {
  isOpen: boolean
  onClose: () => void
  purchaseOrder: PurchaseOrder | null
  userAccess: string
  onPOUpdated: () => void
}

export default function EditPOModal({ 
  isOpen, 
  onClose, 
  purchaseOrder,
  userAccess,
  onPOUpdated 
}: EditPOModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    po_number: '',
    vendor: ''
  })
  const [components, setComponents] = useState<Component[]>([])
  const [newComponent, setNewComponent] = useState({
    component_name: '',
    catalog_number: '',
    quantity: 1,
    received: false,
    notes: '',
    original_scheduled_ship_date: '',
    current_scheduled_ship_date: ''
  })

  const supabase = createClient()

  useEffect(() => {
    if (purchaseOrder) {
      setFormData({
        po_number: purchaseOrder.po_number,
        vendor: purchaseOrder.vendor || ''
      })
      setComponents(purchaseOrder.components || [])
    }
  }, [purchaseOrder])

  if (!isOpen || !purchaseOrder) return null

  const handlePOSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('purchase_orders')
        .update({
          po_number: formData.po_number,
          vendor: formData.vendor
        })
        .eq('id', purchaseOrder.id)

      if (error) throw error

      onClose()
      onPOUpdated()
    } catch (error) {
      console.error('Error updating PO:', error)
      alert('Error updating purchase order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddComponent = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from('components')
        .insert([{
          component_name: newComponent.component_name,
          catalog_number: newComponent.catalog_number,
          quantity: newComponent.quantity,
          received: newComponent.received,
          notes: newComponent.notes,
          original_scheduled_ship_date: newComponent.original_scheduled_ship_date,
          current_scheduled_ship_date: newComponent.current_scheduled_ship_date,
          purchase_order_id: purchaseOrder.id
        }])
        .select()

      if (error) throw error

      // Add the new component to local state
      if (data && data[0]) {
        setComponents(prev => [...prev, data[0]])
      }

      // Reset component form
      setNewComponent({
        component_name: '',
        catalog_number: '',
        quantity: 1,
        received: false,
        notes: '',
        original_scheduled_ship_date: '',
        current_scheduled_ship_date: ''
      })
      
    } catch (error) {
      console.error('Error adding component:', error)
      alert('Error adding component. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleComponentUpdate = async (componentId: string, field: string, value: string | boolean) => {
    try {
      const { error } = await supabase
        .from('components')
        .update({ [field]: value })
        .eq('id', componentId)

      if (error) throw error

      // Update local state
      setComponents(prev => prev.map(comp => 
        comp.id === componentId ? { ...comp, [field]: value } : comp
      ))
    } catch (error) {
      console.error('Error updating component:', error)
      alert('Error updating component. Please try again.')
    }
  }

  const handleDeleteComponent = async (componentId: string) => {
    if (confirm('Are you sure you want to delete this component?')) {
      try {
        const { error } = await supabase
          .from('components')
          .delete()
          .eq('id', componentId)

        if (error) throw error

        // Remove component from local state
        setComponents(prev => prev.filter(comp => comp.id !== componentId))
      } catch (error) {
        console.error('Error deleting component:', error)
        alert('Error deleting component. Please try again.')
      }
    }
  }

  const handleDeletePO = async () => {
    if (confirm('Are you sure you want to delete this entire purchase order? This will also delete all components associated with it.')) {
      setIsSubmitting(true)
      try {
        // Delete all components first (if not handled by CASCADE)
        const { error: componentsError } = await supabase
          .from('components')
          .delete()
          .eq('purchase_order_id', purchaseOrder.id)

        if (componentsError) throw componentsError

        // Delete the purchase order
        const { error: poError } = await supabase
          .from('purchase_orders')
          .delete()
          .eq('id', purchaseOrder.id)

        if (poError) throw poError

        onClose()
        onPOUpdated()
      } catch (error) {
        console.error('Error deleting PO:', error)
        alert('Error deleting purchase order. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    return new Date(dateString).toISOString().split('T')[0]
  }

  const getShipDateColorClass = (originalDate: string, currentDate: string) => {
    const original = new Date(originalDate)
    const current = new Date(currentDate)
    
    if (current < original) {
      return 'bg-green-200 text-green-900 font-medium' // Earlier than original - green with very dark text
    } else if (current > original) {
      return 'bg-red-200 text-red-900 font-medium' // Later than original - red with very dark text
    }
    return 'text-gray-900' // Same date - just dark text
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Edit Purchase Order: {purchaseOrder.po_number}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* PO Details Form */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Purchase Order Details</h4>
            <form onSubmit={handlePOSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PO Number *
                </label>
                <input
                  type="text"
                  value={formData.po_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, po_number: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor *
                </label>
                <input
                  type="text"
                  value={formData.vendor}
                  onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Updating...' : 'Update PO Details'}
                </button>
              </div>
            </form>
          </div>

          {/* Components Section */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Components</h4>
            
            {/* Existing Components */}
            <div className="space-y-2 mb-4">
              {components.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-8 gap-2 p-2 bg-gray-50 rounded font-medium text-sm text-gray-700">
                  <div>Description</div>
                  <div>Catalog Number</div>
                  <div>Quantity</div>
                  <div>Received</div>
                  <div>Notes</div>
                  <div>Original Ship Date</div>
                  <div>Current Ship Date</div>
                  <div>Actions</div>
                </div>
              )}
              {components.map((component) => (
                <div key={component.id} className="grid grid-cols-1 md:grid-cols-8 gap-2 p-3 border border-gray-200 rounded-lg">
                  <input
                    type="text"
                    value={component.component_name}
                    onChange={(e) => handleComponentUpdate(component.id, 'component_name', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 placeholder-gray-500"
                    placeholder="Description"
                  />
                  <input
                    type="text"
                    value={component.catalog_number || ''}
                    onChange={(e) => handleComponentUpdate(component.id, 'catalog_number', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 placeholder-gray-500"
                    placeholder="Catalog number"
                  />
                  <input
                    type="number"
                    value={component.quantity}
                    onChange={(e) => handleComponentUpdate(component.id, 'quantity', e.target.value)}
                    min="1"
                    className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 placeholder-gray-500"
                    placeholder="1"
                  />
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={component.received}
                      onChange={(e) => handleComponentUpdate(component.id, 'received', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <input
                    type="text"
                    value={component.notes || ''}
                    onChange={(e) => handleComponentUpdate(component.id, 'notes', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 placeholder-gray-500"
                    placeholder="Notes"
                  />
                  <input
                    type="date"
                    value={formatDate(component.original_scheduled_ship_date)}
                    onChange={(e) => handleComponentUpdate(component.id, 'original_scheduled_ship_date', e.target.value)}
                    disabled={userAccess !== 'admin_access'}
                    className={`px-2 py-1 border border-gray-300 rounded text-sm ${
                      userAccess === 'admin_access' 
                        ? 'text-gray-900' 
                        : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    }`}
                  />
                  <input
                    type="date"
                    value={formatDate(component.current_scheduled_ship_date)}
                    onChange={(e) => handleComponentUpdate(component.id, 'current_scheduled_ship_date', e.target.value)}
                    className={`px-2 py-1 border border-gray-300 rounded text-sm ${getShipDateColorClass(component.original_scheduled_ship_date, component.current_scheduled_ship_date)}`}
                  />
                  <button
                    onClick={() => handleDeleteComponent(component.id)}
                    className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Component */}
            <form onSubmit={handleAddComponent} className="border-t pt-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Add New Component</h5>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description *</label>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Catalog Number</label>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Quantity *</label>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Received</label>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Original Ship Date *
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Current Ship Date *</label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                <input
                  type="text"
                  value={newComponent.component_name}
                  onChange={(e) => setNewComponent(prev => ({ ...prev, component_name: e.target.value }))}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="Description"
                />
                <input
                  type="text"
                  value={newComponent.catalog_number}
                  onChange={(e) => setNewComponent(prev => ({ ...prev, catalog_number: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="Catalog number"
                />
                <input
                  type="number"
                  value={newComponent.quantity}
                  onChange={(e) => setNewComponent(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                  required
                  min="1"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="1"
                />
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={newComponent.received}
                    onChange={(e) => setNewComponent(prev => ({ ...prev, received: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <input
                  type="text"
                  value={newComponent.notes}
                  onChange={(e) => setNewComponent(prev => ({ ...prev, notes: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="Notes"
                />
                <input
                  type="date"
                  value={newComponent.original_scheduled_ship_date}
                  onChange={(e) => setNewComponent(prev => ({ ...prev, original_scheduled_ship_date: e.target.value }))}
                  required
                  disabled={userAccess === 'view_access'}
                  className={`px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    userAccess === 'view_access'
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'text-gray-900'
                  }`}
                />
                <input
                  type="date"
                  value={newComponent.current_scheduled_ship_date}
                  onChange={(e) => setNewComponent(prev => ({ ...prev, current_scheduled_ship_date: e.target.value }))}
                  required
                  className={`px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    newComponent.original_scheduled_ship_date && newComponent.current_scheduled_ship_date
                      ? getShipDateColorClass(newComponent.original_scheduled_ship_date, newComponent.current_scheduled_ship_date)
                      : 'text-gray-900'
                  }`}
                />
              </div>
              <div className="mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  Add Component
                </button>
              </div>
            </form>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <button
              onClick={handleDeletePO}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              Delete PO
            </button>
            <button
              onClick={() => {
                onClose()
                onPOUpdated()
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 