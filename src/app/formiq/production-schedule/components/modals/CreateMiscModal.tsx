'use client'

import { useState } from 'react'
import { createClient } from '../../../../../../lib/supabase'
import { MiscFormData } from '../../types'
import CommonFormFields from '../shared/CommonFormFields'

interface CreateMiscModalProps {
  isOpen: boolean
  onClose: () => void
  companyId: string
  onItemCreated: () => void
}

export default function CreateMiscModal({ 
  isOpen, 
  onClose, 
  companyId, 
  onItemCreated 
}: CreateMiscModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<MiscFormData>({
    quantity: 1,
    description: '',
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

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('misc')
        .insert({
          quantity: formData.quantity,
          description: formData.description,
          sales_order_number: formData.sales_order_number,
          customer: formData.customer,
          job_name: formData.job_name || null,
          job_address: formData.job_address || null,
          dwg_rev: formData.dwg_rev || null,
          completed: formData.completed,
          original_scheduled_ship_date: formData.original_scheduled_ship_date,
          current_scheduled_ship_date: formData.current_scheduled_ship_date,
          company_id: companyId
        })

      if (error) throw error

      // Reset form and close modal
      setFormData({
        quantity: 1,
        description: '',
        sales_order_number: '',
        customer: '',
        job_name: '',
        job_address: '',
        dwg_rev: '',
        completed: false,
        original_scheduled_ship_date: '',
        current_scheduled_ship_date: ''
      })
      onClose()
      onItemCreated()
    } catch (error) {
      console.error('Error creating misc item:', error)
      alert('Error creating misc item. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked 
              : name === 'quantity' ? parseInt(value) || 1 
              : value
    }))
  }

  return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Create New Misc Item</h3>
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

          {/* Misc-specific fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="Item description"
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
              {isSubmitting ? 'Creating...' : 'Create Misc Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 