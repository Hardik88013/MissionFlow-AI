import { useState } from "react";
import type { ReactNode } from "react";

import {
  ArrowLeft,
  Clock,
  Map,
  Route as RouteIcon,
  Truck,
  Zap,
} from "lucide-react";


interface OptimizedRoute {
  vehicle_id: number;
  route: number[];
  distance_meters: number;
}

interface RouteResponse {
  routes: OptimizedRoute[];
  total_distance_meters: number;
}

interface ETAResponse {
  predicted_eta_minutes: number;
}


const distanceMatrix = [
  [0, 5000, 7000, 6000, 8000],
  [5000, 0, 4000, 3000, 6000],
  [7000, 4000, 0, 5000, 3000],
  [6000, 3000, 5000, 0, 4000],
  [8000, 6000, 3000, 4000, 0],
];

const demands = [0, 4, 6, 3, 7];

const timeWindows = [
  [480, 1020],
  [540, 660],
  [600, 780],
  [840, 960],
  [600, 900],
];


// ------------------------------------------------------------
// Mission network node positions
// ------------------------------------------------------------

const nodePositions: Record<
  number,
  { x: number; y: number }
> = {
  0: { x: 100, y: 320 },
  1: { x: 280, y: 220 },
  2: { x: 470, y: 280 },
  3: { x: 650, y: 120 },
  4: { x: 650, y: 320 },
};


const nodeLabels: Record<number, string> = {
  0: "DEPOT",
  1: "D1",
  2: "D2",
  3: "D3",
  4: "D4",
};


const routeStrokes = [
  "#00A859",
  "#38BDF8",
  "#A78BFA",
  "#F59E0B",
];


export function Routes() {
  const [vehicleCount, setVehicleCount] = useState(2);

  const [loading, setLoading] = useState(false);

  const [result, setResult] =
    useState<RouteResponse | null>(null);

  const [eta, setEta] =
    useState<number | null>(null);

  const [error, setError] =
    useState<string | null>(null);


  // ----------------------------------------------------------
  // Optimize routes + predict ETA
  // ----------------------------------------------------------

  async function optimizeRoutes() {
    setLoading(true);
    setError(null);
    setResult(null);
    setEta(null);

    try {
      // ------------------------------------------------------
      // Route optimization
      // ------------------------------------------------------

      const routeResponse = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/routes/optimize`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            distance_matrix: distanceMatrix,

            vehicle_count: vehicleCount,

            depot: 0,

            vehicle_capacities: [10, 10],

            demands,

            time_windows: timeWindows,

            travel_speed_kmh: 40,

            service_time_minutes: 10,
          }),
        }
      );


      if (!routeResponse.ok) {
        throw new Error(
          "Route optimization failed."
        );
      }


      const routeData: RouteResponse =
        await routeResponse.json();


      setResult(routeData);


      // ------------------------------------------------------
      // ML ETA prediction
      // ------------------------------------------------------

      const etaResponse = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/predictions/eta`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            straight_line_distance_km:
              routeData.total_distance_meters / 1000,

            start_longitude: 76.78,

            start_latitude: 30.73,

            end_longitude: 77.17,

            end_latitude: 31.10,

            hour: new Date().getHours(),

            day_of_week: new Date().getDay(),

            is_weekend:
              new Date().getDay() === 0 ||
              new Date().getDay() === 6
                ? 1
                : 0,

            CALL_TYPE: "Dispatch",

            ORIGIN_STAND: 1,
          }),
        }
      );


      if (!etaResponse.ok) {
        throw new Error(
          "ETA prediction failed."
        );
      }


      const etaData: ETAResponse =
        await etaResponse.json();


      setEta(
        etaData.predicted_eta_minutes
      );

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }


  // ----------------------------------------------------------
  // Convert optimized route into SVG path
  // ----------------------------------------------------------

  function buildRoutePath(
    route: number[]
  ): string {
    if (route.length === 0) {
      return "";
    }


    return route
      .map((node, index) => {
        const position =
          nodePositions[node];

        if (!position) {
          return "";
        }

        return `${
          index === 0 ? "M" : "L"
        } ${position.x} ${position.y}`;
      })
      .join(" ");
  }


  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* -------------------------------------------------- */}
      {/* Header */}
      {/* -------------------------------------------------- */}

      <header className="h-20 border-b border-border/50 flex items-center justify-between px-6 lg:px-10">

        <div className="flex items-center gap-4">

          <a
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />

            Dashboard
          </a>


          <div className="h-6 w-px bg-border" />


          <div className="flex items-center gap-3">

            <Map className="w-5 h-5 text-primary" />

            <span className="font-bold">
              Route Optimization
            </span>

          </div>

        </div>


        <img
          src="/logo.png"
          alt="MissionFlow AI"
          className="h-9 w-auto"
        />

      </header>


      {/* -------------------------------------------------- */}
      {/* Main */}
      {/* -------------------------------------------------- */}

      <main className="max-w-[1500px] mx-auto p-6 lg:p-10">

        {/* Page heading */}

        <div className="mb-8">

          <p className="text-xs font-bold tracking-[0.2em] text-primary mb-2">
            ETA & ROUTING
          </p>


          <h1 className="text-3xl lg:text-4xl font-bold">
            Optimize Mission Routes
          </h1>


          <p className="mt-2 text-muted-foreground max-w-3xl">
            Generate optimized vehicle routes using delivery
            demand, vehicle capacity, and delivery time-window
            constraints.
          </p>

        </div>


        {/* ------------------------------------------------ */}
        {/* Configuration */}
        {/* ------------------------------------------------ */}

        <div className="bg-surface border border-border/50 rounded-2xl p-6 mb-6">

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">

            <div>

              <div className="flex items-center gap-3 mb-2">

                <Truck className="w-6 h-6 text-primary" />

                <h2 className="text-xl font-bold">
                  Fleet Configuration
                </h2>

              </div>


              <p className="text-sm text-muted-foreground mb-5">
                Configure available vehicles.
              </p>


              <label className="block text-xs font-bold tracking-wider text-muted-foreground mb-2">
                VEHICLE COUNT
              </label>


              <select
                value={vehicleCount}
                onChange={(event) => {
                  setVehicleCount(
                    Number(event.target.value)
                  );

                  setResult(null);
                  setEta(null);
                  setError(null);
                }}
                className="h-11 rounded-lg border border-border bg-background px-4 min-w-[220px] outline-none focus:border-primary"
              >
                <option value={1}>
                  1 Vehicle
                </option>

                <option value={2}>
                  2 Vehicles
                </option>

              </select>

            </div>


            <button
              onClick={optimizeRoutes}
              disabled={loading}
              className="h-12 px-8 rounded-lg bg-[#00A859] hover:bg-[#008f4c] disabled:opacity-50 text-white font-bold flex items-center justify-center gap-2 transition-colors"
            >

              <Zap className="w-5 h-5" />

              {loading
                ? "OPTIMIZING..."
                : "OPTIMIZE ROUTES"}

            </button>

          </div>


          {/* Configuration summary */}

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">

            <ConfigItem
              label="Capacity / vehicle"
              value="10 units"
            />

            <ConfigItem
              label="Average speed"
              value="40 km/h"
            />

            <ConfigItem
              label="Service time"
              value="10 min"
            />

          </div>

        </div>


        {/* ------------------------------------------------ */}
        {/* Error */}
        {/* ------------------------------------------------ */}

        {error && (

          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">

            {error}

          </div>

        )}


        {/* ------------------------------------------------ */}
        {/* Results summary */}
        {/* ------------------------------------------------ */}

        {result && (

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

            <Stat
              icon={<Truck className="w-5 h-5" />}
              label="OPTIMIZED VEHICLES"
              value={String(
                result.routes.length
              )}
            />


            <Stat
              icon={<RouteIcon className="w-5 h-5" />}
              label="TOTAL DISTANCE"
              value={`${(
                result.total_distance_meters /
                1000
              ).toFixed(2)} km`}
            />


            <Stat
              icon={<Clock className="w-5 h-5" />}
              label="ML PREDICTED ETA"
              value={
                eta !== null
                  ? `${eta.toFixed(1)} min`
                  : "Calculating..."
              }
            />

          </div>

        )}


        {/* ------------------------------------------------ */}
        {/* Network */}
        {/* ------------------------------------------------ */}

        <div className="bg-surface border border-border/50 rounded-2xl p-6 mb-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <p className="text-xs font-bold tracking-wider text-primary">
                {result
                  ? "OPTIMIZED NETWORK"
                  : "MISSION NETWORK"}
              </p>


              <h2 className="text-xl font-bold mt-1">
                Mission Route Network
              </h2>

            </div>


            <span className="flex items-center gap-2 text-xs font-semibold text-green-500">

              <span className="w-2 h-2 rounded-full bg-green-500" />

              {result
                ? "ROUTES OPTIMIZED"
                : "READY"}

            </span>

          </div>


          {/* SVG network */}

          <div className="h-[460px] rounded-xl border border-border/40 bg-background/50 relative overflow-hidden">

            {/* Grid */}

            <div className="absolute inset-0 opacity-20">

              <div
                className="w-full h-full"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

            </div>


            <svg
              viewBox="0 0 800 420"
              className="absolute inset-0 w-full h-full"
            >

              {/* ---------------------------------------- */}
              {/* Before optimization */}
              {/* ---------------------------------------- */}

              {!result && (

                <path
                  d="M100 320 L280 220 L470 280 L650 120"
                  fill="none"
                  stroke="#64748B"
                  strokeWidth="4"
                  strokeDasharray="10 10"
                  opacity="0.8"
                />

              )}


              {/* ---------------------------------------- */}
              {/* Optimized routes */}
              {/* ---------------------------------------- */}

              {result?.routes.map(
                (optimizedRoute, index) => {

                  const path =
                    buildRoutePath(
                      optimizedRoute.route
                    );

                  const stroke =
                    routeStrokes[
                      index %
                        routeStrokes.length
                    ];


                  return (
                    <g
                      key={
                        optimizedRoute.vehicle_id
                      }
                    >

                      {/* Route line */}

                      <path
                        d={path}
                        fill="none"
                        stroke={stroke}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.9"
                      />


                      {/* Animated vehicle */}

                      {path && (

                        <circle
                          r="9"
                          fill={stroke}
                          stroke="white"
                          strokeWidth="3"
                        >

                          <animateMotion
                            dur={`${5 + index}s`}
                            repeatCount="indefinite"
                            path={path}
                          />

                        </circle>

                      )}

                    </g>
                  );
                }
              )}


              {/* ---------------------------------------- */}
              {/* Network nodes */}
              {/* ---------------------------------------- */}

              {Object.entries(
                nodePositions
              ).map(
                ([nodeId, position]) => {

                  const numericNode =
                    Number(nodeId);

                  const isDepot =
                    numericNode === 0;


                  return (
                    <g
                      key={nodeId}
                    >

                      <circle
                        cx={position.x}
                        cy={position.y}
                        r={
                          isDepot
                            ? 15
                            : 12
                        }
                        fill={
                          isDepot
                            ? "#38BDF8"
                            : "#4ADE80"
                        }
                        stroke="#0B0D18"
                        strokeWidth="4"
                      />


                      <text
                        x={position.x}
                        y={
                          position.y -
                          25
                        }
                        textAnchor="middle"
                        className="fill-current"
                        fontSize="13"
                        fontWeight="700"
                      >
                        {
                          nodeLabels[
                            numericNode
                          ]
                        }
                      </text>

                    </g>
                  );
                }
              )}

            </svg>


            {/* Legend */}

            <div className="absolute bottom-5 left-5 flex items-center gap-5 text-xs text-muted-foreground">

              <div className="flex items-center gap-2">

                <span className="w-3 h-3 rounded-full bg-sky-400" />

                Depot

              </div>


              <div className="flex items-center gap-2">

                <span className="w-3 h-3 rounded-full bg-green-400" />

                Delivery

              </div>


              {result && (
                <div className="flex items-center gap-2">

                  <span className="w-3 h-3 rounded-full bg-[#00A859]" />

                  Vehicle route

                </div>
              )}

            </div>

          </div>

        </div>


        {/* ------------------------------------------------ */}
        {/* Route results */}
        {/* ------------------------------------------------ */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Route cards */}

          <div className="xl:col-span-2 bg-surface border border-border/50 rounded-2xl p-6">

            <div className="flex items-center gap-3 mb-6">

              <RouteIcon className="w-5 h-5 text-primary" />

              <h2 className="font-bold">
                Optimized Vehicle Routes
              </h2>

            </div>


            {!result && (

              <div className="h-48 flex items-center justify-center text-center text-sm text-muted-foreground">

                Run route optimization to generate
                mission routes.

              </div>

            )}


            {result && (

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {result.routes.map(
                  (route, index) => (

                    <div
                      key={route.vehicle_id}
                      className="border border-border/50 rounded-xl p-5"
                    >

                      <div className="flex items-center justify-between mb-4">

                        <div className="flex items-center gap-3">

                          <span
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                routeStrokes[
                                  index %
                                    routeStrokes.length
                                ],
                            }}
                          />

                          <span className="font-bold">
                            Vehicle{" "}
                            {route.vehicle_id + 1}
                          </span>

                        </div>


                        <span className="text-xs font-semibold text-primary">
                          OPTIMIZED
                        </span>

                      </div>


                      <div className="text-sm text-muted-foreground mb-4">

                        {route.route
                          .map(
                            (node) =>
                              nodeLabels[
                                node
                              ] ??
                              `Node ${node}`
                          )
                          .join(" → ")}

                      </div>


                      <div className="flex items-center justify-between text-xs">

                        <span className="text-muted-foreground">
                          Route distance
                        </span>

                        <span className="font-semibold">
                          {(
                            route.distance_meters /
                            1000
                          ).toFixed(2)}{" "}
                          km
                        </span>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>


          {/* ETA card */}

          <div className="bg-surface border border-border/50 rounded-2xl p-6">

            <div className="flex items-center gap-3 mb-6">

              <Clock className="w-5 h-5 text-primary" />

              <h2 className="font-bold">
                Mission ETA
              </h2>

            </div>


            {!result && (

              <div className="h-48 flex items-center justify-center text-center">

                <div>

                  <Clock className="w-10 h-10 mx-auto text-muted-foreground mb-4" />

                  <p className="text-sm text-muted-foreground">
                    ETA will appear after route
                    optimization.
                  </p>

                </div>

              </div>

            )}


            {result && eta !== null && (

              <div>

                <p className="text-xs font-bold tracking-wider text-primary">
                  AI PREDICTION
                </p>


                <div className="text-5xl font-bold mt-3">
                  {eta.toFixed(1)}
                </div>


                <p className="text-lg text-muted-foreground mt-1">
                  minutes
                </p>


                <div className="mt-6 pt-5 border-t border-border/40">

                  <p className="text-xs text-muted-foreground leading-5">
                    ETA generated by the MissionFlow
                    machine-learning prediction service
                    using the optimized mission distance
                    and operational context.
                  </p>

                </div>

              </div>

            )}

          </div>

        </div>

      </main>

    </div>
  );
}


// ============================================================
// Configuration item
// ============================================================

function ConfigItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/40 bg-background/50 px-4 py-3">

      <div className="flex items-center justify-between gap-4">

        <span className="text-sm text-muted-foreground">
          {label}
        </span>

        <span className="font-bold text-sm">
          {value}
        </span>

      </div>

    </div>
  );
}


// ============================================================
// Statistics card
// ============================================================

function Stat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-surface border border-border/50 rounded-xl p-5">

      <div className="flex items-center justify-between mb-4">

        <span className="text-[10px] font-bold tracking-wider text-muted-foreground">
          {label}
        </span>


        <span className="text-primary">
          {icon}
        </span>

      </div>


      <div className="text-2xl font-bold">
        {value}
      </div>

    </div>
  );
}
