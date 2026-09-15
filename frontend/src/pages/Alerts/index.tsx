import { useEffect, useState } from 'react';
import { alertApi } from '../../services/alertApi';

export function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAlerts = () => {
    setLoading(true);
    alertApi.getAlerts()
      .then(setAlerts)
      .catch(() => setError('Unable to connect to alerts service.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleResolve = async (id: string) => {
    try {
      await alertApi.resolveAlert(id);
      fetchAlerts();
    } catch (e) {
      console.error('Failed to resolve alert');
    }
  };

  if (error) return <div className="p-4 md:p-8 text-red-500 font-medium">{error}</div>;

  return (
    <div className="p-4 md:p-8 bg-background min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">Maintenance Alerts</h1>
      
      {loading ? (
        <div className="text-muted-foreground animate-pulse">Loading alerts...</div>
      ) : alerts.length === 0 ? (
        <div className="text-muted-foreground">No active maintenance alerts.</div>
      ) : (
        <div className="space-y-4">
          {alerts.map(a => (
            <div key={a.alert_id} className={`p-4 md:p-6 bg-surface rounded-xl border flex flex-col sm:flex-row justify-between sm:items-center gap-4 ${
              a.resolved ? 'border-border opacity-50' : 
              a.type === 'critical' ? 'border-red-500/50' : 'border-yellow-500/50'
            }`}>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <span className={`px-2 py-1 rounded text-[10px] md:text-xs font-bold whitespace-nowrap ${
                    a.resolved ? 'bg-gray-500 text-white' :
                    a.type === 'critical' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'
                  }`}>
                    {a.resolved ? 'RESOLVED' : a.type.toUpperCase()}
                  </span>
                  <span className="font-bold text-foreground text-sm md:text-base">Vehicle: {a.vehicle_id}</span>
                  <span className="text-xs text-muted-foreground ml-auto sm:ml-0">{new Date(a.created_at).toLocaleString()}</span>
                </div>
                <p className={`text-sm md:text-base ${a.resolved ? 'text-muted-foreground' : 'text-foreground'}`}>{a.message}</p>
                {a.resolved_at && <p className="text-xs text-muted-foreground mt-2">Resolved at: {new Date(a.resolved_at).toLocaleString()}</p>}
              </div>
              {!a.resolved && (
                <button 
                  onClick={() => handleResolve(a.alert_id)}
                  className="w-full sm:w-auto px-4 py-2 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary/20 transition-colors whitespace-nowrap text-sm"
                >
                  Resolve Alert
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
