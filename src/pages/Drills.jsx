import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DRILLS } from "@/data/drills";
import { checkDrill, LANG_META } from "@/lib/quiz";
import { record, statusOf, useProgress } from "@/lib/progress";
import { useSectionState, applyFilters } from "@/lib/sectionState";
import {
  LangChip, TopicChip, DiffDots, SolvedChip, MdLite, PageHead,
  Toolbar, EmptyState, Solution, Feedback,
} from "@/components/shared";

const LANG_OPTIONS = [
  ["all", "All languages"], ["r", "R"], ["python", "Python"], ["sql", "SQL"],
];

export default function Drills() {
  const progress = useProgress();
  const [{ filters, idx }, update] = useSectionState("drills");
  const [answer, setAnswer] = useState("");
  const [verdict, setVerdict] = useState(null);   // null | "ok" | "bad"
  const [revealed, setRevealed] = useState(false);

  const topics = useMemo(() => [...new Set(DRILLS.map((q) => q.topic))].sort(), []);
  const list = applyFilters(DRILLS, filters, (id) => statusOf(progress, id));
  const q = list[idx < list.length ? idx : 0];

  const resetCard = () => { setAnswer(""); setVerdict(null); setRevealed(false); };
  const goto = (i) => { update({ idx: i }); resetCard(); };

  const doCheck = () => {
    if (!q || !answer.trim()) return;
    const ok = checkDrill(q, answer);
    record(q.id, ok);
    setVerdict(ok ? "ok" : "bad");
    if (ok) setRevealed(true);
  };
  const doReveal = () => {
    if (!q) return;
    record(q.id, false);
    setRevealed(true);
  };

  return (
    <div>
      <PageHead
        title="Command Drills"
        blurb="Flashcard-style reps for the commands themselves — type the exact call and get graded instantly. Whitespace and quote style don't matter; the command does."
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

          <p className="text-base max-w-[72ch]"><MdLite text={q.q} /></p>

          <div className="mt-5">
            <label htmlFor="ans" className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-muted-foreground mb-2">
              Your answer — {LANG_META[q.lang].name}
            </label>
            <Input
              id="ans"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); doCheck(); } }}
              autoComplete="off"
              spellCheck={false}
              autoFocus
              placeholder="type the command…"
              className="h-auto font-mono text-sm leading-relaxed px-4 py-3.5 bg-code-bg text-code-fg border-transparent caret-[#9BD4BC] placeholder:text-code-fg/40 focus-visible:border-evergreen focus-visible:ring-evergreen/30"
            />
          </div>

          <div className="flex gap-2.5 flex-wrap items-center mt-4">
            <Button data-act="check" onClick={doCheck}>Check</Button>
            <Button data-act="reveal" variant="outline" className="bg-card" onClick={doReveal}>Reveal</Button>
            <Button data-act="next" variant="outline" className="bg-card" onClick={() => goto((idx + 1) % list.length)}>
              Next →
            </Button>
            <span className="ml-auto text-xs text-muted-foreground">
              <kbd className="font-mono text-[11px] bg-background border border-b-2 rounded px-1.5 py-0.5">Enter</kbd> to check
            </span>
          </div>

          <div data-feedback>
            {verdict === "ok" && (
              <Feedback kind="ok"><div className="font-bold text-evergreen">✓ Correct</div></Feedback>
            )}
            {verdict === "bad" && (
              <Feedback kind="bad"><div className="font-bold text-destructive">✗ Not quite — tweak it and check again, or reveal.</div></Feedback>
            )}
          </div>

          {revealed && <Solution label="Answer" code={q.a} explain={q.exp} />}
        </div>
      )}
    </div>
  );
}
