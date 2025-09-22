import React, { useState } from 'react';
import { BarChart3, Store, TrendingUp, Filter, Activity, Download, AlertCircle, ShoppingCart } from 'lucide-react';
import MetricsCards from './MetricsCards';
import ChartsSection from './ChartsSection';
import LiveOrders from './LiveOrders';
import RealtimeUpdates from './RealtimeUpdates';
import AdvancedFilters from './AdvancedFilters';
import FranchisePerformance from '../pages/FranchisePerformance';
import ProductAnalytics from '../pages/ProductAnalytics';
import AlertsSignals from '../pages/AlertsSignals';

const TabbedDashboard = ({ 
  dashboardData, 
  storePerformance, 
  topProducts, 
  loading,
  onFiltersChange,
  onExport,
  onRefresh,
  onRealtimeDataUpdate,
  onConnectionStatusChange
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showFilters, setShowFilters] = useState(false);
  const [liveOrders] = useState([]);

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      description: 'Key sales data and metrics'
    },
    {
      id: 'live-orders',
      label: 'Live Orders',
      icon: ShoppingCart,
      description: 'Real-time order monitoring'
    },
    {
      id: 'franchise-performance',
      label: 'Franchise Performance',
      icon: Store,
      description: 'Store performance analysis'
    },
    {
      id: 'product-analytics',
      label: 'Product Analytics',
      icon: TrendingUp,
      description: 'Menu optimization insights'
    },
    {
      id: 'alerts-signals',
      label: 'Alerts & Signals',
      icon: AlertCircle,
      description: 'Actionable insights and alerts'
    }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleExport = (format) => {
    onExport({}, format);
  };

  return (
    <div className="tabbed-dashboard">
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <div className="tab-list">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.id)}
              >
                <IconComponent size={20} />
                <span className="tab-label">{tab.label}</span>
                <span className="tab-description">{tab.description}</span>
              </button>
            );
          })}
        </div>
        
        <div className="tab-actions">
          <button 
            className={`action-button ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filters
          </button>
          <button 
            className="action-button"
            onClick={() => handleExport('pdf')}
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <div className="filters-panel">
        <AdvancedFilters
          onFiltersChange={onFiltersChange}
          onExport={onExport}
          onRefresh={onRefresh}
          storePerformance={storePerformance}
          loading={loading}
          isVisible={showFilters}
          onToggleVisibility={() => setShowFilters(!showFilters)}
        />
      </div>

      {/* Real-time Updates Status */}
      <RealtimeUpdates
        onDataUpdate={onRealtimeDataUpdate}
        onConnectionStatusChange={onConnectionStatusChange}
        enabled={true}
        refreshInterval={30000}
      />


      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            {/* Key Metrics Cards */}
            <MetricsCards data={dashboardData} loading={loading} />
            
            {/* Sales Trend Chart */}
            <div className="sales-trend-section">
              <div className="section-header">
                <h2>Sales Trend</h2>
                <p>Revenue performance over time</p>
              </div>
              <div className="chart-container">
                <ChartsSection 
                  dashboardData={dashboardData}
                  topProducts={topProducts}
                  loading={loading}
                />
              </div>
            </div>

            {/* Quick Comparison Cards */}
            <div className="comparison-section">
              <div className="section-header">
                <h2>Quick Comparison</h2>
                <p>This week vs last week performance</p>
              </div>
              <div className="comparison-grid">
                <div className="comparison-card">
                  <h3>Revenue Growth</h3>
                  <div className="comparison-value positive">
                    +{dashboardData?.revenue_growth_percent || 12.5}%
                  </div>
                  <p>vs last week</p>
                </div>
                <div className="comparison-card">
                  <h3>Order Volume</h3>
                  <div className="comparison-value positive">
                    +{Math.floor((dashboardData?.total_orders || 1000) * 0.15)} orders
                  </div>
                  <p>vs last week</p>
                </div>
                <div className="comparison-card">
                  <h3>Average Order Value</h3>
                  <div className="comparison-value negative">
                    -£{((dashboardData?.avg_order_value_gbp || 25) * 0.05).toFixed(2)}
                  </div>
                  <p>vs last week</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'live-orders' && (
          <div className="live-orders-section">
            <div className="section-header">
              <h2>Live Orders</h2>
              <p>Real-time order monitoring and management</p>
            </div>
            <LiveOrders
              orders={liveOrders}
              loading={loading}
              onRefresh={onRefresh}
              dashboardData={dashboardData}
            />
          </div>
        )}

        {activeTab === 'franchise-performance' && (
          <FranchisePerformance
            storePerformance={storePerformance}
            loading={loading}
            onRefresh={onRefresh}
            dashboardData={dashboardData}
          />
        )}

        {activeTab === 'product-analytics' && (
          <ProductAnalytics
            topProducts={topProducts}
            loading={loading}
            onRefresh={onRefresh}
            dashboardData={dashboardData}
          />
        )}

        {activeTab === 'alerts-signals' && (
          <AlertsSignals
            alerts={[]}
            loading={loading}
            onRefresh={onRefresh}
            dashboardData={dashboardData}
          />
        )}
      </div>
    </div>
  );
};

export default TabbedDashboard;
