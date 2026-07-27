import {
  CheckCircle2, Terminal, Clock3, Database, Flame, ArrowRight,
  CircleAlert, Award, Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DRILLS } from "@/data/drills";
import { APPLIED } from "@/data/applied";
import { useProgress, statusOf, questionMeta, xpValue, todayKey } from "@/lib/progress";
import {
  rankFor, streakOf, accuracyOf, solvedCounts, masteryOf, badgesOf,
  challengeOfTheDay, dayKeysBack, relTime,
} from "@/lib/stats";
import { LangChip, DiffChip, Panel, Bar, SectionLabel, MdLite } from "@/components/shared";

function StatTile({ icon: Icon, value, label, delta, deltaTone = "up" }) {
  return (
    <Panel className="p-4">
      <div className="flex items-start justify-between">
        <span className="grid place-items-center size-8 rounded-md bg-blue-tint text-blue">
          <Icon className="size-4" strokeWidth={1.75} />
        </span>
        {delta && (
          <span className={`label-mono px-1.5 py-0.5 rounded-sm ${deltaTone === "up" ? "bg-emerald-soft text-emerald-deep" : "bg-muted text-muted-foreground"}`}>
            {delta}
          </span>
        )}
      </div>
      <div className="text-2xl font-semibold tabular-nums mt-3 leading-none">{value}</div>
      <div className="text-[12px] text-muted-foreground mt-1">{label}</div>
    </Panel>
  );
}

export default function Dashboard() {
  const progress = useProgress();
  const rank = rankFor(progress.xp);
  const streak = streakOf(progress);
  const counts = solvedCounts(progress);
  const mastery = masteryOf(progress);
  const badges = badgesOf(progress);
  const earnedBadges = badges.filter((b) => b.earned);
  const challenge = challengeOfTheDay();
  const challengeSolved = statusOf(progress, challenge.id) === "correct";
  const days = dayKeysBack(14);
  const activeDayCount = Object.keys(progress.days).length;

  const nextUp = [...DRILLS.filter((q) => statusOf(progress, q.id) !== "correct").slice(0, 1),
                  ...APPLIED.filter((q) => statusOf(progress, q.id) !== "correct").slice(0, 1)];

  return (
    <div className="grid gap-6">
      {/* top row: rank + streak */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-stretch">
        <Panel className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="label-mono bg-blue-tint text-blue px-2 py-1 rounded-sm">Current Rank</span>
            <span className="text-sm font-semibold">{rank.current.name}</span>
          </div>
          <div className="flex items-end gap-2 mt-4">
            <span className="text-3xl font-semibold tabular-nums leading-none">{progress.xp.toLocaleString()}</span>
            {rank.next && (
              <span className="text-[12px] text-muted-foreground mb-0.5">
                / {rank.next.xp.toLocaleString()} XP to {rank.next.name}
              </span>
            )}
          </div>
          <Bar pct={rank.pct} className="mt-3 h-1.5" />
          <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t">
            <div>
              <div className="text-xl font-semibold tabular-nums">{accuracyOf(progress)}%</div>
              <div className="label-mono text-muted-foreground mt-0.5">Accuracy</div>
            </div>
            <div>
              <div className="text-xl font-semibold tabular-nums">{counts.total}</div>
              <div className="label-mono text-muted-foreground mt-0.5">Solved</div>
            </div>
            <div>
              <div className="text-xl font-semibold tabular-nums">{earnedBadges.length}</div>
              <div className="label-mono text-muted-foreground mt-0.5">Badges</div>
            </div>
          </div>
        </Panel>

        {/* streak card — dark panel like the mock */}
        <div className="rounded-lg bg-navy text-white p-6 flex flex-col">
          <span className="grid place-items-center size-10 rounded-md bg-[#1e293b]">
            <Flame className="size-5 text-emerald-bright" />
          </span>
          <div className="text-lg font-semibold mt-3">
            {streak > 0 ? `${streak} Day Streak` : "Start a Streak"}
          </div>
          <p className="text-[12.5px] text-[#94a3b8] mt-1 leading-relaxed">
            {streak > 0
              ? "Keep the momentum — one drill a day keeps the rust away."
              : "Solve one question today to light the flame."}
          </p>
          <div className="flex gap-1 mt-auto pt-4">
            {days.map((d) => (
              <span
                key={d}
                title={d}
                className={`flex-1 h-6 rounded-sm ${progress.days[d] ? "bg-emerald" : "bg-[#1e293b]"} ${d === todayKey() ? "ring-1 ring-emerald-bright" : ""}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile icon={CheckCircle2} value={counts.applied} label="Problems Solved" delta={`of ${APPLIED.length}`} />
        <StatTile icon={Terminal} value={counts.drill} label="Commands Learned" delta={`of ${DRILLS.length}`} />
        <StatTile icon={Clock3} value={progress.attempts} label="Total Attempts" delta={activeDayCount ? `${activeDayCount} active days` : null} deltaTone="flat" />
        <StatTile icon={Database} value={DRILLS.length + APPLIED.length} label="Questions in the Bank" delta="R + Python" deltaTone="flat" />
      </div>

      {/* challenge + right rail */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="grid gap-6">
          {/* challenge of the day */}
          <Panel className="p-0 overflow-hidden">
            <div className="grid sm:grid-cols-[160px_1fr]">
              <div className="bg-code-bg hidden sm:grid place-items-center p-6">
                <div className="text-center">
                  <Rocket className="size-6 text-emerald-bright mx-auto" />
                  <div className="label-mono text-[#94a3b8] mt-3 leading-relaxed">Challenge<br />of the Day</div>
                </div>
              </div>
              <div className="p-5 md:p-6">
                <h3 className="text-lg font-semibold tracking-tight">{challenge.title}</h3>
                <p className="text-[13.5px] text-muted-foreground mt-1.5 leading-relaxed max-w-[58ch]">
                  <MdLite text={challenge.scenario} />
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <DiffChip diff={challenge.diff} />
                  <LangChip lang={challenge.lang} />
                  <span className="label-mono text-blue">{xpValue(challenge.id)} XP</span>
                  <span className="flex-1" />
                  <Button asChild size="sm" className="rounded-md bg-slate-deep hover:bg-navy">
                    <a href={`#/practice?q=${challenge.id}`} data-act="challenge">
                      {challengeSolved ? "Solved — review" : "Launch Lab"} <ArrowRight className="size-3.5" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Panel>

          {/* continue learning */}
          <Panel className="p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold">Continue Learning</h3>
              <a href="#/learn" className="text-[12.5px] font-medium text-blue hover:underline">View all</a>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {nextUp.map((q) => (
                <a
                  key={q.id}
                  href={q.id.startsWith("a") ? `#/practice?q=${q.id}` : "#/learn"}
                  className="border rounded-md p-4 hover:bg-muted transition-colors duration-150 group"
                >
                  <LangChip lang={q.lang} />
                  <div className="font-mono text-[13px] font-medium mt-3 truncate">
                    {q.a ? q.a.split("\n")[0] : q.title}
                  </div>
                  <div className="text-[12px] text-muted-foreground mt-1 line-clamp-2">
                    {q.topic} · {q.id.startsWith("a") ? "applied problem" : "command drill"}
                  </div>
                  <div className="flex items-center gap-1 text-[12px] font-medium text-blue mt-2">
                    Resume <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </a>
              ))}
            </div>
          </Panel>
        </div>

        {/* right rail: activity + mastery */}
        <div className="grid gap-6">
          <Panel>
            <div className="px-4 pt-4 pb-3 border-b">
              <h3 className="text-[15px] font-semibold">Recent Activity</h3>
            </div>
            {progress.log.length === 0 ? (
              <p className="px-4 py-4 text-[13px] text-muted-foreground">
                No activity yet — solve your first drill to get on the board.
              </p>
            ) : (
              <ul className="divide-y">
                {progress.log.slice(0, 5).map((e, i) => {
                  const meta = questionMeta(e.qid);
                  const Icon = e.kind === "solve" ? CheckCircle2 : e.kind === "reveal" ? Award : CircleAlert;
                  const tone = e.kind === "solve" ? "text-emerald" : e.kind === "reveal" ? "text-blue" : "text-destructive";
                  return (
                    <li key={i} className="flex items-start gap-3 px-4 py-3">
                      <Icon className={`size-4 mt-0.5 shrink-0 ${tone}`} strokeWidth={1.75} />
                      <div className="min-w-0">
                        <div className="text-[13px] leading-snug">
                          {e.kind === "solve" ? "Solved" : e.kind === "reveal" ? "Revealed" : "Missed"}{" "}
                          <b className="font-medium">{meta?.label || e.qid}</b>
                          {e.xp ? <span className="text-blue font-medium"> · +{e.xp} XP</span> : null}
                        </div>
                        <div className="text-[11.5px] text-muted-foreground mt-0.5">{relTime(e.t)}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          {/* skill mastery — dark panel like the mock */}
          <div className="rounded-lg bg-navy text-white p-5">
            <div className="label-mono text-[#94a3b8] mb-4">Skill Mastery</div>
            <div className="grid gap-4">
              {mastery.map((m) => (
                <div key={m.name}>
                  <div className="flex justify-between text-[12.5px] mb-1.5">
                    <span>{m.name}</span>
                    <span className="tabular-nums text-[#94a3b8]">{m.pct}%</span>
                  </div>
                  <div className="h-1 rounded-sm bg-[#1e293b] overflow-hidden">
                    <div
                      className={`h-full rounded-sm ${m.pct >= 100 ? "bg-emerald" : "bg-blue-bright"}`}
                      style={{ width: `${Math.max(2, m.pct)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
