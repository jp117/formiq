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
import { exportProductionScheduleToExcel } from '../utils/exportUtils'

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
  const [isExporting, setIsExporting] = useState(false)
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

  const handleExportSpreadsheet = async () => {
    setIsExporting(true)
    try {
      await exportProductionScheduleToExcel(switchboards, integrations, miscItems)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
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
        <div className="flex items-center space-x-3">
          {/* Download Spreadsheet Button */}
          <button 
            onClick={handleExportSpreadsheet}
            disabled={isExporting}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isExporting ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download Spreadsheet</span>
              </>
            )}
          </button>
          
          {/* New Schedule Button */}
          {(userAccess === 'edit_access' || userAccess === 'admin_access') && (
            <button 
              onClick={handleNewSchedule}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              New Schedule
            </button>
          )}
        </div>
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