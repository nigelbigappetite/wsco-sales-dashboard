import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TrendChart = ({ 
  data = [], 
  dataKey = 'value',
  xAxisKey = 'date',
  title,
  height = 300,
  loading = false,
  className = '',
  color = '#3b82f6',
  showGrid = true,
  showTooltip = true
}) => {
  const formatTooltipValue = (value, name) => {
    // Format based on the data type
    if (typeof value === 'number') {
      if (value > 1000) {
        return `£${(value / 1000).toFixed(1)}k`;
      }
      return `£${value.toFixed(2)}`;
    }
    return value;
  };

  if (loading) {
    return (
      <div className={`trend-chart ${className}`}>
        {title && <div className="trend-chart-title">{title}</div>}
        <div className="trend-chart-container">
          <div className="trend-chart-skeleton">
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`trend-chart ${className}`}>
        {title && <div className="trend-chart-title">{title}</div>}
        <div className="trend-chart-container">
          <div className="trend-chart-empty">
            <p>No data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`trend-chart ${className}`}>
      {title && <div className="trend-chart-title">{title}</div>}
      <div className="trend-chart-container">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis 
              dataKey={xAxisKey} 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                if (value > 1000) {
                  return `£${(value / 1000).toFixed(1)}k`;
                }
                return `£${value}`;
              }}
            />
            {showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={formatTooltipValue}
                labelStyle={{ color: '#374151', fontWeight: '500' }}
              />
            )}
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
