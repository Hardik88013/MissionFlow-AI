
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Card } from "../ui/Card";

export function IndustriesSection() {
  const industries = [
    { title: "Defense", description: "Secure, reliable logistics for military operations." },
    { title: "Disaster Response", description: "Rapid resource allocation in critical environments." },
    { title: "Humanitarian Aid", description: "Efficient distribution to areas in need." },
    { title: "Emergency Services", description: "Real-time coordination for first responders." },
    { title: "Mining", description: "Optimized route planning for heavy resource transport." },
    { title: "Industrial Logistics", description: "Supply chain intelligence for complex networks." }
  ];

  return (
    <section className="py-24 bg-surface-elevated border-y border-border/40">
      <Container>
        <div className="mb-16 md:text-center flex flex-col md:items-center">
          <p className="text-label text-primary mb-3">INDUSTRIES</p>
          <SectionHeading 
            title="Built for What Truly Matters." 
            centered 
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry) => (
            <Card key={industry.title} className="p-8 hover:border-primary/50 transition-colors bg-surface">
              <h3 className="text-xl font-bold mb-3">{industry.title}</h3>
              <p className="text-muted-foreground">{industry.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
