'use client'

import { useState } from 'react'
import React from 'react'
import { useRouter } from 'next/navigation'
import EditIntegrationModal from './modals/EditIntegrationModal'
import AddPOModal from './AddPOModal'
import EditPOModal from './EditPOModal'
import { Integration, PurchaseOrder } from '../types'

interface IntegrationTableProps {
  integrations: Integration[]
  userAccess: string
  companyId: string
}

export default function IntegrationTable({ integrations, userAccess, companyId }: IntegrationTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Integration | null>(null)
  const [addPOModalOpen, setAddPOModalOpen] = useState(false)
  const [selectedItemForPO, setSelectedItemForPO] = useState<string>('')
  const [editPOModalOpen, setEditPOModalOpen] = useState(false)
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null)
  const router = useRouter()

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getShipDateColorClass = (originalDate: string, currentDate: string) => {
    const original = new Date(originalDate)
    const current = new Date(currentDate)
    
    if (current < original) {
      return 'bg-green-200 text-green-900 font-medium' // Earlier than original - green with very dark text
    } else if (current > original) {
      return 'bg-red-200 text-red-900 font-medium' // Later than original - red with very dark text
    }
    return 'text-gray-900' // Same date - just dark text
  }

  const isPOComponentDateIssue = (componentDate: string, integrationDate: string) => {
    const component = new Date(componentDate)
    const integration = new Date(integrationDate)
    const twoWeeksBefore = new Date(integration)
    twoWeeksBefore.setDate(integration.getDate() - 14)
    
    return component > twoWeeksBefore // Component date is not at least 2 weeks before integration date
  }

  const hasIntegrationDateIssues = (integration: Integration) => {
    return integration.purchase_orders.some(po => 
      po.components.some(component => 
        isPOComponentDateIssue(component.current_scheduled_ship_date, integration.current_scheduled_ship_date)
      )
    )
  }

  const handleEdit = (e: React.MouseEvent, integration: Integration) => {
    e.stopPropagation() // Prevent row expansion
    setSelectedItem(integration)
    setEditModalOpen(true)
  }

  const handleItemUpdated = () => {
    // Refresh the page to show updated data
    router.refresh()
  }

  const handleAddPO = (e: React.MouseEvent, integrationId: string) => {
    e.stopPropagation()
    setSelectedItemForPO(integrationId)
    setAddPOModalOpen(true)
  }

  const handleEditPO = (e: React.MouseEvent, po: PurchaseOrder) => {
    e.stopPropagation()
    setSelectedPO(po)
    setEditPOModalOpen(true)
  }

  const handlePOUpdated = () => {
    router.refresh()
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Integration</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-8 px-6 py-3"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Designation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sales Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Original Ship Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Ship Date
              </th>
              {(userAccess === 'edit_access' || userAccess === 'admin_access') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {integrations.map((integration) => (
              <React.Fragment key={integration.id}>
                <tr
                  className={`cursor-pointer transition-colors ${
                    hasIntegrationDateIssues(integration)
                      ? 'bg-red-100 hover:bg-red-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => toggleRow(integration.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg
                        className={`w-4 h-4 transform transition-transform ${
                          expandedRows.has(integration.id) ? 'rotate-90' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {integration.designation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {integration.sales_order_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {integration.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {integration.job_name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {integration.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(integration.original_scheduled_ship_date)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getShipDateColorClass(integration.original_scheduled_ship_date, integration.current_scheduled_ship_date)}`}>
                    {formatDate(integration.current_scheduled_ship_date)}
                  </td>
                  {(userAccess === 'edit_access' || userAccess === 'admin_access') && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button className="text-blue-600 hover:text-blue-800" onClick={(e) => handleEdit(e, integration)}>Edit</button>
                    </td>
                  )}
                </tr>
                {expandedRows.has(integration.id) && (
                  <tr>
                    <td colSpan={(userAccess === 'edit_access' || userAccess === 'admin_access') ? 9 : 8} className="px-6 py-4 bg-gray-50">
                      <div className="space-y-4">
                        {integration.job_address && (
                          <div>
                            <span className="text-sm font-medium text-gray-900">Job Address: </span>
                            <span className="text-sm text-gray-600">{integration.job_address}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium text-gray-900">Purchase Orders</h4>
                          {(userAccess === 'edit_access' || userAccess === 'admin_access') && (
                            <button 
                              onClick={(e) => handleAddPO(e, integration.id)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                            >
                              Add PO
                            </button>
                          )}
                        </div>
                        {integration.purchase_orders.map((po) => {
                          const hasDateIssue = po.components.some(component => 
                            isPOComponentDateIssue(component.current_scheduled_ship_date, integration.current_scheduled_ship_date)
                          )
                          
                          return (
                            <div key={po.id} className={`border rounded-lg p-4 ${hasDateIssue ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
                              <div className="flex justify-between items-center mb-2">
                                <h5 className="text-sm font-medium text-gray-900">
                                  PO: {po.po_number}
                                  {po.vendor && <span className="text-gray-600"> - {po.vendor}</span>}
                                </h5>
                                {(userAccess === 'edit_access' || userAccess === 'admin_access') && (
                                  <button 
                                    onClick={(e) => handleEditPO(e, po)}
                                    className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700 transition-colors"
                                  >
                                    Edit PO
                                  </button>
                                )}
                              </div>
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Component
                                      </th>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantity
                                      </th>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Original Ship Date
                                      </th>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Current Ship Date
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {po.components.map((component) => (
                                      <tr key={component.id}>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                          {component.component_name}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                          {component.quantity}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                          {formatDate(component.original_scheduled_ship_date)}
                                        </td>
                                        <td className={`px-3 py-2 whitespace-nowrap text-sm ${getShipDateColorClass(component.original_scheduled_ship_date, component.current_scheduled_ship_date)}`}>
                                          {formatDate(component.current_scheduled_ship_date)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <EditIntegrationModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        integration={selectedItem}
        userAccess={userAccess}
        onItemUpdated={handleItemUpdated}
      />

      {/* Add PO Modal */}
      <AddPOModal
        isOpen={addPOModalOpen}
        onClose={() => setAddPOModalOpen(false)}
        parentType="integration"
        parentId={selectedItemForPO}
        companyId={companyId}
        onPOAdded={handlePOUpdated}
      />

      {/* Edit PO Modal */}
      <EditPOModal
        isOpen={editPOModalOpen}
        onClose={() => setEditPOModalOpen(false)}
        purchaseOrder={selectedPO}
        userAccess={userAccess}
        onPOUpdated={handlePOUpdated}
      />
    </div>
  )
} 