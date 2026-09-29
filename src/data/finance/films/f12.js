/* f12 — Market Indices, the VIX, and the Leverage Effect (full lecture) */

import { PALETTE as P, linspace, normals, clamp01, easeOut, lerp } from "@/lib/anim";
import { compile, title, jargon, points, formula, plot, code, recap, revealed } from "@/lib/scenes";

const D = (() => {
  const nrm = normals(97);
  // daily SPX log returns, and the same day's change in VIX, with a steeper
  // slope on down days than on up days — the asymmetry the regression finds
  const DOWN = -190, UP = -152;
  const pts = [];
  for (let i = 0; i < 900; i++) {
    const r = nrm() * 0.0105;
    const d = (r < 0 ? DOWN : UP) * r + nrm() * 0.95;
    pts.push([r, d]);
  }
  // a VIX-like level series: calm around 15, with a few crisis spikes
  const vix = [];
  let v = 16;
  for (let i = 0; i < 640; i++) {
    const spike = (i > 150 && i < 185) ? 2.6 : (i > 430 && i < 452) ? 3.4 : 0;
    v = 15 + 0.93 * (v - 15) + nrm() * 1.05 + spike * Math.abs(nrm());
    vix.push(Math.max(9, v));
  }
  // DJIA-style price weights before and after a 2-for-1 split on one member
  const weights = [178, 95, 62, 41, 33];
  return { pts, vix, DOWN, UP, weights, beta2: 37.71 };
})();

export default compile({
  id: "f12",
  title: "Market Indices, the VIX, and the Leverage Effect",
  blurb: "How an index is built and why the weighting scheme matters, what the VIX is really measuring, and the regression that puts a number on the market's asymmetry.",
  takeaway: "Investors react more strongly to negative events than to positive ones. The whole of this module is machinery for seeing that clearly and measuring it.",
  data: D,
  scenes: [

    /* ---------- 1. indices ---------- */
    title({ n: 1, title: "What a market index is", tone: "slate", chapter: "Market indices",
      sub: "A summary number — and how you compute it matters.",
      say: "Chapter one. What a market index is. It's a summary number — and as we'll see, how you compute that summary matters a great deal.", dur: 11 }),

    jargon({ dur: 24, term: "Market index", chapter: "Market indices",
      plain: "A **summary measure** — often a weighted average — of the performance of a group of stocks.",
      formal: "Indices are tracked as indicators of the overall behaviour of financial markets, and used as a measure of the strength of the economy. An index is not a company and not something you trade directly; it is an **aggregate** of its constituents.",
      say: "A market index is a summary measure, often a weighted average, of the performance of a group of stocks. Indices are closely tracked as indicators of the overall behaviour of financial markets, and are often used as a measure of the strength of the economy. But keep the key word in mind: summary. An index is not a company, and not something you can trade directly. It is an aggregate computed from its constituents." }),

    points({ dur: 26, heading: "The Dow Jones Industrial Average", tone: "slate",
      items: [
        "The most commonly quoted index, and popular largely for **historical** reasons — it has existed since **1896**.",
        "It comprises **30 major US corporations**, chosen to be “representative” of the entire economy.",
        "Its membership has changed many times; today it includes firms like Apple, Home Depot, Goldman Sachs and Disney.",
        "Crucially: the DJIA weights its stocks by their **current share price**.",
      ],
      say: "The most commonly quoted index is the Dow Jones Industrial Average. Its popularity is somewhat historical — it has been around since eighteen ninety six. It comprises thirty major US corporations, chosen to be representative of the entire economy, and its membership has changed many times over the years. But here is the detail that matters: the Dow weights its stocks by their current share price." }),

    plot({ dur: 30,
      caption: "And that is a problem. A **2-for-1 split** halves a company's share price overnight while leaving the business worth exactly the same — yet under price weighting its **influence on the index halves too**.",
      say: "And that is a problem. Watch what happens when one company does a two for one split. Its share price halves overnight, but the business is worth exactly what it was a moment ago — shareholders simply hold twice as many shares at half the price. Yet under price weighting, that firm's influence on the index halves as well. Nothing economic happened. This is the major criticism of the Dow: a stock's weight depends on its share price, which is an essentially arbitrary number a company can change at will.",
      note: "nothing economic changed — only the weight did",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-0.6, 5.2], y: [0, 200], W, H, pad: { l: 58, r: 22, t: 56, b: 44 } });
        a.grid(5, 4).frame();
        a.ticks({ ys: [0, 50, 100, 150, 200], yfmt: (v) => `$${v}` });
        const k = easeOut(clamp01((t - 2) / (dur * 0.45)));
        data.weights.forEach((w, i) => {
          const h = i === 0 ? lerp(w, w / 2, k) : w;
          ctx.save();
          ctx.fillStyle = i === 0 ? (k > 0.5 ? P.red : P.blue) : P.muted;
          ctx.globalAlpha = i === 0 ? 0.9 : 0.4;
          const x0 = a.sx(i + 0.12), x1 = a.sx(i + 0.88);
          ctx.fillRect(x0, a.sy(h), x1 - x0, a.sy(0) - a.sy(h));
          ctx.restore();
          a.note(`$${Math.round(h)}`, (x0 + x1) / 2 - 14, a.sy(h) - 12,
            { color: i === 0 ? (k > 0.5 ? P.red : P.blue) : P.muted, size: 11.5, weight: 700 });
        });
        a.note("share price = weight", a.L + 10, a.T + 18, { color: P.muted, size: 11.5, weight: 600 });
        if (k > 0.55) a.note("2-for-1 split → weight halved", a.L + 10, a.T + 40, { color: P.red, size: 12, weight: 700 });
      } }),

    points({ dur: 28, heading: "Market-cap weighting fixes it", tone: "emerald",
      items: [
        "Most modern indices weight by **market capitalization**: share price × shares outstanding — the total value of all the company's stock.",
        "Immune to the split problem: halve the price, double the share count, and the product is unchanged.",
        "The **S&P 500** is the standard example — 500 of the largest US companies, so **more representative of the whole market than the DJIA**.",
        "The **NASDAQ Composite** covers all stocks listed on the NASDAQ exchange, and is **dominated by tech**.",
      ],
      say: "Most modern indices instead weight components by market capitalization — the share price times the number of shares outstanding, which is the total value of all the company's stock. That's immune to the split problem: halve the price, double the share count, and the product is unchanged. The S and P five hundred is the standard example. It includes five hundred of the largest US companies, so it covers far more stocks and is more representative of the entire market than the Dow. The NASDAQ Composite reflects all stocks listed on the NASDAQ exchange, and is dominated by tech companies." }),

    code({ dur: 22, heading: "Pulling an index", file: "index.py",
      body: `import yfinance as yf
import numpy as np

# indices use a caret prefix;  ^SPX is the S&P 500
SPXdat = yf.Ticker("^SPX").history(start="2000-01-01", end="2025-12-31")
SPXldr = np.log(SPXdat["Close"]).diff().dropna()`,
      say: "Indices are fetched exactly like stocks — the symbol just starts with a caret. Yahoo Finance's world indices table lists the symbol for each one. Over two thousand to twenty twenty five the S and P runs from around fourteen hundred to about sixty eight hundred, with the dot com decline, the two thousand eight crash and the twenty twenty drop all clearly visible." }),

    /* ---------- 2. the VIX ---------- */
    title({ n: 2, title: "The VIX", tone: "amber", chapter: "The VIX",
      sub: "An index that measures fear rather than price.",
      say: "Chapter two. The VIX — an index that measures fear rather than price.", dur: 10 }),

    points({ dur: 28, heading: "Options on an index", chapter: "The VIX", tone: "amber",
      items: [
        "The Chicago Board of Exchange sells **options on the S&P 500** — calls and puts whose underlying “asset” is the value of the index itself.",
        "Why would anyone want those? To **protect against market drops** —",
        "— and because they are based on the **entire market or economy**, rather than on one company.",
      ],
      say: "The Chicago Board of Exchange sells options on the S and P five hundred index. So you can buy calls and puts whose underlying asset is the value of the index itself, rather than any single company. Why would investors want those? Two reasons. To protect against market drops. And because they are based on the entire market, or the economy as a whole, as opposed to one company." }),

    jargon({ dur: 28, term: "The VIX",
      plain: "The **implied volatility of options on the S&P 500** — the market's own forecast of how turbulent the market will be.",
      formal: "Because the S&P 500 is broad-based, the implied volatility of its options says something about what investors anticipate for the future variability of **the market as a whole**, rather than one stock. Often called the **“fear index”**.",
      say: "Recall implied volatility from module eleven. Since the S and P five hundred is broad based, the implied volatility of its options is of particular interest: it says something about what investors are anticipating for the future variability of the market as a whole, as opposed to an individual stock. There is a market index that tracks exactly this quantity, and it is widely reported. It's the VIX. And it is often called the fear index, since it is larger in times when investors are nervous about the future of the financial markets and are anticipating increased volatility." }),

    plot({ dur: 28,
      caption: "Its history makes the nickname obvious: calm stretches around 10-20, and enormous spikes at every period of market stress.",
      say: "Its history makes the nickname obvious. Through calm stretches the VIX sits somewhere around ten to twenty. But it spiked above eighty in the two thousand eight financial crisis, and again in March twenty twenty, with smaller peaks at every period of market stress in between. On y finance the symbol is caret V I X.",
      note: "**^VIX** — calm around 15, spiking past 80 in a crisis",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 640], y: [0, 90], W, H, pad: { l: 56, r: 22, t: 56, b: 40 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 320, 640], ys: [0, 30, 60, 90], yfmt: (v) => String(v) });
        const n = Math.max(2, revealed(t, dur, 640, { start: 0.02, end: 0.85 }));
        a.line(data.vix.slice(0, n).map((v, i) => [i, v]), { color: P.amber, width: 1.8 });
        a.hline(15, { color: P.muted, width: 1.2 });
        a.note("calm ≈ 15", a.L + 10, a.sy(15) - 13, { color: P.muted, size: 11 });
      } }),

    /* ---------- 3. the relationship ---------- */
    title({ n: 3, title: "The VIX against the market", tone: "blue", chapter: "VIX vs the market",
      sub: "The leverage effect, at the level of the whole market.",
      say: "Chapter three. The VIX against the market. This is the leverage effect, seen at the level of the whole market rather than one stock.", dur: 11 }),

    plot({ dur: 32, chapter: "VIX vs the market",
      caption: "Compare the daily **change in the VIX** with the **S&P 500 log return on the same day**. The first and most evident feature is a strong **negative relationship**.",
      say: "Compare the day to day change in the VIX with the log return on the S and P five hundred on the same day. The first, and most evident, feature is a strong negative relationship. On days the market falls, expected future volatility jumps. On days it rises, expected volatility eases. Note carefully what this is not: it is not a claim that volatility is high whenever prices are low. It is about changes — today's move against today's change in expected volatility.",
      note: "market down → VIX up, and strongly so",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-0.045, 0.045], y: [-9, 9], W, H, pad: { l: 58, r: 22, t: 56, b: 42 } });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-0.04, -0.02, 0, 0.02, 0.04], ys: [-6, 0, 6],
          xfmt: (v) => `${(v * 100).toFixed(0)}%`, yfmt: (v) => String(v) });
        a.hline(0, { color: P.grid, dash: null });
        a.vline(0, { color: P.grid, dash: null });
        const n = revealed(t, dur, data.pts.length, { start: 0.03, end: 0.8 });
        a.dots(data.pts.slice(0, n), { color: P.blue, r: 1.9, alpha: 0.4 });
        a.note("Change in VIX", a.L + 10, a.T + 18, { color: P.muted, size: 11 });
        a.note("Log daily return on SPX", a.R - 10, a.B + 26, { color: P.muted, size: 11, align: "right" });
      } }),

    points({ dur: 30, heading: "Theory 1 — the leverage story", tone: "slate",
      items: [
        "**The source of this effect is not completely understood.** Two explanations compete.",
        "As equity prices fall, firms' **debt-to-equity ratios** rise — companies are more *leveraged* — making their stock riskier.",
        "**This is where the name “leverage effect” comes from** — but it is not the favoured explanation.",
      ],
      say: "The source of this effect is not completely understood, and two explanations compete. The first: as equity prices fall, debt to equity ratios increase. Companies are more leveraged, which makes their stock riskier. This is where the name leverage effect comes from. But it is not the more widely accepted theory." }),

    points({ dur: 32, heading: "Theory 2 — volatility feedback, and this is the accepted one", tone: "emerald",
      items: [
        "Uncertainty hits the market — a news event, say — which **raises the volatility expected in the future**.",
        "Because investors are **risk-averse**, they refuse to hold stocks in this newly volatile environment unless they receive a **larger expected return**.",
        "And to generate a higher **future** return, the current stock price must **immediately drop**.",
        "So the effect keeps the name of the theory that does *not* best explain it.",
      ],
      say: "The second theory is more widely accepted. When uncertainty hits the market — a news event, say — this increases uncertainty and raises the volatility expected in the future. Because investors are risk averse, they refuse to hold stocks in this newly volatile environment unless they receive a larger expected return. And here is the step that closes the loop: to generate a higher future return, the current stock price must immediately drop. So the price falls because expected volatility rose, not the other way round. Which means the effect keeps the name of the theory that does not best explain it." }),

    /* ---------- 4. the asymmetry ---------- */
    title({ n: 4, title: "Measuring the asymmetry", tone: "blue", chapter: "The asymmetry",
      sub: "A second, subtler feature — and a regression that finds it.",
      say: "Chapter four. Measuring the asymmetry. There is a second, subtler feature in that scatter, and a regression that finds it.", dur: 11 }),

    formula({ dur: 30, chapter: "The asymmetry",
      heading: "Let the slope differ above and below zero",
      tex: "\\Delta\\text{VIX}_t=\\beta_0+\\beta_1\\,r_t+\\beta_2\\big(r_t\\times\\mathbf{1}\\{r_t\\ge0\\}\\big)+\\epsilon_t",
      notes: [
        "The **interaction term** lets the slope of the relationship **shift** when the log daily return is $\\ge0$.",
        "So $\\beta_1$ is the slope on **down** days, and $\\beta_1+\\beta_2$ is the slope on **up** days.",
        "If $\\beta_2$ were indistinguishable from zero, there would be no asymmetry to find.",
      ],
      say: "The negative slope is the obvious feature. The subtler one is that the slope is not the same for up days and down days. To test that, regress the change in VIX on the return, plus an interaction between the return and an indicator for the return being non negative. The role of that interaction term is to let the slope shift when the log daily return is greater than or equal to zero. So beta one is the slope on down days, and beta one plus beta two is the slope on up days. If beta two were indistinguishable from zero, there would be no asymmetry to find." }),

    code({ dur: 24, heading: "Fitting it", file: "leverage.py",
      body: `import pandas as pd
import statsmodels.formula.api as smf

df = pd.DataFrame({"VIXchange": VIXchange,
                   "SPXldr":    SPXldr,
                   "PosRet":    SPXldr >= 0})

# statsmodels' "R-like" formula API;  ':' means an interaction
modelfit = smf.ols(formula="VIXchange ~ SPXldr + SPXldr:PosRet", data=df).fit()
modelfit.summary()`,
      say: "statsmodels includes an R like formula interface, where a colon means an interaction. Build a data frame with the VIX change, the returns, and a boolean for whether the return was non negative, then fit ordinary least squares with that formula." }),

    plot({ dur: 32,
      caption: "And the fit confirms it. The estimated interaction coefficient is about **37.71**, and it is **statistically significant** — the slope genuinely differs either side of zero.",
      say: "And the fit confirms it. The estimated coefficient on the interaction term is about thirty seven point seven one, and it is statistically significant. So the slope is genuinely not the same for log returns below zero and log returns at or above zero. Watch the fitted line: it is steeper on the left of the origin than on the right. The asymmetry in the slope, although small, is another important feature associated with the leverage effect.",
      note: "steeper on down days than on up days",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-0.045, 0.045], y: [-9, 9], W, H, pad: { l: 58, r: 22, t: 56, b: 42 } });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-0.04, -0.02, 0, 0.02, 0.04], ys: [-6, 0, 6],
          xfmt: (v) => `${(v * 100).toFixed(0)}%`, yfmt: (v) => String(v) });
        a.hline(0, { color: P.grid, dash: null });
        a.vline(0, { color: P.grid, dash: null });
        a.dots(data.pts, { color: P.blue, r: 1.8, alpha: 0.25 });
        const k = easeOut(clamp01(t / (dur * 0.45)));
        a.line(linspace(-0.045 * k, 0, 30).map((r) => [r, data.DOWN * r]), { color: P.red, width: 3 });
        a.line(linspace(0, 0.045 * k, 30).map((r) => [r, data.UP * r]), { color: P.emerald, width: 3 });
        if (k > 0.75) {
          a.note("down days: steeper", a.L + 10, a.T + 18, { color: P.red, size: 12, weight: 700 });
          a.note("up days: shallower", a.R - 10, a.B - 14, { color: P.emerald, size: 12, weight: 700, align: "right" });
          a.chip(`interaction β₂ ≈ ${data.beta2}  (significant)`, a.L + 10, a.T + 42,
            { color: P.blue, bg: "rgba(33,112,228,0.10)" });
        }
      } }),

    points({ dur: 28, heading: "What the asymmetry means in plain terms", tone: "amber",
      items: [
        "Significant **negative** events lead to an increase in the VIX, and a decrease in prices.",
        "A similar statement holds for **positive** events, which lead to a decrease in the VIX — **but the effect on the price is not as large**.",
        "**Investors react more strongly to negative events than they do to positive events.**",
      ],
      say: "In plain terms. Significant negative events lead to an increase in the VIX, and a decrease in prices, as we saw. A similar statement can be made for positive events, which lead to a decrease in the VIX — but the effect on the price is not as large. Which gives the one sentence summary of the entire regression: investors react more strongly to negative events than they do to positive events." }),

    points({ dur: 30, heading: "One caveat: this is not an index-level phenomenon", tone: "slate",
      items: [
        "It is important to note that this behaviour is **not seen only in the S&P 500**. The leverage effect is a general property of equity returns.",
        "We view it through the S&P 500 because it **averages over a large number of stocks**, so it carries less of the variability associated with a single equity — the pattern is easier to see through less noise.",
        "And because historical information on the VIX is **easy to obtain**.",
      ],
      say: "One caveat worth stating clearly. It is important to note that this behaviour is not seen only in the S and P five hundred — the leverage effect is a general property of equity returns. We view it through the S and P for two practical reasons. One: it averages over a large number of stocks, and hence has less of the variability associated with a single equity, so the pattern is easier to see through less noise. Two: historical information on the VIX is easy to obtain. Do not conclude from these plots that the effect is somehow an index level phenomenon. It is not." }),

    /* ---------- recap ---------- */
    recap({ dur: 26, chapter: "Recap", items: [
      "An **index** is a summary of many stocks. The **DJIA** is price-weighted — so a split changes a firm's weight for no economic reason.",
      "The **S&P 500** and most modern indices use **market-cap** weighting, which is immune to that.",
      "The **VIX** is the implied volatility of S&P 500 options — the market's forecast of its own turbulence, hence the *fear index*.",
    ],
    say: "To recap. An index is a summary of many stocks, and the Dow is price weighted, so a split changes a firm's weight for no economic reason at all. The S and P five hundred, and most modern indices, use market cap weighting instead, which is immune to that. And the VIX is the implied volatility of S and P five hundred options — the market's forecast of its own turbulence, hence the nickname, the fear index." }),

    recap({ dur: 28, chapter: "Recap", items: [
      "Change in VIX against same-day return is **strongly negative**: the leverage effect at market level.",
      "Two theories: the **leverage** story gives the name, but **volatility feedback** is more widely accepted.",
      "An **interaction term** shows the slope differs either side of zero — $\\beta_2\\approx37.7$ and significant.",
      "Which is to say: **investors react more strongly to negative events than to positive ones.**",
    ],
    say: "And to close. The change in the VIX against the same day's return is strongly negative — that's the leverage effect at market level. Two theories compete: the leverage story gives the effect its name, but volatility feedback is the more widely accepted explanation. An interaction term shows the slope genuinely differs either side of zero, with a coefficient around thirty seven point seven that is statistically significant. Which is to say: investors react more strongly to negative events than they do to positive ones." }),
  ],
});
