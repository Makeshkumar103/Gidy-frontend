import React from 'react';
import { 
  Database, 
  AlertTriangle, 
  Clock, 
  Globe 
} from 'lucide-react';

export default function DashboardStats({ stats = {}, facets = {} }) {
  const totalLogs = stats.totalLogs || 0;
  const unresolvedLogs = stats.unresolvedLogs || 0;
  const criticalOrHighLogs = stats.criticalOrHighLogs || 0;
  const uniqueRegions = facets.regions ? facets.regions.length : 0;

  // Format numbers nicely
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="stats-grid">
      <div className="stat-card glass-panel">
        <div className="stat-info">
          <span className="stat-label">Total Logs</span>
          <span className="stat-value">{formatNumber(totalLogs)}</span>
        </div>
        <div className="stat-icon-wrapper">
          <Database size={22} />
        </div>
      </div>

      <div className="stat-card stat-unresolved glass-panel">
        <div className="stat-info">
          <span className="stat-label">Unresolved Logs</span>
          <span className="stat-value">{formatNumber(unresolvedLogs)}</span>
        </div>
        <div className="stat-icon-wrapper">
          <Clock size={22} />
        </div>
      </div>

      <div className="stat-card stat-critical glass-panel">
        <div className="stat-info">
          <span className="stat-label">Critical & High</span>
          <span className="stat-value">{formatNumber(criticalOrHighLogs)}</span>
        </div>
        <div className="stat-icon-wrapper">
          <AlertTriangle size={22} />
        </div>
      </div>

      <div className="stat-card stat-regions glass-panel">
        <div className="stat-info">
          <span className="stat-label">Active Regions</span>
          <span className="stat-value">{uniqueRegions}</span>
        </div>
        <div className="stat-icon-wrapper">
          <Globe size={22} />
        </div>
      </div>
    </div>
  );
}
