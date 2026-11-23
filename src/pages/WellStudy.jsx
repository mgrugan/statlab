import { BookOpen, Clock3, CheckCircle2, ArrowRight, FileText, Flag, Trophy } from "lucide-react";
import { WB_MODULES, WB_EXAMS } from "@/data/wellbeing/course";
import { useProgress } from "@/lib/progress";
import { Panel, SectionLabel, Bar } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Rich as RichBase } from "@/components/Math";
/* This course has no mathematics in it, so the $…$ form is off: without
   that, a pair of dollar amounts in one sentence renders as KaTeX. */
const Rich = (props) => <RichBase {...props} tex={false} />;
import { cn } from "@/lib/utils";

export const wbModuleId = (i) => `w${String(i + 1).padStart(2, "0")}`;
export const wbExamId = (i) => "hyl" + "abc"[i];

export default function WellStudy() {
  const progress = useProgress();
  const seen = progress.lessons || {};
  const bests = progress.exams || {};
  const quizzes = progress.quizzes || {};
  const done = WB_MODULES.filter((_, i) => seen[wbModuleId(i)]).length;
  const passed = WB_MODULES.filter((_, i) => quizzes[wbModuleId(i)]?.passed).length;

  return (
    <div className="max-w-[860px] min-w-0">
      <SectionLabel className="text-emerald-deep">Hack Your Life · 85-105</SectionLabel>
      <h1 className="text-2xl font-semibold tracking-tight mt-1">Final exam revision</h1>
      <p className="text-[14px] text-muted-foreground mt-1.5 leading-relaxed max-w-[68ch]">
        Eighteen modules built from the lecture decks, the readings and the assigned talks. Each one
        opens with what is <strong className="text-foreground">most likely to be asked</strong> before
        the reading starts, closes with <strong className="text-foreground">five checkpoint
        questions</strong>, and none runs longer than about thirteen minutes.
      </p>

      {/* what the exam looks like */}
      <Panel className="p-5 mt-5">
        <SectionLabel className="mb-3">What the final looks like</SectionLabel>
        <div className="grid sm:grid-cols-3 gap-3">
          {[["~20", "Multiple-choice and fill-in-the-blank questions"],
            ["~2", "Short essay questions"],
            ["~6", "Sentences expected per essay answer"]].map(([n, lab]) => (
            <div key={lab} className="rounded-md border bg-code-bg-light px-4 py-3">
              <div className="text-[26px] font-semibold leading-none tabular-nums">{n}</div>
              <div className="text-[12.5px] text-muted-foreground mt-1.5 leading-snug">{lab}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t text-[13px] text-muted-foreground leading-relaxed">
          From <strong className="text-foreground">Lecture 16b</strong>, which showed the format and a
          worked example of each question type. Multiple choice is often{" "}
          <strong className="text-foreground">multi-select</strong> — options (a) to (e), then you pick
          the combination. The professor&apos;s own study advice closed that lecture:{" "}
          <strong className="text-foreground">vary it, space it, quiz yourself</strong>, so do a practice
          paper cold before reading the modules you miss.
        </div>
      </Panel>

      {/* practice papers */}
      <Panel className="overflow-hidden mt-4">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b bg-code-bg-light">
          <div className="flex items-center gap-2.5">
            <FileText className="size-4 text-emerald-deep" strokeWidth={1.75} />
            <h2 className="text-[15px] font-semibold">Practice exams</h2>
            <Badge variant="outline" className="rounded-sm label-mono text-muted-foreground">3 papers</Badge>
          </div>
        </div>
        <div className="divide-y">
          {WB_EXAMS.map((e, i) => {
            const b = bests[wbExamId(i)];
            const scored = e.questions.filter((q) => q.type !== "essay").length;
            return (
              <a key={e.title} href={`#/hyl-exam?id=${i}`} data-wbexam={i}
                 className="flex items-start gap-4 px-4 py-3.5 hover:bg-muted transition-colors duration-150 group">
                <span className="grid place-items-center size-8 shrink-0 rounded-md label-mono bg-emerald-soft text-emerald-deep mt-0.5">
                  {"ABC"[i]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14.5px] font-semibold">{e.title}</span>
                  <span className="block text-[12.5px] text-muted-foreground mt-0.5 leading-relaxed">
                    <Rich text={e.lede} />
                  </span>
                  <span className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="label-mono text-muted-foreground">
                      {scored} scored · {e.questions.length - scored} essay
                    </span>
                    {b
                      ? <span className="label-mono text-emerald-deep">best {b.score}/{b.total}</span>
                      : <span className="label-mono text-muted-foreground">not attempted</span>}
                  </span>
                </span>
                <ArrowRight className="size-4 text-muted-foreground shrink-0 mt-1 transition-transform group-hover:translate-x-0.5" />
              </a>
            );
          })}
        </div>
      </Panel>

      {/* modules */}
      <Panel className="overflow-hidden mt-4">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b bg-code-bg-light">
          <div className="flex items-center gap-2.5">
            <BookOpen className="size-4 text-emerald-deep" strokeWidth={1.75} />
            <h2 className="text-[15px] font-semibold">Modules</h2>
          </div>
          <span className="text-[12px] text-muted-foreground tabular-nums">
            {done} / {WB_MODULES.length} read · {passed} checkpoint{passed === 1 ? "" : "s"} passed
          </span>
        </div>
        <Bar pct={Math.round((done / WB_MODULES.length) * 100)} className="rounded-none" />
        <div className="divide-y">
          {WB_MODULES.map((m, i) => (
            <a key={m.title} href={`#/hyl-lesson?id=${i}`} data-wbmod={i}
               className="flex items-start gap-4 px-4 py-3.5 hover:bg-muted transition-colors duration-150 group">
              <span className={cn(
                "grid place-items-center size-8 shrink-0 rounded-md label-mono mt-0.5",
                seen[wbModuleId(i)] ? "bg-emerald text-white" : "bg-emerald-soft text-emerald-deep",
              )}>
                {seen[wbModuleId(i)] ? <CheckCircle2 className="size-4" /> : String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14.5px] font-semibold leading-snug">{m.title}</span>
                <span className="block text-[12.5px] text-muted-foreground mt-0.5 leading-relaxed">{m.lede}</span>
                <span className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className="flex items-center gap-1 label-mono text-muted-foreground">
                    <Clock3 className="size-3" /> {m.mins} min
                  </span>
                  <span className="flex items-center gap-1 label-mono text-amber">
                    <Flag className="size-3" /> {m.keyFacts.length} exam facts
                  </span>
                  {quizzes[wbModuleId(i)]?.passed ? (
                    <span className="flex items-center gap-1 label-mono text-emerald-deep">
                      <Trophy className="size-3" /> checkpoint passed
                    </span>
                  ) : (
                    <span className="label-mono text-muted-foreground">5 checkpoint Qs</span>
                  )}
                  <span className="label-mono text-muted-foreground truncate">{m.sources[0]}</span>
                </span>
              </span>
              <ArrowRight className="size-4 text-muted-foreground shrink-0 mt-1 transition-transform group-hover:translate-x-0.5" />
            </a>
          ))}
        </div>
      </Panel>

      <p className="text-[12.5px] text-muted-foreground leading-relaxed max-w-[70ch] mt-4">
        <strong className="text-foreground">One gap worth knowing about.</strong> Lectures 10 and 11 were
        not among the files supplied, and the exam&apos;s own essay example refers to a behaviour-change
        lecture. Module 09 covers that material from Duhigg&apos;s <em>The Power of Habit</em> ch. 2 and the
        model answer shown on the exam-prep slide, so the four practices are exactly what was marked
        correct — but any framing specific to that lecture may be missing.
      </p>
    </div>
  );
}
