
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center pt-16 pb-24 overflow-hidden border-b border-border/40">
      {/* Background Decorative Effects */}
      <div className="absolute inset-0 bg-background/80 z-0">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* LEFT: Text Content */}
          <div className="flex flex-col gap-6 max-w-2xl">
            <div className="inline-flex">
              <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
                MISSION-CRITICAL INTELLIGENCE
              </span>
            </div>
            
            <h1 className="text-display">
              Smarter Logistics for a <span className="text-primary">Stronger Mission.</span>
            </h1>
            
            <p className="text-body-large max-w-xl">
              AI-powered logistics intelligence for defense, disaster response, 
              humanitarian aid, and other mission-critical operations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="primary" size="lg">Request Demo</Button>
              <Button variant="outline" size="lg" className="border-border bg-surface hover:bg-muted">Explore Platform</Button>
            </div>
          </div>

          {/* RIGHT: Visual Placeholder */}
          <div className="relative aspect-square lg:aspect-[4/3] w-full rounded-xl border border-border/50 bg-surface-elevated/50 backdrop-blur-sm overflow-hidden flex items-center justify-center shadow-soft">
            <div className="absolute inset-0 bg-[url('/favicon.svg')] bg-center bg-no-repeat opacity-5 scale-150" />
            
            <div className="text-center p-6 relative z-10">
              <p className="text-label text-muted-foreground tracking-widest mb-2">MISSION CONTROL PREVIEW</p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                [ Network Nodes & Operational Intelligence Visualisation placeholder ]
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
