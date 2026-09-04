import { StatusBadge } from "../../ui/StatusBadge";

export function RouteOptimizationView() {
  return (
    <div className="flex flex-col h-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-500">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface p-4 rounded-xl border border-border/50 flex flex-col">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">CURRENT ROUTE</span>
          <span className="text-sm font-bold tracking-widest text-foreground">LEH → SRINAGAR</span>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-border/50 flex flex-col">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">CURRENT ETA</span>
          <span className="text-lg font-bold text-foreground">2h 14m</span>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-border/50 flex flex-col items-start justify-center">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">ROUTE STATUS</span>
          <StatusBadge status="success" label="OPTIMIZED" />
        </div>
      </div>

      <div className="flex-1 w-full bg-surface rounded-xl border border-border/50 relative overflow-hidden flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary),0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
        
        <svg className="w-full h-full max-h-[300px]" viewBox="0 0 500 200" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="opt-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-success)" />
            </linearGradient>
          </defs>

          {/* Original Route (blocked) */}
          <path d="M 50 100 Q 250 50 450 100" fill="none" stroke="var(--color-muted-foreground)" strokeWidth="4" strokeDasharray="6 6" className="opacity-40" />
          
          {/* Disruption Marker */}
          <circle cx="250" cy="75" r="8" fill="var(--color-danger)" className="motion-safe:animate-pulse" />
          <text x="250" y="55" textAnchor="middle" fill="var(--color-danger)" className="text-[10px] font-bold tracking-wider">DISRUPTION</text>

          {/* Optimized Alternative Route */}
          <path 
            d="M 50 100 Q 250 180 450 100" 
            fill="none" 
            stroke="url(#opt-gradient)" 
            strokeWidth="6" 
            strokeLinecap="round" 
            strokeDasharray="500"
            strokeDashoffset="500"
            className="motion-safe:animate-[draw-route_2s_ease-out_forwards]"
          />

          {/* Start/End Nodes */}
          <circle cx="50" cy="100" r="6" fill="var(--color-primary)" />
          <text x="50" y="125" textAnchor="middle" fill="currentColor" className="text-[10px] font-bold tracking-widest text-foreground">LEH</text>

          <circle cx="450" cy="100" r="6" fill="var(--color-success)" />
          <text x="450" y="125" textAnchor="middle" fill="currentColor" className="text-[10px] font-bold tracking-widest text-foreground">SRINAGAR</text>

          {/* Floating Label for new route */}
          <rect x="210" y="130" width="80" height="20" rx="10" fill="var(--color-surface)" stroke="var(--color-success)" strokeWidth="1" />
          <text x="250" y="144" textAnchor="middle" fill="var(--color-success)" className="text-[8px] font-bold tracking-wider">OPTIMIZED</text>
        </svg>
      </div>
    </div>
  );
}
