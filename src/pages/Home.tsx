import { ACCENTS, STRUCTURES } from "@/lib/structures";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  GraduationCap,
  Layers,
  MonitorPlay,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

/* ------------------------------------------------------------------ */
/* Live mini stack demo for the hero                                   */
/* ------------------------------------------------------------------ */

const DEMO_VALUES = [7, 23, 4, 42, 19];

function MiniStackDemo() {
  const [items, setItems] = useState<number[]>([4, 42, 19]);
  const [next, setNext] = useState(2);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setItems((prev) => {
        if (prev.length >= 4) return [DEMO_VALUES[0]];
        const value = DEMO_VALUES[next % DEMO_VALUES.length];
        setNext((n) => n + 1);
        return [...prev, value];
      });
    }, 1100);
    return () => window.clearInterval(timer);
  }, [next]);

  return (
    <div className="flex h-64 w-44 flex-col-reverse items-center justify-start gap-2 rounded-2xl border border-border/70 bg-slate-950/60 p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]">
      <div className="pointer-events-none absolute" />
      {items.map((value, i) => (
        <motion.div
          key={`${value}-${i}`}
          initial={{ opacity: 0, y: -26, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className={cn(
            "flex h-11 w-full items-center justify-center rounded-lg border font-mono text-sm font-semibold",
            i === items.length - 1
              ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-200 shadow-[0_0_22px_-6px_rgb(34_211_238/0.7)]"
              : "border-border/70 bg-slate-900/80 text-slate-300",
          )}
        >
          {value}
        </motion.div>
      ))}
      <span className="mt-1 font-mono text-[10px] uppercase tracking-widest text-slate-500">
        push() ↓ top
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Home page                                                           */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <div>
      {/* ------------------------------ Hero ------------------------------ */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:pt-24">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/5 px-3 py-1 text-xs font-medium text-cyan-300"
            >
              <Sparkles className="size-3.5" />
              Interactive · No sign-up · Classroom ready
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
            >
              See data structures{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-emerald-300 bg-clip-text text-transparent">
                click
              </span>
              , one operation at a time.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              StructureLab turns the four fundamentals — stacks, queues, trees
              and graphs — into live, step-by-step visualizers. Push, dequeue,
              traverse and search your way to intuition, with Big-O and clean
              reference code alongside every demo.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/stack"
                className="group inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_0_32px_-8px_rgb(34_211_238/0.8)] transition-all hover:bg-cyan-300 hover:shadow-[0_0_40px_-8px_rgb(34_211_238/1)]"
              >
                Start exploring
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#structures"
                className="inline-flex items-center gap-2 rounded-xl border border-border/80 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
              >
                Browse the four structures
              </a>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 grid max-w-md grid-cols-3 gap-4"
            >
              {[
                ["4", "structures"],
                ["12+", "live operations"],
                ["2", "languages"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-border/60 bg-slate-950/40 px-4 py-3">
                  <dt className="sr-only">{label}</dt>
                  <dd className="text-2xl font-bold text-foreground">{value}</dd>
                  <dd className="text-xs text-muted-foreground">{label}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mx-auto flex items-center justify-center"
          >
            <div className="absolute inset-0 -z-10 rounded-full bg-cyan-500/10 blur-3xl" />
            <MiniStackDemo />
          </motion.div>
        </div>
      </section>

      {/* --------------------------- Structure cards --------------------------- */}
      <section id="structures" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-cyan-300/90">
              The lineup
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Four structures. Zero fluff.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Each one gets a live visualizer, complexity at a glance, and
            reference code you can copy straight into a lesson.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {STRUCTURES.map((s, index) => {
            const a = ACCENTS[s.accent];
            const Icon = s.icon;
            return (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
              >
                <Link
                  to={`/${s.slug}`}
                  className={cn(
                    "group flex h-full flex-col rounded-2xl border border-border/70 bg-card/80 p-6 transition-all duration-300",
                    "hover:-translate-y-1 hover:bg-card",
                    a.glow,
                    "hover:shadow-[0_0_36px_-10px_var(--tw-shadow-color)]",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={cn(
                        "flex size-11 items-center justify-center rounded-xl border",
                        a.bg,
                        a.border,
                        a.text,
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    <ArrowUpRight className="size-4 text-slate-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-300" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold tracking-tight">
                    {s.name}
                    <span className={cn("ml-2 text-xs font-medium", a.text)}>
                      {s.tagline}
                    </span>
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {s.blurb}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    <span className={cn("rounded-md border px-2 py-0.5 font-mono text-[11px]", a.bg, a.border, a.text)}>
                      insert {s.insert}
                    </span>
                    <span className={cn("rounded-md border px-2 py-0.5 font-mono text-[11px]", a.bg, a.border, a.text)}>
                      delete {s.delete}
                    </span>
                    <span className="rounded-md border border-border/70 px-2 py-0.5 font-mono text-[11px] text-slate-400">
                      space {s.space}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------ Classroom ------------------------------ */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-slate-950/50 p-8 sm:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 grid-bg-fine opacity-60"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 right-10 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl"
          />
          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-violet-300/90">
                Built for the classroom
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Project it. Drive it. Watch it land.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
                Every operation is one click, so you can narrate while the
                structure reacts. Complexity panels stay on screen for exam
                prep, and the JS/Python tabs mean the code students see matches
                the language they're learning.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  {
                    icon: MonitorPlay,
                    text: "Step-by-step animations sized for projectors and shared screens",
                  },
                  {
                    icon: BookOpenCheck,
                    text: "Big-O reference panels for every operation — access, insert, delete, space",
                  },
                  {
                    icon: GraduationCap,
                    text: "No accounts, no setup: open a page and start teaching",
                  },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border border-violet-400/30 bg-violet-400/10 text-violet-300">
                      <Icon className="size-3.5" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-cyan-400/25 bg-cyan-400/5 p-5">
                <Layers className="size-5 text-cyan-300" />
                <p className="mt-3 text-sm font-semibold">LIFO in 10 seconds</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Push three values, pop one — the stack shows exactly why the
                  last one leaves first.
                </p>
                <Link
                  to="/stack"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-cyan-200"
                >
                  Open the stack <ArrowRight className="size-3" />
                </Link>
              </div>
              <div className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-amber-300">
                  bfs vs dfs
                </p>
                <p className="mt-3 text-sm font-semibold">
                  Same graph, two stories
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Build a graph, pick a start node, and race breadth against
                  depth.
                </p>
                <Link
                  to="/graph"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-amber-300 hover:text-amber-200"
                >
                  Open the graph <ArrowRight className="size-3" />
                </Link>
              </div>
              <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/5 p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-300">
                  bst traversal
                </p>
                <p className="mt-3 text-sm font-semibold">Sorted for free</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Insert values, run inorder, and watch a sorted list fall out.
                </p>
                <Link
                  to="/tree"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 hover:text-emerald-200"
                >
                  Open the tree <ArrowRight className="size-3" />
                </Link>
              </div>
              <div className="rounded-2xl border border-violet-400/25 bg-violet-400/5 p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-violet-300">
                  fifo fairness
                </p>
                <p className="mt-3 text-sm font-semibold">Front of the line</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Enqueue a few jobs, dequeue them — order of arrival wins.
                </p>
                <Link
                  to="/queue"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-violet-300 hover:text-violet-200"
                >
                  Open the queue <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ Final CTA ------------------------------ */}
      <section className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6">
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-border/70 bg-card/70 px-6 py-14 text-center">
          <h2 className="max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
            Ready when your class is.
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
            Pick a structure and start clicking — no account, no setup, works
            offline in the browser.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {STRUCTURES.map((s) => {
              const a = ACCENTS[s.accent];
              return (
                <Link
                  key={s.slug}
                  to={`/${s.slug}`}
                  className={cn(
                    "rounded-xl border px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5",
                    a.bg,
                    a.border,
                    a.text,
                  )}
                >
                  {s.name}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
