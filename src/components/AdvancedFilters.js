import React, { useState, useEffect } from 'react';
import { Filter, X, Download, RefreshCw } from 'lucide-react';
import DatePicker from 'react-datepicker';
import StoreSelector from './StoreSelector';
import 'react-datepicker/dist/react-datepicker.css';

const AdvancedFilters = ({ 
  onFiltersChange, 
  onExport, 
  onRefresh,
  storePerformance = [],
  loading = false,
  isVisible = false,
  onToggleVisibility
}) => {
  const [filters, setFilters] = useState({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      end: new Date()
    },
    stores: [],
    platforms: [],
    orderTypes: [],
    timePeriods: ['daily', 'weekly', 'monthly'],
    metrics: ['revenue', 'orders', 'customers'],
    comparisonMode: false,
    customDateRange: false
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');

  // Available filter options
  const platformOptions = [
    { value: 'ubereats', label: 'Uber Eats' },
    { value: 'deliveroo', label: 'Deliveroo' },
    { value: 'justeat', label: 'Just Eat' },
    { value: 'direct', label: 'Direct Orders' },
    { value: 'phone', label: 'Phone Orders' }
  ];

  const orderTypeOptions = [
    { value: 'pickup', label: 'Pickup' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'dinein', label: 'Dine-in' }
  ];

  const metricOptions = [
    { value: 'revenue', label: 'Revenue' },
    { value: 'orders', label: 'Orders' },
    { value: 'customers', label: 'Customers' },
    { value: 'aov', label: 'Average Order Value' },
    { value: 'growth', label: 'Growth Rate' }
  ];

  const timePeriodOptions = [
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  // Quick date range presets
  const datePresets = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
    { label: 'Last year', days: 365 },
    { label: 'This month', custom: () => {
      const now = new Date();
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: now
      };
    }},
    { label: 'Last month', custom: () => {
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return {
        start: lastMonth,
        end: new Date(now.getFullYear(), now.getMonth(), 0)
      };
    }}
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleMultiSelectChange = (filterType, value, checked) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: checked 
        ? [...prev[filterType], value]
        : prev[filterType].filter(item => item !== value)
    }));
  };

  const handleDatePreset = (preset) => {
    if (preset.custom) {
      const dates = preset.custom();
      setFilters(prev => ({
        ...prev,
        dateRange: dates,
        customDateRange: false
      }));
    } else {
      const end = new Date();
      const start = new Date(end.getTime() - preset.days * 24 * 60 * 60 * 1000);
      setFilters(prev => ({
        ...prev,
        dateRange: { start, end },
        customDateRange: false
      }));
    }
  };

  const clearFilters = () => {
    setFilters({
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date()
      },
      stores: [],
      platforms: [],
      orderTypes: [],
      timePeriods: ['daily', 'weekly', 'monthly'],
      metrics: ['revenue', 'orders', 'customers'],
      comparisonMode: false,
      customDateRange: false
    });
  };

  const applyFilters = () => {
    onFiltersChange(filters);
  };

  const handleExport = () => {
    onExport(filters, exportFormat);
  };

  // Notify parent component when filters change
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="advanced-filters">
      <div className="filters-header">
        <div className="filters-title">
          <Filter size={20} />
          <span>Advanced Filters & Analytics</span>
        </div>
        <div className="filters-actions">
          <button 
            className="filter-button secondary"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </button>
          <button 
            className="filter-button secondary"
            onClick={clearFilters}
          >
            <X size={16} />
            Clear
          </button>
          <button 
            className="filter-button primary"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
          <button 
            className="filter-button secondary"
            onClick={onToggleVisibility}
          >
            <X size={16} />
            Close
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="quick-filters">
        <div className="filter-group">
          <label>Quick Date Range:</label>
          <div className="preset-buttons">
            {datePresets.map((preset, index) => (
              <button
                key={index}
                className="preset-button"
                onClick={() => handleDatePreset(preset)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Custom Date Range:</label>
          <div className="date-range-picker">
            <DatePicker
              selected={filters.dateRange.start}
              onChange={(date) => handleFilterChange('dateRange', { ...filters.dateRange, start: date })}
              selectsStart
              startDate={filters.dateRange.start}
              endDate={filters.dateRange.end}
              dateFormat="dd/MM/yyyy"
              className="date-input"
              placeholderText="Start Date"
            />
            <span>to</span>
            <DatePicker
              selected={filters.dateRange.end}
              onChange={(date) => handleFilterChange('dateRange', { ...filters.dateRange, end: date })}
              selectsEnd
              startDate={filters.dateRange.start}
              endDate={filters.dateRange.end}
              minDate={filters.dateRange.start}
              dateFormat="dd/MM/yyyy"
              className="date-input"
              placeholderText="End Date"
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Stores:</label>
          <StoreSelector
            stores={storePerformance}
            selectedStores={filters.stores}
            onSelectionChange={(selectedStores) => handleFilterChange('stores', selectedStores)}
            placeholder="Select stores..."
          />
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="advanced-filters-content">
          <div className="filters-grid">
            {/* Platforms */}
            <div className="filter-section">
              <h4>Platforms</h4>
              <div className="checkbox-group">
                {platformOptions.map(option => (
                  <label key={option.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.platforms.includes(option.value)}
                      onChange={(e) => handleMultiSelectChange('platforms', option.value, e.target.checked)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Order Types */}
            <div className="filter-section">
              <h4>Order Types</h4>
              <div className="checkbox-group">
                {orderTypeOptions.map(option => (
                  <label key={option.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.orderTypes.includes(option.value)}
                      onChange={(e) => handleMultiSelectChange('orderTypes', option.value, e.target.checked)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="filter-section">
              <h4>Metrics to Display</h4>
              <div className="checkbox-group">
                {metricOptions.map(option => (
                  <label key={option.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.metrics.includes(option.value)}
                      onChange={(e) => handleMultiSelectChange('metrics', option.value, e.target.checked)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Time Periods */}
            <div className="filter-section">
              <h4>Time Periods</h4>
              <div className="checkbox-group">
                {timePeriodOptions.map(option => (
                  <label key={option.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.timePeriods.includes(option.value)}
                      onChange={(e) => handleMultiSelectChange('timePeriods', option.value, e.target.checked)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Comparison Mode */}
            <div className="filter-section">
              <h4>Analysis Options</h4>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.comparisonMode}
                    onChange={(e) => handleFilterChange('comparisonMode', e.target.checked)}
                  />
                  <span>Enable Period Comparison</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="export-section">
        <div className="export-controls">
          <label>Export Format:</label>
          <select 
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="filter-select"
          >
            <option value="csv">CSV</option>
            <option value="pdf">PDF Report</option>
            <option value="excel">Excel</option>
          </select>
          <button 
            className="filter-button primary"
            onClick={handleExport}
            disabled={loading}
          >
            <Download size={16} />
            Export Data
          </button>
          <button 
            className="filter-button secondary"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
