import React from 'react';

export default function AlertsPanel({ alerts, onDismissAlert, onClearAll }) {
  const getBadgeStyle = (level) => {
    switch (level) {
      case 'CRITICAL':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', border: '#ef4444' };
      case 'WARNING':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: '#f59e0b' };
      default:
        return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: '#0284c7' };
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.titleGroup}>
          <h3 style={styles.cardTitle}>🔔 Active System Alerts & Incidents</h3>
          <span style={styles.countBadge}>{alerts.length} Active</span>
        </div>
        {alerts.length > 0 && (
          <button onClick={onClearAll} style={styles.clearBtn}>
            Dismiss All
          </button>
        )}
      </div>

      <div style={styles.alertList}>
        {alerts.length === 0 ? (
          <div style={styles.emptyState}>✅ All smart municipal sectors operating within nominal parameters.</div>
        ) : (
          alerts.map((alert) => {
            const badge = getBadgeStyle(alert.level);
            return (
              <div 
                key={alert.id} 
                style={{ 
                  ...styles.alertItem, 
                  borderLeft: `4px solid ${badge.border}` 
                }}
              >
                <div style={styles.alertLeft}>
                  <div style={styles.alertTopRow}>
                    <span style={{ ...styles.levelTag, backgroundColor: badge.bg, color: badge.text, borderColor: badge.border }}>
                      {alert.level}
                    </span>
                    <span style={styles.sectorTag}>{alert.sector}</span>
                    <span style={styles.timeTag}>{alert.time}</span>
                  </div>
                  <div style={styles.alertMsg}>{alert.message}</div>
                </div>
                <button onClick={() => onDismissAlert(alert.id)} style={styles.dismissBtn} title="Acknowledge & Dismiss">
                  ✕
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
  titleGroup: { display: 'flex', alignItems: 'center', gap: '10px' },
  cardTitle: { margin: 0, fontSize: '15px', fontWeight: '600', color: '#e2e8f0' },
  countBadge: { fontSize: '11px', fontWeight: '700', backgroundColor: '#ef4444', color: '#fff', padding: '2px 8px', borderRadius: '10px' },
  clearBtn: { backgroundColor: '#1e293b', border: '1px solid #334155', color: '#94a3b8', fontSize: '11px', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer' },
  alertList: { display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto' },
  emptyState: { backgroundColor: '#020617', border: '1px solid #1e293b', padding: '16px', borderRadius: '8px', textAlign: 'center', fontSize: '12px', color: '#10b981' },
  alertItem: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' },
  alertLeft: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  alertTopRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  levelTag: { fontSize: '9px', fontWeight: '800', border: '1px solid', padding: '1px 6px', borderRadius: '4px', letterSpacing: '0.5px' },
  sectorTag: { fontSize: '10px', fontWeight: '600', color: '#64748b' },
  timeTag: { fontSize: '10px', color: '#475569', marginLeft: 'auto' },
  alertMsg: { fontSize: '12px', color: '#f8fafc', lineHeight: '1.4' },
  dismissBtn: { backgroundColor: 'transparent', border: 'none', color: '#64748b', fontSize: '14px', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }
};