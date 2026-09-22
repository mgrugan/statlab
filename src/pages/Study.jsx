import { BookOpen, Table2, GraduationCap, ArrowRight, CheckCircle2, Clock3, Trophy } from "lucide-react";
import { FINANCE_MODULES } from "@/data/finance/modules1";
import { FINANCE_MODULES_2 } from "@/data/finance/modules2";
import { PANDAS_MODULES } from "@/data/finance/pandas";
import { EXAM, EXAM_META } from "@/data/finance/exam";
import { useProgress } from "@/lib/progress";
import { Panel, SectionLabel } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bar } from "@/components/shared";
import { cn } from "@/lib/utils";

export const FINANCE = [...FINANCE_MODULES, ...FINANCE_MODULES_2];
export const ALL_MODULES = [...FINANCE, ...PANDAS_MODULES];

export function moduleById(id) { return ALL_MODULES.find((m) => m.id === id); }

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
          <span className="label-mono text-muted-foreground">{m.part}</span>
          <span className="flex items-center gap-1 label-mono text-muted-foreground">
            <Clock3 className="size-3" /> {m.minutes} min
          </span>
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

  const financeDone = FINANCE.filter((m) => quizzes[m.id]?.passed).length;
  const pandasDone = PANDAS_MODULES.filter((m) => quizzes[m.id]?.passed).length;
  const best = progress.examBest;

  const countChecks = (m) => m.blocks.filter((b) => b.kind === "check").length;

  return (
    <div className="grid gap-6">
      <div>
        <SectionLabel className="text-blue">Midterm One Prep</SectionLabel>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">Statistical Methods in Finance</h1>
        <p className="text-[13.5px] text-muted-foreground mt-1.5 max-w-[68ch] leading-relaxed">
          Everything from Lectures 1&ndash;7 (Parts 1&ndash;5), rebuilt as an interactive module.
          Each lesson pairs the <strong className="text-foreground">intuition</strong> with the{" "}
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
              <h2 className="text-lg font-semibold tracking-tight">{EXAM_META.title}</h2>
              <Badge className="rounded-sm border-transparent label-mono bg-blue-tint text-blue">
                {EXAM.length} questions
              </Badge>
              <Badge className="rounded-sm border-transparent label-mono bg-muted text-muted-foreground">
                {EXAM_META.minutes} min
              </Badge>
            </div>
            <p className="text-[13.5px] text-muted-foreground leading-relaxed max-w-[60ch]">
              Same format as the real thing &mdash; {EXAM.length} multiple-choice questions,{" "}
              {EXAM_META.pointsPer} points each, {EXAM_META.minutes} minutes, one correct answer per
              question. These questions are <strong className="text-foreground">original</strong>,
              written to match the 2025 paper&apos;s topic mix and difficulty rather than repeat it.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <Button asChild size="sm" className="rounded-md bg-slate-deep hover:bg-navy">
                <a href="#/exam" data-act="start-exam">
                  {best ? "Retake exam" : "Start exam"} <ArrowRight className="size-3.5" />
                </a>
              </Button>
              {best && (
                <span className="text-[13px] text-muted-foreground tabular-nums">
                  Best: <b className="text-foreground">{best.score}/{EXAM.length}</b> ({Math.round(best.score / EXAM.length * 100)}%)
                </span>
              )}
            </div>
          </div>
        </div>
      </Panel>

      {/* finance modules */}
      <Panel className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b bg-code-bg-light">
          <div className="flex items-center gap-2.5">
            <BookOpen className="size-4 text-blue" strokeWidth={1.75} />
            <h2 className="text-[15px] font-semibold">Statistical Finance</h2>
            <Badge variant="outline" className="rounded-sm label-mono text-muted-foreground">
              Parts 1&ndash;5
            </Badge>
          </div>
          <span className="text-[12px] text-muted-foreground tabular-nums">
            {financeDone} / {FINANCE.length} quizzes passed
          </span>
        </div>
        <Bar pct={Math.round(financeDone / FINANCE.length * 100)} className="rounded-none" />
        <div className="divide-y">
          {FINANCE.map((m) => (
            <ModuleRow key={m.id} m={m} done={!!seen[m.id]} quiz={quizzes[m.id]} checks={countChecks(m)} />
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
