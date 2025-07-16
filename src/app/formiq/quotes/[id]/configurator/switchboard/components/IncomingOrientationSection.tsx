'use client'

interface IncomingOrientationSectionProps {
  formData: {
    amps: string
    feedType: string
    feedLocation: string
    sectionAlignment: string
    incomingLocation: string
  }
  onInputChange: (field: string, value: string | boolean) => void
}

export default function IncomingOrientationSection({ formData, onInputChange }: IncomingOrientationSectionProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-slate-700 text-white px-4 py-2 rounded-t-md">
        <h3 className="text-base font-semibold">Incoming and Orientation</h3>
      </div>
      <div className="flex-1 space-y-4 p-4 border border-gray-200 rounded-b-md">
        {/* First Row - Amps and Feed Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amps */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amps
            </label>
            <select
              value={formData.amps}
              onChange={(e) => onInputChange('amps', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="400">400</option>
              <option value="600">600</option>
              <option value="800">800</option>
              <option value="1000">1000</option>
              <option value="1200">1200</option>
              <option value="1600">1600</option>
              <option value="2000">2000</option>
              <option value="2500">2500</option>
              <option value="3000">3000</option>
              <option value="4000">4000</option>
            </select>
          </div>

          {/* Feed Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feed Type
            </label>
            <select
              value={formData.feedType}
              onChange={(e) => onInputChange('feedType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="Lugs/Cable">Lugs/Cable</option>
              <option value="Blank Pull Section">Blank Pull Section</option>
              <option value="Bussed Pull Section">Bussed Pull Section</option>
              <option value="Busway">Busway</option>
              <option value="Tied to Transformer">Tied to Transformer</option>
            </select>
          </div>
        </div>

        {/* Second Row - Feed Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Feed Location
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="feedLocation"
                value="top"
                checked={formData.feedLocation === 'top'}
                onChange={(e) => onInputChange('feedLocation', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Top</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="feedLocation"
                value="bottom"
                checked={formData.feedLocation === 'bottom'}
                onChange={(e) => onInputChange('feedLocation', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Bottom</span>
            </label>
          </div>
        </div>

        {/* Third Row - Section Alignment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Alignment
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="sectionAlignment"
                value="front-rear"
                checked={formData.sectionAlignment === 'front-rear'}
                onChange={(e) => onInputChange('sectionAlignment', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Front/Rear</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="sectionAlignment"
                value="rear-only"
                checked={formData.sectionAlignment === 'rear-only'}
                onChange={(e) => onInputChange('sectionAlignment', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Rear Only</span>
            </label>
          </div>
        </div>

        {/* Fourth Row - Incoming Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Incoming Location
          </label>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="incomingLocation"
                value="left"
                checked={formData.incomingLocation === 'left'}
                onChange={(e) => onInputChange('incomingLocation', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Left</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="incomingLocation"
                value="center"
                checked={formData.incomingLocation === 'center'}
                onChange={(e) => onInputChange('incomingLocation', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Center</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="incomingLocation"
                value="right"
                checked={formData.incomingLocation === 'right'}
                onChange={(e) => onInputChange('incomingLocation', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Right</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="incomingLocation"
                value="left-right"
                checked={formData.incomingLocation === 'left-right'}
                onChange={(e) => onInputChange('incomingLocation', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Left and Right</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
} 