import type { Metric } from "./types";
import { Card } from "../../ui/Card";

interface MetricsRowProps {
  metrics: Metric[];
}

export function MetricsRow({ metrics }: MetricsRowProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => (
        <Card key={idx} className="p-5 bg-surface/50 backdrop-blur-sm border-border/40 hover:border-primary/30 transition-colors">
          <p className="text-3xl font-bold mb-1 text-foreground">
            {metric.value}
          </p>
          <div className="flex items-center gap-2">
            {metric.highlight && (
              <span className={`h-2 w-2 rounded-full ${
                metric.highlight === 'warning' ? 'bg-warning' : 
                metric.highlight === 'danger' ? 'bg-danger' : 
                metric.highlight === 'success' ? 'bg-success' : 'bg-info'
              }`} />
            )}
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              {metric.label}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
