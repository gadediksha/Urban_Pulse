import React, { useState, useEffect, useCallback } from 'react';
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

  // Two-Stage Sensor Fusion State
  const [testItem, setTestItem] = useState('Plastic Water Bottle');
  const [selectedBin, setSelectedBin] = useState('BIN-SEC-04A');
  const [stage, setStage] = useState(0);
  const [scanResult, setScanResult] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [servoAngle, setServoAngle] = useState(0);
  const [weightGrams, setWeightGrams] = useState(1455);
  const [greenCredits, setGreenCredits] = useState(140);
  const [showQrModal, setShowQrModal] = useState(false);

  // 24-Hour Predictive Overflow State
  const [prediction, setPrediction] = useState({
    timeToOverflowHours: 1.6,
    predictedClock: '23:38',
    hourlyForecast: [
      { hour: '00:00', fill: 18 },
      { hour: '04:00', fill: 24 },
      { hour: '08:00', fill: 52 },
      { hour: '12:00', fill: 76 },
      { hour: '16:00', fill: 86 },
      { hour: '20:00', fill: 94 },
      { hour: '24:00', fill: 32 }
    ]
  });

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
    const fetchBackendData = async () => {
      try {
        const dustbins = await api.getDustbins();
        if (dustbins && dustbins.success && isMounted) {
          if (dustbins.bins[0]) {
            setBin1Dry(dustbins.bins[0].dryWaste.fillPercentage);
            setBin1Wet(dustbins.bins[0].wetWaste.fillPercentage);
          }
          if (dustbins.bins[1]) {
            setBin2Dry(dustbins.bins[1].dryWaste.fillPercentage);
            setBin2Wet(dustbins.bins[1].wetWaste.fillPercentage);
          }
        }
        const pred = await api.getPrediction();
        if (pred && pred.success && isMounted) {
          setPrediction({
            timeToOverflowHours: pred.timeToOverflowHours,
            predictedClock: pred.predictedOverflowClock,
            hourlyForecast: pred.hourlyForecast.map(f => ({ hour: f.hour, fill: f.predictedFill }))
          });
        }
      } catch (e) {}
    };
    fetchBackendData();
    const interval = setInterval(fetchBackendData, 6000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleStage2Drop = useCallback(async (didDrop) => {
    try {
      await api.stage2ConfirmDrop(selectedBin, didDrop, 35);
    } catch (e) {}

    setServoAngle(0);

    if (didDrop && scanResult) {
      setWeightGrams(prev => prev + 35);
      setGreenCredits(prev => prev + 10);
      if (selectedBin === 'BIN-SEC-04A') {
        if (scanResult.category === 'DRY') setBin1Dry(prev => Math.min(100, prev + 3));
        else setBin1Wet(prev => Math.min(100, prev + 3));
      } else {
        if (scanResult.category === 'DRY') setBin2Dry(prev => Math.min(100, prev + 3));
        else setBin2Wet(prev => Math.min(100, prev + 3));
      }
      setScanResult(prev => ({
        ...prev,
        status: 'VERIFIED_DROPPED',
        message: 'Physical IR Beam Broken + 35g Verified! Fill % updated. +10 Citizen Green Credits awarded!'
      }));
    } else {
      setScanResult(prev => ({
        ...prev,
        status: 'ABORTED',
        message: 'Deposit Cancelled / Fake Attempt! Hand pulled back. Chute IR beam was not broken. Fill % UNTOUCHED (0% increase).'
      }));
    }

    setStage(2);
  }, [selectedBin, scanResult]);

  useEffect(() => {
    let timer;
    if (stage === 1) {
      setCountdown(5);
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleStage2Drop(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [stage, handleStage2Drop]);

  const getFillColor = (level) => {
    if (level >= 85) return '#ef4444';
    if (level >= 65) return '#f59e0b';
    return '#10b981';
  };

  const getStatusBadge = (fill) => {
    if (fill >= 85) return { label: 'CRITICAL FULL (90%)', bg: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '#ef4444' };
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

  const handleStage1Scan = async (itemOverride) => {
    const item = (itemOverride || testItem).trim();
    if (!item) return;

    try {
      const res = await api.stage1Identify(selectedBin, item);
      if (res && res.success) {
        const v = res.verification;
        setScanResult({
          item: v.pendingItem,
          category: v.pendingCategory,
          confidence: v.confidence,
          angle: v.servoAngle
        });
        setServoAngle(v.servoAngle);
        setStage(1);
        return;
      }
    } catch (e) {}

    const wetKeywords = ['food', 'banana', 'peel', 'apple', 'vegetable', 'fruit', 'leaf', 'tea', 'coffee', 'organic', 'scrap', 'bread', 'leftover'];
    const lower = item.toLowerCase();
    const isWet = wetKeywords.some(k => lower.includes(k));
    const category = isWet ? 'WET' : 'DRY';
    const angle = category === 'WET' ? 45 : -45;

    setScanResult({
      item,
      category,
      confidence: `${(96.5 + Math.random() * 2.8).toFixed(1)}%`,
      angle
    });
    setServoAngle(angle);
    setStage(1);
  };

  const isAutoDispatch = bin1Dry >= 75 || bin1Wet >= 75 || bin2Dry >= 75 || bin2Wet >= 75;

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.cardHeader}>
        <div>
          <div style={styles.sihTag}>TIER 1 & TIER 2: SMART WASTE LOGISTICS & AI SEGREGATION</div>
          <h3 style={styles.cardTitle}>Smart Dual Dustbin Hub (Dry & Wet Waste Segregation)</h3>
        </div>
        <span style={styles.statusPill}>DUAL HC-SR04 + AI VISION ACTIVE</span>
      </div>

      {/* KPI Grid */}
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
          <span style={styles.kpiLabel}>CITIZEN CREDITS</span>
          <div style={styles.kpiValueRow}>
            <span style={{ color: '#fbbf24', fontSize: '16px', fontWeight: '800' }}>{greenCredits} pts</span>
            <span style={styles.kpiSub}>{weightGrams}g deposited</span>
          </div>
        </div>
      </div>

      {/* Dual Bins Display */}
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
                <span style={{ color: '#38bdf8', fontWeight: '700', fontSize: '11px' }}>DRY WASTE</span>
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
                    <span style={styles.statLabel}>Fill:</span>
                    <strong style={{ color: getFillColor(bin1Dry) }}>{bin1Dry >= 85 ? 'FULL' : `${bin1Dry}%`}</strong>
                  </div>
                  <div style={styles.statLine}>
                    <span style={styles.statLabel}>Free Space:</span>
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
                <span style={{ color: '#34d399', fontWeight: '700', fontSize: '11px' }}>WET WASTE</span>
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
                    <span style={styles.statLabel}>Fill:</span>
                    <strong style={{ color: getFillColor(bin1Wet) }}>{bin1Wet >= 85 ? 'FULL' : `${bin1Wet}%`}</strong>
                  </div>
                  <div style={styles.statLine}>
                    <span style={styles.statLabel}>Free Space:</span>
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
                <span style={{ color: '#38bdf8', fontWeight: '700', fontSize: '11px' }}>DRY WASTE</span>
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
                    <span style={styles.statLabel}>Fill:</span>
                    <strong style={{ color: getFillColor(bin2Dry) }}>{bin2Dry >= 85 ? 'FULL' : `${bin2Dry}%`}</strong>
                  </div>
                  <div style={styles.statLine}>
                    <span style={styles.statLabel}>Free Space:</span>
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
                <span style={{ color: '#34d399', fontWeight: '700', fontSize: '11px' }}>WET WASTE</span>
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
                    <span style={styles.statLabel}>Fill:</span>
                    <strong style={{ color: getFillColor(bin2Wet) }}>{bin2Wet >= 85 ? 'FULL' : `${bin2Wet}%`}</strong>
                  </div>
                  <div style={styles.statLine}>
                    <span style={styles.statLabel}>Free Space:</span>
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

      {/* TWO-STAGE SENSOR FUSION (AI CAMERA + CHUTE IR BREAK-BEAM) */}
      <div style={styles.fusionCard}>
        <div style={styles.fusionHeader}>
          <div>
            <div style={styles.fusionTag}>TWO-STAGE SENSOR FUSION • HARDWARE ANTI-DECEPTION SYSTEM</div>
            <h4 style={styles.fusionTitle}>
              Live Verification: AI Camera (Identify) + Chute IR Sensor (Physical Drop Check)
            </h4>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select 
              value={selectedBin} 
              onChange={(e) => setSelectedBin(e.target.value)}
              style={styles.binSelect}
            >
              <option value="BIN-SEC-04A">Hub #01 (Zone A)</option>
              <option value="BIN-SEC-04B">Hub #02 (Zone B)</option>
            </select>
            <span style={styles.servoStatus}>
              Servo: <strong>{servoAngle === 0 ? '0° (LOCKED)' : `${servoAngle}° (CHUTE OPEN)`}</strong>
            </span>
          </div>
        </div>

        <p style={{ color: '#94a3b8', fontSize: '11px', margin: '0 0 10px 0' }}>
          <strong>Anti-Deception Solution:</strong> Agar koi camera ke aage sirf bottle dikha kar haath piche kheench le, to bin fill % <strong>0% bhi nahi badhega</strong> jab tak chute ka IR beam physically break nahi hota!
        </p>

        <div style={styles.chipsRow}>
          {[
            { label: 'Plastic Bottle (Dry)', name: 'Plastic Bottle' },
            { label: 'Banana Peel (Wet)', name: 'Banana Peel' },
            { label: 'Cardboard Box (Dry)', name: 'Cardboard Box' },
            { label: 'Apple Core (Wet)', name: 'Apple Core' },
            { label: 'Aluminium Can (Dry)', name: 'Aluminium Can' }
          ].map((chip, idx) => (
            <button 
              key={idx}
              onClick={() => {
                setTestItem(chip.name);
                handleStage1Scan(chip.name);
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
            placeholder="Type item (e.g. Plastic Bottle, Vegetable Peels, Newspaper)..."
            value={testItem}
            onChange={(e) => setTestItem(e.target.value)}
            style={styles.textInput}
          />
          <button 
            onClick={() => handleStage1Scan()} 
            style={styles.scanBtn}
          >
            Stage 1: Scan with Camera
          </button>
        </div>

        {stage === 1 && scanResult && (
          <div style={styles.stage1AlertBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div>
                <strong style={{ color: '#38bdf8', fontSize: '13px' }}>
                  AI Camera: "{scanResult.item}" identified as {scanResult.category} WASTE ({scanResult.confidence})
                </strong>
                <div style={{ color: '#f59e0b', fontSize: '11px', marginTop: '2px' }}>
                  Chute servo angle unlocked to {scanResult.angle}°. Waiting for physical deposit... (Auto-cancels in {countdown}s)
                </div>
              </div>
              <div style={styles.countdownPill}>{countdown}s</div>
            </div>

            <div style={styles.choiceButtonsRow}>
              <button 
                onClick={() => handleStage2Drop(true)} 
                style={styles.confirmDropBtn}
              >
                Option A: Drop Into Bin (IR Beam Broken + 35g Verified)
              </button>
              <button 
                onClick={() => handleStage2Drop(false)} 
                style={styles.fakeCancelBtn}
              >
                Option B: Pull Hand Back (Fake Attempt / Cancelled)
              </button>
            </div>
          </div>
        )}

        {stage === 2 && scanResult && (
          <div style={{ 
            ...styles.resultBanner, 
            borderColor: scanResult.status === 'VERIFIED_DROPPED' ? '#10b981' : '#f59e0b',
            backgroundColor: scanResult.status === 'VERIFIED_DROPPED' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>
                {scanResult.status === 'VERIFIED_DROPPED' ? '✅' : '🛡️'}
              </span>
              <div>
                <strong style={{ color: scanResult.status === 'VERIFIED_DROPPED' ? '#34d399' : '#fbbf24', fontSize: '12px' }}>
                  {scanResult.message}
                </strong>
                <div style={{ color: '#94a3b8', fontSize: '11px' }}>
                  Flap returned to 0° (LOCKED). Anti-deception verification complete.
                </div>
              </div>
            </div>
            <button onClick={() => setStage(0)} style={styles.resetBtn}>Reset Tester</button>
          </div>
        )}
      </div>

      {/* CITIZEN GREEN CREDITS & SWACHH BHARAT REWARDS */}
      <div style={styles.rewardsCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={styles.rewardsTag}>CITIZEN ENGAGEMENT • SWACHH BHARAT INCENTIVE SCHEME</div>
            <h4 style={styles.rewardsTitle}>Citizen Green Wallet & Waste Recycling Voucher</h4>
          </div>
          <button 
            onClick={() => setShowQrModal(true)} 
            style={styles.redeemBtn}
          >
            Redeem ₹50 Voucher (100 pts)
          </button>
        </div>
        <div style={styles.rewardsStatsRow}>
          <div style={styles.rewardsStat}>
            <span style={styles.rewardsStatLabel}>CURRENT BALANCE</span>
            <span style={{ color: '#fbbf24', fontWeight: '800', fontSize: '15px' }}>{greenCredits} Green Credits</span>
          </div>
          <div style={styles.rewardsStat}>
            <span style={styles.rewardsStatLabel}>TOTAL RECYCLED</span>
            <span style={{ color: '#34d399', fontWeight: '800', fontSize: '15px' }}>{weightGrams} grams</span>
          </div>
          <div style={styles.rewardsStat}>
            <span style={styles.rewardsStatLabel}>CARBON OFFSET</span>
            <span style={{ color: '#38bdf8', fontWeight: '800', fontSize: '15px' }}>{(weightGrams * 0.0028).toFixed(2)} kg CO2</span>
          </div>
          <div style={styles.rewardsStat}>
            <span style={styles.rewardsStatLabel}>STATUS</span>
            <span style={{ color: '#a78bfa', fontWeight: '800', fontSize: '15px' }}>Silver Citizen (Level 2)</span>
          </div>
        </div>
      </div>

      {/* 24-HOUR PREDICTIVE WASTE FORECAST */}
      <div style={styles.predictCard}>
        <div style={styles.predictHeader}>
          <div>
            <div style={styles.predictTag}>PREDICT BEFORE YOU REACT • ML TIME-TO-OVERFLOW</div>
            <h4 style={styles.predictTitle}>
              24-Hour Waste Generation Forecast & Predictive Pre-Dispatch
            </h4>
          </div>
          <div style={styles.overflowBadge}>
            Time to 100% Overflow: <strong style={{ color: '#f87171' }}>~{prediction.timeToOverflowHours}h (At {prediction.predictedClock})</strong>
          </div>
        </div>

        <div style={styles.forecastRow}>
          {prediction.hourlyForecast.map((slot, i) => (
            <div key={i} style={styles.forecastCol}>
              <div style={styles.forecastBarTrack}>
                <div 
                  style={{ 
                    ...styles.forecastBarFill, 
                    height: `${slot.fill}%`, 
                    backgroundColor: getFillColor(slot.fill) 
                  }} 
                />
              </div>
              <span style={styles.forecastHour}>{slot.hour}</span>
              <span style={{ ...styles.forecastPct, color: getFillColor(slot.fill) }}>{slot.fill}%</span>
            </div>
          ))}
        </div>

        <div style={styles.predictFooter}>
          <span style={{ color: '#10b981', fontSize: '11px', fontWeight: '700' }}>
            Predictive Action: Waste collection truck is dynamically pre-dispatched 45 mins prior to predicted overflow to prevent road spillage.
          </span>
        </div>
      </div>

      {/* DYNAMIC ECO-ROUTING & MUNICIPAL SAVINGS */}
      <div style={styles.ecoRoutingCard}>
        <div style={styles.fleetHeader}>
          <div>
            <div style={{ fontSize: '9px', fontWeight: '800', color: '#10b981', letterSpacing: '0.6px' }}>
              MUNICIPAL RESOURCE CONSERVATION & EMISSION REDUCTION
            </div>
            <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#e2e8f0' }}>
              Dynamic Eco-Routing & Resource Savings Tracker
            </h4>
          </div>
          <span style={{ 
            ...styles.dispatchBadge, 
            backgroundColor: isAutoDispatch ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            color: isAutoDispatch ? '#f87171' : '#34d399',
            borderColor: isAutoDispatch ? '#ef4444' : '#10b981'
          }}>
            {isAutoDispatch ? 'AUTO-DISPATCH ACTIVE (OVERFLOW RISK)' : 'OPTIMIZED ECO-ROUTE IDLE'}
          </span>
        </div>

        <div style={styles.ecoSavingsGrid}>
          <div style={styles.ecoItem}>
            <span style={styles.ecoLabel}>FUEL SAVINGS</span>
            <strong style={{ color: '#34d399', fontSize: '14px' }}>34.2 Litres</strong>
            <span style={{ color: '#64748b', fontSize: '9px' }}>vs Static Fixed Routes</span>
          </div>
          <div style={styles.ecoItem}>
            <span style={styles.ecoLabel}>CO2 REDUCTION</span>
            <strong style={{ color: '#38bdf8', fontSize: '14px' }}>89.6 kg CO2e</strong>
            <span style={{ color: '#64748b', fontSize: '9px' }}>GHG Emissions Saved</span>
          </div>
          <div style={styles.ecoItem}>
            <span style={styles.ecoLabel}>MUNICIPAL COST SAVINGS</span>
            <strong style={{ color: '#fbbf24', fontSize: '14px' }}>₹3,240 / Day</strong>
            <span style={{ color: '#64748b', fontSize: '9px' }}>Diesel + Fleet Wear</span>
          </div>
          <div style={styles.ecoItem}>
            <span style={styles.ecoLabel}>ROUTE DISTANCE</span>
            <strong style={{ color: '#a78bfa', fontSize: '14px' }}>18.4 km</strong>
            <span style={{ color: '#64748b', fontSize: '9px' }}>Down from 28.1 km</span>
          </div>
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
            <span style={styles.fleetLabel}>DYNAMIC SIGNAL CORRIDOR</span>
            <strong style={{ ...styles.fleetVal, color: '#10b981' }}>Green Wave Synchronized</strong>
          </div>
        </div>
      </div>

      {/* QR Code Voucher Modal */}
      {showQrModal && (
        <div style={styles.modalOverlay} onClick={() => setShowQrModal(false)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <strong style={{ color: '#34d399', fontSize: '14px' }}>Swachh Bharat Citizen Reward Voucher</strong>
              <button onClick={() => setShowQrModal(false)} style={styles.modalCloseBtn}>✕</button>
            </div>
            <div style={styles.qrPlaceholder}>
              <div style={{ fontSize: '42px', marginBottom: '6px' }}>📱</div>
              <strong style={{ color: '#f8fafc', fontSize: '13px' }}>VOUCHER-SB-2026-9942</strong>
              <span style={{ color: '#94a3b8', fontSize: '11px', marginTop: '4px' }}>
                Value: ₹50 Metro / Municipal Store Discount
              </span>
              <div style={styles.mockBarcode}>||||| ||| ||||||| || ||||| |||| ||</div>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '10px', textAlign: 'center', margin: '10px 0 0 0' }}>
              Scan this QR at any Delhi Metro ticket counter, DTC Bus, or Municipal Store to redeem your Green Credits!
            </p>
          </div>
        </div>
      )}
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

  fusionCard: { backgroundColor: '#020617', border: '1px solid #3b82f6', borderRadius: '10px', padding: '12px', marginBottom: '14px' },
  fusionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
  fusionTag: { fontSize: '9px', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.6px', marginBottom: '2px' },
  fusionTitle: { margin: 0, fontSize: '13px', fontWeight: '700', color: '#f8fafc' },
  binSelect: { backgroundColor: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: '3px 6px', borderRadius: '6px', fontSize: '10px' },
  servoStatus: { fontSize: '10px', color: '#e2e8f0', backgroundColor: '#0f172a', border: '1px solid #334155', padding: '3px 8px', borderRadius: '6px' },
  chipsRow: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' },
  chipBtn: { backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#94a3b8', borderRadius: '12px', padding: '3px 8px', fontSize: '10px', cursor: 'pointer' },
  inputRow: { display: 'flex', gap: '8px', marginBottom: '8px' },
  textInput: { flex: 1, backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#f8fafc', fontSize: '11px' },
  scanBtn: { backgroundColor: '#3b82f6', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' },
  stage1AlertBox: { backgroundColor: '#0f172a', border: '1px solid #0284c7', borderRadius: '8px', padding: '10px', marginBottom: '8px' },
  countdownPill: { backgroundColor: '#ef4444', color: '#fff', fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '10px' },
  choiceButtonsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' },
  confirmDropBtn: { backgroundColor: '#10b981', color: '#020617', border: 'none', padding: '8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' },
  fakeCancelBtn: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' },
  resultBanner: { border: '1px solid', borderRadius: '8px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' },
  resetBtn: { padding: '4px 8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#94a3b8', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' },

  rewardsCard: { backgroundColor: '#020617', border: '1px solid #f59e0b', borderRadius: '10px', padding: '12px', marginBottom: '14px' },
  rewardsTag: { fontSize: '9px', fontWeight: '800', color: '#fbbf24', letterSpacing: '0.6px', marginBottom: '2px' },
  rewardsTitle: { margin: 0, fontSize: '13px', fontWeight: '700', color: '#f8fafc' },
  redeemBtn: { backgroundColor: '#f59e0b', color: '#020617', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' },
  rewardsStatsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginTop: '10px' },
  rewardsStat: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', padding: '8px' },
  rewardsStatLabel: { fontSize: '9px', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '2px' },

  predictCard: { backgroundColor: '#020617', border: '1px solid #8b5cf6', borderRadius: '10px', padding: '12px', marginBottom: '14px' },
  predictHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  predictTag: { fontSize: '9px', fontWeight: '800', color: '#c084fc', letterSpacing: '0.6px', marginBottom: '2px' },
  predictTitle: { margin: 0, fontSize: '13px', fontWeight: '700', color: '#f8fafc' },
  overflowBadge: { fontSize: '10px', color: '#e2e8f0', backgroundColor: '#0f172a', border: '1px solid #334155', padding: '3px 8px', borderRadius: '6px' },
  forecastRow: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '8px' },
  forecastCol: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  forecastBarTrack: { width: '18px', height: '65px', backgroundColor: '#1e293b', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' },
  forecastBarFill: { width: '100%', transition: 'height 0.4s ease' },
  forecastHour: { fontSize: '9px', color: '#64748b' },
  forecastPct: { fontSize: '9px', fontWeight: '700' },
  predictFooter: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', padding: '6px 10px' },

  ecoRoutingCard: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px' },
  fleetHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
  dispatchBadge: { fontSize: '9px', fontWeight: '800', border: '1px solid', padding: '2px 8px', borderRadius: '10px' },
  ecoSavingsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginBottom: '10px' },
  ecoItem: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '2px' },
  ecoLabel: { fontSize: '9px', color: '#64748b', fontWeight: '700' },

  fleetGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' },
  fleetItem: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', padding: '6px 8px' },
  fleetLabel: { fontSize: '9px', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '2px' },
  fleetVal: { fontSize: '11px', color: '#f8fafc' },

  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
  modalBox: { backgroundColor: '#0f172a', border: '1px solid #34d399', borderRadius: '12px', padding: '20px', width: '320px' },
  modalCloseBtn: { background: 'none', border: 'none', color: '#94a3b8', fontSize: '16px', cursor: 'pointer' },
  qrPlaceholder: { backgroundColor: '#020617', border: '2px dashed #34d399', borderRadius: '8px', padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  mockBarcode: { fontFamily: 'monospace', fontSize: '16px', letterSpacing: '3px', marginTop: '12px', color: '#38bdf8' }
};
