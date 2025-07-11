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
  version: string
  parent_quote_id: string | null
  version_notes: string | null
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
  const [isNavigating, setIsNavigating] = useState(false)
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false)
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

  const handleBackToQuotes = () => {
    setIsNavigating(true)
    router.push('/formiq/quotes')
  }

  const handleCreateVersion = async () => {
    // TODO: Implement version creation modal
    console.log('Create version functionality coming soon')
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleBackToQuotes}
            disabled={isNavigating}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center gap-2 transition-colors px-3 py-2 rounded-lg cursor-pointer active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isNavigating ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Going back...</span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Quotes
              </>
            )}
          </button>
        </div>

        {/* Quote Header - Similar to ABB's approach */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          {/* Collapsible Header */}
          <div 
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-200"
            onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 text-white p-2 rounded">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {quote.quote_number}
                    <span className="text-sm font-normal text-gray-500">
                      Version: {quote.version}
                    </span>
                  </h1>
                  <p className="text-sm text-gray-600">
                    {quote.quote_name}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(quote.status)}`}>
                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                </span>
                
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(quote.total_amount)}
                  </span>
                  
                  {userData.quotes_access === 'edit_access' || userData.quotes_access === 'admin_access' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCreateVersion()
                        }}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        New Version
                      </button>
                      
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCancel()
                            }}
                            disabled={isSaving}
                            className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSave()
                            }}
                            disabled={isSaving}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {isSaving ? (
                              <>
                                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Save
                              </>
                            ) : (
                              'Save'
                            )}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsEditing(true)
                            setIsHeaderExpanded(true)
                          }}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                      )}
                    </div>
                  ) : null}
                </div>
                
                <svg 
                  className={`h-5 w-5 text-gray-400 transition-transform ${isHeaderExpanded ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Expanded Header Details */}
          {isHeaderExpanded && (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Quote Owner</label>
                  <p className="text-gray-900">{quote.creator.first_name} {quote.creator.last_name}</p>
                </div>
                
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Created</label>
                  <p className="text-gray-900">{formatDate(quote.created_at)}</p>
                </div>
                
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Last Changed</label>
                  <p className="text-gray-900">{formatDate(quote.updated_at)}</p>
                </div>
                
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Due Date</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="due_date"
                      value={editedQuote.due_date}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-gray-900 text-sm"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {quote.due_date ? formatDate(quote.due_date) : 'No due date set'}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Currency</label>
                  <p className="text-gray-900">United States Dollar</p>
                </div>
                
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Version</label>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-900">{quote.version}</p>
                    {quote.parent_quote_id && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Revision
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-gray-600 font-medium mb-1">Description</label>
                  {isEditing ? (
                    <textarea
                      name="notes"
                      value={editedQuote.notes}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-gray-900 text-sm"
                      placeholder="Enter quote description"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {quote.notes || 'No description provided'}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Domestic Requirements</label>
                  {isEditing ? (
                    <div className="flex gap-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="domestic_requirements"
                          value="yes"
                          checked={editedQuote.domestic_requirements === 'yes'}
                          onChange={handleInputChange}
                          className="mr-1 h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-xs text-gray-900">Yes</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="domestic_requirements"
                          value="no"
                          checked={editedQuote.domestic_requirements === 'no'}
                          onChange={handleInputChange}
                          className="mr-1 h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-xs text-gray-900">No</span>
                      </label>
                    </div>
                  ) : (
                    <span className={`px-2 py-1 text-xs rounded ${
                      quote.domestic_requirements === 'yes' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {quote.domestic_requirements === 'yes' ? 'Required' : 'Not Required'}
                    </span>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-600 font-medium mb-1">WBE Requirements</label>
                  {isEditing ? (
                    <div className="flex gap-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="wbe_requirements"
                          value="yes"
                          checked={editedQuote.wbe_requirements === 'yes'}
                          onChange={handleInputChange}
                          className="mr-1 h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-xs text-gray-900">Yes</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="wbe_requirements"
                          value="no"
                          checked={editedQuote.wbe_requirements === 'no'}
                          onChange={handleInputChange}
                          className="mr-1 h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-xs text-gray-900">No</span>
                      </label>
                    </div>
                  ) : (
                    <span className={`px-2 py-1 text-xs rounded ${
                      quote.wbe_requirements === 'yes' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {quote.wbe_requirements === 'yes' ? 'Required' : 'Not Required'}
                    </span>
                  )}
                </div>
                
                {quote.version_notes && (
                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-gray-600 font-medium mb-1">Version Notes</label>
                    <p className="text-gray-900 text-sm italic">{quote.version_notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Error */}
      {saveError && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {saveError}
        </div>
      )}

      {/* Quote Items Section - Coming Soon */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Quote Items</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Total: {formatCurrency(quote.total_amount)}</span>
            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
              Add New Item
            </button>
          </div>
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No quote items yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first quote item.
          </p>
        </div>
      </div>
    </div>
  )
} 