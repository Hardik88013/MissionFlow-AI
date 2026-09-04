export function FleetIntelligenceView() {
  const vehicles = [
    { id: "TRK-02", status: "HEALTHY", health: 92 },
    { id: "TRK-17", status: "HEALTHY", health: 88 },
    { id: "TRK-09", status: "ATTENTION", health: 64 },
    { id: "TRK-21", status: "HEALTHY", health: 95 },
  ];

  return (
    <div className="flex flex-col h-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-8">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">FLEET HEALTH</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-surface p-4 rounded-xl border border-border/50 text-center">
            <p className="text-2xl font-bold text-success mb-1">92%</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Healthy</p>
          </div>
          <div className="bg-surface p-4 rounded-xl border border-border/50 text-center">
            <p className="text-2xl font-bold text-warning mb-1">6%</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Attention</p>
          </div>
          <div className="bg-surface p-4 rounded-xl border border-border/50 text-center">
            <p className="text-2xl font-bold text-danger mb-1">2%</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Critical</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-surface rounded-xl border border-border/50 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border/30 bg-surface-elevated flex justify-between">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Vehicle ID</span>
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Status / Health</span>
        </div>
        <div className="flex-1 p-2 flex flex-col gap-2 overflow-y-auto">
          {vehicles.map(v => (
            <div key={v.id} className="flex justify-between items-center p-3 rounded-lg bg-background border border-border/30 hover:border-primary/30 transition-colors">
              <span className="text-sm font-bold text-foreground">{v.id}</span>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] uppercase font-bold tracking-wider ${
                  v.status === 'HEALTHY' ? 'text-success' : 'text-warning'
                }`}>{v.status}</span>
                <span className="text-sm font-semibold">{v.health}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
