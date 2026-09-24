import { ACCENTS, type StructureMeta } from "@/lib/structures";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

/* ------------------------------------------------------------------ */
/* ComplexityPanel — Big-O reference for every operation               */
/* ------------------------------------------------------------------ */

const COMPLEXITY_ROWS: { key: keyof StructureMeta; label: string }[] = [
  { key: "access", label: "Access" },
  { key: "search", label: "Search" },
  { key: "insert", label: "Insert" },
  { key: "delete", label: "Delete" },
  { key: "space", label: "Space" },
];

export function ComplexityPanel({
  meta,
  highlightKey,
}: {
  meta: StructureMeta;
  /** e.g. "insert" — that row glows while an insert animation runs */
  highlightKey?: string | null;
}) {
  const a = ACCENTS[meta.accent];
  return (
    <div className="rounded-2xl border border-border/70 bg-card/80 p-5">
      <p className="text-sm font-semibold">Time &amp; space complexity</p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Big-O at a glance — average case
      </p>
      <dl className="mt-4 space-y-1.5">
        {COMPLEXITY_ROWS.map(({ key, label }) => (
          <div
            key={key}
            className={cn(
              "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
              highlightKey === key
                ? cn(a.bg, "ring-1 ring-inset", a.ring)
                : "bg-slate-950/40",
            )}
          >
            <dt className="text-slate-400">{label}</dt>
            <dd
              className={cn(
                "font-mono font-semibold",
                highlightKey === key ? a.text : "text-slate-200",
              )}
            >
              {meta[key]}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 border-t border-border/60 pt-3 font-mono text-[11px] text-slate-500">
        {meta.methods}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* OpLog — rolling list of the last operations performed               */
/* ------------------------------------------------------------------ */

export interface LogEntry {
  id: number;
  text: string;
  tone: "add" | "remove" | "info";
}

const TONE_STYLES: Record<LogEntry["tone"], string> = {
  add: "text-emerald-300",
  remove: "text-rose-300",
  info: "text-slate-400",
};

const TONE_ICONS: Record<LogEntry["tone"], string> = {
  add: "+",
  remove: "−",
  info: "·",
};

export function OpLog({ entries }: { entries: LogEntry[] }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/80 p-5">
      <div className="flex items-center gap-2">
        <Activity className="size-4 text-cyan-300" />
        <p className="text-sm font-semibold">Operation log</p>
      </div>
      <div className="mt-3 max-h-56 space-y-1.5 overflow-y-auto pr-1">
        {entries.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">
            Run an operation to see it logged here.
          </p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-2 rounded-lg bg-slate-950/50 px-3 py-1.5 font-mono text-xs"
            >
              <span className={cn("font-bold", TONE_STYLES[entry.tone])}>
                {TONE_ICONS[entry.tone]}
              </span>
              <span className="text-slate-300">{entry.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
