/* StatLab — the REAL Midterm One from last year, sat 30 September 2025.
 *
 * Unlike the three practice papers, nothing here is invented: the
 * questions, the choices and their order are transcribed verbatim from
 * the exam PDF, and the answer key is the professor's own — the circled
 * grid on the final page of the "WithAnswers" version.
 *
 * Consequences of keeping it verbatim:
 *   - six questions have three choices rather than four (10, 18, 22, 27,
 *     31, 32). That is how the paper was written;
 *   - the key is a/b/c/d = 9/11/8/5, not the balanced 9/8/8/8 the
 *     practice papers use;
 *   - choice lengths are left exactly as the professor wrote them and are
 *     excluded from the length audit that balances the other banks.
 *
 * One word differs from the printed paper: question 10 reads "simuldated"
 * in the original, corrected to "simulated" here. Nothing else is changed.
 *
 * `why` is mine — the explanations are not from the exam.
 * `ref` points at the module that covers the idea.
 */

import { ar1, normals } from "@/lib/anim";

export const EXAM_2025_META = {
  title: "Real Midterm One — 2025",
  subtitle: "Statistical Methods in Finance · 30 September 2025",
  minutes: 75,
  pointsPer: 3,
  verbatim: true,
  rules: [
    "This is the actual paper sat last year, transcribed question for question. The answer key is the professor's own.",
    "You will have 75 minutes to complete this exam. No matter when you start the exam, you have to stop at 10:50 AM.",
    "Notes, books and calculators/laptops/phones are not allowed.",
    "The abbreviation \"iid\" stands for \"independent and identically distributed.\"",
    "Each question is worth three points.",
    "Each question has exactly one correct response.",
    "Six questions offer three choices rather than four — that is how the paper was printed.",
  ],
};

/* ---------------------------------------------------------------- figures
   Rebuilt from the plots in the exam PDF: same shapes, same conclusions,
   drawn from seeded data so the picture is stable between reloads. */

const pts = (vals, { x0 = 44, x1 = 392, lo, hi, y0 = 24, y1 = 210 }) =>
  vals.map((v, i) => {
    const x = x0 + (i / (vals.length - 1)) * (x1 - x0);
    const y = y1 - ((v - lo) / (hi - lo)) * (y1 - y0);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

/* Figure 3: sample quantiles saturate near ±3 while the reference line
   keeps climbing — the signature of tails LIGHTER than the normal. */
const QQ = [];
for (let i = 0; i < 64; i++) {
  const t = -3.15 + (6.3 * i) / 63;
  const s = 3.05 * Math.tanh(t / 1.42);
  QQ.push([
    (44 + ((t + 3.4) / 6.8) * 348).toFixed(1),
    (210 - ((s + 5.4) / 10.8) * 186).toFixed(1),
  ]);
}

/* Figure 4: stationary, flat level, no trend and no dramatic clustering. */
const SERIES4 = ar1({ phi: 0.36, mu: 0.32, sd: 1.02, n: 200, seed: 5 });

/* Figure 5: rolling realized volatility. The observed series makes long,
   sustained excursions; the simulated one from the lognormal pricing
   model just jitters around its own level. */
const OBS = (() => {
  const n = normals(31);
  const out = [];
  let x = 0;
  for (let i = 0; i < 260; i++) {
    x = 0.975 * x + 0.055 * n();                   // slow, persistent swings
    const covid = 0.52 * Math.exp(-((i - 6) ** 2) / 90); // the early-2020 spike
    out.push(0.53 + x + covid);
  }
  return out;
})();
const SIM = (() => {
  const n = normals(77);
  const out = [];
  let x = 0;
  for (let i = 0; i < 260; i++) { x = 0.86 * x + 0.021 * n(); out.push(0.55 + x); }
  return out;
})();

export const EXAM_2025_FIGURES = {
  fig1: {
    caption: "Figure 1: Python code and output analyzing trading volume for K.",
    code: `import yfinance as yf

Kdat = yf.Ticker("K").history(start="2015-01-01",end="2024-12-31")

fig, ax = plt.subplots(figsize=[5,4])
Kdat['Log Volume'] = np.log10(Kdat['Volume'])

sns.kdeplot(Kdat['Log Volume'], bw_method='silverman', color='red')

x = np.linspace(min(Kdat['Log Volume']), max(Kdat['Log Volume']), 100)
y = sc.stats.norm.pdf(x, np.mean(Kdat['Log Volume']),
                         np.std(Kdat['Log Volume']))

ax.plot(x, y, color='blue', linestyle='--')
plt.yscale('log')
ax.set_xlabel("Log (base 10) Trading Volume")
ax.set_ylabel("Density")
plt.show()`,
    viewBox: "0 0 420 240",
    paths: [
      /* fitted normal (blue dashed) — a parabola on a log axis, so it
         dives away on both sides */
      { d: "M62,196 Q96,120 130,64 T196,32 Q216,30 234,40 T290,110 Q318,160 344,208",
        stroke: "var(--blue-bright)", dash: "6 4" },
      /* the KDE (red) — tracks the normal on the left, then sits far above
         it across the whole right-hand side */
      { d: "M62,190 Q96,122 130,66 T196,34 Q216,32 234,42 T282,86 Q300,104 312,96 Q322,120 330,150 Q336,124 344,104",
        stroke: "var(--destructive)" },
    ],
    xlabel: "Log (base 10) Trading Volume", ylabel: "Density (log scale)",
  },

  fig2: {
    caption: "Figure 2: An ACF plot.",
    viewBox: "0 0 420 240",
    acf: [1.0, -0.66, 0.45, -0.28, 0.15, -0.15, 0.09, -0.17, 0.10, -0.07,
          0.03, 0.03, -0.09, 0.04, 0.01, 0.17, -0.13, -0.16, 0.08, -0.02, -0.02],
    xlabel: "Lag", ylabel: "Correlation",
  },

  fig3: {
    caption: "Figure 3: Normal probability plot of data.",
    viewBox: "0 0 420 240",
    line: { x1: 44, y1: 210, x2: 392, y2: 24 },
    dots: QQ,
    xlabel: "Theoretical Quantiles", ylabel: "Sample Quantiles",
  },

  fig4: {
    caption: "Figure 4: An example time series.",
    viewBox: "0 0 420 240",
    series: [{ points: pts(SERIES4, { lo: -3.2, hi: 4.4 }), stroke: "var(--blue-bright)" }],
    xlabel: "Time", ylabel: "Value",
  },

  fig5: {
    caption: "Figure 5: Realized volatility from a rolling window (size 50), for real and simulated data.",
    viewBox: "0 0 420 240",
    /* the observed swings run well below the simulated band, so the range
       has to leave room for them or the line is clipped by the axis */
    series: [
      { points: pts(OBS, { lo: 0.10, hi: 1.18 }), stroke: "var(--blue-bright)" },
      { points: pts(SIM, { lo: 0.10, hi: 1.18 }), stroke: "var(--destructive)", dash: "5 3" },
    ],
    legend: [
      { label: "Observed Series", stroke: "var(--blue-bright)" },
      { label: "Simulated Series", stroke: "var(--destructive)", dash: "5 3" },
    ],
    xlabel: "2020 — 2025", ylabel: "Realized volatility",
  },
};

/* ---------------------------------------------------------------- paper */

export const EXAM_2025 = [
{ id: "r1", ref: "f5", topic: "KDE vs normal", fig: "fig1",
  q: "Which of the following conclusions could be drawn from Figure 1?",
  choices: [
    "The upper tail of the distribution of log daily trading volume is heavier than what is modeled by the best-fitting normal distribution.",
    "The lower tail of the distribution of log daily trading volume is heavier than what is modeled by the best-fitting normal distribution.",
    "The normal distribution is a good fit to the distribution of the log daily trading volume.",
    "It is difficult to draw any conclusions from this plot regarding the adequacy of the normal distribution to fit the log daily trading volume.",
  ], answer: 0,
  why: "The `plt.yscale('log')` line is the whole point of the figure: on a linear axis both curves are squashed against zero in the tails and you could not tell them apart. On the log axis the red KDE sits **well above** the blue dashed normal across the entire right-hand side, while the two agree on the left. More density than the normal predicts, far out in the upper tail, is exactly what a heavier upper tail means." },

{ id: "r2", ref: "f7", topic: "Stationarity",
  q: "In general, for a time series $\\{X_t\\}$, the autocovariance function $\\gamma_X(r,s)$ returns the covariance between observations $X_r$ and $X_s$. What is necessarily true regarding a stationary time series?",
  choices: [
    "$\\gamma_X(r,s)=0$ for $r\\ne s$.",
    "$\\gamma_X(r,s)$ only depends on $|r-s|$.",
    "$\\gamma_X(r,s)$ is nonnegative for all $r$ and $s$.",
    "$\\gamma_X(r,s)$ decreases as $|r-s|$ increases.",
  ], answer: 1,
  why: "Weak stationarity has two requirements: a constant mean, and an autocovariance that depends on the two times **only through the gap between them**. So $\\gamma_X(3,8)$ and $\\gamma_X(100,105)$ must be equal — both gaps are 5. Zero autocovariance at every non-zero lag would be white noise, a special case; and nothing forces the autocovariance to be positive or to shrink monotonically — an AR(1) with $\\phi<0$ alternates in sign, as Figure 2 in this very exam shows." },

{ id: "r3", ref: "f8", topic: "ADF test",
  q: "You run the `adfuller()` function on a time series and receive the following output:\n\n```\nADF Statistic: -3.452\np-value: 0.011\nNumber of lags used: 25\nNumber of observations used: 120\nCritical Values:\n   1%: -3.500\n   5%: -2.890\n   10%: -2.580\nIC Best: 245.67\n```\n\nBased on this output, what can you conclude about the stationarity of the time series? (Use a 5% cutoff for determining statistical significance.)",
  choices: [
    "There is strong evidence that the series is stationary.",
    "There is strong evidence that the series is not stationary.",
    "We failed to find evidence that the series is stationary.",
    "We failed to find evidence that the series is not stationary.",
  ], answer: 0,
  why: "The ADF null hypothesis is that a **unit root is present** — that the series is *not* stationary. Here $p=0.011<0.05$, so you reject the null, and rejecting gives you evidence *for the alternative*: stationarity. The statistic $-3.452$ tells the same story, sitting below the 5% critical value $-2.890$ (more negative is stronger evidence). The two \"failed to find evidence\" phrasings are what you would say if the p-value had been large — a non-rejection never proves the null." },

{ id: "r4", ref: "f10", topic: "APARCH",
  q: "Which of the following has the ability to model asymmetric volatility effects?",
  choices: ["ARIMA", "GARCH", "APARCH", "VAR"], answer: 2,
  why: "Standard GARCH drives the conditional variance with $X_{t-i}^2$, and squaring throws away the sign of the return — so a $-3\\%$ day and a $+3\\%$ day push volatility up by identical amounts. That makes plain GARCH structurally incapable of the leverage effect. **APARCH** (Asymmetric Power ARCH) adds a term that responds differently to negative and positive shocks, which is the \"A\". ARIMA and VAR model the conditional *mean*, not the variance at all." },

{ id: "r5", ref: "f5", topic: "Bandwidth",
  q: "What does the bandwidth parameter control in a kernel density estimator?",
  choices: [
    "The number of data points used.",
    "The number of bins used in the estimator.",
    "The smoothness of the resulting density estimate.",
    "The dimensionality of the data.",
  ], answer: 2,
  why: "The bandwidth $h$ sets how wide each kernel bump is, and therefore how much neighbouring observations are blended together. Large $h$ gives a smooth curve that can smear away real features (high bias); small $h$ gives a spiky curve that chases individual observations (high variance). Every data point is always used — bumps are placed at *all* of them — and bins belong to histograms, which is the estimator KDE is meant to replace." },

{ id: "r6", ref: "f11", topic: "Black-Scholes",
  q: "In lecture we discussed the lognormal pricing model and its properties. This model is one of the key assumptions made by which of the following?",
  choices: [
    "The leverage effect.",
    "The GARCH model.",
    "The APARCH model.",
    "The Black-Scholes theory for option pricing.",
  ], answer: 3,
  why: "Black-Scholes needs a distribution for the terminal price $P_t$ in order to evaluate $\\E\\big((P_t-K)^+\\big)$, and the lognormal pricing model is what supplies it — which is why the formula comes out in terms of $\\Phi$'s. The leverage effect is an empirical *observation* about returns, not a model, and the GARCH family models conditional variance without committing to a distribution for the price level." },

{ id: "r7", ref: "f1", topic: "Options",
  q: "Which of the following is a key characteristic of European call options?",
  choices: [
    "They can be exercised at any time before expiration.",
    "They can only be exercised at expiration.",
    "The strike price is larger than the current (spot) price for the underlying asset.",
    "The volatility is assumed to vary over time.",
  ], answer: 1,
  why: "European vs American is a statement about **when** you may exercise, not about geography. The European contract fixes exercise at the expiration date alone; the American one lets you exercise at any point up to it, which is an extra right and so can never be worth less. Removing that choice is precisely what makes the European case tractable enough for Black-Scholes to produce a closed-form price." },

{ id: "r8", ref: "f3", topic: "Stochastic processes",
  q: "What is a primary reason for modeling asset prices with a stochastic process?",
  choices: [
    "Asset prices are stationary.",
    "Asset prices follow a predictable pattern.",
    "Asset prices exhibit behavior that is difficult to predict, but aspects of their distribution are understood.",
    "Asset prices are always increasing.",
  ], answer: 2,
  why: "This is the premise the whole course rests on. Nobody claims to forecast tomorrow's price; what *is* stable enough to model is the **distribution** of where the price might land — its spread, the shape of its tails, how its variance evolves. A stochastic process is exactly the object that describes randomness with known distributional structure. The other three are all false of real prices: they trend, they are not predictable, and they certainly do not only rise." },

{ id: "r9", ref: "f5", topic: "Bandwidth",
  q: "What happens if the bandwidth in kernel density estimate is set too small?",
  choices: [
    "The estimate becomes overly smooth.",
    "The variance of the estimator will be too large.",
    "The bias of the estimator will be too large.",
    "The data are ignored.",
  ], answer: 1,
  why: "Narrow kernels make the estimate track **this particular sample**, accidents included — draw a fresh sample and the curve changes completely. That instability across samples *is* variance. It is the mirror image of too-large a bandwidth, which over-smooths and so carries too much bias. The bias-variance tradeoff is the reason bandwidth selection has rules like Silverman's rather than an obvious best answer." },

{ id: "r10", ref: "f8", topic: "ACF of AR(1)", fig: "fig2",
  q: "The ACF plot shown in Figure 2 was generated from data simulated from an AR(1) model. Recall that the AR(1) model is of the form\n\n$$X_t=\\mu+\\phi(X_{t-1}-\\mu)+\\epsilon_t.$$\n\nWhich of the following is true?",
  choices: [
    "The value of $\\phi$ used in this case must be negative.",
    "The value of $\\mu$ must be negative.",
    "The value of $|\\phi|$ must be larger than one.",
  ], answer: 0,
  why: "For an AR(1) the autocorrelation at lag $h$ is $\\phi^h$. The plot **alternates**: about $-0.66$ at lag 1, $+0.45$ at lag 2, $-0.28$ at lag 3. Only a negative $\\phi$ produces flipping signs, since odd powers stay negative and even powers turn positive — here $\\phi\\approx-0.66$, and indeed $(-0.66)^2\\approx0.44$. The ACF says nothing at all about $\\mu$, which is a level; and $|\\phi|>1$ would be non-stationary, with autocorrelations that grow rather than decay." },

{ id: "r11", ref: "f6", topic: "Normality tests",
  q: "Which of the following is **not** a tool used for assessing normality?",
  choices: [
    "The Ljung-Box test.",
    "The Shapiro-Wilk test.",
    "The Jarque-Bera test.",
    "A normal probability plot.",
  ], answer: 0,
  why: "Ljung-Box is a **portmanteau test for autocorrelation**: its null is that the first $H$ autocorrelations are all zero. It is about dependence across time, not about the shape of a distribution, and you can run it on a series that is perfectly normal or wildly non-normal without it noticing either way. The other three are the standard normality toolkit — two formal tests and one graphical check." },

{ id: "r12", ref: "f6", topic: "Jarque-Bera",
  q: "What is the null hypothesis in the Jarque-Bera test?",
  choices: [
    "The sample data were not drawn from a normal distribution.",
    "The sample data were drawn from a uniform distribution.",
    "The sample data were drawn from a normal distribution.",
    "The sample data were drawn from a distribution symmetric around its mean.",
  ], answer: 2,
  why: "Normality is the null, as it is for Shapiro-Wilk. This is why the tests can only ever deliver **evidence against** normality: a small p-value says the data are implausible under normality, while a large one leaves you having failed to reject, not having proved normality true. Note that symmetry alone is not the null — the statistic checks kurtosis as well as skewness, so a symmetric but heavy-tailed $t$ distribution is still rejected." },

{ id: "r13", ref: "f2", topic: "Lognormal",
  q: "If a random variable $X$ is normally distributed, then $e^X$ follows which distribution?",
  choices: ["Normal", "Lognormal", "Exponential", "Gamma"], answer: 1,
  why: "This is the definition: $Y$ is lognormal exactly when $\\log Y$ is normal, so exponentiating a normal produces a lognormal. Read the name as \"its **log** is **normal**\", not \"the log of a normal\". The consequences matter for pricing: $e^X$ is strictly positive, which is why prices are modelled this way, and it is right-skewed, which is why its mean $e^{\\mu+\\sigma^2/2}$ sits above its median $e^{\\mu}$." },

{ id: "r14", ref: "f6", topic: "Kurtosis",
  q: "What is true about the kurtosis of a random variable with the normal distribution with mean $\\mu$ and variance $\\sigma^2$?",
  choices: [
    "The kurtosis equals 3 in this case.",
    "The kurtosis equals 0 in this case.",
    "The kurtosis equals $\\sigma^2$ in this case.",
    "The kurtosis is negative in this case.",
  ], answer: 0,
  why: "Kurtosis is $\\E\\big((X-\\mu)^4\\big)/\\sigma^4$, a standardized fourth moment, and for **any** normal it equals 3 regardless of $\\mu$ and $\\sigma^2$ — which is what makes 3 the reference point. That is also why the Jarque-Bera statistic contains $(\\widehat\\gamma_2-3)^2$. The value 0 belongs to *excess* kurtosis, defined as kurtosis minus 3; and since it is an average of fourth powers, kurtosis can never be negative." },

{ id: "r15", ref: "f12", topic: "Leverage effect",
  q: "What is typically associated with increased volatility due to the leverage effect?",
  choices: ["Positive returns", "Negative returns", "Zero returns", "Nonstationarity"], answer: 1,
  why: "The leverage effect is the observed **asymmetry**: volatility rises more after price drops than after equally sized rises. Two explanations are offered — that falling equity raises a firm's debt-to-equity ratio (which is where the name comes from), and the more widely accepted volatility-feedback story, in which rising expected volatility forces risk-averse investors to mark the price down now. Whichever you prefer, the trigger is a **negative** return." },

{ id: "r16", ref: "f9", topic: "Volatility clustering",
  q: "What does the term volatility clustering refer to in the behavior of financial returns?",
  choices: [
    "There is conditional homoskedasticity in the log returns.",
    "The general trend is for volatility to increase over time.",
    "Volatility is higher during times where prices are higher.",
    "There are stretches of time of high volatility, and periods of low volatility.",
  ], answer: 3,
  why: "Clustering is about **magnitude persisting**, not direction and not a trend: turbulent days arrive next to turbulent days and calm next to calm. Conditional homoskedasticity is the exact opposite — constant conditional variance — and is what clustering rules out. Because the pattern is about size regardless of sign, the diagnostic is the ACF of the **squared** returns; the raw returns show nothing." },

{ id: "r17", ref: "f10", topic: "GARCH",
  q: "What model is commonly used to capture volatility clustering?",
  choices: ["AR(1)", "White noise model", "The random walk", "GARCH"], answer: 3,
  why: "GARCH makes today's conditional variance a function of yesterday's squared return and yesterday's variance, so a large shock raises $\\sigma_t^2$, which raises $\\sigma_{t+1}^2$, and the disturbance decays only gradually — clustering, by construction. The alternatives all model the conditional **mean** or assume constant variance: AR(1) is a mean equation, white noise has a fixed variance by definition, and a random walk is non-stationary in level with constant-variance increments." },

{ id: "r18", ref: "f10", topic: "ARCH",
  q: "What does ARCH stand for in the context of time series?",
  choices: [
    "Autoregressive Conditional Heteroscedastic",
    "Average Rate of Change",
    "Annual Return Calculation Heuristic",
  ], answer: 0,
  why: "Each word is doing work. **Autoregressive**: the variance is regressed on its own past. **Conditional**: it is the variance given the history up to $t-1$, not the long-run unconditional variance. **Heteroscedastic**: that variance changes over time, as against homoscedastic, where it is fixed. Together they describe exactly the mechanism that produces volatility clustering." },

{ id: "r19", ref: "f1", topic: "Data quality",
  q: "When obtaining data from yfinance or other similar sources, it is crucial to ensure that prices have been adjusted for which of the following?",
  choices: [
    "Volatility clustering.",
    "Nonstationarity.",
    "Stock splits and dividend payments.",
    "The leverage effect.",
  ], answer: 2,
  why: "Both events move the raw quoted price without the holder gaining or losing anything. A 10-for-1 split divides the price by ten overnight, producing a fake one-day log return of $\\log(0.1)\\approx-2.3$; a dividend knocks the price down by the payout, which went to the shareholder. Unadjusted data therefore contains crashes that never happened. Hence `auto_adjust=True`. The other three are properties of returns you go on to *model* — they are not defects to repair in the download." },

{ id: "r20", ref: "f3", topic: "GBM",
  q: "Let $\\{S(t):t\\ge0\\}$ be a geometric Brownian motion. What is the distribution of $S(10)$?",
  choices: ["Lognormal", "Normal", "Geometric", "Impossible to determine"], answer: 0,
  why: "Geometric Brownian motion is defined as $S(t)=S(0)e^{B(t)}$ with $B(t)$ Brownian motion, so $\\log S(10)=\\log S(0)+B(10)$ is normal — which makes $S(10)$ itself **lognormal**, by the definition in question 13. The \"geometric\" in the name describes how the process is built (exponentiating), not the geometric distribution, which is a discrete counting distribution and has nothing to do with this." },

{ id: "r21", ref: "f3", topic: "GBM",
  q: "Let $\\{S(t):t\\ge0\\}$ be a geometric Brownian motion. What is the distribution of $\\log\\big(S(10)/S(5)\\big)$?",
  choices: ["Lognormal", "Normal", "Geometric", "Impossible to determine"], answer: 1,
  why: "The exponentials cancel: $\\log\\big(S(10)/S(5)\\big)=B(10)-B(5)$, a Brownian **increment**, which is Normal$\\big(\\nu\\cdot5,\\ \\sigma^2\\cdot5\\big)$. Compare with question 20 and the pattern is the whole model in one line — the price level is lognormal, while the log of a price *ratio*, which is what a log return is, comes out normal. That is precisely why log returns are the quantity worth modelling." },

{ id: "r22", ref: "f4", topic: "Log returns",
  q: "The $k$-period log return is defined as\n\n$$r_t(k)=\\log\\left(\\frac{P_t}{P_{t-k}}\\right).$$\n\nHence, there are $k$ individual time periods of equal length that make up this interval of time. We defined $r_t$ to be the one-period log return from time $t-1$ to $t$. What is the relationship between these quantities?",
  choices: [
    "$r_t(k)=\\sum_{i=0}^{k-1}r_{t-i}$",
    "$r_t(k)=\\prod_{i=0}^{k-1}r_{t-i}$",
    "We cannot determine the relationship without further assumptions.",
  ], answer: 0,
  why: "Write $\\log(P_t/P_{t-k})=\\log P_t-\\log P_{t-k}$ and insert every intermediate log price; the sum **telescopes**, leaving the one-period log returns added together. It is an algebraic identity — no independence assumption and no approximation, which is why the third option is wrong. **Simple** returns are the ones that compound multiplicatively, and even they multiply as $(1+R)$ factors rather than as the returns themselves." },

{ id: "r23", ref: "f6", topic: "QQ plots", fig: "fig3",
  q: "Figure 3 shows a normal probability plot constructed from a sample of data. What is an appropriate conclusion to draw from this?",
  choices: [
    "The normal distribution appears to be a decent fit to this sample.",
    "The distribution from which these data were drawn clearly has lighter tails than does the normal distribution.",
    "The distribution from which these data were drawn clearly has heavier tails than does the normal distribution.",
    "It is difficult to draw a conclusion because the sample is being compared with the standard normal distribution instead of the best fitting normal distribution.",
  ], answer: 1,
  why: "Read the ends. On the right the points **flatten off below** the line: where a normal would need a sample quantile near 5, the data stop around 3. On the left they bend **above** it, in the same compressing direction. The most extreme observations are therefore *less* extreme than a normal predicts — lighter tails. Note this is the opposite of the familiar picture for log returns, where the points splay away from the line at both ends. Comparing against the standard normal is not a problem: a change of $\\mu$ or $\\sigma$ only rescales the straight line, it cannot bend the points." },

{ id: "r24", ref: "f5", topic: "Nonparametric estimation",
  q: "The kernel density estimator and a histogram are both a type of which broader statistical method?",
  choices: [
    "A parametric estimator.",
    "A nonparametric estimator.",
    "A Bayesian approach.",
    "A statistical hypothesis test.",
  ], answer: 1,
  why: "Neither one assumes a functional form for the density. A parametric approach says \"this is normal, now estimate $\\mu$ and $\\sigma$\" and is finished in two numbers; the histogram and the KDE instead let the **data** determine the shape, which is what nonparametric means. Both still have a tuning constant — bin width, bandwidth — but tuning constants are not distributional assumptions." },

{ id: "r25", ref: "f11", topic: "Black-Scholes",
  q: "Which of the following affects the value of a European call option as determined by the Black-Scholes equation?",
  choices: [
    "The strike price of the option.",
    "The time to expiration for the option.",
    "The volatility in the price of the option.",
    "All of the above.",
  ], answer: 3,
  why: "All five Black-Scholes inputs move the price: the spot, the strike $K$, the time $t$, the volatility $\\sigma$ and the risk-free rate $r$. A higher strike means a smaller payoff, so the call is worth less; more time and more volatility both widen the distribution of $P_t$, and because the payoff $(P_t-K)^+$ caps losses at zero while leaving the upside open, extra spread is worth *more*, not less. That last one is the answer people find counter-intuitive — risk raising value." },

{ id: "r26", ref: "f7", topic: "Stationarity", fig: "fig4",
  q: "Consider the realization of the time series model $\\{X_t\\}$ shown in Figure 4. Which of the following do you agree with?",
  choices: [
    "The conditional mean $E(X_t|X_{t-1}=x)$ does not depend on $x$.",
    "The process $\\{X_t\\}$ is definitely not stationary.",
    "The unconditional mean $E(X_t)$ is constant, or nearly so.",
    "A mean zero ARCH model appears to be an appropriate choice for this process.",
  ], answer: 2,
  why: "The series wanders around a **flat level** with no drift, no trend and no change of scale from one end to the other — so the unconditional mean looks constant, which is what stationarity requires of it. The other three claim more than the picture supports: you cannot read a conditional mean off a plot (an AR component would be invisible here), \"definitely not stationary\" is contradicted by that flat level, and an ARCH model would need visible volatility clustering, which this series does not show — and its level is not zero either." },

{ id: "r27", ref: "f4", topic: "CLT",
  q: "We observed, using normal probability plots and kernel density estimates, that log monthly returns are closer to normally distributed than are log daily returns. What is an explanation for this?",
  choices: [
    "This follows from the Black-Scholes theory of option pricing.",
    "This is a consequence of the central limit theorem.",
    "This is a direct result of the nonstationarity of equity time series.",
  ], answer: 1,
  why: "By question 22, a monthly log return is the **sum** of roughly 21 daily log returns, and the central limit theorem pushes sums toward normality. Aggregating over a longer horizon therefore buys you a better normal approximation — which is also, read backwards, the explanation for why *daily* returns are so visibly heavy-tailed: 21 terms is far too few to rescue a sum whose summands are neither independent nor identically distributed." },

{ id: "r28", ref: "f10", topic: "ARCH",
  q: "In the ARCH(2) process, the conditional variance is modeled as a function of what?",
  choices: [
    "The squared value of the series at lag 2.",
    "The two immediately previous predicted variances.",
    "The two immediately previous squared values of the series.",
    "External economic indicators.",
  ], answer: 2,
  why: "ARCH($p$) sets $\\sigma_t^2=\\omega+\\alpha_1X_{t-1}^2+\\cdots+\\alpha_pX_{t-p}^2$, so ARCH(2) uses **both** lag 1 and lag 2 — not lag 2 alone. Feeding past *variances* back in is the extra $\\beta_j\\sigma_{t-j}^2$ term that distinguishes GARCH from ARCH, which is what question 31 is about. Nothing external enters: the model is driven entirely by the series' own history." },

{ id: "r29", ref: "f9", topic: "Realized volatility", fig: "fig5",
  q: "Figure 5 reproduces a graph shown in lecture. Here, the realized volatility for equity NVDA was calculated using a rolling window approach (with window size 50). This is shown as the \"Observed Series.\" Also shown is the same rolling window calculation applied to a series generated from the lognormal pricing model. What was a conclusion that we drew from this?",
  choices: [
    "The realized volatility is unrealistically high in early 2020.",
    "The log return series for NVDA must be nonstationary.",
    "The observed series shows a greater amount of volatility clustering than does the simulated series.",
    "There is clear evidence of the leverage effect.",
  ], answer: 2,
  why: "The point of the comparison is that both series were matched on overall variability, yet they behave completely differently over time. The observed line makes **long, sustained excursions** — months up near 0.7, months down near 0.35 — while the simulated line, drawn from a model with a single constant $\\sigma$, just jitters in a narrow band around its own level. That gap is the evidence that the lognormal pricing model misses volatility clustering, and is the motivation for ARCH and GARCH. Early 2020 was the pandemic, genuinely volatile; and the leverage effect concerns the *sign* of returns, which this plot does not show." },

{ id: "r30", ref: "f2", topic: "Lognormal pricing model",
  q: "Under the lognormal pricing model, what is the distribution of the $k$-period log returns?",
  choices: ["Lognormal", "Normal", "Geometric", "Impossible to determine"], answer: 1,
  why: "Same structure as question 21. Prices are lognormal, so log prices are normal, and a $k$-period log return is a difference of two log prices — normal again. You can also get there from question 22: it is a sum of $k$ normal one-period log returns, and sums of normals stay normal, with the variance adding to give the $\\sigma\\sqrt{k}$ scaling." },

{ id: "r31", ref: "f10", topic: "GARCH",
  q: "GARCH($p,q$) models the conditional variance as follows:\n\n$$\\sigma_t^2=\\omega+\\sum_{i=1}^{p}\\alpha_iX_{t-i}^2+\\sum_{j=1}^{q}\\beta_j\\sigma_{t-j}^2.$$\n\nThe ARCH($p$) model is equivalent to this expression, but with $q=0$. What is the motivation for the inclusion of this final term in the GARCH model?",
  choices: [
    "The additional term can model the leverage effect.",
    "The additional term makes the model nonstationary.",
    "The additional term will be able to model a greater extent of volatility clustering.",
  ], answer: 2,
  why: "$\\sigma_{t-1}^2$ already summarizes the entire history of the series, so recycling it carries information forward cheaply: a GARCH(1,1) reproduces persistence that would take an ARCH model many $\\alpha$ lags to match. It is also the *cleaner* input, since $X_{t-i}^2$ carries the extra randomness of $\\epsilon_{t-i}$ and is only a noisy proxy for volatility. The term cannot produce the leverage effect — everything here is squared, so signs are gone — and far from causing non-stationarity, it enters the stationarity condition $\\sum(\\alpha_i+\\beta_j)<1$." },

{ id: "r32", ref: "f12", topic: "Market indices",
  q: "What is the role of stock market indices such as the S&P 500 Index?",
  choices: [
    "They serve as a summary measure of the overall performance of the stock market.",
    "They help regulate trading activity and enforce compliance with financial laws.",
    "It is often the case that movements in a stock index are predictive of future moves in individual component stocks.",
  ], answer: 0,
  why: "An index aggregates many stocks into one number so that \"how did the market do today\" has an answer — the S&P 500 by market capitalization, the DJIA by share price. It is a **measurement**, with no regulatory function; that belongs to the SEC. And it is not a forecasting device: an index moving is contemporaneous with its components moving, since it is computed *from* them, which is the reverse of prediction." },

{ id: "r33", ref: "f11", topic: "Implied volatility",
  q: "How is implied volatility calculated?",
  choices: [
    "By averaging historical squared daily returns over a fixed time window, and multiplying by 252.",
    "By solving for the volatility that equates the Black-Scholes option price to the market price.",
    "By computing the standard deviation of option prices across different strike prices.",
    "By fitting a GARCH model to past returns.",
  ], answer: 1,
  why: "Black-Scholes maps a volatility to a price, and that map is monotonic — so it can be run **backwards**: take the price the option actually trades at and solve for the unique $\\sigma$ that reproduces it. That makes implied volatility **forward-looking**, the market's own view of variability to come. The first and last choices are genuine volatility estimates but backward-looking ones, computed from past returns; the third is not a volatility at all." },
];
