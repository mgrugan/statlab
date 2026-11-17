/* StatLab — "Get Ready", a Midterm Two paper written in the style of the
 * real 2025 Midterm One.
 *
 * The style was taken from the actual paper, not invented. What that paper
 * does, and what this one copies:
 *
 *   - stems are short and plain. "What does ARCH stand for?", "What does
 *     the bandwidth parameter control?" — one line, no setup;
 *   - choices are often very short, sometimes a single word or model name
 *     ("ARIMA / GARCH / APARCH / VAR", "Lognormal / Normal / Geometric");
 *   - the test is recall and understanding, not computation: definitions,
 *     null hypotheses, which tool does which job, what a plot shows;
 *   - figures are read for a conclusion, and one question prints code
 *     output and asks what it means;
 *   - several questions reference lecture directly;
 *   - a formula is sometimes printed in the stem and then asked about;
 *   - "which of the following is not..." and "all of the above" each appear.
 *
 * One deliberate difference: the real paper has six questions with three
 * choices rather than four. These all have four, so the guess rate is the
 * same throughout and the answer-key audit stays meaningful.
 *
 * Coverage is 6/6/5/7/5/4 across Parts 6 to 11, as on the other papers.
 */

import { normals, rng } from "@/lib/anim";

/* ---------------------------------------------------------------- figures */

const pts = (vals, { x0 = 44, x1 = 392, lo, hi, y0 = 24, y1 = 210 }) =>
  vals.map((v, i) => {
    const x = x0 + (i / (vals.length - 1)) * (x1 - x0);
    const y = y1 - ((v - lo) / (hi - lo)) * (y1 - y0);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

/* Figure 1: implied volatility against strike — a smirk, steeper on the
   downside, against the single flat volatility Black-Scholes assumes. */
const SMILE = Array.from({ length: 60 }, (_, i) => {
  const m = 0.75 + (0.5 * i) / 59;              // moneyness K/S from 0.75 to 1.25
  return 0.185 + 0.62 * (m - 1.04) ** 2 + 0.085 * Math.max(0, 1.02 - m);
});
const FLAT = Array.from({ length: 60 }, () => 0.205);

/* Figure 2: two log-likelihoods peaking at the same value of lambda. One is
   sharply curved, the other nearly flat — same estimate, different precision. */
const LL_SHARP = Array.from({ length: 80 }, (_, i) => {
  const t = 0.6 + (1.4 * i) / 79;
  return -46 * (t - 1.3) ** 2;
});
const LL_FLAT = Array.from({ length: 80 }, (_, i) => {
  const t = 0.6 + (1.4 * i) / 79;
  return -5.5 * (t - 1.3) ** 2;
});

/* Figure 3: density of daily log returns against the best-fitting normal,
   on a log vertical axis so the tails are visible. Both tails of the data
   sit above the normal, and the left one further above than the right. */
const GRID = Array.from({ length: 90 }, (_, i) => -0.085 + (0.17 * i) / 89);
const NORMAL_D = GRID.map((x) => Math.log10(Math.exp(-(x ** 2) / (2 * 0.0115 ** 2)) / (0.0115 * 2.5066) + 1e-12));
const EMPIRICAL_D = GRID.map((x) => {
  const core = 0.80 * Math.exp(-(x ** 2) / (2 * 0.0092 ** 2)) / (0.0092 * 2.5066);
  const tail = 0.20 * Math.exp(-Math.abs(x) / 0.021) / (2 * 0.021);
  const skew = x < 0 ? 1.55 : 1;                 // the left tail is the fatter one
  return Math.log10(core + skew * tail + 1e-12);
});

/* Figure 4: a Merton path against a pure geometric Brownian motion driven by
   the same diffusion shocks, so the only visible difference is the jumps. */
const [GBM_P, MERTON_P] = (() => {
  const z = normals(404), u = rng(99);
  const g = [1], m = [1];
  for (let i = 1; i < 300; i++) {
    const shock = 0.055 / Math.sqrt(252) + 0.011 * z();
    let jump = 0;
    if (u() < 9 / 300) jump = (u() < 0.62 ? -1 : 1) * (0.035 + 0.055 * u());
    g.push(g[i - 1] * Math.exp(shock));
    m.push(m[i - 1] * Math.exp(shock + jump));
  }
  return [g, m];
})();

export const EXAM_GETREADY_FIGURES = {
  fig1: {
    caption: "Figure 1: Implied volatility by strike for options on one underlying, with the single volatility assumed by Black-Scholes shown dashed.",
    viewBox: "0 0 420 240",
    series: [
      { points: pts(SMILE, { lo: 0.15, hi: 0.40 }), stroke: "var(--blue-bright)", width: 2 },
      { points: pts(FLAT, { lo: 0.15, hi: 0.40 }), stroke: "var(--destructive)", dash: "5 3" },
    ],
    legend: [
      { label: "Implied volatility", stroke: "var(--blue-bright)" },
      { label: "Black-Scholes", stroke: "var(--destructive)", dash: "5 3" },
    ],
    xlabel: "Strike / Spot", ylabel: "Implied volatility",
  },

  fig2: {
    caption: "Figure 2: Log-likelihood for the rate of an Exponential, from two different samples. Both peak at the same value.",
    viewBox: "0 0 420 240",
    series: [
      { points: pts(LL_SHARP, { lo: -42, hi: 2 }), stroke: "var(--blue-bright)", width: 2 },
      { points: pts(LL_FLAT, { lo: -42, hi: 2 }), stroke: "var(--destructive)", width: 2, dash: "5 3" },
    ],
    legend: [
      { label: "Sample A", stroke: "var(--blue-bright)" },
      { label: "Sample B", stroke: "var(--destructive)", dash: "5 3" },
    ],
    xlabel: "lambda", ylabel: "Log-likelihood",
  },

  fig3: {
    caption: "Figure 3: Density of daily log returns (solid) against the best-fitting normal (dashed). Note the logarithmic vertical axis.",
    viewBox: "0 0 420 240",
    series: [
      { points: pts(EMPIRICAL_D, { lo: -4.2, hi: 1.9 }), stroke: "var(--destructive)", width: 2 },
      { points: pts(NORMAL_D, { lo: -4.2, hi: 1.9 }), stroke: "var(--blue-bright)", width: 1.6, dash: "6 4" },
    ],
    legend: [
      { label: "Observed", stroke: "var(--destructive)" },
      { label: "Fitted normal", stroke: "var(--blue-bright)", dash: "6 4" },
    ],
    xlabel: "Daily log return", ylabel: "Density (log scale)",
  },

  fig4: {
    caption: "Figure 4: Two simulated price paths driven by identical diffusion shocks. One has a jump component added.",
    viewBox: "0 0 420 240",
    series: [
      { points: pts(MERTON_P, { lo: 0.72, hi: 1.46 }), stroke: "var(--destructive)", width: 1.6 },
      { points: pts(GBM_P, { lo: 0.72, hi: 1.46 }), stroke: "var(--blue-bright)", width: 1.6, dash: "5 3" },
    ],
    legend: [
      { label: "Series A", stroke: "var(--destructive)" },
      { label: "Series B", stroke: "var(--blue-bright)", dash: "5 3" },
    ],
    xlabel: "Trading day", ylabel: "Price",
  },
};

export const EXAM_GETREADY_META = {
  title: "Get Ready",
  subtitle: "Statistical Methods in Finance · Parts 6-11, in the style of the real paper",
  minutes: 75,
  pointsPer: 3,
  rules: [
    "33 questions, 3 points each (99 points total). Exactly one correct response each.",
    "75 minutes. The timer starts when you click Begin.",
    "Covers Parts 6 through 11 of the lecture notes, inclusive.",
    "Notes, books and calculators/laptops/phones are not allowed.",
    "Written to match the question style of last year's real midterm: short questions, short choices, and recall of what things mean rather than computation.",
    "\"iid\" stands for \"independent and identically distributed.\"",
  ],
};

/* ------------------------------------------------------------------ paper */

export const EXAM_GETREADY = [
/* ----------------------------------------------- Part 6: Poisson process */
{ id: "g1", ref: "f13", topic: "Poisson distribution",
  q: "What does the Poisson distribution model?",
  choices: [
    "The size of a randomly chosen event.",
    "The proportion of intervals containing an event.",
    "The time between events.",
    "The number of events in a fixed interval.",
  ], answer: 3,
  why: "The Poisson is a distribution on $\\{0,1,2,\\dots\\}$, so it can only ever count. The **time between** events is Exponential — continuous, on $(0,\\infty)$ — and the two are the same model seen from either side, with the same $\\lambda$. Checking the support is the quickest way to keep them straight: a count cannot be 2.7, and a waiting time cannot be a whole number by necessity." },

{ id: "g2", ref: "f13", topic: "Memoryless property",
  q: "Which distribution has the memoryless property?",
  choices: ["Exponential", "Gamma", "Uniform", "Normal"], answer: 0,
  why: "The Exponential is the **only** continuous distribution with $P(X>a+b\\mid X>b)=P(X>a)$, and that uniqueness is why the Poisson process is as rigid as it is: a constant rate forces exponential gaps and nothing else. A Gamma with shape above one is not memoryless — having waited already moves you along a sum, so the next event becomes more likely, not equally likely." },

{ id: "g3", ref: "f13", topic: "Poisson process",
  q: "Events arrive according to a Poisson process with rate $\\lambda$. What is the distribution of the waiting time between consecutive events?",
  choices: ["Poisson", "Exponential", "Lognormal", "Geometric"], answer: 1,
  why: "Counts are Poisson$(\\lambda t)$ on an interval of length $t$; gaps are Exponential$(\\lambda)$, with mean $1/\\lambda$. The geometric is the discrete analogue — the number of trials until a success — and it is memoryless too, but it lives on the integers, so it cannot describe a continuous waiting time." },

{ id: "g4", ref: "f13", topic: "Poisson process",
  q: "Which of the following is **not** a property of a Poisson process?",
  choices: [
    "Counts in disjoint intervals are independent.",
    "The count in an interval depends only on its length.",
    "The waiting times between events are identical.",
    "The count in an interval of length $t$ is Poisson$(\\lambda t)$.",
  ], answer: 2,
  why: "The waiting times are **identically distributed**, which is not the same as identical. They are random draws from an Exponential$(\\lambda)$, so events are irregularly spaced — clumps and gaps are expected, not evidence against the model. A process with genuinely equal spacing would be deterministic. The other three are independent increments, stationarity, and the Poisson count law." },

{ id: "g5", ref: "f13", topic: "Binomial model",
  q: "In lecture we discussed the binomial model for stock prices, where after $t$ steps the price is $S_t=S_0u^kd^{\\,t-k}$. Which quantity has a binomial distribution?",
  choices: [
    "The ratio $u/d$.",
    "The price $S_t$.",
    "The number of up steps $k$.",
    "The log return over the $t$ steps.",
  ], answer: 2,
  why: "Each step is a Bernoulli trial — up with probability $p$, down otherwise — and $k$ counts the successes over $t$ independent trials, which is the definition of a Binomial$(t,p)$. The price is a *function* of $k$, and an exponential one at that, so it is not itself binomial; the ratio $u/d$ is a fixed constant of the model, not random at all." },

{ id: "g6", ref: "f13", topic: "Poisson distribution",
  q: "For $X\\sim\\text{Poisson}(\\lambda)$, which of the following is true?",
  choices: [
    "$\\E(X)=1/\\Var(X)$.",
    "$\\E(X)=\\Var(X)$.",
    "$\\Var(X)=\\E(X)^2$.",
    "$\\Var(X)=\\E(X)(1-\\E(X))$.",
  ], answer: 1,
  why: "Both equal $\\lambda$. This is the Poisson's most distinctive property and a cheap diagnostic in practice: if a sample of supposed Poisson counts has a variance well clear of its mean, something is wrong with the model or the code. The form $p(1-p)$ belongs to the Bernoulli, and reciprocals belong to the Exponential." },

/* ------------------------------------- Part 7: mean models and Merton */
{ id: "g7", ref: "f14", topic: "Merton model",
  q: "The Merton jump diffusion model is built from which combination?",
  choices: [
    "Two independent Poisson processes with exponential jumps.",
    "An AR(1) process with Student-$t$ errors.",
    "A GARCH volatility process with normally distributed jumps.",
    "A geometric Brownian motion with Poisson jumps of normal size.",
  ], answer: 3,
  why: "Three pieces: a **GBM** for ordinary day-to-day movement, a **Poisson process** for when jumps occur, and a **normal** distribution for jump size on the log scale. Two separate Poisson processes with exponential sizes is the DEJD of Part 11, built specifically to repair Merton's symmetry. The jump part is what supplies the heavy tails a pure GBM cannot produce." },

{ id: "g8", ref: "f14", topic: "Least squares",
  q: "Which of the following is **not** a reason given for preferring least squares to minimizing absolute deviations?",
  choices: [
    "It has a closed-form solution.",
    "The objective is differentiable everywhere.",
    "It is less affected by outliers.",
    "It coincides with maximum likelihood under normal errors.",
  ], answer: 2,
  why: "That one is backwards. Squaring magnifies large residuals, so least squares is **more** sensitive to outliers; L1 is the robust one, and that robustness is its main attraction. The genuine reasons are the closed-form normal equations, differentiability where $|x|$ has a kink at zero, and the equivalence with maximum likelihood when errors are iid normal." },

{ id: "g9", ref: "f14", topic: "Gauss-Markov",
  q: "What does the Gauss-Markov theorem say about the least squares estimator?",
  choices: [
    "It is consistent as the sample size grows.",
    "It is the maximum likelihood estimator, whatever the error distribution.",
    "It is normally distributed in finite samples.",
    "It has minimum variance among linear unbiased estimators.",
  ], answer: 3,
  why: "Least squares is **BLUE** — Best Linear Unbiased Estimator — and the theorem needs only uncorrelated errors of constant variance, not normality. Note how hedged the guarantee is: step outside the class and a **biased** or **nonlinear** estimator can beat it on mean squared error, which is exactly the door ridge regression walks through." },

{ id: "g10", ref: "f14", topic: "Volatility smile", fig: "fig1",
  q: "Which of the following conclusions could be drawn from Figure 1?",
  choices: [
    "The risk-free rate used in the inversion must be wrong.",
    "The lognormal model underlying Black-Scholes understates the chance of large moves.",
    "Implied volatility cannot reliably be computed for options far away from the money.",
    "The options far from the money are mispriced by the market.",
  ], answer: 1,
  why: "Black-Scholes assumes one volatility for the underlying, so every option on it should imply the same number and the curve should be **flat**, as the dashed line is. It is not: options far from the money imply higher volatility, meaning they trade for more than a lognormal model says they are worth. The market is pricing in fatter tails. Calling that a mispricing has it backwards — the model, not the market, is what is failing to be internally consistent." },

{ id: "g11", ref: "f14", topic: "Implied volatility",
  q: "When a jump diffusion model is calibrated to option data, why is implied volatility used as the target rather than price?",
  choices: [
    "It puts contracts of very different value on a comparable scale.",
    "Prices can violate no-arbitrage bounds.",
    "Only implied volatility is predicted by the model.",
    "Implied volatility is observed directly and price is not.",
  ], answer: 0,
  why: "Across strikes and maturities, option prices differ by orders of magnitude — a deep out-of-the-money contract is worth pennies while an in-the-money one is worth dollars — so a sum of squared *price* errors would be dominated by a handful of expensive contracts and would ignore the wings, which is where the model is being tested. Implied volatility is a common scale. Note that the **price** is what the market quotes; implied volatility is backed out of it." },

{ id: "g12", ref: "f14", topic: "Weighted least squares",
  q: "Weighted least squares is called for when which assumption fails?",
  choices: [
    "Independence of the errors.",
    "Constant error variance.",
    "Normality of the errors.",
    "Linearity of the mean.",
  ], answer: 1,
  why: "Unequal error variances — heteroskedasticity — are the motivation. Observations measured precisely carry more information, so they should count for more, and the weight on each is **inversely proportional to its variance**. Correlated errors call for a different repair entirely, and non-normal errors change which likelihood you maximize rather than how you weight." },

/* -------------------------------------------- Part 8: maximum likelihood */
{ id: "g13", ref: "f15", topic: "Likelihood",
  q: "The likelihood function is best described as which of the following?",
  choices: [
    "The average density over all parameter values.",
    "The probability that the parameter takes a given value.",
    "The joint density of the data, viewed as a function of the parameter.",
    "The joint density of the data, viewed as a function of the data.",
  ], answer: 2,
  why: "The likelihood and the joint density are the same formula with the roles of the arguments **swapped**: as a density you fix the parameter and vary the data, as a likelihood you fix the data — you have already seen it — and vary the parameter. It is not a probability statement about the parameter, because the parameter is a fixed unknown here, not a random variable. That would require a prior." },

{ id: "g14", ref: "f15", topic: "Log-likelihood",
  q: "Why is the log-likelihood maximized instead of the likelihood?",
  choices: [
    "It turns a product into a sum and avoids underflow.",
    "It guarantees the maximum is unique.",
    "It has a different maximizer that is more efficient.",
    "It removes the bias in the estimator.",
  ], answer: 0,
  why: "Independent observations have their densities multiplied, and a product of thousands of small densities underflows to zero in floating point while its log does not; a sum is also far easier to differentiate. Because the logarithm is strictly increasing, the **maximizer is unchanged** — which is the whole point. Nothing about taking logs fixes bias or forces uniqueness." },

{ id: "g15", ref: "f15", topic: "Least squares and MLE",
  q: "Least squares is identical to maximum likelihood under which assumption on the errors?",
  choices: [
    "Uncorrelated with the predictors.",
    "Mean zero and finite variance.",
    "iid normal.",
    "iid from any symmetric distribution.",
  ], answer: 2,
  why: "With iid normal errors the log-likelihood contains the residual sum of squares inside a negative multiplier plus terms free of the coefficients, so maximizing one and minimizing the other are the same operation. Symmetry alone is not enough: with iid Laplace errors, maximum likelihood gives you **L1** regression instead, since a Laplace density has $|x|$ in the exponent." },

{ id: "g16", ref: "f15", topic: "Reading output",
  q: "You fit two models to the same return series and obtain the following:\n\n```\nModel 1:  Normal innovations\n  Log-Likelihood      -3982.99\n  No. Parameters             3\n  AIC                     7971.98\n\nModel 2:  Skewed-t innovations\n  Log-Likelihood      -3980.38\n  No. Parameters             4\n  AIC                     7968.76\n```\n\nWhich model does AIC select, and why?",
  choices: [
    "Neither, because the models are not nested.",
    "Model 1, because it has fewer parameters.",
    "Model 1, because its log-likelihood is the less negative of the two values.",
    "Model 2, because the gain in fit outweighs the cost of the extra parameter.",
  ], answer: 3,
  why: "AIC is $-2\\log L+2k$, so **lower is better** and $7968.76<7971.98$. An extra parameter costs 2 on this scale, which is paid for by any log-likelihood gain above 1; here the gain is $2.61$. Note Model 1's log-likelihood is the **more** negative of the two, so that reading is wrong as well as irrelevant, and AIC does not require nesting." },

{ id: "g17", ref: "f15", topic: "Method vs model",
  q: "In lecture it was emphasised that maximum likelihood is a method while GARCH is a model. What does this distinction mean?",
  choices: [
    "Maximum likelihood applies only to GARCH models.",
    "The model says where the data came from; the method estimates its parameters.",
    "GARCH parameters cannot be estimated by any method other than maximum likelihood.",
    "The method requires no distributional assumption.",
  ], answer: 1,
  why: "They answer different questions. The **model** specifies the distribution, which is what lets a likelihood be written down in the first place. Maximum likelihood is a general recipe for turning any such specification into estimates, and it applies equally to a linear regression, a $t$ distribution or a jump diffusion. Far from needing no assumptions, it needs the distribution in order to exist at all." },

/* --------------------------------------- Part 9: properties of the MLE */
{ id: "g18", ref: "f16", topic: "Curvature", fig: "fig2",
  q: "Figure 2 shows the log-likelihood for $\\lambda$ from two samples, both peaking at the same value. What follows?",
  choices: [
    "Sample B gives the more precise estimate.",
    "The two estimates are equally precise, since the peaks coincide.",
    "Sample B indicates the model is misspecified.",
    "Sample A gives the more precise estimate.",
  ], answer: 3,
  why: "**Curvature is information.** Sample A's log-likelihood falls away steeply on either side of the peak, so values even slightly off explain the data much worse — $\\lambda$ is pinned down. Sample B is nearly flat on top, so a wide range of values fit almost as well. Identical estimates, very different standard errors, and curvature is the only thing distinguishing them. Flatness usually means a small sample, not a wrong model." },

{ id: "g19", ref: "f16", topic: "Hessian",
  q: "After a numerical maximization, what is the Hessian used to obtain?",
  choices: [
    "The number of parameters to retain.",
    "The estimated covariance matrix of the parameters.",
    "Confirmation that the maximum found is the global one.",
    "The bias of the estimator.",
  ], answer: 1,
  why: "The Hessian holds the second derivatives of the log-likelihood at the optimum. Negate it and invert it and you have the estimated covariance matrix: square roots of the diagonal are the standard errors, and the off-diagonal entries give the correlations between estimates. Nothing about it distinguishes a local from a global maximum, since curvature is a purely **local** property." },

{ id: "g20", ref: "f16", topic: "Fisher information",
  q: "The Fisher information is defined as which of the following?",
  choices: [
    "The number of observations in the sample.",
    "The log-likelihood at its maximum.",
    "The expected value of the score at the true parameter value.",
    "The negative expected second derivative of the log-likelihood.",
  ], answer: 3,
  why: "Information is **expected curvature**, and its inverse is both the asymptotic variance of the MLE and the Cramér-Rao bound — which is why sharper curvature means a more precise estimate. The expected score is zero at the true parameter; that is the identity the whole theory is built on, but it is not the information." },

{ id: "g21", ref: "f16", topic: "Cramer-Rao",
  q: "What does the Cramér-Rao lower bound place a limit on?",
  choices: [
    "The variance of any unbiased estimator.",
    "The number of parameters that can be estimated.",
    "The mean squared error of the MLE.",
    "The bias of any estimator.",
  ], answer: 0,
  why: "It sets a floor on the variance of any **unbiased** estimator, equal to the inverse Fisher information, and the MLE reaches that floor as $n\\to\\infty$ — which is what asymptotic efficiency means and the main reason maximum likelihood is the default. Both hedges matter: a **biased** estimator can have smaller mean squared error than the bound, which is why the claim about the MLE's mean squared error does not hold." },

{ id: "g22", ref: "f16", topic: "Invariance",
  q: "The MLE of $\\sigma^2$ is 9. What is the MLE of $\\sigma$?",
  choices: ["81", "It requires a new maximization.", "3", "9"], answer: 2,
  why: "**Invariance**: if $\\hat\\theta$ maximizes the likelihood then $g(\\hat\\theta)$ is the MLE of $g(\\theta)$, for any $g$, so the answer is $\\sqrt{9}=3$ with no further work. What does *not* carry over is unbiasedness — even when $\\hat\\sigma^2$ is unbiased for $\\sigma^2$, its square root is biased for $\\sigma$, because the square root is nonlinear." },

{ id: "g23", ref: "f16", topic: "Delta Method",
  q: "What is the Delta Method used for?",
  choices: [
    "Choosing between two candidate models.",
    "Finding the maximum of a likelihood numerically when no closed form exists.",
    "Obtaining the standard error of a function of estimated parameters.",
    "Testing whether a parameter equals zero.",
  ], answer: 2,
  why: "Invariance gives you the point estimate of $g(\\theta)$ for free, but says nothing about its uncertainty, because a nonlinear $g$ stretches the parameter space unevenly. The Delta Method supplies the missing piece by **linearizing** $g$ at the estimate: with gradient $G$ and covariance $\\Sigma$, the variance is approximately $G\\Sigma G^{\\mathsf T}$." },

{ id: "g24", ref: "f16", topic: "VaR and CVaR",
  q: "What does CVaR report that VaR does not?",
  choices: [
    "The largest loss the model permits.",
    "The confidence level at which the estimate remains valid.",
    "The probability of a loss occurring.",
    "The average loss once the threshold is breached.",
  ], answer: 3,
  why: "VaR is a **quantile** — it tells you where the threshold sits and then goes silent, so two portfolios with identical VaR can behave completely differently beyond it. CVaR, or expected shortfall, averages over that region and so responds to the shape of the tail. It is larger in magnitude than VaR, never smaller, and it is a loss, not a probability." },

/* ------------------------------------------- Part 10: model selection */
{ id: "g25", ref: "f17", topic: "Heavy tails", fig: "fig3",
  q: "Which conclusion could be drawn from Figure 3?",
  choices: [
    "Both tails of the returns are heavier than the fitted normal, the left more so.",
    "No conclusion is possible without a formal test.",
    "The normal distribution fits the returns well.",
    "The returns have lighter tails than the fitted normal at both ends of the range.",
  ], answer: 0,
  why: "The logarithmic vertical axis is the point of the figure: on a linear axis both curves are squashed against zero out in the tails and you could not separate them. On the log axis the observed density sits **above** the fitted normal at both ends, and further above on the left — more probability of large moves than the normal allows, and more of it on the downside. That is heavy tails plus negative skew, which is why a skewed $t$ gets fitted in this Part." },

{ id: "g26", ref: "f17", topic: "AIC",
  q: "Which of the following affects a model's AIC?",
  choices: [
    "The maximized log-likelihood.",
    "The number of estimated parameters.",
    "The data the model was fitted to.",
    "All of the above.",
  ], answer: 3,
  why: "$\\text{AIC}=-2\\log L+2k$ depends on the fit and on the parameter count explicitly, and on the data implicitly — $\\log L$ is evaluated on it. The third point is the one that gets forgotten and it is a real restriction: AIC values are **only** comparable between models fitted to the same observations, so dropping rows for one model and not another makes the comparison meaningless." },

{ id: "g27", ref: "f17", topic: "Nested models",
  q: "One model is nested within another when which of the following holds?",
  choices: [
    "The smaller is a special case of the larger under a parameter restriction.",
    "The smaller of the two has the higher log-likelihood.",
    "They are estimated with the same number of parameters.",
    "The two are fitted to the same data by the same estimation method.",
  ], answer: 0,
  why: "Nesting means the simpler model sits **inside** the richer one as a restriction — the normal is a $t$ with infinite degrees of freedom; a GARCH(1,1) with $\\alpha=\\beta=0$ is constant variance. It matters because the restricted values remain available to the larger model, so the larger fit can never be worse. That is precisely why a raw likelihood comparison between nested models tells you nothing without a penalty." },

{ id: "g28", ref: "f17", topic: "AIC and BIC",
  q: "How does BIC differ from AIC?",
  choices: [
    "It uses the residual sum of squares instead of the likelihood.",
    "It charges $\\log n$ per parameter instead of 2.",
    "It applies only to nested models.",
    "It is computed on a holdout sample.",
  ], answer: 1,
  why: "Both take $-2$ times the maximized log-likelihood and add a per-parameter charge; the charge is the only difference. Since $\\log n$ exceeds 2 for any $n$ beyond 7, BIC charges more and so prefers **more parsimonious** models as the sample grows. With years of daily returns $\\log n$ is around 8, so the two criteria can easily disagree — and when they do, BIC is the stricter." },

{ id: "g29", ref: "f17", topic: "Skewness",
  q: "Which distribution discussed in this Part can capture asymmetry between the two tails?",
  choices: ["The nonstandard $t$", "The normal", "The generalized error distribution", "The skewed $t$"], answer: 3,
  why: "Returns are left skewed: large moves down are bigger and more frequent than large moves up. The GED and the nonstandard $t$ both produce heavy tails, but both are **symmetric**, so they force the two tails to match. Only the skewed $t$ adds the parameter that lets them differ — and that extra parameter is what the AIC comparison has to justify." },

/* -------------------------------------------------- Part 11: the DEJD */
{ id: "g30", ref: "f18", topic: "Merton's limitation",
  q: "What limitation of the Merton model motivates the DEJD?",
  choices: [
    "Its jump sizes are symmetric about zero.",
    "Its jump times are not independent.",
    "Its diffusion component is not normal.",
    "Its jumps cannot produce heavy tails.",
  ], answer: 0,
  why: "Merton has a single Poisson process and a jump size distribution **symmetric** around zero on the log scale. Heavy tails it manages without difficulty — the jumps supply them. What it cannot say is that crashes are both larger and more frequent than rallies, and splitting the jumps in two, each direction with its own rate and size distribution, is exactly what the DEJD adds." },

{ id: "g31", ref: "f18", topic: "Combining Poisson processes",
  q: "Two independent Poisson processes with rates $\\lambda_1$ and $\\lambda_2$ are superimposed. The result is which of the following?",
  choices: [
    "Poisson with rate $\\lambda_1+\\lambda_2$.",
    "Not a Poisson process.",
    "Poisson with rate $\\max(\\lambda_1,\\lambda_2)$.",
    "Poisson with rate $\\lambda_1\\lambda_2$.",
  ], answer: 0,
  why: "Let $T=\\min(T_1,T_2)$ be the wait to the next event of either kind. Then $P(T>t)=e^{-\\lambda_1t}e^{-\\lambda_2t}=e^{-(\\lambda_1+\\lambda_2)t}$, so the gaps are Exponential with the rates **added**. This is the result that makes Kou's single-process formulation and Ramezani-Zeng's two-process formulation the same model, with $\\lambda=\\lambda_u+\\lambda_d$." },

{ id: "g32", ref: "f18", topic: "Pareto and Beta",
  q: "In the Ramezani-Zeng formulation, why is the Pareto used for up jumps and the Beta for down jumps?",
  choices: [
    "The Beta is bounded, which aids numerical stability.",
    "Their supports lie above and below 1 respectively.",
    "The log of a Pareto is normal.",
    "The Pareto has heavier tails than the Beta.",
  ], answer: 1,
  why: "These jumps **multiply** the current price, so the direction is decided entirely by whether the multiplier exceeds 1. The Pareto's support starts at 1, so multiplying raises the price; the Beta's lies in $(0,1)$, so multiplying lowers it and can never drive the price negative. For the record, the log of a Pareto is **Exponential**, which is exactly what links this price-scale formulation to Kou's log-scale one." },

{ id: "g33", ref: "f18", topic: "Path-dependent options", fig: "fig4",
  q: "Figure 4 shows two simulated paths. Which statement about Series A is correct?",
  choices: [
    "Its volatility is time-varying while Series B's is constant.",
    "It is mean-reverting while Series B is not.",
    "It contains discontinuities that a pure diffusion cannot produce.",
    "It is non-stationary while Series B is stationary.",
  ], answer: 2,
  why: "Both paths were driven by the **same** diffusion shocks, so everything they share is the GBM; the only difference is the jump component added to Series A, which shows up as abrupt breaks where the two lines separate. A pure diffusion path is continuous, though nowhere differentiable, so it cannot do that. Time-varying volatility with a continuous path would be **GARCH** — a different repair to the same deficiency." },
];
