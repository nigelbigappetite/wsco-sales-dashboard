import React from 'react';
import { MapPin, TrendingUp } from 'lucide-react';

const HeatMap = ({
  data = [],
  title = 'Store Performance Heat Map',
  loading = false,
  className = '',
  onStoreClick
}) => {
  // Mock data for demonstration
  const mockStores = [
    { id: 1, name: 'London Central', lat: 51.5074, lng: -0.1278, value: 15000, performance: 'high' },
    { id: 2, name: 'Manchester', lat: 53.4808, lng: -2.2426, value: 12000, performance: 'medium' },
    { id: 3, name: 'Birmingham', lat: 52.4862, lng: -1.8904, value: 8000, performance: 'low' },
    { id: 4, name: 'Leeds', lat: 53.8008, lng: -1.5491, value: 11000, performance: 'medium' },
    { id: 5, name: 'Liverpool', lat: 53.4084, lng: -2.9916, value: 9500, performance: 'medium' },
  ];

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'high':
        return 'performance-high';
      case 'medium':
        return 'performance-medium';
      case 'low':
        return 'performance-low';
      default:
        return 'performance-unknown';
    }
  };

  const getPerformanceLabel = (performance) => {
    switch (performance) {
      case 'high':
        return 'High Performance';
      case 'medium':
        return 'Medium Performance';
      case 'low':
        return 'Low Performance';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className={`heat-map ${className}`}>
        <div className="heat-map-header">
          <h3 className="heat-map-title">{title}</h3>
        </div>
        <div className="heat-map-container">
          <div className="heat-map-skeleton">
            <div className="skeleton-map"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`heat-map ${className}`}>
      <div className="heat-map-header">
        <h3 className="heat-map-title">{title}</h3>
        <div className="heat-map-legend">
          <div className="legend-item">
            <div className="legend-color performance-high"></div>
            <span>High Performance</span>
          </div>
          <div className="legend-item">
            <div className="legend-color performance-medium"></div>
            <span>Medium Performance</span>
          </div>
          <div className="legend-item">
            <div className="legend-color performance-low"></div>
            <span>Low Performance</span>
          </div>
        </div>
      </div>

      <div className="heat-map-container">
        <div className="heat-map-placeholder">
          <MapPin size={48} className="heat-map-icon" />
          <h4>Interactive Heat Map</h4>
          <p>Geographic visualization of store performance</p>
          <div className="heat-map-stores">
            {mockStores.map(store => (
              <div
                key={store.id}
                className={`heat-map-store ${getPerformanceColor(store.performance)}`}
                onClick={() => onStoreClick && onStoreClick(store)}
              >
                <div className="store-info">
                  <div className="store-name">{store.name}</div>
                  <div className="store-value">£{store.value.toLocaleString()}</div>
                  <div className="store-performance">{getPerformanceLabel(store.performance)}</div>
                </div>
                <TrendingUp size={16} className="store-trend" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatMap;
