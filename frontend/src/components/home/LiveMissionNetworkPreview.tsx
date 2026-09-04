import { Container } from "../ui/Container";

import { 
  Map as MapIcon, Truck, Box, Bell, BarChart3, 
  CircleDot, AlertCircle
} from "lucide-react";

export function LiveMissionNetworkPreview() {
  return (
    <section className="py-24 bg-surface relative overflow-hidden">
      <Container>
        {/* Top Header */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-success" />
          <h2 className="text-xl font-bold text-foreground">Live Mission Network</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Sidebar Navigation */}
          <div className="lg:col-span-2 flex flex-col gap-2">
            <button className="flex items-center gap-3 w-full bg-green-50 text-green-700 font-semibold px-4 py-3 rounded-lg shadow-sm border border-green-100">
              <MapIcon className="w-5 h-5 text-green-600" />
              <span className="text-sm">Live Map</span>
            </button>
            <button className="flex items-center gap-3 w-full hover:bg-surface-elevated text-muted-foreground font-medium px-4 py-3 rounded-lg transition-colors">
              <Truck className="w-5 h-5" />
              <span className="text-sm">Convoys</span>
            </button>
            <button className="flex items-center gap-3 w-full hover:bg-surface-elevated text-muted-foreground font-medium px-4 py-3 rounded-lg transition-colors">
              <Box className="w-5 h-5" />
              <span className="text-sm">Supplies</span>
            </button>
            <button className="flex items-center justify-between w-full hover:bg-surface-elevated text-muted-foreground font-medium px-4 py-3 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5" />
                <span className="text-sm">Alerts</span>
              </div>
              <span className="bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">2</span>
            </button>
            <button className="flex items-center gap-3 w-full hover:bg-surface-elevated text-muted-foreground font-medium px-4 py-3 rounded-lg transition-colors">
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm">Analytics</span>
            </button>
          </div>

          {/* Center Map Area */}
          <div className="lg:col-span-6 relative bg-[#E8F0F2] rounded-2xl overflow-hidden border border-border/50 shadow-inner min-h-[400px]">
            {/* Map Placeholder Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-multiply"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')" }}
            />
            
            {/* Overlay Map UI */}
            <div className="absolute inset-0 p-4">
              {/* Map Controls */}
              <div className="absolute bottom-6 left-6 flex flex-col bg-white rounded-lg shadow-md border border-border/40">
                <button className="p-2 border-b border-border/40 hover:bg-surface-elevated text-foreground font-bold">+</button>
                <button className="p-2 hover:bg-surface-elevated text-foreground font-bold">-</button>
              </div>

              {/* Status Legend */}
              <div className="absolute bottom-6 right-6 flex items-center gap-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#00A859]"/> On Route</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#F5A623]"/> Delayed</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-800"/> At Base</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-danger"/> Alert</div>
              </div>

              {/* TRK-02 Float Card */}
              <div className="absolute top-1/4 right-1/4 bg-white p-3 rounded-xl shadow-lg border border-border/50 text-xs w-40 z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 bg-[#00A859] rounded-full animate-pulse" />
                  <span className="font-bold">Convoy TRK-02</span>
                </div>
                <p className="text-muted-foreground mb-1">+ En route</p>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">ETA:</span>
                  <span>2h 14m</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Health:</span>
                  <span>92%</span>
                </div>
              </div>

              {/* Simplified Route Vectors (Visual representation only) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 40,20 Q 50,40 60,35 T 70,60" fill="none" stroke="#00A859" strokeWidth="0.5" strokeDasharray="1 1" />
                <path d="M 30,70 Q 40,60 50,80 T 70,60" fill="none" stroke="#00A859" strokeWidth="0.5" />
                
                {/* Node dots */}
                <circle cx="40" cy="20" r="1.5" fill="#00A859" />
                <circle cx="60" cy="35" r="1.5" fill="#F5A623" />
                <circle cx="70" cy="60" r="2" fill="white" stroke="#00A859" strokeWidth="1" />
                <circle cx="30" cy="70" r="1.5" fill="red" />
                <circle cx="50" cy="80" r="1.5" fill="#1e293b" />
              </svg>
            </div>
          </div>

          {/* Right Sidebar - Mission Overview */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-border/50 shadow-sm p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-foreground">Mission Overview</h3>
              <button className="text-xs font-semibold bg-surface-elevated px-3 py-1.5 rounded text-foreground border border-border/60 hover:bg-border/20 transition-colors">
                All Operations ▾
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              <div>
                <p className="text-2xl font-bold text-foreground">28</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground leading-tight">Active Convoys</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">412</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground leading-tight">Total Vehicles</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">6</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground leading-tight">In Transit</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-danger">2</p>
                <p className="text-[10px] uppercase font-bold text-danger leading-tight">Alerts</p>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-foreground">Recent Activity</h4>
              <button className="text-xs font-semibold text-[#00A859] hover:underline">View All →</button>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              {/* Activity 1 */}
              <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 text-xs">
                <CircleDot className="w-3 h-3 text-[#00A859]" />
                <span className="font-bold">TRK-02</span>
                <span className="text-muted-foreground">Leh → Srinagar</span>
                <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">En route</span>
                <span className="text-muted-foreground font-medium w-12 text-right">2h 14m</span>
              </div>
              {/* Activity 2 */}
              <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 text-xs">
                <CircleDot className="w-3 h-3 text-[#00A859]" />
                <span className="font-bold">TRK-07</span>
                <span className="text-muted-foreground">Delhi → Nagpur</span>
                <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">On time</span>
                <span className="text-muted-foreground font-medium w-12 text-right">5h 32m</span>
              </div>
              {/* Activity 3 */}
              <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 text-xs">
                <AlertCircle className="w-3 h-3 text-danger" />
                <span className="font-bold">VAN-03</span>
                <span className="text-muted-foreground">Chennai → Visakhapatnam</span>
                <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold">Delayed</span>
                <span className="text-danger font-medium w-12 text-right">+1h 20m</span>
              </div>
              {/* Activity 4 */}
              <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 text-xs">
                <CircleDot className="w-3 h-3 text-muted-foreground" />
                <span className="font-bold">TRK-11</span>
                <span className="text-muted-foreground">Mumbai → Pune</span>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">Delivered</span>
                <span className="text-muted-foreground font-medium w-12 text-right">—</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}


