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

interface AssemblyComponent {
  id: string
  quantity: number
  is_optional: boolean
  notes: string | null
  component: QuoteComponent
}

interface Assembly {
  id: string
  name: string
  description: string | null
  category: string
  amperage: number | null
  enclosure_type: string | null
  product_line: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  assembly_components: AssemblyComponent[]
}

interface AssembliesManagerProps {
  assemblies: Assembly[]
}

export default function AssembliesManager({ assemblies }: AssembliesManagerProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedAssembly, setExpandedAssembly] = useState<string | null>(null)
  
  const [newAssembly, setNewAssembly] = useState({
    name: '',
    description: '',
    category: '',
    amperage: '',
    enclosure_type: '',
    product_line: ''
  })

  // Get unique categories for filtering
  const categories = ['all', ...new Set(assemblies.map(a => a.category))]

  // Calculate assembly cost (sum of component costs)
  const calculateAssemblyCost = (assembly: Assembly) => {
    return assembly.assembly_components.reduce((total, ac) => {
      return total + (ac.component.cost * ac.quantity)
    }, 0)
  }

  // Calculate assembly sell price (for now, just return cost - markup will be applied later)
  const calculateAssemblySellPrice = (assembly: Assembly) => {
    return calculateAssemblyCost(assembly)
  }

  const handleAddAssembly = async () => {
    setLoading('new')
    try {
      const response = await fetch('/api/quote-admin/assemblies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newAssembly,
          amperage: newAssembly.amperage ? parseInt(newAssembly.amperage) : null
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add assembly')
      }

      // Reset form and refresh
      setNewAssembly({
        name: '',
        description: '',
        category: '',
        amperage: '',
        enclosure_type: '',
        product_line: ''
      })
      setIsAdding(false)
      router.refresh()
    } catch (error) {
      console.error('Error adding assembly:', error)
      alert('Failed to add assembly. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const handleDeleteAssembly = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assembly? This action cannot be undone.')) {
      return
    }

    setLoading(id)
    try {
      const response = await fetch('/api/quote-admin/assemblies', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete assembly')
      }

      router.refresh()
    } catch (error) {
      console.error('Error deleting assembly:', error)
      alert('Failed to delete assembly. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  // Filter assemblies by selected category
  const filteredAssemblies = selectedCategory === 'all' 
    ? assemblies 
    : assemblies.filter(a => a.category === selectedCategory)

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-slate-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Add Assembly Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsAdding(true)}
          className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
        >
          Add Assembly
        </button>
      </div>

      {/* Add Assembly Form */}
      {isAdding && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Assembly</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={newAssembly.name}
                onChange={(e) => setNewAssembly({ ...newAssembly, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="e.g., 4000A NEMA1 Spectra Cubicle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={newAssembly.category}
                onChange={(e) => setNewAssembly({ ...newAssembly, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="e.g., Cubicle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amperage</label>
              <input
                type="number"
                value={newAssembly.amperage}
                onChange={(e) => setNewAssembly({ ...newAssembly, amperage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="e.g., 4000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enclosure Type</label>
              <input
                type="text"
                value={newAssembly.enclosure_type}
                onChange={(e) => setNewAssembly({ ...newAssembly, enclosure_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="e.g., NEMA1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Line</label>
              <input
                type="text"
                value={newAssembly.product_line}
                onChange={(e) => setNewAssembly({ ...newAssembly, product_line: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="e.g., Spectra"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newAssembly.description}
                onChange={(e) => setNewAssembly({ ...newAssembly, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                rows={3}
                placeholder="Optional description..."
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
              onClick={handleAddAssembly}
              disabled={loading === 'new'}
              className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              {loading === 'new' ? 'Adding...' : 'Add Assembly'}
            </button>
          </div>
        </div>
      )}

      {/* Assemblies List */}
      <div className="space-y-4">
        {filteredAssemblies.map((assembly) => (
          <div key={assembly.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Assembly Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold text-gray-900">{assembly.name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {assembly.category}
                    </span>
                    {assembly.amperage && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        {assembly.amperage}A
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center space-x-6 text-sm text-gray-600">
                    {assembly.enclosure_type && <span>Enclosure: {assembly.enclosure_type}</span>}
                    {assembly.product_line && <span>Product Line: {assembly.product_line}</span>}
                    <span>Components: {assembly.assembly_components.length}</span>
                    <span className="font-semibold text-green-600">
                      Sell Price: ${calculateAssemblySellPrice(assembly).toFixed(2)}
                    </span>
                  </div>
                  {assembly.description && (
                    <p className="mt-2 text-sm text-gray-600">{assembly.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setExpandedAssembly(expandedAssembly === assembly.id ? null : assembly.id)}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    {expandedAssembly === assembly.id ? 'Hide Components' : 'View Components'}
                  </button>
                  <button
                    onClick={() => handleDeleteAssembly(assembly.id)}
                    disabled={loading === assembly.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Assembly Components (Expandable) */}
            {expandedAssembly === assembly.id && (
              <div className="p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Assembly Components</h4>
                {assembly.assembly_components.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Component</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Qty</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Unit Cost</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total Cost</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Optional</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {assembly.assembly_components.map((ac) => {
                          const unitCost = ac.component.cost
                          const totalCost = unitCost * ac.quantity
                          return (
                            <tr key={ac.id}>
                              <td className="px-4 py-2">
                                <div className="text-sm font-medium text-gray-900">
                                  {ac.component.catalog_number}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {ac.component.description}
                                </div>
                              </td>
                              <td className="px-4 py-2 text-center text-sm text-gray-900">
                                {ac.quantity}
                              </td>
                              <td className="px-4 py-2 text-right text-sm text-gray-900">
                                ${unitCost.toFixed(2)}
                              </td>
                              <td className="px-4 py-2 text-right text-sm font-semibold text-gray-900">
                                ${totalCost.toFixed(2)}
                              </td>
                              <td className="px-4 py-2 text-center">
                                {ac.is_optional ? (
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                    Optional
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                    Required
                                  </span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No components added to this assembly yet.</p>
                )}
              </div>
            )}
          </div>
        ))}
        
        {filteredAssemblies.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No assemblies found for the selected category.
          </div>
        )}
      </div>
    </div>
  )
} 