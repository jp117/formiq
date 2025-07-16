'use client'

interface ConnectionSpecsSectionProps {
  formData: {
    connectionType: string
    wireSize: string
    conduitSize: string
    groundingMethod: string
    transformerConnection: boolean
  }
  onInputChange: (field: string, value: string | boolean) => void
}

export default function ConnectionSpecsSection({ formData, onInputChange }: ConnectionSpecsSectionProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-slate-700 text-white px-4 py-2 rounded-t-md">
        <h3 className="text-base font-semibold">Connection Specifications</h3>
      </div>
      <div className="flex-1 space-y-4 p-4 border border-gray-200 rounded-b-md">
        {/* First Row - Connection Type and Wire Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Connection Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Connection Type
            </label>
            <select
              value={formData.connectionType}
              onChange={(e) => onInputChange('connectionType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="">Select Connection Type</option>
              <option value="Overhead">Overhead</option>
              <option value="Underground">Underground</option>
              <option value="Direct Buried">Direct Buried</option>
              <option value="Conduit">Conduit</option>
            </select>
          </div>

          {/* Wire Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wire Size (AWG/MCM)
            </label>
            <select
              value={formData.wireSize}
              onChange={(e) => onInputChange('wireSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="">Select Wire Size</option>
              <option value="4 AWG">4 AWG</option>
              <option value="2 AWG">2 AWG</option>
              <option value="1 AWG">1 AWG</option>
              <option value="1/0 AWG">1/0 AWG</option>
              <option value="2/0 AWG">2/0 AWG</option>
              <option value="3/0 AWG">3/0 AWG</option>
              <option value="4/0 AWG">4/0 AWG</option>
              <option value="250 MCM">250 MCM</option>
              <option value="300 MCM">300 MCM</option>
              <option value="350 MCM">350 MCM</option>
              <option value="400 MCM">400 MCM</option>
              <option value="500 MCM">500 MCM</option>
              <option value="600 MCM">600 MCM</option>
              <option value="750 MCM">750 MCM</option>
              <option value="1000 MCM">1000 MCM</option>
            </select>
          </div>
        </div>

        {/* Second Row - Conduit Size and Grounding Method */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Conduit Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conduit Size (inches)
            </label>
            <select
              value={formData.conduitSize}
              onChange={(e) => onInputChange('conduitSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="">Select Conduit Size</option>
              <option value="1">1&quot;</option>
              <option value="1.25">1¼&quot;</option>
              <option value="1.5">1½&quot;</option>
              <option value="2">2&quot;</option>
              <option value="2.5">2½&quot;</option>
              <option value="3">3&quot;</option>
              <option value="3.5">3½&quot;</option>
              <option value="4">4&quot;</option>
              <option value="5">5&quot;</option>
              <option value="6">6&quot;</option>
            </select>
          </div>

          {/* Grounding Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grounding Method
            </label>
            <select
              value={formData.groundingMethod}
              onChange={(e) => onInputChange('groundingMethod', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="">Select Grounding Method</option>
              <option value="Ground Rod">Ground Rod</option>
              <option value="Ground Ring">Ground Ring</option>
              <option value="Water Pipe">Water Pipe</option>
              <option value="Building Steel">Building Steel</option>
              <option value="Concrete Encased">Concrete Encased</option>
              <option value="Plate Electrode">Plate Electrode</option>
            </select>
          </div>
        </div>

        {/* Third Row - Transformer Connection Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="transformerConnection"
            checked={formData.transformerConnection}
            onChange={(e) => onInputChange('transformerConnection', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="transformerConnection" className="text-sm text-gray-700">
            Connected to utility transformer
          </label>
        </div>
      </div>
    </div>
  )
} 