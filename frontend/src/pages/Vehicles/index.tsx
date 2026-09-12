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
              {loading && prediction === null ? "Prediction running..." : "Run AI Health Prediction"}
            </button>
          </div>

          {/* Prediction Output */}
          <div className="bg-surface p-4 md:p-6 rounded-xl border border-border flex flex-col h-full">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">AI VEHICLE HEALTH</h2>
            
            {!prediction ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg p-6 md:p-8 text-center text-sm md:text-base">
                Select a vehicle and run prediction to view AI output from the predictive-maintenance model.
              </div>
            ) : (
              <div className="space-y-4 md:space-y-6 flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-background border border-border rounded-lg shadow-sm">
                    <p className="text-sm text-muted-foreground mb-1">Health Score</p>
                    <p className="text-2xl md:text-3xl font-bold text-foreground">{prediction.health_score.toFixed(1)}%</p>
                  </div>
                  <div className="p-4 bg-background border border-border rounded-lg shadow-sm">
                    <p className="text-sm text-muted-foreground mb-1">Failure Risk</p>
                    <p className="text-2xl md:text-3xl font-bold text-foreground">{(prediction.failure_probability * 100).toFixed(1)}%</p>
                  </div>
                </div>
                
                <div className={`p-4 md:p-6 border rounded-lg shadow-sm ${
                  prediction.risk_level === 'CRITICAL' ? 'bg-red-500/10 border-red-500' :
                  prediction.risk_level === 'ATTENTION' || prediction.risk_level === 'HIGH RISK' ? 'bg-yellow-500/10 border-yellow-500' :
                  'bg-green-500/10 border-green-500'
                }`}>
                  <p className="text-xs md:text-sm font-bold opacity-80 mb-1">RISK LEVEL</p>
                  <p className={`text-xl md:text-2xl font-bold ${
                    prediction.risk_level === 'CRITICAL' ? 'text-red-500' :
                    prediction.risk_level === 'ATTENTION' || prediction.risk_level === 'HIGH RISK' ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>{prediction.risk_level}</p>
                </div>
                
                <div className="pt-4 border-t border-border mt-auto">
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
