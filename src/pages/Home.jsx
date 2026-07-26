import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DRILLS } from "@/data/drills";
import { APPLIED } from "@/data/applied";
import { langCounts } from "@/lib/quiz";
import { useProgress } from "@/lib/progress";

function StatTile({ num, label }) {
  return (
    <Card className="py-4 shadow-none">
      <CardContent className="px-5">
        <div className="font-display text-3xl font-semibold leading-tight">{num}</div>
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}

function SectionCard({ href, kicker, title, blurb, chips }) {
  return (
    <a
      href={href}
      className="block bg-card border rounded-xl p-6 md:p-7 shadow-raised transition-all duration-150 hover:-translate-y-0.5 hover:shadow-overlay"
    >
      <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-evergreen">{kicker}</span>
      <h2 className="font-display text-2xl md:text-[26px] font-semibold tracking-tight mt-2 mb-2.5">{title}</h2>
      <p className="text-sm text-muted-foreground mb-4">{blurb}</p>
      <span className="flex gap-2 flex-wrap">{chips}</span>
    </a>
  );
}

const softChip = {
  r: "bg-r-soft text-evergreen",
  python: "bg-py-soft text-amber",
  sql: "bg-sql-soft text-slate",
};

function CountChip({ lang, children }) {
  return (
    <Badge className={`rounded-full border-transparent text-[11px] font-semibold uppercase tracking-[0.06em] ${softChip[lang]}`}>
      {children}
    </Badge>
  );
}

export default function Home() {
  const progress = useProgress();
  const dc = langCounts(DRILLS);
  const ac = langCounts(APPLIED);
  const total = DRILLS.length + APPLIED.length;
  const done = Object.values(progress).filter((p) => p.status === "correct").length;

  return (
    <div>
      <div className="max-w-[720px] mb-12">
        <h1 className="font-display font-semibold leading-[1.08] tracking-tight text-[clamp(34px,5vw,46px)] mb-4">
          LeetCode, but for <em className="not-italic text-evergreen">statistical computing</em>.
        </h1>
        <p className="text-[17px] text-muted-foreground max-w-[58ch]">
          Drill the commands until they're reflex, then apply them to problems that look like
          real work. Every question tells you whether to answer in R or Python — so you learn
          both, side by side, the way STA 350 tests them.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-12">
        <SectionCard
          href="#/drills"
          kicker="Section 1"
          title="Command Drills"
          blurb="Fast reps on syntax and semantics: indexing, the apply family, dplyr, pandas, NumPy, debugging, regex — the flashcard set, playable."
          chips={<>
            <CountChip lang="r">{dc.r} R</CountChip>
            <CountChip lang="python">{dc.python} Python</CountChip>
            <CountChip lang="sql">{dc.sql} SQL bonus</CountChip>
          </>}
        />
        <SectionCard
          href="#/applied"
          kicker="Section 2"
          title="Applied Problems"
          blurb="A/B tests, bootstraps, regressions, pipelines, cleanup jobs — scenario first, code second, in whichever language the question demands."
          chips={<>
            <CountChip lang="r">{ac.r} R</CountChip>
            <CountChip lang="python">{ac.python} Python</CountChip>
          </>}
        />
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <StatTile num={total} label="questions" />
        <StatTile num={dc.r + ac.r} label="in R" />
        <StatTile num={dc.python + ac.python} label="in Python" />
        <StatTile num={done} label="solved by you" />
      </div>
    </div>
  );
}
