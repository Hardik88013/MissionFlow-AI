import { StatusBadge } from "../../ui/StatusBadge";

export function InventoryView() {
  const supplies = [
    { label: "Fuel", percentage: 78, status: "healthy" },
    { label: "Medical", percentage: 91, status: "healthy" },
    { label: "Food", percentage: 64, status: "warning" },
    { label: "Equipment", percentage: 83, status: "healthy" },
  ];

  return (
    <div className="flex flex-col h-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">CRITICAL SUPPLIES</h4>
          <p className="text-sm text-foreground">Network-wide availability</p>
        </div>
        <div className="flex gap-2">
          <StatusBadge status="success" label="AVAILABLE" />
          <StatusBadge status="info" label="IN TRANSIT" />
          <StatusBadge status="warning" label="LOW STOCK" />
        </div>
      </div>

      <div className="flex flex-col gap-6 bg-surface p-6 rounded-xl border border-border/50 flex-1 justify-center">
        {supplies.map(supply => (
          <div key={supply.label} className="w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold tracking-wide text-foreground">{supply.label}</span>
              <span className={`text-sm font-semibold ${
                supply.status === 'warning' ? 'text-warning' : 'text-success'
              }`}>{supply.percentage}%</span>
            </div>
            <div className="w-full h-3 bg-background rounded-full overflow-hidden border border-border/40">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  supply.status === 'warning' ? 'bg-warning' : 'bg-primary'
                }`}
                style={{ width: `${supply.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
