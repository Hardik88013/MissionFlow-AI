
import { GlassCard } from "../../ui/GlassCard";
import { StatusBadge } from "../../ui/StatusBadge";
import { Badge } from "../../ui/Badge";

export function MissionStatusCard() {
  return (
    <GlassCard className="p-4 md:p-5 w-[280px] sm:w-[320px] absolute bottom-4 sm:bottom-8 left-4 sm:left-8 z-20 shadow-xl border-border/60 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-foreground">TRK-02</h4>
          <p className="text-xs text-muted-foreground tracking-widest uppercase mt-0.5">LEH → SRINAGAR</p>
        </div>
        <StatusBadge status="success" label="ON ROUTE" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">ETA</p>
          <p className="text-sm font-semibold text-foreground">2h 14m</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">SPEED</p>
          <p className="text-sm font-semibold text-foreground">92 km/h</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">FUEL</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">67%</p>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[67%]" />
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">HEALTH</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">92%</p>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-success w-[92%]" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-border/40 flex justify-between items-center">
        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 text-[10px] px-2 py-0">
          ACTIVE ROUTE
        </Badge>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Live Intel</span>
      </div>
    </GlassCard>
  );
}
