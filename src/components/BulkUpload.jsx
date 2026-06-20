import React, { useState, useRef } from 'react';
import { UploadCloud, X, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function BulkUpload({ onClose, onUploadSuccess, backendUrl }) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const processFile = (file) => {
    if (file.type !== "application/json" && !file.name.endsWith('.json')) {
      setError("Please upload a valid JSON file.");
      return;
    }

    setLoading(true);
    setError(null);
    setStats(null);
    setProgress(15);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        setProgress(35);
        const text = e.target.result;
        const logs = JSON.parse(text);

        if (!Array.isArray(logs)) {
          throw new Error("JSON file root must be an array of audit logs.");
        }

        setProgress(50);
        
        // Upload to API
        const response = await fetch(`${backendUrl}/api/logs/bulk`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(logs)
        });

        setProgress(85);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.details || data.error || "Failed to upload logs to the server.");
        }

        setProgress(100);
        setStats({
          count: data.count,
          duration: data.durationMs,
          message: data.message
        });
        setLoading(false);
        if (onUploadSuccess) onUploadSuccess();
      } catch (err) {
        console.error(err);
        setError(err.message || "An error occurred while parsing or uploading the file.");
        setLoading(false);
        setProgress(0);
      }
    };

    reader.onerror = () => {
      setError("Failed to read file.");
      setLoading(false);
      setProgress(0);
    };

    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Bulk Upload Audit Logs</h2>
          <button className="modal-close" onClick={onClose} disabled={loading}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {!stats && (
            <div 
              className={`upload-dropzone ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={onButtonClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="file-input"
                accept=".json"
                onChange={handleChange}
                disabled={loading}
              />
              <div className="upload-icon-circle">
                <UploadCloud size={28} />
              </div>
              <p>Drag and drop your audit logs JSON file here, or click to browse</p>
              <span>Accepts JSON file containing an array of records (up to 10,000+ logs)</span>
            </div>
          )}

          {loading && (
            <div className="upload-status-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span>Uploading and parsing logs...</span>
                <span>{progress}%</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '2px' }}>Upload Failed</strong>
                <span style={{ fontSize: '13px' }}>{error}</span>
              </div>
            </div>
          )}

          {stats && (
            <div style={{ display: 'flex', flexDirectory: 'column', flexDirection: 'column', gap: '20px' }}>
              <div className="alert alert-success">
                <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', marginBottom: '2px' }}>Logs Imported Successfully</strong>
                  <span style={{ fontSize: '13px' }}>{stats.message}</span>
                </div>
              </div>

              <div className="upload-status-card">
                <div className="upload-stats-summary">
                  <div className="upload-stat-item">
                    <span className="upload-stat-lbl">Record Count</span>
                    <span className="upload-stat-val">{stats.count.toLocaleString()} logs</span>
                  </div>
                  <div className="upload-stat-item">
                    <span className="upload-stat-lbl">Ingestion Time</span>
                    <span className="upload-stat-val">{stats.duration} ms</span>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary" onClick={onClose}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
