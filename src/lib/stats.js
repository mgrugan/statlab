import { DRILLS } from "@/data/drills";
import { APPLIED } from "@/data/applied";
import { statusOf, todayKey } from "@/lib/progress";

/* Derived gamification stats: ranks, streaks, mastery, badges,
   challenge of the day. All pure functions of the progress state. */

export const RANKS = [
  { xp: 0,    name: "Data Novice" },
  { xp: 200,  name: "Analyst I" },
  { xp: 600,  name: "Data Analyst" },
  { xp: 1400, name: "Data Scientist" },
  { xp: 3000, name: "Data Architect" },
  { xp: 5500, name: "Principal Architect" },
  { xp: 9000, name: "Chief Statistician" },
];

export function rankFor(xp) {
  let i = 0;
  while (i + 1 < RANKS.length && xp >= RANKS[i + 1].xp) i++;
  const current = RANKS[i];
  const next = RANKS[i + 1] || null;
  const pct = next
    ? Math.round(((xp - current.xp) / (next.xp - current.xp)) * 100)
    : 100;
  return { current, next, pct };
}

export function dayKeysBack(n) {
  const out = [];
  const d = new Date();
  for (let i = 0; i < n; i++) {
    out.unshift(todayKey(d));
    d.setDate(d.getDate() - 1);
  }
  return out;
}

/* Consecutive active days ending today (or yesterday, so a streak
   isn't "broken" before you practice today). */
export function streakOf(state) {
  let streak = 0;
  const d = new Date();
  if (!state.days[todayKey(d)]) d.setDate(d.getDate() - 1);
  while (state.days[todayKey(d)]) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function accuracyOf(state) {
  return state.attempts ? Math.round((state.correct / state.attempts) * 100) : 0;
}

export function solvedCounts(state) {
  const drill = DRILLS.filter((q) => statusOf(state, q.id) === "correct").length;
  const applied = APPLIED.filter((q) => statusOf(state, q.id) === "correct").length;
  return { drill, applied, total: drill + applied };
}

/* Skill mastery buckets for the dashboard bars. */
const MASTERY_BUCKETS = [
  { name: "Data Manipulation",
    match: /dplyr|pandas|reshap|join|merg|select|group|filter|clean|inspect|frame|sort|transform|combin|explor|row-wise|i\/o|dates|missing/i },
  { name: "Statistical Modeling",
    match: /hypothesis|regression|anova|correlation|pca|statistic|summary|monte|permutation|bootstrap/i },
  { name: "Programming & Simulation",
    match: /core|function|apply|vector|list|index|string|regex|debug|test|error|simulation|random|numerical|numpy|import|plot|time series|factor|sql/i },
];

export function masteryOf(state) {
  const all = [...DRILLS, ...APPLIED];
  return MASTERY_BUCKETS.map((b) => {
    const qs = all.filter((q) => b.match.test(q.topic));
    const solved = qs.filter((q) => statusOf(state, q.id) === "correct").length;
    return { name: b.name, pct: qs.length ? Math.round((solved / qs.length) * 100) : 0 };
  });
}

export function langSolved(state, lang) {
  return [...DRILLS, ...APPLIED].filter(
    (q) => q.lang === lang && statusOf(state, q.id) === "correct").length;
}

/* Badges shown on the leaderboard; earned state derived from progress. */
export function badgesOf(state) {
  const counts = solvedCounts(state);
  const streak = streakOf(state);
  return [
    { id: "first-blood", name: "First Blood", desc: "Solve your first problem",
      earned: counts.total >= 1 },
    { id: "hot-streak", name: "Hot Streak", desc: "Practice 3 days in a row",
      earned: streak >= 3 },
    { id: "optimizer", name: "Optimizer", desc: "Solve 25 command drills",
      earned: counts.drill >= 25 },
    { id: "field-worker", name: "Field Worker", desc: "Solve 10 applied problems",
      earned: counts.applied >= 10 },
    { id: "r-whisperer", name: "R Whisperer", desc: "Solve 25 R questions",
      earned: langSolved(state, "r") >= 25 },
    { id: "pythonista", name: "Pythonista", desc: "Solve 25 Python questions",
      earned: langSolved(state, "python") >= 25 },
    { id: "mind-palace", name: "Mind Palace", desc: "Reach 90% overall accuracy (50+ attempts)",
      earned: state.attempts >= 50 && accuracyOf(state) >= 90 },
    { id: "century", name: "Century Club", desc: "Solve 100 questions",
      earned: counts.total >= 100 },
  ];
}

/* Deterministic daily pick from the applied bank. */
export function challengeOfTheDay() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now - start) / 86400000);
  return APPLIED[(day * 7) % APPLIED.length];
}

/* Simulated peers for the local leaderboard. XP is static; you move
   through the table as your real XP grows. */
export const PEERS = [
  { name: "Alex Chen",      title: "Neural Net Specialist", xp: 52000, initials: "AC", badges: ["century", "mind-palace"] },
  { name: "Dr. Elena Volkov", title: "Principal Architect", xp: 48210, initials: "EV", badges: ["century"] },
  { name: "Sarah Jenkins",  title: "Senior Data Lead",      xp: 47150, initials: "SJ", badges: ["optimizer"] },
  { name: "Marcus Thorne",  title: "Deep Learning Eng.",    xp: 42880, initials: "MT", badges: ["pythonista", "hot-streak"] },
  { name: "Yuki Tanaka",    title: "Pandas Expert",         xp: 41260, initials: "YT", badges: ["pythonista", "field-worker"] },
  { name: "Oliver Smith",   title: "Quant Researcher",      xp: 40950, initials: "OS", badges: ["r-whisperer"] },
  { name: "Priya Sharma",   title: "Biostatistician",       xp: 12400, initials: "PS", badges: ["optimizer"] },
  { name: "Leo Fontaine",   title: "BI Developer",          xp: 6800,  initials: "LF", badges: ["hot-streak"] },
  { name: "Grace Okafor",   title: "ML Engineer",           xp: 2150,  initials: "GO", badges: ["first-blood"] },
  { name: "Tom Villanueva", title: "Stats Undergrad",       xp: 640,   initials: "TV", badges: ["first-blood"] },
  { name: "Mia Anders",     title: "Data Novice",           xp: 120,   initials: "MA", badges: [] },
];

export function leaderboardOf(state) {
  const you = { name: "You", title: rankFor(state.xp).current.name, xp: state.xp,
                initials: "YO", you: true,
                badges: badgesOf(state).filter((b) => b.earned).map((b) => b.id) };
  const rows = [...PEERS, you].sort((a, b) => b.xp - a.xp);
  return rows.map((r, i) => ({ ...r, rank: i + 1 }));
}

export function relTime(t) {
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} hour${s < 7200 ? "" : "s"} ago`;
  const d = Math.floor(s / 86400);
  return d === 1 ? "yesterday" : `${d} days ago`;
}
