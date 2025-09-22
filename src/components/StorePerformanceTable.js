import React, { useState } from 'react';
import { formatCurrency, formatNumber } from '../utils/api';

const StorePerformanceTable = ({ data, loading }) => {
  const [sortField, setSortField] = useState('revenue_last_30_days_gbp');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return [...data].sort((a, b) => {
      const aValue = a[sortField] || 0;
      const bValue = b[sortField] || 0;
      
      if (sortDirection === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }, [data, sortField, sortDirection]);

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">Store Performance</div>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          Loading store performance data...
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">Store Performance</div>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          No store performance data available
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-header">
        <div className="table-title">Store Performance</div>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th 
                onClick={() => handleSort('store_name')}
                style={{ cursor: 'pointer' }}
              >
                Store Name {getSortIcon('store_name')}
              </th>
              <th 
                onClick={() => handleSort('orders_last_30_days')}
                style={{ cursor: 'pointer' }}
              >
                Orders (30d) {getSortIcon('orders_last_30_days')}
              </th>
              <th 
                onClick={() => handleSort('revenue_last_30_days_gbp')}
                style={{ cursor: 'pointer' }}
              >
                Revenue (30d) {getSortIcon('revenue_last_30_days_gbp')}
              </th>
              <th 
                onClick={() => handleSort('avg_order_value_last_30_days_gbp')}
                style={{ cursor: 'pointer' }}
              >
                Avg Order Value {getSortIcon('avg_order_value_last_30_days_gbp')}
              </th>
              <th 
                onClick={() => handleSort('unique_customers_last_30_days')}
                style={{ cursor: 'pointer' }}
              >
                Customers (30d) {getSortIcon('unique_customers_last_30_days')}
              </th>
              <th 
                onClick={() => handleSort('total_orders_all_time')}
                style={{ cursor: 'pointer' }}
              >
                Total Orders {getSortIcon('total_orders_all_time')}
              </th>
              <th 
                onClick={() => handleSort('total_revenue_all_time_gbp')}
                style={{ cursor: 'pointer' }}
              >
                Total Revenue {getSortIcon('total_revenue_all_time_gbp')}
              </th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((store, index) => (
              <tr key={store.store_id || index}>
                <td>
                  <div>
                    <div style={{ fontWeight: '600' }}>{store.store_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {store.is_franchise ? 'Franchise' : 'Corporate'}
                    </div>
                  </div>
                </td>
                <td className="font-mono">{formatNumber(store.orders_last_30_days || 0)}</td>
                <td className="font-mono">{formatCurrency(store.revenue_last_30_days_gbp || 0)}</td>
                <td className="font-mono">{formatCurrency(store.avg_order_value_last_30_days_gbp || 0)}</td>
                <td className="font-mono">{formatNumber(store.unique_customers_last_30_days || 0)}</td>
                <td className="font-mono">{formatNumber(store.total_orders_all_time || 0)}</td>
                <td className="font-mono">{formatCurrency(store.total_revenue_all_time_gbp || 0)}</td>
                <td>
                  <span 
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: store.active ? '#dcfce7' : '#fef2f2',
                      color: store.active ? '#166534' : '#dc2626'
                    }}
                  >
                    {store.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StorePerformanceTable;
