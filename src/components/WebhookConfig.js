import React, { useState } from 'react';
import { 
  Settings, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertCircle,
  Info,
  Shield,
  Zap
} from 'lucide-react';
import './WebhookConfig.css';

const WebhookConfig = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [config, setConfig] = useState({
    webhookUrl: '',
    secretKey: '',
    events: ['order.created', 'order.updated', 'order.cancelled'],
    retryAttempts: 3,
    timeout: 30
  });

  const webhookUrl = 'https://yhuxzdqwxzsepfkjjoan.supabase.co/functions/v1/ingest-order-simple';
  const webhookSecret = 'ws_' + Math.random().toString(36).substr(2, 32);

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const samplePayload = {
    order_id: "ORD_123456789",
    store_id: "store_london_central",
    platform: "deliveroo",
    total_amount: 24.50,
    currency: "GBP",
    order_date: "2024-01-15T14:30:00Z",
    customer_name: "John Doe",
    items: [
      {
        product_id: "wings_bbq_6pc",
        product_name: "BBQ Wings (6pc)",
        quantity: 1,
        unit_price: 12.99,
        total_price: 12.99
      },
      {
        product_id: "fries_regular",
        product_name: "Regular Fries",
        quantity: 1,
        unit_price: 3.99,
        total_price: 3.99
      }
    ],
    delivery_fee: 2.99,
    service_fee: 1.50,
    tax_amount: 2.03,
    status: "confirmed"
  };

  return (
    <div className={`webhook-config ${className}`}>
      <div 
        className="webhook-config-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="config-title">
          <Settings size={18} />
          <span>Webhook Configuration</span>
        </div>
        
        <div className="expand-icon">
          {isExpanded ? '▼' : '▶'}
        </div>
      </div>

      {isExpanded && (
        <div className="webhook-config-content">
          <div className="config-section">
            <h3>Deliverect Webhook Setup</h3>
            <p className="config-description">
              Configure your Deliverect webhook to send real-time order data to your dashboard.
            </p>

            <div className="webhook-url-section">
              <label>Webhook URL</label>
              <div className="input-group">
                <input 
                  type="text" 
                  value={webhookUrl} 
                  readOnly 
                  className="webhook-url-input"
                />
                <button 
                  className="copy-btn"
                  onClick={() => handleCopy(webhookUrl, 'url')}
                >
                  {copied === 'url' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div className="webhook-secret-section">
              <label>Webhook Secret</label>
              <div className="input-group">
                <input 
                  type="text" 
                  value={webhookSecret} 
                  readOnly 
                  className="webhook-secret-input"
                />
                <button 
                  className="copy-btn"
                  onClick={() => handleCopy(webhookSecret, 'secret')}
                >
                  {copied === 'secret' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div className="events-section">
              <label>Events to Monitor</label>
              <div className="events-list">
                {config.events.map((event, index) => (
                  <div key={index} className="event-item">
                    <Zap size={14} />
                    <span>{event}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="config-options">
              <div className="option-group">
                <label>Retry Attempts</label>
                <input 
                  type="number" 
                  value={config.retryAttempts}
                  onChange={(e) => handleConfigChange('retryAttempts', parseInt(e.target.value))}
                  min="1"
                  max="10"
                />
              </div>
              
              <div className="option-group">
                <label>Timeout (seconds)</label>
                <input 
                  type="number" 
                  value={config.timeout}
                  onChange={(e) => handleConfigChange('timeout', parseInt(e.target.value))}
                  min="5"
                  max="120"
                />
              </div>
            </div>
          </div>

          <div className="config-section">
            <h3>Deliverect Configuration</h3>
            <div className="deliverect-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Access Deliverect Dashboard</h4>
                  <p>Log into your Deliverect account and navigate to Settings → Webhooks</p>
                  <a 
                    href="https://dashboard.deliverect.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="external-link"
                  >
                    Open Deliverect Dashboard <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Create New Webhook</h4>
                  <p>Click "Add Webhook" and enter the following details:</p>
                  <div className="webhook-details">
                    <div className="detail-item">
                      <strong>URL:</strong> {webhookUrl}
                    </div>
                    <div className="detail-item">
                      <strong>Secret:</strong> {webhookSecret}
                    </div>
                    <div className="detail-item">
                      <strong>Events:</strong> {config.events.join(', ')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Test Webhook</h4>
                  <p>Use the test button in Deliverect to send a test webhook</p>
                  <div className="test-payload">
                    <h5>Expected Payload Format:</h5>
                    <pre>{JSON.stringify(samplePayload, null, 2)}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="config-section">
            <h3>Security & Monitoring</h3>
            <div className="security-info">
              <div className="info-item">
                <Shield size={16} />
                <div>
                  <strong>Webhook Secret</strong>
                  <p>Used to verify webhook authenticity. Keep this secret secure.</p>
                </div>
              </div>
              
              <div className="info-item">
                <AlertCircle size={16} />
                <div>
                  <strong>Error Handling</strong>
                  <p>Failed webhooks are automatically retried with exponential backoff.</p>
                </div>
              </div>
              
              <div className="info-item">
                <Info size={16} />
                <div>
                  <strong>Monitoring</strong>
                  <p>Check the Webhook Status panel for real-time monitoring and error logs.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="config-actions">
            <button 
              className="test-webhook-btn"
              onClick={() => {
                // Test webhook functionality
                console.log('Testing webhook...');
              }}
            >
              <Zap size={16} />
              Test Webhook
            </button>
            
            <button 
              className="save-config-btn"
              onClick={() => {
                // Save configuration
                console.log('Saving configuration...', config);
              }}
            >
              <Settings size={16} />
              Save Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhookConfig;
