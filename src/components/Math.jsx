import { useMemo } from "react";
import katex from "katex";
import { cn } from "@/lib/utils";

/* KaTeX wrappers. Content is authored in-repo, so trusting the TeX source
   is safe; we still let KaTeX render errors inline rather than throwing. */

export function TeX({ children, block = false, className }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(children, {
        displayMode: block,
        throwOnError: false,
        strict: false,
        macros: { "\\E": "\\mathbb{E}", "\\Var": "\\operatorname{V}", "\\Cov": "\\operatorname{Cov}" },
      });
    } catch {
      return `<code>${children}</code>`;
    }
  }, [children, block]);

  return (
    <span
      className={cn(block ? "block my-3 overflow-x-auto text-center" : "inline", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/* Inline markdown-lite for lesson prose:
   ```fenced code``` · $$tex$$ display math · $tex$ inline math
   **bold** · `code` · *italic*
   Bold and italic are processed recursively so math nests inside them. */
export function Rich({ text, className }) {
  const parts = useMemo(() => splitRich(text), [text]);
  return (
    <span className={className}>
      {parts.map((p, i) =>
        p.kind === "fence" ? (
          <span key={i} className="block my-3">
            <pre className="font-mono text-[13px] leading-relaxed text-code-fg bg-code-bg rounded-lg p-4 overflow-x-auto whitespace-pre">{p.value}</pre>
          </span>
        )
        : p.kind === "dtex" ? <TeX key={i} block>{p.value}</TeX>
        : p.kind === "tex" ? <TeX key={i}>{p.value}</TeX>
        : p.kind === "code" ? <code key={i} className="font-mono text-[0.88em] bg-code-bg-light border rounded px-1.5 py-0.5">{p.value}</code>
        : p.kind === "bold" ? <strong key={i} className="font-semibold"><Rich text={p.value} /></strong>
        : p.kind === "em" ? <em key={i} className="italic"><Rich text={p.value} /></em>
        : <span key={i}>{p.value}</span>,
      )}
    </span>
  );
}

/* Order matters: fences before inline code, $$…$$ before $…$, ** before *. */
const TOKEN = /(```[\s\S]*?```|\$\$[^$]+\$\$|\$[^$]+\$|`[^`\n]+`|\*\*[^*]+\*\*|\*[^*\n]+\*)/g;

function splitRich(text) {
  const out = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    if (m.index > last) out.push({ kind: "text", value: text.slice(last, m.index) });
    const t = m[0];
    if (t.startsWith("```")) {
      // drop the fences and an optional language tag on the first line
      out.push({ kind: "fence", value: t.slice(3, -3).replace(/^[a-zA-Z]*\n/, "").replace(/\n$/, "") });
    }
    else if (t.startsWith("$$")) out.push({ kind: "dtex", value: t.slice(2, -2) });
    else if (t.startsWith("$")) out.push({ kind: "tex", value: t.slice(1, -1) });
    else if (t.startsWith("`")) out.push({ kind: "code", value: t.slice(1, -1) });
    else if (t.startsWith("**")) out.push({ kind: "bold", value: t.slice(2, -2) });
    else out.push({ kind: "em", value: t.slice(1, -1) });
    last = m.index + t.length;
  }
  if (last < text.length) out.push({ kind: "text", value: text.slice(last) });
  return out;
}
