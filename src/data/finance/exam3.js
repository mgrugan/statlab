/* StatLab — Practice Midterm Three (NEW questions)
 *
 * Same format as Practice Midterms One and Two:
 *   33 multiple-choice questions · 3 points each · 75 minutes
 *   exactly one correct response per question · no notes/calculators
 *
 * These questions are ORIGINAL — written to the same syllabus, topic
 * distribution and difficulty as the real exam rather than copied from it,
 * and testing different angles again so all three papers are worth sitting.
 *
 * `ref` points at the module that covers the idea.
 * `fig` renders an inline SVG figure where a plot is needed.
 */

export const EXAM_C_META = {
  title: "Practice Midterm Three",
  subtitle: "Statistical Methods in Finance",
  minutes: 75,
  pointsPer: 3,
  rules: [
    "33 questions, 3 points each (99 points total). Exactly one correct response each.",
    "75 minutes. The timer starts when you click Begin.",
    "Covers Parts 1 through 5 of the lecture notes.",
    "No calculator, laptop, tablet, phone or written notes — so nothing here needs arithmetic you cannot do in your head.",
    "You are not expected to memorize formulas (Black-Scholes, the GARCH equation, and so on). Where a formula is needed it is given; what is tested is what it is for and how it achieves that.",
    "You will not be asked about Python syntax or to debug code — only to read output.",
    "\"iid\" stands for \"independent and identically distributed.\"",
  ],
};

export const EXAM_C = [
/* ================================================ Part 1 — the model (8) */
{ id: "c1", ref: "f3", topic: "Brownian motion",
  q: "For a standard Brownian motion, which statement about $W(4)$ and $W(7)$ is correct?",
  choices: [
    "They are dependent, with $\\Cov\\big(W(4),W(7)\\big)=4$",
    "They are dependent, with $\\Cov\\big(W(4),W(7)\\big)=7$",
    "They are independent, because both have mean zero",
    "They are independent, because the increments are independent",
  ], answer: 0,
  why: "Independent **increments** does not mean independent **values** — $W(7)$ literally contains $W(4)$ inside it. In general $\\Cov(W(s),W(t))=\\min(s,t)$, so here it is 4. This is the single most reliable trap in the Brownian motion material." },

{ id: "c2", ref: "f3", topic: "GBM",
  q: "$\\{S(t)\\}$ is a geometric Brownian motion. What are the distributions of $S(12)$ and of $\\log\\big(S(12)/S(5)\\big)$ respectively?",
  choices: [
    "Lognormal and lognormal",
    "Lognormal and normal",
    "Normal and lognormal",
    "Normal and normal",
  ], answer: 1,
  why: "The **price** at a fixed time is lognormal (property 1). The **log of a price ratio** is a Brownian increment, hence normal (property 6). Keeping those two straight answers a large share of GBM questions." },

{ id: "c3", ref: "f2", topic: "Lognormal",
  q: "$X$ is lognormal with $\\mu=0$ and $\\sigma^2=0.5$. Which is true of its mean and median?",
  choices: [
    "The mean is $1$ and the median is about $1.28$",
    "The mean and the median are both $1$",
    "The mean is about $1.28$ and the median is $1$",
    "The median exceeds the mean because the distribution is right-skewed",
  ], answer: 2,
  why: "The median is $e^{\\mu}=e^{0}=1$ and the mean is $e^{\\mu+\\sigma^2/2}=e^{0.25}\\approx1.28$. For a right-skewed distribution the long tail pulls the **mean above** the median, never below — the gap is exactly the $\\sigma^2/2$ premium." },

{ id: "c4", ref: "f1", topic: "Options",
  q: "You know $\\E(P_T)=\\$140$ and the strike is $K=\\$100$. A colleague prices the call at \\$40. What is wrong with that?",
  choices: [
    "The calculation needs the risk-free rate before anything can be said",
    "Nothing — \\$40 is exactly $\\E\\big((P_T-K)^+\\big)$",
    "\\$40 over-states the value, because the option can expire worthless",
    "\\$40 under-states the value, because $x^+$ is convex and Jensen's inequality applies",
  ], answer: 3,
  why: "\\$40 is $\\big(\\E(P_T)-K\\big)^+$ — the payoff **of the average**. Jensen gives $\\E\\big((P_T-K)^+\\big)\\ge\\big(\\E(P_T)-K\\big)^+$ for the convex function $x^+$. \u201cOver-states because it can expire worthless\u201d is the intuitive-sounding trap: the truncated downside is exactly why the true value is *higher*." },

{ id: "c5", ref: "f4", topic: "Returns",
  q: "How does the **log** return compare with the **simple** return over the same period?",
  choices: [
    "They are close for small moves; for a gain the log return is slightly **smaller**, and for a loss slightly more negative",
    "They are identical, since $r_t$ and $R_t$ are two notations for one quantity",
    "The log return is always the larger of the two",
    "They agree only when the return is negative",
  ], answer: 0,
  why: "$r_t=\\log(1+R_t)$, and since $\\log(1+x)\\le x$ the log return sits slightly below the simple return for a gain and slightly further below zero for a loss. They agree closely for small moves and part company in the tails: a log return is unbounded below, while a simple return stops dead at $-100\\%$. That difference is why log returns are the convenient object to model." },

{ id: "c6", ref: "f4", topic: "Returns",
  q: "Under the lognormal pricing model with $\\nu=0.02$ and $\\sigma^2=0.09$ per period, what is the distribution of the 4-period log return?",
  choices: [
    "$N(0.02,\\ 0.09)$",
    "$N(0.08,\\ 0.36)$",
    "$N(0.08,\\ 0.09)$",
    "$N(0.08,\\ 0.18)$",
  ], answer: 1,
  why: "$r_t(k)\\sim N(\\nu k,\\ \\sigma^2k)$ — both parameters scale **linearly in $k$**. With $k=4$: mean $0.08$, variance $0.36$. The standard deviation is then $0.6=0.3\\sqrt4$, which is where the $\\sqrt{k}$ rule comes from." },

{ id: "c7", ref: "f1", topic: "Options",
  q: "Why does this course model the **distribution** of $P_T$ instead of forecasting a single value?",
  choices: [
    "Because regulators require a distributional model",
    "Because forecasting a single value is computationally harder",
    "Because the payoff function bends, so the spread of outcomes affects the price — a point forecast is not enough",
    "Because the distribution of $P_T$ is known exactly in advance",
  ], answer: 2,
  why: "The kink in $(P_T-K)^+$ treats the two sides of the distribution differently, so two scenarios with the same mean but different spreads have different option values. Even a *perfect* point forecast would be insufficient — which is why nine modules of distribution theory follow." },

{ id: "c8", ref: "f2", topic: "Lognormal",
  q: "Which statement about the lognormal$(\\mu,\\sigma^2)$ distribution is correct?",
  choices: [
    "$X$ can take negative values when $\\mu<0$",
    "$\\log X$ is lognormal",
    "$\\mu$ and $\\sigma^2$ are the mean and variance of $X$",
    "$\\mu$ and $\\sigma^2$ are the mean and variance of $\\log X$",
  ], answer: 3,
  why: "The parameters describe the **log** scale: $\\log X\\sim N(\\mu,\\sigma^2)$. $X$ itself has mean $e^{\\mu+\\sigma^2/2}$. And $X=e^{\\log X}>0$ always, whatever the sign of $\\mu$ — the name is literal, so it is $\\log X$ that is normal." },

/* ================================= Part 2 — is it normal? (7) */
{ id: "c9", ref: "f5", topic: "KDE",
  q: "What does it mean to say that kernel density estimation is **nonparametric**?",
  choices: [
    "It does not assume a functional form for the density; the shape is determined by the data",
    "It requires fewer observations than a parametric method",
    "It produces estimates without any bias",
    "It has no tuning constants to choose",
  ], answer: 0,
  why: "Nonparametric means no assumed family — you do not say \u201cit is normal, estimate $\\mu$ and $\\sigma$\u201d. It certainly **does** have a tuning constant (the bandwidth), it is hungrier for data than a parametric fit, and it is biased for any finite $h$." },

{ id: "c10", ref: "f5", topic: "KDE",
  q: "A KDE is built with a bandwidth far **too small**. What will you see?",
  choices: [
    "A smooth curve that misses real features of the density",
    "A spiky curve that tracks individual observations and changes a lot between samples",
    "A curve identical to the true density",
    "A curve whose area is greater than 1",
  ], answer: 1,
  why: "Narrow bumps make the estimate trace **this particular sample**, including its accidents — low bias, high variance. Re-draw the sample and the picture changes completely. The $\\frac{1}{nh}$ factor keeps the area at 1 for any $h$." },

{ id: "c11", ref: "f5", topic: "KDE", fig: "kdelog",
  q: "The plot below shows a KDE of log daily returns (solid) against the fitted normal (dashed) on a **logarithmic** $y$-axis. Why use a log axis?",
  choices: [
    "Because log returns can be negative and a log axis handles that",
    "Because the normal density becomes a straight line on a log axis",
    "Because on a linear axis both curves are crushed to near-zero in the tails, hiding exactly the difference we care about",
    "Because kernel density estimates are only valid on a log scale",
  ], answer: 2,
  why: "In the tails both densities are tiny, so on a linear axis they overlap visually at zero and the comparison is useless. A log axis expands small values, revealing the empirical curve sitting well above the normal on both sides. Note $\\log$ of $e^{-x^2/2}$ is a **parabola**, not a line." },

{ id: "c12", ref: "f6", topic: "Kurtosis",
  q: "Software reports an **excess kurtosis** of $4.2$ for a return series. What is the kurtosis $\\widehat\\gamma_2$, and what does it indicate?",
  choices: [
    "$1.2$; the distribution is mesokurtic",
    "$4.2$; the distribution is exactly normal",
    "$4.2$; the distribution is platykurtic",
    "$7.2$; the distribution is leptokurtic",
  ], answer: 3,
  why: "Excess kurtosis is $\\widehat\\gamma_2-3$, so $\\widehat\\gamma_2=7.2$ — well above the normal's 3, hence **leptokurtic** (heavy tails, sharp peak). Always check which convention your software reports: under excess kurtosis, *zero* means normal." },

{ id: "c13", ref: "f6", topic: "Normality tests",
  q: "The Jarque-Bera statistic is $T=\\frac{n}{6}\\big(\\widehat\\gamma_1^{\\,2}+(\\widehat\\gamma_2-3)^2/4\\big)$. Why are the two terms **added** rather than either used alone?",
  choices: [
    "Because a distribution can be perfectly symmetric and still badly non-normal through its tails, so both must be checked",
    "Because skewness is unreliable at small $n$",
    "Because the sum cancels estimation error in the two moments",
    "To make the statistic follow a $\\chi^2_2$ distribution and nothing more",
  ], answer: 0,
  why: "Testing skewness alone would clear a symmetric $t$ distribution, which is wildly non-normal. Adding both terms means you must pass **both** checks. The 2 degrees of freedom follow from having measured two things — a consequence, not the reason." },

{ id: "c14", ref: "f6", topic: "p-values",
  q: "A test returns a p-value of $0.03$. Which interpretation is correct?",
  choices: [
    "There is a 97% probability that the alternative is true",
    "If the null were true, data at least this extreme would occur 3% of the time",
    "The effect is large enough to matter in practice",
    "There is a 3% probability that the null hypothesis is true",
  ], answer: 1,
  why: "A p-value is a statement about the **data given the hypothesis**, never about the hypothesis given the data. It also says nothing about effect size — with enough observations a trivial departure yields a tiny p-value, which is exactly the Ljung-Box situation on real returns." },

{ id: "c15", ref: "f6", topic: "Power",
  q: "A test has significance level $\\alpha=0.05$ and power $0.25$ against a particular alternative. What follows?",
  choices: [
    "The test produces a false positive 25% of the time",
    "Power is the probability of correctly accepting the null",
    "If that alternative is true, the test fails to detect it 75% of the time",
    "There is a 25% chance the null hypothesis is true",
  ], answer: 2,
  why: "Power $=P(\\text{reject }H_0\\mid H_1\\text{ true})=0.25$, so the Type II error rate is $0.75$. Low power is a practical hazard: failing to reject with a weak test tells you almost nothing, because the test may not have been looking hard enough." },

/* ============================ Part 3 — time series (9) */
{ id: "c16", ref: "f7", topic: "Stationarity",
  q: "The autocovariance function of a weakly stationary series satisfies which property?",
  choices: [
    "$\\gamma_X(h)=0$ for all $h\\ne0$",
    "$\\gamma_X(0)=0$",
    "$\\gamma_X(r,s)$ depends on $r$ and $s$ separately",
    "$\\gamma_X(r,s)$ depends only on the gap $|r-s|$",
  ], answer: 3,
  why: "Shift-invariance is the third stationarity condition: the autocovariance depends on the **lag**, not on where in the series you are. Zero autocovariance at every non-zero lag would make it white noise — a special case, not a requirement — and $\\gamma_X(0)$ is the variance, which is positive." },

{ id: "c17", ref: "f12", topic: "Leverage effect",
  q: "Two explanations are offered for the leverage effect. Which is the **more widely accepted** one?",
  choices: [
    "Rising uncertainty raises expected future volatility; risk-averse investors will only hold stocks at a higher expected return, so the current price must drop immediately",
    "Falling equity prices raise firms' debt-to-equity ratios, making their stock riskier",
    "Trading volume rises after bad news, which mechanically inflates measured volatility",
    "Restrictions on short selling stop prices from adjusting symmetrically",
  ], answer: 0,
  why: "The debt-to-equity story is where the **name** comes from, but the volatility-feedback story is the more widely accepted explanation: a shock raises expected volatility, risk-averse investors demand a larger expected return to hold the asset, and generating a higher *future* return requires the current price to fall **now**. So the effect is named after the theory that does not best explain it." },

{ id: "c18", ref: "f7", topic: "AR models",
  q: "For a stationary AR(1) with parameter $\\phi$, what is the autocorrelation at lag $h$?",
  choices: [
    "$\\phi$ for every $h$",
    "$\\phi^{|h|}$",
    "$0$ for $h\\ne0$",
    "$1/(1-\\phi^2)$",
  ], answer: 1,
  why: "Unrolling the recursion gives $\\rho_X(h)=\\phi^{|h|}$ — a geometric decay at rate $\\phi$. So an ACF whose bars shrink by a roughly constant *factor* signals AR-type memory, and the lag-1 bar reads off $\\phi$ directly. $\\sigma_\\epsilon^2/(1-\\phi^2)$ is the **variance**, not a correlation." },

{ id: "c19", ref: "f8", topic: "Unit root tests",
  q: "What does it mean for a series to have a **unit root**?",
  choices: [
    "It has exactly one statistically significant lag",
    "Its autocorrelation is exactly zero at lag 1",
    "$\\phi=1$, so shocks never decay and the variance grows without bound",
    "Its mean equals one",
  ], answer: 2,
  why: "A unit root means the AR polynomial's root sits at one, i.e. $\\phi=1$. Shocks are permanent, there is no level to revert to, and the variance grows with $t$ — so the series is **not stationary**. That is why detecting it matters before fitting anything." },

{ id: "c20", ref: "f11", topic: "Risk-neutral pricing",
  q: "Under the **risk-neutral measure** $\\mathbb{Q}$, at what rate is the asset price taken to grow, and why?",
  choices: [
    "At the drift observed in historical market data, since that is what actually happened",
    "At zero, since risk-neutral investors are indifferent to the outcome",
    "At the volatility $\\sigma$, which sets the scale of the price movements",
    "At the **risk-free rate** $r$ — any other rate would create an arbitrage opportunity",
  ], answer: 3,
  why: "Risk-neutrality asks: if investors had no concern for risk, at what rate should the price grow? The answer is the risk-free rate, to prevent **arbitrage** — trivial ways to make money. So on the price scale $\\mu=r$, and since $\\mu=\\nu+\\sigma^2/2$ the log-scale drift is $\\nu=r-\\sigma^2/2$. Calibrating to the drift actually observed in market data is the **real-world** measure $\\mathbb{P}$, the alternative approach." },

{ id: "c21", ref: "f8", topic: "Unit root tests",
  q: "You run ADF on a stock's **price** series and on its **log return** series. What is the typical result?",
  choices: [
    "Prices fail to reject; returns reject decisively",
    "Neither rejects, since both are financial series",
    "Both reject the null decisively",
    "Prices reject; returns fail to reject",
  ], answer: 0,
  why: "Prices wander and look like they have a unit root, so ADF fails to reject on them. Log returns are stationary and reject decisively. This matches what GBM predicts — prices are non-stationary while their **log differences** are the well-behaved object — and it is why every model here is fitted to returns." },

{ id: "c22", ref: "f8", topic: "ACF", fig: "acfnoise",
  q: "The autocorrelation function below was computed from the residuals of a fitted model. What does it indicate?",
  choices: [
    "Strong remaining autocorrelation — the model is misspecified",
    "No significant autocorrelation left, which is what well-specified residuals look like",
    "A unit root in the residuals",
    "Volatility clustering in the residuals",
  ], answer: 1,
  why: "Every bar sits inside the $\\pm1.96/\\sqrt{n}$ band, so none differs significantly from zero — residuals that look like white noise, exactly what you hope for. Note this plot says nothing about the **squares**: clustering would need the ACF of the squared residuals to reveal it." },

{ id: "c23", ref: "f8", topic: "Ljung-Box",
  q: "A Ljung-Box test at $H=15$ returns $p=0.002$. What have you learned?",
  choices: [
    "Lag 15 specifically is significantly autocorrelated",
    "Every lag from 1 to 15 is significantly autocorrelated",
    "At least one lag among 1 to 15 is autocorrelated, but not which one",
    "The series is not normally distributed",
  ], answer: 2,
  why: "Ljung-Box is a **portmanteau** test: the null is that *all* of the first $H$ autocorrelations are zero, so rejecting means at least one is not. Identifying which requires the ACF plot. Normality is a different test entirely." },

{ id: "c24", ref: "f8", topic: "Diagnostics",
  q: "Running Ljung-Box on the **squared** log returns gives very small p-values. What does that establish?",
  choices: [
    "The returns are normally distributed",
    "The return series has a unit root",
    "Returns are predictable in direction, contradicting market efficiency",
    "Volatility is autocorrelated — there is significant volatility clustering",
  ], answer: 3,
  why: "Squaring removes the sign and leaves magnitude, so the squared series is a proxy for variance. Autocorrelation there means **volatility** is predictable from its own past — clustering. Direction remains unpredictable, so market efficiency is untouched." },

/* ================================= Part 4 — volatility (6) */
{ id: "c25", ref: "f10", topic: "Conditional variance",
  q: "What distinguishes the **conditional** variance $\\sigma_t^2$ from the **unconditional** variance?",
  choices: [
    "The conditional variance is the forecast given the history up to $t-1$; the unconditional is the long-run average",
    "They are the same quantity under stationarity",
    "The unconditional variance changes over time; the conditional one does not",
    "The conditional variance is always the larger of the two",
  ], answer: 0,
  why: "$\\sigma_t^2=\\Var(X_t\\mid\\mathcal{F}_{t-1})$ is today's specific forecast, while the unconditional variance is its long-run average. Two series can share an identical unconditional variance and behave completely differently — modelling the conditional one is the entire point of ARCH and GARCH." },

{ id: "c26", ref: "f10", topic: "ARCH",
  q: "For an ARCH(1) process with $0\\le\\alpha_1<1$, which statement is correct?",
  choices: [
    "It is non-stationary for any $\\alpha_1>0$",
    "It is white noise with mean 0 and variance $\\omega/(1-\\alpha_1)$",
    "It is iid with variance $\\omega$",
    "It has significant autocorrelation at lag 1",
  ], answer: 1,
  why: "With $\\alpha_1<1$ the process is stationary, has mean zero and unconditional variance $\\omega/(1-\\alpha_1)$, and has zero autocorrelation at every non-zero lag — so it satisfies the white noise definition. It is emphatically **not** iid: the squares are dependent." },

{ id: "c27", ref: "f10", topic: "GARCH",
  q: "In a fitted GARCH(1,1), what does the quantity $\\alpha_1+\\beta_1$ tell you?",
  choices: [
    "The probability that the fitted model is stationary",
    "The proportion of the variance in returns that the model explains",
    "The fraction of a volatility shock still present one period later — that is, how **persistent** volatility is",
    "The long-run unconditional variance of the series",
  ], answer: 2,
  why: "Each period multiplies what remains of a shock by $\\alpha+\\beta$, so that sum is the survival fraction and governs the half-life of a volatility shock — the single most informative summary of a fitted GARCH. It also carries the **stationarity condition**: the process is stationary only if $\\alpha+\\beta<1$, and the long-run variance is $\\omega/(1-\\alpha-\\beta)$, a different quantity." },

{ id: "c28", ref: "f10", topic: "GARCH",
  q: "A GARCH(1,1) is fitted with $\\omega=2\\times10^{-5}$, $\\alpha_1=0.05$, $\\beta_1=0.90$. What is the implied long-run **daily** volatility?",
  choices: [
    "$0.05$",
    "Undefined — the model is not stationary",
    "$0.0004$",
    "$0.02$",
  ], answer: 3,
  why: "The unconditional variance is $\\omega/(1-\\alpha-\\beta)=2\\times10^{-5}/0.05=4\\times10^{-4}$, so the volatility is its square root, $0.02$ — 2% a day, roughly 32% annualized. The trap is reporting the **variance** as if it were the volatility. Here $\\alpha+\\beta=0.95<1$, so the model is stationary." },

{ id: "c29", ref: "f10", topic: "GARCH",
  q: "Why must a GARCH model have $p>0$ rather than $p=0$?",
  choices: [
    "Because with $p=0$ no observed data enters the variance equation, so the model just decays to a constant",
    "Because $\\beta$ must always exceed $\\alpha$",
    "Because $p=0$ would make the process non-stationary",
    "Because otherwise the likelihood cannot be computed",
  ], answer: 0,
  why: "With $p=0$ the recursion is $\\sigma_t^2=\\omega+\\beta\\sigma_{t-1}^2$ — it starts from an initial value and converges to a constant with no $X_{t-i}^2$ term to inject information. You need the squared observations for the model to respond to anything at all." },

{ id: "c30", ref: "f10", topic: "Model selection",
  q: "What is the purpose of the $2k$ term in $\\text{AIC}=2k-2\\log(\\hat L)$?",
  choices: [
    "To convert the likelihood to a probability",
    "To penalize extra parameters, since more parameters always raise the likelihood",
    "To adjust for the sample size",
    "To make AIC positive",
  ], answer: 1,
  why: "Adding parameters can only improve the in-sample fit, so raw likelihood always favours the biggest model. The $2k$ charges you for each parameter, which is why a GARCH(2,2) can score **worse** than a GARCH(1,1) despite fitting at least as well. Sample size appears in BIC, not AIC." },

/* ============================= Part 5 — Black-Scholes (3) */
{ id: "c31", ref: "f11", topic: "Black-Scholes",
  q: "Of the five Black-Scholes inputs, which set is **known** at time zero?",
  choices: [
    "All five are known",
    "$K$, $t$, $\\sigma$",
    "$K$, $t$, $P_0$",
    "$P_0$, $\\nu$, $\\sigma$",
  ], answer: 2,
  why: "The strike, the time to expiration and the spot price are observable today. The drift $\\nu$ and the volatility $\\sigma$ are not — they must be estimated or calibrated, which is exactly why the statistics of Parts 2 to 4 matter to what looks like a pure pricing formula." },

{ id: "c32", ref: "f11", topic: "Implied volatility",
  q: "How is implied volatility obtained?",
  choices: [
    "By fitting a GARCH model and forecasting one step ahead",
    "By averaging squared log returns over the past year",
    "By taking the standard deviation of option prices across strikes",
    "By taking the option's market price as given and solving the formula backwards for $\\sigma$",
  ], answer: 3,
  why: "Since the call price is monotonic in $\\sigma$, there is exactly one volatility that reproduces the observed market price. That makes it the market's **forward-looking** forecast, unlike realized volatility, which is backward-looking. The first and last options describe other estimates of $\\sigma$; the second is a distractor." },

{ id: "c33", ref: "f11", topic: "Leverage effect",
  q: "Standard GARCH cannot reproduce the leverage effect. Why not?",
  choices: [
    "Because it depends on $X_{t-i}^2$, and squaring erases the sign of the return",
    "Because it models the conditional mean rather than the variance",
    "Because it assumes normally distributed innovations",
    "Because it requires $\\alpha+\\beta<1$",
  ], answer: 0,
  why: "The leverage effect is an **asymmetry**: falls raise volatility more than equal-sized rises. GARCH feeds back squared returns, so $-5\\%$ and $+5\\%$ produce identical forecasts. It is a structural blind spot, not a tuning problem — hence APARCH, EGARCH and GJR-GARCH." },
];

export const EXAM_C_FIGURES = {
  kdelog: {
    caption: "KDE of log daily returns (solid) vs. fitted normal (dashed), log y-axis.",
    viewBox: "0 0 420 240",
    paths: [
      { d: "M40,212 Q62,148 92,94 T152,38 Q172,26 186,24 Q200,26 222,38 T282,94 Q312,148 334,212", stroke: "var(--blue-bright)", dash: "6 4" },
      { d: "M40,146 Q62,118 92,88 T152,40 Q172,28 186,26 Q200,28 222,40 T282,88 Q312,118 334,146", stroke: "var(--destructive)" },
    ],
    xlabel: "Log Daily Return", ylabel: "Density (log scale)",
  },
  acfnoise: {
    caption: "Autocorrelation function of the fitted model's residuals.",
    viewBox: "0 0 420 240",
    acf: [1.0, 0.04, -0.03, 0.02, -0.05, 0.01, 0.03, -0.02, 0.04, -0.01, 0.02, 0.03, -0.04, 0.01, -0.02, 0.02],
    xlabel: "Lag", ylabel: "Correlation",
  },
};
