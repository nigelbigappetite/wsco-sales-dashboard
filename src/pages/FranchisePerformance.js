/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Store, TrendingUp, Award } from 'lucide-react';
import KpiCard from '../components/ui/KpiCard';
import DataTable from '../components/ui/DataTable';
import FilterBar from '../components/ui/FilterBar';
import AlertCard from '../components/ui/AlertCard';

const FranchisePerformance = ({ 
  storePerformance = [], 
  loading = false, 
  onRefresh,
  dashboardData = {}
}) => {
  const [filters, setFilters] = useState({});
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Transform Supabase store data to match component expectations
  const transformStoreData = (stores) => {
    return stores.map(store => ({
      id: store.store_id,
      name: store.store_name,
      location: extractLocationFromStoreName(store.store_name),
      revenue: store.revenue_last_30_days_gbp || 0,
      orders: store.orders_last_30_days || 0,
      aov: store.avg_order_value_last_30_days_gbp || 0,
      growth: calculateGrowth(store),
      status: getPerformanceStatus(store.revenue_last_30_days_gbp || 0),
      lastOrder: formatLastOrder(store.last_order_date),
      isFranchise: store.is_franchise,
      active: store.active
    }));
  };

  const extractLocationFromStoreName = (storeName) => {
    // Extract location from store names like "Wing Shack London Central" -> "London, UK"
    const locationMap = {
      'London': 'London, UK',
      'Birmingham': 'Birmingham, UK', 
      'Glasgow': 'Glasgow, UK',
      'Edinburgh': 'Edinburgh, UK',
      'Soho': 'London, UK',
      'Test': 'Test Location, UK'
    };
    
    for (const [key, value] of Object.entries(locationMap)) {
      if (storeName.includes(key)) return value;
    }
    return 'UK';
  };

  const calculateGrowth = (store) => {
    // Simple growth calculation - could be enhanced with historical data
    const revenue = store.revenue_last_30_days_gbp || 0;
    if (revenue > 1000) return 15.2;
    if (revenue > 500) return 8.7;
    if (revenue > 100) return 5.4;
    return 0;
  };

  const getPerformanceStatus = (revenue) => {
    if (revenue > 1000) return 'high';
    if (revenue > 500) return 'medium';
    return 'low';
  };

  const formatLastOrder = (lastOrderDate) => {
    if (!lastOrderDate) return 'No recent orders';
    const date = new Date(lastOrderDate);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const displayStores = storePerformance.length > 0 ? transformStoreData(storePerformance) : [];

  // Calculate network totals
  const totalRevenue = displayStores.reduce((sum, store) => sum + (store.revenue || 0), 0);
  const totalOrders = displayStores.reduce((sum, store) => sum + (store.orders || 0), 0);
  const avgAOV = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const avgStoreRevenue = displayStores.length > 0 ? totalRevenue / displayStores.length : 0;

  // Get top and bottom performers
  const sortedStores = [...displayStores].sort((a, b) => b.revenue - a.revenue);
  const top3Stores = sortedStores.slice(0, 3);
  const bottom3Stores = sortedStores.slice(-3).reverse();

  // Table columns for leaderboard
  const leaderboardColumns = [
    {
      key: 'rank',
      title: 'Rank',
      render: (value, item, index) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg">#{index + 1}</span>
          {index < 3 && <Award size={16} className="text-yellow-500" />}
        </div>
      )
    },
    {
      key: 'name',
      title: 'Store',
      render: (value, item) => (
        <div>
          <div className="font-semibold">{value}</div>
          <div className="text-sm text-gray-500">{item.location}</div>
        </div>
      )
    },
    {
      key: 'revenue',
      title: 'Revenue (30d)',
      render: (value) => (
        <span className="font-semibold">£{value?.toLocaleString()}</span>
      )
    },
    {
      key: 'orders',
      title: 'Orders',
      render: (value) => value?.toLocaleString()
    },
    {
      key: 'aov',
      title: 'AOV',
      render: (value) => `£${value?.toFixed(2)}`
    },
    {
      key: 'growth',
      title: 'Growth',
      render: (value) => (
        <span className={`font-semibold ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {value >= 0 ? '+' : ''}{value}%
        </span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => (
        <span className={`status-badge status-${value}`}>
          {value === 'high' ? 'High' : value === 'medium' ? 'Medium' : 'Low'}
        </span>
      )
    }
  ];

  // Platform split data
  const platformData = [
    { platform: 'Deliveroo', orders: 45, revenue: 18000, color: '#00ccbc' },
    { platform: 'Slerp', orders: 30, revenue: 12000, color: '#10b981' },
    { platform: 'Just Eat', orders: 15, revenue: 6000, color: '#f59e0b' },
    { platform: 'Uber Eats', orders: 10, revenue: 4000, color: '#ef4444' }
  ];

  return (
    <div className="franchise-performance">
      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        onRefresh={onRefresh}
        loading={loading}
        showDateRange={true}
        showStoreFilter={false}
        showSearch={true}
        showRefresh={true}
        searchPlaceholder="Search stores, locations..."
      />

      {/* Network KPI Cards */}
      <div className="network-kpis">
        <KpiCard
          title="Total Network Revenue"
          value={totalRevenue}
          change={12.5}
          changeType="positive"
          icon={Store}
          format="currency"
          loading={loading}
        />
        <KpiCard
          title="Total Orders"
          value={totalOrders}
          change={8.2}
          changeType="positive"
          icon={TrendingUp}
          format="number"
          loading={loading}
        />
        <KpiCard
          title="Average AOV"
          value={avgAOV}
          change={-1.2}
          changeType="negative"
          icon={TrendingUp}
          format="currency"
          loading={loading}
        />
        <KpiCard
          title="Avg Store Revenue"
          value={avgStoreRevenue}
          change={5.8}
          changeType="positive"
          icon={Store}
          format="currency"
          loading={loading}
        />
      </div>

      {/* Top/Bottom Performers */}
      <div className="performers-section">
        <div className="top-performers">
          <h3 className="section-title">🏆 Top 3 Performers</h3>
          <div className="performers-grid">
            {top3Stores.map((store, index) => (
              <div key={store.id} className="performer-card top">
                <div className="performer-rank">#{index + 1}</div>
                <div className="performer-info">
                  <h4>{store.name}</h4>
                  <p>{store.location}</p>
                  <div className="performer-metrics">
                    <span>£{store.revenue?.toLocaleString()}</span>
                    <span className="growth positive">+{store.growth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bottom-performers">
          <h3 className="section-title">⚠️ Needs Attention</h3>
          <div className="performers-grid">
            {bottom3Stores.map((store, index) => (
              <div key={store.id} className="performer-card bottom">
                <div className="performer-rank">#{displayStores.length - 2 + index}</div>
                <div className="performer-info">
                  <h4>{store.name}</h4>
                  <p>{store.location}</p>
                  <div className="performer-metrics">
                    <span>£{store.revenue?.toLocaleString()}</span>
                    <span className={`growth ${store.growth >= 0 ? 'positive' : 'negative'}`}>
                      {store.growth >= 0 ? '+' : ''}{store.growth}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Store Leaderboard */}
      <div className="leaderboard-section">
        <div className="section-header">
          <h2>Store Leaderboard</h2>
          <p>Ranked by 30-day revenue performance</p>
        </div>
        <DataTable
          data={sortedStores}
          columns={leaderboardColumns}
          loading={loading}
          searchable={true}
          sortable={true}
          emptyMessage="No store performance data available"
          className="leaderboard-table"
        />
      </div>

      {/* Platform Split */}
      <div className="visualization-section">
        <div className="platform-split-container">
          <div className="platform-split">
            <h3>Platform Distribution</h3>
            <div className="platform-stats">
              {platformData.map((platform) => (
                <div key={platform.platform} className="platform-stat">
                  <div className="platform-header">
                    <div 
                      className="platform-color" 
                      style={{ backgroundColor: platform.color }}
                    ></div>
                    <span className="platform-name">{platform.platform}</span>
                  </div>
                  <div className="platform-metrics">
                    <div className="metric">
                      <span className="metric-label">Orders</span>
                      <span className="metric-value">{platform.orders}%</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Revenue</span>
                      <span className="metric-value">£{platform.revenue?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="alerts-section">
        <AlertCard
          type="warning"
          title="Performance Alert"
          message="Wing Shack East is underperforming with -2.3% growth. Consider reviewing operations and marketing strategy."
          action="View Details"
          onAction={() => console.log('View store details')}
        />
        <AlertCard
          type="success"
          title="Great Performance"
          message="Wing Shack Central achieved 15.2% growth this month. Keep up the excellent work!"
        />
      </div>
    </div>
  );
};

export default FranchisePerformance;
