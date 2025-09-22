import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

const AlertCard = ({
  type = 'info', // 'info', 'success', 'warning', 'error'
  title,
  message,
  action,
  onAction,
  onDismiss,
  dismissible = false,
  loading = false,
  className = ''
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'alert-card-success';
      case 'warning':
        return 'alert-card-warning';
      case 'error':
        return 'alert-card-error';
      default:
        return 'alert-card-info';
    }
  };

  if (loading) {
    return (
      <div className={`alert-card alert-card-loading ${className}`}>
        <div className="alert-card-icon">
          <div className="skeleton-circle"></div>
        </div>
        <div className="alert-card-content">
          <div className="alert-card-title skeleton">Loading...</div>
          <div className="alert-card-message skeleton">Loading message...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`alert-card ${getTypeStyles()} ${className}`}>
      <div className="alert-card-icon">
        {getIcon()}
      </div>
      
      <div className="alert-card-content">
        {title && (
          <div className="alert-card-title">
            {title}
          </div>
        )}
        
        {message && (
          <div className="alert-card-message">
            {message}
          </div>
        )}
        
        {action && onAction && (
          <button
            onClick={onAction}
            className="alert-card-action"
          >
            {action}
          </button>
        )}
      </div>

      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="alert-card-dismiss"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default AlertCard;
