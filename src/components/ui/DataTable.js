/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  searchable = true,
  sortable = true,
  onRowClick,
  className = '',
  emptyMessage = 'No data available',
  searchPlaceholder = 'Search...'
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key) => {
    if (!sortable) return;
    
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const getFilteredData = () => {
    if (!searchTerm) return getSortedData();

    return getSortedData().filter(item =>
      columns.some(column => {
        const value = item[column.key];
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  };

  const renderCell = (item, column) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }
    return item[column.key];
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  if (loading) {
    return (
      <div className={`data-table ${className}`}>
        <div className="data-table-skeleton">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="data-table-skeleton-row">
              {columns.map((_, colIndex) => (
                <div key={colIndex} className="data-table-skeleton-cell">
                  <div className="skeleton-line"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const filteredData = getFilteredData();

  return (
    <div className={`data-table ${className}`}>
      {searchable && (
        <div className="data-table-search">
          <div className="search-input-container">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      )}

      <div className="data-table-container">
        <table className="data-table-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`data-table-header ${sortable ? 'sortable' : ''}`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="header-content">
                    <span>{column.title}</span>
                    {sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="data-table-empty">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr
                  key={item.id || index}
                  className={`data-table-row ${onRowClick ? 'clickable' : ''}`}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="data-table-cell">
                      {renderCell(item, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
