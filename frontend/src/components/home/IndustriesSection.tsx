import { Container } from "../ui/Container";
import { Shield, AlertTriangle, Heart, Box, ArrowRight } from "lucide-react";

export function IndustriesSection() {
  return (
    <section className="relative w-full py-16 md:py-20 overflow-hidden bg-surface border-y border-border/40">
      {/* Background Image - Mountain Silhouette */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.05] dark:opacity-30 mix-blend-luminosity pointer-events-none"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop')",
          maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 40%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 40%, transparent 100%)"
        }}
      />

      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center">
          
          {/* Left Text Column */}
          <div className="w-full lg:w-[320px] flex-shrink-0">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4 tracking-tight">
              Built for What<br/>Truly Matters.
            </h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed pr-4">
              From forward bases to disaster zones, MissionFlow AI turns data into decisions — ensuring critical supplies reach the right place, at the right time.
            </p>
            <button className="flex items-center gap-2 text-sm font-semibold text-foreground border border-border/60 hover:bg-surface-elevated shadow-sm px-5 py-2.5 rounded-lg transition-colors shadow-sm">
              Learn More <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-32 bg-border/60" />

          {/* Core Grid */}
          <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
            
            {/* Defence */}
            <div className="flex flex-col relative group">
              <Shield className="w-8 h-8 text-[#00A859] dark:text-[#69E0A5] mb-4 stroke-[1.5] transition-transform group-hover:-translate-y-1" />
              <h4 className="text-sm font-bold text-foreground mb-2">Defence</h4>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[140px]">
                Sustaining operational readiness.
              </p>
            </div>

            {/* Disaster Response */}
            <div className="flex flex-col relative group">
              <AlertTriangle className="w-8 h-8 text-[#00A859] dark:text-[#69E0A5] mb-4 stroke-[1.5] transition-transform group-hover:-translate-y-1" />
              <h4 className="text-sm font-bold text-foreground mb-2">Disaster Response</h4>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[140px]">
                Rapid aid, greater reach.
              </p>
            </div>

            {/* Humanitarian Aid */}
            <div className="flex flex-col relative group">
              <Heart className="w-8 h-8 text-[#00A859] dark:text-[#69E0A5] mb-4 stroke-[1.5] transition-transform group-hover:-translate-y-1" />
              <h4 className="text-sm font-bold text-foreground mb-2">Humanitarian Aid</h4>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[140px]">
                People-centric logistics.
              </p>
            </div>

            {/* Strategic Supply Chains */}
            <div className="flex flex-col relative group">
              <Box className="w-8 h-8 text-[#00A859] dark:text-[#69E0A5] mb-4 stroke-[1.5] transition-transform group-hover:-translate-y-1" />
              <h4 className="text-sm font-bold text-foreground mb-2 pr-2">Strategic Supply Chains</h4>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[140px]">
                Resilient, future-ready networks.
              </p>
            </div>

          </div>

          {/* Right Floating Elements (Flag + Text) */}
          <div className="hidden xl:flex flex-col justify-start items-start pt-2 pl-4 flex-shrink-0">
            {/* Tricolor Bar */}
            <div className="flex w-20 h-[3px] mb-4 rounded-sm overflow-hidden">
              <div className="flex-1 bg-[#FF671F]" />
              <div className="flex-1 bg-white" />
              <div className="flex-1 bg-[#046A38]" />
            </div>
            <p className="text-[10px] uppercase font-bold tracking-[0.15em] text-muted-foreground leading-loose">
              ANY MISSION.<br/>A STRONGER INDIA.
            </p>
          </div>

        </div>
      </Container>
    </section>
  );
}

