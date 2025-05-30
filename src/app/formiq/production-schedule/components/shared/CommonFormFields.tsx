import React from 'react'
import { CommonFormData } from '../../types'

interface CommonFormFieldsProps {
  formData: CommonFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function CommonFormFields({ formData, onChange }: CommonFormFieldsProps) {
  return (
    <>
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
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            placeholder="e.g., SO-2024-001"
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
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            placeholder="Customer name"
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
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            placeholder="Job/Project name"
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
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            placeholder="Job site address"
          />
        </div>
      </div>

      {/* Completed Status */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="completed"
          checked={formData.completed}
          onChange={onChange}
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
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>
      </div>
    </>
  )
} 