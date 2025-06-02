'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import EditSwitchboardModal from './modals/EditSwitchboardModal'
import AddPOModal from './AddPOModal'
import EditPOModal from './EditPOModal'
import { Switchboard, PurchaseOrder } from '../types'

interface SwitchboardsTableProps {
  switchboards: Switchboard[]
  userAccess: string
  companyId: string
}

export default function SwitchboardsTable({ switchboards, userAccess, companyId }: SwitchboardsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Switchboard | null>(null)
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

  const handleEdit = (e: React.MouseEvent, switchboard: Switchboard) => {
    e.stopPropagation() // Prevent row expansion
    setSelectedItem(switchboard)
    setEditModalOpen(true)
  }

  const handleItemUpdated = () => {
    // Refresh the page to show updated data
    router.refresh()
  }

  const handleAddPO = (e: React.MouseEvent, switchboardId: string) => {
    e.stopPropagation()
    setSelectedItemForPO(switchboardId)
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

  const isPOComponentDateIssue = (componentDate: string, switchboardDate: string) => {
    const component = new Date(componentDate)
    const switchboard = new Date(switchboardDate)
    const twoWeeksBefore = new Date(switchboard)
    twoWeeksBefore.setDate(switchboard.getDate() - 14)
    
    return component > twoWeeksBefore // Component date is not at least 2 weeks before switchboard date
  }

  const hasSwitchboardDateIssues = (switchboard: Switchboard) => {
    return switchboard.purchase_orders.some(po => 
      po.components.some(component => 
        isPOComponentDateIssue(component.current_scheduled_ship_date, switchboard.current_scheduled_ship_date)
      )
    )
  }

  // Helper function to check if all components in a PO are received
  const isPOReady = (po: PurchaseOrder) => {
    if (!po.components || po.components.length === 0) return false
    return po.components.every((component) => component.received)
  }

  // Helper function to check if all POs for an item have all components received
  const isItemReady = (item: Switchboard) => {
    if (!item.purchase_orders || item.purchase_orders.length === 0) return false
    return item.purchase_orders.every((po) => isPOReady(po))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Switchboards</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-8 px-3 py-3"></th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Designation
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sales Order
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Name
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                NEMA Type
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sections
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dwg Rev
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Ship Date
              </th>
              {(userAccess === 'edit_access' || userAccess === 'admin_access') && (
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {switchboards.length === 0 ? (
              <tr>
                <td colSpan={(userAccess === 'edit_access' || userAccess === 'admin_access') ? 10 : 9} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <svg className="w-8 h-8 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-500 mb-2">No switchboards found</p>
                    <p className="text-xs text-gray-400">Click &quot;New Schedule&quot; to create your first switchboard</p>
                  </div>
                </td>
              </tr>
            ) : (
              switchboards.map((switchboard) => (
                <React.Fragment key={switchboard.id}>
                  <tr
                    className={`cursor-pointer transition-colors ${
                      hasSwitchboardDateIssues(switchboard)
                        ? 'bg-red-100 hover:bg-red-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleRow(switchboard.id)
                    }}
                  >
                    <td className="px-3 py-3 whitespace-nowrap">
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg
                          className={`w-4 h-4 transform transition-transform ${
                            expandedRows.has(switchboard.id) ? 'rotate-90' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </td>
                    <td className="px-3 py-3 text-sm font-medium text-gray-900">
                      <div className="flex items-center justify-center gap-2">
                        <span className="max-w-32 truncate" title={switchboard.designation}>
                          {switchboard.designation}
                        </span>
                        {isItemReady(switchboard) && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            ✓
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 text-center max-w-24">
                      <span className="block truncate" title={switchboard.sales_order_number}>
                        {switchboard.sales_order_number}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 text-center max-w-32">
                      <span className="block truncate" title={switchboard.customer}>
                        {switchboard.customer}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 text-center max-w-40">
                      <span className="block truncate" title={switchboard.job_name || switchboard.job_address || '-'}>
                        {switchboard.job_name || switchboard.job_address || '-'}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                      {switchboard.nema_type}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                      {switchboard.number_of_sections}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                      {switchboard.dwg_rev || '-'}
                    </td>
                    <td className={`px-3 py-3 whitespace-nowrap text-sm text-center ${getShipDateColorClass(switchboard.original_scheduled_ship_date, switchboard.current_scheduled_ship_date)}`}>
                      {formatDate(switchboard.current_scheduled_ship_date)}
                    </td>
                    {(userAccess === 'edit_access' || userAccess === 'admin_access') && (
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                        <button className="text-blue-600 hover:text-blue-800 mr-2" onClick={(e) => handleEdit(e, switchboard)}>Edit</button>
                      </td>
                    )}
                  </tr>
                  {expandedRows.has(switchboard.id) && (
                    <tr>
                      <td colSpan={(userAccess === 'edit_access' || userAccess === 'admin_access') ? 10 : 9} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-4">
                          {/* Summary Section */}
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Summary</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-gray-700">Original Ship Date:</span>
                                <span className="ml-2 text-gray-900">{formatDate(switchboard.original_scheduled_ship_date)}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Current Ship Date:</span>
                                <span className={`ml-2 ${getShipDateColorClass(switchboard.original_scheduled_ship_date, switchboard.current_scheduled_ship_date)}`}>
                                  {formatDate(switchboard.current_scheduled_ship_date)}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Material Status:</span>
                                <span className="ml-2">
                                  {isItemReady(switchboard) ? (
                                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                      ✓ Complete
                                    </span>
                                  ) : (
                                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                      Pending
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          {switchboard.job_address && (
                            <div>
                              <span className="text-sm font-medium text-gray-900">Job Address: </span>
                              <span className="text-sm text-gray-600">{switchboard.job_address}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium text-gray-900">Purchase Orders</h4>
                            {(userAccess === 'edit_access' || userAccess === 'admin_access') && (
                              <button 
                                onClick={(e) => handleAddPO(e, switchboard.id)}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                              >
                                Add PO
                              </button>
                            )}
                          </div>
                          {switchboard.purchase_orders.map((po) => {
                            const hasDateIssue = po.components.some(component => 
                              isPOComponentDateIssue(component.current_scheduled_ship_date, switchboard.current_scheduled_ship_date)
                            )
                            
                            return (
                              <div key={po.id} className={`border rounded-lg p-4 ${hasDateIssue ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
                                <div className="flex justify-between items-center mb-2">
                                  <div className="flex items-center gap-2">
                                    <h5 className="text-sm font-medium text-gray-900">
                                      PO: {po.po_number}
                                      {po.vendor && <span className="text-gray-600"> - {po.vendor}</span>}
                                    </h5>
                                    {isPOReady(po) && (
                                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                        ✓ Complete
                                      </span>
                                    )}
                                  </div>
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
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Description
                                        </th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Catalog Number
                                        </th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Quantity
                                        </th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Received
                                        </th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Notes
                                        </th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Original Ship Date
                                        </th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Current Ship Date
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                      {po.components?.map((component) => (
                                        <tr key={component.id} className="hover:bg-gray-50">
                                          <td className="px-3 py-2 text-sm text-gray-900 text-center">
                                            {component.component_name}
                                          </td>
                                          <td className="px-3 py-2 text-sm text-gray-900 text-center">
                                            {component.catalog_number || '-'}
                                          </td>
                                          <td className="px-3 py-2 text-sm text-gray-900 text-center">
                                            {component.quantity}
                                          </td>
                                          <td className="px-3 py-2 text-sm text-center">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                              component.received 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                              {component.received ? 'Received' : 'Pending'}
                                            </span>
                                          </td>
                                          <td className="px-3 py-2 text-sm text-gray-900 text-center">
                                            {component.notes || '-'}
                                          </td>
                                          <td className="px-3 py-2 text-sm text-gray-500 text-center">
                                            {formatDate(component.original_scheduled_ship_date)}
                                          </td>
                                          <td className={`px-3 py-2 text-sm text-center ${getShipDateColorClass(component.original_scheduled_ship_date, component.current_scheduled_ship_date)}`}>
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <EditSwitchboardModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        switchboard={selectedItem}
        userAccess={userAccess}
        onItemUpdated={handleItemUpdated}
      />

      {/* Add PO Modal */}
      <AddPOModal
        isOpen={addPOModalOpen}
        onClose={() => setAddPOModalOpen(false)}
        parentType="switchboards"
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