import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Card } from "../ui/Card";
import { ArrowRight, BrainCircuit, LineChart, Waypoints, ShieldAlert, CheckCircle2, UserCheck, Play } from "lucide-react";

export function AIIntelligenceSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden border-y border-border/40">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--primary),0.05)_0%,transparent_70%)] pointer-events-none" />

      <Container className="relative z-10">
        <div className="mb-16 md:text-center flex flex-col md:items-center max-w-3xl mx-auto">
          <p className="text-label text-primary mb-3">AI INTELLIGENCE</p>
          <SectionHeading 
            title="From Data to Decision." 
            subtitle="MissionFlow AI combines prediction, optimization, simulation, and operational intelligence to help teams make better decisions as missions evolve."
            centered
          />
        </div>

        {/* Small Data Flow Indicator */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-16 text-[10px] sm:text-xs font-bold tracking-widest text-muted-foreground">
          <span className="bg-surface px-3 py-1.5 rounded-full border border-border/50">DATA</span>
          <ArrowRight className="w-3 h-3 text-primary/50" />
          <span className="bg-surface px-3 py-1.5 rounded-full border border-border/50 text-primary">PREDICTION</span>
          <ArrowRight className="w-3 h-3 text-primary/50" />
          <span className="bg-surface px-3 py-1.5 rounded-full border border-border/50 text-secondary">SIMULATION</span>
          <ArrowRight className="w-3 h-3 text-primary/50" />
          <span className="bg-surface px-3 py-1.5 rounded-full border border-border/50 text-primary">OPTIMIZATION</span>
          <ArrowRight className="w-3 h-3 text-primary/50" />
          <span className="bg-surface px-3 py-1.5 rounded-full border border-border/50 text-success">RECOMMENDATION</span>
        </div>

        {/* Desktop Visual Diagram Area */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* Connector SVG Background (Hidden on mobile) */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none">
            <svg className="w-full h-full" style={{ minHeight: '600px' }}>
              <defs>
                <linearGradient id="line-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              {/* Vertical drops from top 3 to center Recover */}
              <path d="M 16.6% 250 C 16.6% 350, 50% 300, 50% 400" fill="none" stroke="url(#line-grad)" strokeWidth="2" strokeDasharray="4 4" className="motion-safe:animate-pulse" />
              <path d="M 50% 250 L 50% 400" fill="none" stroke="url(#line-grad)" strokeWidth="2" strokeDasharray="4 4" className="motion-safe:animate-pulse" />
              <path d="M 83.3% 250 C 83.3% 350, 50% 300, 50% 400" fill="none" stroke="url(#line-grad)" strokeWidth="2" strokeDasharray="4 4" className="motion-safe:animate-pulse" />
              
              {/* Drop from Recover to Decision */}
              <path d="M 50% 550 L 50% 650" fill="none" stroke="var(--color-success)" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 mb-6">
            {/* PREDICT */}
            <Card className="relative p-6 bg-surface/80 backdrop-blur-sm border-primary/20 z-10 flex flex-col h-full hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <LineChart className="w-5 h-5" />
                </div>
                <h3 className="font-bold tracking-tight text-lg text-foreground">PREDICT</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Anticipate what happens next across missions, vehicles, routes, and resources.
              </p>
              <div className="mt-auto bg-background p-4 rounded-xl border border-border/40 text-center">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">ETA</span>
                  <span className="text-sm font-semibold text-foreground">2h 14m</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">VEHICLE HEALTH</span>
                  <span className="text-sm font-semibold text-foreground">92%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">FUEL</span>
                  <span className="text-sm font-semibold text-foreground">67%</span>
                </div>
              </div>
            </Card>

            {/* OPTIMIZE */}
            <Card className="relative p-6 bg-surface/80 backdrop-blur-sm border-primary/20 z-10 flex flex-col h-full hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <Waypoints className="w-5 h-5" />
                </div>
                <h3 className="font-bold tracking-tight text-lg text-foreground">OPTIMIZE</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Evaluate routes, vehicles, and resources to find better operational plans.
              </p>
              <div className="mt-auto bg-background p-4 rounded-xl border border-border/40">
                <div className="flex justify-between items-center text-xs mb-3">
                  <span className="text-muted-foreground">CURRENT</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  <span className="text-success font-bold">OPTIMIZED</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">ETA</span>
                  <span className="text-sm font-semibold text-foreground">1h 45m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">ROUTE</span>
                  <span className="text-sm font-semibold text-success">UPDATED</span>
                </div>
              </div>
            </Card>

            {/* SIMULATE */}
            <Card className="relative p-6 bg-surface/80 backdrop-blur-sm border-secondary/20 z-10 flex flex-col h-full hover:border-secondary/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <h3 className="font-bold tracking-tight text-lg text-foreground">SIMULATE</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Explore possible disruptions and evaluate recovery options before committing.
              </p>
              <div className="mt-auto bg-background p-4 rounded-xl border border-border/40 text-center flex flex-col items-center">
                <span className="text-[10px] font-bold tracking-wider text-muted-foreground">DISRUPTION</span>
                <div className="w-[1px] h-3 bg-border/50 my-1" />
                <span className="text-[10px] font-bold tracking-wider text-secondary">3 OPTIONS</span>
                <div className="w-[1px] h-3 bg-border/50 my-1" />
                <span className="text-xs font-semibold text-foreground">SIMULATED OUTCOME</span>
              </div>
            </Card>
          </div>

          {/* RECOVER (Centered Bottom in LG) */}
          <div className="flex justify-center mb-6 lg:mt-12 z-10 relative">
            <Card className="w-full lg:w-2/3 p-6 bg-surface-elevated border-primary/30 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
              <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-danger/10 text-danger rounded-lg">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold tracking-tight text-xl text-foreground">RECOVER</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When conditions change, generate and rank recovery options so operators can respond with confidence.
                  </p>
                </div>
                <div className="flex-1 w-full bg-background p-4 rounded-xl border border-border/40 flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-2 w-2 rounded-full bg-danger animate-pulse" />
                    <span className="text-[10px] font-bold tracking-wider text-danger uppercase">Alert Detected</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-muted-foreground rotate-90 my-1" />
                  <span className="text-[10px] font-bold tracking-wider text-primary uppercase">3 Recovery Options</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground rotate-90 my-1" />
                  <span className="text-xs font-semibold text-success uppercase tracking-wide">AI Recommendation</span>
                </div>
              </div>
            </Card>
          </div>

          {/* HUMAN IN THE LOOP */}
          <div className="flex justify-center z-10 relative lg:mt-12">
            <div className="bg-surface/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-success/30 shadow-soft w-full lg:w-3/4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-primary">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-wider uppercase mb-0.5">AI Recommends</p>
                    <p className="text-[10px] text-muted-foreground">Systems analyze and propose.</p>
                  </div>
                </div>

                <div className="hidden md:flex flex-1 h-[1px] bg-gradient-to-r from-primary/30 via-success/30 to-success/30 mx-4 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                    <ArrowRight className="w-4 h-4 text-success" />
                  </div>
                </div>
                <ArrowRight className="md:hidden w-4 h-4 text-muted-foreground rotate-90" />

                <div className="flex items-center gap-3 text-success">
                  <div className="p-2 bg-success/10 rounded-full">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-wider uppercase mb-0.5">Operators Decide</p>
                    <p className="text-[10px] text-success/70">Human approval is required.</p>
                  </div>
                </div>

                <div className="hidden md:flex flex-1 h-[1px] bg-gradient-to-r from-success/30 to-foreground/30 mx-4 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                    <ArrowRight className="w-4 h-4 text-foreground/50" />
                  </div>
                </div>
                <ArrowRight className="md:hidden w-4 h-4 text-muted-foreground rotate-90" />

                <div className="flex items-center gap-3 text-foreground">
                  <div className="p-2 bg-foreground/10 rounded-full">
                    <Play className="w-4 h-4" fill="currentColor" />
                  </div>
                  <p className="text-xs font-bold tracking-wider uppercase">Execute</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </Container>
    </section>
  );
}
