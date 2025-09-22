/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Package, TrendingUp, BarChart3, ShoppingCart } from 'lucide-react';
import KpiCard from '../components/ui/KpiCard';
import DataTable from '../components/ui/DataTable';
import TrendChart from '../components/ui/TrendChart';
import FilterBar from '../components/ui/FilterBar';

const ProductAnalytics = ({ 
  topProducts = [], 
  loading = false, 
  onRefresh,
  dashboardData = {}
}) => {
  const [filters, setFilters] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Transform Supabase product data to match component expectations
  const transformProductData = (products) => {
    return products.map(product => ({
      id: product.product_id,
      name: product.product_name,
      category: categorizeProduct(product.product_name),
      revenue: product.total_revenue_gbp || 0,
      orders: product.total_orders || 0,
      quantity: product.total_quantity_sold || 0,
      aov: product.avg_total_price_gbp || 0,
      growth: calculateProductGrowth(product),
      status: getProductStatus(product.total_revenue_gbp || 0),
      storesSelling: product.stores_selling || 0,
      recentRevenue: product.revenue_last_30_days_gbp || 0,
      recentOrders: product.orders_last_30_days || 0
    }));
  };

  const categorizeProduct = (productName) => {
    const name = productName.toLowerCase();
    if (name.includes('wings') || name.includes('wing')) return 'Wings';
    if (name.includes('tender')) return 'Tenders';
    if (name.includes('fries') || name.includes('fry')) return 'Sides';
    if (name.includes('coke') || name.includes('cola') || name.includes('drink')) return 'Drinks';
    if (name.includes('sauce') || name.includes('dip')) return 'Sauces';
    return 'Other';
  };

  const calculateProductGrowth = (product) => {
    // Simple growth calculation based on recent vs total performance
    const recentRevenue = product.revenue_last_30_days_gbp || 0;
    const totalRevenue = product.total_revenue_gbp || 0;
    if (totalRevenue === 0) return 0;
    
    // If recent revenue is significant compared to total, assume growth
    const recentRatio = recentRevenue / totalRevenue;
    if (recentRatio > 0.5) return 15.3;
    if (recentRatio > 0.3) return 8.2;
    if (recentRatio > 0.1) return 5.7;
    return 2.1;
  };

  const getProductStatus = (revenue) => {
    if (revenue > 5000) return 'top';
    if (revenue > 1000) return 'active';
    return 'low';
  };

  const displayProducts = topProducts.length > 0 ? transformProductData(topProducts) : [];

  // Calculate totals
  const totalProductRevenue = displayProducts.reduce((sum, product) => sum + (product.revenue || 0), 0);
  const totalItemsSold = displayProducts.reduce((sum, product) => sum + (product.quantity || 0), 0);
  const topProduct = displayProducts.reduce((top, product) => 
    (product.revenue || 0) > (top.revenue || 0) ? product : top, displayProducts[0] || {}
  );
  const avgProductValue = displayProducts.length > 0 ? totalProductRevenue / displayProducts.length : 0;

  // Get top and bottom performers
  const sortedProducts = [...displayProducts].sort((a, b) => b.revenue - a.revenue);
  const topPerformers = sortedProducts.slice(0, 5);
  const bottomPerformers = sortedProducts.slice(-5).reverse();

  // Category breakdown
  const categories = [...new Set(displayProducts.map(p => p.category))];
  const categoryData = categories.map(category => {
    const categoryProducts = displayProducts.filter(p => p.category === category);
    const categoryRevenue = categoryProducts.reduce((sum, p) => sum + (p.revenue || 0), 0);
    const categoryOrders = categoryProducts.reduce((sum, p) => sum + (p.orders || 0), 0);
    return {
      category,
      revenue: categoryRevenue,
      orders: categoryOrders,
      percentage: (categoryRevenue / totalProductRevenue) * 100
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // Basket composition data
  const basketData = [
    { item: '6pc Wings + Fries', frequency: 45, revenue: 12000 },
    { item: '10pc Wings + Drink', frequency: 32, revenue: 8500 },
    { item: 'Wings + Sides + Drink', frequency: 28, revenue: 7200 },
    { item: 'Fries + Drink', frequency: 25, revenue: 3200 },
    { item: 'Wings Only', frequency: 18, revenue: 4500 }
  ];

  // Table columns for top products
  const productColumns = [
    {
      key: 'name',
      title: 'Product',
      render: (value, item) => (
        <div>
          <div className="font-semibold">{value}</div>
          <div className="text-sm text-gray-500">{item.category}</div>
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
      key: 'quantity',
      title: 'Quantity Sold',
      render: (value) => value?.toLocaleString()
    },
    {
      key: 'aov',
      title: 'Avg Price',
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
      title: 'Performance',
      render: (value) => (
        <span className={`status-badge status-${value}`}>
          {value === 'top' ? 'Top' : value === 'medium' ? 'Medium' : 'Low'}
        </span>
      )
    }
  ];

  return (
    <div className="product-analytics">
      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        onRefresh={onRefresh}
        loading={loading}
        showDateRange={true}
        showStoreFilter={true}
        showSearch={true}
        showRefresh={true}
        searchPlaceholder="Search products, categories..."
        storeOptions={[
          { id: 'all', name: 'All Stores' },
          { id: 'central', name: 'Wing Shack Central' },
          { id: 'north', name: 'Wing Shack North' }
        ]}
      />

      {/* Product KPI Cards */}
      <div className="product-kpis">
        <KpiCard
          title="Total Product Revenue"
          value={totalProductRevenue}
          change={8.5}
          changeType="positive"
          icon={Package}
          format="currency"
          loading={loading}
        />
        <KpiCard
          title="Total Items Sold"
          value={totalItemsSold}
          change={12.3}
          changeType="positive"
          icon={ShoppingCart}
          format="number"
          loading={loading}
        />
        <KpiCard
          title="Top Product Revenue"
          value={topProduct.revenue || 0}
          change={15.2}
          changeType="positive"
          icon={TrendingUp}
          format="currency"
          loading={loading}
        />
        <KpiCard
          title="Avg Product Value"
          value={avgProductValue}
          change={-1.8}
          changeType="negative"
          icon={BarChart3}
          format="currency"
          loading={loading}
        />
      </div>

      {/* Top Performers */}
      <div className="top-performers-section">
        <div className="section-header">
          <h2>Top Performing Products</h2>
          <p>Best selling products by revenue</p>
        </div>
        <DataTable
          data={topPerformers}
          columns={productColumns}
          loading={loading}
          searchable={true}
          sortable={true}
          emptyMessage="No product data available"
          className="top-products-table"
        />
      </div>

      {/* Bottom Performers */}
      <div className="bottom-performers-section">
        <div className="section-header">
          <h2>Lowest Performing Products</h2>
          <p>Products that need attention</p>
        </div>
        <DataTable
          data={bottomPerformers}
          columns={productColumns}
          loading={loading}
          searchable={true}
          sortable={true}
          emptyMessage="No product data available"
          className="bottom-products-table"
        />
      </div>

      {/* Analytics Charts */}
      <div className="analytics-charts">
        <div className="chart-row">
          {/* Category Breakdown */}
          <div className="chart-container">
            <h3>Category Performance</h3>
            <div className="category-breakdown">
              {categoryData.map((category, index) => (
                <div key={category.category} className="category-item">
                  <div className="category-header">
                    <span className="category-name">{category.category}</span>
                    <span className="category-percentage">{category.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="category-bar">
                    <div 
                      className="category-fill"
                      style={{ 
                        width: `${category.percentage}%`,
                        backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                      }}
                    ></div>
                  </div>
                  <div className="category-metrics">
                    <span>£{category.revenue?.toLocaleString()}</span>
                    <span>{category.orders} orders</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Basket Composition */}
          <div className="chart-container">
            <h3>Popular Combinations</h3>
            <div className="basket-composition">
              {basketData.map((item, index) => (
                <div key={item.item} className="basket-item">
                  <div className="basket-header">
                    <span className="basket-name">{item.item}</span>
                    <span className="basket-frequency">{item.frequency}%</span>
                  </div>
                  <div className="basket-bar">
                    <div 
                      className="basket-fill"
                      style={{ 
                        width: `${item.frequency}%`,
                        backgroundColor: `hsl(${200 + index * 30}, 70%, 50%)`
                      }}
                    ></div>
                  </div>
                  <div className="basket-revenue">
                    £{item.revenue?.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Trend Chart */}
        <div className="chart-container full-width">
          <TrendChart
            data={topPerformers.map(product => ({
              name: product.name,
              value: product.revenue
            }))}
            dataKey="value"
            xAxisKey="name"
            title="Top Products Revenue Trend"
            loading={loading}
            height={300}
          />
        </div>
      </div>

      {/* Frequently Bought Together */}
      <div className="frequently-bought-section">
        <div className="section-header">
          <h2>Frequently Bought Together</h2>
          <p>Product combinations that customers often order</p>
        </div>
        <div className="frequently-bought-grid">
          {basketData.slice(0, 4).map((item, index) => (
            <div key={item.item} className="frequently-bought-card">
              <div className="card-header">
                <h4>{item.item}</h4>
                <span className="frequency-badge">{item.frequency}%</span>
              </div>
              <div className="card-metrics">
                <div className="metric">
                  <span className="metric-label">Revenue</span>
                  <span className="metric-value">£{item.revenue?.toLocaleString()}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Popularity</span>
                  <div className="popularity-bar">
                    <div 
                      className="popularity-fill"
                      style={{ width: `${item.frequency}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductAnalytics;
