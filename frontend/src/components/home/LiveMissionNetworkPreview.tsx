import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { MetricsRow } from "./network/MetricsRow";
import { NetworkMap } from "./network/NetworkMap";
import { ActivityFeed } from "./network/ActivityFeed";
import type { Metric, ActivityItemType } from "./network/types";

export function LiveMissionNetworkPreview() {
  const metrics: Metric[] = [
    { label: "ACTIVE CONVOYS", value: "28" },
    { label: "TOTAL VEHICLES", value: "412" },
    { label: "IN TRANSIT", value: "6" },
    { label: "ALERTS", value: "2", highlight: "warning" },
  ];

  const activities: ActivityItemType[] = [
    { id: 1, type: "ROUTE OPTIMIZED", title: "TRK-02 route updated", time: "2 min ago", status: "success" },
    { id: 2, type: "VEHICLE HEALTH", title: "TRK-17 health check completed", time: "8 min ago", status: "info" },
    { id: 3, type: "MISSION STARTED", title: "Convoy MF-204 departed Leh", time: "14 min ago", status: "info" },
    { id: 4, type: "ALERT", title: "TRK-09 requires attention", time: "21 min ago", status: "warning" },
  ];

  return (
    <section className="py-24 bg-surface-elevated relative overflow-hidden border-y border-border/40">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent pointer-events-none opacity-50" />
      
      <Container className="relative z-10">
        <div className="mb-12">
          <p className="text-label text-primary mb-3">LIVE MISSION NETWORK</p>
          <SectionHeading 
            title="See Every Mission. Understand Every Move." 
            subtitle="MissionFlow AI brings vehicles, routes, mission status, and operational intelligence into one connected view."
          />
        </div>

        <div className="flex flex-col gap-6">
          {/* Top Metrics */}
          <MetricsRow metrics={metrics} />

          {/* Main Dashboard Layout */}
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left/Main: Map Visual */}
            <div className="lg:col-span-8 w-full">
              <NetworkMap />
            </div>

            {/* Right: Activity Feed */}
            <div className="lg:col-span-4 w-full h-[300px] lg:h-[600px]">
              <ActivityFeed activities={activities} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
