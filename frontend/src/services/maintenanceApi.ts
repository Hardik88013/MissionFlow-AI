export const maintenanceApi = {
  predictMaintenance: async (features: Record<string, any>) => {
    // In a real app, this would be: 
    // const res = await fetch('/api/predictions/maintenance', { method: 'POST', body: JSON.stringify(features) });
    // return res.json();
    
    // Fallback/Demo connection directly using the mock or standard fetch structure, 
    // but since we're statically building frontend without running backend, we will 
    // attempt the fetch. If it fails (backend not running), we will return a simulated API response 
    // that mirrors the actual model logic so the UI works in static mode.
    
    try {
      const res = await fetch('http://localhost:8000/predictions/maintenance', {
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
    // We apply simple thresholds similar to what the RF model learned:
    // High torque + high tool wear = high risk.
    const torque = features.torque || 40;
    const tool_wear = features.tool_wear || 0;
    
    let failure_risk = 0.05; // base 5%
    if (torque > 60 && tool_wear > 200) {
      failure_risk = 0.85;
    } else if (tool_wear > 150) {
      failure_risk = 0.35;
    } else if (torque > 50) {
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
      model_version: "v1.0-RF-AI4I-Fallback"
    };
  }
};
