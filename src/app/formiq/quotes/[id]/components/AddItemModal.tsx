'use client'

import { useState } from 'react'

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
  quoteId: string
}

export default function AddItemModal({ isOpen, onClose, quoteId }: AddItemModalProps) {
  const [isNavigating, setIsNavigating] = useState<string | null>(null)

  const configuratorOptions = [
    {
      id: 'switchboard',
      title: 'Switchboard',
      description: 'Configure complete switchboard assemblies',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      hoverColor: 'hover:bg-blue-200',
      route: `/formiq/quotes/${quoteId}/configurator/switchboard`
    },
    {
      id: 'panel',
      title: 'Panel',
      description: 'Design and configure electrical panels',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      color: 'bg-green-100 text-green-800 border-green-200',
      hoverColor: 'hover:bg-green-200',
      route: `/formiq/quotes/${quoteId}/configurator/panel`
    },
    {
      id: 'components',
      title: 'Individual Components',
      description: 'Add specific electrical components',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      hoverColor: 'hover:bg-purple-200',
      route: `/formiq/quotes/${quoteId}/configurator/components`
    },
    {
      id: 'assembly',
      title: 'Pre-Built Assembly',
      description: 'Add from standard assembly library',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      hoverColor: 'hover:bg-orange-200',
      route: `/formiq/quotes/${quoteId}/configurator/assembly`
    },
    {
      id: 'import',
      title: 'Import from File',
      description: 'Upload CSV or Excel file with components',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      hoverColor: 'hover:bg-gray-200',
      route: `/formiq/quotes/${quoteId}/configurator/import`
    },
    {
      id: 'manual',
      title: 'Manual Entry',
      description: 'Add line items manually',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      hoverColor: 'hover:bg-yellow-200',
      route: `/formiq/quotes/${quoteId}/configurator/manual`
    }
  ]

  const handleOptionClick = (option: typeof configuratorOptions[0]) => {
    setIsNavigating(option.id)
    // TODO: Navigate to the configurator route
    console.log(`Navigating to: ${option.route}`)
    // For now, just close the modal after a brief delay
    setTimeout(() => {
      setIsNavigating(null)
      onClose()
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add Quote Items</h2>
              <p className="text-gray-600 mt-1">Choose how you&apos;d like to configure items for this quote</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isNavigating !== null}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {configuratorOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option)}
                disabled={isNavigating !== null}
                className={`
                  p-6 rounded-lg border-2 text-left transition-all duration-200 
                  ${option.color} ${option.hoverColor}
                  hover:shadow-md hover:scale-105 
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  ${isNavigating === option.id ? 'ring-2 ring-blue-500' : ''}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {isNavigating === option.id ? (
                      <svg className="animate-spin h-8 w-8" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      option.icon
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                    <p className="text-sm opacity-80">{option.description}</p>
                    {isNavigating === option.id && (
                      <p className="text-xs mt-2 opacity-70">Opening configurator...</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Each configurator will help you build specific types of equipment and automatically calculate pricing.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 