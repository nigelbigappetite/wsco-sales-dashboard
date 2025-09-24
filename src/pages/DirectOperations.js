/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Store, TrendingUp, DollarSign, ShoppingCart, BarChart3 } from 'lucide-react';
import KpiCard from '../components/ui/KpiCard';
import DataTable from '../components/ui/DataTable';
import FilterBar from '../components/ui/FilterBar';
import TrendChart from '../components/ui/TrendChart';
import { fetchDirectOperations } from '../utils/api';

const DirectOperations = ({ 
  loading = false, 
  onRefresh,
  dashboardData = {}
}) => {
  const [filters, setFilters] = useState({});
  const [directOpsData, setDirectOpsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch direct operations data
  useEffect(() => {
    const loadDirectOpsData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDirectOperations();
        setDirectOpsData(data);
      } catch (error) {
        console.error('Error loading direct operations data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDirectOpsData();
  }, []);

  // Sample data structure based on your Google Sheets format
  const sampleData = {
    locations: [
      {
        id: 'loughton',
        name: 'Loughton',
        type: 'location',
        totalRevenue: 18500.00,
        totalOrders: 680,
        avgAOV: 27.21,
        platforms: {
          mixed: { revenue: 18500.00, orders: 680, aov: 27.21 },
          wingverse: { revenue: 4200.00, orders: 160, aov: 26.25 },
          deliveroo: { revenue: 9800.00, orders: 350, aov: 28.00 },
          uber: { revenue: 3500.00, orders: 130, aov: 26.92 },
          justeat: { revenue: 1000.00, orders: 40, aov: 25.00 }
        },
        dailyData: [
          { date: '2025-09-21', revenue: 450.00, orders: 16, aov: 28.13 },
          { date: '2025-09-20', revenue: 520.00, orders: 19, aov: 27.37 },
          { date: '2025-09-19', revenue: 480.00, orders: 18, aov: 26.67 },
          { date: '2025-09-18', revenue: 380.00, orders: 14, aov: 27.14 },
          { date: '2025-09-17', revenue: 420.00, orders: 15, aov: 28.00 },
          { date: '2025-09-16', revenue: 350.00, orders: 13, aov: 26.92 },
          { date: '2025-09-15', revenue: 400.00, orders: 15, aov: 26.67 }
        ]
      },
      {
        id: 'maidstone',
        name: 'Maidstone',
        type: 'location',
        totalRevenue: 16800.00,
        totalOrders: 620,
        avgAOV: 27.10,
        platforms: {
          mixed: { revenue: 16800.00, orders: 620, aov: 27.10 },
          wingverse: { revenue: 3800.00, orders: 145, aov: 26.21 },
          deliveroo: { revenue: 8900.00, orders: 320, aov: 27.81 },
          uber: { revenue: 3200.00, orders: 120, aov: 26.67 },
          justeat: { revenue: 900.00, orders: 35, aov: 25.71 }
        },
        dailyData: [
          { date: '2025-09-21', revenue: 420.00, orders: 15, aov: 28.00 },
          { date: '2025-09-20', revenue: 480.00, orders: 18, aov: 26.67 },
          { date: '2025-09-19', revenue: 450.00, orders: 17, aov: 26.47 },
          { date: '2025-09-18', revenue: 360.00, orders: 13, aov: 27.69 },
          { date: '2025-09-17', revenue: 400.00, orders: 15, aov: 26.67 },
          { date: '2025-09-16', revenue: 320.00, orders: 12, aov: 26.67 },
          { date: '2025-09-15', revenue: 380.00, orders: 14, aov: 27.14 }
        ]
      },
      {
        id: 'chatham',
        name: 'Chatham',
        type: 'location',
        totalRevenue: 15200.00,
        totalOrders: 560,
        avgAOV: 27.14,
        platforms: {
          mixed: { revenue: 15200.00, orders: 560, aov: 27.14 },
          wingverse: { revenue: 3400.00, orders: 130, aov: 26.15 },
          deliveroo: { revenue: 8000.00, orders: 290, aov: 27.59 },
          uber: { revenue: 3000.00, orders: 110, aov: 27.27 },
          justeat: { revenue: 800.00, orders: 30, aov: 26.67 }
        },
        dailyData: [
          { date: '2025-09-21', revenue: 380.00, orders: 14, aov: 27.14 },
          { date: '2025-09-20', revenue: 440.00, orders: 16, aov: 27.50 },
          { date: '2025-09-19', revenue: 410.00, orders: 15, aov: 27.33 },
          { date: '2025-09-18', revenue: 330.00, orders: 12, aov: 27.50 },
          { date: '2025-09-17', revenue: 370.00, orders: 14, aov: 26.43 },
          { date: '2025-09-16', revenue: 300.00, orders: 11, aov: 27.27 },
          { date: '2025-09-15', revenue: 350.00, orders: 13, aov: 26.92 }
        ]
      },
      {
        id: 'wanstead',
        name: 'Wanstead',
        type: 'location',
        totalRevenue: 14963.42,
        totalOrders: 551,
        avgAOV: 27.16,
        platforms: {
          mixed: { revenue: 14963.42, orders: 551, aov: 27.16 },
          wingverse: { revenue: 3097.93, orders: 119, aov: 26.03 },
          deliveroo: { revenue: 7847.23, orders: 282, aov: 27.83 },
          uber: { revenue: 2835.95, orders: 103, aov: 27.53 },
          justeat: { revenue: 1182.31, orders: 47, aov: 25.16 }
        },
        dailyData: [
          { date: '2025-09-21', revenue: 353.44, orders: 13, aov: 27.19 },
          { date: '2025-09-20', revenue: 765.73, orders: 24, aov: 31.91 },
          { date: '2025-09-19', revenue: 819.93, orders: 33, aov: 24.85 },
          { date: '2025-09-18', revenue: 204.50, orders: 10, aov: 20.45 },
          { date: '2025-09-17', revenue: 424.60, orders: 17, aov: 24.98 },
          { date: '2025-09-16', revenue: 168.69, orders: 9, aov: 18.74 },
          { date: '2025-09-15', revenue: 491.95, orders: 20, aov: 24.60 }
        ]
      }
    ],
    lastUpdated: new Date().toISOString()
  };

  // Use real data if available, otherwise fall back to sample data
  const displayData = directOpsData && directOpsData.locations ? directOpsData : sampleData;

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
      title: 'Location',
      render: (value, item) => (
        <div>
          <div className="font-semibold">{value}</div>
          <div className="text-sm text-gray-500">Direct Operations</div>
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
      key: 'platforms',
      title: 'Platforms',
      render: (value, item) => {
        const activePlatforms = Object.keys(item.platforms || {}).filter(platform => 
          item.platforms[platform].revenue > 0
        ).length;
        return (
          <div>
            <div className="font-semibold">{activePlatforms}/4</div>
            <div className="text-sm text-gray-500">Active</div>
          </div>
        );
      }
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

  // Platform distribution data for charts - aggregate across all locations
  const platformTotals = {
    wingverse: { revenue: 0, orders: 0 },
    deliveroo: { revenue: 0, orders: 0 },
    uber: { revenue: 0, orders: 0 },
    justeat: { revenue: 0, orders: 0 }
  };

  displayData.locations.forEach(location => {
    if (location.platforms) {
      Object.keys(platformTotals).forEach(platform => {
        if (location.platforms[platform]) {
          platformTotals[platform].revenue += location.platforms[platform].revenue || 0;
          platformTotals[platform].orders += location.platforms[platform].orders || 0;
        }
      });
    }
  });

  const platformData = Object.keys(platformTotals).map(platform => ({
    name: platform === 'wingverse' ? 'Wingverse (Slerp)' : 
          platform === 'uber' ? 'Uber Eats' :
          platform === 'justeat' ? 'Just Eat' : platform,
    revenue: platformTotals[platform].revenue,
    orders: platformTotals[platform].orders,
    percentage: totalRevenue > 0 ? ((platformTotals[platform].revenue / totalRevenue) * 100) : 0
  }));

  return (
    <div className="direct-operations">
      {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          onRefresh={() => {
            // Refresh direct operations data
            const loadDirectOpsData = async () => {
              setIsLoading(true);
              try {
                const data = await fetchDirectOperations();
                setDirectOpsData(data);
              } catch (error) {
                console.error('Error loading direct operations data:', error);
              } finally {
                setIsLoading(false);
              }
            };
            loadDirectOpsData();
          }}
          loading={loading || isLoading}
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
          <h2>Top Performing Location</h2>
          <p>Best performing location by revenue</p>
        </div>
        <div className="top-performer-card">
          <div className="performer-info">
            <h3>{topLocation.name}</h3>
            <p>Direct Operations Location</p>
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
          <h2>Location Performance</h2>
          <p>Revenue and performance breakdown by location</p>
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
          <p>Revenue breakdown across all platforms (aggregated from all locations)</p>
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
