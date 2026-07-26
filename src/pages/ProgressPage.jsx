import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import { DRILLS } from "@/data/drills";
import { APPLIED } from "@/data/applied";
import { LANG_META } from "@/lib/quiz";
import { useProgress, statusOf, resetProgress } from "@/lib/progress";
import { PageHead } from "@/components/shared";

const BAR_COLOR = { r: "bg-evergreen", python: "bg-amber", sql: "bg-slate" };

function ProgCard({ name, lang, qs, progress }) {
  const solved = qs.filter((q) => statusOf(progress, q.id) === "correct").length;
  const missed = qs.filter((q) => statusOf(progress, q.id) === "missed").length;
  const pct = Math.round((solved / qs.length) * 100);
  return (
    <Card className="shadow-raised">
      <CardContent className="px-5">
        <h3 className="font-display text-lg font-semibold">{LANG_META[lang].name}</h3>
        <div className="text-xs text-muted-foreground mb-3">{name}</div>
        <Progress value={pct} className="bg-background border" indicatorClassName={BAR_COLOR[lang]} />
        <div className="flex justify-between text-xs text-muted-foreground mt-1.5 tabular-nums">
          <span>{solved} solved · {missed} missed</span>
          <span>{pct}%</span>
        </div>
      </CardContent>
    </Card>
  );
}

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

export default function ProgressPage() {
  const progress = useProgress();
  const banks = [
    ["Command Drills", DRILLS],
    ["Applied Problems", APPLIED],
  ];
  const attempts = Object.values(progress).reduce((s, p) => s + p.tries, 0);
  const solved = Object.values(progress).filter((p) => p.status === "correct").length;
  const missed = Object.values(progress).filter((p) => p.status === "missed").length;

  return (
    <div>
      <PageHead
        title="Progress"
        blurb={`Solved sticks once you get a question right; "missed" marks questions you revealed or got wrong and haven't cracked yet. Use the Missed filter in each section to grind them down.`}
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 mt-5">
        {banks.flatMap(([name, bank]) =>
          ["r", "python", "sql"].map((lang) => {
            const qs = bank.filter((q) => q.lang === lang);
            if (!qs.length) return null;
            return <ProgCard key={name + lang} name={name} lang={lang} qs={qs} progress={progress} />;
          }),
        )}
      </div>

      <div className="grid gap-4 grid-cols-3 mt-6">
        <StatTile num={attempts} label="total attempts" />
        <StatTile num={solved} label="solved" />
        <StatTile num={missed} label="to review" />
      </div>

      <div className="mt-9">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link" className="text-muted-foreground p-0 h-auto font-medium" data-act="reset">
              Reset all progress
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Wipe all StatLab progress?</DialogTitle>
              <DialogDescription>
                Every solved and missed mark will be cleared. This can't be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="destructive" onClick={resetProgress}>Reset everything</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
