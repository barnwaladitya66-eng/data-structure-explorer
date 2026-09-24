import { CodeTabs } from "@/components/CodeBlock";
import { ComplexityPanel, OpLog, type LogEntry } from "@/components/panels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SNIPPETS,
  STRUCTURES,
  type StructureMeta,
} from "@/lib/structures";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightFromLine, ArrowLeftToLine, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

const meta = STRUCTURES.find((s) => s.slug === "queue") as StructureMeta;
const MAX_ITEMS = 8;

interface QueueItem {
  id: number;
  value: number;
}

let nextId = 100;

const SEED: QueueItem[] = [
  { id: (nextId += 1), value: 12 },
  { id: (nextId += 1), value: 31 },
  { id: (nextId += 1), value: 7 },
];

export default function QueuePage() {
  const [items, setItems] = useState<QueueItem[]>(SEED);
  const [value, setValue] = useState("");
  const [log, setLog] = useState<LogEntry[]>([]);
  const logId = useRef(0);

  const pushLog = (text: string, tone: LogEntry["tone"]) => {
    logId.current += 1;
    setLog((prev) => [{ id: logId.current, text, tone }, ...prev].slice(0, 30));
  };

  const enqueue = () => {
    if (items.length >= MAX_ITEMS) {
      pushLog("queue full — visualizer holds 8 items", "info");
      return;
    }
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      pushLog("enter a number to enqueue", "info");
      return;
    }
    nextId += 1;
    setItems((prev) => [...prev, { id: nextId, value: parsed }]);
    pushLog(`enqueue(${parsed}) → rear`, "add");
    setValue("");
  };

  const dequeue = () => {
    if (items.length === 0) {
      pushLog("queue is empty — nothing to dequeue", "info");
      return;
    }
    const front = items[0];
    setItems((prev) => prev.slice(1));
    pushLog(`dequeue() → ${front.value} (left the front)`, "remove");
  };

  const clear = () => {
    setItems([]);
    pushLog("clear()", "info");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6">
      {/* header */}
      <header className="max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-400/10 text-violet-300 shadow-[0_0_28px_-8px_rgb(167_139_250/0.7)]">
            <meta.icon className="size-6" />
          </span>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Queue
            </h1>
            <p className="font-mono text-sm text-violet-300">
              FIFO — first in, first out
            </p>
          </div>
        </div>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          {meta.blurb} Enqueue at the rear, dequeue from the front — the same
          fairness rule as every waiting line you've ever stood in.
        </p>
      </header>

      {/* visualizer + side panels */}
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-2xl border border-border/70 bg-card/80 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && enqueue()}
              inputMode="numeric"
              placeholder="Value"
              className="w-24 bg-slate-950/60 font-mono"
              aria-label="Value to enqueue"
            />
            <Button
              onClick={enqueue}
              className="gap-1.5 bg-violet-400 font-semibold text-slate-950 hover:bg-violet-300"
            >
              <ArrowLeftToLine className="size-4" /> Enqueue
            </Button>
            <Button
              onClick={dequeue}
              variant="outline"
              className="gap-1.5 border-rose-400/30 text-rose-300 hover:bg-rose-400/10 hover:text-rose-200"
            >
              <ArrowRightFromLine className="size-4" /> Dequeue
            </Button>
            <Button onClick={clear} variant="ghost" className="gap-1.5 text-slate-400 hover:text-rose-300">
              <Trash2 className="size-4" /> Clear
            </Button>
          </div>

          {/* the queue itself — a horizontal line */}
          <div className="mt-10 overflow-x-auto pb-2">
            <div className="flex min-h-32 min-w-fit items-stretch gap-2 px-10">
              <AnimatePresence mode="popLayout" initial={false}>
                {items.map((item, i) => {
                  const isFront = i === 0;
                  const isRear = i === items.length - 1;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 42, scale: 0.85 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -42, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 320, damping: 27 }}
                      className={
                        "relative flex h-20 w-16 flex-col items-center justify-center rounded-lg border font-mono text-sm font-semibold " +
                        (isFront
                          ? "border-violet-400/60 bg-violet-400/15 text-violet-100 shadow-[0_0_24px_-6px_rgb(167_139_250/0.8)]"
                          : "border-border/70 bg-slate-900/80 text-slate-300")
                      }
                    >
                      {item.value}
                      {isFront && (
                        <span className="absolute -top-6 font-mono text-[10px] uppercase tracking-widest text-violet-300">
                          front
                        </span>
                      )}
                      {isRear && items.length > 1 && (
                        <span className="absolute -top-6 font-mono text-[10px] uppercase tracking-widest text-slate-400">
                          rear
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {items.length === 0 && (
                <div className="flex h-20 w-full items-center justify-center">
                  <span className="font-mono text-xs text-slate-600">empty queue</span>
                </div>
              )}
            </div>
          </div>

          {/* direction labels */}
          <div className="mt-6 flex items-center justify-between px-2 text-[11px] font-mono uppercase tracking-widest text-slate-500">
            <span className="text-rose-300/80">← leaves first (front)</span>
            <span className="text-emerald-300/80">enters here (rear) →</span>
          </div>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            With the head-index trick, enqueue <em>and</em> dequeue are both O(1)
            — no shifting required.
          </p>
        </section>

        <div className="flex flex-col gap-6">
          <ComplexityPanel meta={meta} highlightKey={null} />
          <OpLog entries={log} />
        </div>
      </div>

      {/* code */}
      <section className="mt-12">
        <h2 className="text-xl font-bold tracking-tight">Implementation</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A naive <code className="font-mono text-xs text-slate-300">shift()</code>{" "}
          makes dequeue O(n); the head-index trick (or Python's{" "}
          <code className="font-mono text-xs text-slate-300">deque</code>) keeps
          it O(1).
        </p>
        <div className="mt-5">
          <CodeTabs snippets={SNIPPETS.queue} meta={meta} />
        </div>
      </section>
    </div>
  );
}
