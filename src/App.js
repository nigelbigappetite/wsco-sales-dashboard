/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import OverviewPage from './pages/OverviewPage';
import LiveOrdersPage from './pages/LiveOrdersPage';
import FranchisePerformance from './pages/FranchisePerformance';
import ProductAnalytics from './pages/ProductAnalytics';
import AlertsSignals from './pages/AlertsSignals';
import ErrorBoundary from './components/ErrorBoundary';
import { fetchDashboardData, fetchStorePerformance, fetchTopProducts } from './utils/api';
import { exportDashboardData } from './utils/exportUtils';
import { initMobileFeatures } from './utils/mobileUtils';
import { startWebhookMonitoring, addWebhookErrorHandler } from './utils/webhookMonitor';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [storePerformance, setStorePerformance] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [realtimeEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [activePage, setActivePage] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check for existing authentication on app load
  useEffect(() => {
    const savedAuth = localStorage.getItem('wingShackAuth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (success) => {
    if (success) {
      setIsAuthenticated(true);
      localStorage.setItem('wingShackAuth', 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('wingShackAuth');
    setDashboardData(null);
    setStorePerformance([]);
    setTopProducts([]);
  };

  const loadDashboardData = useCallback(async (isInitialLoad = false) => {
    try {
      // Only show loading spinner on initial load, not on auto-refresh
      if (isInitialLoad) {
        setLoading(true);
      } else {
        // Show subtle refresh indicator for auto-refresh
        setIsRefreshing(true);
      }
      setError(null);

      const [dashboard, stores, products] = await Promise.all([
        fetchDashboardData('30', 'all'), // Default to 30 days, all stores
        fetchStorePerformance(),
        fetchTopProducts(10)
      ]);

      setDashboardData(dashboard);
      setStorePerformance(stores);
      setTopProducts(products);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load dashboard data');
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      } else {
        // Hide refresh indicator after a short delay
        setTimeout(() => setIsRefreshing(false), 1000);
      }
    }
  }, []);

  useEffect(() => {
    // Initialize mobile features
    initMobileFeatures();
    
    if (isAuthenticated) {
      loadDashboardData(true); // Initial load with loading spinner
      
      // Start webhook monitoring
      startWebhookMonitoring();
      
      // Add webhook error handler
      const errorHandler = (error) => {
        console.error('Webhook error:', error);
        // You could show a notification here
      };
      addWebhookErrorHandler(errorHandler);
      
      // Auto-refresh every 30 seconds (without loading spinner)
      const interval = setInterval(() => loadDashboardData(false), 30000);
      return () => clearInterval(interval);
    }
  }, [loadDashboardData, isAuthenticated]);

  const handleRefresh = () => {
    loadDashboardData(true); // Manual refresh with loading spinner
  };


  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleRealtimeDataUpdate = (newData) => {
    setDashboardData(prev => ({
      ...prev,
      ...newData,
      lastUpdated: new Date().toISOString()
    }));
  };

  const handleConnectionStatusChange = (isConnected) => {
    setConnectionStatus(isConnected);
  };

  const handleExport = async (filters, format) => {
    try {
      await exportDashboardData(dashboardData, storePerformance, topProducts, filters, format);
    } catch (error) {
      console.error('Export failed:', error);
      setError('Export failed: ' + error.message);
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'overview':
        return (
          <OverviewPage
            dashboardData={dashboardData}
            topProducts={topProducts}
            loading={loading}
          />
        );
      case 'live-orders':
        return (
          <LiveOrdersPage
            orders={[]}
            loading={loading}
            onRefresh={handleRefresh}
            dashboardData={dashboardData}
          />
        );
      case 'franchise-performance':
        return (
          <FranchisePerformance
            storePerformance={storePerformance}
            loading={loading}
            onRefresh={handleRefresh}
            dashboardData={dashboardData}
          />
        );
      case 'product-analytics':
        return (
          <ProductAnalytics
            topProducts={topProducts}
            loading={loading}
            onRefresh={handleRefresh}
            dashboardData={dashboardData}
          />
        );
      case 'alerts-signals':
        return (
          <AlertsSignals
            alerts={[]}
            loading={loading}
            onRefresh={handleRefresh}
            dashboardData={dashboardData}
          />
        );
      default:
        return (
          <OverviewPage
            dashboardData={dashboardData}
            topProducts={topProducts}
            loading={loading}
          />
        );
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    console.log('Showing login page - not authenticated');
    return <LoginPage onLogin={handleLogin} />;
  }

  console.log('User is authenticated, showing dashboard');

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="app">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="app">
        <Sidebar
          activePage={activePage}
          onPageChange={setActivePage}
          isMobileOpen={isMobileMenuOpen}
          onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        
        <div className="main-layout">
          <DashboardHeader
            dashboardData={dashboardData}
            loading={loading}
            isRefreshing={isRefreshing}
            onRefresh={handleRefresh}
            onLogout={handleLogout}
            onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
          
          <main className="main-content">
            {error && (
              <div className="error-banner">
                <p>Error loading data: {error}</p>
                <button onClick={handleRefresh} className="retry-button">
                  Retry
                </button>
              </div>
            )}
            {renderPage()}
          </main>
          
          {/* Footer */}
          <footer className="dashboard-footer">
            <div className="footer-content">
              <p>Powered by <span className="hungry-tum-brand">Hungry Tum</span></p>
            </div>
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
