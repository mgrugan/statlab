/* f3 — Brownian Motion and Geometric Brownian Motion (full lecture) */

import { PALETTE as P, linspace, gbmPath, normals, clamp01, easeOut, lerp } from "@/lib/anim";
import { compile, title, jargon, points, formula, derive, plot, code, recap, revealed } from "@/lib/scenes";
import { pc, upTo } from "./shared";

const D = (() => {
  const nu = 0.05, sigma = 0.22;
  const path = gbmPath({ S0: 100, nu, sigma, T: 1, n: 252, seed: 19 });
  const many = Array.from({ length: 28 }, (_, i) =>
    gbmPath({ S0: 100, nu, sigma, T: 1, n: 252, seed: 100 + i * 7 }));
  // a standard Brownian motion for the early chapters
  const nrm = normals(55);
  const w = [0];
  for (let i = 1; i <= 300; i++) w.push(w[i - 1] + nrm() / Math.sqrt(300));
  return { nu, sigma, mu: nu + sigma * sigma / 2, path, many, w };
})();

export default compile({
  id: "f3",
  title: "Brownian Motion and Geometric Brownian Motion",
  blurb: "The model of how a price moves through time — built from scratch, one assumption at a time, and then taken apart to see what each assumption is really claiming.",
  takeaway: "GBM is one sentence: the log of the price is a straight line with noise piled on, and the noise accumulates forever. Every one of the six properties follows from it.",
  data: D,
  scenes: [

    /* ---------- 1. stochastic processes ---------- */
    title({ n: 1, title: "A random variable that moves", tone: "slate", chapter: "Processes and paths",
      sub: "Until now, one number. Now, a whole history.",
      say: "Chapter one. A random variable that moves. Until now we've dealt with one number. Now we need a whole history.", dur: 8 }),

    jargon({ dur: 20, term: "Stochastic process", chapter: "Processes and paths",
      plain: "A **collection of random variables indexed by time**. Instead of one uncertain number, you have an uncertain number at every instant.",
      formal: "Written $\\{S(t)\\}$. The word *stochastic* just means *random* — it is Greek dressing on an ordinary idea.",
      say: "A stochastic process is a collection of random variables indexed by time. Instead of one uncertain number, you have an uncertain number at every instant. We write it as S of t in curly braces. And the word stochastic just means random — it's Greek dressing on an ordinary idea." }),

    jargon({ dur: 18, term: "Realization, or path",
      plain: "**One** outcome of the whole process — a single line you could actually draw. The process is the set of all possible lines; a path is one of them.",
      formal: "The market only ever shows you **one** path. Every statistical problem in this course comes from that fact.",
      say: "A realization, also called a path, is one outcome of the whole process. A single line you could actually draw. The process is the set of all possible lines; a path is just one of them. And here's the difficulty that defines this whole course: the market only ever shows you one path." }),

    /* ---------- 2. Brownian motion ---------- */
    title({ n: 2, title: "Standard Brownian motion", tone: "blue", chapter: "Brownian motion",
      sub: "The simplest honest model of a wandering quantity.",
      say: "Chapter two. Standard Brownian motion — the simplest honest model of a quantity that wanders.", dur: 7 }),

    formula({ dur: 26, chapter: "Brownian motion",
      heading: "$\\{W(t)\\}$ is a standard Brownian motion when",
      tex: "W(0)=0,\\qquad W(t)-W(s)\\sim N(0,\\,t-s),\\qquad \\text{increments on disjoint intervals are independent}",
      notes: [
        "**Starts at zero.** A convention, not a restriction — shift it wherever you like.",
        "**Increments are normal**, with variance equal to the **elapsed time**. Wait twice as long, get twice the variance.",
        "**Disjoint increments are independent.** What happened last week tells you nothing about this week's move.",
        "Paths are continuous — no teleporting — but nowhere differentiable, so there is no such thing as the velocity of a price.",
      ],
      say: "A standard Brownian motion is defined by three things. It starts at zero — a convention, not a restriction. Its increments are normal, with variance equal to the elapsed time, so waiting twice as long gives twice the variance. And increments over disjoint intervals are independent, meaning what happened last week tells you nothing about this week's move. One extra fact worth knowing: the paths are continuous — no teleporting — but nowhere differentiable. So there is no such thing as the velocity of a price." }),

    plot({ dur: 26,
      caption: "Watch one being built. Each step adds an independent normal nudge to wherever we already are. Nothing pulls it back — it has **no memory and no home**.",
      say: "Watch one being built. Each step adds an independent normal nudge to wherever we already are. Notice that nothing pulls it back toward zero. It has no memory and no home. Where it goes next depends only on where it is now, never on where it has been.",
      note: "each step: an independent normal nudge, added to the level",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 1], y: [-2.4, 2.4], W, H, pad: { l: 54, r: 22, t: 54, b: 38 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 0.5, 1], ys: [-2, 0, 2], xfmt: (v) => v.toFixed(1), yfmt: (v) => v.toFixed(0) });
        a.hline(0, { color: P.grid, dash: null });
        const n = Math.max(2, revealed(t, dur, data.w.length, { start: 0.02, end: 0.85 }));
        const pts = data.w.slice(0, n).map((v, i) => [i / (data.w.length - 1), v]);
        a.line(pts, { color: P.blue, width: 2 });
        a.dots([pts[pts.length - 1]], { color: P.blue, r: 4 });
        a.chip(`step ${n} of ${data.w.length}`, a.R - 10, a.T + 16, { align: "right" });
      } }),

    plot({ dur: 24,
      caption: "Because variance grows **linearly in time**, the spread of possible paths grows like $\\sqrt{t}$ — a cone with curved sides, not straight ones.",
      say: "Because variance grows linearly in time, the standard deviation grows like the square root of time. So the spread of possible paths is a cone with curved sides, not straight ones. Looking four times further ahead makes you only twice as uncertain. That single fact will come back in almost every module from here.",
      note: "the $\\pm2\\sqrt{t}$ cone — uncertainty grows, but lazily",
      draw({ ctx, W, H, t, dur, axes }) {
        const a = axes(ctx, { x: [0, 1], y: [-2.6, 2.6], W, H, pad: { l: 54, r: 22, t: 54, b: 38 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 0.5, 1], ys: [-2, 0, 2], xfmt: (v) => v.toFixed(1), yfmt: (v) => v.toFixed(0) });
        a.hline(0, { color: P.grid, dash: null });
        const k = easeOut(clamp01(t / (dur * 0.5)));
        const hi = linspace(0, 1, 70).map((x) => [x, 2 * Math.sqrt(x) * k]);
        const lo = linspace(1, 0, 70).map((x) => [x, -2 * Math.sqrt(x) * k]);
        a.area([...hi, ...lo], -2.6, { color: "rgba(33,112,228,0.08)" });
        a.line(hi, { color: P.blue, width: 1.6, dash: [5, 4] });
        a.line(lo.slice().reverse(), { color: P.blue, width: 1.6, dash: [5, 4] });
        // a few sample paths inside it
        const nrm = normals(9);
        for (let p = 0; p < 6; p++) {
          let v = 0; const pts = [[0, 0]];
          for (let i = 1; i <= 120; i++) { v += nrm() / Math.sqrt(120); pts.push([i / 120, v]); }
          a.line(pts, { color: P.blue, width: 1, alpha: 0.28 });
        }
        if (k > 0.7) a.note("±2√t", a.sx(0.84), a.sy(2 * Math.sqrt(0.84)) - 14, { color: P.blue, size: 12.5, weight: 700 });
      } }),

    points({ dur: 24, heading: "The trap: independent *increments* $\\ne$ independent *values*", tone: "amber",
      items: [
        "$W(5)-W(4)$ and $W(9)-W(8)$ are independent. Those are **increments** over disjoint intervals.",
        "$W(5)$ and $W(9)$ are **not** independent — $W(9)$ literally contains $W(5)$ inside it.",
        "In fact $\\Cov\\big(W(s),W(t)\\big)=\\min(s,t)$. Highly dependent, and the exam checks you know the difference.",
      ],
      say: "Here's a trap worth pausing on. Independent increments does not mean independent values. W of five minus W of four, and W of nine minus W of eight, are independent — those are increments over disjoint intervals. But W of five and W of nine are absolutely not independent, because W of nine literally contains W of five inside it. In fact the covariance of W at s and W at t is the minimum of s and t. Highly dependent. The exam checks that you know the difference." }),

    code({ dur: 20, heading: "Simulating a Brownian motion", file: "bm.py",
      body: `import numpy as np

n, T = 1000, 1.0
dt = T / n

# increments are N(0, dt); the path is their running sum
dW = np.random.normal(0, np.sqrt(dt), n)
W  = np.concatenate([[0], np.cumsum(dW)])`,
      say: "Simulating one is three lines. Draw the increments as normals with variance dt, then take the cumulative sum. The concatenate just pins the start at zero. Note the standard deviation is the square root of dt, not dt — getting that wrong is the most common simulation bug." }),

    /* ---------- 3. drift and scaling ---------- */
    title({ n: 3, title: "Adding drift and scale", tone: "blue", chapter: "Drift and scale",
      sub: "Two knobs turn a wanderer into a model.",
      say: "Chapter three. Adding drift and scale. Two knobs turn an aimless wanderer into something you can actually fit to data.", dur: 8 }),

    formula({ dur: 22, chapter: "Drift and scale",
      heading: "Brownian motion with drift $\\nu$ and volatility $\\sigma$",
      tex: "B(t)=\\nu t+\\sigma W(t)",
      notes: [
        "$\\nu t$ is a **straight line** — the trend, growing steadily with time.",
        "$\\sigma W(t)$ is the **noise**, scaled up or down by $\\sigma$.",
        "So $B(t)\\sim N(\\nu t,\\ \\sigma^2t)$: mean grows with $t$, variance grows with $t$, SD grows with $\\sqrt{t}$.",
      ],
      say: "Brownian motion with drift and volatility is just the wanderer plus a straight line. Nu t is the trend, growing steadily with time. Sigma times W of t is the noise, scaled up or down by sigma. Put them together and B of t is normal, with mean nu t and variance sigma squared t. So the mean grows with t, the variance grows with t, and the standard deviation grows with the square root of t." }),

    /* ---------- 4. GBM ---------- */
    title({ n: 4, title: "Geometric Brownian motion", tone: "emerald", chapter: "Geometric Brownian motion",
      sub: "One exponential away from a price model.",
      say: "Chapter four. Geometric Brownian motion. We are one exponential away from an actual price model.", dur: 7 }),

    formula({ dur: 24, chapter: "Geometric Brownian motion", tone: "emerald",
      heading: "Exponentiate, and you have a price",
      tex: "S(t)=S(0)\\,e^{B(t)}=S(0)\\,e^{\\nu t+\\sigma W(t)},\\qquad \\mu\\equiv\\nu+\\tfrac{\\sigma^2}{2}",
      notes: [
        "The randomness lives in the **exponent**, so the price is always positive.",
        "Take logs and it collapses to $\\log S(t)=\\log S(0)+\\nu t+\\sigma W(t)$ — a straight line plus noise.",
        "**Every GBM question becomes easy the moment you take logs.** That is the single most useful exam tactic in this module.",
      ],
      say: "Exponentiate a Brownian motion with drift, and you have a price. Because the randomness lives in the exponent, the price is always positive. And if you take logs, the whole thing collapses to: log S of t equals log S of zero, plus nu t, plus sigma W of t. A straight line plus noise. Every GBM question becomes easy the moment you take logs — that is the single most useful exam tactic in this module." }),

    plot({ dur: 26,
      caption: "Same path, two scales. On the **log** scale it is a straight line with noise. Exponentiate and the symmetric spread becomes **lopsided** — squashed at the bottom, stretched at the top.",
      say: "Here's the same path on both scales. On the log scale it's a straight line with noise piled on, perfectly symmetric about the trend. Now exponentiate. The symmetric spread becomes lopsided — squashed against zero at the bottom, stretched out at the top. Nothing about the randomness changed. Only the scale you're looking at it on.",
      note: "top: log scale · bottom: dollars",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const top = { l: 56, r: 22, t: 46, b: H / 2 + 10 };
        const bot = { l: 56, r: 22, t: H / 2 + 16, b: 34 };
        const p = data.path;
        const k = clamp01(t / (dur * 0.8));
        const n = Math.max(2, Math.round(252 * easeOut(k)));
        const A = axes(ctx, { x: [0, 1], y: [-0.4, 0.5], W, H, pad: top });
        A.grid(5, 3).frame(); A.ticks({ ys: [-0.3, 0, 0.3], yfmt: (v) => v.toFixed(1) });
        A.line([[0, 0], [1, data.nu]], { color: P.amber, width: 1.8, dash: [6, 4] });
        A.line(p.t.slice(0, n).map((tt, i) => [tt, p.logS[i] - p.logS[0]]), { color: P.blue, width: 2 });
        A.note("log S(t)", A.L + 8, A.T + 14, { color: P.blue, size: 11.5, weight: 700 });

        const B = axes(ctx, { x: [0, 1], y: [60, 165], W, H, pad: bot });
        B.grid(5, 3).frame();
        B.ticks({ xs: [0, 0.5, 1], ys: [80, 120, 160], xfmt: (v) => `${(v * 12).toFixed(0)}m`, yfmt: (v) => `$${v}` });
        B.hline(100, { color: P.grid, dash: null });
        B.line(p.t.slice(0, n).map((tt, i) => [tt, p.S[i]]), { color: P.emerald, width: 2 });
        B.note("S(t)", B.L + 8, B.T + 14, { color: P.emerald, size: 11.5, weight: 700 });
      } }),

    points({ dur: 26, heading: "The six properties — in ratios, not differences", tone: "emerald",
      items: [
        "$S(t)$ is **lognormal** for each fixed $t$.",
        "$S(t_2)/S(t_1)$ is lognormal, and $\\log\\big(S(t_2)/S(t_1)\\big)$ is **normal**.",
        "Ratios over **disjoint** intervals are independent.",
        "$\\log\\big(S(t_2)/S(t_1)\\big)\\sim N\\big(\\nu(t_2-t_1),\\ \\sigma^2(t_2-t_1)\\big)$ — it depends only on **elapsed time**.",
      ],
      say: "The six properties all say the same thing: GBM is well behaved in ratios, not in differences. S of t is lognormal for each fixed t. The ratio of the price at two times is lognormal, so its log is normal. Ratios over disjoint intervals are independent. And the distribution of a log ratio depends only on the elapsed time between the two dates — not on when they are, and not on the starting price." }),

    points({ dur: 22, heading: "The corresponding trap", tone: "amber",
      items: [
        "$S(t_2)-S(t_1)$ is **not** normal and **not** lognormal. A difference of two lognormals is neither.",
        "Ask for the distribution of a **difference** of prices and the honest answer is: it does not have a nice one.",
        "Whenever a GBM question looks hard, check whether you are reaching for a difference where the model only promises a ratio.",
      ],
      say: "And here's the corresponding trap. The difference of two prices is not normal, and it is not lognormal either. A difference of two lognormals is neither. If someone asks for the distribution of a difference of prices, the honest answer is that it doesn't have a nice one. Whenever a GBM question looks hard, check whether you're reaching for a difference where the model only promises you a ratio." }),

    derive({ dur: 28, heading: "Why the log turns ratios into differences",
      lines: [
        ["\\log\\!\\Big(\\tfrac{S(t_2)}{S(t_1)}\\Big)=\\log S(t_2)-\\log S(t_1)", "logs turn division into subtraction"],
        ["=\\big(\\log S(0)+B(t_2)\\big)-\\big(\\log S(0)+B(t_1)\\big)", "substitute the definition"],
        ["=B(t_2)-B(t_1)", "$\\log S(0)$ cancels — the starting price is irrelevant"],
        ["=\\nu(t_2-t_1)+\\sigma\\big(W(t_2)-W(t_1)\\big)", "expand the drift"],
        ["\\sim N\\big(\\nu(t_2-t_1),\\,\\sigma^2(t_2-t_1)\\big)", "a Brownian increment, by definition"],
      ],
      say: "Here's why the log ratio behaves so well. Logs turn division into subtraction. Substitute the definition of the price, and log S of zero cancels — which is why the starting price never appears in any of these answers. What's left is a plain Brownian increment, which by definition is normal with mean nu times the elapsed time and variance sigma squared times the elapsed time." }),

    /* ---------- 5. nu vs mu ---------- */
    title({ n: 5, title: "Two different drifts", tone: "amber", chapter: "$\\nu$ versus $\\mu$",
      sub: "The distinction the exam loves, and everyone confuses.",
      say: "Chapter five. Two different drifts. This is the distinction the exam loves, and almost everyone confuses it at least once.", dur: 8 }),

    derive({ dur: 26, heading: "Where $\\mu=\\nu+\\sigma^2/2$ comes from", chapter: "$\\nu$ versus $\\mu$",
      lines: [
        ["S(t)\\ \\text{is lognormal}\\big(\\log S(0)+\\nu t,\\ \\sigma^2t\\big)", "property 4"],
        ["\\E(S(t))=\\exp\\!\\big(\\log S(0)+\\nu t+\\tfrac{\\sigma^2t}{2}\\big)", "the lognormal mean from module 2"],
        ["=S(0)\\exp\\!\\big((\\nu+\\tfrac{\\sigma^2}{2})t\\big)", "collect the $t$ terms"],
        ["=S(0)e^{\\mu t},\\qquad \\mu=\\nu+\\tfrac{\\sigma^2}{2}", "and that *defines* $\\mu$"],
      ],
      say: "Where does mu equal nu plus sigma squared over two come from? Property four says S of t is lognormal with those parameters. Apply the lognormal mean formula from module two. Collect the terms in t. And what falls out is that the expected price grows at rate mu, where mu is nu plus sigma squared over two. That equation defines mu — it isn't an extra assumption." }),

    plot({ dur: 26,
      caption: "Twenty-eight paths, with both drifts drawn. The **median** path grows at $\\nu=5\\%$; the **mean** grows at $\\mu=7.4\\%$. The gap is pure volatility.",
      say: "Here are twenty eight paths with both drifts drawn on top. The median path grows at nu, five percent. But the mean grows at mu, seven point four percent. The gap between those two lines is pure volatility — it comes from nothing but the spread. A stock with zero log drift would still have a rising average price. That is not free money; it's an artifact of measuring gains multiplicatively.",
      note: "mean grows at $\\mu$ · median grows at $\\nu$ · the gap is $\\sigma^2/2$",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 1], y: [55, 190], W, H, pad: { l: 58, r: 22, t: 54, b: 38 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 0.5, 1], ys: [60, 100, 140, 180], xfmt: (v) => `${(v * 12).toFixed(0)}m`, yfmt: (v) => `$${v}` });
        const n = revealed(t, dur, data.many.length, { start: 0.02, end: 0.5 });
        for (let i = 0; i < n; i++) {
          const p = data.many[i];
          a.line(p.t.map((tt, j) => [tt, p.S[j]]), { color: P.emerald, width: 1, alpha: 0.26 });
        }
        const k = clamp01((t / dur - 0.45) * 3);
        if (k > 0) {
          a.line(linspace(0, 1, 60).map((tt) => [tt, 100 * Math.exp(data.mu * tt)]), { color: P.emerald, width: 2.8, alpha: k });
          a.line(linspace(0, 1, 60).map((tt) => [tt, 100 * Math.exp(data.nu * tt)]), { color: P.amber, width: 2.4, dash: [6, 4], alpha: k });
          a.chip(`mean  μ = ${pc(data.mu)}`, a.L + 10, a.T + 16, { color: P.emerald, bg: "rgba(0,164,114,0.12)", alpha: k });
          a.chip(`median  ν = ${pc(data.nu)}`, a.L + 10, a.T + 44, { color: P.amber, bg: "rgba(194,129,10,0.12)", alpha: k });
        }
      } }),

    /* ---------- recap ---------- */
    recap({ dur: 30, items: [
      "A **stochastic process** is a random variable at every time; a **path** is one realization — and the market shows you exactly one.",
      "Brownian motion: starts at zero, normal increments with variance = elapsed time, independent over disjoint intervals.",
      "Independent **increments** $\\ne$ independent **values**: $\\Cov(W(s),W(t))=\\min(s,t)$.",
      "GBM says $\\log S(t)$ is a straight line plus noise. Take logs and every question gets easy.",
      "$\\nu$ is the drift of the **log**; $\\mu=\\nu+\\sigma^2/2$ is the drift of the **price**. They are different numbers.",
    ],
    say: "To recap. A stochastic process is a random variable at every time, and a path is one realization — the market shows you exactly one. Brownian motion starts at zero, has normal increments whose variance is the elapsed time, and those increments are independent over disjoint intervals. But independent increments does not mean independent values. Geometric Brownian motion says the log price is a straight line plus noise, so take logs and every question gets easy. And finally: nu is the drift of the log, mu is the drift of the price, and they are different numbers." }),
  ],
});
