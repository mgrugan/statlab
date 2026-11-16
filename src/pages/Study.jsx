import { BookOpen, Table2, GraduationCap, ArrowRight, CheckCircle2, Clock3, Trophy, Film } from "lucide-react";
import { FINANCE_MODULES } from "@/data/finance/modules1";
import { FINANCE_MODULES_2 } from "@/data/finance/modules2";
import { FINANCE_MODULES_3 } from "@/data/finance/modules3";
import { PANDAS_MODULES } from "@/data/finance/pandas";
import { PRACTICE_EXAMS } from "@/data/finance/exams";
import { EXPLAINERS } from "@/data/finance/explainers";
import { useProgress } from "@/lib/progress";
import { Panel, SectionLabel } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bar } from "@/components/shared";
import { cn } from "@/lib/utils";

/* Parts 1-5 are Midterm One; Parts 6-11 are Midterm Two. */
export const FINANCE = [...FINANCE_MODULES_3, ...FINANCE_MODULES, ...FINANCE_MODULES_2];
export const MIDTERM_TWO_PARTS = ["Part 6", "Part 7", "Part 8", "Part 9", "Part 10", "Part 11"];
export const ALL_MODULES = [...FINANCE, ...PANDAS_MODULES];

export function moduleById(id) { return ALL_MODULES.find((m) => m.id === id); }

/* The course is organised by Part, not by lecture — a Part can run across
   two or three lectures, and the exam is specified in Parts. So group the
   modules the same way the syllabus and the midterm do. */
function byPart(modules) {
  const order = [], groups = new Map();
  for (const m of modules) {
    if (!groups.has(m.part)) { groups.set(m.part, []); order.push(m.part); }
    groups.get(m.part).push(m);
  }
  return order.map((part) => ({ part, modules: groups.get(part) }));
}

/* one short line per Part, so the grouping says what the Part is about */
const PART_BLURB = {
  "Part 1": "Options, payoffs, and what we are actually pricing.",
  "Part 2": "Is it normal? Density estimation and the normality tests.",
  "Part 3": "Stationarity, autocorrelation, and the unit root tests.",
  "Part 4": "Volatility that moves: clustering, ARCH and GARCH.",
  "Part 5": "Black-Scholes, implied volatility, and the leverage effect.",
  "Part 6": "The Poisson process — when rare events arrive.",
  "Part 7": "Mean models, least squares, and the Merton jump diffusion.",
  "Part 8": "Maximum likelihood: the method behind every fit.",
  "Part 9": "What the MLE gives you, and the Delta Method.",
  "Part 10": "Choosing between models without fooling yourself.",
  "Part 11": "The double exponential jump diffusion model.",
};

function PartHeading({ part, modules, done }) {
  return (
    <div className="flex items-baseline justify-between gap-3 px-4 py-2 bg-muted/60 border-y">
      <div className="flex items-baseline gap-2.5 min-w-0">
        <span className="label-mono text-blue shrink-0">{part}</span>
        <span className="text-[12.5px] text-muted-foreground truncate">{PART_BLURB[part]}</span>
      </div>
      <span className="label-mono text-muted-foreground shrink-0 tabular-nums">
        {done}/{modules.length}
      </span>
    </div>
  );
}

function ModuleRow({ m, done, quiz, checks }) {
  return (
    <a
      href={`#/lesson?id=${m.id}`}
      data-module={m.id}
      className="flex items-start gap-4 px-4 py-3.5 hover:bg-muted transition-colors duration-150 group"
    >
      <span className={cn(
        "grid place-items-center size-8 shrink-0 rounded-md label-mono mt-0.5",
        quiz?.passed ? "bg-emerald text-white"
          : done ? "bg-emerald-soft text-emerald-deep"
          : "bg-blue-tint text-blue",
      )}>
        {quiz?.passed ? <Trophy className="size-4" /> : done ? <CheckCircle2 className="size-4" /> : m.id.toUpperCase().replace(/[^0-9]/g, "")}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-semibold leading-snug">{m.title}</span>
        <span className="block text-[12.5px] text-muted-foreground mt-0.5 leading-relaxed">{m.summary}</span>
        <span className="flex items-center gap-3 mt-1.5 flex-wrap">
          {/* the Part is the group heading above, so it is not repeated here */}
          <span className="flex items-center gap-1 label-mono text-muted-foreground">
            <Clock3 className="size-3" /> {m.minutes} min
          </span>
          {EXPLAINERS[m.id] && (
            <span className="flex items-center gap-1 label-mono text-blue">
              <Film className="size-3" /> {Math.floor(EXPLAINERS[m.id].duration / 60)} min film
            </span>
          )}
          {quiz?.passed ? (
            <span className="label-mono text-emerald-deep">quiz passed</span>
          ) : quiz ? (
            <span className="label-mono text-amber">quiz {quiz.best}/5 — retake</span>
          ) : (
            <span className="label-mono text-muted-foreground">quiz not taken</span>
          )}
        </span>
      </span>
      <ArrowRight className="size-4 text-muted-foreground shrink-0 mt-1 transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}

export default function Study() {
  const progress = useProgress();
  const seen = progress.lessons || {};
  const quizzes = progress.quizzes || {};

  const pandasDone = PANDAS_MODULES.filter((m) => quizzes[m.id]?.passed).length;
  const best = progress.examBest;

  const countChecks = (m) => m.blocks.filter((b) => b.kind === "check").length;
  const passed = (ms) => ms.filter((m) => quizzes[m.id]?.passed).length;

  const two = byPart(FINANCE_MODULES_3);
  const one = byPart([...FINANCE_MODULES, ...FINANCE_MODULES_2]);
  const twoMods = FINANCE_MODULES_3;
  const oneMods = [...FINANCE_MODULES, ...FINANCE_MODULES_2];
  const examQs = PRACTICE_EXAMS.reduce((n, e) => n + e.questions.length, 0);

  return (
    <div className="grid gap-6">
      <div>
        <SectionLabel className="text-blue">Midterm Two Prep</SectionLabel>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">Statistical Methods in Finance</h1>
        <p className="text-[13.5px] text-muted-foreground mt-1.5 max-w-[68ch] leading-relaxed">
          Organised by <strong className="text-foreground">Part</strong>, the way the syllabus and
          the exam are. <strong className="text-foreground">Parts 6&ndash;11</strong> are on this
          midterm; Parts 1&ndash;5 are below, still here for reference. Each lesson pairs the{" "}
          <strong className="text-foreground">intuition</strong> with the{" "}
          <strong className="text-foreground">math</strong> (full derivations), the{" "}
          <strong className="text-foreground">code</strong> you should be able to reproduce
          unaided, and the <strong className="text-foreground">exam traps</strong> that separate
          a B from an A.
        </p>
      </div>

      {/* exam card */}
      <Panel className="p-0 overflow-hidden">
        <div className="grid sm:grid-cols-[170px_1fr]">
          <div className="bg-navy hidden sm:grid place-items-center p-6">
            <div className="text-center">
              <GraduationCap className="size-6 text-emerald-bright mx-auto" />
              <div className="label-mono text-[#94a3b8] mt-3 leading-relaxed">Practice<br />Midterm</div>
            </div>
          </div>
          <div className="p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h2 className="text-lg font-semibold tracking-tight">Practice Midterm Two</h2>
              <Badge className="rounded-sm border-transparent label-mono bg-blue-tint text-blue">
                {PRACTICE_EXAMS.length} papers
              </Badge>
              <Badge className="rounded-sm border-transparent label-mono bg-muted text-muted-foreground">
                {PRACTICE_EXAMS[0].meta.minutes} min each
              </Badge>
            </div>
            <p className="text-[13.5px] text-muted-foreground leading-relaxed max-w-[60ch]">
              Same format as the real thing &mdash; {PRACTICE_EXAMS[0].questions.length}{" "}
              multiple-choice questions, {PRACTICE_EXAMS[0].meta.pointsPer} points each,{" "}
              {PRACTICE_EXAMS[0].meta.minutes} minutes, one correct answer per question. All{" "}
              {examQs} questions across the {PRACTICE_EXAMS.length} papers are{" "}
              <strong className="text-foreground">original</strong>, and each paper covers{" "}
              <strong className="text-foreground">Parts 6 through 11</strong> in the same
              proportions the exam does.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <Button asChild size="sm" className="rounded-md bg-slate-deep hover:bg-navy">
                <a href="#/exam" data-act="start-exam">
                  {best ? "Retake exam" : "Start exam"} <ArrowRight className="size-3.5" />
                </a>
              </Button>
              {best && (
                <span className="text-[13px] text-muted-foreground tabular-nums">
                  {/* best.total is the paper that was actually sat, which is the
                      right denominator now that the papers are separate records */}
                  Best: <b className="text-foreground">{best.score}/{best.total}</b> ({Math.round(best.score / best.total * 100)}%)
                </span>
              )}
            </div>
          </div>
        </div>
      </Panel>

      {/* Parts 6-11 — what this midterm covers */}
      <Panel className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b bg-code-bg-light">
          <div className="flex items-center gap-2.5">
            <BookOpen className="size-4 text-blue" strokeWidth={1.75} />
            <h2 className="text-[15px] font-semibold">On Midterm Two</h2>
            <Badge variant="outline" className="rounded-sm label-mono text-muted-foreground">
              Parts 6&ndash;11
            </Badge>
          </div>
          <span className="text-[12px] text-muted-foreground tabular-nums">
            {passed(twoMods)} / {twoMods.length} quizzes passed
          </span>
        </div>
        <Bar pct={Math.round(passed(twoMods) / twoMods.length * 100)} className="rounded-none" />
        <div>
          {two.map(({ part, modules }) => (
            <div key={part}>
              <PartHeading part={part} modules={modules} done={passed(modules)} />
              <div className="divide-y">
                {modules.map((m) => (
                  <ModuleRow key={m.id} m={m} done={!!seen[m.id]} quiz={quizzes[m.id]} checks={countChecks(m)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Parts 1-5 — Midterm One material, kept for reference */}
      <Panel className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b bg-code-bg-light">
          <div className="flex items-center gap-2.5">
            <BookOpen className="size-4 text-muted-foreground" strokeWidth={1.75} />
            <h2 className="text-[15px] font-semibold">Earlier material</h2>
            <Badge variant="outline" className="rounded-sm label-mono text-muted-foreground">
              Parts 1&ndash;5 &middot; not on this exam
            </Badge>
          </div>
          <span className="text-[12px] text-muted-foreground tabular-nums">
            {passed(oneMods)} / {oneMods.length} quizzes passed
          </span>
        </div>
        <Bar pct={Math.round(passed(oneMods) / oneMods.length * 100)} className="rounded-none" />
        <div>
          {one.map(({ part, modules }) => (
            <div key={part}>
              <PartHeading part={part} modules={modules} done={passed(modules)} />
              <div className="divide-y">
                {modules.map((m) => (
                  <ModuleRow key={m.id} m={m} done={!!seen[m.id]} quiz={quizzes[m.id]} checks={countChecks(m)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* pandas modules */}
      <Panel className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b bg-code-bg-light">
          <div className="flex items-center gap-2.5">
            <Table2 className="size-4 text-emerald-deep" strokeWidth={1.75} />
            <h2 className="text-[15px] font-semibold">pandas Tutorial</h2>
            <Badge variant="outline" className="rounded-sm label-mono text-muted-foreground">
              separate module
            </Badge>
          </div>
          <span className="text-[12px] text-muted-foreground tabular-nums">
            {pandasDone} / {PANDAS_MODULES.length} quizzes passed
          </span>
        </div>
        <Bar pct={Math.round(pandasDone / PANDAS_MODULES.length * 100)} className="rounded-none" />
        <div className="divide-y">
          {PANDAS_MODULES.map((m) => (
            <ModuleRow key={m.id} m={m} done={!!seen[m.id]} quiz={quizzes[m.id]} checks={countChecks(m)} />
          ))}
        </div>
      </Panel>

      <p className="text-[12.5px] text-muted-foreground leading-relaxed max-w-[70ch]">
        Want to drill the syntax instead? The <a href="#/learn" className="text-blue font-medium hover:underline">Learn</a>{" "}
        section has type-the-command reps for <code className="font-mono text-[0.9em]">yfinance</code>,{" "}
        <code className="font-mono text-[0.9em]">adfuller</code>, <code className="font-mono text-[0.9em]">plot_acf</code>,{" "}
        <code className="font-mono text-[0.9em]">arch_model</code> and friends, and{" "}
        <a href="#/practice" className="text-blue font-medium hover:underline">Practice</a> has full
        applied problems built on this material.
      </p>
    </div>
  );
}
