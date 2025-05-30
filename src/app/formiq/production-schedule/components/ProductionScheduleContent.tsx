'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SwitchboardsTable from './SwitchboardsTable'
import IntegrationTable from './IntegrationTable'
import MiscTable from './MiscTable'
import CreateItemModal from './CreateItemModal'

interface Component {
  id: string
  component_name: string
  quantity: number
  original_scheduled_ship_date: string
  current_scheduled_ship_date: string
}

interface PurchaseOrder {
  id: string
  po_number: string
  vendor?: string
  components: Component[]
}

interface Switchboard {
  id: string
  designation: string
  nema_type: string
  number_of_sections: number
  sales_order_number: string
  customer: string
  job_name?: string
  job_address?: string
  completed: boolean
  original_scheduled_ship_date: string
  current_scheduled_ship_date: string
  purchase_orders: PurchaseOrder[]
}

interface Integration {
  id: string
  designation: string
  type: string
  sales_order_number: string
  customer: string
  job_name?: string
  job_address?: string
  completed: boolean
  original_scheduled_ship_date: string
  current_scheduled_ship_date: string
  purchase_orders: PurchaseOrder[]
}

interface MiscItem {
  id: string
  quantity: number
  description: string
  sales_order_number: string
  customer: string
  job_name?: string
  job_address?: string
  completed: boolean
  original_scheduled_ship_date: string
  current_scheduled_ship_date: string
  purchase_orders: PurchaseOrder[]
}

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const tabs = [
    { id: 'switchboards', label: 'Switchboards', count: switchboards.length },
    { id: 'integration', label: 'Integration', count: integrations.length },
    { id: 'misc', label: 'Misc', count: miscItems.length },
  ]

  const handleNewSchedule = () => {
    setIsModalOpen(true)
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
          switchboards.length > 0 ? (
            <SwitchboardsTable switchboards={switchboards} userAccess={userAccess} companyId={companyId} />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No switchboards yet</h3>
              <p className="text-gray-600 mb-4">
                Get started by creating your first switchboard schedule.
              </p>
              {(userAccess === 'edit_access' || userAccess === 'admin_access') && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Switchboard
                </button>
              )}
            </div>
          )
        )}

        {activeTab === 'integration' && (
          integrations.length > 0 ? (
            <IntegrationTable integrations={integrations} userAccess={userAccess} companyId={companyId} />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No integration items yet</h3>
              <p className="text-gray-600 mb-4">
                Get started by creating your first integration schedule.
              </p>
              {(userAccess === 'edit_access' || userAccess === 'admin_access') && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Integration
                </button>
              )}
            </div>
          )
        )}

        {activeTab === 'misc' && (
          miscItems.length > 0 ? (
            <MiscTable miscItems={miscItems} userAccess={userAccess} companyId={companyId} />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No misc items yet</h3>
              <p className="text-gray-600 mb-4">
                Get started by creating your first misc schedule.
              </p>
              {(userAccess === 'edit_access' || userAccess === 'admin_access') && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Misc Item
                </button>
              )}
            </div>
          )
        )}
      </div>

      {/* Create Item Modal */}
      <CreateItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={activeTab as 'switchboards' | 'integration' | 'misc'}
        companyId={companyId}
        onItemCreated={handleItemCreated}
      />
    </div>
  )
}

export default ProductionScheduleContent 