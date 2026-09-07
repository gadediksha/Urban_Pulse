import React from 'react';

export default function WasteManagement({ 
  bin1Fill, 
  bin2Fill, 
  onEmptyBin, 
  truckStatus = { id: 'TRUCK WT-04', status: 'En Route', eta: '6 mins', target: 'Zone A' } 
}) {
  const getFillColor = (level) => {
    if (level >= 80) return '#ef4444'; // Red (Overflow alert)
    if (level >= 50) return '#f59e0b'; // Yellow (Filling up)
    return '#10b981';                 // Green (Normal)
  };

  const isAutoDispatch = bin1Fill >= 75 || bin2Fill >= 75;

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <div style={styles.sihTag}>TIER 1 & TIER 2: WASTE LOGISTICS & AUTO-DISPATCH</div>
          <h3 style={styles.cardTitle}>🗑️ Smart Waste Management & Automated Truck Fleet</h3>
        </div>
        <span style={styles.statusPill}>ULTRASONIC LEVEL SENSORS ACTIVE</span>
      </div>

      <div style={styles.grid2}>
        {/* Bin 1 */}
        <div style={{ ...styles.binCard, borderColor: getFillColor(bin1Fill) }}>
          <div style={styles.binHeader}>
            <span style={styles.binTag}>ZONE A - SMART BIN #01</span>
            <span style={{ color: getFillColor(bin1Fill), fontWeight: 'bold', fontSize: '13px' }}>
              {bin1Fill}%
            </span>
          </div>

          <div style={styles.meterContainer}>
            <div 
              style={{ 
                ...styles.meterFill, 
                height: `${bin1Fill}%`, 
                backgroundColor: getFillColor(bin1Fill) 
              }} 
            />
          </div>

          <div style={styles.binFooter}>
            <span style={styles.statusText}>
              {bin1Fill >= 75 ? '⚠️ Auto-Dispatched to Fleet' : bin1Fill >= 50 ? 'Moderate Level' : 'Normal Capacity'}
            </span>
            <button 
              onClick={() => onEmptyBin(1)} 
              style={styles.emptyBtn}
            >
              Manual Dispatch / Clear
            </button>
          </div>
        </div>

        {/* Bin 2 */}
        <div style={{ ...styles.binCard, borderColor: getFillColor(bin2Fill) }}>
          <div style={styles.binHeader}>
            <span style={styles.binTag}>ZONE B - SMART BIN #02</span>
            <span style={{ color: getFillColor(bin2Fill), fontWeight: 'bold', fontSize: '13px' }}>
              {bin2Fill}%
            </span>
          </div>

          <div style={styles.meterContainer}>
            <div 
              style={{ 
                ...styles.meterFill, 
                height: `${bin2Fill}%`, 
                backgroundColor: getFillColor(bin2Fill) 
              }} 
            />
          </div>

          <div style={styles.binFooter}>
            <span style={styles.statusText}>
              {bin2Fill >= 75 ? '⚠️ Auto-Dispatched to Fleet' : bin2Fill >= 50 ? 'Moderate Level' : 'Normal Capacity'}
            </span>
            <button 
              onClick={() => onEmptyBin(2)} 
              style={styles.emptyBtn}
            >
              Manual Dispatch / Clear
            </button>
          </div>
        </div>
      </div>

      {/* Automated Dispatch & Truck Tracking Banner */}
      <div style={styles.fleetCard}>
        <div style={styles.fleetHeader}>
          <span style={styles.fleetTitle}>🚛 AUTOMATED WASTE TRUCK DISPATCH & TRACKING</span>
          <span style={{ 
            ...styles.dispatchBadge, 
            backgroundColor: isAutoDispatch ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            color: isAutoDispatch ? '#f87171' : '#34d399',
            borderColor: isAutoDispatch ? '#ef4444' : '#10b981'
          }}>
            {isAutoDispatch ? '⚡ AUTO-DISPATCH ACTIVE' : 'STANDBY IDLE'}
          </span>
        </div>

        <div style={styles.fleetGrid}>
          <div style={styles.fleetItem}>
            <span style={styles.fleetLabel}>ASSIGNED TRUCK</span>
            <strong style={styles.fleetVal}>{truckStatus.id}</strong>
          </div>
          <div style={styles.fleetItem}>
            <span style={styles.fleetLabel}>DISPATCH STATUS</span>
            <strong style={{ ...styles.fleetVal, color: '#38bdf8' }}>{truckStatus.status}</strong>
          </div>
          <div style={styles.fleetItem}>
            <span style={styles.fleetLabel}>ESTIMATED ARRIVAL (ETA)</span>
            <strong style={styles.fleetVal}>{truckStatus.eta}</strong>
          </div>
          <div style={styles.fleetItem}>
            <span style={styles.fleetLabel}>AI ROUTE OPTIMIZATION</span>
            <strong style={{ ...styles.fleetVal, color: '#10b981' }}>Shortest Path Engaged</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' },
  sihTag: { fontSize: '9px', fontWeight: '800', color: '#f59e0b', letterSpacing: '0.6px', marginBottom: '2px' },
  cardTitle: { margin: 0, fontSize: '15px', fontWeight: '600', color: '#e2e8f0' },
  statusPill: { fontSize: '10px', color: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px solid #0284c7', padding: '3px 8px', borderRadius: '12px', fontFamily: 'monospace', fontWeight: '700' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' },
  binCard: { backgroundColor: '#020617', border: '1px solid', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  binHeader: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  binTag: { fontSize: '10px', fontWeight: '700', color: '#64748b' },
  meterContainer: { width: '40px', height: '90px', backgroundColor: '#1e293b', borderRadius: '8px', border: '2px solid #334155', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', margin: '8px 0' },
  meterFill: { width: '100%', transition: 'height 0.4s ease, background-color 0.4s ease' },
  binFooter: { width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', marginTop: '6px' },
  statusText: { fontSize: '11px', color: '#94a3b8', textAlign: 'center' },
  emptyBtn: { width: '100%', padding: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' },
  fleetCard: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px' },
  fleetHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  fleetTitle: { fontSize: '11px', fontWeight: '700', color: '#94a3b8' },
  dispatchBadge: { fontSize: '10px', fontWeight: '800', border: '1px solid', padding: '2px 8px', borderRadius: '10px' },
  fleetGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' },
  fleetItem: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', padding: '8px 10px' },
  fleetLabel: { fontSize: '9px', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '2px' },
  fleetVal: { fontSize: '12px', color: '#f8fafc' }
};