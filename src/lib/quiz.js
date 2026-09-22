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

/* ---------------------------------------------------------------
   Topic groups. The raw topic list runs to ~60 entries, which makes a
   flat dropdown useless — so topics are bucketed, and the UI offers the
   buckets as one-click chips with the dropdown narrowed to the bucket.
   `test` is checked in order; first match wins.
   --------------------------------------------------------------- */
export const TOPIC_GROUPS = [
  { id: "finance", label: "Stat Finance", note: "this class" },
  { id: "wrangle", label: "Data Wrangling",
    test: /dplyr|pandas|reshap|join|merg|select|sort|group|transform|clean|missing|i\/o|date|combin|inspect|frame|explor|factor|row-wise|summary statistics|pipelines/i },
  { id: "stats", label: "Statistics",
    test: /hypothesis|regression|anova|correlation|pca|bootstrap|permutation|monte|simulation|statistics|time series|numerical|machine learning/i },
  { id: "prog", label: "Programming",
    test: /core|function|apply|vector|list|index|string|regex|debug|test|error|numpy|import|setup/i },
  { id: "viz", label: "Visualization",
    test: /visual|plotting/i },
  { id: "sql", label: "SQL",
    test: /^sql$/i },
];

export function groupOf(topic) {
  if (/^Finance:/i.test(topic)) return "finance";
  // check the most specific buckets first
  for (const id of ["sql", "viz", "stats", "wrangle", "prog"]) {
    const g = TOPIC_GROUPS.find((x) => x.id === id);
    if (g?.test?.test(topic)) return id;
  }
  return "prog";
}

/* topics present in a bank, bucketed by group and sorted */
export function groupedTopics(bank) {
  const out = {};
  bank.forEach((q) => {
    const g = groupOf(q.topic);
    (out[g] = out[g] || new Set()).add(q.topic);
  });
  return Object.fromEntries(
    Object.entries(out).map(([g, set]) => [g, [...set].sort()]),
  );
}
