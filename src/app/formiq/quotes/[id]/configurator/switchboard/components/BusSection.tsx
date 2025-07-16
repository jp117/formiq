'use client'

interface BusSectionProps {
  formData: {
    material: string
    busPlating: string
    busDensity: string
    neutralRating: string
    busRating: string
  }
  onInputChange: (field: string, value: string | boolean) => void
}

export default function BusSection({ formData, onInputChange }: BusSectionProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-slate-700 text-white px-4 py-2 rounded-t-md">
        <h3 className="text-base font-semibold">Bus</h3>
      </div>
      <div className="flex-1 space-y-4 p-4 border border-gray-200 rounded-b-md">
        {/* First Row - Material, Bus Plating, Bus Density */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Material - Copper only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Material
            </label>
            <select
              value={formData.material}
              onChange={(e) => onInputChange('material', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="Copper">Copper</option>
            </select>
          </div>

          {/* Bus Plating - Dropdown with Silver default and Tin option */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bus Plating
            </label>
            <select
              value={formData.busPlating}
              onChange={(e) => onInputChange('busPlating', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="Silver">Silver</option>
              <option value="Tin">Tin</option>
            </select>
          </div>

          {/* Bus Density - 700 and 1000 with 1000 default */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bus Density
            </label>
            <select
              value={formData.busDensity}
              onChange={(e) => onInputChange('busDensity', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="700 A/Sq. in.">700 A/Sq. in.</option>
              <option value="1000 A/Sq. in.">1000 A/Sq. in.</option>
            </select>
          </div>
        </div>

        {/* Second Row - Neutral Rating */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Neutral Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Neutral Rating
            </label>
            <select
              value={formData.neutralRating}
              onChange={(e) => onInputChange('neutralRating', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="100% Rated">100% Rated</option>
              <option value="200% Rated">200% Rated</option>
            </select>
          </div>
        </div>

        {/* Third Row - Bus Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bus Rating
          </label>
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="busRating"
                value="fully-rated"
                checked={formData.busRating === 'fully-rated'}
                onChange={(e) => onInputChange('busRating', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Fully Rated</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="busRating"
                value="fully-rated-bus-ext"
                checked={formData.busRating === 'fully-rated-bus-ext'}
                onChange={(e) => onInputChange('busRating', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Fully Rated w/ Bus Ext</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
} 