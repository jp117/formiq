'use client'

interface UtilityInfoSectionProps {
  formData: {
    utilityCompany: string
    accountNumber: string
    serviceClass: string
    meterType: string
    billingDemand: string
  }
  onInputChange: (field: string, value: string | boolean) => void
}

export default function UtilityInfoSection({ formData, onInputChange }: UtilityInfoSectionProps) {
  return (
    <div className="mb-8">
      <div className="bg-slate-700 text-white px-4 py-2 rounded-t-md">
        <h3 className="text-base font-semibold">Utility Information</h3>
      </div>
      <div className="p-4 border border-gray-200 rounded-b-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Utility Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Utility Company
            </label>
            <input
              type="text"
              value={formData.utilityCompany}
              onChange={(e) => onInputChange('utilityCompany', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              placeholder="Enter utility company name"
            />
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <input
              type="text"
              value={formData.accountNumber}
              onChange={(e) => onInputChange('accountNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              placeholder="Enter account number"
            />
          </div>

          {/* Service Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Class
            </label>
            <select
              value={formData.serviceClass}
              onChange={(e) => onInputChange('serviceClass', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="">Select Service Class</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Agricultural">Agricultural</option>
            </select>
          </div>

          {/* Meter Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meter Type
            </label>
            <select
              value={formData.meterType}
              onChange={(e) => onInputChange('meterType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="">Select Meter Type</option>
              <option value="Single Phase">Single Phase</option>
              <option value="Three Phase">Three Phase</option>
              <option value="CT Metered">CT Metered</option>
              <option value="Self-Contained">Self-Contained</option>
            </select>
          </div>

          {/* Billing Demand */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Billing Demand (kW)
            </label>
            <input
              type="text"
              value={formData.billingDemand}
              onChange={(e) => onInputChange('billingDemand', e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              placeholder="Enter billing demand"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 