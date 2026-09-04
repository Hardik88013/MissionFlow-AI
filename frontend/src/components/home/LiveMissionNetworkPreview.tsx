
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

export function LiveMissionNetworkPreview() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <Container>
        <div className="mb-12">
          <p className="text-label text-primary mb-3">LIVE MISSION NETWORK</p>
          <SectionHeading 
            title="See Every Mission. Understand Every Move." 
            subtitle="Real-time global operational visibility for defense and humanitarian logistics."
          />
        </div>

        {/* Placeholder for Interactive Map */}
        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl border border-border/50 bg-surface-elevated overflow-hidden shadow-soft flex items-center justify-center">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,transparent,black)]" />
          
          <div className="text-center p-6 relative z-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
              </span>
              <span className="text-sm font-medium text-foreground tracking-widest uppercase">System Online</span>
            </div>
            <p className="text-muted-foreground">
              [ Interactive Mission Map Placeholder ]
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
