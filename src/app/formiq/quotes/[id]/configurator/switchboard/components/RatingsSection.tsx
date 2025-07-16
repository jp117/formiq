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

// Voltage to Phase/Wire/Hz mapping based on the provided image
const voltageMapping: Record<string, string> = {
  '480/277 AC': '3/4/60',
  '208/120 AC': '3/4/60', 
  '240 AC': '3/3/60',
  '240/120 AC': '3/4/60',
  '480 AC': '3/3/60',
  '600 AC': '3/3/60',
  '600/347 AC': '3/4/60'
}

export default function RatingsSection({ formData, onInputChange }: RatingsSectionProps) {
  // Available Bus Bracing options (only 3 options)
  const busBracingOptions = [65, 100, 200]

  const handleVoltageChange = (voltage: string) => {
    onInputChange('voltage', voltage)
    // Automatically populate Phase/Wire/Hz based on voltage selection
    const phaseWireHz = voltageMapping[voltage] || ''
    onInputChange('phaseWireHz', phaseWireHz)
  }

  const handleIcRatingChange = (icRating: string) => {
    onInputChange('icRating', icRating)
    
    // Auto-select minimum valid Bus Bracing (user can still override to higher value)
    if (icRating) {
      const icRatingValue = parseInt(icRating)
      const minValidBusBracing = busBracingOptions.find(option => option >= icRatingValue)
      if (minValidBusBracing) {
        onInputChange('busBracing', minValidBusBracing.toString())
      }
    }
  }

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
              onChange={(e) => handleVoltageChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="">Select Voltage</option>
              <option value="480/277 AC">480/277 AC</option>
              <option value="208/120 AC">208/120 AC</option>
              <option value="240 AC">240 AC</option>
              <option value="240/120 AC">240/120 AC</option>
              <option value="480 AC">480 AC</option>
              <option value="600 AC">600 AC</option>
              <option value="600/347 AC">600/347 AC</option>
            </select>
          </div>

          {/* Phase/Wire/Hz - Now disabled and auto-populated */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phase/Wire/Hz
            </label>
            <input
              type="text"
              value={formData.phaseWireHz}
              readOnly
              disabled
              className="w-full px-3 py-2 border border-gray-400 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
              placeholder="Auto-filled based on voltage"
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
              onChange={(e) => handleIcRatingChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="">Select AIC</option>
              <option value="10">10</option>
              <option value="14">14</option>
              <option value="18">18</option>
              <option value="22">22</option>
              <option value="25">25</option>
              <option value="30">30</option>
              <option value="35">35</option>
              <option value="42">42</option>
              <option value="50">50</option>
              <option value="65">65</option>
              <option value="85">85</option>
              <option value="100">100</option>
              <option value="150">150</option>
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
              <option value="">Select Bus Bracing</option>
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