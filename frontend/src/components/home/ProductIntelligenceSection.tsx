import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { 
  Car, Activity, Battery, User, FileText, 
  MapPin, TrendingUp, Clock, CheckCircle2, ArrowRight, Box } from "lucide-react";

export function ProductIntelligenceSection() {
  const tabs = ["Overview", "Fleet Intelligence", "Route Optimization", "Inventory", "Real-Time Operations"];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <Container>
        {/* Top Header Grid */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
          <div className="max-w-xl">
            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-4">
              Product
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight mb-6">
              Intelligence<br/>
              <span className="text-[#00A859] dark:text-[#69E0A5]">at Every Mile.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Real-time data. Predictive insights. Smarter decisions.<br/>
              MissionFlow AI keeps your operations ahead of the unexpected.
            </p>
          </div>

          {/* Quote Block */}
          <div className="lg:w-1/3 flex flex-col justify-start lg:mt-12">
            <p className="text-xl md:text-2xl font-medium text-foreground/90 italic leading-relaxed mb-4">
              "From data to delivery -<br/>a more prepared tomorrow."
            </p>
            <div className="flex w-24 h-1 rounded-full overflow-hidden opacity-80">
              <div className="flex-1 bg-[#FF671F]" />
              <div className="flex-1 bg-white" />
              <div className="flex-1 bg-[#046A38]" />
            </div>
          </div>
        </div>

        {/* Tabs - Mobile Scrollable */}
        <div className="flex overflow-x-auto hide-scrollbar border-b border-border/50 mb-10 pb-px [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-8 min-w-max px-2">
            {tabs.map((tab, idx) => (
              <button 
                key={tab}
                className={`pb-4 text-sm font-semibold transition-colors relative whitespace-nowrap ${idx === 0 ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"}`}
              >
                {tab}
                {idx === 0 && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#00A859] rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Dashboard Card */}
        <div className="bg-surface rounded-2xl border border-border/60 shadow-xl overflow-hidden flex flex-col lg:flex-row">
          
          {/* Left Sidebar */}
          <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-border/50 flex flex-col bg-surface/50">
            <div className="p-6 border-b border-border/50 flex justify-between items-center">
              <h3 className="font-bold text-foreground">TRK-02</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00A859] bg-[#00A859]/10 px-2 py-1 rounded-sm">
                On Route
              </span>
            </div>
            
            {/* Sidebar Links - horizontally scrollable on mobile */}
            <div className="p-4 flex flex-row lg:flex-col gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-surface-elevated font-medium transition-colors">
                <Car className="w-4 h-4" /> Vehicle Details
              </button>
              <button className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm bg-primary/10 text-primary dark:text-[#69E0A5] font-semibold transition-colors">
                <MapPin className="w-4 h-4" /> Live Tracking
              </button>
              <button className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-surface-elevated font-medium transition-colors">
                <Activity className="w-4 h-4" /> Health & Diagnostics
              </button>
              <button className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-surface-elevated font-medium transition-colors">
                <Battery className="w-4 h-4" /> Fuel & Efficiency
              </button>
              <button className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-surface-elevated font-medium transition-colors">
                <User className="w-4 h-4" /> Driver Info
              </button>
              <button className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-surface-elevated font-medium transition-colors">
                <FileText className="w-4 h-4" /> Documents
              </button>
            </div>
          </div>

          {/* Center Map Area */}
          <div className="flex-1 relative min-h-[350px] lg:min-h-[500px] bg-[#1a1f2b]">
            <div className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-luminosity" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')" }} />
            
            {/* Overlay UI */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              <div className="bg-surface/90 backdrop-blur-md p-3 rounded-lg shadow-sm border border-border/40 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#00A859] mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-foreground">TRK-02 Leh → Srinagar</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">ETA: 2h 14m • 358 km</p>
                </div>
              </div>

              <div className="bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-border/40 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00A859] animate-pulse" />
                <span className="text-xs font-bold text-foreground">Live</span>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute bottom-4 left-4 flex flex-col bg-surface/90 backdrop-blur-md rounded-lg shadow-sm border border-border/40">
              <button className="p-2 border-b border-border/40 hover:bg-surface-elevated text-foreground font-bold">+</button>
              <button className="p-2 hover:bg-surface-elevated text-foreground font-bold">-</button>
            </div>

            <div className="absolute bottom-4 right-4">
              <button className="bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-foreground border border-border/40 hover:bg-surface-elevated">
                Terrain v
              </button>
            </div>

            {/* Route SVG Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 30,70 Q 50,50 70,30" fill="none" stroke="#00A859" strokeWidth="0.8" strokeDasharray="2 2" className="opacity-50" />
              <path d="M 30,70 Q 40,60 50,50" fill="none" stroke="#00A859" strokeWidth="1" />
              
              <circle cx="30" cy="70" r="1.5" fill="white" stroke="#00A859" strokeWidth="0.5" />
              <circle cx="70" cy="30" r="1.5" fill="white" stroke="#00A859" strokeWidth="0.5" />
              
              <g transform="translate(50, 50)">
                <circle cx="0" cy="0" r="2" fill="#00A859" />
                <circle cx="0" cy="0" r="3.5" fill="none" stroke="#00A859" strokeWidth="0.5" className="animate-ping" />
              </g>
            </svg>
            <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(10px, 10px)' }}>
              <div className="bg-surface/90 backdrop-blur-md px-2 py-1 rounded shadow-sm border border-border/40 text-[10px] font-bold text-foreground">
                TRK-02<br/>
                <span className="text-muted-foreground font-normal">92 km/h</span>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Live Details */}
          <div className="w-full lg:w-80 bg-surface flex flex-col">
            <div className="p-5 border-b border-border/50 flex justify-between items-center">
              <h3 className="font-bold text-foreground text-sm">Live Details</h3>
              <span className="text-[10px] text-muted-foreground">Updated 2 mins ago</span>
            </div>

            <div className="p-5 flex-1 flex flex-col gap-6">
              {/* Distance */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-semibold text-muted-foreground">Distance Covered</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-foreground">266 km / 358 km</span>
                    <span className="text-[10px] font-bold ml-2 text-foreground">74%</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                  <div className="h-full bg-[#00A859] rounded-full" style={{ width: '74%' }} />
                </div>
              </div>

              {/* ETA / Speed Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">ETA</span>
                  <span className="text-sm font-bold text-foreground">2h 14m</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Current Speed</span>
                  <span className="text-sm font-bold text-foreground">92 km/h</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Fuel Level</span>
                  <span className="text-sm font-bold text-foreground">67%</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Vehicle Health</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">92%</span>
                    <div className="flex-1 h-1 bg-surface-elevated rounded-full overflow-hidden">
                      <div className="h-full bg-[#00A859]" style={{ width: '92%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-border/50" />

              {/* Route Updates */}
              <div>
                <h4 className="text-xs font-bold text-foreground mb-4">Route Updates</h4>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#00A859] mt-0.5 shrink-0" />
                    <div className="flex-1 flex justify-between items-start">
                      <div>
                        <p className="text-xs font-medium text-foreground">Left Leh</p>
                        <p className="text-[10px] text-muted-foreground">10:24</p>
                      </div>
                      <span className="text-[10px] font-bold text-[#00A859]">On time</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#00A859] mt-0.5 shrink-0" />
                    <div className="flex-1 flex justify-between items-start">
                      <div>
                        <p className="text-xs font-medium text-foreground">Crossed Zoji La</p>
                        <p className="text-[10px] text-muted-foreground">12:17</p>
                      </div>
                      <span className="text-[10px] font-bold text-[#00A859]">On time</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[#F5A623]" />
                    </div>
                    <div className="flex-1 flex justify-between items-start">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Expected Srinagar</p>
                        <p className="text-[10px] text-muted-foreground">14:38</p>
                      </div>
                      <span className="text-[10px] font-bold text-[#F5A623]">2h 14m</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Footer Metrics */}
        <div className="mt-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 border border-border/40 bg-surface rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between xl:w-1/3 w-full gap-4">
            <div>
              <h3 className="text-base md:text-lg font-bold text-foreground">AI That Anticipates.</h3>
              <h3 className="text-base md:text-lg font-bold text-foreground">So You Stay Ahead.</h3>
            </div>
            <Button variant="outline" size="sm" className="whitespace-nowrap bg-background hover:bg-surface-elevated font-semibold text-xs border-border/60">
              See How It Works <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground xl:w-1/3 max-w-sm hidden md:block">
            Our AI models analyze terrain, weather, vehicle health, and operational demand to predict risks, optimize routes, and ensure uninterrupted missions.
          </p>

          <div className="flex flex-wrap sm:flex-nowrap w-full xl:w-auto items-center gap-6 xl:gap-8 justify-between xl:justify-end divide-x divide-transparent sm:divide-border/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#00A859]" />
              </div>
              <div>
                <span className="text-base font-bold text-foreground block">60%</span>
                <span className="text-[10px] uppercase text-muted-foreground font-semibold">Fewer Delays</span>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:pl-6 xl:pl-8">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Box className="w-4 h-4 text-[#00A859]" />
              </div>
              <div>
                <span className="text-base font-bold text-foreground block">35%</span>
                <span className="text-[10px] uppercase text-muted-foreground font-semibold">Better Asset Utilization</span>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:pl-6 xl:pl-8 mt-4 sm:mt-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#00A859]" />
              </div>
              <div>
                <span className="text-base font-bold text-foreground block">50%</span>
                <span className="text-[10px] uppercase text-muted-foreground font-semibold">Faster Decision-Making</span>
              </div>
            </div>
          </div>
        </div>

      </Container>
    </section>
  );
}




