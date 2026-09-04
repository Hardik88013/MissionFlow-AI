
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { StatusBadge } from "../ui/StatusBadge";
import { MissionMapVisual } from "./hero/MissionMapVisual";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-32 overflow-hidden border-b border-border/40">
      {/* Background Decorative Effects */}
      <div className="absolute inset-0 bg-background/80 z-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* LEFT: Text Content */}
          <div className="flex flex-col gap-6 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <div className="inline-flex justify-center lg:justify-start">
              <StatusBadge status="info" label="MISSION-CRITICAL LOGISTICS INTELLIGENCE" className="border-primary/20 bg-primary/10 text-primary" />
            </div>
            
            <h1 className="text-display">
              SMARTER LOGISTICS<br className="hidden sm:block" />
              <span className="text-primary opacity-90"> FOR A STRONGER MISSION.</span>
            </h1>
            
            <p className="text-body-large max-w-xl mx-auto lg:mx-0">
              AI-powered logistics intelligence for defense, disaster response, 
              humanitarian aid, and mission-critical operations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Button variant="primary" size="lg">REQUEST DEMO</Button>
              <Button variant="outline" size="lg">EXPLORE PLATFORM</Button>
            </div>
          </div>

          {/* RIGHT: Visual */}
          <div className="w-full mt-8 lg:mt-0">
            <MissionMapVisual />
          </div>
        </div>
      </Container>
      
      {/* Visual Transition to Next Section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface to-transparent z-10 pointer-events-none" />
    </section>
  );
}
