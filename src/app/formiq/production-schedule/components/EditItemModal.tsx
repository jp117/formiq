'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../../../../lib/supabase'

interface BaseItem {
  id: string;
  sales_order_number: string;
  customer: string;
  job_name?: string;
  job_address?: string;
  completed: boolean;
  original_scheduled_ship_date: string;
  current_scheduled_ship_date: string;
  designation?: string;
  nema_type?: string;
  number_of_sections?: number;
  type?: string;
  quantity?: number;
  description?: string;
}

interface EditItemModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'switchboards' | 'integration' | 'misc'
  item: BaseItem | null
  userAccess: string
  onItemUpdated: () => void
}

export default function EditItemModal({ 
  isOpen, 
  onClose, 
  type, 
  item,
  userAccess,
  onItemUpdated 
}: EditItemModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    designation: '',
    nema_type: '',
    number_of_sections: 1,
    type: '',
    quantity: 1,
    description: '',
    sales_order_number: '',
    customer: '',
    job_name: '',
    job_address: '',
    completed: false,
    original_scheduled_ship_date: '',
    current_scheduled_ship_date: ''
  })

  const supabase = createClient()

  // Populate form when item changes
  useEffect(() => {
    if (item) {
      setFormData({
        designation: item.designation || '',
        nema_type: item.nema_type || '',
        number_of_sections: item.number_of_sections || 1,
        type: item.type || '',
        quantity: item.quantity || 1,
        description: item.description || '',
        sales_order_number: item.sales_order_number || '',
        customer: item.customer || '',
        job_name: item.job_name || '',
        job_address: item.job_address || '',
        completed: item.completed || false,
        original_scheduled_ship_date: item.original_scheduled_ship_date || '',
        current_scheduled_ship_date: item.current_scheduled_ship_date || ''
      })
    }
  }, [item])

  if (!isOpen || !item) return null

  const getTitle = () => {
    switch (type) {
      case 'switchboards': return `Edit Switchboard: ${item.designation}`
      case 'integration': return `Edit Integration: ${item.designation}`
      case 'misc': return `Edit Misc Item: ${item.description}`
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      interface UpdateData {
        sales_order_number: string;
        customer: string;
        job_name: string | null;
        job_address: string | null;
        completed: boolean;
        original_scheduled_ship_date: string;
        current_scheduled_ship_date: string;
        designation?: string;
        nema_type?: string;
        number_of_sections?: number;
        type?: string;
        quantity?: number;
        description?: string;
      }

      let data: UpdateData = {
        sales_order_number: formData.sales_order_number,
        customer: formData.customer,
        job_name: formData.job_name || null,
        job_address: formData.job_address || null,
        completed: formData.completed,
        original_scheduled_ship_date: formData.original_scheduled_ship_date,
        current_scheduled_ship_date: formData.current_scheduled_ship_date
      }

      if (type === 'switchboards') {
        data = {
          ...data,
          designation: formData.designation,
          nema_type: formData.nema_type,
          number_of_sections: formData.number_of_sections
        }
      } else if (type === 'integration') {
        data = {
          ...data,
          designation: formData.designation,
          type: formData.type
        }
      } else if (type === 'misc') {
        data = {
          ...data,
          quantity: formData.quantity,
          description: formData.description
        }
      }

      const { error } = await supabase
        .from(type)
        .update(data)
        .eq('id', item.id)

      if (error) throw error

      onClose()
      onItemUpdated()
    } catch (error) {
      console.error('Error updating item:', error)
      alert('Error updating item. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type: inputType } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? (e.target as HTMLInputElement).checked 
              : (name === 'quantity' || name === 'number_of_sections') ? parseInt(value) || 1 
              : value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{getTitle()}</h3>
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
          {/* Sales Order & Customer - Required for all types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sales Order Number *
              </label>
              <input
                type="text"
                name="sales_order_number"
                value={formData.sales_order_number}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer *
              </label>
              <input
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Job Name & Address - Optional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Name
                <span className="text-gray-400 text-xs ml-1">(optional)</span>
              </label>
              <input
                type="text"
                name="job_name"
                value={formData.job_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Address
                <span className="text-gray-400 text-xs ml-1">(optional)</span>
              </label>
              <input
                type="text"
                name="job_address"
                value={formData.job_address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Type-specific fields */}
          {type === 'switchboards' && (
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
          )}

          {type === 'integration' && (
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
          )}

          {type === 'misc' && (
            <>
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                />
              </div>
            </>
          )}

          {/* Completed Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="completed"
              checked={formData.completed}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Mark as completed
            </label>
          </div>

          {/* Ship dates */}
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
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 