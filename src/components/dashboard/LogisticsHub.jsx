import React, { useState } from 'react';

export default function LogisticsHub({
  freightBays,
  logisticsPriority,
  onToggleLogisticsPriority,
  onAssignBay
}) {
  const [selectedBay, setSelectedBay] = useState('LOG-BAY-B');
  const [vehicleId, setVehicleId] = useState('CARGO-EV99');
  const [cargoType, setCargoType] = useState('Perishable Food & Goods');

  const defaultBays = freightBays || [
    { bayId: "LOG-BAY-A", assignedTo: "EV-TRUCK #44", status: "Loading", eta: "12m", cargo: "Medical Supplies" },
    { bayId: "LOG-BAY-B", assignedTo: "CARGO-VAN #09", status: "Available", eta: "--", cargo: "None" },
    { bayId: "LOG-BAY-C", assignedTo: "E-COMM #12", status: "Reserved", eta: "4m", cargo: "Last-Mile Parcels" }
  ];

  const handleBooking = (e) => {
    e.preventDefault();
    if (onAssignBay) {
      onAssignBay({
        bayId: selectedBay,
        assignedTo: vehicleId,
        cargo: cargoType,
        status: "Reserved"
      });
    }
  };

  return (
    <div style={styles.container}>
      {/* Top Banner */}
      <div style={styles.banner}>
        <div>
          <div style={styles.tag}>SIH THEME: TRANSPORTATION & LOGISTICS INFRASTRUCTURE</div>
          <h2 style={styles.title}>🚚 Smart Urban Freight & Logistics Corridor Controller</h2>
          <p style={styles.desc}>
            Alleviating municipal transport stress by synchronizing commercial EV freight, dynamic loading bay allocation, and automated Green Wave clearance.
          </p>
        </div>
        <button
          onClick={() => onToggleLogisticsPriority(!logisticsPriority)}
          style={{
            ...styles.priorityBtn,
            backgroundColor: logisticsPriority ? '#0284c7' : '#1e293b',
            borderColor: logisticsPriority ? '#38bdf8' : '#334155',
            boxShadow: logisticsPriority ? '0 0 16px rgba(56, 189, 248, 0.5)' : 'none'
          }}
        >
          {logisticsPriority ? '⚡ FREIGHT GREEN WAVE: ACTIVE (LANE 2)' : '🚛 TRIGGER FREIGHT GREEN WAVE'}
        </button>
      </div>

      <div style={styles.grid}>
        {/* Left Column: Smart Loading Bays */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Dynamic Loading/Unloading Freight Bays</h3>
            <span style={styles.counterPill}>3 Municipal Hubs</span>
          </div>

          <div style={styles.bayList}>
            {defaultBays.map((bay) => (
              <div
                key={bay.bayId}
                style={{
                  ...styles.bayCard,
                  borderColor: bay.status === 'Available' ? '#10b981' : bay.status === 'Loading' ? '#38bdf8' : '#f59e0b'
                }}
              >
                <div style={styles.bayTop}>
                  <strong style={{ color: '#f8fafc', fontSize: '13px' }}>{bay.bayId}</strong>
                  <span
                    style={{
                      ...styles.statusTag,
                      backgroundColor:
                        bay.status === 'Available'
                          ? 'rgba(16, 185, 129, 0.15)'
                          : bay.status === 'Loading'
                          ? 'rgba(56, 189, 248, 0.15)'
                          : 'rgba(245, 158, 11, 0.15)',
                      color:
                        bay.status === 'Available'
                          ? '#34d399'
                          : bay.status === 'Loading'
                          ? '#38bdf8'
                          : '#fbbf24',
                      borderColor:
                        bay.status === 'Available'
                          ? '#059669'
                          : bay.status === 'Loading'
                          ? '#0284c7'
                          : '#d97706'
                    }}
                  >
                    {bay.status}
                  </span>
                </div>

                <div style={styles.bayDetails}>
                  <div><span style={styles.label}>Vehicle:</span> <strong>{bay.assignedTo}</strong></div>
                  <div><span style={styles.label}>Cargo:</span> <span>{bay.cargo}</span></div>
                  <div><span style={styles.label}>Est. Departure:</span> <span style={{ fontFamily: 'monospace', color: '#fbbf24' }}>{bay.eta}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Dispatch & Dynamic Bay Reservation */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Instant Freight Bay Dispatch</h3>
            <span style={styles.counterPill}>AI Route Sync</span>
          </div>

          <form onSubmit={handleBooking} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.formLabel}>Target Freight Bay</label>
              <select
                value={selectedBay}
                onChange={(e) => setSelectedBay(e.target.value)}
                style={styles.select}
              >
                <option value="LOG-BAY-A">LOG-BAY-A (North Terminal)</option>
                <option value="LOG-BAY-B">LOG-BAY-B (Central Junction 04)</option>
                <option value="LOG-BAY-C">LOG-BAY-C (East Logistics Ring)</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.formLabel}>Vehicle ID / Fleet Unit</label>
              <input
                type="text"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                style={styles.input}
                placeholder="e.g. EV-CARGO-108"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.formLabel}>Cargo Classification</label>
              <input
                type="text"
                value={cargoType}
                onChange={(e) => setCargoType(e.target.value)}
                style={styles.input}
                placeholder="e.g. Cold-chain pharma, Retail"
              />
            </div>

            <button type="submit" style={styles.submitBtn}>
              📥 Reserve Loading Bay & Grant Corridor Clearance
            </button>
          </form>

          {/* Quick Metrics */}
          <div style={styles.logisticsMetrics}>
            <div style={styles.metricBox}>
              <div style={styles.metricNum}>+41.5%</div>
              <div style={styles.metricLabel}>Last-Mile Dispatch Speed</div>
            </div>
            <div style={styles.metricBox}>
              <div style={{ ...styles.metricNum, color: '#10b981' }}>0 min</div>
              <div style={styles.metricLabel}>Double-Parking Road Blockage</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  banner: {
    backgroundColor: '#090d16',
    border: '1px solid #1e293b',
    borderRadius: '14px',
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px'
  },
  tag: {
    fontSize: '11px',
    fontWeight: '800',
    color: '#38bdf8',
    letterSpacing: '0.8px',
    marginBottom: '6px'
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '800',
    color: '#f8fafc'
  },
  desc: {
    margin: '6px 0 0 0',
    fontSize: '12px',
    color: '#94a3b8',
    maxWidth: '620px'
  },
  priorityBtn: {
    padding: '12px 20px',
    borderRadius: '10px',
    border: '1px solid',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '800',
    cursor: 'pointer',
    letterSpacing: '0.4px',
    transition: 'all 0.3s ease'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '20px'
  },
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
  cardTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '700',
    color: '#e2e8f0'
  },
  counterPill: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#38bdf8',
    backgroundColor: '#020617',
    border: '1px solid #1e293b',
    padding: '4px 8px',
    borderRadius: '6px'
  },
  bayList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  bayCard: {
    backgroundColor: '#020617',
    border: '1px solid',
    borderRadius: '10px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  bayTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statusTag: {
    fontSize: '10px',
    fontWeight: '800',
    padding: '3px 8px',
    borderRadius: '6px',
    border: '1px solid'
  },
  bayDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '8px',
    fontSize: '11px',
    color: '#cbd5e1'
  },
  label: {
    color: '#64748b'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  formLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#94a3b8'
  },
  input: {
    backgroundColor: '#020617',
    border: '1px solid #334155',
    color: '#f8fafc',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '12px',
    outline: 'none'
  },
  select: {
    backgroundColor: '#020617',
    border: '1px solid #334155',
    color: '#f8fafc',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '12px',
    outline: 'none'
  },
  submitBtn: {
    marginTop: '6px',
    backgroundColor: '#0284c7',
    border: '1px solid #38bdf8',
    color: '#ffffff',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '800',
    cursor: 'pointer'
  },
  logisticsMetrics: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginTop: '10px'
  },
  metricBox: {
    backgroundColor: '#020617',
    border: '1px solid #1e293b',
    borderRadius: '8px',
    padding: '12px',
    textAlign: 'center'
  },
  metricNum: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#38bdf8'
  },
  metricLabel: {
    fontSize: '10px',
    color: '#64748b',
    marginTop: '4px'
  }
};
