import { useState } from 'react';
import { maintenanceApi } from '../../services/maintenanceApi';

export function VehicleHealth() {
  const [features, setFeatures] = useState({
    vehicle_id: "TRK-02",
    SoC: 0.85,
    Battery_Voltage: 395.2,
    Battery_Temperature: 28.5,
    Motor_Temperature: 55.0,
    Motor_Vibration: 0.2,
    Motor_RPM: 1800.0,
    Tire_Pressure: 33.5,
    Driving_Speed: 55.0
  });

  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await maintenanceApi.predictMaintenance(features);
      setPrediction(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFeatures(prev => ({ ...prev, [name]: name === 'vehicle_id' ? value : parseFloat(value) }));
  };

  return (
    <div className="p-8 bg-background min-h-screen">
      <h1 className="text-3xl font-bold text-foreground mb-8">Vehicle Health & Predictive Maintenance</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Panel */}
        <div className="bg-surface p-6 rounded-xl border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">EV Telemetry (Live Demo)</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="col-span-2">
              <label className="block text-sm text-muted-foreground mb-1">Vehicle ID</label>
              <input type="text" name="vehicle_id" value={features.vehicle_id} onChange={handleChange} className="w-full bg-background border border-border rounded p-2 text-foreground" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">State of Charge (%)</label>
              <input type="number" step="0.01" name="SoC" value={features.SoC} onChange={handleChange} className="w-full bg-background border border-border rounded p-2 text-foreground" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Battery Voltage (V)</label>
              <input type="number" step="0.1" name="Battery_Voltage" value={features.Battery_Voltage} onChange={handleChange} className="w-full bg-background border border-border rounded p-2 text-foreground" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Battery Temp (°C)</label>
              <input type="number" step="0.1" name="Battery_Temperature" value={features.Battery_Temperature} onChange={handleChange} className="w-full bg-background border border-border rounded p-2 text-foreground" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Motor Temp (°C)</label>
              <input type="number" step="0.1" name="Motor_Temperature" value={features.Motor_Temperature} onChange={handleChange} className="w-full bg-background border border-border rounded p-2 text-foreground" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Motor Vibration (g)</label>
              <input type="number" step="0.01" name="Motor_Vibration" value={features.Motor_Vibration} onChange={handleChange} className="w-full bg-background border border-border rounded p-2 text-foreground" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Motor RPM</label>
              <input type="number" step="1" name="Motor_RPM" value={features.Motor_RPM} onChange={handleChange} className="w-full bg-background border border-border rounded p-2 text-foreground" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Tire Pressure (PSI)</label>
              <input type="number" step="0.1" name="Tire_Pressure" value={features.Tire_Pressure} onChange={handleChange} className="w-full bg-background border border-border rounded p-2 text-foreground" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Driving Speed (km/h)</label>
              <input type="number" step="0.1" name="Driving_Speed" value={features.Driving_Speed} onChange={handleChange} className="w-full bg-background border border-border rounded p-2 text-foreground" />
            </div>
          </div>
          
          <button 
            onClick={handlePredict} 
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            {loading ? "Running EVIoT Model..." : "RUN PREDICTION"}
          </button>
        </div>

        {/* Output Panel */}
        <div className="bg-surface p-6 rounded-xl border border-border flex flex-col">
          <h2 className="text-xl font-bold text-foreground mb-4">AI PREDICTION</h2>
          
          {!prediction ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg p-8 text-center">
              Submit EV telemetry to view real-time maintenance prediction from the Random Forest model.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-background border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground">Health Score</p>
                  <p className="text-3xl font-bold text-foreground">{prediction.health_score.toFixed(1)}%</p>
                </div>
                <div className="p-4 bg-background border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground">Failure Risk</p>
                  <p className="text-3xl font-bold text-foreground">{(prediction.failure_probability * 100).toFixed(1)}%</p>
                </div>
              </div>
              
              <div className={`p-6 border rounded-lg ${
                prediction.risk_level === 'CRITICAL' ? 'bg-red-500/10 border-red-500' :
                prediction.risk_level === 'ATTENTION' || prediction.risk_level === 'HIGH RISK' ? 'bg-yellow-500/10 border-yellow-500' :
                'bg-green-500/10 border-green-500'
              }`}>
                <p className="text-sm font-bold opacity-80 mb-1">RISK LEVEL</p>
                <p className={`text-2xl font-bold ${
                  prediction.risk_level === 'CRITICAL' ? 'text-red-500' :
                  prediction.risk_level === 'ATTENTION' || prediction.risk_level === 'HIGH RISK' ? 'text-yellow-500' :
                  'text-green-500'
                }`}>{prediction.risk_level}</p>
                
                {prediction.risk_level === 'CRITICAL' && (
                  <div className="mt-4 p-3 bg-red-500 text-white font-bold rounded">
                    PREDICTIVE MAINTENANCE ALERT: Immediate service required.
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">Model: {prediction.model_version}</p>
                <p className="text-xs text-muted-foreground mt-1">Vehicle: {prediction.vehicle_id}</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
