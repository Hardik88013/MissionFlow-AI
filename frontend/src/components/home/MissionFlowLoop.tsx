
import { Container } from "../ui/Container";

export function MissionFlowLoop() {
  const steps = ["OBSERVE", "PREDICT", "SIMULATE", "OPTIMIZE", "ACT", "LEARN"];

  return (
    <section className="py-24 bg-background overflow-hidden border-t border-border/40">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-h3 font-bold">The MissionFlow Operating Loop</h2>
        </div>

        {/* Visual Foundation for Loop */}
        <div className="relative max-w-4xl mx-auto flex flex-wrap justify-center gap-4 md:gap-8">
          {steps.map((step, idx) => (
            <div key={step} className="flex items-center">
              <div className="px-6 py-3 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-semibold tracking-widest backdrop-blur-sm">
                {step}
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden md:block w-8 h-px bg-primary/30 mx-4" />
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
