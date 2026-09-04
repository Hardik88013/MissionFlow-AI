
import { Container } from "../ui/Container";

export function MetricsSection() {
  const metrics = [
    { value: "28+", label: "Active Convoys" },
    { value: "412", label: "Vehicles" },
    { value: "6", label: "Missions In Transit" },
    { value: "99.2%", label: "Operational Readiness" },
  ];

  return (
    <section className="py-16 md:py-24 bg-surface">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {metrics.map((metric, idx) => (
            <div key={idx} className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {metric.value}
              </span>
              <span className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wider">
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
