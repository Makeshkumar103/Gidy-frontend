import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

export default function FiltersBar({
  search,
  setSearch,
  filters,
  setFilters,
  facets = {},
  onReset
}) {
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const severityOptions = facets.severities || [];
  const statusOptions = facets.statuses || [];
  const regionOptions = facets.regions || [];
  const actionOptions = facets.actions || [];
  const roleOptions = facets.roles || [];
  const resourceTypeOptions = facets.resourceTypes || [];

  return (
    <div className="filters-panel glass-panel">
      <div className="filters-row-primary">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="input-field"
            placeholder="Search by actor, action, resource, or IP address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-secondary" onClick={onReset} title="Reset all filters">
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <div className="filters-grid">
        {/* Severity Filter */}
        <div className="filter-group">
          <label className="filter-label">Severity</label>
          <select
            className="select-field"
            value={filters.severity || ''}
            onChange={(e) => handleFilterChange('severity', e.target.value)}
          >
            <option value="">All Severities</option>
            {severityOptions.map(opt => (
              <option key={opt._id} value={opt._id}>
                {opt._id} ({opt.count})
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select
            className="select-field"
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            {statusOptions.map(opt => (
              <option key={opt._id} value={opt._id}>
                {opt._id} ({opt.count})
              </option>
            ))}
          </select>
        </div>

        {/* Region Filter */}
        <div className="filter-group">
          <label className="filter-label">Region</label>
          <select
            className="select-field"
            value={filters.region || ''}
            onChange={(e) => handleFilterChange('region', e.target.value)}
          >
            <option value="">All Regions</option>
            {regionOptions.map(opt => (
              <option key={opt._id} value={opt._id}>
                {opt._id} ({opt.count})
              </option>
            ))}
          </select>
        </div>

        {/* Action Filter */}
        <div className="filter-group">
          <label className="filter-label">Action</label>
          <select
            className="select-field"
            value={filters.action || ''}
            onChange={(e) => handleFilterChange('action', e.target.value)}
          >
            <option value="">All Actions</option>
            {actionOptions.map(opt => (
              <option key={opt._id} value={opt._id}>
                {opt._id} ({opt.count})
              </option>
            ))}
          </select>
        </div>

        {/* Role Filter */}
        <div className="filter-group">
          <label className="filter-label">Role</label>
          <select
            className="select-field"
            value={filters.role || ''}
            onChange={(e) => handleFilterChange('role', e.target.value)}
          >
            <option value="">All Roles</option>
            {roleOptions.map(opt => (
              <option key={opt._id} value={opt._id}>
                {opt._id} ({opt.count})
              </option>
            ))}
          </select>
        </div>

        {/* Resource Type Filter */}
        <div className="filter-group">
          <label className="filter-label">Resource Type</label>
          <select
            className="select-field"
            value={filters.resourceType || ''}
            onChange={(e) => handleFilterChange('resourceType', e.target.value)}
          >
            <option value="">All Types</option>
            {resourceTypeOptions.map(opt => (
              <option key={opt._id} value={opt._id}>
                {opt._id} ({opt.count})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
