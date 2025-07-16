'use client'

interface LoadRequirementsSectionProps {
  formData: {
    loadType: string
    diversityFactor: string
    demandFactor: string
    powerFactor: string
    totalConnectedLoad: string
    peakDemand: string
  }
  onInputChange: (field: string, value: string | boolean) => void
}

export default function LoadRequirementsSection({ formData, onInputChange }: LoadRequirementsSectionProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-slate-700 text-white px-4 py-2 rounded-t-md">
        <h3 className="text-base font-semibold">Load Requirements</h3>
      </div>
      <div className="flex-1 space-y-4 p-4 border border-gray-200 rounded-b-md">
        {/* First Row - Load Type and Diversity Factor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Load Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Load Type
            </label>
            <select
              value={formData.loadType}
              onChange={(e) => onInputChange('loadType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="">Select Load Type</option>
              <option value="Continuous">Continuous</option>
              <option value="Non-Continuous">Non-Continuous</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>

          {/* Diversity Factor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diversity Factor
            </label>
            <select
              value={formData.diversityFactor}
              onChange={(e) => onInputChange('diversityFactor', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="">Select Diversity Factor</option>
              <option value="0.5">0.5</option>
              <option value="0.6">0.6</option>
              <option value="0.7">0.7</option>
              <option value="0.75">0.75</option>
              <option value="0.8">0.8</option>
              <option value="0.85">0.85</option>
              <option value="0.9">0.9</option>
              <option value="0.95">0.95</option>
              <option value="1.0">1.0</option>
            </select>
          </div>
        </div>

        {/* Second Row - Demand Factor and Power Factor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Demand Factor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Demand Factor
            </label>
            <select
              value={formData.demandFactor}
              onChange={(e) => onInputChange('demandFactor', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="">Select Demand Factor</option>
              <option value="0.5">0.5</option>
              <option value="0.6">0.6</option>
              <option value="0.7">0.7</option>
              <option value="0.75">0.75</option>
              <option value="0.8">0.8</option>
              <option value="0.85">0.85</option>
              <option value="0.9">0.9</option>
              <option value="1.0">1.0</option>
            </select>
          </div>

          {/* Power Factor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Power Factor
            </label>
            <select
              value={formData.powerFactor}
              onChange={(e) => onInputChange('powerFactor', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="">Select Power Factor</option>
              <option value="0.7">0.7</option>
              <option value="0.75">0.75</option>
              <option value="0.8">0.8</option>
              <option value="0.85">0.85</option>
              <option value="0.9">0.9</option>
              <option value="0.95">0.95</option>
              <option value="1.0">1.0 (Unity)</option>
            </select>
          </div>
        </div>

        {/* Third Row - Total Connected Load and Peak Demand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Total Connected Load */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Connected Load (kW)
            </label>
            <input
              type="text"
              value={formData.totalConnectedLoad}
              onChange={(e) => onInputChange('totalConnectedLoad', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              placeholder="Enter total connected load"
            />
          </div>

          {/* Peak Demand */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Peak Demand (kW)
            </label>
            <input
              type="text"
              value={formData.peakDemand}
              onChange={(e) => onInputChange('peakDemand', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              placeholder="Enter peak demand"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 