import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Database, CheckCircle2 } from 'lucide-react';
import { alertApi } from '../../services/alertApi';

export function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const fetchAlerts = () => {
    setLoading(true);
    alertApi.getAlerts()
      .then(setAlerts)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleResolve = async (id: string) => {
    try {
      await alertApi.resolveAlert(id);
      setAlerts(alerts.filter(a => a.alert_id !== id));
    } catch {
      alert('Failed to resolve alert.');
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await alertApi.seedAlerts();
      fetchAlerts();
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen text-slate-900">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Mission Control
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Maintenance Alerts</h1>
            <p className="text-xs text-slate-500 mt-1">Real-time alerts triggered by predictive telemetry</p>
          </div>

          <button
            onClick={handleSeed}
            disabled={seeding}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition disabled:opacity-60 shadow-sm"
          >
            <Database className="w-3.5 h-3.5" />
            {seeding ? 'Seeding...' : 'Seed Demo Alerts'}
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium animate-pulse">
            Loading alerts...
          </div>
        ) : alerts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">All Systems Nominal</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
              No active warnings or critical maintenance alerts found.
            </p>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
            >
              Seed Demo Alerts
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((a) => (
              <div
                key={a.alert_id}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        a.type === 'critical'
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {a.type}
                    </span>
                    <span className="font-bold text-sm text-slate-900">Vehicle: {a.vehicle_id}</span>
                    <span className="text-[10px] text-slate-400">ID: {a.alert_id}</span>
                  </div>
                  <p className="text-xs text-slate-600">{a.message}</p>
                </div>

                <button
                  onClick={() => handleResolve(a.alert_id)}
                  className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl hover:bg-emerald-100 transition whitespace-nowrap self-start sm:self-center"
                >
                  Resolve Alert
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
