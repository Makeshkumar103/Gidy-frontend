import React, { useEffect } from 'react';
import { X, Clipboard, Check } from 'lucide-react';

export default function LogInspector({ log, onClose }) {
  const [copied, setCopied] = React.useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!log) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityStyle = (severity) => {
    const s = String(severity).toUpperCase();
    if (s === 'CRITICAL') return { color: 'var(--severity-critical)', fontWeight: 'bold' };
    if (s === 'HIGH') return { color: 'var(--severity-high)', fontWeight: 'bold' };
    if (s === 'MEDIUM') return { color: 'var(--severity-medium)', fontWeight: 'bold' };
    return { color: 'var(--severity-low)', fontWeight: 'bold' };
  };

  const getStatusStyle = (status) => {
    return String(status).toLowerCase() === 'resolved' 
      ? { color: 'var(--status-resolved)', fontWeight: 'bold' }
      : { color: 'var(--status-unresolved)', fontWeight: 'bold' };
  };

  return (
    <div className="inspector-overlay" onClick={onClose}>
      <div className="inspector-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="inspector-header">
          <h2 className="inspector-title">Log Details</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="inspector-body">
          <div className="inspector-grid">
            <div className="inspector-field">
              <span className="inspector-label">Actor</span>
              <span className="inspector-value" style={{ fontWeight: '500' }}>{log.actor}</span>
            </div>

            <div className="inspector-field">
              <span className="inspector-label">Role</span>
              <span className="inspector-value">{log.role}</span>
            </div>

            <div className="inspector-field">
              <span className="inspector-label">Action</span>
              <span className="inspector-value" style={{ fontFamily: 'monospace', background: 'var(--bg-tertiary)', padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--border-color)', display: 'inline-block', width: 'fit-content' }}>
                {log.action}
              </span>
            </div>

            <div className="inspector-field">
              <span className="inspector-label">Resource Type</span>
              <span className="inspector-value">{log.resourceType}</span>
            </div>

            <div className="inspector-field">
              <span className="inspector-label">Resource URI</span>
              <span className="inspector-value" style={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '13px' }}>{log.resource}</span>
            </div>

            <div className="inspector-field">
              <span className="inspector-label">IP Address</span>
              <span className="inspector-value"><code>{log.ipAddress}</code></span>
            </div>

            <div className="inspector-field">
              <span className="inspector-label">Region</span>
              <span className="inspector-value"><code>{log.region}</code></span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="inspector-field">
                <span className="inspector-label">Severity</span>
                <span className="inspector-value" style={getSeverityStyle(log.severity)}>
                  {log.severity}
                </span>
              </div>

              <div className="inspector-field">
                <span className="inspector-label">Status</span>
                <span className="inspector-value" style={getStatusStyle(log.status)}>
                  {log.status}
                </span>
              </div>
            </div>

            <div className="inspector-field">
              <span className="inspector-label">Timestamp</span>
              <span className="inspector-value">{new Date(log.timestamp).toString()}</span>
            </div>
          </div>

          <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="inspector-label" style={{ flex: 1 }}>Raw JSON Document</span>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '4px 8px', fontSize: '12px' }}
                onClick={copyToClipboard}
              >
                {copied ? <Check size={14} style={{ color: 'var(--status-resolved)' }} /> : <Clipboard size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="json-code-block">
              {JSON.stringify(log, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
