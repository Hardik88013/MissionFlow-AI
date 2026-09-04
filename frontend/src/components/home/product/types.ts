export type ProductTab = 
  | "OVERVIEW"
  | "FLEET_INTELLIGENCE"
  | "ROUTE_OPTIMIZATION"
  | "INVENTORY"
  | "REAL_TIME_OPERATIONS";

export interface TabConfig {
  id: ProductTab;
  label: string;
}

export const PRODUCT_TABS: TabConfig[] = [
  { id: "OVERVIEW", label: "OVERVIEW" },
  { id: "FLEET_INTELLIGENCE", label: "FLEET INTELLIGENCE" },
  { id: "ROUTE_OPTIMIZATION", label: "ROUTE OPTIMIZATION" },
  { id: "INVENTORY", label: "INVENTORY" },
  { id: "REAL_TIME_OPERATIONS", label: "REAL-TIME OPERATIONS" },
];
