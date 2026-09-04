
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";

export function FinalCTA() {
  return (
    <section className="py-24 md:py-32 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:10px_10px]" />
      
      <Container className="relative z-10 text-center flex flex-col items-center">
        <h2 className="text-display mb-6">Ready for the Mission Ahead?</h2>
        <p className="text-xl opacity-90 max-w-2xl mb-10">
          Turn complex logistics into intelligent, coordinated action.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
            Request Demo
          </Button>
          <Button variant="outline" size="lg" className="border-white/30 hover:bg-white/10 text-white">
            Explore Platform
          </Button>
        </div>
      </Container>
    </section>
  );
}
