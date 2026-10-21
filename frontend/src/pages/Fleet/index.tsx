import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fleetApi } from '../../services/fleetApi';
import { ArrowLeft, RefreshCw, Database } from 'lucide-react';

export function FleetPage() {
  const [fleet, setFleet] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchFleet = () => {
    setLoading(true);
    setError('');
    fleetApi.getFleet()
      .then(setFleet)
      .catch(() => setError('Unable to connect to fleet service.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFleet();
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await fleetApi.seedFleet();
      await fetchFleet();
    } catch {
      setError('Failed to seed demo fleet data.');
    } finally {
      setSeeding(false);
    }
  };

  const healthy = fleet.filter(v => v.status === 'healthy').length;
  const attention = fleet.filter(v => v.status === 'attention').length;
  const critical = fleet.filter(v => v.status === 'critical').length;

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen text-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Navigation & Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Mission Control
            </Link>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Fleet Overview</h1>
            <p className="text-xs text-slate-500 mt-1">Real-time status and telemetry from MongoDB Atlas</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition disabled:opacity-60 shadow-sm"
            >
              <Database className="w-3.5 h-3.5" />
              {seeding ? 'Seeding...' : 'Seed Demo Fleet'}
            </button>
            <button
              onClick={fetchFleet}
              disabled={loading}
              className="p-2 border border-slate-200 bg-white rounded-lg text-slate-600 hover:bg-slate-100 transition shadow-sm"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium animate-pulse">
            Loading fleet data from MongoDB...
          </div>
        ) : fleet.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <Database className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">No Fleet Records Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
              Your MongoDB database has no vehicles yet. Click below to instantly inject verified demo fleet assets.
            </p>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition shadow-md"
            >
              {seeding ? 'Seeding Database...' : 'Seed Demo Fleet Data'}
            </button>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Vehicles</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">{fleet.length}</p>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-emerald-200 shadow-sm">
                <p className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Healthy</p>
                <p className="text-3xl font-extrabold text-emerald-700 mt-1">{healthy}</p>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-amber-200 shadow-sm">
                <p className="text-amber-600 text-xs font-bold uppercase tracking-wider">Attention Required</p>
                <p className="text-3xl font-extrabold text-amber-700 mt-1">{attention}</p>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-red-200 shadow-sm">
                <p className="text-red-500 text-xs font-bold uppercase tracking-wider">Critical Status</p>
                <p className="text-3xl font-extrabold text-red-600 mt-1">{critical}</p>
              </div>
            </div>

            {/* Vehicle List */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-extrabold text-slate-900">
                  Vehicle Assets & Telemetry
                </h2>
                <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                  MongoDB Atlas Live
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {fleet.map((v) => (
                  <div
                    key={v.vehicle_id}
                    onClick={() => navigate('/dashboard/vehicles')}
                    className="flex flex-col md:flex-row justify-between md:items-center gap-3 py-4 hover:bg-slate-50 px-3 rounded-xl transition cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">{v.vehicle_id}</span>
                        <span className="text-xs text-slate-500 font-medium">({v.type || 'Electric Vehicle'})</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Odometer: {v.mileage?.toLocaleString() || 0} km • Model: {v.model || 'Heavy Hauler'}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-700">Health: {v.health_score ?? 100}%</span>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              (v.health_score ?? 100) > 75
                                ? 'bg-emerald-500'
                                : (v.health_score ?? 100) > 50
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${v.health_score ?? 100}%` }}
                          />
                        </div>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          v.status === 'healthy'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : v.status === 'attention'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-600 border border-red-200'
                        }`}
                      >
                        {v.status || 'ACTIVE'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
