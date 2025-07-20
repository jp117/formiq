'use client'

import { useState } from 'react'

interface FeederDevice {
  id: string
  displayName: string
  quantity: number
  deviceType: string
  construction: string
  tripAmps: number
  poles: number
  frame: string
  sensor: string
  hundredPercent: boolean
  operation: string
  mounting: string
}

interface FeedersSectionProps {
  formData: {
    feederDevices: FeederDevice[]
    fuseType: string
    deviceAssociation: string
    fedByMain: string
    provideLugs: boolean
    loadConnection: {
      loadType: string
      loadWireType: '3-wire' | '4-wire' | ''
      strapType: string
      lugType: string
      cableMaterial: string
      loadExit: string
      cableSize: string
      cablesPerPhase: string
    }
    protectionFeatures: {
      phaseFailure: boolean
      capTrip: boolean
      geItiBgflGfRelay: boolean
      subMeteringRgm4500q: boolean
      multiStack: boolean
      provideFuses: boolean
    }
    programmer: {
      mode: 'instantaneous' | 'fuse-only' | 'none' | ''
      longTime: boolean
      shortTime: boolean
      relt: boolean
      groundFault: boolean
      gfAlarm: boolean
      neutralProtection: boolean
      meteringCommunication: boolean
      protectiveRelays: boolean
      rgZoneSelectiveInterlock: boolean
      type: string
    }
    zoneSelectiveInterlock: 'ground-fault-only' | 'ground-fault-instantaneous' | 'short-time-ground-fault' | 'short-time-ground-fault-instantaneous' | 'none' | ''
    measuringModule: string
  }
  onInputChange: (field: string, value: unknown) => void
}

export default function FeedersSection({ 
  formData, 
  onInputChange 
}: FeedersSectionProps) {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])

  const handleAddDevice = () => {
    const newDevice: FeederDevice = {
      id: Date.now().toString(),
      displayName: `Feeder: ${formData.feederDevices.length + 1}`,
      quantity: 1,
      deviceType: 'Breaker',
      construction: 'Group',
      tripAmps: 400,
      poles: 3,
      frame: 'XT1N160',
      sensor: '40T',
      hundredPercent: false,
      operation: 'Manual',
      mounting: 'Fixed'
    }
    
    onInputChange('feederDevices', [...formData.feederDevices, newDevice])
  }

  const handleDeleteSelected = () => {
    const updatedDevices = formData.feederDevices.filter(device => !selectedDevices.includes(device.id))
    onInputChange('feederDevices', updatedDevices)
    setSelectedDevices([])
  }

  const handleDeleteAll = () => {
    onInputChange('feederDevices', [])
    setSelectedDevices([])
  }

  const handleCopyDevice = (deviceId: string) => {
    const deviceToCopy = formData.feederDevices.find(device => device.id === deviceId)
    if (deviceToCopy) {
      const copiedDevice: FeederDevice = {
        ...deviceToCopy,
        id: Date.now().toString(),
        displayName: `${deviceToCopy.displayName} (Copy)`
      }
      onInputChange('feederDevices', [...formData.feederDevices, copiedDevice])
    }
  }

  const handleDeviceChange = (deviceId: string, field: string, value: string | number | boolean) => {
    const updatedDevices = formData.feederDevices.map(device => 
      device.id === deviceId ? { ...device, [field]: value } : device
    )
    onInputChange('feederDevices', updatedDevices)
  }

  const handleCheckboxChange = (deviceId: string, checked: boolean) => {
    if (checked) {
      setSelectedDevices(prev => [...prev, deviceId])
    } else {
      setSelectedDevices(prev => prev.filter(id => id !== deviceId))
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Feeders</h2>
      
      {/* Devices Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                  <input
                    type="checkbox"
                    checked={selectedDevices.length === formData.feederDevices.length && formData.feederDevices.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDevices(formData.feederDevices.map(device => device.id))
                      } else {
                        setSelectedDevices([])
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Display Name</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device Type</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Construction</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip Amps</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poles</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frame</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sensor</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">100%</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operation</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mounting</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {formData.feederDevices.map((device) => (
                <tr key={device.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedDevices.includes(device.id)}
                      onChange={(e) => handleCheckboxChange(device.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={device.displayName}
                      onChange={(e) => handleDeviceChange(device.id, 'displayName', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="1"
                      value={device.quantity}
                      onChange={(e) => handleDeviceChange(device.id, 'quantity', parseInt(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <select
                      value={device.deviceType}
                      onChange={(e) => handleDeviceChange(device.id, 'deviceType', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="Breaker">Breaker</option>
                      <option value="Switch">Switch</option>
                      <option value="Fuse">Fuse</option>
                    </select>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <select
                      value={device.construction}
                      onChange={(e) => handleDeviceChange(device.id, 'construction', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="Group">Group</option>
                      <option value="Individual">Individual</option>
                    </select>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={device.tripAmps}
                      onChange={(e) => handleDeviceChange(device.id, 'tripAmps', parseInt(e.target.value))}
                      className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <select
                      value={device.poles}
                      onChange={(e) => handleDeviceChange(device.id, 'poles', parseInt(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <select
                      value={device.frame}
                      onChange={(e) => handleDeviceChange(device.id, 'frame', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="XT1N160">XT1N160</option>
                      <option value="XT1N250">XT1N250</option>
                      <option value="XT2N160">XT2N160</option>
                      <option value="XT2N250">XT2N250</option>
                      <option value="XT3N250">XT3N250</option>
                      <option value="XT4N250">XT4N250</option>
                    </select>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <select
                      value={device.sensor}
                      onChange={(e) => handleDeviceChange(device.id, 'sensor', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="40T">40T</option>
                      <option value="60T">60T</option>
                      <option value="80T">80T</option>
                      <option value="100T">100T</option>
                      <option value="120T">120T</option>
                      <option value="160T">160T</option>
                    </select>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      checked={device.hundredPercent}
                      onChange={(e) => handleDeviceChange(device.id, 'hundredPercent', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <select
                      value={device.operation}
                      onChange={(e) => handleDeviceChange(device.id, 'operation', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="Manual">Manual</option>
                      <option value="Electric">Electric</option>
                      <option value="Spring">Spring</option>
                    </select>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <select
                      value={device.mounting}
                      onChange={(e) => handleDeviceChange(device.id, 'mounting', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="Fixed">Fixed</option>
                      <option value="Drawout">Drawout</option>
                      <option value="Plug-in">Plug-in</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Action Buttons */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleAddDevice}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
            >
              Add
            </button>
            <button
              onClick={handleDeleteSelected}
              disabled={selectedDevices.length === 0}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </button>
            <button
              onClick={() => selectedDevices.forEach(handleCopyDevice)}
              disabled={selectedDevices.length === 0}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Copy
            </button>
            <button
              onClick={handleDeleteAll}
              disabled={formData.feederDevices.length === 0}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete All
            </button>
            <button
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
            >
              Accessories
            </button>
          </div>
          <button
            className="bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
          >
            Quick Entry
          </button>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Fuse Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fuse Type
          </label>
          <select
            value={formData.fuseType}
            onChange={(e) => onInputChange('fuseType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
          >
            <option value="">Select Fuse Type</option>
            <option value="Class L">Class L</option>
            <option value="Class J">Class J</option>
            <option value="Class T">Class T</option>
          </select>
        </div>

        {/* Device Association */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Device Association
          </label>
          <select
            value={formData.deviceAssociation}
            onChange={(e) => onInputChange('deviceAssociation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
          >
            <option value="">Select Association</option>
            <option value="Main">Main</option>
            <option value="Feeder">Feeder</option>
            <option value="Utility">Utility</option>
          </select>
        </div>

        {/* Fed By Main */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fed By Main
          </label>
          <select
            value={formData.fedByMain}
            onChange={(e) => onInputChange('fedByMain', e.target.value)}
            className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
          >
            <option value="">Select Fed By Main</option>
            <option value="Main 1">Main 1</option>
            <option value="Main 2">Main 2</option>
            <option value="Utility">Utility</option>
          </select>
        </div>

        {/* Provide Lugs */}
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            id="provideLugs"
            checked={formData.provideLugs}
            onChange={(e) => onInputChange('provideLugs', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="provideLugs" className="ml-2 text-sm font-medium text-gray-700">
            Provide Lugs
          </label>
        </div>
      </div>

      {/* Load Connection */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-slate-700 text-white px-4 py-3">
          <h3 className="text-base font-semibold">Load Connection</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Load Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Load Type
              </label>
              <select
                value={formData.loadConnection.loadType}
                onChange={(e) => onInputChange('loadConnection', { 
                  ...formData.loadConnection, 
                  loadType: e.target.value 
                })}
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="">Select Load Type</option>
                <option value="Bus">Bus</option>
                <option value="Cable">Cable</option>
                <option value="Conduit">Conduit</option>
              </select>
            </div>

            {/* Load Wire Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Load Wire Type
              </label>
              <div className="flex items-center space-x-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="loadWireType"
                    value="3-wire"
                    checked={formData.loadConnection.loadWireType === '3-wire'}
                    onChange={(e) => onInputChange('loadConnection', { 
                      ...formData.loadConnection, 
                      loadWireType: e.target.value as '3-wire' | '4-wire' 
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">3 Wire</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="loadWireType"
                    value="4-wire"
                    checked={formData.loadConnection.loadWireType === '4-wire'}
                    onChange={(e) => onInputChange('loadConnection', { 
                      ...formData.loadConnection, 
                      loadWireType: e.target.value as '3-wire' | '4-wire' 
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">4 Wire</span>
                </label>
              </div>
            </div>

            {/* Empty cell for alignment */}
            <div></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Strap Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Strap Type
              </label>
              <select
                value={formData.loadConnection.strapType}
                onChange={(e) => onInputChange('loadConnection', { 
                  ...formData.loadConnection, 
                  strapType: e.target.value 
                })}
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="">Select Strap Type</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Multiple">Multiple</option>
              </select>
            </div>

            {/* Lug Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lug Type
              </label>
              <select
                value={formData.loadConnection.lugType}
                onChange={(e) => onInputChange('loadConnection', { 
                  ...formData.loadConnection, 
                  lugType: e.target.value 
                })}
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="">Select Lug Type</option>
                <option value="Mechanical AL">Mechanical AL</option>
                <option value="Mechanical CU">Mechanical CU</option>
                <option value="Compression">Compression</option>
              </select>
            </div>

            {/* Cable Material */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cable Material
              </label>
              <select
                value={formData.loadConnection.cableMaterial}
                onChange={(e) => onInputChange('loadConnection', { 
                  ...formData.loadConnection, 
                  cableMaterial: e.target.value 
                })}
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="">Select Material</option>
                <option value="Copper">Copper</option>
                <option value="Aluminum">Aluminum</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Load Exit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Load Exit
              </label>
              <select
                value={formData.loadConnection.loadExit}
                onChange={(e) => onInputChange('loadConnection', { 
                  ...formData.loadConnection, 
                  loadExit: e.target.value 
                })}
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="">Select Exit</option>
                <option value="Top">Top</option>
                <option value="Bottom">Bottom</option>
                <option value="Left">Left</option>
                <option value="Right">Right</option>
              </select>
            </div>

            {/* Cable Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cable Size
              </label>
              <select
                value={formData.loadConnection.cableSize}
                onChange={(e) => onInputChange('loadConnection', { 
                  ...formData.loadConnection, 
                  cableSize: e.target.value 
                })}
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="">Select Size</option>
                <option value="4/0 - 500 MCM">4/0 - 500 MCM</option>
                <option value="600 - 1000 MCM">600 - 1000 MCM</option>
                <option value="1250 - 2000 MCM">1250 - 2000 MCM</option>
              </select>
            </div>

            {/* Cables/Ph */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cables/Ph
              </label>
              <select
                value={formData.loadConnection.cablesPerPhase}
                onChange={(e) => onInputChange('loadConnection', { 
                  ...formData.loadConnection, 
                  cablesPerPhase: e.target.value 
                })}
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
        </div>
      </div>

      {/* Protection and Features */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-slate-700 text-white px-4 py-3">
          <h3 className="text-base font-semibold">Protection and Features</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="feederPhaseFailure"
                checked={formData.protectionFeatures.phaseFailure}
                onChange={(e) => onInputChange('protectionFeatures', { 
                  ...formData.protectionFeatures, 
                  phaseFailure: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="feederPhaseFailure" className="ml-2 text-sm font-medium text-gray-700">
                Phase Failure
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="feederCapTrip"
                checked={formData.protectionFeatures.capTrip}
                onChange={(e) => onInputChange('protectionFeatures', { 
                  ...formData.protectionFeatures, 
                  capTrip: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="feederCapTrip" className="ml-2 text-sm font-medium text-gray-700">
                Cap Trip
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="feederGfRelay"
                checked={formData.protectionFeatures.geItiBgflGfRelay}
                onChange={(e) => onInputChange('protectionFeatures', { 
                  ...formData.protectionFeatures, 
                  geItiBgflGfRelay: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="feederGfRelay" className="ml-2 text-sm font-medium text-gray-700">
                GE/ITI BGFL GF Relay
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="feederSubMetering"
                checked={formData.protectionFeatures.subMeteringRgm4500q}
                onChange={(e) => onInputChange('protectionFeatures', { 
                  ...formData.protectionFeatures, 
                  subMeteringRgm4500q: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="feederSubMetering" className="ml-2 text-sm font-medium text-gray-700">
                SubMetering - RGM4500Q
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="feederMultiStack"
                checked={formData.protectionFeatures.multiStack}
                onChange={(e) => onInputChange('protectionFeatures', { 
                  ...formData.protectionFeatures, 
                  multiStack: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="feederMultiStack" className="ml-2 text-sm font-medium text-gray-700">
                Multi Stack
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="feederProvideFuses"
                checked={formData.protectionFeatures.provideFuses}
                onChange={(e) => onInputChange('protectionFeatures', { 
                  ...formData.protectionFeatures, 
                  provideFuses: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="feederProvideFuses" className="ml-2 text-sm font-medium text-gray-700">
                Provide Fuses
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Programmer */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-slate-700 text-white px-4 py-3">
          <h3 className="text-base font-semibold">Programmer</h3>
        </div>
        <div className="p-4">
          {/* Mode Selection and Zone Selective Interlock */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left Side - Mode Selection */}
            <div>
              <div className="space-y-3 mb-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="feederInstantaneous"
                    name="feederProgrammerMode"
                    value="instantaneous"
                    checked={formData.programmer.mode === 'instantaneous'}
                    onChange={(e) => onInputChange('programmer', { 
                      ...formData.programmer, 
                      mode: e.target.value as 'instantaneous' | 'fuse-only' | 'none' 
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="feederInstantaneous" className="ml-2 text-sm font-medium text-gray-700">
                    Instantaneous
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="feederFuseOnly"
                    name="feederProgrammerMode"
                    value="fuse-only"
                    checked={formData.programmer.mode === 'fuse-only'}
                    onChange={(e) => onInputChange('programmer', { 
                      ...formData.programmer, 
                      mode: e.target.value as 'instantaneous' | 'fuse-only' | 'none' 
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="feederFuseOnly" className="ml-2 text-sm font-medium text-gray-700">
                    Fuse Only
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="feederNone"
                    name="feederProgrammerMode"
                    value="none"
                    checked={formData.programmer.mode === 'none'}
                    onChange={(e) => onInputChange('programmer', { 
                      ...formData.programmer, 
                      mode: e.target.value as 'instantaneous' | 'fuse-only' | 'none' 
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="feederNone" className="ml-2 text-sm font-medium text-gray-700">
                    None
                  </label>
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.programmer.type}
                  onChange={(e) => onInputChange('programmer', { 
                    ...formData.programmer, 
                    type: e.target.value 
                  })}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="">Select Type</option>
                  <option value="EKIP Touch">EKIP Touch</option>
                  <option value="EKIP Hi-Touch">EKIP Hi-Touch</option>
                  <option value="EKIP LSI">EKIP LSI</option>
                  <option value="EKIP LSIG">EKIP LSIG</option>
                </select>
              </div>
            </div>

            {/* Right Side - Zone Selective Interlock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Zone Selective Interlock
              </label>
              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="groundFaultOnly"
                    name="zoneSelectiveInterlock"
                    value="ground-fault-only"
                    checked={formData.zoneSelectiveInterlock === 'ground-fault-only'}
                    onChange={(e) => onInputChange('zoneSelectiveInterlock', e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="groundFaultOnly" className="ml-2 text-sm text-gray-700">
                    Ground Fault Only
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="groundFaultInstantaneous"
                    name="zoneSelectiveInterlock"
                    value="ground-fault-instantaneous"
                    checked={formData.zoneSelectiveInterlock === 'ground-fault-instantaneous'}
                    onChange={(e) => onInputChange('zoneSelectiveInterlock', e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="groundFaultInstantaneous" className="ml-2 text-sm text-gray-700">
                    Ground Fault/Instantaneous
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="shortTimeGroundFault"
                    name="zoneSelectiveInterlock"
                    value="short-time-ground-fault"
                    checked={formData.zoneSelectiveInterlock === 'short-time-ground-fault'}
                    onChange={(e) => onInputChange('zoneSelectiveInterlock', e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="shortTimeGroundFault" className="ml-2 text-sm text-gray-700">
                    Short Time/Ground Fault
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="shortTimeGroundFaultInstantaneous"
                    name="zoneSelectiveInterlock"
                    value="short-time-ground-fault-instantaneous"
                    checked={formData.zoneSelectiveInterlock === 'short-time-ground-fault-instantaneous'}
                    onChange={(e) => onInputChange('zoneSelectiveInterlock', e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="shortTimeGroundFaultInstantaneous" className="ml-2 text-sm text-gray-700">
                    Short Time/Ground Fault/Instantaneous
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="zoneNone"
                    name="zoneSelectiveInterlock"
                    value="none"
                    checked={formData.zoneSelectiveInterlock === 'none'}
                    onChange={(e) => onInputChange('zoneSelectiveInterlock', e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="zoneNone" className="ml-2 text-sm text-gray-700">
                    None
                  </label>
                </div>
              </div>

              {/* Measuring Module */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Measuring Module
                </label>
                <select
                  value={formData.measuringModule}
                  onChange={(e) => onInputChange('measuringModule', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="">Select Module</option>
                  <option value="Basic">Basic</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
            </div>
          </div>

          {/* Protection Features Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="feederLongTime"
                checked={formData.programmer.longTime}
                onChange={(e) => onInputChange('programmer', { 
                  ...formData.programmer, 
                  longTime: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="feederLongTime" className="ml-2 text-sm font-medium text-gray-700">
                Long Time
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="feederShortTime"
                checked={formData.programmer.shortTime}
                onChange={(e) => onInputChange('programmer', { 
                  ...formData.programmer, 
                  shortTime: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="feederShortTime" className="ml-2 text-sm font-medium text-gray-700">
                Short Time
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="feederRelt"
                checked={formData.programmer.relt}
                onChange={(e) => onInputChange('programmer', { 
                  ...formData.programmer, 
                  relt: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="feederRelt" className="ml-2 text-sm font-medium text-gray-700">
                RELT
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="feederGroundFault"
                checked={formData.programmer.groundFault}
                onChange={(e) => onInputChange('programmer', { 
                  ...formData.programmer, 
                  groundFault: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="feederGroundFault" className="ml-2 text-sm font-medium text-gray-700">
                Ground Fault
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="feederGfAlarm"
                checked={formData.programmer.gfAlarm}
                onChange={(e) => onInputChange('programmer', { 
                  ...formData.programmer, 
                  gfAlarm: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="feederGfAlarm" className="ml-2 text-sm font-medium text-gray-700">
                GF Alarm
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="feederNeutralProtection"
                checked={formData.programmer.neutralProtection}
                onChange={(e) => onInputChange('programmer', { 
                  ...formData.programmer, 
                  neutralProtection: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="feederNeutralProtection" className="ml-2 text-sm font-medium text-gray-700">
                Neutral Protection
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="feederMeteringCommunication"
                checked={formData.programmer.meteringCommunication}
                onChange={(e) => onInputChange('programmer', { 
                  ...formData.programmer, 
                  meteringCommunication: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="feederMeteringCommunication" className="ml-2 text-sm font-medium text-gray-700">
                Metering/Communication
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="feederProtectiveRelays"
                checked={formData.programmer.protectiveRelays}
                onChange={(e) => onInputChange('programmer', { 
                  ...formData.programmer, 
                  protectiveRelays: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="feederProtectiveRelays" className="ml-2 text-sm font-medium text-gray-700">
                Protective Relays
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="feederRgZoneSelectiveInterlock"
                checked={formData.programmer.rgZoneSelectiveInterlock}
                onChange={(e) => onInputChange('programmer', { 
                  ...formData.programmer, 
                  rgZoneSelectiveInterlock: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="feederRgZoneSelectiveInterlock" className="ml-2 text-sm font-medium text-gray-700">
                RG-Zone Selective Interlock
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 