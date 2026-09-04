import type { ActivityItemType } from "./types";
import { Card } from "../../ui/Card";

interface ActivityFeedProps {
  activities: ActivityItemType[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card className="flex flex-col h-full bg-surface/40 border-border/40 backdrop-blur-md overflow-hidden">
      <div className="p-5 border-b border-border/40 bg-surface/60">
        <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
          Recent Activity
        </h3>
      </div>
      <div className="p-3 flex flex-col gap-2 overflow-y-auto">
        {activities.map((activity, idx) => (
          <div 
            key={activity.id} 
            className="p-3 rounded-lg hover:bg-muted/50 transition-colors flex gap-3 group animate-in fade-in slide-in-from-bottom-2"
            style={{ animationDelay: `${idx * 150}ms`, animationFillMode: "both" }}
          >
            <div className="pt-1">
              <div className={`h-2 w-2 rounded-full ring-4 ${
                activity.status === 'warning' ? 'bg-warning ring-warning/20' : 
                activity.status === 'danger' ? 'bg-danger ring-danger/20' : 
                activity.status === 'success' ? 'bg-success ring-success/20' : 
                'bg-info ring-info/20'
              }`} />
            </div>
            <div>
              <p className={`text-[10px] font-bold tracking-wider uppercase mb-1 ${
                activity.status === 'warning' ? 'text-warning' : 
                activity.status === 'danger' ? 'text-danger' : 
                activity.status === 'success' ? 'text-success' : 
                'text-info'
              }`}>
                {activity.type}
              </p>
              <p className="text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                {activity.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
