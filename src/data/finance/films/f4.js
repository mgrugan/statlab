/* f4 — Log Returns and Simple Returns (full lecture) */

import { PALETTE as P, linspace, normals, normPdf, moments, clamp01, easeOut, lerp } from "@/lib/anim";
import { compile, title, jargon, points, formula, derive, plot, code, recap, revealed } from "@/lib/scenes";
import { pc, upTo } from "./shared";

const D = (() => {
  const sd = 0.02, nu = 0.0003;
  const nrm = normals(31);
  const daily = Array.from({ length: 504 }, () => nu + sd * nrm());
  const cum = [];
  daily.reduce((a, v) => { const n = a + v; cum.push(n); return n; }, 0);
  // 21-day (monthly) sums of the same shocks
  const monthly = [];
  for (let i = 0; i + 21 <= daily.length; i += 21)
    monthly.push(daily.slice(i, i + 21).reduce((a, v) => a + v, 0));
  const P0 = 100;
  return {
    sd, nu, daily, cum, monthly, P0,
    ann: sd * Math.sqrt(252), wrong: sd * 252,
    mDaily: moments(daily), mMonthly: moments(monthly),
  };
})();

export default compile({
  id: "f4",
  title: "Log Returns and Simple Returns",
  blurb: "Why every model in this course works in logs, the one arithmetic error the exam is guaranteed to test, and the beautiful argument for normality that the data refuses to cooperate with.",
  takeaway: "Log returns **add** across time. That single property gives you the telescoping sum, the $\\sqrt{k}$ scaling law, and the central limit argument — and it is why nobody models simple returns.",
  data: D,
  scenes: [

    /* ---------- 1. what a return is ---------- */
    title({ n: 1, title: "Prices are not the interesting object", tone: "slate", chapter: "Returns, not prices",
      sub: "Returns are. And there are two kinds.",
      say: "Chapter one. Prices are not the interesting object. Returns are. And there are two different kinds of them.", dur: 8 }),

    points({ dur: 22, heading: "Why model returns rather than prices?", chapter: "Returns, not prices",
      items: [
        "A \\$1 move means something completely different for a \\$20 stock and a \\$2000 one. Returns are **comparable**; prices are not.",
        "Prices wander off without limit. Returns hover around zero — much better behaved statistically.",
        "And the model we built in module 3 is a statement about **ratios** of prices, which is exactly what a return is.",
      ],
      say: "Why model returns rather than prices? Three reasons. First, a one dollar move means something completely different for a twenty dollar stock than for a two thousand dollar one, so returns are comparable where prices are not. Second, prices wander off without limit, while returns hover around zero — far better behaved statistically. And third, the model we built in module three is a statement about ratios of prices, and a ratio of prices is exactly what a return is." }),

    jargon({ dur: 18, term: "Simple return",
      plain: "The percentage change you would quote to a human. *“The stock is up 3% today.”*",
      formal: "$R_t=\\dfrac{P_t-P_{t-1}}{P_{t-1}}=\\dfrac{P_t}{P_{t-1}}-1$. Intuitive, and it is what your brokerage shows you.",
      say: "A simple return is the percentage change you'd quote to a human. The stock is up three percent today. It's the price change divided by the starting price. Intuitive, and it's what your brokerage app shows you." }),

    jargon({ dur: 20, term: "Log return",
      plain: "The **logarithm** of the price ratio. Slightly less intuitive to say out loud, and enormously more convenient to do mathematics with.",
      formal: "$r_t=\\log\\!\\big(P_t/P_{t-1}\\big)=\\log P_t-\\log P_{t-1}$.",
      say: "A log return is the logarithm of the price ratio. It's slightly less intuitive to say out loud, and enormously more convenient to do mathematics with. And notice the second form: the log of a ratio is a difference of logs. That is the property everything else in this module rests on." }),

    plot({ dur: 26,
      caption: "For small moves the two are nearly identical — $\\log(1+x)\\approx x$. They only diverge for large moves, and they diverge **asymmetrically**.",
      say: "For small moves the two are nearly identical, because log of one plus x is approximately x. They only start to diverge for large moves — and they diverge asymmetrically. A log return can go to minus infinity as the price approaches zero, while a simple return stops dead at minus one hundred percent. That bounded downside is exactly what made simple returns awkward to model.",
      note: "$\\log(1+x)\\approx x$ near zero · they part company in the tails",
      draw({ ctx, W, H, t, dur, axes }) {
        const a = axes(ctx, { x: [-0.6, 0.6], y: [-0.9, 0.6], W, H, pad: { l: 58, r: 22, t: 54, b: 38 } });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-0.5, -0.25, 0, 0.25, 0.5], ys: [-0.75, -0.25, 0.25], xfmt: (v) => pc(v, 0), yfmt: (v) => pc(v, 0) });
        a.hline(0, { color: P.grid, dash: null });
        a.vline(0, { color: P.grid, dash: null });
        const k = easeOut(clamp01(t / (dur * 0.55)));
        const xs = linspace(-0.6, 0.6, 160);
        a.line(xs.map((x) => [x, x]), { color: P.blue, width: 2.2, dash: [5, 4] });
        a.line(upTo(xs.map((x) => [x, Math.log(1 + x)]), k), { color: P.emerald, width: 2.8 });
        a.note("simple return", a.sx(0.34), a.sy(0.42), { color: P.blue, size: 12, weight: 700 });
        a.note("log return", a.sx(0.34), a.sy(0.2), { color: P.emerald, size: 12, weight: 700 });
        if (k > 0.85) a.note("log return dives; simple return floors at −100%", a.L + 10, a.B - 18, { color: P.muted, size: 11.5 });
      } }),

    /* ---------- 2. telescoping ---------- */
    title({ n: 2, title: "The property that decides everything", tone: "emerald", chapter: "Log returns add",
      sub: "Log returns add across time. Simple returns do not.",
      say: "Chapter two. The property that decides everything. Log returns add across time. Simple returns do not.", dur: 9 }),

    derive({ dur: 26, heading: "The $k$-period log return telescopes", chapter: "Log returns add",
      lines: [
        ["r_t(k)=\\log\\!\\Big(\\tfrac{P_t}{P_{t-k}}\\Big)", "the return over $k$ periods"],
        ["=\\log P_t-\\log P_{t-k}", "log of a ratio"],
        ["=\\sum_{i=0}^{k-1}\\big(\\log P_{t-i}-\\log P_{t-i-1}\\big)", "insert and cancel the intermediate logs"],
        ["=r_t+r_{t-1}+\\cdots+r_{t-k+1}", "each bracket is a one-period log return"],
      ],
      say: "Watch the k period log return telescope. Write it as a log of a ratio, which is a difference of logs. Now insert all the intermediate log prices and subtract them straight back off — every one cancels with its neighbour. What's left is a plain sum of one period log returns. The multi period return is literally the sum of the daily ones. Simple returns give you a product of one plus R terms instead, which is far nastier." }),

    plot({ dur: 26,
      caption: "Because they add, the running total of daily log returns **is** the cumulative return. No compounding bookkeeping, no products — just a sum.",
      say: "Because they add, the running total of daily log returns is the cumulative return. No compounding bookkeeping, no products to keep track of — just a sum. And that is why every model in this course is written in logs. Sums of random variables are something statistics knows how to handle. Products are not.",
      note: "running sum of daily log returns = the cumulative return",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const top = { l: 58, r: 22, t: 46, b: H / 2 + 10 };
        const bot = { l: 58, r: 22, t: H / 2 + 16, b: 34 };
        const n = Math.max(2, revealed(t, dur, 504, { start: 0.02, end: 0.9 }));
        const A = axes(ctx, { x: [0, 504], y: [-0.07, 0.07], W, H, pad: top });
        A.grid(5, 3).frame(); A.ticks({ ys: [-0.05, 0, 0.05], yfmt: (v) => pc(v, 0) });
        A.hline(0, { color: P.grid, dash: null });
        A.bars(data.daily.slice(0, n).map((v, i) => [i, v]), { color: P.blue, width: 1, alpha: 0.7 });
        A.note("daily log returns", A.L + 8, A.T + 14, { color: P.blue, size: 11.5, weight: 700 });

        const B = axes(ctx, { x: [0, 504], y: [-0.5, 0.5], W, H, pad: bot });
        B.grid(5, 3).frame();
        B.ticks({ xs: [0, 252, 504], ys: [-0.3, 0, 0.3], yfmt: (v) => pc(v, 0) });
        B.hline(0, { color: P.grid, dash: null });
        B.line(data.cum.slice(0, n).map((v, i) => [i, v]), { color: P.emerald, width: 2.2 });
        B.note("their running sum", B.L + 8, B.T + 14, { color: P.emerald, size: 11.5, weight: 700 });
      } }),

    formula({ dur: 22, tone: "emerald",
      heading: "And under GBM, that sum has a known distribution",
      tex: "r_t(k)\\sim N\\big(\\nu k,\\ \\sigma^2 k\\big)",
      notes: [
        "It is a Brownian increment over $k$ periods — module 3, property 4.",
        "**Mean scales with $k$. Variance scales with $k$. So the standard deviation scales with $\\sqrt{k}$.**",
        "That last step is where almost every arithmetic mistake in this course happens.",
      ],
      say: "And under geometric Brownian motion, that sum has a known distribution. It's normal, with mean nu k and variance sigma squared k, because it's just a Brownian increment over k periods. Now read the scaling carefully. The mean scales with k. The variance scales with k. So the standard deviation scales with the square root of k. That last step is where almost every arithmetic mistake in this course happens." }),

    /* ---------- 3. sqrt k ---------- */
    title({ n: 3, title: "$\\sqrt{k}$, not $k$", tone: "amber", chapter: "Scaling with $\\sqrt{k}$",
      sub: "The single most-tested piece of arithmetic in the module.",
      say: "Chapter three. Square root of k, not k. This is the single most tested piece of arithmetic in the module.", dur: 8 }),

    derive({ dur: 24, heading: "Why the square root appears at all", chapter: "Scaling with $\\sqrt{k}$",
      lines: [
        ["\\Var\\Big(\\sum_{i=1}^{k}r_i\\Big)=\\sum_{i=1}^{k}\\Var(r_i)", "independence — variances add"],
        ["=k\\sigma^2", "identically distributed"],
        ["\\text{SD}=\\sqrt{k\\sigma^2}=\\sigma\\sqrt{k}", "take the square root to get back to the original units"],
      ],
      say: "Here's why the square root appears at all. Variances add when the terms are independent — that's the step that needs the model. So the variance over k periods is k sigma squared. Then take the square root to get back to the original units, and you have sigma root k. There's no finance in that last step. It's a units conversion. Standard deviations simply don't add, because a square root doesn't distribute over a sum." }),

    plot({ dur: 28,
      caption: "Here is the difference drawn. Multiplying by $k$ gives the straight red cone. The truth is the green $\\sqrt{k}$ curve — **far** narrower, and the real path stays comfortably inside it.",
      say: "Here's the difference drawn out. Multiplying the standard deviation by k gives you the straight red cone. The truth is the green square root curve, and it is far narrower. Watch the actual simulated path: it stays comfortably inside the green envelope. The red one isn't just wrong, it's wrong by an enormous margin. Over k days some shocks are up and some are down, and they partly cancel. That cancellation is exactly the gap between the two curves.",
      note: "red: $\\sigma k$ (wrong) · green: $\\sigma\\sqrt{k}$ (right)",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 504], y: [-1.1, 1.1], W, H, pad: { l: 58, r: 22, t: 54, b: 38 } });
        a.grid(6, 4).frame();
        a.ticks({ xs: [0, 252, 504], ys: [-0.8, 0, 0.8], yfmt: (v) => pc(v, 0) });
        a.hline(0, { color: P.grid, dash: null });
        const k = easeOut(clamp01(t / (dur * 0.5)));
        const xs = linspace(0, 504 * k, 80);
        a.line(xs.map((d) => [d, data.sd * d]), { color: P.red, width: 2, dash: [6, 4] });
        a.line(xs.map((d) => [d, -data.sd * d]), { color: P.red, width: 2, dash: [6, 4] });
        a.line(xs.map((d) => [d, data.sd * Math.sqrt(d)]), { color: P.emerald, width: 2.6 });
        a.line(xs.map((d) => [d, -data.sd * Math.sqrt(d)]), { color: P.emerald, width: 2.6 });
        a.line(data.cum.map((v, i) => [i, v]), { color: P.blue, width: 1.5, alpha: 0.8 });
        if (k > 0.5) {
          a.note("σ·k", a.sx(430), a.sy(0.92), { color: P.red, size: 12.5, weight: 700 });
          a.note("σ·√k", a.sx(430), a.sy(0.3), { color: P.emerald, size: 12.5, weight: 700 });
        }
      } }),

    formula({ dur: 26, tone: "amber",
      heading: "The number you will be asked for",
      tex: "\\underbrace{0.02\\times252=5.04}_{\\text{504\\%} \\;\\text{— nonsense}}\\qquad\\text{vs}\\qquad \\underbrace{0.02\\sqrt{252}\\approx0.317}_{\\text{about 32\\% — plausible}}",
      notes: [
        "A 2% **daily** standard deviation annualizes to roughly **32%**, a perfectly ordinary equity volatility.",
        "Multiplying by 252 claims the stock moves 504% a year. Nothing does.",
        "**Sanity check:** if your annualized volatility exceeds 100%, you multiplied by $k$.",
      ],
      say: "Here's the number you will be asked for. Two percent times two hundred and fifty two is five point oh four — that's five hundred and four percent a year, which is nonsense. Nothing moves like that. The correct calculation, two percent times the square root of two fifty two, gives about thirty two percent. A perfectly ordinary equity volatility. Keep this sanity check: if your annualized volatility comes out above one hundred percent, you multiplied by k." }),

    /* ---------- 4. the CLT argument ---------- */
    title({ n: 4, title: "Should returns be normal?", tone: "blue", chapter: "The CLT argument",
      sub: "A genuinely good argument — and the data's reply.",
      say: "Chapter four. Should returns be normal? There's a genuinely good argument that they should be. Then we'll hear the data's reply.", dur: 9 }),

    points({ dur: 24, heading: "The central limit argument", chapter: "The CLT argument", tone: "blue",
      items: [
        "Fix an interval — say an hour — and chop it into $n$ tiny sub-intervals.",
        "The hour's log return is the **sum** of those $n$ pieces, because log returns add.",
        "If the pieces were **iid** with finite variance, the central limit theorem would make that sum approximately **normal** for large $n$.",
        "So the model's normality assumption is not arbitrary — it has a real argument behind it.",
      ],
      say: "Here's the central limit argument. Fix an interval — say an hour — and chop it into n tiny sub intervals. The hour's log return is the sum of those n pieces, because log returns add. Now, if those pieces were independent and identically distributed with finite variance, the central limit theorem would make that sum approximately normal for large n. So the normality assumption in our model is not arbitrary. There is a real argument behind it." }),

    plot({ dur: 28,
      caption: "And it partly works. Aggregate the **same** shocks into 21-day sums and the histogram tightens toward the bell — monthly returns really are closer to normal than daily ones.",
      say: "And it partly works. Take the same shocks and aggregate them into twenty one day sums, and watch the histogram move toward the bell curve. Monthly returns really are closer to normal than daily ones — that's a genuine empirical fact you'll be asked about, and the central limit theorem is the reason. Note the explanation is not that monthly data has fewer observations, so tests lose power. That's a real effect, but it isn't why. The distribution itself is genuinely closer to normal.",
      note: "daily → 21-day sums: the shape moves toward the bell",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const k = easeOut(clamp01((t - 2) / (dur * 0.5)));
        const a = axes(ctx, { x: [-4, 4], y: [0, 0.55], W, H, pad: { l: 58, r: 22, t: 54, b: 38 } });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-4, -2, 0, 2, 4], ys: [], xfmt: (v) => `${v}σ` });
        // standardized histograms, morphing daily -> monthly
        const bins = 26, lo = -4, hi = 4, w = (hi - lo) / bins;
        const hist = (arr, m) => {
          const h = new Array(bins).fill(0);
          arr.forEach((v) => {
            const z = (v - m.mean) / m.sd;
            const b = Math.floor((z - lo) / w);
            if (b >= 0 && b < bins) h[b]++;
          });
          const tot = arr.length * w;
          return h.map((c) => c / tot);
        };
        const hd = hist(data.daily, data.mDaily);
        const hm = hist(data.monthly, data.mMonthly);
        for (let i = 0; i < bins; i++) {
          const x = lo + (i + 0.5) * w;
          const y = lerp(hd[i], hm[i], k);
          if (y <= 0) continue;
          ctx.save();
          ctx.globalAlpha = 0.8;
          ctx.fillStyle = k > 0.5 ? P.emerald : P.blue;
          ctx.fillRect(a.sx(x - w / 2) + 1, a.sy(y), a.sx(w) - a.sx(0) - 2, a.sy(0) - a.sy(y));
          ctx.restore();
        }
        a.line(linspace(-4, 4, 160).map((z) => [z, normPdf(z)]), { color: P.ink, width: 2.2, dash: [5, 4] });
        a.note(k > 0.5 ? "21-day sums" : "daily", a.L + 10, a.T + 18,
          { color: k > 0.5 ? P.emerald : P.blue, size: 12.5, weight: 700 });
        a.note("dashed: a true normal", a.R - 10, a.T + 18, { color: P.muted, size: 11.5, align: "right" });
      } }),

    points({ dur: 26, heading: "…and here is where it breaks", tone: "amber",
      items: [
        "The CLT needs the summands to be **iid with finite variance**. Real short-horizon returns fail *both halves*.",
        "**Not identically distributed** — volatility changes over time. That is Part 4 of this course.",
        "**Not independent** — squared returns are autocorrelated even when the returns themselves are nearly uncorrelated.",
        "So the hypotheses fail exactly where we most want to use them. A beautiful model the data rejects: that is the plot of the whole course.",
      ],
      say: "And here is where it breaks. The central limit theorem needs its summands to be independent and identically distributed with finite variance. Real short horizon returns fail both halves. They're not identically distributed, because volatility changes over time — that's Part four of this course. And they're not independent, because squared returns are autocorrelated even when the returns themselves look uncorrelated. So the hypotheses fail exactly where we most want to use them. A beautiful model that the data rejects. That is the plot of this entire course." }),

    code({ dur: 20, heading: "Computing log returns", file: "returns.py",
      body: `import numpy as np

# log returns from a price series
ldr = np.log(px).diff().dropna()

# or equivalently
ldr = np.log(px / px.shift(1)).dropna()

# annualized volatility  ->  sqrt(252), never 252
ann_vol = ldr.std() * np.sqrt(252)`,
      say: "In pandas it's one line: take logs of the price series and difference it. Drop the first value, which is not a number because it has nothing to difference against. And note the last line — annualizing multiplies by the square root of two fifty two, never by two fifty two itself." }),

    /* ---------- recap ---------- */
    recap({ dur: 30, items: [
      "**Log returns add; simple returns multiply.** Every convenience in this module follows from that.",
      "The $k$-period log return telescopes into a sum of one-period returns.",
      "Under GBM, $r_t(k)\\sim N(\\nu k,\\sigma^2 k)$ — mean scales with $k$, **SD scales with $\\sqrt{k}$**.",
      "$0.02\\sqrt{252}\\approx32\\%$. If you get 504%, you multiplied by $k$.",
      "The CLT predicts normality and the data says no — because returns are neither independent nor identically distributed.",
    ],
    say: "To recap. Log returns add, while simple returns multiply, and every convenience in this module follows from that. The k period log return telescopes into a sum of one period returns. Under geometric Brownian motion that sum is normal, with the mean scaling as k and the standard deviation scaling as root k. Two percent daily annualizes to about thirty two percent — if you get five hundred, you multiplied by k. And the central limit theorem predicts normality, but the data says no, because real returns are neither independent nor identically distributed." }),
  ],
});
