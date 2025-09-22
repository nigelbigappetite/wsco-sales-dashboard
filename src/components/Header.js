import React from 'react';
import { RefreshCw, Calendar, Store, TrendingUp, ShoppingCart, DollarSign, MapPin } from 'lucide-react';

const Header = ({ 
  onRefresh, 
  onDateRangeChange, 
  onStoreChange, 
  selectedDateRange, 
  selectedStore,
  lastUpdated,
  dashboardData
}) => {
  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return `Last updated: ${date.toLocaleTimeString()}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount || 0);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-left">
          <div className="logo">HUNGRY TUM</div>
          <div className="subtitle">Sales Dashboard</div>
        </div>
        
        <div className="header-right">
          <div className="filter-group">
            <Calendar className="metric-icon" />
            <label className="filter-label">Period:</label>
            <select 
              className="filter-select"
              value={selectedDateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>

          <div className="filter-group">
            <Store className="metric-icon" />
            <label className="filter-label">Store:</label>
            <select 
              className="filter-select"
              value={selectedStore}
              onChange={(e) => onStoreChange(e.target.value)}
            >
              <option value="all">All Stores</option>
              <option value="550e8400-e29b-41d4-a716-446655440002">Wing Shack Test Store</option>
            </select>
          </div>

          <button 
            className="refresh-button"
            onClick={onRefresh}
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          {lastUpdated && (
            <div className="last-updated">
              {formatLastUpdated(lastUpdated)}
            </div>
          )}
        </div>
      </div>
      
      {/* KPI Cards Row */}
      <div className="header-kpis">
        <div className="kpi-card">
          <div className="kpi-icon">
            <DollarSign size={20} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{formatCurrency(dashboardData?.total_revenue_gbp)}</div>
            <div className="kpi-label">Total Sales</div>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon">
            <ShoppingCart size={20} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{dashboardData?.total_orders?.toLocaleString() || 0}</div>
            <div className="kpi-label">Total Orders</div>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon">
            <TrendingUp size={20} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{formatCurrency(dashboardData?.avg_order_value_gbp)}</div>
            <div className="kpi-label">AOV</div>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon">
            <MapPin size={20} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{dashboardData?.unique_stores || 0}</div>
            <div className="kpi-label">Active Sites</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
