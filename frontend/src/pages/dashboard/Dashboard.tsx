import {
  Activity,
  BarChart3,
  Boxes,
  Map,
  Truck,
} from "lucide-react";

export function Dashboard() {
  const stats = [
    {
      label: "ACTIVE VEHICLES",
      value: "24",
      icon: Truck,
    },
    {
      label: "ACTIVE DELIVERIES",
      value: "87",
      icon: Boxes,
    },
    {
      label: "ACTIVE ROUTES",
      value: "18",
      icon: Map,
    },
    {
      label: "ON-TIME RATE",
      value: "96.4%",
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="h-20 border-b border-border/50 bg-background flex items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-4">
          <img
            src="/logo.png"
            alt="MissionFlow AI"
            className="h-10 w-auto"
          />

          <div className="hidden sm:block h-6 w-px bg-border" />

          <span className="hidden sm:block text-sm font-semibold text-muted-foreground">
            MISSION CONTROL
          </span>
        </div>

        <a
          href="/"
          className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          Exit
        </a>
      </header>

      <main className="p-6 lg:p-10 max-w-[1600px] mx-auto">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-[0.2em] text-primary mb-2">
            OPERATIONS CENTER
          </p>

          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
            Mission Dashboard
          </h1>

          <p className="mt-2 text-muted-foreground">
            Real-time visibility across your logistics network.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="bg-surface border border-border/50 rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground">
                    {stat.label}
                  </span>

                  <Icon className="w-5 h-5 text-primary" />
                </div>

                <div className="text-3xl font-bold">
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <a
            href="/dashboard/routes"
            className="lg:col-span-2 min-h-[320px] bg-surface border border-border/50 rounded-2xl p-6 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold tracking-wider text-primary">
                  ROUTE OPTIMIZATION
                </p>

                <h2 className="text-2xl font-bold mt-2">
                  Optimize Mission Routes
                </h2>

                <p className="text-sm text-muted-foreground mt-2 max-w-lg">
                  Optimize vehicle assignments and delivery routes using
                  MissionFlow's routing engine.
                </p>
              </div>

              <Map className="w-8 h-8 text-primary" />
            </div>

            <div className="mt-12 h-32 rounded-xl border border-border/40 bg-background/50 flex items-center justify-center">
              <span className="text-sm text-muted-foreground">
                Route network visualization
              </span>
            </div>
          </a>

          <div className="min-h-[320px] bg-surface border border-border/50 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-primary" />

              <h2 className="font-bold">
                System Status
              </h2>
            </div>

            <div className="mt-8 space-y-5">
              <Status label="API Services" />
              <Status label="Routing Engine" />
              <Status label="Fleet Tracking" />
              <Status label="ETA Prediction" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Status({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>

      <span className="flex items-center gap-2 text-xs font-semibold text-green-500">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        OPERATIONAL
      </span>
    </div>
  );
}
