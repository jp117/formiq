'use client'

import { useRouter } from 'next/navigation'

interface QuoteCardProps {
  quote: {
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
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const path = `/formiq/quotes/${quote.id}`
    
    // Try router.push first, fallback to window.location
    try {
      router.push(path)
    } catch (error) {
      console.error('Router.push failed, using window.location:', error)
      window.location.href = path
    }
  }
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="space-y-3">
        {/* Quote Number */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{quote.quote_number}</h3>
            <span className="text-sm text-gray-500">{quote.version}</span>
            {quote.parent_quote_id && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                REV
              </span>
            )}
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(quote.status)}`}>
            {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
          </span>
        </div>
        
        {/* Quote Name */}
        <p className="font-medium text-gray-800">{quote.quote_name}</p>
        
        {/* Notes (if available) */}
        {quote.notes && (
          <p className="text-sm text-gray-600 truncate">{quote.notes}</p>
        )}
        
        {/* Amount */}
        <div className="text-lg font-semibold text-blue-600">
          {formatCurrency(quote.total_amount)}
        </div>
        
        {/* Requirements */}
        <div className="flex gap-2 text-xs">
          {quote.domestic_requirements === 'yes' && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
              Domestic
            </span>
          )}
          {quote.wbe_requirements === 'yes' && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
              WBE
            </span>
          )}
        </div>
        
        {/* Due Date */}
        {quote.due_date && (
          <p className="text-sm text-gray-500">
            Due: {formatDate(quote.due_date)}
          </p>
        )}
        
        {/* Creator & Created Date */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Created by {quote.creator.first_name} {quote.creator.last_name}
            </span>
            <span>
              {formatDate(quote.created_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 