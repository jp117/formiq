'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BasicInfoSection from './BasicInfoSection'
import RatingsSection from './RatingsSection'
import IncomingOrientationSection from './IncomingOrientationSection'
import BusSection from './BusSection'
import EnclosureSpecialsSection from './EnclosureSpecialsSection'
import UtilityContentSection from './UtilityContentSection'
import IncomingServiceDisconnectSection from './IncomingServiceDisconnectSection'
import FeedersSection from './FeedersSection'
import MeterSPDOptionsSection from './MeterSPDOptionsSection'
import OptionsSection from './OptionsSection'

interface UtilityItem {
  id: string
  displayName: string
  utilityType: string
  quantity: number
  utilityCode: string
  amps: string
  sequence: string
}

interface DisconnectDevice {
  id: string
  displayName: string
  quantity: number
  deviceType: string
  construction: string
  tripAmps: number
  poles: number
  frame: string
  sensor: string
  hundredPercent: boolean
  operation: string
}

interface FeederDevice {
  id: string
  displayName: string
  quantity: number
  deviceType: string
  construction: string
  tripAmps: number
  poles: number
  frame: string
  sensor: string
  hundredPercent: boolean
  operation: string
  mounting: string
}

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
  const [activeTab, setActiveTab] = useState<'lineup' | 'utility' | 'incoming-service-disconnect' | 'feeders' | 'meter-spd' | 'options'>('lineup')

  // Form state for lineup tab - removed MTM Interlock, Hi Leg, cUL
  const [formData, setFormData] = useState({
    marks: '',
    switchboardType: 'Engineered Switchboard',
    panelType: 'ReliaGear (CB Feeders)',
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
    access: 'Front',
    height: '90"',
    requiresServiceDisconnect: false,
    // Utility form data
    utilityItems: [] as UtilityItem[],
    selectedUtilityType: 'All Others' as 'EUSERC' | 'All Others',
    currentItem: {
      qty: '1',
      name: '',
      amps: '',
      sequence: ''
    },
    lineConnection: {
      feedType: '',
      lugType: '',
      cableMaterial: '',
      cableSize: '',
      cablesPerPhase: '',
      utilityTermination: false
    },
    loadConnection: {
      loadType: '',
      lugType: '',
      cableMaterial: '',
      loadExit: '',
      cableSize: '',
      cablesPerPhase: ''
    },
    utilitySpecs: {
      sockets: '',
      figure: '',
      clips: '',
      currentTransformerType: '',
      ptCompartmentHeight: '',
      potentialTransformers: false
    },
    // Incoming Service Disconnect form data
    disconnectDevices: [] as DisconnectDevice[],
    incomingServiceDisconnect: {
      application: '',
      fuseType: '',
      deviceAssociation: '',
      sdLocation: '',
      lineConnection: {
        feedType: '',
        lugType: '',
        cableMaterial: '',
        strapType: '',
        cableSize: '',
        cablesPerPhase: ''
      },
      loadConnection: {
        loadType: '',
        lugType: '',
        cableMaterial: '',
        strapType: '',
        cableSize: '',
        cablesPerPhase: '',
        loadExit: '',
        allowLoadBusWithNoLoadDevices: false
      },
      protectionFeatures: {
        phaseFailure: false,
        capTrip: false,
        geItiBgflGfRelay: false,
        multiStack: false,
        provideFuses: false,
        subMeteringRgm4500q: false
      },
      programmer: {
        mode: '' as 'instantaneous' | 'fuse-only' | 'none' | '',
        longTime: false,
        shortTime: false,
        relt: false,
        groundFault: false,
        neutralProtection: false,
        rgZoneSelectiveInterlock: false,
        type: 'EKIP Touch'
      }
    },
    // Feeders form data
    feederDevices: [] as FeederDevice[],
    feeders: {
      fuseType: '',
      deviceAssociation: '',
      fedByMain: '',
      provideLugs: false,
      loadConnection: {
        loadType: '',
        loadWireType: '' as '3-wire' | '4-wire' | '',
        strapType: '',
        lugType: '',
        cableMaterial: '',
        loadExit: '',
        cableSize: '',
        cablesPerPhase: ''
      },
      protectionFeatures: {
        phaseFailure: false,
        capTrip: false,
        geItiBgflGfRelay: false,
        subMeteringRgm4500q: false,
        multiStack: false,
        provideFuses: false
      },
      programmer: {
        mode: '' as 'instantaneous' | 'fuse-only' | 'none' | '',
        longTime: false,
        shortTime: false,
        relt: false,
        groundFault: false,
        gfAlarm: false,
        neutralProtection: false,
        meteringCommunication: false,
        protectiveRelays: false,
        rgZoneSelectiveInterlock: false,
        type: ''
      },
      zoneSelectiveInterlock: '' as 'ground-fault-only' | 'ground-fault-instantaneous' | 'short-time-ground-fault' | 'short-time-ground-fault-instantaneous' | 'none' | '',
      measuringModule: ''
    },
    // Meter & SPD Options form data
    brekerCommunications: {
      ethernetGateway: false,
      rtuToEthernet: false
    },
    meterMonitoring: [{
      meterType: 'None',
      spdType: 'None',
      ammeterAndSwitch: false,
      voltmeterAndSwitch: false
    }],
    customerInstrumentation: {
      meterType: 'None',
      quantity: 0,
      ammeterAndSwitch: false,
      voltmeterAndSwitch: false,
      potentialTransformer: false,
      neutralCT: false,
      wattmeter: false
    },
    surgeProtectiveDevice: {
      spdType: 'None',
      certification: '' as 'type1' | 'type2' | '',
      quantity: 0,
      mounting: '' as 'individually' | 'group' | '',
      indicatingLight: false,
      alarm: false,
      formCContacts: false,
      surgeCounter: false
    },
    // Options form data
    generalOptions: {
      dripResistanceRoof: false,
      portableTripUnitTestKit: false,
      neutralsAndGroundFollowsFeederLoadExit: false,
      fullHeightRearHingeDoor: false,
      hingedWireGutterCover: false,
      doNotIntermixMainAndUtility: false,
      seismicRating: false,
      fullHeightSectionBarriers: false,
      liftingBracket: false,
      doNotIntermixMainAndPanel: false,
      e9000MCCTransition: false,
      avTransition: false,
      fullHeightVerticalBusForDistributionSection: false,
      lightningArrestor: false,
      surgeCapacitor: false,
      doNotStackTransformers: false,
      twoSidedPanel: false,
      floorPlates: false,
      floorSill: false,
      changeCopperBusPlatingToTIN: false,
      enableLegacyProducts: false,
      certifiedTestReport: false,
      fullyRatedPanelBus: false
    },
    mimicBus: 'None',
    shippingBreak: '' as 'each-section' | 'two-sections' | '',
    drawoutLiftingOptions: '' as 'floor-crane' | 'stationary-hoist' | 'moveable-hoist' | 'none' | '',
    sectionHeater: {
      enabled: false,
      thermostat: false,
      controlPowerForSectionHeat: false,
      humidistat: false
    },
    firePumpTap: {
      enabled: false,
      lugType: '',
      cableMaterial: '',
      cableSize: '',
      amps: '',
      lugQtyPerPhase: ''
    }
  })

  const handleInputChange = (field: string, value: string | boolean | UtilityItem[] | DisconnectDevice[] | FeederDevice[] | Record<string, unknown> | unknown) => {
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
              onClick={() => setActiveTab('utility')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'utility'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Utility
            </button>
            <button
              onClick={() => setActiveTab('incoming-service-disconnect')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'incoming-service-disconnect'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Incoming Service Disconnect
            </button>
            <button
              onClick={() => setActiveTab('feeders')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'feeders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Feeders
            </button>
            <button
              onClick={() => setActiveTab('meter-spd')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'meter-spd'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Meter Monitoring
            </button>
            <button
              onClick={() => setActiveTab('options')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'options'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Options
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

            {activeTab === 'utility' && (
              <div>
                <UtilityContentSection
                  formData={{
                    utilityItems: formData.utilityItems,
                    selectedUtilityType: formData.selectedUtilityType,
                    currentItem: formData.currentItem,
                    lineConnection: formData.lineConnection,
                    loadConnection: formData.loadConnection,
                    utilitySpecs: formData.utilitySpecs
                  }}
                  onInputChange={handleInputChange}
                />
              </div>
            )}

            {activeTab === 'incoming-service-disconnect' && (
              <div>
                <IncomingServiceDisconnectSection
                  formData={{
                    disconnectDevices: formData.disconnectDevices,
                    application: formData.incomingServiceDisconnect.application,
                    fuseType: formData.incomingServiceDisconnect.fuseType,
                    deviceAssociation: formData.incomingServiceDisconnect.deviceAssociation,
                    sdLocation: formData.incomingServiceDisconnect.sdLocation,
                    lineConnection: formData.incomingServiceDisconnect.lineConnection,
                    loadConnection: formData.incomingServiceDisconnect.loadConnection,
                    protectionFeatures: formData.incomingServiceDisconnect.protectionFeatures,
                    programmer: formData.incomingServiceDisconnect.programmer
                  }}
                  onInputChange={(field, value) => {
                    if (field === 'disconnectDevices') {
                      handleInputChange('disconnectDevices', value)
                    } else if (field === 'application' || field === 'fuseType' || field === 'deviceAssociation' || field === 'sdLocation') {
                      handleInputChange('incomingServiceDisconnect', {
                        ...formData.incomingServiceDisconnect,
                        [field]: value
                      })
                    } else if (field === 'lineConnection' || field === 'loadConnection' || field === 'protectionFeatures' || field === 'programmer') {
                      handleInputChange('incomingServiceDisconnect', {
                        ...formData.incomingServiceDisconnect,
                        [field]: value
                      })
                    }
                  }}
                />
              </div>
            )}

            {activeTab === 'feeders' && (
              <div>
                <FeedersSection
                  formData={{
                    feederDevices: formData.feederDevices,
                    fuseType: formData.feeders.fuseType,
                    deviceAssociation: formData.feeders.deviceAssociation,
                    fedByMain: formData.feeders.fedByMain,
                    provideLugs: formData.feeders.provideLugs,
                    loadConnection: formData.feeders.loadConnection,
                    protectionFeatures: formData.feeders.protectionFeatures,
                    programmer: formData.feeders.programmer,
                    zoneSelectiveInterlock: formData.feeders.zoneSelectiveInterlock,
                    measuringModule: formData.feeders.measuringModule
                  }}
                  onInputChange={(field, value) => {
                    if (field === 'feederDevices') {
                      handleInputChange('feederDevices', value)
                    } else if (field === 'fuseType' || field === 'deviceAssociation' || field === 'fedByMain' || field === 'provideLugs') {
                      handleInputChange('feeders', {
                        ...formData.feeders,
                        [field]: value
                      })
                    } else if (field === 'loadConnection' || field === 'protectionFeatures' || field === 'programmer') {
                      handleInputChange('feeders', {
                        ...formData.feeders,
                        [field]: value
                      })
                    } else if (field === 'zoneSelectiveInterlock' || field === 'measuringModule') {
                      handleInputChange('feeders', {
                        ...formData.feeders,
                        [field]: value
                      })
                    }
                  }}
                />
              </div>
            )}

            {activeTab === 'meter-spd' && (
              <div>
                <MeterSPDOptionsSection
                  formData={{
                    brekerCommunications: formData.brekerCommunications,
                    meterMonitoring: formData.meterMonitoring,
                    customerInstrumentation: formData.customerInstrumentation,
                    surgeProtectiveDevice: formData.surgeProtectiveDevice
                  }}
                  onInputChange={handleInputChange}
                />
              </div>
            )}

            {activeTab === 'options' && (
              <div>
                <OptionsSection
                  formData={{
                    generalOptions: formData.generalOptions,
                    mimicBus: formData.mimicBus,
                    shippingBreak: formData.shippingBreak,
                    drawoutLiftingOptions: formData.drawoutLiftingOptions,
                    sectionHeater: formData.sectionHeater,
                    firePumpTap: formData.firePumpTap
                  }}
                  onInputChange={handleInputChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}