import {
  Activity,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Boxes,
  ChevronDown,
  ChevronRight,
  Cloud,
  Clock3,
  FileBarChart,
  Gauge,
  Globe2,
  Layers3,
  MapPin,
  Menu,
  Navigation,
  Package,
  Search,
  Settings,
  ShieldCheck,
  Truck,
  UserRound,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { useState } from "react";

const features = [
  {
    number: "1",
    title: "Fleet Management",
    description: "Complete control over your fleet.",
    icon: Truck,
    href: "/dashboard/fleet",
  },
  {
    number: "2",
    title: "Predictive Maintenance",
    description: "Predict failures. Keep the fleet moving.",
    icon: Wrench,
    href: "/dashboard/maintenance",
  },
  {
    number: "3",
    title: "Route Optimization",
    description: "Smarter routes. Faster deliveries.",
    icon: Navigation,
    href: "/dashboard/routes",
  },
  {
    number: "4",
    title: "ETA Prediction",
    description: "Accurate ETAs. Happier customers.",
    icon: Clock3,
    href: "/dashboard/routes",
  },
  {
    number: "5",
    title: "Inventory Management",
    description: "Always the right stock, at the right time.",
    icon: Package,
    href: "/dashboard/inventory",
  },
  {
    number: "6",
    title: "Demand Forecasting",
    description: "Predict demand. Plan ahead.",
    icon: BarChart3,
    href: "/dashboard/demand",
  },
  {
    number: "7",
    title: "Delivery Management",
    description: "From dispatch to doorstep.",
    icon: Boxes,
    href: "/dashboard/deliveries",
  },
  {
    number: "8",
    title: "Real-time Tracking",
    description: "Live location. Full visibility.",
    icon: MapPin,
    href: "/dashboard/tracking",
  },
  {
    number: "9",
    title: "Alerts & Notifications",
    description: "Stay informed. Act faster.",
    icon: Bell,
    href: "/dashboard/alerts",
  },
  {
    number: "10",
    title: "Analytics & Reporting",
    description: "Insights for smarter decisions.",
    icon: FileBarChart,
    href: "/dashboard/analytics",
  },
  {
    number: "11",
    title: "User Management",
    description: "Secure and role-based access.",
    icon: Users,
    href: "/dashboard/users",
  },
  {
    number: "12",
    title: "Media & Data Storage",
    description: "Store what matters.",
    icon: Cloud,
    href: "/dashboard/media",
  },
];

const activeVehicles = [
  {
    id: "TRK-02",
    route: "Leh → Srinagar",
    status: "En route",
    statusType: "green",
  },
  {
    id: "TRK-07",
    route: "Delhi → Nagpur",
    status: "On time",
    statusType: "green",
  },
  {
    id: "VAN-03",
    route: "Chennai → Visakhapatnam",
    status: "Delayed",
    statusType: "red",
  },
  {
    id: "TRK-11",
    route: "Mumbai → Pune",
    status: "Delivered",
    statusType: "green",
  },
  {
    id: "TRK-09",
    route: "Kolkata → Guwahati",
    status: "En route",
    statusType: "green",
  },
];

const navItems = [
  { label: "Dashboard", icon: Layers3 },
  { label: "Fleet Management", icon: Truck },
  { label: "Live Tracking", icon: MapPin },
  { label: "Route Optimization", icon: Navigation },
  { label: "ETA Prediction", icon: Clock3 },
  { label: "Predictive Maintenance", icon: Wrench },
  { label: "Inventory Management", icon: Package },
  { label: "Demand Forecasting", icon: BarChart3 },
  { label: "Alerts & Notifications", icon: Bell, badge: "2" },
  { label: "Analytics & Reporting", icon: FileBarChart },
  { label: "User Management", icon: Users },
  { label: "Media & Data Storage", icon: Cloud },
];

function goTo(path: string) {
  window.location.href = path;
}

export function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f6fafc] text-[#14213d]">
      {/* ============================================================
          SIDEBAR
      ============================================================ */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[225px]
          border-r border-slate-200/70
          bg-white
          transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-[88px] items-center px-7">
            <img
              src="/logo.png"
              alt="MissionFlow AI"
              className="h-[55px] w-auto object-contain"
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 pb-4">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = index === 0;

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.label === "Dashboard") {
                      goTo("/dashboard");
                    } else if (item.label === "Route Optimization") {
                      goTo("/dashboard/routes");
                    } else if (item.label === "Live Tracking") {
                      goTo("/dashboard/tracking");
                    }
                  }}
                  className={`
                    group relative mb-1 flex w-full items-center gap-3
                    rounded-lg px-3 py-2.5 text-left text-[13px]
                    transition-all
                    ${
                      active
                        ? "bg-[#dcf8eb] font-semibold text-[#063d2b]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }
                  `}
                >
                  {active && (
                    <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#14b87a]" />
                  )}

                  <Icon
                    className={`h-[17px] w-[17px] ${
                      active ? "text-[#009c68]" : "text-slate-500"
                    }`}
                  />

                  <span className="flex-1">{item.label}</span>

                  {item.badge && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="mt-7 px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Tools
            </div>

            <button className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] text-slate-600 hover:bg-slate-50">
              <Zap className="h-[17px] w-[17px] text-slate-500" />
              API & Integrations
            </button>

            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] text-slate-600 hover:bg-slate-50">
              <Settings className="h-[17px] w-[17px] text-slate-500" />
              Settings
            </button>
          </nav>

          {/* Sidebar slogan */}
          <div className="relative overflow-hidden border-t border-slate-100 px-7 py-7">
            <div className="absolute -bottom-8 -left-5 h-32 w-48 rounded-full bg-gradient-to-tr from-slate-100 to-transparent opacity-80" />

            <p className="relative text-[11px] font-semibold uppercase leading-[1.7] tracking-[0.18em] text-slate-600">
              A stronger
              <br />
              India
              <br />
              through
              <br />
              smarter logistics.
            </p>

            <div className="relative mt-4 flex gap-0">
              <span className="h-[4px] w-12 bg-[#f58220]" />
              <span className="h-[4px] w-12 bg-[#13a36f]" />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}

      {/* ============================================================
          MAIN AREA
      ============================================================ */}

      <div className="lg:ml-[225px]">
        {/* TOP HEADER */}

        <header className="sticky top-0 z-30 flex h-[60px] items-center justify-between border-b border-slate-200/70 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Search */}
            <div className="hidden w-[390px] items-center gap-3 rounded-lg border border-slate-200 bg-[#f8fafc] px-3 py-2 md:flex">
              <Search className="h-[17px] w-[17px] text-slate-500" />

              <input
                className="w-full bg-transparent text-[12px] outline-none placeholder:text-slate-400"
                placeholder="Search vehicles, routes, locations, or anything..."
              />

              <span className="rounded border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-400">
                Ctrl K
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Date / weather */}
            <div className="hidden items-center gap-5 text-[11px] text-slate-500 xl:flex">
              <span>Fri, 13 Sep 2026</span>

              <span className="flex items-center gap-1.5">
                <Globe2 className="h-3.5 w-3.5" />
                Bengaluru, IN
              </span>

              <span className="flex items-center gap-1.5">
                <span className="text-base">☀️</span>
                28°C
              </span>

              <span className="h-2 w-2 rounded-full bg-[#13b879]" />
            </div>

            {/* Notification */}
            <button className="relative rounded-full p-2 hover:bg-slate-100">
              <Bell className="h-[19px] w-[19px] text-slate-700" />
              <span className="absolute right-0.5 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                2
              </span>
            </button>

            {/* Profile */}
            <button className="flex items-center gap-2.5 rounded-lg p-1.5 hover:bg-slate-50">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-200">
                <UserRound className="h-5 w-5 text-slate-600" />
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-[12px] font-semibold text-slate-800">
                  Devraj Menon
                </p>
                <p className="text-[10px] text-slate-500">
                  Fleet Manager
                </p>
              </div>

              <ChevronDown className="hidden h-4 w-4 text-slate-500 sm:block" />
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
          {/* ========================================================
              HERO
          ======================================================== */}

          <section className="mb-5 flex items-start justify-between">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                WELCOME BACK, DEVRAJ
              </p>

              <h1 className="text-[32px] font-bold leading-tight tracking-[-0.04em] text-[#111d39] sm:text-[39px]">
                Smarter Operations. A Stronger{" "}
                <span className="text-[#f47b20]">India</span>
                <span className="text-[#139b6b]">.</span>
              </h1>

              <p className="mt-1 text-[15px] text-slate-500">
                Real-time visibility. Predictive insights. More efficient
                deliveries.
              </p>
            </div>

            <div className="hidden w-[270px] rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm xl:block">
              <p className="border-l-4 border-[#f47b20] pl-3 text-[15px] italic leading-[1.45] text-slate-600">
                “From Fleet to Final Mile
                <br />
                Smarter Decisions,
                <br />
                A More Efficient Tomorrow.”
              </p>

              <div className="mt-3 flex">
                <span className="h-[4px] w-14 bg-[#f47b20]" />
                <span className="h-[4px] w-14 bg-[#13a36f]" />
              </div>
            </div>
          </section>

          {/* ========================================================
              KPI CARDS
          ======================================================== */}

          <section className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
            <MetricCard
              icon={Truck}
              value="412"
              label="Total Vehicles"
              trend="12%"
              trendUp
              iconClass="bg-blue-50 text-blue-600"
            />

            <MetricCard
              icon={Users}
              value="28"
              label="Active Convoys"
              trend="8%"
              trendUp
              iconClass="bg-purple-50 text-purple-600"
            />

            <MetricCard
              icon={Navigation}
              value="6"
              label="In Transit"
              trend="0%"
              iconClass="bg-emerald-50 text-emerald-600"
            />

            <MetricCard
              icon={Clock3}
              value="99.2%"
              label="On-Time Deliveries"
              trend="2.1%"
              trendUp
              iconClass="bg-green-50 text-green-600"
            />

            <MetricCard
              icon={Layers3}
              value="40%"
              label="Lower Operational Costs"
              trend="40%"
              trendUp
              iconClass="bg-blue-50 text-blue-600"
            />

            <MetricCard
              icon={ShieldCheck}
              value="100%"
              label="Mission Focused"
              trend="—"
              trendUp
              iconClass="bg-green-50 text-green-600"
            />
          </section>

          {/* ========================================================
              MAIN NETWORK / VEHICLES / AI
          ======================================================== */}

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(260px,0.72fr)_minmax(250px,0.72fr)]">
            {/* LIVE MAP */}

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex h-[42px] items-center justify-between border-b border-slate-100 px-3">
                <h2 className="text-[16px] font-bold text-slate-800">
                  Live Mission Network
                </h2>

                <div className="flex overflow-hidden rounded-lg border border-slate-200 text-[10px]">
                  <button className="bg-[#e9fff5] px-3 py-1.5 font-semibold text-[#008c60]">
                    Live Map
                  </button>
                  <button className="px-3 py-1.5 text-slate-500">
                    Convoys
                  </button>
                  <button className="px-3 py-1.5 text-slate-500">
                    Vehicles
                  </button>
                  <button className="px-3 py-1.5 text-slate-500">
                    Geofences
                  </button>
                </div>
              </div>

              <div className="relative h-[305px] overflow-hidden bg-[#173c47]">
                {/* Map texture */}
                <div className="absolute inset-0 opacity-70">
                  <svg
                    viewBox="0 0 900 400"
                    className="h-full w-full"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <pattern
                        id="grid"
                        width="42"
                        height="42"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 42 0 L 0 0 0 42"
                          fill="none"
                          stroke="rgba(255,255,255,0.05)"
                          strokeWidth="1"
                        />
                      </pattern>
                    </defs>

                    <rect width="900" height="400" fill="#173c47" />
                    <rect width="900" height="400" fill="url(#grid)" />

                    <path
                      d="M80 60 Q220 120 300 70 T530 90 T800 45"
                      fill="none"
                      stroke="rgba(180,220,210,.18)"
                      strokeWidth="3"
                    />

                    <path
                      d="M40 310 Q180 260 270 320 T500 270 T860 330"
                      fill="none"
                      stroke="rgba(180,220,210,.18)"
                      strokeWidth="4"
                    />

                    <path
                      d="M180 0 Q250 80 210 180 T260 400"
                      fill="none"
                      stroke="rgba(255,255,255,.12)"
                      strokeWidth="2"
                    />

                    <path
                      d="M500 0 Q450 120 530 190 T490 400"
                      fill="none"
                      stroke="rgba(255,255,255,.12)"
                      strokeWidth="2"
                    />

                    {/* India-like land silhouette */}
                    <path
                      d="M450 35 L510 48 L535 82 L575 100 L560 145 L590 180 L560 220 L540 270 L505 300 L480 355 L455 320 L425 330 L405 285 L370 265 L385 225 L355 190 L375 150 L360 115 L400 95 Z"
                      fill="rgba(61,116,93,.34)"
                      stroke="rgba(206,237,217,.32)"
                      strokeWidth="2"
                    />

                    {/* Route network */}
                    <path
                      d="M510 75 Q490 130 455 175 Q425 215 385 255 Q350 285 305 300"
                      fill="none"
                      stroke="#18d77f"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray="8 7"
                    />

                    <path
                      d="M510 75 Q560 125 535 185 Q510 235 475 270 Q440 310 405 330"
                      fill="none"
                      stroke="#18d77f"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray="8 7"
                    />

                    <path
                      d="M455 175 Q500 205 535 185"
                      fill="none"
                      stroke="#f5a623"
                      strokeWidth="4"
                      strokeDasharray="7 6"
                    />

                    {/* route nodes */}
                    <MapNode x="510" y="75" label="Srinagar" />
                    <MapNode x="455" y="175" label="Delhi" />
                    <MapNode x="535" y="185" label="Nagpur" />
                    <MapNode x="405" y="330" label="Visakhapatnam" />
                    <MapNode x="305" y="300" label="Mumbai" />
                    <MapNode x="385" y="255" label="Chennai" />
                  </svg>
                </div>

                {/* Map controls */}
                <div className="absolute left-3 top-3 flex flex-col overflow-hidden rounded-lg border border-white/20 bg-white/95 shadow-lg">
                  <button className="border-b border-slate-200 p-2.5">
                    <span className="text-lg leading-none">+</span>
                  </button>
                  <button className="p-2.5">
                    <span className="text-lg leading-none">−</span>
                  </button>
                  <button className="border-t border-slate-200 p-2.5">
                    <Navigation className="h-4 w-4 text-slate-600" />
                  </button>
                </div>

                {/* Selected vehicle */}
                <div className="absolute right-3 top-3 w-[210px] rounded-xl bg-white p-3 shadow-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-slate-700" />
                      <div>
                        <p className="text-[13px] font-bold">TRK-02</p>
                        <p className="text-[10px] font-semibold text-[#0aa66b]">
                          En route
                        </p>
                      </div>
                    </div>

                    <span className="rounded-md bg-[#e3faef] px-2 py-1 text-[9px] font-semibold text-[#009a67]">
                      ● Live
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-[10px] text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-3.5 w-3.5" />
                      ETA: 2h 14m
                    </div>

                    <div className="flex items-center gap-2">
                      <Gauge className="h-3.5 w-3.5" />
                      Speed: 92 km/h
                    </div>

                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Health: 92%
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-3 left-3 rounded-lg bg-slate-950/65 px-3 py-2.5 text-[9px] text-white backdrop-blur-sm">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <LegendDot color="bg-[#12d979]" label="On Route" />
                    <LegendDot color="bg-[#f5aa17]" label="Delayed" />
                    <LegendDot color="bg-[#18aee0]" label="At Base" />
                    <LegendDot color="bg-[#ff3131]" label="Alert" />
                  </div>
                </div>

                <button className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-[10px] font-semibold text-slate-700 shadow-lg">
                  Satellite View
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* ACTIVE VEHICLES */}

            <Panel title="Active Vehicles" action="View All">
              <div className="divide-y divide-slate-100">
                {activeVehicles.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    className="flex w-full items-center gap-2.5 px-3 py-3 text-left hover:bg-slate-50"
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        vehicle.statusType === "red"
                          ? "border-slate-500"
                          : "border-[#0ac174]"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          vehicle.statusType === "red"
                            ? "bg-slate-700"
                            : "bg-[#0ac174]"
                        }`}
                      />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-slate-700">
                        {vehicle.id}
                      </p>
                      <p className="truncate text-[9px] text-slate-500">
                        {vehicle.route}
                      </p>
                    </div>

                    <span
                      className={`whitespace-nowrap rounded-md px-2 py-1 text-[8px] font-semibold ${
                        vehicle.statusType === "red"
                          ? "bg-red-50 text-red-500"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {vehicle.status}
                    </span>

                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </Panel>

            {/* AI INSIGHTS + ALERTS */}

            <div className="space-y-4">
              <Panel title="AI Insights" action="View All" beta>
                <div className="divide-y divide-slate-100">
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
                    iconClass="bg-blue-50 text-blue-500"
                  />

                  <Insight
                    icon={BarChart3}
                    title="High demand expected in Delhi"
                    text="Stock up to avoid delays."
                    iconClass="bg-emerald-50 text-emerald-600"
                  />

                  <Insight
                    icon={Navigation}
                    title="Route optimization opportunity"
                    text="Alternate route can save 18% fuel."
                    iconClass="bg-purple-50 text-purple-600"
                  />
                </div>
              </Panel>

              <Panel title="Recent Alerts" action="View All">
                <div className="divide-y divide-slate-100">
                  <AlertRow
                    time="12:17"
                    text="TRK-07 – Delay alert"
                    type="danger"
                  />
                  <AlertRow
                    time="11:42"
                    text="VAN-03 – Route deviation"
                    type="warning"
                  />
                  <AlertRow
                    time="10:38"
                    text="Low stock – Visakhapatnam"
                    type="info"
                  />
                  <AlertRow
                    time="09:21"
                    text="Maintenance due – TRK-11"
                    type="maintenance"
                  />
                </div>
              </Panel>
            </div>
          </section>

          {/* ========================================================
              PLATFORM FEATURES
          ======================================================== */}

          <section className="mt-5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <h2 className="mb-3 px-1 text-[16px] font-bold text-slate-800">
              Platform Features
            </h2>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <button
                    key={feature.number}
                    onClick={() => goTo(feature.href)}
                    className="group flex min-h-[76px] items-center gap-2.5 rounded-lg border border-slate-100 bg-white px-2.5 py-2 text-left transition-all hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-sm"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50">
                      <Icon className="h-[18px] w-[18px] text-[#3474d8]" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[10px] font-bold text-slate-700">
                        {feature.number}. {feature.title}
                      </span>

                      <span className="mt-0.5 block text-[8.5px] leading-[1.35] text-slate-500">
                        {feature.description}
                      </span>
                    </span>

                    <ArrowRight className="h-3 w-3 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                  </button>
                );
              })}
            </div>
          </section>

          {/* ========================================================
              ANALYTICS
          ======================================================== */}

          <section className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Delivery Performance */}

            <AnalyticsCard title="Delivery Performance">
              <div className="mb-2 flex justify-end">
                <span className="rounded-md border border-slate-200 px-2.5 py-1 text-[9px] text-slate-600">
                  On-Time Deliveries <ChevronDown className="ml-1 inline h-3 w-3" />
                </span>
              </div>

              <div className="relative h-[150px]">
                <svg viewBox="0 0 500 150" className="h-full w-full">
                  {/* grid */}
                  {[25, 55, 85, 115].map((y) => (
                    <line
                      key={y}
                      x1="42"
                      x2="475"
                      y1={y}
                      y2={y}
                      stroke="#e5edf2"
                      strokeWidth="1"
                    />
                  ))}

                  {/* vertical */}
                  {[42, 114, 186, 258, 330, 402, 474].map((x) => (
                    <line
                      key={x}
                      x1={x}
                      x2={x}
                      y1="15"
                      y2="125"
                      stroke="#eef3f6"
                      strokeWidth="1"
                    />
                  ))}

                  <polyline
                    points="42,105 114,78 186,68 258,66 330,52 402,51 474,30"
                    fill="none"
                    stroke="#0aaa6a"
                    strokeWidth="2.5"
                  />

                  {[
                    [42, 105],
                    [114, 78],
                    [186, 68],
                    [258, 66],
                    [330, 52],
                    [402, 51],
                    [474, 30],
                  ].map(([x, y]) => (
                    <circle
                      key={`${x}-${y}`}
                      cx={x}
                      cy={y}
                      r="3.5"
                      fill="#0aaa6a"
                    />
                  ))}

                  <text x="7" y="29" fontSize="9" fill="#64748b">
                    100%
                  </text>
                  <text x="15" y="89" fontSize="9" fill="#64748b">
                    50%
                  </text>
                  <text x="22" y="128" fontSize="9" fill="#64748b">
                    0%
                  </text>

                  {["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"].map(
                    (month, index) => (
                      <text
                        key={month}
                        x={42 + index * 72}
                        y="145"
                        textAnchor="middle"
                        fontSize="9"
                        fill="#64748b"
                      >
                        {month}
                      </text>
                    )
                  )}
                </svg>

                <span className="absolute right-0 top-0 rounded-md bg-[#0aaa6a] px-2 py-1 text-[10px] font-bold text-white">
                  99.2%
                </span>
              </div>
            </AnalyticsCard>

            {/* Fleet Health */}

            <AnalyticsCard title="Fleet Health Status" action="View Details">
              <div className="flex h-[155px] items-center justify-center gap-8">
                <div className="relative flex h-[125px] w-[125px] items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "conic-gradient(#0aaa6a 0 78%, #f59e0b 78% 93%, #ef4444 93% 100%)",
                    }}
                  />

                  <div className="absolute inset-[12px] flex flex-col items-center justify-center rounded-full bg-white">
                    <span className="text-[24px] font-bold text-slate-800">
                      412
                    </span>
                    <span className="text-[9px] text-slate-500">
                      Vehicles
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <HealthItem
                    color="bg-[#0aaa6a]"
                    label="Healthy"
                    value="78%"
                  />
                  <HealthItem
                    color="bg-[#f59e0b]"
                    label="Maintenance Due"
                    value="15%"
                  />
                  <HealthItem
                    color="bg-[#ef4444]"
                    label="Critical"
                    value="7%"
                  />
                </div>
              </div>
            </AnalyticsCard>

            {/* Fuel */}

            <AnalyticsCard title="Fuel & Cost Optimization">
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-md bg-[#dff8eb] px-2 py-1 text-[10px] font-bold text-[#009b67]">
                  ↓ 40%
                </span>

                <span className="rounded-md border border-slate-200 px-2.5 py-1 text-[9px] text-slate-600">
                  Operational Costs{" "}
                  <ChevronDown className="ml-1 inline h-3 w-3" />
                </span>
              </div>

              <div className="flex h-[150px] items-end justify-around gap-2 border-b border-slate-200 px-3 pb-1 pt-5">
                {[92, 74, 67, 50, 42, 72, 51].map((height, index) => (
                  <div
                    key={index}
                    className="flex h-full flex-1 flex-col justify-end"
                  >
                    <div
                      className="mx-auto w-full max-w-[22px] rounded-t-sm bg-[#7bc79d]"
                      style={{ height: `${height}%` }}
                    />
                    <span className="mt-1 text-center text-[8px] text-slate-500">
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"][
                        index
                      ]}
                    </span>
                  </div>
                ))}
              </div>
            </AnalyticsCard>
          </section>
        </main>

        {/* ============================================================
            FOOTER
        ============================================================ */}

        <footer className="mt-3 flex min-h-[58px] items-center justify-between border-t border-slate-200 bg-white px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="MissionFlow AI"
              className="h-8 w-auto"
            />
          </div>

          <div className="flex items-center gap-5 text-[9px] text-slate-400">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Support</span>

            <span className="flex items-center gap-2 font-medium text-slate-600">
              <span className="h-2 w-2 rounded-full bg-[#0aaa6a]" />
              All Systems Operational
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ================================================================
   COMPONENTS
================================================================ */

function MetricCard({
  icon: Icon,
  value,
  label,
  trend,
  trendUp,
  iconClass,
}: {
  icon: typeof Truck;
  value: string;
  label: string;
  trend: string;
  trendUp?: boolean;
  iconClass: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className={`rounded-lg p-2 ${iconClass}`}>
          <Icon className="h-5 w-5" />
        </div>

        <span className="text-[9px] text-slate-400">
          {trendUp ? (
            <ArrowUpRight className="mr-0.5 inline h-3 w-3 text-[#0aaa6a]" />
          ) : (
            <ArrowRight className="mr-0.5 inline h-3 w-3" />
          )}
          {trend}
        </span>
      </div>

      <p className="mt-2 text-[24px] font-bold leading-none text-slate-800">
        {value}
      </p>

      <p className="mt-1 text-[9px] text-slate-500">{label}</p>
    </div>
  );
}

function Panel({
  title,
  action,
  beta,
  children,
}: {
  title: string;
  action?: string;
  beta?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex h-[42px] items-center justify-between border-b border-slate-100 px-3">
        <div className="flex items-center gap-2">
          <h2 className="text-[14px] font-bold text-slate-800">{title}</h2>

          {beta && (
            <span className="rounded-md bg-[#dff8eb] px-2 py-0.5 text-[8px] font-semibold text-[#009b67]">
              Beta
            </span>
          )}
        </div>

        {action && (
          <button className="flex items-center gap-1 text-[9px] font-semibold text-[#009b67]">
            {action}
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>

      {children}
    </div>
  );
}

function Insight({
  icon: Icon,
  title,
  text,
  iconClass,
}: {
  icon: typeof Clock3;
  title: string;
  text: string;
  iconClass: string;
}) {
  return (
    <div className="flex gap-2.5 px-3 py-2.5">
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
        <Icon className="h-3.5 w-3.5" />
      </span>

      <div>
        <p className="text-[10px] font-semibold text-slate-700">{title}</p>
        <p className="mt-0.5 text-[8.5px] text-slate-500">{text}</p>
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
    maintenance: "bg-orange-50 text-orange-500",
  };

  const Icon =
    type === "maintenance"
      ? Wrench
      : type === "danger"
        ? AlertCircle
        : type === "warning"
          ? AlertCircle
          : Activity;

  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5">
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${styles[type]}`}
      >
        <Icon className="h-3 w-3" />
      </span>

      <span className="w-9 text-[8px] text-slate-400">{time}</span>

      <span className="flex-1 text-[9px] font-medium text-slate-600">
        {text}
      </span>
    </div>
  );
}

function AnalyticsCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-slate-800">{title}</h2>

        {action && (
          <button className="flex items-center gap-1 text-[9px] font-semibold text-[#009b67]">
            {action}
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>

      {children}
    </div>
  );
}

function HealthItem({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-[125px] items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span className="flex-1 text-[9px] text-slate-600">{label}</span>
      <span className="text-[10px] font-bold text-slate-700">{value}</span>
    </div>
  );
}

function LegendDot({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {label}
    </span>
  );
}

function MapNode({
  x,
  y,
  label,
}: {
  x: string;
  y: string;
  label: string;
}) {
  return (
    <>
      <circle cx={x} cy={y} r="8" fill="#18d77f" stroke="#fff" strokeWidth="3" />
      <text
        x={x}
        y={String(Number(y) - 14)}
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="white"
        stroke="rgba(0,0,0,.4)"
        strokeWidth="3"
        paintOrder="stroke"
      >
        {label}
      </text>
    </>
  );
}