/* StatLab — quiz engine (vanilla JS, no build step) */
(function () {
"use strict";

const $app = document.getElementById("app");
const STORE_KEY = "statlab-progress-v1";

/* ---------------- persistence ---------------- */

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
  catch { return {}; }
}
function saveProgress(p) { localStorage.setItem(STORE_KEY, JSON.stringify(p)); }
let progress = loadProgress();

function record(id, ok) {
  const cur = progress[id] || { tries: 0, status: "unseen" };
  cur.tries += 1;
  // once solved, stays solved; a miss only sticks if never solved
  if (ok) cur.status = "correct";
  else if (cur.status !== "correct") cur.status = "missed";
  progress[id] = cur;
  saveProgress(progress);
}
function statusOf(id) { return (progress[id] && progress[id].status) || "unseen"; }

/* ---------------- helpers ---------------- */

const LANG_META = {
  r:      { name: "R",      chip: "chip-r",   soft: "chip-soft-r" },
  python: { name: "Python", chip: "chip-py",  soft: "chip-soft-py" },
  sql:    { name: "SQL",    chip: "chip-sql", soft: "chip-soft-sql" },
};

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
/* markdown-lite: `code` and **bold** */
function md(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}
function diffDots(d) {
  return "<span class='diff'>" + "<b>●</b>".repeat(d) + "○".repeat(3 - d) +
         " " + ["", "intro", "core", "challenge"][d] + "</span>";
}
function chip(lang) {
  const m = LANG_META[lang];
  return `<span class="chip ${m.chip}">${m.name}</span>`;
}

/* Normalize typed code so trivial formatting differences don't fail a correct answer:
   strip all whitespace, unify quotes, drop trailing semicolon, straighten smart quotes. */
function normalize(input) {
  return input
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/'/g, '"')
    .replace(/\s+/g, "")
    .replace(/;+$/, "");
}

function checkDrill(q, input) {
  const n = normalize(input);
  return q.accept.some((re) => re.test(n));
}
function checkApplied(q, input) {
  const n = normalize(input);
  const missing = q.req.filter((r) => !r.re.test(n));
  return { ok: missing.length === 0, missing };
}

function counts(bank) {
  const c = { r: 0, python: 0, sql: 0 };
  bank.forEach((q) => c[q.lang]++);
  return c;
}

/* ---------------- section state ---------------- */

const sections = {
  drills:  { bank: window.DRILLS,  title: "Command Drills",
             blurb: "Flashcard-style reps for the commands themselves — type the exact call and get graded instantly. Whitespace and quote style don't matter; the command does.",
             filters: { lang: "all", topic: "all", diff: "all", status: "all" }, idx: 0 },
  applied: { bank: window.APPLIED, title: "Applied Problems",
             blurb: "Real-world scenarios — the kind of asks that land on an analyst's desk. Each problem tells you which language to answer in; grading checks that the key moves appear in your code.",
             filters: { lang: "all", topic: "all", diff: "all", status: "all" }, idx: 0 },
};

function filtered(sec) {
  const f = sec.filters;
  return sec.bank.filter((q) =>
    (f.lang === "all" || q.lang === f.lang) &&
    (f.topic === "all" || q.topic === f.topic) &&
    (f.diff === "all" || String(q.diff) === f.diff) &&
    (f.status === "all" || statusOf(q.id) === f.status));
}

/* ---------------- views ---------------- */

function homeView() {
  const dc = counts(window.DRILLS), ac = counts(window.APPLIED);
  const total = window.DRILLS.length + window.APPLIED.length;
  const done = Object.values(progress).filter((p) => p.status === "correct").length;
  $app.innerHTML = `
  <div class="hero">
    <h1>LeetCode, but for <em>statistical computing</em>.</h1>
    <p>Drill the commands until they're reflex, then apply them to problems that look like
       real work. Every question tells you whether to answer in R or Python — so you learn both,
       side by side, the way STA 350 tests them.</p>
  </div>
  <div class="section-cards">
    <a class="section-card" href="#/drills">
      <span class="kicker">Section 1</span>
      <h2>Command Drills</h2>
      <p>Fast reps on syntax and semantics: indexing, the apply family, dplyr, pandas, NumPy,
         debugging, regex — the flashcard set, playable.</p>
      <span class="counts">
        <span class="chip chip-soft-r">${dc.r} R</span>
        <span class="chip chip-soft-py">${dc.python} Python</span>
        <span class="chip chip-soft-sql">${dc.sql} SQL bonus</span>
      </span>
    </a>
    <a class="section-card" href="#/applied">
      <span class="kicker">Section 2</span>
      <h2>Applied Problems</h2>
      <p>A/B tests, bootstraps, regressions, pipelines, cleanup jobs — scenario first,
         code second, in whichever language the question demands.</p>
      <span class="counts">
        <span class="chip chip-soft-r">${ac.r} R</span>
        <span class="chip chip-soft-py">${ac.python} Python</span>
      </span>
    </a>
  </div>
  <div class="stat-strip">
    <div class="stat-tile"><div class="num">${total}</div><div class="lbl">questions</div></div>
    <div class="stat-tile"><div class="num">${dc.r + ac.r}</div><div class="lbl">in R</div></div>
    <div class="stat-tile"><div class="num">${dc.python + ac.python}</div><div class="lbl">in Python</div></div>
    <div class="stat-tile"><div class="num">${done}</div><div class="lbl">solved by you</div></div>
  </div>`;
}

function toolbarHTML(secName, sec, list) {
  const topics = [...new Set(sec.bank.map((q) => q.topic))].sort();
  const f = sec.filters;
  const langs = secName === "drills"
    ? [["all","All languages"],["r","R"],["python","Python"],["sql","SQL"]]
    : [["all","All languages"],["r","R"],["python","Python"]];
  const opt = (pairs, cur) => pairs.map(([v,l]) =>
    `<option value="${v}" ${v===cur?"selected":""}>${l}</option>`).join("");
  return `
  <div class="toolbar">
    <label>Filter</label>
    <select data-filter="lang">${opt(langs, f.lang)}</select>
    <select data-filter="topic">${opt([["all","All topics"], ...topics.map(t=>[t,t])], f.topic)}</select>
    <select data-filter="diff">${opt([["all","Any difficulty"],["1","● Intro"],["2","●● Core"],["3","●●● Challenge"]], f.diff)}</select>
    <select data-filter="status">${opt([["all","Any status"],["unseen","Unseen"],["correct","Solved"],["missed","Missed"]], f.status)}</select>
    <button class="btn btn-ghost" data-act="shuffle" title="Jump to a random question">Random</button>
    <span class="spacer"></span>
    <span class="pos">${list.length ? (sec.idx + 1) + " / " + list.length : "0 questions"}</span>
  </div>`;
}

function emptyHTML() {
  return `<div class="empty"><h3>Nothing matches these filters</h3>
    <p>Loosen a filter above — or you've genuinely solved everything here. Respect.</p></div>`;
}

function drillsView() {
  const sec = sections.drills;
  const list = filtered(sec);
  if (sec.idx >= list.length) sec.idx = 0;
  const q = list[sec.idx];
  $app.innerHTML = `
  <div class="page-head"><h1>Command Drills</h1><p>${sec.blurb}</p></div>
  ${toolbarHTML("drills", sec, list)}
  ${!q ? emptyHTML() : `
  <div class="qcard" data-qid="${q.id}">
    <div class="qmeta">
      ${chip(q.lang)}
      <span class="chip chip-topic">${q.topic}</span>
      ${diffDots(q.diff)}
      ${statusOf(q.id)==="correct" ? '<span class="chip chip-soft-r">✓ solved</span>' : ""}
    </div>
    <p class="qprompt">${md(q.q)}</p>
    <div class="answer-wrap">
      <label class="answer-label" for="ans">Your answer — ${LANG_META[q.lang].name}</label>
      <input id="ans" class="code-input" type="text" autocomplete="off" spellcheck="false"
             placeholder="type the command…">
    </div>
    <div class="btn-row">
      <button class="btn btn-primary" data-act="check">Check</button>
      <button class="btn btn-ghost" data-act="reveal">Reveal</button>
      <button class="btn btn-ghost" data-act="next">Next →</button>
      <span class="kbd-hint"><kbd>Enter</kbd> to check</span>
    </div>
    <div id="feedback"></div>
    <div id="solution"></div>
  </div>`}`;
  wireCommon("drills", list);
  if (!q) return;
  const $ans = document.getElementById("ans");
  $ans.focus();
  $ans.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); doCheck(); }
  });

  function doCheck() {
    const val = $ans.value.trim();
    if (!val) return;
    const ok = checkDrill(q, val);
    record(q.id, ok);
    document.getElementById("feedback").innerHTML = ok
      ? `<div class="feedback ok"><div class="verdict">✓ Correct</div></div>`
      : `<div class="feedback bad"><div class="verdict">✗ Not quite — tweak it and check again, or reveal.</div></div>`;
    if (ok) showSolution();
  }
  function showSolution() {
    document.getElementById("solution").innerHTML = `
      <div class="solution">
        <span class="answer-label">Answer</span>
        <pre>${esc(q.a)}</pre>
        <p class="explain">${md(q.exp)}</p>
      </div>`;
  }
  $app.querySelector('[data-act="check"]').addEventListener("click", doCheck);
  $app.querySelector('[data-act="reveal"]').addEventListener("click", () => {
    record(q.id, false);
    showSolution();
  });
}

function appliedView() {
  const sec = sections.applied;
  const list = filtered(sec);
  if (sec.idx >= list.length) sec.idx = 0;
  const q = list[sec.idx];
  $app.innerHTML = `
  <div class="page-head"><h1>Applied Problems</h1><p>${sec.blurb}</p></div>
  ${toolbarHTML("applied", sec, list)}
  ${!q ? emptyHTML() : `
  <div class="qcard" data-qid="${q.id}">
    <div class="qmeta">
      ${chip(q.lang)}
      <span class="chip chip-topic">${q.topic}</span>
      ${diffDots(q.diff)}
      ${statusOf(q.id)==="correct" ? '<span class="chip chip-soft-r">✓ solved</span>' : ""}
    </div>
    <h2 class="qtitle">${esc(q.title)}</h2>
    <p class="scenario">${md(q.scenario)}</p>
    <p class="qtask"><strong>Task (answer in ${LANG_META[q.lang].name}):</strong> ${md(q.task)}</p>
    <div class="answer-wrap">
      <label class="answer-label" for="ans">Your ${LANG_META[q.lang].name} code</label>
      <textarea id="ans" class="code-input" spellcheck="false"
        placeholder="# write your solution here…"></textarea>
    </div>
    <div class="btn-row">
      <button class="btn btn-primary" data-act="check">Check</button>
      <button class="btn btn-ghost" data-act="hint">Hint</button>
      <button class="btn btn-ghost" data-act="reveal">Reveal solution</button>
      <button class="btn btn-ghost" data-act="next">Next →</button>
      <span class="kbd-hint"><kbd>Ctrl</kbd>+<kbd>Enter</kbd> to check</span>
    </div>
    <div id="feedback"></div>
    <div id="solution"></div>
  </div>`}`;
  wireCommon("applied", list);
  if (!q) return;
  const $ans = document.getElementById("ans");
  $ans.focus();
  $ans.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); doCheck(); }
  });
  let hintN = 0;

  function doCheck() {
    const val = $ans.value.trim();
    if (!val) return;
    const res = checkApplied(q, val);
    record(q.id, res.ok);
    document.getElementById("feedback").innerHTML = res.ok
      ? `<div class="feedback ok"><div class="verdict">✓ Correct — all the key moves are there.</div></div>`
      : `<div class="feedback bad"><div class="verdict">✗ Missing ${res.missing.length} key concept${res.missing.length>1?"s":""}:</div>
         <ul>${res.missing.map((m) => `<li>${esc(m.hint)}</li>`).join("")}</ul></div>`;
    if (res.ok) showSolution();
  }
  function showSolution() {
    document.getElementById("solution").innerHTML = `
      <div class="solution">
        <span class="answer-label">Model solution</span>
        <pre>${esc(q.sol)}</pre>
        <p class="explain">${md(q.exp)}</p>
      </div>`;
  }
  $app.querySelector('[data-act="check"]').addEventListener("click", doCheck);
  $app.querySelector('[data-act="hint"]').addEventListener("click", () => {
    const h = q.req[Math.min(hintN, q.req.length - 1)].hint;
    hintN++;
    document.getElementById("feedback").innerHTML =
      `<div class="feedback ok"><div class="verdict">Hint ${Math.min(hintN, q.req.length)} of ${q.req.length}</div>
       <ul><li>${esc(h)}</li></ul></div>`;
  });
  $app.querySelector('[data-act="reveal"]').addEventListener("click", () => {
    record(q.id, false);
    showSolution();
  });
}

/* filters, next, shuffle — shared by both quiz views */
function wireCommon(secName, list) {
  const sec = sections[secName];
  $app.querySelectorAll("[data-filter]").forEach(($s) => {
    $s.addEventListener("change", () => {
      sec.filters[$s.dataset.filter] = $s.value;
      sec.idx = 0;
      render();
    });
  });
  const $next = $app.querySelector('[data-act="next"]');
  if ($next) $next.addEventListener("click", () => {
    sec.idx = (sec.idx + 1) % list.length;
    render();
  });
  const $shuf = $app.querySelector('[data-act="shuffle"]');
  if ($shuf) $shuf.addEventListener("click", () => {
    if (list.length > 1) {
      let n; do { n = Math.floor(Math.random() * list.length); } while (n === sec.idx);
      sec.idx = n;
    }
    render();
  });
}

function progressView() {
  const banks = [
    ["Command Drills", window.DRILLS],
    ["Applied Problems", window.APPLIED],
  ];
  const cards = [];
  banks.forEach(([name, bank]) => {
    ["r", "python", "sql"].forEach((lang) => {
      const qs = bank.filter((q) => q.lang === lang);
      if (!qs.length) return;
      const solved = qs.filter((q) => statusOf(q.id) === "correct").length;
      const missed = qs.filter((q) => statusOf(q.id) === "missed").length;
      const pct = Math.round((solved / qs.length) * 100);
      const barClass = lang === "python" ? "py" : lang === "sql" ? "sql" : "";
      cards.push(`
      <div class="prog-card">
        <h3>${LANG_META[lang].name}</h3>
        <div class="sub">${name}</div>
        <div class="bar ${barClass}"><i style="width:${pct}%"></i></div>
        <div class="prog-nums"><span>${solved} solved · ${missed} missed</span><span>${pct}%</span></div>
      </div>`);
    });
  });
  const attempts = Object.values(progress).reduce((s, p) => s + p.tries, 0);
  $app.innerHTML = `
  <div class="page-head"><h1>Progress</h1>
    <p>Solved sticks once you get a question right; “missed” marks questions you revealed or
       got wrong and haven't cracked yet. Use the <em>Missed</em> filter in each section to grind them down.</p>
  </div>
  <div class="prog-grid">${cards.join("")}</div>
  <div class="stat-strip" style="margin-top:24px">
    <div class="stat-tile"><div class="num">${attempts}</div><div class="lbl">total attempts</div></div>
    <div class="stat-tile"><div class="num">${Object.values(progress).filter(p=>p.status==="correct").length}</div><div class="lbl">solved</div></div>
    <div class="stat-tile"><div class="num">${Object.values(progress).filter(p=>p.status==="missed").length}</div><div class="lbl">to review</div></div>
  </div>
  <div class="danger-zone">
    <button class="btn-quiet" data-act="reset">Reset all progress</button>
  </div>`;
  $app.querySelector('[data-act="reset"]').addEventListener("click", () => {
    if (confirm("Wipe all StatLab progress? This can't be undone.")) {
      progress = {};
      saveProgress(progress);
      render();
    }
  });
}

/* ---------------- router ---------------- */

function render() {
  const route = (location.hash || "#/").replace(/^#\//, "");
  document.querySelectorAll(".nav a").forEach((a) =>
    a.classList.toggle("active", a.dataset.nav === route));
  if (route === "drills") drillsView();
  else if (route === "applied") appliedView();
  else if (route === "progress") progressView();
  else homeView();
  window.scrollTo({ top: 0 });
}

window.addEventListener("hashchange", render);
render();
})();
