/* f10 — ARCH and GARCH Models (full lecture) */

import { PALETTE as P, linspace, garch, normals, clamp01, easeOut, lerp } from "@/lib/anim";
import { compile, title, jargon, points, formula, derive, plot, code, recap, revealed } from "@/lib/scenes";
import { pc } from "./shared";

const D = (() => {
  const omega = 1e-5, alpha = 0.09, beta = 0.9;
  const g = garch({ omega, alpha, beta, n: 300, seed: 41, shockAt: 90, shockSize: 6 });
  // an ARCH(1): all the weight on the last squared return, no memory term
  const a1 = garch({ omega: 4e-5, alpha: 0.6, beta: 0, n: 300, seed: 41, shockAt: 90, shockSize: 6 });
  const persist = alpha + beta;
  return {
    ...g, arch: a1, omega, alpha, beta, persist,
    halfLife: Math.log(0.5) / Math.log(persist),
    uncondVol: Math.sqrt(omega / (1 - persist)),
    aic: [["ARCH(2)", 900.3], ["ARCH(3)", 890.6], ["GARCH(1,1)", 832.3], ["GARCH(2,2)", 835.1]],
  };
})();

export default compile({
  id: "f10",
  title: "ARCH and GARCH Models",
  blurb: "The models built specifically to reproduce volatility clustering — what each parameter does, why GARCH beat ARCH, and where the stationarity condition comes from.",
  takeaway: "$\\alpha+\\beta$ is the whole personality of a fitted GARCH: the fraction of a volatility shock still present tomorrow. Below 1 it fades; at 1 it never does, and there is no long-run variance at all.",
  data: D,
  scenes: [

    /* ---------- 1. conditional variance ---------- */
    title({ n: 1, title: "Letting the variance move", tone: "slate", chapter: "Conditional variance",
      sub: "Module 9 proved one $\\sigma$ is not enough. Now we fix it.",
      say: "Chapter one. Letting the variance move. Module nine proved that a single fixed sigma is not enough. This module fixes it.", dur: 11 }),

    jargon({ dur: 28, term: "Conditional variance", chapter: "Conditional variance",
      plain: "The variance of tomorrow's return **given everything you know today**. Not the long-run average — today's specific forecast.",
      formal: "$\\sigma_t^2=\\Var\\big(X_t\\mid\\mathcal{F}_{t-1}\\big)$, where $\\mathcal{F}_{t-1}$ means the whole history up to $t-1$. The **unconditional** variance is the long-run average of these.",
      say: "Conditional variance is the variance of tomorrow's return given everything you know today. Not the long run average — today's specific forecast. We write it sigma squared sub t, the variance of X t conditional on F t minus one, where F t minus one is shorthand for the entire history up to yesterday. And the unconditional variance, the one you'd estimate from the whole sample, is just the long run average of these conditional ones." }),

    formula({ dur: 26,
      heading: "The two conditional moments",
      tex: "\\mu_t=\\E\\big(X_t\\mid\\mathcal{F}_{t-1}\\big),\\qquad \\sigma_t^2=\\Var\\big(X_t\\mid\\mathcal{F}_{t-1}\\big)",
      notes: [
        "Everything in this module models $\\sigma_t^2$ and leaves $\\mu_t=0$.",
        "That is deliberate: returns are **nearly unpredictable in direction**, so there is little to model in the mean.",
        "But they are **very** predictable in magnitude — which is exactly what $\\sigma_t^2$ captures.",
      ],
      say: "There are two conditional moments. The conditional mean, and the conditional variance. Everything in this module models the variance and simply sets the mean to zero. That's deliberate, not lazy: returns are nearly unpredictable in direction, so there's very little to model in the mean. But they are extremely predictable in magnitude. And that is exactly what the conditional variance captures." }),

    /* ---------- 2. ARCH ---------- */
    title({ n: 2, title: "ARCH — the first attempt", tone: "blue", chapter: "ARCH",
      sub: "Make today's variance depend on yesterday's surprise.",
      say: "Chapter two. ARCH, the first attempt. The idea is simple: make today's variance depend on yesterday's surprise.", dur: 10 }),

    formula({ dur: 30, chapter: "ARCH",
      heading: "The ARCH(1) model",
      tex: "X_t=\\epsilon_t\\sqrt{\\omega+\\alpha_1X_{t-1}^2}\\qquad\\Longrightarrow\\qquad \\sigma_t^2=\\omega+\\alpha_1X_{t-1}^2",
      notes: [
        "**A**uto**R**egressive **C**onditionally **H**eteroskedastic. *Heteroskedastic* just means *non-constant variance*.",
        "$\\epsilon_t$ is iid with unit variance — the pure randomness. All the structure lives in the square root.",
        "Read $X_{t-1}^2$ as *how far yesterday's return was from zero*. A big move, either way, inflates today's variance.",
        "Constraints: $\\omega>0$ and $\\alpha_1\\ge0$, so the variance can never go negative.",
      ],
      say: "Here's the ARCH one model. The acronym stands for autoregressive conditionally heteroskedastic — and heteroskedastic simply means non constant variance. Epsilon t is independent with unit variance; that's the pure randomness, and all the structure lives inside the square root. Read X t minus one squared as how far yesterday's return was from zero. A big move, in either direction, inflates today's variance. And the constraints, omega positive and alpha non negative, exist so the variance can never come out negative." }),

    plot({ dur: 30,
      caption: "Watch it respond. A large return arrives; the conditional variance jumps **immediately**, then falls straight back — because ARCH only remembers **one** period.",
      say: "Watch it respond. A large return arrives, and the conditional variance jumps immediately in the next period. But then look what happens: it falls straight back down. ARCH one only remembers one period. The shock has an enormous effect for exactly one day and then it's forgotten. Real volatility doesn't behave like that — after a turbulent day, markets stay turbulent for weeks. That's the weakness that motivates GARCH.",
      note: "ARCH(1): jumps, then forgets immediately",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const top = { l: 60, r: 22, t: 46, b: H / 2 + 10 };
        const bot = { l: 60, r: 22, t: H / 2 + 16, b: 34 };
        const n = Math.max(2, 60 + revealed(t, dur, 180, { start: 0.05, end: 0.8 }));
        const A = axes(ctx, { x: [60, 240], y: [-0.16, 0.16], W, H, pad: top });
        A.grid(5, 3).frame(); A.ticks({ ys: [-0.1, 0, 0.1], yfmt: (v) => pc(v, 0) });
        A.hline(0, { color: P.grid, dash: null });
        A.bars(data.arch.x.slice(0, n).map((v, i) => [i, v]).filter(([i]) => i >= 60), { color: P.blue, width: 1.6 });
        A.note("returns", A.L + 8, A.T + 14, { color: P.blue, size: 11.5, weight: 700 });

        const B = axes(ctx, { x: [60, 240], y: [0, 0.08], W, H, pad: bot });
        B.grid(5, 3).frame();
        B.ticks({ xs: [60, 150, 240], ys: [0, 0.03, 0.06], yfmt: (v) => pc(v, 0) });
        B.line(data.arch.vol.slice(0, n).map((v, i) => [i, v]).filter(([i]) => i >= 60), { color: P.emerald, width: 2.2 });
        if (n > 92) B.vline(91, { color: P.red, width: 1.6 });
        B.note("conditional σₜ", B.L + 8, B.T + 14, { color: P.emerald, size: 11.5, weight: 700 });
      } }),

    points({ dur: 30, heading: "The three ARCH(1) facts to memorize", tone: "blue",
      items: [
        "If $\\alpha_1<1$ the process is **stationary**. If $\\alpha_1\\ge1$ the variance grows with $t$ and it is not.",
        "If $\\alpha_1<1$ it is **white noise** with mean 0 and variance $\\dfrac{\\omega}{1-\\alpha_1}$.",
        "Therefore $\\text{Corr}(X_t,X_{t+h})=0$ for $h\\ne0$ — it is **uncorrelated**.",
        "And yet it is **not independent**: the squares are clearly related. That is the whole point of Part 4, produced by design.",
      ],
      say: "Three facts to memorize. If alpha is below one the process is stationary; if it's one or more the variance grows with time and it isn't. If alpha is below one it is white noise, with mean zero and variance omega over one minus alpha. And therefore the correlation between X t and X t plus h is zero for any non zero lag — it's uncorrelated. And yet it is not independent, because the squares are clearly related. That is the entire point of Part four, and this model produces it by design." }),

    formula({ dur: 24,
      heading: "ARCH($p$) — just use more lags",
      tex: "\\sigma_t^2=\\omega+\\sum_{i=1}^{p}\\alpha_iX_{t-i}^2,\\qquad \\omega>0,\\ \\alpha_i\\ge0",
      notes: [
        "The obvious fix for the too-short memory: let the last $p$ squared returns matter.",
        "It works — but you need $p$ **large** to get realistic persistence, and that is a lot of parameters to estimate.",
        "Each one is estimated from noisy data, so a big $p$ buys memory at the cost of precision.",
      ],
      say: "The obvious fix for that too short memory is ARCH p: let the last p squared returns matter instead of just one. And it works. But you need p to be quite large to get realistic persistence, and that's a lot of parameters to estimate. Each one is estimated from noisy data, so a big p buys you memory at the cost of precision. There's a better way." }),

    code({ dur: 24, heading: "Simulating ARCH($p$)", file: "arch_sim.py",
      body: `def simulate_arch(omega, alpha, n):
    p = len(alpha)                      # len(alpha) IS the order p
    y = np.zeros(n)
    eps = np.random.normal(0, 1, n)
    for t in range(p, n):               # start at p - you need p lags
        sigma2 = omega + sum(alpha[i] * y[t-i-1]**2 for i in range(p))
        y[t] = eps[t] * np.sqrt(sigma2)
    return y`,
      say: "Here's the simulation. Two details worth noticing. The length of the alpha list is the order p — so passing three alphas gives you an ARCH three. And the loop starts at t equals p, not zero, because you need p lags of history before you can compute anything." }),

    /* ---------- 3. GARCH ---------- */
    title({ n: 3, title: "GARCH — the model that won", tone: "emerald", chapter: "GARCH",
      sub: "One extra term buys all the memory you need.",
      say: "Chapter three. GARCH, the model that won. One extra term buys all the memory you need.", dur: 10 }),

    formula({ dur: 30, chapter: "GARCH", tone: "emerald",
      heading: "The GARCH($p,q$) model",
      tex: "X_t=\\sigma_t\\epsilon_t,\\qquad \\sigma_t^2=\\omega+\\sum_{i=1}^{p}\\alpha_iX_{t-i}^2+\\sum_{j=1}^{q}\\beta_j\\sigma_{t-j}^2",
      notes: [
        "The new piece is $\\beta_j\\sigma_{t-j}^2$: feed back the **past conditional variances**, not just past squared returns.",
        "Assumed throughout: $\\omega>0$, $\\alpha_i\\ge0$, $\\beta_j\\ge0$, and $\\sum(\\alpha_i+\\beta_i)<1$.",
        "**ARCH($p$) is exactly GARCH($p,q$) with $q=0$.**",
        "You need $p>0$: with $p=0$ no data enters at all and the model just decays to a constant.",
      ],
      say: "Here's GARCH. The new piece is beta times sigma squared t minus j: feed back the past conditional variances, not just the past squared returns. Assumed throughout: omega positive, all alphas and betas non negative, and the sum of alpha plus beta below one. Note that ARCH p is exactly GARCH p comma q with q set to zero. And you do need p greater than zero — with p equal to zero, no data enters the model at all, and it simply decays to a constant." }),

    points({ dur: 30, heading: "Why the $\\beta$ term buys so much", tone: "emerald",
      items: [
        "$X_t$ carries the extra randomness of $\\epsilon_t$, so $X_{t-i}^2$ is a **noisy** proxy for volatility.",
        "$\\sigma_{t-j}^2$ is the **smoothed** quantity itself — a much cleaner signal.",
        "Regressing on the cleaner series carries information forward efficiently: **one $\\beta$ does the work of many $\\alpha$ lags.**",
        "So GARCH(1,1) — three parameters — beats an ARCH with ten.",
      ],
      say: "Why does that one term buy so much? Because X t carries the extra randomness of epsilon t, which makes X squared a noisy proxy for volatility. Whereas sigma squared is the smoothed quantity itself — a much cleaner signal. Regressing on the cleaner series carries information forward far more efficiently, so one beta does the work of many alpha lags. The result is that GARCH one one, with just three parameters, comfortably beats an ARCH with ten." }),

    plot({ dur: 32,
      caption: "The same shock, into a GARCH(1,1). It jumps — then **decays slowly**, multiplied by $\\alpha+\\beta=0.99$ each day. That is the persistence ARCH could not produce.",
      say: "Here's the same shock fed into a GARCH one one. It jumps, just as before. But now watch the decay: instead of dropping straight back, it comes down slowly, multiplied by alpha plus beta — nought point nine nine — every single day. That gradual return is the persistence that ARCH couldn't produce without a dozen parameters. The alpha term reacts to what happened; the beta term remembers what you already thought.",
      note: "jump from $\\alpha X^2$, slow decay from $\\beta\\sigma^2$",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const top = { l: 60, r: 22, t: 46, b: H / 2 + 10 };
        const bot = { l: 60, r: 22, t: H / 2 + 16, b: 34 };
        const n = Math.max(2, 60 + revealed(t, dur, 240, { start: 0.05, end: 0.85 }));
        const A = axes(ctx, { x: [60, 300], y: [-0.16, 0.16], W, H, pad: top });
        A.grid(5, 3).frame(); A.ticks({ ys: [-0.1, 0, 0.1], yfmt: (v) => pc(v, 0) });
        A.hline(0, { color: P.grid, dash: null });
        A.bars(data.x.slice(0, n).map((v, i) => [i, v]).filter(([i]) => i >= 60), { color: P.blue, width: 1.5 });
        A.note("returns", A.L + 8, A.T + 14, { color: P.blue, size: 11.5, weight: 700 });

        const B = axes(ctx, { x: [60, 300], y: [0, 0.08], W, H, pad: bot });
        B.grid(5, 3).frame();
        B.ticks({ xs: [60, 180, 300], ys: [0, 0.03, 0.06], yfmt: (v) => pc(v, 0) });
        B.line(data.vol.slice(0, n).map((v, i) => [i, v]).filter(([i]) => i >= 60), { color: P.emerald, width: 2.4 });
        B.hline(data.uncondVol, { color: P.muted, width: 1.4 });
        if (n > 92) B.vline(91, { color: P.red, width: 1.6 });
        B.note("conditional σₜ — decays slowly", B.L + 8, B.T + 14, { color: P.emerald, size: 11.5, weight: 700 });
      } }),

    plot({ dur: 30,
      caption: "How long is the memory? $\\alpha+\\beta$ answers it exactly. At $0.99$ half the shock survives **69 days**. At $0.95$, only **14**.",
      say: "How long is the memory? Alpha plus beta answers it exactly, because that's the fraction of a shock surviving each day. Raise it to the power of the number of days and you get what's left. At nought point nine nine, half the shock is still present after sixty nine days. At nought point nine five, only fourteen. That one number is the entire personality of a fitted GARCH model — it tells you whether this market forgets a crisis in a fortnight or carries it for a quarter.",
      note: "$(\\alpha+\\beta)^{d}$ — the fraction of a shock left after $d$ days",
      draw({ ctx, W, H, t, dur, axes }) {
        const a = axes(ctx, { x: [0, 200], y: [0, 1.05], W, H, pad: { l: 58, r: 22, t: 54, b: 38 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 100, 200], ys: [0, 0.5, 1], yfmt: (v) => v.toFixed(1) });
        const k = easeOut(clamp01(t / (dur * 0.6)));
        const xs = linspace(0, 200 * k, 100);
        a.line(xs.map((d) => [d, 0.99 ** d]), { color: P.emerald, width: 2.8 });
        a.line(xs.map((d) => [d, 0.95 ** d]), { color: P.blue, width: 2.2, dash: [5, 4] });
        a.hline(0.5, { color: P.muted });
        a.note("half the shock remains", a.L + 10, a.sy(0.5) - 13, { color: P.muted, size: 11.5 });
        if (k > 0.4) {
          a.note("α+β = 0.99 → 69 days", a.sx(112), a.sy(0.68), { color: P.emerald, size: 12, weight: 700 });
          a.note("α+β = 0.95 → 14 days", a.sx(56), a.sy(0.16), { color: P.blue, size: 12, weight: 700 });
        }
      } }),

    /* ---------- 4. stationarity ---------- */
    title({ n: 4, title: "Where $\\alpha+\\beta<1$ comes from", tone: "amber", chapter: "The stationarity condition",
      sub: "Not a convention — it falls out of asking for a finite long-run variance.",
      say: "Chapter four. Where the condition alpha plus beta below one comes from. It isn't a convention someone chose. It falls straight out of asking for a finite long run variance.", dur: 13 }),

    derive({ dur: 30, heading: "Two lines, and it hands you the long-run variance too", chapter: "The stationarity condition",
      lines: [
        ["\\E(X_{t-1}^2)=\\E(\\sigma_{t-1}^2)\\E(\\epsilon_{t-1}^2)=v", "independence, and $\\E(\\epsilon^2)=1$"],
        ["v=\\E(\\sigma_t^2)=\\omega+\\alpha\\E(X_{t-1}^2)+\\beta\\E(\\sigma_{t-1}^2)", "take expectations of the recursion"],
        ["v=\\omega+\\alpha v+\\beta v", "substitute, using stationarity"],
        ["v(1-\\alpha-\\beta)=\\omega", "collect"],
        ["v=\\frac{\\omega}{1-\\alpha-\\beta}\\quad\\blacksquare", "finite and positive only if $\\alpha+\\beta<1$"],
      ],
      say: "Write v for the long run average of the conditional variance. First, the expected squared return equals v, because epsilon has unit variance and is independent of the past. Now take expectations of the whole GARCH recursion. Substitute, using the fact that stationarity makes every period's expectation the same. Collect the terms. And solve. The long run variance is omega over one minus alpha minus beta — which is finite and positive only when alpha plus beta is below one." }),

    plot({ dur: 30,
      caption: "Read the answer, not just the algebra. As $\\alpha+\\beta\\to1$ the denominator goes to zero and the long-run volatility **runs off to infinity**.",
      say: "Read the answer, not just the algebra. As alpha plus beta approaches one, the denominator goes to zero and the long run volatility runs off to infinity. What that means physically is that the process has so much memory it never settles down, so asking for a long run average becomes meaningless. At exactly one you have what's called IGARCH, integrated GARCH, where shocks to volatility never fully die out. Fitted equity models often sit just below one — nought point nine eight, nought point nine nine. Crossing it is a red flag worth reporting.",
      note: "$v=\\omega/(1-\\alpha-\\beta)$ — undefined at 1",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0.8, 1.0], y: [0, 0.12], W, H, pad: { l: 62, r: 22, t: 54, b: 38 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0.8, 0.9, 0.95, 1.0], ys: [0, 0.05, 0.1], xfmt: (v) => v.toFixed(2), yfmt: (v) => pc(v, 0) });
        const k = easeOut(clamp01(t / (dur * 0.6)));
        const now = lerp(0.8, 0.998, k);
        a.line(linspace(0.8, now, 140).map((s) => [s, Math.min(0.12, Math.sqrt(data.omega / (1 - s)))]),
          { color: P.red, width: 2.8 });
        a.vline(1, { color: P.ink, width: 2, dash: null });
        a.note("α + β → 1", a.sx(1) - 8, a.T + 20, { color: P.ink, size: 12, weight: 700, align: "right" });
        a.chip(`α+β = ${now.toFixed(3)}   long-run σ = ${pc(Math.sqrt(data.omega / (1 - now)))}`,
          a.L + 10, a.B - 18, { color: P.red, bg: "rgba(186,26,26,0.10)" });
      } }),

    /* ---------- 5. fitting ---------- */
    title({ n: 5, title: "Fitting and choosing", tone: "blue", chapter: "Fitting and AIC",
      sub: "How the parameters get estimated, and how you pick between models.",
      say: "Chapter five. Fitting and choosing. How the parameters actually get estimated, and how you pick between competing models.", dur: 11 }),

    jargon({ dur: 26, term: "Maximum likelihood", chapter: "Fitting and AIC",
      plain: "Choose the parameters that make **the data you actually observed** as probable as possible.",
      formal: "Write down the probability of the observed series as a function of $(\\omega,\\alpha,\\beta)$, then hand it to an optimizer and maximize. There is no closed form here, so it is done numerically.",
      say: "Maximum likelihood means choosing the parameters that make the data you actually observed as probable as possible. You write down the probability of the observed series as a function of omega, alpha and beta, then hand that to an optimizer and maximize it. For GARCH there's no closed form solution, so it's done numerically — which is why the fitting output mentions iterations and convergence." }),

    jargon({ dur: 28, term: "AIC",
      plain: "A score that trades **fit** against **complexity**. Lower is better. It stops you from adding parameters just because they always improve the fit.",
      formal: "$\\text{AIC}=2k-2\\log(\\hat L)$, with $k$ the number of parameters. More parameters always raise $\\log\\hat L$ — the $2k$ charges you for them.",
      say: "AIC is a score that trades fit against complexity, and lower is better. Its job is to stop you adding parameters just because more parameters always improve the fit. The formula is two k minus two log likelihood, where k is the number of parameters. More parameters always raise the log likelihood — so the two k term charges you for each one you add." }),

    plot({ dur: 30,
      caption: "Four models on the same data. **GARCH(1,1) wins.** And note GARCH(2,2) scores *worse* despite fitting at least as well — the complexity penalty doing its job.",
      say: "Here are four models fitted to the same data. GARCH one one wins, with the lowest AIC at eight thirty two point three. And look carefully at GARCH two two: it scores worse, at eight thirty five point one, despite fitting the training data at least as well in raw likelihood terms. That's the complexity penalty doing exactly its job. One more thing worth knowing for the exam: AIC is comparable across model families fitted to the same data, so comparing an ARCH against a GARCH like this is entirely legitimate.",
      note: "lower is better · the penalty punishes GARCH(2,2)",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 4], y: [800, 920], W, H, pad: { l: 64, r: 22, t: 54, b: 52 } });
        a.grid(4, 4).frame();
        a.ticks({ ys: [820, 860, 900], yfmt: (v) => String(v) });
        const n = revealed(t, dur, 4, { start: 0.05, end: 0.6 });
        data.aic.slice(0, n).forEach(([name, v], i) => {
          const best = v === 832.3;
          ctx.save();
          ctx.fillStyle = best ? P.emerald : P.blue;
          ctx.globalAlpha = best ? 0.9 : 0.5;
          const x0 = a.sx(i + 0.18), x1 = a.sx(i + 0.82);
          ctx.fillRect(x0, a.sy(v), x1 - x0, a.sy(800) - a.sy(v));
          ctx.restore();
          a.note(name, (x0 + x1) / 2 - 28, a.B + 16, { color: best ? P.emerald : P.muted, size: 11, weight: best ? 700 : 500 });
          a.note(String(v), (x0 + x1) / 2 - 16, a.sy(v) - 12, { color: best ? P.emerald : P.muted, size: 11.5, weight: 700 });
        });
      } }),

    code({ dur: 24, heading: "Fitting with the `arch` package", file: "fit.py",
      body: `from arch import arch_model

# p = ARCH order, q = GARCH order.  rescale for numerical stability
model = arch_model(ldr * 100, vol="Garch", p=1, q=1, mean="Zero")
res = model.fit(disp="off")

print(res.summary())      # params, std errors, AIC, BIC
print(res.params)         # omega, alpha[1], beta[1]`,
      say: "In Python the arch package does it. Note p is the ARCH order and q is the GARCH order. Multiplying returns by a hundred is a numerical stability trick — the optimizer struggles with the very small numbers you get from raw daily returns. Mean equals zero says don't bother modelling the conditional mean, which as we discussed is the right call. And the summary gives you the parameters, their standard errors, and the AIC." }),

    /* ---------- recap ---------- */
    recap({ dur: 32, items: [
      "**Conditional** variance is today's forecast; **unconditional** is the long-run average. GARCH models the first.",
      "**ARCH($p$)**: variance from past squared returns. Works, but needs many lags for realistic memory.",
      "**GARCH**: adds $\\beta\\sigma_{t-1}^2$, recycling the **smoother** past variance — so 3 parameters beat 10.",
      "$\\alpha+\\beta$ = the fraction of a shock surviving each day. It sets the half-life, and it must be $<1$.",
      "Long-run variance $=\\omega/(1-\\alpha-\\beta)$; pick between fitted models with **AIC**, lower being better.",
    ],
    say: "To recap. Conditional variance is today's forecast; unconditional is the long run average — and GARCH models the first. ARCH p builds variance from past squared returns; it works, but needs many lags for realistic memory. GARCH adds the beta sigma squared term, recycling the smoother past variance, so three parameters beat ten. Alpha plus beta is the fraction of a shock surviving each day: it sets the half life, and it must be below one. The long run variance is omega over one minus alpha minus beta. And you pick between fitted models using AIC, where lower is better." }),
  ],
});
