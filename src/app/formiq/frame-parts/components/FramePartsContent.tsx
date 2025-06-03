'use client'

import { useState, useCallback } from 'react'
import SwitchboardCard from './SwitchboardCard'
import { generateFramePartsReport } from '../utils/pdfGenerator'

interface FramePartsContentProps {
  userAccess: string
}

interface SwitchboardData {
  switchboardNumber: number
  soNumber: string
  customerName: string
  switchboardDesignation: string
  jobNameAddress: string
  sections: Array<{
    width: string
    height: string
    depth: string
    isStandard: boolean
    isLShaped: boolean
  }>
}

export default function FramePartsContent({ userAccess }: FramePartsContentProps) {
  const [reportName, setReportName] = useState('')
  const [numberOfSwitchboards, setNumberOfSwitchboards] = useState('1')
  const [switchboardsData, setSwitchboardsData] = useState<SwitchboardData[]>([])

  // Generate array for switchboard cards
  const switchboardsValue = numberOfSwitchboards === '' ? 0 : Math.max(1, Math.min(50, parseInt(numberOfSwitchboards) || 1))
  const switchboardCards = Array.from({ length: switchboardsValue }, (_, index) => index)

  const handleNumberOfSwitchboardsChange = (value: string) => {
    // Always allow empty string
    if (value === '') {
      setNumberOfSwitchboards('')
      return
    }
    
    // Allow any numeric input, we'll validate the range but not block typing
    const num = parseInt(value)
    if (!isNaN(num)) {
      // Still store the string value to preserve user input behavior
      setNumberOfSwitchboards(value)
    }
  }

  const updateSwitchboardData = useCallback((switchboardNumber: number, data: Partial<SwitchboardData>) => {
    setSwitchboardsData(prev => {
      const existing = prev.find(sb => sb.switchboardNumber === switchboardNumber)
      if (existing) {
        return prev.map(sb => 
          sb.switchboardNumber === switchboardNumber 
            ? { ...sb, ...data }
            : sb
        )
      } else {
        return [...prev, { switchboardNumber, ...data } as SwitchboardData]
      }
    })
  }, [])

  const handleGeneratePDF = () => {
    generateFramePartsReport(reportName, switchboardsValue, switchboardsData)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Master Control Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-w-[800px]">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 rounded-lg p-2 w-10 h-10 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="ml-3 text-lg font-semibold text-gray-900">Report Configuration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Report Name Input */}
          <div>
            <label htmlFor="report-name" className="block text-sm font-medium text-gray-900 mb-2">
              Report Name
            </label>
            <input
              type="text"
              id="report-name"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              placeholder="Enter report name..."
            />
          </div>

          {/* Number of Switchboards Input */}
          <div>
            <label htmlFor="num-switchboards" className="block text-sm font-medium text-gray-900 mb-2">
              Number of Switchboards
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              id="num-switchboards"
              value={numberOfSwitchboards}
              onChange={(e) => handleNumberOfSwitchboardsChange(e.target.value)}
              placeholder="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Switchboard Cards */}
      {switchboardsValue > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Switchboard Components</h3>
          <div className="space-y-6">
            {switchboardCards.map((index) => (
              <SwitchboardCard
                key={index}
                switchboardNumber={index + 1}
                userAccess={userAccess}
                onDataChange={updateSwitchboardData}
              />
            ))}
          </div>
          
          {/* Generate Report Button */}
          <div className="pt-6">
            <button
              type="button"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-8 rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              onClick={handleGeneratePDF}
            >
              Generate Report
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 