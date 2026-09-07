import React from 'react';

export default function AiInsights({ analytics }) {
  const data = analytics || {
    congestionIndex: "38%",
    totalVehiclesInQueue: 16,
    waitTimeReduction: "38%",
    co2SavedKg: 14.8,
    fuelSavedLiters: 6.2,
    logisticsThroughput: "+41.5% Faster Delivery Dispatch",
    greenWaveEfficiency: "96.4%",
    peakHourForecast: "Moderate Flow (Expected Rush at 18:30)",
    adaptiveActuationsToday: 1840,
    solarGridBatteryAvg: "96%"
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.headerLeft}>
          <span style={styles.aiBadge}>SIH PS-26222</span>
          <h3 style={styles.cardTitle}>City Resource Optimization & ESG Impact Analytics</h3>
        </div>
        <span style={styles.subTag}>Real-time Municipal Resource Telemetry</span>
      </div>

      <div style={styles.insightsGrid}>
        {/* Metric 1: Congestion Relief */}
        <div style={styles.insightBox}>
          <div style={styles.boxLabel}>Live Congestion Index</div>
          <div style={styles.valueRow}>
            <span style={{ ...styles.bigValue, color: '#38bdf8' }}>{data.congestionIndex}</span>
            <span style={styles.trendTag}>Dynamic Balance</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: data.congestionIndex, backgroundColor: '#38bdf8' }}></div>
          </div>
        </div>

        {/* Metric 2: Commuter Wait Time Saved */}
        <div style={styles.insightBox}>
          <div style={styles.boxLabel}>Average Wait Time Saved</div>
          <div style={styles.valueRow}>
            <span style={{ ...styles.bigValue, color: '#10b981' }}>-{data.waitTimeReduction}</span>
            <span style={{ ...styles.trendTag, color: '#10b981', borderColor: '#059669' }}>vs Fixed Timers</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: data.waitTimeReduction, backgroundColor: '#10b981' }}></div>
          </div>
        </div>

        {/* Metric 3: Carbon Offset */}
        <div style={styles.insightBox}>
          <div style={styles.boxLabel}>Carbon Offset (CO2 Saved)</div>
          <div style={styles.valueRow}>
            <span style={{ ...styles.bigValue, color: '#a78bfa' }}>{data.co2SavedKg}</span>
            <span style={styles.unitText}>kg CO₂</span>
          </div>
          <div style={styles.subDetail}>Reduced idling emissions at Junction 04</div>
        </div>

        {/* Metric 4: Fuel Saved */}
        <div style={styles.insightBox}>
          <div style={styles.boxLabel}>Fuel Wastage Prevented</div>
          <div style={styles.valueRow}>
            <span style={{ ...styles.bigValue, color: '#fbbf24' }}>{data.fuelSavedLiters || '6.2'}</span>
            <span style={styles.unitText}>Liters</span>
          </div>
          <div style={styles.subDetail}>Saved from grid stop-and-go delays</div>
        </div>

        {/* Metric 5: Logistics Speedup */}
        <div style={styles.insightBox}>
          <div style={styles.boxLabel}>Logistics Corridor Throughput</div>
          <div style={styles.valueRow}>
            <span style={{ ...styles.bigValue, color: '#38bdf8', fontSize: '18px' }}>{data.logisticsThroughput}</span>
          </div>
          <div style={styles.subDetail}>Dedicated commercial EV Green Waves</div>
        </div>

        {/* Metric 6: Solar Battery */}
        <div style={styles.insightBox}>
          <div style={styles.boxLabel}>Solar IoT Microgrid Battery</div>
          <div style={styles.valueRow}>
            <span style={{ ...styles.bigValue, color: '#34d399' }}>{data.solarGridBatteryAvg || '96%'}</span>
            <span style={styles.trendTag}>100% Renewable</span>
          </div>
          <div style={styles.subDetail}>Actuators powered via clean energy</div>
        </div>
      </div>

      <div style={styles.forecastBanner}>
        <span style={{ fontSize: '16px' }}>🔮</span>
        <div>
          <strong style={{ color: '#e2e8f0', fontSize: '12px' }}>AI Peak Traffic & Resource Forecast: </strong>
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>{data.peakHourForecast}</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '14px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #1e293b',
    paddingBottom: '12px'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  aiBadge: {
    backgroundColor: '#0369a1',
    color: '#38bdf8',
    fontSize: '10px',
    fontWeight: '800',
    padding: '3px 8px',
    borderRadius: '6px',
    letterSpacing: '0.5px'
  },
  cardTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: '#f8fafc'
  },
  subTag: {
    fontSize: '11px',
    color: '#64748b'
  },
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px'
  },
  insightBox: {
    backgroundColor: '#020617',
    border: '1px solid #1e293b',
    borderRadius: '10px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  boxLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: '6px'
  },
  valueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '6px',
    margin: '4px 0 8px 0'
  },
  bigValue: {
    fontSize: '22px',
    fontWeight: '800'
  },
  unitText: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600'
  },
  trendTag: {
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '4px',
    border: '1px solid #0284c7',
    color: '#38bdf8',
    marginLeft: 'auto'
  },
  progressBar: {
    height: '4px',
    backgroundColor: '#1e293b',
    borderRadius: '2px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.4s ease'
  },
  subDetail: {
    fontSize: '10px',
    color: '#64748b',
    marginTop: '4px'
  },
  forecastBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#090d16',
    border: '1px solid #1e293b',
    borderRadius: '8px',
    padding: '10px 14px'
  }
};
