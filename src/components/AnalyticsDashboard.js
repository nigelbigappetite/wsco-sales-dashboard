import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Activity, Download, RefreshCw } from 'lucide-react';
import { Line, Bar, Pie, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsDashboard = ({ 
  dashboardData, 
  storePerformance, 
  topProducts, 
  loading,
  onExport,
  onRefresh 
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('daily');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [viewMode, setViewMode] = useState('overview'); // overview, detailed, comparison

  // Calculate key performance indicators
  const kpis = useMemo(() => {
    if (!dashboardData) return null;

    const current = {
      revenue: dashboardData.total_revenue_gbp || 0,
      orders: dashboardData.total_orders || 0,
      aov: dashboardData.avg_order_value_gbp || 0,
      stores: dashboardData.unique_stores || 0
    };

    // Calculate growth rates (using sample data for demonstration)
    const previous = {
      revenue: current.revenue * 0.85,
      orders: current.orders * 0.90,
      aov: current.aov * 1.05,
      stores: current.stores
    };

    return {
      revenue: {
        current: current.revenue,
        previous: previous.revenue,
        growth: ((current.revenue - previous.revenue) / previous.revenue) * 100,
        trend: current.revenue > previous.revenue ? 'up' : 'down'
      },
      orders: {
        current: current.orders,
        previous: previous.orders,
        growth: ((current.orders - previous.orders) / previous.orders) * 100,
        trend: current.orders > previous.orders ? 'up' : 'down'
      },
      aov: {
        current: current.aov,
        previous: previous.aov,
        growth: ((current.aov - previous.aov) / previous.aov) * 100,
        trend: current.aov > previous.aov ? 'up' : 'down'
      },
      stores: {
        current: current.stores,
        previous: previous.stores,
        growth: 0,
        trend: 'stable'
      }
    };
  }, [dashboardData]);

  // Generate sample time series data
  const timeSeriesData = useMemo(() => {
    const timeframes = {
      daily: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [1200, 1900, 3000, 5000, 2000, 3000, 4500]
      },
      weekly: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [15000, 18000, 22000, 19500]
      },
      monthly: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [65000, 72000, 85000, 78000, 92000, 88000]
      }
    };

    return timeframes[selectedTimeframe];
  }, [selectedTimeframe]);

  // Platform performance data
  const platformData = useMemo(() => {
    return {
      labels: ['Uber Eats', 'Deliveroo', 'Just Eat', 'Direct', 'Phone'],
      datasets: [{
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  }, []);

  // Store comparison radar data
  const radarData = useMemo(() => {
    if (!storePerformance || storePerformance.length < 2) return null;

    const stores = storePerformance.slice(0, 3);
    return {
      labels: ['Revenue', 'Orders', 'Customers', 'AOV', 'Growth'],
      datasets: stores.map((store, index) => ({
        label: store.store_name,
        data: [
          (store.revenue_last_30_days_gbp || 0) / 1000,
          (store.orders_last_30_days || 0) / 10,
          (store.unique_customers_last_30_days || 0) / 10,
          (store.avg_order_value_last_30_days_gbp || 0) / 10,
          Math.random() * 100
        ],
        backgroundColor: `rgba(${59 + index * 50}, ${130 + index * 30}, ${246 - index * 50}, 0.2)`,
        borderColor: `rgba(${59 + index * 50}, ${130 + index * 30}, ${246 - index * 50}, 1)`,
        borderWidth: 2
      }))
    };
  }, [storePerformance]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            if (selectedMetric === 'revenue') {
              return `${context.dataset.label}: £${context.parsed.y.toLocaleString()}`;
            }
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            if (selectedMetric === 'revenue') {
              return '£' + value.toLocaleString();
            }
            return value.toLocaleString();
          }
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed}% (${percentage}%)`;
          }
        }
      }
    }
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          stepSize: 20
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="analytics-dashboard">
        <div className="dashboard-header">
          <h2>Analytics Dashboard</h2>
          <div className="loading-spinner"></div>
        </div>
        <div className="dashboard-content">
          <div className="loading-skeleton" style={{ height: '400px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h2>Analytics Dashboard</h2>
          <p>Comprehensive insights and performance metrics</p>
        </div>
        <div className="header-right">
          <div className="view-controls">
            <button 
              className={`view-button ${viewMode === 'overview' ? 'active' : ''}`}
              onClick={() => setViewMode('overview')}
            >
              <BarChart3 size={16} />
              Overview
            </button>
            <button 
              className={`view-button ${viewMode === 'detailed' ? 'active' : ''}`}
              onClick={() => setViewMode('detailed')}
            >
              <Activity size={16} />
              Detailed
            </button>
            <button 
              className={`view-button ${viewMode === 'comparison' ? 'active' : ''}`}
              onClick={() => setViewMode('comparison')}
            >
              <TrendingUp size={16} />
              Comparison
            </button>
          </div>
          <button className="action-button" onClick={onRefresh}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="action-button primary" onClick={() => onExport('pdf')}>
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {kpis && (
        <div className="kpi-grid">
          {Object.entries(kpis).map(([key, kpi]) => (
            <div key={key} className="kpi-card">
              <div className="kpi-header">
                <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                <div className={`kpi-trend ${kpi.trend}`}>
                  {kpi.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {kpi.growth.toFixed(1)}%
                </div>
              </div>
              <div className="kpi-value">
                {key === 'revenue' || key === 'aov' ? `£${kpi.current.toLocaleString()}` : kpi.current.toLocaleString()}
              </div>
              <div className="kpi-subtitle">
                vs {key === 'revenue' || key === 'aov' ? `£${kpi.previous.toLocaleString()}` : kpi.previous.toLocaleString()} previous period
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chart Controls */}
      <div className="chart-controls">
        <div className="control-group">
          <label>Timeframe:</label>
          <select 
            value={selectedTimeframe} 
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="control-select"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="control-group">
          <label>Metric:</label>
          <select 
            value={selectedMetric} 
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="control-select"
          >
            <option value="revenue">Revenue</option>
            <option value="orders">Orders</option>
            <option value="customers">Customers</option>
          </select>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Main Trend Chart */}
        <div className="chart-card main-chart">
          <div className="chart-header">
            <h3>{selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Trend</h3>
            <div className="chart-period">{selectedTimeframe.charAt(0).toUpperCase() + selectedTimeframe.slice(1)}</div>
          </div>
          <div className="chart-container">
            <Line 
              data={{
                labels: timeSeriesData.labels,
                datasets: [{
                  label: selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1),
                  data: timeSeriesData.data,
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  tension: 0.4,
                  fill: true,
                }]
              }} 
              options={chartOptions} 
            />
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Platform Distribution</h3>
          </div>
          <div className="chart-container">
            <Doughnut data={platformData} options={pieOptions} />
          </div>
        </div>

        {/* Top Products */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Top Products</h3>
          </div>
          <div className="chart-container">
            <Bar 
              data={{
                labels: topProducts?.slice(0, 5).map(p => p.product_name) || ['Wings', 'Fries', 'Drinks', 'Sides', 'Desserts'],
                datasets: [{
                  label: 'Revenue (GBP)',
                  data: topProducts?.slice(0, 5).map(p => p.total_revenue_gbp) || [800, 600, 400, 300, 200],
                  backgroundColor: 'rgba(16, 185, 129, 0.8)',
                }]
              }} 
              options={chartOptions} 
            />
          </div>
        </div>

        {/* Store Comparison Radar */}
        {radarData && viewMode === 'comparison' && (
          <div className="chart-card">
            <div className="chart-header">
              <h3>Store Comparison</h3>
            </div>
            <div className="chart-container">
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>
        )}

        {/* Order Types */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Order Types</h3>
          </div>
          <div className="chart-container">
            <Pie 
              data={{
                labels: ['Pickup', 'Delivery', 'Dine-in'],
                datasets: [{
                  data: [45, 40, 15],
                  backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                  ]
                }]
              }} 
              options={pieOptions} 
            />
          </div>
        </div>

        {/* Customer Acquisition */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Customer Acquisition</h3>
          </div>
          <div className="chart-container">
            <Line 
              data={{
                labels: timeSeriesData.labels,
                datasets: [
                  {
                    label: 'New Customers',
                    data: timeSeriesData.data.map(val => Math.floor(val / 50)),
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                  },
                  {
                    label: 'Returning Customers',
                    data: timeSeriesData.data.map(val => Math.floor(val / 60)),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                  }
                ]
              }} 
              options={chartOptions} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
