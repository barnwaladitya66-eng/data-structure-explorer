import { CodeTabs } from "@/components/CodeBlock";
import { ComplexityPanel, OpLog, type LogEntry } from "@/components/panels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TREE_CODE_JS,
  TREE_CODE_PY,
  STRUCTURES,
  type StructureMeta,
} from "@/lib/structures";
import { cn } from "@/lib/utils";
import {
  bstInsert,
  countNodes,
  makeNode,
  treeDepth,
  traversalSteps,
  type BSTNode,
  type TraversalKind,
} from "@/lib/bst";
import { motion } from "framer-motion";
import { Play, RotateCcw, Sprout } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const meta = STRUCTURES.find((s) => s.slug === "tree") as StructureMeta;

const WIDTH = 660;
const TOP = 44;
const ROW = 82;
const R = 22; // node radius

const SEED_VALUES = [50, 30, 70, 20, 40, 60, 80];

function buildSeedTree(): BSTNode | null {
  let root: BSTNode | null = null;
  for (const v of SEED_VALUES) root = bstInsert(root, v);
  return root;
}

/* ------------------------------------------------------------------ */
/* Layout — inorder x positions keep the drawing tidy at any shape     */
/* ------------------------------------------------------------------ */

interface LaidNode {
  node: BSTNode;
  x: number;
  y: number;
  depth: number;
}

interface LaidEdge {
  from: LaidNode;
  to: LaidNode;
}

function layoutTree(root: BSTNode | null): { nodes: LaidNode[]; edges: LaidEdge[] } {
  if (!root) return { nodes: [], edges: [] };

  const inorder: BSTNode[] = [];
  const walkAll = (n: BSTNode | null) => {
    if (!n) return;
    walkAll(n.left);
    inorder.push(n);
    walkAll(n.right);
  };
  walkAll(root);

  const count = inorder.length;
  const slot = WIDTH / count;
  const xById = new Map<number, number>();
  inorder.forEach((n, i) => xById.set(n.id, (i + 0.5) * slot));

  const nodes: LaidNode[] = [];
  const edges: LaidEdge[] = [];
  const place = (n: BSTNode | null, depth: number, parent: LaidNode | null) => {
    if (!n) return;
    const laid: LaidNode = {
      node: n,
      x: xById.get(n.id) ?? WIDTH / 2,
      y: TOP + depth * ROW,
      depth,
    };
    nodes.push(laid);
    if (parent) edges.push({ from: parent, to: laid });
    place(n.left, depth + 1, laid);
    place(n.right, depth + 1, laid);
  };
  place(root, 0, null);

  return { nodes, edges };
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const TRAVERSALS: { kind: TraversalKind; label: string; hint: string }[] = [
  { kind: "preorder", label: "Preorder", hint: "root → left → right" },
  { kind: "inorder", label: "Inorder", hint: "left → root → right · sorted!" },
  { kind: "postorder", label: "Postorder", hint: "left → right → root" },
];

export default function TreePage() {
  const [root, setRoot] = useState<BSTNode | null>(buildSeedTree);
  const [value, setValue] = useState("");
  const [log, setLog] = useState<LogEntry[]>([]);
  const logId = useRef(0);

  const [traversal, setTraversal] = useState<TraversalKind>("inorder");
  const [visitedIds, setVisitedIds] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const stepIndex = useRef(0);

  const pushLog = (text: string, tone: LogEntry["tone"]) => {
    logId.current += 1;
    setLog((prev) => [{ id: logId.current, text, tone }, ...prev].slice(0, 30));
  };

  const { nodes, edges } = useMemo(() => layoutTree(root), [root]);
  const depth = useMemo(() => treeDepth(root), [root]);
  const nodeCount = useMemo(() => countNodes(root), [root]);

  const insert = () => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      pushLog("enter a number to insert", "info");
      return;
    }
    if (running) return;
    // duplicate values fall into the right subtree (value >= node goes right)
    setRoot((prev) => {
      const next = bstInsert(prev, parsed);
      return next ? { ...next } : next;
    });
    pushLog(`insert(${parsed})`, "add");
    setValue("");
  };

  const reset = () => {
    if (running) return;
    setVisitedIds([]);
    setActiveId(null);
    setRoot(buildSeedTree());
    pushLog(`replanted demo tree (${SEED_VALUES.join(", ")})`, "info");
  };

  const runTraversal = () => {
    if (running || !root) {
      if (!root) pushLog("tree is empty — insert something first", "info");
      return;
    }
    const steps = traversalSteps(root, traversal);
    if (steps.length === 0) return;
    setRunning(true);
    setVisitedIds([]);
    stepIndex.current = 0;
    setActiveId(steps[0].id);
    setVisitedIds([steps[0].id]);

    const timer = window.setInterval(() => {
      stepIndex.current += 1;
      if (stepIndex.current >= steps.length) {
        window.clearInterval(timer);
        setActiveId(null);
        setRunning(false);
        pushLog(
          `${traversal} → [${steps.map((n) => n.value).join(", ")}]`,
          "info",
        );
        return;
      }
      const node = steps[stepIndex.current];
      setActiveId(node.id);
      setVisitedIds((prev) => [...prev, node.id]);
    }, 650);
  };

  useEffect(() => {
    return () => {
      // no timers left behind when leaving the page mid-animation
      setRunning(false);
    };
  }, []);

  const activeKind = TRAVERSALS.find((t) => t.kind === traversal)!;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6">
      {/* header */}
      <header className="max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 shadow-[0_0_28px_-8px_rgb(52_211_153/0.7)]">
            <meta.icon className="size-6" />
          </span>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Tree
            </h1>
            <p className="font-mono text-sm text-emerald-300">
              binary search tree — smaller left, bigger right
            </p>
          </div>
        </div>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          {meta.blurb} Insert a few values, then run a traversal — inorder walks
          the whole tree in sorted order, which is the BST magic trick.
        </p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* visualizer */}
        <section className="rounded-2xl border border-border/70 bg-card/80 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && insert()}
              inputMode="numeric"
              placeholder="Value"
              className="w-24 bg-slate-950/60 font-mono"
              aria-label="Value to insert"
            />
            <Button
              onClick={insert}
              className="gap-1.5 bg-emerald-400 font-semibold text-slate-950 hover:bg-emerald-300"
            >
              <Sprout className="size-4" /> Insert
            </Button>
            <Button onClick={reset} variant="outline" className="gap-1.5">
              <RotateCcw className="size-4" /> Reset demo
            </Button>
          </div>

          {/* traversal controls */}
          <div className="mt-6 rounded-xl border border-border/60 bg-slate-950/40 p-4">
            <div className="flex flex-wrap items-center gap-2">
              {TRAVERSALS.map((t) => (
                <button
                  key={t.kind}
                  onClick={() => setTraversal(t.kind)}
                  disabled={running}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50",
                    traversal === t.kind
                      ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-200"
                      : "border-border/70 text-slate-400 hover:border-emerald-400/30 hover:text-emerald-300",
                  )}
                >
                  {t.label}
                </button>
              ))}
              <Button
                onClick={runTraversal}
                disabled={running || !root}
                className="ml-auto gap-1.5 border-emerald-400/40 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20"
                variant="outline"
              >
                <Play className="size-4" />
                {running ? "Traversing…" : "Run traversal"}
              </Button>
            </div>
            <p className="mt-2 font-mono text-[11px] text-slate-500">
              {activeKind.hint}
              {visitedIds.length > 0 && !running && (
                <span className="ml-3 text-emerald-300/80">
                  last order:{" "}
                  {nodes
                    .filter((n) => visitedIds.includes(n.node.id))
                    .map((n) => n.node.value)
                    .join(" → ")}
                </span>
              )}
            </p>
          </div>

          {/* canvas */}
          <div className="mt-6 overflow-hidden rounded-xl border border-border/60 bg-slate-950/60">
            {root ? (
              <svg
                viewBox={`0 0 ${WIDTH} ${Math.max(depth * ROW + TOP + 40, 240)}`}
                className="h-auto w-full"
                role="img"
                aria-label="Binary search tree diagram"
              >
                {/* edges */}
                {edges.map(({ from, to }) => {
                  const active = activeId === to.node.id;
                  const visited = visitedIds.includes(to.node.id);
                  return (
                    <motion.line
                      key={`${from.node.id}-${to.node.id}`}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke={active ? "#34d399" : visited ? "#34d39966" : "#334155"}
                      strokeWidth={active ? 2.5 : 1.5}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  );
                })}
                {/* nodes */}
                {nodes.map(({ node, x, y }) => {
                  const isActive = activeId === node.id;
                  const isVisited = visitedIds.includes(node.id);
                  return (
                    <motion.g
                      key={node.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      style={{ originX: `${x}px`, originY: `${y}px` }}
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={R}
                        fill={isActive ? "#065f46" : isVisited ? "#064e3b" : "#0f172a"}
                        stroke={isActive ? "#34d399" : isVisited ? "#34d39988" : "#475569"}
                        strokeWidth={isActive ? 2.5 : 1.5}
                        style={
                          isActive
                            ? { filter: "drop-shadow(0 0 10px rgb(52 211 153 / 0.8))" }
                            : undefined
                        }
                      />
                      <text
                        x={x}
                        y={y + 4.5}
                        textAnchor="middle"
                        className="fill-slate-100 font-mono text-[13px] font-semibold"
                      >
                        {node.value}
                      </text>
                    </motion.g>
                  );
                })}
              </svg>
            ) : (
              <div className="flex h-56 items-center justify-center font-mono text-xs text-slate-600">
                empty forest — insert a value to plant a root
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>
              {nodeCount} node{nodeCount === 1 ? "" : "s"} · depth {depth} —{" "}
              {depth <= Math.ceil(Math.log2(nodeCount + 1)) + 1
                ? "nice and bushy, O(log n) holds"
                : "getting spiky — a self-balancing tree (AVL) would fix this"}
            </span>
            <span className="font-mono text-slate-500">duplicates go right</span>
          </div>
        </section>

        {/* side panels */}
        <div className="flex flex-col gap-6">
          <ComplexityPanel meta={meta} highlightKey={running ? "search" : null} />
          <OpLog entries={log} />
          <div className="rounded-2xl border border-border/70 bg-card/80 p-5">
            <p className="text-sm font-semibold">Read it like a story</p>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-muted-foreground">
              <li>
                <span className="font-mono text-emerald-300">Preorder</span> — copy
                the tree structure (serialize it).
              </li>
              <li>
                <span className="font-mono text-emerald-300">Inorder</span> — the
                values come out sorted, smallest first.
              </li>
              <li>
                <span className="font-mono text-emerald-300">Postorder</span> — safe
                order to delete children before parents.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* code */}
      <section className="mt-12">
        <h2 className="text-xl font-bold tracking-tight">Implementation</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Every lookup follows one branch — that's where the O(log n) comes
          from, as long as the tree stays balanced.
        </p>
        <div className="mt-5">
          <CodeTabs js={TREE_CODE_JS} py={TREE_CODE_PY} meta={meta} />
        </div>
      </section>
    </div>
  );
}
