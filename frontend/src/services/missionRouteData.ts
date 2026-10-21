import type {
  FleetVehicle,
  MissionStop,
  MissionStopStatus,
  MissionVehicle,
} from "../types/fleet";

type StopTemplate = Omit<MissionStop, "status">;

/*
 * Temporary route metadata. Replace this lookup with the backend's ordered
 * stops payload when vehicle master data exposes it; map rendering can stay
 * unchanged because it already consumes MissionVehicle.stops.
 */
const TEMPORARY_ROUTE_STOPS: Record<number, StopTemplate[]> = {
  5: [
    { id: "rt-05-01", name: "Kerala Mission Depot", latitude: 10.851, longitude: 76.272, sequence: 1, priority: "medium" },
    { id: "rt-05-02", name: "Kerala Operations Checkpoint", latitude: 10.864, longitude: 76.285, sequence: 2, priority: "medium" },
    { id: "rt-05-03", name: "Kerala Distribution Hub", latitude: 10.877, longitude: 76.297, sequence: 3, priority: "high" },
    { id: "rt-05-04", name: "Kerala Transit Point", latitude: 10.889, longitude: 76.309, sequence: 4, priority: "medium" },
    { id: "rt-05-05", name: "Kerala Delivery Point", latitude: 10.901, longitude: 76.322, sequence: 5, priority: "high" },
    { id: "rt-05-06", name: "Kerala Final Stop", latitude: 10.913, longitude: 76.335, sequence: 6, priority: "low" },
  ],
  7: [
    { id: "rt-07-01", name: "Leh", latitude: 34.1526, longitude: 77.5771, sequence: 1, priority: "high" },
    { id: "rt-07-02", name: "Kargil", latitude: 34.5539, longitude: 76.1349, sequence: 2, priority: "high" },
    { id: "rt-07-03", name: "Srinagar", latitude: 34.0837, longitude: 74.7973, sequence: 3, priority: "medium" },
  ],
  8: [
    { id: "rt-08-01", name: "Shimla", latitude: 31.1048, longitude: 77.1734, sequence: 1, priority: "high" },
    { id: "rt-08-02", name: "Mandi", latitude: 31.7087, longitude: 76.931, sequence: 2, priority: "medium" },
    { id: "rt-08-03", name: "Manali", latitude: 32.2396, longitude: 77.1887, sequence: 3, priority: "medium" },
    { id: "rt-08-04", name: "Kullu", latitude: 31.9579, longitude: 77.1095, sequence: 4, priority: "high" },
  ],
  11: [
    { id: "rt-11-01", name: "Chandigarh Base", latitude: 30.7333, longitude: 76.7794, sequence: 1, priority: "medium" },
    { id: "rt-11-02", name: "Ambala", latitude: 30.3782, longitude: 76.7767, sequence: 2, priority: "high" },
  ],
  12: [
    { id: "rt-12-01", name: "New Delhi", latitude: 28.6139, longitude: 77.209, sequence: 1, priority: "high" },
    { id: "rt-12-02", name: "Gurugram", latitude: 28.4595, longitude: 77.0266, sequence: 2, priority: "medium" },
    { id: "rt-12-03", name: "Faridabad", latitude: 28.4089, longitude: 77.3178, sequence: 3, priority: "high" },
  ],
};

function currentStopNumber(currentStop: number | null): number {
  return currentStop && currentStop > 0 ? currentStop : 1;
}

function getStopStatus(
  sequence: number,
  currentStop: number,
  status: FleetVehicle["status"],
): MissionStopStatus {
  if (sequence < currentStop) return "completed";
  if (sequence === currentStop && status === "delayed") return "delayed";
  return sequence === currentStop ? "current" : "upcoming";
}

export function toMissionVehicle(vehicle: FleetVehicle): MissionVehicle {
  const currentStop = currentStopNumber(vehicle.current_stop);
  const stops = (vehicle.route_id === null
    ? []
    : TEMPORARY_ROUTE_STOPS[vehicle.route_id] ?? []
  ).map((stop) => ({
    ...stop,
    status: getStopStatus(stop.sequence, currentStop, vehicle.status),
  }));

  return {
    ...vehicle,
    destination: stops[stops.length - 1],
    stops,
  };
}

export function getRemainingStops(vehicle: MissionVehicle): MissionStop[] {
  const currentStop = currentStopNumber(vehicle.current_stop);
  return vehicle.stops.filter((stop) => stop.sequence >= currentStop);
}

export function formatCurrentStop(currentStop: number | null): number {
  return currentStopNumber(currentStop);
}
