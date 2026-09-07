import React, { useState } from 'react';

export default function TechnicalArchitecture({
  lanes,
  airMetrics,
  waterMetrics,
  bin1Fill,
  soundDb = 68.2,
  emergencyCorridor
}) {
  const [packetStreamActive, setPacketStreamActive] = useState(true);

  const totalCars = lanes ? lanes.reduce((s, l) => s + l.count, 0) : 27;

  return (
    <div style={styles.container}>
      {/* Top Presentation Header matching SIH Slide */}
      <div style={styles.headerBanner}>
        <div style={styles.headerLeft}>
          <div style={styles.badgeRow}>
            <span style={styles.sihBadge}>SMART INDIA HACKATHON 2026</span>
            <span style={styles.subTheme}>SLIDE 3: TECHNICAL APPROACH</span>
          </div>
          <h2 style={styles.mainTitle}>URBAN PULSE: TECHNICAL APPROACH & SYSTEM ARCHITECTURE</h2>
          <p style={styles.subtitle}>
            Multi-Tier IoT Sensor Fusion, Edge Telemetry Ingestion, Central AI Processing Engine & Closed-Loop Actuations
          </p>
        </div>

        <div style={styles.headerRight}>
          <button 
            onClick={() => setPacketStreamActive(!packetStreamActive)}
            style={{ 
              ...styles.streamBtn, 
              backgroundColor: packetStreamActive ? '#0284c7' : '#1e293b',
              borderColor: packetStreamActive ? '#38bdf8' : '#334155' 
            }}
          >
            <span style={styles.pulseDot}></span>
            <span>{packetStreamActive ? 'DATA BUS STREAMING (1,480 pkt/s)' : 'PAUSE DATA BUS'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TIER 1: MAIN IOT SENSORS & DATA SOURCES ACROSS ALL MODULES */}
      {/* ========================================================================= */}
      <div style={styles.sectionCard}>
        <div style={styles.sectionHeader}>
          <div>
            <span style={styles.tierTag}>TIER 1 ARCHITECTURE</span>
            <h3 style={styles.sectionTitle}>Main IoT Sensors & Data Sources Across All Modules</h3>
          </div>
          <span style={styles.moduleCount}>6 Core Sensor Modules</span>
        </div>

        <div style={styles.tier1Grid}>
          {/* Module 1: Waste Logistics */}
          <div style={styles.sensorCard}>
            <div style={styles.sensorIcon}>🗑️</div>
            <div style={styles.sensorBody}>
              <h4 style={styles.sensorName}>Waste Logistics</h4>
              <span style={styles.sensorTech}>Ultrasonic Level Sensor</span>
              <p style={styles.sensorDesc}>Monitors fill levels in smart bins & tracks automated dispatch trucks.</p>
              <div style={styles.liveTag}>
                <span style={styles.liveDot}></span>
                <span>Bin Fill: {bin1Fill}%</span>
              </div>
            </div>
          </div>

          {/* Module 2: Water Management */}
          <div style={styles.sensorCard}>
            <div style={styles.sensorIcon}>💧</div>
            <div style={styles.sensorBody}>
              <h4 style={styles.sensorName}>Water Management</h4>
              <span style={styles.sensorTech}>Flow & Pressure Sensor</span>
              <p style={styles.sensorDesc}>Detects pipeline leaks, water purity (pH/TDS) & supply flow rate.</p>
              <div style={styles.liveTag}>
                <span style={styles.liveDot}></span>
                <span>Flow: {waterMetrics?.flowRate || 34.5} L/min • 4.2 Bar</span>
              </div>
            </div>
          </div>

          {/* Module 3: Vehicle Emissions */}
          <div style={styles.sensorCard}>
            <div style={styles.sensorIcon}>🍃</div>
            <div style={styles.sensorBody}>
              <h4 style={styles.sensorName}>Vehicle Emissions</h4>
              <span style={styles.sensorTech}>Gas & NDIR Sensors</span>
              <p style={styles.sensorDesc}>Measures CO2, NO2, PM2.5/PM10 exhaust at main intersections.</p>
              <div style={styles.liveTag}>
                <span style={styles.liveDot}></span>
                <span>CO₂: {airMetrics?.co2 || 420} ppm • AQI: {airMetrics?.aqi || 105}</span>
              </div>
            </div>
          </div>

          {/* Module 4: AI Prediction Engine */}
          <div style={styles.sensorCard}>
            <div style={styles.sensorIcon}>🧠</div>
            <div style={styles.sensorBody}>
              <h4 style={styles.sensorName}>AI Prediction Engine</h4>
              <span style={styles.sensorTech}>Telemetry & Feeds</span>
              <p style={styles.sensorDesc}>Aggregates historical trends, weather & predictive datasets for congestions.</p>
              <div style={styles.liveTag}>
                <span style={styles.liveDot}></span>
                <span>Model Accuracy: 94.2%</span>
              </div>
            </div>
          </div>

          {/* Module 5: Traffic Management */}
          <div style={styles.sensorCard}>
            <div style={styles.sensorIcon}>🚦</div>
            <div style={styles.sensorBody}>
              <h4 style={styles.sensorName}>Traffic Management</h4>
              <span style={styles.sensorTech}>AI CCTV Computer Vision</span>
              <p style={styles.sensorDesc}>Vehicle counting, speed measurement & bottleneck alerts at 4-way junctions.</p>
              <div style={styles.liveTag}>
                <span style={styles.liveDot}></span>
                <span>Active Density: {totalCars} Vehicles</span>
              </div>
            </div>
          </div>

          {/* Module 6: Urban Monitoring */}
          <div style={styles.sensorCard}>
            <div style={styles.sensorIcon}>🏙️</div>
            <div style={styles.sensorBody}>
              <h4 style={styles.sensorName}>Urban Monitoring</h4>
              <span style={styles.sensorTech}>GPS & Acoustic Sensors</span>
              <p style={styles.sensorDesc}>City noise (acoustic dB), structural health & real-time surveillance.</p>
              <div style={styles.liveTag}>
                <span style={styles.liveDot}></span>
                <span>Noise: {soundDb} dB • Pier Vibe: Nominal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TIER 2: END-TO-END DATA PROCESSING & ACTION FLOWCHART */}
      {/* ========================================================================= */}
      <div style={styles.sectionCard}>
        <div style={styles.sectionHeader}>
          <div>
            <span style={styles.tierTag}>TIER 2 ARCHITECTURE</span>
            <h3 style={styles.sectionTitle}>End-to-End Data Processing & Action Flowchart</h3>
          </div>
          <span style={styles.flowBadge}>INTEGRATED SMART CITY ECOSYSTEM</span>
        </div>

        <div style={styles.flowGrid}>
          {/* Stage 1: Data Ingestion Layer */}
          <div style={styles.flowCard}>
            <div style={styles.stageHeader}>
              <span style={styles.stageNum}>STAGE 1</span>
              <h4 style={styles.stageTitle}>Data Ingestion Layer</h4>
            </div>
            <div style={styles.bulletList}>
              <div style={styles.bulletItem}>
                <span style={styles.bulletDot}>📡</span>
                <span><strong>Real-time MQTT / HTTP telemetry</strong> from IoT sensors</span>
              </div>
              <div style={styles.bulletItem}>
                <span style={styles.bulletDot}>📹</span>
                <span><strong>High-speed CCTV video feeds</strong> & GPS spatial coordinates</span>
              </div>
              <div style={styles.bulletItem}>
                <span style={styles.bulletDot}>🛰️</span>
                <span><strong>Satellite weather & GIS mapping</strong> overlay data</span>
              </div>
            </div>
            <div style={styles.stageFooter}>
              <span>Ingestion Latency: &lt; 18ms</span>
              <span style={{ color: '#10b981' }}>● 100% Online</span>
            </div>
          </div>

          {/* Arrow 1 */}
          <div style={styles.arrowBox}>
            <div style={styles.arrowLine}></div>
            <span style={styles.arrowSymbol}>➔</span>
            <span style={styles.arrowLabel}>Clean Telemetry</span>
          </div>

          {/* Stage 2: Processing & AI Engine */}
          <div style={styles.flowCard}>
            <div style={styles.stageHeader}>
              <span style={{ ...styles.stageNum, backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' }}>STAGE 2</span>
              <h4 style={styles.stageTitle}>Processing & AI Engine</h4>
            </div>
            <div style={styles.bulletList}>
              <div style={styles.bulletItem}>
                <span style={styles.bulletDot}>🧹</span>
                <span><strong>Data Processing:</strong> Noise filtering, cleaning & data fusion</span>
              </div>
              <div style={styles.bulletItem}>
                <span style={styles.bulletDot}>🤖</span>
                <span><strong>AI Engine:</strong> Predictive ML models for congestion & spill over</span>
              </div>
              <div style={styles.bulletItem}>
                <span style={styles.bulletDot}>🚨</span>
                <span><strong>Automated anomaly detection</strong> & alert trigger systems</span>
              </div>
            </div>
            <div style={styles.stageFooter}>
              <span>Inference Time: 4.2ms</span>
              <span style={{ color: '#a855f7' }}>● Neural Grid v3.1</span>
            </div>
          </div>

          {/* Arrow 2 */}
          <div style={styles.arrowBox}>
            <div style={styles.arrowLine}></div>
            <span style={styles.arrowSymbol}>➔</span>
            <span style={styles.arrowLabel}>Actuation Triggers</span>
          </div>

          {/* Stage 3: Action & Visualization */}
          <div style={styles.flowCard}>
            <div style={styles.stageHeader}>
              <span style={{ ...styles.stageNum, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>STAGE 3</span>
              <h4 style={styles.stageTitle}>Action & Visualization</h4>
            </div>
            <div style={styles.bulletList}>
              <div style={styles.bulletItem}>
                <span style={styles.bulletDot}>🚦</span>
                <span><strong>Smart Action:</strong> Dynamic traffic light timing adjustment</span>
              </div>
              <div style={styles.bulletItem}>
                <span style={styles.bulletDot}>🚛</span>
                <span><strong>Automated dispatch</strong> for waste trucks & maintenance</span>
              </div>
              <div style={styles.bulletItem}>
                <span style={styles.bulletDot}>🖥️</span>
                <span><strong>Digital Twin:</strong> Real-time urban monitoring dashboard</span>
              </div>
            </div>
            <div style={styles.stageFooter}>
              <span>Status: {emergencyCorridor ? '🚨 Emergency Mode' : '⚡ Autonomous AI Grid'}</span>
              <span style={{ color: '#10b981' }}>● Closed-Loop Loopback</span>
            </div>
          </div>
        </div>

        {/* Integrated Ecosystem Summary Banner */}
        <div style={styles.ecosystemBanner}>
          <div style={styles.ecoLeft}>
            <span style={styles.ecoBadge}>CENTRAL AI DATA PROCESSING HUB</span>
            <h4 style={styles.ecoTitle}>Integrated Smart City Hardware-Software Feedback Loop</h4>
            <p style={styles.ecoSub}>
              Ultrasonic Level Sensors + Water Quality Sensors + Vehicle Emission Gas Sensors + AI CCTV Cameras feed directly into the edge hub, dynamically triggering municipal green wave corridors, automated truck dispatch, and acoustic anomaly alarms.
            </p>
          </div>
          <div style={styles.ecoStats}>
            <div style={styles.ecoStatItem}>
              <span style={styles.ecoStatNum}>99.98%</span>
              <span style={styles.ecoStatLbl}>Grid Reliability</span>
            </div>
            <div style={styles.ecoStatItem}>
              <span style={styles.ecoStatNum}>-38%</span>
              <span style={styles.ecoStatLbl}>Congestion Delay</span>
            </div>
            <div style={styles.ecoStatItem}>
              <span style={styles.ecoStatNum}>-18.2 kg</span>
              <span style={styles.ecoStatLbl}>CO₂ / Hr Offset</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '16px' },
  headerBanner: {
    backgroundColor: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '14px',
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px'
  },
  headerLeft: { maxWidth: '750px' },
  badgeRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' },
  sihBadge: { fontSize: '10px', fontWeight: '800', backgroundColor: '#f59e0b', color: '#020617', padding: '3px 8px', borderRadius: '6px', letterSpacing: '0.6px' },
  subTheme: { fontSize: '10px', fontWeight: '700', color: '#38bdf8', letterSpacing: '0.5px' },
  mainTitle: { margin: '0 0 6px 0', fontSize: '20px', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.3px' },
  subtitle: { margin: 0, fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' },
  headerRight: { display: 'flex', alignItems: 'center' },
  streamBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', border: '1px solid', color: '#ffffff', fontSize: '11px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s ease' },
  pulseDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' },
  sectionCard: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  tierTag: { fontSize: '10px', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.8px', display: 'block', marginBottom: '4px' },
  sectionTitle: { margin: 0, fontSize: '16px', fontWeight: '700', color: '#f1f5f9' },
  moduleCount: { fontSize: '11px', color: '#94a3b8', backgroundColor: '#020617', border: '1px solid #1e293b', padding: '4px 10px', borderRadius: '8px', fontWeight: '600' },
  tier1Grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' },
  sensorCard: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px', display: 'flex', gap: '14px', alignItems: 'flex-start' },
  sensorIcon: { fontSize: '28px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  sensorBody: { flex: 1 },
  sensorName: { margin: '0 0 2px 0', fontSize: '14px', fontWeight: '700', color: '#f8fafc' },
  sensorTech: { fontSize: '11px', fontWeight: '600', color: '#38bdf8', display: 'block', marginBottom: '6px' },
  sensorDesc: { margin: '0 0 10px 0', fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' },
  liveTag: { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #059669', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' },
  liveDot: { width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' },
  flowBadge: { fontSize: '10px', fontWeight: '700', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '4px 10px', borderRadius: '8px' },
  flowGrid: { display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: '12px', alignItems: 'center', marginBottom: '16px' },
  flowCard: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  stageHeader: { marginBottom: '12px' },
  stageNum: { fontSize: '9px', fontWeight: '800', backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.6px', display: 'inline-block', marginBottom: '4px' },
  stageTitle: { margin: 0, fontSize: '14px', fontWeight: '700', color: '#f8fafc' },
  bulletList: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' },
  bulletItem: { display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' },
  bulletDot: { fontSize: '13px', flexShrink: 0 },
  stageFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#64748b', fontWeight: '600', borderTop: '1px solid #1e293b', paddingTop: '8px' },
  arrowBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px' },
  arrowLine: { width: '2px', height: '20px', backgroundColor: '#334155' },
  arrowSymbol: { color: '#38bdf8', fontSize: '20px', fontWeight: '800' },
  arrowLabel: { fontSize: '9px', color: '#64748b', fontWeight: '700', whiteSpace: 'nowrap' },
  ecosystemBanner: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' },
  ecoLeft: { maxWidth: '700px' },
  ecoBadge: { fontSize: '9px', fontWeight: '800', color: '#a855f7', letterSpacing: '0.8px', display: 'block', marginBottom: '4px' },
  ecoTitle: { margin: '0 0 6px 0', fontSize: '14px', fontWeight: '700', color: '#f8fafc' },
  ecoSub: { margin: 0, fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' },
  ecoStats: { display: 'flex', gap: '16px' },
  ecoStatItem: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px 14px', textAlign: 'center' },
  ecoStatNum: { fontSize: '18px', fontWeight: '800', color: '#38bdf8', display: 'block' },
  ecoStatLbl: { fontSize: '9px', color: '#64748b', fontWeight: '600' }
};
