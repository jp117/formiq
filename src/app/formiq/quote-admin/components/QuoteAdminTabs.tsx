'use client'

import { useState } from 'react'
import QuoteComponentsManager from './QuoteComponentsManager'
import AssembliesManager from './AssembliesManager'

interface QuoteComponent {
  id: string
  type: string
  vendor: string
  catalog_number: string
  description: string
  cost: number
  markup_percentage: number
  created_at: string
  updated_at: string
}

interface AssemblyComponent {
  id: string
  quantity: number
  is_optional: boolean
  notes: string | null
  component: QuoteComponent
}

interface Assembly {
  id: string
  name: string
  description: string | null
  category: string
  amperage: number | null
  enclosure_type: string | null
  product_line: string | null
  base_markup_percentage: number
  is_active: boolean
  created_at: string
  updated_at: string
  assembly_components: AssemblyComponent[]
}

interface QuoteAdminTabsProps {
  components: QuoteComponent[]
  assemblies: Assembly[]
}

export default function QuoteAdminTabs({ components, assemblies }: QuoteAdminTabsProps) {
  const [activeTab, setActiveTab] = useState<'components' | 'assemblies'>('components')

  const tabs = [
    {
      id: 'components' as const,
      name: 'Components',
      description: 'Manage individual quote components and pricing',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
        </svg>
      )
    },
    {
      id: 'assemblies' as const,
      name: 'Assemblies',
      description: 'Build and manage switchboard assemblies',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5M4 4l16 16" />
        </svg>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-slate-500 text-slate-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className={`mr-2 ${
                  activeTab === tab.id ? 'text-slate-500' : 'text-gray-400 group-hover:text-gray-500'
                }`}>
                  {tab.icon}
                </span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Tab Description */}
        <div className="px-6 py-4 bg-gray-50">
          <p className="text-sm text-gray-600">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'components' && (
          <QuoteComponentsManager components={components} />
        )}
        
        {activeTab === 'assemblies' && (
          <AssembliesManager 
            assemblies={assemblies}
          />
        )}
      </div>
    </div>
  )
} 