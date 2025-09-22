import React from 'react';
import { Menu, RefreshCw, LogOut } from 'lucide-react';

const DashboardHeader = ({ 
  dashboardData = {}, 
  loading = false, 
  isRefreshing = false,
  onRefresh,
  onLogout,
  onMobileMenuToggle
}) => {
  return (
    <header className="dashboard-header">
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={onMobileMenuToggle}
      >
        <Menu size={24} />
      </button>

      {/* Header Content */}
      <div className="header-content">
        <div className="header-left">
          <div className="header-title">
            <h1>Wing Shack Co Sales Dashboard</h1>
            <p>Real-time business intelligence</p>
          </div>
        </div>

        <div className="header-right">
          <button 
            className="refresh-btn"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading || isRefreshing ? 'spinning' : ''} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>

          <button 
            className="logout-btn"
            onClick={onLogout}
            title="Logout"
          >
            <LogOut size={16} />
            Logout
          </button>

          {/* Last Updated */}
          <div className="last-updated">
            Last updated: {dashboardData?.lastUpdated || 'Never'}
          </div>
        </div>
      </div>

    </header>
  );
};

export default DashboardHeader;
