import { CodeTabs } from "@/components/CodeBlock";
import { OpLog, ComplexityPanel, type LogEntry } from "@/components/panels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SNIPPETS,
  STRUCTURES,
  type StructureMeta,
} from "@/lib/structures";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownToLine, ArrowUpFromLine, Eye, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

const meta = STRUCTURES.find((s) => s.slug === "stack") as StructureMeta;
const MAX_ITEMS = 8;

interface StackItem {
  id: number;
  value: number;
}

let nextId = 1;

const SEED: StackItem[] = [
  { id: 0, value: 42 },
  { id: (nextId += 1), value: 17 },
];

export default function StackPage() {
  const [items, setItems] = useState<StackItem[]>(SEED);
  const [value, setValue] = useState("");
  const [log, setLog] = useState<LogEntry[]>([]);
  const logId = useRef(0);

  const pushLog = (text: string, tone: LogEntry["tone"]) => {
    logId.current += 1;
    setLog((prev) => [{ id: logId.current, text, tone }, ...prev].slice(0, 30));
  };

  const push = () => {
    if (items.length >= MAX_ITEMS) {
      pushLog("stack overflow — visualizer holds 8 items", "info");
      return;
    }
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      pushLog("enter a number to push", "info");
      return;
    }
    const item = { id: ++nextId, value: parsed };
    setItems((prev) => [...prev, item]);
    pushLog(`push(${parsed})`, "add");
    setValue("");
  };

  const pop = () => {
    if (items.length === 0) {
      pushLog("stack underflow — nothing to pop", "info");
      return;
    }
    const top = items[items.length - 1];
    setItems((prev) => prev.slice(0, -1));
    pushLog(`pop() → ${top.value}`, "remove");
  };

  const peek = () => {
    if (items.length === 0) {
      pushLog("stack is empty", "info");
      return;
    }
    const top = items[items.length - 1];
    pushLog(`peek() → ${top.value}`, "info");
  };

  const clear = () => {
    setItems([]);
    pushLog("clear()", "info");
  };

  const topValue = items.length > 0 ? items[items.length - 1].value : null;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6">
      {/* header */}
      <header className="max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 shadow-[0_0_28px_-8px_rgb(34_211_238/0.7)]">
            <meta.icon className="size-6" />
          </span>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Stack
            </h1>
            <p className="font-mono text-sm text-cyan-300">LIFO — last in, first out</p>
          </div>
        </div>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          {meta.blurb} Try it: push a few values, then pop and watch the most
          recent one leave first — every time.
        </p>
      </header>

      {/* visualizer + side panels */}
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-2xl border border-border/70 bg-card/80 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && push()}
              inputMode="numeric"
              placeholder="Value"
              className="w-24 bg-slate-950/60 font-mono"
              aria-label="Value to push"
            />
            <Button onClick={push} className="gap-1.5 bg-cyan-400 font-semibold text-slate-950 hover:bg-cyan-300">
              <ArrowDownToLine className="size-4" /> Push
            </Button>
            <Button
              onClick={pop}
              variant="outline"
              className="gap-1.5 border-rose-400/30 text-rose-300 hover:bg-rose-400/10 hover:text-rose-200"
            >
              <ArrowUpFromLine className="size-4" /> Pop
            </Button>
            <Button
              onClick={peek}
              variant="outline"
              className="gap-1.5"
            >
              <Eye className="size-4" /> Peek
            </Button>
            <Button onClick={clear} variant="ghost" className="gap-1.5 text-slate-400 hover:text-rose-300">
              <Trash2 className="size-4" /> Clear
            </Button>
          </div>

          {/* the stack itself */}
          <div className="mt-8 flex justify-center">
            <div className="relative">
              {/* base plate */}
              <div className="absolute -bottom-3 left-1/2 h-2 w-40 -translate-x-1/2 rounded-full bg-slate-800 shadow-[0_0_16px_rgb(34_211_238/0.15)]" />
              <div className="flex min-h-72 w-44 flex-col-reverse items-center gap-2 rounded-xl border border-border/60 bg-slate-950/50 p-3">
                <AnimatePresence mode="popLayout">
                  {items.map((item, i) => {
                    const isTop = i === items.length - 1;
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: -34, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.7 }}
                        transition={{ type: "spring", stiffness: 340, damping: 26 }}
                        className={
                          "flex h-12 w-full items-center justify-center rounded-lg border font-mono text-sm font-semibold transition-colors " +
                          (isTop
                            ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-100 shadow-[0_0_24px_-6px_rgb(34_211_238/0.8)]"
                            : "border-border/70 bg-slate-900/80 text-slate-300")
                        }
                      >
                        {item.value}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {items.length === 0 && (
                  <div className="flex h-72 items-center justify-center">
                    <span className="font-mono text-xs text-slate-600">empty stack</span>
                  </div>
                )}
              </div>
              {/* TOP arrow */}
              <div className="mt-4 flex justify-center">
                <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-[11px] text-cyan-300">
                  top {topValue !== null ? `· ${topValue}` : "· null"}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Only the top is ever touched — push and pop are both O(1).
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
          A stack is just an array you only ever touch from one end.
        </p>
        <div className="mt-5">
          <CodeTabs snippets={SNIPPETS.stack} meta={meta} />
        </div>
      </section>
    </div>
  );
}
