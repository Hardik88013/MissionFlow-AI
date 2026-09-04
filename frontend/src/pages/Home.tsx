
import { Layout } from "../components/layout/Layout";
import { Hero } from "../components/home/Hero";

import { LiveMissionNetworkPreview } from "../components/home/LiveMissionNetworkPreview";
import { IndustriesSection } from "../components/home/IndustriesSection";
import { ProductIntelligenceSection } from "../components/home/ProductIntelligenceSection";
import { AIIntelligenceSection } from "../components/home/AIIntelligenceSection";
import { MissionFlowLoop } from "../components/home/MissionFlowLoop";
import { FinalCTA } from "../components/home/FinalCTA";

export function Home() {
  return (
    <Layout>
      <Hero />
      <LiveMissionNetworkPreview />
      <IndustriesSection />
      <ProductIntelligenceSection />
      <AIIntelligenceSection />
      <MissionFlowLoop />
      <FinalCTA />
    </Layout>
  );
}



