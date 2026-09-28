/* f2 — The Lognormal Distribution and the Pricing Claim (full lecture) */

import { PALETTE as P, linspace, normPdf, normCdf, normals, clamp01, easeOut, lerp } from "@/lib/anim";
import { compile, title, jargon, points, formula, derive, plot, recap, revealed } from "@/lib/scenes";
import { upTo, pc } from "./shared";

const D = (() => {
  const mu = 0, sigma = 0.55;
  const mean = Math.exp(mu + sigma * sigma / 2);
  const median = Math.exp(mu);
  const nrm = normals(12);
  const sample = Array.from({ length: 260 }, () => Math.exp(mu + sigma * nrm()));
  // the Claim, on a tidy example
  const xi = 0, tau = 0.45, K = 1.15, lk = Math.log(K);
  const d2 = (xi - lk) / tau, d1 = d2 + tau;
  return {
    mu, sigma, mean, median, sample,
    xi, tau, K, lk, d1, d2, Pd1: normCdf(d1), Pd2: normCdf(d2),
    EP: Math.exp(xi + tau * tau / 2),
    claim: Math.exp(xi + tau * tau / 2) * normCdf(d1) - K * normCdf(d2),
  };
})();

const lnPdf = (x, mu, s) => (x <= 0 ? 0 : normPdf((Math.log(x) - mu) / s) / (x * s));

export default compile({
  id: "f2",
  title: "The Lognormal Distribution and the Pricing Claim",
  blurb: "The distribution the whole model rests on, why its mean sits above its median, and the full derivation of the formula that becomes Black-Scholes.",
  takeaway: "One sentence carries both proofs in this module: multiplying a normal density by $e^{y}$ does not break it — it slides the mean up by the variance and leaves a constant outside.",
  data: D,
  scenes: [

    /* ---------- 1. why not a normal ---------- */
    title({ n: 1, title: "Why prices are not normal", tone: "slate", chapter: "Why not a normal?",
      sub: "The bell curve is the wrong shape for a price, for three concrete reasons.",
      say: "Chapter one. Why prices are not normal. The bell curve is the wrong shape for a price, and there are three concrete reasons why.", dur: 9 }),

    plot({ dur: 22, chapter: "Why not a normal?",
      caption: "Put a normal distribution on a stock price and it immediately says something absurd: there is a real probability the price finishes **below zero**.",
      say: "Put a normal distribution on a stock price and it immediately says something absurd. There is a real probability that the price finishes below zero. The shaded region on the left is nonsense — a share cannot be worth minus ten dollars. Any model that assigns it probability is broken before you start.",
      note: "a normal always leaks probability below zero",
      draw({ ctx, W, H, t, dur, axes }) {
        const a = axes(ctx, { x: [-60, 260], y: [0, 0.0065], W, H, pad: { l: 56, r: 22, t: 54, b: 38 } });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-60, 0, 100, 200], ys: [], xfmt: (v) => `$${v}` });
        const pts = linspace(-60, 260, 220).map((x) => [x, normPdf((x - 100) / 62) / 62]);
        a.line(pts, { color: P.blue, width: 2.6 });
        const k = easeOut(clamp01(t / (dur * 0.4)));
        const neg = pts.filter(([x]) => x <= 0);
        if (k > 0.1) a.area(neg, 0, { color: P.redSoft, alpha: k });
        a.vline(0, { color: P.red, width: 2 });
        if (k > 0.6) a.note("prices below zero", a.sx(-56), a.sy(0.0012), { color: P.red, size: 12, weight: 700 });
      } }),

    points({ dur: 24, heading: "Three things a price model has to get right",
      items: [
        "**It can never go negative.** A share can fall to zero and stop. It cannot go below.",
        "**Returns are multiplicative.** Prices compound. A 10% gain then a 10% loss is not flat — it is $-1\\%$.",
        "**It is lopsided.** A stock can go up 900%. It can only go down 100%. The upside has more room than the downside.",
      ],
      say: "So a price model has to get three things right. One: it can never go negative. A share can fall to zero and stop; it cannot go below. Two: returns are multiplicative. Prices compound, so a ten percent gain followed by a ten percent loss is not flat — it's minus one percent. Three: it's lopsided. A stock can go up nine hundred percent, but it can only go down one hundred percent. The upside has more room than the downside." }),

    /* ---------- 2. what lognormal means ---------- */
    title({ n: 2, title: "What “lognormal” means", tone: "amber", chapter: "What lognormal means",
      sub: "The name is literal, and that is the whole definition.",
      say: "Chapter two. What lognormal means. The name is completely literal, and that is the whole definition.", dur: 8 }),

    jargon({ dur: 21, term: "Lognormal", chapter: "What lognormal means",
      plain: "A distribution whose **logarithm** is normal. Take a bell curve and **exponentiate** it — what comes out is lognormal.",
      formal: "Formally: $X$ is lognormal$(\\mu,\\sigma^2)$ when $\\log X\\sim N(\\mu,\\sigma^2)$. Read “log-normal” as “the thing whose log is normal.”",
      say: "Lognormal. A distribution whose logarithm is normal. Take a bell curve and exponentiate it, and what comes out is lognormal. Formally: X is lognormal when the log of X is normal. Read the name literally — log normal means the thing whose log is normal." }),

    plot({ dur: 26,
      caption: "Watch it happen. Start with a symmetric bell curve on the log scale, then exponentiate. The left half **compresses** toward zero; the right half **stretches** out.",
      say: "Let's watch it happen. Start with a symmetric bell curve on the log scale. Now exponentiate every point. Notice what the exponential does: it compresses the left half toward zero, and it stretches the right half out. Symmetry in, lopsidedness out. And nothing ever crosses zero, because e to the anything is positive.",
      note: "exponentiating turns symmetry into skew",
      draw({ ctx, W, H, t, dur, axes }) {
        const k = easeOut(clamp01((t - 1.5) / (dur * 0.5)));
        const a = axes(ctx, { x: [-2.4, 4.2], y: [0, 0.85], W, H, pad: { l: 52, r: 22, t: 54, b: 38 } });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-2, 0, 2, 4], ys: [], xfmt: (v) => v.toFixed(0) });
        a.vline(0, { color: P.grid, dash: null });
        // morph from N(0,sigma) to lognormal(0,sigma)
        const grid = linspace(-2.4, 4.2, 260);
        const pts = grid.map((x) => {
          const nrmv = normPdf(x / D.sigma) / D.sigma;
          const lnv = lnPdf(x, D.mu, D.sigma);
          return [x, lerp(nrmv, lnv, k)];
        });
        a.area(pts, 0, { color: k > 0.5 ? P.amberSoft : P.blueSoft });
        a.line(pts, { color: k > 0.5 ? P.amber : P.blue, width: 2.8 });
        a.note(k < 0.5 ? "normal, on the log scale" : "lognormal, on the price scale",
          a.L + 10, a.T + 18, { color: k > 0.5 ? P.amber : P.blue, size: 12.5, weight: 700 });
        if (k > 0.85) a.note("never negative", a.sx(-2.2), a.sy(0.1), { color: P.emerald, size: 11.5, weight: 600 });
      } }),

    points({ dur: 22, heading: "Three consequences — and they are the only three you need", tone: "amber",
      items: [
        "**It is never negative.** $e^{\\text{anything}}>0$. Prices stay where prices belong.",
        "**It is right-skewed.** Most of the mass bunches low, with a long tail stretching right.",
        "**Its logarithm is normal.** Stuck? Take logs and you are back in familiar bell-curve territory.",
      ],
      say: "Three consequences, and they're the only three you need. One: it is never negative, because e to the anything is positive. Prices stay where prices belong. Two: it is right skewed — most of the mass bunches low, with a long tail stretching to the right. Three: its logarithm is normal. So if you ever get stuck, take logs and you're back in familiar bell curve territory." }),

    /* ---------- 3. mean vs median ---------- */
    title({ n: 3, title: "The mean sits above the median", tone: "emerald", chapter: "Mean vs median",
      sub: "And the gap is exactly $\\sigma^2/2$.",
      say: "Chapter three. The mean sits above the median. And the gap between them is exactly sigma squared over two.", dur: 8 }),

    plot({ dur: 26, chapter: "Mean vs median",
      caption: "Here is the lognormal with the sample drawn underneath. The **median** is the middle outcome. The **mean** is dragged right by the long tail — those rare big values pull the average up.",
      say: "Here's the lognormal, with an actual sample drawn underneath it. The median is the middle outcome — half the draws land below it. But the mean is dragged to the right by the long tail. Those rare large values pull the average up, and nothing on the left can pull it back down as hard, because the left side is squashed against zero.",
      note: "the tail pulls the **mean** right; the **median** does not move",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 6], y: [0, 0.85], W, H, pad: { l: 52, r: 22, t: 54, b: 44 } });
        a.grid(6, 4).frame();
        a.ticks({ xs: [0, 2, 4, 6], ys: [], xfmt: (v) => v.toFixed(0) });
        const pts = linspace(0.01, 6, 240).map((x) => [x, lnPdf(x, data.mu, data.sigma)]);
        a.area(pts, 0, { color: P.amberSoft });
        a.line(pts, { color: P.amber, width: 2.6 });
        const n = revealed(t, dur, data.sample.length, { start: 0.05, end: 0.55 });
        a.bars(data.sample.slice(0, n).filter((v) => v < 6).map((v) => [v, 0.05]),
          { color: P.ink, width: 1.2, alpha: 0.35 });
        const k = clamp01((t / dur - 0.5) * 3);
        if (k > 0) {
          a.vline(data.median, { color: P.blue, width: 2.2, alpha: k, dash: null });
          a.label("median", { x: data.median - 0.08, y: 0.78, color: P.blue, align: "right", size: 12, alpha: k });
          a.vline(data.mean, { color: P.emerald, width: 2.2, alpha: k, dash: null });
          a.label("mean", { x: data.mean + 0.08, y: 0.78, color: P.emerald, size: 12, alpha: k });
        }
      } }),

    formula({ dur: 26, tone: "emerald",
      heading: "The two moments, and where the gap comes from",
      tex: "\\E(X)=\\underbrace{e^{\\mu}}_{\\text{median}}\\cdot\\underbrace{e^{\\sigma^2/2}}_{\\text{skew premium}},\\qquad \\Var(X)=\\big(e^{\\sigma^2}-1\\big)e^{2\\mu+\\sigma^2}",
      notes: [
        "$\\mu$ and $\\sigma^2$ are the mean and variance **of the log**, not of $X$. This trips up everyone once.",
        "$e^{\\mu}$ is the **median**: half of $\\log X$ lands below $\\mu$, and exponentiating preserves order.",
        "$e^{\\sigma^2/2}$ is the **premium the skew adds**. More uncertainty, bigger gap. At $\\sigma\\to0$ it vanishes and mean meets median.",
      ],
      say: "Here are the two moments. The expected value of X is e to the mu, times e to the sigma squared over two. Be careful: mu and sigma squared are the mean and variance of the log, not of X itself. That trips up everyone once. The first factor, e to the mu, is the median — half of log X lands below mu, and exponentiating preserves order. The second factor is the premium that the skew adds. More uncertainty means a bigger gap. And as sigma goes to zero the premium vanishes, and the mean meets the median exactly as it should." }),

    derive({ dur: 30, heading: "Proving $\\E(X)=e^{\\mu+\\sigma^2/2}$ — the move that runs the whole module",
      lines: [
        ["\\E(X)=\\E(e^{Y}),\\quad Y\\sim N(\\mu,\\sigma^2)", "write it on the log scale"],
        ["=\\int e^{y}\\tfrac{1}{\\sqrt{2\\pi}\\sigma}e^{-(y-\\mu)^2/2\\sigma^2}dy", "LOTUS"],
        ["=\\int \\tfrac{1}{\\sqrt{2\\pi}\\sigma}\\exp\\!\\Big(\\tfrac{2\\sigma^2y-(y-\\mu)^2}{2\\sigma^2}\\Big)dy", "pull $e^{y}$ into the exponent"],
        ["2\\sigma^2y-(y-\\mu)^2=-\\big(y-(\\mu+\\sigma^2)\\big)^2+2\\mu\\sigma^2+\\sigma^4", "complete the square"],
        ["=e^{\\mu+\\sigma^2/2}\\int N(\\mu+\\sigma^2,\\sigma^2)\\,dy=e^{\\mu+\\sigma^2/2}", "the integral is a density, so it is 1"],
      ],
      say: "Let's prove it, because this exact move runs the whole module. Write the expectation on the log scale. Apply LOTUS to turn it into an integral. Now pull e to the y into the exponent. Complete the square in y — and watch what happens. The exponent becomes a normal density again, but centred at mu plus sigma squared instead of mu. What's left outside is a constant, e to the mu plus sigma squared over two. The integral of a density is one. Done." }),

    points({ dur: 20, heading: "The one sentence to remember", tone: "emerald",
      items: [
        "Multiplying a normal density by $e^{y}$ **does not break it**.",
        "It slides the mean up by $\\sigma^2$ and leaves a constant $e^{\\mu+\\sigma^2/2}$ outside.",
        "Remember that, and this proof and the Black-Scholes proof become the *same* proof.",
      ],
      say: "Here's the one sentence to remember. Multiplying a normal density by e to the y does not break it. It slides the mean up by sigma squared, and leaves a constant outside. Remember that, and this proof and the Black-Scholes proof become the same proof." }),

    /* ---------- 4. Phi ---------- */
    title({ n: 4, title: "Meet $\\Phi$", tone: "blue", chapter: "Meet $\\Phi$",
      sub: "The function the pricing formula is built out of.",
      say: "Chapter four. Meet Phi — the function the pricing formula is built out of.", dur: 7 }),

    jargon({ dur: 20, term: "$\\Phi$ — the standard normal CDF", chapter: "Meet $\\Phi$",
      plain: "The **running total** of area under the standard bell curve. $\\Phi(z)$ is the probability a standard normal lands **below** $z$.",
      formal: "It always returns a number between 0 and 1, because it is a probability. $\\Phi(0)=0.5$, $\\Phi(2)\\approx0.977$, $\\Phi(-2)\\approx0.023$. In Python: `scipy.stats.norm.cdf`.",
      say: "Phi, the standard normal CDF. It is the running total of area under the standard bell curve. Phi of z is the probability that a standard normal lands below z. It always returns a number between zero and one, because it is a probability. Phi of zero is a half. Phi of two is about nought point nine seven seven. In Python it's scipy dot stats dot norm dot cdf." }),

    plot({ dur: 24,
      caption: "The two curves are the same information twice: the bell is the **density**, $\\Phi$ is its **running area**. Whenever you see $\\Phi(\\text{something})$ in an option formula, read it as *the probability things end up on the good side of this threshold*.",
      say: "These two curves are the same information twice over. The bell on top is the density. Phi below is its running area — sweep the threshold to the right and watch the area accumulate. Whenever you see Phi of something in an option formula, read it as: the probability that things end up on the good side of this threshold.",
      note: "density above, running area below",
      draw({ ctx, W, H, t, dur, axes }) {
        const z = lerp(-3, 3, easeOut(clamp01(t / (dur * 0.75))));
        const top = { l: 54, r: 22, t: 46, b: H / 2 + 10 };
        const bot = { l: 54, r: 22, t: H / 2 + 16, b: 34 };
        const A = axes(ctx, { x: [-3.2, 3.2], y: [0, 0.45], W, H, pad: top });
        A.grid(6, 3).frame(); A.ticks({ ys: [0, 0.2, 0.4], yfmt: (v) => v.toFixed(1) });
        const d = linspace(-3.2, 3.2, 200).map((x) => [x, normPdf(x)]);
        A.area(d.filter(([x]) => x <= z), 0, { color: P.blueSoft });
        A.line(d, { color: P.blue, width: 2.4 });
        A.vline(z, { color: P.ink, width: 1.8, dash: null });

        const B = axes(ctx, { x: [-3.2, 3.2], y: [0, 1], W, H, pad: bot });
        B.grid(6, 3).frame();
        B.ticks({ xs: [-3, -1.5, 0, 1.5, 3], ys: [0, 0.5, 1], xfmt: (v) => v.toFixed(1), yfmt: (v) => v.toFixed(1) });
        B.line(linspace(-3.2, z, 120).map((x) => [x, normCdf(x)]), { color: P.emerald, width: 2.8 });
        B.dots([[z, normCdf(z)]], { color: P.emerald, r: 4.5 });
        B.chip(`Φ(${z.toFixed(2)}) = ${normCdf(z).toFixed(3)}`, B.L + 8, B.T + 16, { color: P.emerald, bg: "rgba(0,164,114,0.12)" });
      } }),

    /* ---------- 5. the Claim ---------- */
    title({ n: 5, title: "The Claim", tone: "blue", chapter: "The Claim",
      sub: "The engine inside Black-Scholes.",
      say: "Chapter five. The Claim — the engine inside Black-Scholes.", dur: 7 }),

    formula({ dur: 28, chapter: "The Claim",
      heading: "If $\\log(P_t)\\sim N(\\xi,\\tau^2)$ and $K>0$, then",
      tex: "\\E\\big((P_t-K)^+\\big)=e^{\\xi+\\tau^2/2}\\,\\Phi\\!\\Big(\\tfrac{\\xi+\\tau^2-\\log K}{\\tau}\\Big)-K\\,\\Phi\\!\\Big(\\tfrac{\\xi-\\log K}{\\tau}\\Big)",
      notes: [
        "It is a **difference of two terms**, and you already understand both.",
        "The first factor $e^{\\xi+\\tau^2/2}$ is exactly $\\E(P_t)$ — the lognormal mean from chapter three.",
        "Both $\\Phi$ terms are probabilities. Their arguments differ by exactly $\\tau$.",
      ],
      say: "Here is the Claim. If the log of the price is normal with mean xi and variance tau squared, then the expected payoff equals this. Don't be intimidated — it's a difference of two terms, and you already understand both of them. The first factor is exactly the lognormal mean from chapter three. Both Phi terms are probabilities. And notice their arguments differ by exactly tau." }),

    plot({ dur: 26,
      caption: "Read it as **what you collect minus what you pay** — each averaged only over the futures where you actually exercise.",
      say: "Read it as: what you collect, minus what you pay. Each averaged only over the futures where you actually exercise. Phi of d two is the probability you exercise at all. Phi of d one is that same probability, but weighted by how much the stock is worth when you do — and since the paying futures are the expensive ones, Phi of d one is always the bigger number.",
      note: "$\\Phi(d_2)$ = chance you exercise · $\\Phi(d_1)$ = the same, price-weighted",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-1.6, 1.6], y: [0, 1.05], W, H, pad: { l: 52, r: 22, t: 54, b: 38 } });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-1.5, -0.75, 0, 0.75, 1.5], ys: [], xfmt: (v) => v.toFixed(2) });
        const s = data.tau * data.tau;
        const o = linspace(-1.6, 1.6, 220).map((y) => [y, normPdf((y - data.xi) / data.tau)]);
        const k = easeOut(clamp01((t - 2) / (dur * 0.4)));
        const m = linspace(-1.6, 1.6, 220).map((y) => [y, normPdf((y - data.xi - s * k) / data.tau)]);
        a.area(o.filter(([y]) => y >= data.lk), 0, { color: P.blueSoft });
        a.line(o, { color: P.blue, width: 2, alpha: 0.9 });
        if (k > 0.02) {
          a.area(m.filter(([y]) => y >= data.lk), 0, { color: P.emeraldSoft });
          a.line(m, { color: P.emerald, width: 2.4 });
        }
        a.vline(data.lk, { color: P.amber, width: 2 });
        a.label("log K", { x: data.lk + 0.05, y: 0.99, color: P.amber, size: 12 });
        a.chip(`Φ(d₂) = ${data.Pd2.toFixed(3)}`, a.L + 10, a.T + 16, { color: P.blue });
        if (k > 0.5) a.chip(`Φ(d₁) = ${data.Pd1.toFixed(3)}`, a.L + 10, a.T + 44, { color: P.emerald, bg: "rgba(0,164,114,0.12)" });
      } }),

    /* ---------- 6. the proof ---------- */
    title({ n: 6, title: "Proving the Claim", tone: "blue", chapter: "Proving the Claim",
      sub: "Two tools, five lines, and one trick you have already seen.",
      say: "Chapter six. Proving the Claim. Two tools, five lines, and one trick you have already seen.", dur: 8 }),

    jargon({ dur: 19, term: "LOTUS", chapter: "Proving the Claim",
      plain: "The Law of the Unconscious Statistician. To average a **function** of a random variable, you do not need the distribution of the function — just integrate the function against the density you already have.",
      formal: "$\\E(g(X))=\\int g(x)f_X(x)\\,dx$. It is why we never have to work out the distribution of $(P_t-K)^+$ itself.",
      say: "LOTUS. The Law of the Unconscious Statistician. To average a function of a random variable, you don't need the distribution of that function — you just integrate the function against the density you already have. It's why we never have to work out the distribution of the payoff itself, which would be genuinely horrible." }),

    derive({ dur: 30, heading: "Step 1 — split the integral at the strike",
      lines: [
        ["\\E\\big((P_t-K)^+\\big)=\\E\\big((e^{Y}-K)^+\\big)", "write $Y=\\log P_t$"],
        ["=\\int_{-\\infty}^{\\infty}(e^{y}-K)^+f_Y(y)\\,dy", "LOTUS"],
        ["=\\int_{\\log K}^{\\infty}(e^{y}-K)f_Y(y)\\,dy", "below $\\log K$ the integrand is zero"],
        ["=\\int_{\\log K}^{\\infty}e^{y}f_Y(y)\\,dy-K\\,P(Y>\\log K)", "split into two"],
        ["=\\int_{\\log K}^{\\infty}e^{y}f_Y(y)\\,dy-K\\,\\Phi\\!\\Big(\\tfrac{\\xi-\\log K}{\\tau}\\Big)", "standardize the second piece"],
      ],
      say: "Step one: split the integral at the strike. Write Y for the log price. Apply LOTUS. Now here's the key move — below log K the payoff is zero, so the whole lower half of the integral disappears and the lower limit becomes log K. That is the positive part doing its work. Split what's left into two pieces. The second piece is just a probability, which standardizes straight into Phi. That's the second term of the Claim, already finished." }),

    derive({ dur: 30, heading: "Step 2 — complete the square on what is left",
      lines: [
        ["\\int_{\\log K}^{\\infty}\\tfrac{e^{y}}{\\sqrt{2\\pi}\\tau}e^{-(y-\\xi)^2/2\\tau^2}dy", "the remaining integral"],
        ["=\\int_{\\log K}^{\\infty}\\tfrac{1}{\\sqrt{2\\pi}\\tau}\\exp\\!\\Big(\\tfrac{-\\,y^2+2y(\\xi+\\tau^2)-\\xi^2}{2\\tau^2}\\Big)dy", "absorb $e^{y}$; the mean moves to $\\xi+\\tau^2$"],
        ["=e^{\\xi+\\tau^2/2}\\,P\\big(X>\\log K\\big),\\quad X\\sim N(\\xi+\\tau^2,\\tau^2)", "complete the square, pull the constant out"],
        ["=e^{\\xi+\\tau^2/2}\\,\\Phi\\!\\Big(\\tfrac{\\xi+\\tau^2-\\log K}{\\tau}\\Big)\\quad\\blacksquare", "standardize"],
      ],
      say: "Step two: complete the square on what's left. Absorb e to the y into the exponent — and there it is again, the same move from chapter three. The mean shifts from xi to xi plus tau squared. Complete the square, pull the constant outside, and what remains is a normal probability above log K. Standardize it and you have the first term. Put the two together and the Claim is proved." }),

    points({ dur: 24, heading: "What to actually remember from the proof", tone: "blue",
      items: [
        "**LOTUS** turns an expectation into an integral against a density you already have.",
        "The lower limit becomes $\\log K$ because the payoff is zero below the strike — that is the positive part earning its keep.",
        "**Completing the square** shifts the mean from $\\xi$ to $\\xi+\\tau^2$ — which is precisely why $d_1$ carries the extra $\\tau^2$.",
        "You will not be asked to reproduce every line. You should be able to say what each step *does*.",
      ],
      say: "What should you actually remember from this proof? LOTUS turns an expectation into an integral against a density you already have. The lower limit becomes log K because the payoff is zero below the strike — that's the positive part earning its keep. Completing the square shifts the mean from xi to xi plus tau squared, which is precisely why d one carries that extra term. You will not be asked to reproduce every line under time pressure. You should be able to say what each step does." }),

    /* ---------- recap ---------- */
    recap({ dur: 30, items: [
      "Prices are **lognormal** because a price cannot go negative, compounds multiplicatively, and is lopsided.",
      "$X$ lognormal means $\\log X$ is normal — and $\\mu,\\sigma^2$ describe the **log**, not $X$.",
      "$\\E(X)=e^{\\mu+\\sigma^2/2}$: the median times a premium that grows with uncertainty.",
      "$\\Phi$ is just running area under the bell curve — a probability, always between 0 and 1.",
      "The Claim is *what you collect minus what you pay*, averaged over the futures where you exercise.",
    ],
    say: "To recap. Prices are modelled as lognormal because a price cannot go negative, compounds multiplicatively, and is lopsided. X lognormal means log X is normal — and mu and sigma squared describe the log, not X itself. The mean is the median times a premium that grows with uncertainty. Phi is just running area under the bell curve, always between zero and one. And the Claim reads as: what you collect, minus what you pay, averaged over the futures where you exercise." }),
  ],
});
