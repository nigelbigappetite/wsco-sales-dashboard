import React, { useState } from 'react';
import { Search, Filter, X, Calendar, Store, RefreshCw } from 'lucide-react';

const FilterBar = ({
  filters = {},
  onFiltersChange,
  onSearch,
  onRefresh,
  loading = false,
  className = '',
  showDateRange = true,
  showStoreFilter = true,
  showSearch = true,
  showRefresh = true,
  dateRangeOptions = [
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 90 days' },
    { value: '365', label: 'Last year' }
  ],
  storeOptions = [],
  searchPlaceholder = 'Search...'
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange && onFiltersChange(newFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch && onSearch(localFilters.search);
  };

  const clearFilters = () => {
    const clearedFilters = { ...localFilters, search: '' };
    setLocalFilters(clearedFilters);
    onFiltersChange && onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(value => 
    value !== undefined && value !== null && value !== ''
  );

  return (
    <div className={`filter-bar ${className}`}>
      <div className="filter-bar-main">
        <div className="filter-bar-left">
          {showSearch && (
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-container">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={localFilters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="search-input"
                />
              </div>
            </form>
          )}

          {showDateRange && (
            <div className="filter-group">
              <Calendar size={16} className="filter-icon" />
              <select
                value={localFilters.dateRange || '30'}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="filter-select"
              >
                {dateRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showStoreFilter && storeOptions.length > 0 && (
            <div className="filter-group">
              <Store size={16} className="filter-icon" />
              <select
                value={localFilters.storeId || 'all'}
                onChange={(e) => handleFilterChange('storeId', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Stores</option>
                {storeOptions.map(store => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="filter-bar-right">
          {showRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="refresh-button"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          )}

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`advanced-button ${showAdvanced ? 'active' : ''}`}
          >
            <Filter size={16} />
            Advanced
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="clear-button"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>
      </div>

      {showAdvanced && (
        <div className="filter-bar-advanced">
          <div className="advanced-filters">
            <div className="filter-group">
              <label className="filter-label">Status:</label>
              <select
                value={localFilters.status || 'all'}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Platform:</label>
              <select
                value={localFilters.platform || 'all'}
                onChange={(e) => handleFilterChange('platform', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Platforms</option>
                <option value="deliveroo">Deliveroo</option>
                <option value="slerp">Slerp</option>
                <option value="web">Web</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Order Type:</label>
              <select
                value={localFilters.orderType || 'all'}
                onChange={(e) => handleFilterChange('orderType', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Types</option>
                <option value="PICKUP">Pickup</option>
                <option value="DELIVERY">Delivery</option>
                <option value="DINE_IN">Dine In</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
