import React from 'react';

export default function AirQuality({ aqi, pm25, pm10 = 65, co2, no2 = 24.5, temp, humidity }) {
  const getAqiDetails = (val) => {
    if (val <= 50) return { label: 'GOOD', color: '#10b981', desc: 'Air quality is satisfactory.' };
    if (val <= 100) return { label: 'MODERATE', color: '#f59e0b', desc: 'Acceptable air quality.' };
    if (val <= 200) return { label: 'POOR', color: '#f97316', desc: 'Breathing discomfort to sensitive people.' };
    return { label: 'HAZARDOUS', color: '#ef4444', desc: 'Health alert: High pollution levels.' };
  };

  const status = getAqiDetails(aqi);

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <div style={styles.sihTag}>TIER 1: VEHICLE EMISSIONS & GAS SENSORS</div>
          <h3 style={styles.cardTitle}>🍃 Air Quality & Intersection Emissions Telemetry</h3>
        </div>
        <span style={styles.sensorTag}>NDIR + MQ-135 + DHT11</span>
      </div>

      <div style={styles.mainGrid}>
        {/* Main AQI Gauge Card */}
        <div style={{ ...styles.aqiCard, borderColor: status.color }}>
          <div style={styles.aqiLabel}>CITY AIR QUALITY INDEX</div>
          <div style={{ ...styles.aqiVal, color: status.color }}>{aqi}</div>
          <div style={{ ...styles.aqiBadge, backgroundColor: status.color }}>{status.label}</div>
          <div style={styles.aqiDesc}>{status.desc}</div>
        </div>

        {/* Environmental Telemetry Grid */}
        <div style={styles.metricsGrid}>
          <div style={styles.metricItem}>
            <span style={styles.metricKey}>PM 2.5 (FINE PARTICLES)</span>
            <strong style={styles.metricVal}>{pm25} µg/m³</strong>
          </div>
          <div style={styles.metricItem}>
            <span style={styles.metricKey}>PM 10 (COARSE DUST)</span>
            <strong style={styles.metricVal}>{pm10} µg/m³</strong>
          </div>
          <div style={styles.metricItem}>
            <span style={styles.metricKey}>NDIR CO₂ CONCENTRATION</span>
            <strong style={styles.metricVal}>{co2} ppm</strong>
          </div>
          <div style={styles.metricItem}>
            <span style={styles.metricKey}>VEHICLE NO₂ EXHAUST</span>
            <strong style={{ ...styles.metricVal, color: no2 > 35 ? '#f59e0b' : '#38bdf8' }}>{no2} ppb</strong>
          </div>
          <div style={styles.metricItem}>
            <span style={styles.metricKey}>AMBIENT TEMPERATURE</span>
            <strong style={styles.metricVal}>{temp} °C</strong>
          </div>
          <div style={styles.metricItem}>
            <span style={styles.metricKey}>RELATIVE HUMIDITY</span>
            <strong style={styles.metricVal}>{humidity} %</strong>
          </div>
        </div>
      </div>

      {/* Intersection NDIR Exhaust Status Banner */}
      <div style={styles.ndirBanner}>
        <div style={styles.ndirHeader}>
          <span>🚦 JUNCTION 04 VEHICLE EXHAUST DISPERSION (NDIR SENSORS)</span>
          <span style={styles.ndirStatus}>STATUS: {aqi > 120 ? 'HIGH EMISSION CONCENTRATION' : 'NOMINAL DISPERSION'}</span>
        </div>
        <div style={styles.ndirSub}>
          Real-time measurement of internal combustion exhaust (CO₂ / NO₂) at signal queues. Correlated with dynamic signal timing to minimize idle-engine emissions.
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' },
  sihTag: { fontSize: '9px', fontWeight: '800', color: '#10b981', letterSpacing: '0.6px', marginBottom: '2px' },
  cardTitle: { margin: 0, fontSize: '15px', fontWeight: '600', color: '#e2e8f0' },
  sensorTag: { fontSize: '10px', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '3px 8px', borderRadius: '12px', fontFamily: 'monospace', fontWeight: '700' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '14px', marginBottom: '14px' },
  aqiCard: { backgroundColor: '#020617', border: '1px solid', borderRadius: '10px', padding: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  aqiLabel: { fontSize: '10px', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px' },
  aqiVal: { fontSize: '32px', fontWeight: '800', margin: '4px 0' },
  aqiBadge: { color: '#020617', fontWeight: '800', fontSize: '11px', padding: '2px 10px', borderRadius: '12px', marginBottom: '6px' },
  aqiDesc: { fontSize: '10px', color: '#94a3b8' },
  metricsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  metricItem: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '9px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  metricKey: { fontSize: '9px', color: '#64748b', fontWeight: '700', marginBottom: '2px' },
  metricVal: { fontSize: '13px', color: '#f8fafc' },
  ndirBanner: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px' },
  ndirHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginBottom: '4px' },
  ndirStatus: { color: '#38bdf8', fontSize: '10px', fontWeight: '800' },
  ndirSub: { fontSize: '11px', color: '#64748b', lineHeight: '1.4' }
};