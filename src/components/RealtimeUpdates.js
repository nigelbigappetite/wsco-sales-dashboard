import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Wifi, WifiOff, RefreshCw, Bell, BellOff, Activity } from 'lucide-react';

const RealtimeUpdates = ({ 
  onDataUpdate, 
  onConnectionStatusChange,
  enabled = true,
  refreshInterval = 30000 // 30 seconds default
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [updateCount, setUpdateCount] = useState(0);
  const [connectionError, setConnectionError] = useState(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  
  const wsRef = useRef(null);
  const intervalRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // WebSocket connection management
  const connectWebSocket = useCallback(() => {
    if (!isEnabled) return;

    try {
      // For now, we'll simulate WebSocket connection
      // In production, replace with actual WebSocket URL
      // const wsUrl = process.env.REACT_APP_WEBSOCKET_URL || 'wss://your-websocket-url.com';
      
      // Simulate WebSocket connection for demo
      const mockConnection = {
        readyState: 1, // WebSocket.OPEN
        send: (data) => console.log('WebSocket send:', data),
        close: () => console.log('WebSocket closed'),
        addEventListener: (event, callback) => {
          if (event === 'open') {
            setTimeout(() => callback(), 100);
          } else if (event === 'message') {
            // Simulate receiving data every 30 seconds
            const messageInterval = setInterval(() => {
              const mockData = {
                type: 'dashboard_update',
                timestamp: new Date().toISOString(),
                data: {
                  total_revenue_gbp: Math.floor(Math.random() * 10000) + 50000,
                  total_orders: Math.floor(Math.random() * 1000) + 2000,
                  avg_order_value_gbp: Math.floor(Math.random() * 20) + 15,
                  unique_stores: Math.floor(Math.random() * 5) + 8
                }
              };
              callback({ data: JSON.stringify(mockData) });
            }, refreshInterval);
            
            // Store interval reference for cleanup
            wsRef.current.messageInterval = messageInterval;
          } else if (event === 'close') {
            // Handle close event
          } else if (event === 'error') {
            // Handle error event
          }
        }
      };

      wsRef.current = mockConnection;
      setIsConnected(true);
      setConnectionError(null);
      reconnectAttempts.current = 0;
      
      // Set up message handler
      wsRef.current.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'dashboard_update') {
            setLastUpdate(new Date());
            setUpdateCount(prev => prev + 1);
            onDataUpdate(data.data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      wsRef.current.addEventListener('close', () => {
        setIsConnected(false);
        attemptReconnect();
      });

      wsRef.current.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection error');
        setIsConnected(false);
      });

    } catch (error) {
      console.error('WebSocket connection failed:', error);
      setConnectionError('Failed to connect');
      setIsConnected(false);
      attemptReconnect();
    }
  }, [isEnabled, refreshInterval, onDataUpdate]);

  // Fallback polling when WebSocket is not available
  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(async () => {
      try {
        // Simulate API call for real-time data
        const mockData = {
          total_revenue_gbp: Math.floor(Math.random() * 10000) + 50000,
          total_orders: Math.floor(Math.random() * 1000) + 2000,
          avg_order_value_gbp: Math.floor(Math.random() * 20) + 15,
          unique_stores: Math.floor(Math.random() * 5) + 8,
          lastUpdated: new Date().toISOString()
        };
        
        setLastUpdate(new Date());
        setUpdateCount(prev => prev + 1);
        onDataUpdate(mockData);
      } catch (error) {
        console.error('Polling error:', error);
        setConnectionError('Polling failed');
      }
    }, refreshInterval);
  }, [refreshInterval, onDataUpdate]);

  // Reconnection logic
  const attemptReconnect = useCallback(() => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      console.log('Max reconnection attempts reached, falling back to polling');
      startPolling();
      return;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
    reconnectAttempts.current += 1;
    setIsReconnecting(true);

    reconnectTimeoutRef.current = setTimeout(() => {
      console.log(`Reconnection attempt ${reconnectAttempts.current}`);
      connectWebSocket();
      setIsReconnecting(false);
    }, delay);
  }, [connectWebSocket, startPolling, maxReconnectAttempts]);

  // Connection status management
  useEffect(() => {
    onConnectionStatusChange(isConnected);
  }, [isConnected, onConnectionStatusChange]);

  // Initialize connection
  useEffect(() => {
    if (isEnabled) {
      connectWebSocket();
    } else {
      // Clean up when disabled
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsConnected(false);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [isEnabled, connectWebSocket]);

  // Manual refresh
  const handleManualRefresh = useCallback(() => {
    if (isConnected && wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: 'refresh_request' }));
    } else {
      // Fallback to polling refresh
      const mockData = {
        total_revenue_gbp: Math.floor(Math.random() * 10000) + 50000,
        total_orders: Math.floor(Math.random() * 1000) + 2000,
        avg_order_value_gbp: Math.floor(Math.random() * 20) + 15,
        unique_stores: Math.floor(Math.random() * 5) + 8,
        lastUpdated: new Date().toISOString()
      };
      
      setLastUpdate(new Date());
      setUpdateCount(prev => prev + 1);
      onDataUpdate(mockData);
    }
  }, [isConnected, onDataUpdate]);

  const toggleRealtime = () => {
    setIsEnabled(!isEnabled);
  };

  const formatLastUpdate = (timestamp) => {
    if (!timestamp) return 'Never';
    const now = new Date();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="realtime-updates">
      <div className="realtime-header">
        <div className="realtime-title">
          <Activity size={20} />
          <span>Real-time Updates</span>
        </div>
        <div className="realtime-controls">
          <button
            className={`realtime-button ${isEnabled ? 'active' : ''}`}
            onClick={toggleRealtime}
            title={isEnabled ? 'Disable real-time updates' : 'Enable real-time updates'}
          >
            {isEnabled ? <Bell size={16} /> : <BellOff size={16} />}
            {isEnabled ? 'Enabled' : 'Disabled'}
          </button>
          
          <button
            className="realtime-button refresh"
            onClick={handleManualRefresh}
            disabled={!isEnabled}
            title="Manual refresh"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="realtime-status">
        <div className="status-item">
          <div className="status-label">Connection:</div>
          <div className={`status-value ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? (
              <>
                <Wifi size={16} />
                Connected
              </>
            ) : (
              <>
                <WifiOff size={16} />
                {isReconnecting ? 'Reconnecting...' : 'Disconnected'}
              </>
            )}
          </div>
        </div>

        <div className="status-item">
          <div className="status-label">Last Update:</div>
          <div className="status-value">
            {formatLastUpdate(lastUpdate)}
          </div>
        </div>

        <div className="status-item">
          <div className="status-label">Updates:</div>
          <div className="status-value">
            {updateCount}
          </div>
        </div>

        {connectionError && (
          <div className="status-item error">
            <div className="status-label">Error:</div>
            <div className="status-value error">
              {connectionError}
            </div>
          </div>
        )}
      </div>

      {isEnabled && !isConnected && !isReconnecting && (
        <div className="realtime-fallback">
          <p>WebSocket connection unavailable. Using polling fallback.</p>
        </div>
      )}
    </div>
  );
};

export default RealtimeUpdates;
