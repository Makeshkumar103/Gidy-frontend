import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Upload, 
  Trash2, 
  Database,
  RefreshCw,
  Info
} from 'lucide-react';
import DashboardStats from './components/DashboardStats';
import FiltersBar from './components/FiltersBar';
import LogsTable from './components/LogsTable';
import LogInspector from './components/LogInspector';
import BulkUpload from './components/BulkUpload';
import Charts from './components/Charts';

const BACKEND_URL = 'http://localhost:5000';

const initialFilters = {
  severity: '',
  status: '',
  region: '',
  action: '',
  role: '',
  resourceType: ''
};

export default function App() {
  // Query States
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(initialFilters);

  // Data Aggregations & Status
  const [facets, setFacets] = useState({});
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI State
  const [selectedLog, setSelectedLog] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Fetch logs from backend
  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query string
      const params = new URLSearchParams({
        page,
        limit,
        sortBy,
        sortOrder,
        search
      });

      // Append active filters
      Object.entries(filters).forEach(([key, val]) => {
        if (val) {
          params.append(key, val);
        }
      });

      const response = await fetch(`${BACKEND_URL}/api/logs?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to connect to the log service.');
      }

      const data = await response.json();
      setLogs(data.logs || []);
      setTotal(data.total || 0);
      setFacets(data.facets || {});
      setStats(data.stats || {});
    } catch (err) {
      console.error(err);
      setError('Could not connect to the backend server. Make sure it is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search & dependency runner
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchLogs();
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [search, filters, page, limit, sortBy, sortOrder]);

  const handleResetFilters = () => {
    setSearch('');
    setFilters(initialFilters);
    setPage(1);
  };

  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to delete all audit logs? This action is irreversible.')) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/logs`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to clear logs.');
      }
      handleResetFilters();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  };

  return (
    <div className="app-container">
      {/* App Header */}
      <header className="app-header glass-panel glow-blue">
        <div className="header-title-group">
          <div className="header-logo">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h1>Gidy Audit Shield</h1>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>
              SecOps Investigation Hub
            </p>
          </div>
        </div>

        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => fetchLogs()} title="Refresh logs list">
            <RefreshCw size={15} />
            Refresh
          </button>
          <button className="btn btn-danger" onClick={handleClearLogs} disabled={stats.totalLogs === 0}>
            <Trash2 size={15} />
            Clear DB
          </button>
          <button className="btn btn-primary" onClick={() => setIsUploadOpen(true)}>
            <Upload size={15} />
            Bulk Upload
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <DashboardStats stats={stats} facets={facets} />

      {/* Visual Analytics */}
      {stats.totalLogs > 0 && <Charts facets={facets} />}

      {/* Filters Area */}
      <FiltersBar
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={(newFilters) => {
          setFilters(newFilters);
          setPage(1); // Reset page on filter edit
        }}
        facets={facets}
        onReset={handleResetFilters}
      />

      {/* Main Table / State Displays */}
      {error && (
        <div className="alert alert-error">
          <ShieldAlert size={20} style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ display: 'block', marginBottom: '2px' }}>System Alert</strong>
            <span style={{ fontSize: '13px' }}>{error}</span>
          </div>
        </div>
      )}

      {loading && logs.length === 0 ? (
        <div className="glass-panel loading-overlay">
          <div className="spinner spinner-large"></div>
          <span>Loading audit log repository...</span>
        </div>
      ) : stats.totalLogs === 0 ? (
        <div className="glass-panel empty-state">
          <div className="empty-state-icon">
            <Database size={48} />
          </div>
          <h2>No Audit Logs Ingested</h2>
          <p style={{ maxWidth: '400px', fontSize: '14px', lineHeight: '1.5' }}>
            The database is currently empty. Click the bulk upload button to import system audit log records (supporting up to 10,000+ files).
          </p>
          <button className="btn btn-primary" style={{ marginTop: '8px' }} onClick={() => setIsUploadOpen(true)}>
            <Upload size={15} />
            Import Log File
          </button>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          {loading && (
            <div style={{
              position: 'absolute',
              top: 0, right: 0, bottom: 0, left: 0,
              background: 'rgba(10, 14, 23, 0.4)',
              zIndex: 5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              backdropFilter: 'blur(2px)'
            }}>
              <div className="spinner"></div>
            </div>
          )}
          <LogsTable
            logs={logs}
            total={total}
            page={page}
            limit={limit}
            sortBy={sortBy}
            sortOrder={sortOrder}
            setPage={setPage}
            setLimit={setLimit}
            setSort={handleSort}
            onSelectLog={setSelectedLog}
          />
        </div>
      )}

      {/* Overlays / Drawers */}
      {selectedLog && (
        <LogInspector
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}

      {isUploadOpen && (
        <BulkUpload
          backendUrl={BACKEND_URL}
          onClose={() => setIsUploadOpen(false)}
          onUploadSuccess={() => {
            fetchLogs();
          }}
        />
      )}
    </div>
  );
}
