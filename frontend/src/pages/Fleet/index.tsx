import { useEffect, useState } from 'react';
import { fleetApi } from '../../services/fleetApi';

export function FleetPage() {
  const [fleet, setFleet] = useState<any[]>([]);

  useEffect(() => {
    fleetApi.getFleet().then(setFleet);
  }, []);

  const healthy = fleet.filter(v => v.status === 'healthy').length;
  const attention = fleet.filter(v => v.status === 'attention').length;
  const critical = fleet.filter(v => v.status === 'critical').length;

  return (
    <div className="p-8 bg-background min-h-screen">
      <h1 className="text-3xl font-bold text-foreground mb-8">Fleet Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-surface rounded-xl border border-border">
          <p className="text-muted-foreground text-sm">Total Vehicles</p>
          <p className="text-3xl font-bold text-foreground">{fleet.length}</p>
        </div>
        <div className="p-6 bg-surface rounded-xl border border-green-500/30">
          <p className="text-green-500 text-sm font-bold">Healthy</p>
          <p className="text-3xl font-bold text-foreground">{healthy}</p>
        </div>
        <div className="p-6 bg-surface rounded-xl border border-yellow-500/30">
          <p className="text-yellow-500 text-sm font-bold">Attention</p>
          <p className="text-3xl font-bold text-foreground">{attention}</p>
        </div>
        <div className="p-6 bg-surface rounded-xl border border-red-500/30">
          <p className="text-red-500 text-sm font-bold">Critical</p>
          <p className="text-3xl font-bold text-foreground">{critical}</p>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Vehicle List</h2>
        <div className="space-y-4">
          {fleet.map(v => (
            <div key={v.vehicle_id} className="flex justify-between items-center p-4 border border-border rounded-lg bg-surface-elevated">
              <div>
                <p className="font-bold text-foreground">{v.vehicle_id} - {v.type}</p>
                <p className="text-sm text-muted-foreground">Mileage: {v.mileage} miles</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  v.status === 'healthy' ? 'bg-green-500/10 text-green-500' :
                  v.status === 'attention' ? 'bg-yellow-500/10 text-yellow-500' :
                  'bg-red-500/10 text-red-500'
                }`}>
                  {v.status.toUpperCase()}
                </span>
                <p className="text-xs font-bold text-foreground mt-2">Health: {v.health_score}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
