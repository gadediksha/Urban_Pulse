export const INITIAL_TELEMETRY = {
  lane1Count: 12,
  lane2Count: 4,
  parkingSlot1: true,
  parkingSlot2: false,
  emergencyCorridor: false,
  autoSimulate: true,
  lane1Signal: 'GREEN',
  lane2Signal: 'RED',
  dynamicGreenSec: 8
};

export const API_BASE_URL = "http://localhost:8000/api";
export const WS_BASE_URL = "ws://localhost:8000/ws/traffic";