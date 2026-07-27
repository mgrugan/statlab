import { useEffect, useMemo, useState } from "react";
import { Play, RotateCcw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APPLIED } from "@/data/applied";
import { checkApplied, LANG_META } from "@/lib/quiz";
import { record, statusOf, useProgress, xpValue } from "@/lib/progress";
import { useSectionState, applyFilters } from "@/lib/sectionState";
import {
  LangChip, DiffChip, SolvedChip, MdLite, Toolbar, EmptyState,
  Panel, SectionLabel, CodeFrame,
} from "@/components/shared";

const LANG_OPTIONS = [["all", "All languages"], ["r", "R"], ["python", "Python"]];
const FILENAME = { r: "solution.R", python: "solution.py" };

export default function Practice({ jumpTo }) {
  const progress = useProgress();
  const [{ filters, idx }, update] = useSectionState("applied");
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);   // null | {ok, missing, earned}
  const [hintN, setHintN] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [bottomTab, setBottomTab] = useState("console");
  const [lastGraded, setLastGraded] = useState(null);

  const topics = useMemo(() => [...new Set(APPLIED.map((q) => q.topic))].sort(), []);
  const list = applyFilters(APPLIED, filters, (id) => statusOf(progress, id));
  const q = list[idx < list.length ? idx : 0];

  /* deep link (#/practice?q=ap12) from the dashboard challenge card */
  useEffect(() => {
    if (!jumpTo) return;
    const cleared = { lang: "all", topic: "all", diff: "all", status: "all" };
    const i = APPLIED.findIndex((x) => x.id === jumpTo);
    if (i >= 0) update({ filters: cleared, idx: i });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumpTo]);

  const resetCard = () => { setAnswer(""); setResult(null); setHintN(0); setRevealed(false); setBottomTab("console"); setLastGraded(null); };
  const goto = (i) => { update({ idx: i }); resetCard(); };

  const doCheck = () => {
    const val = answer.trim();
    if (!q || !val) return;
    if (result?.ok) return;                  // already solved this card
    if (val === lastGraded) return;          // same submission — don't re-record
    setLastGraded(val);
    const res = checkApplied(q, answer);
    const firstSolve = res.ok && statusOf(progress, q.id) !== "correct";
    record(q.id, res.ok);
    setResult({ ...res, earned: firstSolve ? xpValue(q.id) : 0 });
    setBottomTab(res.ok ? "console" : "tests");
    if (res.ok) setRevealed(true);
  };
  const doReveal = () => {
    if (!q || revealed) return;              // solved or already revealed — no double penalty
    record(q.id, false, "reveal");
    setRevealed(true);
  };
  const doHint = () => {
    if (!q) return;
    setHintN((n) => Math.min(n + 1, q.req.length));
    setBottomTab("tests");
  };

  const successRate = q && progress.answers[q.id]?.tries
    ? Math.round(
        ((statusOf(progress, q.id) === "correct" ? 1 : 0) /
          progress.answers[q.id].tries) * 100)
    : null;

  const problemNo = q ? 400 + APPLIED.findIndex((x) => x.id === q.id) : 0;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <SectionLabel className="text-blue">Section 02 — Applied Problems</SectionLabel>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">Practice</h1>
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

      {!q ? <EmptyState /> : (
        <div key={q.id} className="animate-in fade-in duration-200">
          {/* problem header */}
          <div className="mb-5">
            <SectionLabel>Problem #{problemNo}</SectionLabel>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">{q.title}</h2>
              <span className="flex items-center gap-2">
                <DiffChip diff={q.diff} />
                <LangChip lang={q.lang} />
                <span className="label-mono text-muted-foreground">{q.topic}</span>
                {statusOf(progress, q.id) === "correct" && <SolvedChip />}
              </span>
              <Button data-act="next" variant="outline" size="sm" className="ml-auto rounded-md bg-card text-blue" onClick={() => goto((idx + 1) % list.length)}>
                Next problem →
              </Button>
            </div>
          </div>

          <div className="grid xl:grid-cols-2 gap-6 items-start">
            {/* left: description / editorial */}
            <Panel className="overflow-hidden">
              <Tabs defaultValue="description">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
                  <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-bright data-[state=active]:shadow-none px-4 py-2.5 text-[13px]">
                    Description
                  </TabsTrigger>
                  <TabsTrigger value="editorial" onClick={() => { if (!revealed) doReveal(); }} className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-bright data-[state=active]:shadow-none px-4 py-2.5 text-[13px]">
                    Editorial
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="p-5 md:p-6">
                  <SectionLabel className="mb-2">Scenario</SectionLabel>
                  <p className="text-[15px] leading-relaxed max-w-[62ch]"><MdLite text={q.scenario} /></p>

                  <div className="mt-5 border rounded-md bg-code-bg-light p-4">
                    <SectionLabel className="mb-1.5">Required Language</SectionLabel>
                    <span className="font-mono text-[13px] font-semibold">{LANG_META[q.lang].name}</span>
                    <span className="font-mono text-[12px] text-muted-foreground ml-2">· {FILENAME[q.lang]}</span>
                  </div>

                  <SectionLabel className="mt-6 mb-2">Objective</SectionLabel>
                  <p className="text-[15px] leading-relaxed max-w-[62ch]"><MdLite text={q.task} /></p>

                  <div className="mt-5 flex items-center gap-4 text-[12px] text-muted-foreground border-t pt-4">
                    <span className="tabular-nums">Reward: <b className="text-blue">{xpValue(q.id)} XP</b> (first solve)</span>
                    {successRate !== null && <span className="tabular-nums">Your attempts: {progress.answers[q.id].tries}</span>}
                  </div>
                </TabsContent>

                <TabsContent value="editorial" className="p-5 md:p-6">
                  {revealed ? (
                    <>
                      <SectionLabel className="mb-2 text-emerald-deep">Model Solution</SectionLabel>
                      <pre className="font-mono text-[13px] leading-relaxed text-code-fg bg-code-bg rounded-lg p-4 overflow-x-auto">{q.sol}</pre>
                      <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground border-l-2 border-blue-bright pl-3.5">
                        <MdLite text={q.exp} />
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Opening the editorial reveals the model solution (and marks the problem as revealed).</p>
                  )}
                </TabsContent>
              </Tabs>
            </Panel>

            {/* right: editor + console */}
            <div className="grid gap-4 xl:sticky xl:top-20">
              <CodeFrame
                filename={`${FILENAME[q.lang]} · ${LANG_META[q.lang].name}`}
                actions={
                  <button className="label-mono text-[#94a3b8] hover:text-white flex items-center gap-1" onClick={resetCard} title="Reset editor">
                    <RotateCcw className="size-3" /> Reset
                  </button>
                }
              >
                <Textarea
                  id="ans"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); doCheck(); }
                  }}
                  spellCheck={false}
                  placeholder={q.lang === "python" ? "# write your solution here…" : "# write your solution here…"}
                  className="min-h-[220px] font-mono text-[13px] leading-relaxed px-4 py-3.5 bg-transparent text-code-fg border-0 rounded-none caret-emerald-bright placeholder:text-[#64748b] focus-visible:ring-0 resize-y"
                />
                <div className="flex items-center gap-2 px-3 py-2.5 bg-[#1e293b] border-t border-[#334155]">
                  <span className="label-mono text-[#64748b] hidden sm:block">Ctrl+Enter to submit</span>
                  <span className="flex-1" />
                  <Button data-act="hint" size="sm" variant="ghost" className="h-8 rounded-md text-[#cbd5e1] hover:text-white hover:bg-[#334155]" onClick={doHint}>
                    Hint
                  </Button>
                  <Button data-act="check" size="sm" className="h-8 rounded-md bg-blue-bright hover:bg-blue text-white" onClick={doCheck}>
                    Submit <Send className="size-3.5" />
                  </Button>
                </div>
              </CodeFrame>

              <Panel className="overflow-hidden">
                <Tabs value={bottomTab} onValueChange={setBottomTab}>
                  <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
                    <TabsTrigger value="console" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-bright data-[state=active]:shadow-none px-4 py-2 text-[13px]">
                      Console Output
                    </TabsTrigger>
                    <TabsTrigger value="tests" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-bright data-[state=active]:shadow-none px-4 py-2 text-[13px]">
                      Concept Checks {result ? `(${q.req.length - result.missing.length}/${q.req.length})` : `(${q.req.length})`}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="console" className="m-0">
                    <div data-feedback className="bg-code-bg font-mono text-[12.5px] leading-relaxed p-4 min-h-[96px]">
                      {!result && <span className="text-[#64748b]">[info] Environment ready. Submit your {LANG_META[q.lang].name} solution to run concept checks.</span>}
                      {result?.ok && (
                        <>
                          <div className="text-[#4edea3]">[pass] All {q.req.length} concept checks passed.</div>
                          {result.earned > 0 && <div className="text-[#a5d6ff]">[xp]   +{result.earned} XP awarded</div>}
                          <div className="text-[#94a3b8]">[info] Model solution unlocked in the Editorial tab.</div>
                        </>
                      )}
                      {result && !result.ok && (
                        <>
                          <div className="text-[#ff7b72]">[fail] {result.missing.length} of {q.req.length} concept checks failed.</div>
                          <div className="text-[#94a3b8]">[info] See the Concept Checks tab for what's missing.</div>
                        </>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="tests" className="m-0">
                    <ul className="divide-y">
                      {q.req.map((r, i) => {
                        const state = result
                          ? (result.missing.includes(r) ? "fail" : "pass")
                          : (i < hintN ? "hint" : "pending");
                        return (
                          <li key={i} className="flex items-center gap-3 px-4 py-2.5 text-[13px]">
                            <span className={
                              state === "pass" ? "size-2 rounded-full bg-emerald shrink-0"
                              : state === "fail" ? "size-2 rounded-full bg-destructive shrink-0"
                              : "size-2 rounded-full bg-input shrink-0"
                            } />
                            {state === "pending"
                              ? <span className="text-muted-foreground">Concept check {i + 1} — hidden (use Hint to peek)</span>
                              : <span className={state === "fail" ? "text-destructive" : ""}>{r.hint}</span>}
                          </li>
                        );
                      })}
                    </ul>
                  </TabsContent>
                </Tabs>
              </Panel>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
