import React, { useState } from 'react';

export default function HardwareBridge({ iotNodes, lane1Count, lane2Count, parkingSlot1, parkingSlot2 }) {
  const [selectedProtocol, setSelectedProtocol] = useState('MQTT / WebSocket');

  const nodes = iotNodes || [
    { nodeId: "ESP32-J04-N", role: "North Actuator & Sonar", status: "Connected", battery: "98% (Solar)", ping: "14ms", ip: "192.168.1.104" },
    { nodeId: "ESP32-J04-E", role: "East Actuator & Proximity", status: "Connected", battery: "94% (Solar)", ping: "18ms", ip: "192.168.1.105" },
    { nodeId: "CAM-AI-EDGE", role: "YOLOv8 Edge Vision", status: "Streaming", fps: 28.4, confidence: "96.2%", ip: "192.168.1.120" }
  ];

  return (
    <div style={styles.container}>
      {/* Top Header */}
      <div style={styles.banner}>
        <div>
          <div style={styles.tag}>SIH CATEGORY: HARDWARE & EDGE IOT ARCHITECTURE</div>
          <h2 style={styles.title}>🔌 IoT Edge Sensor Nodes & Computer Vision Gateway</h2>
          <p style={styles.desc}>
            Direct interfacing with microcontrollers (ESP32 / Arduino), Ultrasonic HC-SR04 sensors, and Edge Vision AI cameras transmitting real-time telemetry.
          </p>
        </div>

        <div style={styles.protocolBadge}>
          <span style={styles.dot}></span>
          <span>Protocol:</span>
          <select
            value={selectedProtocol}
            onChange={(e) => setSelectedProtocol(e.target.value)}
            style={{
              backgroundColor: '#020617',
              border: 'none',
              color: '#38bdf8',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="MQTT / WebSocket">MQTT / WebSocket (Recommended)</option>
            <option value="ESP-NOW Mesh">ESP-NOW Wireless Mesh</option>
            <option value="REST / HTTP Gateway">REST / HTTP Gateway</option>
            <option value="Serial UART Bridge">Serial UART Bridge</option>
          </select>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Left Column: ESP32 & Camera Edge Nodes */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Physical Edge Microcontroller Nodes</h3>
            <span style={styles.counterPill}>{nodes.length} Nodes Active</span>
          </div>

          <div style={styles.nodeList}>
            {nodes.map((node) => (
              <div key={node.nodeId} style={styles.nodeCard}>
                <div style={styles.nodeTop}>
                  <div style={styles.nodeIdGroup}>
                    <span style={styles.chipIcon}>⚡</span>
                    <div>
                      <div style={styles.nodeId}>{node.nodeId}</div>
                      <div style={styles.nodeRole}>{node.role}</div>
                    </div>
                  </div>
                  <span style={styles.statusPill}>{node.status}</span>
                </div>

                <div style={styles.nodeMetrics}>
                  <div style={styles.metricItem}>
                    <span style={styles.metricKey}>IP Address:</span>
                    <span style={styles.metricVal}>{node.ip}</span>
                  </div>
                  <div style={styles.metricItem}>
                    <span style={styles.metricKey}>Telemetry Ping:</span>
                    <span style={{ ...styles.metricVal, color: '#38bdf8' }}>{node.ping || '15ms'}</span>
                  </div>
                  <div style={styles.metricItem}>
                    <span style={styles.metricKey}>Power Source:</span>
                    <span style={{ ...styles.metricVal, color: '#10b981' }}>{node.battery || '96% (Solar)'}</span>
                  </div>
                  {node.fps && (
                    <div style={styles.metricItem}>
                      <span style={styles.metricKey}>Vision Inference:</span>
                      <span style={{ ...styles.metricVal, color: '#fbbf24' }}>{node.fps} FPS ({node.confidence})</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Simulated Hardware Stream & HC-SR04 Proximity Sensor */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Live Sonar Array & Vision Bounding Feeds</h3>
            <span style={styles.liveTag}>LIVE TELEMETRY</span>
          </div>

          {/* AI Camera Vision Stream Preview */}
          <div style={styles.visionFrame}>
            <div style={styles.camOverlay}>
              <div style={styles.camTop}>
                <span>CAM-04 (NORTH-EAST JUNCTION)</span>
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>● REC</span>
              </div>
              <div style={styles.camStats}>
                <span>YOLOv8-Nano: {lane1Count + lane2Count} Vehicles Detected</span>
                <span>Inference: 32ms</span>
              </div>
            </div>

            {/* Bounding Box Mockup */}
            <div style={styles.boundingBox1}>
              <span style={styles.boxTag}>Car (98%)</span>
            </div>
            <div style={styles.boundingBox2}>
              <span style={{ ...styles.boxTag, backgroundColor: '#0284c7' }}>EV Truck (94%)</span>
            </div>
          </div>

          {/* HC-SR04 Sonar Distance Readings */}
          <div style={styles.sonarSection}>
            <div style={styles.sonarTitle}>HC-SR04 Proximity Distance Readouts (GPIO 18 / 19)</div>
            <div style={styles.sonarRow}>
              <div style={styles.sonarBox}>
                <div style={styles.sonarLabel}>Sensor 01 (Bay A):</div>
                <div style={{ ...styles.sonarVal, color: parkingSlot1 ? '#ef4444' : '#10b981' }}>
                  {parkingSlot1 ? '4.2 cm (ECHO HIGH)' : '78.5 cm (CLEAR)'}
                </div>
              </div>
              <div style={styles.sonarBox}>
                <div style={styles.sonarLabel}>Sensor 02 (Bay B):</div>
                <div style={{ ...styles.sonarVal, color: parkingSlot2 ? '#ef4444' : '#10b981' }}>
                  {parkingSlot2 ? '6.8 cm (ECHO HIGH)' : '82.1 cm (CLEAR)'}
                </div>
              </div>
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
    color: '#34d399',
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
  protocolBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#020617',
    border: '1px solid #1e293b',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#38bdf8'
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    boxShadow: '0 0 8px #10b981'
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
    color: '#34d399',
    backgroundColor: '#020617',
    border: '1px solid #1e293b',
    padding: '4px 8px',
    borderRadius: '6px'
  },
  liveTag: {
    fontSize: '10px',
    fontWeight: '800',
    color: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid #ef4444',
    padding: '3px 8px',
    borderRadius: '6px'
  },
  nodeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  nodeCard: {
    backgroundColor: '#020617',
    border: '1px solid #1e293b',
    borderRadius: '10px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  nodeTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  nodeIdGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  chipIcon: {
    fontSize: '16px',
    color: '#fbbf24'
  },
  nodeId: {
    fontWeight: '800',
    fontSize: '13px',
    color: '#f8fafc'
  },
  nodeRole: {
    fontSize: '11px',
    color: '#64748b'
  },
  statusPill: {
    fontSize: '10px',
    fontWeight: '800',
    padding: '3px 8px',
    borderRadius: '6px',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: '#34d399',
    border: '1px solid #059669'
  },
  nodeMetrics: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    borderTop: '1px solid #1e293b',
    paddingTop: '8px',
    fontSize: '11px'
  },
  metricItem: {
    display: 'flex',
    flexDirection: 'column'
  },
  metricKey: {
    color: '#64748b',
    fontSize: '10px'
  },
  metricVal: {
    fontWeight: '700',
    color: '#e2e8f0',
    fontFamily: 'monospace'
  },
  visionFrame: {
    position: 'relative',
    height: '180px',
    backgroundColor: '#050811',
    border: '1px solid #1e293b',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  camOverlay: {
    position: 'absolute',
    top: '8px',
    left: '10px',
    right: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px',
    fontFamily: 'monospace',
    color: '#94a3b8',
    zIndex: 5
  },
  camTop: {
    display: 'flex',
    gap: '8px'
  },
  camStats: {
    display: 'flex',
    gap: '8px'
  },
  boundingBox1: {
    position: 'absolute',
    top: '55px',
    left: '60px',
    width: '90px',
    height: '65px',
    border: '2px solid #10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)'
  },
  boundingBox2: {
    position: 'absolute',
    top: '40px',
    right: '80px',
    width: '120px',
    height: '80px',
    border: '2px solid #38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.1)'
  },
  boxTag: {
    position: 'absolute',
    top: '-16px',
    left: '-2px',
    backgroundColor: '#10b981',
    color: '#020617',
    fontSize: '9px',
    fontWeight: '800',
    padding: '1px 4px',
    borderRadius: '2px'
  },
  sonarSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  sonarTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#94a3b8'
  },
  sonarRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px'
  },
  sonarBox: {
    backgroundColor: '#020617',
    border: '1px solid #1e293b',
    borderRadius: '8px',
    padding: '10px'
  },
  sonarLabel: {
    fontSize: '10px',
    color: '#64748b'
  },
  sonarVal: {
    fontSize: '13px',
    fontWeight: '800',
    fontFamily: 'monospace',
    marginTop: '4px'
  }
};
