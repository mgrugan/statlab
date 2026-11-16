/* f18 — The Double Exponential Jump Diffusion Model (full lecture) */

import { PALETTE as P, linspace, normals, rng, clamp01, easeOut, lerp } from "@/lib/anim";
import { compile, title, jargon, points, formula, derive, plot, recap, revealed } from "@/lib/scenes";

const D = (() => {
  const nrm = normals(777), u = rng(1234);

  /* asymmetric two-sided exponential jump sizes on the log scale:
     down jumps arrive more often and are larger */
  const ETA_U = 14, ETA_D = 7;
  const jumpDens = linspace(-0.6, 0.6, 200).map((x) => [x,
    x >= 0 ? 0.38 * ETA_U * Math.exp(-ETA_U * x) : 0.62 * ETA_D * Math.exp(ETA_D * x)]);
  const sym = linspace(-0.6, 0.6, 200).map((x) => [x, 10 * Math.exp(-10 * Math.abs(x)) / 2]);

  /* two Poisson streams merging into one */
  const stream = (lam, seed) => {
    const r = rng(seed); const out = []; let s = 0;
    while (s < 12) { s += -Math.log(1 - r()) / lam; if (s < 12) out.push(s); }
    return out;
  };
  const up = stream(0.55, 31), down = stream(1.0, 42);

  /* Pareto (support > 1) and Beta (support in (0,1)) as multiplicative factors */
  const pareto = linspace(1.001, 2.4, 160).map((x) => [x, 3.1 * x ** -4.1]);
  const beta = linspace(0.001, 0.999, 160).map((x) => [x, 3.6 * x ** 2.6]);

  /* a DEJD price path: asymmetric jumps, visibly more down than up */
  const path = [1]; const ups = []; const downs = [];
  for (let i = 1; i < 520; i++) {
    let j = 0;
    if (u() < 0.55 / 252) { j += -Math.log(1 - u()) / ETA_U; ups.push(i); }
    if (u() < 1.0 / 252) { j -= -Math.log(1 - u()) / ETA_D; downs.push(i); }
    path.push(path[i - 1] * Math.exp(0.09 / 252 + 0.18 / Math.sqrt(252) * nrm() + j));
  }
  return { jumpDens, sym, up, down, pareto, beta, path, ups, downs, ETA_U, ETA_D };
})();

export default compile({
  id: "f18",
  title: "The Double Exponential Jump Diffusion Model",
  blurb: "Why up and down jumps deserve separate treatment, how two Poisson processes combine into one, Pareto-up and Beta-down on the price scale, and what the DEJD buys you.",
  takeaway: "Merton gives you heavy tails but not skew, because its jump distribution is symmetric. Splitting the jumps in two fixes that — and the two formulations of the fix turn out to be the same model.",
  data: D,
  scenes: [

    /* ---------- 1. motivation ---------- */
    title({ n: 1, title: "Where the DEJD comes from", tone: "slate", chapter: "Motivation",
      sub: "Kou (2002), by way of Ramezani and Zeng (2007).",
      say: "Chapter one. Where the double exponential jump diffusion model comes from — Kou, two thousand and two, presented here by way of Ramezani and Zeng, two thousand and seven.", dur: 12 }),

    points({ dur: 30, heading: "A second jump diffusion model", tone: "slate",
      items: [
        "Described in **Kou (2002)**, *Management Science* 48; we go through a paper by **Ramezani and Zeng (2007)**, *Annals of Finance* 3.",
        "Instead of the **normal** distribution for jump sizes — as in Merton — the DEJD uses **exponential** distributions.",
        "And it distinguishes between **“up jumps”** and **“down jumps”**, each with its own parameter for its corresponding exponential.",
        "If the two rates are equal, the two-sided exponential is the **double exponential**, or **Laplace**, distribution — hence the name.",
      ],
      say: "This Part explores another jump diffusion model, namely the double exponential jump diffusion model. This was described in Kou, two thousand and two, in Management Science volume forty eight, but here we go through a paper by Ramezani and Zeng, two thousand and seven, in Annals of Finance volume three. An annotated version of that paper is on Canvas. Instead of using the normal distribution to model jump sizes, as in the Merton model, the DEJD model uses exponential distributions. And a distinction is made between up jumps and down jumps — each has its own parameter for its corresponding exponential distribution. If those two rates happen to be equal, the two sided exponential is the double exponential, or Laplace, distribution. Which is where the model gets its name." }),

    points({ dur: 26, heading: "The key limitation of the Merton model", tone: "amber",
      items: [
        "Stated plainly in the notes, and the cleanest motivation for the DEJD:",
        "**There is a single Poisson process describing the occurrence of jumps, and the jump size distribution (on the log scale) is symmetric around zero.**",
        "So Merton can produce **heavy tails**, but not **asymmetric** ones.",
        "It cannot say that crashes are both **more frequent** and **larger** than rallies.",
      ],
      say: "Here is the cleanest motivation, and the notes state it plainly. A key limitation of the Merton model: there is a single Poisson process describing the occurrence of jumps, and the jump size distribution, on the log scale, is symmetric around zero. So Merton can produce heavy tails, but it cannot produce asymmetric ones. It has no way of saying that crashes are both more frequent and larger than rallies. Which, empirically, they are." }),

    plot({ dur: 32, chapter: "Motivation",
      caption: "**Why model the jump sizes separately?** The **leverage effect** — reactions to negative news tend to be **more extreme** than reactions to positive news.",
      say: "So why is it of interest to model the jump sizes separately? The leverage effect: reactions to negative news tend to be more extreme than reactions to positive news. Here is the contrast. The grey dashed curve is a symmetric two sided exponential — equal rates up and down, which is the Laplace distribution and the Merton-like case. The solid curve is what the DEJD allows: a different rate on each side, so down jumps arrive more often and run further out. One distribution can express the asymmetry; the other cannot.",
      note: "symmetric (dashed) vs the DEJD's two-sided, two-rate version",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-0.6, 0.6], y: [0, 6.4], W, H, pad: { l: 56, r: 24, t: 56, b: 46 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [-0.5, -0.25, 0, 0.25, 0.5], ys: [0, 2, 4, 6], xfmt: (v) => v.toFixed(2) });
        a.line(data.sym, { color: P.muted, width: 1.8, dash: [5, 4] });
        const k = clamp01((t - 2) / (dur * 0.5));
        const n = Math.max(2, Math.round(data.jumpDens.length * easeOut(k)));
        a.line(data.jumpDens.slice(0, n), { color: P.blue, width: 2.6 });
        a.vline(0, { color: P.muted, width: 1 });
        if (k > 0.45) {
          a.note("down jumps: more often, further", a.L + 12, a.T + 18, { color: P.red, size: 11.5, weight: 700 });
          a.note("up jumps", a.sx(0.3), a.T + 18, { color: P.emerald, size: 11.5, weight: 700 });
        }
      } }),

    /* ---------- 2. combining ---------- */
    title({ n: 2, title: "Two processes, one process", tone: "blue", chapter: "Combining",
      sub: "The result that makes the two formulations equivalent.",
      say: "Chapter two. Two Poisson processes make one Poisson process — the result that makes the two rival formulations of this model equivalent.", dur: 11 }),

    derive({ dur: 36, heading: "The combined process is Poisson, with the rates added", chapter: "Combining",
      lines: [
        ["T=\\min(T_1,T_2)", "the next event of either type is whichever comes first"],
        ["P(T\\le t)=1-P\\big(\\min(T_1,T_2)>t\\big)=1-P(T_1>t\\ \\text{and}\\ T_2>t)", "the minimum exceeds $t$ exactly when both do"],
        ["=1-P(T_1>t)P(T_2>t)=1-e^{-\\lambda_1t}e^{-\\lambda_2t}", "independence, then the exponential survival function"],
        ["=1-e^{-(\\lambda_1+\\lambda_2)t},\\quad t>0", "which is the CDF of an Exponential$(\\lambda_1+\\lambda_2)$"],
      ],
      say: "Suppose there are two independent Poisson processes, with rates lambda one and lambda two. Is the combined process also a Poisson process, and if so what is its rate? Let T be the time to the next event of either type, and T one and T two the times to the next event of each type. Then T is the minimum of T one and T two. The probability T is at most t is one minus the probability that the minimum exceeds t. But the minimum exceeds t exactly when both do, so that is one minus the probability T one exceeds t and T two exceeds t. By independence that factors, and each factor is an exponential survival function. Multiply them and the exponents add: one minus e to the minus lambda one plus lambda two, times t. That is precisely the CDF of an exponential with rate lambda one plus lambda two. So T is exponential with the rates added, and the combined process is also a Poisson process, with rate lambda one plus lambda two." }),

    plot({ dur: 30, chapter: "Combining",
      caption: "Up jumps in green, down jumps in red. **Superimpose them** and what you have is a single Poisson process with rate $\\lambda_u+\\lambda_d$.",
      say: "Here it is visually. The green ticks are the up jumps, arriving as a Poisson process with rate lambda u. The red ticks are the down jumps, at rate lambda d. Now superimpose them onto one line. What you are left with is a single stream of events — and by the result we just derived, that stream is itself a Poisson process, with rate lambda u plus lambda d. No information has been lost about the rate; what has been lost is which stream each event came from. Hold that thought, because it comes back.",
      note: "merging loses **which** stream — but the merged process is still Poisson",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 12], y: [0, 3], W, H, pad: { l: 44, r: 24, t: 56, b: 46 } });
        a.frame();
        a.ticks({ xs: [0, 3, 6, 9, 12] });
        const k = clamp01((t - dur * 0.4) / (dur * 0.42));
        const yU = lerp(2.4, 1.1, easeOut(k)), yD = lerp(1.8, 1.1, easeOut(k));
        for (const e of data.up) a.line([[e, yU - 0.26], [e, yU + 0.26]], { color: P.emerald, width: 2.6 });
        for (const e of data.down) a.line([[e, yD - 0.26], [e, yD + 0.26]], { color: P.red, width: 2.6 });
        a.note("up jumps — rate λ(u)", a.L + 8, a.sy(2.78), { color: P.emerald, size: 11.5, weight: 700 });
        if (k < 0.6) a.note("down jumps — rate λ(d)", a.L + 8, a.sy(0.5), { color: P.red, size: 11.5, weight: 700 });
        else a.note("combined — rate λ(u) + λ(d)", a.L + 8, a.sy(0.5), { color: P.blue, size: 12.5, weight: 700 });
      } }),

    points({ dur: 32, heading: "Kou versus Ramezani-Zeng", tone: "blue",
      items: [
        "**Kou's model** has a **single** Poisson process for the occurrence of jumps, and when a jump occurs it is an **up jump with probability $p$**.",
        "**Ramezani and Zeng** use **two independent** Poisson processes for the up and the down jumps.",
        "Since the combined process remains a Poisson process, **these two modeling approaches are equivalent.**",
        "The real difference is in the **distribution assumed for the jump sizes** — which is the next chapter.",
      ],
      say: "Now the two formulations. Kou's model also has a single Poisson process to model the occurrence of jumps, but when a jump occurs it is an up jump with probability p. Ramezani and Zeng instead use two independent Poisson processes, to model the up jumps and the down jumps separately. As we have just seen, the combined process remains a Poisson process — so these two modeling approaches are equivalent. The real difference between these authors is not there at all. It is in the distribution assumed for the jump sizes." }),

    /* ---------- 3. Pareto and Beta ---------- */
    title({ n: 3, title: "Pareto up, Beta down", tone: "amber", chapter: "Pareto / Beta",
      sub: "And why it could not be the other way round.",
      say: "Chapter three. Pareto up and Beta down — and why it could not possibly be the other way round.", dur: 10 }),

    points({ dur: 30, heading: "Two scales, two choices", tone: "amber",
      items: [
        "**Kou** assumes that **on the log scale**, the size of a jump has an **exponential** distribution. Jumps up have mean size $1/\\eta_1$; jumps down have mean size $1/\\eta_2$.",
        "**Ramezani and Zeng** work **on the original price scale**, and assume jumps up are drawn from a **Pareto** distribution, while down jumps are drawn from a **Beta**.",
        "These jumps **multiply** the current price, hence are **additive on the log scale**.",
        "The Pareto/Beta version is distinguished as the **PBJD model**, though it is equivalent to the DEJD in some cases.",
      ],
      say: "Kou assumes that on the log scale, the size of a jump has an exponential distribution. Jumps up have a mean size of one over eta one, while jumps down have a mean size of one over eta two. Ramezani and Zeng work on the original price scale, and assume jumps up are drawn from a Pareto distribution, while down jumps are drawn from a Beta distribution. These jumps multiply the current price, and hence are additive on the log scale. The authors distinguish the model which uses the Pareto and Beta distributions — they call it the P B J D model — from the DEJD model. We will see, however, that they are equivalent in some cases." }),

    plot({ dur: 34, chapter: "Pareto / Beta",
      caption: "It is entirely about **support**. The **Pareto** lives above 1, so multiplying **raises** the price. The **Beta** lives in $(0,1)$, so multiplying **lowers** it.",
      say: "And here is the reason, which is purely about support. Again, this model is constructing multiplicative factors to represent the jumps. The Pareto is chosen to have support from one to infinity. The result is that multiplying by a random variable with this distribution will definitely increase the price — an up jump. The Beta distribution has support on zero to one, and prices cannot go negative, so multiplying by a Beta random variable seems like a reasonable model for the down jumps. Note the dividing line at one: everything to the right of it raises the price, everything to the left lowers it. That is the whole argument. The Pareto p d f is also, separately, often used to model tail behaviour.",
      note: "$\\times$ Pareto $\\Rightarrow$ price up · $\\times$ Beta $\\Rightarrow$ price down",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 2.4], y: [0, 4], W, H, pad: { l: 56, r: 24, t: 56, b: 46 } });
        a.grid(4, 4).frame();
        a.ticks({ xs: [0, 0.5, 1, 1.5, 2], ys: [0, 2, 4], xfmt: (v) => v.toFixed(1) });
        const k = clamp01((t - 1.5) / (dur * 0.5));
        const nb = Math.max(2, Math.round(data.beta.length * easeOut(k)));
        a.area(data.beta.slice(0, nb), 0, { color: P.redSoft });
        a.line(data.beta.slice(0, nb), { color: P.red, width: 2.4 });
        const k2 = clamp01((t - dur * 0.4) / (dur * 0.45));
        if (k2 > 0) {
          const np = Math.max(2, Math.round(data.pareto.length * easeOut(k2)));
          a.area(data.pareto.slice(0, np), 0, { color: P.emeraldSoft });
          a.line(data.pareto.slice(0, np), { color: P.emerald, width: 2.4 });
        }
        a.vline(1, { color: P.ink, width: 1.8, dash: null });
        a.note("Beta — (0,1)", a.sx(0.34), a.T + 22, { color: P.red, size: 12, weight: 700 });
        if (k2 > 0.3) a.note("Pareto — (1,∞)", a.sx(1.32), a.T + 22, { color: P.emerald, size: 12, weight: 700 });
        a.note("×1 = no change", a.sx(1) + 7, a.B - 16, { color: P.muted, size: 11, weight: 600 });
      } }),

    points({ dur: 26, heading: "Why the two formulations are the same model", tone: "emerald",
      items: [
        "The **log of a Pareto$(\\eta_u)$** random variable — whose support starts at 1 — is **Exponential$(\\eta_u)$**.",
        "The **log of a Beta$(\\eta_d,1)$** random variable is **Exponential$(\\eta_d)$**.",
        "So the price-scale Pareto/Beta formulation and the log-scale exponential formulation are **the same thing**, seen from two sides.",
      ],
      say: "And here is the connection that closes the circle. The log of a Pareto random variable with parameter eta u, whose support starts at one, is exponential with rate eta u. And the log of a Beta random variable with parameters eta d and one is exponential with rate eta d. So the price scale Pareto and Beta formulation, and the log scale exponential formulation, are the same model seen from two sides. Multiplying on the price scale is adding on the log scale, and a Pareto on one becomes an exponential on the other." }),

    formula({ dur: 28, heading: "The two parameter sets", tone: "blue",
      tex: "\\lambda=\\lambda_u+\\lambda_d\\qquad\\text{and}\\qquad p=\\frac{\\lambda_u}{\\lambda_u+\\lambda_d}",
      notes: [
        "**DEJD:** $(\\mu,\\sigma,\\lambda,p,\\eta_u,\\eta_d)$ — diffusion, **rate of jumps**, **probability of an up jump**, and the two jump distributions.",
        "**PBJD:** $(\\mu,\\sigma,\\lambda_u,\\lambda_d,\\eta_u,\\eta_d)$ — diffusion, **rate of up jumps**, **rate of down jumps**, Pareto and Beta.",
        "Both lines follow from the combination result: the overall rate is the **sum**, and $p$ is the up rate's **share** of the total.",
      ],
      say: "Let us line up the parameters. The DEJD has mu and sigma for the diffusion, lambda for the rate of jumps, p for the probability of an up jump, and eta u and eta d defining the distributions for the up and down jumps. The P B J D has mu and sigma, then lambda u for the rate of up jumps and lambda d for the rate of down jumps, with eta u defining the Pareto and eta d the Beta. And the translation is exactly what the combination result gives you: lambda equals lambda u plus lambda d, and p equals lambda u over lambda u plus lambda d. The overall jump rate is the sum, and the probability a given jump is an up jump is the up rate's share of the total." }),

    /* ---------- 4. the model ---------- */
    title({ n: 4, title: "The log returns", tone: "blue", chapter: "The log returns",
      sub: "Know the equation and its components — not the derivation.",
      say: "Chapter four. The log returns under this model. The professor is explicit that you need the resulting equation and its components, not the derivation.", dur: 12 }),

    formula({ dur: 30, heading: "The $s$-period log return", tone: "blue",
      tex: "r(s)=\\left(\\mu-\\tfrac{1}{2}\\sigma^2\\right)s+\\sigma Z(s)+U+D",
      notes: [
        "$\\left(\\mu-\\tfrac12\\sigma^2\\right)s$ — the **drift** over $s$ periods.",
        "$\\sigma Z(s)$ — the **diffusion**, with $Z(t)$ a standard Brownian motion.",
        "$U$ — the total contribution of the **up jumps**. $D$ — the total contribution of the **down jumps**.",
        "**All of these components are independent.** That independence is what makes the likelihood tractable.",
      ],
      say: "Here is the equation. The s period log return equals mu minus one half sigma squared, times s, plus sigma times Z of s, plus U plus D. Four pieces. The first is the drift over s periods. The second is the diffusion, where Z of t is a standard Brownian motion. U is the total contribution of the up jumps, and D the total contribution of the down jumps. And all of these components are independent. That independence is exactly what makes the likelihood tractable. You will not be asked to derive this — the professor says it is not about doing derivations, but about understanding the structure of the model and why it is relevant. But you must know the resulting equation and its components." }),

    plot({ dur: 32, chapter: "The log returns",
      caption: "A simulated DEJD path. **Green** marks up jumps, **red** down jumps — more of them, and larger.",
      say: "Here is a path simulated from the model. Green lines mark the up jumps, red lines the down jumps. Notice two things at once: there are more red lines than green ones, because lambda d exceeds lambda u, and the drops at the red lines are bigger than the rises at the green ones, because the down jump distribution has the heavier mean size. Those are two separate knobs, and the DEJD has both. Merton has neither — its single symmetric jump distribution would give you equal numbers and equal sizes.",
      note: "two separate knobs: **how often**, and **how big**",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 520], y: [0.45, 1.35], W, H, pad: { l: 56, r: 24, t: 56, b: 44 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 260, 520], ys: [0.5, 0.8, 1.1], yfmt: (v) => v.toFixed(1) });
        const n = Math.max(2, revealed(t, dur, data.path.length, { start: 0.04, end: 0.88 }));
        for (const j of data.ups) if (j < n) a.vline(j, { color: P.emerald, alpha: 0.4, width: 1.3 });
        for (const j of data.downs) if (j < n) a.vline(j, { color: P.red, alpha: 0.4, width: 1.3 });
        a.line(data.path.slice(0, n).map((v, i) => [i, v]), { color: P.blue, width: 1.9 });
        a.note(`${data.downs.length} down vs ${data.ups.length} up`, a.L + 10, a.T + 18,
          { color: P.muted, size: 11.5, weight: 700 });
      } }),

    derive({ dur: 34, heading: "How the density of a one-period return is assembled", chapter: "The log returns",
      lines: [
        ["f(r)=\\sum_{m=0}^{\\infty}\\sum_{n=0}^{\\infty}f\\big(r\\mid N_u=m,N_d=n\\big)P(N_u=m,N_d=n)", "law of total probability, conditioning on how many of each"],
        ["=\\sum_{m=0}^{\\infty}\\sum_{n=0}^{\\infty}f_{m,n}(r)\\,P(N_u=m)\\,P(N_d=n)", "$N_u$ and $N_d$ independent, so the joint factors"],
        ["P(N_u=m)=\\frac{e^{-\\lambda_uT}(\\lambda_uT)^m}{m!}", "and likewise for $N_d$ — both from the Poisson pmf"],
      ],
      say: "Here is how the density of a single period return is assembled — the same conditioning trick as in Part six, now run over two indices. Let N u and N d be the numbers of up and down jumps in the period. By the law of total probability, the density of r is the double sum over m and n of the density of r given m up jumps and n down jumps, times the joint probability of that combination. Since N u and N d are independent, the joint probability factors into the product of two Poisson probabilities. And both of those come straight from the Poisson probability mass function. That is the crucial step toward determining the likelihood function." }),

    points({ dur: 30, heading: "Fitting it, and the one thing that surprises people", tone: "amber",
      items: [
        "**Note the use of maximum likelihood** for estimating the parameters. That is a key contribution of this work.",
        "The likelihood includes **all** of the parameters describing the normal diffusion together with the two Poisson jump distributions.",
        "The optimizer maximizes this **joint likelihood over all parameters simultaneously** — there is no need to separate out the components.",
        "**In fact, at no point are up and down jumps ever identified in the data.**",
        "With a likelihood this complicated there are real numerical challenges. Taking **bounds** into consideration helps, as does choosing **starting values** wisely.",
      ],
      say: "How are the independent Poisson processes for up and down jumps separately parameterized and maximized during the likelihood estimation procedure? The likelihood function is derived, and it includes all of the parameters that describe the behaviour of the normal diffusion together with the two Poisson jump distributions. The optimizer maximizes this joint likelihood over all parameters simultaneously. There is no need to separate out different components to maximize. And here is the part that surprises people: at no point are up and down jumps ever identified in the data. We never label any particular day as an up jump day. The model simply has parameters that describe two streams, and the likelihood sorts them out. With a likelihood this complicated there can definitely be numerical challenges when doing the maximization — taking the bounds on the parameters into consideration helps, and choosing starting values wisely also helps avoid numerical problems." }),

    /* ---------- 5. what it buys ---------- */
    title({ n: 5, title: "What the DEJD buys you", tone: "emerald", chapter: "Payoff",
      sub: "Exotic and path-dependent options — and the fit.",
      say: "Chapter five. What all of this buys you — tractable pricing for exotic and path dependent options, and a better fit to the data.", dur: 11 }),

    jargon({ dur: 30, term: "Exotic and path-dependent options", chapter: "Payoff",
      plain: "An **exotic option** is one that is not a basic **vanilla** call or put. A **path dependent option** is one whose payoff depends on the **entire history** of the underlying's price over the time the option is held.",
      formal: "Examples: **options on options** — a call giving the right to purchase a call. **Barrier options**, cancelled if the price reaches a certain level. **Asian options**, where the payoff is computed from the **average** price over some period.",
      say: "The headline claim for this model is that it leads to tractable pricing formulas for exotic and path dependent options. So it is worth knowing what those are. The expression exotic option does not really have a fixed definition, but refers to options which are not the basic vanilla calls and puts we have discussed. For example: there are options on options — you can have a call option that gives you the right to purchase a call option at a certain price. Barrier options are cancelled if the price of the underlying asset reaches a certain level. And with an Asian option, the payoff amount is calculated by taking the average of the price of the underlying asset over some time period. A path dependent option is one for which the payoff amount depends on the entire history of the underlying asset's price over the time the option is held. Barrier and Asian options are the two standard examples, and both depend on the price trajectory rather than just the final price — which is precisely what a jump model captures and a marginal distribution does not." }),

    points({ dur: 32, heading: "A jump model vs a heavy-tailed distribution", tone: "amber",
      items: [
        "Both can explain unusually large returns. So what does a **jump model** give you that fitting a heavy-tailed distribution does not?",
        "A **jump-diffusion model describes how the price changes over time** — it covers the fact that tomorrow's price is probably close to today's.",
        "Fitting a heavy-tailed distribution to log daily returns is a statement about the **marginal distribution** only, and **does not capture day-to-day dependence**.",
        "**Both have a role to play**, depending on the goals of the particular analysis.",
      ],
      say: "Here is a question worth being able to answer, because it gets at what this Part is really for. Both a heavy tailed distribution and a jump diffusion model can explain unusually large returns. What could we learn from a jump model that we could not learn just by fitting a heavy tailed distribution to the returns? Models such as the jump diffusion models describe how the price changes over time — they cover the fact that tomorrow's price is probably close to today's. Just using a heavy tailed distribution to model log daily returns is a statement about the marginal distribution, and does not capture anything about the day to day dependence. They both have a role to play, depending on the goals of the particular analysis. Relatedly: Brownian motion captures the continuous, symmetric day to day volatility, while Poisson jumps are added to capture rare, large shocks. The heavy tails come from including these jumps, since they generate the extreme values. And the skew comes from allowing the rate of up and down jumps to vary, and from allowing their sizes to have different distributions." }),

    points({ dur: 32, heading: "What the paper concludes", tone: "emerald",
      items: [
        "**Table 3** shows the additional complexity of the DEJD is typically **warranted** — the result is a better fit to the data.",
        "**Table 4** gives parameter estimates with standard errors; **bolded** estimates are those where a level-0.05 test of the parameter being zero is **rejected** — commonly said as **“significant.”**",
        "**But:** it is common for researchers to focus on significance, and **the importance of this is greatly exaggerated.** Often a lack of significance is due to insufficient sample size, or simply too much noise.",
        "**The authors express concerns over the fit** — consistent with the Merton fit in Part 7: the **rate of jumps seems too large, while the jump sizes are too small**. Maybe reconsidering the jump distribution would help.",
      ],
      say: "What does the paper conclude? Table three shows that the additional complexity of the DEJD is typically warranted, with the result being a better fit to the data. Table four presents all of the parameter estimates and their standard errors, and the estimates which are bolded indicate those for which a level nought point zero five hypothesis test of the parameter being equal to zero is rejected — commonly said as the parameter being significant. But note the professor's caution here: it is common for researchers to focus on whether or not parameters are significant, and the importance of this is greatly exaggerated. Often, a lack of significance is due to there not being a sufficient sample size, or there just being too much noise. And finally, the authors express concerns over the fit. This seems consistent with what we saw when we fit the Merton model in the previous Part: the rate of jumps seems too large, while the jump sizes are too small. These authors indicate that maybe this could be alleviated by reconsidering the jump distribution. Maximum likelihood is used throughout, and is generally preferred because of its properties — including that it is asymptotically efficient, meaning that as the sample size gets larger, the variance of the MLE gets closer to the smallest possible variance on an unbiased estimator." }),

    recap({ dur: 36, items: [
      "**Merton's limitation:** one Poisson process, and a jump size distribution **symmetric** around zero. Heavy tails, but no skew.",
      "The DEJD splits jumps in two, giving a **different rate** and a **different size distribution** to up and down — the **leverage effect**.",
      "**Two independent Poisson processes combine into one**, with rate $\\lambda_1+\\lambda_2$. That makes Kou and Ramezani-Zeng **equivalent**.",
      "**Pareto up, Beta down**, purely because of **support**: Pareto $>1$ raises the price, Beta in $(0,1)$ lowers it. Logs of each are **Exponential**.",
      "$\\lambda=\\lambda_u+\\lambda_d$ and $p=\\lambda_u/(\\lambda_u+\\lambda_d)$.",
      "$r(s)=\\left(\\mu-\\tfrac12\\sigma^2\\right)s+\\sigma Z(s)+U+D$, all components **independent**. Up and down jumps are **never identified in the data**.",
    ],
    say: "To recap. Merton's key limitation is a single Poisson process with a jump size distribution symmetric around zero — heavy tails, but no skew. The DEJD splits the jumps in two, giving a different rate and a different size distribution to the up jumps and the down jumps, which is how it captures the leverage effect. Two independent Poisson processes combine into a single Poisson process with the rates added, and that result is what makes Kou's formulation and Ramezani and Zeng's equivalent. Up jumps are Pareto and down jumps are Beta purely because of support: the Pareto lies above one so multiplying raises the price, and the Beta lies between zero and one so multiplying lowers it — and the log of each is exponential, which is what links the price scale to the log scale. The parameters translate by lambda equals lambda u plus lambda d, and p equals lambda u over that sum. And the s period log return is drift, plus diffusion, plus the up jump contribution, plus the down jump contribution, with all components independent — and at no point are the up and down jumps ever identified in the data." }),
  ],
});
