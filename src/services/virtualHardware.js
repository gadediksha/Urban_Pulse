// src/services/virtualHardware.js

export class VirtualESP32 {
  constructor(nodeId = 'ESP32_SMART_JUNCTION_01') {
    this.nodeId = nodeId;
    this.bootTime = Date.now();

    // Hardware GPIO Registers
    this.gpio = {
      PIN_13_IR_LANE1: 1,
      PIN_12_IR_LANE2: 0,
      PIN_14_IR_LANE3: 1,
      PIN_27_IR_LANE4: 0,
      PIN_23_LIGHT_RELAY: 1,
      PIN_19_PUMP_RELAY: 0
    };

    // 12-Bit ADC Registers (0 - 4095)
    this.adc = {
      PIN_36_LDR_LUX: 450,
      PIN_39_MQ135_GAS: 1350,
      PIN_34_WATER_LVL: 2750
    };

    // Ultrasonic Distances (cm)
    this.ultrasonic = {
      dustbinDistanceCm: 14.2,
      parkingSlot1DistanceCm: 5.4,
      parkingSlot2DistanceCm: 22.0
    };
  }

  sampleEnvironment(lanes, isNightManual) {
    // 1. Dynamic Gas & AQI Sensor Calculation
    const noise = Math.floor((Math.random() - 0.5) * 60);
    this.adc.PIN_39_MQ135_GAS = Math.max(800, Math.min(3200, this.adc.PIN_39_MQ135_GAS + noise));
    const calculatedAqi = Math.floor((this.adc.PIN_39_MQ135_GAS / 4095) * 320);

    // 2. Ultrasonic Dustbin Level Simulation
    const binHeight = 30.0;
    this.ultrasonic.dustbinDistanceCm = Math.max(3.0, Math.min(28.0, this.ultrasonic.dustbinDistanceCm - 0.15));
    const dustbinFillPercent = Math.round(((binHeight - this.ultrasonic.dustbinDistanceCm) / binHeight) * 100);

    // 3. Smart Parking Ultrasonic Detection (< 10cm = OCCUPIED)
    const slot1Occupied = this.ultrasonic.parkingSlot1DistanceCm < 10.0;
    const slot2Occupied = this.ultrasonic.parkingSlot2DistanceCm < 10.0;

    // 4. LDR Street Light Sensing
    const isNight = isNightManual !== undefined ? isNightManual : this.adc.PIN_36_LDR_LUX < 800;
    this.gpio.PIN_23_LIGHT_RELAY = isNight ? 1 : 0;

    return {
      node_id: this.nodeId,
      timestamp: new Date().toLocaleTimeString(),
      uptime_sec: Math.floor((Date.now() - this.bootTime) / 1000),
      raw_adc: { ...this.adc },
      gpio: { ...this.gpio },
      processed: {
        aqi: calculatedAqi,
        pm25: Math.floor(calculatedAqi * 0.38),
        pm10: Math.floor(calculatedAqi * 0.65),
        co2: 400 + Math.floor(calculatedAqi * 1.8),
        no2: +(18 + calculatedAqi * 0.11).toFixed(1),
        dustbinFill: Math.min(100, Math.max(0, dustbinFillPercent)),
        slot1Occupied,
        slot2Occupied,
        streetLightRelay: this.gpio.PIN_23_LIGHT_RELAY === 1,
        soundDb: +(56 + (lanes ? lanes.reduce((s, l) => s + l.count, 0) * 0.5 : 10) + Math.random() * 2).toFixed(1),
        structuralVibe: +(0.08 + (lanes ? lanes.reduce((s, l) => s + l.count, 0) * 0.003 : 0.02) + Math.random() * 0.01).toFixed(3),
        waterPressure: +(4.1 + (Math.random() * 0.2 - 0.1)).toFixed(1),
        waterTds: 152 + Math.floor(Math.random() * 8),
        waterPurityStatus: 'EXCELLENT',
        leakDetected: false,
        gpsCoords: { lat: 28.6139, lng: 77.2090, label: 'Junction 04, Sector 7 Hub' }
      }
    };
  }
}