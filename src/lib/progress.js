import { useSyncExternalStore } from "react";
import { DRILLS } from "@/data/drills";
import { APPLIED } from "@/data/applied";

/* localStorage-backed progress store (v2).
   Shape:
   {
     answers:  { [qid]: { tries, status: "unseen"|"correct"|"missed" } },
     xp:       number,          // awarded once per first-solve, scaled by difficulty
     attempts: number,          // every graded check (reveals count as misses)
     correct:  number,          // graded checks that were correct
     days:     { "YYYY-MM-DD": count },   // activity per day (streak + calendar)
     log:      [ { t, kind: "solve"|"miss"|"reveal", qid, xp? } ]  // newest first, cap 40
   }
   Migrates v1 (flat { [qid]: {tries, status} }) on first load. */

const KEY_V2 = "statlab-progress-v2";
const KEY_V1 = "statlab-progress-v1";

const QUESTION_INDEX = {};
DRILLS.forEach((q) => { QUESTION_INDEX[q.id] = { diff: q.diff, kind: "drill", topic: q.topic, lang: q.lang, label: q.topic }; });
APPLIED.forEach((q) => { QUESTION_INDEX[q.id] = { diff: q.diff, kind: "applied", topic: q.topic, lang: q.lang, label: q.title }; });

export function xpValue(qid) {
  const q = QUESTION_INDEX[qid];
  if (!q) return 0;
  return (q.kind === "applied" ? 25 : 10) * q.diff;
}
export function questionMeta(qid) { return QUESTION_INDEX[qid]; }

export function todayKey(d = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function emptyState() {
  return { answers: {}, xp: 0, attempts: 0, correct: 0, days: {}, log: [], lessons: {}, examBest: null, quizzes: {} };
}

function migrateV1() {
  try {
    const v1 = JSON.parse(localStorage.getItem(KEY_V1));
    if (!v1 || typeof v1 !== "object") return null;
    const s = emptyState();
    for (const [qid, rec] of Object.entries(v1)) {
      if (!rec || typeof rec !== "object") continue;
      s.answers[qid] = { tries: rec.tries || 0, status: rec.status || "unseen" };
      s.attempts += rec.tries || 0;
      if (rec.status === "correct") {
        s.correct += 1;
        s.xp += xpValue(qid);
      }
    }
    return s;
  } catch { return null; }
}

function load() {
  try {
    const v2 = JSON.parse(localStorage.getItem(KEY_V2));
    if (v2 && typeof v2 === "object" && v2.answers) return { ...emptyState(), ...v2 };
  } catch { /* fall through */ }
  const migrated = migrateV1();
  if (migrated) { localStorage.setItem(KEY_V2, JSON.stringify(migrated)); return migrated; }
  return emptyState();
}

let cache = load();
const listeners = new Set();
function commit(next) {
  cache = next;
  localStorage.setItem(KEY_V2, JSON.stringify(cache));
  listeners.forEach((l) => l());
}

/* Record a graded check (ok) or a reveal (kind: "reveal"). */
export function record(qid, ok, kind = "check") {
  const prev = cache.answers[qid] || { tries: 0, status: "unseen" };
  const firstSolve = ok && prev.status !== "correct";
  const answers = {
    ...cache.answers,
    [qid]: {
      tries: prev.tries + 1,
      status: ok ? "correct" : prev.status === "correct" ? "correct" : "missed",
    },
  };
  const day = todayKey();
  const entry = {
    t: Date.now(),
    kind: kind === "reveal" ? "reveal" : ok ? "solve" : "miss",
    qid,
    ...(firstSolve ? { xp: xpValue(qid) } : {}),
  };
  commit({
    answers,
    xp: cache.xp + (firstSolve ? xpValue(qid) : 0),
    attempts: cache.attempts + 1,
    correct: cache.correct + (ok ? 1 : 0),
    days: { ...cache.days, [day]: (cache.days[day] || 0) + 1 },
    log: [entry, ...cache.log].slice(0, 40),
  });
}

export function resetProgress() { commit(emptyState()); }

/* Mark a lesson as read (idempotent — first read awards XP once). */
export function markLessonRead(id) {
  if (cache.lessons?.[id]) return;
  const day = todayKey();
  commit({
    ...cache,
    lessons: { ...(cache.lessons || {}), [id]: Date.now() },
    xp: cache.xp + 15,
    days: { ...cache.days, [day]: (cache.days[day] || 0) + 1 },
    log: [{ t: Date.now(), kind: "lesson", qid: id, xp: 15 }, ...cache.log].slice(0, 40),
  });
}

/* Record a module quiz attempt. Passing requires a perfect score; once
   passed, the module stays passed. XP is awarded only on the first pass. */
export function recordQuiz(moduleId, score, total) {
  const prev = cache.quizzes?.[moduleId];
  const nowPassed = score === total;
  const firstPass = nowPassed && !prev?.passed;
  const day = todayKey();
  commit({
    ...cache,
    quizzes: {
      ...(cache.quizzes || {}),
      [moduleId]: {
        passed: prev?.passed || nowPassed,
        best: Math.max(prev?.best || 0, score),
        attempts: (prev?.attempts || 0) + 1,
        t: Date.now(),
      },
    },
    xp: cache.xp + (firstPass ? 50 : 0),
    days: { ...cache.days, [day]: (cache.days[day] || 0) + 1 },
    log: firstPass
      ? [{ t: Date.now(), kind: "quiz", qid: moduleId, xp: 50 }, ...cache.log].slice(0, 40)
      : cache.log,
  });
}

/* Record a finished practice exam; keeps the best score. */
export function recordExam(score, total) {
  const day = todayKey();
  const prev = cache.examBest;
  const better = !prev || score > prev.score;
  commit({
    ...cache,
    examBest: better ? { score, total, t: Date.now() } : prev,
    xp: cache.xp + score * 3,
    days: { ...cache.days, [day]: (cache.days[day] || 0) + 1 },
    log: [{ t: Date.now(), kind: "exam", qid: `exam:${score}/${total}`, xp: score * 3 }, ...cache.log].slice(0, 40),
  });
}

export function statusOf(state, qid) {
  return (state.answers[qid] && state.answers[qid].status) || "unseen";
}

export function useProgress() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => cache,
  );
}
