'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Quote {
  id: string
  quote_number: string
  quote_name: string
  due_date: string | null
  status: string
  total_amount: number
  notes: string | null
  domestic_requirements: string
  wbe_requirements: string
  created_at: string
  updated_at: string
  created_by: string
  creator: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
}

interface UserData {
  id: string
  first_name: string
  last_name: string
  email: string
  company_id: string
  quotes_access: string
  is_approved: boolean
}

interface QuoteDetailsContentProps {
  quote: Quote
  userData: UserData
}

export default function QuoteDetailsContent({ quote, userData }: QuoteDetailsContentProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editedQuote, setEditedQuote] = useState({
    quote_name: quote.quote_name,
    due_date: quote.due_date || '',
    notes: quote.notes || '',
    domestic_requirements: quote.domestic_requirements,
    wbe_requirements: quote.wbe_requirements
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedQuote(prev => ({ ...prev, [name]: value }))
    if (saveError) setSaveError(null)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError(null)

    try {
      const response = await fetch(`/api/quotes/${quote.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedQuote),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update quote')
      }

      // Refresh the page to show updated data
      router.refresh()
      setIsEditing(false)
      
    } catch (error) {
      console.error('Error updating quote:', error)
      setSaveError(error instanceof Error ? error.message : 'Failed to update quote')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedQuote({
      quote_name: quote.quote_name,
      due_date: quote.due_date || '',
      notes: quote.notes || '',
      domestic_requirements: quote.domestic_requirements,
      wbe_requirements: quote.wbe_requirements
    })
    setIsEditing(false)
    setSaveError(null)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.push('/formiq/quotes')}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Quotes
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{quote.quote_number}</h1>
            <p className="text-gray-600 mt-1">
              Created by {quote.creator.first_name} {quote.creator.last_name} on {formatDate(quote.created_at)}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(quote.status)}`}>
              {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
            </span>
            
            {userData.quotes_access === 'edit_access' || userData.quotes_access === 'admin_access' ? (
              isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Quote
                </button>
              )
            ) : null}
          </div>
        </div>
      </div>

      {/* Save Error */}
      {saveError && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {saveError}
        </div>
      )}

      {/* Quote Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quote Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quote Information</h2>
            
            <div className="space-y-4">
              {/* Quote Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quote Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="quote_name"
                    value={editedQuote.quote_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                ) : (
                  <p className="text-gray-900">{quote.quote_name}</p>
                )}
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="due_date"
                    value={editedQuote.due_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                ) : (
                  <p className="text-gray-900">
                    {quote.due_date ? formatDate(quote.due_date) : 'No due date set'}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                {isEditing ? (
                  <textarea
                    name="notes"
                    value={editedQuote.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Enter quote notes"
                  />
                ) : (
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {quote.notes || 'No notes provided'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Domestic Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Domestic Requirements
                </label>
                {isEditing ? (
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="domestic_requirements"
                        value="yes"
                        checked={editedQuote.domestic_requirements === 'yes'}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="text-gray-900">Yes</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="domestic_requirements"
                        value="no"
                        checked={editedQuote.domestic_requirements === 'no'}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="text-gray-900">No</span>
                    </label>
                  </div>
                ) : (
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    quote.domestic_requirements === 'yes' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {quote.domestic_requirements === 'yes' ? 'Required' : 'Not Required'}
                  </span>
                )}
              </div>

              {/* WBE Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  WBE Requirements
                </label>
                {isEditing ? (
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="wbe_requirements"
                        value="yes"
                        checked={editedQuote.wbe_requirements === 'yes'}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="text-gray-900">Yes</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="wbe_requirements"
                        value="no"
                        checked={editedQuote.wbe_requirements === 'no'}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="text-gray-900">No</span>
                    </label>
                  </div>
                ) : (
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    quote.wbe_requirements === 'yes' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {quote.wbe_requirements === 'yes' ? 'Required' : 'Not Required'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quote Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quote Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(quote.total_amount)}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Status</span>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(quote.status)}`}>
                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Timeline</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Quote Created</p>
                  <p className="text-xs text-gray-500">{formatDate(quote.created_at)}</p>
                  <p className="text-xs text-gray-500">
                    by {quote.creator.first_name} {quote.creator.last_name}
                  </p>
                </div>
              </div>
              
              {quote.updated_at !== quote.created_at && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Updated</p>
                    <p className="text-xs text-gray-500">{formatDate(quote.updated_at)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 