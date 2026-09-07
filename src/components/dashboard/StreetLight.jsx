import React from 'react';

export default function StreetLight({ isNight, brightness, powerSaved, autoMode, onToggleMode, onToggleNight }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>💡 Smart Adaptive Street Lighting</h3>
        <span style={{ ...styles.modePill, borderColor: autoMode ? '#10b981' : '#f59e0b', color: autoMode ? '#10b981' : '#f59e0b' }}>
          {autoMode ? 'LDR AUTO MODE' : 'MANUAL OVERRIDE'}
        </span>
      </div>

      <div style={styles.mainGrid}>
        {/* Visual Gantry Lamp Card */}
        <div style={styles.lampCard}>
          <div style={styles.lampHeader}>
            <span style={styles.tag}>SECTOR 04 ARTERY</span>
            <span style={{ color: isNight ? '#38bdf8' : '#f59e0b', fontWeight: 'bold', fontSize: '12px' }}>
              {isNight ? '🌙 NIGHT PHASE' : '☀️ DAY PHASE'}
            </span>
          </div>

          {/* Glowing Street Light Simulation */}
          <div style={styles.lightPole}>
            <div 
              style={{
                ...styles.lightBulb,
                backgroundColor: brightness > 0 ? '#fef08a' : '#334155',
                boxShadow: brightness > 0 ? `0 0 ${brightness / 3}px ${brightness / 6}px #facc15` : 'none',
                opacity: brightness > 0 ? brightness / 100 : 0.3
              }}
            />
          </div>

          <div style={styles.intensityLabel}>
            LUMINOSITY: <strong>{brightness}%</strong>
          </div>

          <div style={styles.controlRow}>
            <button onClick={onToggleMode} style={styles.actionBtn}>
              {autoMode ? 'Switch Manual' : 'Switch Auto'}
            </button>
            <button onClick={onToggleNight} style={{ ...styles.actionBtn, backgroundColor: isNight ? '#0369a1' : '#1e293b' }}>
              {isNight ? 'Force Day' : 'Force Night'}
            </button>
          </div>
        </div>

        {/* Telemetry & Efficiency Matrix */}
        <div style={styles.metricsGrid}>
          <div style={styles.metricBox}>
            <span style={styles.metricLabel}>ACTIVE FIXTURES</span>
            <strong style={styles.metricVal}>24 / 24 Online</strong>
          </div>
          <div style={styles.metricBox}>
            <span style={styles.metricLabel}>MOTION BOOST</span>
            <strong style={{ ...styles.metricVal, color: brightness > 30 ? '#10b981' : '#94a3b8' }}>
              {brightness > 30 ? 'TRIGGERED (100%)' : 'IDLE (30%)'}
            </strong>
          </div>
          <div style={styles.metricBox}>
            <span style={styles.metricLabel}>POWER CONSERVED</span>
            <strong style={{ ...styles.metricVal, color: '#10b981' }}>{powerSaved}% vs Static</strong>
          </div>
          <div style={styles.metricBox}>
            <span style={styles.metricLabel}>GRID STATUS</span>
            <strong style={styles.metricVal}>OPTIMAL</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
  cardTitle: { margin: 0, fontSize: '15px', fontWeight: '600', color: '#e2e8f0' },
  modePill: { fontSize: '10px', backgroundColor: '#020617', border: '1px solid', padding: '2px 8px', borderRadius: '12px', fontFamily: 'monospace' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '14px' },
  lampCard: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  lampHeader: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  tag: { fontSize: '10px', fontWeight: '700', color: '#64748b' },
  lightPole: { width: '40px', height: '60px', backgroundColor: '#1e293b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '6px 0' },
  lightBulb: { width: '22px', height: '22px', borderRadius: '50%', transition: 'all 0.4s ease' },
  intensityLabel: { fontSize: '11px', color: '#94a3b8', margin: '8px 0' },
  controlRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', width: '100%' },
  actionBtn: { padding: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc', borderRadius: '6px', fontSize: '10px', fontWeight: '600', cursor: 'pointer' },
  metricsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  metricBox: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  metricLabel: { fontSize: '9px', color: '#64748b', fontWeight: '700', marginBottom: '2px' },
  metricVal: { fontSize: '12px', color: '#f8fafc' }
};