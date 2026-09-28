/* f9 — Volatility and Volatility Clustering (full lecture) */

import { PALETTE as P, linspace, normPdf, normals, garch, acf, clamp01, easeOut, lerp } from "@/lib/anim";
import { compile, title, jargon, points, formula, plot, code, recap, revealed } from "@/lib/scenes";
import { pc, upTo } from "./shared";

const D = (() => {
  const n = 700;
  const g = garch({ omega: 8e-6, alpha: 0.09, beta: 0.9, n, seed: 91 });
  const sd = Math.sqrt(g.x.reduce((s, v) => s + v * v, 0) / n);
  const nrm = normals(83);
  const iid = Array.from({ length: n }, () => sd * nrm());
  const roll = (x, w) => x.map((_, i) => {
    if (i < w) return null;
    const s = x.slice(i - w, i);
    const m = s.reduce((a, v) => a + v, 0) / w;
    return Math.sqrt(s.reduce((a, v) => a + (v - m) ** 2, 0) / w);
  });
  return {
    iid, clustered: g.x, sd,
    rollIid: roll(iid, 25), rollC: roll(g.x, 25),
    acfIid: acf(iid.map((v) => v * v), 20),
    acfSq: acf(g.x.map((v) => v * v), 20),
    band: 1.96 / Math.sqrt(n),
    ann: sd * Math.sqrt(252),
  };
})();

export default compile({
  id: "f9",
  title: "Volatility and Volatility Clustering",
  blurb: "What $\\sigma$ actually means in dollars, how to estimate it from data, and the empirical fact that breaks the single-$\\sigma$ assumption the whole first half of the course rested on.",
  takeaway: "Two series can share an identical **unconditional** variance and behave completely differently. What differs is the **conditional** variance — and modelling that is Part 4.",
  data: D,
  scenes: [

    /* ---------- 1. what volatility is ---------- */
    title({ n: 1, title: "The parameter nobody can see", tone: "slate", chapter: "What volatility is",
      sub: "Of Black-Scholes' five inputs, this is the hard one.",
      say: "Chapter one. The parameter nobody can see. Of the five inputs to Black Scholes, this is the genuinely hard one.", dur: 11 }),

    jargon({ dur: 26, term: "Volatility", chapter: "What volatility is",
      plain: "The **standard deviation of log returns**, almost always quoted **annualized**. It measures how much the price moves — not which way.",
      formal: "It is a *scale*, not a *direction*. A volatile stock is not a falling stock; it is one that moves a lot in either direction.",
      say: "Volatility is the standard deviation of log returns, almost always quoted on an annualized basis. It measures how much the price moves — not which way it moves. That distinction matters and gets lost constantly. Volatility is a scale, not a direction. A volatile stock is not a falling stock. It's one that moves a lot, in either direction." }),

    plot({ dur: 30,
      caption: "What $\\sigma$ means concretely: for a \\$100 stock with $\\sigma=20\\%$, roughly **two thirds** of one-year outcomes land within one $\\sigma$, and about **95%** within two.",
      say: "Here's what sigma means concretely. Take a hundred dollar stock with an annual volatility of twenty percent. Roughly two thirds of one year outcomes land within one sigma of the centre — that's the inner shaded band. About ninety five percent land within two sigma. So sigma is a statement about the width of the distribution of where the price might end up. Double sigma and you double that width. And notice the bands aren't symmetric in dollars, because we're on the price scale and the distribution is lognormal.",
      note: "$\\pm1\\sigma$ ≈ 68% · $\\pm2\\sigma$ ≈ 95%",
      draw({ ctx, W, H, t, dur, axes }) {
        const a = axes(ctx, { x: [30, 200], y: [0, 0.028], W, H, pad: { l: 58, r: 22, t: 54, b: 40 } });
        a.grid(6, 4).frame();
        a.ticks({ xs: [50, 100, 150, 200], ys: [], xfmt: (v) => `$${v}` });
        const s = 0.2, mu = Math.log(100);
        const pdf = (x) => (x <= 0 ? 0 : normPdf((Math.log(x) - mu) / s) / (x * s));
        const pts = linspace(30, 200, 240).map((x) => [x, pdf(x)]);
        const k = easeOut(clamp01(t / (dur * 0.35)));
        const b2 = pts.filter(([x]) => Math.log(x) > mu - 2 * s && Math.log(x) < mu + 2 * s);
        const b1 = pts.filter(([x]) => Math.log(x) > mu - s && Math.log(x) < mu + s);
        if (k > 0.15) a.area(b2, 0, { color: "rgba(33,112,228,0.10)" });
        if (k > 0.45) a.area(b1, 0, { color: P.blueSoft });
        a.line(pts, { color: P.blue, width: 2.6 });
        a.vline(100, { color: P.ink, width: 1.4 });
        if (k > 0.6) {
          a.chip(`±1σ:  $${(100 * Math.exp(-s)).toFixed(0)} – $${(100 * Math.exp(s)).toFixed(0)}`, a.L + 10, a.T + 16);
          a.chip(`±2σ:  $${(100 * Math.exp(-2 * s)).toFixed(0)} – $${(100 * Math.exp(2 * s)).toFixed(0)}`, a.L + 10, a.T + 44,
            { color: P.muted, bg: "rgba(148,163,184,0.12)" });
        }
      } }),

    points({ dur: 28, heading: "Why higher volatility makes an option *more* valuable", tone: "emerald",
      items: [
        "More volatility widens the distribution **both ways** — more chance of a huge gain, more chance of a huge fall.",
        "But the payoff is **truncated at zero**. Below the strike, worse is not worse — it all pays nothing.",
        "So the extra downside costs you **nothing extra**, while the extra upside is worth real money.",
        "That is the module-1 asymmetry again, now expressed as a **comparative static**: $\\partial C/\\partial\\sigma>0$.",
      ],
      say: "And here's why higher volatility makes an option more valuable — a result that sounds wrong the first time you hear it. More volatility widens the distribution both ways: more chance of a huge gain, and more chance of a huge fall. But the payoff is truncated at zero. Below the strike, worse is not worse — it all pays exactly nothing. So the extra downside costs you nothing extra, while the extra upside is worth real money. That's the module one asymmetry again, now expressed as a comparative static: the derivative of the call price with respect to sigma is positive." }),

    /* ---------- 2. estimating it ---------- */
    title({ n: 2, title: "Estimating $\\sigma$ from data", tone: "blue", chapter: "Estimating $\\sigma$",
      sub: "Realized volatility, and the $\\sqrt{252}$ that keeps coming back.",
      say: "Chapter two. Estimating sigma from data. Realized volatility, and that square root of two fifty two that keeps coming back.", dur: 11 }),

    formula({ dur: 26, chapter: "Estimating $\\sigma$",
      heading: "Realized (historical) volatility",
      tex: "\\widehat\\sigma_{\\text{ann}}=\\sqrt{252\\cdot\\widehat{\\Var}(r_t)}=\\widehat{\\text{sd}}(r_t)\\cdot\\sqrt{252}",
      notes: [
        "Take the sample standard deviation of **daily log returns**, then annualize.",
        "**Multiply the variance by 252, or the standard deviation by $\\sqrt{252}$.** Those are the same thing — do not do both.",
        "252 is the number of **trading** days, not calendar days. Markets are shut at weekends.",
        "This is *backward*-looking: it tells you what volatility **was**, which is only a forecast if volatility is stable.",
      ],
      say: "Realized volatility, also called historical volatility, is just the sample standard deviation of daily log returns, annualized. You can multiply the variance by two fifty two, or the standard deviation by the square root of two fifty two — those are the same operation, so don't do both. And two fifty two is the number of trading days, not calendar days, because markets are shut at weekends. One important caveat: this is backward looking. It tells you what volatility was. That's only a forecast if volatility is stable — and the rest of this module is about how it isn't." }),

    code({ dur: 24, heading: "Realized volatility, and a rolling window", file: "vol.py",
      body: `import numpy as np

# whole-sample realized volatility, annualized
ann_vol = ldr.std() * np.sqrt(252)

# a 25-day rolling window - volatility as it changes over time
roll_vol = ldr.rolling(25).std() * np.sqrt(252)
roll_vol.plot()`,
      say: "Two lines. The first gives the whole sample realized volatility, annualized. The second is the interesting one: a rolling window, which gives you volatility as a function of time rather than a single number. If volatility really were constant, that rolling series would be a flat line with a bit of estimation noise. Let's see whether it is." }),

    /* ---------- 3. clustering ---------- */
    title({ n: 3, title: "The plot that breaks the model", tone: "amber", chapter: "Volatility clusters",
      sub: "Everything so far assumed one fixed $\\sigma$.",
      say: "Chapter three. The plot that breaks the model. Everything in this course so far has assumed one fixed sigma. Let's test that.", dur: 11 }),

    plot({ dur: 30, chapter: "Volatility clusters",
      caption: "Two return series with **identical** overall variance. One is independent; one is not. You can tell them apart **by eye** — which means something systematic is going on.",
      say: "Here are two return series with identical overall variance — I've matched them deliberately. One is independent draws from a fixed normal; the other is not. And you can tell them apart by eye. The top one has the same band of activity everywhere. The bottom one has calm stretches and violent stretches. That is not something that should be visible if returns were independent with constant volatility. Something systematic is going on.",
      note: "same variance · completely different texture",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const top = { l: 58, r: 22, t: 46, b: H / 2 + 10 };
        const bot = { l: 58, r: 22, t: H / 2 + 16, b: 34 };
        const n = Math.max(2, revealed(t, dur, 700, { start: 0.02, end: 0.7 }));
        const A = axes(ctx, { x: [0, 700], y: [-0.08, 0.08], W, H, pad: top });
        A.grid(5, 3).frame(); A.ticks({ ys: [-0.05, 0, 0.05], yfmt: (v) => pc(v, 0) });
        A.hline(0, { color: P.grid, dash: null });
        A.bars(data.iid.slice(0, n).map((v, i) => [i, v]), { color: P.blue, width: 1, alpha: 0.75 });
        A.note("iid normal — constant σ", A.L + 8, A.T + 14, { color: P.blue, size: 11.5, weight: 700 });

        const B = axes(ctx, { x: [0, 700], y: [-0.08, 0.08], W, H, pad: bot });
        B.grid(5, 3).frame();
        B.ticks({ xs: [0, 350, 700], ys: [-0.05, 0, 0.05], yfmt: (v) => pc(v, 0) });
        B.hline(0, { color: P.grid, dash: null });
        B.bars(data.clustered.slice(0, n).map((v, i) => [i, v]), { color: P.amber, width: 1, alpha: 0.85 });
        B.note("real returns look like this", B.L + 8, B.T + 14, { color: P.amber, size: 11.5, weight: 700 });
      } }),

    jargon({ dur: 26, term: "Volatility clustering",
      plain: "**Large changes tend to be followed by large changes, and small by small** — regardless of sign. Turbulence arrives in runs.",
      formal: "It is the single most robust empirical fact about financial returns, visible in essentially every asset and every market.",
      say: "Volatility clustering. Large changes tend to be followed by large changes, and small changes by small changes — regardless of sign. Turbulence arrives in runs. Note the phrase regardless of sign: it is about magnitude, not direction. And this is the single most robust empirical fact about financial returns, visible in essentially every asset and every market anyone has looked at." }),

    plot({ dur: 30,
      caption: "Put a 25-day rolling volatility under each. The iid one is a **flat line with noise**. The real one **swings by a factor of three**, slowly, in runs.",
      say: "Now put a twenty five day rolling volatility under each series. Under the independent data it's a flat line with a bit of estimation noise, exactly as constant volatility predicts. Under the clustered data it swings by a factor of three, and crucially it does so slowly, in long runs. That slowness is the giveaway. If these were independent estimation wobbles they'd jump around randomly. Instead they persist, which means volatility is predictable from its own past.",
      note: "rolling σ: flat vs swinging by 3×",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const k = easeOut(clamp01(t / (dur * 0.45)));
        const top = { l: 62, r: 22, t: 46, b: H / 2 + 10 };
        const bot = { l: 62, r: 22, t: H / 2 + 16, b: 34 };
        const A = axes(ctx, { x: [0, 700], y: [0, 0.6], W, H, pad: top });
        A.grid(5, 3).frame(); A.ticks({ ys: [0, 0.25, 0.5], yfmt: (v) => pc(v, 0) });
        A.line(data.rollIid.map((v, i) => [i, (v ?? 0) * Math.sqrt(252)]).filter((_, i) => i >= 25),
          { color: P.blue, width: 2 });
        A.note("iid — flat", A.L + 8, A.T + 14, { color: P.blue, size: 11.5, weight: 700 });

        const B = axes(ctx, { x: [0, 700], y: [0, 0.6], W, H, pad: bot });
        B.grid(5, 3).frame();
        B.ticks({ xs: [0, 350, 700], ys: [0, 0.25, 0.5], yfmt: (v) => pc(v, 0) });
        const pts = data.rollC.map((v, i) => [i, (v ?? 0) * Math.sqrt(252)]).filter((_, i) => i >= 25);
        B.line(upTo(pts, k), { color: P.amber, width: 2.4 });
        B.note("clustered — swings", B.L + 8, B.T + 14, { color: P.amber, size: 11.5, weight: 700 });
      } }),

    /* ---------- 4. diagnosing it ---------- */
    title({ n: 4, title: "Diagnosing it properly", tone: "blue", chapter: "Diagnosing clustering",
      sub: "Eyeballing is not evidence. Here is the test.",
      say: "Chapter four. Diagnosing it properly. Eyeballing a chart is not evidence. Here is how you actually test for it.", dur: 10 }),

    formula({ dur: 26, chapter: "Diagnosing clustering",
      heading: "Why **squaring** is the right move",
      tex: "\\E\\big[(X-\\mu)^2\\big]=\\Var(X),\\qquad \\mu\\approx0\\ \\Rightarrow\\ \\E\\big[X_t^2\\big]\\approx\\Var(X_t)",
      notes: [
        "Daily log returns have a mean very close to zero, so $X_t^2$ is a direct proxy for that day's **variance**.",
        "Squaring also **destroys the sign** — which is what we want, since clustering is about magnitude.",
        "So: to ask *is volatility autocorrelated?*, run the ACF on $X_t^2$.",
      ],
      say: "Why is squaring the right move? Because the expected squared deviation from the mean is the variance — and daily log returns have a mean very close to zero. So X squared is a direct proxy for that day's variance. Squaring also destroys the sign, which is exactly what we want, since clustering is about magnitude and not direction. So to ask whether volatility is autocorrelated, you run the autocorrelation function on the squared returns." }),

    plot({ dur: 32,
      caption: "And there it is. Squared **iid** returns: nothing outside the band, as they should be. Squared **real** returns: significant for twenty lags and decaying slowly.",
      say: "And there it is, in the only form that counts as evidence. On the left, squared returns from the independent series: nothing outside the band, exactly as independence predicts. On the right, squared returns from the clustered series: significant for twenty lags and decaying only slowly. This is the formal version of the picture we eyeballed. Volatility is autocorrelated. And since the returns themselves were uncorrelated, we now have a series that is uncorrelated but definitely not independent — which no model with a single fixed sigma can produce.",
      note: "left: iid squares · right: real squares",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const half = W / 2;
        const k = clamp01((t - 1.5) / (dur * 0.35));
        const A = axes(ctx, { x: [0, 21], y: [-0.25, 0.6], W: half, H, pad: { l: 50, r: 10, t: 56, b: 36 } });
        A.grid(4, 4).frame();
        A.ticks({ xs: [1, 10, 20], ys: [0, 0.25, 0.5], yfmt: (v) => v.toFixed(2) });
        A.band(-data.band, data.band, { color: "rgba(33,112,228,0.12)" });
        A.hline(0, { color: P.grid, dash: null });
        A.bars(data.acfIid.map((v, i) => [i + 1, v]), { color: P.blue, width: 5 });
        A.note("iid, squared", A.L, A.T - 16, { color: P.blue, size: 12, weight: 700 });

        ctx.save();
        ctx.translate(half, 0);
        const B = axes(ctx, { x: [0, 21], y: [-0.25, 0.6], W: half, H, pad: { l: 50, r: 10, t: 56, b: 36 } });
        B.grid(4, 4).frame();
        B.ticks({ xs: [1, 10, 20], ys: [0, 0.25, 0.5], yfmt: (v) => v.toFixed(2) });
        B.band(-data.band, data.band, { color: "rgba(33,112,228,0.12)" });
        B.hline(0, { color: P.grid, dash: null });
        if (k > 0.03) B.bars(data.acfSq.map((v, i) => [i + 1, v * k]), { color: P.amber, width: 5 });
        B.note("real, squared", B.L, B.T - 16, { color: P.amber, size: 12, weight: 700 });
        ctx.restore();
      } }),

    points({ dur: 30, heading: "What exactly has broken", tone: "amber",
      items: [
        "Both series have the **same unconditional variance** — the long-run, whole-sample number.",
        "What differs is the **conditional variance**: $\\sigma_t^2=\\Var(X_t\\mid\\text{everything up to }t-1)$.",
        "GBM and Black-Scholes assume that conditional variance is a **constant**. It plainly is not.",
        "So the next module builds models in which $\\sigma_t^2$ is allowed to **move** — and that is ARCH and GARCH.",
      ],
      say: "So what exactly has broken? Both series have the same unconditional variance — the long run, whole sample number. What differs is the conditional variance: the variance of today's return given everything you knew up to yesterday. Geometric Brownian motion and Black Scholes both assume that conditional variance is a constant. It plainly is not. So the next module builds models in which sigma squared t is allowed to move over time. That is ARCH, and then GARCH." }),

    /* ---------- recap ---------- */
    recap({ dur: 32, items: [
      "**Volatility** is the standard deviation of log returns, annualized with $\\sqrt{252}$ — a scale, not a direction.",
      "More volatility makes a call **more** valuable, because the downside is truncated and the upside is not.",
      "**Volatility clustering**: large changes follow large changes, small follow small, regardless of **sign**.",
      "Test it by running the **ACF on squared returns** — squaring turns magnitude into the quantity being measured.",
      "Returns are uncorrelated; their squares are not. **Uncorrelated $\\ne$ independent**, and that is what Part 4 fixes.",
    ],
    say: "To recap. Volatility is the standard deviation of log returns, annualized with the square root of two fifty two — and it's a scale, not a direction. More volatility makes a call more valuable, because the downside is truncated and the upside is not. Volatility clustering means large changes follow large changes and small follow small, regardless of sign. You test for it by running the autocorrelation function on squared returns, because squaring turns magnitude into the quantity being measured. And the conclusion: returns are uncorrelated, but their squares are not. Uncorrelated is not independent, and that is what Part four sets out to fix." }),
  ],
});
