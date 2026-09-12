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
      // Create features from vehicle data (using fallbacks for missing raw telemetry in standard fleet obj)
      const features = {
        vehicle_id: vehicle.vehicle_id,
        SoC: vehicle.soc || 0.85,
        Battery_Voltage: vehicle.battery_voltage || 395.2,
        Battery_Temperature: vehicle.battery_temp || 28.5,
        Motor_Temperature: vehicle.motor_temp || 55.0,
        Motor_Vibration: vehicle.motor_vibration || 0.2,
        Motor_RPM: vehicle.motor_rpm || 1800.0,
        Tire_Pressure: vehicle.tire_pressure || 33.5,
        Driving_Speed: vehicle.driving_speed || 55.0
      };
      const res = await maintenanceApi.predictMaintenance(features);
      setPrediction(res);
    } catch (e) {
      setError('Prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (vehicles.length === 0 && !loading) return <div className="p-8 text-muted-foreground">No vehicles found. Seed the database first.</div>;

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Vehicle Details & Predictive Maintenance</h1>
        <select 
          className="bg-surface border border-border text-foreground p-2 rounded"
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
        >
          {vehicles.map(v => (
            <option key={v.vehicle_id} value={v.vehicle_id}>{v.vehicle_id}</option>
          ))}
        </select>
      </div>
      
      {loading && !vehicle ? (
        <div className="text-muted-foreground">Loading vehicle...</div>
      ) : vehicle ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vehicle Info */}
          <div className="bg-surface p-6 rounded-xl border border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Vehicle Information</h2>
            <div className="space-y-4 mb-6 text-foreground">
              <p><span className="text-muted-foreground">ID:</span> {vehicle.vehicle_id}</p>
              <p><span className="text-muted-foreground">Type:</span> {vehicle.type || 'Electric Truck'}</p>
              <p><span className="text-muted-foreground">Odometer:</span> {vehicle.mileage || 0} miles</p>
              <p><span className="text-muted-foreground">Current Status:</span> {vehicle.status}</p>
            </div>
            
            <button 
              onClick={handlePredict} 
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              {loading && prediction === null ? "Prediction running..." : "Run AI Health Prediction"}
            </button>
          </div>

          {/* Prediction Output */}
          <div className="bg-surface p-6 rounded-xl border border-border flex flex-col">
            <h2 className="text-xl font-bold text-foreground mb-4">AI VEHICLE HEALTH</h2>
            
            {!prediction ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg p-8 text-center">
                Run prediction to view AI output from the predictive-maintenance model.
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-background border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground">Health Score</p>
                    <p className="text-3xl font-bold text-foreground">{prediction.health_score.toFixed(1)}%</p>
                  </div>
                  <div className="p-4 bg-background border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground">Failure Probability</p>
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
                </div>
                
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground font-bold">Generated by trained predictive-maintenance model</p>
                  <p className="text-xs text-muted-foreground mt-1">Model Version: {prediction.model_version}</p>
                  <p className="text-xs text-muted-foreground mt-1">Timestamp: {new Date().toISOString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
