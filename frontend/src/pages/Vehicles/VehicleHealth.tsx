import { useState } from 'react';
import { maintenanceApi } from '../../services/maintenanceApi';

export function VehicleHealth() {
  const [features, setFeatures] = useState({
    vehicle_id: "TRK-02",
    air_temperature: 298.1,
    process_temperature: 308.6,
    rotational_speed: 1551.0,
    torque: 42.8,
    tool_wear: 0.0
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Input Panel */}
        <div className="bg-surface p-6 rounded-xl border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">Input Telemetry (Demo)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Vehicle ID</label>
              <input type="text" name="vehicle_id" value={features.vehicle_id} onChange={handleChange} className="w-full bg-background border border-border rounded p-2 text-foreground" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Air Temperature (K)</label>
              <input type="number" name="air_temperature" value={features.air_temperature} onChange={handleChange} className="w-full bg-background border border-border rounded p-2 text-foreground" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Process Temperature (K)</label>
              <input type="number" name="process_temperature" value={features.process_temperature} onChange={handleChange} className="w-full bg-background border border-border rounded p-2 text-foreground" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Rotational Speed (rpm)</label>
              <input type="number" name="rotational_speed" value={features.rotational_speed} onChange={handleChange} className="w-full bg-background border border-border rounded p-2 text-foreground" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Torque (Nm)</label>
              <input type="number" name="torque" value={features.torque} onChange={handleChange} className="w-full bg-background border border-border rounded p-2 text-foreground" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Tool Wear (min)</label>
              <input type="number" name="tool_wear" value={features.tool_wear} onChange={handleChange} className="w-full bg-background border border-border rounded p-2 text-foreground" />
            </div>
            
            <button 
              onClick={handlePredict} 
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              {loading ? "Running Model..." : "RUN PREDICTION"}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="bg-surface p-6 rounded-xl border border-border flex flex-col">
          <h2 className="text-xl font-bold text-foreground mb-4">AI PREDICTION</h2>
          
          {!prediction ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
              Run prediction to view AI output
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
                prediction.risk_level === 'ATTENTION' ? 'bg-yellow-500/10 border-yellow-500' :
                'bg-green-500/10 border-green-500'
              }`}>
                <p className="text-sm font-bold opacity-80 mb-1">RISK LEVEL</p>
                <p className={`text-2xl font-bold ${
                  prediction.risk_level === 'CRITICAL' ? 'text-red-500' :
                  prediction.risk_level === 'ATTENTION' ? 'text-yellow-500' :
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
