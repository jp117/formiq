'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase'
import SearchableDropdown, { type DropdownOption } from './ui/SearchableDropdown'

interface CompanyDropdownProps {
  value: string
  onChange: (companyId: string, companyName: string) => void
  required?: boolean
  className?: string
}

export default function CompanyDropdown({ 
  value, 
  onChange, 
  required = false, 
  className = "" 
}: CompanyDropdownProps) {
  const [companies, setCompanies] = useState<{ id: string; company_name: string; domain: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchCompanies() {
      try {
        setLoading(true)
        setError(null)
        
        const supabase = createClient()
        const { data, error: fetchError } = await supabase
          .from('companies')
          .select('id, company_name, domain')
          .order('company_name', { ascending: true })

        if (!mounted) return

        if (fetchError) {
          throw new Error(fetchError.message)
        }

        setCompanies(data || [])
      } catch (err) {
        if (!mounted) return
        const errorMessage = err instanceof Error ? err.message : 'Failed to load companies'
        setError(errorMessage)
        console.error('Failed to load companies:', err)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchCompanies()

    return () => {
      mounted = false
    }
  }, [])

  // Transform companies data for the dropdown
  const dropdownOptions = companies.map(company => ({
    id: company.id,
    label: company.company_name,
    subtitle: company.domain,
    data: company
  }))

  const handleDropdownChange = (companyId: string, option: DropdownOption | null) => {
    const companyName = option?.label || ''
    onChange(companyId, companyName)
  }

  const errorMessage = error ? 
    `Unable to load companies. Please check your connection and try again.` : 
    null

  return (
    <SearchableDropdown
      options={dropdownOptions}
      value={value}
      onChange={handleDropdownChange}
      placeholder="Search and select your company..."
      loading={loading}
      error={errorMessage}
      required={required}
      className={className}
      noOptionsMessage="No companies found. Please contact support if your company is missing."
    />
  )
} 