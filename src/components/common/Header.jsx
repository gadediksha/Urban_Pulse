import React, { useState, useEffect } from 'react';

export default function Header({ emergencyCorridor }) {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header style={styles.navbar}>
      <div style={styles.brandGroup}>
        <div style={styles.logoBadge}>UP</div>
        <div>
          <div style={styles.brandTitle}>
            UrbanPulse <span style={styles.proPill}>v2.4 AI-CORE</span>
          </div>
          <div style={styles.brandSub}>Intelligent Municipal Transport Grid</div>
        </div>
      </div>

      <div style={styles.navRight}>
        <div style={styles.statusChip}>
          <span style={{ ...styles.dot, backgroundColor: emergencyCorridor ? '#ef4444' : '#10b981' }}></span>
          <span>{emergencyCorridor ? 'EMERGENCY MODE' : 'NODES CONNECTED'}</span>
        </div>
        <div style={styles.timeBadge}>{currentTime}</div>
      </div>
    </header>
  );
}

const styles = {
  navbar: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backgroundColor: '#020617',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '16px',
    paddingTop: '10px',
    borderBottom: '1px solid #1e293b',
    marginBottom: '20px'
  },
  brandGroup: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoBadge: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '16px',
    color: '#fff',
    textAlign: 'center',
    lineHeight: '40px'
  },
  brandTitle: { fontSize: '20px', fontWeight: '700' },
  proPill: {
    fontSize: '10px',
    backgroundColor: '#0369a1',
    color: '#38bdf8',
    padding: '2px 6px',
    borderRadius: '4px',
    marginLeft: '6px'
  },
  brandSub: { fontSize: '12px', color: '#64748b' },
  navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  statusChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#0f172a',
    border: '1px solid #1e293b',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600'
  },
  dot: { width: '8px', height: '8px', borderRadius: '50%' },
  timeBadge: {
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#94a3b8',
    backgroundColor: '#0f172a',
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid #1e293b'
  }
};