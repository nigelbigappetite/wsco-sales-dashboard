import React, { useState, useMemo } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';

const StoreSelector = ({ 
  stores = [], 
  selectedStores = [], 
  onSelectionChange, 
  placeholder = "Select stores...",
  maxHeight = 200 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter stores based on search term
  const filteredStores = useMemo(() => {
    if (!searchTerm) return stores;
    return stores.filter(store => 
      store.store_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.store_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stores, searchTerm]);

  const handleToggleStore = (storeId) => {
    const newSelection = selectedStores.includes(storeId)
      ? selectedStores.filter(id => id !== storeId)
      : [...selectedStores, storeId];
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    const allStoreIds = filteredStores.map(store => store.store_id);
    const newSelection = allStoreIds.every(id => selectedStores.includes(id))
      ? selectedStores.filter(id => !allStoreIds.includes(id))
      : [...new Set([...selectedStores, ...allStoreIds])];
    onSelectionChange(newSelection);
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const getSelectedStoreNames = () => {
    if (selectedStores.length === 0) return placeholder;
    if (selectedStores.length === 1) {
      const store = stores.find(s => s.store_id === selectedStores[0]);
      return store?.store_name || 'Unknown Store';
    }
    return `${selectedStores.length} stores selected`;
  };

  const isAllSelected = filteredStores.length > 0 && 
    filteredStores.every(store => selectedStores.includes(store.store_id));

  return (
    <div className="store-selector">
      <div 
        className={`store-selector-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="store-selector-value">
          {getSelectedStoreNames()}
        </div>
        <div className="store-selector-actions">
          {selectedStores.length > 0 && (
            <button
              className="clear-button"
              onClick={(e) => {
                e.stopPropagation();
                handleClearAll();
              }}
            >
              <X size={16} />
            </button>
          )}
          <ChevronDown 
            size={16} 
            className={`chevron ${isOpen ? 'rotated' : ''}`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="store-selector-dropdown">
          <div className="store-selector-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search stores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="store-search-input"
            />
          </div>

          <div className="store-selector-actions-bar">
            <button
              className="action-button select-all"
              onClick={handleSelectAll}
            >
              <Check size={14} />
              {isAllSelected ? 'Deselect All' : 'Select All'}
            </button>
            <button
              className="action-button clear-all"
              onClick={handleClearAll}
            >
              <X size={14} />
              Clear All
            </button>
          </div>

          <div className="store-selector-list" style={{ maxHeight }}>
            {filteredStores.length === 0 ? (
              <div className="no-stores">
                {searchTerm ? 'No stores found' : 'No stores available'}
              </div>
            ) : (
              filteredStores.map(store => {
                const isSelected = selectedStores.includes(store.store_id);
                return (
                  <div
                    key={store.store_id}
                    className={`store-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleToggleStore(store.store_id)}
                  >
                    <div className="store-option-content">
                      <div className="store-name">{store.store_name}</div>
                      <div className="store-details">
                        {store.is_franchise ? 'Franchise' : 'Corporate'}
                        {store.active ? ' • Active' : ' • Inactive'}
                      </div>
                    </div>
                    <div className="store-option-checkbox">
                      {isSelected && <Check size={16} />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreSelector;
