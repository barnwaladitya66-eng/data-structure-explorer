import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-32 text-center sm:px-6">
      <p className="font-mono text-sm text-cyan-300">404 · out of bounds</p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
        This node doesn&apos;t exist
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        The page you were looking for was never pushed onto the stack. Head
        back home, or jump straight into one of the visualizers.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_0_32px_-8px_rgb(34_211_238/0.8)] transition-colors hover:bg-cyan-300"
        >
          Back home
        </Link>
        <Link
          to="/graph"
          className="rounded-xl border border-border/80 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
        >
          Open a visualizer
        </Link>
      </div>
    </div>
  );
}
