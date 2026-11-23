import { useEffect, useMemo, useRef, useState } from "react";
import { Clock3, Flag, ArrowRight, RotateCcw, BookOpenCheck, PenLine, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel, SectionLabel } from "@/components/shared";
import { Rich as RichBase } from "@/components/Math";
/* This course has no mathematics in it, so the $…$ form is off: without
   that, a pair of dollar amounts in one sentence renders as KaTeX. */
const Rich = (props) => <RichBase {...props} tex={false} />;
import { WB_PAPERS as WB_EXAMS } from "@/data/wellbeing/papers";
import { wbExamId } from "@/pages/WellStudy";
import { recordExam, useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

/* Model answers for the essay questions are authored as small HTML
   fragments with inline Rich markup inside them. They are part of the
   bundle, not user input, so rendering them as HTML is safe. */
function mdHtml(s) {
  return s
    .replace(/\\\$/g, "$")
    /* innermost emphasis first, so **bold with *a word* inside** survives
       instead of leaving a stray pair of asterisks on the page */
    .replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*([^*]*(?:\*[^*]+\*[^*]*)*)\*\*/g, (_, inner) =>
      `<strong>${inner.replace(/\*([^*]+)\*/g, "<em>$1</em>")}</strong>`)
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

/* Fill-in-the-blank marking. Generous on punctuation, casing, articles and
   plural "s", strict on the actual word, and every question carries its own
   list of accepted phrasings. */
export function normBlank(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^\w%\s]/g, " ")
    .replace(/\b(the|a|an)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
export function blankOk(input, q) {
  const got = normBlank(input);
  if (!got) return false;
  const accepted = [q.answer, ...(q.accept || [])].map(normBlank);
  return accepted.some((a) => a === got || (a.length > 3 && (a === got.replace(/s$/, "") || a.replace(/s$/, "") === got)));
}

function fmt(secs) {
  const m = Math.floor(Math.max(0, secs) / 60);
  const s = Math.max(0, secs) % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const TYPE_LABEL = { mc: "Multiple choice", blank: "Fill in the blank", essay: "Short essay" };

function Why({ q, verdict }) {
  return (
    <div className="mt-3.5 rounded-md border bg-code-bg-light px-4 py-3">
      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        <SectionLabel className={verdict === "right" ? "text-emerald-deep" : verdict === "blank" ? "text-muted-foreground" : "text-blue"}>
          {verdict === "right" ? "Correct" : verdict === "blank" ? "Left blank" : verdict === "self" ? "Model answer" : "Incorrect"}
        </SectionLabel>
        <span className="label-mono text-muted-foreground">· {TYPE_LABEL[q.type]}</span>
      </div>
      {q.type === "essay" ? (
        <div
          className="text-[13.5px] leading-relaxed [&_p]:mt-2 [&_p:first-child]:mt-0 [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mt-2 [&_ul]:grid [&_ul]:gap-1.5 [&_strong]:font-semibold [&_strong]:text-foreground [&_em]:italic [&_code]:font-mono [&_code]:text-[12.5px]"
          dangerouslySetInnerHTML={{ __html: mdHtml(q.why) }}
        />
      ) : (
        <p className="text-[13.5px] leading-relaxed"><Rich text={q.why} /></p>
      )}
    </div>
  );
}

function Question({ q, n, value, onChange, review }) {
  const verdict = !review ? null
    : q.type === "essay" ? "self"
    : q.type === "mc" ? (value == null ? "blank" : value === q.answer ? "right" : "wrong")
    : (!value ? "blank" : blankOk(value, q) ? "right" : "wrong");
  const ok = verdict === "right";

  return (
    <Panel className="p-5 md:p-6 min-w-0" data-q={n}>
      <div className="flex items-start gap-3">
        <span className={cn(
          "grid place-items-center size-7 shrink-0 rounded-md label-mono mt-0.5",
          review
            ? ok ? "bg-emerald-soft text-emerald-deep"
              : verdict === "self" ? "bg-blue-tint text-blue"
              : "bg-[#ffdad6] text-destructive"
            : (q.type === "mc" ? value != null : Boolean(value)) ? "bg-blue-bright text-white"
            : "bg-muted text-muted-foreground",
        )}>
          {n}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] leading-relaxed"><Rich text={q.q} /></p>

          {/* the (a)–(e) statements a multi-select question asks you to combine */}
          {q.sub && (
            <ol className="grid gap-1.5 mt-3 text-[14px] leading-relaxed">
              {q.sub.map((s, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="label-mono text-muted-foreground shrink-0 mt-0.5">({String.fromCharCode(97 + i)})</span>
                  <span className="min-w-0"><Rich text={s} /></span>
                </li>
              ))}
            </ol>
          )}

          {q.type === "mc" && (
            <div className="grid gap-2 mt-3.5">
              {q.choices.map((c, i) => {
                const isAnswer = i === q.answer;
                const isPicked = i === value;
                return (
                  <button
                    key={i}
                    data-choice={i}
                    disabled={review}
                    onClick={() => onChange(i)}
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
                      {review && isAnswer ? "✓" : review && isPicked ? "✗" : String.fromCharCode(65 + i) + "."}
                    </span>
                    <span><Rich text={c} /></span>
                  </button>
                );
              })}
            </div>
          )}

          {q.type === "blank" && (
            <div className="mt-3.5">
              <input
                type="text"
                data-blank={n}
                value={value || ""}
                disabled={review}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Your answer"
                autoComplete="off"
                spellCheck={false}
                className={cn(
                  "w-full max-w-[420px] rounded-md border px-3.5 py-2.5 text-[14px] bg-card",
                  "focus:outline-none focus:border-blue-bright focus:ring-2 focus:ring-blue-bright/20",
                  review && ok && "border-emerald/50 bg-emerald-soft",
                  review && !ok && "border-destructive/40 bg-[#ffdad6]/50",
                )}
              />
              {review && (
                <div className="mt-2.5 flex items-start gap-2 text-[13.5px]">
                  {ok
                    ? <CheckCircle2 className="size-4 text-emerald-deep shrink-0 mt-0.5" />
                    : <XCircle className="size-4 text-destructive shrink-0 mt-0.5" />}
                  <span>
                    Answer: <strong>{q.answer}</strong>
                    {q.accept?.length > 1 && (
                      <span className="text-muted-foreground"> — also accepted: {q.accept.filter((a) => normBlank(a) !== normBlank(q.answer)).join(", ")}</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          )}

          {q.type === "essay" && (
            <div className="mt-3.5">
              <textarea
                data-essay={n}
                rows={6}
                value={value || ""}
                disabled={review}
                onChange={(e) => onChange(e.target.value)}
                placeholder="About six sentences."
                className={cn(
                  "w-full rounded-md border px-3.5 py-3 text-[14px] leading-relaxed bg-card resize-y",
                  "focus:outline-none focus:border-blue-bright focus:ring-2 focus:ring-blue-bright/20",
                )}
              />
              <p className="label-mono text-muted-foreground mt-1.5">
                {review ? "Mark your own against the model answer below" : "~6 sentences · not auto-marked"}
              </p>
            </div>
          )}

          {review && <Why q={q} verdict={verdict} />}
        </div>
      </div>
    </Panel>
  );
}

export default function WellExam({ id }) {
  const progress = useProgress();
  const i = Number(id);
  const idx = Number.isInteger(i) && i >= 0 && i < WB_EXAMS.length ? i : 0;
  const exam = WB_EXAMS[idx];
  const eid = wbExamId(idx);
  const scored = useMemo(() => exam.questions.filter((q) => q.type !== "essay"), [exam]);
  const essays = exam.questions.length - scored.length;

  const [phase, setPhase] = useState("intro");
  const [answers, setAnswers] = useState({});
  const [elapsed, setElapsed] = useState(0);
  const timer = useRef(null);
  const submitted = useRef(false);

  /* reset when the paper changes under us (navigating between papers) */
  useEffect(() => { setPhase("intro"); setAnswers({}); setElapsed(0); submitted.current = false; }, [idx]);

  const score = useMemo(() => exam.questions.reduce((s, q, k) => {
    if (q.type === "mc") return s + (answers[k] === q.answer ? 1 : 0);
    if (q.type === "blank") return s + (blankOk(answers[k], q) ? 1 : 0);
    return s;
  }, 0), [answers, exam]);

  const done = exam.questions.filter((q, k) => (q.type === "mc" ? answers[k] != null : Boolean(answers[k]))).length;

  useEffect(() => {
    if (phase !== "taking") return;
    timer.current = setInterval(() => setElapsed((v) => v + 1), 1000);
    return () => clearInterval(timer.current);
  }, [phase]);

  useEffect(() => {
    if (phase === "review" && !submitted.current) {
      submitted.current = true;
      recordExam(score, scored.length, eid, answers);
    }
  }, [phase, score, scored.length, eid, answers]);

  const start = () => { setAnswers({}); setElapsed(0); submitted.current = false; setPhase("taking"); };
  const reviewSaved = () => {
    const saved = progress.exams?.[eid]?.last;
    if (!saved) return;
    setAnswers(saved.answers || {});
    submitted.current = true;
    setPhase("review");
  };

  const b = progress.exams?.[eid];

  if (phase === "intro") {
    const pct = b ? Math.round((b.score / b.total) * 100) : null;
    return (
      <div className="max-w-[760px]">
        <a href="#/hyl" className="label-mono text-muted-foreground hover:text-foreground transition-colors">← Hack Your Life</a>
        <SectionLabel className="text-emerald-deep mt-3">Practice exam {"ABCDE"[idx]}</SectionLabel>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">{exam.title}</h1>
        <p className="text-[14px] text-muted-foreground mt-2 leading-relaxed max-w-[68ch]">
          <Rich text={exam.lede} />
        </p>

        <Panel className="p-5 mt-5">
          <div className="grid sm:grid-cols-3 gap-3">
            {[[scored.length, "scored questions"], [essays, "short essays"], [exam.questions.length, "questions in all"]].map(([n, lab]) => (
              <div key={lab} className="rounded-md border bg-code-bg-light px-4 py-3">
                <div className="text-[24px] font-semibold leading-none tabular-nums">{n}</div>
                <div className="text-[12.5px] text-muted-foreground mt-1.5">{lab}</div>
              </div>
            ))}
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed mt-4 pt-4 border-t">
            Multiple choice and fill-in-the-blank are marked for you; the essays are not, so your score
            is out of <strong className="text-foreground">{scored.length}</strong> and the model answers
            appear beside your own when you submit. Fill-in-the-blank marking ignores case, punctuation
            and articles, and each question accepts several phrasings.
          </p>
          {b && (
            <p className="text-[13px] mt-3 tabular-nums">
              <span className={cn(pct >= 80 ? "text-emerald-deep" : pct >= 60 ? "text-amber" : "text-destructive")}>
                Best {b.score}/{b.total} ({pct}%)
              </span>
              <span className="text-muted-foreground"> · {b.attempts} attempt{b.attempts > 1 ? "s" : ""}</span>
            </p>
          )}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <Button onClick={start} data-act="begin" className="rounded-md bg-slate-deep hover:bg-navy">
              {b ? "Retake" : "Begin"} <ArrowRight className="size-3.5" />
            </Button>
            {b?.last && (
              <Button onClick={reviewSaved} data-act="review" variant="outline" className="rounded-md bg-card"
                      title={`Reopen your marked attempt from ${new Date(b.last.t).toLocaleString()}`}>
                <BookOpenCheck className="size-3.5" /> Review last attempt
              </Button>
            )}
            {WB_EXAMS.map((e, k) => k !== idx && (
              <Button key={k} asChild size="sm" variant="ghost" className="rounded-md text-muted-foreground">
                <a href={`#/hyl-exam?id=${k}`}>Paper {"ABCDE"[k]}</a>
              </Button>
            ))}
          </div>
          {b && !b.last && (
            <p className="text-[12.5px] text-muted-foreground mt-3">
              Answers were not kept for that sitting — sit it again and the marked copy stays available.
            </p>
          )}
        </Panel>
      </div>
    );
  }

  const review = phase === "review";
  const savedTs = review ? progress.exams?.[eid]?.last?.t : null;
  const savedAt = savedTs
    ? new Date(savedTs).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
    : null;

  const byType = ["mc", "blank"].map((t) => {
    const qs = exam.questions.map((q, k) => [q, k]).filter(([q]) => q.type === t);
    const right = qs.filter(([q, k]) => (t === "mc" ? answers[k] === q.answer : blankOk(answers[k], q))).length;
    return { t, right, total: qs.length };
  });

  return (
    <div className="max-w-[820px]">
      <div className="sticky top-14 z-10 -mx-4 md:-mx-8 px-4 md:px-8 py-3 bg-background/95 backdrop-blur border-b mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="label-mono text-muted-foreground shrink-0" data-paper>{exam.title}</span>
          {review ? (
            <>
              <span className="text-[15px] font-semibold tabular-nums">
                {score} / {scored.length}
                <span className="text-muted-foreground font-normal ml-1.5">({Math.round(score / scored.length * 100)}%)</span>
              </span>
              {savedAt && <span className="text-[12.5px] text-muted-foreground hidden sm:inline" data-attempt-at>attempt of {savedAt}</span>}
              <span className="flex-1" />
              <Button onClick={start} size="sm" variant="outline" className="rounded-md bg-card" data-act="retake">
                <RotateCcw className="size-3.5" /> Retake
              </Button>
              <Button onClick={() => setPhase("intro")} size="sm" className="rounded-md bg-blue-bright hover:bg-blue" data-act="other-papers">
                Other papers
              </Button>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1.5 text-[15px] font-semibold tabular-nums" data-timer>
                <Clock3 className="size-4" /> {fmt(elapsed)}
              </span>
              <span className="text-[13px] text-muted-foreground tabular-nums">{done} / {exam.questions.length} answered</span>
              <span className="flex-1" />
              <Button onClick={() => setPhase("review")} size="sm" className="rounded-md bg-slate-deep hover:bg-navy" data-act="submit">
                <Flag className="size-3.5" /> Submit
              </Button>
            </>
          )}
        </div>
      </div>

      {review && (
        <Panel className="p-5 mb-5">
          <SectionLabel className="mb-3">Breakdown</SectionLabel>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
            {byType.map((r) => (
              <div key={r.t} className="flex items-center justify-between text-[13.5px] py-0.5">
                <span>{TYPE_LABEL[r.t]}</span>
                <span className={cn("tabular-nums font-medium",
                  r.right === r.total ? "text-emerald-deep" : r.right / r.total < 0.6 ? "text-destructive" : "")}>
                  {r.right}/{r.total}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between text-[13.5px] py-0.5">
              <span>Short essays</span>
              <span className="label-mono text-muted-foreground">self-marked</span>
            </div>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed mt-4 pt-4 border-t">
            <PenLine className="size-3 inline mr-1 -mt-0.5" />
            The essays carry real weight on the real paper. Read the model answer under each one and check
            you named a <strong className="text-foreground">mechanism</strong> for every practice you
            recommended — that is where the marks are, not in length.
          </p>
        </Panel>
      )}

      <div className="grid gap-4">
        {exam.questions.map((q, k) => (
          <Question
            key={`${eid}-${k}`}
            q={q}
            n={k + 1}
            value={answers[k] ?? (q.type === "mc" ? null : "")}
            review={review}
            onChange={(v) => setAnswers((a) => ({ ...a, [k]: v }))}
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
