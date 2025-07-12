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

interface UserData {
  id: string
  company_id: string
  first_name: string
  last_name: string
  email: string
  is_admin: boolean
  is_quote_admin: boolean
  quotes_access: string
}

interface SwitchboardConfiguratorProps {
  quote: Quote
  assemblies: Assembly[]
  components: QuoteComponent[]
  userData: UserData
}

interface SwitchboardConfig {
  name: string
  description: string
  designation: string
  nema_type: string
  amperage: number
  enclosure_type: string
  product_line: string
  number_of_sections: number
  quantity: number
  notes: string
  configuration_method: 'assembly' | 'custom'
  selected_assembly_id: string | null
  custom_components: Array<{
    component_id: string
    quantity: number
    is_optional: boolean
    notes: string
  }>
}

export default function SwitchboardConfigurator({
  quote,
  assemblies,
  components,
  userData
}: SwitchboardConfiguratorProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<'method' | 'configure' | 'review'>('method')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [config, setConfig] = useState<SwitchboardConfig>({
    name: '',
    description: '',
    designation: '',
    nema_type: '',
    amperage: 0,
    enclosure_type: '',
    product_line: '',
    number_of_sections: 1,
    quantity: 1,
    notes: '',
    configuration_method: 'assembly',
    selected_assembly_id: null,
    custom_components: []
  })

  const handleMethodSelection = (method: 'assembly' | 'custom') => {
    setConfig(prev => ({
      ...prev,
      configuration_method: method,
      selected_assembly_id: null,
      custom_components: []
    }))
    setCurrentStep('configure')
  }

  const handleAssemblySelection = (assemblyId: string) => {
    const selectedAssembly = assemblies.find(a => a.id === assemblyId)
    if (selectedAssembly) {
      setConfig(prev => ({
        ...prev,
        selected_assembly_id: assemblyId,
        name: selectedAssembly.name,
        description: selectedAssembly.description,
        amperage: selectedAssembly.amperage,
        enclosure_type: selectedAssembly.enclosure_type,
        product_line: selectedAssembly.product_line
      }))
    }
  }

  const handleConfigChange = (field: keyof SwitchboardConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddComponent = (componentId: string, quantity: number = 1, isOptional: boolean = false) => {
    setConfig(prev => ({
      ...prev,
      custom_components: [
        ...prev.custom_components,
        {
          component_id: componentId,
          quantity,
          is_optional: isOptional,
          notes: ''
        }
      ]
    }))
  }

  const handleRemoveComponent = (index: number) => {
    setConfig(prev => ({
      ...prev,
      custom_components: prev.custom_components.filter((_, i) => i !== index)
    }))
  }

  const calculateTotalCost = () => {
    let total = 0
    
    if (config.configuration_method === 'assembly' && config.selected_assembly_id) {
      const assembly = assemblies.find(a => a.id === config.selected_assembly_id)
      if (assembly) {
        assembly.assembly_components.forEach(ac => {
          total += ac.component.cost * ac.quantity
        })
      }
    } else if (config.configuration_method === 'custom') {
      config.custom_components.forEach(cc => {
        const component = components.find(c => c.id === cc.component_id)
        if (component) {
          total += component.cost * cc.quantity
        }
      })
    }
    
    return total * config.quantity
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Create the quote assembly or custom configuration
      const payload = {
        quote_id: quote.id,
        configuration: config,
        total_cost: calculateTotalCost()
      }
      
      const response = await fetch('/api/quotes/switchboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to save switchboard configuration')
      }

      // Navigate back to quote details
      router.push(`/formiq/quotes/${quote.id}`)
    } catch (error) {
      console.error('Error saving switchboard configuration:', error)
      alert('Failed to save switchboard configuration. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Switchboard Configurator</h1>
        <p className="text-gray-600">
          Configure a switchboard assembly for Quote {quote.quote_number} - {quote.quote_name}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${currentStep === 'method' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 'method' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Choose Method</span>
            </div>
            <div className={`w-8 h-px ${currentStep !== 'method' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${currentStep === 'configure' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 'configure' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Configure</span>
            </div>
            <div className={`w-8 h-px ${currentStep === 'review' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${currentStep === 'review' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 'review' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium">Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 'method' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Configuration Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => handleMethodSelection('assembly')}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex items-center mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">Pre-built Assembly</h3>
              </div>
              <p className="text-gray-600">
                Choose from standardized switchboard assemblies with pre-configured components and pricing.
              </p>
              <div className="mt-4 text-sm text-gray-500">
                {assemblies.length} assemblies available
              </div>
            </button>
            
            <button
              onClick={() => handleMethodSelection('custom')}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex items-center mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">Custom Configuration</h3>
              </div>
              <p className="text-gray-600">
                Build a custom switchboard by selecting individual components and specifying your requirements.
              </p>
              <div className="mt-4 text-sm text-gray-500">
                {components.length} components available
              </div>
            </button>
          </div>
        </div>
      )}

      {currentStep === 'configure' && config.configuration_method === 'assembly' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Assembly</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assemblies.map((assembly) => (
                <button
                  key={assembly.id}
                  onClick={() => handleAssemblySelection(assembly.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    config.selected_assembly_id === assembly.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{assembly.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{assembly.description}</p>
                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-gray-500">
                      {assembly.amperage}A • {assembly.enclosure_type}
                    </div>
                    <div className="text-xs text-gray-500">
                      {assembly.product_line}
                    </div>
                    <div className="text-xs text-gray-500">
                      {assembly.assembly_components.length} components
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {config.selected_assembly_id && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Configure Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Switchboard Name *
                  </label>
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) => handleConfigChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter switchboard name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation *
                  </label>
                  <input
                    type="text"
                    value={config.designation}
                    onChange={(e) => handleConfigChange('designation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., SB-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NEMA Type *
                  </label>
                  <input
                    type="text"
                    value={config.nema_type}
                    onChange={(e) => handleConfigChange('nema_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., NEMA 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Sections *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={config.number_of_sections}
                    onChange={(e) => handleConfigChange('number_of_sections', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={config.quantity}
                    onChange={(e) => handleConfigChange('quantity', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={config.description}
                    onChange={(e) => handleConfigChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Additional description or specifications"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={config.notes}
                    onChange={(e) => handleConfigChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any additional notes or special requirements"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setCurrentStep('review')}
                  disabled={!config.name || !config.designation || !config.nema_type}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Continue to Review
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {currentStep === 'review' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Configuration</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900">{config.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Designation</label>
                <p className="text-gray-900">{config.designation}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">NEMA Type</label>
                <p className="text-gray-900">{config.nema_type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sections</label>
                <p className="text-gray-900">{config.number_of_sections}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <p className="text-gray-900">{config.quantity}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estimated Cost</label>
                <p className="text-gray-900 font-semibold">${calculateTotalCost().toFixed(2)}</p>
              </div>
            </div>
            {config.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="text-gray-900">{config.description}</p>
              </div>
            )}
            {config.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <p className="text-gray-900">{config.notes}</p>
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setCurrentStep('configure')}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Configure
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Add to Quote'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 