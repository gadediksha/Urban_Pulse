import React, { useState, useEffect, useRef } from 'react';
import Header from './components/common/Header';
import SignalControl from './components/dashboard/SignalControl';
import ControlPanel from './components/simulation/ControlPanel';
import ActivityLogs from './components/dashboard/ActivityLogs';
import WasteManagement from './components/dashboard/WasteManagement';
import WasteZoneGrid from './components/dashboard/WasteZoneGrid';
import AirQuality from './components/dashboard/AirQuality';
import WaterManagement from './components/dashboard/WaterManagement';
import WaterZoneMap from './components/dashboard/WaterZoneMap';
import StreetLight from './components/dashboard/StreetLight';
import AlertsPanel from './components/dashboard/AlertsPanel';
import DecisionSupport from './components/dashboard/DecisionSupport';
import AiAnalyticsDashboard from './components/dashboard/AiAnalyticsDashboard';
import LiveMetricsChart from './components/dashboard/LiveMetricsChart';
import VisualIntersection from './components/dashboard/VisualIntersection';
import UrbanMonitoring from './components/dashboard/UrbanMonitoring';
import FleetTracker from './components/dashboard/FleetTraker';
import { VirtualESP32 } from './services/virtualHardware';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('traffic');
  const hardwareNode = useRef(new VirtualESP32('ESP32_CORE_NEXUS_01'));

  const [lanes, setLanes] = useState([
    { id: 1, name: 'Lane 1 (North)', count: 12, waitCycles: 0 },
    { id: 2, name: 'Lane 2 (East)', count: 4,  waitCycles: 0 },
    { id: 3, name: 'Lane 3 (South)', count: 8, waitCycles: 0 },
    { id: 4, name: 'Lane 4 (West)', count: 3,  waitCycles: 0 }
  ]);

  const [activeLaneIndex, setActiveLaneIndex] = useState(0);
  const [activeSignal, setActiveSignal] = useState('GREEN');
  const [dynamicSec, setDynamicSec] = useState(6);

  const [parkingSlot1, setParkingSlot1] = useState(true);
  const [parkingSlot2, setParkingSlot2] = useState(false);
  const [bin1Fill, setBin1Fill] = useState(74);
  const [bin2Fill, setBin2Fill] = useState(38);

  const [airMetrics, setAirMetrics] = useState({
    aqi: 105,
    pm25: 40,
    pm10: 68,
    co2: 420,
    no2: 24.5,
    temp: 29.4,
    humidity: 58
  });

  const [waterMetrics, setWaterMetrics] = useState({
    tankLevel: 68,
    flowRate: 34.5,
    phValue: 7.2,
    pressure: 4.2,
    tds: 154,
    leakStatus: 'NOMINAL',
    pumpStatus: false
  });

  const [urbanMetrics, setUrbanMetrics] = useState({
    soundDb: 67.4,
    structuralVibe: 0.088,
    strainMicro: 44,
    gpsCoords: { lat: 28.6139, lng: 77.2090, label: 'Junction 04, Sector 7 Hub' }
  });

  const [truckStatus, setTruckStatus] = useState({
    id: 'TRUCK WT-04',
    status: 'Standby / Route Ready',
    eta: '6 mins',
    target: 'Zone A - Bin #01'
  });

  const [lightState, setLightState] = useState({
    isNight: true,
    brightness: 100,
    powerSaved: 42,
    autoMode: true
  });

  const [prediction, setPrediction] = useState({
    congestionRisk: 'MODERATE',
    peakTime: '18:30 - 19:15',
    predictedDelay: 4.5,
    co2Saved: 18.2
  });

  const [chartHistory, setChartHistory] = useState([
    { time: '12:00', aqi: 95, traffic: 22 },
    { time: '12:02', aqi: 102, traffic: 25 },
    { time: '12:04', aqi: 108, traffic: 29 },
    { time: '12:06', aqi: 105, traffic: 27 },
    { time: '12:08', aqi: 112, traffic: 31 }
  ]);

  const [alerts, setAlerts] = useState([
    { id: 1, level: 'WARNING', sector: 'WASTE GRID', time: '10m ago', message: 'Zone A bin exceeded 70% threshold.' }
  ]);

  const [emergencyCorridor, setEmergencyCorridor] = useState(false);
  const [autoSimulate, setAutoSimulate] = useState(true);
  const [crisisActive, setCrisisActive] = useState(false);


  const [fleet, setFleet] = useState([
    {
      id: "AMB-101",
      type: "Emergency Ambulance",
      status: "Standby",
      location: "North Sector Ave 4",
      targetJunction: "Junction 04 (Lane 1)",
      eta: "2 mins",
      priority: "Critical"
    },
    {
      id: "LOG-EV44",
      type: "Eco-Freight EV Truck",
      status: "Corridor Inbound",
      location: "Logistics Hub East",
      targetJunction: "Junction 04 (Lane 2)",
      eta: "3 mins",
      priority: "High"
    },
    {
      id: "BUS-EV88",
      type: "Rapid Transit EV",
      status: "En Route",
      location: "Central Corridor",
      targetJunction: "Junction 04 (Lane 1)",
      eta: "1 min",
      priority: "Medium"
    },
    {
      id: "POL-204",
      type: "Police Interceptor",
      status: "Patrolling",
      location: "Ring Road Sector 9",
      targetJunction: "Junction 04 (Lane 2)",
      eta: "6 mins",
      priority: "Standard"
    }
  ]);

  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString(), type: 'INFO', message: 'SIH PS-26222 UrbanPulse Municipal Command Grid Online.' }
  ]);

  const addLog = (type, message) => {
    setLogs(prev => [{ time: new Date().toLocaleTimeString(), type, message }, ...prev.slice(0, 14)]);
  };

  const triggerAlert = (level, sector, message) => {
    setAlerts(prev => [
      { id: Date.now(), level, sector, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), message },
      ...prev.slice(0, 6)
    ]);
  };

  const handleDismissAlert = (id) => setAlerts(prev => prev.filter(a => a.id !== id));
  const handleClearAllAlerts = () => {
    setAlerts([]);
    addLog('INFO', 'All alerts acknowledged.');
  };

  const handleEmptyBin = (binNumber) => {
    if (binNumber === 1) {
      setBin1Fill(5);
      hardwareNode.current.ultrasonic.dustbinDistanceCm = 28.0;
      setTruckStatus({
        id: 'TRUCK WT-04',
        status: 'Collection Complete / Returning',
        eta: '--',
        target: 'Zone A Cleared'
      });
      addLog('INFO', 'Zone A Waste Cleared & Truck WT-04 Returned.');
    } else {
      setBin2Fill(5);
      setTruckStatus({
        id: 'TRUCK WT-05',
        status: 'Collection Complete / Returning',
        eta: '--',
        target: 'Zone B Cleared'
      });
      addLog('INFO', 'Zone B Waste Cleared & Truck WT-05 Returned.');
    }
  };

  const handleTogglePump = () => {
    setWaterMetrics(prev => {
      const nextState = !prev.pumpStatus;
      addLog('INFO', nextState ? 'Inflow Reservoir Pump: ON' : 'Inflow Reservoir Pump: OFF');
      return { ...prev, pumpStatus: nextState };
    });
  };

  const handleSimulateCrisis = async () => {
    try {
      await api.simulateCrisis('WATER_PIPE_BURST');
    } catch (e) {}

    setCrisisActive(true);

    // 1. Water: Pressure drops, critical leak in Sector 4
    setWaterMetrics(prev => ({
      ...prev,
      leakStatus: 'CRITICAL LEAK (SECTOR 4)',
      pressure: 1.1,
      flowRate: 58.2,
      pumpStatus: false
    }));

    // 2. Traffic: Lane 2 (East) blocked/diverted
    setLanes(prev => prev.map((l, idx) => {
      if (idx === 1) return { ...l, name: 'Lane 2 (EAST - ROAD CLOSED)', count: 0 };
      return { ...l, count: l.count + 4 };
    }));

    // 3. Waste: Truck rerouted
    setTruckStatus({
      id: 'TRUCK WT-04',
      status: 'Rerouted via Bypass-8 (Flood Avoidance)',
      eta: '7 mins',
      target: 'Bypass-8 -> Zone A'
    });

    // 4. Fleet update
    setFleet(prev => prev.map(f => f.id === 'LOG-EV44' ? { ...f, status: 'REROUTED: Avoiding Sector 4 Submerged Road' } : f));

    // 5. System alert
    triggerAlert(
      'CRITICAL',
      'ONE-BRAIN CRISIS',
      'Major Water Pipe Burst in Sector 4! AI Core autonomously: 1) Closed Sluice Valve #4 2) Diverted Eastbound Traffic 3) Rerouted Waste Truck WT-04 via Outer Bypass.'
    );

    addLog('ALERT', '🚨 ONE-BRAIN CRISIS: Sector 4 Pipe Burst! Cross-module autonomous action triggered across Water, Traffic & Waste.');
  };

  const handleResetCrisis = async () => {
    try {
      await api.resetCrisis();
    } catch (e) {}

    setCrisisActive(false);

    setWaterMetrics(prev => ({
      ...prev,
      leakStatus: 'NOMINAL',
      pressure: 4.2,
      flowRate: 34.5
    }));

    setLanes(prev => prev.map((l, idx) => {
      if (idx === 1) return { ...l, name: 'Lane 2 (East)', count: 4 };
      return { ...l, count: Math.max(2, l.count - 4) };
    }));

    setTruckStatus({
      id: 'TRUCK WT-04',
      status: 'Standby / Route Ready',
      eta: '4 mins',
      target: 'Zone A - Bin #01'
    });

    setFleet(prev => prev.map(f => f.id === 'LOG-EV44' ? { ...f, status: 'Corridor Inbound' } : f));

    addLog('INFO', '✅ Crisis Resolved: Water pipeline restored. Traffic and Waste routes normalized.');
  };


  const handleToggleLightMode = () => setLightState(prev => ({ ...prev, autoMode: !prev.autoMode }));
  const handleToggleNight = () => {
    setLightState(prev => {
      const nextNight = !prev.isNight;
      return { ...prev, isNight: nextNight, brightness: nextNight ? 100 : 0 };
    });
  };

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

  // 4-Way Traffic Timer — Anti-Starvation Priority Scheduler
  useEffect(() => {
    if (emergencyCorridor) {
      setActiveLaneIndex(0);
      setActiveSignal('GREEN');
      setDynamicSec(15);
      return;
    }

    const timer = setInterval(() => {
      setDynamicSec(prev => {
        if (prev === 3) {
          setActiveSignal('YELLOW');
        }

        if (prev <= 1) {
          // ─── Priority Score = carCount + (waitCycles * STARVATION_WEIGHT) ───
          // Lanes jo zyada wait kar chuki hain unka score boost hota hai
          // Isse 1-car wali lane bhi kabhi starve nahi hogi
          const STARVATION_WEIGHT = 4; // har missed cycle = 4 cars ki priority
          const MAX_WAIT_CYCLES   = 3; // 3 cycles baad force-promote ho jata hai

          const scores = lanes.map((lane, idx) => {
            if (idx === activeLaneIndex) return -1; // current lane skip
            const boostScore = lane.count + (lane.waitCycles * STARVATION_WEIGHT);
            return boostScore;
          });

          // Force promote: agar koi lane MAX_WAIT_CYCLES se zyada wait kar chuki hai
          const forcedIdx = lanes.findIndex(
            (lane, idx) => idx !== activeLaneIndex && lane.waitCycles >= MAX_WAIT_CYCLES
          );

          const nextIndex = forcedIdx !== -1
            ? forcedIdx
            : scores.indexOf(Math.max(...scores));

          // waitCycles update: active lane reset, baaki sab +1
          setLanes(prevLanes => prevLanes.map((lane, idx) => ({
            ...lane,
            waitCycles: idx === nextIndex ? 0 : (idx === activeLaneIndex ? lane.waitCycles : lane.waitCycles + 1)
          })));

          setActiveLaneIndex(nextIndex);
          setActiveSignal('GREEN');

          const nextLaneCount = lanes[nextIndex].count;
          // Green time: cam traffic pe based, min 4s max 14s
          return Math.min(14, Math.max(4, 4 + Math.floor(nextLaneCount / 2)));
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeLaneIndex, activeSignal, lanes, emergencyCorridor]);

  // Simulation Stream
  useEffect(() => {
    if (!autoSimulate || emergencyCorridor) return;

    const interval = setInterval(() => {
      const packet = hardwareNode.current.sampleEnvironment(lanes, lightState.isNight);

      const newAqi = packet.processed.aqi;
      setAirMetrics(prev => ({
        ...prev,
        aqi: newAqi,
        pm25: packet.processed.pm25,
        pm10: packet.processed.pm10 || Math.floor(newAqi * 0.65),
        co2: packet.processed.co2,
        no2: packet.processed.no2 || +(18 + newAqi * 0.11).toFixed(1),
        temp: +(28.5 + Math.random() * 2).toFixed(1),
        humidity: 55 + Math.floor(Math.random() * 5)
      }));

      // Urban Monitoring Metrics (Acoustic & Structural)
      setUrbanMetrics(prev => ({
        ...prev,
        soundDb: packet.processed.soundDb || +(60 + Math.random() * 12).toFixed(1),
        structuralVibe: packet.processed.structuralVibe || +(0.08 + Math.random() * 0.02).toFixed(3),
        strainMicro: 42 + Math.floor(Math.random() * 8)
      }));

      // Water telemetry
      setWaterMetrics(prev => ({
        ...prev,
        pressure: packet.processed.waterPressure || 4.2,
        tds: packet.processed.waterTds || 154
      }));

      setBin1Fill(packet.processed.dustbinFill);
      setParkingSlot1(packet.processed.slot1Occupied);
      setParkingSlot2(packet.processed.slot2Occupied);

      // Automated Truck Dispatch Trigger if Bin fill exceeds 75%
      if (packet.processed.dustbinFill >= 75) {
        setTruckStatus(prev => ({
          ...prev,
          status: 'En Route (Auto-Dispatched)',
          eta: '4 mins',
          target: 'Zone A - Bin #01'
        }));
      }

      const updatedLanes = lanes.map(lane => ({
        ...lane,
        count: Math.max(1, Math.min(20, lane.count + (Math.random() > 0.5 ? 2 : -2)))
      }));
      setLanes(updatedLanes);

      const totalCars = updatedLanes.reduce((sum, l) => sum + l.count, 0);

      // Dynamically update AI Predictions based on current grid traffic
      const risk = totalCars > 32 ? 'HIGH' : totalCars > 18 ? 'MODERATE' : 'LOW';
      setPrediction(prev => ({
        ...prev,
        congestionRisk: risk,
        predictedDelay: +(totalCars * 0.16).toFixed(1),
        co2Saved: +(12.0 + totalCars * 0.28).toFixed(1)
      }));

      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setChartHistory(prev => [
        ...prev.slice(prev.length >= 7 ? 1 : 0),
        { time: nowTime, aqi: newAqi, traffic: totalCars }
      ]);
    }, 3500);

    return () => clearInterval(interval);
  }, [autoSimulate, emergencyCorridor, lightState.isNight, lanes]);

  const totalCarsCount = lanes.reduce((acc, l) => acc + l.count, 0);

  return (
    <div style={styles.appWrapper}>
      <Header emergencyCorridor={emergencyCorridor} />
      
      {/* Compact KPI Row */}
      <div style={styles.kpiContainer}>
        <div className="glass-card" style={styles.kpiCard}>
          <span style={styles.kpiLabel}>ACTIVE VEHICLES</span>
          <div style={styles.kpiVal}>{totalCarsCount} <span style={styles.kpiUnit}>cars</span></div>
        </div>

        <div className="glass-card" style={styles.kpiCard}>
          <span style={styles.kpiLabel}>CITY AQI</span>
          <div style={{ ...styles.kpiVal, color: airMetrics.aqi > 100 ? '#fbbf24' : '#34d399' }}>
            {airMetrics.aqi} <span style={styles.kpiUnit}>PM2.5: {airMetrics.pm25}</span>
          </div>
        </div>

        <div className="glass-card" style={styles.kpiCard}>
          <span style={styles.kpiLabel}>CITY NOISE</span>
          <div style={{ ...styles.kpiVal, color: urbanMetrics.soundDb > 75 ? '#f87171' : '#38bdf8' }}>
            {urbanMetrics.soundDb} <span style={styles.kpiUnit}>dB(A)</span>
          </div>
        </div>

        <div className="glass-card" style={styles.kpiCard}>
          <span style={styles.kpiLabel}>SYSTEM ALERTS</span>
          <div style={{ ...styles.kpiVal, color: alerts.length > 0 ? '#f87171' : '#34d399' }}>
            {alerts.length} <span style={styles.kpiUnit}>Active</span>
          </div>
        </div>

        <div className="glass-card" style={styles.kpiCard}>
          <span style={styles.kpiLabel}>EDGE NODES</span>
          <div style={{ ...styles.kpiVal, color: '#38bdf8', fontSize: '15px' }}>
            ONLINE <span style={styles.kpiUnit}>3 ESP32/CAMS</span>
          </div>
        </div>
      </div>

      {/* One-Brain Cross-Module Crisis Demo Banner */}
      <div style={{
        margin: '0 0 16px 0',
        padding: '12px 16px',
        borderRadius: '10px',
        border: crisisActive ? '1px solid #ef4444' : '1px solid #1e293b',
        backgroundColor: crisisActive ? 'rgba(239, 68, 68, 0.14)' : '#070d1f',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: crisisActive ? '0 0 20px rgba(239, 68, 68, 0.25)' : 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>{crisisActive ? '🚨' : '🧠'}</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong style={{ color: crisisActive ? '#f87171' : '#38bdf8', fontSize: '13px', letterSpacing: '0.3px' }}>
                {crisisActive ? 'CRITICAL EVENT ACTIVE: WATER PIPELINE BURST (SECTOR 4)' : 'ONE-BRAIN CROSS-SYSTEM CRISIS SIMULATOR (SIH PS-26222)'}
              </strong>
              <span style={{
                fontSize: '9px',
                fontWeight: '800',
                padding: '2px 7px',
                borderRadius: '4px',
                backgroundColor: crisisActive ? '#ef4444' : 'rgba(56, 189, 248, 0.15)',
                color: crisisActive ? '#fff' : '#38bdf8',
                border: crisisActive ? '1px solid #f87171' : '1px solid #0284c7'
              }}>
                {crisisActive ? '⚡ AUTONOMOUS RIPPLE ACTIVE' : '3-SYSTEM COORDINATION'}
              </span>
            </div>
            <p style={{ margin: '3px 0 0 0', color: '#94a3b8', fontSize: '11px' }}>
              {crisisActive 
                ? 'Water Burst in Sector 4 ➔ Sluice #04 shut ➔ Eastbound Traffic diverted (Lane 2 closed) ➔ Municipal Waste Truck WT-04 rerouted to Bypass-8!'
                : 'Demonstrate live cross-module ripple effect to judges: How a single civic incident coordinates Water, Traffic & Waste simultaneously.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {crisisActive ? (
            <button
              onClick={handleResetCrisis}
              style={{
                backgroundColor: '#10b981',
                color: '#020617',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🔄</span>
              <span>RESTORE NORMAL CITY GRID</span>
            </button>
          ) : (
            <button
              onClick={handleSimulateCrisis}
              style={{
                backgroundColor: '#dc2626',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.4)'
              }}
            >
              <span>⚡</span>
              <span>SIMULATE WATER BURST (CROSS-SYSTEM DEMO)</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={styles.tabBar}>
        {[
          { key: 'traffic', label: 'SMART TRAFFIC AND VEHICLE MANAGEMENT', icon: '🚦' },
          { key: 'waste', label: 'SMART WASTE MANAGEMENT OPTIMIZATION', icon: '🗑️' },
          { key: 'water', label: 'SMART WATER MANAGEMENT', icon: '💧' },
          { key: 'ai', label: 'AI BASED PREDICTION AND ANALYTICS', icon: '🧠' },
          { key: 'urban', label: 'SMART URBAN MONITORING', icon: '🏙️' },
          { key: 'alerts', label: 'ALERT & DECISION SUPPORT SYSTEM', icon: '🛡️' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              ...styles.tabPill,
              ...(activeTab === tab.key ? styles.activeTabPill : {})
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={styles.tabContent}>
        {/* 1. SMART TRAFFIC AND VEHICLE MANAGEMENT */}
        {activeTab === 'traffic' && (
          <div style={styles.trafficGrid}>
            <div style={styles.col}>
              <ControlPanel 
                lanes={lanes} setLanes={setLanes}
                parkingSlot1={parkingSlot1} setParkingSlot1={setParkingSlot1}
                parkingSlot2={parkingSlot2} setParkingSlot2={setParkingSlot2}
                emergencyCorridor={emergencyCorridor} 
                setEmergencyCorridor={(state) => {
                  setEmergencyCorridor(state);
                  if (state) {
                    triggerAlert('CRITICAL', 'EMERGENCY', 'Ambulance Priority Engaged');
                    setPrediction(prev => ({ ...prev, congestionRisk: 'LOW', predictedDelay: 0.5 }));
                    setFleet(prev => prev.map(f => f.id === 'AMB-101' ? { ...f, status: 'Green Corridor Active - Priority Clearance' } : f));
                  } else {
                    setFleet(prev => prev.map(f => f.id === 'AMB-101' ? { ...f, status: 'Standby' } : f));
                  }
                  addLog(state ? 'EMERGENCY' : 'INFO', state ? 'Ambulance Priority ON' : 'Ambulance Priority OFF');
                }}
                autoSimulate={autoSimulate} setAutoSimulate={setAutoSimulate}
              />
              <StreetLight 
                isNight={lightState.isNight}
                brightness={lightState.brightness}
                powerSaved={lightState.powerSaved}
                autoMode={lightState.autoMode}
                onToggleMode={handleToggleLightMode}
                onToggleNight={handleToggleNight}
              />
            </div>
            <div style={styles.col}>
              <VisualIntersection 
                chartData={chartHistory}
                lanes={lanes} 
                activeLaneIndex={activeLaneIndex} 
                activeSignal={activeSignal} 
              />
              <FleetTracker 
                fleet={fleet} 
                emergencyCorridor={emergencyCorridor} 
                onTriggerEmergency={() => {
                  setEmergencyCorridor(!emergencyCorridor);
                  addLog('EMERGENCY', 'Ambulance green wave triggered from Fleet Panel.');
                }}
              />
            </div>
            <div style={styles.col}>
              <SignalControl 
                lanes={lanes} 
                activeLaneIndex={activeLaneIndex} 
                activeSignal={activeSignal} 
                dynamicSec={dynamicSec} 
              />
              <LiveMetricsChart chartData={chartHistory} />
            </div>
          </div>
        )}

        {/* 2. SMART WASTE MANAGEMENT OPTIMIZATION */}
        {activeTab === 'waste' && (
          <div style={styles.grid2Col}>
            <div style={styles.col}>
              <WasteManagement 
                bin1Fill={bin1Fill} 
                bin2Fill={bin2Fill} 
                onEmptyBin={handleEmptyBin} 
                truckStatus={truckStatus}
              />
            </div>
            <div style={styles.col}>
              <WasteZoneGrid />
            </div>
          </div>
        )}

        {/* 3. SMART WATER MANAGEMENT */}
        {activeTab === 'water' && (
          <div style={styles.grid2Col}>
            <div style={styles.col}>
              <WaterManagement 
                tankLevel={waterMetrics.tankLevel}
                flowRate={waterMetrics.flowRate}
                phValue={waterMetrics.phValue}
                pressure={waterMetrics.pressure}
                tds={waterMetrics.tds}
                leakStatus={waterMetrics.leakStatus}
                pumpStatus={waterMetrics.pumpStatus}
                onTogglePump={handleTogglePump}
              />
            </div>
            <div style={styles.col}>
              <WaterZoneMap
                flowRate={waterMetrics.flowRate}
                pressure={waterMetrics.pressure}
                phValue={waterMetrics.phValue}
                tds={waterMetrics.tds}
              />
            </div>
          </div>
        )}

        {/* 4. AI BASED PREDICTION AND ANALYTICS */}
        {activeTab === 'ai' && (
          <div style={styles.col}>
            <AiAnalyticsDashboard
              congestionRisk={prediction.congestionRisk}
              peakTime={prediction.peakTime}
              predictedDelay={prediction.predictedDelay}
              co2Saved={prediction.co2Saved}
            />
          </div>
        )}

        {/* 5. SMART URBAN MONITORING */}
        {activeTab === 'urban' && (
          <div style={styles.grid2Col}>
            <div style={styles.col}>
              <UrbanMonitoring 
                soundDb={urbanMetrics.soundDb}
                structuralVibe={urbanMetrics.structuralVibe}
                strainMicro={urbanMetrics.strainMicro}
                gpsCoords={urbanMetrics.gpsCoords}
              />
            </div>
            <div style={styles.col}>
              <AirQuality 
                aqi={airMetrics.aqi} 
                pm25={airMetrics.pm25} 
                pm10={airMetrics.pm10}
                co2={airMetrics.co2} 
                no2={airMetrics.no2}
                temp={airMetrics.temp} 
                humidity={airMetrics.humidity} 
              />
            </div>
          </div>
        )}

        {/* 6. ALERT & DECISION SUPPORT SYSTEM */}
        {activeTab === 'alerts' && (
          <div style={styles.trafficGrid}>
            <div style={styles.col}>
              <AlertsPanel 
                alerts={alerts} 
                onDismissAlert={handleDismissAlert} 
                onClearAll={handleClearAllAlerts} 
              />
              <ActivityLogs logs={logs} />
            </div>
            <div style={styles.col}>
              <DecisionSupport alerts={alerts} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  appWrapper: {
    backgroundColor: '#030712',
    minHeight: '100vh',
    width: '100%',
    padding: '16px 24px',
    boxSizing: 'border-box'
  },
  kpiContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px',
    marginBottom: '16px'
  },
  kpiCard: {
    borderRadius: '12px',
    padding: '10px 14px',
    backgroundColor: 'rgba(17, 24, 39, 0.75)',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },
  kpiLabel: {
    fontSize: '9px',
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: '0.5px'
  },
  kpiVal: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#f9fafb',
    marginTop: '2px'
  },
  kpiUnit: {
    fontSize: '11px',
    fontWeight: '500',
    color: '#94a3b8'
  },
  tabBar: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '4px',
    borderRadius: '10px',
    gap: '4px',
    marginBottom: '16px'
  },
  tabPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#9ca3af',
    padding: '7px 14px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  activeTabPill: {
    backgroundColor: '#0284c7',
    color: '#ffffff',
    boxShadow: '0 0 12px rgba(2, 132, 199, 0.4)'
  },
  tabContent: {
    width: '100%'
  },
  trafficGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '16px',
    alignItems: 'start'
  },
  grid2Col: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '16px',
    alignItems: 'start'
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  }
};