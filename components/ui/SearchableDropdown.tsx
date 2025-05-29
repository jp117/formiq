'use client'

import { useRef, useState, useEffect } from 'react'

export interface DropdownOption {
  id: string
  label: string
  subtitle?: string
  data?: unknown
}

interface SearchableDropdownProps {
  options: DropdownOption[]
  value: string
  onChange: (value: string, option: DropdownOption | null) => void
  placeholder?: string
  loading?: boolean
  error?: string | null
  required?: boolean
  disabled?: boolean
  className?: string
  noOptionsMessage?: string
}

export default function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = "Search...",
  loading = false,
  error = null,
  required = false,
  disabled = false,
  className = "",
  noOptionsMessage = "No options found"
}: SearchableDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const lastValueRef = useRef<string>('')

  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(-1)

  // Initialize display value only once when value changes
  const [displayValue, setDisplayValue] = useState('')
  
  useEffect(() => {
    // Only update if the value actually changed
    if (lastValueRef.current !== value) {
      lastValueRef.current = value
      
      if (value && options.length > 0) {
        const option = options.find(opt => opt.id === value)
        if (option) {
          setDisplayValue(option.label)
          setSearchTerm(option.label)
        }
      } else if (!value) {
        setDisplayValue('')
        setSearchTerm('')
      }
    }
  }, [value, options]) // Now we can safely include options

  // Filter options
  const filteredOptions = searchTerm 
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setDisplayValue(newValue)
    setSearchTerm(newValue)
    setSelectedIndex(-1)
    setIsOpen(true)
  }

  // Handle option selection
  const handleOptionSelect = (option: DropdownOption) => {
    setDisplayValue(option.label)
    setSearchTerm(option.label)
    setIsOpen(false)
    setSelectedIndex(-1)
    onChange(option.id, option)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
        setSelectedIndex(0)
      } else {
        setSelectedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        )
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (isOpen) {
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && filteredOptions[selectedIndex]) {
        handleOptionSelect(filteredOptions[selectedIndex])
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setSelectedIndex(-1)
      inputRef.current?.blur()
    }
  }

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  return (
    <div ref={dropdownRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={loading ? "Loading..." : placeholder}
        required={required}
        disabled={disabled || loading}
        className={className}
        autoComplete="off"
      />
      
      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-y-0 right-8 flex items-center pr-3 pointer-events-none">
          <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
        </div>
      )}
      
      {/* Dropdown arrow */}
      {!loading && (
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
      )}

      {/* Error message */}
      {error && (
        <div className="absolute z-10 w-full mt-1 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Dropdown list */}
      {isOpen && !error && (
        <ul
          ref={listRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                  index === selectedIndex ? 'bg-slate-100' : ''
                }`}
              >
                <div className="font-medium text-gray-900">{option.label}</div>
                {option.subtitle && (
                  <div className="text-sm text-gray-500">{option.subtitle}</div>
                )}
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-gray-500 text-center">
              {noOptionsMessage}
            </li>
          )}
        </ul>
      )}
    </div>
  )
} 