import { CodeTabs } from "@/components/CodeBlock";
import { ComplexityPanel, OpLog, type LogEntry } from "@/components/panels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SNIPPETS,
  STRUCTURES,
  type StructureMeta,
} from "@/lib/structures";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Eraser, Link2, Play, Plus, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const meta = STRUCTURES.find((s) => s.slug === "graph") as StructureMeta;

const WIDTH = 660;
const HEIGHT = 420;
const R = 22; // node radius

interface GraphNode {
  id: number;
  label: string;
  x: number;
  y: number;
}

interface GraphEdge {
  a: number;
  b: number;
}

interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nextId: number;
}

const SEED_LABELS = ["A", "B", "C", "D", "E", "F"];
const SEED_EDGES: [string, string][] = [
  ["A", "B"],
  ["A", "C"],
  ["B", "D"],
  ["B", "E"],
  ["C", "E"],
  ["C", "F"],
  ["E", "F"],
];

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function buildSeedGraph(): GraphState {
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2 - 8;
  const nodes = SEED_LABELS.map((label, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return {
      id: i + 1,
      label,
      x: cx + 165 * Math.cos(angle),
      y: cy + 150 * Math.sin(angle),
    };
  });
  const idOf = new Map(nodes.map((n) => [n.label, n.id] as const));
  const edges = SEED_EDGES.map(([a, b]) => ({ a: idOf.get(a)!, b: idOf.get(b)! }));
  return { nodes, edges, nextId: nodes.length };
}

/** Undirected adjacency list: node id → neighbor ids. */
function adjacency(nodes: GraphNode[], edges: GraphEdge[]): Map<number, number[]> {
  const adj = new Map<number, number[]>(nodes.map((n) => [n.id, []]));
  for (const e of edges) {
    adj.get(e.a)?.push(e.b);
    adj.get(e.b)?.push(e.a);
  }
  return adj;
}

/** BFS = queue, DFS = recursive stack. Returns visit order by node id. */
function walkOrder(
  nodes: GraphNode[],
  edges: GraphEdge[],
  startId: number,
  kind: "bfs" | "dfs",
): number[] {
  const adj = adjacency(nodes, edges);
  const order: number[] = [];
  const seen = new Set<number>([startId]);
  if (kind === "bfs") {
    const queue: number[] = [startId];
    while (queue.length) {
      const cur = queue.shift()!;
      order.push(cur);
      for (const n of adj.get(cur) ?? []) {
        if (!seen.has(n)) {
          seen.add(n);
          queue.push(n);
        }
      }
    }
  } else {
    const visit = (cur: number): void => {
      order.push(cur);
      for (const n of adj.get(cur) ?? []) {
        if (!seen.has(n)) {
          seen.add(n);
          visit(n);
        }
      }
    };
    visit(startId);
  }
  return order;
}

/** Trim the line so it starts/ends on the circle's edge, not its center. */
function edgeCoords(a: GraphNode, b: GraphNode) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const pad = R + 3;
  return {
    x1: a.x + ux * pad,
    y1: a.y + uy * pad,
    x2: b.x - ux * pad,
    y2: b.y - uy * pad,
  };
}

export default function GraphPage() {
  const [graph, setGraph] = useState<GraphState>(buildSeedGraph);
  const [linkMode, setLinkMode] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [label, setLabel] = useState("");
  const [traversal, setTraversal] = useState<"bfs" | "dfs">("bfs");
  const [running, setRunning] = useState(false);
  const [visited, setVisited] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const logId = useRef(0);
  const timerRef = useRef<number | null>(null);

  const pushLog = (text: string, tone: LogEntry["tone"]) => {
    logId.current += 1;
    setLog((prev) => [{ id: logId.current, text, tone }, ...prev].slice(0, 30));
  };

  const labelById = useMemo(
    () => new Map(graph.nodes.map((n) => [n.id, n.label] as const)),
    [graph.nodes],
  );
  const adj = useMemo(() => adjacency(graph.nodes, graph.edges), [graph.nodes, graph.edges]);

  const labelOf = (id: number) => labelById.get(id) ?? "?";
  const neighborsOf = (id: number) => (adj.get(id) ?? []).map(labelOf);

  // no timers left behind when leaving the page mid-animation
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, []);

  const addNode = () => {
    if (running) return;
    if (graph.nodes.length >= 10) {
      pushLog("visualizer holds 10 nodes", "info");
      return;
    }
    const name = label.trim().slice(0, 3);
    if (!name) {
      pushLog("type a label for the new node first", "info");
      return;
    }
    if (graph.nodes.some((n) => n.label.toLowerCase() === name.toLowerCase())) {
      pushLog(`node ${name} already exists`, "info");
      return;
    }
    const t = graph.nodes.length;
    const angle = t * 2.4; // golden-angle spiral keeps new nodes spread out
    const radius = 70 + t * 17;
    const id = graph.nextId + 1;
    setGraph((g) => ({
      ...g,
      nodes: [
        ...g.nodes,
        {
          id,
          label: name,
          x: clamp(WIDTH / 2 + radius * Math.cos(angle), 42, WIDTH - 42),
          y: clamp(HEIGHT / 2 - 8 + radius * Math.sin(angle), 40, HEIGHT - 40),
        },
      ],
      nextId: id,
    }));
    pushLog(`addNode(${name})`, "add");
    setLabel("");
  };

  const onNodeClick = (id: number) => {
    if (running) return;
    if (!linkMode) {
      setSelected(id);
      return;
    }
    if (selected === null) {
      setSelected(id);
      pushLog(`link from ${labelOf(id)} — now click the second node`, "info");
      return;
    }
    if (selected === id) {
      setSelected(null);
      return;
    }
    const exists = graph.edges.some(
      (e) => (e.a === selected && e.b === id) || (e.a === id && e.b === selected),
    );
    if (exists) {
      pushLog(`edge ${labelOf(selected)} — ${labelOf(id)} already exists`, "info");
      setSelected(id);
      return;
    }
    setGraph((g) => ({ ...g, edges: [...g.edges, { a: selected, b: id }] }));
    pushLog(`addEdge(${labelOf(selected)}, ${labelOf(id)})`, "add");
    setSelected(id); // keep the target selected so chains are easy
  };

  const run = () => {
    if (running) return;
    if (selected === null) {
      pushLog("click a node to choose where the walk starts", "info");
      return;
    }
    const steps = walkOrder(graph.nodes, graph.edges, selected, traversal);
    if (steps.length === 0) return;
    const startLabel = labelOf(steps[0]);
    setRunning(true);
    setVisited([startLabel]);
    setActive(startLabel);

    let i = 0;
    timerRef.current = window.setInterval(() => {
      i += 1;
      if (i >= steps.length) {
        if (timerRef.current !== null) window.clearInterval(timerRef.current);
        timerRef.current = null;
        setActive(null);
        setRunning(false);
        pushLog(
          `${traversal.toUpperCase()} from ${startLabel} → ${steps.map(labelOf).join(" → ")}`,
          "info",
        );
        return;
      }
      const nextLabel = labelOf(steps[i]);
      setActive(nextLabel);
      setVisited((prev) => [...prev, nextLabel]);
    }, 620);
  };

  const reset = () => {
    if (running) return;
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
    setSelected(null);
    setVisited([]);
    setActive(null);
    setGraph(buildSeedGraph());
    pushLog("reset to the demo graph", "info");
  };

  const clearEdges = () => {
    if (running) return;
    setGraph((g) => ({ ...g, edges: [] }));
    setVisited([]);
    setActive(null);
    pushLog("removed every edge — nodes remain", "info");
  };

  const startLabel = selected !== null ? labelOf(selected) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6">
      {/* header */}
      <header className="max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-300 shadow-[0_0_28px_-8px_rgb(251_191_36/0.7)]">
            <meta.icon className="size-6" />
          </span>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Graph
            </h1>
            <p className="font-mono text-sm text-amber-300">
              nodes &amp; edges — anything can connect
            </p>
          </div>
        </div>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          {meta.blurb} Click a node to set it as the traversal start, then run
          BFS or DFS and watch the visit order unfold against the adjacency
          list.
        </p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* visualizer */}
        <section className="rounded-2xl border border-border/70 bg-card/80 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addNode()}
              placeholder="Label"
              maxLength={3}
              className="w-20 bg-slate-950/60 font-mono uppercase"
              aria-label="New node label"
            />
            <Button
              onClick={addNode}
              className="gap-1.5 bg-amber-400 font-semibold text-slate-950 hover:bg-amber-300"
            >
              <Plus className="size-4" /> Add node
            </Button>
            <Button
              onClick={() => {
                setLinkMode((m) => !m);
                setSelected(null);
              }}
              variant="outline"
              className={cn(
                "gap-1.5",
                linkMode
                  ? "border-amber-400/50 bg-amber-400/15 text-amber-200"
                  : "text-slate-300",
              )}
            >
              <Link2 className="size-4" />
              {linkMode ? "Linking… click two nodes" : "Link mode"}
            </Button>
            <Button
              onClick={clearEdges}
              variant="ghost"
              className="gap-1.5 text-slate-400 hover:text-rose-300"
            >
              <Eraser className="size-4" /> Clear edges
            </Button>
            <Button onClick={reset} variant="outline" className="gap-1.5">
              <RotateCcw className="size-4" /> Reset
            </Button>
          </div>

          {/* traversal controls */}
          <div className="mt-6 rounded-xl border border-border/60 bg-slate-950/40 p-4">
            <div className="flex flex-wrap items-center gap-2">
              {(["bfs", "dfs"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setTraversal(k)}
                  disabled={running}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase transition-all disabled:opacity-50",
                    traversal === k
                      ? "border-amber-400/50 bg-amber-400/15 text-amber-200"
                      : "border-border/70 text-slate-400 hover:border-amber-400/30 hover:text-amber-300",
                  )}
                >
                  {k}
                </button>
              ))}
              <Button
                onClick={run}
                disabled={running}
                variant="outline"
                className="ml-auto gap-1.5 border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20"
              >
                <Play className="size-4" />
                {running
                  ? "Walking…"
                  : `Run ${traversal.toUpperCase()}${startLabel ? ` from ${startLabel}` : ""}`}
              </Button>
            </div>
            <p className="mt-2 font-mono text-[11px] text-slate-500">
              {traversal === "bfs"
                ? "queue — explores level by level"
                : "stack — dives deep before doubling back"}
              {visited.length > 0 && !running && (
                <span className="ml-3 text-amber-300/80">
                  last order: {visited.join(" → ")}
                </span>
              )}
            </p>
          </div>

          {/* canvas */}
          <div className="mt-6 overflow-hidden rounded-xl border border-border/60 bg-slate-950/60">
            <svg
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              className="h-auto w-full"
              role="img"
              aria-label="Graph diagram"
            >
              {/* edges */}
              {graph.edges.map((e) => {
                const a = graph.nodes.find((n) => n.id === e.a);
                const b = graph.nodes.find((n) => n.id === e.b);
                if (!a || !b) return null;
                const { x1, y1, x2, y2 } = edgeCoords(a, b);
                const lit = visited.includes(a.label) && visited.includes(b.label);
                return (
                  <motion.line
                    key={`${e.a}-${e.b}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={lit ? "#fbbf2466" : "#334155"}
                    strokeWidth={lit ? 2 : 1.5}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.35 }}
                  />
                );
              })}
              {/* nodes */}
              {graph.nodes.map((n) => {
                const isActive = active === n.label;
                const isVisited = visited.includes(n.label);
                const isStart = selected === n.id;
                return (
                  <motion.g
                    key={n.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{
                      originX: `${n.x}px`,
                      originY: `${n.y}px`,
                      cursor: running ? "default" : "pointer",
                    }}
                    onClick={() => onNodeClick(n.id)}
                  >
                    {isStart && (
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={R + 6}
                        fill="none"
                        stroke="#fbbf24"
                        strokeOpacity={0.55}
                        strokeDasharray="4 4"
                      />
                    )}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={R}
                      fill={isActive ? "#78350f" : isVisited ? "#451a03" : "#0f172a"}
                      stroke={isActive ? "#fbbf24" : isVisited ? "#fbbf2488" : "#475569"}
                      strokeWidth={isActive ? 2.5 : 1.5}
                      style={
                        isActive
                          ? { filter: "drop-shadow(0 0 10px rgb(251 191 36 / 0.85))" }
                          : undefined
                      }
                    />
                    <text
                      x={n.x}
                      y={n.y + 4.5}
                      textAnchor="middle"
                      className="fill-slate-100 font-mono text-[13px] font-semibold"
                    >
                      {n.label}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </div>

          {/* live readout */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="font-mono">
              {visited.length > 0
                ? `visited: ${visited.join(" → ")}`
                : "no walk yet — click a node to pick a start"}
            </span>
            <span>
              {graph.nodes.length} nodes · {graph.edges.length} edges
            </span>
          </div>
        </section>

        {/* side panels */}
        <div className="flex flex-col gap-6">
          <ComplexityPanel meta={meta} highlightKey={running ? "search" : null} />
          <div className="rounded-2xl border border-border/70 bg-card/80 p-5">
            <p className="text-sm font-semibold">Adjacency list</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              each node maps to its neighbors
            </p>
            <div className="mt-3 max-h-64 space-y-1.5 overflow-y-auto pr-1">
              {graph.nodes.map((n) => (
                <div
                  key={n.id}
                  className="flex items-center gap-2 rounded-lg bg-slate-950/50 px-3 py-1.5 font-mono text-xs"
                >
                  <span className="font-semibold text-amber-300">{n.label}</span>
                  <span className="text-slate-500">→</span>
                  <span className="truncate text-slate-300">
                    {neighborsOf(n.id).join(", ") || "isolated"}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <OpLog entries={log} />
        </div>
      </div>

      {/* code */}
      <section className="mt-12">
        <h2 className="text-xl font-bold tracking-tight">Implementation</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          An adjacency list keeps every neighbor one lookup away; BFS runs on
          the queue you met on its own page, DFS on a stack.
        </p>
        <div className="mt-5">
          <CodeTabs snippets={SNIPPETS.graph} meta={meta} />
        </div>
      </section>
    </div>
  );
}
