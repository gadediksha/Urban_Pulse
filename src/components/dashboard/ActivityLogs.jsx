import React from 'react';

export default function ActivityLogs({ logs }) {
  const getTypeColor = (type) => {
    switch (type) {
      case 'EMERGENCY': return '#ef4444';
      case 'WARN': return '#f59e0b';
      default: return '#38bdf8';
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>📜 System Activity Feed</h3>
        <span style={styles.feedTag}>LIVE TELEMETRY</span>
      </div>

      {/* Is container ka scroll andar hi lock rahega, poore page ko niche nahi kheencha jayega */}
      <div style={styles.logContainer}>
        {logs.map((log, index) => (
          <div key={index} style={styles.logRow}>
            <span style={styles.logTime}>[{log.time}]</span>
            <span style={{ ...styles.logType, color: getTypeColor(log.type) }}>
              {log.type}
            </span>
            <span style={styles.logMsg}>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  cardTitle: { margin: 0, fontSize: '15px', fontWeight: '600', color: '#e2e8f0' },
  feedTag: { fontSize: '10px', color: '#64748b', fontWeight: '700' },
  logContainer: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '8px', 
    maxHeight: '180px', 
    overflowY: 'auto', 
    backgroundColor: '#020617', 
    padding: '10px', 
    borderRadius: '8px', 
    border: '1px solid #1e293b' 
  },
  logRow: { display: 'flex', gap: '8px', fontSize: '11px', fontFamily: 'monospace', alignItems: 'baseline' },
  logTime: { color: '#64748b' },
  logType: { fontWeight: '700' },
  logMsg: { color: '#cbd5e1', wordBreak: 'break-word' }
};