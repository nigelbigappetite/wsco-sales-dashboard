import jsPDF from 'jspdf';
import 'jspdf-autotable';

// CSV Export Functions
export const exportToCSV = (data, filename = 'wing-shack-data.csv') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Convert data to CSV format
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that might contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// PDF Export Functions
export const exportToPDF = (data, options = {}) => {
  const {
    title = 'Wing Shack Analytics Report',
    filename = 'wing-shack-report.pdf',
    includeCharts = false,
    chartImages = []
  } = options;

  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(title, 14, 22);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Add line
  doc.setLineWidth(0.5);
  doc.line(14, 35, 196, 35);
  
  let yPosition = 45;

  // Add summary section
  if (data.summary) {
    doc.setFontSize(14);
    doc.text('Summary', 14, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    Object.entries(data.summary).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 14, yPosition);
      yPosition += 6;
    });
    yPosition += 10;
  }

  // Add store performance table
  if (data.storePerformance && data.storePerformance.length > 0) {
    doc.setFontSize(14);
    doc.text('Store Performance', 14, yPosition);
    yPosition += 10;

    const tableData = data.storePerformance.map(store => [
      store.store_name || 'N/A',
      store.orders_last_30_days || 0,
      `£${(store.revenue_last_30_days_gbp || 0).toLocaleString()}`,
      `£${(store.avg_order_value_last_30_days_gbp || 0).toFixed(2)}`,
      store.unique_customers_last_30_days || 0,
      store.active ? 'Active' : 'Inactive'
    ]);

    doc.autoTable({
      head: [['Store', 'Orders (30d)', 'Revenue (30d)', 'AOV', 'Customers (30d)', 'Status']],
      body: tableData,
      startY: yPosition,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] }
    });

    yPosition = doc.lastAutoTable.finalY + 20;
  }

  // Add top products table
  if (data.topProducts && data.topProducts.length > 0) {
    doc.setFontSize(14);
    doc.text('Top Products', 14, yPosition);
    yPosition += 10;

    const tableData = data.topProducts.map(product => [
      product.product_name || 'N/A',
      product.total_orders || 0,
      `£${(product.total_revenue_gbp || 0).toLocaleString()}`,
      `£${(product.avg_price_gbp || 0).toFixed(2)}`
    ]);

    doc.autoTable({
      head: [['Product', 'Orders', 'Revenue', 'Avg Price']],
      body: tableData,
      startY: yPosition,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [16, 185, 129] }
    });

    yPosition = doc.lastAutoTable.finalY + 20;
  }

  // Add charts if provided
  if (includeCharts && chartImages.length > 0) {
    chartImages.forEach((chartImage, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.text(`Chart ${index + 1}`, 14, yPosition);
      yPosition += 10;
      
      try {
        doc.addImage(chartImage, 'PNG', 14, yPosition, 180, 100);
        yPosition += 110;
      } catch (error) {
        console.warn('Could not add chart image:', error);
      }
    });
  }

  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount}`, 14, 290);
    doc.text('Wing Shack Analytics Dashboard', 150, 290);
  }

  // Save the PDF
  doc.save(filename);
};

// Excel Export (using CSV format as fallback)
export const exportToExcel = (data, filename = 'wing-shack-data.xlsx') => {
  // For now, we'll use CSV format as Excel export
  // In a real implementation, you might want to use a library like xlsx
  exportToCSV(data, filename.replace('.xlsx', '.csv'));
};

// Chart to Image conversion
export const chartToImage = (chartRef) => {
  if (!chartRef || !chartRef.canvas) {
    return null;
  }
  
  try {
    return chartRef.canvas.toDataURL('image/png');
  } catch (error) {
    console.warn('Could not convert chart to image:', error);
    return null;
  }
};

// Comprehensive data export
export const exportDashboardData = async (dashboardData, storePerformance, topProducts, filters, format = 'csv') => {
  const exportData = {
    summary: {
      'Total Revenue': `£${(dashboardData?.total_revenue_gbp || 0).toLocaleString()}`,
      'Total Orders': (dashboardData?.total_orders || 0).toLocaleString(),
      'Average Order Value': `£${(dashboardData?.avg_order_value_gbp || 0).toFixed(2)}`,
      'Active Stores': dashboardData?.unique_stores || 0,
      'Date Range': `${filters.dateRange.start.toLocaleDateString()} - ${filters.dateRange.end.toLocaleDateString()}`,
      'Selected Stores': filters.stores.length > 0 ? filters.stores.join(', ') : 'All Stores',
      'Platforms': filters.platforms.length > 0 ? filters.platforms.join(', ') : 'All Platforms'
    },
    storePerformance: storePerformance || [],
    topProducts: topProducts || [],
    filters: filters,
    exportedAt: new Date().toISOString()
  };

  const filename = `wing-shack-export-${new Date().toISOString().split('T')[0]}`;

  switch (format.toLowerCase()) {
    case 'pdf':
      exportToPDF(exportData, {
        title: 'Wing Shack Analytics Report',
        filename: `${filename}.pdf`
      });
      break;
    case 'excel':
      exportToExcel(exportData.storePerformance, `${filename}.xlsx`);
      break;
    case 'csv':
    default:
      exportToCSV(exportData.storePerformance, `${filename}.csv`);
      break;
  }
};

// Real-time data export
export const exportRealtimeData = (data, format = 'csv') => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `wing-shack-realtime-${timestamp}`;
  
  switch (format.toLowerCase()) {
    case 'pdf':
      exportToPDF(data, {
        title: 'Wing Shack Real-time Data',
        filename: `${filename}.pdf`
      });
      break;
    case 'excel':
      exportToExcel(data, `${filename}.xlsx`);
      break;
    case 'csv':
    default:
      exportToCSV(data, `${filename}.csv`);
      break;
  }
};
