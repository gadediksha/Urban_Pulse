import React from 'react';

export default function MetricCard({ title, value, unit = '', subtext, icon, trend, color = '#38bdf8' }) {
  return (
    <div style={styles.card}>
      <div style={styles.topRow}>
        <span style={styles.title}>{title}</span>
        {icon && <span style={{ ...styles.iconBadge, backgroundColor: `${color}18`, color }}>{icon}</span>}
      </div>
      <div style={styles.valueRow}>
        <span style={{ ...styles.value, color }}>{value}</span>
        {unit && <span style={styles.unit}>{unit}</span>}
      </div>
      {subtext && (
        <div style={styles.subtext}>
          {trend && <span style={{ color: trend.startsWith('+') ? '#10b981' : '#38bdf8', marginRight: '4px' }}>{trend}</span>}
          {subtext}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
    transition: 'transform 0.2s ease, border-color 0.2s ease',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  title: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  iconBadge: {
    width: '30px',
    height: '30px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '15px'
  },
  valueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    margin: '4px 0 8px 0'
  },
  value: {
    fontSize: '24px',
    fontWeight: '800',
    letterSpacing: '-0.5px'
  },
  unit: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '600'
  },
  subtext: {
    fontSize: '11px',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center'
  }
};
