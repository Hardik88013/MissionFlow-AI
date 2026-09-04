import type { ActivityItemType } from "../network/types";

export function RealTimeOperationsView() {
  const activities: ActivityItemType[] = [
    { id: 1, type: "MISSION STARTED", title: "Convoy MF-204 departed Leh", time: "2 min ago", status: "success" },
    { id: 2, type: "ROUTE UPDATED", title: "TRK-02 route optimized", time: "8 min ago", status: "info" },
    { id: 3, type: "VEHICLE STATUS", title: "TRK-17 health check completed", time: "14 min ago", status: "success" },
    { id: 4, type: "ALERT", title: "TRK-09 requires attention", time: "21 min ago", status: "warning" },
    { id: 5, type: "INVENTORY", title: "Fuel supply delivered to Delhi node", time: "34 min ago", status: "info" },
  ];

  return (
    <div className="flex flex-col h-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-500">
      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">LIVE FEED</h4>
      
      <div className="flex-1 bg-surface rounded-xl border border-border/50 p-4 sm:p-6 overflow-y-auto">
        <div className="relative border-l-2 border-border/40 ml-3 md:ml-4 flex flex-col gap-8 py-2">
          {activities.map((activity) => (
            <div key={activity.id} className="relative pl-6 sm:pl-8 group">
              <div className={`absolute -left-[5px] top-1.5 h-2 w-2 rounded-full ring-4 ring-background ${
                activity.status === 'warning' ? 'bg-warning' : 
                activity.status === 'success' ? 'bg-success' : 
                'bg-info'
              }`} />
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
                <div>
                  <p className={`text-[10px] font-bold tracking-wider uppercase mb-1 ${
                    activity.status === 'warning' ? 'text-warning' : 
                    activity.status === 'success' ? 'text-success' : 
                    'text-info'
                  }`}>
                    {activity.type}
                  </p>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {activity.title}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-1 sm:mt-0">
                  {activity.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
