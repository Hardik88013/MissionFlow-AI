import type { Feature, FeatureCollection, LineString } from "geojson";

import { getRemainingStops } from "./missionRouteData";
import type { MissionVehicle } from "../types/fleet";

export type MissionRouteProperties = {
  color: string;
  opacity: number;
  selected: boolean;
};

const STATUS_ROUTE_COLOR: Record<MissionVehicle["status"], string> = {
  en_route: "#22c55e",
  delayed: "#f59e0b",
  at_base: "#94a3b8",
  delivered: "#60a5fa",
  idle: "#94a3b8",
};

/*
 * The backend does not publish road geometry yet. This produces a typed,
 * geographic demo route from the live position through the route's stop data.
 * Replace coordinates with backend route geometry here when it is available.
 */
export function buildMissionRoutes(
  vehicles: MissionVehicle[],
  selectedVehicleId: number | null,
): FeatureCollection<LineString, MissionRouteProperties> {
  const features: Array<Feature<LineString, MissionRouteProperties>> = [];

  vehicles.forEach((vehicle) => {
    const remainingStops = getRemainingStops(vehicle);

    if (remainingStops.length === 0) return;

    const selected = vehicle.vehicle_id === selectedVehicleId;
    features.push({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [vehicle.longitude, vehicle.latitude],
          ...remainingStops.map((stop) => [stop.longitude, stop.latitude]),
        ],
      },
      properties: {
        color: selected ? STATUS_ROUTE_COLOR[vehicle.status] : "#38bdf8",
        opacity: selected ? 0.95 : 0.35,
        selected,
      },
    });
  });

  return { type: "FeatureCollection", features };
}
