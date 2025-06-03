interface SwitchboardData {
  switchboardNumber: number
  soNumber: string
  customerName: string
  switchboardDesignation: string
  jobNameAddress: string
  sections: Array<{
    width: string
    height: string
    depth: string
    isStandard: boolean
    isLShaped: boolean
  }>
}

export async function generateFramePartsReport(
  reportName: string,
  switchboardsValue: number,
  switchboardsData: SwitchboardData[]
) {
  try {
    // Dynamic import to avoid SSR issues
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')
    
    // Create instance
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const margin = 20
    
    // Title Page
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.text('Frame Parts Report', pageWidth / 2, 40, { align: 'center' })
    
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text(reportName || 'Untitled Report', pageWidth / 2, 65, { align: 'center' })
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 85, { align: 'center' })
    doc.text(`Total Switchboards: ${switchboardsValue}`, pageWidth / 2, 95, { align: 'center' })

    let yPosition = 115

    // Collect all parts for summary
    const allParts: Array<{
      type: 'Standard' | 'L-Shaped'
      dimension: string
      part: 'Upright' | 'Width' | 'Depth'
      quantity: number
      switchboard?: string
    }> = []

    // Process each switchboard
    switchboardsData.forEach((switchboard) => {
      // Estimate height needed for this switchboard
      const standardSections = switchboard.sections?.filter(s => s.isStandard) || []
      const lShapedSections = switchboard.sections?.filter(s => s.isLShaped) || []
      
      let estimatedHeight = 0
      estimatedHeight += 8 // Switchboard identifier
      estimatedHeight += 4 * 8 // Detail lines (4 lines * 8 points each)
      estimatedHeight += 3 // Spacing after details
      
      if (standardSections.length > 0) {
        estimatedHeight += 10 // "Standard Sections:" header
        estimatedHeight += 20 + (standardSections.length * 12) // Table header + rows
        estimatedHeight += 10 // Spacing after table
      }
      
      if (lShapedSections.length > 0) {
        estimatedHeight += 10 // "L-Shaped Sections:" header  
        estimatedHeight += 20 + (lShapedSections.length * 12) // Table header + rows
        estimatedHeight += 15 // Spacing after table
      }
      
      // Only move to new page if switchboard won't fit AND we have room to start it
      // Large switchboards (>1 page) will naturally overflow to subsequent pages via autoTable
      const minStartHeight = 60 // Minimum space needed to start a switchboard
      if (yPosition + Math.min(estimatedHeight, minStartHeight) > 250) {
        doc.addPage()
        yPosition = 30
      }

      // Switchboard Details (compact format with separate lines)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text(`Switchboard ${switchboard.switchboardNumber}:`, margin, yPosition)
      yPosition += 8
      
      doc.setFont('helvetica', 'normal')
      const details = [
        `SO: ${switchboard.soNumber || 'N/A'}`,
        `Customer: ${switchboard.customerName || 'N/A'}`,
        `Designation: ${switchboard.switchboardDesignation || 'N/A'}`,
        `Job: ${switchboard.jobNameAddress || 'N/A'}`
      ]
      
      details.forEach(detail => {
        doc.text(detail, margin + 5, yPosition)
        yPosition += 8
      })
      
      yPosition += 3

      if (!switchboard.sections?.length) {
        doc.text('No sections configured', margin, yPosition)
        yPosition += 30
        return
      }

      // Standard Sections
      if (standardSections.length > 0) {
        doc.setFont('helvetica', 'bold')
        doc.text('Standard Sections:', margin, yPosition)
        yPosition += 10

        const standardData = standardSections.map((section) => {
          const width = section.width || '0'
          const height = section.height || '0'
          const depth = section.depth || '0'
          
          // Find the actual section index in the original array
          const actualIndex = switchboard.sections.findIndex(s => s === section)
          
          // Add to parts summary
          allParts.push(
            { type: 'Standard', dimension: `${height}"`, part: 'Upright', quantity: 4, switchboard: `SB${switchboard.switchboardNumber}` },
            { type: 'Standard', dimension: `${width}"`, part: 'Width', quantity: 4, switchboard: `SB${switchboard.switchboardNumber}` },
            { type: 'Standard', dimension: `${depth}"`, part: 'Depth', quantity: 4, switchboard: `SB${switchboard.switchboardNumber}` }
          )

          return [
            `Section ${actualIndex + 1}`,
            `${width}" W`,
            `${height}" H`, 
            `${depth}" D`,
            `(4) ${height}" Uprights`,
            `(4) ${width}" Width`,
            `(4) ${depth}" Depth`
          ]
        })

        autoTable(doc, {
          head: [['Section', 'Width', 'Height', 'Depth', 'Uprights Needed', 'Width Pieces', 'Depth Pieces']],
          body: standardData,
          startY: yPosition,
          margin: { left: margin, right: margin },
          theme: 'grid',
          headStyles: { fillColor: [76, 175, 80] },
          styles: { fontSize: 9 }
        })

        yPosition = (doc as typeof doc & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10
      }

      // L-Shaped Sections
      if (lShapedSections.length > 0) {
        doc.setFont('helvetica', 'bold')
        doc.text('L-Shaped Sections:', margin, yPosition)
        yPosition += 10

        const lShapedData = lShapedSections.map((section) => {
          const width = section.width || '0'
          const height = section.height || '0'
          const depth = section.depth || '0'
          
          // Find the actual section index in the original array
          const actualIndex = switchboard.sections.findIndex(s => s === section)
          
          // Add to parts summary
          allParts.push(
            { type: 'L-Shaped', dimension: `${height}"`, part: 'Upright', quantity: 4, switchboard: `SB${switchboard.switchboardNumber}` },
            { type: 'L-Shaped', dimension: `${width}"`, part: 'Width', quantity: 4, switchboard: `SB${switchboard.switchboardNumber}` },
            { type: 'L-Shaped', dimension: `${depth}"`, part: 'Depth', quantity: 4, switchboard: `SB${switchboard.switchboardNumber}` }
          )

          return [
            `Section ${actualIndex + 1}`,
            `${width}" W`,
            `${height}" H`,
            `${depth}" D`,
            `(4) ${height}" L-Uprights`,
            `(4) ${width}" L-Width`,
            `(4) ${depth}" L-Depth`
          ]
        })

        autoTable(doc, {
          head: [['Section', 'Width', 'Height', 'Depth', 'L-Uprights Needed', 'L-Width Pieces', 'L-Depth Pieces']],
          body: lShapedData,
          startY: yPosition,
          margin: { left: margin, right: margin },
          theme: 'grid',
          headStyles: { fillColor: [255, 152, 0] },
          styles: { fontSize: 9 }
        })

        yPosition = (doc as typeof doc & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15
      }

      // Add some spacing between switchboards
      yPosition += 10
    })

    // Summary Page
    doc.addPage()
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('Parts Summary - Batch Production', pageWidth / 2, 30, { align: 'center' })

    // Consolidate parts by type, dimension, and part
    const consolidatedParts = new Map<string, { quantity: number, switchboards: Set<string> }>()
    
    allParts.forEach(part => {
      const key = `${part.type}|${part.dimension}|${part.part}`
      if (consolidatedParts.has(key)) {
        const existing = consolidatedParts.get(key)!
        existing.quantity += part.quantity
        if (part.switchboard) existing.switchboards.add(part.switchboard)
      } else {
        consolidatedParts.set(key, { 
          quantity: part.quantity, 
          switchboards: new Set(part.switchboard ? [part.switchboard] : [])
        })
      }
    })

    // Create summary table data
    const summaryData: string[][] = []
    consolidatedParts.forEach((data, key) => {
      const [type, dimension, part] = key.split('|')
      summaryData.push([
        type,
        part,
        dimension,
        data.quantity.toString(),
        Array.from(data.switchboards).sort().join(', ') || 'N/A'
      ])
    })

    // Sort by type, then part, then dimension
    summaryData.sort((a, b) => {
      if (a[0] !== b[0]) return a[0].localeCompare(b[0])
      if (a[1] !== b[1]) return a[1].localeCompare(b[1])
      return parseInt(a[2]) - parseInt(b[2])
    })

    autoTable(doc, {
      head: [['Type', 'Part', 'Dimension', 'Total Qty', 'Used In']],
      body: summaryData,
      startY: 50,
      margin: { left: margin, right: margin },
      theme: 'striped',
      headStyles: { fillColor: [63, 81, 181] },
      styles: { fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold' },
        3: { halign: 'center', fontStyle: 'bold' }
      }
    })

    // Save the PDF
    const fileName = `${reportName || 'frame-parts-report'}-${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Error generating PDF. Please try again.')
  }
} 