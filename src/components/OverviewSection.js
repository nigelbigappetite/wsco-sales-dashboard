import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, TrendingUp, Store, Filter, Calendar, Building, Clock } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/api';

const OverviewSection = ({ dashboardData, loading, onFiltersChange }) => {
  const [selectedDateRange, setSelectedDateRange] = useState('30');
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date()
  });
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  const platformData = [
    { name: 'Deliveroo', orders: 350, revenue: 17500, percentage: 35, trend: '+12.5%', color: 'platform-deliveroo' },
    { name: 'Slerp', orders: 250, revenue: 12500, percentage: 25, trend: '+8.3%', color: 'platform-slerp' },
    { name: 'Just Eat', orders: 200, revenue: 10000, percentage: 20, trend: '-3.2%', color: 'platform-justeat' },
    { name: 'Uber Eats', orders: 200, revenue: 10000, percentage: 20, trend: '+5.1%', color: 'platform-ubereats' }
  ];

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      dateRange: selectedDateRange,
      store: selectedStore,
      platform: selectedPlatform,
      customDateRange: customDateRange,
      [filterType]: value
    };
    
    if (filterType === 'dateRange') {
      setSelectedDateRange(value);
      if (value !== 'custom') {
        setShowCustomDatePicker(false);
      }
    }
    if (filterType === 'store') setSelectedStore(value);
    if (filterType === 'platform') setSelectedPlatform(value);
    if (filterType === 'customDateRange') setCustomDateRange(value);
    
    onFiltersChange(newFilters);
  };

  const handleDatePreset = (preset) => {
    setSelectedDateRange(preset);
    setShowCustomDatePicker(preset === 'custom');
    
    if (preset !== 'custom') {
      const end = new Date();
      let start;
      
      switch (preset) {
        case 'today':
          start = new Date();
          start.setHours(0, 0, 0, 0);
          break;
        case '7':
          start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30':
          start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      
      const newCustomRange = { start, end };
      setCustomDateRange(newCustomRange);
      handleFilterChange('customDateRange', newCustomRange);
    }
  };

  const getDateRangeLabel = () => {
    switch (selectedDateRange) {
      case 'today':
        return 'Today';
      case '7':
        return 'Last 7 days';
      case '30':
        return 'Last 30 days';
      case 'custom':
        return `${customDateRange.start.toLocaleDateString()} - ${customDateRange.end.toLocaleDateString()}`;
      default:
        return 'Last 30 days';
    }
  };

  // Update filters when component mounts or date range changes
  useEffect(() => {
    handleFilterChange('dateRange', selectedDateRange);
  }, [selectedDateRange]);

  if (loading && !dashboardData) {
    return (
      <div className="overview-section">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading overview data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overview-section">
      {/* Main Cards Date Filters */}
      <div className="main-cards-filters">
        <div className="filters-header">
          <div className="filters-title">
            <Clock size={20} />
            <h3>Overview Period</h3>
          </div>
          <div className="date-range-display">
            {getDateRangeLabel()}
          </div>
        </div>
        
        <div className="date-preset-buttons">
          <button
            className={`preset-button ${selectedDateRange === 'today' ? 'active' : ''}`}
            onClick={() => handleDatePreset('today')}
          >
            Today
          </button>
          <button
            className={`preset-button ${selectedDateRange === '7' ? 'active' : ''}`}
            onClick={() => handleDatePreset('7')}
          >
            Last 7 days
          </button>
          <button
            className={`preset-button ${selectedDateRange === '30' ? 'active' : ''}`}
            onClick={() => handleDatePreset('30')}
          >
            Last 30 days
          </button>
          <button
            className={`preset-button ${selectedDateRange === 'custom' ? 'active' : ''}`}
            onClick={() => handleDatePreset('custom')}
          >
            Custom Range
          </button>
        </div>

        {showCustomDatePicker && (
          <div className="custom-date-picker">
            <div className="date-inputs">
              <div className="date-input-group">
                <label>From:</label>
                <input
                  type="date"
                  value={customDateRange.start.toISOString().split('T')[0]}
                  onChange={(e) => {
                    const newStart = new Date(e.target.value);
                    const newRange = { ...customDateRange, start: newStart };
                    setCustomDateRange(newRange);
                    handleFilterChange('customDateRange', newRange);
                  }}
                  className="date-input"
                />
              </div>
              <div className="date-input-group">
                <label>To:</label>
                <input
                  type="date"
                  value={customDateRange.end.toISOString().split('T')[0]}
                  onChange={(e) => {
                    const newEnd = new Date(e.target.value);
                    const newRange = { ...customDateRange, end: newEnd };
                    setCustomDateRange(newRange);
                    handleFilterChange('customDateRange', newRange);
                  }}
                  className="date-input"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Filters */}
      <div className="quick-filters-bar">
        <div className="filter-group">
          <Building size={16} />
          <select 
            value={selectedPlatform}
            onChange={(e) => handleFilterChange('platform', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Platforms</option>
            <option value="deliveroo">Deliveroo</option>
            <option value="slerp">Slerp</option>
            <option value="justeat">Just Eat</option>
            <option value="ubereats">Uber Eats</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="key-metrics">
        <div className="metric-card primary">
          <div className="metric-header">
            <DollarSign size={24} />
            <h3>Total Revenue</h3>
          </div>
          <div className="metric-value">
            {formatCurrency(dashboardData?.total_revenue_gbp || 0)}
          </div>
          <div className="metric-change positive">
            <TrendingUp size={16} />
            +12.5% vs last period
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <ShoppingCart size={24} />
            <h3>Total Orders</h3>
          </div>
          <div className="metric-value">
            {formatNumber(dashboardData?.total_orders || 0)}
          </div>
          <div className="metric-change positive">
            <TrendingUp size={16} />
            +8.3% vs last period
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <TrendingUp size={24} />
            <h3>Average Order Value</h3>
          </div>
          <div className="metric-value">
            {formatCurrency(dashboardData?.avg_order_value_gbp || 0)}
          </div>
          <div className="metric-change positive">
            <TrendingUp size={16} />
            +4.1% vs last period
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <Store size={24} />
            <h3>Active Stores</h3>
          </div>
          <div className="metric-value">
            {formatNumber(dashboardData?.unique_stores || 0)}
          </div>
          <div className="metric-change neutral">
            No change
          </div>
        </div>
      </div>

      {/* Platform Performance */}
      <div className="platform-performance">
        <div className="section-header">
          <h2>Platform Performance</h2>
          <p>Order distribution and revenue across delivery platforms</p>
        </div>
        
        <div className="platform-grid">
          {platformData.map((platform, index) => (
            <div key={platform.name} className="platform-card">
              <div className="platform-header">
                <div className="platform-info">
                  <h3>{platform.name}</h3>
                  <div className="platform-percentage">{platform.percentage}%</div>
                </div>
                <div className={`platform-indicator ${platform.color}`}></div>
              </div>
              
              <div className="platform-metrics">
                <div className="metric-row">
                  <span className="metric-label">Orders</span>
                  <span className="metric-value">{platform.orders.toLocaleString()}</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Revenue</span>
                  <span className="metric-value">{formatCurrency(platform.revenue)}</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">AOV</span>
                  <span className="metric-value">{formatCurrency(platform.revenue / platform.orders)}</span>
                </div>
              </div>
              
              <div className="platform-trend">
                <span className={`trend-indicator ${platform.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                  {platform.trend.startsWith('+') ? '↗' : '↘'} {platform.trend}
                </span>
                <span className="trend-label">vs last period</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="quick-insights">
        <div className="insight-card">
          <h3>Top Performing Platform</h3>
          <div className="insight-content">
            <div className="insight-value">Deliveroo</div>
            <div className="insight-detail">35% of total orders with 12.5% growth</div>
          </div>
        </div>
        
        <div className="insight-card">
          <h3>Best Store</h3>
          <div className="insight-content">
            <div className="insight-value">Store 1</div>
            <div className="insight-detail">£15,000 revenue this period</div>
          </div>
        </div>
        
        <div className="insight-card">
          <h3>Peak Hours</h3>
          <div className="insight-content">
            <div className="insight-value">7-9 PM</div>
            <div className="insight-detail">40% of daily orders</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;
