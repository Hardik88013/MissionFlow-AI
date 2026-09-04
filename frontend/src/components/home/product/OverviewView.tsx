import { StatusBadge } from "../../ui/StatusBadge";

export function OverviewView() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-full max-w-sm rounded-xl bg-surface border border-border/50 shadow-soft overflow-hidden">
        <div className="p-4 border-b border-border/40 bg-surface-elevated flex justify-between items-center">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">MISSION STATUS</h4>
          <StatusBadge status="info" label="ACTIVE" />
        </div>
        
        <div className="p-6 flex flex-col gap-6">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-1">TRK-02</h3>
            <p className="text-sm font-medium text-muted-foreground tracking-widest uppercase">LEH → SRINAGAR</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background p-3 rounded-lg border border-border/30">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">ETA</p>
              <p className="text-lg font-semibold text-foreground">2h 14m</p>
            </div>
            <div className="bg-background p-3 rounded-lg border border-border/30">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">FUEL</p>
              <p className="text-lg font-semibold text-foreground">67%</p>
            </div>
            <div className="bg-background p-3 rounded-lg border border-border/30">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">VEHICLE HEALTH</p>
              <p className="text-lg font-semibold text-foreground">92%</p>
            </div>
            <div className="bg-background p-3 rounded-lg border border-border/30">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">ROUTE STATUS</p>
              <p className="text-sm font-semibold text-success mt-1">OPTIMIZED</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
