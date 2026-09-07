import React from 'react';

export default function InteractiveRoadMap({
  lane1Count,
  lane2Count,
  lane1Signal,
  lane2Signal,
  emergencyCorridor,
  parkingSlot1,
  parkingSlot2,
  dynamicGreenSec
}) {
  const getSignalColor = (signal) => {
    if (signal === 'GREEN') return '#10b981';
    if (signal === 'YELLOW') return '#facc15';
    return '#ef4444';
  };

  // Generate car dots for Lane 1 (North-South)
  const lane1Cars = Array.from({ length: Math.min(8, lane1Count) }, (_, i) => i);
  // Generate car dots for Lane 2 (East-West)
  const lane2Cars = Array.from({ length: Math.min(8, lane2Count) }, (_, i) => i);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>
          <span style={styles.radarDot}></span>
          <span>Live 2D Intersection Grid (Junction 04)</span>
        </div>
        <div style={styles.modePill}>
          {emergencyCorridor ? '🚨 AMBULANCE CLEARANCE ACTIVE' : '⚡ AI ACTUATED FLOW'}
        </div>
      </div>

      <div style={styles.canvasArea}>
        {/* Radar Grid Background Lines */}
        <div style={styles.gridOverlay}></div>

        {/* ================= NORTH-SOUTH ROAD (LANE 1) ================= */}
        <div style={styles.northSouthRoad}>
          <div style={styles.roadMarkingNS}></div>
          <div style={styles.laneLabelTop}>NORTH (LANE 1) • {lane1Count} CARS</div>
          <div style={styles.laneLabelBottom}>SOUTHBOUND</div>

          {/* Cars on Northbound/Southbound */}
          <div style={styles.trafficFlowNS}>
            {emergencyCorridor ? (
              <div style={styles.ambulanceCar}>
                <div style={styles.sirenLight}></div>
                <span style={{ fontSize: '18px' }}>🚑</span>
                <div style={styles.sirenPulse}></div>
              </div>
            ) : null}

            {lane1Cars.map((_, idx) => (
              <div
                key={`car-ns-${idx}`}
                style={{
                  ...styles.carNS,
                  top: `${15 + idx * 10}%`,
                  animation: lane1Signal === 'GREEN' ? `moveDown 3s linear infinite ${idx * 0.4}s` : 'none',
                  backgroundColor: idx % 3 === 0 ? '#38bdf8' : idx % 3 === 1 ? '#e2e8f0' : '#818cf8'
                }}
              >
                <div style={styles.carLightFront}></div>
              </div>
            ))}
          </div>

          {/* Traffic Light Node 1 (North) */}
          <div style={styles.trafficLightPoleNS}>
            <div style={{ ...styles.lightBulb, backgroundColor: lane1Signal === 'RED' ? '#ef4444' : '#450a0a', boxShadow: lane1Signal === 'RED' ? '0 0 12px #ef4444' : 'none' }}></div>
            <div style={{ ...styles.lightBulb, backgroundColor: lane1Signal === 'YELLOW' ? '#facc15' : '#422006', boxShadow: lane1Signal === 'YELLOW' ? '0 0 12px #facc15' : 'none' }}></div>
            <div style={{ ...styles.lightBulb, backgroundColor: lane1Signal === 'GREEN' ? '#10b981' : '#022c22', boxShadow: lane1Signal === 'GREEN' ? '0 0 12px #10b981' : 'none' }}></div>
            <span style={styles.timerBadge}>{lane1Signal === 'GREEN' ? `${dynamicGreenSec}s` : lane1Signal === 'YELLOW' ? '2s' : 'WAIT'}</span>
          </div>
        </div>

        {/* ================= EAST-WEST ROAD (LANE 2) ================= */}
        <div style={styles.eastWestRoad}>
          <div style={styles.roadMarkingEW}></div>
          <div style={styles.laneLabelLeft}>WESTBOUND</div>
          <div style={styles.laneLabelRight}>EAST (LANE 2) • {lane2Count} CARS</div>

          {/* Cars on East-West */}
          <div style={styles.trafficFlowEW}>
            {lane2Cars.map((_, idx) => (
              <div
                key={`car-ew-${idx}`}
                style={{
                  ...styles.carEW,
                  left: `${12 + idx * 11}%`,
                  animation: lane2Signal === 'GREEN' ? `moveRight 3s linear infinite ${idx * 0.4}s` : 'none',
                  backgroundColor: idx % 3 === 0 ? '#fbbf24' : idx % 3 === 1 ? '#a78bfa' : '#34d399'
                }}
              >
                <div style={styles.carLightFrontEW}></div>
              </div>
            ))}
          </div>

          {/* Traffic Light Node 2 (East) */}
          <div style={styles.trafficLightPoleEW}>
            <div style={{ ...styles.lightBulb, backgroundColor: lane2Signal === 'RED' ? '#ef4444' : '#450a0a', boxShadow: lane2Signal === 'RED' ? '0 0 12px #ef4444' : 'none' }}></div>
            <div style={{ ...styles.lightBulb, backgroundColor: lane2Signal === 'YELLOW' ? '#facc15' : '#422006', boxShadow: lane2Signal === 'YELLOW' ? '0 0 12px #facc15' : 'none' }}></div>
            <div style={{ ...styles.lightBulb, backgroundColor: lane2Signal === 'GREEN' ? '#10b981' : '#022c22', boxShadow: lane2Signal === 'GREEN' ? '0 0 12px #10b981' : 'none' }}></div>
            <span style={styles.timerBadge}>{lane2Signal === 'GREEN' ? `${dynamicGreenSec}s` : lane2Signal === 'YELLOW' ? '2s' : 'WAIT'}</span>
          </div>
        </div>

        {/* Intersection Center Hub */}
        <div style={styles.intersectionBox}>
          <div style={styles.hubCore}>
            <div style={{ ...styles.corePulse, borderColor: getSignalColor(lane1Signal) }}></div>
            <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>J-04</span>
          </div>
        </div>

        {/* Top-Right: Smart Parking Bay Simulator */}
        <div style={styles.parkingLotMini}>
          <div style={styles.parkingTitle}>P-BAY SENSORS</div>
          <div style={styles.parkingSlotsRow}>
            <div style={{ ...styles.miniSlot, borderColor: parkingSlot1 ? '#ef4444' : '#10b981', backgroundColor: parkingSlot1 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)' }}>
              <span style={{ fontSize: '9px', color: '#94a3b8' }}>#01</span>
              <span>{parkingSlot1 ? '🚗' : '🅿️ FREE'}</span>
            </div>
            <div style={{ ...styles.miniSlot, borderColor: parkingSlot2 ? '#ef4444' : '#10b981', backgroundColor: parkingSlot2 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)' }}>
              <span style={{ fontSize: '9px', color: '#94a3b8' }}>#02</span>
              <span>{parkingSlot2 ? '🚙' : '🅿️ FREE'}</span>
            </div>
          </div>
        </div>

        {/* Live Legend */}
        <div style={styles.bottomLegend}>
          <span style={styles.legendItem}><span style={{ ...styles.legendDot, backgroundColor: '#10b981' }}></span> Green Corridor Open</span>
          <span style={styles.legendItem}><span style={{ ...styles.legendDot, backgroundColor: '#ef4444' }}></span> Held In Queue</span>
          <span style={styles.legendItem}><span style={{ ...styles.legendDot, backgroundColor: '#38bdf8' }}></span> Ultrasonic Active</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '14px',
    padding: '16px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '8px',
    borderBottom: '1px solid #1e293b'
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#e2e8f0'
  },
  radarDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#38bdf8',
    boxShadow: '0 0 8px #38bdf8'
  },
  modePill: {
    fontSize: '11px',
    fontWeight: '700',
    backgroundColor: '#020617',
    border: '1px solid #334155',
    color: '#38bdf8',
    padding: '4px 10px',
    borderRadius: '12px'
  },
  canvasArea: {
    position: 'relative',
    height: '340px',
    backgroundColor: '#050811',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid #1e293b'
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
    backgroundSize: '20px 20px',
    opacity: 0.4
  },
  northSouthRoad: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: '80px',
    transform: 'translateX(-50%)',
    backgroundColor: '#111827',
    borderLeft: '2px solid #334155',
    borderRight: '2px solid #334155'
  },
  roadMarkingNS: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: '2px',
    backgroundImage: 'linear-gradient(to bottom, #fbbf24 50%, transparent 50%)',
    backgroundSize: '2px 16px',
    transform: 'translateX(-50%)'
  },
  eastWestRoad: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: '80px',
    transform: 'translateY(-50%)',
    backgroundColor: '#111827',
    borderTop: '2px solid #334155',
    borderBottom: '2px solid #334155'
  },
  roadMarkingEW: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: '2px',
    backgroundImage: 'linear-gradient(to right, #fbbf24 50%, transparent 50%)',
    backgroundSize: '16px 2px',
    transform: 'translateY(-50%)'
  },
  intersectionBox: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: '80px',
    height: '80px',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#0d131f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  },
  hubCore: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#090d16',
    border: '2px solid #38bdf8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  corePulse: {
    position: 'absolute',
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    border: '1px solid',
    opacity: 0.6
  },
  laneLabelTop: {
    position: 'absolute',
    top: '6px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '9px',
    fontWeight: '800',
    color: '#94a3b8',
    whiteSpace: 'nowrap',
    zIndex: 5
  },
  laneLabelBottom: {
    position: 'absolute',
    bottom: '6px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '8px',
    color: '#64748b',
    zIndex: 5
  },
  laneLabelLeft: {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '8px',
    color: '#64748b',
    zIndex: 5
  },
  laneLabelRight: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '9px',
    fontWeight: '800',
    color: '#94a3b8',
    zIndex: 5
  },
  trafficFlowNS: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  trafficFlowEW: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  carNS: {
    position: 'absolute',
    left: '20px',
    width: '16px',
    height: '24px',
    borderRadius: '4px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
    transition: 'all 0.3s ease'
  },
  carLightFront: {
    position: 'absolute',
    bottom: '0px',
    left: '2px',
    right: '2px',
    height: '2px',
    backgroundColor: '#fef08a'
  },
  carEW: {
    position: 'absolute',
    top: '20px',
    width: '24px',
    height: '16px',
    borderRadius: '4px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
    transition: 'all 0.3s ease'
  },
  carLightFrontEW: {
    position: 'absolute',
    right: '0px',
    top: '2px',
    bottom: '2px',
    width: '2px',
    backgroundColor: '#fef08a'
  },
  ambulanceCar: {
    position: 'absolute',
    left: '18px',
    top: '30%',
    zIndex: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sirenLight: {
    position: 'absolute',
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: 'rgba(239, 68, 68, 0.4)',
    boxShadow: '0 0 16px #ef4444'
  },
  trafficLightPoleNS: {
    position: 'absolute',
    top: '60px',
    right: '-32px',
    backgroundColor: '#090d16',
    border: '1px solid #334155',
    borderRadius: '12px',
    padding: '4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px',
    zIndex: 15
  },
  trafficLightPoleEW: {
    position: 'absolute',
    bottom: '-32px',
    left: '60px',
    backgroundColor: '#090d16',
    border: '1px solid #334155',
    borderRadius: '12px',
    padding: '4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px',
    zIndex: 15
  },
  lightBulb: {
    width: '10px',
    height: '10px',
    borderRadius: '50%'
  },
  timerBadge: {
    fontSize: '9px',
    fontFamily: 'monospace',
    fontWeight: '800',
    color: '#94a3b8',
    marginTop: '2px'
  },
  parkingLotMini: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: '#090d16',
    border: '1px solid #1e293b',
    borderRadius: '8px',
    padding: '8px 10px',
    zIndex: 12
  },
  parkingTitle: {
    fontSize: '9px',
    fontWeight: '700',
    color: '#64748b',
    marginBottom: '6px'
  },
  parkingSlotsRow: {
    display: 'flex',
    gap: '6px'
  },
  miniSlot: {
    border: '1px solid',
    borderRadius: '6px',
    padding: '4px 6px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    fontSize: '10px',
    fontWeight: '700'
  },
  bottomLegend: {
    position: 'absolute',
    bottom: '8px',
    left: '12px',
    display: 'flex',
    gap: '14px',
    zIndex: 12
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '10px',
    color: '#94a3b8'
  },
  legendDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%'
  }
};
