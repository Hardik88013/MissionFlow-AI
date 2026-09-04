export interface Metric {
  label: string;
  value: string | number;
  highlight?: "warning" | "success" | "danger" | "info";
}

export interface ActivityItemType {
  id: string | number;
  type: string;
  title: string;
  time: string;
  status: "success" | "warning" | "danger" | "info";
}

export interface MissionNode {
  id: string;
  label: string;
  cx: number;
  cy: number;
  state: "ACTIVE" | "DESTINATION" | "OPERATIONAL" | "ALERT";
}
