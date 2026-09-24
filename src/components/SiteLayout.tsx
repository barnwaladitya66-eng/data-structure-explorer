import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ACCENTS, STRUCTURES } from "@/lib/structures";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, Network, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  ...STRUCTURES.map((s) => ({ to: `/${s.slug}`, label: s.name, accent: s.accent })),
];

function isActive(pathname: string, to: string) {
  return to === "/" ? pathname === "/" : pathname.startsWith(to);
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

function SiteHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // close the mobile menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        {/* Brand */}
        <NavLink to="/" className="group flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 shadow-[0_0_24px_-8px_rgb(34_211_238/0.6)] transition-shadow group-hover:shadow-[0_0_30px_-6px_rgb(34_211_238/0.8)]">
            <Network className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-bold tracking-tight text-foreground">
              Structure<span className="text-cyan-300">Lab</span>
            </span>
            <span className="hidden text-[11px] font-medium text-muted-foreground sm:block">
              data structures, visualized
            </span>
          </span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(location.pathname, item.to);
            const accent = "accent" in item ? ACCENTS[item.accent as keyof typeof ACCENTS] : null;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
                  active
                    ? cn("bg-white/5 shadow-sm ring-1 ring-inset", accent ? accent.ring : "ring-cyan-400/40", accent ? accent.text : "text-cyan-300")
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100",
                )}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Mobile menu */}
        <div className="ml-auto md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open navigation">
                {open ? <X className="size-4" /> : <Menu className="size-4" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-border/70 bg-card">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(location.pathname, item.to);
                  const accent =
                    "accent" in item ? ACCENTS[item.accent as keyof typeof ACCENTS] : null;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? cn("bg-white/5", accent ? accent.text : "text-cyan-300")
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-100",
                      )}
                    >
                      {item.label}
                      {active && (
                        <span className={cn("size-1.5 rounded-full", accent ? accent.dot : "bg-cyan-400")} />
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

function SiteFooter() {
  return (
    <footer className="relative z-10 mt-20 border-t border-border/70 bg-slate-950/40">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 text-[15px] font-bold tracking-tight">
              <Network className="size-4 text-cyan-300" />
              Structure<span className="-ml-2 text-cyan-300">Lab</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Interactive visualizers for the four structures every CS course
              starts with. Built for teachers, live demos, and curious minds —
              no account required.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Explore
            </p>
            <ul className="mt-3 space-y-1.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                    <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="max-w-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Classroom ready
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Every visualizer works offline in the browser. Project one on the
              big screen, let students drive the operations.
            </p>
            <Badge variant="outline" className="mt-3 border-border/70 text-slate-400">
              v1 · Stack · Queue · Tree · Graph
            </Badge>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border/60 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} StructureLab. For teaching and learning.</span>
          <span className="font-mono">LIFO · FIFO · O(log n) · O(V + E)</span>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Layout shell                                                        */
/* ------------------------------------------------------------------ */

export function SiteLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  // start every page from the top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen overflow-x-clip">
      {/* dark-gritted backdrop: geometric grid + soft neon glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0 grid-bg" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(560px 360px at 12% -4%, rgb(34 211 238 / 0.07), transparent 65%), radial-gradient(640px 420px at 88% 12%, rgb(167 139 250 / 0.07), transparent 65%), radial-gradient(900px 600px at 50% 115%, rgb(52 211 153 / 0.05), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
      />

      <SiteHeader />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="relative z-10"
        >
          {children}
          <SiteFooter />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
