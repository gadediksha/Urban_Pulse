import React from 'react';

export default function SignalControl({ lanes, activeLaneIndex, activeSignal, dynamicSec }) {
  const getProgressColor = (count) => {
    if (count > 12) return '#ef4444';
    if (count > 6) return '#f59e0b';
    return '#10b981';
  };

  const getStatusLabel = (index) => {
    if (index === activeLaneIndex) {
      if (activeSignal === 'GREEN') return `GO (${dynamicSec}s)`;
      if (activeSignal === 'YELLOW') return 'PREPARE (2s)';
    }
    return 'STOP';
  };

  return (
    <div style={styles.card}>
      <div style={styles.headerRow}>
        <h3 style={styles.cardTitle}>🚦 4-Way Actuators & Signal Controls</h3>
        <span style={styles.activePill}>LIVE PHASING</span>
      </div>

      <div style={styles.grid4}>
        {lanes.map((lane, index) => {
          const isActive = index === activeLaneIndex;
          const currentLight = isActive ? activeSignal : 'RED';

          return (
            <div 
              key={lane.id} 
              style={{
                ...styles.laneBox,
                borderColor: currentLight === 'GREEN' ? '#10b981' : currentLight === 'YELLOW' ? '#facc15' : '#1e293b',
                boxShadow: currentLight === 'GREEN' ? '0 0 16px rgba(16, 185, 129, 0.15)' : 'none'
              }}
            >
              {/* TOP: Lane Header with LED Signal Light */}
              <div style={styles.topBar}>
                <div>
                  <div style={styles.laneTag}>{lane.name.toUpperCase()}</div>
                  <div style={{ color: getProgressColor(lane.count), fontWeight: '700', fontSize: '12px' }}>
                    {lane.count} Cars Waiting
                  </div>
                </div>

                {/* Compact Horizontal LED Lights at the top */}
                <div style={styles.signalPostHorizontal}>
                  <div style={{
                    ...styles.lightDot,
                    backgroundColor: currentLight === 'RED' ? '#ef4444' : '#450a0a',
                    boxShadow: currentLight === 'RED' ? '0 0 10px #ef4444' : 'none'
                  }} />
                  <div style={{
                    ...styles.lightDot,
                    backgroundColor: currentLight === 'YELLOW' ? '#facc15' : '#422006',
                    boxShadow: currentLight === 'YELLOW' ? '0 0 10px #facc15' : 'none'
                  }} />
                  <div style={{
                    ...styles.lightDot,
                    backgroundColor: currentLight === 'GREEN' ? '#10b981' : '#022c22',
                    boxShadow: currentLight === 'GREEN' ? '0 0 10px #10b981' : 'none'
                  }} />
                </div>
              </div>

              {/* Status Badge */}
              <div style={{
                ...styles.statusBadge,
                color: currentLight === 'GREEN' ? '#10b981' : currentLight === 'YELLOW' ? '#facc15' : '#ef4444',
                backgroundColor: currentLight === 'GREEN' ? 'rgba(16, 185, 129, 0.1)' : currentLight === 'YELLOW' ? 'rgba(250, 204, 21, 0.1)' : 'rgba(239, 68, 68, 0.1)'
              }}>
                {getStatusLabel(index)}
              </div>

              {/* Density Progress Bar */}
              <div style={styles.barBg}>
                <div style={{
                  ...styles.barFill,
                  width: `${Math.min(100, (lane.count / 20) * 100)}%`,
                  backgroundColor: getProgressColor(lane.count)
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'rgba(17, 24, 39, 0.75)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  cardTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '700',
    color: '#f8fafc'
  },
  activePill: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    border: '1px solid #0284c7',
    padding: '2px 8px',
    borderRadius: '12px'
  },
  grid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '14px'
  },
  laneBox: {
    backgroundColor: '#030712',
    border: '1px solid',
    borderRadius: '12px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  laneTag: {
    fontSize: '10px',
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: '0.5px'
  },
  signalPostHorizontal: {
    display: 'flex',
    gap: '6px',
    backgroundColor: '#0f172a',
    padding: '5px 8px',
    borderRadius: '16px',
    border: '1px solid #1e293b'
  },
  lightDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    transition: 'all 0.3s ease'
  },
  statusBadge: {
    textAlign: 'center',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 8px',
    borderRadius: '6px'
  },
  barBg: {
    height: '6px',
    backgroundColor: '#1e293b',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  barFill: {
    height: '100%',
    transition: 'width 0.4s ease, background-color 0.4s ease'
  }
};