import { useSyncExternalStore } from "react";

/* localStorage-backed progress store, shared across pages via a tiny
   external store so every view re-renders when an answer is recorded.
   Same storage key + shape as the v1 vanilla app, so progress carries over. */

const STORE_KEY = "statlab-progress-v1";

let cache = load();
const listeners = new Set();

function load() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
  catch { return {}; }
}

function emit() {
  listeners.forEach((l) => l());
}

export function record(id, ok) {
  const cur = cache[id] || { tries: 0, status: "unseen" };
  const next = {
    tries: cur.tries + 1,
    // once solved, stays solved; a miss only sticks if never solved
    status: ok ? "correct" : cur.status === "correct" ? "correct" : "missed",
  };
  cache = { ...cache, [id]: next };
  localStorage.setItem(STORE_KEY, JSON.stringify(cache));
  emit();
}

export function resetProgress() {
  cache = {};
  localStorage.setItem(STORE_KEY, JSON.stringify(cache));
  emit();
}

export function statusOf(progress, id) {
  return (progress[id] && progress[id].status) || "unseen";
}

export function useProgress() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => cache,
  );
}
