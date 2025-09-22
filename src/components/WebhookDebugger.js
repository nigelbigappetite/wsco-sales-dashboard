import React, { useState, useEffect } from 'react';
import { 
  Bug, 
  Play, 
  RefreshCw, 
  Download, 
  Trash2, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import './WebhookDebugger.css';

const WebhookDebugger = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [webhookLog, setWebhookLog] = useState([]);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    // Load webhook log from localStorage
    const log = JSON.parse(localStorage.getItem('webhook_log') || '[]');
    setWebhookLog(log);
  }, []);

  const testWebhook = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const testPayload = {
        order_id: `TEST_${Date.now()}`,
        site_id: 'store_london_central',
        location_id: 'store_london_central',
        platform: 'Deliveroo',
        status: 'placed',
        gross_total: 24.50,
        net_total: 22.50,
        items: [
          {
            id: 'wings_bbq_6pc',
            name: 'BBQ Wings (6pc)',
            qty: 1,
            price: 12.99,
            modifiers: [
              {
                id: 'extra_sauce',
                name: 'Extra BBQ Sauce',
                price: 1.50
              }
            ]
          }
        ],
        created_at: new Date().toISOString(),
        currency: 'GBP',
        customer_name: 'Test Customer',
        delivery_fee: 2.99,
        service_fee: 1.50,
        tax_amount: 2.03
      };

      console.log('Testing webhook with payload:', testPayload);

      const response = await fetch('https://yhuxzdqwxzsepfkjjoan.supabase.co/functions/v1/ingest-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlodXh6ZHF3eHpzZXBma2pqb2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NTc0OTcsImV4cCI6MjA3MzMzMzQ5N30.dYDkNRH7crw8-p4BRwRBCGeRDpZWgrGbxuFh7Eq3Ooc'
        },
        body: JSON.stringify(testPayload)
      });

      const result = await response.json();
      
      setTestResult({
        success: response.ok,
        status: response.status,
        data: result,
        timestamp: new Date().toISOString()
      });

      // Refresh the log
      const log = JSON.parse(localStorage.getItem('webhook_log') || '[]');
      setWebhookLog(log);

    } catch (error) {
      setTestResult({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsTesting(false);
    }
  };

  const clearLog = () => {
    localStorage.removeItem('webhook_log');
    setWebhookLog([]);
  };

  const downloadLog = () => {
    const dataStr = JSON.stringify(webhookLog, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `webhook_log_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className={`webhook-debugger ${className}`}>
      <div 
        className="debugger-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="debugger-title">
          <Bug size={18} />
          <span>Webhook Debugger</span>
          {webhookLog.length > 0 && (
            <span className="log-count">{webhookLog.length}</span>
          )}
        </div>
        
        <div className="debugger-actions">
          <button 
            className="test-btn"
            onClick={(e) => {
              e.stopPropagation();
              testWebhook();
            }}
            disabled={isTesting}
          >
            {isTesting ? <RefreshCw size={14} className="spinning" /> : <Play size={14} />}
            Test
          </button>
          
          <div className="expand-icon">
            {isExpanded ? '▼' : '▶'}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="debugger-content">
          {/* Test Result */}
          {testResult && (
            <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
              <div className="test-result-header">
                {testResult.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                <span>Test Result</span>
                <span className="test-time">{formatTimestamp(testResult.timestamp)}</span>
              </div>
              <div className="test-result-body">
                <div className="result-item">
                  <strong>Status:</strong> {testResult.status || 'Error'}
                </div>
                {testResult.data && (
                  <div className="result-item">
                    <strong>Response:</strong>
                    <pre>{JSON.stringify(testResult.data, null, 2)}</pre>
                  </div>
                )}
                {testResult.error && (
                  <div className="result-item">
                    <strong>Error:</strong> {testResult.error}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Webhook Log */}
          <div className="webhook-log-section">
            <div className="log-header">
              <h4>Webhook Log ({webhookLog.length})</h4>
              <div className="log-actions">
                <button 
                  className="download-btn"
                  onClick={downloadLog}
                  disabled={webhookLog.length === 0}
                >
                  <Download size={14} />
                  Download
                </button>
                <button 
                  className="clear-btn"
                  onClick={clearLog}
                  disabled={webhookLog.length === 0}
                >
                  <Trash2 size={14} />
                  Clear
                </button>
              </div>
            </div>

            {webhookLog.length === 0 ? (
              <div className="empty-log">
                <Clock size={24} />
                <p>No webhook data received yet</p>
                <p>Test the webhook or wait for Deliverect to send data</p>
              </div>
            ) : (
              <div className="log-list">
                {webhookLog.map((entry, index) => (
                  <div key={index} className="log-entry">
                    <div className="log-entry-header">
                      <div className="log-info">
                        <span className="log-order-id">{entry.order_id}</span>
                        <span className="log-platform">{entry.platform}</span>
                        <span className="log-amount">£{entry.total_amount}</span>
                      </div>
                      <div className="log-time">
                        {formatTimestamp(entry.received_at)}
                      </div>
                    </div>
                    
                    <div className="log-entry-details">
                      <div className="log-detail">
                        <strong>Store:</strong> {entry.store_id}
                      </div>
                      <div className="log-detail">
                        <strong>Customer:</strong> {entry.customer_name || 'N/A'}
                      </div>
                      <div className="log-detail">
                        <strong>Status:</strong> {entry.status}
                      </div>
                      <div className="log-detail">
                        <strong>Items:</strong> {entry.items?.length || 0} items
                      </div>
                    </div>

                    <details className="log-raw-data">
                      <summary>Raw Payload</summary>
                      <pre>{JSON.stringify(entry.raw_payload, null, 2)}</pre>
                    </details>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Debug Info */}
          <div className="debug-info">
            <h4>Debug Information</h4>
            <div className="debug-details">
              <div className="debug-item">
                <strong>Webhook URL:</strong>
                <code>https://yhuxzdqwxzsepfkjjoan.supabase.co/functions/v1/ingest-order-simple</code>
              </div>
              <div className="debug-item">
                <strong>Expected Method:</strong> POST
              </div>
              <div className="debug-item">
                <strong>Content-Type:</strong> application/json
              </div>
              <div className="debug-item">
                <strong>Required Headers:</strong> X-Webhook-Secret (optional)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhookDebugger;
