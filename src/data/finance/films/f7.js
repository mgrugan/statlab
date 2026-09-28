/* f7 — Time Series Foundations and Stationarity (full lecture) */

import { PALETTE as P, linspace, ar1, garch, acf, normals, clamp01, easeOut, lerp } from "@/lib/anim";
import { compile, title, jargon, points, formula, derive, plot, code, recap, revealed } from "@/lib/scenes";

const D = (() => {
  const n = 240;
  const rev = ar1({ phi: 0.9, mu: 0, sd: 1, n, seed: 13 });
  const walk = ar1({ phi: 1, mu: 0, sd: 1, n, seed: 13 });     // identical shocks
  const neg = ar1({ phi: -0.75, mu: 0, sd: 1, n, seed: 13 });
  const nrm = normals(29);
  const wn = Array.from({ length: n }, () => nrm());
  const arch = garch({ omega: 0.2, alpha: 0.75, beta: 0, n, seed: 47 });
  return {
    rev, walk, neg, wn, arch, phi: 0.9,
    acfRev: acf(rev, 20),
    theory: Array.from({ length: 20 }, (_, h) => 0.9 ** (h + 1)),
    band: 1.96 / Math.sqrt(n),
  };
})();

export default compile({
  id: "f7",
  title: "Time Series Foundations and Stationarity",
  blurb: "What it means for a series to be well behaved enough to model, the three conditions that define it, and three models that between them explain everything the rest of the course does.",
  takeaway: "Stationarity is not “the series is constant.” It is “the **rules** generating the series are constant.” Everything wobbles; what must hold still is the distribution.",
  data: D,
  scenes: [

    /* ---------- 1. the idea ---------- */
    title({ n: 1, title: "One path, and a problem", tone: "slate", chapter: "One path, one problem",
      sub: "Statistics wants repeats. History only ran once.",
      say: "Chapter one. One path, and a problem. Statistics wants repeated observations. But history only ran once.", dur: 10 }),

    points({ dur: 26, heading: "The difficulty that defines time series", chapter: "One path, one problem",
      items: [
        "Ordinary statistics assumes you have **many independent draws** from the same distribution.",
        "A stock has produced exactly **one** price history. You cannot re-run 2015.",
        "So you must treat **consecutive observations in time** as if they were repeated draws.",
        "That only works if the process is **not changing underneath you** — which is exactly what stationarity demands.",
      ],
      say: "Here's the difficulty that defines the whole field. Ordinary statistics assumes you have many independent draws from the same distribution. But a stock has produced exactly one price history. You cannot re-run twenty fifteen and see what else might have happened. So instead you're forced to treat consecutive observations in time as if they were repeated draws from the same distribution. And that only works if the process isn't changing underneath you. Which is exactly what stationarity demands." }),

    jargon({ dur: 24, term: "Stationary", chapter: "One path, one problem",
      plain: "The **statistical rules** generating the series do not change over time. Not that the series is flat — it wobbles as much as it likes. Its **distribution** is what must hold still.",
      formal: "Slide a window along the series: a stationary process looks statistically the same wherever you put the window.",
      say: "Stationary means the statistical rules generating the series do not change over time. It does not mean the series is flat — it wobbles as much as it likes. What must hold still is the distribution. Here's the mental test: slide a window along the series. A stationary process looks statistically the same wherever you put that window." }),

    plot({ dur: 30,
      caption: "Two series, and only one of them is stationary. Slide the window: the top one looks the same everywhere. The bottom one **does not** — it has drifted somewhere new.",
      say: "Here are two series, and only one of them is stationary. Slide the window along the top one: it looks statistically the same wherever you put it, hovering around a fixed level with a consistent spread. Now slide it along the bottom one. Early on it sits near zero; later it's somewhere else entirely, with no tendency to come back. The rules haven't changed, but the level has wandered — and a wandering level means there's no single mean for the window to find.",
      note: "top: stationary · bottom: a random walk",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const top = { l: 54, r: 22, t: 46, b: H / 2 + 10 };
        const bot = { l: 54, r: 22, t: H / 2 + 16, b: 34 };
        const n = Math.max(2, revealed(t, dur, 240, { start: 0.02, end: 0.6 }));
        const A = axes(ctx, { x: [0, 240], y: [-9, 9], W, H, pad: top });
        A.grid(5, 3).frame(); A.ticks({ ys: [-6, 0, 6] });
        A.hline(0, { color: P.amber, width: 1.6, dash: [6, 4] });
        A.line(data.rev.slice(0, n).map((v, i) => [i, v]), { color: P.emerald, width: 1.8 });
        A.note("stationary  (φ = 0.9)", A.L + 8, A.T + 14, { color: P.emerald, size: 11.5, weight: 700 });

        const B = axes(ctx, { x: [0, 240], y: [-22, 22], W, H, pad: bot });
        B.grid(5, 3).frame(); B.ticks({ xs: [0, 120, 240], ys: [-15, 0, 15] });
        B.hline(0, { color: P.amber, width: 1.4, dash: [6, 4] });
        B.line(data.walk.slice(0, n).map((v, i) => [i, v]), { color: P.red, width: 1.8 });
        B.note("not stationary  (φ = 1)", B.L + 8, B.T + 14, { color: P.red, size: 11.5, weight: 700 });

        // the sliding window
        const k = clamp01((t / dur - 0.55) / 0.4);
        if (k > 0) {
          const x0 = lerp(0, 180, k), x1 = x0 + 55;
          for (const ax of [A, B]) {
            ctx.save();
            ctx.globalAlpha = 0.16; ctx.fillStyle = P.blue;
            ctx.fillRect(ax.sx(x0), ax.T, ax.sx(x1) - ax.sx(x0), ax.B - ax.T);
            ctx.restore();
          }
        }
      } }),

    /* ---------- 2. the ACVF ---------- */
    title({ n: 2, title: "Measuring memory", tone: "blue", chapter: "Measuring memory",
      sub: "How related is today to $h$ days ago?",
      say: "Chapter two. Measuring memory. How related is today to h days ago?", dur: 8 }),

    jargon({ dur: 22, term: "Autocovariance", chapter: "Measuring memory",
      plain: "Ordinary covariance, but between a series and **itself** at a different time. *Auto* means self.",
      formal: "$\\gamma_X(r,s)=\\Cov(X_r,X_s)$. If it depends only on the **gap** $|r-s|$ and not on where you are, write it $\\gamma_X(h)$.",
      say: "Autocovariance is ordinary covariance, but between a series and itself at a different time. Auto simply means self. We write gamma X of r and s for the covariance between the series at time r and time s. And if that depends only on the gap between them, and not on where in the series you are, we can write it with a single argument h — the lag." }),

    formula({ dur: 26,
      heading: "Three conditions define (weak) stationarity",
      tex: "\\text{(i)}\\;\\E(X_t)=\\mu\\;\\text{ for all }t \\qquad \\text{(ii)}\\;\\Var(X_t)<\\infty \\qquad \\text{(iii)}\\;\\gamma_X(r,s)=\\gamma_X(r+h,s+h)",
      notes: [
        "**(i)** The mean is the **same constant** at every time. No trend, no drift.",
        "**(ii)** The variance is **finite** — it cannot grow without bound as $t$ increases.",
        "**(iii)** The autocovariance is **shift-invariant**: it depends on the gap, not on the date.",
        "Together: slide the window anywhere, and the first two moments look identical.",
      ],
      say: "Three conditions define weak stationarity. First, the mean is the same constant at every time — no trend, no drift. Second, the variance is finite; it cannot grow without bound as time increases. Third, the autocovariance is shift invariant: it depends only on the gap between two points, not on where those points sit in the series. Put them together and they say exactly what we said with the sliding window: move it anywhere, and the first two moments look identical." }),

    points({ dur: 28, heading: "What stationarity does *not* say", tone: "amber",
      items: [
        "It does **not** say the series is constant, flat, or boring. It wobbles freely.",
        "It does **not** say consecutive values are independent. Stationary series can have enormous memory.",
        "It does **not** say the series never has long runs above or below the mean. It absolutely can.",
        "It says only this: the **distribution** generating those wobbles is the same one, always.",
      ],
      say: "Now, what stationarity does not say — because this is where the exam questions live. It does not say the series is constant, or flat, or boring; it wobbles freely. It does not say consecutive values are independent; a stationary series can have enormous memory. It does not say the series never has long runs above or below its mean; it absolutely can have those. It says only this: the distribution generating those wobbles is the same distribution, always." }),

    /* ---------- 3. three models ---------- */
    title({ n: 3, title: "Three models to keep in your head", tone: "emerald", chapter: "Three models",
      sub: "White noise, AR(1), and ARCH(1) — between them, the whole course.",
      say: "Chapter three. Three models to keep in your head. White noise, AR one, and ARCH one. Between them, they explain everything the rest of this course does.", dur: 11 }),

    plot({ dur: 26, chapter: "Three models",
      caption: "**White noise**: constant mean, constant variance, **zero** correlation at every lag. The baseline against which everything else is interesting.",
      say: "First, white noise. Constant mean, constant variance, and zero correlation at every non-zero lag. It's the baseline against which everything else becomes interesting. One important subtlety: white noise is a weaker assumption than independent and identically distributed. Uncorrelated is not the same as independent, and the gap between those two ideas is where the second half of this course lives.",
      note: "**white noise** — uncorrelated, but *not necessarily independent*",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 240], y: [-4, 4], W, H, pad: { l: 54, r: 22, t: 54, b: 38 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 120, 240], ys: [-3, 0, 3] });
        a.hline(0, { color: P.amber, width: 1.4, dash: [6, 4] });
        const n = Math.max(2, revealed(t, dur, 240, { start: 0.02, end: 0.8 }));
        a.bars(data.wn.slice(0, n).map((v, i) => [i, v]), { color: P.blue, width: 1.6, alpha: 0.8 });
      } }),

    formula({ dur: 26,
      heading: "AR(1) — a regression of the series on itself",
      tex: "X_t=\\mu+\\phi\\,(X_{t-1}-\\mu)+\\epsilon_t,\\qquad |\\phi|<1",
      notes: [
        "**Autoregressive**: it is fitted like a regression, but the predictor is the series' **own** previous value.",
        "**Order one**: only one lag is used as a predictor.",
        "Written in terms of the **deviation** $X_{t-1}-\\mu$, which is why $\\mu$ appears twice.",
        "$\\{\\epsilon_t\\}$ is mean-zero white noise — the fresh news arriving each period.",
      ],
      say: "Second model: AR one. Autoregressive means it's fitted like a regression, except the predictor is the series' own previous value. Order one means only one lag is used. Notice it's written in terms of the deviation from the mean, which is why mu appears twice — if you were exactly on the mean yesterday, yesterday contributes nothing today. And epsilon is mean zero white noise: the fresh news arriving each period." }),

    plot({ dur: 30,
      caption: "Here is what $\\phi$ actually controls. **The same shocks**, three values of $\\phi$. It is the fraction of yesterday's deviation that survives into today.",
      say: "Here's what phi actually controls, using the very same shocks three times over. Phi is the fraction of yesterday's deviation that survives into today. At nought point nine, most of it carries over, so the series drifts in long slow swings. At phi equal to one nothing decays at all, and the series wanders off — that's the random walk, and it is not stationary. And at minus nought point seven five, the sign flips every period, so it alternates rapidly above and below the mean. Note that last one is still perfectly stationary. Stationarity is about the absolute value of phi, not its sign.",
      note: "same shocks · $\\phi=0.9$, $\\phi=1$, $\\phi=-0.75$",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 240], y: [-20, 20], W, H, pad: { l: 54, r: 22, t: 54, b: 38 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 120, 240], ys: [-15, 0, 15] });
        a.hline(0, { color: P.amber, width: 1.4, dash: [6, 4] });
        const n = Math.max(2, revealed(t, dur, 240, { start: 0.02, end: 0.55 }));
        const show = (arr, color, w) => a.line(arr.slice(0, n).map((v, i) => [i, v]), { color, width: w });
        show(data.rev, P.emerald, 2);
        if (t > dur * 0.25) show(data.walk, P.red, 2);
        if (t > dur * 0.5) show(data.neg, P.blue, 1.6);
        a.note("φ = 0.9  slow swings", a.L + 10, a.T + 18, { color: P.emerald, size: 11.5, weight: 700 });
        if (t > dur * 0.25) a.note("φ = 1  wanders off", a.L + 10, a.T + 38, { color: P.red, size: 11.5, weight: 700 });
        if (t > dur * 0.5) a.note("φ = −0.75  alternates", a.L + 10, a.T + 58, { color: P.blue, size: 11.5, weight: 700 });
      } }),

    points({ dur: 26, heading: "Mean reversion and autocorrelation are the *same* fact", tone: "emerald",
      items: [
        "With $|\\phi|<1$, each step multiplies the deviation by something smaller than one — so shocks **decay** and the series returns toward $\\mu$.",
        "Students often treat *mean reversion* and *autocorrelation* as opposites. They are not.",
        "An AR(1) with $\\phi=0.9$ has **both**, strongly. The series is pulled home **slowly** — and “slowly” is precisely what high autocorrelation means.",
      ],
      say: "Here's a confusion worth clearing up. With the absolute value of phi below one, each step multiplies the deviation by something smaller than one, so shocks decay and the series returns toward its mean. Students often treat mean reversion and autocorrelation as opposites — one pulls you back, the other says you keep going. They are not opposites. An AR one with phi of nought point nine has both, strongly. The series is pulled home slowly. And slowly is precisely what high autocorrelation means." }),

    derive({ dur: 30, heading: "Where the AR(1) autocorrelation comes from",
      lines: [
        ["X_t=\\sum_{k=0}^{\\infty}\\phi^{k}\\epsilon_{t-k}", "iterate the recursion; converges since $|\\phi|<1$"],
        ["\\gamma_X(0)=\\Var(X_t)=\\sigma_\\epsilon^2\\sum_{k\\ge0}\\phi^{2k}=\\frac{\\sigma_\\epsilon^2}{1-\\phi^2}", "independent shocks, then a geometric series"],
        ["\\gamma_X(h)=\\Cov\\big(\\phi^{h}X_t+\\text{new shocks},\\,X_t\\big)", "unroll $h$ steps forward"],
        ["=\\phi^{h}\\Var(X_t)", "the new shocks are independent of $X_t$"],
        ["\\rho_X(h)=\\phi^{|h|}\\qquad\\blacksquare", "divide through by $\\gamma_X(0)$"],
      ],
      say: "Let's derive the autocorrelation, because the answer is genuinely useful. Iterate the recursion and the series becomes an infinite weighted sum of past shocks — which converges precisely because the absolute value of phi is below one. The variance is then a geometric series, giving sigma epsilon squared over one minus phi squared. For the covariance at lag h, unroll h steps forward: the new shocks are independent of where you started, so they contribute nothing, and what survives is phi to the h times the variance. Divide through and the autocorrelation is simply phi to the absolute h." }),

    plot({ dur: 28,
      caption: "So the ACF of an AR(1) is a clean **geometric decay** at rate $\\phi$ — and you can read $\\phi$ straight off the lag-1 bar.",
      say: "So the autocorrelation function of an AR one is a clean geometric decay at rate phi. The bars shrink by a constant factor each lag. The dots are the theoretical value, phi to the h, and the bars are what we actually measured from the simulated series — they track closely. This is genuinely useful: when you look at a real ACF plot and see bars shrinking by a roughly constant factor, you're looking at AR type memory, and you can read phi straight off the lag one bar. Also notice the variance formula blows up as phi approaches one, which is the stationarity condition arriving from a different direction.",
      note: "bars: measured · dots: $\\phi^{h}$ · shaded: not significant",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 21], y: [-0.25, 1.05], W, H, pad: { l: 56, r: 22, t: 54, b: 38 } });
        a.grid(6, 4).frame();
        a.ticks({ xs: [1, 5, 10, 15, 20], ys: [0, 0.5, 1], yfmt: (v) => v.toFixed(1) });
        a.band(-data.band, data.band, { color: "rgba(33,112,228,0.12)" });
        a.hline(0, { color: P.grid, dash: null });
        const n = revealed(t, dur, 20, { start: 0.05, end: 0.7 });
        a.bars(data.acfRev.slice(0, n).map((v, i) => [i + 1, v]), { color: P.emerald, width: 6 });
        a.dots(data.theory.slice(0, n).map((v, i) => [i + 1, v]), { color: P.amber, r: 3.2 });
      } }),

    plot({ dur: 28,
      caption: "**ARCH(1)** is the third model — and the strange one. Its *level* is white noise, but its **variance depends on the last observation**, so quiet and violent stretches cluster.",
      say: "The third model is ARCH one, and it's the strange one. Its level is white noise — mean zero, uncorrelated at every lag. But its variance depends on the square of the last observation. So a big move, in either direction, inflates the next period's variance. Watch the series: quiet stretches and violent stretches cluster together. And here's the crucial part. This process is uncorrelated but it is emphatically not independent. The values carry no linear relationship, yet the squares clearly do. That single distinction is the entire subject of Part four.",
      note: "**uncorrelated, but not independent** — the key idea of Part 4",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 240], y: [-5.5, 5.5], W, H, pad: { l: 54, r: 22, t: 54, b: 38 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 120, 240], ys: [-4, 0, 4] });
        a.hline(0, { color: P.grid, dash: null });
        const n = Math.max(2, revealed(t, dur, 240, { start: 0.02, end: 0.75 }));
        a.bars(data.arch.x.slice(0, n).map((v, i) => [i, v]), { color: P.amber, width: 1.6, alpha: 0.85 });
        if (t > dur * 0.55) {
          a.line(data.arch.vol.slice(0, n).map((v, i) => [i, v * 2]), { color: P.red, width: 1.8 });
          a.note("±2σₜ — the conditional volatility", a.L + 10, a.T + 18, { color: P.red, size: 11.5, weight: 700 });
        }
      } }),

    code({ dur: 24, heading: "Simulating AR(1) and ARCH(1)", file: "sim.py",
      body: `import numpy as np

def ar1(phi, mu, sigma, n):
    x, e = np.zeros(n), np.random.normal(0, sigma, n)
    for t in range(1, n):
        x[t] = mu + phi * (x[t-1] - mu) + e[t]
    return x

def arch1(omega, alpha, n):
    x, e = np.zeros(n), np.random.normal(0, 1, n)
    for t in range(1, n):
        x[t] = e[t] * np.sqrt(omega + alpha * x[t-1]**2)
    return x`,
      say: "Both are short loops. For AR one, each value is the mean plus phi times the previous deviation plus a fresh shock. For ARCH one, each value is a standard normal multiplied by the square root of the current conditional variance — and that variance depends on the previous value squared. Note where the randomness enters in each case: in AR it's added to the level, in ARCH it's multiplied into the scale." }),

    /* ---------- recap ---------- */
    recap({ dur: 32, items: [
      "We only ever see **one path**, so we treat time as if it gave repeated draws — which needs the process to hold still.",
      "**Stationary** = the rules do not change. Constant mean, finite variance, autocovariance depending only on the **gap**.",
      "It does **not** mean flat, and it does **not** mean independent.",
      "**AR(1)**: shocks decay at rate $\\phi$, so $\\rho(h)=\\phi^{|h|}$ — mean reversion and autocorrelation are the same fact.",
      "**ARCH(1)**: uncorrelated but **not independent**. That gap is what the rest of the course is about.",
    ],
    say: "To recap. We only ever see one path, so we treat time as if it gave us repeated draws — and that requires the process to hold still. Stationary means the rules don't change: constant mean, finite variance, and an autocovariance that depends only on the gap between two points. It does not mean flat, and it does not mean independent. An AR one has shocks that decay at rate phi, so its autocorrelation is phi to the h — mean reversion and autocorrelation turn out to be the same fact. And an ARCH one is uncorrelated but not independent. That gap is what the rest of this course is about." }),
  ],
});
