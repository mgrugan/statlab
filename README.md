# StatLab

**LeetCode, but for statistical computing.** A practice environment built around the
STA 350 flashcard material — drill the commands until they're reflex, then apply them
to problems that look like real analyst work. Every question tells you whether to
answer in **R** or **Python**, so you learn both side by side.

## Run it

No build step, no dependencies. Either:

- open `index.html` directly in a browser, or
- serve the folder: `python3 -m http.server 8000` → http://localhost:8000

## What's inside

| Section | R | Python | SQL bonus |
|---|---|---|---|
| **Command Drills** — type the exact command, graded instantly | 55 | 55 | 10 |
| **Applied Problems** — real-world scenarios, concept-checked code | 50 | 50 | — |
| **Total per language** | **105** | **105** | 10 |

- **Command Drills** cover indexing, lists, the apply family, dplyr, tidyr, pandas,
  NumPy, regex, debugging (`traceback()`, `browser()`, `breakpoint()`), testing,
  simulation, PCA, and more — drawn from the flashcard set plus originals.
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
index.html          app shell
css/style.css       implements the DESIGN.md token system
js/app.js           router, quiz engine, grading, progress
js/data/drills.js   Section 1 question bank
js/data/applied.js  Section 2 question bank
DESIGN.md           design tokens (Google design.md format, lints clean)
.mcp.json           shadcn MCP server config
```

The visual system (evergreen = R, burnt amber = Python, slate = SQL; Fraunces /
Space Grotesk / IBM Plex Mono on warm paper) is defined in `DESIGN.md` — validated
with `npx @google/design.md lint DESIGN.md`.
