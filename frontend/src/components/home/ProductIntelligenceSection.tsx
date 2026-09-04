import { useState } from "react";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { PRODUCT_TABS } from "./product/types";
import type { ProductTab } from "./product/types";
import { OverviewView } from "./product/OverviewView";
import { FleetIntelligenceView } from "./product/FleetIntelligenceView";
import { RouteOptimizationView } from "./product/RouteOptimizationView";
import { InventoryView } from "./product/InventoryView";
import { RealTimeOperationsView } from "./product/RealTimeOperationsView";

export function ProductIntelligenceSection() {
  const [activeTab, setActiveTab] = useState<ProductTab>("OVERVIEW");

  const renderActiveView = () => {
    switch (activeTab) {
      case "OVERVIEW": return <OverviewView />;
      case "FLEET_INTELLIGENCE": return <FleetIntelligenceView />;
      case "ROUTE_OPTIMIZATION": return <RouteOptimizationView />;
      case "INVENTORY": return <InventoryView />;
      case "REAL_TIME_OPERATIONS": return <RealTimeOperationsView />;
      default: return <OverviewView />;
    }
  };

  return (
    <section className="py-24 bg-surface relative overflow-hidden">
      <Container className="relative z-10">
        <div className="mb-12 md:text-center flex flex-col md:items-center max-w-3xl mx-auto">
          <p className="text-label text-primary mb-3">PRODUCT INTELLIGENCE</p>
          <SectionHeading 
            title="Intelligence at Every Mile." 
            subtitle="MissionFlow AI connects fleet health, routes, inventory, and live operations into one intelligent operational view."
            centered
          />
        </div>

        {/* Product UI Container */}
        <div className="flex flex-col xl:flex-row gap-8 bg-background border border-border/50 rounded-2xl p-4 sm:p-6 shadow-xl">
          
          {/* Left: Tab Navigation */}
          <div 
            role="tablist" 
            aria-label="Product features"
            className="flex xl:flex-col overflow-x-auto xl:overflow-x-visible pb-2 xl:pb-0 gap-2 xl:w-64 shrink-0 hide-scrollbar"
          >
            {PRODUCT_TABS.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap xl:whitespace-normal text-left px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === tab.id 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "bg-surface text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right: Active View Panel */}
          <div 
            role="tabpanel"
            className="flex-1 bg-surface-elevated/30 rounded-xl border border-border/40 min-h-[400px] overflow-hidden relative"
          >
            {/* Subtle background mesh */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.05)_0%,transparent_100%)] pointer-events-none" />
            
            {renderActiveView()}
          </div>
        </div>
      </Container>
    </section>
  );
}
