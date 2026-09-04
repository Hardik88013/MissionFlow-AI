import type { MissionNode } from "./types";
import { GlassCard } from "../../ui/GlassCard";
import { StatusBadge } from "../../ui/StatusBadge";
import { Badge } from "../../ui/Badge";

export function NetworkMap() {
  const nodes: MissionNode[] = [
    { id: "leh", label: "LEH", cx: 400, cy: 150, state: "ACTIVE" },
    { id: "srinagar", label: "SRINAGAR", cx: 280, cy: 220, state: "DESTINATION" },
    { id: "delhi", label: "DELHI", cx: 420, cy: 400, state: "ACTIVE" },
    { id: "nagpur", label: "NAGPUR", cx: 480, cy: 620, state: "OPERATIONAL" },
    { id: "mumbai", label: "MUMBAI", cx: 250, cy: 650, state: "OPERATIONAL" },
    { id: "visakhapatnam", label: "VISAKHAPATNAM", cx: 650, cy: 700, state: "OPERATIONAL" },
    { id: "chennai", label: "CHENNAI", cx: 520, cy: 850, state: "ACTIVE" },
  ];

  return (
    <div className="relative w-full h-[500px] md:h-[600px] rounded-2xl border border-border/50 bg-background overflow-hidden shadow-soft flex items-center justify-center">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary),0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-50" />
      
      {/* Legend */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col gap-2 z-10 p-3 bg-surface/50 backdrop-blur-md rounded-lg border border-border/50">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">ACTIVE</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">OPERATIONAL</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-warning" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">DELAYED</span>
        </div>
      </div>

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="active-route" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--color-primary)" />
          </linearGradient>
          <filter id="glow-map" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Network Connections */}
        <g stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" className="text-border/40">
          <path d="M 420 400 L 480 620" /> {/* Delhi - Nagpur */}
          <path d="M 480 620 L 250 650" /> {/* Nagpur - Mumbai */}
          <path d="M 480 620 L 650 700" /> {/* Nagpur - Visakhapatnam */}
          <path d="M 650 700 L 520 850" /> {/* Visakhapatnam - Chennai */}
          <path d="M 250 650 L 520 850" /> {/* Mumbai - Chennai */}
          <path d="M 400 150 L 420 400" /> {/* Leh - Delhi */}
          <path d="M 280 220 L 420 400" /> {/* Srinagar - Delhi */}
        </g>
        
        {/* Highlighted Mission Route: Leh -> Srinagar */}
        <path 
          id="network-route"
          d="M 400 150 Q 320 160 280 220" 
          fill="none" 
          stroke="url(#active-route)" 
          strokeWidth="6" 
          strokeLinecap="round"
          strokeDasharray="400"
          strokeDashoffset="400"
          className="motion-safe:animate-[draw-route_3s_ease-out_forwards]"
        />

        {/* Moving Vehicle */}
        <g>
          <circle r="10" fill="var(--color-surface)" stroke="var(--color-primary)" strokeWidth="3" filter="url(#glow-map)" />
          <circle r="20" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" className="opacity-60 motion-safe:animate-ping origin-center" />
          <animateMotion 
            dur="8s" 
            repeatCount="indefinite" 
            path="M 400 150 Q 320 160 280 220"
            calcMode="linear"
          />
        </g>
        
        {/* Nodes */}
        <g className="cursor-default">
          {nodes.map(node => {
            let colorVar = "var(--color-success)";
            if (node.state === "ACTIVE" || node.state === "DESTINATION") colorVar = "var(--color-primary)";
            if (node.state === "ALERT") colorVar = "var(--color-danger)";

            return (
              <g key={node.id} className="hover:opacity-80 transition-opacity">
                {/* Node pulse for active/destination */}
                {(node.state === "ACTIVE" || node.state === "DESTINATION") && (
                  <circle cx={node.cx} cy={node.cy} r="20" fill={colorVar} className="opacity-20 motion-safe:animate-ping origin-center" />
                )}
                {/* Core */}
                <circle cx={node.cx} cy={node.cy} r={node.state === "DESTINATION" ? "8" : "6"} fill={colorVar} />
                <circle cx={node.cx} cy={node.cy} r={node.state === "DESTINATION" ? "14" : "10"} fill="none" stroke={colorVar} strokeWidth="2" className="opacity-50" />
                
                {/* Text Label */}
                <text x={node.cx} y={node.cy - 20} textAnchor="middle" fill="currentColor" className="text-sm font-semibold tracking-widest uppercase opacity-80 text-foreground">
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Selected Vehicle Intelligence Card */}
      <GlassCard className="p-4 sm:p-5 w-[260px] sm:w-[300px] absolute bottom-4 sm:bottom-8 left-4 sm:left-8 z-20 shadow-xl border-border/60">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-foreground">TRK-02</h4>
            <p className="text-[10px] sm:text-xs text-muted-foreground tracking-widest uppercase mt-0.5">LEH → SRINAGAR</p>
          </div>
          <StatusBadge status="success" label="ON ROUTE" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">ETA</p>
            <p className="text-sm font-semibold text-foreground">2h 14m</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">SPEED</p>
            <p className="text-sm font-semibold text-foreground">92 km/h</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">FUEL</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">67%</p>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[67%]" />
              </div>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">HEALTH</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">92%</p>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-success w-[92%]" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-border/40 flex justify-between items-center">
          <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] px-2 py-0">
            ACTIVE ROUTE
          </Badge>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">SECURE</span>
        </div>
      </GlassCard>
    </div>
  );
}
