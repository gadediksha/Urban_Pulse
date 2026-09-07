/**
 * Helper utilities for UrbanPulse Smart City Grid
 */

export function getDensityColor(count) {
  if (count > 15) return '#ef4444'; // High Congestion (Red)
  if (count > 7) return '#f59e0b';  // Moderate Density (Yellow)
  return '#10b981';                 // Optimal Flow (Green)
}

export function getDensityLabel(count) {
  if (count > 15) return 'Heavy Congestion';
  if (count > 7) return 'Moderate Flow';
  return 'Clear Flow';
}

export function formatTime(isoString) {
  if (!isoString) return new Date().toLocaleTimeString();
  try {
    return new Date(isoString).toLocaleTimeString();
  } catch (e) {
    return isoString;
  }
}

export function calculateWaitReduction(count1, count2) {
  const total = count1 + count2;
  return Math.min(48, Math.max(22, 25 + Math.floor(total * 0.7)));
}
