import React from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye
} from 'lucide-react';

export default function LogsTable({
  logs = [],
  total = 0,
  page = 1,
  limit = 50,
  sortBy = 'timestamp',
  sortOrder = 'desc',
  setPage,
  setLimit,
  setSort,
  onSelectLog
}) {
  const totalPages = Math.ceil(total / limit) || 1;

  const handleSort = (field) => {
    if (sortBy === field) {
      setSort(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(field, 'desc');
    }
  };

  const renderSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? (
      <ChevronUp size={14} className="sort-icon-inline" />
    ) : (
      <ChevronDown size={14} className="sort-icon-inline" />
    );
  };

  const getSeverityClass = (sev) => {
    const s = String(sev).toUpperCase();
    if (s === 'CRITICAL') return 'badge-critical';
    if (s === 'HIGH') return 'badge-high';
    if (s === 'MEDIUM') return 'badge-medium';
    return 'badge-low';
  };

  const getStatusClass = (status) => {
    return String(status).toLowerCase() === 'resolved' ? 'badge-resolved' : 'badge-unresolved';
  };

  const formatTimestamp = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString();
    } catch {
      return dateStr;
    }
  };

  // Generate pagination page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="logs-section">
      <div className="table-container">
        <table className="logs-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort('actor')}>
                Actor {renderSortIcon('actor')}
              </th>
              <th>Role</th>
              <th className="sortable" onClick={() => handleSort('action')}>
                Action {renderSortIcon('action')}
              </th>
              <th>Resource</th>
              <th className="sortable" onClick={() => handleSort('region')}>
                Region {renderSortIcon('region')}
              </th>
              <th className="sortable" onClick={() => handleSort('severity')}>
                Severity {renderSortIcon('severity')}
              </th>
              <th className="sortable" onClick={() => handleSort('status')}>
                Status {renderSortIcon('status')}
              </th>
              <th className="sortable" onClick={() => handleSort('timestamp')}>
                Timestamp {renderSortIcon('timestamp')}
              </th>
              <th style={{ width: '60px', textAlign: 'center' }}>Inspect</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No logs found matching the filter criteria.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} onClick={() => onSelectLog(log)}>
                  <td>{log.actor}</td>
                  <td>
                    <span style={{ opacity: 0.8, fontSize: '13px' }}>{log.role}</span>
                  </td>
                  <td style={{ fontWeight: '500' }}>{log.action}</td>
                  <td title={log.resource}>{log.resource}</td>
                  <td><code>{log.region}</code></td>
                  <td>
                    <span className={`badge ${getSeverityClass(log.severity)}`}>
                      <span className="badge-dot" />
                      {log.severity}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusClass(log.status)}`}>
                      <span className="badge-dot" />
                      {log.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {formatTimestamp(log.timestamp)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }} onClick={(e) => {
                    e.stopPropagation();
                    onSelectLog(log);
                  }}>
                    <button className="btn" style={{ padding: '4px 8px', background: 'transparent', border: 'none', color: 'var(--accent-blue)' }}>
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="pagination-container">
        <div className="pagination-info">
          Showing <strong>{logs.length > 0 ? (page - 1) * limit + 1 : 0}</strong> to{' '}
          <strong>{Math.min(page * limit, total)}</strong> of <strong>{total}</strong> results
        </div>

        <div className="pagination-controls">
          {/* Limit selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '16px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Per page:</span>
            <select
              className="select-field"
              style={{ padding: '4px 8px', fontSize: '13px' }}
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value));
                setPage(1);
              }}
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="500">500</option>
            </select>
          </div>

          <button
            className="pagination-btn"
            disabled={page === 1}
            onClick={() => setPage(1)}
            title="First page"
          >
            <ChevronsLeft size={16} />
          </button>
          
          <button
            className="pagination-btn"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            title="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {getPageNumbers().map((p) => (
            <button
              key={p}
              className="pagination-btn"
              style={{
                borderColor: page === p ? 'var(--accent-blue)' : 'var(--border-color)',
                background: page === p ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-secondary)',
                color: page === p ? 'var(--accent-blue)' : 'var(--text-primary)'
              }}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}

          <button
            className="pagination-btn"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            title="Next page"
          >
            <ChevronRight size={16} />
          </button>

          <button
            className="pagination-btn"
            disabled={page === totalPages}
            onClick={() => setPage(totalPages)}
            title="Last page"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
