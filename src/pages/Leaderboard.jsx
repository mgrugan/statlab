import { TrendingUp, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import { useProgress, resetProgress } from "@/lib/progress";
import { leaderboardOf, badgesOf, rankFor } from "@/lib/stats";
import { Panel, SectionLabel } from "@/components/shared";
import { cn } from "@/lib/utils";

const BADGE_TINTS = ["bg-emerald-soft text-emerald-deep", "bg-blue-tint text-blue", "bg-amber-soft text-amber", "bg-muted text-muted-foreground"];

function Avatar({ row, size = "size-10", ring = false }) {
  return (
    <span className={cn(
      "grid place-items-center rounded-full font-bold text-white shrink-0",
      size,
      row.you ? "bg-blue-bright" : "bg-slate-deep",
      ring && "ring-2 ring-blue-bright ring-offset-2",
    )}>
      {row.initials}
    </span>
  );
}

export default function Leaderboard() {
  const progress = useProgress();
  const rows = leaderboardOf(progress);
  const badges = badgesOf(progress);
  const you = rows.find((r) => r.you);
  const podium = rows.slice(0, 3);
  const rest = rows.slice(3);
  const badgeName = (id) => badges.find((b) => b.id === id)?.name || id;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <SectionLabel className="text-blue">Global Rankings</SectionLabel>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">Community Leaderboard</h1>
          <p className="text-[13.5px] text-muted-foreground mt-1.5 max-w-[52ch] leading-relaxed">
            A simulated cohort of fellow learners — earn StatPoints (XP) by solving
            drills and applied problems and climb the table. Everything is local:
            your only real opponent is last week's you.
          </p>
        </div>
        <Panel className="p-4 min-w-[180px]">
          <SectionLabel className="mb-1">Your Current Rank</SectionLabel>
          <div className="text-2xl font-semibold tabular-nums">#{you.rank}</div>
          <div className="text-[12px] text-muted-foreground mt-0.5">
            {rankFor(progress.xp).current.name} · {progress.xp.toLocaleString()} XP
          </div>
        </Panel>
      </div>

      {/* tabs (local mode: only Global is live) */}
      <div className="flex items-center gap-1">
        {["Global", "Weekly", "Friends"].map((t, i) => (
          <span
            key={t}
            className={cn(
              "px-3.5 py-1.5 rounded-md text-[13px] font-medium flex items-center gap-1.5",
              i === 0 ? "bg-slate-deep text-white" : "text-muted-foreground/60 cursor-not-allowed",
            )}
            title={i === 0 ? undefined : "Not available in local mode"}
          >
            {t} {i > 0 && <Lock className="size-3" />}
          </span>
        ))}
      </div>

      {/* podium */}
      <div className="grid sm:grid-cols-3 gap-4 items-end">
        {[podium[1], podium[0], podium[2]].filter(Boolean).map((row) => {
          const first = row.rank === 1;
          return first ? (
            <div key={row.rank} className="rounded-lg bg-navy text-white p-6 text-center sm:-mt-2 order-first sm:order-none">
              <div className="relative inline-block">
                <Avatar row={row} size="size-14 text-lg" />
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 grid place-items-center size-5 rounded-full bg-blue-bright text-[10px] font-bold">1</span>
              </div>
              <div className="font-semibold mt-3">{row.name}</div>
              <div className="text-[12px] text-[#94a3b8]">{row.title}</div>
              <div className="label-mono text-emerald-bright mt-2 tabular-nums">{row.xp.toLocaleString()} XP</div>
            </div>
          ) : (
            <Panel key={row.rank} className="p-5 text-center">
              <div className="relative inline-block">
                <Avatar row={row} size="size-11" />
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 grid place-items-center size-5 rounded-full bg-slate-deep text-white text-[10px] font-bold">{row.rank}</span>
              </div>
              <div className="font-semibold mt-3 text-[15px]">{row.name}</div>
              <div className="text-[12px] text-muted-foreground">{row.title}</div>
              <div className="label-mono text-emerald-deep mt-2 tabular-nums">{row.xp.toLocaleString()} XP</div>
            </Panel>
          );
        })}
      </div>

      {/* table */}
      <Panel className="overflow-hidden">
        <div className="grid grid-cols-[56px_1fr_auto] sm:grid-cols-[64px_1fr_1fr_auto] items-center px-4 py-2.5 border-b bg-code-bg-light">
          <span className="label-mono text-muted-foreground">Rank</span>
          <span className="label-mono text-muted-foreground">Learner</span>
          <span className="label-mono text-muted-foreground hidden sm:block">Badges</span>
          <span className="label-mono text-muted-foreground text-right">StatPoints</span>
        </div>
        <ul className="divide-y">
          {rest.map((row) => (
            <li
              key={row.rank}
              data-you={row.you || undefined}
              className={cn(
                "grid grid-cols-[56px_1fr_auto] sm:grid-cols-[64px_1fr_1fr_auto] items-center px-4 py-3",
                row.you && "bg-blue-tint",
              )}
            >
              <span className="font-mono text-[13px] tabular-nums text-muted-foreground">{row.rank}</span>
              <span className="flex items-center gap-3 min-w-0">
                <Avatar row={row} size="size-8 text-[11px]" />
                <span className="min-w-0">
                  <span className={cn("block text-[13.5px] font-medium truncate", row.you && "text-blue")}>
                    {row.name}{row.you && " (that's you)"}
                  </span>
                  <span className="block text-[11.5px] text-muted-foreground truncate">{row.title}</span>
                </span>
              </span>
              <span className="hidden sm:flex gap-1.5 flex-wrap">
                {row.badges.slice(0, 2).map((b, i) => (
                  <span key={b} className={cn("label-mono px-1.5 py-0.5 rounded-sm", BADGE_TINTS[i % BADGE_TINTS.length])}>
                    {badgeName(b)}
                  </span>
                ))}
              </span>
              <span className="font-mono text-[13px] font-semibold tabular-nums text-right">
                {row.xp.toLocaleString()}
                {row.you && <TrendingUp className="inline size-3.5 ml-1.5 text-emerald" />}
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      {/* badge gallery */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-semibold">Badges</h3>
          <span className="text-[12px] text-muted-foreground tabular-nums">
            {badges.filter((b) => b.earned).length} / {badges.length} earned
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {badges.map((b) => (
            <Panel key={b.id} className={cn("p-4 text-center", !b.earned && "opacity-55")}>
              <span className={cn(
                "mx-auto grid place-items-center size-9 rounded-md label-mono",
                b.earned ? "bg-emerald-soft text-emerald-deep" : "bg-muted text-muted-foreground",
              )}>
                {b.earned ? "✓" : <Lock className="size-3.5" />}
              </span>
              <div className="text-[13.5px] font-semibold mt-2.5">{b.name}</div>
              <div className="text-[11.5px] text-muted-foreground mt-0.5 leading-snug">{b.desc}</div>
            </Panel>
          ))}
        </div>
      </div>

      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link" className="text-muted-foreground p-0 h-auto text-[13px]" data-act="reset">
              Reset all progress
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Wipe all StatCode progress?</DialogTitle>
              <DialogDescription>
                XP, streaks, badges, and every solved mark will be cleared. This can't be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="rounded-md">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="destructive" className="rounded-md" onClick={resetProgress}>Reset everything</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
