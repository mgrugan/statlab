/* f13 — The Poisson Process (full lecture) */

import { PALETTE as P, linspace, normals, rng, clamp01, easeOut, lerp } from "@/lib/anim";
import { compile, title, jargon, points, formula, derive, plot, recap, revealed } from "@/lib/scenes";

const D = (() => {
  const u = rng(1301);
  /* exponential waiting times at rate 1.4, and the event times they generate */
  const LAM = 1.4;
  const gaps = Array.from({ length: 26 }, () => -Math.log(1 - u()) / LAM);
  const events = [];
  let s = 0;
  for (const g of gaps) { s += g; if (s < 12) events.push(s); }

  /* binomial(n, lambda/n) pmf converging on Poisson(lambda) for lambda = 3 */
  const L3 = 3;
  const fact = (k) => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
  const pois = Array.from({ length: 11 }, (_, k) => Math.exp(-L3) * L3 ** k / fact(k));
  const binom = (n) => Array.from({ length: 11 }, (_, k) => {
    if (k > n) return 0;
    let c = 1;
    for (let i = 0; i < k; i++) c *= (n - i) / (i + 1);
    const p = L3 / n;
    return c * p ** k * (1 - p) ** (n - k);
  });

  /* a recombining binomial price tree, u = 2, d = 1/2, S0 = 4 */
  const tree = [];
  for (let t = 0; t <= 3; t++)
    for (let k = 0; k <= t; k++) tree.push([t, 4 * 2 ** k * 0.5 ** (t - k), k]);

  /* exponential density, and the memoryless shift */
  const dens = linspace(0, 7, 160).map((x) => [x, LAM * Math.exp(-LAM * x)]);
  return { LAM, gaps, events, pois, binom, tree, dens, L3 };
})();

export default compile({
  id: "f13",
  title: "The Poisson Process",
  blurb: "The distributions behind market jumps — Bernoulli, binomial, Poisson and exponential — the memoryless property, and the five properties that define a Poisson process.",
  takeaway: "Jumps arrive independently at a constant rate. That single assumption gives you Poisson counts, exponential gaps, and a memoryless wait — and it is the foundation the Merton and DEJD models are built on.",
  data: D,
  scenes: [

    /* ---------- 1. why ---------- */
    title({ n: 1, title: "Why this Part exists", tone: "slate", chapter: "Motivation",
      sub: "The fourth deficiency in the lognormal pricing model.",
      say: "Chapter one. Why this Part exists. We're here because of the fourth and last deficiency in the lognormal pricing model.", dur: 10 }),

    points({ dur: 30, heading: "Four deficiencies in the lognormal pricing model", tone: "slate",
      items: [
        "The **heavy-tailed**, leptokurtic nature of log returns — Parts 2 and 3.",
        "**Volatility clustering** — Part 4, and the reason ARCH and GARCH exist.",
        "The **leverage effect**, including the asymmetry in the relationship — Part 5.",
        "**Discontinuities in prices.** That is this Part, and the two that follow it.",
      ],
      say: "At the end of Part five, the lognormal pricing model was left with four known deficiencies. One: the heavy tailed, leptokurtic nature of log returns. Two: volatility clustering. Three: the leverage effect, including the asymmetry in the relationship. And four, marked in the notes as to be covered — discontinuities in prices. That fourth one is this Part. Real prices do not move smoothly. News arrives, and the price jumps. The Poisson process is the machinery for modelling when those jumps happen." }),

    points({ dur: 24, heading: "Why an accurate pricing model matters", tone: "amber",
      items: [
        "**Mispricing of derivatives** — get the distribution wrong and every option you price is wrong.",
        "**Managing risk** — the tail behaviour of the pricing model is crucial to understanding how much risk you are carrying.",
        "**Portfolio optimization** relies on an accurate understanding of how real prices behave.",
      ],
      say: "Before we start, it is worth asking why getting the pricing model right matters at all. Three reasons from the notes. First, mispricing of derivatives — get the distribution wrong and every option you price is wrong. Second, managing risk: the tail behaviour of the pricing model is crucial to understanding how much risk we are taking. And third, portfolio optimization relies on an accurate understanding of how real prices behave." }),

    /* ---------- 2. the building blocks ---------- */
    title({ n: 2, title: "Three distributions", tone: "blue", chapter: "The distributions",
      sub: "Bernoulli, binomial, Poisson — and how the third comes from the second.",
      say: "Chapter two. Three distributions: Bernoulli, binomial and Poisson. And, importantly, how the third one comes out of the second.", dur: 10 }),

    jargon({ dur: 20, term: "Bernoulli trial", chapter: "The distributions",
      plain: "An experiment with two possible outcomes — **success** and **failure**.",
      formal: "$X\\sim\\text{Bernoulli}(p)$ takes the value 1 on a success and 0 on a failure, with $P(X=1)=p$. Then $\\E(X)=p$ and $\\Var(X)=p(1-p)$.",
      say: "A Bernoulli trial is an experiment with two possible outcomes, typically called success and failure. X has the Bernoulli p distribution if it equals one when the trial is a success and zero when it is a failure, with probability p of success. Its expected value is p, and its variance is p times one minus p. That variance follows in one line, because for a zero one variable, X squared is just X." }),

    formula({ dur: 24, heading: "The binomial$(n,p)$ distribution", tone: "blue",
      tex: "f_X(k)=\\binom{n}{k}p^k(1-p)^{n-k},\\quad k=0,1,\\ldots,n",
      notes: [
        "$X$ is the number of successes in $n$ **independent** Bernoulli trials.",
        "$\\E(X)=np$ and $\\Var(X)=np(1-p)$.",
        "Roll a die ten times and count the 1's: $X\\sim\\text{binomial}(10,1/6)$.",
      ],
      say: "Count the successes in n independent Bernoulli trials and you have the binomial. Its probability mass function is n choose k, times p to the k, times one minus p to the n minus k. Its expected value is n p, and its variance is n p times one minus p. Concretely: roll a die ten times and count the ones, and you have a binomial with n equals ten and p equals one sixth, where success means rolling a one." }),

    plot({ dur: 32, chapter: "The distributions",
      caption: "The **binomial model** for stock prices. From $S$, the next value is $uS$ with probability $p$ or $dS$ with probability $1-p$. With $u=1/d$ the tree **recombines**.",
      say: "Here is where the binomial shows up in finance. The binomial model describes prices in discrete time. Starting at a value S, the value next period could be u S with probability p, or d S with probability one minus p, with u bigger than d. It is often assumed that u equals one over d, in which case the tree recombines and a simple picture like this one captures all the possible paths. Here u is two, d is one half, and the starting price is four.",
      note: "$u=2$, $d=\\tfrac12$, $S_0=4$ — after $t$ steps there are $t+1$ possible values",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-0.4, 3.5], y: [0, 36], W, H, pad: { l: 56, r: 24, t: 56, b: 44 } });
        a.grid(4, 4).frame();
        a.ticks({ xs: [0, 1, 2, 3], ys: [0, 8, 16, 24, 32], xfmt: (v) => `t=${v}` });
        const k = clamp01((t - 1.5) / (dur * 0.5));
        const show = Math.round(lerp(1, 4, easeOut(k)));
        /* edges */
        for (const [tt, v, kk] of data.tree) {
          if (tt >= show - 1 || tt >= 3) continue;
          for (const nxt of [v * 2, v * 0.5]) {
            a.line([[tt, v], [tt + 1, nxt]], { color: P.grid, width: 1.4 });
          }
        }
        for (const [tt, v, kk] of data.tree) {
          if (tt >= show) continue;
          a.dots([[tt, v]], { color: kk === tt ? P.emerald : P.blue, r: 5 });
          a.note(`$${v % 1 ? v.toFixed(1) : v}`, a.sx(tt) + 9, a.sy(v),
            { color: P.ink, size: 11, weight: 600 });
        }
        if (show > 3) a.note("each node: $S_0u^kd^{t-k}$".replace(/\$/g, ""), a.L + 10, a.T + 18,
          { color: P.muted, size: 11.5, weight: 600 });
      } }),

    points({ dur: 26, heading: "The trap: what is actually binomial here", tone: "amber",
      items: [
        "After $t$ steps, $S_t$ takes the $t+1$ values $S_0u^kd^{\\,t-k}$, where $k$ is the number of **up** steps.",
        "Since the steps are independent, $k\\sim\\text{binomial}(t,p)$ — **the count of up steps is binomial.**",
        "**$S_t$ itself is NOT binomial.** A binomial variable takes the integers $0,\\ldots,t$; $S_t$ takes $t+1$ products.",
      ],
      say: "And here is the trap, which the notes flag explicitly. After t steps, S t takes the t plus one values S nought u to the k, d to the t minus k, where k is the number of up steps. Since the steps are independent, the number of up steps is binomial with parameters t and p. So the count of up steps is binomial. But S t itself is not binomial. A binomial random variable takes the values zero through t; S t takes those t plus one products. Its probabilities happen to be binomial probabilities, which is exactly what makes the mistake tempting." }),

    /* ---------- 3. Poisson ---------- */
    title({ n: 3, title: "The Poisson distribution", tone: "blue", chapter: "Poisson",
      sub: "A limit of binomials — and the distribution whose mean equals its variance.",
      say: "Chapter three. The Poisson distribution — which arises as a limit of binomials, and which has the distinctive property that its mean equals its variance.", dur: 10 }),

    formula({ dur: 24, heading: "The Poisson$(\\lambda)$ distribution", tone: "blue",
      tex: "f_X(k)=\\frac{e^{-\\lambda}\\lambda^k}{k!},\\quad k=0,1,2,\\ldots",
      notes: [
        "$\\E(X)=\\lambda$ and $\\Var(X)=\\lambda$. **The mean and the variance are the same number.**",
        "The natural model for **counts**: how many times something happens in a fixed period.",
      ],
      say: "A random variable X has the Poisson lambda distribution, for lambda positive, if its probability mass function is e to the minus lambda, times lambda to the k, over k factorial. Its expected value is lambda, and its variance is also lambda. The mean and the variance are the same number — that is the Poisson's signature, and the sort of thing a one line exam question asks for directly. It is the natural model for counts: how many times something happens in a fixed period of time." }),

    plot({ dur: 34, chapter: "Poisson",
      caption: "Fix $\\lambda=3$ and let $X_n\\sim\\text{binomial}(n,\\lambda/n)$. As $n$ grows, the binomial bars **converge on the Poisson**.",
      say: "Now watch where the Poisson comes from. Fix lambda at three, and take a binomial with n trials and success probability lambda over n — so as n grows, each trial gets rarer, but the expected count stays at three. Here are the binomial probabilities for n equals five, then ten, then thirty, then a hundred, against the Poisson in green. They converge. That is the derivation: the Poisson is the limit of binomial random variables when the number of trials grows and the success probability shrinks to keep the mean fixed.",
      note: "expected count is $n\\cdot\\lambda/n=\\lambda$ at **every** $n$ — only the shape moves",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-0.6, 10.6], y: [0, 0.3], W, H, pad: { l: 58, r: 24, t: 58, b: 44 } });
        a.grid(5, 3).frame();
        a.ticks({ xs: [0, 2, 4, 6, 8, 10], ys: [0, 0.1, 0.2, 0.3], yfmt: (v) => v.toFixed(1) });
        const ns = [5, 10, 30, 100];
        const k = clamp01((t - 1.5) / (dur * 0.72));
        const idx = Math.min(ns.length - 1, Math.floor(k * ns.length));
        const bars = data.binom(ns[idx]);
        bars.forEach((p, i) => {
          const x0 = a.sx(i - 0.34), x1 = a.sx(i + 0.06);
          ctx.save(); ctx.fillStyle = P.blue; ctx.globalAlpha = 0.65;
          ctx.fillRect(x0, a.sy(p), x1 - x0, a.sy(0) - a.sy(p));
          ctx.restore();
        });
        data.pois.forEach((p, i) => {
          const x0 = a.sx(i + 0.06), x1 = a.sx(i + 0.46);
          ctx.save(); ctx.fillStyle = P.emerald; ctx.globalAlpha = 0.8;
          ctx.fillRect(x0, a.sy(p), x1 - x0, a.sy(0) - a.sy(p));
          ctx.restore();
        });
        a.chip(`binomial(n=${ns[idx]}, 3/${ns[idx]})`, a.L + 12, a.T + 16, { color: P.blue });
        a.chip("Poisson(3)", a.L + 12, a.T + 40, { color: P.emerald, bg: "rgba(0,164,114,0.12)" });
      } }),

    derive({ dur: 34, heading: "Why the limit works", chapter: "Poisson",
      lines: [
        ["P(X_n=k)=\\left(\\frac{n!}{k!(n-k)!}\\right)\\left(\\frac{\\lambda}{n}\\right)^k\\left(1-\\frac{\\lambda}{n}\\right)^{n-k}", "the binomial pmf with $p=\\lambda/n$"],
        ["=\\left(\\frac{\\lambda^k}{k!}\\right)\\left(\\frac{n(n-1)\\cdots(n-k+1)}{n^k}\\right)\\left(1-\\frac{\\lambda}{n}\\right)^{n}\\left(1-\\frac{\\lambda}{n}\\right)^{-k}", "split into four pieces"],
        ["\\lim_{n\\to\\infty}P(X_n=k)=\\frac{\\lambda^k}{k!}\\cdot1\\cdot e^{-\\lambda}\\cdot1", "first constant, second to one, third to $e^{-\\lambda}$, fourth to one"],
      ],
      say: "Here is why the limit works. Start from the binomial probability mass function with p equal to lambda over n. Split it into four pieces: lambda to the k over k factorial, then a ratio of falling factorials over n to the k, then one minus lambda over n to the n, then one minus lambda over n to the minus k. Now let n go to infinity. The first piece is constant. The second converges to one. The third converges to e to the minus lambda. And the fourth converges to one. So the e to the minus lambda sitting in the Poisson formula is nothing more than the limit of one minus lambda over n, to the n." }),

    /* ---------- 4. exponential ---------- */
    title({ n: 4, title: "The Exponential and memorylessness", tone: "amber", chapter: "Exponential",
      sub: "The gaps between events, and the property that makes jumps unpredictable.",
      say: "Chapter four. The exponential distribution — which describes the gaps between events — and the memoryless property that makes jumps genuinely unpredictable.", dur: 11 }),

    formula({ dur: 26, heading: "The Exponential$(\\lambda)$ distribution", tone: "amber",
      tex: "f_X(x)=\\lambda e^{-\\lambda x}\\ (x\\ge0),\\qquad F_X(x)=1-e^{-\\lambda x},\\qquad P(X>x)=e^{-\\lambda x}",
      notes: [
        "$\\E(X)=1/\\lambda$ and $\\Var(X)=1/\\lambda^2$.",
        "Mind the direction: a **large** rate means events arrive **often**, so the mean wait $1/\\lambda$ is **small**.",
        "The survival form $P(X>x)=e^{-\\lambda x}$ is the one you actually use.",
      ],
      say: "When X has the exponential lambda distribution, its density is lambda e to the minus lambda x for x at least zero. Its expected value is one over lambda, and its variance is one over lambda squared. Its cumulative distribution function is one minus e to the minus lambda x. Mind the direction of lambda: a large rate means events arrive often, so the mean waiting time, one over lambda, is small. And note the survival form — the probability X exceeds x is e to the minus lambda x. That is the version you will actually use." }),

    derive({ dur: 32, heading: "The memoryless property", chapter: "Exponential",
      lines: [
        ["P(X>a+b\\mid X>b)=\\frac{P(X>a+b\\ \\text{and}\\ X>b)}{P(X>b)}", "rule for conditional probability, valid since $P(X>b)>0$"],
        ["=\\frac{P(X>a+b)}{P(X>b)}=\\frac{e^{-\\lambda(a+b)}}{e^{-\\lambda b}}", "$X>a+b$ already implies $X>b$"],
        ["=e^{-\\lambda a}=P(X>a)", "the $b$ cancels completely"],
      ],
      say: "Now the property that matters. Take a and b both positive. The probability X exceeds a plus b, given that X already exceeds b, is by the rule for conditional probability the joint probability over the probability X exceeds b. But X exceeding a plus b already implies X exceeds b, so the intersection is just the event X exceeds a plus b. That gives e to the minus lambda a plus b, over e to the minus lambda b. The b cancels completely, leaving e to the minus lambda a — which is exactly the probability X exceeds a." }),

    plot({ dur: 30, chapter: "Exponential",
      caption: "**What it means.** Model the gaps between jumps as Exponential. Having waited $b$ units already, the chance of waiting a further $a$ is **the same as it was at the start**.",
      say: "Here is what that means in words. Imagine modelling the times between events — jumps, say — as exponential with rate lambda. Given that we have waited b time units for an event, the probability that we have to wait a additional time units is the same as the original probability of waiting a time units. The distribution forgets how long it has been since the previous event. So no — a jump does not become more likely just because none has happened for a while. Applied to markets, that means crashes are unpredictable and do not cluster in time, on any predictable schedule. But do notice: that is an assumption.",
      note: "the shifted tail is the **same shape**, rescaled — that is all memorylessness says",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 7], y: [0, 1.5], W, H, pad: { l: 56, r: 24, t: 56, b: 44 } });
        a.grid(5, 3).frame();
        a.ticks({ xs: [0, 2, 4, 6], ys: [0, 0.5, 1, 1.5], yfmt: (v) => v.toFixed(1) });
        a.area(data.dens, 0, { color: P.amberSoft });
        a.line(data.dens, { color: P.amber, width: 2.2 });
        const k = easeOut(clamp01((t - 3) / (dur * 0.45)));
        const b = lerp(0, 2.6, k);
        if (b > 0.05) {
          a.vline(b, { color: P.red, width: 1.6 });
          a.note(`waited b = ${b.toFixed(1)}`, a.sx(b) + 8, a.T + 20, { color: P.red, size: 11.5, weight: 700 });
          /* the conditional density beyond b, rescaled — same shape */
          const cond = data.dens.filter(([x]) => x >= b)
            .map(([x, y]) => [x - b, y / Math.exp(-data.LAM * b)]);
          a.line(cond, { color: P.blue, width: 2.2, dash: [5, 4] });
          a.note("remaining wait: identical shape", a.L + 10, a.T + 20, { color: P.blue, size: 11.5, weight: 700 });
        }
      } }),

    /* ---------- 5. the process ---------- */
    title({ n: 5, title: "The Poisson Process", tone: "emerald", chapter: "The process",
      sub: "Five properties, and what they buy you.",
      say: "Chapter five. The Poisson process itself — five properties, and what each of them buys you.", dur: 10 }),

    points({ dur: 38, heading: "Events occur as a Poisson Process with rate $\\lambda$", tone: "emerald",
      items: [
        "The number of events in an interval of length $T$ has the **Poisson$(\\lambda T)$** distribution.",
        "The **times between events** are **Exponential$(\\lambda)$** random variables.",
        "Those times between events are **independent**.",
        "The numbers of events in **disjoint** time intervals are **independent**.",
        "The waiting time for $k$ events has the **Gamma$(k,\\lambda)$** distribution — also called the Erlang.",
      ],
      say: "Take the subinterval construction and extend the time interval to infinity. That gives the Poisson process with rate lambda. Saying events occur as a Poisson process with rate lambda means all five of the following. One: if Y is the number of events during an interval of time of length T, then Y has the Poisson lambda T distribution. Two: the times between events are exponential lambda random variables. Three: those times between events are independent. Four: the numbers of events in disjoint time intervals are independent random variables. And five: the waiting time for k events has the Gamma k lambda distribution, also called the Erlang. Note that the fifth follows from the second and third together, since a sum of k independent exponentials is a Gamma." }),

    plot({ dur: 30, chapter: "The process",
      caption: "One realization: **exponential gaps** along the line, **Poisson counts** in any window. Both descriptions are the same process.",
      say: "Here is a single realization. Each tick is an event. The gaps between the ticks are the exponential waiting times — independent of one another, and memoryless. Slide a window of fixed length along the line and count the events inside it, and that count has the Poisson distribution with rate lambda times the window length. Two descriptions, one process. That equivalence is exactly what Properties one and two are asserting.",
      note: "window of length 3 → count is Poisson$(3\\lambda)$",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 12], y: [0, 1], W, H, pad: { l: 40, r: 24, t: 60, b: 46 } });
        a.frame();
        a.ticks({ xs: [0, 3, 6, 9, 12] });
        const n = revealed(t, dur, data.events.length, { start: 0.03, end: 0.6 });
        const shown = data.events.slice(0, n);
        /* sliding window */
        const k = clamp01((t - dur * 0.5) / (dur * 0.42));
        if (k > 0) {
          const w0 = lerp(0, 9, easeOut(k));
          ctx.save(); ctx.fillStyle = P.emeraldSoft;
          ctx.fillRect(a.sx(w0), a.T, a.sx(w0 + 3) - a.sx(w0), a.B - a.T);
          ctx.restore();
          const c = shown.filter((e) => e >= w0 && e < w0 + 3).length;
          a.note(`count in window: ${c}`, a.sx(w0) + 8, a.T + 20,
            { color: P.emerald, size: 12.5, weight: 700 });
        }
        for (const e of shown) {
          a.line([[e, 0.28], [e, 0.72]], { color: P.blue, width: 2.6 });
        }
        a.hline(0.5, { color: P.muted, width: 1.2, dash: null });
        for (let i = 1; i < Math.min(shown.length, 6); i++) {
          const mid = (shown[i - 1] + shown[i]) / 2;
          a.note("←→", a.sx(mid), a.sy(0.86), { color: P.muted, size: 10, align: "center" });
        }
        a.note("gaps ~ Exponential(λ)", a.L + 6, a.sy(0.95), { color: P.muted, size: 11.5, weight: 600 });
      } }),

    derive({ dur: 32, heading: "Property 1 implies Property 2", chapter: "The process",
      lines: [
        ["F_U(u)=P(U\\le u)=1-P(U>u)", "let $U$ be the time to the next event; take $u>0$"],
        ["=1-P(\\text{no events in }(0,u))=1-P(X=0),\\quad X\\sim\\text{Poisson}(\\lambda u)", "waiting past $u$ means nothing happened in $(0,u)$"],
        ["=1-\\frac{e^{-\\lambda u}(\\lambda u)^0}{0!}=1-e^{-\\lambda u}", "plug $k=0$ into the Poisson pmf"],
      ],
      say: "The two descriptions are not independent assumptions — the first implies the second. Let U be the time to the next event, and take u positive. The cumulative distribution function of U is one minus the probability U exceeds u. But U exceeding u is exactly the event that no events occurred during the interval zero to u, and by Property one that count is Poisson with rate lambda u. So we need the probability that a Poisson lambda u variable equals zero. Plug k equals zero into the Poisson formula and everything collapses to e to the minus lambda u. So the CDF is one minus e to the minus lambda u — which is precisely the CDF of the exponential lambda distribution. By uniqueness of the CDF, U is exponential with rate lambda." }),

    /* ---------- 6. into pricing ---------- */
    title({ n: 6, title: "Putting a jump into the price", tone: "blue", chapter: "Into pricing",
      sub: "The foundation of the Merton jump diffusion model.",
      say: "Chapter six. Putting a jump into the price — which is the foundation of the Merton jump diffusion model in Part seven.", dur: 10 }),

    formula({ dur: 30, heading: "The jump pricing model", tone: "blue",
      tex: "P_T=\\exp\\left(X_1+\\sum_{i=1}^{X_2}Z_i\\right)",
      notes: [
        "$X_1\\sim\\text{Normal}(\\nu,\\xi^2)$ — the ordinary fluctuations on the log scale.",
        "$X_2\\sim\\text{Poisson}(\\lambda T)$ — the **number of jumps** before maturity.",
        "$Z_i\\sim\\text{Normal}(0,\\psi^2)$ — the **size** of each jump. All independent.",
      ],
      say: "Suppose X two is the number of jumps between now and the maturity date for a call option, arriving as a Poisson process with rate lambda per day, and let T be the time to maturity in days. When a jump occurs, its size is normally distributed with mean zero and variance psi squared. There is still an underlying normal distribution modelling the ordinary fluctuations in the stock price on the log scale. So the price at maturity is the exponential of X one plus the sum of X two jump sizes, where X one is normal with mean nu and variance xi squared, X two is Poisson with rate lambda T, and the Z's are normal with mean zero and variance psi squared — all independent." }),

    derive({ dur: 36, heading: "Pricing by conditioning on the number of jumps", chapter: "Into pricing",
      lines: [
        ["\\E\\big((P_T-K)^+\\big)=\\sum_{j=0}^{\\infty}\\E\\big((P_T-K)^+\\mid X_2=j\\big)P(X_2=j)", "law of total probability"],
        ["X_1+\\sum_{i=1}^{j}Z_i\\sim\\text{Normal}\\big(\\nu,\\ \\xi^2+j\\psi^2\\big)", "given $X_2=j$: independent normals add, variances add"],
        ["P_T\\mid(X_2=j)\\sim\\text{lognormal}\\big(\\nu,\\ \\xi^2+j\\psi^2\\big)", "so each term is the Part 2 result with the variance updated"],
        ["P(X_2=j)=\\frac{e^{-\\lambda T}(\\lambda T)^j}{j!}", "the Poisson weights"],
      ],
      say: "Now the trick that makes this computable. Condition on how many jumps occurred, because given that number, everything is lognormal again. By the law of total probability, the expected payoff is the sum over j of the expected payoff given j jumps, times the probability of j jumps. When X two equals j, the exponent is a sum of j plus one independent normals — so it is normal with mean nu and variance xi squared plus j psi squared. Means add, variances add. Exponentiating, the price given j jumps is lognormal with those same parameters. So each term is just the Part two lognormal result, with the variance updated from xi squared to xi squared plus j psi squared. And the weights come straight from the Poisson probability mass function." }),

    points({ dur: 24, heading: "What that formula actually is", tone: "blue",
      items: [
        "A **Poisson-weighted average of Black-Scholes prices**, each computed with a **larger variance**.",
        "Which is exactly what the `merton_price` function does in code — and why it has to **truncate an infinite sum**.",
        "This forms the foundation for the **Merton jump diffusion model**, which is Part 7.",
      ],
      say: "Step back and look at what that formula is. It is a Poisson weighted average of Black Scholes prices, each one computed with a larger variance than the last. That is exactly what the merton price function does in code — and it is also why that function has to truncate an infinite sum at some maximum number of jumps. This forms the foundation for the Merton jump diffusion model, which is Part seven." }),

    recap({ dur: 32, items: [
      "**Bernoulli** → **binomial** → **Poisson**: the Poisson is the limit of binomial$(n,\\lambda/n)$ as $n\\to\\infty$.",
      "**Poisson:** $\\E(X)=\\Var(X)=\\lambda$. **Exponential:** $\\E(X)=1/\\lambda$, $\\Var(X)=1/\\lambda^2$, $P(X>x)=e^{-\\lambda x}$.",
      "**Memoryless:** $P(X>a+b\\mid X>b)=P(X>a)$. Waiting longer does not make a jump more likely.",
      "**Five properties:** Poisson$(\\lambda T)$ counts, Exponential gaps, independent gaps, independent **disjoint** windows, Gamma$(k,\\lambda)$ waits.",
      "In the binomial price model, the **number of up steps** is binomial — **$S_t$ is not**.",
    ],
    say: "To recap. Bernoulli leads to binomial, and binomial leads to Poisson: the Poisson is the limit of a binomial with n trials and success probability lambda over n, as n goes to infinity. For the Poisson, the mean and the variance are both lambda. For the exponential, the mean is one over lambda, the variance is one over lambda squared, and the survival probability is e to the minus lambda x. The memoryless property says the probability of waiting a further a, given you have already waited b, equals the original probability of waiting a. The Poisson process has five properties: Poisson lambda T counts, exponential gaps, independent gaps, independent counts in disjoint windows, and Gamma waits for k events. And finally, in the binomial price model, the number of up steps is binomial — S t itself is not." }),
  ],
});
