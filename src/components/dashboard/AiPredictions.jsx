import React from 'react';

export default function AiPredictions({ congestionRisk, peakTime, predictedDelay, co2Saved }) {
  const getRiskDetails = (risk) => {
    switch (risk) {
      case 'HIGH':
        return { color: '#ef4444', label: 'HIGH CONGESTION PROBABILITY (88%)' };
      case 'MODERATE':
        return { color: '#f59e0b', label: 'MODERATE CONGESTION PROBABILITY (54%)' };
      default:
        return { color: '#10b981', label: 'LOW CONGESTION PROBABILITY (18%)' };
    }
  };

  const riskInfo = getRiskDetails(congestionRisk);

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.titleGroup}>
          <h3 style={styles.cardTitle}>🧠 AI Traffic & Urban Predictive Engine</h3>
          <span style={styles.aiBadge}>NEURAL FORECAST v3.1</span>
        </div>
        <span style={{ ...styles.riskTag, color: riskInfo.color, borderColor: riskInfo.color }}>
          {congestionRisk} RISK
        </span>
      </div>

      <div style={styles.predictionBanner}>
        <div style={styles.bannerHeader}>NEXT 30-MIN FLOW PROJECTION</div>
        <div style={{ ...styles.bannerStatus, color: riskInfo.color }}>{riskInfo.label}</div>
        <div style={styles.bannerSub}>Recommended action: Pre-adjust green cycle timings by +3s on North-South corridor.</div>
      </div>

      <div style={styles.metricsGrid}>
        <div style={styles.metricBox}>
          <span style={styles.metricKey}>NEXT PEAK WINDOW</span>
          <strong style={styles.metricVal}>{peakTime}</strong>
        </div>
        <div style={styles.metricBox}>
          <span style={styles.metricKey}>PREDICTED GRID DELAY</span>
          <strong style={{ ...styles.metricVal, color: '#f59e0b' }}>+{predictedDelay} mins</strong>
        </div>
        <div style={styles.metricBox}>
          <span style={styles.metricKey}>CO₂ REDUCTION</span>
          <strong style={{ ...styles.metricVal, color: '#10b981' }}>-{co2Saved} kg/hr</strong>
        </div>
        <div style={styles.metricBox}>
          <span style={styles.metricKey}>MODEL ACCURACY</span>
          <strong style={styles.metricVal}>94.2%</strong>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
  titleGroup: { display: 'flex', alignItems: 'center', gap: '8px' },
  cardTitle: { margin: 0, fontSize: '15px', fontWeight: '600', color: '#e2e8f0' },
  aiBadge: { fontSize: '9px', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid #0284c7', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' },
  riskTag: { fontSize: '10px', fontWeight: '800', border: '1px solid', padding: '2px 8px', borderRadius: '12px', letterSpacing: '0.5px' },
  predictionBanner: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', marginBottom: '12px' },
  bannerHeader: { fontSize: '10px', fontWeight: '700', color: '#64748b', marginBottom: '4px' },
  bannerStatus: { fontSize: '13px', fontWeight: '800', marginBottom: '4px' },
  bannerSub: { fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' },
  metricsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  metricBox: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  metricKey: { fontSize: '9px', color: '#64748b', fontWeight: '700', marginBottom: '2px' },
  metricVal: { fontSize: '13px', color: '#f8fafc' }
};