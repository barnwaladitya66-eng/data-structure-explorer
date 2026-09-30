import { CodeTabs } from "@/components/CodeBlock";
import { ComplexityPanel, OpLog, type LogEntry } from "@/components/panels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LIST_SNIPPETS,
  LIST_VARIANTS,
  STRUCTURES,
  type ListVariant,
  type StructureMeta,
} from "@/lib/structures";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Eraser,
  Play,
  Plus,
  RotateCcw,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const meta = STRUCTURES.find((s) => s.slug === "linked") as StructureMeta;

/* ------------------------------------------------------------------ */
/* Linked list model — nodes live in a plain array for animation keys  */
/* ------------------------------------------------------------------ */

interface ListNode {
  id: number;
  value: string;
}

type Variant = ListVariant;
type Operation = "insertHead" | "insertTail" | "insertAt" | "deleteHead" | "deleteAt" | "traverse";

const SEED = ["12", "31", "7", "42"];
const MAX_NODES = 8;

interface Trace {
  /** index of the node being visited, or -1 between steps */
  at: number;
  text: string;
}

/** Build the animation trace for an operation. */
function buildTrace(
  nodes: ListNode[],
  variant: Variant,
  op: Operation,
  value: string,
  index: number,
): Trace[] {
  const trace: Trace[] = [];
  const at = (i: number, text: string) => trace.push({ at: i, text });

  switch (op) {
    case "insertHead":
      at(-1, `newNode(${value})`);
      at(0, `node.next = head → relink at the front — O(1)`);
      break;
    case "insertTail":
      if (variant === "doubly") {
        at(-1, `newNode(${value})`);
        at(0, `tail.next = node — O(1), no walk needed`);
      } else if (variant === "circular") {
        at(0, `insert after tail → node becomes the new tail — O(1)`);
      } else if (nodes.length === 0) {
        at(-1, `empty list → newNode(${value}) becomes the head`);
      } else {
        for (let i = 0; i < nodes.length; i++) {
          at(i, `walk ${i + 1}/${nodes.length} → cur.next ?`);
        }
        at(nodes.length - 1, `tail.next = newNode(${value})`);
      }
      break;
    case "insertAt":
      if (index <= 0) {
        at(0, `index 0 → same as insertAtHead — O(1)`);
      } else {
        for (let i = 0; i <= Math.min(index - 1, nodes.length - 1); i++) {
          at(i, `walk to index ${i} — stop one before ${index}`);
        }
        at(Math.min(index - 1, nodes.length - 1), `prev.next = newNode(${value}); node.next = prev.next`);
      }
      break;
    case "deleteHead":
      at(0, `head = head.next → unlink — O(1)`);
      break;
    case "deleteAt":
      if (index <= 0) {
        at(0, `index 0 → head = head.next → unlink — O(1)`);
      } else {
        for (let i = 0; i < Math.min(index, nodes.length); i++) {
          at(i, `walk to index ${i} — stop one before ${index}`);
        }
        at(Math.min(index - 1, nodes.length - 1), `prev.next = gone.next → free`);
      }
      break;
    case "traverse":
      for (let i = 0; i < nodes.length; i++) {
        at(i, `visit ${nodes[i].value}${variant === "circular" && i === nodes.length - 1 ? " → loops back to head" : ""}`);
      }
      break;
  }
  return trace;
}

export default function LinkedListPage() {
  const [variant, setVariant] = useState<Variant>("singly");
  const [nodes, setNodes] = useState<ListNode[]>(
    SEED.map((value, i) => ({ id: i + 1, value })),
  );
  const nextId = useRef(SEED.length + 1);

  const [value, setValue] = useState("");
  const [index, setIndex] = useState("");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [current, setCurrent] = useState<number | null>(null); // animated pointer
  const [note, setNote] = useState<string | null>(null);
  const [removed, setRemoved] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [output, setOutput] = useState<string[]>([]);

  const logId = useRef(0);
  const timerRef = useRef<number | null>(null);
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;

  const pushLog = (text: string, tone: LogEntry["tone"]) => {
    logId.current += 1;
    setLog((prev) => [{ id: logId.current, text, tone }, ...prev].slice(0, 30));
  };

  // no timers left behind when leaving the page mid-animation
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, []);

  const parseIndex = (): number | null => {
    if (index.trim() === "") return null;
    const n = Number.parseInt(index, 10);
    if (Number.isNaN(n) || n < 0 || n > nodesRef.current.length) return null;
    return n;
  };

  /** Animate a trace, then apply the resulting node list. */
  const runTrace = (trace: Trace[], finish: (prev: ListNode[]) => ListNode[]) => {
    setBusy(true);
    setNote(trace[0]?.text ?? null);
    let i = 0;
    timerRef.current = window.setInterval(() => {
      i += 1;
      if (i >= trace.length) {
        if (timerRef.current !== null) window.clearInterval(timerRef.current);
        timerRef.current = null;
        setNodes((prev) => finish(prev));
        setCurrent(null);
        setNote(null);
        setBusy(false);
        return;
      }
      setNote(trace[i].text);
      setCurrent(trace[i].at >= 0 ? trace[i].at : null);
    }, 520);
  };

  const doInsert = (op: "insertHead" | "insertTail" | "insertAt") => {
    if (busy) return;
    const v = value.trim().slice(0, 3);
    if (!v) {
      pushLog("type a value for the new node first", "info");
      return;
    }
    if (nodesRef.current.length >= MAX_NODES) {
      pushLog(`visualizer holds ${MAX_NODES} nodes`, "info");
      return;
    }
    const i = parseIndex();
    if (op === "insertAt" && i === null) {
      pushLog(`insert needs an index 0–${nodesRef.current.length}`, "info");
      return;
    }
    const trace = buildTrace(nodesRef.current, variant, op, v, i ?? 0);
    const label =
      op === "insertHead" ? `insertAtHead(${v})` : op === "insertTail" ? `insertAtTail(${v})` : `insertAt(${i}, ${v})`;
    pushLog(label, "add");
    setValue("");
    runTrace(trace, (prev) => {
      const id = nextId.current;
      nextId.current += 1;
      if (op === "insertHead") return [{ id, value: v }, ...prev];
      if (op === "insertTail") return [...prev, { id, value: v }];
      const at = Math.min(i ?? 0, prev.length);
      return [...prev.slice(0, at), { id, value: v }, ...prev.slice(at)];
    });
  };

  const doDelete = (op: "deleteHead" | "deleteAt") => {
    if (busy) return;
    if (nodesRef.current.length === 0) {
      pushLog("the list is already empty", "info");
      return;
    }
    let target = 0;
    if (op === "deleteAt") {
      const i = parseIndex();
      if (i === null || i >= nodesRef.current.length) {
        pushLog(`delete needs an index 0–${nodesRef.current.length - 1}`, "info");
        return;
      }
      target = i;
    }
    const trace = buildTrace(nodesRef.current, variant, op, "", target);
    pushLog(op === "deleteHead" ? "deleteAtHead()" : `deleteAt(${target})`, "remove");
    const goneId = nodesRef.current[target]?.id ?? null;
    // keep a stable copy for the animation window
    const finalList = nodesRef.current.filter((n) => n.id !== goneId);
    let i = 0;
    setBusy(true);
    setNote(trace[0]?.text ?? null);
    timerRef.current = window.setInterval(() => {
      i += 1;
      if (i >= trace.length) {
        if (timerRef.current !== null) window.clearInterval(timerRef.current);
        timerRef.current = null;
        setRemoved(goneId);
        setNodes(finalList);
        window.setTimeout(() => setRemoved(null), 450);
        setCurrent(null);
        setNote(null);
        setBusy(false);
        return;
      }
      setNote(trace[i].text);
      setCurrent(trace[i].at >= 0 ? trace[i].at : null);
    }, 520);
  };

  const doTraverse = () => {
    if (busy) return;
    if (nodesRef.current.length === 0) {
      pushLog("nothing to traverse — insert some nodes", "info");
      return;
    }
    const trace = buildTrace(nodesRef.current, variant, "traverse", "", 0);
    setBusy(true);
    setOutput([]);
    setNote(trace[0]?.text ?? null);
    const collected: string[] = []; // local copy — state would be stale in the closure
    let i = 0;
    timerRef.current = window.setInterval(() => {
      i += 1;
      if (i >= trace.length) {
        if (timerRef.current !== null) window.clearInterval(timerRef.current);
        timerRef.current = null;
        setCurrent(null);
        setNote(null);
        setBusy(false);
        pushLog(`traverse → ${collected.join(" → ")} ${variant === "circular" ? "↺ (loops)" : "→ null"}`, "info");
        return;
      }
      const at = trace[i].at;
      setCurrent(at);
      setNote(trace[i].text);
      const v = nodesRef.current[at]?.value;
      if (v) {
        collected.push(v);
        setOutput([...collected]);
      }
    }, 520);
  };

  const reset = () => {
    if (busy) return;
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
    setNodes(SEED.map((value, i) => ({ id: i + 1, value })));
    nextId.current = SEED.length + 1;
    setCurrent(null);
    setNote(null);
    setOutput([]);
    pushLog("reset to the demo list", "info");
  };

  const clearAll = () => {
    if (busy) return;
    setNodes([]);
    setCurrent(null);
    setNote(null);
    setOutput([]);
    pushLog("removed every node — the list is empty", "info");
  };

  const changeVariant = (v: Variant) => {
    if (busy) return;
    setVariant(v);
    setOutput([]);
    setNote(null);
    pushLog(`variant: ${v}`, "info");
  };

  const isCircular = variant === "circular";
  const isDoubly = variant === "doubly";

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6">
      {/* header */}
      <header className="max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl border border-rose-400/30 bg-rose-400/10 text-rose-300 shadow-[0_0_28px_-8px_rgb(251_113_133/0.7)]">
            <meta.icon className="size-6" />
          </span>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Linked List
            </h1>
            <p className="font-mono text-sm text-rose-300">
              nodes in a chain — insert, delete, traverse
            </p>
          </div>
        </div>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          {meta.blurb} Pick a variant below, then watch pointers relink in
          real time for insertions at the head, middle, or tail — and for
          deletions anywhere in the chain.
        </p>
      </header>

      {/* variant switcher */}
      <div className="mt-8 flex flex-wrap gap-2">
        {LIST_VARIANTS.map((v) => (
          <button
            key={v.id}
            onClick={() => changeVariant(v.id)}
            disabled={busy}
            className={cn(
              "group rounded-xl border px-4 py-2 text-left transition-all disabled:opacity-50",
              variant === v.id
                ? "border-rose-400/50 bg-rose-400/15"
                : "border-border/70 bg-card/60 hover:border-rose-400/30",
            )}
          >
            <span
              className={cn(
                "block text-sm font-bold tracking-tight",
                variant === v.id ? "text-rose-200" : "text-slate-300",
              )}
            >
              {v.label}
            </span>
            <span className="block font-mono text-[11px] text-slate-500">
              {v.blurb}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* visualizer */}
        <section className="rounded-2xl border border-border/70 bg-card/80 p-6">
          {/* controls */}
          <div className="flex flex-wrap items-center gap-2">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doInsert("insertTail")}
              placeholder="Value"
              maxLength={3}
              className="w-20 bg-slate-950/60 font-mono"
              aria-label="New node value"
            />
            <Input
              value={index}
              onChange={(e) => setIndex(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && doInsert("insertAt")}
              placeholder="Index"
              inputMode="numeric"
              className="w-20 bg-slate-950/60 font-mono"
              aria-label="Index for insert or delete"
            />
            <Button
              onClick={() => doInsert("insertHead")}
              disabled={busy}
              variant="outline"
              size="sm"
              className="gap-1 border-rose-400/40 bg-rose-400/10 text-rose-200 hover:bg-rose-400/20"
            >
              <Plus className="size-3.5" /> Head
            </Button>
            <Button
              onClick={() => doInsert("insertAt")}
              disabled={busy}
              variant="outline"
              size="sm"
              className="gap-1 border-rose-400/40 bg-rose-400/10 text-rose-200 hover:bg-rose-400/20"
            >
              <Plus className="size-3.5" /> At index
            </Button>
            <Button
              onClick={() => doInsert("insertTail")}
              disabled={busy}
              size="sm"
              className="gap-1 bg-rose-400 font-semibold text-slate-950 hover:bg-rose-300"
            >
              <Plus className="size-3.5" /> Tail
            </Button>
            <Button
              onClick={() => doDelete("deleteHead")}
              disabled={busy}
              variant="ghost"
              size="sm"
              className="gap-1 text-slate-400 hover:text-rose-300"
            >
              <Eraser className="size-3.5" /> Del head
            </Button>
            <Button
              onClick={() => doDelete("deleteAt")}
              disabled={busy}
              variant="ghost"
              size="sm"
              className="gap-1 text-slate-400 hover:text-rose-300"
            >
              <Eraser className="size-3.5" /> Del index
            </Button>
            <Button
              onClick={doTraverse}
              disabled={busy}
              variant="outline"
              size="sm"
              className="ml-auto gap-1 border-rose-400/40 bg-rose-400/10 text-rose-200 hover:bg-rose-400/20"
            >
              <Play className="size-3.5" /> Traverse
            </Button>
            <Button
              onClick={clearAll}
              disabled={busy}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-rose-300"
            >
              Clear
            </Button>
            <Button
              onClick={reset}
              disabled={busy}
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <RotateCcw className="size-3.5" /> Reset
            </Button>
          </div>

          {/* canvas */}
          <div className="mt-6 overflow-x-auto rounded-xl border border-border/60 bg-slate-950/60 p-4">
            <div className="flex min-w-max items-center gap-1 py-6">
              <span className="mr-1 shrink-0 rounded-md border border-rose-400/40 bg-rose-400/10 px-2 py-1 font-mono text-[11px] font-bold text-rose-300">
                head
              </span>
              {nodes.length === 0 && (
                <span className="ml-3 font-mono text-xs text-slate-500">
                  empty — {isCircular ? "tail = null" : "head = null"}
                </span>
              )}
              <AnimatePresence mode="popLayout">
                {nodes.map((n, i) => {
                  const isCurrent = current === i;
                  const isGone = removed === n.id;
                  return (
                    <motion.div
                      key={n.id}
                      layout
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: isGone ? 0.6 : 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ type: "spring", stiffness: 300, damping: 24 }}
                      className="flex items-center"
                    >
                      <motion.div
                        className={cn(
                          "relative flex h-14 w-24 flex-col items-center justify-center rounded-lg border font-mono",
                          isCurrent
                            ? "border-rose-300 bg-rose-500/20 shadow-[0_0_18px_-4px_rgb(251_113_133/0.8)]"
                            : "border-border/70 bg-slate-900/80",
                        )}
                      >
                        <span
                          className={cn(
                            "text-sm font-semibold",
                            isCurrent ? "text-rose-200" : "text-slate-200",
                          )}
                        >
                          {n.value}
                        </span>
                        <span className="mt-0.5 flex gap-0.5">
                          <span
                            className={cn(
                              "h-1 w-6 rounded-full",
                              isCurrent ? "bg-rose-300" : "bg-slate-600",
                            )}
                          />
                          {isDoubly && (
                            <span
                              className={cn(
                                "h-1 w-6 rounded-full",
                                isCurrent ? "bg-rose-400/60" : "bg-slate-700",
                              )}
                            />
                          )}
                        </span>
                        <span className="absolute -top-4 font-mono text-[9px] text-slate-500">
                          [{i}]
                        </span>
                      </motion.div>
                      {/* pointer between nodes */}
                      <div className="flex w-9 items-center justify-center">
                        <ArrowRight
                          className={cn(
                            "size-4",
                            isCurrent ? "text-rose-300" : "text-slate-600",
                          )}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {nodes.length > 0 && !isCircular && (
                <span className="font-mono text-xs text-slate-500">null</span>
              )}
            </div>
            {/* circular loop-back arrow */}
            {isCircular && nodes.length > 0 && (
              <div className="flex items-center justify-center gap-2 pb-1">
                <div className="h-px flex-1 border-t border-dashed border-rose-400/40" />
                <span className="flex items-center gap-1 font-mono text-[10px] text-rose-300/80">
                  <ArrowLeft className="size-3" /> tail.next loops back to head
                </span>
                <div className="h-px flex-1 border-t border-dashed border-rose-400/40" />
              </div>
            )}
            {/* doubly backward pointer strip */}
            {isDoubly && nodes.length > 0 && (
              <div className="flex items-center justify-center gap-2 pb-1">
                <span className="flex items-center gap-1 font-mono text-[10px] text-rose-300/70">
                  <ArrowLeft className="size-3" /> prev pointers walk the other way
                </span>
              </div>
            )}

            {/* live note + output */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs">
              <span className="font-mono text-muted-foreground">
                {note ?? `head → ${nodes.map((n) => n.value).join(" → ")}${isCircular ? " ↺" : " → null"}`}
              </span>
              {output.length > 0 && (
                <span className="font-mono text-rose-300">
                  out: [{output.join(", ")}]
                </span>
              )}
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {isDoubly
              ? "Every node carries prev and next, so tail inserts are O(1) and you can walk backward — at the cost of one extra pointer per node."
              : isCircular
                ? "The tail keeps the list: tail.next is the head, so inserting at either end is O(1) and traversal naturally loops."
                : "One pointer per node keeps it simple — but reaching the tail for an insert means walking the whole chain, O(n)."}
          </p>
        </section>

        {/* side panels */}
        <div className="flex flex-col gap-6">
          <ComplexityPanel meta={meta} highlightKey={busy ? "insert" : null} />
          <div className="rounded-2xl border border-border/70 bg-card/80 p-5">
            <p className="text-sm font-semibold">Pointer cheatsheet</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              what relinks for each operation
            </p>
            <div className="mt-3 space-y-1.5 font-mono text-[11px]">
              {(
                [
                  ["insert head", "node.next = head; head = node"],
                  ["insert at i", "prev.next = node; node.next = prev.next"],
                  ["delete head", "head = head.next"],
                  ["delete at i", "prev.next = gone.next"],
                ] as const
              ).map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center gap-2 rounded-lg bg-slate-950/50 px-3 py-1.5"
                >
                  <span className="w-20 shrink-0 text-rose-300">{k}</span>
                  <span className="truncate text-slate-300">{v}</span>
                </div>
              ))}
              {isDoubly && (
                <div className="flex items-center gap-2 rounded-lg bg-slate-950/50 px-3 py-1.5">
                  <span className="w-20 shrink-0 text-rose-300">doubly extra</span>
                  <span className="truncate text-slate-300">fix prev on both neighbors</span>
                </div>
              )}
              {isCircular && (
                <div className="flex items-center gap-2 rounded-lg bg-slate-950/50 px-3 py-1.5">
                  <span className="w-20 shrink-0 text-rose-300">circular extra</span>
                  <span className="truncate text-slate-300">keep tail; watch the last-node case</span>
                </div>
              )}
            </div>
          </div>
          <OpLog entries={log} />
        </div>
      </div>

      {/* code */}
      <section className="mt-12">
        <h2 className="text-xl font-bold tracking-tight">
          {variant === "singly" ? "Singly" : variant === "doubly" ? "Doubly" : "Circular"} linked
          list implementation
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Insertion at the head, tail, and any index; deletion at the head and
          by index; full traversal — in all five languages.
        </p>
        <div className="mt-5">
          <CodeTabs snippets={LIST_SNIPPETS[variant]} meta={meta} />
        </div>
      </section>
    </div>
  );
}
