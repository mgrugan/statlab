import { useEffect, useMemo } from "react";
import { ArrowLeft, ArrowRight, Clock3, Flag, CheckCircle2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel, SectionLabel } from "@/components/shared";
import { Rich as RichBase } from "@/components/Math";
/* This course has no mathematics in it, so the $…$ form is off: without
   that, a pair of dollar amounts in one sentence renders as KaTeX. */
const Rich = (props) => <RichBase {...props} tex={false} />;
import { WB_MODULES } from "@/data/wellbeing/course";
import { WB_CHECKS } from "@/data/wellbeing/checks";
import ModuleQuiz from "@/components/ModuleQuiz";
import { markLessonRead, useProgress } from "@/lib/progress";
import { wbModuleId } from "@/pages/WellStudy";

/* A body block declares its own render order through its key order, so the
   renderer walks Object.entries rather than hard-coding a layout. Keys left
   null by the source extraction are skipped. */
function Block({ block }) {
  const parts = [];
  for (const [k, v] of Object.entries(block)) {
    if (v == null || (Array.isArray(v) && v.length === 0)) continue;
    const key = `${k}-${parts.length}`;
    if (k === "h") {
      parts.push(
        <h2 key={key} className="text-[17px] font-semibold tracking-tight mt-7 first:mt-0 mb-2.5">
          <Rich text={v} />
        </h2>,
      );
    } else if (k === "h3") {
      parts.push(
        <h3 key={key} className="text-[14.5px] font-semibold mt-5 mb-2">
          <Rich text={v} />
        </h3>,
      );
    } else if (k === "p" || k === "p2" || k === "p3") {
      v.forEach((t, i) => parts.push(
        <p key={`${key}-${i}`} className="text-[14.5px] leading-[1.75] mt-2.5 first:mt-0">
          <Rich text={t} />
        </p>,
      ));
    } else if (k === "ul") {
      parts.push(
        <ul key={key} className="grid gap-1.5 mt-3 ml-5 list-disc text-[14.5px] leading-[1.7]">
          {v.map((t, i) => <li key={i} className="pl-1"><Rich text={t} /></li>)}
        </ul>,
      );
    } else if (k === "stats") {
      parts.push(
        <div key={key} className="grid sm:grid-cols-3 gap-2.5 mt-4">
          {v.map(([n, lab], i) => (
            <div key={i} className="rounded-md border bg-code-bg-light px-3.5 py-3">
              <div className="text-[22px] font-semibold leading-none tabular-nums text-emerald-deep">{n}</div>
              <div className="text-[12px] text-muted-foreground mt-1.5 leading-snug">{lab}</div>
            </div>
          ))}
        </div>,
      );
    } else if (k === "table") {
      parts.push(
        <div key={key} className="mt-4 -mx-1 overflow-x-auto">
          <table className="w-full text-[13.5px] border-collapse min-w-[420px]">
            <thead>
              <tr>
                {v.head.map((h, i) => (
                  <th key={i} className="text-left label-mono text-muted-foreground font-normal border-b pb-2 px-2.5 align-bottom">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {v.rows.map((r, i) => (
                <tr key={i} className="border-b last:border-0">
                  {r.map((c, j) => (
                    <td key={j} className="py-2.5 px-2.5 align-top leading-snug">
                      <Rich text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
    } else if (k === "note") {
      parts.push(
        <div key={key} className="mt-4 rounded-md border-l-2 border-amber bg-amber-soft/45 px-4 py-3">
          <p className="text-[13.5px] leading-relaxed"><Rich text={v} /></p>
        </div>,
      );
    } else if (k === "src") {
      parts.push(
        <p key={key} className="label-mono text-muted-foreground mt-3">{v}</p>,
      );
    }
  }
  return <section className="min-w-0">{parts}</section>;
}

export default function WellLesson({ id }) {
  const i = Number(id);
  const idx = Number.isInteger(i) && i >= 0 && i < WB_MODULES.length ? i : 0;
  const m = WB_MODULES[idx];
  const mid = wbModuleId(idx);
  const progress = useProgress();
  const read = Boolean(progress.lessons?.[mid]);

  /* a fresh key per module id so nothing from the previous one lingers */
  const prev = idx > 0 ? idx - 1 : null;
  const next = idx < WB_MODULES.length - 1 ? idx + 1 : null;

  useEffect(() => { window.scrollTo(0, 0); }, [idx]);

  const facts = useMemo(() => m.keyFacts, [m]);

  return (
    <div className="max-w-[760px] min-w-0" key={mid}>
      <a href="#/hyl" className="inline-flex items-center gap-1.5 label-mono text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="size-3" /> All modules
      </a>

      <div className="mt-3">
        <SectionLabel className="text-emerald-deep">
          Module {String(idx + 1).padStart(2, "0")} of {WB_MODULES.length}
        </SectionLabel>
        <h1 className="text-[26px] font-semibold tracking-tight leading-snug mt-1.5">{m.title}</h1>
        <p className="text-[14.5px] text-muted-foreground mt-2 leading-relaxed">{m.lede}</p>
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <span className="flex items-center gap-1 label-mono text-muted-foreground">
            <Clock3 className="size-3" /> {m.mins} min read
          </span>
          {read && (
            <span className="flex items-center gap-1 label-mono text-emerald-deep">
              <CheckCircle2 className="size-3" /> read
            </span>
          )}
        </div>
        <p className="label-mono text-muted-foreground mt-2.5 leading-relaxed">
          Sources: {m.sources.join(" · ")}
        </p>
      </div>

      {/* exam facts first — the point of the module */}
      <Panel className="p-5 mt-6 border-amber/35 bg-amber-soft/25">
        <div className="flex items-center gap-2 mb-3">
          <Flag className="size-3.5 text-amber" strokeWidth={2} />
          <SectionLabel className="text-amber">Most likely to be asked</SectionLabel>
        </div>
        <ul className="grid gap-3">
          {facts.map((f, k) => (
            <li key={k} className="flex gap-3 text-[14px] leading-[1.7]">
              <span className="label-mono text-amber shrink-0 mt-0.5">{String(k + 1).padStart(2, "0")}</span>
              <span className="min-w-0"><Rich text={f} /></span>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="mt-7">
        {m.body.map((b, k) => <Block key={`${mid}-${k}`} block={b} />)}
      </div>

      {/* keyed on the module so moving between modules resets the quiz
          rather than carrying the previous one's answers across */}
      <ModuleQuiz
        key={`chk-${mid}`}
        moduleId={mid}
        bank={WB_CHECKS[mid]}
        tex={false}
        label="Checkpoint"
        blurb="Five questions on this module, reshuffled on every attempt."
        nextHref={next != null ? `#/hyl-lesson?id=${next}` : "#/hyl-exam?id=0"}
        nextLabel={next != null ? "Next module" : "Practice exam A"}
      />

      {/* footer */}
      <Panel className="p-5 mt-8">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => markLessonRead(mid)}
            disabled={read}
            data-act="mark-read"
            className="rounded-md bg-emerald hover:bg-emerald-deep disabled:opacity-100 disabled:bg-emerald-soft disabled:text-emerald-deep"
          >
            <CheckCircle2 className="size-3.5" /> {read ? "Marked as read" : "Mark as read"}
          </Button>
          <span className="flex-1" />
          {prev != null && (
            <Button asChild size="sm" variant="outline" className="rounded-md bg-card">
              <a href={`#/hyl-lesson?id=${prev}`} data-act="prev"><ArrowLeft className="size-3.5" /> Previous</a>
            </Button>
          )}
          {next != null ? (
            <Button asChild size="sm" className="rounded-md bg-blue-bright hover:bg-blue">
              <a href={`#/hyl-lesson?id=${next}`} data-act="next">Next module <ArrowRight className="size-3.5" /></a>
            </Button>
          ) : (
            <Button asChild size="sm" className="rounded-md bg-blue-bright hover:bg-blue">
              <a href="#/hyl-exam?id=0" data-act="to-exam">Sit Practice Exam A <ArrowRight className="size-3.5" /></a>
            </Button>
          )}
        </div>
        {next != null && (
          <p className="text-[12.5px] text-muted-foreground mt-3 pt-3 border-t leading-relaxed">
            <BookOpen className="size-3 inline mr-1 -mt-0.5" />
            Up next: <strong className="text-foreground">{WB_MODULES[next].title}</strong> — {WB_MODULES[next].lede}
          </p>
        )}
      </Panel>
    </div>
  );
}
