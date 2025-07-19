'use client'

import { useState } from 'react'

interface DisconnectDevice {
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
}

interface IncomingServiceDisconnectSectionProps {
  formData: {
    disconnectDevices: DisconnectDevice[]
    application: string
    fuseType: string
    deviceAssociation: string
    sdLocation: string
    lineConnection: {
      feedType: string
      lugType: string
      cableMaterial: string
      strapType: string
      cableSize: string
      cablesPerPhase: string
    }
    loadConnection: {
      loadType: string
      lugType: string
      cableMaterial: string
      strapType: string
      cableSize: string
      cablesPerPhase: string
      loadExit: string
      allowLoadBusWithNoLoadDevices: boolean
    }
    protectionFeatures: {
      phaseFailure: boolean
      capTrip: boolean
      geItiBgflGfRelay: boolean
      multiStack: boolean
      provideFuses: boolean
      subMeteringRgm4500q: boolean
    }
    programmer: {
      mode: 'instantaneous' | 'fuse-only' | 'none' | ''
      longTime: boolean
      shortTime: boolean
      relt: boolean
      groundFault: boolean
      neutralProtection: boolean
      rgZoneSelectiveInterlock: boolean
      type: string
    }
  }
  onInputChange: (field: string, value: unknown) => void
}

export default function IncomingServiceDisconnectSection({ 
  formData, 
  onInputChange 
}: IncomingServiceDisconnectSectionProps) {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])

  const handleAddDevice = () => {
    const newDevice: DisconnectDevice = {
      id: Date.now().toString(),
      displayName: `Main: ${formData.disconnectDevices.length + 1}`,
      quantity: 1,
      deviceType: 'Breaker',
      construction: 'Group',
      tripAmps: 1200,
      poles: 3,
      frame: 'XT7H1200',
      sensor: '120T',
      hundredPercent: false,
      operation: 'Manual'
    }
    
    onInputChange('disconnectDevices', [...formData.disconnectDevices, newDevice])
  }



  const handleDeleteSelected = () => {
    const updatedDevices = formData.disconnectDevices.filter(device => !selectedDevices.includes(device.id))
    onInputChange('disconnectDevices', updatedDevices)
    setSelectedDevices([])
  }

  const handleDeleteAll = () => {
    onInputChange('disconnectDevices', [])
    setSelectedDevices([])
  }

  const handleCopyDevice = (deviceId: string) => {
    const deviceToCopy = formData.disconnectDevices.find(device => device.id === deviceId)
    if (deviceToCopy) {
      const copiedDevice: DisconnectDevice = {
        ...deviceToCopy,
        id: Date.now().toString(),
        displayName: `${deviceToCopy.displayName} (Copy)`
      }
      onInputChange('disconnectDevices', [...formData.disconnectDevices, copiedDevice])
    }
  }

  const handleDeviceChange = (deviceId: string, field: string, value: string | number | boolean) => {
    const updatedDevices = formData.disconnectDevices.map(device => 
      device.id === deviceId ? { ...device, [field]: value } : device
    )
    onInputChange('disconnectDevices', updatedDevices)
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
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Incoming Service Disconnect</h2>
      
      {/* Devices Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                  <input
                    type="checkbox"
                    checked={selectedDevices.length === formData.disconnectDevices.length && formData.disconnectDevices.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDevices(formData.disconnectDevices.map(device => device.id))
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {formData.disconnectDevices.map((device) => (
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
                      <option value="XT7H1200">XT7H1200</option>
                      <option value="XT7H1600">XT7H1600</option>
                      <option value="XT7H2000">XT7H2000</option>
                      <option value="XT7H2500">XT7H2500</option>
                    </select>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <select
                      value={device.sensor}
                      onChange={(e) => handleDeviceChange(device.id, 'sensor', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="120T">120T</option>
                      <option value="160T">160T</option>
                      <option value="200T">200T</option>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Action Buttons */}
        <div className="bg-gray-50 px-4 py-3 flex items-center space-x-3">
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
            disabled={formData.disconnectDevices.length === 0}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete All
          </button>
          <button
            className="bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
          >
            Accessories
          </button>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
            <option value="">Select Application</option>
            <option value="Main">Main</option>
            <option value="Service">Service</option>
            <option value="Feeder">Feeder</option>
          </select>
        </div>

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

        {/* SD Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SD Location
          </label>
          <select
            value={formData.sdLocation}
            onChange={(e) => onInputChange('sdLocation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
          >
            <option value="">Select Location</option>
            <option value="Top">Top</option>
            <option value="Bottom">Bottom</option>
            <option value="Left">Left</option>
            <option value="Right">Right</option>
          </select>
        </div>
      </div>

      {/* Line Connection and Load Connection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Connection */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-slate-700 text-white px-4 py-3">
            <h3 className="text-base font-semibold">Line Connection</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Feed Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feed Type
                </label>
                <select
                  value={formData.lineConnection.feedType}
                  onChange={(e) => onInputChange('lineConnection', { ...formData.lineConnection, feedType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="">Select Feed Type</option>
                  <option value="Cable">Cable</option>
                  <option value="Bus">Bus</option>
                  <option value="Conduit">Conduit</option>
                </select>
              </div>

              {/* Lug Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lug Type
                </label>
                <select
                  value={formData.lineConnection.lugType}
                  onChange={(e) => onInputChange('lineConnection', { ...formData.lineConnection, lugType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="">Select Lug Type</option>
                  <option value="Mechanical AL">Mechanical AL</option>
                  <option value="Mechanical CU">Mechanical CU</option>
                  <option value="Compression">Compression</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cable Material */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cable Material
                </label>
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

              {/* Strap Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Strap Type
                </label>
                <select
                  value={formData.lineConnection.strapType}
                  onChange={(e) => onInputChange('lineConnection', { ...formData.lineConnection, strapType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="">Select Strap Type</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Multiple">Multiple</option>
                </select>
              </div>

              {/* Cable Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cable Size
                </label>
                <select
                  value={formData.lineConnection.cableSize}
                  onChange={(e) => onInputChange('lineConnection', { ...formData.lineConnection, cableSize: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="">Select Size</option>
                  <option value="4/0 - 500 MCM">4/0 - 500 MCM</option>
                  <option value="600 - 1000 MCM">600 - 1000 MCM</option>
                  <option value="1250 - 2000 MCM">1250 - 2000 MCM</option>
                </select>
              </div>
            </div>

            <div>
              {/* Cables/Ph */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cables/Ph
                </label>
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
          </div>
        </div>

        {/* Load Connection */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-slate-700 text-white px-4 py-3">
            <h3 className="text-base font-semibold">Load Connection</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Load Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Load Type
                </label>
                <select
                  value={formData.loadConnection.loadType}
                  onChange={(e) => onInputChange('loadConnection', { ...formData.loadConnection, loadType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="">Select Load Type</option>
                  <option value="Bus">Bus</option>
                  <option value="Cable">Cable</option>
                  <option value="Conduit">Conduit</option>
                </select>
              </div>

              {/* Lug Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lug Type
                </label>
                <select
                  value={formData.loadConnection.lugType}
                  onChange={(e) => onInputChange('loadConnection', { ...formData.loadConnection, lugType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="">Select Lug Type</option>
                  <option value="Mechanical AL">Mechanical AL</option>
                  <option value="Mechanical CU">Mechanical CU</option>
                  <option value="Compression">Compression</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cable Material */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cable Material
                </label>
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

              {/* Strap Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Strap Type
                </label>
                <select
                  value={formData.loadConnection.strapType}
                  onChange={(e) => onInputChange('loadConnection', { ...formData.loadConnection, strapType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="">Select Strap Type</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Multiple">Multiple</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cable Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cable Size
                </label>
                <select
                  value={formData.loadConnection.cableSize}
                  onChange={(e) => onInputChange('loadConnection', { ...formData.loadConnection, cableSize: e.target.value })}
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

              {/* Load Exit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Load Exit
                </label>
                <select
                  value={formData.loadConnection.loadExit}
                  onChange={(e) => onInputChange('loadConnection', { ...formData.loadConnection, loadExit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="">Select Exit</option>
                  <option value="Top">Top</option>
                  <option value="Bottom">Bottom</option>
                  <option value="Left">Left</option>
                  <option value="Right">Right</option>
                </select>
              </div>
            </div>

            <div>
              {/* Allow Load Bus with no Load Devices */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowLoadBus"
                  checked={formData.loadConnection.allowLoadBusWithNoLoadDevices}
                  onChange={(e) => onInputChange('loadConnection', { 
                    ...formData.loadConnection, 
                    allowLoadBusWithNoLoadDevices: e.target.checked 
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="allowLoadBus" className="ml-2 text-sm font-medium text-gray-700">
                  Allow Load Bus with no Load Devices
                </label>
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* First Row */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="phaseFailure"
                checked={formData.protectionFeatures.phaseFailure}
                onChange={(e) => onInputChange('protectionFeatures', { 
                  ...formData.protectionFeatures, 
                  phaseFailure: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="phaseFailure" className="ml-2 text-sm font-medium text-gray-700">
                Phase Failure
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="capTrip"
                checked={formData.protectionFeatures.capTrip}
                onChange={(e) => onInputChange('protectionFeatures', { 
                  ...formData.protectionFeatures, 
                  capTrip: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="capTrip" className="ml-2 text-sm font-medium text-gray-700">
                Cap Trip
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="geItiBgflGfRelay"
                checked={formData.protectionFeatures.geItiBgflGfRelay}
                onChange={(e) => onInputChange('protectionFeatures', { 
                  ...formData.protectionFeatures, 
                  geItiBgflGfRelay: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="geItiBgflGfRelay" className="ml-2 text-sm font-medium text-gray-700">
                GE/ITI BGFL GF Relay
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="multiStack"
                checked={formData.protectionFeatures.multiStack}
                onChange={(e) => onInputChange('protectionFeatures', { 
                  ...formData.protectionFeatures, 
                  multiStack: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="multiStack" className="ml-2 text-sm font-medium text-gray-700">
                Multi Stack
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="provideFuses"
                checked={formData.protectionFeatures.provideFuses}
                onChange={(e) => onInputChange('protectionFeatures', { 
                  ...formData.protectionFeatures, 
                  provideFuses: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="provideFuses" className="ml-2 text-sm font-medium text-gray-700">
                Provide Fuses
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="subMeteringRgm4500q"
                checked={formData.protectionFeatures.subMeteringRgm4500q}
                onChange={(e) => onInputChange('protectionFeatures', { 
                  ...formData.protectionFeatures, 
                  subMeteringRgm4500q: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="subMeteringRgm4500q" className="ml-2 text-sm font-medium text-gray-700">
                SubMetering - RGM4500Q
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
          {/* Mode Selection and Type */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left Side - Mode Selection */}
            <div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="instantaneous"
                    name="programmerMode"
                    value="instantaneous"
                    checked={formData.programmer.mode === 'instantaneous'}
                    onChange={(e) => onInputChange('programmer', { 
                      ...formData.programmer, 
                      mode: e.target.value as 'instantaneous' | 'fuse-only' | 'none' 
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="instantaneous" className="ml-2 text-sm font-medium text-gray-700">
                    Instantaneous
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="fuseOnly"
                    name="programmerMode"
                    value="fuse-only"
                    checked={formData.programmer.mode === 'fuse-only'}
                    onChange={(e) => onInputChange('programmer', { 
                      ...formData.programmer, 
                      mode: e.target.value as 'instantaneous' | 'fuse-only' | 'none' 
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="fuseOnly" className="ml-2 text-sm font-medium text-gray-700">
                    Fuse Only
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="none"
                    name="programmerMode"
                    value="none"
                    checked={formData.programmer.mode === 'none'}
                    onChange={(e) => onInputChange('programmer', { 
                      ...formData.programmer, 
                      mode: e.target.value as 'instantaneous' | 'fuse-only' | 'none' 
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="none" className="ml-2 text-sm font-medium text-gray-700">
                    None
                  </label>
                </div>
              </div>
            </div>

            {/* Right Side - Type */}
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

          {/* Protection Features Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="longTime"
                checked={formData.programmer.longTime}
                onChange={(e) => onInputChange('programmer', { 
                  ...formData.programmer, 
                  longTime: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="longTime" className="ml-2 text-sm font-medium text-gray-700">
                Long Time
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="shortTime"
                checked={formData.programmer.shortTime}
                onChange={(e) => onInputChange('programmer', { 
                  ...formData.programmer, 
                  shortTime: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="shortTime" className="ml-2 text-sm font-medium text-gray-700">
                Short Time
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="relt"
                checked={formData.programmer.relt}
                onChange={(e) => onInputChange('programmer', { 
                  ...formData.programmer, 
                  relt: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="relt" className="ml-2 text-sm font-medium text-gray-700">
                RELT
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="groundFault"
                checked={formData.programmer.groundFault}
                onChange={(e) => onInputChange('programmer', { 
                  ...formData.programmer, 
                  groundFault: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="groundFault" className="ml-2 text-sm font-medium text-gray-700">
                Ground Fault
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="neutralProtection"
                checked={formData.programmer.neutralProtection}
                onChange={(e) => onInputChange('programmer', { 
                  ...formData.programmer, 
                  neutralProtection: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="neutralProtection" className="ml-2 text-sm font-medium text-gray-700">
                Neutral Protection
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rgZoneSelectiveInterlock"
                checked={formData.programmer.rgZoneSelectiveInterlock}
                onChange={(e) => onInputChange('programmer', { 
                  ...formData.programmer, 
                  rgZoneSelectiveInterlock: e.target.checked 
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="rgZoneSelectiveInterlock" className="ml-2 text-sm font-medium text-gray-700">
                RG-Zone Selective Interlock
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 