import { Container } from "../ui/Container";
import { Shield, AlertTriangle, Heart, Box, ArrowRight } from "lucide-react";

export function IndustriesSection() {
  return (
    <section className="pb-24 pt-8 bg-surface relative overflow-hidden">
      <Container>
        <div className="flex flex-col xl:flex-row items-center justify-between bg-white rounded-2xl border border-border/50 shadow-sm p-8 gap-8">
          
          <div className="flex-shrink-0 max-w-sm">
            <h2 className="text-3xl font-bold text-foreground leading-tight mb-4">
              Built for What<br/>Truly Matters.
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              From forward bases to disaster zones, MissionFlow AI turns data into decisions — ensuring critical supplies reach the right place, at the right time.
            </p>
            <button className="flex items-center gap-2 text-sm font-bold text-foreground border border-border/60 hover:bg-surface-elevated px-4 py-2 rounded-lg transition-colors shadow-sm">
              Learn More <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1 w-full xl:pl-12 xl:border-l xl:border-border/40 relative">
            {/* Background Line Connector for Visual */}
            <div className="hidden md:block absolute top-10 left-12 right-12 h-px bg-border/40 -z-10" />

            {/* Defence */}
            <div className="flex flex-col bg-white">
              <div className="w-10 h-10 rounded bg-[#00A859]/10 text-[#00A859] flex items-center justify-center mb-4 border border-[#00A859]/20 shadow-sm">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-1">Defence</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Sustaining operational readiness.</p>
            </div>

            {/* Disaster Response */}
            <div className="flex flex-col bg-white">
              <div className="w-10 h-10 rounded bg-[#00A859]/10 text-[#00A859] flex items-center justify-center mb-4 border border-[#00A859]/20 shadow-sm">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-1">Disaster Response</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Rapid aid, greater reach.</p>
            </div>

            {/* Humanitarian Aid */}
            <div className="flex flex-col bg-white">
              <div className="w-10 h-10 rounded bg-[#00A859]/10 text-[#00A859] flex items-center justify-center mb-4 border border-[#00A859]/20 shadow-sm">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-1">Humanitarian Aid</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">People-centric logistics.</p>
            </div>

            {/* Strategic Supply Chains */}
            <div className="flex flex-col bg-white">
              <div className="w-10 h-10 rounded bg-[#00A859]/10 text-[#00A859] flex items-center justify-center mb-4 border border-[#00A859]/20 shadow-sm">
                <Box className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-1">Strategic Supply Chains</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Resilient, future-ready networks.</p>
            </div>
            
          </div>
          
          <div className="hidden xl:flex flex-col justify-center items-end border-l border-border/40 pl-8 shrink-0">
            <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-border to-transparent mb-2" />
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground text-right leading-loose">
              ANY MISSION.<br/>A STRONGER INDIA.
            </p>
          </div>

        </div>
      </Container>
    </section>
  );
}
