import React, { useState } from 'react';
import MetricsCards from '../components/MetricsCards';
import FilterBar from '../components/ui/FilterBar';

const OverviewPage = ({ 
  dashboardData = {}, 
  topProducts = [],
  loading = false 
}) => {
  const [filters, setFilters] = useState({});

  return (
    <div className="overview-page">
      <div className="overview-header">
        <h1>Overview</h1>
        <p>Key performance indicators and business insights</p>
      </div>

      {/* Filter Bar */}
      <section className="page-section">
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          onRefresh={() => window.location.reload()}
          loading={loading}
          showDateRange={true}
          showStoreFilter={true}
          showSearch={false}
          showRefresh={true}
          storeOptions={[
            { id: 'all', name: 'All Stores' },
            { id: 'central', name: 'Wing Shack Central' },
            { id: 'north', name: 'Wing Shack North' },
            { id: 'south', name: 'Wing Shack South' },
            { id: 'east', name: 'Wing Shack East' },
            { id: 'west', name: 'Wing Shack West' }
          ]}
        />
      </section>

      {/* KPI Cards Section */}
      <section className="kpi-section">
        <MetricsCards 
          data={dashboardData}
          loading={loading}
        />
      </section>
    </div>
  );
};

export default OverviewPage;
