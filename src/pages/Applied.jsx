import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { APPLIED } from "@/data/applied";
import { checkApplied, LANG_META } from "@/lib/quiz";
import { record, statusOf, useProgress } from "@/lib/progress";
import { useSectionState, applyFilters } from "@/lib/sectionState";
import {
  LangChip, TopicChip, DiffDots, SolvedChip, MdLite, PageHead,
  Toolbar, EmptyState, Solution, Feedback,
} from "@/components/shared";

const LANG_OPTIONS = [
  ["all", "All languages"], ["r", "R"], ["python", "Python"],
];

export default function Applied() {
  const progress = useProgress();
  const [{ filters, idx }, update] = useSectionState("applied");
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);   // null | {ok, missing}
  const [hint, setHint] = useState(null);       // null | {n, text}
  const [hintCount, setHintCount] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const topics = useMemo(() => [...new Set(APPLIED.map((q) => q.topic))].sort(), []);
  const list = applyFilters(APPLIED, filters, (id) => statusOf(progress, id));
  const q = list[idx < list.length ? idx : 0];

  const resetCard = () => { setAnswer(""); setResult(null); setHint(null); setHintCount(0); setRevealed(false); };
  const goto = (i) => { update({ idx: i }); resetCard(); };

  const doCheck = () => {
    if (!q || !answer.trim()) return;
    const res = checkApplied(q, answer);
    record(q.id, res.ok);
    setHint(null);
    setResult(res);
    if (res.ok) setRevealed(true);
  };
  const doHint = () => {
    if (!q) return;
    const n = Math.min(hintCount, q.req.length - 1);
    setResult(null);
    setHint({ n: n + 1, total: q.req.length, text: q.req[n].hint });
    setHintCount(hintCount + 1);
  };
  const doReveal = () => {
    if (!q) return;
    record(q.id, false);
    setRevealed(true);
  };

  return (
    <div>
      <PageHead
        title="Applied Problems"
        blurb="Real-world scenarios — the kind of asks that land on an analyst's desk. Each problem tells you which language to answer in; grading checks that the key moves appear in your code."
      />
      <Toolbar
        filters={filters}
        setFilters={(f) => { update({ filters: f, idx: 0 }); resetCard(); }}
        topics={topics}
        langs={LANG_OPTIONS}
        pos={idx < list.length ? idx : 0}
        total={list.length}
        onRandom={() => {
          if (list.length > 1) {
            let n; do { n = Math.floor(Math.random() * list.length); } while (n === idx);
            goto(n);
          }
        }}
      />

      {!q ? <EmptyState /> : (
        <div key={q.id} className="bg-card border rounded-xl p-6 md:p-7 shadow-raised animate-in fade-in slide-in-from-bottom-1 duration-200">
          <div className="flex items-center gap-2.5 flex-wrap mb-4">
            <LangChip lang={q.lang} />
            <TopicChip topic={q.topic} />
            <DiffDots diff={q.diff} />
            {statusOf(progress, q.id) === "correct" && <SolvedChip />}
          </div>

          <h2 className="font-display text-[22px] font-semibold tracking-tight mb-2.5">{q.title}</h2>
          <p className="border-l-[3px] pl-4 py-1 text-muted-foreground max-w-[72ch] my-3">
            <MdLite text={q.scenario} />
          </p>
          <p className="text-base max-w-[72ch] my-3">
            <strong className="text-evergreen">Task (answer in {LANG_META[q.lang].name}):</strong>{" "}
            <MdLite text={q.task} />
          </p>

          <div className="mt-5">
            <label htmlFor="ans" className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-muted-foreground mb-2">
              Your {LANG_META[q.lang].name} code
            </label>
            <Textarea
              id="ans"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); doCheck(); }
              }}
              spellCheck={false}
              autoFocus
              placeholder="# write your solution here…"
              className="min-h-[130px] font-mono text-sm leading-relaxed px-4 py-3.5 bg-code-bg text-code-fg border-transparent caret-[#9BD4BC] placeholder:text-code-fg/40 focus-visible:border-evergreen focus-visible:ring-evergreen/30"
            />
          </div>

          <div className="flex gap-2.5 flex-wrap items-center mt-4">
            <Button data-act="check" onClick={doCheck}>Check</Button>
            <Button data-act="hint" variant="outline" className="bg-card" onClick={doHint}>Hint</Button>
            <Button data-act="reveal" variant="outline" className="bg-card" onClick={doReveal}>Reveal solution</Button>
            <Button data-act="next" variant="outline" className="bg-card" onClick={() => goto((idx + 1) % list.length)}>
              Next →
            </Button>
            <span className="ml-auto text-xs text-muted-foreground">
              <kbd className="font-mono text-[11px] bg-background border border-b-2 rounded px-1.5 py-0.5">Ctrl</kbd>+<kbd className="font-mono text-[11px] bg-background border border-b-2 rounded px-1.5 py-0.5">Enter</kbd> to check
            </span>
          </div>

          <div data-feedback>
            {result?.ok && (
              <Feedback kind="ok"><div className="font-bold text-evergreen">✓ Correct — all the key moves are there.</div></Feedback>
            )}
            {result && !result.ok && (
              <Feedback kind="bad">
                <div className="font-bold text-destructive">
                  ✗ Missing {result.missing.length} key concept{result.missing.length > 1 ? "s" : ""}:
                </div>
                <ul className="list-disc ml-5 mt-2 space-y-0.5">
                  {result.missing.map((m, i) => <li key={i}>{m.hint}</li>)}
                </ul>
              </Feedback>
            )}
            {hint && (
              <Feedback kind="ok">
                <div className="font-bold text-evergreen">Hint {hint.n} of {hint.total}</div>
                <ul className="list-disc ml-5 mt-2"><li>{hint.text}</li></ul>
              </Feedback>
            )}
          </div>

          {revealed && <Solution label="Model solution" code={q.sol} explain={q.exp} />}
        </div>
      )}
    </div>
  );
}
