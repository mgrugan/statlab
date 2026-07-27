# StatLab

**LeetCode, but for statistical computing.** A practice environment built around the
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

## What's inside

| Section | R | Python | SQL bonus |
|---|---|---|---|
| **Command Drills** — type the exact command, graded instantly | 67 | 67 | 10 |
| **Applied Problems** — real-world scenarios, concept-checked code | 58 | 58 | — |
| **Total per language** | **125** | **125** | 10 |

- **Command Drills** cover indexing, lists, the apply family, dplyr, tidyr, pandas,
  NumPy, regex, debugging (`traceback()`, `browser()`, `breakpoint()`), testing,
  simulation, PCA, ggplot2/matplotlib/seaborn visualization, and more — drawn from the flashcard set plus originals.
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
src/App.jsx                 sidebar shell + hash router (#/learn, #/practice, #/leaderboard)
src/pages/                  Dashboard, Learn, Practice, Leaderboard
src/components/shared.jsx   chips, code frames, bars, toolbar
src/components/ui/          shadcn/ui components (Radix-based)
src/data/drills.js          Learn question bank (144 questions)
src/data/applied.js         Practice question bank (116 questions)
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
