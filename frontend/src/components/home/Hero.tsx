import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { ArrowRight, PlayCircle, Clock, Layers, Zap, Shield } from "lucide-react";

export function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] pt-20 flex flex-col bg-background overflow-hidden">
      
      {/* Background Image with Fade */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {/* We use an arbitrary mountain road placeholder to mimic the mockup */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1549887552-cb1cb71ae0f1—q=80&w=2070&auto=format&fit=crop')",
            maskImage: "linear-gradient(to right, transparent 0%, transparent 35%, black 65%, black 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, transparent 35%, black 65%, black 100%)"
          }}
        />
        {/* Subtle overlay to ensure text readability if it bleeds */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent w-full md:w-3/5" />
      </div>

      {/* Floating Elements (Top Right) */}
      <div className="hidden lg:block absolute top-32 right-32 z-10 pointer-events-none">
        <div className="text-right">
          <p className="font-[cursive] text-3xl text-foreground/80 leading-relaxed italic transform -rotate-3 mb-8 drop-shadow-md">
            Missions<br/>People<br/>A Stronger<br/>Tomorrow.
          </p>
          
          <div className="flex justify-end items-start gap-4">
            <div className="flex flex-col items-center">
              {/* Simple Indian Flag representation */}
              <div className="w-12 h-8 flex flex-col shadow-sm mb-4 border border-black/10">
                <div className="w-full h-1/3 bg-[#FF671F]" />
                <div className="w-full h-1/3 bg-background flex justify-center items-center">
                  <div className="w-2 h-2 rounded-full border border-[#06038D]" />
                </div>
                <div className="w-full h-1/3 bg-[#046A38]" />
              </div>
              <div className="w-0.5 h-16 bg-gradient-to-b from-border to-transparent" />
            </div>
            
            <div className="flex flex-col gap-4 text-right">
              <p className="text-[10px] font-bold tracking-widest text-foreground/70 text-right leading-loose">
                PEOPLE.<br/>SUPPLIES.<br/>READINESS.<br/>ALWAYS.
              </p>
              <div className="bg-black/60 backdrop-blur-sm border border-white/10 px-4 py-6 mt-4 inline-block">
                <p className="text-white/90 text-sm font-bold tracking-[0.2em] leading-loose">
                  A SAFER<br/>STRONGER<br/>INDIA
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Container className="relative z-10 flex-1 flex flex-col justify-center pb-32 mt-12 lg:mt-0">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <p className="text-[10px] sm:text-xs font-bold tracking-widest text-muted-foreground uppercase mb-6 flex items-center gap-2">
            Defence <span className="text-border">|</span> Disaster Response <span className="text-border">|</span> Humanitarian Aid
          </p>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-bold text-foreground leading-[1.05] tracking-tight mb-8">
            Smarter<br/>
            Logistics for a<br/>
            Stronger <span className="text-[#FF671F]">India.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-foreground/80 mb-10 max-w-lg leading-relaxed">
            AI-powered logistics that move people, supplies and support — faster, safer and more efficiently.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button className="w-full sm:w-auto bg-[#00A859] hover:bg-[#008f4c] text-white shadow-lg shadow-green-500/20 rounded-md font-bold px-8 h-12 text-base">
              Request Demo <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" className="w-full sm:w-auto bg-background hover:bg-surface-elevated text-foreground border-border/60 rounded-md font-bold px-6 h-12 text-base shadow-sm">
              <PlayCircle className="w-5 h-5 mr-2" /> Watch Video
            </Button>
          </div>
        </div>
      </Container>

      {/* Metrics Bar */}
      <div className="relative z-20 w-full mt-auto bg-background/90 backdrop-blur-md border-t border-border/40 py-6">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-x divide-transparent md:divide-border/30">
            {/* Metric 1 */}
            <div className="flex items-center gap-4 px-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#00A859]" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground leading-none mb-1">99.2%</p>
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">On-Time Deliveries</p>
              </div>
            </div>
            
            {/* Metric 2 */}
            <div className="flex items-center gap-4 px-2 md:px-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 text-[#00A859]" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground leading-none mb-1">40%</p>
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Lower Operational Costs</p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="flex items-center gap-4 px-2 md:px-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-[#00A859]" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground leading-none mb-1">3x</p>
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Faster Response</p>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="flex items-center gap-4 px-2 md:px-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-[#00A859]" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground leading-none mb-1">100%</p>
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Mission Focused</p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}


