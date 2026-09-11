import { API_BASE_URL } from '../utils/constants';

/**
 * REST API client for UrbanPulse SIH PS 26222 Backend
 */
export const api = {
  async getStatus() {
    const res = await fetch(`${API_BASE_URL}/status`);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
  },

  async getTelemetry() {
    const res = await fetch(`${API_BASE_URL}/telemetry`);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
  },

  async toggleEmergency(active) {
    const res = await fetch(`${API_BASE_URL}/emergency`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active })
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
  },

  async toggleLogisticsPriority(active) {
    const res = await fetch(`${API_BASE_URL}/logistics/priority`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active })
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
  },

  async updateTraffic(payload) {
    const res = await fetch(`${API_BASE_URL}/traffic/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
  },

  async toggleParking(slot, occupied) {
    const res = await fetch(`${API_BASE_URL}/parking/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot, occupied })
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
  },

  async assignFreightBay(payload) {
    const res = await fetch(`${API_BASE_URL}/freight/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
  },

  async getAnalytics() {
    const res = await fetch(`${API_BASE_URL}/analytics`);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
  },

  async getFleet() {
    const res = await fetch(`${API_BASE_URL}/fleet`);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
  },

  async getHardware() {
    const res = await fetch(`${API_BASE_URL}/hardware`);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
  },

  async getDustbins() {
    const res = await fetch(`${API_BASE_URL}/dustbins`);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
  },

  async updateDustbin(payload) {
    const res = await fetch(`${API_BASE_URL}/dustbins/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
  },

  async emptyDustbin(binId, compartment = 'both') {
    const res = await fetch(`${API_BASE_URL}/dustbins/empty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ binId, compartment })
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
  },

  async classifyWaste(binId, item) {
    const res = await fetch(`${API_BASE_URL}/dustbins/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ binId, item })
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
  },

  async stage1Identify(binId, item) {
    const res = await fetch(`${API_BASE_URL}/dustbins/stage1-identify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ binId, item })
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
  },

  async stage2ConfirmDrop(binId, dropped, weightGrams = 30) {
    const res = await fetch(`${API_BASE_URL}/dustbins/stage2-confirm-drop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ binId, dropped, weightGrams })
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
  },

  async getPrediction() {
    const res = await fetch(`${API_BASE_URL}/dustbins/prediction`);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
  },

  async simulateCrisis(scenario = 'WATER_PIPE_BURST') {
    const res = await fetch(`${API_BASE_URL}/crisis/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario })
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
  },

  async resetCrisis() {
    const res = await fetch(`${API_BASE_URL}/crisis/reset`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
  }
};
