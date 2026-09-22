import { useMemo, useState } from "react";
import { Lock, CheckCircle2, RotateCcw, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel, SectionLabel } from "@/components/shared";
import { Rich } from "@/components/Math";
import { QUIZZES, QUIZ_PASS_MARK } from "@/data/finance/quizzes";
import { recordQuiz, useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

/* Deterministic shuffle keyed by attempt number, so a retake reorders the
   questions and the choices — you cannot pass by memorizing positions. */
function shuffled(arr, seed) {
  const a = arr.map((v, i) => [v, i]);
  let s = seed * 9301 + 49297;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ModuleQuiz({ moduleId, nextHref, nextLabel }) {
  const progress = useProgress();
  const bank = QUIZZES[moduleId];
  const state = progress.quizzes?.[moduleId];
  const passed = !!state?.passed;

  const [attempt, setAttempt] = useState(0);        // bumps on each retake
  const [phase, setPhase] = useState("idle");       // idle | taking | graded
  const [picks, setPicks] = useState({});

  /* questions (and their choices) reshuffled per attempt */
  const questions = useMemo(() => {
    if (!bank) return [];
    return shuffled(bank, attempt + 1).map(([q]) => {
      const order = shuffled(q.choices, attempt + 7 + q.q.length);
      return {
        ...q,
        choices: order.map(([c]) => c),
        answer: order.findIndex(([, orig]) => orig === q.answer),
      };
    });
  }, [bank, attempt]);

  if (!bank) return null;

  const score = questions.reduce((s, q, i) => s + (picks[i] === q.answer ? 1 : 0), 0);
  const answered = Object.keys(picks).length;
  const isPass = score === QUIZ_PASS_MARK;

  const start = () => { setPicks({}); setPhase("taking"); };
  const submit = () => {
    const s = questions.reduce((a, q, i) => a + (picks[i] === q.answer ? 1 : 0), 0);
    recordQuiz(moduleId, s, questions.length);
    setPhase("graded");
  };
  const retake = () => { setAttempt((a) => a + 1); setPicks({}); setPhase("taking"); };

  /* ---------- gate card ---------- */
  if (phase === "idle") {
    return (
      <Panel className={cn("p-5 md:p-6 mt-6", passed && "border-emerald/40 bg-emerald-soft/30")}>
        <div className="flex items-start gap-3">
          <span className={cn("grid place-items-center size-9 rounded-md shrink-0",
            passed ? "bg-emerald text-white" : "bg-slate-deep text-white")}>
            {passed ? <Trophy className="size-4.5" /> : <Lock className="size-4" />}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-[16px] font-semibold">
              {passed ? "Module quiz passed" : "Module quiz"}
            </h3>
            <p className="text-[13.5px] text-muted-foreground mt-1 leading-relaxed max-w-[62ch]">
              {passed
                ? `You cleared all ${QUIZ_PASS_MARK} questions${state.attempts > 1 ? ` in ${state.attempts} attempts` : " first time"}. Retake it any time to keep it sharp.`
                : <>Five questions, harder than the self-checks above. <strong className="text-foreground">You need all {QUIZ_PASS_MARK} correct to pass</strong> — anything less and you retake it with the questions reshuffled.</>}
            </p>
            {state && !passed && (
              <p className="text-[12.5px] text-muted-foreground mt-2 tabular-nums">
                Best so far: {state.best}/{QUIZ_PASS_MARK} · {state.attempts} attempt{state.attempts > 1 ? "s" : ""}
              </p>
            )}
            <Button onClick={start} size="sm" data-act="start-quiz"
                    className={cn("rounded-md mt-4", passed ? "bg-emerald hover:bg-emerald-deep" : "bg-slate-deep hover:bg-navy")}>
              {passed ? "Retake quiz" : state ? "Try again" : "Start quiz"} <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </Panel>
    );
  }

  /* ---------- taking / graded ---------- */
  return (
    <Panel className="p-5 md:p-6 mt-6" data-quiz={moduleId}>
      <div className="flex flex-wrap items-center gap-3 pb-4 mb-4 border-b">
        <SectionLabel className={phase === "graded" ? (isPass ? "text-emerald-deep" : "text-destructive") : "text-blue"}>
          Module quiz
        </SectionLabel>
        {phase === "graded" ? (
          <span className={cn("text-[15px] font-semibold tabular-nums", isPass ? "text-emerald-deep" : "text-destructive")}>
            {score} / {QUIZ_PASS_MARK} {isPass ? "— passed" : "— not passed"}
          </span>
        ) : (
          <span className="text-[13px] text-muted-foreground tabular-nums">{answered} / {questions.length} answered</span>
        )}
        <span className="flex-1" />
        {phase === "graded" && !isPass && (
          <Button onClick={retake} size="sm" className="rounded-md bg-slate-deep hover:bg-navy" data-act="retake-quiz">
            <RotateCcw className="size-3.5" /> Retake
          </Button>
        )}
        {phase === "graded" && isPass && nextHref && (
          <Button asChild size="sm" className="rounded-md bg-emerald hover:bg-emerald-deep">
            <a href={nextHref}>{nextLabel} <ArrowRight className="size-3.5" /></a>
          </Button>
        )}
      </div>

      {phase === "graded" && (
        <div className={cn("rounded-md border px-4 py-3 mb-5 text-[13.5px] leading-relaxed",
          isPass ? "bg-emerald-soft border-emerald/30" : "bg-[#ffdad6]/50 border-destructive/30")}>
          {isPass
            ? <><strong className="text-emerald-deep">Passed.</strong> All five correct — this module is done. Explanations are below if you want to confirm your reasoning.</>
            : <><strong className="text-destructive">Not passed — {QUIZ_PASS_MARK}/{QUIZ_PASS_MARK} is required.</strong> Explanations for the ones you missed are below. Re-read those sections, then retake; the questions and answer positions will be reshuffled.</>}
        </div>
      )}

      <div className="grid gap-5">
        {questions.map((q, i) => {
          const picked = picks[i] ?? null;
          const graded = phase === "graded";
          const right = picked === q.answer;
          return (
            <div key={i} data-quiz-q={i}>
              <div className="flex items-start gap-3">
                <span className={cn("grid place-items-center size-6 shrink-0 rounded-md label-mono mt-0.5",
                  graded ? (right ? "bg-emerald-soft text-emerald-deep" : "bg-[#ffdad6] text-destructive")
                    : picked != null ? "bg-blue-bright text-white" : "bg-muted text-muted-foreground")}>
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] leading-relaxed"><Rich text={q.q} /></p>
                  <div className="grid gap-2 mt-3">
                    {q.choices.map((c, ci) => {
                      const isAns = ci === q.answer;
                      const isPick = ci === picked;
                      return (
                        <button
                          key={ci}
                          data-choice={ci}
                          disabled={graded}
                          onClick={() => setPicks((p) => ({ ...p, [i]: ci }))}
                          className={cn(
                            "text-left text-[13.5px] rounded-md border px-3 py-2 flex items-start gap-2.5 transition-colors duration-150",
                            !graded && isPick && "bg-blue-tint border-blue-bright",
                            !graded && !isPick && "bg-card hover:bg-muted cursor-pointer",
                            graded && isAns && "bg-emerald-soft border-emerald/40",
                            graded && isPick && !isAns && "bg-[#ffdad6]/60 border-destructive/40",
                            graded && !isAns && !isPick && "bg-card opacity-55",
                          )}
                        >
                          <span className={cn("label-mono shrink-0 mt-0.5",
                            graded && isAns ? "text-emerald-deep" : graded && isPick ? "text-destructive"
                              : isPick ? "text-blue" : "text-muted-foreground")}>
                            {graded && isAns ? "✓" : graded && isPick ? "✗" : String.fromCharCode(97 + ci) + "."}
                          </span>
                          <span><Rich text={c} /></span>
                        </button>
                      );
                    })}
                  </div>

                  {/* explanation: always on a pass, only for misses on a fail */}
                  {graded && (isPass || !right) && (
                    <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground border-l-2 border-blue-bright pl-3">
                      <Rich text={q.why} />
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {phase === "taking" && (
        <div className="flex items-center gap-3 mt-6 pt-4 border-t">
          <Button onClick={submit} disabled={answered < questions.length}
                  className="rounded-md bg-slate-deep hover:bg-navy" data-act="submit-quiz">
            Submit all {questions.length}
          </Button>
          {answered < questions.length && (
            <span className="text-[12.5px] text-muted-foreground">
              Answer every question before submitting.
            </span>
          )}
        </div>
      )}
    </Panel>
  );
}
