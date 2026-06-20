import React from 'react';

export default function Charts({ facets = {} }) {
  const severities = facets.severities || [];
  const actions = facets.actions || [];

  // 1. Process Severity Data
  const severityColors = {
    CRITICAL: 'var(--severity-critical)',
    HIGH: 'var(--severity-high)',
    MEDIUM: 'var(--severity-medium)',
    LOW: 'var(--severity-low)',
  };

  const severityOrder = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  
  // Clean severity list matching order
  const severityData = severityOrder
    .map(name => {
      const found = severities.find(s => String(s._id).toUpperCase() === name);
      return {
        name,
        count: found ? found.count : 0,
        color: severityColors[name]
      };
    })
    .filter(item => item.count > 0);

  const totalSeverityCount = severityData.reduce((acc, curr) => acc + curr.count, 0);

  // 2. Process Top Actions Data (top 5)
  const topActions = [...actions]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  const maxActionCount = topActions.length > 0 ? Math.max(...topActions.map(a => a.count)) : 1;

  // Donut chart calculations
  let accumulatedPercent = 0;
  const donutRadius = 50;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * donutRadius;

  return (
    <div className="viz-panel">
      {/* Donut Chart */}
      <div className="chart-card glass-panel">
        <div className="chart-header">
          <h3 className="chart-title">Severity Distribution</h3>
        </div>
        <div className="chart-container">
          {totalSeverityCount === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No severity data available.</div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '150px', height: '150px' }}>
                <svg width="100%" height="100%" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="70"
                    cy="70"
                    r={donutRadius}
                    fill="transparent"
                    stroke="var(--bg-tertiary)"
                    strokeWidth={strokeWidth}
                  />
                  {severityData.map((item, idx) => {
                    const percent = item.count / totalSeverityCount;
                    const strokeDashoffset = circumference - (percent * circumference);
                    const strokeDasharray = `${circumference} ${circumference}`;
                    const rotationOffset = (accumulatedPercent * 360);
                    accumulatedPercent += percent;

                    return (
                      <circle
                        key={item.name}
                        cx="70"
                        cy="70"
                        r={donutRadius}
                        fill="transparent"
                        stroke={item.color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        style={{
                          transform: `rotate(${rotationOffset}deg)`,
                          transformOrigin: '70px 70px',
                          transition: 'stroke-dashoffset 0.5s ease',
                          strokeLinecap: percent > 0.02 ? 'round' : 'butt'
                        }}
                      />
                    );
                  })}
                </svg>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none'
                }}>
                  <span style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'var(--font-display)' }}>
                    {totalSeverityCount.toLocaleString()}
                  </span>
                  <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Logs</span>
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minWidth: '150px' }}>
                {severityData.map(item => {
                  const percent = ((item.count / totalSeverityCount) * 100).toFixed(1);
                  return (
                    <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                        <span style={{ fontWeight: '500' }}>{item.name}</span>
                      </div>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {item.count.toLocaleString()} ({percent}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="chart-card glass-panel">
        <div className="chart-header">
          <h3 className="chart-title">Top 5 Action Events</h3>
        </div>
        <div className="chart-container">
          {topActions.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No action event data available.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '14px', justifyContent: 'center' }}>
              {topActions.map((item, idx) => {
                const widthPercent = (item.count / maxActionCount) * 100;
                return (
                  <div key={item._id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: '500', color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '280px' }} title={item._id}>
                        {item._id}
                      </span>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>
                        {item.count.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      <div
                        style={{
                          width: `${widthPercent}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))',
                          borderRadius: '4px',
                          transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
