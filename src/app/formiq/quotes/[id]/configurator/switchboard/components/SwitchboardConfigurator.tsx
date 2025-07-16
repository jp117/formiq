'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BasicInfoSection from './BasicInfoSection'
import RatingsSection from './RatingsSection'
import IncomingOrientationSection from './IncomingOrientationSection'
import BusSection from './BusSection'
import EnclosureSpecialsSection from './EnclosureSpecialsSection'

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

  // Form state for lineup tab - removed MTM Interlock, Hi Leg, cUL
  const [formData, setFormData] = useState({
    marks: '',
    switchboardType: 'Configured Switchboard',
    panelType: 'ReliaGear (C/B feeders only)',
    application: 'Main Disconnect',
    voltage: '480/277 AC',
    phaseWireHz: '3/4/60',
    icRating: '65',
    busBracing: '65',
    ratingType: 'fully',
    serviceEntrance: false,
    amps: '1200',
    feedType: 'Lugs/Cable',
    feedLocation: 'top',
    sectionAlignment: 'front-rear',
    incomingLocation: 'left',
    buildAmericaBuyAmerica: false,
    material: 'Copper',
    busPlating: 'Silver',
    busDensity: '1000 A/Sq. in.',
    neutralRating: '100% Rated',
    busRating: 'fully-rated',
    enclosureType: 'Type 1',
    access: 'Front Only',
    height: '90"',
    requiresServiceDisconnect: false
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

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
                {/* Basic Info - Full Width */}
                <BasicInfoSection
                  formData={{
                    marks: formData.marks,
                    switchboardType: formData.switchboardType,
                    panelType: formData.panelType,
                    application: formData.application,
                    buildAmericaBuyAmerica: formData.buildAmericaBuyAmerica
                  }}
                  onInputChange={handleInputChange}
                />

                {/* First Two Column Grid - Ratings and Incoming & Orientation */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-8">
                  {/* Left Column - Ratings */}
                  <RatingsSection
                    formData={{
                      voltage: formData.voltage,
                      phaseWireHz: formData.phaseWireHz,
                      icRating: formData.icRating,
                      busBracing: formData.busBracing,
                      ratingType: formData.ratingType,
                      serviceEntrance: formData.serviceEntrance
                    }}
                    onInputChange={handleInputChange}
                  />

                  {/* Right Column - Incoming and Orientation */}
                  <IncomingOrientationSection
                    formData={{
                      amps: formData.amps,
                      feedType: formData.feedType,
                      feedLocation: formData.feedLocation,
                      sectionAlignment: formData.sectionAlignment,
                      incomingLocation: formData.incomingLocation
                    }}
                    onInputChange={handleInputChange}
                  />
                </div>

                {/* Second Two Column Grid - Bus and Enclosure & Specials */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                  {/* Left Column - Bus */}
                  <BusSection
                    formData={{
                      material: formData.material,
                      busPlating: formData.busPlating,
                      busDensity: formData.busDensity,
                      neutralRating: formData.neutralRating,
                      busRating: formData.busRating
                    }}
                    onInputChange={handleInputChange}
                  />

                  {/* Right Column - Enclosure and Specials */}
                  <EnclosureSpecialsSection
                    formData={{
                      enclosureType: formData.enclosureType,
                      access: formData.access,
                      height: formData.height,
                      requiresServiceDisconnect: formData.requiresServiceDisconnect
                    }}
                    onInputChange={handleInputChange}
                  />
                </div>
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