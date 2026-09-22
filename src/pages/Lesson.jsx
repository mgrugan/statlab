import { useEffect, useState } from "react";
import {
  Lightbulb, Sigma, Code2, AlertTriangle, KeyRound, HelpCircle,
  ArrowLeft, ArrowRight, CheckCircle2, XCircle, MessageCircle,
  ScrollText, Telescope, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel, SectionLabel, CodeFrame } from "@/components/shared";
import { Rich, TeX } from "@/components/Math";
import { Diagram } from "@/components/Diagram";
import ModuleQuiz from "@/components/ModuleQuiz";
import { markLessonRead, useProgress } from "@/lib/progress";
import { ALL_MODULES, moduleById } from "@/pages/Study";
import { cn } from "@/lib/utils";

const KIND_META = {
  plain: { icon: MessageCircle, label: "In plain English", tone: "text-emerald-deep bg-emerald-soft" },
  idea: { icon: Lightbulb, label: "Intuition", tone: "text-amber bg-amber-soft" },
  math: { icon: Sigma, label: "The math", tone: "text-blue bg-blue-tint" },
  proof: { icon: ScrollText, label: "Derivation", tone: "text-blue bg-blue-tint" },
  decode: { icon: Telescope, label: "What the formula tells you", tone: "text-amber bg-amber-soft" },
  code: { icon: Code2, label: "Code", tone: "text-emerald-deep bg-emerald-soft" },
  trap: { icon: AlertTriangle, label: "Exam trap", tone: "text-destructive bg-[#ffdad6]" },
  key: { icon: KeyRound, label: "Key takeaway", tone: "text-slate-deep bg-muted" },
  check: { icon: HelpCircle, label: "Self-check", tone: "text-blue bg-blue-tint" },
};

/* ---- one self-check question ---- */
function Check({ block, idx }) {
  const [picked, setPicked] = useState(null);
  return (
    <div className="mt-2" data-check={idx}>
      <p className="text-[15px] leading-relaxed mb-3"><Rich text={block.q} /></p>
      <div className="grid gap-2">
        {block.choices.map((c, i) => {
          const state = picked === null ? "idle"
            : i === block.answer ? "right"
            : i === picked ? "wrong" : "idle";
          return (
            <button
              key={i}
              data-choice={i}
              onClick={() => picked === null && setPicked(i)}
              disabled={picked !== null}
              className={cn(
                "text-left text-[14px] rounded-md border px-3.5 py-2.5 transition-colors duration-150 flex items-start gap-2.5",
                state === "idle" && picked === null && "bg-card hover:bg-muted cursor-pointer",
                state === "idle" && picked !== null && "bg-card opacity-60",
                state === "right" && "bg-emerald-soft border-emerald/40",
                state === "wrong" && "bg-[#ffdad6]/60 border-destructive/40",
              )}
            >
              <span className={cn(
                "label-mono shrink-0 mt-0.5",
                state === "right" ? "text-emerald-deep" : state === "wrong" ? "text-destructive" : "text-muted-foreground",
              )}>
                {state === "right" ? "✓" : state === "wrong" ? "✗" : String.fromCharCode(97 + i) + "."}
              </span>
              <span><Rich text={c} /></span>
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className={cn(
          "mt-3 rounded-md border px-4 py-3 text-[13.5px] leading-relaxed animate-in fade-in duration-150",
          picked === block.answer ? "bg-emerald-soft border-emerald/30" : "bg-blue-tint border-blue/20",
        )}>
          <div className={cn("font-semibold mb-1", picked === block.answer ? "text-emerald-deep" : "text-blue")}>
            {picked === block.answer ? "Correct" : "Not quite"}
          </div>
          <Rich text={block.explain} />
        </div>
      )}
    </div>
  );
}

/* ---- a derivation rendered as aligned steps with reasons ---- */
function Steps({ steps }) {
  return (
    <div className="my-3 border rounded-lg overflow-hidden">
      {steps.map(([tex, reason], i) => (
        <div key={i} className={cn(
          "grid sm:grid-cols-[1fr_minmax(0,230px)] gap-x-4 gap-y-1 px-4 py-3 items-center",
          i % 2 ? "bg-code-bg-light" : "bg-card",
          i > 0 && "border-t",
        )}>
          <div className="overflow-x-auto"><TeX block>{tex}</TeX></div>
          <div className="text-[12.5px] text-muted-foreground leading-snug sm:text-right">
            <Rich text={reason} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---- a formula taken apart piece by piece ----
   The point is not the algebra but the reading: each row says what one piece
   of the expression is actually measuring, and the closing line reads the
   whole thing back as an English sentence. */
function Decode({ block }) {
  return (
    <>
      {block.formula && (
        <div className="my-4 py-3 px-3 rounded-lg bg-amber-soft/40 border border-amber/25 overflow-x-auto">
          <TeX block>{block.formula}</TeX>
        </div>
      )}
      <div className="border rounded-lg overflow-hidden my-3">
        {block.parts.map(([tex, name, says], i) => (
          <div key={i} className={cn("px-4 py-3", i > 0 && "border-t", i % 2 ? "bg-code-bg-light" : "bg-card")}>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="overflow-x-auto max-w-full"><TeX>{tex}</TeX></span>
              {/* no label-mono here: it uppercases, which mangles inline math */}
              <span className="text-[12.5px] font-medium text-muted-foreground tracking-wide">
                <Rich text={name} />
              </span>
            </div>
            <div className="text-[13.5px] leading-relaxed text-foreground/85 mt-1.5 max-w-[70ch]">
              <Rich text={says} />
            </div>
          </div>
        ))}
      </div>
      {block.reading && (
        <div className="mt-4 rounded-lg border-l-[3px] border-amber bg-amber-soft/50 px-4 py-3">
          <div className="label-mono text-amber mb-1.5">Read it out loud</div>
          <div className="text-[14.5px] leading-relaxed max-w-[70ch] whitespace-pre-line">
            <Rich text={block.reading} />
          </div>
        </div>
      )}
    </>
  );
}

/* ---- a derivation, folded away until asked for ----
   The result and the one-line summary of the argument stay visible; the
   algebra is opt-in, so the page reads as prose until you want the proof. */
function Proof({ block, idx }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {block.claim && (
        <div className="my-3 py-2 overflow-x-auto"><TeX block>{block.claim}</TeX></div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        data-act="toggle-proof"
        data-proof={idx}
        aria-expanded={open}
        className="flex items-center gap-2 text-[13.5px] font-medium text-blue hover:underline mt-1"
      >
        <ChevronDown className={cn("size-4 transition-transform duration-150", !open && "-rotate-90")} />
        {open ? "Hide the derivation" : `Show the derivation (${block.steps.length} steps)`}
      </button>
      {open && (
        <div className="animate-in fade-in duration-150">
          {block.setup && (
            <div className="text-[14.5px] leading-relaxed max-w-[74ch] mt-3 whitespace-pre-line">
              <Rich text={block.setup} />
            </div>
          )}
          <Steps steps={block.steps} />
        </div>
      )}
    </>
  );
}

function Block({ block, idx }) {
  const meta = KIND_META[block.kind];
  const Icon = meta.icon;

  return (
    <Panel className="p-5 md:p-6" data-block={block.kind}>
      <div className="flex items-center gap-2.5 mb-3">
        <span className={cn("grid place-items-center size-7 rounded-md", meta.tone)}>
          <Icon className="size-3.5" strokeWidth={2} />
        </span>
        <span className="label-mono text-muted-foreground">{meta.label}</span>
        {block.title && <span className="text-[15px] font-semibold ml-0.5"><Rich text={block.title} /></span>}
      </div>

      {block.kind === "check" ? <Check block={block} idx={idx} /> : (
        <>
          {block.body && (
            <div className="text-[15px] leading-relaxed max-w-[74ch] whitespace-pre-line">
              <Rich text={block.body} />
            </div>
          )}

          {block.tex?.map((t, i) => (
            <div key={i} className="my-3 py-2 overflow-x-auto"><TeX block>{t}</TeX></div>
          ))}

          {block.kind === "decode" && <Decode block={block} />}
          {block.kind === "proof" && <Proof block={block} idx={idx} />}

          {block.diagram && <Diagram name={block.diagram} />}

          {block.list && (
            <ol className="mt-3 grid gap-2 list-decimal ml-5 text-[14.5px] leading-relaxed max-w-[74ch]">
              {block.list.map((li, i) => <li key={i} className="pl-1"><Rich text={li} /></li>)}
            </ol>
          )}

          {block.steps && block.kind !== "proof" && <Steps steps={block.steps} />}

          {block.code && (
            <CodeFrame filename={block.file || "python"} className="mt-4">
              <pre className="font-mono text-[13px] leading-relaxed text-code-fg p-4 overflow-x-auto whitespace-pre">{block.code}</pre>
            </CodeFrame>
          )}

          {block.after && (
            <div className="text-[14.5px] leading-relaxed max-w-[74ch] mt-3 whitespace-pre-line">
              <Rich text={block.after} />
            </div>
          )}
        </>
      )}
    </Panel>
  );
}

export default function Lesson({ id }) {
  const progress = useProgress();
  const m = moduleById(id) || ALL_MODULES[0];
  const pos = ALL_MODULES.findIndex((x) => x.id === m.id);
  const prev = ALL_MODULES[pos - 1];
  const next = ALL_MODULES[pos + 1];

  useEffect(() => { markLessonRead(m.id); }, [m.id]);

  return (
    <div className="max-w-[860px]">
      <a href="#/study" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-blue hover:underline mb-4">
        <ArrowLeft className="size-3.5" /> All modules
      </a>

      <div className="mb-6">
        <SectionLabel className="text-blue">{m.part} · Module {pos + 1} of {ALL_MODULES.length}</SectionLabel>
        <h1 className="text-[26px] md:text-3xl font-semibold tracking-tight mt-1.5 leading-tight">{m.title}</h1>
        <p className="text-[14.5px] text-muted-foreground mt-2 leading-relaxed max-w-[70ch]">{m.summary}</p>
      </div>

      <div className="grid gap-4">
        {m.blocks.map((b, i) => <Block key={i} block={b} idx={i} />)}
      </div>

      <ModuleQuiz
        moduleId={m.id}
        nextHref={next ? `#/lesson?id=${next.id}` : "#/exam"}
        nextLabel={next ? "Next module" : "Practice midterm"}
      />

      <div className="flex items-center justify-between gap-3 mt-8 pt-5 border-t">
        {prev ? (
          <Button asChild variant="outline" size="sm" className="rounded-md bg-card">
            <a href={`#/lesson?id=${prev.id}`}><ArrowLeft className="size-3.5" /> {prev.title}</a>
          </Button>
        ) : <span />}
        {next ? (
          <Button asChild size="sm" className="rounded-md bg-blue-bright hover:bg-blue ml-auto" data-act="next-lesson">
            <a href={`#/lesson?id=${next.id}`}>{next.title} <ArrowRight className="size-3.5" /></a>
          </Button>
        ) : (
          <Button asChild size="sm" className="rounded-md bg-slate-deep hover:bg-navy ml-auto">
            <a href="#/exam">Take the practice midterm <ArrowRight className="size-3.5" /></a>
          </Button>
        )}
      </div>
    </div>
  );
}
