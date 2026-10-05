import { type AccentName, ACCENTS } from "@/lib/structures";
import type { TheoryPageContent } from "@/lib/theory";
import { motion } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";

/**
 * Theory — renders a unit's TheoryPageContent as accent-themed cards.
 * Used on every structure page between the visualizer and the code tabs.
 */
export function TheorySection({
  theory,
  accent,
  subtitle,
}: {
  theory: TheoryPageContent;
  accent: AccentName;
  subtitle?: string;
}) {
  return (
    <section id="theory" className="mt-14">
      <div className="flex items-center gap-3">
        <span
          className={`flex size-10 items-center justify-center rounded-xl border ${ACCENTS[accent].border} ${ACCENTS[accent].bg} ${ACCENTS[accent].text}`}
        >
          <BookOpen className="size-5" />
        </span>
        <div>
          <h2 className="text-xl font-bold tracking-tight">Theory</h2>
          <p className="text-sm text-muted-foreground">
            {subtitle ?? theory.blurb}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {theory.blocks.map((block, i) => (
          <motion.article
            key={block.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.3) }}
            className="rounded-2xl border border-border/70 bg-card/80 p-5"
          >
            <h3 className="text-base font-bold tracking-tight text-foreground">
              {block.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {block.intro}
            </p>
            <ul className="mt-3 space-y-1.5">
              {block.points.map((point) => {
                const [term, ...rest] = point.split(" — ");
                return (
                  <li
                    key={point}
                    className="flex gap-2 text-[13px] leading-relaxed text-slate-300"
                  >
                    <span
                      className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${ACCENTS[accent].dot}`}
                    />
                    <span>
                      {term !== point && rest.length > 0 ? (
                        <>
                          <span
                            className={`font-semibold ${ACCENTS[accent].text}`}
                          >
                            {term}
                          </span>
                          <span className="text-slate-400"> — </span>
                          {rest.join(" — ")}
                        </>
                        ) : (
                          point
                        )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </motion.article>
        ))}
      </div>

      <p
        className={`mt-4 flex items-center gap-2 font-mono text-[11px] ${ACCENTS[accent].text}`}
      >
        <Sparkles className="size-3" />
        {theory.title}
      </p>
    </section>
  );
}
