import { useEffect, useState } from 'react';
import { fleetApi } from '../../services/fleetApi';
import { maintenanceApi } from '../../services/maintenanceApi';

export function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [vehicle, setVehicle] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fleetApi.getFleet()
      .then(data => {
        setVehicles(data);
        if (data.length > 0) setSelectedId(data[0].vehicle_id);
      })
      .catch(() => setError('Unable to connect to fleet service.'));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    setPrediction(null);
    fleetApi.getVehicle(selectedId)
      .then(data => setVehicle(data))
      .catch(() => setError('Failed to load vehicle details.'))
      .finally(() => setLoading(false));
  }, [selectedId]);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const features = {
        vehicle_id: vehicle.vehicle_id,
        mode: "cmapss_benchmark",
        s2: 641.82 + Math.random() * 2,
        s3: 1580.0 + Math.random() * 10,
        s4: 1400.0 + Math.random() * 20,
        s7: 553.0 + Math.random() * 5,
        s8: 2388.0 + Math.random() * 2,
        s9: 9050.0 + Math.random() * 50,
        s11: 47.0 + Math.random() * 1,
        s12: 521.0 + Math.random() * 3,
        s13: 2388.0 + Math.random() * 1,
        s14: 8130.0 + Math.random() * 20,
        s15: 8.4 + Math.random() * 0.1,
        s17: 390.0 + Math.random() * 5,
        s20: 38.8 + Math.random() * 1,
        s21: 23.3 + Math.random() * 0.5
      };
      const res = await maintenanceApi.predictMaintenance(features);
      setPrediction(res);
    } catch (e) {
      setError('Prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="p-4 md:p-8 text-red-500 font-medium">{error}</div>;
  if (vehicles.length === 0 && !loading) return <div className="p-4 md:p-8 text-muted-foreground">No vehicles found. Seed the database first.</div>;

  return (
    <div className="p-4 md:p-8 bg-background min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Vehicle Details & AI Health</h1>
        <select 
          className="bg-surface border border-border text-foreground p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-auto"
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
        >
          {vehicles.map(v => (
            <option key={v.vehicle_id} value={v.vehicle_id}>{v.vehicle_id}</option>
          ))}
        </select>
      </div>
      
      {loading && !vehicle ? (
        <div className="text-muted-foreground animate-pulse">Loading vehicle...</div>
      ) : vehicle ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Vehicle Info */}
          <div className="bg-surface p-4 md:p-6 rounded-xl border border-border">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">Vehicle Information</h2>
            <div className="space-y-4 mb-6 text-foreground">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">ID</span>
                <span className="font-medium">{vehicle.vehicle_id}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">{vehicle.type || 'Electric Truck'}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Odometer</span>
                <span className="font-medium">{vehicle.mileage || 0} miles</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Current Status</span>
                <span className="font-medium capitalize">{vehicle.status}</span>
              </div>
            </div>
            
            <button 
              onClick={handlePredict} 
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
            >
              {loading && prediction === null ? "Running AI Temporal Benchmark..." : "Run AI Health Prediction"}
            </button>
          </div>

          {/* Prediction Output */}
          <div className="bg-surface p-4 md:p-6 rounded-xl border border-border flex flex-col h-full">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-2 flex items-center justify-between">
              AI VEHICLE HEALTH
              {prediction && (
                <span className="text-xs font-normal px-2 py-1 bg-yellow-500/20 text-yellow-600 rounded">
                  Predictive Maintenance Benchmark
                </span>
              )}
            </h2>
            
            {!prediction ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg p-6 md:p-8 text-center text-sm md:text-base">
                Select a vehicle and run prediction to evaluate temporal AI degradation based on C-MAPSS benchmark patterns.
              </div>
            ) : (
              <div className="space-y-4 flex-1 flex flex-col justify-between mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-background border border-border rounded-lg shadow-sm">
                    <p className="text-xs text-muted-foreground mb-1 font-semibold tracking-wider">PREDICTED RUL</p>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{prediction.predicted_rul.toFixed(1)} <span className="text-sm font-normal">cycles</span></p>
                  </div>
                  <div className="p-3 bg-background border border-border rounded-lg shadow-sm">
                    <p className="text-xs text-muted-foreground mb-1 font-semibold tracking-wider">HEALTH SCORE</p>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{prediction.health_score.toFixed(1)}%</p>
                  </div>
                  <div className="p-3 bg-background border border-border rounded-lg shadow-sm">
                    <p className="text-xs text-muted-foreground mb-1 font-semibold tracking-wider">FAIL RISK</p>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{(prediction.failure_probability * 100).toFixed(1)}%</p>
                  </div>
                </div>
                
                <div className={`p-4 border rounded-lg shadow-sm ${
                  prediction.risk_level === 'CRITICAL' ? 'bg-red-500/10 border-red-500' :
                  prediction.risk_level === 'ATTENTION' || prediction.risk_level === 'MEDIUM RISK' || prediction.risk_level === 'HIGH RISK' ? 'bg-yellow-500/10 border-yellow-500' :
                  'bg-green-500/10 border-green-500'
                }`}>
                  <p className="text-xs font-bold opacity-80 mb-1">RISK LEVEL</p>
                  <p className={`text-xl font-bold ${
                    prediction.risk_level === 'CRITICAL' ? 'text-red-500' :
                    prediction.risk_level === 'ATTENTION' || prediction.risk_level === 'MEDIUM RISK' || prediction.risk_level === 'HIGH RISK' ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>{prediction.risk_level}</p>
                </div>
                
                {prediction.top_features && prediction.top_features.length > 0 && (
                  <div className="p-4 bg-background border border-border rounded-lg shadow-sm">
                     <p className="text-xs font-bold text-foreground mb-2">Why? (Top contributing sensor signals)</p>
                     <ul className="text-xs text-muted-foreground list-disc list-inside">
                        {prediction.top_features.map((f: string) => (
                           <li key={f}>{f.replace('_rmean5', ' (Rolling Mean)')}</li>
                        ))}
                     </ul>
                  </div>
                )}
                
                <div className="pt-3 border-t border-border mt-auto">
                  <p className="text-xs text-muted-foreground"><strong>Domain Note:</strong> {prediction.domain_note}</p>
                  <p className="text-xs text-muted-foreground mt-1">Model Version: {prediction.model_version}</p>
                  <p className="text-xs text-muted-foreground mt-1">Timestamp: {new Date(prediction.prediction_timestamp || Date.now()).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
