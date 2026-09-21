/* StatLab — Practice Midterm (NEW questions)
 *
 * Format mirrors "Statistical Methods in Finance – Midterm One" (2025):
 *   33 multiple-choice questions · 3 points each · 75 minutes
 *   exactly one correct response per question · no notes/calculators
 *
 * These questions are ORIGINAL — written to match the real exam's topic
 * distribution and difficulty, not copied from it. The answer key is
 * balanced across a/b/c/d so position gives nothing away.
 *
 * `ref` points at the module that covers the idea.
 * `fig` renders an inline SVG figure where the real exam used a plot.
 */

export const EXAM_META = {
  title: "Practice Midterm One",
  subtitle: "Statistical Methods in Finance",
  minutes: 75,
  pointsPer: 3,
  rules: [
    "33 questions, 3 points each (99 points total).",
    "75 minutes. The timer starts when you click Begin.",
    "Notes, books, and calculators are not allowed on the real exam — try it that way.",
    "\"iid\" stands for \"independent and identically distributed.\"",
    "Each question has exactly one correct response.",
  ],
};

export const EXAM = [
/* ---------------------------------------------------- Part 1: lognormal */
{ id: "x1", ref: "f3", topic: "GBM",
  q: "Let $\\{S(t):t\\ge0\\}$ be a geometric Brownian motion. What is the distribution of $\\log\\big(S(8)/S(3)\\big)$?",
  choices: ["Lognormal", "Chi-squared", "Normal", "Impossible to determine"],
  answer: 2,
  why: "GBM property 6: $\\log(S(t_2)/S(t_1))$ equals the Brownian increment $B(t_2)-B(t_1)$, which is Normal$(\\nu(t_2-t_1),\\ \\sigma^2(t_2-t_1))$. The price itself is lognormal; the log of a price *ratio* is normal." },

{ id: "x2", ref: "f3", topic: "GBM",
  q: "In the geometric Brownian motion $S(t)=S(0)e^{B(t)}$ with $B(t)=\\nu t+\\sigma W(t)$, the expected value is $S(0)e^{\\mu t}$. How are $\\mu$ and $\\nu$ related?",
  choices: ["$\\mu=\\nu$", "$\\mu=\\nu+\\sigma^2/2$", "$\\mu=\\nu-\\sigma^2/2$", "$\\mu=\\nu\\sigma^2$"],
  answer: 1,
  why: "Applying the lognormal mean $\\exp(\\text{mean}+\\text{var}/2)$ to $\\log S(t)\\sim N(\\log S(0)+\\nu t,\\ \\sigma^2t)$ gives $S(0)\\exp((\\nu+\\sigma^2/2)t)$. So $\\mu=\\nu+\\sigma^2/2$: drift on the **price** scale exceeds drift on the **log** scale." },

{ id: "x3", ref: "f1", topic: "Options",
  q: "An investor holds a European put option with strike $K$ expiring at time $T$. What is the payoff at expiration?",
  choices: ["$(K-P_T)^+$", "$(P_T-K)^+$", "$|P_T-K|$", "$P_T-K$ regardless of sign"],
  answer: 0,
  why: "A put is the right to **sell** at $K$. You exercise only when the market price is *below* the strike, earning $K-P_T$; otherwise it expires worthless. Hence $(K-P_T)^+$ — the mirror image of the call's $(P_T-K)^+$." },

{ id: "x4", ref: "f1", topic: "Options",
  q: "Why is $\\E\\big((P_T-K)^+\\big)\\ge\\big(\\E(P_T)-K\\big)^+$?",
  choices: [
    "Because $g(x)=x^+$ is convex, so Jensen's inequality applies",
    "Because $P_T$ is always larger than its expectation",
    "Because the positive part function is monotonically decreasing",
    "Because the risk-free rate is being ignored",
  ],
  answer: 0,
  why: "Jensen's inequality states $\\E(g(X))\\ge g(\\E(X))$ for convex $g$. The positive-part function is convex (flat, then linear, with a kink at 0), so a point forecast of $P_T$ always *understates* the option's value — it discards the payoff asymmetry." },

{ id: "x5", ref: "f2", topic: "Lognormal",
  q: "If $Y$ has the lognormal$(\\mu,\\sigma^2)$ distribution, which of the following is true?",
  choices: [
    "$\\E(Y)=\\mu$",
    "$\\E(Y)=e^{\\mu}$",
    "$\\log(Y)$ also has the lognormal distribution",
    "$\\E(Y)=\\exp(\\mu+\\sigma^2/2)$",
  ],
  answer: 3,
  why: "By definition $\\log(Y)\\sim N(\\mu,\\sigma^2)$, and the lognormal mean is $\\exp(\\mu+\\sigma^2/2)$. Note $e^{\\mu}$ is the **median**, not the mean — the gap between them measures the distribution's right skew." },

{ id: "x6", ref: "f2", topic: "Black-Scholes",
  q: "In the derivation of the closed form for $\\E\\big((P_t-K)^+\\big)$, why does the integral's lower limit become $\\log(K)$?",
  choices: [
    "Because the normal density is undefined below $\\log(K)$",
    "Because $K$ must exceed the spot price",
    "Because the integral diverges below that point",
    "Because $(e^y-K)^+=0$ whenever $y<\\log(K)$",
  ],
  answer: 3,
  why: "The integrand $(e^y-K)^+$ is exactly zero when $e^y<K$, i.e. when $y<\\log(K)$. That region contributes nothing, so the integral starts at $\\log(K)$ — this is where the *positive part* does its work in the proof." },

{ id: "x7", ref: "f4", topic: "Returns",
  q: "The one-period simple return is $R_t$ and the one-period log return is $r_t$. What is their relationship?",
  choices: ["$r_t=\\log(1+R_t)$", "$r_t=1+\\log(R_t)$", "$R_t=\\log(1+r_t)$", "$r_t=R_t^2$"],
  answer: 0,
  why: "$r_t=\\log(P_t/P_{t-1})$ and $R_t=P_t/P_{t-1}-1$, so $P_t/P_{t-1}=1+R_t$ and therefore $r_t=\\log(1+R_t)$. Since $\\log(1+x)\\approx x$ for small $x$, the two are nearly equal for daily data." },

{ id: "x8", ref: "f1", topic: "Data",
  q: "A researcher backtests a trading strategy using the current list of S&P 500 tickers and 20 years of history. Which problem is most directly introduced?",
  choices: ["Volatility clustering", "Survivorship bias", "The leverage effect", "Nonstationarity of log returns"],
  answer: 1,
  why: "The available collection of ticker symbols **excludes companies that went out of business**. Testing only on firms that survived to today systematically flatters any strategy — that is survivorship bias." },

/* ---------------------------------------------------- Part 2: normality */
{ id: "x9", ref: "f5", topic: "KDE",
  q: "In the kernel density estimator $\\widehat f_h(x)=\\frac{1}{nh}\\sum_{i=1}^{n}K\\big((x-x_i)/h\\big)$, what role does $h$ play?",
  choices: [
    "It sets the number of kernels that are summed",
    "It determines which kernel function is used",
    "It controls the smoothness of the resulting density estimate",
    "It rescales the estimate so that it integrates to one",
  ],
  answer: 2,
  why: "$h$ is the **bandwidth**: larger $h$ gives a smoother estimate, smaller $h$ a rougher, wigglier one. The number of kernels is $n$ (one per data point), and normalization is handled by the $1/(nh)$ factor." },

{ id: "x10", ref: "f5", topic: "KDE",
  q: "A kernel density estimate is constructed with a bandwidth that is much too large. Which describes the result?",
  choices: [
    "High variance and low bias",
    "Low variance and high bias",
    "High variance and high bias",
    "Low variance and low bias",
  ],
  answer: 1,
  why: "Over-smoothing stabilizes the estimate (**low variance**) but washes out genuine features of the density (**high bias**). Too-small a bandwidth is the reverse. Choosing $h$ is exactly this bias-variance tradeoff, quantified by the IMSE." },

{ id: "x11", ref: "f11", topic: "Leverage effect",
  q: "The *leverage effect* describes which empirical property of log returns?",
  choices: [
    "Volatility tends to be higher following large positive returns than large negative ones",
    "Volatility is constant but the mean return varies over time",
    "Volatility tends to increase more following negative returns than following positive returns",
    "Leverage in a portfolio mechanically increases its Sharpe ratio",
  ],
  answer: 2,
  why: "The leverage effect is the **asymmetry**: markets get more turbulent after declines than after equivalent advances. Standard GARCH cannot capture it, because it depends on $X_{t-i}^2$ and squaring destroys the sign — which is why asymmetric extensions such as APARCH exist." },

{ id: "x12", ref: "f5", topic: "KDE",
  fig: "logdensity",
  q: "The figure shows a kernel density estimate of log daily returns (solid) with the best-fitting normal density (dashed), plotted on a logarithmic $y$-axis. What conclusion is supported?",
  choices: [
    "The normal distribution fits the log daily returns well",
    "The distribution of log daily returns has lighter tails than the normal",
    "No conclusion can be drawn without a formal hypothesis test",
    "The distribution of log daily returns has heavier tails than the normal",
  ],
  answer: 3,
  why: "On a log $y$-scale the normal density is a downward parabola. The empirical density sitting **above** it in both tails means more probability mass far from the center — **heavier tails**. This is the central empirical finding of Part 2." },

{ id: "x13", ref: "f6", topic: "Kurtosis",
  q: "A distribution is described as *leptokurtic*. What does this mean?",
  choices: [
    "It has heavy tails and a sharp peak",
    "It has light tails and a flat peak",
    "It is skewed to the right",
    "Its kurtosis equals exactly 3",
  ],
  answer: 0,
  why: "Leptokurtic = high kurtosis = **heavy tails and a sharp peak**, with more data in both the tails and the center, i.e. more outliers. Platykurtic is the light-tailed, flat-peaked opposite; mesokurtic ($\\gamma_2=3$) is the normal." },

{ id: "x14", ref: "f11", topic: "Implied volatility",
  q: "How is the *implied volatility* of an option calculated?",
  choices: [
    "By averaging historical squared daily returns over a fixed window and multiplying by 252",
    "By solving for the volatility that equates the Black-Scholes price to the option's market price",
    "By computing the standard deviation of option prices across different strike prices",
    "By fitting a GARCH model to past returns and forecasting one step ahead",
  ],
  answer: 1,
  why: "Implied volatility runs the pricing formula **backwards**: take the market price as given and solve for the $\\sigma$ that reproduces it. Option (a) describes *realized/historical* volatility and (d) a *forecast* — both are estimates from past data, not from current option prices." },

{ id: "x15", ref: "f6", topic: "Normality tests",
  q: "The Jarque-Bera test statistic is $T=\\frac{n}{6}\\big(\\widehat\\gamma_1^{\\,2}+(\\widehat\\gamma_2-3)^2/4\\big)$. Under the null hypothesis, what is its asymptotic distribution?",
  choices: [
    "Normal with mean 0",
    "Chi-squared with 1 degree of freedom",
    "Chi-squared with 2 degrees of freedom",
    "$t$ with $n-1$ degrees of freedom",
  ],
  answer: 2,
  why: "Under $H_0$ (data sampled from a normal distribution), $T$ is asymptotically **chi-squared with 2 degrees of freedom** — two, because the statistic combines two estimated quantities, skewness and excess kurtosis. Reject for large $T$." },

{ id: "x16", ref: "f6", topic: "Normality tests",
  q: "You run a Shapiro-Wilk test on a sample of log returns and obtain a p-value of 0.42. What is the appropriate conclusion?",
  choices: [
    "There is strong evidence the sample was drawn from a normal distribution",
    "The sample was definitely drawn from a normal distribution",
    "We failed to find strong evidence that the sample was not drawn from a normal distribution",
    "There is strong evidence the sample was not drawn from a normal distribution",
  ],
  answer: 2,
  why: "A large p-value means you **failed to reject** $H_0$ — never that you proved it. Hypothesis tests deliver strong evidence only *for the alternative*, so the only honest phrasing is that no evidence against normality was found." },

{ id: "x17", ref: "f6", topic: "QQ plots",
  fig: "qqheavy",
  q: "The normal probability plot shown was constructed from a sample of data. What is the appropriate conclusion?",
  choices: [
    "The normal distribution appears to be a good fit to this sample",
    "The distribution from which these data were drawn has heavier tails than the normal",
    "The distribution from which these data were drawn has lighter tails than the normal",
    "No conclusion is possible because the comparison uses the standard normal rather than the best-fitting normal",
  ],
  answer: 1,
  why: "The points bend **below** the line on the left and **above** it on the right: extreme sample values are more extreme than normal theory predicts, i.e. **heavy tails**. Option (d) is tempting, but changing $\\mu$ or $\\sigma$ only shifts and scales the line — it cannot bend it." },

/* ---------------------------------------------------- Part 3: time series */
{ id: "x18", ref: "f7", topic: "Stationarity",
  q: "Which of the following is **not** one of the conditions required for a time series $\\{X_t\\}$ to be stationary?",
  choices: [
    "$\\Var(X_t)<\\infty$",
    "$\\E(X_t)=\\mu$ for all $t$",
    "$\\gamma_X(t,t+h)=\\gamma_X(s,s+h)$ for all integers $t,s,h$",
    "$\\Cov(X_s,X_t)=0$ for all $s\\ne t$",
  ],
  answer: 3,
  why: "The three conditions are finite variance, constant mean, and a lag-only autocovariance. Zero covariance at all nonzero lags describes **white noise**, a stationary *special case* — an AR(1) with $\\phi=0.7$ is stationary and strongly autocorrelated." },

{ id: "x19", ref: "f7", topic: "Stationarity",
  q: "Which statement about a stationary time series is correct?",
  choices: [
    "The unconditional variance $\\Var(X_t)$ is constant, but the conditional variance may depend on $x$",
    "The conditional variance $\\Var(X_t\\mid X_{t-1}=x)$ must be constant in $x$",
    "Both the conditional and unconditional means must depend on $t$",
    "Stationarity implies the observations are independent",
  ],
  answer: 0,
  why: "Stationarity constrains the **unconditional (marginal)** mean and variance only. Conditional moments are free to vary — exactly the loophole ARCH/GARCH exploits: those models are stationary yet have time-varying conditional variance." },

{ id: "x20", ref: "f7", topic: "AR models",
  q: "For the AR(1) model $X_t=\\mu+\\phi(X_{t-1}-\\mu)+\\epsilon_t$, what condition on $\\phi$ makes the process stationary?",
  choices: ["$\\phi>0$", "$|\\phi|<1$", "$\\phi=1$", "$|\\phi|>1$"],
  answer: 1,
  why: "Stationarity of the AR(1) requires $|\\phi|<1$; if $|\\phi|\\ge1$ then $\\Var(X_t)$ is not finite, violating the first stationarity condition. $\\phi=1$ is the random-walk/unit-root case the Dickey-Fuller test takes as its null." },

{ id: "x21", ref: "f8", topic: "Unit root tests",
  q: "The Dickey-Fuller test on $Y_t=\\phi Y_{t-1}+\\epsilon_t$ uses $H_0:\\phi=1$ versus $H_1:\\phi<1$. What is the practical implication of this arrangement?",
  choices: [
    "The test can provide strong evidence that the series is stationary",
    "The test can provide strong evidence that the series is nonstationary",
    "The test is equally informative about both possibilities",
    "The test can only be applied to series with zero mean",
  ],
  answer: 0,
  why: "A hypothesis test produces strong evidence only for its **alternative**. With stationarity ($\\phi<1$) as $H_1$, a small p-value licenses the stationarity assumption our models need. A large p-value merely means we failed to find that evidence." },

{ id: "x22", ref: "f8", topic: "Unit root tests",
  q: "You run `adfuller()` on a series of raw daily closing prices and obtain a p-value of 0.88. Which conclusion is best supported?",
  choices: [
    "There is strong evidence that the price series is stationary",
    "There is strong evidence that the log returns are stationary",
    "We failed to find evidence that the price series is stationary",
    "The test was run incorrectly, since prices are always stationary",
  ],
  answer: 2,
  why: "A large p-value means **failure to reject** $H_0$ — no evidence of stationarity. This is the expected result for raw prices: stationarity would imply mean reversion in prices, hence a simple way to make money." },

{ id: "x23", ref: "f8", topic: "ACF",
  fig: "acfpos",
  q: "The ACF plot shown was generated from data simulated from an AR(1) model $X_t=\\mu+\\phi(X_{t-1}-\\mu)+\\epsilon_t$. What does it indicate about $\\phi$?",
  choices: [
    "$\\phi$ must be negative",
    "$|\\phi|$ must exceed 1",
    "$\\phi$ must be exactly zero",
    "$\\phi$ must be positive",
  ],
  answer: 3,
  why: "The autocorrelations are **positive at every lag** and decay geometrically — the signature of a positive $\\phi$. A negative $\\phi$ produces an *alternating* pattern (negative at lag 1, positive at lag 2, …). $|\\phi|>1$ would be nonstationary and the ACF would not decay." },

{ id: "x24", ref: "f8", topic: "ACF",
  q: "What does the shaded band drawn around zero in a `plot_acf` figure represent?",
  choices: [
    "The range of autocorrelations observed in the sample",
    "Approximately two standard errors around zero",
    "A 99.9% confidence interval for the mean of the series",
    "The bandwidth chosen by the ACF estimator",
  ],
  answer: 1,
  why: "The band is roughly **two standard errors around zero**, so spikes outside it are \"significant.\" Take it only as a guide — with 20 lags plotted, a couple of chance excursions are expected." },

{ id: "x25", ref: "f8", topic: "Ljung-Box",
  q: "What is the null hypothesis of the Ljung-Box test with parameter $H$?",
  choices: [
    "$\\rho_X(h)=0$ for all $h=1,\\dots,H$",
    "$\\rho_X(h)\\ne0$ for at least one $h=1,\\dots,H$",
    "$\\rho_X(H)=0$ for that single lag $H$",
    "The series is drawn from a normal distribution",
  ],
  answer: 0,
  why: "$H_0$ is that **all** autocorrelations up to lag $H$ are zero; $H_1$ is that **at least one** is nonzero. It is a joint test across lags, which is why it detects dependence no single lag makes obvious. (Option (d) is Jarque-Bera / Shapiro-Wilk territory.)" },

{ id: "x26", ref: "f8", topic: "Significance",
  q: "Ljung-Box on a long series of log daily returns yields very small p-values, indicating significant autocorrelation. Why does this not amount to a money-making opportunity?",
  choices: [
    "Because the test is invalid for financial data",
    "Because autocorrelation in returns cannot be exploited by any strategy in principle",
    "Because the p-values must be wrong if the series is stationary",
    "Because statistical significance is not practical significance — transaction costs would swamp the small gains",
  ],
  answer: 3,
  why: "With thousands of observations, even tiny correlations become statistically detectable. The correlations are real but minute, and **transaction costs would swamp any small gains** — the standing distinction between statistical and practical significance." },

/* ---------------------------------------------------- Part 4: volatility */
{ id: "x27", ref: "f9", topic: "Volatility",
  q: "Under the lognormal pricing model with scaling $\\sigma$, what is the standard deviation of the $k$-period log return?",
  choices: ["$\\sigma$", "$\\sigma\\sqrt{k}$", "$\\sigma k$", "$\\sigma^2k$"],
  answer: 1,
  why: "The $k$-period log return is a Brownian increment, distributed $N(\\nu k,\\ \\sigma^2k)$. The **variance** scales linearly in $k$, so the **standard deviation** scales as $\\sigma\\sqrt{k}$ — the square-root-of-time rule behind annualizing with $\\sqrt{252}$." },

{ id: "x28", ref: "f9", topic: "Volatility",
  q: "Holding everything else fixed, what happens to the value of a European call option as the volatility $\\sigma$ of the underlying increases?",
  choices: [
    "It increases, because the unbounded upper tail grows while losses stay capped",
    "It decreases, because the probability the option expires worthless increases",
    "It is unchanged, because volatility affects only the variance, not the mean",
    "It increases only when the option is already in the money",
  ],
  answer: 0,
  why: "Higher $\\sigma$ does raise $P(\\text{worthless})$ — but it also fattens the **upper** tail, where the gain is unbounded while the loss is capped at the premium. That asymmetry means the expected payoff **increases** with $\\sigma$, which is why volatility is a crucial pricing input." },

{ id: "x29", ref: "f9", topic: "Realized volatility",
  q: "Daily log returns have sample variance $\\widehat\\sigma_d^2$. How is the annualized realized volatility typically computed?",
  choices: [
    "$252\\,\\widehat\\sigma_d^2$",
    "$\\widehat\\sigma_d^2/252$",
    "$\\sqrt{\\widehat\\sigma_d^2}/252$",
    "$\\sqrt{252\\,\\widehat\\sigma_d^2}$",
  ],
  answer: 3,
  why: "Multiply the **variance** by the number of trading periods per year (conventionally 252), then take the square root to return to volatility units. In code: `ldrEq.rolling(w).std() * np.sqrt(252)`." },

{ id: "x30", ref: "f9", topic: "Volatility clustering",
  q: "Why is the ACF of the **squared** log returns a sensible diagnostic for volatility clustering?",
  choices: [
    "Squaring removes the autocorrelation present in the raw returns",
    "Squaring makes the series stationary",
    "Log returns have mean near zero, so squared returns approximate the squared distance from the mean — what variance measures",
    "Because the squared series is normally distributed",
  ],
  answer: 2,
  why: "Since $\\E(r_t)\\approx0$, $r_t^2\\approx(r_t-\\mu)^2$, and $\\E[(X-\\mu)^2]=\\Var(X)$. So correlation among squared returns at various lags *is* correlation in the variance at those lags. No clustering ⟹ no correlation at any lag." },

{ id: "x31", ref: "f10", topic: "ARCH",
  q: "Consider the ARCH(1) model $X_t=\\epsilon_t\\sqrt{\\omega+\\alpha_1X_{t-1}^2}$ with $\\alpha_1<1$. Which is true of $\\{X_t\\}$?",
  choices: [
    "It is autocorrelated at lag 1 with correlation $\\alpha_1$",
    "It is nonstationary for every $\\alpha_1>0$",
    "It is an iid sequence",
    "It is white noise with mean zero, yet the squared series is autocorrelated",
  ],
  answer: 3,
  why: "With $\\alpha_1<1$ the process is stationary and is **white noise** with mean 0 and variance $\\omega/(1-\\alpha_1)$, so $\\text{Corr}(X_t,X_{t+h})=0$ for $h\\ne0$. But it is **not iid** — the squares are dependent. Uncorrelated-but-dependent is the entire point of the model." },

{ id: "x32", ref: "f10", topic: "GARCH",
  q: "You fit several models to one series of log returns and obtain: ARCH(1) AIC = 931.4, ARCH(3) AIC = 890.6, GARCH(1,1) AIC = 832.3, GARCH(1,2) AIC = 834.3. Which model is preferred?",
  choices: ["ARCH(1)", "ARCH(3)", "GARCH(1,1)", "GARCH(1,2)"],
  answer: 2,
  why: "AIC $=-2\\log(\\text{likelihood})+2(\\#\\text{params})$ balances fit against complexity, and **smaller is better**. GARCH(1,1) at 832.3 wins — and note it beats GARCH(1,2), so adding parameters is not automatically an improvement." },

{ id: "x33", ref: "f11", topic: "Black-Scholes",
  q: "Which of the following is **not** one of the five inputs to the Black-Scholes formula for a European call?",
  choices: [
    "The strike price $K$",
    "The volatility $\\sigma$ of the underlying asset",
    "The realized kurtosis of past log returns",
    "The time to expiration $t$",
  ],
  answer: 2,
  why: "The five inputs are the strike $K$, time to expiration $t$, spot price $P_0$, log-scale drift $\\nu$, and volatility $\\sigma$. Kurtosis never enters — the model *assumes* lognormality, which is exactly the assumption Part 2 shows the data violate." },
];

/* Inline SVG figures for the questions that need one. Kept minimal and
   theme-aware so they read on the exam's light surface. */
export const EXAM_FIGURES = {
  logdensity: {
    caption: "KDE of log daily returns (solid) vs. best-fitting normal (dashed), log y-axis.",
    viewBox: "0 0 420 240",
    paths: [
      { d: "M40,215 Q60,150 90,95 T150,40 Q170,28 185,26 Q200,28 220,40 T280,95 Q310,150 330,215", stroke: "var(--blue-bright)", dash: "6 4" },
      { d: "M40,150 Q60,120 90,90 T150,42 Q170,30 185,28 Q200,30 220,42 T280,90 Q310,120 330,150", stroke: "var(--destructive)" },
    ],
    xlabel: "Log Daily Return", ylabel: "Density (log scale)",
  },
  qqheavy: {
    caption: "Normal probability plot.",
    viewBox: "0 0 420 240",
    line: { x1: 60, y1: 200, x2: 360, y2: 30 },
    paths: [{ d: "M62,225 Q90,205 130,170 T210,115 T290,60 Q330,25 358,8", stroke: "var(--blue-bright)" }],
    xlabel: "Theoretical Quantiles", ylabel: "Sample Quantiles",
  },
  acfpos: {
    caption: "Autocorrelation function.",
    viewBox: "0 0 420 240",
    acf: [1.0, 0.68, 0.47, 0.31, 0.22, 0.16, 0.10, 0.07, 0.05, 0.04, 0.02, 0.02, 0.01, 0.01, 0.0, 0.0],
    xlabel: "Lag", ylabel: "Correlation",
  },
};
