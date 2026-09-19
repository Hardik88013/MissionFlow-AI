export type VehicleStatus =
  | "en_route"
  | "idle"
  | "delayed"
  | "delivered"
  | "at_base";

export type FleetVehicle = {
  vehicle_id: number;
  latitude: number;
  longitude: number;
  route_id: number | null;
  current_stop: number | null;
  status: VehicleStatus;
  eta_minutes: number | null;
  timestamp: string;
};

export type FleetWebSocketMessage = {
  type: string;
  vehicle?: FleetVehicle;
};

export type MissionStopStatus =
  | "completed"
  | "current"
  | "upcoming"
  | "delayed";

export type MissionStop = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  sequence: number;
  status: MissionStopStatus;
  priority?: "low" | "medium" | "high";
};

export type MissionVehicle = FleetVehicle & {
  destination?: MissionStop;
  stops: MissionStop[];
};
