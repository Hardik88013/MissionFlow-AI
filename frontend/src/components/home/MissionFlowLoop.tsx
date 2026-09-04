import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Eye, LineChart, BrainCircuit, Waypoints, Zap, RefreshCw, ArrowRight } from "lucide-react";

export function MissionFlowLoop() {
  const stages = [
    {
      id: "observe",
      num: "01",
      title: "OBSERVE",
      question: "WHAT IS HAPPENING?",
      desc: "Understand the current mission state.",
      icon: Eye,
      color: "text-info",
      bg: "bg-info/10",
      border: "border-info/30"
    },
    {
      id: "predict",
      num: "02",
      title: "PREDICT",
      question: "WHAT HAPPENS NEXT?",
      desc: "Forecast ETA, health, and risks.",
      icon: LineChart,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/30"
    },
    {
      id: "simulate",
      num: "03",
      title: "SIMULATE",
      question: "WHAT IF?",
      desc: "Evaluate disruptions and options.",
      icon: BrainCircuit,
      color: "text-secondary",
      bg: "bg-secondary/10",
      border: "border-secondary/30"
    },
    {
      id: "optimize",
      num: "04",
      title: "OPTIMIZE",
      question: "WHAT IS THE BEST PLAN?",
      desc: "Generate optimized assignments.",
      icon: Waypoints,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/30"
    },
    {
      id: "act",
      num: "05",
      title: "ACT",
      question: "TAKE ACTION.",
      desc: "Execute the selected plan.",
      icon: Zap,
      color: "text-success",
      bg: "bg-success/10",
      border: "border-success/30"
    },
    {
      id: "learn",
      num: "06",
      title: "LEARN",
      question: "WHAT DID WE LEARN?",
      desc: "Capture outcomes and patterns.",
      icon: RefreshCw,
      color: "text-accent",
      bg: "bg-accent/10",
      border: "border-accent/30"
    }
  ];

  return (
    <section className="py-24 bg-surface-elevated relative overflow-hidden">
      <Container className="relative z-10">
        <div className="mb-16 md:text-center flex flex-col md:items-center max-w-3xl mx-auto">
          <p className="text-label text-primary mb-3">THE MISSIONFLOW LOOP</p>
          <SectionHeading 
            title="Continuous Intelligence. Continuous Adaptation." 
            subtitle="Mission conditions change constantly. MissionFlow AI continuously observes the operation, predicts what comes next, evaluates options, and helps teams adapt."
            centered
          />
        </div>

        {/* Desktop Circular Layout */}
        <div className="hidden lg:flex justify-center items-center relative w-full max-w-[800px] mx-auto aspect-square">
          
          {/* SVG Connecting Ring */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none motion-safe:animate-[spin_40s_linear_infinite]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" fill="none" stroke="var(--color-border)" strokeWidth="0.2" strokeDasharray="1 1" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="var(--color-primary)" strokeWidth="0.4" strokeDasharray="10 90" strokeDashoffset="0" className="opacity-50" />
          </svg>
          
          {/* Center Identity */}
          <div className="absolute z-20 flex flex-col items-center justify-center w-[200px] h-[200px] bg-background rounded-full border border-border shadow-xl">
            <h3 className="text-xl font-bold text-foreground text-center leading-tight mb-2">
              MISSIONFLOW<br />AI
            </h3>
            <p className="text-[9px] font-bold tracking-widest text-primary uppercase text-center">
              Continuous<br />Operational<br />Intelligence
            </p>
          </div>

          {/* Orbit Nodes */}
          {stages.map((stage, i) => {
            // Calculate position around the circle (start at top, go clockwise)
            // -90 degrees offset to start at 12 o'clock
            const angle = (i * 60) - 90;
            const radius = 38; // percentage
            const x = 50 + radius * Math.cos(angle * Math.PI / 180);
            const y = 50 + radius * Math.sin(angle * Math.PI / 180);
            const Icon = stage.icon;

            return (
              <div 
                key={stage.id} 
                className="absolute w-[220px] bg-surface/90 backdrop-blur-sm border border-border/50 rounded-2xl p-4 shadow-soft hover:shadow-lg transition-all duration-300 z-10 hover:scale-105 group"
                style={{ 
                  left: `${x}%`, 
                  top: `${y}%`, 
                  transform: 'translate(-50%, -50%)' 
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${stage.bg} ${stage.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground mr-2">{stage.num}</span>
                    <span className={`text-xs font-bold tracking-wider ${stage.color}`}>{stage.title}</span>
                  </div>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-foreground mb-1">
                  {stage.question}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {stage.desc}
                </p>
                <div className={`absolute inset-0 rounded-2xl border ${stage.border} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
              </div>
            );
          })}
        </div>

        {/* Mobile / Tablet Vertical Layout */}
        <div className="lg:hidden flex flex-col gap-4 max-w-md mx-auto relative">
          {/* Vertical Connecting Line */}
          <div className="absolute left-[39px] top-8 bottom-8 w-[2px] bg-border/40 pointer-events-none" />
          
          {stages.map((stage, i) => {
            const Icon = stage.icon;
            const isLast = i === stages.length - 1;
            
            return (
              <div key={stage.id} className="relative z-10 flex flex-col">
                <div className="bg-background border border-border/50 rounded-2xl p-5 shadow-soft flex gap-4">
                  <div className={`w-10 h-10 shrink-0 rounded-full ${stage.bg} ${stage.color} flex items-center justify-center border ${stage.border} bg-background`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-muted-foreground">{stage.num}</span>
                      <span className={`text-xs font-bold tracking-wider ${stage.color}`}>{stage.title}</span>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                      {stage.question}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {stage.desc}
                    </p>
                  </div>
                </div>
                
                {/* Arrow connecting to next (or looping back) */}
                {!isLast && (
                  <div className="py-2 pl-[35px] text-border/60">
                    <ArrowRight className="w-5 h-5 rotate-90" />
                  </div>
                )}
                {isLast && (
                  <div className="py-4 pl-[35px] flex items-center gap-2 text-primary/60">
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Loop back</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
