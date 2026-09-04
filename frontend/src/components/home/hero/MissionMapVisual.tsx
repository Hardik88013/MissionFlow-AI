import { MissionStatusCard } from "./MissionStatusCard";
import { Badge } from "../../ui/Badge";

export function MissionMapVisual() {
  const nodes = [
    { id: "leh", label: "LEH", cx: 250, cy: 200 },
    { id: "srinagar", label: "SRINAGAR", cx: 750, cy: 300 },
    { id: "delhi", label: "DELHI", cx: 450, cy: 550 },
    { id: "mumbai", label: "MUMBAI", cx: 300, cy: 850 },
    { id: "nagpur", label: "NAGPUR", cx: 650, cy: 750 },
  ];

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl border border-border/50 bg-surface overflow-hidden shadow-soft flex items-center justify-center">
      {/* Background Grid & Atmosphere */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary),0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_40%,transparent_100%)]" />
      <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-primary/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary/10 rounded-full blur-[80px] mix-blend-screen pointer-events-none" />

      {/* SVG Map Layer */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-primary)" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Abstract Terrain Contours */}
        <path d="M 0,100 Q 150,50 300,150 T 600,100 T 900,200" fill="none" stroke="currentColor" strokeWidth="1" className="text-border/40 opacity-50" />
        <path d="M 0,200 Q 200,100 400,250 T 800,150 T 1000,300" fill="none" stroke="currentColor" strokeWidth="1" className="text-border/30 opacity-50" />
        <path d="M 0,300 Q 250,200 500,350 T 900,250 T 1200,400" fill="none" stroke="currentColor" strokeWidth="1" className="text-border/20 opacity-50" />
        
        {/* Subtle Background Routes */}
        <path d="M 450 550 L 300 850" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="text-border/60" />
        <path d="M 450 550 L 650 750" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="text-border/60" />
        
        {/* Main Highlighted Route (Leh -> Srinagar) */}
        <path 
          id="main-route-path"
          d="M 250 200 Q 500 100 750 300" 
          fill="none" 
          stroke="url(#route-gradient)" 
          strokeWidth="6" 
          strokeLinecap="round"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="motion-safe:animate-[draw-route_3s_ease-out_forwards]"
        />

        {/* Vehicle Marker */}
        <g>
          <circle r="12" fill="var(--color-surface)" stroke="var(--color-primary)" strokeWidth="4" filter="url(#glow)" />
          {/* Signal Ping */}
          <circle r="28" fill="none" stroke="var(--color-primary)" strokeWidth="2" className="opacity-50 motion-safe:animate-ping origin-center" />
          <animateMotion 
            dur="6s" 
            repeatCount="indefinite" 
            path="M 250 200 Q 500 100 750 300"
            calcMode="linear"
          />
        </g>
        
        {/* Network Nodes */}
        <g className="text-primary hover:text-secondary transition-colors cursor-default">
          {nodes.map(node => (
            <g key={node.id}>
              {/* Active nodes have a ping */}
              {(node.id === "leh" || node.id === "srinagar") && (
                <circle cx={node.cx} cy={node.cy} r="24" fill="currentColor" className="opacity-20 motion-safe:animate-ping origin-center" />
              )}
              {/* Core dot */}
              <circle cx={node.cx} cy={node.cy} r={node.id === "leh" || node.id === "srinagar" ? "8" : "6"} fill={node.id === "leh" || node.id === "srinagar" ? "currentColor" : "var(--color-muted-foreground)"} />
              {/* Outer ring */}
              <circle cx={node.cx} cy={node.cy} r={node.id === "leh" || node.id === "srinagar" ? "16" : "12"} fill="none" stroke={node.id === "leh" || node.id === "srinagar" ? "currentColor" : "var(--color-muted-foreground)"} strokeWidth="2" className="opacity-50" />
              {/* Label */}
              <text x={node.cx} y={node.cy - 40} textAnchor="middle" fill="currentColor" className={`font-semibold tracking-widest uppercase ${node.id === "leh" || node.id === "srinagar" ? "text-xl opacity-90" : "text-lg opacity-70"}`}>{node.label}</text>
            </g>
          ))}
        </g>
      </svg>

      {/* Floating Intelligence Card */}
      <MissionStatusCard />
      
      {/* Decorative Label */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col items-end gap-2">
        <Badge variant="outline" className="text-[10px] bg-background/50 backdrop-blur-sm border-border/50 text-muted-foreground">
          LIVE MAP : SECURE
        </Badge>
        <Badge variant="outline" className="text-[10px] bg-background/50 backdrop-blur-sm border-border/50 text-muted-foreground">
          ETA UPDATED
        </Badge>
      </div>
    </div>
  );
}
