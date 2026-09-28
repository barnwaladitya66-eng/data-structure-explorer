import { OpLog, type LogEntry } from "@/components/panels";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Flag, MapPin, Navigation, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* City map data — intersections, roads, travel times (minutes)        */
/* ------------------------------------------------------------------ */

interface CityNode {
  id: number;
  code: string;
  name: string;
  x: number;
  y: number;
}

interface CityRoad {
  a: number;
  b: number;
  w: number;
  road: string;
}

const WIDTH = 660;
const HEIGHT = 420;

const CITY: CityNode[] = [
  { id: 0, code: "A", name: "Harbor St", x: 60, y: 70 },
  { id: 1, code: "B", name: "Bay Ave", x: 220, y: 50 },
  { id: 2, code: "C", name: "Museum Sq", x: 420, y: 60 },
  { id: 3, code: "D", name: "Cedar Ave", x: 590, y: 90 },
  { id: 4, code: "E", name: "Depot Rd", x: 80, y: 210 },
  { id: 5, code: "F", name: "Central Xing", x: 250, y: 200 },
  { id: 6, code: "G", name: "Union St", x: 450, y: 190 },
  { id: 7, code: "H", name: "Eastgate", x: 600, y: 220 },
  { id: 8, code: "I", name: "Mill Ln", x: 70, y: 340 },
  { id: 9, code: "J", name: "Old Town", x: 240, y: 350 },
  { id: 10, code: "K", name: "Riverside", x: 430, y: 330 },
  { id: 11, code: "L", name: "South Pier", x: 590, y: 360 },
];

const ROADS: CityRoad[] = [
  { a: 0, b: 1, w: 4, road: "Harbor Blvd" },
  { a: 1, b: 2, w: 5, road: "Bay Ave" },
  { a: 2, b: 3, w: 3, road: "Museum Way" },
  { a: 0, b: 4, w: 6, road: "Dock Spur" },
  { a: 1, b: 5, w: 3, road: "Bay Ave" },
  { a: 2, b: 6, w: 4, road: "Museum Way" },
  { a: 3, b: 7, w: 5, road: "Cedar Ave" },
  { a: 1, b: 4, w: 8, road: "Industrial Rd" },
  { a: 4, b: 5, w: 5, road: "Depot Rd" },
  { a: 5, b: 6, w: 2, road: "Union Passage" },
  { a: 6, b: 7, w: 4, road: "Union St" },
  { a: 4, b: 8, w: 7, road: "Mill Rd" },
  { a: 5, b: 9, w: 6, road: "Old Town Rd" },
  { a: 6, b: 10, w: 5, road: "River Bridge" },
  { a: 7, b: 11, w: 6, road: "Eastgate Dr" },
  { a: 8, b: 9, w: 4, road: "Mill Ln" },
  { a: 9, b: 10, w: 3, road: "Riverside Walk" },
  { a: 10, b: 11, w: 5, road: "Pier Rd" },
  { a: 2, b: 5, w: 7, road: "Crosstown Expwy" },
];

const PRESETS = [
  { label: "Harbor → South Pier", from: "A", to: "L" },
  { label: "Mill Ln → Eastgate", from: "I", to: "H" },
  { label: "Cedar Ave → Old Town", from: "D", to: "J" },
];

/* ------------------------------------------------------------------ */
/* Dijkstra with a recorded step log, so the search can be replayed    */
/* ------------------------------------------------------------------ */

type DijStep =
  | { kind: "settle"; node: number; dist: number }
  | { kind: "relax"; from: number; to: number; dist: number; improved: boolean };

function dijkstraSteps(
  start: number,
  target: number,
): { steps: DijStep[]; dist: Map<number, number>; prev: Map<number, number> } {
  const dist = new Map<number, number>(CITY.map((n) => [n.id, Infinity]));
  const prev = new Map<number, number>();
  const settled = new Set<number>();
  dist.set(start, 0);
  const steps: DijStep[] = [];

  while (true) {
    // pick the unsettled node with the smallest known distance
    let cur = -1;
    let best = Infinity;
    for (const n of CITY) {
      if (!settled.has(n.id) && (dist.get(n.id) ?? Infinity) < best) {
        cur = n.id;
        best = dist.get(n.id) ?? Infinity;
      }
    }
    if (cur === -1) break;
    settled.add(cur);
    steps.push({ kind: "settle", node: cur, dist: best });
    if (cur === target) break; // GPS stops as soon as the destination is settled

    for (const road of ROADS) {
      const to =
        road.a === cur ? road.b : road.b === cur ? road.a : -1;
      if (to === -1 || settled.has(to)) continue;
      const nd = best + road.w;
      const improved = nd < (dist.get(to) ?? Infinity);
      if (improved) {
        dist.set(to, nd);
        prev.set(to, cur);
      }
      steps.push({ kind: "relax", from: cur, to, dist: nd, improved });
    }
  }
  return { steps, dist, prev };
}

function shortestPath(
  start: number,
  target: number,
  prev: Map<number, number>,
): number[] {
  const path = [target];
  let cur = target;
  while (cur !== start) {
    const p = prev.get(cur);
    if (p === undefined) return [];
    path.unshift(p);
    cur = p;
  }
  return path;
}

function roadBetween(a: number, b: number): CityRoad | undefined {
  return ROADS.find(
    (r) => (r.a === a && r.b === b) || (r.a === b && r.b === a),
  );
}

/** Compass heading for a road, given SVG coords (y grows downward). */
function heading(a: CityNode, b: CityNode): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const deg = (Math.atan2(-dy, dx) * 180) / Math.PI;
  const dirs = ["east", "northeast", "north", "northwest", "west", "southwest", "south", "southeast"];
  return dirs[Math.round(((deg + 360) % 360) / 45) % 8];
}

type Phase = "pick" | "exploring" | "routed" | "driving";

/* ------------------------------------------------------------------ */
/* GpsMap — Dijkstra-powered route planner on a city map               */
/* ------------------------------------------------------------------ */

export function GpsMap() {
  const [start, setStart] = useState<number | null>(null);
  const [dest, setDest] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("pick");
  const [stepIdx, setStepIdx] = useState(0);
  const [steps, setSteps] = useState<DijStep[]>([]);
  const [path, setPath] = useState<number[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const logId = useRef(0);
  const timerRef = useRef<number | null>(null);

  const nodeById = useMemo(
    () => new Map(CITY.map((n) => [n.id, n] as const)),
    [],
  );

  const pushLog = (text: string, tone: LogEntry["tone"]) => {
    logId.current += 1;
    setLog((prev) => [{ id: logId.current, text, tone }, ...prev].slice(0, 30));
  };

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, []);

  /** Replay the recorded steps up to stepIdx. */
  const play = useMemo(() => {
    const dist = new Map<number, number>(CITY.map((n) => [n.id, Infinity]));
    const prev = new Map<number, number>();
    const settled = new Set<number>();
    let relaxing: { from: number; to: number; improved: boolean } | null = null;
    dist.set(start ?? -1, 0);
    for (let i = 0; i < stepIdx && i < steps.length; i++) {
      const s = steps[i];
      if (s.kind === "settle") {
        settled.add(s.node);
      } else {
        relaxing = { from: s.from, to: s.to, improved: s.improved };
        if (s.improved) {
          dist.set(s.to, s.dist);
          prev.set(s.to, s.from);
        }
      }
    }
    return { dist, prev, settled, relaxing };
  }, [steps, stepIdx, start]);

  const runRoute = () => {
    if (phase !== "pick" || start === null || dest === null) return;
    const result = dijkstraSteps(start, dest);
    setSteps(result.steps);
    setStepIdx(0);
    setPath([]);
    setPhase("exploring");
    pushLog(
      `plan route: ${nodeById.get(start)!.name} → ${nodeById.get(dest)!.name}`,
      "info",
    );
    let i = 0;
    timerRef.current = window.setInterval(() => {
      i += 1;
      if (i >= result.steps.length) {
        if (timerRef.current !== null) window.clearInterval(timerRef.current);
        timerRef.current = null;
        const finalPath = shortestPath(start, dest, result.prev);
        setPath(finalPath);
        setPhase("routed");
        pushLog(
          `shortest route found — ${result.dist.get(dest) ?? "?"} min via ${finalPath.length - 1} roads`,
          "add",
        );
        // start the drive after a beat
        window.setTimeout(() => setPhase((p) => (p === "routed" ? "driving" : p)), 900);
        return;
      }
      setStepIdx(i);
    }, 480);
  };

  const newTrip = () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
    setPhase("pick");
    setStart(null);
    setDest(null);
    setSteps([]);
    setStepIdx(0);
    setPath([]);
    pushLog("new trip — pick a start, then a destination", "info");
  };

  const applyPreset = (from: string, to: string) => {
    if (phase === "exploring") return;
    newTrip();
    const s = CITY.find((n) => n.code === from)?.id ?? null;
    const d = CITY.find((n) => n.code === to)?.id ?? null;
    setStart(s);
    setDest(d);
    pushLog(`preset trip: ${from} → ${to}`, "info");
  };

  const onNodeClick = (id: number) => {
    if (phase === "exploring") return;
    if (phase !== "pick") {
      newTrip();
      setStart(id);
      return;
    }
    if (start === null) {
      setStart(id);
      pushLog(`start: ${nodeById.get(id)!.name}`, "info");
      return;
    }
    if (id === start) return;
    setDest(id);
    pushLog(`destination: ${nodeById.get(id)!.name}`, "info");
  };

  // turn-by-turn directions for the found path
  const directions = useMemo(() => {
    const list: { road: string; to: string; w: number; dir: string }[] = [];
    for (let i = 0; i < path.length - 1; i++) {
      const road = roadBetween(path[i], path[i + 1]);
      if (!road) continue;
      const from = nodeById.get(path[i])!;
      const to = nodeById.get(path[i + 1])!;
      list.push({ road: road.road, to: to.name, w: road.w, dir: heading(from, to) });
    }
    return list;
  }, [path, nodeById]);

  const eta = phase === "routed" || phase === "driving" ? play.dist.get(dest ?? -1) ?? Infinity : Infinity;
  const etaText = Number.isFinite(eta) ? `${eta} min` : "—";

  // car animation keyframes along the path
  const car = useMemo(() => {
    if (phase !== "driving" || path.length < 2) return null;
    const xs = path.map((id) => nodeById.get(id)!.x);
    const ys = path.map((id) => nodeById.get(id)!.y);
    let total = 0;
    const segs: number[] = [];
    for (let i = 0; i < path.length - 1; i++) {
      const w = roadBetween(path[i], path[i + 1])?.w ?? 1;
      segs.push(w);
      total += w;
    }
    const times = [0];
    let acc = 0;
    for (const w of segs) {
      acc += w;
      times.push(acc / total);
    }
    return { xs, ys, times, duration: total * 0.3 };
  }, [phase, path, nodeById]);

  const routeEdges = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < path.length - 1; i++) {
      set.add(`${Math.min(path[i], path[i + 1])}-${Math.max(path[i], path[i + 1])}`);
    }
    return set;
  }, [path]);

  const statusText =
    phase === "pick"
      ? start === null
        ? "click an intersection to set your start"
        : dest === null
          ? "now click the destination"
          : "ready — run the route"
      : phase === "exploring"
        ? "Dijkstra is exploring roads…"
        : phase === "routed"
          ? `shortest route found — ETA ${etaText}`
          : "en route — follow the blue car";

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold tracking-tight">
        GPS navigation — Dijkstra in the wild
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Your maps app is a weighted graph: intersections are nodes, roads are
        edges, and travel time is the weight. Dijkstra settles the closest
        intersection again and again until your destination is reached — watch
        the frontier spread, then follow the car home.
      </p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* map */}
        <div className="rounded-2xl border border-border/70 bg-card/80 p-6">
          <div className="flex flex-wrap items-center gap-2">
            {PRESETS.map((p) => (
              <Button
                key={p.label}
                onClick={() => applyPreset(p.from, p.to)}
                variant="outline"
                size="sm"
                className="gap-1.5 text-slate-300"
              >
                <MapPin className="size-3.5 text-cyan-300" />
                {p.label}
              </Button>
            ))}
            <Button
              onClick={runRoute}
              disabled={phase !== "pick" || start === null || dest === null}
              size="sm"
              className="ml-auto gap-1.5 bg-cyan-400 font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-40"
            >
              <Play className="size-3.5" /> Run route
            </Button>
            {phase !== "pick" && (
              <Button
                onClick={newTrip}
                variant="ghost"
                size="sm"
                className="gap-1.5 text-slate-400 hover:text-rose-300"
              >
                <RotateCcw className="size-3.5" /> New trip
              </Button>
            )}
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-border/60 bg-slate-950/60">
            <svg
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              className="h-auto w-full"
              role="img"
              aria-label="City map with GPS route"
            >
              {/* city blocks backdrop */}
              {[
                { x: 130, y: 90, w: 90, h: 70 },
                { x: 300, y: 100, w: 110, h: 60 },
                { x: 140, y: 240, w: 80, h: 70 },
                { x: 310, y: 240, w: 110, h: 60 },
                { x: 480, y: 260, w: 90, h: 60 },
                { x: 480, y: 110, w: 90, h: 50 },
              ].map((b, i) => (
                <rect
                  key={i}
                  x={b.x}
                  y={b.y}
                  width={b.w}
                  height={b.h}
                  rx={8}
                  fill="#0f172a"
                  stroke="#1e293b"
                />
              ))}

              {/* roads */}
              {ROADS.map((r, i) => {
                const a = nodeById.get(r.a)!;
                const b = nodeById.get(r.b)!;
                const key = `${Math.min(r.a, r.b)}-${Math.max(r.a, r.b)}`;
                const onRoute = routeEdges.has(key);
                const isRelaxing =
                  phase === "exploring" &&
                  play.relaxing?.from === r.a &&
                  play.relaxing?.to === r.b;
                const bothSettled = play.settled.has(r.a) && play.settled.has(r.b);
                return (
                  <g key={i}>
                    <line
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke={onRoute ? "#22d3ee" : bothSettled ? "#fbbf2444" : "#1e293b"}
                      strokeWidth={onRoute ? 7 : 6}
                      strokeLinecap="round"
                      style={
                        onRoute ? { filter: "drop-shadow(0 0 6px rgb(34 211 238 / 0.5))" } : undefined
                      }
                    />
                    <line
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke="#334155"
                      strokeWidth={1}
                      strokeDasharray="6 6"
                    />
                    {(onRoute || isRelaxing) && (
                      <text
                        x={(a.x + b.x) / 2}
                        y={(a.y + b.y) / 2 - 7}
                        textAnchor="middle"
                        className={cn(
                          "font-mono text-[10px] font-bold",
                          onRoute ? "fill-cyan-300" : "fill-amber-300",
                        )}
                      >
                        {r.w}m
                      </text>
                    )}
                  </g>
                );
              })}

              {/* intersections */}
              {CITY.map((n) => {
                const isStart = start === n.id;
                const isDest = dest === n.id;
                const isSettled = play.settled.has(n.id);
                const d = play.dist.get(n.id) ?? Infinity;
                const known = Number.isFinite(d);
                return (
                  <g
                    key={n.id}
                    style={{ cursor: phase === "exploring" ? "default" : "pointer" }}
                    onClick={() => onNodeClick(n.id)}
                  >
                    <title>{n.name}</title>
                    {isStart && (
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={16}
                        fill="none"
                        stroke="#22d3ee"
                        strokeOpacity={0.6}
                        strokeDasharray="4 4"
                      />
                    )}
                    {isDest && (
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={16}
                        fill="none"
                        stroke="#34d399"
                        strokeOpacity={0.6}
                        strokeDasharray="4 4"
                      />
                    )}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={11}
                      fill={isSettled ? "#082f49" : "#0b1220"}
                      stroke={
                        isStart ? "#22d3ee" : isDest ? "#34d399" : isSettled ? "#22d3ee66" : "#475569"
                      }
                      strokeWidth={isStart || isDest ? 2.5 : 1.5}
                    />
                    <text
                      x={n.x}
                      y={n.y + 3.5}
                      textAnchor="middle"
                      className="fill-slate-100 font-mono text-[10px] font-bold"
                    >
                      {n.code}
                    </text>
                    {known && (
                      <text
                        x={n.x}
                        y={n.y - 16}
                        textAnchor="middle"
                        className={cn(
                          "font-mono text-[10px]",
                          isSettled ? "fill-cyan-300" : "fill-amber-300/80",
                        )}
                      >
                        {d}m
                      </text>
                    )}
                  </g>
                );
              })}

              {/* driving car */}
              {car && (
                <motion.circle
                  r={7}
                  fill="#22d3ee"
                  stroke="#0b1220"
                  strokeWidth={2}
                  style={{ filter: "drop-shadow(0 0 8px rgb(34 211 238 / 0.9))" }}
                  initial={{ cx: car.xs[0], cy: car.ys[0], opacity: 0 }}
                  animate={{
                    cx: car.xs,
                    cy: car.ys,
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    cx: { duration: car.duration, times: car.times, ease: "linear", repeat: Infinity, repeatDelay: 0.8 },
                    cy: { duration: car.duration, times: car.times, ease: "linear", repeat: Infinity, repeatDelay: 0.8 },
                    opacity: { duration: car.duration + 0.8, times: [0, 0.05, 0.95, 1], ease: "linear", repeat: Infinity },
                  }}
                />
              )}

              {/* compass */}
              <g opacity={0.55}>
                <text x={24} y={30} className="fill-slate-500 font-mono text-[11px] font-bold">
                  N
                </text>
                <line x1={27} y1={44} x2={27} y2={26} stroke="#475569" strokeWidth={1.5} />
                <polygon points="27,22 24,29 30,29" fill="#475569" />
              </g>
            </svg>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-mono text-muted-foreground">{statusText}</span>
            <span className="font-mono text-slate-500">
              {phase === "exploring"
                ? `${play.settled.size}/${CITY.length} settled`
                : `${CITY.length} intersections · ${ROADS.length} roads`}
            </span>
          </div>
        </div>

        {/* directions + log */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border/70 bg-card/80 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="size-4 text-cyan-300" />
                <p className="text-sm font-semibold">Turn-by-turn</p>
              </div>
              {(phase === "routed" || phase === "driving") && (
                <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-cyan-300">
                  ETA {etaText}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              the shortest path, road by road
            </p>
            <div className="mt-3 max-h-72 space-y-1.5 overflow-y-auto pr-1">
              {directions.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  Run a route to get directions.
                </p>
              ) : (
                directions.map((d, i) => (
                  <motion.div
                    key={`${d.road}-${i}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-2 rounded-lg bg-slate-950/50 px-3 py-1.5 text-xs"
                  >
                    <span className="font-mono font-bold text-cyan-300">{i + 1}.</span>
                    <span className="flex-1 truncate text-slate-300">
                      Head {d.dir} on <span className="font-semibold text-slate-100">{d.road}</span>
                    </span>
                    <span className="font-mono text-slate-500">{d.w} min</span>
                  </motion.div>
                ))
              )}
            </div>
            {phase === "driving" && (
              <p className="mt-3 flex items-center gap-1.5 border-t border-border/60 pt-3 font-mono text-[11px] text-cyan-300/90">
                <Flag className="size-3.5" /> you have arrived — loop repeats the drive
              </p>
            )}
          </div>
          <OpLog entries={log} />
        </div>
      </div>
    </section>
  );
}
