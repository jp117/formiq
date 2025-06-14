'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface QuoteComponent {
  id: string
  type: string
  vendor: string
  catalog_number: string
  description: string
  cost: number
  created_at: string
  updated_at: string
}

interface QuoteComponentsManagerProps {
  components: QuoteComponent[]
}

export default function QuoteComponentsManager({ components }: QuoteComponentsManagerProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [newComponent, setNewComponent] = useState<Partial<QuoteComponent>>({
    type: '',
    vendor: '',
    catalog_number: '',
    description: '',
    cost: 0
  })

  // Get unique types for tabs
  const types = ['all', ...new Set(components.map(c => c.type))]

  const handleAddComponent = async () => {
    setLoading('new')
    try {
      const response = await fetch('/api/quote-admin/components', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComponent),
      })

      if (!response.ok) {
        throw new Error('Failed to add component')
      }

      // Reset form and refresh
      setNewComponent({
        type: '',
        vendor: '',
        catalog_number: '',
        description: '',
        cost: 0
      })
      setIsAdding(false)
      router.refresh()
    } catch (error) {
      console.error('Error adding component:', error)
      alert('Failed to add component. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const handleDeleteComponent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this component? This action cannot be undone.')) {
      return
    }

    setLoading(id)
    try {
      const response = await fetch('/api/quote-admin/components', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete component')
      }

      router.refresh()
    } catch (error) {
      console.error('Error deleting component:', error)
      alert('Failed to delete component. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  // Filter components by selected type
  const filteredComponents = selectedType === 'all' 
    ? components 
    : components.filter(c => c.type === selectedType)

  return (
    <div className="space-y-6">
      {/* Type Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4 overflow-x-auto">
          {types.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                selectedType === type
                  ? 'bg-slate-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type === 'all' ? 'All Types' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Add Component Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsAdding(true)}
          className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
        >
          Add Component
        </button>
      </div>

      {/* Add Component Form */}
      {isAdding && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Component</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <input
                type="text"
                value={newComponent.type}
                onChange={(e) => setNewComponent({ ...newComponent, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="e.g., ABB Switches"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
              <input
                type="text"
                value={newComponent.vendor}
                onChange={(e) => setNewComponent({ ...newComponent, vendor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="e.g., ABB"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catalog Number</label>
              <input
                type="text"
                value={newComponent.catalog_number}
                onChange={(e) => setNewComponent({ ...newComponent, catalog_number: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="e.g., S201-C16"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={newComponent.description}
                onChange={(e) => setNewComponent({ ...newComponent, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="e.g., 16A Circuit Breaker"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
              <input
                type="number"
                step="0.01"
                value={newComponent.cost}
                onChange={(e) => setNewComponent({ ...newComponent, cost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddComponent}
              disabled={loading === 'new'}
              className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              {loading === 'new' ? 'Adding...' : 'Add Component'}
            </button>
          </div>
        </div>
      )}

      {/* Components Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catalog Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredComponents.map((component) => (
                <tr key={component.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {component.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {component.vendor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {component.catalog_number}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {component.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    ${component.cost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      onClick={() => handleDeleteComponent(component.id)}
                      disabled={loading === component.id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredComponents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No components found for the selected type.
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 