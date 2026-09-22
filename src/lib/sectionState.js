import { useState } from "react";
import { groupOf } from "@/lib/quiz";

/* Per-section filter/position state that survives route changes
   (module-level cache; state itself lives in the mounted page). */

const cache = {
  drills:  { filters: { group: "all", lang: "all", topic: "all", diff: "all", status: "all" }, idx: 0 },
  applied: { filters: { group: "all", lang: "all", topic: "all", diff: "all", status: "all" }, idx: 0 },
};

export function useSectionState(name) {
  const [state, setState] = useState(cache[name]);
  const update = (patch) => {
    cache[name] = { ...cache[name], ...patch };
    setState(cache[name]);
  };
  return [state, update];
}

export function applyFilters(bank, filters, progressStatus) {
  return bank.filter((q) =>
    (filters.group === "all" || groupOf(q.topic) === filters.group) &&
    (filters.lang === "all" || q.lang === filters.lang) &&
    (filters.topic === "all" || q.topic === filters.topic) &&
    (filters.diff === "all" || String(q.diff) === filters.diff) &&
    (filters.status === "all" || progressStatus(q.id) === filters.status));
}

/* how many questions sit in each topic group — drives the chip counts */
export function groupCounts(bank) {
  const c = {};
  bank.forEach((q) => { const g = groupOf(q.topic); c[g] = (c[g] || 0) + 1; });
  return c;
}
