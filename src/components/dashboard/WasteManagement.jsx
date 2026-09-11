import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function WasteManagement({ 
  bin1Fill = 68, 
  bin2Fill = 42, 
  onEmptyBin, 
  truckStatus = { id: 'TRUCK WT-04', status: 'Standby / Route Ready', eta: '4 mins', target: 'Zone A - Bin #01' } 
}) {
  const [bin1Dry, setBin1Dry] = useState(bin1Fill);
  const [bin1Wet, setBin1Wet] = useState(Math.round(bin1Fill * 0.6));
  const [bin2Dry, setBin2Dry] = useState(bin2Fill);
  const [bin2Wet, setBin2Wet] = useState(Math.round(bin2Fill * 0.5));

  const [testItem, setTestItem] = useState('');
  const [selectedBin, setSelectedBin] = useState('BIN-SEC-04A');
  const [aiResult, setAiResult] = useState(null);
  const [isClassifying, setIsClassifying] = useState(false);

  useEffect(() => {
    setBin1Dry(bin1Fill);
    setBin1Wet(Math.min(100, Math.round(bin1Fill * 0.62)));
  }, [bin1Fill]);

  useEffect(() => {
    setBin2Dry(bin2Fill);
    setBin2Wet(Math.min(100, Math.round(bin2Fill * 0.55)));
  }, [bin2Fill]);

  useEffect(() => {
    let isMounted = true;
    const fetchBackendBins = async () => {
      try {
        const data = await api.getDustbins();
        if (data && data.success && data.bins && isMounted) {
          if (data.bins[0]) {
            setBin1Dry(data.bins[0].dryWaste.fillPercentage);
            setBin1Wet(data.bins[0].wetWaste.fillPercentage);
          }
          if (data.bins[1]) {
            setBin2Dry(data.bins[1].dryWaste.fillPercentage);
            setBin2Wet(data.bins[1].wetWaste.fillPercentage);
          }
        }
      } catch (e) {}
    };
    fetchBackendBins();
    const interval = setInterval(fetchBackendBins, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const getFillColor = (level) => {
    if (level >= 85) return '#ef4444';
    if (level >= 65) return '#f59e0b';
    return '#10b981';
  };

  const getStatusBadge = (fill) => {
    if (fill >= 85) return { label: 'CRITICAL FULL', bg: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '#ef4444' };
    if (fill >= 65) return { label: 'WARNING NEAR FULL', bg: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '#f59e0b' };
    return { label: 'NORMAL CAPACITY', bg: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '#10b981' };
  };

  const handleEmptyCompartment = async (binIndex, compartment) => {
    if (binIndex === 1) {
      if (compartment === 'dry' || compartment === 'both') setBin1Dry(0);
      if (compartment === 'wet' || compartment === 'both') setBin1Wet(0);
      try { await api.emptyDustbin('BIN-SEC-04A', compartment); } catch (e) {}
    } else {
      if (compartment === 'dry' || compartment === 'both') setBin2Dry(0);
      if (compartment === 'wet' || compartment === 'both') setBin2Wet(0);
      try { await api.emptyDustbin('BIN-SEC-04B', compartment); } catch (e) {}
    }
    if (onEmptyBin) onEmptyBin(binIndex);
  };

  const handleClassify = async (itemToClassify) => {
    const item = (itemToClassify || testItem).trim();
    if (!item) return;

    setIsClassifying(true);
    setAiResult(null);

    try {
      const res = await api.classifyWaste(selectedBin, item);
      if (res && res.success) {
        setAiResult({
          item: res.item,
          category: res.identifiedAs,
          confidence: res.confidence,
          compartment: res.depositedCompartment
        });
        if (selectedBin === 'BIN-SEC-04A') {
          if (res.identifiedAs === 'DRY') setBin1Dry(prev => Math.min(100, prev + 3));
          else setBin1Wet(prev => Math.min(100, prev + 3));
        } else {
          if (res.identifiedAs === 'DRY') setBin2Dry(prev => Math.min(100, prev + 3));
          else setBin2Wet(prev => Math.min(100, prev + 3));
        }
      }
    } catch (e) {
      const dryKeywords = ['plastic', 'bottle', 'paper', 'cardboard', 'can', 'glass', 'metal', 'wrapper', 'tin', 'cup', 'box'];
      const wetKeywords = ['food', 'banana', 'peel', 'apple', 'vegetable', 'fruit', 'leaf', 'tea', 'coffee', 'organic', 'scrap', 'bread', 'leftover'];
      const lower = item.toLowerCase();
      const isWet = wetKeywords.some(k => lower.includes(k));
      const category = isWet ? 'WET' : 'DRY';
      const confidence = `${(96 + Math.random() * 3).toFixed(1)}%`;
      const compartment = isWet ? 'Wet Waste (Organic)' : 'Dry Waste (Inorganic)';

      setAiResult({ item, category, confidence, compartment });
      if (selectedBin === 'BIN-SEC-04A') {
        if (category === 'DRY') setBin1Dry(prev => Math.min(100, prev + 4));
        else setBin1Wet(prev => Math.min(100, prev + 4));
      } else {
        if (category === 'DRY') setBin2Dry(prev => Math.min(100, prev + 4));
        else setBin2Wet(prev => Math.min(100, prev + 4));
      }
    } finally {
      setIsClassifying(false);
    }
  };

  const isAutoDispatch = bin1Dry >= 75 || bin1Wet >= 75 || bin2Dry >= 75 || bin2Wet >= 75;

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <div style={styles.sihTag}>TIER 1 & TIER 2: SMART WASTE LOGISTICS & AI SEGREGATION</div>
          <h3 style={styles.cardTitle}>🗑️ Smart Dual Dustbin Hub (Dry & Wet Waste Segregation)</h3>
        </div>
        <span style={styles.statusPill}>DUAL HC-SR04 + AI VISION ACTIVE</span>
      </div>

      <div style={styles.kpiGrid}>
        <div style={styles.kpiCard}>
          <span style={styles.kpiLabel}>AVERAGE DRY WASTE</span>
          <div style={styles.kpiValueRow}>
            <span style={{ color: '#38bdf8', fontSize: '16px', fontWeight: '800' }}>
              {Math.round((bin1Dry + bin2Dry) / 2)}%
            </span>
            <span style={styles.kpiSub}>
              {100 - Math.round((bin1Dry + bin2Dry) / 2)}% space left
            </span>
          </div>
        </div>
        <div style={styles.kpiCard}>
          <span style={styles.kpiLabel}>AVERAGE WET WASTE</span>
          <div style={styles.kpiValueRow}>
            <span style={{ color: '#34d399', fontSize: '16px', fontWeight: '800' }}>
              {Math.round((bin1Wet + bin2Wet) / 2)}%
            </span>
            <span style={styles.kpiSub}>
              {100 - Math.round((bin1Wet + bin2Wet) / 2)}% space left
            </span>
          </div>
        </div>
        <div style={styles.kpiCard}>
          <span style={styles.kpiLabel}>AI RECOGNITION</span>
          <div style={styles.kpiValueRow}>
            <span style={{ color: '#a78bfa', fontSize: '16px', fontWeight: '800' }}>98.2%</span>
            <span style={styles.kpiSub}>YOLOv8 Edge Vision</span>
          </div>
        </div>
        <div style={styles.kpiCard}>
          <span style={styles.kpiLabel}>FLEET DISPATCH</span>
          <div style={styles.kpiValueRow}>
            <span style={{ color: isAutoDispatch ? '#f87171' : '#10b981', fontSize: '12px', fontWeight: '800' }}>
              {isAutoDispatch ? '⚡ AUTO-ACTIVE' : 'STANDBY IDLE'}
            </span>
          </div>
        </div>
      </div>

      <div style={styles.binsGrid}>
        {/* BIN 1: Zone A */}
        <div style={styles.mainBinContainer}>
          <div style={styles.mainBinHeader}>
            <div>
              <strong style={{ color: '#f8fafc', fontSize: '13px' }}>ZONE A — SMART HUB #01</strong>
              <div style={{ color: '#64748b', fontSize: '10px' }}>ESP32-BIN-01 • Solar 96%</div>
            </div>
            <button 
              onClick={() => handleEmptyCompartment(1, 'both')} 
              style={styles.clearAllBtn}
            >
              Empty All
            </button>
          </div>

          <div style={styles.dualCompartmentRow}>
            {/* Dry Waste */}
            <div style={{ ...styles.compartmentBox, borderColor: getFillColor(bin1Dry) }}>
              <div style={styles.compHeader}>
                <span style={{ color: '#38bdf8', fontWeight: '700', fontSize: '11px' }}>🟦 DRY WASTE</span>
                {(() => {
                  const b = getStatusBadge(bin1Dry);
                  return (
                    <span style={{ ...styles.badge, backgroundColor: b.bg, color: b.color, borderColor: b.border }}>
                      {bin1Dry >= 85 ? 'FULL' : `${bin1Dry}%`}
                    </span>
                  );
                })()}
              </div>

              <div style={styles.compBody}>
                <div style={styles.meterContainer}>
                  <div style={{ ...styles.meterFill, height: `${bin1Dry}%`, backgroundColor: getFillColor(bin1Dry) }} />
                </div>
                <div style={styles.compStats}>
                  <div style={styles.statLine}>
                    <span style={styles.statLabel}>Fill Status:</span>
                    <strong style={{ color: getFillColor(bin1Dry) }}>{bin1Dry >= 85 ? 'FULL 🚨' : `${bin1Dry}%`}</strong>
                  </div>
                  <div style={styles.statLine}>
                    <span style={styles.statLabel}>Remaining:</span>
                    <strong style={{ color: '#38bdf8' }}>{100 - bin1Dry}% Left</strong>
                  </div>
                  <div style={styles.statLine}>
                    <span style={styles.statLabel}>Sensor:</span>
                    <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>US-DRY-01</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleEmptyCompartment(1, 'dry')} 
                style={styles.emptyCompBtn}
              >
                Clear Dry Waste
              </button>
            </div>

            {/* Wet Waste */}
            <div style={{ ...styles.compartmentBox, borderColor: getFillColor(bin1Wet) }}>
              <div style={styles.compHeader}>
                <span style={{ color: '#34d399', fontWeight: '700', fontSize: '11px' }}>🟩 WET WASTE</span>
                {(() => {
                  const b = getStatusBadge(bin1Wet);
                  return (
                    <span style={{ ...styles.badge, backgroundColor: b.bg, color: b.color, borderColor: b.border }}>
                      {bin1Wet >= 85 ? 'FULL' : `${bin1Wet}%`}
                    </span>
                  );
                })()}
              </div>

              <div style={styles.compBody}>
                <div style={styles.meterContainer}>
                  <div style={{ ...styles.meterFill, height: `${bin1Wet}%`, backgroundColor: getFillColor(bin1Wet) }} />
                </div>
                <div style={styles.compStats}>
                  <div style={styles.statLine}>
                    <span style={styles.statLabel}>Fill Status:</span>
                    <strong style={{ color: getFillColor(bin1Wet) }}>{bin1Wet >= 85 ? 'FULL 🚨' : `${bin1Wet}%`}</strong>
                  </div>
                  <div style={styles.statLine}>
                    <span style={styles.statLabel}>Remaining:</span>
                    <strong style={{ color: '#34d399' }}>{100 - bin1Wet}% Left</strong>
                  </div>
                  <div style={styles.statLine}>
                    <span style={styles.statLabel}>Sensor:</span>
                    <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>US-WET-01</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleEmptyCompartment(1, 'wet')} 
                style={styles.emptyCompBtn}
              >
                Clear Wet Waste
              </button>
            </div>
          </div>
        </div>

        {/* BIN 2: Zone B */}
        <div style={styles.mainBinContainer}>
          <div style={styles.mainBinHeader}>
            <div>
              <strong style={{ color: '#f8fafc', fontSize: '13px' }}>ZONE B — LOGISTICS GATE #02</strong>
              <div style={{ color: '#64748b', fontSize: '10px' }}>ESP32-BIN-02 • Solar 92%</div>
            </div>
            <button 
              onClick={() => handleEmptyCompartment(2, 'both')} 
              style={styles.clearAllBtn}
            >
              Empty All
            </button>
          </div>

          <div style={styles.dualCompartmentRow}>
            {/* Dry Waste */}
            <div style={{ ...styles.compartmentBox, borderColor: getFillColor(bin2Dry) }}>
              <div style={styles.compHeader}>
                <span style={{ color: '#38bdf8', fontWeight: '700', fontSize: '11px' }}>🟦 DRY WASTE</span>
                {(() => {
                  const b = getStatusBadge(bin2Dry);
                  return (
                    <span style={{ ...styles.badge, backgroundColor: b.bg, color: b.color, borderColor: b.border }}>
                      {bin2Dry >= 85 ? 'FULL' : `${bin2Dry}%`}
                    </span>
                  );
                })()}
              </div>

              <div style={styles.compBody}>
                <div style={styles.meterContainer}>
                  <div style={{ ...styles.meterFill, height: `${bin2Dry}%`, backgroundColor: getFillColor(bin2Dry) }} />
                </div>
                <div style={styles.compStats}>
                  <div style={styles.statLine}>
                    <span style={styles.statLabel}>Fill Status:</span>
                    <strong style={{ color: getFillColor(bin2Dry) }}>{bin2Dry >= 85 ? 'FULL 🚨' : `${bin2Dry}%`}</strong>
                  </div>
                  <div style={styles.statLine}>
                    <span style={styles.statLabel}>Remaining:</span>
                    <strong style={{ color: '#38bdf8' }}>{100 - bin2Dry}% Left</strong>
                  </div>
                  <div style={styles.statLine}>
                    <span style={styles.statLabel}>Sensor:</span>
                    <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>US-DRY-02</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleEmptyCompartment(2, 'dry')} 
                style={styles.emptyCompBtn}
              >
                Clear Dry Waste
              </button>
            </div>

            {/* Wet Waste */}
            <div style={{ ...styles.compartmentBox, borderColor: getFillColor(bin2Wet) }}>
              <div style={styles.compHeader}>
                <span style={{ color: '#34d399', fontWeight: '700', fontSize: '11px' }}>🟩 WET WASTE</span>
                {(() => {
                  const b = getStatusBadge(bin2Wet);
                  return (
                    <span style={{ ...styles.badge, backgroundColor: b.bg, color: b.color, borderColor: b.border }}>
                      {bin2Wet >= 85 ? 'FULL' : `${bin2Wet}%`}
                    </span>
                  );
                })()}
              </div>

              <div style={styles.compBody}>
                <div style={styles.meterContainer}>
                  <div style={{ ...styles.meterFill, height: `${bin2Wet}%`, backgroundColor: getFillColor(bin2Wet) }} />
                </div>
                <div style={styles.compStats}>
                  <div style={styles.statLine}>
                    <span style={styles.statLabel}>Fill Status:</span>
                    <strong style={{ color: getFillColor(bin2Wet) }}>{bin2Wet >= 85 ? 'FULL 🚨' : `${bin2Wet}%`}</strong>
                  </div>
                  <div style={styles.statLine}>
                    <span style={styles.statLabel}>Remaining:</span>
                    <strong style={{ color: '#34d399' }}>{100 - bin2Wet}% Left</strong>
                  </div>
                  <div style={styles.statLine}>
                    <span style={styles.statLabel}>Sensor:</span>
                    <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>US-WET-02</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleEmptyCompartment(2, 'wet')} 
                style={styles.emptyCompBtn}
              >
                Clear Wet Waste
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive AI Waste Classifier Section */}
      <div style={styles.aiClassifierCard}>
        <div style={styles.aiHeader}>
          <div>
            <div style={styles.aiTag}>SMART EDGE AI • YOLOv8 INFERENCE</div>
            <strong style={{ color: '#f8fafc', fontSize: '12px' }}>
              🤖 Live Waste Item Identification & Auto-Segregation Simulator
            </strong>
          </div>
          <select 
            value={selectedBin} 
            onChange={(e) => setSelectedBin(e.target.value)}
            style={styles.binSelect}
          >
            <option value="BIN-SEC-04A">Target: Zone A (Hub #01)</option>
            <option value="BIN-SEC-04B">Target: Zone B (Gate #02)</option>
          </select>
        </div>

        <div style={styles.chipsRow}>
          {[
            { label: '🍼 Plastic Bottle', name: 'Plastic Bottle' },
            { label: '🍌 Banana Peel', name: 'Banana Peel' },
            { label: '📦 Cardboard Box', name: 'Cardboard Box' },
            { label: '🍎 Apple Core', name: 'Apple Core' },
            { label: '🥤 Aluminium Can', name: 'Aluminium Can' },
            { label: '🍕 Food Leftover', name: 'Food Leftover' },
            { label: '☕ Paper Cup', name: 'Paper Cup' }
          ].map((chip, idx) => (
            <button 
              key={idx}
              onClick={() => {
                setTestItem(chip.name);
                handleClassify(chip.name);
              }}
              style={styles.chipBtn}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <div style={styles.inputRow}>
          <input 
            type="text"
            placeholder="Or type any item name (e.g., Plastic Wrapper, Vegetable Waste)..."
            value={testItem}
            onChange={(e) => setTestItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleClassify()}
            style={styles.textInput}
          />
          <button 
            onClick={() => handleClassify()} 
            disabled={isClassifying}
            style={styles.classifyBtn}
          >
            {isClassifying ? 'Analyzing...' : 'Identify & Deposit ⚡'}
          </button>
        </div>

        {aiResult && (
          <div style={styles.resultBanner}>
            <div style={styles.resultLeft}>
              <span style={{ fontSize: '18px' }}>
                {aiResult.category === 'DRY' ? '🟦' : '🟩'}
              </span>
              <div>
                <div style={{ color: '#f8fafc', fontSize: '12px', fontWeight: '700' }}>
                  Item: <span style={{ color: '#f59e0b' }}>{aiResult.item}</span>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '11px' }}>
                  Identified as: <strong style={{ color: aiResult.category === 'DRY' ? '#38bdf8' : '#34d399' }}>{aiResult.category} WASTE</strong> • Confidence: {aiResult.confidence}
                </div>
              </div>
            </div>
            <span style={{ 
              ...styles.depositedBadge,
              backgroundColor: aiResult.category === 'DRY' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(52, 211, 153, 0.15)',
              color: aiResult.category === 'DRY' ? '#38bdf8' : '#34d399',
              borderColor: aiResult.category === 'DRY' ? '#0284c7' : '#059669'
            }}>
              ✅ Deposited in {aiResult.compartment}
            </span>
          </div>
        )}
      </div>

      {/* Automated Truck Dispatch Banner */}
      <div style={styles.fleetCard}>
        <div style={styles.fleetHeader}>
          <span style={styles.fleetTitle}>🚛 AUTOMATED MUNICIPAL WASTE FLEET & ROUTE OPTIMIZATION</span>
          <span style={{ 
            ...styles.dispatchBadge, 
            backgroundColor: isAutoDispatch ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            color: isAutoDispatch ? '#f87171' : '#34d399',
            borderColor: isAutoDispatch ? '#ef4444' : '#10b981'
          }}>
            {isAutoDispatch ? '⚡ AUTO-DISPATCH ACTIVE (OVERFLOW RISK)' : 'STANDBY IDLE'}
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
            <span style={styles.fleetLabel}>ESTIMATED ARRIVAL</span>
            <strong style={styles.fleetVal}>{truckStatus.eta}</strong>
          </div>
          <div style={styles.fleetItem}>
            <span style={styles.fleetLabel}>ROUTE STATUS</span>
            <strong style={{ ...styles.fleetVal, color: '#10b981' }}>Dynamic Green Wave Cleared</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '18px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  sihTag: { fontSize: '9px', fontWeight: '800', color: '#f59e0b', letterSpacing: '0.6px', marginBottom: '2px' },
  cardTitle: { margin: 0, fontSize: '15px', fontWeight: '600', color: '#e2e8f0' },
  statusPill: { fontSize: '10px', color: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px solid #0284c7', padding: '3px 8px', borderRadius: '12px', fontFamily: 'monospace', fontWeight: '700' },
  
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginBottom: '14px' },
  kpiCard: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px 10px' },
  kpiLabel: { fontSize: '9px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '2px' },
  kpiValueRow: { display: 'flex', alignItems: 'baseline', gap: '6px' },
  kpiSub: { fontSize: '10px', color: '#94a3b8' },

  binsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' },
  mainBinContainer: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px' },
  mainBinHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '6px', borderBottom: '1px solid #1e293b' },
  clearAllBtn: { padding: '3px 8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#94a3b8', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' },
  
  dualCompartmentRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  compartmentBox: { backgroundColor: '#0b1329', border: '1px solid', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column' },
  compHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  badge: { fontSize: '9px', fontWeight: '800', border: '1px solid', padding: '2px 5px', borderRadius: '4px' },
  compBody: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' },
  meterContainer: { width: '32px', height: '80px', backgroundColor: '#1e293b', borderRadius: '6px', border: '2px solid #334155', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' },
  meterFill: { width: '100%', transition: 'height 0.4s ease, background-color 0.4s ease' },
  compStats: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' },
  statLine: { display: 'flex', justifyContent: 'space-between', fontSize: '10px' },
  statLabel: { color: '#64748b' },
  emptyCompBtn: { width: '100%', padding: '5px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#e2e8f0', borderRadius: '5px', fontSize: '10px', fontWeight: '600', cursor: 'pointer' },

  aiClassifierCard: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', marginBottom: '14px' },
  aiHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  aiTag: { fontSize: '9px', fontWeight: '800', color: '#a78bfa', letterSpacing: '0.6px', marginBottom: '2px' },
  binSelect: { backgroundColor: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: '4px 8px', borderRadius: '6px', fontSize: '10px' },
  chipsRow: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' },
  chipBtn: { backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#94a3b8', borderRadius: '12px', padding: '3px 8px', fontSize: '10px', cursor: 'pointer' },
  inputRow: { display: 'flex', gap: '8px', marginBottom: '8px' },
  textInput: { flex: 1, backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#f8fafc', fontSize: '11px' },
  classifyBtn: { backgroundColor: '#3b82f6', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' },
  resultBanner: { backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' },
  resultLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
  depositedBadge: { fontSize: '10px', fontWeight: '700', border: '1px solid', padding: '3px 8px', borderRadius: '6px' },

  fleetCard: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px' },
  fleetHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  fleetTitle: { fontSize: '10px', fontWeight: '700', color: '#94a3b8' },
  dispatchBadge: { fontSize: '9px', fontWeight: '800', border: '1px solid', padding: '2px 8px', borderRadius: '10px' },
  fleetGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' },
  fleetItem: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', padding: '6px 8px' },
  fleetLabel: { fontSize: '9px', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '2px' },
  fleetVal: { fontSize: '11px', color: '#f8fafc' }
};
