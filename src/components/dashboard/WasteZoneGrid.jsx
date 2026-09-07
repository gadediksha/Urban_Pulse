import React, { useState } from 'react';

const ZONES = [
  { id: 'Z-A', name: 'Zone A – Sector 7', fill: 74, bins: 4, truck: 'WT-04', nextPickup: '08:30', recycleRate: 62 },
  { id: 'Z-B', name: 'Zone B – Sector 9', fill: 38, bins: 6, truck: 'WT-05', nextPickup: '10:15', recycleRate: 71 },
  { id: 'Z-C', name: 'Zone C – Market Hub', fill: 91, bins: 8, truck: 'WT-02', nextPickup: 'NOW', recycleRate: 48 },
  { id: 'Z-D', name: 'Zone D – Residential East', fill: 22, bins: 5, truck: 'WT-07', nextPickup: '14:00', recycleRate: 83 },
];

const WASTE_TYPES = [
  { label: 'Organic / Biodegradable', pct: 45, color: '#10b981' },
  { label: 'Plastic Recyclable', pct: 28, color: '#38bdf8' },
  { label: 'Paper & Cardboard', pct: 14, color: '#f59e0b' },
  { label: 'E-Waste / Hazardous', pct: 8, color: '#f87171' },
  { label: 'Inert / Other', pct: 5, color: '#64748b' },
];

const getFillColor = (level) => {
  if (level >= 85) return '#ef4444';
  if (level >= 60) return '#f59e0b';
  return '#10b981';
};

export default function WasteZoneGrid() {
  const [selectedZone, setSelectedZone] = useState('Z-C');

  const zone = ZONES.find(z => z.id === selectedZone);

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <div style={styles.sihTag}>MULTI-ZONE WASTE TELEMETRY — CITY-WIDE GRID</div>
          <h3 style={styles.cardTitle}>🗺️ Zone-by-Zone Fill Status &amp; Recycling Analytics</h3>
        </div>
        <span style={styles.pillBadge}>4 ZONES MONITORED</span>
      </div>

      {/* Zone Cards */}
      <div style={styles.zoneGrid}>
        {ZONES.map(z => {
          const color = getFillColor(z.fill);
          const isSelected = z.id === selectedZone;
          return (
            <div
              key={z.id}
              onClick={() => setSelectedZone(z.id)}
              style={{
                ...styles.zoneCard,
                borderColor: isSelected ? color : '#1e293b',
                boxShadow: isSelected ? `0 0 10px ${color}44` : 'none',
                cursor: 'pointer'
              }}
            >
              <div style={styles.zoneTop}>
                <span style={styles.zoneId}>{z.id}</span>
                <strong style={{ color, fontSize: '14px', fontWeight: '800' }}>{z.fill}%</strong>
              </div>
              <div style={styles.zoneName}>{z.name}</div>
              <div style={styles.fillBar}>
                <div style={{ ...styles.fillFill, width: `${z.fill}%`, backgroundColor: color }} />
              </div>
              <div style={styles.zoneStatus}>
                {z.fill >= 85 ? '🔴 CRITICAL' : z.fill >= 60 ? '🟡 FILLING' : '🟢 NORMAL'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Zone Detail Panel */}
      {zone && (
        <div style={styles.detailPanel}>
          <div style={styles.detailTitle}>📍 {zone.name} — Detailed View</div>
          <div style={styles.detailGrid}>
            <div style={styles.detailItem}>
              <span style={styles.detailKey}>BINS DEPLOYED</span>
              <strong style={styles.detailVal}>{zone.bins}</strong>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailKey}>ASSIGNED TRUCK</span>
              <strong style={{ ...styles.detailVal, color: '#38bdf8' }}>{zone.truck}</strong>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailKey}>NEXT PICKUP</span>
              <strong style={{ ...styles.detailVal, color: zone.nextPickup === 'NOW' ? '#f87171' : '#f8fafc' }}>
                {zone.nextPickup}
              </strong>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailKey}>RECYCLE RATE</span>
              <strong style={{ ...styles.detailVal, color: '#34d399' }}>{zone.recycleRate}%</strong>
            </div>
          </div>
        </div>
      )}

      {/* Waste Composition */}
      <div style={styles.compositionCard}>
        <div style={styles.compTitle}>♻️ CITY-WIDE WASTE COMPOSITION (ML Classification)</div>
        <div style={styles.compList}>
          {WASTE_TYPES.map(wt => (
            <div key={wt.label} style={styles.compRow}>
              <span style={{ ...styles.compDot, backgroundColor: wt.color }} />
              <span style={styles.compLabel}>{wt.label}</span>
              <div style={styles.compBarTrack}>
                <div style={{ ...styles.compBarFill, width: `${wt.pct}%`, backgroundColor: wt.color }} />
              </div>
              <strong style={{ color: wt.color, fontSize: '11px', minWidth: '32px', textAlign: 'right' }}>{wt.pct}%</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' },
  sihTag: { fontSize: '9px', fontWeight: '800', color: '#f59e0b', letterSpacing: '0.5px', marginBottom: '2px' },
  cardTitle: { margin: 0, fontSize: '15px', fontWeight: '600', color: '#e2e8f0' },
  pillBadge: { fontSize: '10px', color: '#38bdf8', backgroundColor: 'rgba(56,189,248,0.1)', border: '1px solid #0284c7', padding: '3px 8px', borderRadius: '12px', fontWeight: '700' },
  zoneGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '14px' },
  zoneCard: { backgroundColor: '#020617', border: '1px solid', borderRadius: '10px', padding: '12px', transition: 'border-color 0.2s ease, box-shadow 0.2s ease' },
  zoneTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
  zoneId: { fontSize: '10px', fontWeight: '700', color: '#94a3b8' },
  zoneName: { fontSize: '10px', color: '#64748b', marginBottom: '6px' },
  fillBar: { height: '6px', backgroundColor: '#1e293b', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' },
  fillFill: { height: '100%', borderRadius: '4px', transition: 'width 0.4s ease' },
  zoneStatus: { fontSize: '10px', fontWeight: '700', color: '#94a3b8' },
  detailPanel: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', marginBottom: '12px' },
  detailTitle: { fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginBottom: '10px' },
  detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' },
  detailItem: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', padding: '8px' },
  detailKey: { fontSize: '8px', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '2px' },
  detailVal: { fontSize: '13px', color: '#f8fafc', fontWeight: '700' },
  compositionCard: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px' },
  compTitle: { fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginBottom: '10px' },
  compList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  compRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  compDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  compLabel: { fontSize: '11px', color: '#94a3b8', minWidth: '160px' },
  compBarTrack: { flex: 1, height: '6px', backgroundColor: '#1e293b', borderRadius: '4px', overflow: 'hidden' },
  compBarFill: { height: '100%', borderRadius: '4px' },
};
