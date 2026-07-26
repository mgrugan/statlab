import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LANG_META, DIFF_LABEL, mdlite } from "@/lib/quiz";
import { cn } from "@/lib/utils";

export function LangChip({ lang, soft = false }) {
  const m = LANG_META[lang];
  return (
    <Badge className={cn("rounded-full uppercase tracking-[0.08em] text-[11px] font-semibold border-transparent", soft ? m.soft : m.solid)}>
      {m.name}
    </Badge>
  );
}

export function TopicChip({ topic }) {
  return (
    <Badge variant="outline" className="rounded-full text-[11px] font-semibold text-muted-foreground bg-background">
      {topic}
    </Badge>
  );
}

export function DiffDots({ diff }) {
  return (
    <span className="text-xs tracking-[0.15em] text-muted-foreground">
      <b className="text-amber">{"●".repeat(diff)}</b>
      {"○".repeat(3 - diff)}
      <span className="ml-1 tracking-normal">{DIFF_LABEL[diff]}</span>
    </span>
  );
}

export function SolvedChip() {
  return (
    <Badge className="rounded-full border-transparent bg-r-soft text-evergreen text-[11px] font-semibold">
      ✓ solved
    </Badge>
  );
}

/* markdown-lite renderer (content is authored in-repo and escaped in mdlite) */
export function MdLite({ text, className }) {
  return <span className={cn("mdlite", className)} dangerouslySetInnerHTML={{ __html: mdlite(text) }} />;
}

export function PageHead({ title, blurb }) {
  return (
    <div className="mb-5">
      <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="text-muted-foreground max-w-[62ch] mt-1">{blurb}</p>
    </div>
  );
}

const DIFF_OPTIONS = [
  ["all", "Any difficulty"], ["1", "● Intro"], ["2", "●● Core"], ["3", "●●● Challenge"],
];
const STATUS_OPTIONS = [
  ["all", "Any status"], ["unseen", "Unseen"], ["correct", "Solved"], ["missed", "Missed"],
];

function FilterSelect({ value, onChange, options, width = "w-[150px]" }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" className={cn("bg-card font-medium", width)}>
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
    <div className="flex flex-wrap items-center gap-2.5 my-5">
      <span className="text-xs font-semibold tracking-wide text-muted-foreground">Filter</span>
      <FilterSelect value={filters.lang} onChange={set("lang")} options={langs} width="w-[140px]" />
      <FilterSelect value={filters.topic} onChange={set("topic")} options={[["all", "All topics"], ...topics.map((t) => [t, t])]} width="w-[180px]" />
      <FilterSelect value={filters.diff} onChange={set("diff")} options={DIFF_OPTIONS} width="w-[150px]" />
      <FilterSelect value={filters.status} onChange={set("status")} options={STATUS_OPTIONS} width="w-[130px]" />
      <Button variant="outline" size="sm" className="bg-card" onClick={onRandom} title="Jump to a random question">
        Random
      </Button>
      <span className="flex-1" />
      <span className="text-[13px] text-muted-foreground tabular-nums">
        {total ? `${pos + 1} / ${total}` : "0 questions"}
      </span>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="text-center py-16 px-5 text-muted-foreground bg-card border border-dashed rounded-xl">
      <h3 className="font-display text-xl text-foreground mb-1.5">Nothing matches these filters</h3>
      <p>Loosen a filter above — or you've genuinely solved everything here. Respect.</p>
    </div>
  );
}

export function Solution({ label = "Answer", code, explain }) {
  return (
    <div className="mt-4 animate-in fade-in slide-in-from-bottom-1 duration-200">
      <span className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-evergreen mb-2">{label}</span>
      <pre className="font-mono text-sm leading-relaxed text-code-fg bg-code-bg rounded-lg p-4 overflow-x-auto">{code}</pre>
      <p className="mt-2.5 text-sm text-muted-foreground border-l-[3px] border-evergreen pl-3.5 max-w-[70ch]">
        <MdLite text={explain} />
      </p>
    </div>
  );
}

export function Feedback({ kind, children }) {
  const styles = kind === "ok"
    ? "bg-r-soft border-[#BCD6CA]"
    : "bg-[#F4E1DC] border-[#E0BBB1]";
  return (
    <div className={cn("mt-4 rounded-lg border px-4 py-3.5 text-sm animate-in fade-in duration-150", styles)}>
      {children}
    </div>
  );
}
