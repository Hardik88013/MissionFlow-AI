import { Layout } from "./components/layout/Layout";
import { Container } from "./components/ui/Container";
import { SectionHeading } from "./components/ui/SectionHeading";
import { Button } from "./components/ui/Button";
import { Card } from "./components/ui/Card";
import { GlassCard } from "./components/ui/GlassCard";
import { StatusBadge } from "./components/ui/StatusBadge";
import { useEffect } from "react";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    // Initial theme set to body by the hook
  }, [theme]);

  return (
    <Layout>
      <Container className="py-20">
        <SectionHeading 
          title="Design System Foundation" 
          subtitle="MissionFlow AI Phase 1 Implementation" 
          centered
        />
        
        <div className="grid gap-8 mt-12 md:grid-cols-2">
          {/* Buttons */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </Card>

          {/* Badges */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Status System</h3>
            <div className="flex flex-wrap gap-4">
              <StatusBadge status="success" label="OPERATIONAL" />
              <StatusBadge status="warning" label="DELAYED" />
              <StatusBadge status="danger" label="CRITICAL" />
              <StatusBadge status="info" label="ACTIVE" />
            </div>
          </Card>

          {/* Glass Card */}
          <GlassCard className="p-6 md:col-span-2">
            <h3 className="text-xl font-semibold mb-4">Glass Surface</h3>
            <p className="text-muted-foreground">
              This card uses the glassmorphism design tokens for overlay elements.
            </p>
          </GlassCard>
        </div>
      </Container>
    </Layout>
  );
}

export default App;
