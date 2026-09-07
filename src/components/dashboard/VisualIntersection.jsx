import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function VisualIntersection({ chartData = [] }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltipContainer}>
          <p style={styles.tooltipLabel}>{label}</p>
          {payload.map((item, index) => (
            <p key={index} style={{ ...styles.tooltipItem, color: item.color }}>
              {item.name}: <strong>{item.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <span style={styles.cardTitle}>📈 Live AQI vs Traffic Stream</span>
        <span style={styles.liveBadge}>LIVE</span>
      </div>

      {/* Compact Height Container */}
      <div style={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCars" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />

            <Area type="monotone" dataKey="aqi" name="AQI" stroke="#38bdf8" strokeWidth={1.5} fill="url(#colorAqi)" />
            <Area type="monotone" dataKey="traffic" name="Cars" stroke="#f59e0b" strokeWidth={1.5} fill="url(#colorCars)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'rgba(17, 24, 39, 0.75)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '12px 14px',
    marginTop: '10px'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px'
  },
  cardTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#e2e8f0'
  },
  liveBadge: {
    fontSize: '9px',
    fontWeight: '800',
    color: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    padding: '1px 6px',
    borderRadius: '8px'
  },
  chartWrapper: {
    width: '100%',
    height: '140px'
  },
  tooltipContainer: {
    backgroundColor: '#020617',
    border: '1px solid #334155',
    padding: '6px 8px',
    borderRadius: '6px'
  },
  tooltipLabel: {
    fontSize: '10px',
    color: '#94a3b8',
    marginBottom: '2px'
  },
  tooltipItem: {
    fontSize: '11px',
    margin: '1px 0'
  }
};