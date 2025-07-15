'use client'

interface BasicInfoSectionProps {
  formData: {
    marks: string
    switchboardType: string
    panelType: string
    application: string
    buildAmericaBuyAmerica: boolean
  }
  onInputChange: (field: string, value: string | boolean) => void
}

export default function BasicInfoSection({ formData, onInputChange }: BasicInfoSectionProps) {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Marks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marks (20 Characters Max)
          </label>
          <input
            type="text"
            maxLength={20}
            value={formData.marks}
            onChange={(e) => onInputChange('marks', e.target.value)}
            className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            placeholder="Enter marks"
          />
        </div>

        {/* Switchboard Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Switchboard Type
          </label>
          <select
            value={formData.switchboardType}
            onChange={(e) => onInputChange('switchboardType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
          >
            <option value="Configured Switchboard">Configured Switchboard</option>
            <option value="Engineered Switchboard">Engineered Switchboard</option>
          </select>
        </div>

        {/* Panel Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Panel Type
          </label>
          <select
            value={formData.panelType}
            onChange={(e) => onInputChange('panelType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
          >
            <option value="ReliaGear (C/B feeders only)">ReliaGear (C/B feeders only)</option>
            <option value="Standard Panel">Standard Panel</option>
            <option value="Custom Panel">Custom Panel</option>
          </select>
        </div>

        {/* Application */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Application
          </label>
          <select
            value={formData.application}
            onChange={(e) => onInputChange('application', e.target.value)}
            className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
          >
            <option value="Main Disconnect">Main Disconnect</option>
            <option value="Distribution">Distribution</option>
            <option value="Transfer Switch">Transfer Switch</option>
          </select>
        </div>

        {/* Build America, Buy America */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="buildAmericaBuyAmerica"
            checked={formData.buildAmericaBuyAmerica}
            onChange={(e) => onInputChange('buildAmericaBuyAmerica', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="buildAmericaBuyAmerica" className="text-sm text-gray-700">
            Build America, Buy America
          </label>
        </div>
      </div>
    </div>
  )
} 