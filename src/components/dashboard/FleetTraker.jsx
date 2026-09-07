import React from 'react';

export default function FleetTracker({ fleet, emergencyCorridor, onTriggerEmergency }) {
  const fleetList = fleet || [
    {
      id: "AMB-101",
      type: "Ambulance",
      status: emergencyCorridor ? "Green Corridor Active" : "Standby",
      location: "North Sector Ave 4",
      targetJunction: "Junction 04 (Lane 1)",
      eta: "2 mins",
      priority: "Critical"
    },
    {
      id: "POL-204",
      type: "Police Interceptor",
      status: "Patrolling",
      location: "East Ring Road",
      targetJunction: "Junction 04 (Lane 2)",
      eta: "5 mins",
      priority: "Standard"
    },
    {
      id: "BUS-EV88",
      type: "Rapid Transit EV",
      status: "En Route",
      location: "Central Corridor",
      targetJunction: "Junction 04 (Lane 1)",
      eta: "1 min",
      priority: "Medium"
    }
  ];

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.headerLeft}>
          <span style={styles.iconBadge}>🛰️</span>
          <h3 style={styles.cardTitle}>Municipal Emergency & Transit Fleet</h3>
        </div>
        <span style={styles.activeCount}>{fleetList.length} Units Active</span>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>VEHICLE ID</th>
              <th style={styles.th}>TYPE</th>
              <th style={styles.th}>TARGET JUNCTION</th>
              <th style={styles.th}>STATUS</th>
              <th style={styles.th}>ETA</th>
              <th style={styles.th}>PRIORITY</th>
            </tr>
          </thead>
          <tbody>
            {fleetList.map((unit) => (
              <tr key={unit.id} style={styles.tr}>
                <td style={{ ...styles.td, fontWeight: '700', color: '#f8fafc' }}>{unit.id}</td>
                <td style={styles.td}>
                  <span style={styles.typeIcon}>
                    {unit.type.includes('Ambulance') ? '🚑' : unit.type.includes('Police') ? '🚓' : '🚌'}
                  </span>
                  {unit.type}
                </td>
                <td style={{ ...styles.td, color: '#94a3b8' }}>{unit.targetJunction}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.statusTag,
                      backgroundColor: unit.status.includes('Active')
                        ? 'rgba(239, 68, 68, 0.15)'
                        : unit.status === 'Patrolling'
                        ? 'rgba(56, 189, 248, 0.15)'
                        : 'rgba(16, 185, 129, 0.15)',
                      color: unit.status.includes('Active')
                        ? '#ef4444'
                        : unit.status === 'Patrolling'
                        ? '#38bdf8'
                        : '#34d399',
                      borderColor: unit.status.includes('Active') ? '#ef4444' : '#334155'
                    }}
                  >
                    {unit.status}
                  </span>
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace', color: '#fbbf24', fontWeight: 'bold' }}>{unit.eta}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.priorityPill,
                      backgroundColor: unit.priority === 'Critical' ? '#7f1d1d' : unit.priority === 'Medium' ? '#075985' : '#1e293b',
                      color: unit.priority === 'Critical' ? '#fca5a5' : unit.priority === 'Medium' ? '#7dd3fc' : '#94a3b8'
                    }}
                  >
                    {unit.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    alignItems: 'center',
    borderBottom: '1px solid #1e293b',
    paddingBottom: '12px'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  iconBadge: {
    fontSize: '16px'
  },
  cardTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: '#f8fafc'
  },
  activeCount: {
    fontSize: '11px',
    color: '#38bdf8',
    backgroundColor: '#020617',
    border: '1px solid #1e293b',
    padding: '4px 10px',
    borderRadius: '12px',
    fontWeight: '700'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12px',
    textAlign: 'left'
  },
  thRow: {
    borderBottom: '1px solid #1e293b'
  },
  th: {
    padding: '8px 10px',
    color: '#64748b',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.5px'
  },
  tr: {
    borderBottom: '1px solid #0b1120',
    transition: 'background-color 0.2s ease'
  },
  td: {
    padding: '10px',
    verticalAlign: 'middle'
  },
  typeIcon: {
    marginRight: '6px'
  },
  statusTag: {
    fontSize: '10px',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '6px',
    border: '1px solid'
  },
  priorityPill: {
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '4px'
  }
};
