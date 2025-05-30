'use client'

import { useState } from 'react'
import { createClient } from '../../../../../lib/supabase'

interface AddPOModalProps {
  isOpen: boolean
  onClose: () => void
  parentType: 'switchboards' | 'integration' | 'misc'
  parentId: string
  companyId: string
  onPOAdded: () => void
}

export default function AddPOModal({ 
  isOpen, 
  onClose, 
  parentType, 
  parentId,
  companyId,
  onPOAdded 
}: AddPOModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    po_number: '',
    vendor: ''
  })

  const supabase = createClient()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const insertData: {
        po_number: string;
        vendor: string;
        company_id: string;
        switchboard_id?: string;
        integration_id?: string;
        misc_id?: string;
      } = {
        po_number: formData.po_number,
        vendor: formData.vendor,
        company_id: companyId
      }

      // Set the appropriate foreign key based on product type
      if (parentType === 'switchboards') {
        insertData.switchboard_id = parentId
      } else if (parentType === 'integration') {
        insertData.integration_id = parentId
      } else if (parentType === 'misc') {
        insertData.misc_id = parentId
      }

      console.log('Attempting to insert PO with data:', insertData)

      const { data, error } = await supabase
        .from('purchase_orders')
        .insert([insertData])
        .select()

      if (error) throw error

      if (data && data[0]) {
        // Successfully created
        // Reset form and close modal
        setFormData({
          po_number: '',
          vendor: ''
        })
        onClose()
        onPOAdded()
      }
    } catch (error) {
      console.error('Error creating PO:', error)
      alert('Error creating purchase order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Add Purchase Order</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PO Number *
            </label>
            <input
              type="text"
              name="po_number"
              value={formData.po_number}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="e.g., PO-2024-001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendor *
            </label>
            <input
              type="text"
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="Vendor name"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Adding...' : 'Add PO'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 