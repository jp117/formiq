'use client'

interface OptionsSectionProps {
  formData: {
    generalOptions: {
      dripResistanceRoof: boolean
      portableTripUnitTestKit: boolean
      neutralsAndGroundFollowsFeederLoadExit: boolean
      fullHeightRearHingeDoor: boolean
      hingedWireGutterCover: boolean
      doNotIntermixMainAndUtility: boolean
      seismicRating: boolean
      fullHeightSectionBarriers: boolean
      liftingBracket: boolean
      doNotIntermixMainAndPanel: boolean
      e9000MCCTransition: boolean
      avTransition: boolean
      fullHeightVerticalBusForDistributionSection: boolean
      lightningArrestor: boolean
      surgeCapacitor: boolean
      doNotStackTransformers: boolean
      twoSidedPanel: boolean
      floorPlates: boolean
      floorSill: boolean
      changeCopperBusPlatingToTIN: boolean
      enableLegacyProducts: boolean
      certifiedTestReport: boolean
      fullyRatedPanelBus: boolean
    }
    mimicBus: string
    shippingBreak: 'each-section' | 'two-sections' | ''
    drawoutLiftingOptions: 'floor-crane' | 'stationary-hoist' | 'moveable-hoist' | 'none' | ''
    sectionHeater: {
      enabled: boolean
      thermostat: boolean
      controlPowerForSectionHeat: boolean
      humidistat: boolean
    }
    firePumpTap: {
      enabled: boolean
      lugType: string
      cableMaterial: string
      cableSize: string
      amps: string
      lugQtyPerPhase: string
    }
  }
  onInputChange: (field: string, value: unknown) => void
}

export default function OptionsSection({ 
  formData, 
  onInputChange 
}: OptionsSectionProps) {

  const handleGeneralOptionsChange = (option: string, value: boolean) => {
    onInputChange('generalOptions', {
      ...formData.generalOptions,
      [option]: value
    })
  }

  const handleSectionHeaterChange = (field: string, value: boolean) => {
    onInputChange('sectionHeater', {
      ...formData.sectionHeater,
      [field]: value
    })
  }

  const handleFirePumpTapChange = (field: string, value: unknown) => {
    onInputChange('firePumpTap', {
      ...formData.firePumpTap,
      [field]: value
    })
  }

  return (
    <div className="space-y-6">
      {/* General Options Grid */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">General Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Column 1 */}
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.generalOptions.dripResistanceRoof}
                onChange={(e) => handleGeneralOptionsChange('dripResistanceRoof', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Drip Resistance Roof</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.generalOptions.fullHeightRearHingeDoor}
                onChange={(e) => handleGeneralOptionsChange('fullHeightRearHingeDoor', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Full Height Rear Hinge Door</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.generalOptions.fullHeightSectionBarriers}
                onChange={(e) => handleGeneralOptionsChange('fullHeightSectionBarriers', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Full Height Section Barriers</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.generalOptions.e9000MCCTransition}
                onChange={(e) => handleGeneralOptionsChange('e9000MCCTransition', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">E9000 MCC Transition</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.generalOptions.lightningArrestor}
                onChange={(e) => handleGeneralOptionsChange('lightningArrestor', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Lightning Arrestor</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.generalOptions.floorPlates}
                onChange={(e) => handleGeneralOptionsChange('floorPlates', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Floor Plates</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.generalOptions.changeCopperBusPlatingToTIN}
                onChange={(e) => handleGeneralOptionsChange('changeCopperBusPlatingToTIN', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Change Copper bus plating to TIN</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.generalOptions.enableLegacyProducts}
                onChange={(e) => handleGeneralOptionsChange('enableLegacyProducts', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Enable Legacy Products</span>
            </label>
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.generalOptions.portableTripUnitTestKit}
                onChange={(e) => handleGeneralOptionsChange('portableTripUnitTestKit', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Portable Trip Unit Test Kit</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.generalOptions.hingedWireGutterCover}
                onChange={(e) => handleGeneralOptionsChange('hingedWireGutterCover', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Hinged Wire Gutter Cover</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.generalOptions.liftingBracket}
                onChange={(e) => handleGeneralOptionsChange('liftingBracket', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Lifting Bracket</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.generalOptions.avTransition}
                onChange={(e) => handleGeneralOptionsChange('avTransition', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">AV Transition</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.generalOptions.surgeCapacitor}
                onChange={(e) => handleGeneralOptionsChange('surgeCapacitor', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Surge Capacitor</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.generalOptions.floorSill}
                onChange={(e) => handleGeneralOptionsChange('floorSill', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Floor Sill</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.generalOptions.certifiedTestReport}
                onChange={(e) => handleGeneralOptionsChange('certifiedTestReport', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Certified Test Report</span>
            </label>
          </div>

          {/* Column 3 */}
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.generalOptions.neutralsAndGroundFollowsFeederLoadExit}
                onChange={(e) => handleGeneralOptionsChange('neutralsAndGroundFollowsFeederLoadExit', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Neutrals And Ground Follows Feeder Load Exit</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.generalOptions.doNotIntermixMainAndUtility}
                onChange={(e) => handleGeneralOptionsChange('doNotIntermixMainAndUtility', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Do Not Intermix Main And Utility</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.generalOptions.doNotIntermixMainAndPanel}
                onChange={(e) => handleGeneralOptionsChange('doNotIntermixMainAndPanel', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Do Not Intermix Main And Panel</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.generalOptions.fullHeightVerticalBusForDistributionSection}
                onChange={(e) => handleGeneralOptionsChange('fullHeightVerticalBusForDistributionSection', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Full Height Vertical Bus For Distribution Section</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.generalOptions.doNotStackTransformers}
                onChange={(e) => handleGeneralOptionsChange('doNotStackTransformers', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Do Not Stack Transformers</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.generalOptions.seismicRating}
                onChange={(e) => handleGeneralOptionsChange('seismicRating', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Seismic Rating</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.generalOptions.twoSidedPanel}
                onChange={(e) => handleGeneralOptionsChange('twoSidedPanel', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Two Sided Panel</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.generalOptions.fullyRatedPanelBus}
                onChange={(e) => handleGeneralOptionsChange('fullyRatedPanelBus', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Fully Rated Panel Bus</span>
            </label>
          </div>
        </div>
      </div>

      {/* Additional Options Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mimic Bus */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Mimic Bus</label>
          <select
            value={formData.mimicBus}
            onChange={(e) => onInputChange('mimicBus', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="None">None</option>
            <option value="Single Line">Single Line</option>
            <option value="Double Line">Double Line</option>
            <option value="Full Mimic">Full Mimic</option>
          </select>
        </div>

        {/* Shipping Break */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Break</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="each-section"
                checked={formData.shippingBreak === 'each-section'}
                onChange={(e) => onInputChange('shippingBreak', e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Each Section (std)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="two-sections"
                checked={formData.shippingBreak === 'two-sections'}
                onChange={(e) => onInputChange('shippingBreak', e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Two Sections</span>
            </label>
          </div>
        </div>

        {/* Drawout Lifting Options */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Drawout Lifting Options</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="floor-crane"
                checked={formData.drawoutLiftingOptions === 'floor-crane'}
                onChange={(e) => onInputChange('drawoutLiftingOptions', e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Floor Crane</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="stationary-hoist"
                checked={formData.drawoutLiftingOptions === 'stationary-hoist'}
                onChange={(e) => onInputChange('drawoutLiftingOptions', e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Stationary Hoist</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="moveable-hoist"
                checked={formData.drawoutLiftingOptions === 'moveable-hoist'}
                onChange={(e) => onInputChange('drawoutLiftingOptions', e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Moveable Hoist</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="none"
                checked={formData.drawoutLiftingOptions === 'none'}
                onChange={(e) => onInputChange('drawoutLiftingOptions', e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">None</span>
            </label>
          </div>
        </div>
      </div>

      {/* Section Heater and Fire Pump Tap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section Heater */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <label className="flex items-center space-x-3 mb-4">
            <input
              type="checkbox"
              checked={formData.sectionHeater.enabled}
              onChange={(e) => handleSectionHeaterChange('enabled', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Section Heater</span>
          </label>

          {formData.sectionHeater.enabled && (
            <div className="ml-7 space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.sectionHeater.thermostat}
                  onChange={(e) => handleSectionHeaterChange('thermostat', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Thermostat</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.sectionHeater.controlPowerForSectionHeat}
                  onChange={(e) => handleSectionHeaterChange('controlPowerForSectionHeat', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Control Power For Section Heat</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.sectionHeater.humidistat}
                  onChange={(e) => handleSectionHeaterChange('humidistat', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Humidistat</span>
              </label>
            </div>
          )}
        </div>

        {/* Fire Pump Tap */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="bg-slate-600 text-white px-4 py-3 rounded-t-lg">
            <h3 className="text-lg font-medium">Fire Pump Tap</h3>
          </div>
          <div className="p-4">
            <label className="flex items-center space-x-3 mb-4">
              <input
                type="checkbox"
                checked={formData.firePumpTap.enabled}
                onChange={(e) => handleFirePumpTapChange('enabled', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Fire Pump Tap</span>
            </label>

            {formData.firePumpTap.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lug Type</label>
                  <select
                    value={formData.firePumpTap.lugType}
                    onChange={(e) => handleFirePumpTapChange('lugType', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Compression">Compression</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cable Material</label>
                  <select
                    value={formData.firePumpTap.cableMaterial}
                    onChange={(e) => handleFirePumpTapChange('cableMaterial', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="Copper">Copper</option>
                    <option value="Aluminum">Aluminum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cable Size</label>
                  <select
                    value={formData.firePumpTap.cableSize}
                    onChange={(e) => handleFirePumpTapChange('cableSize', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="250">250</option>
                    <option value="350">350</option>
                    <option value="500">500</option>
                    <option value="750">750</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amps</label>
                  <select
                    value={formData.firePumpTap.amps}
                    onChange={(e) => handleFirePumpTapChange('amps', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="200">200</option>
                    <option value="400">400</option>
                    <option value="600">600</option>
                    <option value="800">800</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lug Qty/Ph</label>
                  <select
                    value={formData.firePumpTap.lugQtyPerPhase}
                    onChange={(e) => handleFirePumpTapChange('lugQtyPerPhase', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 