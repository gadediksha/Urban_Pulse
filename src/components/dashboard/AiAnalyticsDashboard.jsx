import React from 'react';

const SECTOR_MODELS = [
  {
    sector: 'Traffic Flow AI',
    icon: '🚦',
    model: 'GradientBoost + LSTM',
    accuracy: 94.2,
    lastTrained: '2h ago',
    prediction: 'Peak congestion at 18:30 on N-S corridor',
    status: 'ACTIVE',
    color: '#38bdf8',
  },
  {
    sector: 'Waste Fill Predictor',
    icon: '🗑️',
    model: 'Random Forest Regressor',
    accuracy: 89.7,
    lastTrained: '6h ago',
    prediction: 'Zone C bin will reach 95% by 16:45',
    status: 'ACTIVE',
    color: '#f59e0b',
  },
  {
    sector: 'Water Demand Forecast',
    icon: '💧',
    model: 'ARIMA + GRU Hybrid',
    accuracy: 91.5,
    lastTrained: '4h ago',
    prediction: 'Demand surge (+18%) expected 19:00–21:00',
    status: 'ACTIVE',
    color: '#0284c7',
  },
  {
    sector: 'Air Quality Index',
    icon: '🌬️',
    model: 'CNN Environmental',
    accuracy: 87.3,
    lastTrained: '1h ago',
    prediction: 'AQI will exceed 130 during evening rush',
    status: 'WARNING',
    color: '#a78bfa',
  },
  {
    sector: 'Noise Pollution',
    icon: '🔊',
    model: 'Spectral SVM Classifier',
    accuracy: 83.8,
    lastTrained: '3h ago',
    prediction: 'Noise spike (>80dB) at Junction 04 in 45 mins',
    status: 'ACTIVE',
    color: '#34d399',
  },
  {
    sector: 'Structural Health',
    icon: '🏗️',
    model: 'Anomaly Detection LSTM',
    accuracy: 96.1,
    lastTrained: '12h ago',
    prediction: 'All flyover piers nominal. Fatigue cycle: 4/10',
    status: 'ACTIVE',
    color: '#fb923c',
  },
];

const TREND_BARS = [
  { label: 'Mon', traffic: 72, waste: 65, water: 81 },
  { label: 'Tue', traffic: 84, waste: 58, water: 74 },
  { label: 'Wed', traffic: 91, waste: 77, water: 88 },
  { label: 'Thu', traffic: 68, waste: 82, water: 65 },
  { label: 'Fri', traffic: 95, waste: 90, water: 79 },
  { label: 'Sat', traffic: 58, waste: 44, water: 62 },
  { label: 'Sun', traffic: 45, waste: 38, water: 55 },
];

export default function AiAnalyticsDashboard({ congestionRisk, peakTime, predictedDelay, co2Saved }) {
  const overallAccuracy = (SECTOR_MODELS.reduce((sum, m) => sum + m.accuracy, 0) / SECTOR_MODELS.length).toFixed(1);

  return (
    <div style={styles.wrapper}>
      {/* Header Stats */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div>
            <div style={styles.sihTag}>MULTI-MODEL AI INFERENCE ENGINE — URBAN ANALYTICS PLATFORM</div>
            <h3 style={styles.cardTitle}>🧠 AI-Based Prediction &amp; Analytics — All Sectors</h3>
          </div>
          <span style={styles.aiTag}>NEURAL FORECAST v3.1</span>
        </div>

        <div style={styles.summaryRow}>
          <div style={styles.summaryBox}>
            <span style={styles.summaryKey}>MODELS ACTIVE</span>
            <strong style={{ ...styles.summaryVal, color: '#34d399' }}>{SECTOR_MODELS.length}</strong>
          </div>
          <div style={styles.summaryBox}>
            <span style={styles.summaryKey}>OVERALL ACCURACY</span>
            <strong style={{ ...styles.summaryVal, color: '#38bdf8' }}>{overallAccuracy}%</strong>
          </div>
          <div style={styles.summaryBox}>
            <span style={styles.summaryKey}>CONGESTION RISK</span>
            <strong style={{
              ...styles.summaryVal,
              color: congestionRisk === 'HIGH' ? '#f87171' : congestionRisk === 'MODERATE' ? '#fbbf24' : '#34d399'
            }}>
              {congestionRisk}
            </strong>
          </div>
          <div style={styles.summaryBox}>
            <span style={styles.summaryKey}>PREDICTED DELAY</span>
            <strong style={{ ...styles.summaryVal, color: '#fbbf24' }}>+{predictedDelay} min</strong>
          </div>
          <div style={styles.summaryBox}>
            <span style={styles.summaryKey}>CO₂ REDUCTION</span>
            <strong style={{ ...styles.summaryVal, color: '#34d399' }}>{co2Saved} kg/hr</strong>
          </div>
          <div style={styles.summaryBox}>
            <span style={styles.summaryKey}>NEXT PEAK WINDOW</span>
            <strong style={{ ...styles.summaryVal, color: '#a78bfa', fontSize: '14px' }}>{peakTime}</strong>
          </div>
        </div>
      </div>

      {/* Sector Models Grid */}
      <div style={styles.card}>
        <div style={styles.sectionTitle}>⚙️ SECTOR-WISE AI MODEL STATUS &amp; PREDICTIONS</div>
        <div style={styles.modelGrid}>
          {SECTOR_MODELS.map(m => (
            <div key={m.sector} style={{ ...styles.modelCard, borderLeft: `3px solid ${m.color}` }}>
              <div style={styles.modelTop}>
                <span style={styles.modelIcon}>{m.icon}</span>
                <div style={styles.modelInfo}>
                  <div style={styles.modelName}>{m.sector}</div>
                  <div style={styles.modelTag}>{m.model}</div>
                </div>
                <span style={{
                  ...styles.modelStatus,
                  color: m.status === 'WARNING' ? '#fbbf24' : '#34d399',
                  borderColor: m.status === 'WARNING' ? '#f59e0b' : '#10b981',
                  backgroundColor: m.status === 'WARNING' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                }}>
                  {m.status}
                </span>
              </div>

              <div style={styles.accRow}>
                <span style={styles.accLabel}>ACCURACY</span>
                <div style={styles.accTrack}>
                  <div style={{ ...styles.accFill, width: `${m.accuracy}%`, backgroundColor: m.color }} />
                </div>
                <strong style={{ color: m.color, fontSize: '12px', minWidth: '40px', textAlign: 'right' }}>{m.accuracy}%</strong>
              </div>

              <div style={styles.predBox}>
                <span style={styles.predLabel}>PREDICTION: </span>
                <span style={styles.predText}>{m.prediction}</span>
              </div>

              <div style={styles.trainedTag}>Last trained: {m.lastTrained}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Trend Chart */}
      <div style={styles.card}>
        <div style={styles.sectionTitle}>📊 7-DAY MULTI-SECTOR LOAD INDEX TREND</div>
        <div style={styles.legend}>
          <span style={{ ...styles.legendDot, backgroundColor: '#38bdf8' }} /> Traffic
          <span style={{ ...styles.legendDot, backgroundColor: '#f59e0b', marginLeft: '12px' }} /> Waste
          <span style={{ ...styles.legendDot, backgroundColor: '#0284c7', marginLeft: '12px' }} /> Water
        </div>
        <div style={styles.trendChart}>
          {TREND_BARS.map((d, i) => (
            <div key={i} style={styles.trendGroup}>
              <div style={styles.trendBars}>
                <div style={{ ...styles.trendBar, height: `${d.traffic}%`, backgroundColor: '#38bdf8' }} />
                <div style={{ ...styles.trendBar, height: `${d.waste}%`, backgroundColor: '#f59e0b' }} />
                <div style={{ ...styles.trendBar, height: `${d.water}%`, backgroundColor: '#0284c7' }} />
              </div>
              <span style={styles.trendLabel}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: '14px' },
  card: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' },
  sihTag: { fontSize: '9px', fontWeight: '800', color: '#a78bfa', letterSpacing: '0.5px', marginBottom: '2px' },
  cardTitle: { margin: 0, fontSize: '15px', fontWeight: '600', color: '#e2e8f0' },
  aiTag: { fontSize: '10px', color: '#38bdf8', backgroundColor: 'rgba(56,189,248,0.1)', border: '1px solid #0284c7', padding: '3px 8px', borderRadius: '12px', fontWeight: '700', whiteSpace: 'nowrap' },
  summaryRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' },
  summaryBox: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', textAlign: 'center' },
  summaryKey: { fontSize: '9px', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '6px' },
  summaryVal: { fontSize: '18px', fontWeight: '800', display: 'block' },
  sectionTitle: { fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '12px', letterSpacing: '0.4px' },
  modelGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' },
  modelCard: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px' },
  modelTop: { display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' },
  modelIcon: { fontSize: '22px', flexShrink: 0 },
  modelInfo: { flex: 1 },
  modelName: { fontSize: '12px', fontWeight: '700', color: '#e2e8f0', marginBottom: '2px' },
  modelTag: { fontSize: '9px', color: '#64748b', fontWeight: '600' },
  modelStatus: { fontSize: '9px', fontWeight: '800', border: '1px solid', padding: '2px 6px', borderRadius: '8px', flexShrink: 0 },
  accRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
  accLabel: { fontSize: '8px', color: '#64748b', fontWeight: '700', minWidth: '56px' },
  accTrack: { flex: 1, height: '5px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden' },
  accFill: { height: '100%', borderRadius: '3px' },
  predBox: { backgroundColor: '#0f172a', borderRadius: '6px', padding: '6px 8px', marginBottom: '6px' },
  predLabel: { fontSize: '9px', color: '#64748b', fontWeight: '700' },
  predText: { fontSize: '10px', color: '#c7d2fe', lineHeight: '1.4' },
  trainedTag: { fontSize: '9px', color: '#475569' },
  legend: { display: 'flex', alignItems: 'center', fontSize: '11px', color: '#94a3b8', marginBottom: '12px' },
  legendDot: { display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', marginRight: '4px' },
  trendChart: { display: 'flex', gap: '8px', alignItems: 'flex-end', height: '100px' },
  trendGroup: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '4px' },
  trendBars: { display: 'flex', gap: '2px', height: '80px', alignItems: 'flex-end', width: '100%' },
  trendBar: { flex: 1, borderRadius: '3px 3px 0 0', minHeight: '4px', transition: 'height 0.4s ease' },
  trendLabel: { fontSize: '9px', color: '#64748b', fontWeight: '700', textAlign: 'center' },
};
