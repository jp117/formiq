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
      id: 'distributor-items',
      title: 'Distributor Items',
      description: 'Add items from distributor catalog',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 1L20 7l-8 4" />
        </svg>
      ),
      color: 'bg-green-100 text-green-800 border-green-200',
      hoverColor: 'hover:bg-green-200',
      route: `/formiq/quotes/${quoteId}/configurator/distributor-items`
    }
  ]

  const handleOptionClick = (option: typeof configuratorOptions[0]) => {
    setIsNavigating(option.id)
    
    // Navigate to the appropriate configurator
    if (option.id === 'switchboard') {
      // Navigate to switchboard configurator
      window.location.href = option.route
    } else {
      // For other options, show a coming soon message
      console.log(`Navigating to: ${option.route}`)
      setTimeout(() => {
        setIsNavigating(null)
        onClose()
        alert('This configurator is coming soon!')
      }, 1000)
    }
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