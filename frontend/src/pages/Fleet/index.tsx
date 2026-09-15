import { useEffect, useState } from 'react';
import { fleetApi } from '../../services/fleetApi';

export function FleetPage() {
  const [fleet, setFleet] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fleetApi.getFleet()
      .then(setFleet)
      .catch(() => setError('Unable to connect to fleet service.'))
      .finally(() => setLoading(false));
  }, []);

  const healthy = fleet.filter(v => v.status === 'healthy').length;
  const attention = fleet.filter(v => v.status === 'attention').length;
  const critical = fleet.filter(v => v.status === 'critical').length;

  if (error) return <div className="p-4 md:p-8 text-red-500 font-medium">{error}</div>;

  return (
    <div className="p-4 md:p-8 bg-background min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">Fleet Overview</h1>
      
      {loading ? (
        <div className="text-muted-foreground animate-pulse">Loading fleet...</div>
      ) : fleet.length === 0 ? (
        <div className="text-muted-foreground">No vehicles found. Seed the database first.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="p-4 md:p-6 bg-surface rounded-xl border border-border">
              <p className="text-muted-foreground text-sm">Total Vehicles</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground">{fleet.length}</p>
            </div>
            <div className="p-4 md:p-6 bg-surface rounded-xl border border-green-500/30">
              <p className="text-green-500 text-sm font-bold">Healthy</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground">{healthy}</p>
            </div>
            <div className="p-4 md:p-6 bg-surface rounded-xl border border-yellow-500/30">
              <p className="text-yellow-500 text-sm font-bold">Attention</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground">{attention}</p>
            </div>
            <div className="p-4 md:p-6 bg-surface rounded-xl border border-red-500/30">
              <p className="text-red-500 text-sm font-bold">Critical</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground">{critical}</p>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-border p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 flex items-center justify-between">Vehicle List (MongoDB Data)<span className="text-xs font-normal px-2 py-1 bg-yellow-500/20 text-yellow-600 rounded">Benchmark / Demo Assets</span></h2>
            <div className="space-y-4">
              {fleet.map(v => (
                <div key={v.vehicle_id} className="flex flex-col md:flex-row justify-between md:items-center gap-4 p-4 border border-border rounded-lg bg-surface-elevated hover:border-primary/50 transition-colors cursor-pointer">
                  <div>
                    <p className="font-bold text-foreground">{v.vehicle_id} - {v.type || 'Electric Truck'}</p>
                    <p className="text-sm text-muted-foreground">Odometer: {v.mileage || 0} miles</p>
                  </div>
                  <div className="flex flex-row md:flex-col justify-between items-center md:items-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      v.status === 'healthy' ? 'bg-green-500/10 text-green-500' :
                      v.status === 'attention' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {v.status.toUpperCase()}
                    </span>
                    <p className="text-xs font-bold text-foreground mt-0 md:mt-2">Health: {v.health_score}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

