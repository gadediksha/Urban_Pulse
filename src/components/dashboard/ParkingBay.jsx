import React from 'react';

export default function ParkingBay({ parkingSlot1, parkingSlot2 }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <h3 style={styles.cardTitle}>Ultrasonic Smart Parking Bay</h3>
          <span style={styles.subtext}>HC-SR04 Proximity Sensor Array</span>
        </div>
        <span style={styles.statusPill}>
          {(!parkingSlot1 && !parkingSlot2) ? '2 SPOTS FREE' : (!parkingSlot1 || !parkingSlot2) ? '1 SPOT FREE' : 'BAY FULL'}
        </span>
      </div>

      <div style={styles.parkingGrid}>
        {/* Bay 1 */}
        <div style={{ ...styles.slotCard, borderColor: parkingSlot1 ? '#ef4444' : '#10b981', backgroundColor: parkingSlot1 ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)' }}>
          <div style={styles.slotTopRow}>
            <span style={styles.slotTag}>BAY #01</span>
            <span style={{ fontSize: '16px' }}>{parkingSlot1 ? '🚗' : '🅿️'}</span>
          </div>
          <div style={{ ...styles.slotText, color: parkingSlot1 ? '#ef4444' : '#10b981' }}>
            {parkingSlot1 ? 'OCCUPIED' : 'AVAILABLE'}
          </div>
          <div style={styles.slotDetail}>
            <span style={styles.sensorLabel}>Sonar Range:</span>
            <strong style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>{parkingSlot1 ? '4.2 cm' : '> 50.0 cm'}</strong>
          </div>
        </div>

        {/* Bay 2 */}
        <div style={{ ...styles.slotCard, borderColor: parkingSlot2 ? '#ef4444' : '#10b981', backgroundColor: parkingSlot2 ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)' }}>
          <div style={styles.slotTopRow}>
            <span style={styles.slotTag}>BAY #02</span>
            <span style={{ fontSize: '16px' }}>{parkingSlot2 ? '🚙' : '🅿️'}</span>
          </div>
          <div style={{ ...styles.slotText, color: parkingSlot2 ? '#ef4444' : '#10b981' }}>
            {parkingSlot2 ? 'OCCUPIED' : 'AVAILABLE'}
          </div>
          <div style={styles.slotDetail}>
            <span style={styles.sensorLabel}>Sonar Range:</span>
            <strong style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>{parkingSlot2 ? '6.8 cm' : '> 50.0 cm'}</strong>
          </div>
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
    gap: '14px'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '700',
    color: '#e2e8f0'
  },
  subtext: {
    fontSize: '11px',
    color: '#64748b'
  },
  statusPill: {
    fontSize: '10px',
    fontWeight: '700',
    backgroundColor: '#020617',
    border: '1px solid #1e293b',
    color: '#38bdf8',
    padding: '4px 8px',
    borderRadius: '6px'
  },
  parkingGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  },
  slotCard: {
    border: '1px solid',
    borderRadius: '10px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    transition: 'all 0.3s ease'
  },
  slotTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  slotTag: {
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: '700'
  },
  slotText: {
    fontSize: '16px',
    fontWeight: '800',
    margin: '4px 0'
  },
  slotDetail: {
    fontSize: '11px',
    color: '#64748b',
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid #1e293b',
    paddingTop: '6px'
  },
  sensorLabel: {
    color: '#64748b'
  }
};