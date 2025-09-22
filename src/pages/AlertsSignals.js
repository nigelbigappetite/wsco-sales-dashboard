/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X, Bell, TrendingUp } from 'lucide-react';
import KpiCard from '../components/ui/KpiCard';
import DataTable from '../components/ui/DataTable';
import AlertCard from '../components/ui/AlertCard';
import FilterBar from '../components/ui/FilterBar';
import WebhookStatus from '../components/WebhookStatus';
import WebhookConfig from '../components/WebhookConfig';
import WebhookDebugger from '../components/WebhookDebugger';

const AlertsSignals = ({ 
  alerts = [], 
  loading = false, 
  onRefresh,
  dashboardData = {}
}) => {
  const [filters, setFilters] = useState({});
  const [showResolved, setShowResolved] = useState(false);

  // Sample alerts data
  const sampleAlerts = [
    {
      id: 'alert-1',
      type: 'critical',
      title: 'Store Performance Alert',
      message: 'Wing Shack East revenue dropped 15% below target this week',
      store: 'Wing Shack East',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      priority: 'high',
      action: 'Investigate',
      resolved: false
    },
    {
      id: 'alert-3',
      type: 'success',
      title: 'Performance Milestone',
      message: 'Wing Shack Central achieved 20% growth this month',
      store: 'Wing Shack Central',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      status: 'acknowledged',
      priority: 'low',
      action: 'Celebrate',
      resolved: false
    },
    {
      id: 'alert-4',
      type: 'info',
      title: 'New Order Pattern',
      message: 'Peak ordering time shifted to 7-8 PM at Wing Shack South',
      store: 'Wing Shack South',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      priority: 'low',
      action: 'Review',
      resolved: false
    },
    {
      id: 'alert-5',
      type: 'critical',
      title: 'System Error',
      message: 'Payment processing issues reported at Wing Shack West',
      store: 'Wing Shack West',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      status: 'resolved',
      priority: 'high',
      action: 'Fixed',
      resolved: true
    }
  ];

  const displayAlerts = alerts.length > 0 ? alerts : sampleAlerts;
  const filteredAlerts = showResolved 
    ? displayAlerts 
    : displayAlerts.filter(alert => !alert.resolved);

  // Calculate alert metrics
  const totalAlerts = displayAlerts.length;
  const criticalAlerts = displayAlerts.filter(alert => alert.type === 'critical' && !alert.resolved).length;
  const positiveSignals = displayAlerts.filter(alert => alert.type === 'success' && !alert.resolved).length;
  const activeAlerts = displayAlerts.filter(alert => !alert.resolved).length;

  // Table columns for alerts
  const alertColumns = [
    {
      key: 'type',
      title: 'Type',
      render: (value, item) => (
        <div className="flex items-center gap-2">
          {value === 'critical' && <AlertCircle size={16} className="text-red-500" />}
          {value === 'warning' && <AlertTriangle size={16} className="text-yellow-500" />}
          {value === 'success' && <CheckCircle size={16} className="text-green-500" />}
          {value === 'info' && <Info size={16} className="text-blue-500" />}
          <span className="capitalize font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'title',
      title: 'Alert',
      render: (value, item) => (
        <div>
          <div className="font-semibold">{value}</div>
          <div className="text-sm text-gray-500">{item.message}</div>
        </div>
      )
    },
    {
      key: 'store',
      title: 'Store',
      render: (value) => (
        <span className="font-medium">{value}</span>
      )
    },
    {
      key: 'timestamp',
      title: 'Time',
      render: (value) => (
        <span className="text-sm">
          {new Date(value).toLocaleString('en-GB', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      )
    },
    {
      key: 'priority',
      title: 'Priority',
      render: (value) => (
        <span className={`priority-badge priority-${value}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
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
      key: 'action',
      title: 'Action',
      render: (value, item) => (
        <div className="flex gap-2">
          <button 
            className="action-button primary"
            onClick={() => handleAlertAction(item)}
          >
            {value}
          </button>
          {!item.resolved && (
            <button 
              className="action-button secondary"
              onClick={() => handleDismissAlert(item.id)}
            >
              <X size={14} />
            </button>
          )}
        </div>
      )
    }
  ];

  const handleAlertAction = (alert) => {
    console.log('Alert action:', alert.action, alert);
    // Implement alert action logic
  };

  const handleDismissAlert = (alertId) => {
    console.log('Dismiss alert:', alertId);
    // Implement dismiss logic
  };

  const handleResolveAlert = (alertId) => {
    console.log('Resolve alert:', alertId);
    // Implement resolve logic
  };

  return (
    <div className="alerts-signals">
      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        onRefresh={onRefresh}
        loading={loading}
        showDateRange={true}
        showStoreFilter={true}
        showSearch={true}
        showRefresh={true}
        searchPlaceholder="Search alerts, stores, messages..."
        storeOptions={[
          { id: 'all', name: 'All Stores' },
          { id: 'central', name: 'Wing Shack Central' },
          { id: 'north', name: 'Wing Shack North' },
          { id: 'south', name: 'Wing Shack South' },
          { id: 'east', name: 'Wing Shack East' },
          { id: 'west', name: 'Wing Shack West' }
        ]}
      />

      {/* Webhook Monitoring Section */}
      <div className="webhook-monitoring-section">
        <h2 className="section-title">Webhook Monitoring</h2>
        <div className="webhook-grid">
          <WebhookStatus className="webhook-status-card" />
          <WebhookConfig className="webhook-config-card" />
        </div>
        <div className="webhook-debugger-section">
          <WebhookDebugger className="webhook-debugger-card" />
        </div>
      </div>

      {/* Alert Summary Cards */}
      <div className="alert-summary">
        <KpiCard
          title="Total Alerts"
          value={totalAlerts}
          change={0}
          changeType="neutral"
          icon={Bell}
          format="number"
          loading={loading}
        />
        <KpiCard
          title="Critical Alerts"
          value={criticalAlerts}
          change={-2}
          changeType="positive"
          icon={AlertCircle}
          format="number"
          loading={loading}
        />
        <KpiCard
          title="Positive Signals"
          value={positiveSignals}
          change={3}
          changeType="positive"
          icon={TrendingUp}
          format="number"
          loading={loading}
        />
        <KpiCard
          title="Active Alerts"
          value={activeAlerts}
          change={-1}
          changeType="positive"
          icon={AlertTriangle}
          format="number"
          loading={loading}
        />
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="action-buttons">
          <button 
            className={`action-button ${!showResolved ? 'active' : ''}`}
            onClick={() => setShowResolved(false)}
          >
            Active Alerts ({activeAlerts})
          </button>
          <button 
            className={`action-button ${showResolved ? 'active' : ''}`}
            onClick={() => setShowResolved(true)}
          >
            All Alerts ({totalAlerts})
          </button>
          <button className="action-button">
            <Bell size={16} />
            Test Alert
          </button>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="alerts-feed">
        <div className="section-header">
          <h2>Alerts & Signals Feed</h2>
          <p>Real-time alerts and performance signals from all stores</p>
        </div>
        <DataTable
          data={filteredAlerts}
          columns={alertColumns}
          loading={loading}
          searchable={true}
          sortable={true}
          emptyMessage="No alerts available"
          className="alerts-table"
        />
      </div>

      {/* Actionable Insights Panel */}
      <div className="insights-panel">
        <div className="section-header">
          <h2>Actionable Insights</h2>
          <p>AI-generated recommendations based on current data</p>
        </div>
        
        <div className="insights-grid">
          <AlertCard
            type="warning"
            title="Revenue Optimization"
            message="Wing Shack East is underperforming by 15%. Consider running a promotional campaign or reviewing operational efficiency."
            action="Create Campaign"
            onAction={() => console.log('Create promotional campaign')}
          />
          
          <AlertCard
            type="info"
            title="Sales Trend Analysis"
            message="Weekend sales are consistently 40% higher than weekdays. Consider increasing marketing spend on weekends."
            action="Boost Weekend Marketing"
            onAction={() => console.log('Increase weekend marketing')}
          />
          
          <AlertCard
            type="success"
            title="Growth Opportunity"
            message="Wing Shack Central's success can be replicated. Consider expanding the successful marketing strategy to other locations."
            action="Replicate Strategy"
            onAction={() => console.log('Replicate marketing strategy')}
          />
          
          <AlertCard
            type="info"
            title="Peak Time Analysis"
            message="Order patterns show a shift to 7-8 PM peak times. Consider adjusting marketing campaigns to capitalize on this trend."
            action="Adjust Marketing"
            onAction={() => console.log('Adjust marketing strategy')}
          />
        </div>
      </div>

      {/* Global Alert Status */}
      <div className="global-status">
        <div className="status-indicator">
          <div className="status-icon">
            {criticalAlerts > 0 ? (
              <AlertCircle size={24} className="text-red-500" />
            ) : (
              <CheckCircle size={24} className="text-green-500" />
            )}
          </div>
          <div className="status-content">
            <h3>
              {criticalAlerts > 0 
                ? `${criticalAlerts} Critical Alert${criticalAlerts > 1 ? 's' : ''} Require${criticalAlerts > 1 ? '' : 's'} Attention`
                : 'All Systems Operating Normally'
              }
            </h3>
            <p>
              {criticalAlerts > 0 
                ? 'Immediate action required to resolve critical issues'
                : 'No critical alerts at this time'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsSignals;
