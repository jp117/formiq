'use client'

import { useState } from 'react'

interface UtilityItem {
  id: string
  displayName: string
  utilityType: string
  quantity: number
  utilityCode: string
  amps: string
  sequence: string
}

interface UtilityContentSectionProps {
  formData: {
    utilityItems: UtilityItem[]
    selectedUtilityType: 'EUSERC' | 'All Others'
    currentItem: {
      qty: string
      name: string
      amps: string
      sequence: string
    }
    lineConnection: {
      feedType: string
      lugType: string
      cableMaterial: string
      cableSize: string
      cablesPerPhase: string
      utilityTermination: boolean
    }
    loadConnection: {
      loadType: string
      lugType: string
      cableMaterial: string
      loadExit: string
      cableSize: string
      cablesPerPhase: string
    }
    utilitySpecs: {
      sockets: string
      figure: string
      clips: string
      currentTransformerType: string
      ptCompartmentHeight: string
      potentialTransformers: boolean
    }
  }
  onInputChange: (field: string, value: string | boolean | UtilityItem[] | Record<string, string | boolean>) => void
}

export default function UtilityContentSection({ formData, onInputChange }: UtilityContentSectionProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  const handleAddItem = () => {
    const newItem: UtilityItem = {
      id: Date.now().toString(),
      displayName: formData.currentItem.name || 'New Utility Item',
      utilityType: formData.selectedUtilityType,
      quantity: parseInt(formData.currentItem.qty) || 1,
      utilityCode: '',
      amps: formData.currentItem.amps,
      sequence: formData.currentItem.sequence
    }
    
    const updatedItems = [...formData.utilityItems, newItem]
    onInputChange('utilityItems', updatedItems)
  }

  const handleDeleteItem = () => {
    if (selectedItemId) {
      const updatedItems = formData.utilityItems.filter(item => item.id !== selectedItemId)
      onInputChange('utilityItems', updatedItems)
      setSelectedItemId(null)
    }
  }

  const handleCopyItem = () => {
    if (selectedItemId) {
      const itemToCopy = formData.utilityItems.find(item => item.id === selectedItemId)
      if (itemToCopy) {
        const copiedItem: UtilityItem = {
          ...itemToCopy,
          id: Date.now().toString(),
          displayName: itemToCopy.displayName + ' (Copy)'
        }
        const updatedItems = [...formData.utilityItems, copiedItem]
        onInputChange('utilityItems', updatedItems)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Utility Items Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="bg-slate-600 text-white">
          <div className="grid grid-cols-6 gap-4 p-4 text-sm font-medium">
            <div>Display Name</div>
            <div>Utility Type</div>
            <div>Quantity</div>
            <div>Utility Code</div>
            <div>Amps</div>
            <div>Sequence</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {formData.utilityItems.map((item) => (
            <div
              key={item.id}
              className={`grid grid-cols-6 gap-4 p-4 text-sm cursor-pointer hover:bg-gray-50 text-gray-900 ${
                selectedItemId === item.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
              onClick={() => setSelectedItemId(item.id)}
            >
              <div className="text-gray-900">{item.displayName}</div>
              <div className="text-gray-900">{item.utilityType}</div>
              <div className="text-gray-900">{item.quantity}</div>
              <div className="text-gray-900">{item.utilityCode}</div>
              <div className="text-gray-900">{item.amps}</div>
              <div className="text-gray-900">{item.sequence}</div>
            </div>
          ))}
          {formData.utilityItems.length === 0 && (
            <div className="p-8 text-center text-gray-600">
              No utility items added yet. Click &quot;Add&quot; to create one.
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleAddItem}
          className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-md transition-colors text-sm font-medium"
        >
          Add
        </button>
        <button
          onClick={handleDeleteItem}
          disabled={!selectedItemId}
          className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-400 text-gray-900 px-6 py-2 rounded-md transition-colors text-sm font-medium"
        >
          Delete
        </button>
        <button
          onClick={handleCopyItem}
          disabled={!selectedItemId}
          className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-400 text-gray-900 px-6 py-2 rounded-md transition-colors text-sm font-medium"
        >
          Copy
        </button>
      </div>

      {/* Utility Item Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          {/* Utility Type */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Utility Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="utilityType"
                  value="EUSERC"
                  checked={formData.selectedUtilityType === 'EUSERC'}
                  onChange={(e) => onInputChange('selectedUtilityType', e.target.value)}
                  disabled={true}
                  className="mr-2"
                />
                <span className="text-sm text-gray-400">EUSERC (Disabled - Not available in first release)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="utilityType"
                  value="All Others"
                  checked={formData.selectedUtilityType === 'All Others'}
                  onChange={(e) => onInputChange('selectedUtilityType', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-900">All Others</span>
              </label>
            </div>
          </div>

          {/* Qty */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Qty
            </label>
            <input
              type="number"
              min="1"
              value={formData.currentItem.qty}
              onChange={(e) => onInputChange('currentItem', { ...formData.currentItem, qty: e.target.value })}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Name
            </label>
            <select
              value={formData.currentItem.name}
              onChange={(e) => onInputChange('currentItem', { ...formData.currentItem, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="">Select Name</option>
              {formData.selectedUtilityType === 'All Others' && (
                <option value="Con Edison NY 377 spec">Con Edison NY 377 spec</option>
              )}
            </select>
          </div>

          {/* Amps */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Amps
            </label>
            <select
              value={formData.currentItem.amps}
              onChange={(e) => onInputChange('currentItem', { ...formData.currentItem, amps: e.target.value })}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="">Select Amps</option>
              <option value="200">200</option>
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

          {/* Sequence */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Sequence
            </label>
            <select
              value={formData.currentItem.sequence}
              onChange={(e) => onInputChange('currentItem', { ...formData.currentItem, sequence: e.target.value })}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="">Select Sequence</option>
              <option value="Hot">Hot</option>
              <option value="Cold">Cold</option>
            </select>
          </div>
        </div>

        {/* Line Connection and Load Connection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Line Connection */}
          <div>
            <div className="bg-slate-600 text-white px-4 py-2 rounded-t-md">
              <h3 className="text-sm font-medium">Line Connection</h3>
            </div>
            <div className="border border-gray-200 border-t-0 rounded-b-md p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Feed Type</label>
                  <input
                    type="text"
                    value={formData.currentItem.sequence === 'Hot' ? 'Lugs/Cable' : formData.currentItem.sequence === 'Cold' ? 'Bus' : ''}
                    onChange={(e) => onInputChange('lineConnection', { ...formData.lineConnection, feedType: e.target.value })}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Lug Type</label>
                  <select
                    value={formData.lineConnection.lugType}
                    onChange={(e) => onInputChange('lineConnection', { ...formData.lineConnection, lugType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="">Select Lug Type</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Compression">Compression</option>
                    <option value="Provision">Provision</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Cable Material</label>
                  <select
                    value={formData.lineConnection.cableMaterial}
                    onChange={(e) => onInputChange('lineConnection', { ...formData.lineConnection, cableMaterial: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="">Select Material</option>
                    <option value="Copper">Copper</option>
                    <option value="Aluminum">Aluminum</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Cable Size</label>
                  <select
                    value={formData.lineConnection.cableSize}
                    onChange={(e) => onInputChange('lineConnection', { ...formData.lineConnection, cableSize: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="">Select Size</option>
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
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Cables/Ph</label>
                  <select
                    value={formData.lineConnection.cablesPerPhase}
                    onChange={(e) => onInputChange('lineConnection', { ...formData.lineConnection, cablesPerPhase: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="">Select Cables/Ph</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="utilityTermination"
                  checked={formData.lineConnection.utilityTermination}
                  onChange={(e) => onInputChange('lineConnection', { ...formData.lineConnection, utilityTermination: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="utilityTermination" className="text-sm text-gray-900 font-medium">
                  Utility TERMINATION
                </label>
              </div>
            </div>
          </div>

          {/* Load Connection */}
          <div>
            <div className="bg-slate-600 text-white px-4 py-2 rounded-t-md">
              <h3 className="text-sm font-medium">Load Connection</h3>
            </div>
            <div className="border border-gray-200 border-t-0 rounded-b-md p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Load Type</label>
                  <select
                    value={formData.loadConnection.loadType}
                    onChange={(e) => onInputChange('loadConnection', { ...formData.loadConnection, loadType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="">Select Load Type</option>
                    <option value="Main Bus">Main Bus</option>
                    <option value="Transfer Bus">Transfer Bus</option>
                    <option value="Tie Bus">Tie Bus</option>
                  </select>
                </div>
                <div>
                  <button className="mt-6 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm">
                    ...
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Lug Type</label>
                  <select
                    value={formData.loadConnection.lugType}
                    onChange={(e) => onInputChange('loadConnection', { ...formData.loadConnection, lugType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="">Select Lug Type</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Compression">Compression</option>
                    <option value="Provision">Provision</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Load Exit</label>
                  <select
                    value={formData.loadConnection.loadExit}
                    onChange={(e) => onInputChange('loadConnection', { ...formData.loadConnection, loadExit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="">Select Load Exit</option>
                    <option value="Top">Top</option>
                    <option value="Bottom">Bottom</option>
                    <option value="Front">Front</option>
                    <option value="Rear">Rear</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Cable Size</label>
                  <select
                    value={formData.loadConnection.cableSize}
                    onChange={(e) => onInputChange('loadConnection', { ...formData.loadConnection, cableSize: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="">Select Size</option>
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
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Cables/Ph</label>
                  <select
                    value={formData.loadConnection.cablesPerPhase}
                    onChange={(e) => onInputChange('loadConnection', { ...formData.loadConnection, cablesPerPhase: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="">Select Cables/Ph</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Cable Material</label>
                <select
                  value={formData.loadConnection.cableMaterial}
                  onChange={(e) => onInputChange('loadConnection', { ...formData.loadConnection, cableMaterial: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="">Select Material</option>
                  <option value="Copper">Copper</option>
                  <option value="Aluminum">Aluminum</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Utility Specs */}
        <div>
          <div className="bg-slate-600 text-white px-4 py-2 rounded-t-md">
            <h3 className="text-sm font-medium">Utility Specs</h3>
          </div>
          <div className="border border-gray-200 border-t-0 rounded-b-md p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Sockets</label>
                <select
                  value={formData.utilitySpecs.sockets}
                  onChange={(e) => onInputChange('utilitySpecs', { ...formData.utilitySpecs, sockets: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="">Select</option>
                  <option value="13S">13S</option>
                  <option value="16S">16S</option>
                  <option value="25S">25S</option>
                  <option value="35S">35S</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Figure</label>
                <select
                  value={formData.utilitySpecs.figure}
                  onChange={(e) => onInputChange('utilitySpecs', { ...formData.utilitySpecs, figure: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="">Select</option>
                  <option value="12">12</option>
                  <option value="16">16</option>
                  <option value="36">36</option>
                  <option value="45">45</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Clips</label>
                <select
                  value={formData.utilitySpecs.clips}
                  onChange={(e) => onInputChange('utilitySpecs', { ...formData.utilitySpecs, clips: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="">Select</option>
                  <option value="Type A">Type A</option>
                  <option value="Type B">Type B</option>
                  <option value="Type C">Type C</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Current Transformer Type</label>
                <select
                  value={formData.utilitySpecs.currentTransformerType}
                  onChange={(e) => onInputChange('utilitySpecs', { ...formData.utilitySpecs, currentTransformerType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="">Select CT Type</option>
                  <option value="Window Type">Window Type</option>
                  <option value="Wound Type">Wound Type</option>
                  <option value="Bar Type">Bar Type</option>
                  <option value="Bushing Type">Bushing Type</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">PT Compartment Height</label>
                <select
                  value={formData.utilitySpecs.ptCompartmentHeight}
                  onChange={(e) => onInputChange('utilitySpecs', { ...formData.utilitySpecs, ptCompartmentHeight: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="">Select Height</option>
                  <option value="12 inches">12 inches</option>
                  <option value="18 inches">18 inches</option>
                  <option value="24 inches">24 inches</option>
                  <option value="30 inches">30 inches</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <input
                type="checkbox"
                id="potentialTransformers"
                checked={formData.utilitySpecs.potentialTransformers}
                onChange={(e) => onInputChange('utilitySpecs', { ...formData.utilitySpecs, potentialTransformers: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="potentialTransformers" className="text-sm text-gray-900 font-medium">
                Potential Transformers
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 