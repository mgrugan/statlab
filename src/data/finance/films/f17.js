/* f17 — Model Selection (full lecture) */

import { PALETTE as P, linspace, normals, rng, tSample, clamp01, easeOut, lerp } from "@/lib/anim";
import { compile, title, jargon, points, formula, plot, code, recap, revealed } from "@/lib/scenes";

const D = (() => {
  const nrm = normals(431), u = rng(88);

  /* heavy-tailed "PG log returns" and the four candidate densities, on a log axis */
  const sd = 1.05;
  const data = Array.from({ length: 2600 }, () => tSample(nrm, 3.2) * 0.62 - 0.02);
  const gridx = linspace(-10, 11, 240);
  const dnorm = (x, s) => Math.exp(-0.5 * (x / s) ** 2) / (s * Math.sqrt(2 * Math.PI));
  const dged = (x, a, b) => (b / (2 * a * 2.3)) * Math.exp(-((Math.abs(x) / a) ** b));
  const dt = (x, v, s) => {
    const c = 0.72 / s;
    return c * (1 + (x / s) ** 2 / v) ** (-(v + 1) / 2);
  };
  const curves = {
    normal: gridx.map((x) => [x, dnorm(x, 1.35)]),
    ged: gridx.map((x) => [x, dged(x, 0.72, 1.12)]),
    t: gridx.map((x) => [x, dt(x, 3.2, 0.62)]),
    skewt: gridx.map((x) => [x, dt(x - 0.1, 3.0, x < 0 ? 0.68 : 0.58)]),
  };
  /* empirical density, binned, for the red observed curve */
  const emp = (() => {
    const bins = new Array(60).fill(0);
    for (const v of data) {
      const i = Math.floor(((v + 10) / 21) * 60);
      if (i >= 0 && i < 60) bins[i]++;
    }
    return bins.map((c, i) => [-10 + (i + 0.5) * (21 / 60), Math.max(2e-5, c / (data.length * 21 / 60))]);
  })();

  /* GED shape sweep */
  const gedShape = (b) => linspace(-3.2, 3.2, 160).map((x) => [x, dged(x, 1, b)]);

  /* the uniform-overfitting histogram */
  const uni = Array.from({ length: 50 }, () => u());
  const hist = new Array(10).fill(0);
  for (const v of uni) hist[Math.min(9, Math.floor(v * 10))]++;

  const ll = { normal: -4346.11, ged: -4023.61, t: -3982.99, skewt: -3980.38 };
  const aic = { normal: 8696.23, ged: 8053.23, t: 7971.98, skewt: 7968.76 };
  return { curves, emp, gedShape, hist, ll, aic, gridx };
})();

export default compile({
  id: "f17",
  title: "Model Selection",
  blurb: "Heavy-tailed alternatives to the normal — GED, nonstandard t, skewed t — why likelihood alone overfits, nested models, and AIC as a penalized likelihood.",
  takeaway: "More parameters always fit the sample better. AIC exists to charge you for that, so you select the model that fits the population rather than the sample's accidents.",
  data: D,
  scenes: [

    /* ---------- 1. the problem ---------- */
    title({ n: 1, title: "Comparing models, not just fitting one", tone: "slate", chapter: "Motivation",
      sub: "And the trap waiting at the end of it.",
      say: "Chapter one. Comparing models, rather than just fitting one — and the trap waiting at the end of that road.", dur: 11 }),

    points({ dur: 28, heading: "Extending maximum likelihood to model choice", tone: "slate",
      items: [
        "So far, maximum likelihood has estimated parameters **after a model has been assumed**.",
        "It makes sense to extend the idea to **comparing different candidate models**.",
        "**As long as the data being fit remains exactly the same, likelihood values can be compared.**",
        "**But:** if we only seek to maximize the likelihood over candidate models, we will be led to **overfitting** — a model with more complexity will **necessarily** fit the data better.",
      ],
      say: "To this point we have considered estimating parameters using maximum likelihood after a particular model has been assumed. It makes sense to extend this idea to comparing different candidate models. As long as the data being fit remains exactly the same, likelihood values can be compared. But here is the trap. If we only seek to maximize the likelihood over candidate models, we will be led to overfitting to the sample, since a model with more complexity — more parameters, more flexibility — will necessarily fit better to the data. So model selection needs a likelihood plus a penalty. That penalty is AIC, and it is where this Part ends up." }),

    plot({ dur: 32, chapter: "Motivation",
      caption: "Procter & Gamble daily log returns, 2015-2025, against the fitted normal on a **log density axis**. The empirical curve sits **far above** the normal in both tails.",
      say: "Here is the running example. Procter and Gamble daily log returns, from twenty fifteen to twenty twenty five, plotted as a kernel density estimate in red against the best fitting normal in blue, on a logarithmic density axis. The deficiencies in the normal assumption are immediate. In the middle the two agree. But in both tails the empirical curve sits far above the normal — orders of magnitude above it. The normal distribution's tails decay exponentially, which makes extreme events virtually impossible under it. Real markets experience extreme events — crashes — far more often than that.",
      note: "log axis, because on a linear one both curves are crushed to zero out here",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-9, 10], y: [-11, 0.4], W, H, pad: { l: 60, r: 24, t: 56, b: 46 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [-8, -4, 0, 4, 8], ys: [-10, -7, -4, -1], yfmt: (v) => `10^${v}` });
        const lg = (pts) => pts.map(([x, y]) => [x, Math.log10(Math.max(1e-12, y))]);
        const n = Math.max(2, revealed(t, dur, data.emp.length, { start: 0.06, end: 0.5 }));
        a.line(lg(data.curves.normal), { color: P.blue, width: 2.2 });
        a.line(lg(data.emp).slice(0, n), { color: P.red, width: 1.8 });
        a.chip("fitted normal", a.L + 12, a.T + 16, { color: P.blue });
        a.chip("observed", a.L + 12, a.T + 40, { color: P.red, bg: "rgba(186,26,26,0.10)" });
      } }),

    /* ---------- 2. the candidates ---------- */
    title({ n: 2, title: "Three heavier-tailed candidates", tone: "blue", chapter: "The candidates",
      sub: "GED, nonstandard t, and skewed t.",
      say: "Chapter two. Three heavier tailed candidates — the generalized error distribution, the nonstandard t, and the skewed t.", dur: 10 }),

    formula({ dur: 30, heading: "The Generalized Error Distribution (GED)", tone: "blue",
      tex: "f_X(x)=\\frac{\\beta}{2\\alpha\\Gamma(1/\\beta)}\\exp\\left[-\\left(\\frac{|x-\\mu|}{\\alpha}\\right)^{\\beta}\\right]",
      notes: [
        "Mean $\\mu$, scale $\\alpha>0$, shape $\\beta>0$. Sometimes called the **generalized normal distribution**.",
        "$\\beta=2$ gives the **normal**$(\\mu,\\alpha^2/2)$. $\\beta=1$ gives the **double exponential**, or **Laplace**.",
        "$\\beta<2$ gives **heavy** tails, useful for returns. $\\beta>2$ gives tails **lighter** than the normal.",
        "The distributions are **symmetric** around $\\mu$. In Python: `scipy.stats.gennorm`.",
      ],
      say: "The first candidate is the Generalized Error Distribution, sometimes referred to as the generalized normal distribution. A random variable X has the GED with mean mu, scale alpha and shape beta if its density takes this form. Three comments. When beta equals two, this is the normal with mean mu and variance alpha squared over two. When beta equals one, it is the double exponential, or Laplace, distribution — which has heavier tails. For shape less than two the tails are heavy, which is what makes it useful for fitting to financial returns, and for shape greater than two the tails are lighter than the normal. The distributions are symmetric around mu. And the package scipy dot stats includes gennorm. The main thing to recognize is that there is a parameter that controls how heavy the tails are." }),

    plot({ dur: 30, chapter: "The candidates",
      caption: "Sweeping the shape $\\beta$. At $\\beta=2$ it is the **normal**; at $\\beta=1$ the **Laplace**; below 1 heavier still; above 2 **lighter** than normal.",
      say: "Here is what that shape parameter does. Watch the density as beta sweeps. At beta equals three the curve is flatter on top and falls away fast — tails lighter than the normal. At beta equals two it is exactly the normal. At beta equals one it becomes the double exponential, with a sharp peak and noticeably heavier tails. And below one, heavier still. One dial, and it spans from lighter than normal to very heavy indeed.",
      note: "one parameter, from lighter-than-normal to very heavy",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-3.2, 3.2], y: [0, 0.95], W, H, pad: { l: 56, r: 24, t: 56, b: 46 } });
        a.grid(5, 3).frame();
        a.ticks({ xs: [-3, -1.5, 0, 1.5, 3], ys: [0, 0.4, 0.8], yfmt: (v) => v.toFixed(1) });
        const k = clamp01((t - 1.5) / (dur * 0.72));
        const b = lerp(3.0, 0.75, easeOut(k));
        a.line(data.gedShape(2), { color: P.muted, width: 1.6, dash: [5, 4] });
        a.line(data.gedShape(b), { color: b > 2.05 ? P.emerald : b < 1.3 ? P.red : P.blue, width: 2.6 });
        a.chip(`β = ${b.toFixed(2)}`, a.L + 12, a.T + 16,
          { color: b > 2.05 ? P.emerald : b < 1.3 ? P.red : P.blue });
        a.note("β = 2 → normal (dashed)", a.L + 12, a.T + 40, { color: P.muted, size: 11.5, weight: 600 });
      } }),

    points({ dur: 30, heading: "The nonstandard and skewed $t$", tone: "amber",
      items: [
        "**Nonstandard $t$:** let $T$ have the standard $t$ with $\\nu$ degrees of freedom, and set $X=\\mu+\\sigma T$. Same **shape**, but mean $\\mu$ and scale $\\sigma$.",
        "Its variance follows at once: $V(X)=\\sigma^2 V(T)=\\sigma^2\\frac{\\nu}{\\nu-2}$, provided $\\nu\\ge3$. In Python: `scipy.stats.t`.",
        "**Skewed $t$** (Jones & Faddy, 2003): the skew is captured by a pair of positive parameters $a$ and $b$.",
        "$a<b$ → **negatively** skewed. $a>b$ → **positively** skewed. $a=b$ → the nonstandard $t$ with $2a$ degrees of freedom.",
      ],
      say: "The second candidate. Assume T has the standard t distribution with nu degrees of freedom, and define X equals mu plus sigma T, with sigma positive. This distribution will have the shape of the t, but with mean mu and scale sigma. We call it the nonstandard t distribution, and in Python it is implemented via scipy dot stats dot t. Its variance comes straight out: the variance of mu plus sigma T is sigma squared times the variance of T, which is sigma squared times nu over nu minus two, provided nu is at least three. The third candidate: Jones and Faddy introduced a skewed generalization of the t distribution, allowing for asymmetry, in a two thousand and three paper in the Journal of the Royal Statistical Society. The skew is captured by a pair of positive parameters, which they denote a and b. If a is less than b, the distribution is negatively skewed. If a is greater than b, it is positively skewed. And if a equals b, the distribution is equivalent to the nonstandard t with two a degrees of freedom. How are they fitted? Exactly like any other distribution: you write out the likelihood function, take its log, and numerically find where it is maximized." }),

    points({ dur: 24, heading: "The summary to memorize", tone: "amber",
      items: [
        "The **GED** and the **$t$** both model **symmetric** heavy tails.",
        "The **GED** additionally includes the **normal**, and even **lighter-tailed** distributions, as special cases.",
        "The **skewed $t$** models heavy tails **AND** asymmetry.",
      ],
      say: "Here is the summary worth memorizing, because it is exactly the shape of an exam question. The GED and the t distribution both model symmetric heavy tails. The GED additionally includes the normal, and even lighter tailed distributions, as special cases. And the skewed t models both heavy tails and asymmetry. Three distributions, and the thing that distinguishes them is what each one can and cannot express." }),

    /* ---------- 3. fitting ---------- */
    title({ n: 3, title: "Fitting all four", tone: "emerald", chapter: "Fitting",
      sub: "And why the likelihoods cannot settle it.",
      say: "Chapter three. Fitting all four candidates — and why their likelihoods cannot settle which one wins.", dur: 10 }),

    code({ dur: 30, heading: "Four fits, four log-likelihoods", file: "fits.py", chapter: "Fitting",
      body: `ldrPGscl = ldrPG * 100           # scale: raw values are small enough to cause trouble

normalfit = norm.fit(ldrPGscl)        # .fit() returns the MLE
GEDfit    = gennorm.fit(ldrPGscl)
tfit      = t.fit(ldrPGscl)
skewTfit  = jf_skew_t.fit(ldrPGscl)

Normal:   -4346.11        GED:      -4023.61
Nonstd T: -3982.99        Skewed T: -3980.38`,
      caption: "Each `.fit()` returns the MLE. **Should these four be ranked by their likelihoods? No.** They are of varying complexity.",
      say: "We use maximum likelihood to fit all of the proposed models to the P G data. The dot fit method returns the maximum likelihood estimate. Notice the first line: we scale the returns by a hundred, since the original values are small enough to create numerical problems. Here are the four log likelihoods. Normal, minus four thousand three hundred forty six. GED, minus four thousand twenty three. Nonstandard t, minus three thousand nine hundred eighty three. Skewed t, minus three thousand nine hundred eighty. They improve in that order. So — should these four models be ranked using their likelihoods? No. They are of varying complexity, and simply maximizing the likelihood leads to overfitting." }),

    jargon({ dur: 26, term: "Nested models", chapter: "Fitting",
      plain: "Model 1 is **nested** in Model 2 if Model 1 is a **special case** of Model 2.",
      formal: "In that case the likelihood maximized under Model 2 is **necessarily greater than or equal to** that under Model 1 — the bigger model can always reproduce the smaller one. Here: the **Normal is nested in the GED** ($\\beta=2$), and the **nonstandard $t$ is nested in the skewed $t$** ($a=b$).",
      say: "Model one is nested in model two if model one is a special case of model two. In this case the likelihood maximized under model two will necessarily be greater than or equal to the likelihood maximized under model one — because the bigger model can always just reproduce the smaller one, and then try to do better. In our example, the normal is nested in the GED, by taking beta equal to two. And the nonstandard t distribution is nested in the skewed t, by taking a equal to b. So two of those four comparisons were guaranteed before we even ran them." }),

    plot({ dur: 32, chapter: "Fitting",
      caption: "Draw $n=50$ from **Uniform(0,1)**. The histogram is not flat — just natural variability. Fitting a Beta to chase those bumps would be **overfitting**.",
      say: "Here is overfitting in its purest form. Suppose a sample of size fifty is drawn from the uniform distribution on zero to one. If we inspect the histogram of that sample, it is not going to be flat, due to natural variability. We may be tempted to fit a Beta distribution to this sample, in an effort to fit to any features we observe. That would be a mistake, and it would be overfitting. The red curve is a Beta fitted by maximum likelihood to uniform data. It has a higher likelihood than the flat line. It is also completely wrong. Our objective is to fit well to the population, not just to the observed sample. The sample may contain artifacts which appear to be real features, but would disappear with a larger sample size.",
      note: "the bumps are **artifacts**, not features — they vanish with more data",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 1], y: [0, 2.3], W, H, pad: { l: 56, r: 24, t: 56, b: 46 } });
        a.grid(5, 3).frame();
        a.ticks({ xs: [0, 0.5, 1], ys: [0, 1, 2], xfmt: (v) => v.toFixed(1) });
        const n = revealed(t, dur, 10, { start: 0.06, end: 0.45 });
        data.hist.forEach((c, i) => {
          if (i >= n) return;
          const h = c / 5;
          ctx.save(); ctx.fillStyle = P.blue; ctx.globalAlpha = 0.6;
          ctx.fillRect(a.sx(i / 10), a.sy(h), a.sx(0.1) - a.sx(0), a.sy(0) - a.sy(h));
          ctx.restore();
        });
        a.hline(1, { color: P.ink, width: 2, dash: null });
        a.note("the truth", a.L + 12, a.sy(1) - 14, { color: P.ink, size: 11.5, weight: 700 });
        const k = clamp01((t - dur * 0.5) / (dur * 0.35));
        if (k > 0) {
          const beta = linspace(0.01, 0.99, 120).map((x) => [x, 1.55 * x ** 0.62 * (1 - x) ** 0.18]);
          a.line(beta.map(([x, y]) => [x, lerp(1, y, easeOut(k))]), { color: P.red, width: 2.4 });
          a.note("a Beta, fitted to uniform data", a.L + 12, a.T + 18,
            { color: P.red, size: 11.5, weight: 700, alpha: k });
        }
      } }),

    /* ---------- 4. AIC ---------- */
    title({ n: 4, title: "AIC", tone: "blue", chapter: "AIC",
      sub: "Likelihood, minus a charge for complexity.",
      say: "Chapter four. The Akaike Information Criterion — likelihood, minus a charge for complexity.", dur: 10 }),

    formula({ dur: 28, heading: "The Akaike Information Criterion", tone: "blue",
      tex: "\\text{AIC}=-2\\log L(\\theta)+2p",
      notes: [
        "$p$ is the **number of parameters** in the model. We seek the model with the **smallest** AIC.",
        "We think of $2p$ as a **penalty** on the likelihood for the complexity of the model.",
        "**AIC requires the vector of data being fit to remain the same.**",
        "**AIC does NOT require the models to be nested.** That is what lets it rank a GED against a $t$.",
      ],
      say: "Models with more parameters have greater flexibility to fit features — but also artifacts — in observed data. Hence the risk of overfitting increases greatly as we consider models with a larger number of parameters. A widely used tool for comparing models is the Akaike Information Criterion, defined as minus two log likelihood, plus two p, where p is the number of parameters in the model. We think of two p as being a penalty on the likelihood for the complexity of the model, and we seek the model that has the smallest value of AIC. Two conditions, easy to confuse. AIC requires the vector of data being fit to remain the same across the models compared. But AIC does not require the models to be nested — and that is exactly what lets it rank a GED against a t distribution, neither of which is a special case of the other. The two p penalty is not arbitrary, by the way: it is derived from information theory, from the Kullback Leibler divergence, to correct for the expected overfitting bias that occurs when estimating p parameters on the same data." }),

    plot({ dur: 34, chapter: "AIC",
      caption: "The same four fits, now **penalized**. Normal has 2 parameters, GED 3, nonstandard $t$ 3, skewed $t$ 4. **Smallest AIC wins.**",
      say: "Here are the same four models, now ranked by AIC. The normal has two parameters, so its AIC is minus two times its log likelihood, plus four: eight thousand six hundred ninety six. The GED has three parameters: eight thousand fifty three. The nonstandard t, also three: seven thousand nine hundred seventy two. And the skewed t, with four parameters: seven thousand nine hundred sixty nine. So among these four, the skewed t is the best choice — it wins even after paying for its extra parameter. Note how much of the gain came from simply moving away from the normal, and how little separates the last two.",
      note: "among these four, the **skewed $t$** is the best choice",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-0.5, 3.6], y: [7800, 8800], W, H, pad: { l: 68, r: 24, t: 56, b: 52 } });
        a.grid(4, 4).frame();
        a.ticks({ ys: [7800, 8100, 8400, 8700] });
        const names = ["Normal", "GED", "Nonstd t", "Skewed t"];
        const vals = [data.aic.normal, data.aic.ged, data.aic.t, data.aic.skewt];
        const n = revealed(t, dur, 4, { start: 0.08, end: 0.62 });
        vals.forEach((v, i) => {
          if (i >= n) return;
          const best = i === 3;
          ctx.save(); ctx.fillStyle = best ? P.emerald : P.blue; ctx.globalAlpha = best ? 0.85 : 0.5;
          const x0 = a.sx(i - 0.3), x1 = a.sx(i + 0.3);
          ctx.fillRect(x0, a.sy(v), x1 - x0, a.sy(7800) - a.sy(v));
          ctx.restore();
          a.note(v.toFixed(0), (x0 + x1) / 2, a.sy(v) - 13,
            { color: best ? P.emerald : P.blue, size: 11.5, weight: 700, align: "center" });
          a.note(names[i], (x0 + x1) / 2, a.B + 18, { color: P.muted, size: 11.5, align: "center" });
        });
        if (n > 3) a.note("smallest AIC wins", a.L + 12, a.T + 18, { color: P.emerald, size: 12, weight: 700 });
      } }),

    code({ dur: 32, heading: "A grid over GARCH$(p,q)$ and the error distribution", file: "grid.py", chapter: "AIC",
      body: `# X_t = mu + sigma_t * eps_t,  eps_t iid mean 0, variance 1, specified distribution
maxp, maxq = 3, 3
errdists = ('normal','ged','t','skewt')

for dist in errdists:
    for p in range(maxp):
        for q in range(maxq):
            arch_model(ldrPGscl, mean='Constant', p=p, q=q,
                       vol="GARCH", dist=dist).fit(disp="off").aic

1 1 skewt   7737.47      <-- preferred model using AIC
arch_model(..., mean="zero", ..., dist="skewt").aic   = 7739.25`,
      caption: "Best: **$p=1$, $q=1$, skewed $t$** at 7737.47. Re-fitting with `mean=\"zero\"` gives **7739.25** — larger, so including $\\mu$ **is** worthwhile.",
      say: "We can push this further. Take the more general GARCH p q model, and also consider that a distribution other than the normal might be the best choice for the errors. The model is X t equals mu plus sigma t epsilon t, where the epsilons are iid with mean zero, variance one, and a specified distribution — normal, GED, t or skewed t. Note we are now also allowing the overall mean mu to be nonzero. Run a grid over p, q and the distribution, and read off the AICs. The preferred model is p equals one, q equals one, with skewed t errors, at seven thousand seven hundred thirty seven point four seven. And does AIC find that including the mean is worthwhile? Re-fit that same model with mean set to zero, and the AIC is seven thousand seven hundred thirty nine point two five. That is larger — so yes, including mu is worthwhile." }),

    points({ dur: 34, heading: "AIC versus BIC, and when AIC is not the last word", tone: "amber",
      items: [
        "**BIC** is a relative of AIC with a **stronger penalty** for extra parameters.",
        "**AIC** is generally preferred when your goal is **prediction** — it penalizes complexity less. **BIC** when you are trying to identify the **“true”** underlying model.",
        "It can be surprising that these goals lead to different models, but they do.",
        "**Is smaller AIC always better?** If you are using AIC for model selection, yes. But if the AIC is only **slightly** larger for a **significantly simpler** model, lean toward the simpler one — though that is subjective and hard to put into a rule.",
        "**AIC can favour a simpler model even when a complex one better captures extreme events**, if those events are so rare that the gain in log-likelihood does not outweigh the penalty.",
      ],
      say: "Two final cautions. BIC is a relative of AIC, and another criterion used for model selection, with a stronger penalty for extra parameters. How do you choose between them? AIC is generally preferred when your goal is prediction, since it penalizes complexity less. BIC is preferred when you are trying to identify the true underlying model, since it has a stronger penalty to prevent overfitting. It can be surprising that these goals lead to different models, but it is true: setting the objective to finding the true model for the data may not correspond to just getting the model that gives you the best predictions. And: is the model with the slightly lower AIC always the better choice? If you are using AIC to do model selection then yes, smaller is better. But if the AIC is only slightly larger for a significantly simpler model, the professor would lean toward using the simpler model — while noting this is a bit subjective and difficult to put into any sort of rule. One more worth knowing: AIC can favour a simpler model even if a complex one better captures extreme market events, if those events are so rare that the improvement in overall log likelihood does not outweigh the penalty for the extra parameters." }),

    points({ dur: 24, heading: "One more thing that matters: the time period", tone: "slate",
      items: [
        "**How much does the choice of time period affect which distribution fits best?** It could make a big difference.",
        "Including a **crisis period** — 2008, 2020 — will necessitate a **heavy-tailed** distribution.",
        "A **quiet market** might look much more normal.",
        "So a model-selection answer is a statement about *that window*, not a universal truth about returns.",
      ],
      say: "And one last practical point, which is easy to overlook. When fitting financial returns to a distribution, how much does the choice of time period affect which distribution fits best? It could make a big difference. Including a crisis period — two thousand eight, or twenty twenty — will necessitate a heavy tailed distribution, whereas a quiet market might look much more normal. So a model selection answer is always a statement about that particular window of data, not a universal truth about returns." }),

    recap({ dur: 36, items: [
      "The normal's tails decay **exponentially**; the $t$'s decay at a slower **polynomial** rate, matching real crashes.",
      "**GED:** shape $\\beta$ is the tail dial. $\\beta=2$ normal, $\\beta=1$ Laplace, $\\beta<2$ heavy, $\\beta>2$ lighter. Always **symmetric**.",
      "**Nonstandard $t$:** $X=\\mu+\\sigma T$, $V(X)=\\sigma^2\\nu/(\\nu-2)$. **Skewed $t$:** $a<b$ negative skew, $a>b$ positive, $a=b$ back to the $t$.",
      "**Nesting** guarantees the bigger model's likelihood is at least as large — so likelihood alone always picks the most complex candidate.",
      "**AIC $=-2\\log L+2p$**, smallest wins. **Same data required; nesting not required.**",
      "**AIC** for prediction, **BIC** for identifying the true model.",
    ],
    say: "To recap. The normal distribution's tails decay exponentially, making extreme events virtually impossible under it, while the t distribution's tails decay at a slower polynomial rate that matches empirical market crashes. For the GED, the shape parameter beta is the tail dial: two gives the normal, one gives the Laplace, below two gives heavy tails and above two gives lighter ones — and it is always symmetric. The nonstandard t is mu plus sigma T, with variance sigma squared times nu over nu minus two. The skewed t adds asymmetry through a and b: a less than b gives negative skew, a greater than b positive, and a equal to b collapses back to the t. Nesting guarantees the bigger model's likelihood is at least as large, which is why likelihood alone always picks the most complex candidate. AIC is minus two log likelihood plus two p, and smallest wins; it requires the same data but does not require nesting. And finally: AIC for prediction, BIC for identifying the true model." }),
  ],
});
