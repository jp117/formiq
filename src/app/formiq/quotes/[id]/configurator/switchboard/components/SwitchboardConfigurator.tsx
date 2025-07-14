'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Quote {
  id: string
  quote_number: string
  quote_name: string
  company_id: string
  created_by: string
}

interface QuoteComponent {
  id: string
  type: string
  vendor: string
  catalog_number: string
  description: string
  cost: number
  sell_price: number
}

interface Assembly {
  id: string
  name: string
  description: string
  category: string
  amperage: number
  enclosure_type: string
  product_line: string
  base_markup_percentage: number
  assembly_components: Array<{
    id: string
    quantity: number
    is_optional: boolean
    notes: string
    component: QuoteComponent
  }>
}

interface SwitchboardConfiguratorProps {
  quote: Quote
  assemblies: Assembly[]
  components: QuoteComponent[]
}

export default function SwitchboardConfigurator({
  quote,
  assemblies: _assemblies, // eslint-disable-line @typescript-eslint/no-unused-vars
  components: _components // eslint-disable-line @typescript-eslint/no-unused-vars
}: SwitchboardConfiguratorProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'lineup' | 'configuration'>('lineup')

  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Save configuration')
  }

  const handleCancel = () => {
    router.push(`/formiq/quotes/${quote.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar - Full Width */}
      <div className="bg-slate-800 text-white shadow-sm border-b">
        <div className="px-6">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold">Switchboards</h1>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-300">
                Quote: {quote.quote_number} - {quote.quote_name}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSave}
                className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
              >
                Save & Exit
              </button>
              <button
                onClick={handleSave}
                className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="px-6 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('lineup')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'lineup'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Lineup
            </button>
            <button
              onClick={() => setActiveTab('configuration')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'configuration'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Configuration
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="max-w-[90%] max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {activeTab === 'lineup' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Lineup</h2>
                <p className="text-gray-500">Lineup content will go here...</p>
              </div>
            )}
            
            {activeTab === 'configuration' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Configuration</h2>
                <p className="text-gray-500">Configuration content will go here...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 