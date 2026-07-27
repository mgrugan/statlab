import { useMemo, useRef, useState } from "react";
import { Flame, Lightbulb, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DRILLS } from "@/data/drills";
import { checkDrill, LANG_META } from "@/lib/quiz";
import { record, statusOf, useProgress, questionMeta, xpValue } from "@/lib/progress";
import { useSectionState, applyFilters } from "@/lib/sectionState";
import {
  LangChip, DiffChip, SolvedChip, MdLite, Toolbar, EmptyState,
  Panel, Bar, SectionLabel,
} from "@/components/shared";

const LANG_OPTIONS = [
  ["all", "All languages"], ["r", "R"], ["python", "Python"], ["sql", "SQL"],
];

export default function Learn() {
  const progress = useProgress();
  const [{ filters, idx }, update] = useSectionState("drills");
  const [answer, setAnswer] = useState("");
  const [verdict, setVerdict] = useState(null);   // null | "ok" | "bad"
  const [revealed, setRevealed] = useState(false);
  const [session, setSession] = useState({ attempts: 0, correct: 0, streak: 0 });
  const [earned, setEarned] = useState(0);
  const [lastGraded, setLastGraded] = useState(null);
  const inputRef = useRef(null);

  const topics = useMemo(() => [...new Set(DRILLS.map((q) => q.topic))].sort(), []);
  const list = applyFilters(DRILLS, filters, (id) => statusOf(progress, id));
  const q = list[idx < list.length ? idx : 0];

  const solvedInModule = list.filter((x) => statusOf(progress, x.id) === "correct").length;
  const modulePct = list.length ? Math.round((solvedInModule / list.length) * 100) : 0;

  const recent = progress.log
    .filter((e) => questionMeta(e.qid)?.kind === "drill")
    .slice(0, 4);

  const resetCard = () => { setAnswer(""); setVerdict(null); setRevealed(false); setLastGraded(null); setEarned(0); };
  const goto = (i) => { update({ idx: i }); resetCard(); inputRef.current?.focus(); };

  const doCheck = () => {
    const val = answer.trim();
    if (!q || !val) return;
    if (verdict === "ok") return;            // already solved this card
    if (val === lastGraded) return;          // same submission — don't re-record
    setLastGraded(val);
    const ok = checkDrill(q, answer);
    const firstSolve = ok && statusOf(progress, q.id) !== "correct";
    setEarned(firstSolve ? xpValue(q.id) : 0);
    record(q.id, ok);
    setSession((s) => ({
      attempts: s.attempts + 1,
      correct: s.correct + (ok ? 1 : 0),
      streak: ok ? s.streak + 1 : 0,
    }));
    setVerdict(ok ? "ok" : "bad");
    if (ok) setRevealed(true);
  };
  const doReveal = () => {
    if (!q || revealed) return;              // solved or already revealed — no double penalty
    record(q.id, false, "reveal");
    setSession((s) => ({ ...s, attempts: s.attempts + 1, streak: 0 }));
    setRevealed(true);
  };

  const sessionAccuracy = session.attempts
    ? Math.round((session.correct / session.attempts) * 100) : null;

  return (
    <div>
      {/* module header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <SectionLabel className="text-blue">Module 01 — Command Drills</SectionLabel>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">Learn Commands</h1>
        </div>
        <div className="w-full sm:w-64">
          <div className="flex justify-between text-[12px] text-muted-foreground mb-1.5 tabular-nums">
            <span>Progress: {solvedInModule}/{list.length}</span>
            <span className="font-semibold text-blue">{modulePct}%</span>
          </div>
          <Bar pct={modulePct} />
        </div>
      </div>

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

      <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
        {/* question card */}
        {!q ? <EmptyState /> : (
          <div key={q.id} className="animate-in fade-in duration-200">
            <Panel className="p-6 md:p-8">
              <div className="flex items-center gap-2 flex-wrap mb-6">
                <LangChip lang={q.lang} solid />
                <DiffChip diff={q.diff} />
                <span className="label-mono text-muted-foreground">{q.topic}</span>
                <span className="flex-1" />
                {statusOf(progress, q.id) === "correct" && <SolvedChip />}
              </div>

              <p className="text-[17px] leading-relaxed max-w-[62ch]"><MdLite text={q.q} /></p>

              <div className="mt-6 flex gap-2">
                <Input
                  id="ans"
                  ref={inputRef}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); doCheck(); } }}
                  autoComplete="off"
                  spellCheck={false}
                  autoFocus
                  placeholder="Type the command here…"
                  className="h-11 font-mono text-sm bg-card rounded-md border-input focus-visible:border-blue-bright focus-visible:ring-0 focus-visible:border-2"
                />
                <Button data-act="check" onClick={doCheck} className="h-11 px-5 rounded-md bg-blue-bright hover:bg-blue">
                  Enter
                </Button>
              </div>

              <div data-feedback>
                {verdict === "ok" && (
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-deep bg-emerald-soft border border-emerald/20 rounded-md px-4 py-3 animate-in fade-in duration-150">
                    ✓ Correct{earned ? ` · +${earned} XP` : ""}
                  </div>
                )}
                {verdict === "bad" && (
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-destructive bg-[#ffdad6]/50 border border-destructive/20 rounded-md px-4 py-3 animate-in fade-in duration-150">
                    ✗ Not quite — tweak it and press Enter again, or reveal.
                  </div>
                )}
              </div>

              {revealed && (
                <div className="mt-5 animate-in fade-in duration-200">
                  <SectionLabel className="text-emerald-deep mb-2">Answer</SectionLabel>
                  <pre className="font-mono text-sm leading-relaxed text-code-fg bg-code-bg rounded-lg p-4 overflow-x-auto">{q.a}</pre>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground border-l-2 border-blue-bright pl-3.5 max-w-[68ch]">
                    <MdLite text={q.exp} />
                  </p>
                </div>
              )}

              <div className="flex gap-2 mt-6 pt-5 border-t">
                <Button data-act="reveal" variant="outline" size="sm" className="rounded-md bg-card" onClick={doReveal}>
                  Reveal
                </Button>
                <Button data-act="next" variant="outline" size="sm" className="rounded-md bg-card text-blue" onClick={() => goto((idx + 1) % list.length)}>
                  Next →
                </Button>
                <span className="ml-auto text-[11px] text-muted-foreground self-center hidden sm:block">
                  Answers are format-forgiving: spacing and quote style don't matter.
                </span>
              </div>
            </Panel>

            <p className="flex items-center gap-2 text-[12px] italic text-muted-foreground mt-3 px-1">
              <Lightbulb className="size-3.5 shrink-0" />
              Tip: case sensitivity matters in real {q ? LANG_META[q.lang].name : "R"} — the grader is lenient, exams aren't.
            </p>
          </div>
        )}

        {/* right rail */}
        <div className="grid gap-4">
          <Panel className="p-4">
            <SectionLabel className="mb-3">Session Stats</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded-md p-3">
                <div className="text-[11px] text-muted-foreground mb-0.5">Accuracy</div>
                <div className="text-xl font-semibold tabular-nums">
                  {sessionAccuracy === null ? "—" : `${sessionAccuracy}%`}
                </div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-[11px] text-muted-foreground mb-0.5">Streak</div>
                <div className="text-xl font-semibold tabular-nums flex items-center gap-1">
                  {session.streak}
                  {session.streak >= 3 && <Flame className="size-4 text-amber" />}
                </div>
              </div>
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center justify-between px-4 py-3 bg-slate-deep rounded-t-lg">
              <span className="label-mono text-white">Recent Review</span>
              <RotateCcw className="size-3.5 text-[#94a3b8]" />
            </div>
            {recent.length === 0 ? (
              <p className="px-4 py-4 text-[13px] text-muted-foreground">
                Answer a few drills and they'll show up here for review.
              </p>
            ) : (
              <ul className="divide-y">
                {recent.map((e, i) => {
                  const dq = DRILLS.find((x) => x.id === e.qid);
                  if (!dq) return null;
                  return (
                    <li key={i} className="px-4 py-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-mono text-[13px] font-medium truncate">{dq.a.split("\n")[0]}</div>
                        <div className="text-[12px] text-muted-foreground truncate">{dq.topic}</div>
                      </div>
                      <span className={`label-mono shrink-0 ${e.kind === "solve" ? "text-emerald-deep" : "text-muted-foreground"}`}>
                        {LANG_META[dq.lang].name}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
