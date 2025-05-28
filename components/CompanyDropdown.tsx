'use client'

import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { createClient } from '../lib/supabase'
import type { Company } from '../lib/supabase'

interface CompanyDropdownProps {
  value: string
  onChange: (companyId: string, companyName: string) => void
  required?: boolean
  className?: string
}

export default function CompanyDropdown({ value, onChange, required, className }: CompanyDropdownProps) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [displayValue, setDisplayValue] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // Fetch companies on mount
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .order('company_name')

        if (error) {
          console.error('Error fetching companies:', error)
          setError(`Failed to load companies: ${error.message}`)
        } else {
          setCompanies(data || [])
          if (data && data.length === 0) {
            setError('No companies found in database')
          }
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('Unexpected error loading companies')
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  // Set display value when value prop changes
  useEffect(() => {
    if (value && companies.length > 0) {
      const company = companies.find(c => c.id === value)
      if (company) {
        setDisplayValue(company.company_name)
        setSearchTerm(company.company_name)
      }
    }
  }, [value, companies])

  // Filter companies based on search term
  const filteredCompanies = companies.filter(company =>
    company.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value
    setSearchTerm(newSearchTerm)
    setDisplayValue(newSearchTerm)
    setIsOpen(true)
    setSelectedIndex(-1)
    
    // Clear selection if search doesn't match exactly
    const exactMatch = companies.find(c => 
      c.company_name.toLowerCase() === newSearchTerm.toLowerCase()
    )
    if (!exactMatch) {
      onChange('', '')
    }
  }

  // Handle company selection
  const selectCompany = (company: Company) => {
    setDisplayValue(company.company_name)
    setSearchTerm(company.company_name)
    setIsOpen(false)
    setSelectedIndex(-1)
    onChange(company.id, company.company_name)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true)
      setSelectedIndex(0)
      e.preventDefault()
      return
    }

    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < filteredCompanies.length - 1 ? prev + 1 : prev
        )
        break
      
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && filteredCompanies[selectedIndex]) {
          selectCompany(filteredCompanies[selectedIndex])
        }
        break
      
      case 'Tab':
        if (selectedIndex >= 0 && filteredCompanies[selectedIndex]) {
          e.preventDefault()
          selectCompany(filteredCompanies[selectedIndex])
        } else {
          setIsOpen(false)
        }
        break
      
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        })
      }
    }
  }, [selectedIndex])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getPlaceholder = () => {
    if (loading) return "Loading companies..."
    if (error) return "Error loading companies"
    if (companies.length === 0) return "No companies available"
    return "Search companies..."
  }

  return (
    <div ref={dropdownRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={getPlaceholder()}
        required={required}
        disabled={loading}
        className={className}
        autoComplete="organization"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-autocomplete="list"
        aria-controls="company-listbox"
      />
      
      {/* Dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Error message */}
      {error && (
        <div className="absolute z-10 w-full mt-1 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm">{error}</p>
          <p className="text-red-600 text-xs mt-1">
            Make sure your Supabase connection is configured and companies table exists.
          </p>
        </div>
      )}

      {/* Dropdown list */}
      {isOpen && !error && (
        <ul
          ref={listRef}
          id="company-listbox"
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company, index) => (
              <li
                key={company.id}
                onClick={() => selectCompany(company)}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                  index === selectedIndex ? 'bg-slate-100' : ''
                }`}
                role="option"
                aria-selected={index === selectedIndex}
              >
                <div className="font-medium text-gray-900">{company.company_name}</div>
                <div className="text-sm text-gray-500">{company.domain}</div>
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-gray-500 text-center">
              {loading ? 'Loading...' : 'No companies found'}
            </li>
          )}
        </ul>
      )}
    </div>
  )
} 