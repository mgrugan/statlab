/* f8 — Unit Root Tests, the ACF, and Ljung-Box (full lecture) */

import { PALETTE as P, linspace, ar1, garch, acf, clamp01, easeOut, lerp } from "@/lib/anim";
import { compile, title, jargon, points, formula, plot, code, recap, revealed } from "@/lib/scenes";

const D = (() => {
  const n = 900;
  const g = garch({ omega: 8e-6, alpha: 0.08, beta: 0.91, n, seed: 37 });
  const prices = [];
  g.x.reduce((a, v) => { const p = a * Math.exp(v); prices.push(p); return p; }, 100);
  const rev = ar1({ phi: 0.86, mu: 0, sd: 1, n: 300, seed: 21 });
  const walk = ar1({ phi: 1, mu: 0, sd: 1, n: 300, seed: 21 });
  return {
    x: g.x, prices, rev, walk,
    acfX: acf(g.x, 20), acfSq: acf(g.x.map((v) => v * v), 20),
    acfRev: acf(rev, 20), acfWalk: acf(walk, 20),
    band: 1.96 / Math.sqrt(n), bandS: 1.96 / Math.sqrt(300),
  };
})();

export default compile({
  id: "f8",
  title: "Unit Root Tests, the ACF, and Ljung-Box",
  blurb: "Three tests that get confused constantly — because two of them read backwards. Sorted out once, plus the plot that motivates the whole second half of the course.",
  takeaway: "A small p-value always means *reject the null*. So before interpreting anything, say what the null **was**. For ADF it is the pessimistic case; for Ljung-Box and Jarque-Bera it is the comfortable one.",
  data: D,
  scenes: [

    /* ---------- 1. vocabulary ---------- */
    title({ n: 1, title: "Testing what you assumed", tone: "slate", chapter: "Two words first",
      sub: "Module 7 told you what stationarity is. Now: how do you check?",
      say: "Chapter one. Testing what you assumed. Module seven told you what stationarity is. This module answers the obvious next question: how do you actually check for it?", dur: 12 }),

    jargon({ dur: 26, term: "Unit root", chapter: "Two words first",
      plain: "The case $\\phi=1$ — where shocks **never decay**. The series wanders forever with no home to return to.",
      formal: "Called a *unit root* because the AR polynomial's root sits exactly at one. A series with a unit root is **not stationary**: its variance grows without bound.",
      say: "A unit root is the case where phi equals one — where shocks never decay at all, and the series wanders forever with no home to return to. It's called a unit root because the autoregressive polynomial's root sits exactly at one. And the key consequence: a series with a unit root is not stationary, because its variance grows without bound as time goes on." }),

    plot({ dur: 28,
      caption: "The difference, drawn from the **same shocks**. At $\\phi=0.86$ the series keeps coming home. At $\\phi=1$ it does not — and that is what a unit root test has to detect.",
      say: "Here's the difference, drawn from the same shocks so the comparison is honest. At phi equal to nought point eight six the series keeps coming home to its mean. At phi equal to one it doesn't. And notice how similar they look over short stretches — that's precisely the difficulty. Over two hundred observations, a phi of nought point nine five and a phi of exactly one are genuinely hard to tell apart. That's what a unit root test has to do.",
      note: "same shocks · $\\phi=0.86$ vs $\\phi=1$",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 300], y: [-26, 26], W, H, pad: { l: 56, r: 22, t: 54, b: 38 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 150, 300], ys: [-20, 0, 20] });
        a.hline(0, { color: P.amber, width: 1.4, dash: [6, 4] });
        const n = Math.max(2, revealed(t, dur, 300, { start: 0.02, end: 0.8 }));
        a.line(data.rev.slice(0, n).map((v, i) => [i, v]), { color: P.emerald, width: 2 });
        a.line(data.walk.slice(0, n).map((v, i) => [i, v]), { color: P.red, width: 2 });
        a.note("φ = 0.86  stationary", a.L + 10, a.T + 18, { color: P.emerald, size: 11.5, weight: 700 });
        a.note("φ = 1  unit root", a.L + 10, a.T + 38, { color: P.red, size: 11.5, weight: 700 });
      } }),

    /* ---------- 2. Dickey-Fuller ---------- */
    title({ n: 2, title: "The Dickey-Fuller test", tone: "blue", chapter: "Dickey-Fuller",
      sub: "And why its hypotheses look backwards.",
      say: "Chapter two. The Dickey Fuller test — and why its hypotheses look backwards compared to every other test you have met.", dur: 10 }),

    formula({ dur: 28, chapter: "Dickey-Fuller",
      heading: "Fit $Y_t=\\phi Y_{t-1}+\\epsilon_t$ and ask whether $\\phi=1$",
      tex: "H_0:\\ \\phi=1\\ \\ (\\text{unit root, \\textbf{not} stationary})\\qquad H_1:\\ |\\phi|<1\\ \\ (\\text{stationary})",
      notes: [
        "The **null** is the case you probably **do not** want. That is the whole source of confusion.",
        "So a **small p-value is good news**: it rejects the unit root and supports stationarity.",
        "Why this way round? Because tests are built to find evidence **for** $H_1$ — and we want evidence *for* stationarity, so stationarity must be the alternative.",
      ],
      say: "Dickey Fuller fits the simple autoregression and asks whether phi equals one. The null hypothesis is a unit root — not stationary. The alternative is stationarity. So the null is the case you probably do not want, and that is the entire source of confusion. It means a small p-value is good news here: it rejects the unit root and supports stationarity. Why arrange it this way? Because hypothesis tests are built to find evidence for the alternative. We want evidence for stationarity, so stationarity has to be the alternative." }),

    formula({ dur: 26,
      heading: "Augmented Dickey-Fuller — the version you actually run",
      tex: "\\Delta Y_t=\\alpha+\\beta t+\\gamma Y_{t-1}+\\sum_{i=1}^{p}\\delta_i\\,\\Delta Y_{t-i}+\\epsilon_t,\\qquad H_0:\\ \\gamma=0",
      notes: [
        "“Augmented” = extra lagged **differences** $\\Delta Y_{t-i}$, which mop up short-run autocorrelation so it is not mistaken for a unit root.",
        "$\\alpha$ allows a constant level and $\\beta t$ allows a deterministic trend.",
        "$\\gamma=0$ is the unit root, because $\\gamma=\\phi-1$. Same test, more robust regression.",
      ],
      say: "In practice you run the augmented version. Augmented means extra lagged differences are added to the regression, and their job is to mop up short run autocorrelation so it doesn't get mistaken for a unit root. Alpha allows a constant level, and beta t allows a deterministic trend. The null is now gamma equals zero, which is the unit root, because gamma is just phi minus one. It's the same test, run through a more robust regression." }),

    code({ dur: 22, heading: "Running it", file: "adf.py",
      body: `from statsmodels.tsa.stattools import adfuller

stat, pvalue, lags, nobs, crit, icbest = adfuller(series)

print(pvalue)
# small p  ->  reject the unit root  ->  evidence FOR stationarity`,
      say: "In Python it's statsmodels adfuller. It returns a tuple, and the second element is the p-value — that's the one you want. And keep the comment in mind: small p means reject the unit root, which is evidence for stationarity." }),

    points({ dur: 30, heading: "Reading the result, in the only two phrasings allowed", tone: "amber",
      items: [
        "$p=0.011$ → reject $H_0$ → **strong evidence the series is stationary**.",
        "$p=0.32$ → fail to reject → **we found no evidence that the series is stationary**.",
        "$p=0.32$ does **not** mean the series has a unit root. Failing to reject a null never establishes it.",
        "And “strong evidence the series is **not** stationary” is the direction error the exam is hunting for.",
      ],
      say: "Reading the result, in the only two phrasings you're allowed. A p-value of nought point oh one one: reject the null, so you have strong evidence the series is stationary. A p-value of nought point three two: fail to reject, so you found no evidence that the series is stationary. And here's the trap — that second case does not mean the series has a unit root. Failing to reject a null never establishes it. Saying strong evidence the series is not stationary is precisely the direction error the exam is hunting for." }),

    points({ dur: 26, heading: "The headline empirical result", tone: "emerald",
      items: [
        "Run ADF on a **price** series and you typically **fail to reject**: prices look like they have a unit root. They wander.",
        "Run it on **log returns** and you reject decisively: returns are stationary.",
        "This is exactly what GBM predicted. Prices are non-stationary; their **log differences** are the well-behaved object.",
        "It is also why every model from here on is fitted to returns, never to prices.",
      ],
      say: "And here's the headline empirical result. Run the ADF test on a price series and you typically fail to reject — prices look like they have a unit root. They wander. Run it on log returns and you reject decisively: returns are stationary. This is exactly what geometric Brownian motion predicted. Prices are non stationary, and their log differences are the well behaved object. It's also precisely why every model from here on is fitted to returns and never to prices." }),

    /* ---------- 3. the ACF ---------- */
    title({ n: 3, title: "The ACF", tone: "blue", chapter: "The ACF",
      sub: "A picture of a series' memory, at every lag at once.",
      say: "Chapter three. The autocorrelation function — a picture of a series' memory, at every lag at once.", dur: 9 }),

    formula({ dur: 24, chapter: "The ACF",
      heading: "Autocovariance, normalized so it is comparable",
      tex: "\\rho_X(h)=\\frac{\\gamma_X(h)}{\\gamma_X(0)},\\qquad -1\\le\\rho_X(h)\\le1",
      notes: [
        "$\\gamma_X(0)$ is just the variance, so this divides out the scale.",
        "$\\rho_X(0)=1$ always — a series is perfectly correlated with itself at lag zero, which is why plots start at lag 1.",
        "The shaded band on a plot is roughly $\\pm1.96/\\sqrt{n}$: inside it, a bar is **not** significantly different from zero.",
      ],
      say: "The autocorrelation function is just the autocovariance normalized by the variance, so the scale divides out and the values always sit between minus one and one. Rho at lag zero is always one — a series is perfectly correlated with itself at zero lag, which is why ACF plots usually start at lag one. And that shaded band you see on a plot is approximately plus or minus one point nine six over root n. Inside it, a bar is not significantly different from zero." }),

    plot({ dur: 30,
      caption: "Three series, three signatures. **Stationary AR**: decays geometrically. **Unit root**: decays barely at all. **White noise**: nothing outside the band.",
      say: "Three series give three completely different signatures, and learning to recognize them is most of the skill. A stationary autoregression decays geometrically — bars shrinking by a constant factor. A unit root series decays barely at all; the bars stay high for many lags, which is itself a strong visual hint of non stationarity. And white noise has nothing outside the band at all. That third picture is what a well specified model's residuals should look like.",
      note: "geometric decay · near-flat · nothing at all",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 21], y: [-0.3, 1.05], W, H, pad: { l: 56, r: 22, t: 54, b: 38 } });
        a.grid(6, 4).frame();
        a.ticks({ xs: [1, 5, 10, 15, 20], ys: [0, 0.5, 1], yfmt: (v) => v.toFixed(1) });
        a.band(-data.bandS, data.bandS, { color: "rgba(33,112,228,0.12)" });
        a.hline(0, { color: P.grid, dash: null });
        const n = revealed(t, dur, 20, { start: 0.05, end: 0.55 });
        a.bars(data.acfWalk.slice(0, n).map((v, i) => [i + 0.78, v]), { color: P.red, width: 5 });
        a.bars(data.acfRev.slice(0, n).map((v, i) => [i + 1.22, v]), { color: P.emerald, width: 5 });
        if (t > dur * 0.55) a.bars(data.acfX.slice(0, n).map((v, i) => [i + 1, v]), { color: P.blue, width: 3 });
        a.note("unit root", a.R - 10, a.T + 18, { color: P.red, size: 11.5, weight: 700, align: "right" });
        a.note("stationary AR", a.R - 10, a.T + 38, { color: P.emerald, size: 11.5, weight: 700, align: "right" });
        if (t > dur * 0.55) a.note("white noise", a.R - 10, a.T + 58, { color: P.blue, size: 11.5, weight: 700, align: "right" });
      } }),

    /* ---------- 4. Ljung-Box ---------- */
    title({ n: 4, title: "Ljung-Box", tone: "emerald", chapter: "Ljung-Box",
      sub: "Testing a whole ACF at once, instead of eyeballing bars.",
      say: "Chapter four. Ljung Box — a way of testing a whole autocorrelation function at once, instead of eyeballing individual bars.", dur: 10 }),

    formula({ dur: 28, chapter: "Ljung-Box", tone: "emerald",
      heading: "A portmanteau test — it pools many lags into one statistic",
      tex: "H_0:\\ \\rho_X(h)=0\\ \\text{ for \\textbf{all} }h=1,\\dots,H \\qquad H_1:\\ \\rho_X(h)\\ne0\\ \\text{ for \\textbf{at least one} }h",
      notes: [
        "The null is **no autocorrelation anywhere** in the first $H$ lags.",
        "Small p-value → autocorrelation exists **somewhere** in that range — but the test will not tell you **which** lag. For that, read the ACF plot.",
        "You choose $H$. Common choices are 10 and 20, and it is normal to report several.",
        "Checking 20 bars by eye means ~1 will breach the band by chance. Pooling them avoids that trap.",
      ],
      say: "Ljung Box is a portmanteau test — it pools many lags into a single statistic. The null is no autocorrelation anywhere in the first H lags. So a small p-value tells you autocorrelation exists somewhere in that range, but it won't tell you which lag; for that you go back to the ACF plot. You choose H yourself, and ten and twenty are common choices. And here's why pooling matters: if you eyeball twenty bars at the five percent level, you'd expect about one to breach the band purely by chance. The pooled test avoids that trap." }),

    code({ dur: 20, heading: "Running Ljung-Box", file: "lb.py",
      body: `from statsmodels.stats.diagnostic import acorr_ljungbox

# several H at once
acorr_ljungbox(ldr,          lags=[10, 20])   # returns
acorr_ljungbox(ldr ** 2,     lags=[10, 20])   # squared returns`,
      say: "In statsmodels the function is acorr underscore ljungbox, and the lags argument takes several values of H at once. Note the two calls: one on the returns, one on the squared returns. Those two questions have very different answers, and that's the next chapter." }),

    /* ---------- 5. which test, which question ---------- */
    title({ n: 5, title: "Which test answers which question", tone: "amber", chapter: "Sorting the tests out",
      sub: "Three nulls. Two of them read backwards.",
      say: "Chapter five. Which test answers which question. Three nulls, and two of them read backwards. Let's sort them out once and for all.", dur: 11 }),

    points({ dur: 30, heading: "Say what the null was, *then* interpret", chapter: "Sorting the tests out", tone: "amber",
      items: [
        "**ADF** — $H_0$: unit root. Small p → **stationary**. The null is the *pessimistic* case.",
        "**Ljung-Box** — $H_0$: no autocorrelation. Small p → **autocorrelation exists**. The null is the comfortable case.",
        "**Jarque-Bera** — $H_0$: normal. Small p → **not normal**. The null is the comfortable case.",
        "One rule covers all three: **a small p-value always means reject the null.** So always name the null first.",
      ],
      say: "Here's the sorting. ADF: the null is a unit root, so a small p-value means stationary — the null is the pessimistic case. Ljung Box: the null is no autocorrelation, so a small p-value means autocorrelation exists — here the null is the comfortable case. Jarque Bera: the null is normality, so a small p-value means not normal — again the comfortable case. And one rule covers all three. A small p-value always means reject the null. So before you interpret anything, name the null first." }),

    plot({ dur: 32,
      caption: "Now the payoff. **Same series, two tests.** Ljung-Box on the returns: nothing. Ljung-Box on the **squared** returns: overwhelming. That contrast is the entire motivation for Part 4.",
      say: "And now the payoff, which is the most important picture in this module. Same series, two tests. Run the autocorrelation function on the returns themselves and every bar sits inside the band — no linear predictability, markets look efficient. Now square every value, so the sign disappears and only magnitude survives. Run it again. The bars are far outside the band, decaying slowly across twenty lags. You cannot predict direction. You can absolutely predict turbulence. That contrast is the entire motivation for Part four of this course.",
      note: "returns: nothing · squared returns: overwhelming",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const half = W / 2;
        const k = clamp01(t / (dur * 0.35));
        const A = axes(ctx, { x: [0, 21], y: [-0.25, 0.6], W: half, H, pad: { l: 50, r: 10, t: 56, b: 36 } });
        A.grid(4, 4).frame();
        A.ticks({ xs: [1, 10, 20], ys: [0, 0.25, 0.5], yfmt: (v) => v.toFixed(2) });
        A.band(-data.band, data.band, { color: "rgba(33,112,228,0.12)" });
        A.hline(0, { color: P.grid, dash: null });
        A.bars(data.acfX.map((v, i) => [i + 1, v]), { color: P.blue, width: 5 });
        A.note("ACF of  Xₜ", A.L, A.T - 16, { color: P.blue, size: 12, weight: 700 });
        A.note("all inside the band", A.L, A.B + 22, { color: P.muted, size: 11 });

        ctx.save();
        ctx.translate(half, 0);
        const B = axes(ctx, { x: [0, 21], y: [-0.25, 0.6], W: half, H, pad: { l: 50, r: 10, t: 56, b: 36 } });
        B.grid(4, 4).frame();
        B.ticks({ xs: [1, 10, 20], ys: [0, 0.25, 0.5], yfmt: (v) => v.toFixed(2) });
        B.band(-data.band, data.band, { color: "rgba(33,112,228,0.12)" });
        B.hline(0, { color: P.grid, dash: null });
        if (k > 0.05) B.bars(data.acfSq.map((v, i) => [i + 1, v * k]), { color: P.amber, width: 5 });
        B.note("ACF of  Xₜ²", B.L, B.T - 16, { color: P.amber, size: 12, weight: 700 });
        if (k > 0.8) B.note("far outside, for many lags", B.L, B.B + 22, { color: P.amber, size: 11, weight: 600 });
        ctx.restore();
      } }),

    points({ dur: 30, heading: "One more trap: significant $\\ne$ useful", tone: "amber",
      items: [
        "Run Ljung-Box on real returns and you often **do** get small p-values at $H=10$ and $H=20$.",
        "Doesn't that break market efficiency? No — and the resolution is worth memorizing.",
        "With thousands of observations, **tiny** correlations become statistically detectable.",
        "But could you trade on them? **No** — transaction costs would swamp any gain. Real, detectable, and useless.",
      ],
      say: "One more trap, and it's a favourite. Run Ljung Box on real returns and you often do get small p-values at H equals ten and twenty. Doesn't that break market efficiency? No — and the resolution is worth memorizing word for word. With thousands of observations, even tiny correlations become statistically detectable. But could you actually trade on them? No. Your transaction costs would swamp any gain you could make. Real, detectable, and useless. Keep that phrase ready." }),

    /* ---------- recap ---------- */
    recap({ dur: 32, items: [
      "A **unit root** means $\\phi=1$: shocks never decay, and the series is not stationary.",
      "**ADF** has the unit root as its **null**, so a small p-value is evidence **for** stationarity.",
      "Prices fail the test; **log returns pass it** — exactly as GBM predicted.",
      "The **ACF** shows memory at every lag; **Ljung-Box** pools $H$ lags into one test of *no autocorrelation anywhere*.",
      "Returns are nearly uncorrelated; **squared** returns are not. That single contrast launches Part 4.",
    ],
    say: "To recap. A unit root means phi equals one: shocks never decay, and the series is not stationary. The ADF test has the unit root as its null, so a small p-value is evidence for stationarity — it reads backwards compared to the other tests. Prices fail the test and log returns pass it, exactly as geometric Brownian motion predicted. The autocorrelation function shows memory at every lag, and Ljung Box pools H lags into a single test of no autocorrelation anywhere. And finally: returns are nearly uncorrelated, but squared returns are not. That single contrast launches the whole of Part four." }),
  ],
});
