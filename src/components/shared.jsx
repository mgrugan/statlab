import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { LANG_META, mdlite } from "@/lib/quiz";
import { cn } from "@/lib/utils";

/* StatCode badge style: rectangular-ish, tinted background, mono label */
export function LangChip({ lang, solid = false }) {
  const m = LANG_META[lang];
  return (
    <Badge className={cn("rounded-sm border-transparent label-mono", solid ? m.solid : m.soft)}>
      {m.name}
    </Badge>
  );
}

export function TopicChip({ topic }) {
  return (
    <Badge variant="outline" className="rounded-sm label-mono text-muted-foreground bg-card">
      {topic}
    </Badge>
  );
}

const DIFF_META = {
  1: { label: "Easy",   cls: "bg-emerald-soft text-emerald-deep" },
  2: { label: "Medium", cls: "bg-amber-soft text-amber" },
  3: { label: "Hard",   cls: "bg-[#ffdad6] text-[#93000a]" },
};

export function DiffChip({ diff }) {
  const m = DIFF_META[diff];
  return <Badge className={cn("rounded-sm border-transparent label-mono", m.cls)}>{m.label}</Badge>;
}

export function XpChip({ qid, xp }) {
  return (
    <Badge className="rounded-sm border-transparent label-mono bg-blue-tint text-blue">
      {xp} XP
    </Badge>
  );
}

export function SolvedChip() {
  return (
    <Badge className="rounded-sm border-transparent label-mono bg-emerald-soft text-emerald-deep">
      <CheckCircle2 data-slot="icon" /> Solved
    </Badge>
  );
}

/* markdown-lite renderer (content is authored in-repo and escaped in mdlite) */
export function MdLite({ text, className }) {
  return <span className={cn("mdlite", className)} dangerouslySetInnerHTML={{ __html: mdlite(text) }} />;
}

export function SectionLabel({ children, className }) {
  return <div className={cn("label-mono text-muted-foreground", className)}>{children}</div>;
}

/* Level-1 card: white, 1px border, no shadow (tonal depth) */
export function Panel({ className, children, ...props }) {
  return (
    <div className={cn("bg-card border rounded-lg", className)} {...props}>
      {children}
    </div>
  );
}

/* 4px linear progress bar — blue in progress, emerald complete */
export function Bar({ pct, complete, className }) {
  return (
    <div className={cn("h-1 rounded-sm bg-muted overflow-hidden", className)}>
      <div
        className={cn("h-full rounded-sm transition-all duration-300", complete || pct >= 100 ? "bg-emerald" : "bg-blue-bright")}
        style={{ width: `${Math.min(100, pct)}%` }}
      />
    </div>
  );
}

const DIFF_OPTIONS = [
  ["all", "Any difficulty"], ["1", "Easy"], ["2", "Medium"], ["3", "Hard"],
];
const STATUS_OPTIONS = [
  ["all", "Any status"], ["unseen", "Unseen"], ["correct", "Solved"], ["missed", "Missed"],
];

function FilterSelect({ value, onChange, options, width = "w-[150px]" }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" className={cn("bg-card rounded-md text-[13px] font-medium", width)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map(([v, l]) => (
          <SelectItem key={v} value={v}>{l}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function Toolbar({ filters, setFilters, topics, langs, pos, total, onRandom }) {
  const set = (k) => (v) => setFilters({ ...filters, [k]: v });
  return (
    <div className="flex flex-wrap items-center gap-2 mb-5">
      <FilterSelect value={filters.lang} onChange={set("lang")} options={langs} width="w-[130px]" />
      <FilterSelect value={filters.topic} onChange={set("topic")} options={[["all", "All topics"], ...topics.map((t) => [t, t])]} width="w-[180px]" />
      <FilterSelect value={filters.diff} onChange={set("diff")} options={DIFF_OPTIONS} width="w-[140px]" />
      <FilterSelect value={filters.status} onChange={set("status")} options={STATUS_OPTIONS} width="w-[120px]" />
      <Button variant="outline" size="sm" className="rounded-md bg-card text-blue" onClick={onRandom}>
        Random
      </Button>
      <span className="flex-1" />
      <span className="label-mono text-muted-foreground tabular-nums" data-pos>
        {total ? `${pos + 1} / ${total}` : "0 matches"}
      </span>
    </div>
  );
}

export function EmptyState() {
  return (
    <Panel className="text-center py-16 px-5 text-muted-foreground border-dashed">
      <h3 className="text-lg font-semibold text-foreground mb-1">Nothing matches these filters</h3>
      <p className="text-sm">Loosen a filter above — or you've genuinely solved everything here.</p>
    </Panel>
  );
}

/* IDE-style code frame with header bar (per the design system spec) */
export function CodeFrame({ filename, children, actions, className }) {
  return (
    <div className={cn("rounded-lg overflow-hidden border border-slate-deep bg-code-bg", className)}>
      <div className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] border-b border-[#334155]">
        <span className="size-2.5 rounded-full bg-[#475569]" />
        <span className="size-2.5 rounded-full bg-[#475569]" />
        <span className="size-2.5 rounded-full bg-[#475569]" />
        <span className="label-mono text-[#94a3b8] ml-2">{filename}</span>
        <span className="flex-1" />
        {actions}
      </div>
      {children}
    </div>
  );
}
