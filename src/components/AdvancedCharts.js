import React, { useState, useMemo } from 'react';
import { Bar, Line, Pie, Doughnut, Radar } from 'react-chartjs-2';
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

const AdvancedCharts = ({ dashboardData, topProducts, storePerformance, loading }) => {
  const [selectedChartType, setSelectedChartType] = useState('revenue');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [selectedTimeframe, setSelectedTimeframe] = useState('daily');

  // Sample data for demonstration - replace with real API data
  const chartData = useMemo(() => {
    if (loading) return null;

    const baseData = {
      daily: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        revenue: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
        orders: [45, 67, 89, 120, 78, 95, 110],
        customers: [38, 52, 71, 95, 62, 78, 88]
      },
      weekly: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        revenue: [15000, 18000, 22000, 19500],
        orders: [450, 520, 680, 580],
        customers: [380, 450, 520, 480]
      },
      monthly: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        revenue: [65000, 72000, 85000, 78000, 92000, 88000],
        orders: [1800, 2100, 2500, 2300, 2800, 2700],
        customers: [1500, 1700, 2000, 1850, 2200, 2100]
      }
    };

    return baseData[selectedTimeframe];
  }, [selectedTimeframe, loading]);

  // Heatmap data for store performance
  const heatmapData = useMemo(() => {
    if (!storePerformance || storePerformance.length === 0) return null;

    const stores = storePerformance.slice(0, 8).map(store => store.store_name);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Generate sample heatmap data
    const data = stores.map((store, storeIndex) => 
      days.map((day, dayIndex) => ({
        x: day,
        y: store,
        v: Math.floor(Math.random() * 1000) + 500 // Sample revenue data
      }))
    ).flat();

    return { stores, days, data };
  }, [storePerformance]);

  // Platform analysis data
  const platformData = useMemo(() => {
    return {
      labels: ['Uber Eats', 'Deliveroo', 'Just Eat', 'Direct Orders', 'Phone Orders'],
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

  // Store comparison radar chart data
  const radarData = useMemo(() => {
    if (!storePerformance || storePerformance.length < 2) return null;

    const stores = storePerformance.slice(0, 3);
    return {
      labels: ['Revenue', 'Orders', 'Customers', 'AOV', 'Growth'],
      datasets: stores.map((store, index) => ({
        label: store.store_name,
        data: [
          (store.revenue_last_30_days_gbp || 0) / 1000, // Normalize for radar
          (store.orders_last_30_days || 0) / 10,
          (store.unique_customers_last_30_days || 0) / 10,
          (store.avg_order_value_last_30_days_gbp || 0) / 10,
          Math.random() * 100 // Sample growth data
        ],
        backgroundColor: `rgba(${59 + index * 50}, ${130 + index * 30}, ${246 - index * 50}, 0.2)`,
        borderColor: `rgba(${59 + index * 50}, ${130 + index * 30}, ${246 - index * 50}, 1)`,
        borderWidth: 2
      }))
    };
  }, [storePerformance]);

  // Trend comparison data
  const trendComparisonData = useMemo(() => {
    if (!chartData) return null;

    return {
      labels: chartData.labels,
      datasets: [
        {
          label: 'Current Period',
          data: chartData[selectedMetric],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Previous Period',
          data: chartData[selectedMetric].map(val => val * 0.85), // Sample previous period data
          borderColor: 'rgb(156, 163, 175)',
          backgroundColor: 'rgba(156, 163, 175, 0.1)',
          tension: 0.4,
        }
      ]
    };
  }, [chartData, selectedMetric]);

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
      <div className="advanced-charts-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="chart-card">
            <div className="chart-header">
              <div className="chart-title">Loading...</div>
            </div>
            <div className="chart-container">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                Loading chart...
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="advanced-charts-section">
      {/* Chart Controls */}
      <div className="chart-controls">
        <div className="control-group">
          <label>Chart Type:</label>
          <select 
            value={selectedChartType} 
            onChange={(e) => setSelectedChartType(e.target.value)}
            className="control-select"
          >
            <option value="revenue">Revenue Trend</option>
            <option value="comparison">Trend Comparison</option>
            <option value="platform">Platform Analysis</option>
            <option value="heatmap">Store Heatmap</option>
            <option value="radar">Store Comparison</option>
            <option value="distribution">Revenue Distribution</option>
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
      </div>

      <div className="advanced-charts-grid">
        {/* Main Chart */}
        <div className="chart-card main-chart">
          <div className="chart-header">
            <div className="chart-title">
              {selectedChartType === 'revenue' && 'Revenue Trend'}
              {selectedChartType === 'comparison' && 'Trend Comparison'}
              {selectedChartType === 'platform' && 'Platform Analysis'}
              {selectedChartType === 'heatmap' && 'Store Performance Heatmap'}
              {selectedChartType === 'radar' && 'Store Comparison'}
              {selectedChartType === 'distribution' && 'Revenue Distribution'}
            </div>
          </div>
          <div className="chart-container">
            {selectedChartType === 'revenue' && chartData && (
              <Line data={{
                labels: chartData.labels,
                datasets: [{
                  label: selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1),
                  data: chartData[selectedMetric],
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  tension: 0.4,
                }]
              }} options={chartOptions} />
            )}

            {selectedChartType === 'comparison' && trendComparisonData && (
              <Line data={trendComparisonData} options={chartOptions} />
            )}

            {selectedChartType === 'platform' && (
              <Doughnut data={platformData} options={pieOptions} />
            )}

            {selectedChartType === 'heatmap' && heatmapData && (
              <div className="heatmap-container">
                <div className="heatmap-grid">
                  {heatmapData.days.map(day => (
                    <div key={day} className="heatmap-header">{day}</div>
                  ))}
                  {heatmapData.stores.map(store => (
                    <React.Fragment key={store}>
                      <div className="heatmap-store">{store}</div>
                      {heatmapData.days.map(day => {
                        const cellData = heatmapData.data.find(d => d.x === day && d.y === store);
                        const intensity = cellData ? cellData.v / 1000 : 0;
                        return (
                          <div 
                            key={`${store}-${day}`}
                            className="heatmap-cell"
                            style={{
                              backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                              color: intensity > 0.5 ? 'white' : 'black'
                            }}
                          >
                            {cellData ? `£${cellData.v}` : '-'}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {selectedChartType === 'radar' && radarData && (
              <Radar data={radarData} options={radarOptions} />
            )}

            {selectedChartType === 'distribution' && (
              <Bar data={{
                labels: ['Low', 'Medium', 'High', 'Premium'],
                datasets: [{
                  label: 'Revenue Distribution',
                  data: [15000, 35000, 45000, 25000],
                  backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                  ]
                }]
              }} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Secondary Charts */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Top Products Performance</div>
          </div>
          <div className="chart-container">
            <Bar data={{
              labels: topProducts?.slice(0, 5).map(p => p.product_name) || ['Wings', 'Fries', 'Drinks', 'Sides', 'Desserts'],
              datasets: [{
                label: 'Revenue (GBP)',
                data: topProducts?.slice(0, 5).map(p => p.total_revenue_gbp) || [800, 600, 400, 300, 200],
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
              }]
            }} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Order Types Distribution</div>
          </div>
          <div className="chart-container">
            <Pie data={{
              labels: ['Pickup', 'Delivery', 'Dine-in'],
              datasets: [{
                data: [45, 40, 15],
                backgroundColor: [
                  'rgba(59, 130, 246, 0.8)',
                  'rgba(16, 185, 129, 0.8)',
                  'rgba(245, 158, 11, 0.8)',
                ]
              }]
            }} options={pieOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Customer Acquisition</div>
          </div>
          <div className="chart-container">
            <Line data={{
              labels: chartData?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [
                {
                  label: 'New Customers',
                  data: [12, 19, 25, 22, 18, 24, 28],
                  borderColor: 'rgb(16, 185, 129)',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  tension: 0.4,
                },
                {
                  label: 'Returning Customers',
                  data: [8, 15, 20, 18, 16, 22, 25],
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  tension: 0.4,
                }
              ]
            }} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCharts;
