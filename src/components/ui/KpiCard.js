import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const KpiCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', // 'positive', 'negative', 'neutral'
  icon: Icon,
  loading = false,
  format = 'number', // 'number', 'currency', 'percentage'
  className = ''
}) => {
  const formatValue = (val) => {
    if (loading) return '...';
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: 'GBP',
        }).format(val || 0);
      case 'percentage':
        return `${val || 0}%`;
      default:
        return (val || 0).toLocaleString();
    }
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return <TrendingUp size={16} />;
    if (changeType === 'negative') return <TrendingDown size={16} />;
    return null;
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'change-positive';
      case 'negative': return 'change-negative';
      default: return 'change-neutral';
    }
  };

  if (loading) {
    return (
      <div className={`kpi-card ${className}`}>
        <div className="kpi-card-header">
          <div className="kpi-card-icon">
            {Icon && <Icon size={20} />}
          </div>
          <div className="kpi-card-title">{title}</div>
        </div>
        <div className="kpi-card-content">
          <div className="kpi-card-value skeleton">...</div>
          <div className="kpi-card-change skeleton">...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`kpi-card ${className}`}>
      <div className="kpi-card-header">
        <div className="kpi-card-icon">
          {Icon && <Icon size={20} />}
        </div>
        <div className="kpi-card-title">{title}</div>
      </div>
      <div className="kpi-card-content">
        <div className="kpi-card-value">{formatValue(value)}</div>
        {change !== undefined && change !== null && (
          <div className={`kpi-card-change ${getChangeColor()}`}>
            {getChangeIcon()}
            <span>{change > 0 ? '+' : ''}{change}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
