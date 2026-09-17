import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  Activity,
  ArrowRight,
  Bell,
  Boxes,
  ChartNoAxesCombined,
  ChevronRight,
  Clock3,
  Cloud,
  Database,
  Gauge,
  Globe2,
  MapPin,
  Navigation,
  Package,
  Route as RouteIcon,
  Settings,
  ShieldCheck,
  Truck,
  Users,
  Wrench,
  Zap,
  LogOut
} from "lucide-react";

type VehicleStatus =
  | "en_route"
  | "idle"
  | "delayed"
  | "delivered"
  | "at_base";

type Vehicle = {
  vehicle_id: number;
  latitude: number;
  longitude: number;
  route_id: number;
  current_stop: number;
  status: VehicleStatus;
  eta_minutes: number;
  timestamp: string;
};

type WebSocketMessage = {
  type: string;
  vehicle?: Vehicle;
};

const WS_URL = `${import.meta.env.VITE_WS_URL || "ws://127.0.0.1:8000"}/ws/fleet`;

const initialVehicles: Vehicle[] = [
  {
    vehicle_id: 101,
    latitude: 10.851,
    longitude: 76.272,
    route_id: 5,
    current_stop: 3,
    status: "en_route",
    eta_minutes: 16,
    timestamp: new Date().toISOString(),
  },
  {
    vehicle_id: 102,
    latitude: 21.1458,
    longitude: 79.0882,
    route_id: 7,
    current_stop: 2,
    status: "en_route",
    eta_minutes: 31,
    timestamp: new Date().toISOString(),
  },
  {
    vehicle_id: 103,
    latitude: 28.6139,
    longitude: 77.209,
    route_id: 8,
    current_stop: 4,
    status: "delayed",
    eta_minutes: 45,
    timestamp: new Date().toISOString(),
  },
  {
    vehicle_id: 104,
    latitude: 13.0827,
    longitude: 80.2707,
    route_id: 11,
    current_stop: 1,
    status: "at_base",
    eta_minutes: 0,
    timestamp: new Date().toISOString(),
  },
];

const routePoints = [
  { x: 20, y: 72, label: "Mumbai" },
  { x: 38, y: 58, label: "Nagpur" },
  { x: 49, y: 72, label: "Hyderabad" },
  { x: 61, y: 50, label: "Visakhapatnam" },
  { x: 70, y: 34, label: "Delhi" },
  { x: 52, y: 22, label: "Srinagar" },
  { x: 76, y: 72, label: "Chennai" },
];

export function Dashboard() {
  const { user, logout } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(
    initialVehicles[0],
  );

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimer: number | undefined;

    const connect = () => {
      try {
        socket = new WebSocket(WS_URL);

        socket.onopen = () => {
          setSocketConnected(true);
        };

        socket.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);

            if (message.type !== "vehicle_update" || !message.vehicle) {
              return;
            }

            const incomingVehicle = message.vehicle;

            setVehicles((current) => {
              const exists = current.some(
                (vehicle) => vehicle.vehicle_id === incomingVehicle.vehicle_id,
              );

              if (!exists) {
                return [...current, incomingVehicle];
              }

              return current.map((vehicle) =>
                vehicle.vehicle_id === incomingVehicle.vehicle_id
                  ? incomingVehicle
                  : vehicle,
              );
            });

            setSelectedVehicle((current) =>
              current?.vehicle_id === incomingVehicle.vehicle_id
                ? incomingVehicle
                : current,
            );
          } catch {
            // Ignore malformed WebSocket messages.
          }
        };

        socket.onclose = () => {
          setSocketConnected(false);

          reconnectTimer = window.setTimeout(() => {
            connect();
          }, 3000);
        };

        socket.onerror = () => {
          setSocketConnected(false);
        };
      } catch {
        setSocketConnected(false);
      }
    };

    connect();

    return () => {
      if (reconnectTimer) {
        window.clearTimeout(reconnectTimer);
      }

      socket?.close();
    };
  }, []);

  const activeVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "en_route",
  ).length;


  const fleetStatus = socketConnected ? "LIVE" : "CONNECTING";

  const selectedVehiclePosition = useMemo(() => {
    if (!selectedVehicle) {
      return routePoints[1];
    }

    const index = selectedVehicle.vehicle_id % routePoints.length;
    return routePoints[index];
  }, [selectedVehicle]);

  return (
    <div className="min-h-screen bg-[#f4f8fb] text-slate-900">
      {/* ========================================================= */}
      {/* TOP NAVIGATION */}
      {/* ========================================================= */}

      <header className="sticky top-0 z-50 h-[72px] border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="flex h-full items-center">
          <div className="flex w-[225px] shrink-0 items-center border-r border-slate-200 px-7">
            <a href="/dashboard" className="flex items-center">
              <img
                src="/logo.png"
                alt="MissionFlow AI"
                className="h-11 w-auto object-contain"
              />
            </a>
          </div>

          <div className="flex flex-1 items-center justify-between px-7">
            <div className="relative w-full max-w-[610px]">
              <Globe2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search vehicles, routes, locations, or anything..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-20 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-400">
                Ctrl K
              </span>
            </div>

            <div className="ml-6 flex items-center gap-5">
              <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <Bell className="h-5 w-5" />

                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  2
                </span>
              </button>

              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="hidden items-center gap-3 md:flex hover:bg-slate-50 p-2 rounded-lg transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white uppercase">
                    {user?.full_name ? user.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : 'OP'}
                  </div>

                  <div className="text-left">
                    <p className="text-xs font-bold">{user?.full_name || 'Operator'}</p>
                    <p className="text-[10px] text-slate-500">Fleet Manager</p>
                  </div>

                  <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${isProfileOpen ? '-rotate-90' : 'rotate-90'}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-100 bg-white py-2 shadow-lg z-50">
                    <div className="px-4 py-2 border-b border-slate-50 mb-2">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-semibold truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* ========================================================= */}
        {/* SIDEBAR */}
        {/* ========================================================= */}

        <aside className="hidden min-h-[calc(100vh-72px)] w-[225px] shrink-0 border-r border-slate-200 bg-white lg:block">
          <nav className="px-4 py-6">
            <SidebarItem icon={ChartNoAxesCombined} label="Dashboard" active />

            <SidebarItem icon={Truck} label="Fleet Management" />
            <SidebarItem icon={MapPin} label="Live Tracking" />
            <SidebarItem
              icon={RouteIcon}
              label="Route Optimization"
              href="/dashboard/routes"
            />
            <SidebarItem icon={Clock3} label="ETA Prediction" />
            <SidebarItem icon={Wrench} label="Predictive Maintenance" />
            <SidebarItem icon={Boxes} label="Inventory Management" />
            <SidebarItem icon={ChartNoAxesCombined} label="Demand Forecasting" />

            <SidebarItem
              icon={Bell}
              label="Alerts & Notifications"
              badge="2"
            />

            <SidebarItem icon={ChartNoAxesCombined} label="Analytics & Reporting" />
            <SidebarItem icon={Users} label="User Management" />
            <SidebarItem icon={Cloud} label="Media & Data Storage" />

            <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Tools
            </p>

            <SidebarItem icon={Zap} label="API & Integrations" />
            <SidebarItem icon={Settings} label="Settings" />
          </nav>

          <div className="mx-5 mt-8 rounded-2xl bg-gradient-to-b from-slate-100 to-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Mission Ready
              </span>
            </div>

            <p className="text-xs font-semibold leading-5 text-slate-600">
              A stronger India through smarter logistics.
            </p>

            <div className="mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />
          </div>
        </aside>

        {/* ========================================================= */}
        {/* MAIN */}
        {/* ========================================================= */}

        <main className="min-w-0 flex-1 px-5 py-6 xl:px-8">
          {/* Header */}
          <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Welcome back, Devraj
              </p>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 xl:text-4xl">
                Smarter Operations. A Stronger{" "}
                <span className="bg-gradient-to-r from-orange-500 via-slate-700 to-emerald-600 bg-clip-text text-transparent">
                  India.
                </span>
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Real-time visibility. Predictive insights. More efficient
                deliveries.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>Fri, 13 Sep 2026</span>

              <span className="flex items-center gap-2">
                Bengaluru, IN
                <Cloud className="h-4 w-4 text-orange-400" />
                28°C
              </span>

              <span
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 font-semibold ${
                  socketConnected
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    socketConnected ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                {fleetStatus}
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* KPI CARDS */}
          {/* ========================================================= */}

          <section className="grid grid-cols-2 gap-3 xl:grid-cols-6">
            <KpiCard
              icon={Truck}
              label="Total Vehicles"
              value="412"
              trend="↑ 12%"
              trendPositive
            />

            <KpiCard
              icon={Users}
              label="Active Convoys"
              value="28"
              trend="↑ 8%"
              trendPositive
            />

            <KpiCard
              icon={Navigation}
              label="In Transit"
              value={String(activeVehicles + 5)}
              trend="→ 0%"
            />

            <KpiCard
              icon={Clock3}
              label="On-Time Deliveries"
              value="99.2%"
              trend="↑ 2.1%"
              trendPositive
            />

            <KpiCard
              icon={Gauge}
              label="Operational Costs"
              value="40%"
              trend="↓ 40%"
              trendPositive
            />

            <KpiCard
              icon={ShieldCheck}
              label="Mission Focused"
              value="100%"
              trend="↑ —"
              trendPositive
            />
          </section>

          {/* ========================================================= */}
          {/* MAP + VEHICLES + INSIGHTS */}
          {/* ========================================================= */}

          <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,.75fr)_minmax(270px,.65fr)]">
            {/* LIVE MAP */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <h2 className="text-base font-extrabold">
                    Live Mission Network
                  </h2>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Fleet locations and active routes
                  </p>
                </div>

                <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
                  <span className="rounded-md bg-white px-3 py-1.5 text-[10px] font-bold text-blue-700 shadow-sm">
                    Live Map
                  </span>
                  <span className="px-3 py-1.5 text-[10px] text-slate-500">
                    Convoys
                  </span>
                  <span className="px-3 py-1.5 text-[10px] text-slate-500">
                    Vehicles
                  </span>
                </div>
              </div>

              <div className="relative h-[390px] overflow-hidden bg-[#102f3d]">
                {/* Stylized India map background */}
                <div className="absolute inset-0 opacity-40">
                  <svg
                    viewBox="0 0 100 100"
                    className="h-full w-full"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <pattern
                        id="mapGrid"
                        width="5"
                        height="5"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 5 0 L 0 0 0 5"
                          fill="none"
                          stroke="#8bb5a6"
                          strokeWidth=".15"
                        />
                      </pattern>
                    </defs>

                    <rect width="100" height="100" fill="url(#mapGrid)" />

                    <path
                      d="M19 17 L31 10 L47 13 L56 8 L70 14 L78 25 L83 42 L77 52 L82 65 L72 73 L67 88 L55 77 L45 72 L38 82 L27 71 L20 58 L12 46 L16 31Z"
                      fill="#284d48"
                      stroke="#aec7a7"
                      strokeWidth=".35"
                    />

                    <path
                      d="M20 40 C32 35 44 37 56 31 C67 25 73 31 81 28"
                      fill="none"
                      stroke="#5e8875"
                      strokeWidth=".25"
                    />

                    <path
                      d="M18 60 C31 53 42 58 53 51 C66 42 73 49 84 43"
                      fill="none"
                      stroke="#5e8875"
                      strokeWidth=".25"
                    />

                    <path
                      d="M28 19 C31 35 29 50 35 66 C38 74 45 79 48 91"
                      fill="none"
                      stroke="#5e8875"
                      strokeWidth=".25"
                    />
                  </svg>
                </div>

                {/* Routes */}
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 h-full w-full"
                >
                  <path
                    d="M20 72 Q29 63 38 58 T49 72 T61 50 T70 34 T52 22"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="1.1"
                    strokeDasharray="2 1"
                  />

                  <path
                    d="M20 72 Q39 80 49 72 T76 72"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth=".8"
                    strokeDasharray="2 1"
                  />

                  {routePoints.map((point) => (
                    <g key={point.label}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="1.7"
                        fill="#e5f6ed"
                        stroke="#22c55e"
                        strokeWidth=".7"
                      />
                    </g>
                  ))}
                </svg>

                {/* City labels */}
                {routePoints.map((point) => (
                  <div
                    key={point.label}
                    className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-white drop-shadow-lg"
                    style={{
                      left: `${point.x}%`,
                      top: `${point.y + 4}%`,
                    }}
                  >
                    {point.label}
                  </div>
                ))}

                {/* Live vehicle marker */}
                <button
                  onClick={() => setSelectedVehicle(vehicles[0])}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
                  style={{
                    left: `${selectedVehiclePosition.x}%`,
                    top: `${selectedVehiclePosition.y}%`,
                  }}
                >
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />
                  <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border-2 border-white bg-emerald-600 shadow-xl">
                    <Truck className="h-4 w-4 text-white" />
                  </span>
                </button>

                {/* Selected vehicle card */}
                {selectedVehicle && (
                  <div className="absolute right-4 top-4 w-[210px] rounded-xl border border-white/30 bg-white/95 p-4 shadow-2xl backdrop-blur">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-slate-800" />

                        <span className="text-xs font-extrabold">
                          TRK-{String(selectedVehicle.vehicle_id).slice(-2)}
                        </span>
                      </div>

                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">
                        {selectedVehicle.status === "en_route"
                          ? "Live"
                          : selectedVehicle.status}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 text-[10px] text-slate-500">
                      <p className="flex justify-between">
                        <span>ETA</span>
                        <strong className="text-slate-800">
                          {selectedVehicle.eta_minutes} min
                        </strong>
                      </p>

                      <p className="flex justify-between">
                        <span>Route</span>
                        <strong className="text-slate-800">
                          RT-{selectedVehicle.route_id}
                        </strong>
                      </p>

                      <p className="flex justify-between">
                        <span>Current stop</span>
                        <strong className="text-slate-800">
                          {selectedVehicle.current_stop}
                        </strong>
                      </p>

                      <p className="flex justify-between">
                        <span>Coordinates</span>
                        <strong className="text-slate-800">
                          {selectedVehicle.latitude.toFixed(3)},{" "}
                          {selectedVehicle.longitude.toFixed(3)}
                        </strong>
                      </p>
                    </div>
                  </div>
                )}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 rounded-xl bg-slate-950/70 px-4 py-3 text-[9px] text-white backdrop-blur">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    On Route
                  </div>

                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    Delayed
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    At Base
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 rounded-lg bg-white/95 px-3 py-2 text-[10px] font-bold text-slate-600 shadow">
                  Satellite View
                </div>
              </div>
            </div>

            {/* ACTIVE VEHICLES */}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <h2 className="text-base font-extrabold">Active Vehicles</h2>

                <button className="text-[10px] font-bold text-emerald-600">
                  View All →
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {vehicles.slice(0, 5).map((vehicle) => (
                  <button
                    key={vehicle.vehicle_id}
                    onClick={() => setSelectedVehicle(vehicle)}
                    className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-slate-50"
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        vehicle.status === "delayed"
                          ? "bg-amber-500"
                          : vehicle.status === "at_base"
                            ? "bg-slate-400"
                            : "bg-emerald-500"
                      }`}
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold">
                        TRK-{String(vehicle.vehicle_id).slice(-2)}
                      </p>

                      <p className="truncate text-[10px] text-slate-400">
                        Route {vehicle.route_id} → Stop {vehicle.current_stop}
                      </p>
                    </div>

                    <span
                      className={`rounded-md px-2 py-1 text-[9px] font-bold ${
                        vehicle.status === "delayed"
                          ? "bg-red-50 text-red-500"
                          : vehicle.status === "at_base"
                            ? "bg-slate-100 text-slate-500"
                            : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {vehicle.status === "en_route"
                        ? "En route"
                        : vehicle.status === "at_base"
                          ? "At Base"
                          : vehicle.status}
                    </span>

                    <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                  </button>
                ))}
              </div>

              <div className="px-5 py-4">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Live connection</span>
                  <span
                    className={
                      socketConnected
                        ? "font-bold text-emerald-600"
                        : "font-bold text-amber-500"
                    }
                  >
                    {socketConnected ? "Connected" : "Connecting"}
                  </span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all ${
                      socketConnected ? "w-full bg-emerald-500" : "w-1/2 bg-amber-400"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* AI INSIGHTS + ALERTS */}

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-extrabold">AI Insights</h2>

                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-bold text-emerald-600">
                      Beta
                    </span>
                  </div>

                  <button className="text-[10px] font-bold text-emerald-600">
                    View All →
                  </button>
                </div>

                <div className="space-y-4 p-5">
                  <Insight
                    icon={Clock3}
                    title="ETA delay risk on TRK-07"
                    text="Possible 45 min delay due to weather."
                    iconClass="bg-orange-50 text-orange-500"
                  />

                  <Insight
                    icon={Wrench}
                    title="Maintenance due for 3 vehicles"
                    text="Schedule in next 200 km."
                    iconClass="bg-blue-50 text-blue-600"
                  />

                  <Insight
                    icon={ChartNoAxesCombined}
                    title="High demand expected in Delhi"
                    text="Stock up to avoid delays."
                    iconClass="bg-emerald-50 text-emerald-600"
                  />

                  <Insight
                    icon={RouteIcon}
                    title="Route optimization opportunity"
                    text="Alternate route can save 18% fuel."
                    iconClass="bg-violet-50 text-violet-600"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <h2 className="text-base font-extrabold">Recent Alerts</h2>
                  <button className="text-[10px] font-bold text-emerald-600">
                    View All →
                  </button>
                </div>

                <div className="space-y-3 p-5">
                  <AlertRow
                    time="12:17"
                    text="TRK-07 — Delay alert"
                    type="danger"
                  />

                  <AlertRow
                    time="11:42"
                    text="VAN-03 — Route deviation"
                    type="warning"
                  />

                  <AlertRow
                    time="10:38"
                    text="Low stock — Visakhapatnam"
                    type="info"
                  />

                  <AlertRow
                    time="09:21"
                    text="Maintenance due — TRK-11"
                    type="maintenance"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* PLATFORM FEATURES */}
          {/* ========================================================= */}

          <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 px-1 text-base font-extrabold">
              Platform Features
            </h2>

            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
              <FeatureCard
                number="1"
                title="Fleet Management"
                description="Complete control over your fleet"
                icon={Truck}
              />

              <FeatureCard
                number="2"
                title="Predictive Maintenance"
                description="Predict failures. Keep the fleet moving."
                icon={Wrench}
              />

              <FeatureCard
                number="3"
                title="Route Optimization"
                description="Smarter routes. Faster deliveries."
                icon={RouteIcon}
                href="/dashboard/routes"
              />

              <FeatureCard
                number="4"
                title="ETA Prediction"
                description="Accurate ETAs. Happier customers."
                icon={Clock3}
              />

              <FeatureCard
                number="5"
                title="Inventory Management"
                description="Always the right stock, at the right time."
                icon={Package}
              />

              <FeatureCard
                number="6"
                title="Demand Forecasting"
                description="Predict demand. Plan ahead."
                icon={ChartNoAxesCombined}
              />

              <FeatureCard
                number="7"
                title="Delivery Management"
                description="From dispatch to doorstep."
                icon={Boxes}
              />

              <FeatureCard
                number="8"
                title="Real-time Tracking"
                description="Live location. Full visibility."
                icon={MapPin}
              />

              <FeatureCard
                number="9"
                title="Alerts & Notifications"
                description="Stay informed. Act faster."
                icon={Bell}
              />

              <FeatureCard
                number="10"
                title="Analytics & Reporting"
                description="Insights for smarter decisions."
                icon={ChartNoAxesCombined}
              />

              <FeatureCard
                number="11"
                title="User Management"
                description="Secure and role-based access."
                icon={Users}
              />

              <FeatureCard
                number="12"
                title="Media & Data Storage"
                description="Store what matters."
                icon={Database}
              />
            </div>
          </section>

          {/* ========================================================= */}
          {/* ANALYTICS */}
          {/* ========================================================= */}

          <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <AnalyticsCard
              title="Delivery Performance"
              value="99.2%"
              subtitle="On-Time Deliveries"
            >
              <div className="relative mt-5 h-36">
                <div className="absolute inset-x-0 bottom-5 border-t border-dashed border-slate-200" />
                <div className="absolute inset-x-0 bottom-14 border-t border-dashed border-slate-200" />
                <div className="absolute inset-x-0 bottom-[92px] border-t border-dashed border-slate-200" />

                <svg
                  viewBox="0 0 500 130"
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="none"
                >
                  <polyline
                    points="0,112 65,85 125,76 185,75 250,60 315,60 380,39 440,43 500,28"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="4"
                  />

                  {[0, 65, 125, 185, 250, 315, 380, 440, 500].map(
                    (x, index) => {
                      const ys = [112, 85, 76, 75, 60, 60, 39, 43, 28];

                      return (
                        <circle
                          key={x}
                          cx={x}
                          cy={ys[index]}
                          r="4"
                          fill="white"
                          stroke="#10b981"
                          strokeWidth="3"
                        />
                      );
                    },
                  )}
                </svg>

                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] text-slate-400">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                </div>
              </div>
            </AnalyticsCard>

            <AnalyticsCard
              title="Fleet Health Status"
              value="412"
              subtitle="Vehicles"
            >
              <div className="flex items-center justify-center gap-8 py-4">
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[conic-gradient(#10b981_0_78%,#f59e0b_78%_93%,#ef4444_93%_100%)]">
                  <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
                    <span className="text-2xl font-extrabold">412</span>
                    <span className="text-[9px] text-slate-400">Vehicles</span>
                  </div>
                </div>

                <div className="space-y-3 text-[10px]">
                  <LegendRow color="bg-emerald-500" label="Healthy" value="78%" />
                  <LegendRow
                    color="bg-orange-400"
                    label="Maintenance Due"
                    value="15%"
                  />
                  <LegendRow color="bg-red-500" label="Critical" value="7%" />
                </div>
              </div>
            </AnalyticsCard>

            <AnalyticsCard
              title="Fuel & Cost Optimization"
              value="↓ 40%"
              subtitle="Operational Costs"
            >
              <div className="mt-5 flex h-36 items-end justify-between gap-3 px-3">
                {[100, 82, 74, 56, 48, 79, 58].map((height, index) => (
                  <div
                    key={index}
                    className="flex h-full flex-1 items-end justify-center"
                  >
                    <div
                      className="w-full max-w-9 rounded-t-md bg-emerald-500/70"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-1 flex justify-between px-3 text-[9px] text-slate-400">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
              </div>
            </AnalyticsCard>
          </section>

          {/* ========================================================= */}
          {/* FOOTER */}
          {/* ========================================================= */}

          <footer className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-slate-200 py-5 text-[10px] text-slate-400 md:flex-row">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span className="font-semibold">
                MissionFlow AI — Mission Ready. Always Ahead.
              </span>
            </div>

            <div className="flex items-center gap-5">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Support</span>

              <span className="flex items-center gap-2 font-semibold text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                All Systems Operational
              </span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

/* ============================================================= */
/* COMPONENTS */
/* ============================================================= */

function SidebarItem({
  icon: Icon,
  label,
  active = false,
  badge,
  href,
}: {
  icon: typeof Activity;
  label: string;
  active?: boolean;
  badge?: string;
  href?: string;
}) {
  const content = (
    <>
      <Icon
        className={`h-[17px] w-[17px] ${
          active ? "text-emerald-700" : "text-slate-500"
        }`}
      />

      <span className="flex-1">{label}</span>

      {badge && (
        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-bold text-white">
          {badge}
        </span>
      )}
    </>
  );

  const className = `mb-1 flex h-10 w-full items-center gap-3 rounded-lg px-3 text-xs font-medium transition ${
    active
      ? "border-l-2 border-emerald-500 bg-emerald-50 text-slate-900"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
  }`;

  if (href) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return (
    <button className={className}>
      {content}
    </button>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  trend,
  trendPositive,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  trend: string;
  trendPositive?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>

        <span
          className={`text-[10px] font-bold ${
            trendPositive ? "text-emerald-600" : "text-slate-400"
          }`}
        >
          {trend}
        </span>
      </div>

      <p className="mt-4 text-[9px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-extrabold tracking-tight">{value}</p>
    </div>
  );
}

function Insight({
  icon: Icon,
  title,
  text,
  iconClass,
}: {
  icon: typeof Activity;
  title: string;
  text: string;
  iconClass: string;
}) {
  return (
    <div className="flex gap-3">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <p className="text-[11px] font-bold text-slate-800">{title}</p>
        <p className="mt-0.5 text-[10px] leading-4 text-slate-400">{text}</p>
      </div>
    </div>
  );
}

function AlertRow({
  time,
  text,
  type,
}: {
  time: string;
  text: string;
  type: "danger" | "warning" | "info" | "maintenance";
}) {
  const styles = {
    danger: "bg-red-50 text-red-500",
    warning: "bg-orange-50 text-orange-500",
    info: "bg-blue-50 text-blue-500",
    maintenance: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full ${styles[type]}`}
      >
        <span className="h-2 w-2 rounded-full bg-current" />
      </span>

      <span className="w-9 text-[9px] font-semibold text-slate-400">
        {time}
      </span>

      <span className="flex-1 text-[10px] font-semibold text-slate-600">
        {text}
      </span>
    </div>
  );
}

function FeatureCard({
  number,
  title,
  description,
  icon: Icon,
  href,
}: {
  number: string;
  title: string;
  description: string;
  icon: typeof Activity;
  href?: string;
}) {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
          <Icon className="h-4 w-4 text-blue-600" />
        </div>

        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
      </div>

      <p className="mt-2 text-[10px] font-extrabold text-slate-800">
        {number}. {title}
      </p>

      <p className="mt-1 text-[9px] leading-3.5 text-slate-400">
        {description}
      </p>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="rounded-xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-md">
      {content}
    </div>
  );
}

function AnalyticsCard({
  title,
  value,
  subtitle,
  children,
}: {
  title: string;
  value: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-extrabold">{title}</h2>
          <p className="mt-1 text-[9px] text-slate-400">{subtitle}</p>
        </div>

        <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">
          {value}
        </span>
      </div>

      {children}
    </div>
  );
}

function LegendRow({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span className="w-24 text-slate-500">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}



