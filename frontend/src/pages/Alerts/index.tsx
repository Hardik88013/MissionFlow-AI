import { useEffect, useState } from 'react';
import { alertApi } from '../../services/alertApi';

export function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    alertApi.getAlerts().then(setAlerts);
  }, []);

  return (
    <div className="p-8 bg-background min-h-screen">
      <h1 className="text-3xl font-bold text-foreground mb-8">Maintenance Alerts</h1>
      
      <div className="space-y-4">
        {alerts.map(a => (
          <div key={a.alert_id} className="p-6 bg-surface rounded-xl border border-border flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  a.type === 'critical' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'
                }`}>
                  {a.type.toUpperCase()}
                </span>
                <span className="font-bold text-foreground">Vehicle: {a.vehicle_id}</span>
              </div>
              <p className="text-muted-foreground">{a.message}</p>
            </div>
            <button className="px-4 py-2 bg-primary/10 text-primary font-bold rounded hover:bg-primary/20 transition-colors">
              Resolve
            </button>
          </div>
        ))}
        {alerts.length === 0 && <p className="text-muted-foreground">No active alerts.</p>}
      </div>
    </div>
  );
}
