// Webhook Monitoring and Error Handling
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://yhuxzdqwxzsepfkjjoan.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlodXh6ZHF3eHpzZXBma2pqb2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NTc0OTcsImV4cCI6MjA3MzMzMzQ5N30.dYDkNRH7crw8-p4BRwRBCGeRDpZWgrGbxuFh7Eq3Ooc';

const supabase = createClient(supabaseUrl, supabaseKey);

// Webhook Status Types
export const WEBHOOK_STATUS = {
  ACTIVE: 'active',
  ERROR: 'error',
  WARNING: 'warning',
  OFFLINE: 'offline'
};

// Error Types
export const ERROR_TYPES = {
  CONNECTION_FAILED: 'connection_failed',
  INVALID_PAYLOAD: 'invalid_payload',
  PROCESSING_ERROR: 'processing_error',
  RATE_LIMIT: 'rate_limit',
  AUTHENTICATION_FAILED: 'auth_failed'
};

// Webhook Monitor Class
export class WebhookMonitor {
  constructor() {
    this.status = WEBHOOK_STATUS.OFFLINE;
    this.lastHeartbeat = null;
    this.errorCount = 0;
    this.lastError = null;
    this.retryCount = 0;
    this.maxRetries = 3;
    this.heartbeatInterval = null;
    this.errorHandlers = [];
  }

  // Start monitoring webhook health
  startMonitoring() {
    console.log('Starting webhook monitoring...');
    this.heartbeatInterval = setInterval(() => {
      this.checkWebhookHealth();
    }, 30000); // Check every 30 seconds

    // Initial health check
    this.checkWebhookHealth();
  }

  // Stop monitoring
  stopMonitoring() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    console.log('Webhook monitoring stopped');
  }

  // Check webhook health by testing the endpoint
  async checkWebhookHealth() {
    try {
      // Use GET request to avoid CORS issues
      const response = await fetch('https://yhuxzdqwxzsepfkjjoan.supabase.co/functions/v1/ingest-order-simple', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'ok') {
          this.updateStatus(WEBHOOK_STATUS.ACTIVE);
          this.lastHeartbeat = new Date();
          this.errorCount = 0;
          this.retryCount = 0;
        } else {
          throw new Error(`Health check failed: ${data.message || 'Unknown error'}`);
        }
      } else {
        throw new Error(`Health check failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Webhook health check failed:', error);
      this.handleError(ERROR_TYPES.CONNECTION_FAILED, error.message);
    }
  }

  // Handle webhook errors
  handleError(errorType, message, payload = null) {
    this.errorCount++;
    this.lastError = {
      type: errorType,
      message,
      payload,
      timestamp: new Date(),
      retryCount: this.retryCount
    };

    console.error(`Webhook Error [${errorType}]:`, message);

    // Determine status based on error type and count
    if (this.errorCount >= 5) {
      this.updateStatus(WEBHOOK_STATUS.ERROR);
    } else if (this.errorCount >= 2) {
      this.updateStatus(WEBHOOK_STATUS.WARNING);
    }

    // Log error to Supabase
    this.logError(errorType, message, payload);

    // Notify error handlers
    this.errorHandlers.forEach(handler => {
      try {
        handler(this.lastError);
      } catch (err) {
        console.error('Error in error handler:', err);
      }
    });

    // Retry logic
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      setTimeout(() => {
        this.checkWebhookHealth();
      }, Math.pow(2, this.retryCount) * 1000); // Exponential backoff
    }
  }

  // Update webhook status
  updateStatus(newStatus) {
    if (this.status !== newStatus) {
      const oldStatus = this.status;
      this.status = newStatus;
      
      console.log(`Webhook status changed: ${oldStatus} -> ${newStatus}`);
      
      // Log status change to Supabase
      this.logStatusChange(oldStatus, newStatus);
    }
  }

  // Log error to Supabase
  async logError(errorType, message, payload) {
    try {
      const { error } = await supabase
        .from('webhook_errors')
        .insert({
          error_type: errorType,
          message,
          payload: payload ? JSON.stringify(payload) : null,
          timestamp: new Date().toISOString(),
          retry_count: this.retryCount
        });

      if (error) {
        console.error('Failed to log error to Supabase:', error);
      }
    } catch (err) {
      console.error('Error logging to Supabase:', err);
    }
  }

  // Log status change to Supabase
  async logStatusChange(oldStatus, newStatus) {
    try {
      const { error } = await supabase
        .from('webhook_status_log')
        .insert({
          old_status: oldStatus,
          new_status: newStatus,
          timestamp: new Date().toISOString(),
          error_count: this.errorCount
        });

      if (error) {
        console.error('Failed to log status change to Supabase:', error);
      }
    } catch (err) {
      console.error('Error logging status change to Supabase:', err);
    }
  }

  // Add error handler
  addErrorHandler(handler) {
    this.errorHandlers.push(handler);
  }

  // Remove error handler
  removeErrorHandler(handler) {
    this.errorHandlers = this.errorHandlers.filter(h => h !== handler);
  }

  // Get current status
  getStatus() {
    return {
      status: this.status,
      lastHeartbeat: this.lastHeartbeat,
      errorCount: this.errorCount,
      lastError: this.lastError,
      retryCount: this.retryCount
    };
  }

  // Process incoming webhook payload
  async processWebhook(payload) {
    try {
      // Validate payload structure
      if (!this.validatePayload(payload)) {
        throw new Error('Invalid webhook payload structure');
      }

      // Extract order data
      const orderData = this.extractOrderData(payload);
      
      // Save to Supabase
      await this.saveOrderData(orderData);
      
      // Reset error count on successful processing
      this.errorCount = 0;
      this.retryCount = 0;
      
      console.log('Webhook processed successfully:', orderData.order_id);
      
    } catch (error) {
      console.error('Error processing webhook:', error);
      this.handleError(ERROR_TYPES.PROCESSING_ERROR, error.message, payload);
    }
  }

  // Validate webhook payload
  validatePayload(payload) {
    const requiredFields = ['order_id', 'store_id', 'platform', 'total_amount'];
    
    if (!payload || typeof payload !== 'object') {
      return false;
    }

    return requiredFields.every(field => payload.hasOwnProperty(field));
  }

  // Extract order data from webhook payload
  extractOrderData(payload) {
    return {
      order_id: payload.order_id,
      store_id: payload.store_id,
      platform: payload.platform,
      total_amount: parseFloat(payload.total_amount) || 0,
      currency: payload.currency || 'GBP',
      order_date: payload.order_date || new Date().toISOString(),
      customer_name: payload.customer_name || null,
      items: payload.items || [],
      delivery_fee: parseFloat(payload.delivery_fee) || 0,
      service_fee: parseFloat(payload.service_fee) || 0,
      tax_amount: parseFloat(payload.tax_amount) || 0,
      status: payload.status || 'confirmed'
    };
  }

  // Save order data to Supabase
  async saveOrderData(orderData) {
    try {
      const { error } = await supabase
        .from('live_orders_feed')
        .insert([orderData]);

      if (error) {
        throw new Error(`Failed to save order data: ${error.message}`);
      }
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

// Create global webhook monitor instance
export const webhookMonitor = new WebhookMonitor();

// Export utility functions
export const startWebhookMonitoring = () => {
  webhookMonitor.startMonitoring();
};

export const stopWebhookMonitoring = () => {
  webhookMonitor.stopMonitoring();
};

export const getWebhookStatus = () => {
  return webhookMonitor.getStatus();
};

export const addWebhookErrorHandler = (handler) => {
  webhookMonitor.addErrorHandler(handler);
};

export const removeWebhookErrorHandler = (handler) => {
  webhookMonitor.removeErrorHandler(handler);
};
