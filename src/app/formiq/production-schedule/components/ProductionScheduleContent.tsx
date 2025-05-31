'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SwitchboardsTable from './SwitchboardsTable'
import IntegrationTable from './IntegrationTable'
import MiscTable from './MiscTable'
import CreateSwitchboardModal from './modals/CreateSwitchboardModal'
import CreateIntegrationModal from './modals/CreateIntegrationModal'
import CreateMiscModal from './modals/CreateMiscModal'
import { Switchboard, Integration, MiscItem } from '../types'

interface ProductionScheduleContentProps {
  switchboards: Switchboard[]
  integrations: Integration[]
  miscItems: MiscItem[]
  companyId: string
  userAccess: string
}

function ProductionScheduleContent({ 
  switchboards, 
  integrations, 
  miscItems,
  companyId,
  userAccess
}: ProductionScheduleContentProps) {
  const [activeTab, setActiveTab] = useState('switchboards')
  const [isSwitchboardModalOpen, setIsSwitchboardModalOpen] = useState(false)
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false)
  const [isMiscModalOpen, setIsMiscModalOpen] = useState(false)
  const router = useRouter()

  // Sort items by current ship date (closest date first)
  const sortedSwitchboards = [...switchboards].sort((a, b) => 
    new Date(a.current_scheduled_ship_date).getTime() - new Date(b.current_scheduled_ship_date).getTime()
  )
  
  const sortedIntegrations = [...integrations].sort((a, b) => 
    new Date(a.current_scheduled_ship_date).getTime() - new Date(b.current_scheduled_ship_date).getTime()
  )
  
  const sortedMiscItems = [...miscItems].sort((a, b) => 
    new Date(a.current_scheduled_ship_date).getTime() - new Date(b.current_scheduled_ship_date).getTime()
  )

  const tabs = [
    { id: 'switchboards', label: 'Switchboards', count: switchboards.length },
    { id: 'integration', label: 'Integration', count: integrations.length },
    { id: 'misc', label: 'Misc', count: miscItems.length },
  ]

  const handleNewSchedule = () => {
    if (activeTab === 'switchboards') {
      setIsSwitchboardModalOpen(true)
    } else if (activeTab === 'integration') {
      setIsIntegrationModalOpen(true)
    } else if (activeTab === 'misc') {
      setIsMiscModalOpen(true)
    }
  }

  const handleItemCreated = () => {
    // Refresh the page to show the new item
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
        {(userAccess === 'edit_access' || userAccess === 'admin_access') && (
          <button 
            onClick={handleNewSchedule}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Schedule
          </button>
        )}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'switchboards' && (
          <SwitchboardsTable switchboards={sortedSwitchboards} userAccess={userAccess} companyId={companyId} />
        )}

        {activeTab === 'integration' && (
          <IntegrationTable integrations={sortedIntegrations} userAccess={userAccess} companyId={companyId} />
        )}

        {activeTab === 'misc' && (
          <MiscTable miscItems={sortedMiscItems} userAccess={userAccess} companyId={companyId} />
        )}
      </div>

      {/* Create Modals */}
      <CreateSwitchboardModal
        isOpen={isSwitchboardModalOpen}
        onClose={() => setIsSwitchboardModalOpen(false)}
        companyId={companyId}
        onItemCreated={handleItemCreated}
      />

      <CreateIntegrationModal
        isOpen={isIntegrationModalOpen}
        onClose={() => setIsIntegrationModalOpen(false)}
        companyId={companyId}
        onItemCreated={handleItemCreated}
      />

      <CreateMiscModal
        isOpen={isMiscModalOpen}
        onClose={() => setIsMiscModalOpen(false)}
        companyId={companyId}
        onItemCreated={handleItemCreated}
      />
    </div>
  )
}

export default ProductionScheduleContent 