import type { TheoryPageContent } from "@/lib/theory";
import type { AccentName } from "@/lib/structures";
import { ACCENTS } from "@/lib/structures";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";
import { useState } from "react";

const ACCENT_CHIP: Record<AccentName, string> = {
  cyan: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
  violet: "border-violet-400/30 bg-violet-400/10 text-violet-300",
  rose: "border-rose-400/30 bg-rose-400/10 text-rose-300",
  emerald: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  amber: "border-amber-400/30 bg-amber-400/10 text-amber-300",
};

const ACCENT_TITLE: Record<AccentName, string> = {
  cyan: "text-cyan-300",
  violet: "text-violet-300",
  rose: "text-rose-300",
  emerald: "text-emerald-300",
  amber: "text-amber-300",
};

/**
 * Accordion-style theory section — one collapsible block per syllabus topic.
 * First block starts open so the section never looks empty in a demo.
 */
export function TheorySection({
  content,
  accent,
}: {
  content: TheoryPageContent;
  accent: AccentName;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-lg border",
            ACCENT_CHIP[accent],
          )}
        >
          <BookOpen className="size-4" />
        </span>
        <h2 className="text-xl font-bold tracking-tight">{content.title}</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{content.blurb}</p>

      <div className="mt-5 space-y-2.5">
        {content.blocks.map((block, i) => {
          const isOpen = open === i;
          return (
            <div
              key={block.title}
              className={cn(
                "overflow-hidden rounded-xl border transition-colors",
                isOpen
                  ? cn("border-border bg-card/90", ACCENTS[accent].border)
                  : "border-border/60 bg-card/40 hover:border-border",
              )}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                aria-expanded={isOpen}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={cn(
                      "font-mono text-[10px] font-bold uppercase tracking-widest",
                      ACCENT_TITLE[accent],
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-semibold">{block.title}</span>
                </span>
                <span
                  className={cn(
                    "shrink-0 font-mono text-xs text-slate-500 transition-transform duration-200",
                    isOpen && "rotate-45",
                  )}
                >
                  +
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-border/50 px-4 pb-4 pt-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {block.intro}
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {block.points.map((point) => {
                      const [term, ...rest] = point.split(" — ");
                      const detail = rest.join(" — ");
                      return (
                        <li
                          key={point}
                          className="flex gap-2 text-[13px] leading-relaxed"
                        >
                          <span className={cn("mt-0.5 font-mono", ACCENT_TITLE[accent])}>
                            ▸
                          </span>
                          <span className="text-slate-300">
                            {detail ? (
                              <>
                                <span className="font-medium text-foreground">
                                  {term}
                                </span>
                                <span className="text-muted-foreground">
                                  {" — "}
                                  {detail}
                                </span>
                              </>
                            ) : (
                              point
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
