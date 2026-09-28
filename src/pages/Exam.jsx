import { useEffect, useMemo, useRef, useState } from "react";
import { Clock3, Flag, ArrowRight, RotateCcw, FileText, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel, SectionLabel } from "@/components/shared";
import { Rich } from "@/components/Math";
import { EXAMS, examById } from "@/data/finance/exams";
import { moduleById } from "@/pages/Study";
import { recordExam, useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

/* ---------------- inline figures ---------------- */
function Figure({ name, figures }) {
  const f = figures[name];
  if (!f) return null;
  return (
    <figure className="my-4 border rounded-lg bg-card p-3">
      <svg viewBox={f.viewBox} className="w-full max-w-[420px] mx-auto block" role="img" aria-label={f.caption}>
        {/* axes */}
        <line x1="40" y1="215" x2="395" y2="215" stroke="var(--border)" strokeWidth="1.5" />
        <line x1="40" y1="12" x2="40" y2="215" stroke="var(--border)" strokeWidth="1.5" />

        {f.line && (
          <line {...f.line} stroke="var(--destructive)" strokeWidth="1.5" />
        )}

        {f.paths?.map((p, i) => (
          <path key={i} d={p.d} fill="none" stroke={p.stroke} strokeWidth="2"
                strokeDasharray={p.dash || undefined} strokeLinecap="round" />
        ))}

        {f.acf && (
          <>
            <line x1="40" y1="120" x2="395" y2="120" stroke="var(--muted-foreground)" strokeWidth="1" />
            <rect x="40" y="108" width="355" height="24" fill="var(--blue-bright)" opacity="0.12" />
            {f.acf.map((v, i) => {
              const x = 52 + i * 22;
              const y = 120 - v * 100;
              return (
                <g key={i}>
                  <line x1={x} y1="120" x2={x} y2={y} stroke="var(--blue-bright)" strokeWidth="2" />
                  <circle cx={x} cy={y} r="3" fill="var(--blue-bright)" />
                </g>
              );
            })}
          </>
        )}

        <text x="217" y="236" textAnchor="middle" fontSize="11" fill="var(--muted-foreground)"
              fontFamily="var(--font-mono)">{f.xlabel}</text>
        <text x="14" y="115" textAnchor="middle" fontSize="11" fill="var(--muted-foreground)"
              fontFamily="var(--font-mono)" transform="rotate(-90 14 115)">{f.ylabel}</text>
      </svg>
      <figcaption className="text-[12px] text-muted-foreground text-center mt-2">{f.caption}</figcaption>
    </figure>
  );
}

function fmt(secs) {
  const m = Math.floor(Math.max(0, secs) / 60);
  const s = Math.max(0, secs) % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/* ---------------- question card ---------------- */
function Question({ q, n, picked, onPick, review, figures }) {
  return (
    <Panel className="p-5 md:p-6" data-q={q.id}>
      <div className="flex items-start gap-3">
        <span className={cn(
          "grid place-items-center size-7 shrink-0 rounded-md label-mono mt-0.5",
          review
            ? (picked === q.answer ? "bg-emerald-soft text-emerald-deep" : "bg-[#ffdad6] text-destructive")
            : picked != null ? "bg-blue-bright text-white" : "bg-muted text-muted-foreground",
        )}>
          {n}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] leading-relaxed"><Rich text={q.q} /></p>
          {q.fig && <Figure name={q.fig} figures={figures} />}

          <div className="grid gap-2 mt-3.5">
            {q.choices.map((c, i) => {
              const isAnswer = i === q.answer;
              const isPicked = i === picked;
              return (
                <button
                  key={i}
                  data-choice={i}
                  disabled={review}
                  onClick={() => onPick(i)}
                  className={cn(
                    "text-left text-[14px] rounded-md border px-3.5 py-2.5 flex items-start gap-2.5 transition-colors duration-150",
                    !review && isPicked && "bg-blue-tint border-blue-bright",
                    !review && !isPicked && "bg-card hover:bg-muted cursor-pointer",
                    review && isAnswer && "bg-emerald-soft border-emerald/40",
                    review && isPicked && !isAnswer && "bg-[#ffdad6]/60 border-destructive/40",
                    review && !isAnswer && !isPicked && "bg-card opacity-60",
                  )}
                >
                  <span className={cn(
                    "label-mono shrink-0 mt-0.5",
                    review && isAnswer ? "text-emerald-deep"
                      : review && isPicked ? "text-destructive"
                      : isPicked ? "text-blue" : "text-muted-foreground",
                  )}>
                    {review && isAnswer ? "✓" : review && isPicked ? "✗" : String.fromCharCode(97 + i) + "."}
                  </span>
                  <span><Rich text={c} /></span>
                </button>
              );
            })}
          </div>

          {review && (
            <div className="mt-3.5 rounded-md border bg-code-bg-light px-4 py-3">
              <div className="flex items-center gap-2 mb-1.5">
                <SectionLabel className={picked === q.answer ? "text-emerald-deep" : "text-blue"}>
                  {picked === q.answer ? "Correct" : picked == null ? "Left blank" : "Incorrect"}
                </SectionLabel>
                <span className="label-mono text-muted-foreground">· {q.topic}</span>
              </div>
              <p className="text-[13.5px] leading-relaxed"><Rich text={q.why} /></p>
              <a href={`#/lesson?id=${q.ref}`} className="inline-flex items-center gap-1 text-[12.5px] font-medium text-blue hover:underline mt-2">
                Review: {moduleById(q.ref)?.title} <ArrowRight className="size-3" />
              </a>
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}

/* ---------------- main ---------------- */
export default function Exam({ id }) {
  const progress = useProgress();
  const [examId, setExamId] = useState(() => (EXAMS.some((e) => e.id === id) ? id : null));
  const exam = examById(examId);
  const { meta: EXAM_META, questions: EXAM, figures } = exam;

  const [phase, setPhase] = useState("intro");     // intro | taking | review
  const [answers, setAnswers] = useState({});
  const [left, setLeft] = useState(EXAM_META.minutes * 60);
  const timer = useRef(null);

  const score = useMemo(
    () => EXAM.reduce((s, q) => s + (answers[q.id] === q.answer ? 1 : 0), 0),
    [answers, EXAM],
  );
  const answered = Object.keys(answers).length;

  useEffect(() => {
    if (phase !== "taking") return;
    timer.current = setInterval(() => {
      setLeft((v) => {
        if (v <= 1) { clearInterval(timer.current); setPhase("review"); return 0; }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(timer.current);
  }, [phase]);

  /* keep the graded result once we enter review */
  const submittedRef = useRef(false);
  useEffect(() => {
    if (phase === "review" && !submittedRef.current) {
      submittedRef.current = true;
      recordExam(score, EXAM.length, exam.id);
    }
  }, [phase, score]);

  const start = (pick) => {
    if (pick) setExamId(pick);
    const m = (pick ? examById(pick) : exam).meta.minutes;
    setAnswers({}); setLeft(m * 60); submittedRef.current = false; setPhase("taking");
  };

  /* ---------- paper picker ---------- */
  if (phase === "intro") {
    const bests = progress.exams || {};
    return (
      <div className="max-w-[760px]">
        <SectionLabel className="text-blue">Practice Exams</SectionLabel>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">Three full papers</h1>
        <p className="text-[14px] text-muted-foreground mt-1.5 leading-relaxed max-w-[68ch]">
          Each is a complete 33-question midterm under the same rules as the real thing.
          They cover the same syllabus in the same proportions but test different angles,
          so all three are worth sitting.
        </p>

        <div className="grid gap-3 mt-5">
          {EXAMS.map((e, i) => {
            const b = bests[e.id];
            const pct = b ? Math.round((b.score / b.total) * 100) : null;
            return (
              <Panel key={e.id} className="p-5" data-exam={e.id}>
                <div className="flex flex-wrap items-start gap-4">
                  {/* `b?.score === b?.total` is true when b is undefined, which
                      awarded a trophy to papers that had never been attempted */}
                  <span className={cn(
                    "grid place-items-center size-10 shrink-0 rounded-md",
                    b && b.score === b.total ? "bg-emerald text-white" : "bg-blue-tint text-blue",
                  )}>
                    {b && b.score === b.total ? <Trophy className="size-5" /> : <FileText className="size-5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[16px] font-semibold">{e.meta.title}</h2>
                    <p className="text-[13px] text-muted-foreground mt-0.5">
                      {e.questions.length} questions · {e.meta.minutes} minutes ·{" "}
                      {e.questions.length * e.meta.pointsPer} points
                    </p>
                    <p className="text-[12.5px] mt-1.5 tabular-nums">
                      {b ? (
                        <span className={cn(pct >= 80 ? "text-emerald-deep" : pct >= 60 ? "text-amber" : "text-destructive")}>
                          Best {b.score}/{b.total} ({pct}%) · {b.attempts} attempt{b.attempts > 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Not attempted yet</span>
                      )}
                    </p>
                  </div>
                  <Button
                    onClick={() => start(e.id)}
                    data-act={`begin-${e.id}`}
                    className={cn("rounded-md shrink-0", i === 0 ? "bg-slate-deep hover:bg-navy" : "bg-blue-bright hover:bg-blue")}
                  >
                    {b ? "Retake" : "Begin"} <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </Panel>
            );
          })}
        </div>

        <Panel className="p-5 mt-4">
          <SectionLabel className="mb-3">Rules, on every paper</SectionLabel>
          <ul className="grid gap-2 text-[14px] leading-relaxed list-disc ml-5">
            {EXAMS[0].meta.rules.map((r, i) => <li key={i} className="pl-1">{r}</li>)}
          </ul>
          <div className="mt-4 pt-4 border-t text-[13px] text-muted-foreground leading-relaxed">
            All 99 questions are <strong className="text-foreground">original</strong> — written to
            match the topic mix, phrasing style and difficulty of the real midterm, not to reproduce
            it. Each paper splits 8 / 7 / 9 / 6 / 3 across Parts 1 to 5, and every question links
            back to the module that covers it when you review.
          </div>
        </Panel>
      </div>
    );
  }

  const review = phase === "review";

  return (
    <div className="max-w-[820px]">
      {/* sticky status bar */}
      <div className="sticky top-14 z-10 -mx-4 md:-mx-8 px-4 md:px-8 py-3 bg-background/95 backdrop-blur border-b mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="label-mono text-muted-foreground shrink-0" data-paper>{EXAM_META.title}</span>
          {review ? (
            <>
              <span className="text-[15px] font-semibold tabular-nums">
                {score} / {EXAM.length}
                <span className="text-muted-foreground font-normal ml-1.5">
                  ({Math.round(score / EXAM.length * 100)}%, {score * EXAM_META.pointsPer} pts)
                </span>
              </span>
              <span className="flex-1" />
              <Button onClick={() => start(exam.id)} size="sm" variant="outline" className="rounded-md bg-card" data-act="retake">
                <RotateCcw className="size-3.5" /> Retake
              </Button>
              <Button onClick={() => { setPhase("intro"); setExamId(null); }} size="sm"
                      className="rounded-md bg-blue-bright hover:bg-blue" data-act="other-papers">
                Other papers
              </Button>
            </>
          ) : (
            <>
              <span className={cn(
                "flex items-center gap-1.5 text-[15px] font-semibold tabular-nums",
                left < 300 ? "text-destructive" : "",
              )} data-timer>
                <Clock3 className="size-4" /> {fmt(left)}
              </span>
              <span className="text-[13px] text-muted-foreground tabular-nums">
                {answered} / {EXAM.length} answered
              </span>
              <span className="flex-1" />
              <Button onClick={() => setPhase("review")} size="sm"
                      className="rounded-md bg-slate-deep hover:bg-navy" data-act="submit">
                <Flag className="size-3.5" /> Submit
              </Button>
            </>
          )}
        </div>
      </div>

      {review && (
        <Panel className="p-5 mb-5">
          <SectionLabel className="mb-2">Breakdown by topic</SectionLabel>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
            {Object.entries(
              EXAM.reduce((acc, q) => {
                const part = moduleById(q.ref)?.part || "Other";
                acc[part] = acc[part] || { right: 0, total: 0 };
                acc[part].total++;
                if (answers[q.id] === q.answer) acc[part].right++;
                return acc;
              }, {}),
            ).map(([part, v]) => (
              <div key={part} className="flex items-center justify-between text-[13.5px] py-0.5">
                <span>{part}</span>
                <span className={cn(
                  "tabular-nums font-medium",
                  v.right === v.total ? "text-emerald-deep" : v.right / v.total < 0.6 ? "text-destructive" : "",
                )}>
                  {v.right}/{v.total}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      )}

      <div className="grid gap-4">
        {EXAM.map((q, i) => (
          <Question
            key={q.id}
            figures={figures}
            q={q}
            n={i + 1}
            picked={answers[q.id] ?? null}
            review={review}
            onPick={(c) => setAnswers((a) => ({ ...a, [q.id]: c }))}
          />
        ))}
      </div>

      {!review && (
        <div className="flex justify-end mt-6">
          <Button onClick={() => setPhase("review")} className="rounded-md bg-slate-deep hover:bg-navy">
            <Flag className="size-3.5" /> Submit exam
          </Button>
        </div>
      )}
    </div>
  );
}
