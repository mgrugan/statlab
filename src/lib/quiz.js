/* Grading + shared question helpers (ported unchanged from the vanilla app) */

export const LANG_META = {
  r:      { name: "R",      soft: "bg-blue-tint text-blue",           solid: "bg-blue text-white" },
  python: { name: "Python", soft: "bg-emerald-soft text-emerald-deep", solid: "bg-emerald text-white" },
  sql:    { name: "SQL",    soft: "bg-muted text-slate-deep",          solid: "bg-slate-deep text-white" },
};

export const DIFF_LABEL = ["", "intro", "core", "challenge"];

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* markdown-lite: `code` and **bold** — content is authored in-repo, then escaped */
export function mdlite(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

/* Normalize typed code so trivial formatting differences don't fail a correct
   answer: strip whitespace, unify quotes, drop trailing semicolon. */
export function normalize(input) {
  return input
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/'/g, '"')
    .replace(/\s+/g, "")
    .replace(/;+$/, "");
}

export function checkDrill(q, input) {
  const n = normalize(input);
  return q.accept.some((re) => re.test(n));
}

export function checkApplied(q, input) {
  const n = normalize(input);
  const missing = q.req.filter((r) => !r.re.test(n));
  return { ok: missing.length === 0, missing };
}

export function langCounts(bank) {
  const c = { r: 0, python: 0, sql: 0 };
  bank.forEach((q) => c[q.lang]++);
  return c;
}
