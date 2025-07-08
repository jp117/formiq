'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface NewQuoteModalProps {
  isOpen: boolean
  onClose: () => void
  onQuoteCreated?: () => void
}

export default function NewQuoteModal({ isOpen, onClose, onQuoteCreated }: NewQuoteModalProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    quoteName: '',
    dueDate: '',
    notes: '',
    domesticRequirements: '',
    wbeRequirements: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (submitError) setSubmitError(null)
  }

  // Check if all required fields are filled
  const isFormValid = formData.quoteName.trim() !== '' && 
                     formData.domesticRequirements !== '' && 
                     formData.wbeRequirements !== ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.quoteName.trim()) {
      setSubmitError('Quote Name is required')
      return
    }
    
    if (!formData.domesticRequirements) {
      setSubmitError('Domestic Requirements selection is required')
      return
    }
    
    if (!formData.wbeRequirements) {
      setSubmitError('WBE Requirements selection is required')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create quote')
      }

      // Close modal and reset form first
      onClose()
      setFormData({
        quoteName: '',
        dueDate: '',
        notes: '',
        domesticRequirements: '',
        wbeRequirements: ''
      })
      
      // Notify parent component
      if (onQuoteCreated) {
        onQuoteCreated()
      }
      
      // Navigate to the new quote page
      const path = `/formiq/quotes/${data.quote.id}`
      
      try {
        router.push(path)
      } catch (error) {
        console.error('Router.push failed, using window.location:', error)
        window.location.href = path
      }

    } catch (error) {
      console.error('Error creating quote:', error)
      setSubmitError(error instanceof Error ? error.message : 'Failed to create quote')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
    setFormData({
      quoteName: '',
      dueDate: '',
      notes: '',
      domesticRequirements: '',
      wbeRequirements: ''
    })
    setSubmitError(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">New Quote</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {submitError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quote Name */}
            <div>
              <label htmlFor="quoteName" className="block text-sm font-medium text-gray-700 mb-2">
                Quote Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="quoteName"
                name="quoteName"
                value={formData.quoteName}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:bg-gray-100"
                placeholder="Enter quote name"
              />
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:bg-gray-100"
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:bg-gray-100"
                placeholder="Enter quote notes"
              />
            </div>

            {/* Domestic Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Domestic Requirements <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="domesticRequirements"
                    value="yes"
                    checked={formData.domesticRequirements === 'yes'}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:opacity-50"
                  />
                  <span className="text-gray-900">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="domesticRequirements"
                    value="no"
                    checked={formData.domesticRequirements === 'no'}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:opacity-50"
                  />
                  <span className="text-gray-900">No</span>
                </label>
              </div>
            </div>

            {/* WBE Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                WBE Requirements <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="wbeRequirements"
                    value="yes"
                    checked={formData.wbeRequirements === 'yes'}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:opacity-50"
                  />
                  <span className="text-gray-900">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="wbeRequirements"
                    value="no"
                    checked={formData.wbeRequirements === 'no'}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:opacity-50"
                  />
                  <span className="text-gray-900">No</span>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center ${
                  isFormValid && !isSubmitting
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Quote'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 