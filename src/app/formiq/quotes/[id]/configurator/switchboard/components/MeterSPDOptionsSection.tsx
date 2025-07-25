'use client'

interface MeterSPDOptionsSectionProps {
  formData: {
    brekerCommunications: {
      ethernetGateway: boolean
      rtuToEthernet: boolean
    }
    meterMonitoring: {
      meterType: string
      spdType: string
      ammeterAndSwitch: boolean
      voltmeterAndSwitch: boolean
    }[]
    customerInstrumentation: {
      meterType: string
      quantity: number
      ammeterAndSwitch: boolean
      voltmeterAndSwitch: boolean
      potentialTransformer: boolean
      neutralCT: boolean
      wattmeter: boolean
    }
    surgeProtectiveDevice: {
      spdType: string
      certification: 'type1' | 'type2' | ''
      quantity: number
      mounting: 'individually' | 'group' | ''
      indicatingLight: boolean
      alarm: boolean
      formCContacts: boolean
      surgeCounter: boolean
    }
  }
  onInputChange: (field: string, value: unknown) => void
}

export default function MeterSPDOptionsSection({ 
  formData, 
  onInputChange 
}: MeterSPDOptionsSectionProps) {

  const handleBreakerCommunicationsChange = (field: string, value: boolean) => {
    onInputChange('brekerCommunications', {
      ...formData.brekerCommunications,
      [field]: value
    })
  }

  const handleCustomerInstrumentationChange = (field: string, value: unknown) => {
    onInputChange('customerInstrumentation', {
      ...formData.customerInstrumentation,
      [field]: value
    })
  }

  const handleSurgeProtectiveDeviceChange = (field: string, value: unknown) => {
    onInputChange('surgeProtectiveDevice', {
      ...formData.surgeProtectiveDevice,
      [field]: value
    })
  }

  const addMeterRow = () => {
    const newRow = {
      meterType: 'None',
      spdType: 'None',
      ammeterAndSwitch: false,
      voltmeterAndSwitch: false
    }
    onInputChange('meterMonitoring', [...formData.meterMonitoring, newRow])
  }

  const removeMeterRow = (index: number) => {
    const updated = formData.meterMonitoring.filter((_, i) => i !== index)
    onInputChange('meterMonitoring', updated)
  }

  const updateMeterRow = (index: number, field: string, value: unknown) => {
    const updated = formData.meterMonitoring.map((row, i) => 
      i === index ? { ...row, [field]: value } : row
    )
    onInputChange('meterMonitoring', updated)
  }

  return (
    <div className="space-y-6">
      {/* Breaker Communications */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="bg-slate-600 text-white px-4 py-3 rounded-t-lg">
          <h3 className="text-lg font-medium">Breaker Communications</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-6">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.brekerCommunications.ethernetGateway}
                onChange={(e) => handleBreakerCommunicationsChange('ethernetGateway', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Ethernet Gateway (Modbus RTU – Modbus TCP/IP)
              </span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.brekerCommunications.rtuToEthernet}
                onChange={(e) => handleBreakerCommunicationsChange('rtuToEthernet', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">RTU to Ethernet</span>
            </label>
          </div>
        </div>
      </div>

      {/* Meter Monitoring Table */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="bg-slate-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <h3 className="text-lg font-medium">Meter Monitoring</h3>
          <button
            onClick={addMeterRow}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          >
            Add Row
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Incoming</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Meter Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium">SPD Type</th>
                <th className="px-4 py-3 text-center text-sm font-medium">Ammeter And Switch</th>
                <th className="px-4 py-3 text-center text-sm font-medium">VoltMeter And Switch</th>
                <th className="px-4 py-3 text-center text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {formData.meterMonitoring.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">Main {index + 1}</td>
                  <td className="px-4 py-3">
                    <select
                      value={row.meterType}
                      onChange={(e) => updateMeterRow(index, 'meterType', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="None">None</option>
                      <option value="RGM4500Q">RGM4500Q</option>
                      <option value="RGM3800Q">RGM3800Q</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={row.spdType}
                      onChange={(e) => updateMeterRow(index, 'spdType', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="None">None</option>
                      <option value="Type1">Type 1</option>
                      <option value="Type2">Type 2</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={row.ammeterAndSwitch}
                      onChange={(e) => updateMeterRow(index, 'ammeterAndSwitch', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={row.voltmeterAndSwitch}
                      onChange={(e) => updateMeterRow(index, 'voltmeterAndSwitch', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => removeMeterRow(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Instrumentation and Surge Protective Device in two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Instrumentation */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="bg-slate-600 text-white px-4 py-3 rounded-t-lg">
            <h3 className="text-lg font-medium">Customer Instrumentation</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meter Type</label>
              <select
                value={formData.customerInstrumentation.meterType}
                onChange={(e) => handleCustomerInstrumentationChange('meterType', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="None">None</option>
                <option value="RGM4500Q">RGM4500Q</option>
                <option value="RGM3800Q">RGM3800Q</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
              <input
                type="number"
                value={formData.customerInstrumentation.quantity}
                onChange={(e) => handleCustomerInstrumentationChange('quantity', parseInt(e.target.value))}
                className="w-20 p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.customerInstrumentation.ammeterAndSwitch}
                  onChange={(e) => handleCustomerInstrumentationChange('ammeterAndSwitch', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Ammeter and Switch</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.customerInstrumentation.voltmeterAndSwitch}
                  onChange={(e) => handleCustomerInstrumentationChange('voltmeterAndSwitch', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Voltmeter and Switch</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.customerInstrumentation.potentialTransformer}
                  onChange={(e) => handleCustomerInstrumentationChange('potentialTransformer', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Potential Transformer</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.customerInstrumentation.neutralCT}
                  onChange={(e) => handleCustomerInstrumentationChange('neutralCT', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Neutral CT</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.customerInstrumentation.wattmeter}
                  onChange={(e) => handleCustomerInstrumentationChange('wattmeter', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Wattmeter</span>
              </label>
            </div>
          </div>
        </div>

        {/* Surge Protective Device */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="bg-slate-600 text-white px-4 py-3 rounded-t-lg">
            <h3 className="text-lg font-medium">Surge Protective Device</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SPD Type</label>
              <select
                value={formData.surgeProtectiveDevice.spdType}
                onChange={(e) => handleSurgeProtectiveDeviceChange('spdType', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="None">None</option>
                <option value="Type1">Type 1</option>
                <option value="Type2">Type 2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Certification</label>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="type1"
                    checked={formData.surgeProtectiveDevice.certification === 'type1'}
                    onChange={(e) => handleSurgeProtectiveDeviceChange('certification', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Type 1</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="type2"
                    checked={formData.surgeProtectiveDevice.certification === 'type2'}
                    onChange={(e) => handleSurgeProtectiveDeviceChange('certification', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Type 2</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
              <input
                type="number"
                value={formData.surgeProtectiveDevice.quantity}
                onChange={(e) => handleSurgeProtectiveDeviceChange('quantity', parseInt(e.target.value))}
                className="w-20 p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mounting</label>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="individually"
                    checked={formData.surgeProtectiveDevice.mounting === 'individually'}
                    onChange={(e) => handleSurgeProtectiveDeviceChange('mounting', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Individually Mounted</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="group"
                    checked={formData.surgeProtectiveDevice.mounting === 'group'}
                    onChange={(e) => handleSurgeProtectiveDeviceChange('mounting', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Group Mounted</span>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.surgeProtectiveDevice.indicatingLight}
                  onChange={(e) => handleSurgeProtectiveDeviceChange('indicatingLight', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Indicating Light</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.surgeProtectiveDevice.alarm}
                  onChange={(e) => handleSurgeProtectiveDeviceChange('alarm', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Alarm</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.surgeProtectiveDevice.formCContacts}
                  onChange={(e) => handleSurgeProtectiveDeviceChange('formCContacts', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Form C Contacts</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.surgeProtectiveDevice.surgeCounter}
                  onChange={(e) => handleSurgeProtectiveDeviceChange('surgeCounter', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Surge Counter</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 