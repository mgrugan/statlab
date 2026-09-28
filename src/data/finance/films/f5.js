/* f5 — Kernel Density Estimation (full lecture) */

import { PALETTE as P, linspace, normPdf, normals, kde, tSample, clamp01, easeOut, lerp } from "@/lib/anim";
import { compile, title, jargon, points, formula, plot, code, recap, revealed } from "@/lib/scenes";
import { upTo } from "./shared";

const D = (() => {
  const nrm = normals(57);
  // bimodal, so over-smoothing visibly destroys a real feature
  const x = Array.from({ length: 90 }, (_, i) => (i % 2 ? -1.15 : 1.15) + 0.42 * nrm());
  const grid = linspace(-3.4, 3.4, 240);
  const truth = grid.map((g) =>
    0.5 * normPdf((g + 1.15) / 0.42) / 0.42 + 0.5 * normPdf((g - 1.15) / 0.42) / 0.42);
  // a fat-tailed return-like sample for the closing "convicts normality" plot
  const nrm2 = normals(77);
  const ret = Array.from({ length: 1200 }, () => tSample(nrm2, 3) * 0.008);
  const sd = Math.sqrt(ret.reduce((s, v) => s + v * v, 0) / ret.length);
  const rgrid = linspace(-0.06, 0.06, 240);
  return { x, grid, truth, ret, sd, rgrid };
})();

export default compile({
  id: "f5",
  title: "Kernel Density Estimation",
  blurb: "How to draw a distribution without assuming its shape — and the one knob that decides whether you are looking at the data or at an accident.",
  takeaway: "The bandwidth $h$ answers exactly one question: *how far away is a data point still allowed to speak about this location?* Too few neighbours and you hear noise; too many and you hear the average of things that are not alike.",
  data: D,
  scenes: [

    /* ---------- 1. the problem ---------- */
    title({ n: 1, title: "Drawing a distribution you do not know", tone: "slate", chapter: "The problem",
      sub: "We have been assuming shapes. Now let us stop.",
      say: "Chapter one. Drawing a distribution you do not know. So far we've been assuming shapes — normal, lognormal. Now let's stop assuming and let the data speak.", dur: 10 }),

    jargon({ dur: 20, term: "Density", chapter: "The problem",
      plain: "A curve whose **area** gives probability. The height at a point is not a probability — only the area under a stretch of curve is.",
      formal: "Total area is always exactly 1, because something must happen. A histogram is a crude density estimate with blocky bars.",
      say: "A density is a curve whose area gives probability. Be careful: the height at a single point is not a probability. Only the area under a stretch of the curve is. The total area is always exactly one, because something has to happen. A histogram is really a crude density estimate — same idea, blocky bars." }),

    jargon({ dur: 22, term: "Nonparametric",
      plain: "A method that does **not** assume a formula for the shape. You do not say *“it is normal, find me $\\mu$ and $\\sigma$”*; you say *“whatever shape it is, show me”*.",
      formal: "**Parametric** = pick a family, estimate its handful of parameters. **Nonparametric** = let the data choose the shape. More flexible, and hungrier for data.",
      say: "Nonparametric means a method that does not assume a formula for the shape. You don't say, it's normal, go find me mu and sigma. You say, whatever shape it is, show me. Contrast that with parametric, where you pick a family and estimate its handful of parameters. Nonparametric is more flexible, and correspondingly hungrier for data." }),

    points({ dur: 22, heading: "Why this matters *here* specifically", tone: "amber",
      items: [
        "We want to ask: **are log returns normal?**",
        "If you fit a normal and then plot the normal, you have answered nothing — you assumed the answer.",
        "So you need a picture of the distribution built **without** that assumption. That is what a KDE is for.",
      ],
      say: "Why does this matter here specifically? Because the question we want to ask is: are log returns normal? If you fit a normal and then plot that normal, you've answered nothing — you assumed the answer before you started. So you need a picture of the distribution built without that assumption. That is exactly what a kernel density estimate is for." }),

    /* ---------- 2. the estimator ---------- */
    title({ n: 2, title: "One bump per data point", tone: "blue", chapter: "How a KDE works",
      sub: "The whole method, in one sentence.",
      say: "Chapter two. One bump per data point. That's the whole method, in one sentence.", dur: 8 }),

    plot({ dur: 26, chapter: "How a KDE works",
      caption: "Here are ninety observations as ticks. Drop a small **bump** on each one, then add the bumps up. The total height at any location is your estimate of the density there.",
      say: "Here are ninety observations, drawn as ticks along the axis. Now drop a small bump centred on each one. Then simply add all the bumps together. The total height at any location is your estimate of the density there. Where points cluster, bumps overlap and pile up high. Where points are sparse, the total stays low. That's it. That is the entire idea.",
      note: "a bump on every point, then add them up",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-3.4, 3.4], y: [0, 0.62], W, H, pad: { l: 54, r: 22, t: 54, b: 38 } });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-3, -1.5, 0, 1.5, 3], ys: [], xfmt: (v) => v.toFixed(1) });
        a.bars(data.x.map((v) => [v, 0.035]), { color: P.muted, width: 1.4, alpha: 0.55 });
        const h = 0.3;
        const n = revealed(t, dur, data.x.length, { start: 0.08, end: 0.62 });
        for (let i = 0; i < n; i++) {
          const xi = data.x[i];
          a.line(linspace(xi - 3 * h, xi + 3 * h, 24).map((g) => [g, normPdf((g - xi) / h) / (h * data.x.length) * 6]),
            { color: P.blue, width: 1, alpha: 0.32 });
        }
        const k = clamp01((t / dur - 0.55) * 3);
        if (k > 0) a.line(data.grid.map((g) => [g, kde(data.x, h, [g])[0]]), { color: P.blue, width: 2.8, alpha: k });
      } }),

    formula({ dur: 26,
      heading: "Written down, it says exactly that",
      tex: "\\widehat{f}_h(x)=\\frac{1}{nh}\\sum_{i=1}^{n}K\\!\\left(\\frac{x-x_i}{h}\\right)",
      notes: [
        "$K(\\cdot)$ is the **kernel** — the shape of one bump. Usually a little Gaussian.",
        "$h$ is the **bandwidth** — how **wide** each bump is, measured in the units of your data.",
        "$\\frac{1}{nh}$ is bookkeeping: wider bumps are also shorter, so the total area stays 1.",
        "The sum is doing the piling-up. Nothing more sophisticated is going on.",
      ],
      say: "Written down, the formula says exactly that. K is the kernel — the shape of one bump, usually a little Gaussian. h is the bandwidth, which controls how wide each bump is, measured in the units of your data. The one over n h out front is pure bookkeeping: wider bumps are also shorter, so the total area stays at one. And the sum is doing the piling up. Nothing more sophisticated is going on." }),

    /* ---------- 3. the dial ---------- */
    title({ n: 3, title: "The one knob that matters", tone: "amber", chapter: "The bandwidth dial",
      sub: "Kernel choice is second-order. Bandwidth is everything.",
      say: "Chapter three. The one knob that matters. Kernel choice is second order. Bandwidth is everything.", dur: 9 }),

    plot({ dur: 28, chapter: "The bandwidth dial",
      caption: "Turn $h$ **down** and each bump narrows to a spike. The estimate starts tracing **this particular sample** — including its accidents.",
      say: "Turn h down and each bump narrows to a spike. Watch what happens: the estimate starts tracing this particular sample, bump by bump, including all of its accidents. The dashed grey line is the truth. The red curve is chasing individual data points. Draw a fresh sample and this picture would change completely. That instability is what we mean by high variance.",
      note: "small $h$ → **low bias, high variance**",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-3.4, 3.4], y: [0, 0.62], W, H, pad: { l: 54, r: 22, t: 54, b: 38 } });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-3, -1.5, 0, 1.5, 3], ys: [], xfmt: (v) => v.toFixed(1) });
        a.bars(data.x.map((v) => [v, 0.03]), { color: P.muted, width: 1.4, alpha: 0.45 });
        a.line(data.grid.map((g, i) => [g, data.truth[i]]), { color: P.muted, width: 1.8, dash: [5, 4] });
        const h = lerp(0.4, 0.045, easeOut(clamp01(t / (dur * 0.7))));
        a.line(data.grid.map((g) => [g, kde(data.x, h, [g])[0]]), { color: P.red, width: 2.2 });
        a.chip(`h = ${h.toFixed(3)}`, a.L + 10, a.T + 16, { color: P.red, bg: "rgba(186,26,26,0.10)" });
      } }),

    plot({ dur: 28,
      caption: "Turn $h$ **up** and the two peaks melt into one. Stable across samples — and stably **wrong**. A real feature has been smoothed out of existence.",
      say: "Now turn h up instead, and watch the two peaks melt into a single mound. This estimate is beautifully stable — draw a new sample and you'd get almost the same curve. But it is stably wrong. A real feature of the distribution has just been smoothed out of existence. That systematic error is what we mean by high bias.",
      note: "large $h$ → **low variance, high bias**",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-3.4, 3.4], y: [0, 0.62], W, H, pad: { l: 54, r: 22, t: 54, b: 38 } });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-3, -1.5, 0, 1.5, 3], ys: [], xfmt: (v) => v.toFixed(1) });
        a.bars(data.x.map((v) => [v, 0.03]), { color: P.muted, width: 1.4, alpha: 0.45 });
        a.line(data.grid.map((g, i) => [g, data.truth[i]]), { color: P.muted, width: 1.8, dash: [5, 4] });
        const h = lerp(0.2, 1.6, easeOut(clamp01(t / (dur * 0.7))));
        a.line(data.grid.map((g) => [g, kde(data.x, h, [g])[0]]), { color: P.amber, width: 2.6 });
        a.chip(`h = ${h.toFixed(3)}`, a.L + 10, a.T + 16, { color: P.amber, bg: "rgba(194,129,10,0.12)" });
        if (h > 0.9) a.note("the second peak is gone", a.L + 10, a.T + 44, { color: P.amber, size: 11.5, weight: 600 });
      } }),

    /* ---------- 4. bias-variance ---------- */
    title({ n: 4, title: "Bias and variance", tone: "blue", chapter: "Bias and variance",
      sub: "The two failure modes, given names.",
      say: "Chapter four. Bias and variance — the two failure modes you've just watched, given their proper names.", dur: 8 }),

    formula({ dur: 26, chapter: "Bias and variance",
      heading: "Mean squared error splits cleanly in two",
      tex: "\\text{MSE}(\\widehat\\theta)=\\E\\big[(\\widehat\\theta-\\theta)^2\\big]=\\underbrace{\\text{bias}^2(\\widehat\\theta)}_{\\text{accuracy}}+\\underbrace{\\Var(\\widehat\\theta)}_{\\text{precision}}",
      notes: [
        "**Bias** $=\\E(\\widehat\\theta)-\\theta$: on average, how far off are you? This is **accuracy**.",
        "**Variance**: how much does the estimate jump around between samples? This is **precision**.",
        "MSE combines them — so a **more biased** estimator can still win, if it buys enough variance reduction.",
      ],
      say: "Mean squared error splits cleanly into two pieces. Bias is the expected value of your estimator minus the truth — on average, how far off are you. That's accuracy. Variance is how much the estimate jumps around between samples. That's precision. And mean squared error combines them, which means something important: a more biased estimator can still win overall, if it buys you enough reduction in variance." }),

    plot({ dur: 28,
      caption: "Both bad choices, side by side with a good one. Notice **where** they disagree most: in the **tails** — which is exactly the part of a return distribution we care about.",
      say: "Here are both bad choices side by side with a reasonable one. But notice where they disagree the most. Not in the middle, where there's plenty of data. In the tails. And the tails are precisely the part of a return distribution we care about, because that's where the crashes live. So the bandwidth choice does the most damage exactly where you were looking.",
      note: "the choices diverge in the tails — where the data is thinnest",
      draw({ ctx, W, H, t, dur, data, axes, fade }) {
        const a = axes(ctx, { x: [-3.4, 3.4], y: [0, 0.62], W, H, pad: { l: 54, r: 22, t: 54, b: 38 } });
        const f = fade(t, dur);
        a.grid(6, 4).frame();
        a.ticks({ xs: [-3, -1.5, 0, 1.5, 3], ys: [], xfmt: (v) => v.toFixed(1) });
        a.line(data.grid.map((g, i) => [g, data.truth[i]]), { color: P.muted, width: 2, dash: [5, 4] });
        a.line(data.grid.map((g) => [g, kde(data.x, 0.055, [g])[0]]), { color: P.red, width: 1.6, alpha: 0.8 });
        a.line(data.grid.map((g) => [g, kde(data.x, 1.2, [g])[0]]), { color: P.amber, width: 1.8, alpha: 0.85 });
        a.line(data.grid.map((g) => [g, kde(data.x, 0.3, [g])[0]]), { color: P.emerald, width: 2.8 });
        a.chip("h too small — noise", a.L + 10, a.T + 16, { color: P.red, bg: "rgba(186,26,26,0.10)", alpha: f });
        a.chip("h too large — blur", a.L + 10, a.T + 44, { color: P.amber, bg: "rgba(194,129,10,0.12)", alpha: f });
        a.chip("about right", a.L + 10, a.T + 72, { color: P.emerald, bg: "rgba(0,164,114,0.12)", alpha: f });
      } }),

    points({ dur: 26, heading: "The exam's favourite KDE question", tone: "blue",
      items: [
        "$h$ **too large** → too much smoothing → **low variance, high bias**. Stable, but misses real features.",
        "$h$ **too small** → too little smoothing → **high variance, low bias**. Catches real features *and* sampling accidents.",
        "The target for densities is the **integrated** MSE, $\\text{IMSE}_h=\\int\\E\\big[(\\widehat f_h(x)-f(x))^2\\big]dx$.",
        "Methods that pick $h$ — cross-validation, for instance — are minimising exactly that.",
      ],
      say: "This is the exam's favourite question from this module, so learn it in both directions. h too large means too much smoothing, which gives low variance and high bias: stable, but it misses real features. h too small means too little smoothing, giving high variance and low bias: it catches real features, but also sampling accidents. For densities the target is the integrated mean squared error, integrated across all x. And methods that pick h for you — cross validation, for instance — are minimising exactly that." }),

    points({ dur: 24, heading: "A warning about the default settings", tone: "amber",
      items: [
        "`scott` and `silverman` are **normal-reference** rules: they pick $h$ that would be optimal *if the data were normal*.",
        "Use one to test whether returns are normal and you have quietly assumed the answer.",
        "`ISJ` (improved Sheather-Jones) does not lean on that assumption, which is why it is the safer default here.",
      ],
      say: "And a warning about the default settings. Scott and Silverman are normal reference rules — they pick the bandwidth that would be optimal if the data were normal. So if you use one of them to test whether returns are normal, you have quietly assumed the answer you were trying to check. The improved Sheather Jones rule, ISJ, doesn't lean on that assumption, which is why it's the safer default for this particular job." }),

    code({ dur: 22, heading: "KDE in Python", file: "kde.py",
      body: `from KDEpy import FFTKDE

# FFTKDE uses a fast Fourier transform - much faster on big samples
x, y = FFTKDE(kernel="gaussian", bw="ISJ").fit(ldr).evaluate()

# bw can be a number, or "ISJ" / "scott" / "silverman"
# scott and silverman are *normal-reference* rules - careful`,
      say: "In Python, KDEpy's FFTKDE uses a fast Fourier transform, which is a significant speedup on large samples. The kernel defaults to Gaussian. For the bandwidth you can pass a number, or a method name. And remember the caveat about the normal reference rules." }),

    /* ---------- 5. the payoff ---------- */
    title({ n: 5, title: "The plot that convicts normality", tone: "emerald", chapter: "Convicting normality",
      sub: "Everything so far was setup. Here is what it is for.",
      say: "Chapter five. The plot that convicts normality. Everything so far has been setup. Here is what it's all for.", dur: 9 }),

    plot({ dur: 28, chapter: "Convicting normality",
      caption: "KDE of log returns against the best-fitting normal, on a **linear** axis. They look almost identical — and this plot proves nothing.",
      say: "Here's a kernel density estimate of log returns, drawn against the best fitting normal, on an ordinary linear axis. And they look almost identical. Which is exactly the problem. On a linear axis, both curves are crushed to essentially zero out in the tails, so the comparison you actually care about is invisible. This plot proves nothing.",
      note: "linear axis — the tails are crushed to zero",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-0.06, 0.06], y: [0, 90], W, H, pad: { l: 58, r: 22, t: 54, b: 38 } });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-0.05, 0, 0.05], ys: [0, 40, 80], xfmt: (v) => `${(v * 100).toFixed(0)}%`, yfmt: (v) => String(v) });
        const k = easeOut(clamp01(t / (dur * 0.55)));
        const est = data.rgrid.map((g) => [g, kde(data.ret, 0.0022, [g])[0]]);
        a.line(upTo(est, k), { color: P.blue, width: 2.6 });
        a.line(data.rgrid.map((g) => [g, normPdf(g / data.sd) / data.sd]), { color: P.ink, width: 2, dash: [5, 4] });
        a.note("empirical (KDE)", a.L + 10, a.T + 18, { color: P.blue, size: 12, weight: 700 });
        a.note("fitted normal", a.L + 10, a.T + 38, { color: P.ink, size: 12, weight: 600 });
      } }),

    plot({ dur: 30,
      caption: "Now put the **same two curves** on a logarithmic $y$-axis. The tails separate dramatically: the empirical curve sits **far above** the normal on both sides.",
      say: "Now put the very same two curves on a logarithmic y axis. A log axis expands small values, so the tails finally become visible — and look what happens. The empirical curve sits far above the normal on both sides. Those are real returns that the normal model says should essentially never occur. This is the single most convincing picture in the first half of the course, and it's the reason the second half exists.",
      note: "log axis — and the tails tell the truth",
      draw({ ctx, W, H, t, dur, data, axes }) {
        // draw on log10 of the density
        const lo = -3.2, hi = 2.0;
        const a = axes(ctx, { x: [-0.06, 0.06], y: [lo, hi], W, H, pad: { l: 62, r: 22, t: 54, b: 38 } });
        a.grid(6, 5).frame();
        a.ticks({ xs: [-0.05, 0, 0.05], ys: [-3, -2, -1, 0, 1, 2],
          xfmt: (v) => `${(v * 100).toFixed(0)}%`, yfmt: (v) => `10^${v}` });
        const safe = (v) => Math.log10(Math.max(v, 1e-6));
        const k = easeOut(clamp01(t / (dur * 0.5)));
        const nrmPts = data.rgrid.map((g) => [g, safe(normPdf(g / data.sd) / data.sd)]);
        a.line(nrmPts, { color: P.ink, width: 2, dash: [5, 4] });
        const est = data.rgrid.map((g) => [g, safe(kde(data.ret, 0.0022, [g])[0])]);
        a.line(upTo(est, k), { color: P.blue, width: 2.8 });
        if (k > 0.9) {
          a.note("empirical far above normal", a.sx(-0.058), a.sy(-1.1), { color: P.red, size: 11.5, weight: 700 });
          a.note("→ fat tails", a.sx(0.026), a.sy(-1.1), { color: P.red, size: 11.5, weight: 700 });
        }
      } }),

    /* ---------- recap ---------- */
    recap({ dur: 30, items: [
      "A KDE drops one **bump** per data point and adds them up — no assumed shape.",
      "The **kernel** barely matters. The **bandwidth** $h$ decides everything.",
      "$h$ too small → high variance (you fit the sample's accidents). $h$ too large → high bias (real features vanish).",
      "MSE $=$ bias$^2+$ variance, so accepting bias to kill variance can be the better trade.",
      "Plot the KDE of returns against a normal on a **log $y$-axis** — that is the plot that shows the fat tails.",
    ],
    say: "To recap. A kernel density estimate drops one bump per data point and adds them up, with no assumed shape. The kernel barely matters; the bandwidth decides everything. Too small and you get high variance, fitting the sample's accidents. Too large and you get high bias, and real features vanish. Mean squared error is bias squared plus variance, so accepting some bias to kill variance can be the better trade. And finally: plot the density of returns against a normal on a logarithmic y axis. That is the plot that reveals the fat tails." }),
  ],
});
