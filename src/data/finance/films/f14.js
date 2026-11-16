/* f14 — Mean Models, Least Squares, and the Merton Model (full lecture) */

import { PALETTE as P, linspace, normals, rng, clamp01, easeOut, lerp } from "@/lib/anim";
import { compile, title, jargon, points, formula, plot, code, recap, revealed } from "@/lib/scenes";

const D = (() => {
  const nrm = normals(211), u = rng(907);

  /* a smooth mean model with scatter around it — the picture of a mean model */
  const m = (x) => 2.2 + 1.4 * Math.sin(x * 0.9) + 0.42 * x;
  const curve = linspace(0, 6, 160).map((x) => [x, m(x)]);
  const obs = Array.from({ length: 26 }, (_, i) => {
    const x = 0.25 + i * 0.22;
    return [x, m(x) + nrm() * 0.42];
  });

  /* the volatility smile: implied vol against strike, noisy, with a fitted curve */
  const K0 = 7900;
  const smileFit = (k) => 0.117 + 2.9e-8 * (k - 7940) ** 2 + (k < K0 ? 1.1e-5 * (K0 - k) : 0);
  const strikes = linspace(7660, 8200, 86);
  const smileObs = strikes.map((k) => [k, Math.max(0.105, smileFit(k) + nrm() * 0.013)]);
  const smileCurve = strikes.map((k) => [k, smileFit(k)]);
  /* option price against strike — the same data, utterly different scale */
  const priceObs = strikes.map((k) => [k, Math.max(0.2, 97 * Math.exp(-(k - 7660) / 95) + nrm() * 2.2)]);

  /* a Merton price path: GBM with Poisson jumps marked */
  const path = [1];
  const jumps = [];
  for (let i = 1; i < 500; i++) {
    const n = u() < 7 / 252 ? 1 : 0;
    const j = n ? -0.02 + nrm() * 0.1 : 0;
    if (n) jumps.push(i);
    path.push(path[i - 1] * Math.exp(0.1 / 252 + 0.2 / Math.sqrt(252) * nrm() + j));
  }
  return { curve, obs, smileObs, smileCurve, priceObs, path, jumps, K0,
    fit: { sigma: 0.0887, lam: 1.9353, muj: -0.1429, sigmaj: 0.1030 } };
})();

export default compile({
  id: "f14",
  title: "Mean Models, Least Squares, and the Merton Model",
  blurb: "What a mean model is and is not, why we square the residuals, reading minimize(), the volatility smile, and the Merton jump diffusion model fitted to it.",
  takeaway: "A mean model tells you where the curve goes and nothing about the scatter around it. Black-Scholes and Merton are both mean models — which is exactly why they are fitted by least squares rather than by likelihood.",
  data: D,
  scenes: [

    /* ---------- 1. what a mean model is ---------- */
    title({ n: 1, title: "What a mean model is", tone: "slate", chapter: "Mean models",
      sub: "A curve, with no promise about the scatter.",
      say: "Chapter one. What a mean model is — and, just as importantly, what it is not.", dur: 9 }),

    jargon({ dur: 26, term: "Mean model", chapter: "Mean models",
      plain: "A model which, from a probability standpoint, can only characterize how the **expected value** of a modelling random variable depends on unknown parameters and other known quantities.",
      formal: "$\\E(Y_i)=m(\\theta,\\mathbf{x}_i)$, where $m$ is the mean model, $\\theta$ are the unknown parameters, and $\\mathbf{x}_i$ are the known covariates. Equivalently $Y_i=m(\\theta,\\mathbf{x}_i)+\\epsilon_i$ with $\\epsilon_i$ mean-zero.",
      say: "The term mean model refers to a model which, from a probability standpoint, only characterizes how the expected value of a modelling random variable depends on unknown parameters and other known quantities. In its general form, the expected value of Y i equals m of theta and x i, where m is the mean model, theta are the unknown parameters, and x i are the known covariates, predictors or features. You can write the same thing as Y i equals m of theta and x i, plus an epsilon i which has mean zero." }),

    plot({ dur: 30, chapter: "Mean models",
      caption: "**A mean model is not a probability model.** It fixes where the curve goes. It says **nothing** about the distribution of the scatter around it.",
      say: "Here is the picture. The curve is the mean model: for each value of x, it says where the expected value of Y sits. The points are the observations. And here is the crucial part — a mean model is not a probability model, because it does not fully specify the distribution for the modelling random variables. It tells you where the curve goes. It tells you nothing about how the scatter around that curve is distributed. It does not say, for example, that the noise is normal. A mean model is often an important component of a probability model, but on its own it is not one.",
      note: "ordinary linear regression is the familiar case: $m(\\theta,x_i)=\\beta_0+\\beta_1x_i$",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 6], y: [0, 7], W, H, pad: { l: 54, r: 24, t: 56, b: 44 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 2, 4, 6], ys: [0, 2, 4, 6] });
        a.line(data.curve, { color: P.blue, width: 2.6 });
        const n = revealed(t, dur, data.obs.length, { start: 0.12, end: 0.6 });
        a.dots(data.obs.slice(0, n), { color: P.ink, r: 3.2 });
        /* residual sticks */
        const k = clamp01((t - dur * 0.55) / (dur * 0.3));
        if (k > 0) for (const [x, y] of data.obs.slice(0, n)) {
          const my = 2.2 + 1.4 * Math.sin(x * 0.9) + 0.42 * x;
          a.line([[x, my], [x, lerp(my, y, easeOut(k))]], { color: P.red, width: 1.3, alpha: 0.75 });
        }
        a.note("m(θ, xᵢ) — the mean model", a.L + 10, a.T + 18, { color: P.blue, size: 12, weight: 700 });
        if (k > 0.4) a.note("the scatter: unmodelled", a.L + 10, a.T + 40, { color: P.red, size: 12, weight: 700 });
      } }),

    points({ dur: 30, heading: "Mean model vs full probability model", tone: "amber",
      items: [
        "A **mean model** specifies only the **expected value** of the observables as a function of the parameters.",
        "A **full probability model** specifies the **entire distribution** — so you can get variances, quantiles and likelihoods.",
        "**Why use one at all?** Models like Merton's volatility surface, or Nelson-Siegel for yield curves, come from **financial theory** — a theory of how things behave, giving a simple smooth form.",
        "Real data are never that smooth, so we allow for scatter. But the theory makes **no prediction** about the distribution of that scatter.",
      ],
      say: "It is worth being able to state the distinction cleanly. A mean model specifies only the expected value of the observable random variables as a function of the parameters. A full probability model specifies the entire distribution of the observables, so you can calculate variances, quantiles, likelihoods and so forth. Why use a mean model at all? The professor's answer is deliberately unromantic. The mean models we consider — the Merton specification of the volatility surface, or the Nelson Siegel model for yield curves — are derived from financial theory. Someone has a theory about how things behave, and that leads to a simple, smooth form for the relationship. Real data are never that smooth, so when we fit them we have to allow for scatter around the smooth curve. But the theory does not typically make a prediction about the distribution of that scatter. So the model only specifies the mean. It is not that there is value in this; it is just what we are often presented with." }),

    /* ---------- 2. least squares ---------- */
    title({ n: 2, title: "Least squares", tone: "blue", chapter: "Least squares",
      sub: "Why we square the residuals, and when weights are needed.",
      say: "Chapter two. Least squares — why we square the residuals rather than take absolute values, and when weights are needed.", dur: 10 }),

    formula({ dur: 22, heading: "The residual sum of squares", tone: "blue",
      tex: "\\text{RSS}(\\theta)=\\sum_{i=1}^{n}\\big(y_i-m(\\theta,\\mathbf{x}_i)\\big)^2",
      notes: [
        "Find the $\\theta$ that forces the mean model **closest to the observations**.",
        "If $Y_1,\\ldots,Y_n$ are iid with mean $\\mu$, the mean model is just $\\mu$ — and the least squares estimator is $\\bar y$.",
      ],
      say: "With a training set of x and y pairs, the popular option for fitting a mean model is least squares, where we seek the theta that minimizes the residual sum of squares. The motivation is simply to find the particular choice of theta which forces the mean model closest to the observations. Here is a quick case worth knowing: if Y one through Y n are iid from some distribution with expected value mu, the mean model is just mu — the covariates do nothing — so you are minimizing the sum of y i minus mu, squared. And the answer is the sample mean. The sample mean is a least squares estimator." }),

    points({ dur: 34, heading: "Why squares, and not absolute values?", tone: "blue",
      items: [
        "Why not minimize $\\sum_i|y_i-m(\\theta,\\mathbf{x}_i)|$ — **L1 regression**? Three reasons.",
        "**1. Tractability.** The square is differentiable, continuous and easier to work with analytically. L1 regression is only possible **numerically**.",
        "**2. Gauss-Markov.** Least squares estimators are the **best linear unbiased estimators** in linear regression — “best” meaning smallest variance, “linear” meaning a linear function of the $Y_i$.",
        "**3. The MLE link.** When the $\\epsilon_i$ are **iid normal**, the least squares estimators **are** the maximum likelihood estimators.",
      ],
      say: "A fair question: why not minimize the sum of absolute deviations, which is called L one regression? Three reasons from the notes. First, tractability: the square is differentiable, continuous, and easier to work with analytically, whereas L one regression is only possible numerically. Second, the Gauss Markov theorem: least squares estimators are the best linear unbiased estimators of the parameters in the case of linear regression. Best means smallest variance; linear means a linear function of the Y i. And third, the link to maximum likelihood: when the epsilons are iid normal, the least squares estimators are the maximum likelihood estimators. That third result gets derived in Part eight." }),

    formula({ dur: 26, heading: "Weighted least squares", tone: "amber",
      tex: "\\text{WRSS}(\\theta)=\\sum_{i=1}^{n}w_i\\big(y_i-m(\\theta,\\mathbf{x}_i)\\big)^2",
      notes: [
        "“OLS” is **ordinary** least squares. Weights matter when some observations carry much larger errors than others — **heteroskedasticity**.",
        "Observations with **higher variance** get **lower weight**.",
        "Fitting options data: prices of **heavily-traded** options are far more reliable than thinly-traded ones. Weight by **volume**.",
      ],
      say: "The O L S in those function names stands for ordinary least squares. That is contrasted with weighted least squares, in which weights are attached to each of the terms in the criterion. Introducing weights can be crucial in situations where some observations are known to be subject to much larger errors than others — referred to as heteroskedasticity. The rule is that observations with higher variance get lower weight. The standard example, and the one we will meet in a moment: when fitting models using options data, prices corresponding to heavily traded options are much more reliable than their lightly traded counterparts. So the natural weight is trading volume." }),

    code({ dur: 34, heading: "Reading minimize()", file: "minimize.py", chapter: "Least squares",
      body: `from scipy.optimize import minimize
import numpy as np

def sumofsqr(c, x):
    return sum((x-c)**2)

x = np.array([4,2,6,8,6,1])
res = minimize(sumofsqr, 0, method='Nelder-Mead',
               options={'disp': True}, args=(x))

res.x        # array([4.5])  -- the minimizing value, here the sample mean`,
      caption: "You will be asked to **read** this, not write it. Six things to know about the call, and two rules about the function itself.",
      say: "Python includes general purpose optimization capability. Here we focus on minimize, a part of scipy, which minimizes a function specified by the user. You will be asked to read code like this, not to write it. Six things to know about the call. One: the first argument is the function to be minimized — note there are no parentheses, it is simply the name of the function. Two: the second argument is the starting value for the parameters, and it should be on the interior, not the boundary, of the space of possible values; with more than one parameter it comes in as an array. Three: the method argument tells minimize which optimization technique to use. Four: options can set the tolerance, the maximum number of iterations, and how much is displayed. Five: any arguments to be passed on to the function being minimized are listed via the args syntax. And six: res dot x is the input value at which the function is minimized — here, four point five, which is the sample mean of those six numbers." }),

    points({ dur: 24, heading: "Two rules about the function you hand it", tone: "slate",
      items: [
        "The optimizer **minimizes**. To **maximize**, define the function as the **negative** of what you want.",
        "The **first argument** must be the variable or variables being optimized over — as an **array** if there is more than one. Extra arguments come second onward.",
        "This is exactly why every likelihood example in the course minimizes the **negative log-likelihood**.",
      ],
      say: "And two rules about the function itself. First, the optimization procedure minimizes the provided function — so if you want to maximize a function, define the function as the negative of it. Second, it is crucial that the first input argument to the function be the variable or variables over which the function is to be optimized, and if there is more than one such variable they must come in as an array. Any number of additional arguments can follow, but they must start second in the list. Hold on to the first of those rules: it is exactly why every likelihood example in this course minimizes the negative log likelihood." }),

    /* ---------- 3. the smile ---------- */
    title({ n: 3, title: "The volatility smile", tone: "amber", chapter: "The smile",
      sub: "The observation that breaks Black-Scholes.",
      say: "Chapter three. The volatility smile — the observation that breaks Black Scholes, and the reason the Merton model exists.", dur: 10 }),

    plot({ dur: 34, chapter: "The smile",
      caption: "Under Black-Scholes, volatility is a **fixed constant**. So every option on the same underlying with the same expiry should show the **same implied volatility** — a flat line. It does not.",
      say: "Under the Black Scholes model, volatility is a fixed constant sigma. If that were true, all options on the same underlying asset with the same expiration date should have equal implied volatility, regardless of their strike price. That would be the dashed flat line. But real markets exhibit a volatility smile, or volatility skew. Here are actual S and P five hundred call options at one expiration date: implied volatility is high for low strikes, dips in the middle, and climbs again for high strikes. It is emphatically not flat.",
      note: "SPX calls, one expiration — **implied volatility against strike**",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [7640, 8220], y: [0.10, 0.20], W, H, pad: { l: 60, r: 24, t: 56, b: 46 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [7700, 7900, 8100], ys: [0.10, 0.14, 0.18], yfmt: (v) => v.toFixed(2) });
        const n = revealed(t, dur, data.smileObs.length, { start: 0.08, end: 0.55 });
        a.line(data.smileObs.slice(0, n), { color: P.blue, width: 1.5, alpha: 0.85 });
        a.dots(data.smileObs.slice(0, n), { color: P.blue, r: 2.2 });
        const k = clamp01((t - dur * 0.6) / (dur * 0.25));
        if (k > 0) a.hline(0.129, { color: P.red, width: 1.8, alpha: k });
        if (k > 0.5) a.note("what Black-Scholes predicts", a.L + 12, a.sy(0.129) - 14,
          { color: P.red, size: 12, weight: 700 });
        a.note("Strike price →", a.R - 100, a.B + 26, { color: P.muted, size: 11 });
      } }),

    points({ dur: 32, heading: "Why heavier tails produce the smile", tone: "amber",
      items: [
        "Take **out-of-the-money** calls, and suppose the true log-return distribution has **heavier tails** than the normal.",
        "Then there is a **greater chance** of the underlying making a large shift before expiration and finishing **in the money**.",
        "That makes the option **more valuable** than Black-Scholes implies.",
        "Black-Scholes has only one dial — $\\sigma$ — so inverting the richer market price forces the implied volatility **higher**.",
        "And the effect becomes **more pronounced** the further out of the money you go. That is the upward sweep.",
      ],
      say: "Here is the mechanism, and it is worth being able to say out loud. Take out of the money call options, and assume the true log return distribution has heavier tails than the normal. When the true distribution is heavier tailed, there is a greater chance of the price of the underlying asset making a large shift prior to expiration and ending up in the money. That makes the option more valuable than what Black Scholes would imply. And since Black Scholes has only one dial to turn — sigma — inverting that richer market price forces the Black Scholes implied volatility to be higher. This effect becomes more pronounced as you get further out of the money. That is precisely the upward sweep you just saw." }),

    /* ---------- 4. Merton ---------- */
    title({ n: 4, title: "The Merton model", tone: "blue", chapter: "Merton",
      sub: "Geometric Brownian motion, plus jumps.",
      say: "Chapter four. The Merton model — which is geometric Brownian motion, plus jumps.", dur: 9 }),

    points({ dur: 30, heading: "The three crucial elements", tone: "blue",
      items: [
        "The **smooth (diffusion) component** of the log price is a Brownian motion with drift $\\nu$ and scaling $\\sigma^2$.",
        "**Jumps arrive as a Poisson process** with rate $\\lambda$ per year — straight out of Part 6.",
        "The **sizes of the jumps are iid normal** with mean $\\mu_j$ and variance $\\sigma_j^2$.",
        "Before the jumps, the Merton model **is just geometric Brownian motion** — the same continuous diffusion underlying Black-Scholes.",
      ],
      say: "The Merton model introduces jumps into the otherwise smooth model for the log price. Its crucial elements are three. One: the smooth, or diffusion, component of the log price is modelled as a Brownian motion with drift nu and scaling, that is volatility, sigma squared. Two: jumps are assumed to arrive as a Poisson process with rate lambda per year. Three: the sizes of the jumps are iid normal with mean mu j and variance sigma j squared. And note the answer to a question students often ask: before the jumps are added, the Merton model is just geometric Brownian motion — the same continuous diffusion model underlying Black Scholes. The term diffusion model implies a stochastic process with continuous paths." }),

    plot({ dur: 32, chapter: "Merton",
      caption: "A simulated Merton path. The **smooth** stretches are the diffusion; the **dashed red lines** mark the Poisson jump arrivals.",
      say: "Here is a path simulated from that model, five hundred days of it. Between the red lines the price diffuses smoothly — that is the Brownian motion. At each red line a jump arrives, drawn from the Poisson process, and the price moves discontinuously. Jumps can be caused by events specific to that equity, or macroeconomic ones: earnings surprises that beat or miss expectations, announcements of mergers, acquisitions or divestitures, management changes, product launches or failures, legal rulings, monetary policy shifts, geopolitical shocks, economic data releases, or market wide crashes and rallies.",
      note: "jumps marked in red — **Poisson arrivals** at rate $\\lambda$ per year",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 500], y: [0.4, 1.3], W, H, pad: { l: 56, r: 24, t: 56, b: 44 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 250, 500], ys: [0.5, 0.8, 1.1], yfmt: (v) => v.toFixed(1) });
        const n = Math.max(2, revealed(t, dur, data.path.length, { start: 0.04, end: 0.88 }));
        for (const j of data.jumps) if (j < n) a.vline(j, { color: P.red, alpha: 0.35, width: 1.2 });
        a.line(data.path.slice(0, n).map((v, i) => [i, v]), { color: P.blue, width: 1.9 });
        a.note("Price / initial price", a.L + 10, a.T + 18, { color: P.muted, size: 11.5, weight: 600 });
      } }),

    formula({ dur: 28, heading: "The distribution of the log returns", tone: "amber",
      tex: "\\text{log return}=X+\\sum_{k=1}^{J}U_k",
      notes: [
        "$X$ is **normal** — the diffusion increment. Each $U_k$ is **normal** — a jump size. But $J$ is **Poisson**, and **random**.",
        "**Since $J$ is random, this sum is NOT normally distributed.**",
        "Conditional on $J=j$ it *is* normal — which is what makes the price computable — but unconditionally it is a **Poisson mixture of normals**, and that has heavier tails than any single normal.",
      ],
      say: "Now work out the distribution of the log returns under the Merton model. The diffusion component contributes a normal increment to the price on the log scale — call it X. Then the number of jumps J that occur in a day has a Poisson distribution. Each jump size is normal; denote them U one through U J. So the log return is X plus the sum of those U's. And here is the key line: since J is random, this sum is not normally distributed. Conditional on J equals j it is normal — which is exactly what makes the pricing formula computable — but unconditionally it is a Poisson mixture of normals with different variances, and a mixture like that has heavier tails than any single normal. Which is the whole point. That heaviness is what captures the smile." }),

    code({ dur: 32, heading: "Simulating Merton log returns", file: "sim_merton.py", chapter: "Merton",
      body: `from scipy.stats import norm, poisson

def sim_merton(T, mu, sigma, lam, mu_j, sigma_j, dt=1/252):
    returns, numjumps = [], []
    for _ in range(T):
        Z = np.random.normal()                       # smooth contribution
        N = np.random.poisson(lam * dt)              # number of jumps
        J = np.sum(np.random.normal(mu_j, sigma_j, N)) if N > 0 else 0
        r = mu * dt + sigma * np.sqrt(dt) * Z + J    # jump contribution
        numjumps.append(N); returns.append(r)
    return np.array(returns), np.array(numjumps)`,
      caption: "The key line is `r = mu*dt + sigma*np.sqrt(dt)*Z + J` — **drift + diffusion + jumps**.",
      say: "Here is the code that generates a sequence of log returns from this model. The argument d t is the time interval in units of years, so one over two five two gives daily returns, and T is how many intervals to simulate. Read the key line: r equals mu times d t, plus sigma times the square root of d t times Z, plus J. That is drift, plus diffusion, plus jumps. One detail worth noticing: sigma and sigma j are not on comparable scales. Sigma is in annual terms, so the standard deviation on the diffusion component of each daily log return is sigma over the square root of two five two — which is where that square root of d t comes from." }),

    /* ---------- 5. calibration ---------- */
    title({ n: 5, title: "Fitting Merton to the smile", tone: "emerald", chapter: "Calibration",
      sub: "And why we fit to implied vols, not prices.",
      say: "Chapter five. Fitting the Merton model to the smile — and a question worth real thought: why we fit to implied volatilities rather than to the prices themselves.", dur: 12 }),

    plot({ dur: 36, chapter: "Calibration",
      caption: "The same options, two ways. **Implied vol** spans 0.11 to 0.19. **Price** runs from nearly 100 down to nearly 0.",
      say: "Here are the same options plotted two ways. On the left, implied volatility against strike — the values span roughly point one one to point one nine. On the right, the market price against strike — and that runs from nearly one hundred down to nearly zero. Hold that contrast in mind, because it is the whole answer to the question we are about to ask.",
      note: "same contracts · same strikes · wildly different **response scales**",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const half = W / 2;
        const a = axes(ctx, { x: [7640, 8220], y: [0.10, 0.20], W: half, H, pad: { l: 56, r: 14, t: 56, b: 46 } });
        a.grid(3, 3).frame();
        a.ticks({ ys: [0.10, 0.15, 0.20], yfmt: (v) => v.toFixed(2) });
        a.line(data.smileObs, { color: P.blue, width: 1.4, alpha: 0.85 });
        a.note("implied volatility", a.L + 8, a.T + 18, { color: P.blue, size: 12, weight: 700 });
        const k = clamp01((t - 3) / (dur * 0.3));
        if (k > 0) {
          ctx.save(); ctx.globalAlpha = k;
          const b = axes(ctx, { x: [7640, 8220], y: [0, 105], W, H, pad: { l: half + 56, r: 24, t: 56, b: 46 } });
          b.grid(3, 3).frame();
          b.ticks({ ys: [0, 50, 100] });
          b.line(data.priceObs, { color: P.red, width: 1.4, alpha: 0.85 });
          b.note("market price", b.L + 8, b.T + 18, { color: P.red, size: 12, weight: 700 });
          ctx.restore();
        }
      } }),

    points({ dur: 34, heading: "Why calibrate to implied vols, not prices", tone: "emerald",
      items: [
        "This is a **mean model** — Merton only specifies the expected value for either the implied vol or the market price.",
        "Least squares puts **greater emphasis on the larger fluctuations** around the fitted model, since $\\sum(y_i-m)^2$ is dominated by the big residuals.",
        "Fit to **prices**, and the handful of large values on the left **control the entire fit**.",
        "Fit to **implied vols**, and there is a far more **even distribution of errors** across the range of strikes.",
        "Recall: **OLS is optimal when the spread around the mean model is normal error.**",
      ],
      say: "So: why would it be a good idea to calibrate a model to the implied volatility surface instead of to the actual prices? First, remember this is a mean model — the Merton model only specifies what we would call the expected value for either the implied volatility or the market price. Second, least squares puts greater emphasis on the larger fluctuations around the mean, or fitted, model, because the sum of squared residuals is dominated by the big ones. In our case that means that if we fit to the observed market prices, the values on the left — the large ones — will control the fit. When we fit to the implied volatilities instead, there is a far more even distribution of errors across the range of strike prices. There is not a wide range of response values as there is in the case of prices. And recall: ordinary least squares is optimal when the spread around the mean model is normal error." }),

    plot({ dur: 30, chapter: "Calibration",
      caption: "The fitted Merton curve through the observed smile. Estimated $\\sigma=0.0887$, $\\lambda=1.94$, $\\mu_j=-0.143$, $\\sigma_j=0.103$.",
      say: "And here is the result. The dashed red curve is the Merton model fitted by least squares to the implied volatilities, using minimize with bounds on each parameter and the L B F G S B method. The estimated diffusion volatility is about point zero eight nine, the jump intensity about one point nine four per year, the mean log jump about minus point one four — negative, so jumps tend to be downward — and the jump volatility about point one zero. The model reproduces the smile. Note one thing the professor flags later, though: the rate of jumps seems rather large while the jump sizes seem rather small. That concern comes back in Part eleven.",
      note: "fitted by **weighted** least squares — weights from trading volume",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [7640, 8220], y: [0.10, 0.20], W, H, pad: { l: 60, r: 24, t: 56, b: 46 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [7700, 7900, 8100], ys: [0.10, 0.14, 0.18], yfmt: (v) => v.toFixed(2) });
        a.line(data.smileObs, { color: P.blue, width: 1.3, alpha: 0.4 });
        a.dots(data.smileObs, { color: P.blue, r: 2, alpha: 0.5 });
        const n = Math.max(2, revealed(t, dur, data.smileCurve.length, { start: 0.1, end: 0.72 }));
        a.line(data.smileCurve.slice(0, n), { color: P.red, width: 2.6, dash: [7, 4] });
        a.chip("Merton fit", a.R - 110, a.T + 18, { color: P.red, bg: "rgba(186,26,26,0.10)" });
      } }),

    points({ dur: 26, heading: "Merton and Black-Scholes are both mean models", tone: "slate",
      items: [
        "Both **specify how things such as volatility and market prices vary as a function of input**…",
        "…but **neither describes the scatter around that expected value**.",
        "Neither says, for example, that the additional noise is normal.",
        "Which is exactly why they are fitted by **least squares** rather than by maximum likelihood.",
      ],
      say: "One closing thought that ties the chapter back to where we started. Why are the Merton model, and Black Scholes, best thought of as mean models? Because they both specify how things such as volatility and market prices vary as a function of input, but they do not describe the scatter around that expected value. They do not say, for example, that the additional noise is normal. And that is precisely why they are fitted by least squares rather than by maximum likelihood — which, as we will see in Part eight, is the tool for when you do have a full probability model." }),

    recap({ dur: 34, items: [
      "A **mean model** gives $\\E(Y_i)=m(\\theta,\\mathbf{x}_i)$ and **nothing about the scatter** — so it is not a probability model.",
      "**Least squares**, not L1: tractability, Gauss-Markov (BLUE), and the MLE equivalence under normal errors.",
      "**Weighted** least squares for **heteroskedasticity** — higher variance, lower weight. Options: weight by volume.",
      "`minimize()` minimizes. To maximize, **negate the function**. First argument = the variable optimized over.",
      "**Merton** = Brownian diffusion + Poisson jump arrivals + iid normal jump sizes. The log return is **not** normal, because $J$ is random.",
      "Calibrate to **implied vols**, not prices, because least squares would otherwise be dominated by the largest prices.",
    ],
    say: "To recap. A mean model gives the expected value of Y as a function of the parameters and covariates, and nothing about the scatter around it — which is why it is not a probability model. We use least squares rather than L one for three reasons: tractability, the Gauss Markov theorem which makes least squares estimators best linear unbiased, and the equivalence with maximum likelihood under normal errors. Weighted least squares handles heteroskedasticity, with higher variance observations getting lower weight; for options data, weight by trading volume. The minimize function minimizes, so to maximize you negate the function, and the first argument must be the variable being optimized over. The Merton model is Brownian diffusion plus Poisson jump arrivals plus iid normal jump sizes, and its log returns are not normal because the number of jumps is random. And we calibrate to implied volatilities rather than prices, because otherwise least squares would be dominated by the largest prices." }),
  ],
});
