/* f6 — QQ Plots, Skewness, Kurtosis, and Normality Tests (full lecture) */

import {
  PALETTE as P, linspace, normPdf, normCdf, normQuantile, normals, tSample,
  moments, clamp01, easeOut, lerp,
} from "@/lib/anim";
import { compile, title, jargon, points, formula, plot, code, recap, revealed } from "@/lib/scenes";
import { upTo } from "./shared";

const D = (() => {
  const nrm = normals(71);
  const n = 500;
  const gauss = Array.from({ length: n }, () => nrm());
  const fat = Array.from({ length: n }, () => tSample(nrm, 3) * 0.6);
  const skewed = Array.from({ length: n }, () => {
    const z = nrm();
    return z > 0 ? z : z * 2.1;              // a left-skewed sample
  });
  const qq = (s) => {
    const srt = [...s].sort((a, b) => a - b);
    const m = moments(srt);
    return srt.map((v, i) => [normQuantile((i + 0.5) / srt.length), (v - m.mean) / m.sd]);
  };
  return {
    gauss, fat, skewed,
    qqG: qq(gauss), qqF: qq(fat), qqS: qq(skewed),
    mG: moments(gauss), mF: moments(fat), mS: moments(skewed),
  };
})();

export default compile({
  id: "f6",
  title: "QQ Plots, Skewness, Kurtosis, and Normality Tests",
  blurb: "Four ways to ask whether data is normal — one visual, two numerical, two formal — and the one sentence you are allowed to say when the answer comes back.",
  takeaway: "You can never conclude \u201cthe data are normal.\u201d You can only find strong evidence against it, or fail to. Every phrasing question on this topic is testing that single asymmetry.",
  data: D,
  scenes: [

    /* ---------- 1. vocabulary ---------- */
    title({ n: 1, title: "Is this data normal?", tone: "slate", chapter: "Two words first",
      sub: "Four tools, and two words you need before any of them.",
      say: "Chapter one. Is this data normal? We have four tools for answering that. But first, two words you need before any of them make sense.", dur: 10 }),

    jargon({ dur: 22, term: "Quantile", chapter: "Two words first",
      plain: "The value below which a given **fraction** of the data falls. The 0.9 quantile is the number that 90% of your observations come in under.",
      formal: "The median is the 0.5 quantile. Percentiles are quantiles in percent. A **QQ plot** compares your data's quantiles with a distribution's — hence the two Qs.",
      say: "A quantile is the value below which a given fraction of the data falls. The nought point nine quantile is the number that ninety percent of your observations come in under. The median is just the nought point five quantile. Percentiles are the same thing written in percent. And a QQ plot compares your data's quantiles with a theoretical distribution's quantiles — hence the two Q's in the name." }),

    jargon({ dur: 24, term: "p-value",
      plain: "The probability of seeing data **at least this extreme**, *if the null hypothesis were true*. Small means *your data would be surprising under the null*.",
      formal: "It is **not** the probability the null is true. It is a statement about the data given the hypothesis, never about the hypothesis given the data. Getting that backwards is the most common mistake in statistics.",
      say: "A p-value is the probability of seeing data at least this extreme, if the null hypothesis were true. So a small p-value means your data would be surprising under the null. Now hear the thing it is not: it is not the probability that the null is true. It is a statement about the data given the hypothesis, never about the hypothesis given the data. Getting that backwards is the most common mistake in all of statistics, and this module will test you on it." }),

    /* ---------- 2. QQ plots ---------- */
    title({ n: 2, title: "The QQ plot", tone: "blue", chapter: "The QQ plot",
      sub: "A picture that turns \u201cis it normal?\u201d into \u201cis it straight?\u201d",
      say: "Chapter two. The QQ plot — a picture that turns the question is it normal into the much easier question, is it straight?", dur: 9 }),

    points({ dur: 24, heading: "How a QQ plot is built", chapter: "The QQ plot", tone: "blue",
      items: [
        "**Sort** your data from smallest to largest.",
        "Ask a normal distribution what **it** would have produced at each of those positions — those are the theoretical quantiles.",
        "Plot one against the other. If the shapes match, the points fall on a **straight line**.",
        "We compare against the **standard** normal because the line's **slope** absorbs $\\sigma$ and its **intercept** absorbs $\\mu$ — so shape is all that is being tested.",
      ],
      say: "Here's how a QQ plot is built. Sort your data from smallest to largest. Then ask a normal distribution what it would have produced at each of those positions — those are the theoretical quantiles. Plot one against the other. If the shapes match, the points fall on a straight line. And we compare against the standard normal specifically, because the line's slope absorbs sigma and its intercept absorbs mu. So the mean and standard deviation don't matter. Shape is all that's being tested." }),

    plot({ dur: 26,
      caption: "Genuinely normal data, plotted this way. The points track the line closely — a little wobble at the very ends is expected, because extremes are estimated from few observations.",
      say: "Here's genuinely normal data, plotted this way. The points track the line closely all the way along. You'll see a little wobble at the very ends, and that's expected — the extreme quantiles are estimated from only a handful of observations, so they're noisy. What matters is whether the departure is systematic, not whether it's exactly zero.",
      note: "normal data → a straight line",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-3.6, 3.6], y: [-5, 5], W, H, pad: { l: 56, r: 22, t: 54, b: 40 } });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-3, 0, 3], ys: [-4, 0, 4], xfmt: (v) => v.toFixed(0), yfmt: (v) => v.toFixed(0) });
        a.line([[-3.6, -3.6], [3.6, 3.6]], { color: P.muted, width: 1.6, dash: [5, 4] });
        const n = revealed(t, dur, data.qqG.length, { start: 0.05, end: 0.75 });
        a.dots(data.qqG.slice(0, n), { color: P.blue, r: 2.2, alpha: 0.6 });
        a.note("theoretical normal quantile", W / 2 - 66, H - 12, { color: P.muted, size: 11 });
      } }),

    plot({ dur: 28,
      caption: "Now swap in fat-tailed data — a $t$ with 3 degrees of freedom, rescaled to the same spread. The **middle still hugs the line**. Only the ends betray it.",
      say: "Now swap in fat tailed data — a t distribution with three degrees of freedom, rescaled to exactly the same spread. Watch the middle: it still hugs the line perfectly. If you only looked at the centre you'd conclude everything was fine. Only the ends betray it. The lowest points sink below the line and the highest rise above it, giving the characteristic S bend. That shape means tails heavier than normal.",
      note: "the S-bend: **low points below, high points above**",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-3.6, 3.6], y: [-5, 5], W, H, pad: { l: 56, r: 22, t: 54, b: 40 } });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-3, 0, 3], ys: [-4, 0, 4], xfmt: (v) => v.toFixed(0), yfmt: (v) => v.toFixed(0) });
        a.line([[-3.6, -3.6], [3.6, 3.6]], { color: P.muted, width: 1.6, dash: [5, 4] });
        const k = easeOut(clamp01((t - 1.5) / (dur * 0.45)));
        const pts = data.qqG.map(([qx, qy], i) => [qx, lerp(qy, data.qqF[i][1], k)]);
        a.dots(pts, { color: P.amber, r: 2.2, alpha: 0.65 });
        if (k > 0.85) {
          const tail = pts.filter(([qx]) => Math.abs(qx) > 1.9);
          a.dots(tail, { color: P.red, r: 3.2 });
          a.note("below the line", a.sx(-3.4), a.sy(-3.6), { color: P.red, size: 11.5, weight: 700 });
          a.note("above the line", a.sx(1.5), a.sy(3.7), { color: P.red, size: 11.5, weight: 700 });
        }
      } }),

    plot({ dur: 26,
      caption: "A **skewed** sample bends differently: one end pulls away while the other stays put. Fat tails bend **both** ends; skew bends **one**.",
      say: "A skewed sample bends differently again. Here one end pulls away from the line while the other stays put. That asymmetry is the signature of skew. So the two departures look different on the plot: fat tails bend both ends, in opposite directions. Skew bends one end. Learning to tell those two pictures apart is worth drawing until it's automatic.",
      note: "skew bends **one** end · fat tails bend **both**",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-3.6, 3.6], y: [-5, 5], W, H, pad: { l: 56, r: 22, t: 54, b: 40 } });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-3, 0, 3], ys: [-4, 0, 4], xfmt: (v) => v.toFixed(0), yfmt: (v) => v.toFixed(0) });
        a.line([[-3.6, -3.6], [3.6, 3.6]], { color: P.muted, width: 1.6, dash: [5, 4] });
        const k = easeOut(clamp01(t / (dur * 0.45)));
        a.dots(data.qqF, { color: P.amber, r: 2, alpha: 0.28 });
        const pts = data.qqG.map(([qx, qy], i) => [qx, lerp(qy, data.qqS[i][1], k)]);
        a.dots(pts, { color: P.blue, r: 2.4, alpha: 0.75 });
        a.note("skewed sample", a.L + 10, a.T + 18, { color: P.blue, size: 12, weight: 700 });
        a.note("fat-tailed, for comparison", a.L + 10, a.T + 38, { color: P.amber, size: 11.5, weight: 600 });
      } }),

    code({ dur: 18, heading: "QQ plot in Python", file: "qq.py",
      body: `import statsmodels.api as sm
import matplotlib.pyplot as plt

sm.qqplot(ldr, line="45", fit=True)
plt.show()`,
      say: "In Python it's one call. statsmodels qqplot, with line equals forty five to draw the reference line, and fit equals true to standardize the data first so the forty five degree line is the right comparison." }),

    /* ---------- 3. shape numbers ---------- */
    title({ n: 3, title: "Putting numbers on the shape", tone: "emerald", chapter: "Skewness and kurtosis",
      sub: "Two summaries: is it lopsided, and how heavy are the tails?",
      say: "Chapter three. Putting numbers on the shape. Two summaries: is it lopsided, and how heavy are the tails?", dur: 9 }),

    formula({ dur: 26, chapter: "Skewness and kurtosis", tone: "emerald",
      heading: "The third and fourth standardized moments",
      tex: "\\gamma_1=\\frac{\\E\\big[(X-\\mu)^3\\big]}{\\sigma^3}\\qquad\\qquad \\gamma_2=\\frac{\\E\\big[(X-\\mu)^4\\big]}{\\sigma^4}",
      notes: [
        "**Skewness** $\\gamma_1$ uses the **cube**, which keeps the sign — so it can be positive or negative. A normal has $\\gamma_1=0$.",
        "**Kurtosis** $\\gamma_2$ uses the **fourth power**, which is always positive and punishes large deviations enormously. A normal has $\\gamma_2=3$.",
        "Dividing by $\\sigma^3$ and $\\sigma^4$ makes both **unitless** — so they measure shape, not scale.",
      ],
      say: "Skewness and kurtosis are the third and fourth standardized moments. Skewness uses the cube, which keeps the sign, so it can be positive or negative — and a normal distribution has skewness zero. Kurtosis uses the fourth power, which is always positive and punishes large deviations enormously — and a normal has kurtosis exactly three. Dividing by sigma cubed and sigma to the fourth makes both of them unitless, so they measure shape and not scale." }),

    plot({ dur: 28,
      caption: "What the numbers mean in pictures. **Skew** slides the mass to one side. **Kurtosis** trades shoulder for peak and tail — the same area, redistributed.",
      say: "Here's what those numbers mean in pictures. Skew slides the mass to one side, leaving a long tail on the other. Kurtosis is subtler: it trades shoulder for peak and tail. A high kurtosis distribution is more sharply peaked in the centre and heavier way out in the tails, but thinner in between. It's the same total area, just redistributed toward the extremes and the middle at the expense of the shoulders.",
      note: "high kurtosis: sharper peak, fatter tails, thinner shoulders",
      draw({ ctx, W, H, t, dur, axes }) {
        const a = axes(ctx, { x: [-4.4, 4.4], y: [0, 0.62], W, H, pad: { l: 56, r: 22, t: 54, b: 38 } });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-4, -2, 0, 2, 4], ys: [], xfmt: (v) => v.toFixed(0) });
        const k = easeOut(clamp01(t / (dur * 0.6)));
        const xs = linspace(-4.4, 4.4, 240);
        a.line(xs.map((x) => [x, normPdf(x)]), { color: P.muted, width: 2, dash: [5, 4] });
        // a t(4)-like shape, scaled to unit variance, faded in
        const tpdf = (x, v) => {
          const s = Math.sqrt(v / (v - 2));
          const z = x * s;
          const c = 0.55;
          return c * s * Math.pow(1 + (z * z) / v, -(v + 1) / 2);
        };
        a.line(xs.map((x) => [x, lerp(normPdf(x), tpdf(x, 3.2), k)]), { color: P.amber, width: 2.8 });
        a.note("normal, γ₂ = 3", a.L + 10, a.T + 18, { color: P.muted, size: 11.5, weight: 600 });
        if (k > 0.4) a.note("leptokurtic, γ₂ > 3", a.L + 10, a.T + 38, { color: P.amber, size: 12, weight: 700 });
      } }),

    points({ dur: 24, heading: "The three kurtosis words", tone: "emerald",
      items: [
        "**Mesokurtic** — $\\gamma_2=3$. Normal-like tails. *Meso* = middle.",
        "**Leptokurtic** — $\\gamma_2>3$. Heavier tails than normal. *Lepto* = slender, the thin sharp peak. **This is what financial returns are.**",
        "**Platykurtic** — $\\gamma_2<3$. Lighter tails than normal. *Platy* = flat, like a plateau.",
      ],
      say: "Three words worth memorizing outright. Mesokurtic: kurtosis exactly three, normal-like tails — meso means middle. Leptokurtic: kurtosis above three, heavier tails than normal — lepto means slender, for the thin sharp peak. And that is what financial returns are, essentially always. Platykurtic: kurtosis below three, lighter tails than normal — platy means flat, like a plateau." }),

    formula({ dur: 22,
      heading: "The sample versions you actually compute",
      tex: "\\widehat\\gamma_1=\\frac{m_3}{m_2^{3/2}},\\qquad \\widehat\\gamma_2=\\frac{m_4}{m_2^{2}},\\qquad m_k=\\frac1n\\sum_{i=1}^n(x_i-\\bar x)^k",
      notes: [
        "Just the sample moments, in the same ratios.",
        "Beware: some software reports **excess** kurtosis, $\\widehat\\gamma_2-3$, so \u201c0\u201d means normal there. Check which one you are being shown.",
      ],
      say: "The sample versions are exactly what you'd guess: the sample moments in the same ratios, where m k is the average k-th power of the deviations from the mean. One trap worth knowing: some software reports excess kurtosis, which is gamma two minus three. In that convention, zero means normal rather than three. Always check which one you're being shown." }),

    /* ---------- 4. Jarque-Bera ---------- */
    title({ n: 4, title: "Jarque-Bera", tone: "blue", chapter: "Jarque-Bera",
      sub: "Turning those two numbers into a formal test.",
      say: "Chapter four. Jarque Bera — turning those two shape numbers into a formal hypothesis test.", dur: 8 }),

    formula({ dur: 28, chapter: "Jarque-Bera",
      heading: "One statistic, built from exactly the two numbers we just met",
      tex: "T=\\frac{n}{6}\\left(\\widehat\\gamma_1^{\\,2}+\\frac{(\\widehat\\gamma_2-3)^2}{4}\\right)\\;\\dot\\sim\\;\\chi^2_2",
      notes: [
        "$\\widehat\\gamma_1^{\\,2}$ measures distance from **symmetry**; squaring means direction does not matter.",
        "$(\\widehat\\gamma_2-3)^2$ measures distance from **normal tails**. The 3 is not magic — it is the normal's own kurtosis.",
        "They are **added**, so you must pass **both** checks. A symmetric but fat-tailed distribution still fails.",
        "**2 degrees of freedom** because you measured two things. The 5% critical value is $5.99$.",
      ],
      say: "Here's the statistic, built from exactly the two numbers we just met. The first piece measures distance from symmetry, and squaring it means the direction doesn't matter. The second measures distance from normal tails — and the three isn't magic, it's simply the normal's own kurtosis, so subtracting it recentres the scale. Crucially they're added together, so you have to pass both checks. A perfectly symmetric but fat tailed distribution still fails. And it has two degrees of freedom because you measured two things, giving a five percent critical value of five point nine nine." }),

    plot({ dur: 30,
      caption: "Now the sting: $T$ scales **linearly with $n$**, while the critical value never moves. The same departure rejects harder and harder simply because you have more data.",
      say: "And now the sting. That n over six out front means the statistic scales linearly with sample size. Watch: the same fixed departure from normality gives a bigger and bigger statistic as n grows, while the critical value at five point nine nine never moves at all. With twenty years of daily data, any real departure whatsoever will be detected. So a Jarque Bera statistic in the thousands is completely routine for financial returns — it is not a sign that something has gone wrong in your code.",
      note: "$T\\propto n$ · the critical value is fixed",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 5000], y: [0, 1000], W, H, pad: { l: 62, r: 22, t: 54, b: 38 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 2500, 5000], ys: [0, 250, 500, 750, 1000], yfmt: (v) => String(v) });
        const m = data.mF;
        const per = (m.skew ** 2 + ((m.kurt - 3) ** 2) / 4) / 6;
        const k = easeOut(clamp01(t / (dur * 0.65)));
        const nNow = 5000 * k;
        a.line(linspace(0, nNow, 90).map((nn) => [nn, nn * per]), { color: P.red, width: 2.8 });
        a.hline(5.99, { color: P.emerald, width: 2.2 });
        a.note("χ²₂ 5% critical value = 5.99 — never moves", a.L + 10, a.sy(5.99) - 14,
          { color: P.emerald, size: 11.5, weight: 700 });
        if (nNow > 250) a.chip(`n = ${Math.round(nNow)}   T = ${(nNow * per).toFixed(0)}`, a.L + 10, a.T + 16,
          { color: P.red, bg: "rgba(186,26,26,0.10)" });
      } }),

    points({ dur: 28, heading: "How to phrase the conclusion \u2014 and this *is* examined", tone: "amber",
      items: [
        "$H_0$: the sample is drawn from a normal distribution.   $H_1$: it is **not**.",
        "Tests are built to detect evidence **for $H_1$**. So there are exactly two honest conclusions:",
        "**1.** We find strong evidence the sample is **not** normal.   **2.** We **fail to find** such evidence.",
        "You may **never** conclude \u201cthe data are normal.\u201d That is accepting the null, and no test can do it.",
      ],
      say: "Now, how to phrase the conclusion — and this is examined directly. The null hypothesis is that the sample is drawn from a normal distribution; the alternative is that it is not. Hypothesis tests are built to detect evidence for the alternative. So there are exactly two honest conclusions. One: we find strong evidence the sample is not normal. Two: we fail to find such evidence. You may never conclude that the data are normal. That would be accepting the null, and no test can do that — no matter how large the p-value is." }),

    /* ---------- 5. Shapiro-Wilk and power ---------- */
    title({ n: 5, title: "Shapiro-Wilk, and the idea of power", tone: "emerald", chapter: "Shapiro-Wilk and power",
      sub: "A better test, and the reason \u201cbetter\u201d needs defining.",
      say: "Chapter five. Shapiro Wilk, and the idea of power. A better test — and the reason the word better needs defining carefully.", dur: 10 }),

    formula({ dur: 24, chapter: "Shapiro-Wilk and power", tone: "emerald",
      heading: "Shapiro-Wilk works from the order statistics themselves",
      tex: "W=\\frac{\\Big(\\sum_{i=1}^{n}a_ix_{(i)}\\Big)^{2}}{\\sum_{i=1}^{n}(x_i-\\bar x)^{2}}",
      notes: [
        "$x_{(i)}$ is the $i$-th **smallest** value — the sorted data, exactly what a QQ plot uses.",
        "Jarque-Bera squeezes the sample into two numbers and throws the rest away. Shapiro-Wilk does not.",
        "So it can catch departures that leave skewness and kurtosis looking perfectly normal.",
      ],
      say: "Shapiro Wilk works from the order statistics themselves — x bracket i is the i-th smallest value, which is to say, the sorted data. Exactly what a QQ plot uses. And here's why that matters: Jarque Bera squeezes the entire sample down into two numbers and throws everything else away. Shapiro Wilk doesn't. So it can catch departures from normality that leave skewness and kurtosis looking perfectly innocent." }),

    jargon({ dur: 24, term: "Power",
      plain: "The probability a test **correctly rejects** the null when the null really is false. High power = good at catching liars.",
      formal: "$\\text{power}=P(\\text{reject }H_0\\mid H_1\\text{ true})$. Its complement is the **Type II error** rate: power $0.30$ means you miss the truth **70%** of the time.",
      say: "Power is the probability that a test correctly rejects the null when the null really is false. High power means the test is good at catching liars. Formally it's the probability of rejecting H nought given that H one is true. And its complement is the Type two error rate — so a test with power nought point three misses the truth seventy percent of the time." }),

    points({ dur: 26, heading: "Why power is the practical point", tone: "amber",
      items: [
        "Jarque-Bera has **lower power** than Shapiro-Wilk, and does not always hit its stated Type I error rate.",
        "**Failing to reject with a low-power test tells you almost nothing.** The test may simply not have been looking hard enough.",
        "And do not misread the number: power $0.30$ is **not** \u201ca 30% chance the null is true.\u201d It is a probability about the **data**, never about the hypothesis.",
      ],
      say: "Why does power matter practically? Because Jarque Bera has lower power than Shapiro Wilk, and it doesn't always achieve its stated Type one error rate either. Which means: failing to reject with a low power test tells you almost nothing. The test may simply not have been looking hard enough to see anything. And don't misread the number — power of nought point three is not a thirty percent chance the null is true. It is a probability about the data, never about the hypothesis." }),

    /* ---------- recap ---------- */
    recap({ dur: 32, items: [
      "A **QQ plot** turns \u201cis it normal?\u201d into \u201cis it straight?\u201d — fat tails bend **both** ends, skew bends **one**.",
      "**Skewness** $\\gamma_1=0$ and **kurtosis** $\\gamma_2=3$ for a normal. Returns are **leptokurtic**: $\\gamma_2>3$.",
      "**Jarque-Bera** tests both at once and scales with $n$ — huge statistics are routine, and tell you *that*, not *how badly*.",
      "**Shapiro-Wilk** uses the sorted data itself, so it has **more power**.",
      "You may only ever conclude *strong evidence against normality*, or *no such evidence*. Never *the data are normal*.",
    ],
    say: "To recap. A QQ plot turns the question is it normal into is it straight — and remember, fat tails bend both ends while skew bends only one. A normal distribution has skewness zero and kurtosis three; financial returns are leptokurtic, with kurtosis above three. Jarque Bera tests both at once and scales with sample size, so enormous statistics are routine and they tell you that the data isn't normal, never how badly. Shapiro Wilk uses the sorted data itself and therefore has more power. And finally, the phrasing rule: you may only ever conclude strong evidence against normality, or no such evidence. Never that the data are normal." }),
  ],
});
