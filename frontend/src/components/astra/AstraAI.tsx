import { useState } from "react";
import type { FormEvent } from "react";
import {
  Activity,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  MapPinned,
  Route,
  Send,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";

type AstraResponse = {
  message: string;
  tool?: string | null;
  data?: Record<string, unknown> | null;
};

const API_URL = "http://127.0.0.1:8000/ai/astra/chat";

type ToolCardProps = {
  response: AstraResponse | null;
};

function ToolResultCard({ response }: ToolCardProps) {
  if (!response?.tool || !response.data) {
    return null;
  }

  const data = response.data;

  if (response.tool === "predict_delivery_eta") {
    const eta = Number(data.predicted_eta_minutes ?? 0);

    return (
      <div className="mt-3 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.05] p-3">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
          <Clock3 size={13} />
          ETA Prediction
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-semibold text-white">
              {eta.toFixed(1)}
              <span className="ml-1 text-sm font-normal text-slate-400">
                min
              </span>
            </div>

            <div className="mt-1 text-[10px] text-slate-500">
              AI-powered delivery estimate
            </div>
          </div>

          <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 p-2 text-cyan-300">
            <Zap size={18} />
          </div>
        </div>
      </div>
    );
  }

  if (response.tool === "optimize_routes") {
    const totalDistance =
      Number(data.total_distance_meters ?? 0) / 1000;

    const routes = Array.isArray(data.routes)
      ? data.routes
      : [];

    return (
      <div className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] p-3">
        <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
          <Route size={13} />
          Route Optimization
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-white/5 bg-black/20 p-2">
            <div className="text-[9px] uppercase tracking-wider text-slate-500">
              Total Distance
            </div>

            <div className="mt-1 text-lg font-semibold text-white">
              {totalDistance.toFixed(2)}
              <span className="ml-1 text-xs text-slate-400">
                km
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-white/5 bg-black/20 p-2">
            <div className="text-[9px] uppercase tracking-wider text-slate-500">
              Routes
            </div>

            <div className="mt-1 text-lg font-semibold text-white">
              {routes.length}
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          {routes.map((route, index) => {
            const item = route as Record<string, unknown>;

            const vehicleId = item.vehicle_id;

            const distance =
              Number(item.distance_meters ?? 0) / 1000;

            return (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-black/10 px-2.5 py-2 text-[10px]"
              >
                <span className="flex items-center gap-2 text-slate-300">
                  <Truck size={12} />
                  Vehicle {String(vehicleId)}
                </span>

                <span className="text-emerald-300">
                  {distance.toFixed(2)} km
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (response.tool === "get_operations_summary") {
    return (
      <div className="mt-3 rounded-xl border border-violet-400/20 bg-violet-400/[0.05] p-3">
        <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300">
          <Activity size={13} />
          Operations Snapshot
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-white/5 bg-black/20 p-2 text-center">
            <div className="text-lg font-semibold text-white">
              {String(data.vehicle_count ?? 0)}
            </div>

            <div className="text-[8px] uppercase tracking-wider text-slate-500">
              Vehicles
            </div>
          </div>

          <div className="rounded-lg border border-white/5 bg-black/20 p-2 text-center">
            <div className="text-lg font-semibold text-emerald-300">
              {String(data.active_vehicle_count ?? 0)}
            </div>

            <div className="text-[8px] uppercase tracking-wider text-slate-500">
              Active
            </div>
          </div>

          <div className="rounded-lg border border-white/5 bg-black/20 p-2 text-center">
            <div className="text-lg font-semibold text-cyan-300">
              {String(data.active_delivery_count ?? 0)}
            </div>

            <div className="text-[8px] uppercase tracking-wider text-slate-500">
              Deliveries
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function AstraAI() {
  const [message, setMessage] = useState("");

  const [reply, setReply] = useState(
    "Mission intelligence online. I can analyze ETA, routes, fleet activity, and operational status."
  );

  const [lastResponse, setLastResponse] =
    useState<AstraResponse | null>(null);

  const [loading, setLoading] = useState(false);

  async function sendMessage(
    event?: FormEvent,
    presetMessage?: string
  ) {
    event?.preventDefault();

    const text = (presetMessage ?? message).trim();

    if (!text || loading) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Astra API returned ${response.status}`
        );
      }

      const data: AstraResponse = await response.json();

      setReply(data.message);
      setLastResponse(data);
      setMessage("");
    } catch {
      setReply(
        "Astra could not reach the MissionFlow intelligence service. Verify that the backend is running."
      );

      setLastResponse(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-cyan-400/15 bg-[#081321]/90 shadow-[0_0_35px_rgba(34,211,238,0.06)]">

      <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 -right-16 h-44 w-44 rounded-full bg-emerald-400/5 blur-3xl" />

      <div className="relative p-5">

        {/* HEADER */}

        <div className="mb-5 flex items-start justify-between">

          <div className="flex items-center gap-3">

            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10">

              <BrainCircuit
                size={23}
                className="text-cyan-300"
              />

              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#081321] bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />

            </div>

            <div>

              <div className="flex items-center gap-2">

                <h2 className="text-sm font-semibold tracking-[0.16em] text-white">
                  ASTRA
                </h2>

                <Sparkles
                  size={13}
                  className="text-cyan-300"
                />

              </div>

              <p className="mt-0.5 text-[9px] uppercase tracking-[0.18em] text-slate-500">
                Mission Intelligence Partner
              </p>

            </div>

          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/5 px-2.5 py-1">

            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

            <span className="text-[8px] font-semibold tracking-[0.14em] text-emerald-300">
              ONLINE
            </span>

          </div>

        </div>

        {/* STATUS */}

        <div className="mb-3 flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-slate-500">

          <Bot
            size={12}
            className="text-cyan-300"
          />

          Intelligence Core

          <span className="text-slate-700">
            •
          </span>

          Live Mission Context

        </div>

        {/* RESPONSE */}

        <div className="rounded-xl border border-cyan-300/10 bg-[#0b1929]/90 p-3.5">

          <div className="flex gap-2.5">

            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10">

              <Bot
                size={13}
                className="text-cyan-300"
              />

            </div>

            <div className="min-w-0">

              <div className="mb-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-300">
                Astra
              </div>

              <p className="text-xs leading-5 text-slate-300">

                {loading ? (
                  <span className="flex items-center gap-2 text-slate-400">

                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />

                    Analyzing mission data...

                  </span>
                ) : (
                  reply
                )}

              </p>

            </div>

          </div>

          <ToolResultCard response={lastResponse} />

        </div>

        {/* QUICK COMMANDS */}

        <div className="mt-4">

          <div className="mb-2 text-[8px] font-semibold uppercase tracking-[0.18em] text-slate-600">
            Quick Command
          </div>

          <div className="grid grid-cols-3 gap-2">

            <button
              type="button"
              onClick={() =>
                sendMessage(
                  undefined,
                  "Predict the ETA"
                )
              }
              disabled={loading}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-white/7 bg-white/[0.025] px-2 py-2.5 text-[9px] font-medium text-slate-400 transition hover:border-cyan-300/20 hover:bg-cyan-300/5 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Clock3 size={12} />
              ETA
            </button>

            <button
              type="button"
              onClick={() =>
                sendMessage(
                  undefined,
                  "Optimize the routes"
                )
              }
              disabled={loading}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-white/7 bg-white/[0.025] px-2 py-2.5 text-[9px] font-medium text-slate-400 transition hover:border-emerald-300/20 hover:bg-emerald-300/5 hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Route size={12} />
              Routes
            </button>

            <button
              type="button"
              onClick={() =>
                sendMessage(
                  undefined,
                  "Show fleet status"
                )
              }
              disabled={loading}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-white/7 bg-white/[0.025] px-2 py-2.5 text-[9px] font-medium text-slate-400 transition hover:border-violet-300/20 hover:bg-violet-300/5 hover:text-violet-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Truck size={12} />
              Fleet
            </button>

          </div>

        </div>

        {/* INPUT */}

        <form
          onSubmit={sendMessage}
          className="mt-4"
        >

          <div className="flex items-center rounded-xl border border-white/10 bg-black/20 p-1.5 transition focus-within:border-cyan-300/25">

            <MapPinned
              size={14}
              className="ml-2 text-slate-600"
            />

            <input
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              placeholder="Ask Astra..."
              disabled={loading}
              className="min-w-0 flex-1 bg-transparent px-2.5 py-2 text-[11px] text-slate-200 outline-none placeholder:text-slate-600"
            />

            <button
              type="submit"
              disabled={
                loading || !message.trim()
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Send command"
            >
              <Send size={14} />
            </button>

          </div>

        </form>

        {/* FOOTER */}

        <div className="mt-3 flex items-center justify-between text-[8px] uppercase tracking-[0.14em] text-slate-700">

          <span>
            AI Operations Core
          </span>

          <span className="flex items-center gap-1.5">

            <CheckCircle2 size={10} />

            Mission Ready

          </span>

        </div>

      </div>

    </section>
  );
}
