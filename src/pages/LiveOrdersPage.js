import React, { useState } from 'react';
import { ShoppingCart, Activity, TrendingUp, ShoppingBag, RefreshCw, Play, Pause } from 'lucide-react';
import KpiCard from '../components/ui/KpiCard';
import DataTable from '../components/ui/DataTable';
import FilterBar from '../components/ui/FilterBar';

const LiveOrdersPage = ({ 
  orders = [], 
  loading = false, 
  onRefresh,
  dashboardData = {}
}) => {
  const [filters, setFilters] = useState({});
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Sample live orders data
  const sampleOrders = [
    {
      id: 'ORD-001',
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      customer: 'John Smith',
      store: 'Wing Shack Central',
      platform: 'Deliveroo',
      status: 'confirmed',
      total: 24.50,
      items: ['6pc Buffalo Wings', 'Large Fries'],
      phone: '+44 7700 900123'
    },
    {
      id: 'ORD-002',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      customer: 'Sarah Johnson',
      store: 'Wing Shack North',
      platform: 'Uber Eats',
      status: 'preparing',
      total: 18.75,
      items: ['10pc Hot Wings', 'Coca Cola'],
      phone: '+44 7700 900456'
    },
    {
      id: 'ORD-003',
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      customer: 'Mike Wilson',
      store: 'Wing Shack South',
      platform: 'Just Eat',
      status: 'ready',
      total: 32.00,
      items: ['6pc Wings + Fries', 'Onion Rings'],
      phone: '+44 7700 900789'
    },
    {
      id: 'ORD-004',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      customer: 'Emma Davis',
      store: 'Wing Shack East',
      platform: 'Slerp',
      status: 'delivered',
      total: 21.50,
      items: ['4pc Wings', 'Large Fries', 'Drink'],
      phone: '+44 7700 900012'
    }
  ];

  const displayOrders = orders.length > 0 ? orders : sampleOrders;

  // Calculate today's metrics
  const today = new Date().toDateString();
  const todayOrders = displayOrders.filter(order => 
    new Date(order.timestamp).toDateString() === today
  );
  const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
  const todayOrderCount = todayOrders.length;
  const todayAOV = todayOrderCount > 0 ? todayRevenue / todayOrderCount : 0;
  const liveOrderCount = displayOrders.filter(order => 
    ['confirmed', 'preparing'].includes(order.status)
  ).length;

  // Table columns for live orders
  const columns = [
    {
      key: 'id',
      title: 'Order ID',
      render: (value) => <span className="order-id">#{value}</span>
    },
    {
      key: 'timestamp',
      title: 'Time',
      render: (value) => (
        <span className="order-time">
          {new Date(value).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </span>
      )
    },
    {
      key: 'customer',
      title: 'Customer',
      render: (value, item) => (
        <div>
          <div className="customer-name">{value}</div>
          <div className="customer-phone">{item.phone}</div>
        </div>
      )
    },
    {
      key: 'store',
      title: 'Store',
      render: (value) => <span className="store-name">{value}</span>
    },
    {
      key: 'platform',
      title: 'Platform',
      render: (value) => (
        <span className={`platform-badge platform-${value.toLowerCase().replace(' ', '')}`}>
          {value}
        </span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => (
        <span className={`status-badge status-${value}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'total',
      title: 'Total',
      render: (value) => (
        <span className="order-total">£{value?.toFixed(2)}</span>
      )
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Live Orders</h1>
        <p>Real-time order monitoring and management</p>
      </div>

      {/* Filter Bar */}
      <section className="page-section">
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          onRefresh={onRefresh}
          loading={loading}
          showDateRange={false}
          showStoreFilter={true}
          showSearch={true}
          showRefresh={true}
          searchPlaceholder="Search orders, customers, stores..."
          storeOptions={[
            { id: 'all', name: 'All Stores' },
            { id: 'central', name: 'Wing Shack Central' },
            { id: 'north', name: 'Wing Shack North' },
            { id: 'south', name: 'Wing Shack South' },
            { id: 'east', name: 'Wing Shack East' },
            { id: 'west', name: 'Wing Shack West' }
          ]}
        />
      </section>

      {/* Today's Snapshot Cards */}
      <section className="page-section">
        <div className="section-header">
          <h2>Today's Performance</h2>
          <p>Live metrics and order statistics</p>
        </div>
        <div className="snapshot-cards">
          <KpiCard
            title="Today's Sales"
            value={todayRevenue}
            change={12.5}
            changeType="positive"
            icon={ShoppingCart}
            format="currency"
            loading={loading}
          />
          <KpiCard
            title="Today's Orders"
            value={todayOrderCount}
            change={8.2}
            changeType="positive"
            icon={Activity}
            format="number"
            loading={loading}
          />
          <KpiCard
            title="Today's AOV"
            value={todayAOV}
            change={-2.1}
            changeType="negative"
            icon={TrendingUp}
            format="currency"
            loading={loading}
          />
          <KpiCard
            title="Live Orders"
            value={liveOrderCount}
            change={0}
            changeType="neutral"
            icon={ShoppingBag}
            format="number"
            loading={loading}
          />
        </div>
      </section>

      {/* Live Orders Feed */}
      <section className="page-section">
        <div className="section-header">
          <h2>Live Orders Feed</h2>
          <p>Real-time order updates and status tracking</p>
        </div>
        
        <div className="live-orders-controls">
          <div className="auto-refresh-toggle">
            <button
              className={`control-button ${autoRefresh ? 'active' : ''}`}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? <Pause size={16} /> : <Play size={16} />}
              {autoRefresh ? 'Pause Auto-refresh' : 'Start Auto-refresh'}
            </button>
            <button
              className="control-button"
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'spinning' : ''} />
              Refresh Now
            </button>
          </div>
        </div>

        <div className="live-orders-content">
          <DataTable
            data={displayOrders}
            columns={columns}
            loading={loading}
            searchable={false}
            sortable={true}
            emptyMessage="No recent orders. New orders will appear here in real-time."
            className="live-orders-table"
          />
        </div>
      </section>

      {/* Order Status Legend */}
      <section className="page-section">
        <div className="section-header">
          <h2>Order Status Guide</h2>
          <p>Understanding order statuses and next steps</p>
        </div>
        <div className="status-legend">
          <div className="legend-item">
            <span className="status-badge status-confirmed">Confirmed</span>
            <p>Order received and confirmed by the store</p>
          </div>
          <div className="legend-item">
            <span className="status-badge status-preparing">Preparing</span>
            <p>Order is being prepared in the kitchen</p>
          </div>
          <div className="legend-item">
            <span className="status-badge status-ready">Ready</span>
            <p>Order is ready for pickup or delivery</p>
          </div>
          <div className="legend-item">
            <span className="status-badge status-delivered">Delivered</span>
            <p>Order has been delivered to customer</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LiveOrdersPage;
