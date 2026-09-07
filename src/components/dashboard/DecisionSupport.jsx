import React, { useState } from 'react';

const DECISIONS = [
  {
    id: 'DS-001',
    sector: 'TRAFFIC',
    priority: 'HIGH',
    icon: '🚦',
    title: 'Increase green cycle on North corridor',
    reason: 'Predicted congestion risk HIGH. 38 vehicles queued.',
    action: 'Extend Lane 1 green phase by +4s for next 3 cycles.',
    status: 'PENDING',
    confidence: 91,
  },
  {
    id: 'DS-002',
    sector: 'WASTE',
    priority: 'MEDIUM',
    icon: '🗑️',
    title: 'Dispatch Truck WT-04 to Zone A',
    reason: 'Bin #01 has crossed 75% threshold. Auto-trigger condition met.',
    action: 'Route optimization via Sector 7 bypass. ETA: 4 mins.',
    status: 'EXECUTED',
    confidence: 98,
  },
  {
    id: 'DS-003',
    sector: 'WATER',
    priority: 'LOW',
    icon: '💧',
    title: 'Activate reservoir inflow pump',
    reason: 'Tank level approaching 60%. Demand forecast rises post 18:00.',
    action: 'Enable Inflow Pump at 80% capacity for 20 min.',
    status: 'PENDING',
    confidence: 84,
  },
  {
    id: 'DS-004',
    sector: 'AIR',
    priority: 'MEDIUM',
    icon: '🌬️',
    title: 'Adjust signal timing to reduce idling',
    reason: 'AQI exceeded 105 at Junction 04. CO2 spike detected.',
    action: 'Reduce red-light hold at lanes 2 & 4 by 3s each cycle.',
    status: 'PENDING',
    confidence: 78,
  },
];

const PRIORITY_COLORS = {
  HIGH: { bg: 'rgba(239,68,68,0.15)', text: '#f87171', border: '#ef4444' },
  MEDIUM: { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24', border: '#f59e0b' },
  LOW: { bg: 'rgba(16,185,129,0.15)', text: '#34d399', border: '#10b981' },
};

export default function DecisionSupport({ alerts }) {
  const [decisions, setDecisions] = useState(DECISIONS);

  const handleExecute = (id) => {
    setDecisions(prev => prev.map(d => d.id === id ? { ...d, status: 'EXECUTED' } : d));
  };

  const handleDismiss = (id) => {
    setDecisions(prev => prev.filter(d => d.id !== id));
  };

  const criticalCount = (alerts || []).filter(a => a.level === 'CRITICAL').length;
  const warningCount = (alerts || []).filter(a => a.level === 'WARNING').length;
  const pendingCount = decisions.filter(d => d.status === 'PENDING').length;

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <div style={styles.sihTag}>AI DECISION ENGINE v2.4 — RULE-BASED + ML HYBRID</div>
          <h3 style={styles.cardTitle}>🛡️ Automated Decision Support &amp; Recommended Actions</h3>
        </div>
        <span style={styles.liveTag}>⚡ LIVE INFERENCE</span>
      </div>

      <div style={styles.summaryRow}>
        <div style={{ ...styles.summaryBox, borderColor: '#ef4444' }}>
          <span style={styles.summaryKey}>CRITICAL ALERTS</span>
          <strong style={{ ...styles.summaryVal, color: '#f87171' }}>{criticalCount}</strong>
        </div>
        <div style={{ ...styles.summaryBox, borderColor: '#f59e0b' }}>
          <span style={styles.summaryKey}>WARNINGS</span>
          <strong style={{ ...styles.summaryVal, color: '#fbbf24' }}>{warningCount}</strong>
        </div>
        <div style={{ ...styles.summaryBox, borderColor: '#38bdf8' }}>
          <span style={styles.summaryKey}>PENDING ACTIONS</span>
          <strong style={{ ...styles.summaryVal, color: '#38bdf8' }}>{pendingCount}</strong>
        </div>
        <div style={{ ...styles.summaryBox, borderColor: '#10b981' }}>
          <span style={styles.summaryKey}>AUTO-EXECUTED</span>
          <strong style={{ ...styles.summaryVal, color: '#34d399' }}>
            {decisions.filter(d => d.status === 'EXECUTED').length}
          </strong>
        </div>
      </div>

      <div style={styles.decisionList}>
        {decisions.map(d => {
          const pc = PRIORITY_COLORS[d.priority];
          const isExecuted = d.status === 'EXECUTED';
          return (
            <div
              key={d.id}
              style={{
                ...styles.decisionCard,
                opacity: isExecuted ? 0.7 : 1,
                borderLeft: `4px solid ${pc.border}`
              }}
            >
              <div style={styles.decTop}>
                <div style={styles.decLeft}>
                  <span style={styles.decIcon}>{d.icon}</span>
                  <div>
                    <div style={styles.decMeta}>
                      <span style={{ ...styles.priTag, backgroundColor: pc.bg, color: pc.text, borderColor: pc.border }}>
                        {d.priority}
                      </span>
                      <span style={styles.sectorTag}>{d.sector}</span>
                      <span style={styles.decId}>{d.id}</span>
                    </div>
                    <div style={styles.decTitle}>{d.title}</div>
                  </div>
                </div>
                <div style={styles.confBadge}>
                  <span style={styles.confLabel}>CONFIDENCE</span>
                  <strong style={{ ...styles.confVal, color: d.confidence > 85 ? '#34d399' : d.confidence > 70 ? '#fbbf24' : '#f87171' }}>
                    {d.confidence}%
                  </strong>
                </div>
              </div>

              <div style={styles.decBody}>
                <div style={styles.decReason}>
                  <span style={styles.decReasonKey}>WHY: </span>{d.reason}
                </div>
                <div style={styles.decAction}>
                  <span style={styles.decActionKey}>ACTION: </span>{d.action}
                </div>
              </div>

              <div style={styles.decFooter}>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: isExecuted ? 'rgba(16,185,129,0.15)' : 'rgba(56,189,248,0.1)',
                  color: isExecuted ? '#34d399' : '#38bdf8',
                  borderColor: isExecuted ? '#10b981' : '#0284c7'
                }}>
                  {isExecuted ? '✅ EXECUTED' : '⏳ AWAITING APPROVAL'}
                </span>
                {!isExecuted && (
                  <div style={styles.decActions}>
                    <button onClick={() => handleExecute(d.id)} style={styles.execBtn}>
                      ▶ Execute
                    </button>
                    <button onClick={() => handleDismiss(d.id)} style={styles.dismissBtn}>
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {decisions.length === 0 && (
          <div style={styles.emptyState}>
            ✅ All AI-recommended actions have been executed. System operating optimally.
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' },
  sihTag: { fontSize: '9px', fontWeight: '800', color: '#a78bfa', letterSpacing: '0.5px', marginBottom: '2px' },
  cardTitle: { margin: 0, fontSize: '15px', fontWeight: '600', color: '#e2e8f0' },
  liveTag: { fontSize: '10px', color: '#34d399', backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', padding: '3px 8px', borderRadius: '12px', fontWeight: '700', whiteSpace: 'nowrap' },
  summaryRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '14px' },
  summaryBox: { backgroundColor: '#020617', border: '1px solid', borderRadius: '8px', padding: '10px', textAlign: 'center' },
  summaryKey: { fontSize: '9px', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '4px' },
  summaryVal: { fontSize: '22px', fontWeight: '800' },
  decisionList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  decisionCard: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', transition: 'opacity 0.3s ease' },
  decTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '12px' },
  decLeft: { display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1 },
  decIcon: { fontSize: '20px', flexShrink: 0, marginTop: '2px' },
  decMeta: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' },
  priTag: { fontSize: '9px', fontWeight: '800', border: '1px solid', padding: '1px 6px', borderRadius: '4px' },
  sectorTag: { fontSize: '10px', color: '#64748b', fontWeight: '700' },
  decId: { fontSize: '10px', color: '#475569', fontFamily: 'monospace' },
  decTitle: { fontSize: '13px', fontWeight: '600', color: '#e2e8f0' },
  confBadge: { textAlign: 'center', flexShrink: 0 },
  confLabel: { fontSize: '8px', color: '#64748b', fontWeight: '700', display: 'block' },
  confVal: { fontSize: '16px', fontWeight: '800' },
  decBody: { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px', padding: '8px', backgroundColor: '#0f172a', borderRadius: '6px' },
  decReason: { fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' },
  decReasonKey: { color: '#64748b', fontWeight: '700' },
  decAction: { fontSize: '11px', color: '#c7d2fe', lineHeight: '1.4' },
  decActionKey: { color: '#818cf8', fontWeight: '700' },
  decFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { fontSize: '10px', fontWeight: '700', border: '1px solid', padding: '2px 8px', borderRadius: '10px' },
  decActions: { display: 'flex', gap: '6px' },
  execBtn: { backgroundColor: '#0284c7', border: 'none', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer' },
  dismissBtn: { backgroundColor: 'transparent', border: '1px solid #334155', color: '#64748b', fontSize: '12px', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' },
  emptyState: { backgroundColor: '#020617', border: '1px solid #1e293b', padding: '16px', borderRadius: '8px', textAlign: 'center', fontSize: '12px', color: '#10b981' },
};
