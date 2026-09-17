export const maintenanceApi = {
  predictMaintenance: async (features: Record<string, any>) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/predictions/maintenance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(features)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend not reachable. Simulating API response based on input features for demo purposes.");
    }

    // SIMULATED REAL RESPONSE FOR STATIC PREVIEW IF BACKEND IS DOWN
    // For EV, High Motor Temp or low SoC
    const motor_temp = features.Motor_Temperature || 60;
    const soc = features.SoC || 0.8;
    const vibration = features.Motor_Vibration || 0.1;
    
    let failure_risk = 0.05; // base 5%
    if (motor_temp > 90 || vibration > 1.0) {
      failure_risk = 0.85;
    } else if (soc < 0.1 || motor_temp > 75) {
      failure_risk = 0.35;
    } else if (motor_temp > 65) {
      failure_risk = 0.15;
    }
    
    let status = "HEALTHY";
    if (failure_risk > 0.6) status = "CRITICAL";
    else if (failure_risk > 0.3) status = "ATTENTION";
    else if (failure_risk > 0.15) status = "HIGH RISK";

    return {
      vehicle_id: features.vehicle_id || "TRK-02",
      prediction: failure_risk > 0.5 ? 1 : 0,
      failure_probability: failure_risk,
      health_score: 100 - (failure_risk * 100),
      risk_level: status,
      model_version: "v2.0-RF-EVIoT-Fallback"
    };
  }
};
