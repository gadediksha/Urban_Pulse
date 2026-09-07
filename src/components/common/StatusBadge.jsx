import React from 'react';

export default function StatusBadge({ status, text, pulse = false }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
      case 'success':
        return { bg: 'rgba(16, 185, 129, 0.12)', border: '#059669', dot: '#10b981', text: '#34d399' };
      case 'emergency':
      case 'danger':
        return { bg: 'rgba(239, 68, 68, 0.15)', border: '#dc2626', dot: '#ef4444', text: '#f87171' };
      case 'warning':
        return { bg: 'rgba(245, 158, 11, 0.15)', border: '#d97706', dot: '#f59e0b', text: '#fbbf24' };
      default:
        return { bg: 'rgba(100, 116, 139, 0.15)', border: '#475569', dot: '#94a3b8', text: '#cbd5e1' };
    }
  };

  const config = getStatusConfig();

  return (
    <div style={{ ...styles.badge, backgroundColor: config.bg, borderColor: config.border, color: config.text }}>
      <span
        style={{
          ...styles.dot,
          backgroundColor: config.dot,
          boxShadow: pulse ? `0 0 8px ${config.dot}` : 'none'
        }}
      />
      <span>{text}</span>
    </div>
  );
}

const styles = {
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.3px'
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%'
  }
};
