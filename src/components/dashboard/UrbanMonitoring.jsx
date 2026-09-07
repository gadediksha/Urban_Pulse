import React from 'react';

export default function UrbanMonitoring({ 
  soundDb = 68.2, 
  structuralVibe = 0.092, 
  strainMicro = 45, 
  gpsCoords = { lat: 28.6139, lng: 77.2090, label: 'Junction 04, Sector 7 Hub' } 
}) {
  const isLoud = soundDb > 75;
  const isHighVibe = structuralVibe > 0.15;

  const getNoiseCategory = (db) => {
    if (db < 60) return { label: 'LOW / QUIET RESIDENTIAL', color: '#10b981' };
    if (db <= 75) return { label: 'MODERATE URBAN TRAFFIC', color: '#f59e0b' };
    return { label: 'HIGH NOISE POLLUTION / HONKING', color: '#ef4444' };
  };

  const noiseCat = getNoiseCategory(soundDb);

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <div style={styles.sihTag}>TIER 1: GPS & ACOUSTIC SENSORS</div>
          <h3 style={styles.cardTitle}>🏙️ Urban Monitoring, City Acoustic Noise & Structural Health</h3>
        </div>
        <span style={styles.sensorTag}>ACOUSTIC dB + PIEZO-VIBE + GPS ACTIVE</span>
      </div>

      <div style={styles.mainGrid}>
        {/* Module 1: Acoustic City Noise Monitor */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <span style={styles.panelTitle}>🔊 CITY NOISE & ACOUSTIC POLLUTION SENSOR</span>
            <span style={{ ...styles.pill, color: noiseCat.color, borderColor: noiseCat.color }}>
              {noiseCat.label}
            </span>
          </div>

          <div style={styles.dbGaugeRow}>
            <div style={{ ...styles.dbNumber, color: noiseCat.color }}>
              {soundDb} <span style={styles.dbUnit}>dB(A)</span>
            </div>
            <div style={styles.meterWrapper}>
              <div style={styles.meterTrack}>
                <div 
                  style={{ 
                    ...styles.meterBar, 
                    width: `${Math.min(100, Math.max(10, ((soundDb - 40) / 60) * 100))}%`,
                    backgroundColor: noiseCat.color 
                  }} 
                />
              </div>
              <div style={styles.meterScale}>
                <span>40 dB (Quiet)</span>
                <span>70 dB (Moderate)</span>
                <span>100 dB (Severe)</span>
              </div>
            </div>
          </div>

          <div style={styles.subGrid}>
            <div style={styles.subItem}>
              <span style={styles.subKey}>PEAK 15-MIN NOISE</span>
              <strong style={styles.subVal}>82.4 dB</strong>
            </div>
            <div style={styles.subItem}>
              <span style={styles.subKey}>HONKING BURSTS</span>
              <strong style={{ ...styles.subVal, color: isLoud ? '#f87171' : '#34d399' }}>
                {isLoud ? '4 Events / min' : '0 Events (Silent)'}
              </strong>
            </div>
            <div style={styles.subItem}>
              <span style={styles.subKey}>FREQUENCY BAND</span>
              <strong style={styles.subVal}>Mid-Range (500Hz - 2kHz)</strong>
            </div>
          </div>
        </div>

        {/* Module 2: Structural Health Monitoring (Bridges & Flyovers) */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <span style={styles.panelTitle}>🏗️ STRUCTURAL HEALTH MONITORING (FLYOVER PIER)</span>
            <span style={{ ...styles.pill, color: isHighVibe ? '#f87171' : '#34d399', borderColor: isHighVibe ? '#ef4444' : '#10b981' }}>
              {isHighVibe ? 'ELEVATED VIBRATION' : 'NOMINAL INTEGRITY'}
            </span>
          </div>

          <div style={styles.vibeRow}>
            <div style={styles.vibeCard}>
              <span style={styles.vibeLabel}>PIER VIBRATION</span>
              <strong style={{ ...styles.vibeVal, color: isHighVibe ? '#f59e0b' : '#38bdf8' }}>
                {structuralVibe} g
              </strong>
              <span style={styles.vibeSub}>Safe Limit: &lt; 0.20g</span>
            </div>

            <div style={styles.vibeCard}>
              <span style={styles.vibeLabel}>MECHANICAL STRAIN</span>
              <strong style={{ ...styles.vibeVal, color: '#a78bfa' }}>
                {strainMicro} µε
              </strong>
              <span style={styles.vibeSub}>Tolerance: 250 µε</span>
            </div>

            <div style={styles.vibeCard}>
              <span style={styles.vibeLabel}>EXPANSION JOINT</span>
              <strong style={{ ...styles.vibeVal, color: '#10b981' }}>
                14.2 mm
              </strong>
              <span style={styles.vibeSub}>Optimal Gap</span>
            </div>
          </div>

          <div style={styles.shmNotice}>
            Continuous MEMS accelerometers on the flyover superstructure guard against resonance fatigue from overloaded freight vehicles.
          </div>
        </div>
      </div>

      {/* Module 3: GPS Spatial Telemetry & AI Surveillance Grid */}
      <div style={styles.gpsBanner}>
        <div style={styles.gpsHeader}>
          <div style={styles.gpsAnchor}>
            <span style={styles.gpsDot}></span>
            <span>📍 GPS SPATIAL COORDINATES: {gpsCoords.lat.toFixed(4)}° N, {gpsCoords.lng.toFixed(4)}° E ({gpsCoords.label})</span>
          </div>
          <span style={styles.surveillanceBadge}>AI SURVEILLANCE & GIS SYNC ACTIVE</span>
        </div>

        <div style={styles.gpsStatsRow}>
          <div style={styles.gpsStat}>
            <span style={styles.gpsKey}>AI CCTV OPTICAL FLOW</span>
            <strong style={styles.gpsVal}>98.4% Frame Sync</strong>
          </div>
          <div style={styles.gpsStat}>
            <span style={styles.gpsKey}>AVG INTERSECTION SPEED</span>
            <strong style={styles.gpsVal}>34.2 km/h (Nominal)</strong>
          </div>
          <div style={styles.gpsStat}>
            <span style={styles.gpsKey}>GIS MAP OVERLAY</span>
            <strong style={{ ...styles.gpsVal, color: '#10b981' }}>Geofence Sector 7 Clear</strong>
          </div>
          <div style={styles.gpsStat}>
            <span style={styles.gpsKey}>SURVEILLANCE CAMERAS</span>
            <strong style={{ ...styles.gpsVal, color: '#38bdf8' }}>2 Edge Cams Online</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  sihTag: { fontSize: '9px', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.6px', marginBottom: '2px' },
  cardTitle: { margin: 0, fontSize: '15px', fontWeight: '600', color: '#e2e8f0' },
  sensorTag: { fontSize: '10px', color: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px solid #0284c7', padding: '3px 8px', borderRadius: '12px', fontFamily: 'monospace', fontWeight: '700' },
  mainGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px', marginBottom: '14px' },
  panel: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px' },
  panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '6px' },
  panelTitle: { fontSize: '11px', fontWeight: '700', color: '#94a3b8' },
  pill: { fontSize: '10px', fontWeight: '800', border: '1px solid', padding: '2px 8px', borderRadius: '10px' },
  dbGaugeRow: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' },
  dbNumber: { fontSize: '32px', fontWeight: '800', whiteSpace: 'nowrap' },
  dbUnit: { fontSize: '12px', color: '#94a3b8', fontWeight: '500' },
  meterWrapper: { flex: 1 },
  meterTrack: { height: '10px', backgroundColor: '#1e293b', borderRadius: '6px', overflow: 'hidden' },
  meterBar: { height: '100%', transition: 'width 0.4s ease, background-color 0.4s ease' },
  meterScale: { display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#64748b', marginTop: '4px', fontWeight: '600' },
  subGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' },
  subItem: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', padding: '8px' },
  subKey: { fontSize: '8px', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '2px' },
  subVal: { fontSize: '11px', color: '#f8fafc' },
  vibeRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '10px' },
  vibeCard: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', padding: '8px', textAlign: 'center' },
  vibeLabel: { fontSize: '9px', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '2px' },
  vibeVal: { fontSize: '15px', fontWeight: '800', display: 'block' },
  vibeSub: { fontSize: '8px', color: '#64748b' },
  shmNotice: { fontSize: '10px', color: '#64748b', lineHeight: '1.4' },
  gpsBanner: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px' },
  gpsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' },
  gpsAnchor: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '700', color: '#e2e8f0' },
  gpsDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' },
  surveillanceBadge: { fontSize: '9px', fontWeight: '700', color: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px solid #0284c7', padding: '2px 8px', borderRadius: '8px' },
  gpsStatsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' },
  gpsStat: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', padding: '8px' },
  gpsKey: { fontSize: '8px', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '2px' },
  gpsVal: { fontSize: '11px', color: '#f8fafc' }
};
