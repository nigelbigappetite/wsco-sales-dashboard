/* eslint-disable no-unused-vars */
import React from 'react';
import { 
  BarChart3, 
  ShoppingCart, 
  Store, 
  TrendingUp, 
  AlertCircle, 
  // Menu, 
  X,
  Home,
  Building2
} from 'lucide-react';

const Sidebar = ({ activePage, onPageChange, isMobileOpen, onMobileToggle }) => {
  const navigationItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Home,
      description: 'Dashboard overview and key metrics'
    },
    {
      id: 'live-orders',
      label: 'Live Orders',
      icon: ShoppingCart,
      description: 'Real-time order monitoring'
    },
    {
      id: 'franchise-performance',
      label: 'Franchise Performance',
      icon: Store,
      description: 'Store performance analysis'
    },
    {
      id: 'direct-operations',
      label: 'Direct Operations',
      icon: Building2,
      description: 'Directly operated locations'
    },
    {
      id: 'product-analytics',
      label: 'Product Analytics',
      icon: TrendingUp,
      description: 'Menu optimization insights'
    },
    {
      id: 'alerts-signals',
      label: 'Alerts & Signals',
      icon: AlertCircle,
      description: 'Actionable insights and alerts'
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="mobile-overlay"
          onClick={onMobileToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Mobile Header */}
        <div className="sidebar-mobile-header">
          <div className="sidebar-logo">
            <BarChart3 size={24} />
            <span>Wing Shack Co</span>
          </div>
          <button 
            className="mobile-close-btn"
            onClick={onMobileToggle}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.id} className="nav-item">
                  <button
                    className={`nav-button ${activePage === item.id ? 'active' : ''}`}
                    onClick={() => {
                      onPageChange(item.id);
                      if (window.innerWidth <= 768) {
                        onMobileToggle();
                      }
                    }}
                  >
                    <IconComponent size={20} />
                    <div className="nav-content">
                      <span className="nav-label">{item.label}</span>
                      <span className="nav-description">{item.description}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-version">
            <span>Dashboard v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
