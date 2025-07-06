'use client'

import { useState, useEffect } from 'react'
import NewQuoteModal from './NewQuoteModal'
import QuoteCardSkeleton from './QuoteCardSkeleton'
import QuoteCard from './QuoteCard'

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

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
}

export default function QuotesContent() {
  const [isNewQuoteModalOpen, setIsNewQuoteModalOpen] = useState(false)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedCreator, setSelectedCreator] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch quotes
  const fetchQuotes = async (createdBy?: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const url = new URL('/api/quotes', window.location.origin)
      if (createdBy) {
        url.searchParams.append('created_by', createdBy)
      }
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch quotes')
      }
      
      setQuotes(data.quotes || [])
    } catch (error) {
      console.error('Error fetching quotes:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch quotes')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch users who have created quotes
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/quotes/users')
      const data = await response.json()
      
      if (response.ok) {
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchQuotes()
    fetchUsers()
  }, [])

  // Filter quotes when creator filter changes
  useEffect(() => {
    fetchQuotes(selectedCreator || undefined)
  }, [selectedCreator])

  // Filter quotes by search term
  const filteredQuotes = quotes.filter(quote => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      quote.quote_number.toLowerCase().includes(searchLower) ||
      quote.quote_name.toLowerCase().includes(searchLower) ||
      (quote.notes && quote.notes.toLowerCase().includes(searchLower)) ||
      `${quote.creator.first_name} ${quote.creator.last_name}`.toLowerCase().includes(searchLower)
    )
  })

  const handleQuoteCreated = () => {
    // Refresh quotes after creating a new one
    fetchQuotes(selectedCreator || undefined)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">The Quotes App</h1>
        
        {/* Description with New Quote button and Search box on the same line */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-gray-600">
            Manage and track your customer quotes and proposals.
          </p>
          
          <div className="flex items-center gap-3">
            {/* User Filter Dropdown */}
            <select
              value={selectedCreator}
              onChange={(e) => setSelectedCreator(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="">All Users</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </select>

            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search quotes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* New Quote Button */}
            <button 
              onClick={() => setIsNewQuoteModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Quote
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Recently Quoted Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {selectedCreator ? `Quotes by ${users.find(u => u.id === selectedCreator)?.first_name} ${users.find(u => u.id === selectedCreator)?.last_name}` : 'Recent Quotes'}
          </h2>
          <span className="text-sm text-gray-500">
            {filteredQuotes.length} quote{filteredQuotes.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {/* Grid of Quote Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading ? (
            // Show skeleton cards while loading
            Array.from({ length: 8 }).map((_, index) => (
              <QuoteCardSkeleton key={index} />
            ))
          ) : filteredQuotes.length > 0 ? (
            // Show real quote cards
            filteredQuotes.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} />
            ))
          ) : (
            // Show empty state
            <div className="col-span-full text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No quotes found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedCreator ? 'Try adjusting your search or filter.' : 'Get started by creating your first quote.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Quote Modal */}
      <NewQuoteModal 
        isOpen={isNewQuoteModalOpen}
        onClose={() => setIsNewQuoteModalOpen(false)}
        onQuoteCreated={handleQuoteCreated}
      />
    </div>
  )
} 