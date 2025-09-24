import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_ANALYTICS_API_URL || 'https://yhuxzdqwxzsepfkjjoan.supabase.co/functions/v1/analytics';
const ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlodXh6ZHF3eHpzZXBma2pqb2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NTc0OTcsImV4cCI6MjA3MzMzMzQ5N30.dYDkNRH7crw8-p4BRwRBCGeRDpZWgrGbxuFh7Eq3Ooc';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${ANON_KEY}`,
    'Content-Type': 'application/json',
  },
});

// API Functions
export const fetchDashboardData = async (period = '30', storeId = 'all') => {
  try {
    const params = new URLSearchParams({
      endpoint: 'dashboard-summary',
      period: period,
    });
    
    if (storeId !== 'all') {
      params.append('store_id', storeId);
    }

    const response = await api.get(`?${params}`);
    return {
      ...response.data.data,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Return fallback data if API fails
    return {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      activeStores: 0,
      lastUpdated: new Date().toISOString(),
      error: 'Unable to load live data'
    };
  }
};

export const fetchDailySales = async (days = 30, storeId = 'all') => {
  try {
    const params = new URLSearchParams({
      endpoint: 'daily-sales',
      days: days.toString(),
    });
    
    if (storeId !== 'all') {
      params.append('store_id', storeId);
    }

    const response = await api.get(`?${params}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching daily sales:', error);
    return [];
  }
};

export const fetchWeeklySales = async (weeks = 12, storeId = 'all') => {
  try {
    const params = new URLSearchParams({
      endpoint: 'weekly-sales',
      weeks: weeks.toString(),
    });
    
    if (storeId !== 'all') {
      params.append('store_id', storeId);
    }

    const response = await api.get(`?${params}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching weekly sales:', error);
    return [];
  }
};

export const fetchMonthlySales = async (months = 12, storeId = 'all') => {
  try {
    const params = new URLSearchParams({
      endpoint: 'monthly-sales',
      months: months.toString(),
    });
    
    if (storeId !== 'all') {
      params.append('store_id', storeId);
    }

    const response = await api.get(`?${params}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching monthly sales:', error);
    return [];
  }
};

export const fetchStorePerformance = async () => {
  try {
    const response = await api.get('?endpoint=store-performance');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching store performance:', error);
    return [];
  }
};

export const fetchTopProducts = async (limit = 20, storeId = 'all') => {
  try {
    const params = new URLSearchParams({
      endpoint: 'top-products',
      limit: limit.toString(),
    });
    
    if (storeId !== 'all') {
      params.append('store_id', storeId);
    }

    const response = await api.get(`?${params}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching top products:', error);
    return [];
  }
};

export const fetchCustomerAnalytics = async (limit = 50, storeId = 'all') => {
  try {
    const params = new URLSearchParams({
      endpoint: 'customer-analytics',
      limit: limit.toString(),
    });
    
    if (storeId !== 'all') {
      params.append('store_id', storeId);
    }

    const response = await api.get(`?${params}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching customer analytics:', error);
    return [];
  }
};

export const fetchDirectOperations = async () => {
  try {
    const response = await api.get('?endpoint=fetch-direct-ops');
    return response.data.data || null;
  } catch (error) {
    console.error('Error fetching direct operations data:', error);
    // Return fallback data if API fails
    return {
      locations: [],
      lastUpdated: new Date().toISOString(),
      error: 'Unable to load direct operations data'
    };
  }
};

// Utility function to format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
};

// Utility function to format numbers
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-GB').format(num);
};

// Utility function to format percentage
export const formatPercentage = (num) => {
  return `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;
};
