import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export default function LiveMetricsChart({ chartData }) {
  // Custom Tooltip component for dark mode styling
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltipContainer}>
          <p style={styles.tooltipLabel}>{label}</p>
          {payload.map((item, index) => (
            <p key={index} style={{ ...styles.tooltipItem, color: item.color }}>
              {item.name}: <strong>{item.value} {item.unit || ''}</strong>
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
        <div>
          <h3 style={styles.cardTitle}>📈 Real-Time Analytics & Sensor Telemetry</h3>
          <p style={styles.cardSubtitle}>Continuous streaming of AQI vs Vehicle Density</p>
        </div>
        <span style={styles.liveBadge}>LIVE STREAM</span>
      </div>

      <div style={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {/* AQI Gradient */}
              <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
              {/* Traffic Density Gradient */}
              <linearGradient id="colorCars" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
            
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>}
            />

            {/* AQI Area Curve */}
            <Area
              type="monotone"
              dataKey="aqi"
              name="AQI Index"
              stroke="#38bdf8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAqi)"
              unit=""
            />

            {/* Traffic Cars Area Curve */}
            <Area
              type="monotone"
              dataKey="traffic"
              name="Total Vehicles"
              stroke="#f59e0b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCars)"
              unit=" cars"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  cardTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '700',
    color: '#f8fafc'
  },
  cardSubtitle: {
    margin: '2px 0 0 0',
    fontSize: '11px',
    color: '#64748b'
  },
  liveBadge: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid #10b981',
    padding: '2px 8px',
    borderRadius: '12px'
  },
  chartWrapper: {
    width: '100%',
    height: '260px'
  },
  tooltipContainer: {
    backgroundColor: '#020617',
    border: '1px solid #334155',
    padding: '8px 12px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
  },
  tooltipLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: '4px'
  },
  tooltipItem: {
    fontSize: '12px',
    margin: '2px 0'
  }
};