import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tokenColor, tokenize } from "@/lib/highlight";
import type { AccentName, StructureMeta } from "@/lib/structures";
import { Check, Copy, FileCode2 } from "lucide-react";
import { useState } from "react";

const ACCENT_TEXT: Record<AccentName, string> = {
  cyan: "text-cyan-300",
  violet: "text-violet-300",
  emerald: "text-emerald-300",
  amber: "text-amber-300",
};

/* ------------------------------------------------------------------ */
/* Token renderer                                                      */
/* ------------------------------------------------------------------ */

function Tokens({ code, lang }: { code: string; lang: "js" | "py" }) {
  const tokens = tokenize(code, lang);
  return (
    <code className="block whitespace-pre font-mono text-[12.5px] leading-relaxed">
      {tokens.map((token, i) => (
        <span key={i} className={tokenColor(token.kind)}>
          {token.value}
        </span>
      ))}
    </code>
  );
}

/* ------------------------------------------------------------------ */
/* CodeBlock — a single snippet with copy button                       */
/* ------------------------------------------------------------------ */

interface CodeBlockProps {
  code: string;
  lang: "js" | "py";
  filename: string;
}

export function CodeBlock({ code, lang, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-slate-950/70 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]">
      <div className="flex items-center justify-between border-b border-border/60 bg-slate-900/60 px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <FileCode2 className="size-3.5" />
          {filename}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={copy}
          className={
            "h-7 gap-1.5 rounded-md px-2.5 text-[11px] text-slate-400 hover:bg-white/5 hover:text-slate-200" +
            (copied ? " text-emerald-300" : "")
          }
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4">
        <Tokens code={code} lang={lang} />
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CodeTabs — JS / Python switcher over snippets                       */
/* ------------------------------------------------------------------ */

interface CodeTabsProps {
  js: string;
  py: string;
  meta: StructureMeta;
}

export function CodeTabs({ js, py, meta }: CodeTabsProps) {
  return (
    <Tabs defaultValue="js" className="gap-4">
      <TabsList className="h-9 w-fit bg-slate-900/70 p-1">
        <TabsTrigger
          value="js"
          className="h-7 gap-1.5 rounded-md px-3 text-xs font-medium data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-300"
        >
          JavaScript
        </TabsTrigger>
        <TabsTrigger
          value="py"
          className="h-7 gap-1.5 rounded-md px-3 text-xs font-medium data-[state=active]:bg-slate-800 data-[state=active]:text-amber-300"
        >
          Python
        </TabsTrigger>
      </TabsList>
      <TabsContent value="js">
        <CodeBlock code={js} lang="js" filename={`${meta.name.toLowerCase()}.js`} />
      </TabsContent>
      <TabsContent value="py">
        <CodeBlock code={py} lang="py" filename={`${meta.name.toLowerCase()}.py`} />
      </TabsContent>
    </Tabs>
  );
}
