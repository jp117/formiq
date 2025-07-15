'use client'

interface RatingsSectionProps {
  formData: {
    voltage: string
    phaseWireHz: string
    icRating: string
    busBracing: string
    ratingType: string
    serviceEntrance: boolean
  }
  onInputChange: (field: string, value: string | boolean) => void
}

export default function RatingsSection({ formData, onInputChange }: RatingsSectionProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-slate-700 text-white px-4 py-2 rounded-t-md">
        <h3 className="text-base font-semibold">Ratings</h3>
      </div>
      <div className="flex-1 space-y-4 p-4 border border-gray-200 rounded-b-md">
        {/* First Row - Voltage and Phase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Voltage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Voltage
            </label>
            <select
              value={formData.voltage}
              onChange={(e) => onInputChange('voltage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="480/277 AC">480/277 AC</option>
              <option value="208/120 AC">208/120 AC</option>
              <option value="240/120 AC">240/120 AC</option>
              <option value="600/347 AC">600/347 AC</option>
            </select>
          </div>

          {/* Phase/Wire/Hz */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phase/Wire/Hz
            </label>
            <input
              type="text"
              value={formData.phaseWireHz}
              onChange={(e) => onInputChange('phaseWireHz', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              placeholder="3/4/60"
            />
          </div>
        </div>

        {/* Second Row - IC Rating and Bus Bracing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* IC Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IC Rating (kAIC)
            </label>
            <select
              value={formData.icRating}
              onChange={(e) => onInputChange('icRating', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="65">65</option>
              <option value="100">100</option>
              <option value="200">200</option>
            </select>
          </div>

          {/* Bus Bracing */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bus Bracing S/C (kA)
            </label>
            <select
              value={formData.busBracing}
              onChange={(e) => onInputChange('busBracing', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="65">65</option>
              <option value="100">100</option>
              <option value="200">200</option>
            </select>
          </div>
        </div>

        {/* Third Row - Rating Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating Type
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="ratingType"
                value="fully"
                checked={formData.ratingType === 'fully'}
                onChange={(e) => onInputChange('ratingType', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Fully</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="ratingType"
                value="series"
                checked={formData.ratingType === 'series'}
                onChange={(e) => onInputChange('ratingType', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Series</span>
            </label>
          </div>
        </div>

        {/* Fourth Row - Service Entrance */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="serviceEntrance"
            checked={formData.serviceEntrance}
            onChange={(e) => onInputChange('serviceEntrance', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="serviceEntrance" className="text-sm text-gray-700">
            Service Entrance
          </label>
        </div>
      </div>
    </div>
  )
} 