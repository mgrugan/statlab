# StatLab

**LeetCode, but for statistical computing — plus a full Statistical Methods in
Finance midterm-prep course.** A practice environment built around the
STA 350 flashcard material — drill the commands until they're reflex, then apply them
to problems that look like real analyst work. Every question tells you whether to
answer in **R** or **Python**, so you learn both side by side.

Built with **React 19 + Vite + Tailwind CSS v4 + shadcn/ui**, styled after the
**StatCode** design system generated in Stitch (`design/stitch/`): sidebar app
shell, Inter + JetBrains Mono, deep-slate/intelligence-blue/emerald palette,
tonal layers over shadows. Includes full gamification — XP with ranks, daily
streaks, badges, skill mastery, a challenge of the day, and a (local, simulated)
leaderboard.

## Run it

```bash
npm install
npm run dev        # dev server
npm run build      # production build → dist/
npm run preview    # preview the production build
```

Deploys to GitHub Pages automatically on push via `.github/workflows/pages.yml`
(builds with Vite, publishes `dist/`).

## Midterm One prep (Statistical Methods in Finance)

The **Study** section is an 18-module interactive course built from Lectures
1–7 (Parts 1–5) of the course notes. Every lesson pairs four things:

- **Intuition** — what the result actually means, in plain English
- **The math** — full statements and step-by-step derivations rendered with KaTeX
  (the lognormal pricing claim is derived in full, including completing the square)
- **Code** — the Python you should be able to reproduce unaided
- **Exam traps** — the confusions that cost points, plus inline self-checks

| Module set | Lessons | Covers |
|---|---|---|
| Statistical Finance | 11 | payoffs & Jensen · lognormal + the pricing claim · Brownian motion & GBM · log returns · KDE & bias-variance · QQ plots, skew/kurtosis, JB & Shapiro-Wilk · stationarity & ACVF · ADF, ACF, Ljung-Box · volatility & clustering · ARCH/GARCH & AIC · Black-Scholes, moneyness, leverage effect |
| pandas Tutorial | 7 | Series/DataFrame · import & export · describing data · `.loc`/`.iloc`/boolean masks · missing data & manipulation · groupby/crosstab/plotting · **pandas for this course** (diff, rolling vol, resample) |

The **Exam** section is a 33-question, 75-minute practice midterm in the real
paper's format (3 points each, one correct response). The questions are
**original** — written to match the 2025 midterm's topic distribution
(Part 1: 8, Part 2: 7, Part 3: 9, Part 4: 6, Part 5: 3), phrasing style and
difficulty rather than reproduce it. Answers are balanced across a/b/c/d, the
timer auto-submits, and every question links back to the module that covers it.

## What's inside

| Section | R | Python | SQL bonus |
|---|---|---|---|
| **Command Drills** — type the exact command, graded instantly | 67 | 95 | 10 |
| **Applied Problems** — real-world scenarios, concept-checked code | 58 | 72 | — |
| **Total per language** | **125** | **167** | 10 |

- **Command Drills** cover indexing, lists, the apply family, dplyr, tidyr, pandas,
  NumPy, regex, debugging (`traceback()`, `browser()`, `breakpoint()`), testing,
  simulation, PCA, ggplot2/matplotlib/seaborn visualization, and the full
  finance stack (yfinance, adfuller, plot_acf, arch_model, KDE, QQ plots) — drawn from the flashcard set plus originals.
- **Applied Problems** frame the same tools as work: A/B tests, bootstrap CIs,
  regressions, permutation tests, Monte Carlo integration, joins, pivots, cleaning
  jobs, power simulations.
- Filters by language / topic / difficulty / status, hints, model solutions with
  explanations, and localStorage progress tracking (use the *Missed* filter to grind
  down what you got wrong).

Grading is format-forgiving — whitespace, quote style, and `<-` vs `=` don't fail a
correct answer. Applied problems are graded by checking that the key statistical
moves appear in your code, with per-concept hints when something's missing.

## Structure

```
index.html                  Vite entry (fonts, favicon)
src/main.jsx                React bootstrap
src/App.jsx                 sidebar shell + hash router
src/pages/                  Dashboard, Study, Lesson, Exam, Learn, Practice, Leaderboard
src/components/Math.jsx     KaTeX rendering + markdown-lite for lesson prose
src/data/finance/           lesson modules, pandas module, practice midterm
src/components/shared.jsx   chips, code frames, bars, toolbar
src/components/ui/          shadcn/ui components (Radix-based)
src/data/drills.js          Learn question bank (172 questions)
src/data/applied.js         Practice question bank (130 questions)
src/lib/quiz.js             normalization + grading logic
src/lib/progress.js         localStorage store: answers, XP, streak days, activity
src/lib/stats.js            ranks, badges, mastery, challenge of the day, leaderboard
src/index.css               Tailwind v4 theme implementing DESIGN.md tokens
DESIGN.md                   design tokens (Google design.md format, lints clean)
design/stitch/              Stitch mocks + source design system
.mcp.json                   shadcn MCP server config
```

Language coding follows the Stitch mocks: blue = R, emerald = Python, slate = SQL.
`DESIGN.md` (Google design.md format, validated with
`npx @google/design.md lint DESIGN.md`) is wired into Tailwind + the shadcn theme
variables in `src/index.css`.
