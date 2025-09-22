import React from 'react';
import { DollarSign, ShoppingCart, TrendingUp, Store } from 'lucide-react';
import KpiCard from './ui/KpiCard';

const MetricsCards = ({ data, loading }) => {
  const metrics = [
    {
      title: 'Total Revenue',
      value: data?.total_revenue_gbp || 0,
      change: data?.revenue_growth_percent || 0,
      changeType: (data?.revenue_growth_percent || 0) > 0 ? 'positive' : (data?.revenue_growth_percent || 0) < 0 ? 'negative' : 'neutral',
      icon: DollarSign,
      format: 'currency'
    },
    {
      title: 'Total Orders',
      value: data?.total_orders || 0,
      change: 0, // You could calculate order growth if needed
      changeType: 'neutral',
      icon: ShoppingCart,
      format: 'number'
    },
    {
      title: 'Avg Order Value',
      value: data?.avg_order_value_gbp || 0,
      change: 0, // You could calculate AOV growth if needed
      changeType: 'neutral',
      icon: TrendingUp,
      format: 'currency'
    },
    {
      title: 'Active Stores',
      value: data?.unique_stores || 0,
      change: 0, // You could calculate store growth if needed
      changeType: 'neutral',
      icon: Store,
      format: 'number'
    }
  ];

  return (
    <div className="metrics-grid">
      {metrics.map((metric, index) => (
        <KpiCard
          key={index}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          changeType={metric.changeType}
          icon={metric.icon}
          format={metric.format}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default MetricsCards;
