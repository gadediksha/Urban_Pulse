import React from 'react';

export default function ControlPanel({ 
  lanes, setLanes,
  parkingSlot1, setParkingSlot1, 
  parkingSlot2, setParkingSlot2, 
  emergencyCorridor, setEmergencyCorridor, 
  autoSimulate, setAutoSimulate 
}) {
  const handleCountChange = (index, value) => {
    setAutoSimulate(false);
    setLanes(prev => {
      const updated = [...prev];
      updated[index].count = Number(value);
      return updated;
    });
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>Live Simulation Panel (4 Lanes)</h3>
        <button 
          onClick={() => setAutoSimulate(!autoSimulate)} 
          style={{ ...styles.btnSmall, backgroundColor: autoSimulate ? '#0369a1' : '#334155' }}
        >
          {autoSimulate ? 'Auto Stream: ON' : 'Manual Mode'}
        </button>
      </div>

      {lanes.map((lane, idx) => (
        <div key={lane.id} style={styles.sliderGroup}>
          <div style={styles.sliderHeader}>
            {lane.name}: <strong>{lane.count} vehicles</strong>
          </div>
          <input 
            type="range" min="0" max="25" value={lane.count} 
            onChange={(e) => handleCountChange(idx, e.target.value)}
            style={styles.slider}
          />
        </div>
      ))}

      <div style={styles.toggleRow}>
        <button onClick={() => setParkingSlot1(!parkingSlot1)} style={{ ...styles.toggleBtn, borderColor: parkingSlot1 ? '#ef4444' : '#10b981' }}>
          Slot A-01: {parkingSlot1 ? 'Occupied' : 'Free'}
        </button>
        <button onClick={() => setParkingSlot2(!parkingSlot2)} style={{ ...styles.toggleBtn, borderColor: parkingSlot2 ? '#ef4444' : '#10b981' }}>
          Slot A-02: {parkingSlot2 ? 'Occupied' : 'Free'}
        </button>
      </div>

      <button 
        onClick={() => setEmergencyCorridor(!emergencyCorridor)}
        style={{
          ...styles.emergencyBtn,
          backgroundColor: emergencyCorridor ? '#b91c1c' : '#1e293b',
          borderColor: emergencyCorridor ? '#ef4444' : '#334155'
        }}
      >
        {emergencyCorridor ? '🚨 Cancel Emergency Corridor' : '⚡ Trigger Ambulance Green Corridor (Lane 1)'}
      </button>
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  cardTitle: { margin: 0, fontSize: '15px', fontWeight: '600', color: '#e2e8f0' },
  btnSmall: { border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' },
  sliderGroup: { marginBottom: '10px' },
  sliderHeader: { fontSize: '12px', color: '#94a3b8', marginBottom: '4px' },
  slider: { width: '100%', accentColor: '#0284c7', cursor: 'pointer' },
  toggleRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px', marginBottom: '12px' },
  toggleBtn: { backgroundColor: '#020617', border: '1px solid', color: '#f8fafc', padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  emergencyBtn: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid', color: '#ffffff', fontSize: '13px', fontWeight: '700', cursor: 'pointer', marginTop: '6px' }
};