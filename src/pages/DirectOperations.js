/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Store, TrendingUp, DollarSign, ShoppingCart, BarChart3 } from 'lucide-react';
import KpiCard from '../components/ui/KpiCard';
import DataTable from '../components/ui/DataTable';
import FilterBar from '../components/ui/FilterBar';
import TrendChart from '../components/ui/TrendChart';

const DirectOperations = ({ 
  loading = false, 
  onRefresh,
  dashboardData = {}
}) => {
  const [filters, setFilters] = useState({});
  const [directOpsData, setDirectOpsData] = useState(null);

  // Sample data structure based on your Google Sheets format
  const sampleData = {
    locations: [
      {
        id: 'mixed',
        name: 'Mixed (All Platforms)',
        type: 'combined',
        totalRevenue: 65463.42,
        totalOrders: 2411,
        avgAOV: 27.15,
        dailyData: [
          { date: '2025-09-21', revenue: 353.44, orders: 13, aov: 27.19 },
          { date: '2025-09-20', revenue: 765.73, orders: 24, aov: 31.91 },
          { date: '2025-09-19', revenue: 819.93, orders: 33, aov: 24.85 },
          { date: '2025-09-18', revenue: 204.50, orders: 10, aov: 20.45 },
          { date: '2025-09-17', revenue: 424.60, orders: 17, aov: 24.98 },
          { date: '2025-09-16', revenue: 168.69, orders: 9, aov: 18.74 },
          { date: '2025-09-15', revenue: 491.95, orders: 20, aov: 24.60 }
        ]
      },
      {
        id: 'wingverse',
        name: 'Wingverse (Slerp)',
        type: 'platform',
        totalRevenue: 14497.93,
        totalOrders: 554,
        avgAOV: 26.17,
        dailyData: [
          { date: '2025-09-21', revenue: 91.69, orders: 2, aov: 45.85 },
          { date: '2025-09-20', revenue: 25.45, orders: 1, aov: 25.45 },
          { date: '2025-09-19', revenue: 55.35, orders: 2, aov: 27.68 },
          { date: '2025-09-18', revenue: 55.40, orders: 2, aov: 27.70 },
          { date: '2025-09-17', revenue: 119.10, orders: 4, aov: 29.78 },
          { date: '2025-09-16', revenue: 12.45, orders: 1, aov: 12.45 },
          { date: '2025-09-15', revenue: 113.45, orders: 3, aov: 37.82 }
        ]
      },
      {
        id: 'deliveroo',
        name: 'Deliveroo',
        type: 'platform',
        totalRevenue: 38147.23,
        totalOrders: 1382,
        avgAOV: 27.60,
        dailyData: [
          { date: '2025-09-21', revenue: 202.30, orders: 7, aov: 28.90 },
          { date: '2025-09-20', revenue: 609.10, orders: 19, aov: 32.06 },
          { date: '2025-09-19', revenue: 617.25, orders: 24, aov: 25.72 },
          { date: '2025-09-18', revenue: 129.90, orders: 7, aov: 18.56 },
          { date: '2025-09-17', revenue: 235.85, orders: 10, aov: 23.59 },
          { date: '2025-09-16', revenue: 142.80, orders: 7, aov: 20.40 },
          { date: '2025-09-15', revenue: 315.00, orders: 13, aov: 24.23 }
        ]
      },
      {
        id: 'uber',
        name: 'Uber Eats',
        type: 'platform',
        totalRevenue: 13835.95,
        totalOrders: 573,
        avgAOV: 24.15,
        dailyData: [
          { date: '2025-09-21', revenue: 59.45, orders: 4, aov: 14.86 },
          { date: '2025-09-20', revenue: 131.18, orders: 4, aov: 32.80 },
          { date: '2025-09-19', revenue: 147.33, orders: 7, aov: 21.05 },
          { date: '2025-09-18', revenue: 19.20, orders: 1, aov: 19.20 },
          { date: '2025-09-17', revenue: 69.65, orders: 3, aov: 23.22 },
          { date: '2025-09-16', revenue: 13.44, orders: 1, aov: 13.44 },
          { date: '2025-09-15', revenue: 63.50, orders: 4, aov: 15.88 }
        ]
      },
      {
        id: 'justeat',
        name: 'Just Eat',
        type: 'platform',
        totalRevenue: 0,
        totalOrders: 0,
        avgAOV: 0,
        dailyData: []
      }
    ],
    lastUpdated: new Date().toISOString()
  };

  // Use sample data for now - will be replaced with real Google Sheets data
  const displayData = directOpsData || sampleData;

  // Calculate totals across all locations
  const totalRevenue = displayData.locations.reduce((sum, loc) => sum + (loc.totalRevenue || 0), 0);
  const totalOrders = displayData.locations.reduce((sum, loc) => sum + (loc.totalOrders || 0), 0);
  const avgAOV = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const activeLocations = displayData.locations.filter(loc => loc.totalOrders > 0).length;

  // Get top performing location
  const topLocation = displayData.locations.reduce((top, loc) => 
    (loc.totalRevenue || 0) > (top.totalRevenue || 0) ? loc : top, 
    displayData.locations[0] || {}
  );

  // Table columns for location performance
  const locationColumns = [
    {
      key: 'name',
      title: 'Location/Platform',
      render: (value, item) => (
        <div>
          <div className="font-semibold">{value}</div>
          <div className="text-sm text-gray-500">
            {item.type === 'combined' ? 'All Platforms Combined' : 'Individual Platform'}
          </div>
        </div>
      )
    },
    {
      key: 'totalRevenue',
      title: 'Total Revenue',
      render: (value) => (
        <span className="font-semibold">£{value?.toLocaleString()}</span>
      )
    },
    {
      key: 'totalOrders',
      title: 'Total Orders',
      render: (value) => value?.toLocaleString()
    },
    {
      key: 'avgAOV',
      title: 'Avg AOV',
      render: (value) => `£${value?.toFixed(2)}`
    },
    {
      key: 'performance',
      title: 'Performance',
      render: (value, item) => {
        const percentage = totalRevenue > 0 ? ((item.totalRevenue || 0) / totalRevenue) * 100 : 0;
        return (
          <div>
            <div className="font-semibold">{percentage.toFixed(1)}%</div>
            <div className="w-20 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
          </div>
        );
      }
    }
  ];

  // Platform distribution data for charts
  const platformData = displayData.locations
    .filter(loc => loc.type === 'platform' && loc.totalRevenue > 0)
    .map(loc => ({
      name: loc.name,
      revenue: loc.totalRevenue,
      orders: loc.totalOrders,
      percentage: totalRevenue > 0 ? ((loc.totalRevenue / totalRevenue) * 100) : 0
    }));

  return (
    <div className="direct-operations">
      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        onRefresh={onRefresh}
        loading={loading}
        showDateRange={true}
        showStoreFilter={false}
        showSearch={false}
        showRefresh={true}
        dateRangeOptions={[
          { value: '7', label: 'Last 7 days' },
          { value: '30', label: 'Last 30 days' },
          { value: '90', label: 'Last 90 days' }
        ]}
      />

      {/* KPI Cards */}
      <div className="direct-ops-kpis">
        <KpiCard
          title="Total Direct Ops Revenue"
          value={totalRevenue}
          change={12.5}
          changeType="positive"
          icon={DollarSign}
          format="currency"
          loading={loading}
        />
        <KpiCard
          title="Total Orders"
          value={totalOrders}
          change={8.2}
          changeType="positive"
          icon={ShoppingCart}
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
          title="Active Platforms"
          value={activeLocations}
          change={0}
          changeType="neutral"
          icon={Store}
          format="number"
          loading={loading}
        />
      </div>

      {/* Top Performer Highlight */}
      <div className="top-performer-section">
        <div className="section-header">
          <h2>Top Performing Platform</h2>
          <p>Best performing platform by revenue</p>
        </div>
        <div className="top-performer-card">
          <div className="performer-info">
            <h3>{topLocation.name}</h3>
            <p>{topLocation.type === 'combined' ? 'All Platforms Combined' : 'Individual Platform'}</p>
            <div className="performer-metrics">
              <div className="metric">
                <span className="metric-label">Revenue</span>
                <span className="metric-value">£{topLocation.totalRevenue?.toLocaleString()}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Orders</span>
                <span className="metric-value">{topLocation.totalOrders?.toLocaleString()}</span>
              </div>
              <div className="metric">
                <span className="metric-label">AOV</span>
                <span className="metric-value">£{topLocation.avgAOV?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Performance Table */}
      <div className="location-performance-section">
        <div className="section-header">
          <h2>Platform Performance</h2>
          <p>Revenue and performance breakdown by platform</p>
        </div>
        <DataTable
          data={displayData.locations}
          columns={locationColumns}
          loading={loading}
          searchable={true}
          sortable={true}
          emptyMessage="No direct operations data available"
          className="location-performance-table"
        />
      </div>

      {/* Platform Distribution Chart */}
      <div className="platform-distribution-section">
        <div className="section-header">
          <h2>Platform Revenue Distribution</h2>
          <p>Revenue breakdown across all platforms</p>
        </div>
        <div className="platform-distribution">
          {platformData.map((platform, index) => (
            <div key={platform.name} className="platform-item">
              <div className="platform-header">
                <span className="platform-name">{platform.name}</span>
                <span className="platform-percentage">{platform.percentage.toFixed(1)}%</span>
              </div>
              <div className="platform-bar">
                <div 
                  className="platform-fill"
                  style={{ 
                    width: `${platform.percentage}%`,
                    backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                  }}
                ></div>
              </div>
              <div className="platform-metrics">
                <span>£{platform.revenue?.toLocaleString()}</span>
                <span>{platform.orders} orders</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="revenue-trend-section">
        <div className="section-header">
          <h2>Revenue Trend</h2>
          <p>Daily revenue performance over time</p>
        </div>
        <TrendChart
          data={displayData.locations[0]?.dailyData || []}
          dataKey="revenue"
          xAxisKey="date"
          title="Daily Revenue Trend"
          loading={loading}
          height={300}
        />
      </div>

      {/* Data Source Info */}
      <div className="data-source-info">
        <div className="info-card">
          <h3>📊 Data Source</h3>
          <p>Data is sourced from your Google Sheets income tracker and updated daily.</p>
          <div className="last-updated">
            Last updated: {new Date(displayData.lastUpdated).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectOperations;
