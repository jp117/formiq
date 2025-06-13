'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface QuoteComponent {
  id: string
  component_name: string
  description: string | null
  unit_price: number
  markup_percentage: number
  discount_percentage: number
  created_at: string
}

interface QuoteComponentsManagerProps {
  components: QuoteComponent[]
}

export default function QuoteComponentsManager({ components }: QuoteComponentsManagerProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newComponent, setNewComponent] = useState<Partial<QuoteComponent>>({
    component_name: '',
    description: '',
    unit_price: 0,
    markup_percentage: 0,
    discount_percentage: 0
  })

  const handleAddComponent = async () => {
    setLoading('add')
    try {
      const response = await fetch('/api/admin/quote-components', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComponent),
      })

      if (!response.ok) {
        throw new Error('Failed to add component')
      }

      // Reset form and refresh data
      setNewComponent({
        component_name: '',
        description: '',
        unit_price: 0,
        markup_percentage: 0,
        discount_percentage: 0
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

  const handleUpdateComponent = async (componentId: string, updates: Partial<QuoteComponent>) => {
    setLoading(componentId)
    try {
      const response = await fetch('/api/admin/quote-components', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ componentId, updates }),
      })

      if (!response.ok) {
        throw new Error('Failed to update component')
      }

      router.refresh()
    } catch (error) {
      console.error('Error updating component:', error)
      alert('Failed to update component. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const handleDeleteComponent = async (componentId: string) => {
    if (!confirm('Are you sure you want to delete this component? This action cannot be undone.')) {
      return
    }

    setLoading(componentId)
    try {
      const response = await fetch('/api/admin/quote-components', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ componentId }),
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

  return (
    <div className="space-y-6">
      {/* Add Component Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Component
        </button>
      </div>

      {/* Add Component Form */}
      {isAdding && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Component</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="component_name" className="block text-sm font-medium text-gray-700">
                Component Name
              </label>
              <input
                type="text"
                id="component_name"
                value={newComponent.component_name}
                onChange={(e) => setNewComponent({ ...newComponent, component_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={newComponent.description || ''}
                onChange={(e) => setNewComponent({ ...newComponent, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="unit_price" className="block text-sm font-medium text-gray-700">
                  Unit Price
                </label>
                <input
                  type="number"
                  id="unit_price"
                  value={newComponent.unit_price}
                  onChange={(e) => setNewComponent({ ...newComponent, unit_price: parseFloat(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label htmlFor="markup_percentage" className="block text-sm font-medium text-gray-700">
                  Markup Percentage
                </label>
                <input
                  type="number"
                  id="markup_percentage"
                  value={newComponent.markup_percentage}
                  onChange={(e) => setNewComponent({ ...newComponent, markup_percentage: parseFloat(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label htmlFor="discount_percentage" className="block text-sm font-medium text-gray-700">
                  Discount Percentage
                </label>
                <input
                  type="number"
                  id="discount_percentage"
                  value={newComponent.discount_percentage}
                  onChange={(e) => setNewComponent({ ...newComponent, discount_percentage: parseFloat(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAddComponent}
                disabled={loading === 'add'}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === 'add' ? 'Adding...' : 'Add Component'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Components Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quote Components</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Component Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Markup %
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount %
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {components.map((component) => (
                <tr key={component.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{component.component_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{component.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">${component.unit_price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">{component.markup_percentage.toFixed(2)}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">{component.discount_percentage.toFixed(2)}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleUpdateComponent(component.id, { ...component })}
                        disabled={loading === component.id}
                        className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComponent(component.id)}
                        disabled={loading === component.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 