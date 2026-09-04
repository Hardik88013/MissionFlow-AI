
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

export function AIIntelligenceSection() {
  const capabilities = [
    { name: "PREDICT", desc: "Anticipate disruptions before they happen." },
    { name: "OPTIMIZE", desc: "Route and resource efficiency at scale." },
    { name: "SIMULATE", desc: "Test scenarios in a secure digital twin." },
    { name: "RECOVER", desc: "Automated contingency planning." },
  ];

  return (
    <section className="py-24 bg-surface relative">
      <Container>
        <div className="text-center flex flex-col items-center mb-16">
          <p className="text-label text-primary mb-3">AI INTELLIGENCE</p>
          <SectionHeading 
            title="From Data to Decision." 
            centered 
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {capabilities.map((cap) => (
            <div key={cap.name} className="flex flex-col items-center text-center p-6 border border-border/40 rounded-xl bg-background">
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6 font-bold text-lg">
                {cap.name.charAt(0)}
              </div>
              <h4 className="text-lg font-bold mb-2 tracking-wide">{cap.name}</h4>
              <p className="text-sm text-muted-foreground">{cap.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
