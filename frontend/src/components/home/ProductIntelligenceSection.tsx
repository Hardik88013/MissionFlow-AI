
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

export function ProductIntelligenceSection() {
  const tabs = ["Overview", "Fleet Intelligence", "Route Optimization", "Inventory", "Real-Time Operations"];

  return (
    <section className="py-24 bg-background">
      <Container>
        <div className="mb-12">
          <p className="text-label text-primary mb-3">PRODUCT INTELLIGENCE</p>
          <SectionHeading 
            title="Intelligence at Every Mile." 
            subtitle="Complete visibility and control across your entire operational footprint."
          />
        </div>

        {/* Placeholder Tabs */}
        <div className="flex overflow-x-auto pb-4 gap-2 mb-8 hide-scrollbar">
          {tabs.map((tab, i) => (
            <button 
              key={tab} 
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                i === 0 ? "bg-primary text-primary-foreground" : "bg-surface-elevated text-muted-foreground hover:text-foreground hover:bg-surface-elevated/80"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Feature Visual Placeholder */}
        <div className="aspect-[16/9] lg:aspect-[21/9] w-full rounded-2xl bg-surface border border-border/50 flex flex-col items-center justify-center p-8 text-center shadow-sm">
          <p className="text-muted-foreground max-w-md">
            [ Product Intelligence Dashboard Placeholder ]
          </p>
        </div>
      </Container>
    </section>
  );
}
