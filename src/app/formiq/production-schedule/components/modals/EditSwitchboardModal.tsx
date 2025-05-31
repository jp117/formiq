'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../../../../../lib/supabase'
import { Switchboard, SwitchboardFormData } from '../../types'
import CommonFormFields from '../shared/CommonFormFields'

interface EditSwitchboardModalProps {
  isOpen: boolean
  onClose: () => void
  switchboard: Switchboard | null
  userAccess: string
  onItemUpdated: () => void
}

export default function EditSwitchboardModal({ 
  isOpen, 
  onClose, 
  switchboard,
  userAccess,
  onItemUpdated 
}: EditSwitchboardModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<SwitchboardFormData>({
    designation: '',
    nema_type: '',
    number_of_sections: 1,
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

  // Populate form when switchboard changes
  useEffect(() => {
    if (switchboard) {
      setFormData({
        designation: switchboard.designation,
        nema_type: switchboard.nema_type,
        number_of_sections: switchboard.number_of_sections,
        sales_order_number: switchboard.sales_order_number,
        customer: switchboard.customer,
        job_name: switchboard.job_name || '',
        job_address: switchboard.job_address || '',
        dwg_rev: switchboard.dwg_rev || '',
        completed: switchboard.completed,
        original_scheduled_ship_date: switchboard.original_scheduled_ship_date,
        current_scheduled_ship_date: switchboard.current_scheduled_ship_date
      })
    }
  }, [switchboard])

  if (!isOpen || !switchboard) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('switchboards')
        .update({
          designation: formData.designation,
          nema_type: formData.nema_type,
          number_of_sections: formData.number_of_sections,
          sales_order_number: formData.sales_order_number,
          customer: formData.customer,
          job_name: formData.job_name || null,
          job_address: formData.job_address || null,
          dwg_rev: formData.dwg_rev || null,
          completed: formData.completed,
          original_scheduled_ship_date: formData.original_scheduled_ship_date,
          current_scheduled_ship_date: formData.current_scheduled_ship_date
        })
        .eq('id', switchboard.id)

      if (error) throw error

      onClose()
      onItemUpdated()
    } catch (error) {
      console.error('Error updating switchboard:', error)
      alert('Error updating switchboard. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked 
              : name === 'number_of_sections' ? parseInt(value) || 1 
              : value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Edit Switchboard: {switchboard.designation}</h3>
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

          {/* Switchboard-specific fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                NEMA Type *
              </label>
              <input
                type="text"
                name="nema_type"
                value={formData.nema_type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Sections *
              </label>
              <input
                type="number"
                name="number_of_sections"
                value={formData.number_of_sections}
                onChange={handleChange}
                required
                min="1"
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
              {isSubmitting ? 'Updating...' : 'Update Switchboard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 