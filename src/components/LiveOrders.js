import React, { useState, useEffect, useRef } from 'react';
import { Activity, Clock, MapPin, User, ShoppingBag, RefreshCw, DollarSign, TrendingUp } from 'lucide-react';
import FilterBar from './ui/FilterBar';
import KpiCard from './ui/KpiCard';
import DataTable from './ui/DataTable';

const LiveOrders = ({ 
  orders = [], 
  loading = false, 
  onRefresh,
  maxOrders = 50,
  dashboardData = {}
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [filters, setFilters] = useState({});
  const [autoRefresh, setAutoRefresh] = useState(true);
  const ordersEndRef = useRef(null);

  // Simulate new orders for demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new order every 10-30 seconds
      if (Math.random() > 0.7) {
        setNewOrderCount(prev => prev + 1);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom when new orders arrive
  useEffect(() => {
    if (ordersEndRef.current) {
      ordersEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [orders]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getOrderStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'preparing':
        return 'status-preparing';
      case 'ready':
        return 'status-ready';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  const getOrderStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return '✓';
      case 'preparing':
        return '👨‍🍳';
      case 'ready':
        return '📦';
      case 'delivered':
        return '🚚';
      case 'cancelled':
        return '❌';
      default:
        return '⏳';
    }
  };

  // Sample orders for demonstration
  const sampleOrders = [
    {
      id: 'ORD-001',
      customer: 'John Smith',
      store: 'Wing Shack Central',
      platform: 'Deliveroo',
      status: 'confirmed',
      total: 24.50,
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      items: ['10pc Wings', 'Fries', 'Coke']
    },
    {
      id: 'ORD-002',
      customer: 'Sarah Johnson',
      store: 'Wing Shack North',
      platform: 'Uber Eats',
      status: 'preparing',
      total: 18.75,
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      items: ['6pc Wings', 'Onion Rings']
    },
    {
      id: 'ORD-003',
      customer: 'Mike Wilson',
      store: 'Wing Shack South',
      platform: 'Just Eat',
      status: 'ready',
      total: 32.00,
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      items: ['15pc Wings', 'Fries', '2x Coke']
    },
    {
      id: 'ORD-004',
      customer: 'Emma Davis',
      store: 'Wing Shack East',
      platform: 'Slerp',
      status: 'delivered',
      total: 21.50,
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      items: ['8pc Wings', 'Coleslaw']
    }
  ];

  const displayOrders = orders.length > 0 ? orders.slice(0, maxOrders) : sampleOrders;

  // Table columns configuration
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
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{formatTime(value)}</span>
        </div>
      )
    },
    {
      key: 'customer',
      title: 'Customer',
      render: (value) => (
        <div className="flex items-center gap-1">
          <User size={14} />
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'store',
      title: 'Store',
      render: (value) => (
        <div className="flex items-center gap-1">
          <MapPin size={14} />
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'platform',
      title: 'Platform',
      render: (value) => <span className="platform-badge">{value}</span>
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => (
        <span className={`order-status ${getOrderStatusColor(value)}`}>
          {getOrderStatusIcon(value)} {value}
        </span>
      )
    },
    {
      key: 'total',
      title: 'Total',
      render: (value) => <span className="font-semibold">£{value?.toFixed(2)}</span>
    }
  ];

  // Calculate today's metrics
  const todayOrders = displayOrders.filter(order => {
    const orderDate = new Date(order.timestamp);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
  const todayOrderCount = todayOrders.length;
  const todayAOV = todayOrderCount > 0 ? todayRevenue / todayOrderCount : 0;

  return (
    <div className="live-orders">
      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={(searchTerm) => setFilters({ ...filters, search: searchTerm })}
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
          { id: 'east', name: 'Wing Shack East' }
        ]}
      />

      {/* Today's Snapshot Cards */}
      <div className="snapshot-cards">
        <KpiCard
          title="Today's Sales"
          value={todayRevenue}
          change={12.5}
          changeType="positive"
          icon={DollarSign}
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
          value={displayOrders.filter(order => ['confirmed', 'preparing'].includes(order.status)).length}
          change={0}
          changeType="neutral"
          icon={ShoppingBag}
          format="number"
          loading={loading}
        />
      </div>

      {/* Live Orders Feed */}
      <div className="live-orders-feed">
        <div className="live-orders-header">
          <div className="live-orders-title">
            <Activity size={20} />
            <h3>Live Orders Feed</h3>
            {newOrderCount > 0 && (
              <span className="new-order-badge">{newOrderCount}</span>
            )}
          </div>
          <div className="live-orders-controls">
            <label className="auto-refresh-toggle">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              <span>Auto-refresh</span>
            </label>
            <button
              className="control-button"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
            <button
              className="control-button refresh"
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'spinning' : ''} />
              Refresh
            </button>
          </div>
        </div>

        <div className={`live-orders-content ${isExpanded ? 'expanded' : ''}`}>
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
      </div>
    </div>
  );
};

export default LiveOrders;
