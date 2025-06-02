'use client'

import { useState, useEffect } from 'react'

interface SwitchboardCardProps {
  switchboardNumber: number
  userAccess: string
}

interface SectionData {
  width: string
  height: string
  depth: string
}

export default function SwitchboardCard({ switchboardNumber, userAccess }: SwitchboardCardProps) {
  const [switchboardDesignation, setSwitchboardDesignation] = useState('')
  const [numberOfSections, setNumberOfSections] = useState('0')
  const [commonHeight, setCommonHeight] = useState('')
  const [commonDepth, setCommonDepth] = useState('')
  const [sections, setSections] = useState<SectionData[]>([])

  const handleSectionsChange = (value: string) => {
    // Always allow empty string
    if (value === '') {
      setNumberOfSections('')
      return
    }
    
    // Allow any numeric input, we'll validate the range but not block typing
    const num = parseInt(value)
    if (!isNaN(num)) {
      // Still store the string value to preserve user input behavior
      setNumberOfSections(value)
    }
  }

  // Get the numeric value for display and calculations, defaulting to 0 if empty
  const sectionsValue = numberOfSections === '' ? 0 : Math.max(0, Math.min(20, parseInt(numberOfSections) || 0))

  // Update sections array when number of sections changes
  useEffect(() => {
    setSections(prevSections => {
      const newSections: SectionData[] = Array.from({ length: sectionsValue }, (_, index) => {
        // Keep existing data if it exists, otherwise create new
        return prevSections[index] || { width: '', height: '', depth: '' }
      })
      return newSections
    })
  }, [sectionsValue])

  // Update all sections when common values change
  useEffect(() => {
    if (commonHeight || commonDepth) {
      setSections(prevSections => 
        prevSections.map(section => ({
          ...section,
          height: commonHeight || section.height,
          depth: commonDepth || section.depth
        }))
      )
    }
  }, [commonHeight, commonDepth])

  const updateSectionField = (sectionIndex: number, field: keyof SectionData, value: string) => {
    setSections(prevSections => 
      prevSections.map((section, index) => 
        index === sectionIndex 
          ? { ...section, [field]: value }
          : section
      )
    )
  }

  const isReadOnly = userAccess === 'view_access'

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Card Header */}
      <div className="flex items-center mb-4">
        <div className="bg-green-100 rounded-lg p-2 w-8 h-8 flex items-center justify-center">
          <span className="text-sm font-semibold text-green-600">
            {switchboardNumber}
          </span>
        </div>
        <h4 className="ml-3 text-lg font-semibold text-gray-900">
          Switchboard {switchboardNumber}
        </h4>
      </div>

      {/* Switchboard Designation and Number of Sections */}
      <div className="space-y-4">
        {/* Switchboard Designation Input */}
        <div>
          <label 
            htmlFor={`designation-${switchboardNumber}`} 
            className="block text-sm font-medium text-gray-900 mb-2"
          >
            Switchboard Designation
          </label>
          <input
            type="text"
            id={`designation-${switchboardNumber}`}
            value={switchboardDesignation}
            onChange={(e) => setSwitchboardDesignation(e.target.value)}
            disabled={isReadOnly}
            placeholder="Enter designation..."
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              isReadOnly 
                ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
                : 'bg-white text-gray-900'
            }`}
          />
        </div>

        {/* Number of Sections Input */}
        <div>
          <label 
            htmlFor={`sections-${switchboardNumber}`} 
            className="block text-sm font-medium text-gray-900 mb-2"
          >
            Number of Sections
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            id={`sections-${switchboardNumber}`}
            value={numberOfSections}
            onChange={(e) => handleSectionsChange(e.target.value)}
            disabled={isReadOnly}
            placeholder="0"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              isReadOnly 
                ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
                : 'bg-white text-gray-900'
            }`}
          />
        </div>

        {/* Common Controls */}
        {sectionsValue > 0 && (
          <div className="border-t pt-4">
            <h5 className="text-sm font-medium text-gray-900 mb-3">Common Dimensions</h5>
            <div className="grid grid-cols-2 gap-4">
              {/* Common Height */}
              <div>
                <label htmlFor={`common-height-${switchboardNumber}`} className="block text-xs font-medium text-gray-700 mb-1">
                  Common Height
                </label>
                <select
                  id={`common-height-${switchboardNumber}`}
                  value={commonHeight}
                  onChange={(e) => setCommonHeight(e.target.value)}
                  disabled={isReadOnly}
                  className={`w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 ${
                    isReadOnly ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                  }`}
                >
                  <option value="">Select...</option>
                  <option value="90">90</option>
                </select>
              </div>

              {/* Common Depth */}
              <div>
                <label htmlFor={`common-depth-${switchboardNumber}`} className="block text-xs font-medium text-gray-700 mb-1">
                  Common Depth
                </label>
                <select
                  id={`common-depth-${switchboardNumber}`}
                  value={commonDepth}
                  onChange={(e) => setCommonDepth(e.target.value)}
                  disabled={isReadOnly}
                  className={`w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 ${
                    isReadOnly ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                  }`}
                >
                  <option value="">Select...</option>
                  <option value="24">24</option>
                  <option value="30">30</option>
                  <option value="36">36</option>
                  <option value="48">48</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Individual Sections */}
        {sectionsValue > 0 && (
          <div className="border-t pt-4">
            <h5 className="text-sm font-medium text-gray-900 mb-3">Section Details</h5>
            <div className="space-y-3">
              {/* Header Row */}
              <div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-700">
                <div>Section</div>
                <div>Width</div>
                <div>Height</div>
                <div>Depth</div>
              </div>
              
              {/* Section Rows */}
              {sections.map((section, index) => (
                <div key={index} className="grid grid-cols-4 gap-2">
                  {/* Section Number */}
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600">#{index + 1}</span>
                  </div>
                  
                  {/* Width Input */}
                  <div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={section.width}
                      onChange={(e) => updateSectionField(index, 'width', e.target.value)}
                      disabled={isReadOnly}
                      placeholder="W"
                      className={`w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 ${
                        isReadOnly 
                          ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
                          : 'bg-white text-gray-900'
                      }`}
                    />
                  </div>
                  
                  {/* Height Input */}
                  <div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={section.height}
                      onChange={(e) => updateSectionField(index, 'height', e.target.value)}
                      disabled={isReadOnly || !!commonHeight}
                      placeholder="H"
                      className={`w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 ${
                        isReadOnly || commonHeight
                          ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
                          : 'bg-white text-gray-900'
                      }`}
                    />
                  </div>
                  
                  {/* Depth Input */}
                  <div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={section.depth}
                      onChange={(e) => updateSectionField(index, 'depth', e.target.value)}
                      disabled={isReadOnly || !!commonDepth}
                      placeholder="D"
                      className={`w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 ${
                        isReadOnly || commonDepth
                          ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
                          : 'bg-white text-gray-900'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 