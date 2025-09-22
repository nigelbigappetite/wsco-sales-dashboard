import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import TrendChart from './ui/TrendChart';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ChartsSection = ({ dashboardData, topProducts, loading }) => {
  // Enhanced data processing with real data integration
  const getRevenueTrendData = () => {
    // Use real data if available, otherwise fall back to sample data
    if (dashboardData?.daily_revenue) {
      return dashboardData.daily_revenue.map(item => ({
        date: item.date,
        value: item.revenue_gbp
      }));
    }
    
    // Fallback sample data
    return [
      { date: 'Mon', value: 1200 },
      { date: 'Tue', value: 1900 },
      { date: 'Wed', value: 3000 },
      { date: 'Thu', value: 5000 },
      { date: 'Fri', value: 2000 },
      { date: 'Sat', value: 3000 },
      { date: 'Sun', value: 4500 }
    ];
  };

  const getStorePerformanceData = () => {
    // Use real store performance data if available
    if (dashboardData?.store_performance) {
      return {
        labels: dashboardData.store_performance.map(store => store.store_name),
        datasets: [
          {
            label: 'Revenue (GBP)',
            data: dashboardData.store_performance.map(store => store.revenue_last_30_days_gbp),
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(139, 92, 246, 0.8)',
            ],
          },
        ],
      };
    }
    
    // Fallback sample data
    return {
      labels: ['Store A', 'Store B', 'Store C', 'Store D'],
      datasets: [
        {
          label: 'Revenue (GBP)',
          data: [12000, 19000, 3000, 5000],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
        },
      ],
    };
  };

  const getOrderTypesData = () => {
    // Use real order type data if available
    if (dashboardData?.order_types) {
      return {
        labels: dashboardData.order_types.map(type => type.type_name),
        datasets: [
          {
            data: dashboardData.order_types.map(type => type.percentage),
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
            ],
          },
        ],
      };
    }
    
    // Fallback sample data
    return {
      labels: ['Pickup', 'Delivery'],
      datasets: [
        {
          data: [75, 25],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
          ],
        },
      ],
    };
  };

  const getTopProductsData = () => {
    // Use real top products data if available
    if (topProducts && topProducts.length > 0) {
      return {
        labels: topProducts.slice(0, 5).map(product => product.product_name),
        datasets: [
          {
            label: 'Revenue (GBP)',
            data: topProducts.slice(0, 5).map(product => product.total_revenue_gbp),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
          },
        ],
      };
    }
    
    // Fallback sample data
    return {
      labels: ['Wings', 'Fries', 'Drinks', 'Sides', 'Desserts'],
      datasets: [
        {
          label: 'Revenue (GBP)',
          data: [800, 600, 400, 300, 200],
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '£' + value.toLocaleString();
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
    },
  };

  if (loading) {
    return (
      <div className="charts-grid">
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
    <div className="charts-grid">
      {/* Revenue Trend Chart */}
      <TrendChart
        data={getRevenueTrendData()}
        dataKey="value"
        xAxisKey="date"
        title="Revenue Trend"
        loading={loading}
        height={300}
      />

      {/* Store Performance Chart */}
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title">Store Performance</div>
        </div>
        <div className="chart-container">
          <Bar data={getStorePerformanceData()} options={chartOptions} />
        </div>
      </div>

      {/* Top Products Chart */}
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title">Top Products</div>
        </div>
        <div className="chart-container">
          <Bar data={getTopProductsData()} options={chartOptions} />
        </div>
      </div>

      {/* Order Types Chart */}
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title">Order Types</div>
        </div>
        <div className="chart-container">
          <Pie data={getOrderTypesData()} options={pieOptions} />
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;
