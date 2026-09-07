import React from 'react';

export default function WaterManagement({ 
  tankLevel, 
  flowRate, 
  phValue, 
  pressure = 4.2, 
  tds = 155, 
  leakStatus = 'NOMINAL',
  pumpStatus, 
  onTogglePump 
}) {
  const getLevelColor = (lvl) => {
    if (lvl < 25) return '#ef4444'; // Red (Low Water Alert)
    if (lvl > 90) return '#f59e0b'; // Yellow (Near Overflow)
    return '#0284c7';              // Blue (Normal)
  };

  const isLeak = leakStatus !== 'NOMINAL';

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <div style={styles.sihTag}>TIER 1: FLOW & PRESSURE SENSORS</div>
          <h3 style={styles.cardTitle}>💧 Smart Water Grid, Leak Detection & Purity</h3>
        </div>
        <span style={styles.sensorTag}>ULTRASONIC FLOW + PRESSURE TRANSDUCER</span>
      </div>

      <div style={styles.mainGrid}>
        {/* Overhead Reservoir Tank */}
        <div style={styles.tankCard}>
          <div style={styles.tankHeader}>
            <span style={styles.cardSub}>SECTOR RESERVOIR</span>
            <strong style={{ color: getLevelColor(tankLevel), fontSize: '14px' }}>{tankLevel}%</strong>
          </div>

          <div style={styles.tankContainer}>
            <div 
              style={{ 
                ...styles.tankWater, 
                height: `${tankLevel}%`, 
                backgroundColor: getLevelColor(tankLevel) 
              }} 
            />
          </div>

          <button 
            onClick={onTogglePump} 
            style={{ 
              ...styles.pumpBtn, 
              backgroundColor: pumpStatus ? '#059669' : '#334155' 
            }}
          >
            {pumpStatus ? '⚡ Inflow Pump: ACTIVE' : 'Inflow Pump: OFF'}
          </button>
        </div>

        {/* Water Quality, Pressure & Pipeline Telemetry */}
        <div style={styles.metricsGrid}>
          <div style={styles.metricBox}>
            <span style={styles.metricLabel}>SUPPLY FLOW RATE</span>
            <strong style={styles.metricVal}>{flowRate} L/min</strong>
          </div>
          <div style={styles.metricBox}>
            <span style={styles.metricLabel}>PIPELINE PRESSURE</span>
            <strong style={{ ...styles.metricVal, color: pressure < 3.0 ? '#ef4444' : '#38bdf8' }}>
              {pressure} Bar
            </strong>
          </div>
          <div style={styles.metricBox}>
            <span style={styles.metricLabel}>WATER PURITY (pH)</span>
            <strong style={{ ...styles.metricVal, color: phValue >= 6.5 && phValue <= 8.5 ? '#10b981' : '#ef4444' }}>
              {phValue} (Balanced)
            </strong>
          </div>
          <div style={styles.metricBox}>
            <span style={styles.metricLabel}>TOTAL DISSOLVED SOLIDS</span>
            <strong style={styles.metricVal}>{tds} ppm (Clean)</strong>
          </div>
          <div style={styles.metricBox}>
            <span style={styles.metricLabel}>ACOUSTIC LEAK SENSOR</span>
            <strong style={{ ...styles.metricVal, color: isLeak ? '#ef4444' : '#10b981' }}>
              {leakStatus}
            </strong>
          </div>
          <div style={styles.metricBox}>
            <span style={styles.metricLabel}>TURBIDITY INDEX</span>
            <strong style={{ ...styles.metricVal, color: '#10b981' }}>0.8 NTU</strong>
          </div>
        </div>
      </div>

      {/* Pipeline Leak & Flow Anomaly Banner */}
      <div style={{ ...styles.leakBanner, borderColor: isLeak ? '#ef4444' : '#1e293b' }}>
        <div style={styles.leakBannerHeader}>
          <span>🔍 MUNICIPAL PIPELINE INTEGRITY MONITORING</span>
          <span style={{ color: isLeak ? '#ef4444' : '#10b981', fontWeight: '800' }}>
            {isLeak ? '⚠️ LEAK ANOMALY DETECTED IN FEEDER LINE 3' : '✅ ALL 4 PIPELINE SECTORS NOMINAL'}
          </span>
        </div>
        <div style={styles.leakBannerSub}>
          Continuous differential pressure & ultrasonic flow correlation detects underground hairline leaks before major main bursts occur.
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' },
  sihTag: { fontSize: '9px', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.6px', marginBottom: '2px' },
  cardTitle: { margin: 0, fontSize: '15px', fontWeight: '600', color: '#e2e8f0' },
  sensorTag: { fontSize: '10px', color: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px solid #0284c7', padding: '3px 8px', borderRadius: '12px', fontFamily: 'monospace', fontWeight: '700' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '14px', marginBottom: '14px' },
  tankCard: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  tankHeader: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  cardSub: { fontSize: '10px', fontWeight: '700', color: '#64748b' },
  tankContainer: { width: '50px', height: '80px', backgroundColor: '#1e293b', borderRadius: '8px', border: '2px solid #334155', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', margin: '4px 0 10px 0' },
  tankWater: { width: '100%', transition: 'height 0.4s ease, background-color 0.4s ease' },
  pumpBtn: { width: '100%', padding: '6px', border: 'none', color: '#fff', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' },
  metricsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  metricBox: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  metricLabel: { fontSize: '9px', color: '#64748b', fontWeight: '700', marginBottom: '2px' },
  metricVal: { fontSize: '12px', color: '#f8fafc' },
  leakBanner: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px' },
  leakBannerHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginBottom: '4px' },
  leakBannerSub: { fontSize: '11px', color: '#64748b', lineHeight: '1.4' }
};