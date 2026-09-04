import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Card } from "../ui/Card";
import { Shield, HeartPulse, Globe2, Siren, Pickaxe, Factory, ArrowRight } from "lucide-react";

export function IndustriesSection() {
  const industries = [
    { 
      id: "defense",
      title: "DEFENSE", 
      description: "Mission-ready logistics intelligence for complex fleet, route, and resource coordination.",
      icon: Shield,
    },
    { 
      id: "disaster",
      title: "DISASTER RESPONSE", 
      description: "Coordinate vehicles, supplies, routes, and changing conditions during emergency response operations.",
      icon: HeartPulse,
    },
    { 
      id: "humanitarian",
      title: "HUMANITARIAN AID", 
      description: "Improve visibility across critical supply movement and distribution networks.",
      icon: Globe2,
    },
    { 
      id: "emergency",
      title: "EMERGENCY SERVICES", 
      description: "Support time-sensitive vehicle and resource coordination across operational networks.",
      icon: Siren,
    },
    { 
      id: "mining",
      title: "MINING", 
      description: "Coordinate fleet movement, routes, resources, and operational logistics across difficult terrain.",
      icon: Pickaxe,
    },
    { 
      id: "industrial",
      title: "INDUSTRIAL LOGISTICS", 
      description: "Optimize complex movement of vehicles, materials, inventory, and resources across industrial networks.",
      icon: Factory,
    }
  ];

  return (
    <section className="py-24 bg-background">
      <Container>
        <div className="mb-16 md:text-center flex flex-col md:items-center max-w-3xl mx-auto">
          <p className="text-label text-primary mb-3">INDUSTRIES</p>
          <SectionHeading 
            title="Built for What Truly Matters." 
            subtitle="From defense operations to disaster response, MissionFlow AI helps organizations coordinate complex movement when timing and resilience matter."
            centered 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry) => {
            const Icon = industry.icon;
            return (
              <Card 
                key={industry.id} 
                className="group relative p-8 bg-surface/50 border-border/40 hover:border-primary/50 hover:shadow-soft transition-all duration-300 overflow-hidden"
              >
                {/* Subtle Background Pattern/Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary),0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">{industry.title}</h3>
                  <p className="text-muted-foreground leading-relaxed flex-grow">{industry.description}</p>
                  
                  <div className="mt-6 flex items-center text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Explore Industry <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
