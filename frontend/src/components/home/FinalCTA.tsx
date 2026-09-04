import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative py-32 overflow-hidden bg-background border-t border-border/40">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.1)_0%,transparent_70%)] pointer-events-none" />
      
      {/* Background visual motif */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-30 dark:opacity-20">
        <svg className="w-full h-full max-w-5xl" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid slice">
          <path d="M -100 200 Q 250 50 500 200 T 1100 200" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="10 10" />
          <path d="M 100 300 Q 450 150 700 300 T 1200 300" fill="none" stroke="var(--color-secondary)" strokeWidth="1" strokeDasharray="5 5" />
          <circle cx="500" cy="200" r="4" fill="var(--color-primary)" />
          <circle cx="700" cy="300" r="3" fill="var(--color-secondary)" />
        </svg>
      </div>

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <p className="text-label text-primary mb-6">READY FOR THE MISSION AHEAD?</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            TURN COMPLEX LOGISTICS<br className="hidden md:block"/> INTO INTELLIGENT,<br className="hidden md:block"/> COORDINATED ACTION.
          </h2>
          <p className="text-body-large text-muted-foreground mb-10 max-w-2xl mx-auto">
            Bring missions, vehicles, routes, resources, and operational intelligence into one connected decision environment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-primary/20">
              REQUEST DEMO <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-background/50 backdrop-blur-sm">
              EXPLORE PLATFORM
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
