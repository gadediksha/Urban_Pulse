import React from 'react';

const WATER_ZONES = [
  { id: 'WZ-1', name: 'Sector 7 – Residential', supply: 88, demand: 72, status: 'OPTIMAL' },
  { id: 'WZ-2', name: 'Sector 9 – Commercial', supply: 65, demand: 80, status: 'DEFICIT' },
  { id: 'WZ-3', name: 'Market Hub', supply: 91, demand: 55, status: 'SURPLUS' },
  { id: 'WZ-4', name: 'Industrial Zone', supply: 44, demand: 62, status: 'LOW' },
];

const ZONE_STATUS_COLORS = {
  OPTIMAL: '#10b981',
  DEFICIT: '#f87171',
  SURPLUS: '#38bdf8',
  LOW: '#f59e0b',
};

export default function WaterZoneMap({ flowRate, pressure, phValue, tds }) {
  const dailyConsumption = [
    { hour: '00:00', liters: 120 },
    { hour: '04:00', liters: 80 },
    { hour: '08:00', liters: 340 },
    { hour: '12:00', liters: 420 },
    { hour: '16:00', liters: 380 },
    { hour: '20:00', liters: 460 },
    { hour: 'NOW', liters: Math.round((flowRate || 34.5) * 10) },
  ];

  const maxLiters = Math.max(...dailyConsumption.map(d => d.liters));

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <div style={styles.sihTag}>MULTI-ZONE WATER DISTRIBUTION — SECTOR MONITORING</div>
          <h3 style={styles.cardTitle}>🗺️ Zone Supply/Demand Map &amp; Consumption Analytics</h3>
        </div>
        <span style={styles.pillBadge}>4 ZONES ACTIVE</span>
      </div>

      {/* Zone Status Grid */}
      <div style={styles.zoneGrid}>
        {WATER_ZONES.map(z => {
          const color = ZONE_STATUS_COLORS[z.status];
          const deficit = z.demand > z.supply;
          return (
            <div key={z.id} style={{ ...styles.zoneCard, borderLeft: `4px solid ${color}` }}>
              <div style={styles.zoneTop}>
                <span style={styles.zoneId}>{z.id}</span>
                <span style={{ ...styles.statusPill, color, borderColor: color }}>
                  {z.status}
                </span>
              </div>
              <div style={styles.zoneName}>{z.name}</div>
              <div style={styles.zoneBarRow}>
                <div style={styles.zoneBarGroup}>
                  <span style={styles.barLabel}>SUPPLY</span>
                  <div style={styles.barTrack}>
                    <div style={{ ...styles.barFill, width: `${z.supply}%`, backgroundColor: '#0284c7' }} />
                  </div>
                  <span style={{ ...styles.barPct, color: '#38bdf8' }}>{z.supply}%</span>
                </div>
                <div style={styles.zoneBarGroup}>
                  <span style={styles.barLabel}>DEMAND</span>
                  <div style={styles.barTrack}>
                    <div style={{ ...styles.barFill, width: `${z.demand}%`, backgroundColor: deficit ? '#ef4444' : '#10b981' }} />
                  </div>
                  <span style={{ ...styles.barPct, color: deficit ? '#f87171' : '#34d399' }}>{z.demand}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hourly Consumption Chart */}
      <div style={styles.chartCard}>
        <div style={styles.chartTitle}>📊 24H WATER CONSUMPTION TREND (L/10min Equivalent)</div>
        <div style={styles.chartArea}>
          {dailyConsumption.map((d, i) => {
            const pct = (d.liters / maxLiters) * 100;
            const isNow = d.hour === 'NOW';
            return (
              <div key={i} style={styles.barWrapper}>
                <div style={styles.barContainer}>
                  <div
                    style={{
                      ...styles.chartBar,
                      height: `${pct}%`,
                      backgroundColor: isNow ? '#38bdf8' : '#0284c7',
                      boxShadow: isNow ? '0 0 8px #38bdf8' : 'none'
                    }}
                  />
                </div>
                <span style={{ ...styles.barHour, color: isNow ? '#38bdf8' : '#64748b' }}>{d.hour}</span>
                <span style={{ ...styles.barValue, color: isNow ? '#38bdf8' : '#94a3b8' }}>{d.liters}L</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Water Quality Summary */}
      <div style={styles.qualityRow}>
        <div style={styles.qualItem}>
          <span style={styles.qualKey}>FLOW RATE</span>
          <strong style={{ ...styles.qualVal, color: '#38bdf8' }}>{flowRate} L/min</strong>
        </div>
        <div style={styles.qualItem}>
          <span style={styles.qualKey}>PIPELINE PRESSURE</span>
          <strong style={{ ...styles.qualVal, color: pressure < 3.0 ? '#f87171' : '#38bdf8' }}>{pressure} Bar</strong>
        </div>
        <div style={styles.qualItem}>
          <span style={styles.qualKey}>pH LEVEL</span>
          <strong style={{ ...styles.qualVal, color: '#10b981' }}>{phValue} (Safe)</strong>
        </div>
        <div style={styles.qualItem}>
          <span style={styles.qualKey}>TOTAL DISSOLVED SOLIDS</span>
          <strong style={{ ...styles.qualVal, color: '#10b981' }}>{tds} ppm</strong>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' },
  sihTag: { fontSize: '9px', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.5px', marginBottom: '2px' },
  cardTitle: { margin: 0, fontSize: '15px', fontWeight: '600', color: '#e2e8f0' },
  pillBadge: { fontSize: '10px', color: '#38bdf8', backgroundColor: 'rgba(56,189,248,0.1)', border: '1px solid #0284c7', padding: '3px 8px', borderRadius: '12px', fontWeight: '700' },
  zoneGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '14px' },
  zoneCard: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px' },
  zoneTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
  zoneId: { fontSize: '10px', fontWeight: '700', color: '#94a3b8' },
  statusPill: { fontSize: '9px', fontWeight: '800', border: '1px solid', padding: '1px 6px', borderRadius: '8px' },
  zoneName: { fontSize: '10px', color: '#64748b', marginBottom: '8px' },
  zoneBarRow: { display: 'flex', flexDirection: 'column', gap: '5px' },
  zoneBarGroup: { display: 'flex', alignItems: 'center', gap: '6px' },
  barLabel: { fontSize: '8px', color: '#64748b', fontWeight: '700', minWidth: '40px' },
  barTrack: { flex: 1, height: '5px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '3px', transition: 'width 0.4s ease' },
  barPct: { fontSize: '10px', fontWeight: '700', minWidth: '28px', textAlign: 'right' },
  chartCard: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', marginBottom: '12px' },
  chartTitle: { fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginBottom: '12px' },
  chartArea: { display: 'flex', gap: '6px', alignItems: 'flex-end', height: '80px' },
  barWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '2px' },
  barContainer: { height: '56px', display: 'flex', alignItems: 'flex-end', width: '100%' },
  chartBar: { width: '100%', borderRadius: '4px 4px 0 0', minHeight: '4px', transition: 'height 0.4s ease' },
  barHour: { fontSize: '8px', fontWeight: '600', textAlign: 'center' },
  barValue: { fontSize: '8px', textAlign: 'center' },
  qualityRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' },
  qualItem: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px' },
  qualKey: { fontSize: '9px', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '4px' },
  qualVal: { fontSize: '13px', fontWeight: '700', color: '#f8fafc' },
};
