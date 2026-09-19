import { useEffect, useMemo, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import { type GeoJSONSource, type Map as MapLibreMap } from "maplibre-gl";
import {
  Crosshair,
  Expand,
  Eye,
  EyeOff,
  LocateFixed,
  Navigation,
  Truck,
} from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";

import {
  formatCurrentStop,
  getRemainingStops,
  toMissionVehicle,
} from "../../services/missionRouteData";
import { buildMissionRoutes } from "../../services/routeService";
import type {
  FleetVehicle,
  MissionStop,
  MissionVehicle,
  VehicleStatus,
} from "../../types/fleet";

type LiveMissionMapProps = {
  vehicles: FleetVehicle[];
  selectedVehicleId: number | null;
  socketConnected: boolean;
  onVehicleSelect: (vehicleId: number) => void;
};

type VehicleMarkerRecord = {
  element: HTMLButtonElement;
  marker: maplibregl.Marker;
};

const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";
const ROUTE_SOURCE_ID = "mission-routes";
const ROUTE_LAYER_ID = "mission-routes-line";

const STATUS_STYLE: Record<
  VehicleStatus,
  { color: string; label: string; panelColor: string }
> = {
  en_route: { color: "#22c55e", label: "EN ROUTE", panelColor: "#dcfce7" },
  delayed: { color: "#f59e0b", label: "DELAYED", panelColor: "#fef3c7" },
  at_base: { color: "#94a3b8", label: "AT BASE", panelColor: "#e2e8f0" },
  delivered: { color: "#60a5fa", label: "DELIVERED", panelColor: "#dbeafe" },
  idle: { color: "#94a3b8", label: "IDLE", panelColor: "#e2e8f0" },
};

const STOP_COLOR: Record<MissionStop["status"], string> = {
  completed: "#22c55e",
  current: "#22d3ee",
  upcoming: "#3b82f6",
  delayed: "#f59e0b",
};

function formatTruckId(vehicleId: number): string {
  return `TRK-${String(vehicleId).slice(-2).padStart(2, "0")}`;
}

function formatRouteId(routeId: number | null): string {
  return routeId === null ? "Unassigned" : `RT-${String(routeId).padStart(2, "0")}`;
}

function formatCoordinates(vehicle: FleetVehicle): string {
  return `${vehicle.latitude.toFixed(4)}, ${vehicle.longitude.toFixed(4)}`;
}

function fitFleetMap(map: MapLibreMap, vehicles: MissionVehicle[]) {
  if (vehicles.length === 0) return;

  if (vehicles.length === 1) {
    map.flyTo({
      center: [vehicles[0].longitude, vehicles[0].latitude],
      duration: 700,
      zoom: 12,
    });
    return;
  }

  const bounds = new maplibregl.LngLatBounds();
  vehicles.forEach((vehicle) => {
    bounds.extend([vehicle.longitude, vehicle.latitude]);
  });

  map.fitBounds(bounds, { duration: 700, padding: 48, maxZoom: 6.5 });
}

function createTruckMarkerElement(
  vehicleId: number,
  onVehicleSelectRef: React.MutableRefObject<(id: number) => void>,
): HTMLButtonElement {
  const element = document.createElement("button");
  element.type = "button";
  element.className = "mission-truck-marker";
  element.setAttribute("aria-label", `Select ${formatTruckId(vehicleId)}`);
  element.innerHTML = `
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
      <path d="M3 5h11v11H3z" />
      <path d="M14 8h4l3 3v5h-7z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </svg>`;
  element.addEventListener("click", (event) => {
    event.stopPropagation();
    onVehicleSelectRef.current(vehicleId);
  });

  return element;
}

function createStopMarkerElement(stop: MissionStop, isDestination: boolean) {
  const element = document.createElement("div");
  element.className = `mission-stop-marker ${isDestination ? "is-destination" : ""}`;
  element.style.setProperty("--stop-color", STOP_COLOR[stop.status]);
  element.setAttribute(
    "aria-label",
    `Stop ${stop.sequence}: ${stop.name}, ${stop.status}`,
  );
  element.textContent = isDestination ? "◆" : String(stop.sequence);
  return element;
}

export default function LiveMissionMap({
  vehicles,
  selectedVehicleId,
  socketConnected,
  onVehicleSelect,
}: LiveMissionMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const vehicleMarkersRef = useRef(new Map<number, VehicleMarkerRecord>());
  const stopMarkersRef = useRef<maplibregl.Marker[]>([]);
  const onVehicleSelectRef = useRef(onVehicleSelect);
  const hasFittedInitiallyRef = useRef(false);
  const previousSelectedVehicleIdRef = useRef(selectedVehicleId);
  const [mapReady, setMapReady] = useState(false);
  const [styleReady, setStyleReady] = useState(false);
  const [followVehicle, setFollowVehicle] = useState(false);
  const [showRoutes, setShowRoutes] = useState(true);

  onVehicleSelectRef.current = onVehicleSelect;

  const missionVehicles = useMemo<MissionVehicle[]>(
    () =>
      vehicles
        .filter(
          (vehicle) =>
            Number.isFinite(vehicle.latitude) && Number.isFinite(vehicle.longitude),
        )
        .map(toMissionVehicle),
    [vehicles],
  );

  const selectedVehicle = missionVehicles.find(
    (vehicle) => vehicle.vehicle_id === selectedVehicleId,
  );
  const selectedStops = selectedVehicle
    ? getRemainingStops(selectedVehicle)
    : [];
  const selectedStatus = selectedVehicle
    ? STATUS_STYLE[selectedVehicle.status]
    : STATUS_STYLE.idle;
  const routeCount = missionVehicles.filter(
    (vehicle) => vehicle.stops.length > 0,
  ).length;

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      center: [78.9629, 20.5937],
      container: mapContainerRef.current,
      maxZoom: 18,
      minZoom: 2,
      style: MAP_STYLE_URL,
      zoom: 4.4,
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true, showZoom: true }),
      "bottom-left",
    );
    mapRef.current = map;
    setMapReady(true);

    const markStyleReady = () => {
      if (map.isStyleLoaded()) setStyleReady(true);
    };

    map.on("load", markStyleReady);
    map.on("styledata", markStyleReady);

    return () => {
      vehicleMarkersRef.current.forEach(({ marker }) => marker.remove());
      vehicleMarkersRef.current.clear();
      stopMarkersRef.current.forEach((marker) => marker.remove());
      stopMarkersRef.current = [];
      map.off("load", markStyleReady);
      map.off("styledata", markStyleReady);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !styleReady) return;

    const routeData = showRoutes
      ? buildMissionRoutes(missionVehicles, selectedVehicleId)
      : buildMissionRoutes([], null);
    let source = map.getSource(ROUTE_SOURCE_ID) as GeoJSONSource | undefined;

    if (!source) {
      map.addSource(ROUTE_SOURCE_ID, { type: "geojson", data: routeData });
      map.addLayer({
        id: ROUTE_LAYER_ID,
        type: "line",
        source: ROUTE_SOURCE_ID,
        paint: {
          "line-blur": 0.35,
          "line-color": ["get", "color"],
          "line-opacity": ["get", "opacity"],
          "line-width": ["case", ["get", "selected"], 5, 2.5],
        },
      });
      source = map.getSource(ROUTE_SOURCE_ID) as GeoJSONSource | undefined;
    }

    source?.setData(routeData);
  }, [missionVehicles, selectedVehicleId, showRoutes, styleReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const activeVehicleIds = new Set<number>();

    missionVehicles.forEach((vehicle) => {
      activeVehicleIds.add(vehicle.vehicle_id);
      const selected = vehicle.vehicle_id === selectedVehicleId;
      let record = vehicleMarkersRef.current.get(vehicle.vehicle_id);

      if (!record) {
        const element = createTruckMarkerElement(
          vehicle.vehicle_id,
          onVehicleSelectRef,
        );
        const marker = new maplibregl.Marker({ element, anchor: "center" })
          .setLngLat([vehicle.longitude, vehicle.latitude])
          .addTo(map);
        record = { element, marker };
        vehicleMarkersRef.current.set(vehicle.vehicle_id, record);
      }

      record.element.className = `mission-truck-marker ${
        selected ? "is-selected" : ""
      } ${vehicle.status === "en_route" ? "is-live" : ""}`;
      record.element.style.setProperty(
        "--truck-status-color",
        STATUS_STYLE[vehicle.status].color,
      );
      record.marker
        .setLngLat([vehicle.longitude, vehicle.latitude])
        .setOffset([0, 0]);
    });

    vehicleMarkersRef.current.forEach((record, vehicleId) => {
      if (!activeVehicleIds.has(vehicleId)) {
        record.marker.remove();
        vehicleMarkersRef.current.delete(vehicleId);
      }
    });
  }, [mapReady, missionVehicles, selectedVehicleId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    stopMarkersRef.current.forEach((marker) => marker.remove());
    stopMarkersRef.current = [];

    if (!selectedVehicle) return;

    selectedVehicle.stops.forEach((stop, index) => {
      const marker = new maplibregl.Marker({
        anchor: "center",
        element: createStopMarkerElement(
          stop,
          index === selectedVehicle.stops.length - 1,
        ),
      })
        .setLngLat([stop.longitude, stop.latitude])
        .setPopup(
          new maplibregl.Popup({ offset: 16 }).setHTML(
            `<strong>Stop ${stop.sequence}: ${stop.name}</strong><br>Status: ${stop.status.toUpperCase()}<br>Coordinates: ${stop.latitude.toFixed(4)}, ${stop.longitude.toFixed(4)}`,
          ),
        )
        .addTo(map);

      stopMarkersRef.current.push(marker);
    });
  }, [mapReady, selectedVehicle]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || hasFittedInitiallyRef.current) return;

    fitFleetMap(map, missionVehicles);
    hasFittedInitiallyRef.current = missionVehicles.length > 0;
  }, [mapReady, missionVehicles]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !selectedVehicle) return;

    const selectionChanged =
      previousSelectedVehicleIdRef.current !== selectedVehicleId;

    if (selectionChanged || followVehicle) {
      map.flyTo({
        center: [selectedVehicle.longitude, selectedVehicle.latitude],
        duration: 700,
        speed: 1.2,
        zoom: Math.max(map.getZoom(), 12),
      });
    }

    previousSelectedVehicleIdRef.current = selectedVehicleId;
  }, [
    followVehicle,
    mapReady,
    selectedVehicle,
    selectedVehicleId,
  ]);

  const locateSelectedVehicle = () => {
    const map = mapRef.current;
    if (!map || !selectedVehicle) return;

    map.flyTo({
      center: [selectedVehicle.longitude, selectedVehicle.latitude],
      duration: 700,
      speed: 1.2,
      zoom: Math.max(map.getZoom(), 12),
    });
  };

  const fitAllVehicles = () => {
    const map = mapRef.current;
    if (map) fitFleetMap(map, missionVehicles);
  };

  return (
    <div className="mission-map-shell">
      <style>{`
        .mission-map-shell { background: #07111f; height: 100%; min-height: 320px; overflow: hidden; position: relative; width: 100%; }
        .mission-map-canvas { height: 100%; width: 100%; }
        .mission-map-shell .maplibregl-ctrl-group { background: rgba(5, 12, 24, .9); border: 1px solid rgba(148, 163, 184, .2); box-shadow: 0 8px 18px rgba(2, 6, 23, .28); }
        .mission-map-shell .maplibregl-ctrl-group button { filter: invert(1) brightness(2); }
        .mission-map-shell .maplibregl-ctrl-attrib { background: rgba(5, 12, 24, .78); color: #cbd5e1; }
        .mission-map-shell .maplibregl-ctrl-attrib a { color: #67e8f9; }
        .mission-truck-marker { align-items: center; background: #0f172a; border: 2px solid var(--truck-status-color); border-radius: 12px; box-shadow: 0 0 0 3px color-mix(in srgb, var(--truck-status-color) 28%, transparent), 0 8px 16px rgba(2, 6, 23, .4); color: #fff; cursor: pointer; display: flex; height: 36px; justify-content: center; padding: 0; position: relative; transition: box-shadow .2s ease, transform .2s ease; width: 36px; }
        .mission-truck-marker:hover, .mission-truck-marker.is-selected { box-shadow: 0 0 0 5px color-mix(in srgb, var(--truck-status-color) 38%, transparent), 0 10px 20px rgba(2, 6, 23, .5); transform: scale(1.12); z-index: 2; }
        .mission-truck-marker svg { height: 20px; width: 20px; }
        .mission-truck-marker.is-live::after { animation: missionPulse 1.8s ease-out infinite; border: 2px solid var(--truck-status-color); border-radius: 14px; content: ""; inset: -5px; pointer-events: none; position: absolute; }
        .mission-stop-marker { align-items: center; background: #0f172a; border: 2px solid var(--stop-color); border-radius: 50%; box-shadow: 0 5px 12px rgba(2, 6, 23, .38); color: #f8fafc; display: flex; font-size: 11px; font-weight: 800; height: 27px; justify-content: center; width: 27px; }
        .mission-stop-marker.is-destination { background: var(--stop-color); border-radius: 8px; color: #08111f; transform: rotate(45deg); }
        .mission-stop-marker.is-destination { font-size: 14px; }
        @keyframes missionPulse { 0% { opacity: .8; transform: scale(.75); } 75%, 100% { opacity: 0; transform: scale(1.3); } }
        @media (max-width: 700px) { .mission-map-details { max-height: 58%; top: auto !important; bottom: 12px; right: 12px !important; width: min(286px, calc(100% - 24px)) !important; } .mission-map-controls { right: 12px; top: 12px !important; left: 12px !important; } }
      `}</style>

      <div className="mission-map-canvas" ref={mapContainerRef} />

      <div className="mission-map-controls" style={{ display: "flex", flexWrap: "wrap", gap: 8, left: 16, position: "absolute", top: 16, zIndex: 2 }}>
        <div style={liveStatusStyle}>
          <span style={{ background: socketConnected ? "#22c55e" : "#f59e0b", borderRadius: "50%", boxShadow: `0 0 0 4px ${socketConnected ? "#22c55e22" : "#f59e0b22"}`, height: 7, width: 7 }} />
          {socketConnected ? "LIVE" : "RECONNECTING"}
        </div>
        <div style={countStyle}>{missionVehicles.length} vehicles</div>
        <div style={countStyle}>{routeCount} routes</div>
        <MapControlButton active={followVehicle} ariaLabel="Follow selected vehicle" icon={Navigation} label="Follow vehicle" onClick={() => setFollowVehicle((value) => !value)} />
        <MapControlButton ariaLabel="Locate selected vehicle" icon={LocateFixed} label="Locate selected vehicle" onClick={locateSelectedVehicle} />
        <MapControlButton ariaLabel="Fit all vehicles" icon={Expand} label="Fit all vehicles" onClick={fitAllVehicles} />
        <MapControlButton active={showRoutes} ariaLabel="Toggle route visibility" icon={showRoutes ? Eye : EyeOff} label="Toggle routes" onClick={() => setShowRoutes((value) => !value)} />
      </div>

      {selectedVehicle && (
        <aside className="mission-map-details" style={detailsCardStyle}>
          <div style={{ alignItems: "center", display: "flex", gap: 10 }}>
            <div style={truckBadgeStyle}><Truck size={19} /></div>
            <strong style={{ fontSize: 16 }}>{formatTruckId(selectedVehicle.vehicle_id)}</strong>
            <span style={{ ...livePillStyle, background: socketConnected ? "#ecfdf3" : "#fef3c7", color: socketConnected ? "#059669" : "#b45309" }}>
              {socketConnected ? "LIVE" : "STALE"}
            </span>
          </div>

          <div style={{ ...statusPillStyle, background: selectedStatus.panelColor, color: selectedStatus.color }}>
            {selectedStatus.label}
          </div>

          <div style={detailsGridStyle}>
            <span style={labelStyle}>ETA</span>
            <strong>{selectedVehicle.eta_minutes === null ? "—" : `${selectedVehicle.eta_minutes.toFixed(1)} min`}</strong>
            <span style={labelStyle}>Route</span>
            <strong>{formatRouteId(selectedVehicle.route_id)}</strong>
            <span style={labelStyle}>Current stop</span>
            <strong>{formatCurrentStop(selectedVehicle.current_stop)} / {selectedVehicle.stops.length || "—"}</strong>
          </div>

          <div style={{ borderTop: "1px solid #e2e8f0", margin: "16px 0" }} />
          <p style={sectionHeadingStyle}>DESTINATION</p>
          <strong style={{ display: "block", fontSize: 14, marginTop: 5 }}>
            {selectedVehicle.destination?.name ?? "No destination data"}
          </strong>
          <p style={{ color: "#475569", fontSize: 12, margin: "5px 0 0" }}>
            {formatCoordinates(selectedVehicle)}
          </p>

          <p style={{ ...sectionHeadingStyle, margin: "16px 0 8px" }}>REMAINING STOPS</p>
          {selectedStops.length > 0 ? (
            <div style={{ display: "grid", gap: 7 }}>
              {selectedStops.map((stop) => (
                <div key={stop.id} style={{ alignItems: "center", display: "flex", fontSize: 12, gap: 8 }}>
                  <span style={{ alignItems: "center", background: `${STOP_COLOR[stop.status]}1f`, borderRadius: "50%", color: STOP_COLOR[stop.status], display: "flex", fontSize: 10, fontWeight: 800, height: 21, justifyContent: "center", width: 21 }}>
                    {stop.sequence}
                  </span>
                  <span style={{ flex: 1 }}>{stop.name}</span>
                  <span style={{ color: "#64748b", fontSize: 10 }}>{stop.status.toUpperCase()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#64748b", fontSize: 12, margin: 0 }}>Route stops are not available yet.</p>
          )}
        </aside>
      )}

      {missionVehicles.length === 0 && (
        <div style={emptyStateStyle}>Waiting for live fleet positions…</div>
      )}
    </div>
  );
}

function MapControlButton({
  active = false,
  ariaLabel,
  icon: Icon,
  label,
  onClick,
}: {
  active?: boolean;
  ariaLabel: string;
  icon: typeof Crosshair;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      style={{ ...controlButtonStyle, background: active ? "#0d9488" : "rgba(5, 12, 24, .88)" }}
      title={label}
      type="button"
    >
      <Icon size={14} />
    </button>
  );
}

const liveStatusStyle = {
  alignItems: "center",
  backdropFilter: "blur(12px)",
  background: "rgba(5, 12, 24, .88)",
  border: "1px solid rgba(148, 163, 184, .18)",
  borderRadius: 999,
  color: "#e2e8f0",
  display: "flex",
  fontSize: 11,
  fontWeight: 700,
  gap: 7,
  padding: "9px 12px",
} as const;

const countStyle = {
  ...liveStatusStyle,
  color: "#cbd5e1",
  fontWeight: 600,
} as const;

const controlButtonStyle = {
  alignItems: "center",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(148, 163, 184, .18)",
  borderRadius: 9,
  color: "#e2e8f0",
  cursor: "pointer",
  display: "flex",
  height: 36,
  justifyContent: "center",
  padding: 0,
  width: 36,
} as const;

const detailsCardStyle = {
  backdropFilter: "blur(16px)",
  background: "rgba(255, 255, 255, .96)",
  border: "1px solid rgba(255, 255, 255, .7)",
  borderRadius: 18,
  boxShadow: "0 18px 38px rgba(2, 12, 27, .32)",
  color: "#172033",
  maxHeight: "calc(100% - 32px)",
  overflowY: "auto",
  padding: 16,
  position: "absolute",
  right: 16,
  top: 16,
  width: "min(286px, calc(100% - 32px))",
  zIndex: 2,
} as const;

const truckBadgeStyle = {
  alignItems: "center",
  background: "#0f172a",
  borderRadius: 10,
  color: "#ffffff",
  display: "flex",
  height: 36,
  justifyContent: "center",
  width: 36,
} as const;

const livePillStyle = {
  borderRadius: 999,
  fontSize: 10,
  fontWeight: 800,
  marginLeft: "auto",
  padding: "6px 9px",
} as const;

const statusPillStyle = {
  borderRadius: 9,
  display: "inline-block",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: ".06em",
  marginTop: 14,
  padding: "6px 8px",
} as const;

const detailsGridStyle = {
  display: "grid",
  fontSize: 13,
  gap: "10px 16px",
  gridTemplateColumns: "1fr auto",
  marginTop: 16,
} as const;

const labelStyle = { color: "#64748b" } as const;

const sectionHeadingStyle = {
  color: "#64748b",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: ".08em",
  margin: 0,
} as const;

const emptyStateStyle = {
  background: "rgba(5, 12, 24, .88)",
  border: "1px solid rgba(148, 163, 184, .18)",
  borderRadius: 12,
  color: "#cbd5e1",
  fontSize: 12,
  left: "50%",
  padding: "12px 16px",
  position: "absolute",
  top: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 2,
} as const;
