import React, { useState, useEffect } from 'react';
import { 
  WifiOff, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  RefreshCw,
  Activity
} from 'lucide-react';
import { 
  webhookMonitor, 
  WEBHOOK_STATUS
} from '../utils/webhookMonitor';
import './WebhookStatus.css';

const WebhookStatus = ({ className = '' }) => {
  const [status, setStatus] = useState(webhookMonitor.getStatus());
  const [isExpanded, setIsExpanded] = useState(false);
  const [recentErrors, setRecentErrors] = useState([]);

  useEffect(() => {
    // Update status every 5 seconds
    const interval = setInterval(() => {
      setStatus(webhookMonitor.getStatus());
    }, 5000);

    // Add error handler
    const errorHandler = (error) => {
      setRecentErrors(prev => [error, ...prev.slice(0, 4)]); // Keep last 5 errors
    };

    webhookMonitor.addErrorHandler(errorHandler);

    return () => {
      clearInterval(interval);
      webhookMonitor.removeErrorHandler(errorHandler);
    };
  }, []);

  const getStatusIcon = () => {
    switch (status.status) {
      case WEBHOOK_STATUS.ACTIVE:
        return <CheckCircle className="status-icon active" size={16} />;
      case WEBHOOK_STATUS.WARNING:
        return <AlertTriangle className="status-icon warning" size={16} />;
      case WEBHOOK_STATUS.ERROR:
        return <XCircle className="status-icon error" size={16} />;
      case WEBHOOK_STATUS.OFFLINE:
      default:
        return <WifiOff className="status-icon offline" size={16} />;
    }
  };

  const getStatusText = () => {
    switch (status.status) {
      case WEBHOOK_STATUS.ACTIVE:
        return 'Webhook Active';
      case WEBHOOK_STATUS.WARNING:
        return 'Webhook Warning';
      case WEBHOOK_STATUS.ERROR:
        return 'Webhook Error';
      case WEBHOOK_STATUS.OFFLINE:
      default:
        return 'Webhook Offline';
    }
  };


  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const handleRefresh = () => {
    webhookMonitor.checkWebhookHealth();
  };

  const handleRetry = () => {
    webhookMonitor.retryCount = 0;
    webhookMonitor.errorCount = 0;
    webhookMonitor.checkWebhookHealth();
  };

  return (
    <div className={`webhook-status ${className}`}>
      <div 
        className="webhook-status-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="status-indicator">
          {getStatusIcon()}
          <span className="status-text">{getStatusText()}</span>
        </div>
        
        <div className="status-actions">
          <button 
            className="refresh-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleRefresh();
            }}
            title="Refresh Status"
          >
            <RefreshCw size={14} />
          </button>
          
          <div className="expand-icon">
            {isExpanded ? '▼' : '▶'}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="webhook-status-details">
          <div className="status-grid">
            <div className="status-item">
              <Clock size={14} />
              <span>Last Heartbeat:</span>
              <span>{formatTimestamp(status.lastHeartbeat)}</span>
            </div>
            
            <div className="status-item">
              <Activity size={14} />
              <span>Error Count:</span>
              <span className={status.errorCount > 0 ? 'error-count' : ''}>
                {status.errorCount}
              </span>
            </div>
            
            <div className="status-item">
              <RefreshCw size={14} />
              <span>Retry Count:</span>
              <span>{status.retryCount}</span>
            </div>
          </div>

          {status.lastError && (
            <div className="last-error">
              <h4>Last Error:</h4>
              <div className="error-details">
                <div className="error-type">
                  <strong>Type:</strong> {status.lastError.type}
                </div>
                <div className="error-message">
                  <strong>Message:</strong> {status.lastError.message}
                </div>
                <div className="error-time">
                  <strong>Time:</strong> {formatTimestamp(status.lastError.timestamp)}
                </div>
              </div>
            </div>
          )}

          {recentErrors.length > 0 && (
            <div className="recent-errors">
              <h4>Recent Errors:</h4>
              <div className="error-list">
                {recentErrors.map((error, index) => (
                  <div key={index} className="error-item">
                    <span className="error-type-badge">{error.type}</span>
                    <span className="error-message-text">{error.message}</span>
                    <span className="error-time-text">
                      {formatTimestamp(error.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {status.status === WEBHOOK_STATUS.ERROR && (
            <div className="error-actions">
              <button 
                className="retry-btn"
                onClick={handleRetry}
              >
                <RefreshCw size={14} />
                Retry Connection
              </button>
            </div>
          )}

          <div className="webhook-info">
            <h4>Webhook Endpoint:</h4>
            <code className="endpoint-url">
              https://yhuxzdqwxzsepfkjjoan.supabase.co/functions/v1/ingest-order-simple
            </code>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhookStatus;
