'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../../../../../lib/supabase'
import { Integration, IntegrationFormData } from '../../types'
import CommonFormFields from '../shared/CommonFormFields'

interface EditIntegrationModalProps {
  isOpen: boolean
  onClose: () => void
  integration: Integration | null
  userAccess: string
  onItemUpdated: () => void
}

export default function EditIntegrationModal({ 
  isOpen, 
  onClose, 
  integration,
  userAccess,
  onItemUpdated 
}: EditIntegrationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<IntegrationFormData>({
    designation: '',
    type: '',
    sales_order_number: '',
    customer: '',
    job_name: '',
    job_address: '',
    dwg_rev: '',
    completed: false,
    original_scheduled_ship_date: '',
    current_scheduled_ship_date: ''
  })

  const supabase = createClient()

  // Populate form when integration changes
  useEffect(() => {
    if (integration) {
      setFormData({
        designation: integration.designation,
        type: integration.type,
        sales_order_number: integration.sales_order_number,
        customer: integration.customer,
        job_name: integration.job_name || '',
        job_address: integration.job_address || '',
        dwg_rev: integration.dwg_rev || '',
        completed: integration.completed,
        original_scheduled_ship_date: integration.original_scheduled_ship_date,
        current_scheduled_ship_date: integration.current_scheduled_ship_date
      })
    }
  }, [integration])

  if (!isOpen || !integration) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('integration')
        .update({
          designation: formData.designation,
          type: formData.type,
          sales_order_number: formData.sales_order_number,
          customer: formData.customer,
          job_name: formData.job_name || null,
          job_address: formData.job_address || null,
          dwg_rev: formData.dwg_rev || null,
          completed: formData.completed,
          original_scheduled_ship_date: formData.original_scheduled_ship_date,
          current_scheduled_ship_date: formData.current_scheduled_ship_date
        })
        .eq('id', integration.id)

      if (error) throw error

      onClose()
      onItemUpdated()
    } catch (error) {
      console.error('Error updating integration:', error)
      alert('Error updating integration. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Edit Integration: {integration.designation}</h3>
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
          <CommonFormFields formData={formData} onChange={handleChange} />

          {/* Integration-specific fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation *
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Original Ship Date - Admin Access Control */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Original Scheduled Ship Date *
              </label>
              <input
                type="date"
                name="original_scheduled_ship_date"
                value={formData.original_scheduled_ship_date}
                onChange={handleChange}
                required
                disabled={userAccess !== 'admin_access'}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                  userAccess === 'admin_access' 
                    ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900' 
                    : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Scheduled Ship Date *
              </label>
              <input
                type="date"
                name="current_scheduled_ship_date"
                value={formData.current_scheduled_ship_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
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
              {isSubmitting ? 'Updating...' : 'Update Integration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 