'use client'

interface EnclosureSpecialsSectionProps {
  formData: {
    enclosureType: string
    access: string
    height: string
    requiresServiceDisconnect: boolean
  }
  onInputChange: (field: string, value: string | boolean) => void
}

export default function EnclosureSpecialsSection({ formData, onInputChange }: EnclosureSpecialsSectionProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-slate-700 text-white px-4 py-2 rounded-t-md">
        <h3 className="text-base font-semibold">Enclosure and Specials</h3>
      </div>
      <div className="flex-1 space-y-4 p-4 border border-gray-200 rounded-b-md">
        {/* First Row - Enclosure Type, Access */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Enclosure Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enclosure Type
            </label>
            <select
              value={formData.enclosureType}
              onChange={(e) => onInputChange('enclosureType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="Type 1">Type 1</option>
              <option value="Type 3R">Type 3R</option>
            </select>
          </div>

          {/* Access */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Access
            </label>
            <select
              value={formData.access}
              onChange={(e) => onInputChange('access', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="Front">Front</option>
              <option value="Front and Rear">Front and Rear</option>
            </select>
          </div>
        </div>

        {/* Second Row - Height */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Height
            </label>
            <select
              value={formData.height}
              onChange={(e) => onInputChange('height', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value='90"'>90&quot;</option>
              <option value='84"'>84&quot;</option>
              <option value='72"'>72&quot;</option>
            </select>
          </div>
        </div>

        {/* Third Row - NEC 2020 Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="requiresServiceDisconnect"
            checked={formData.requiresServiceDisconnect}
            onChange={(e) => onInputChange('requiresServiceDisconnect', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="requiresServiceDisconnect" className="text-sm text-gray-700">
            Requires single Service Disconnect per vertical section, based on NEC 2020
          </label>
        </div>
      </div>
    </div>
  )
} 