/* StatLab — Practice Midterm Two (NEW questions)
 *
 * Same format as Practice Midterm One, which in turn mirrors the real
 * "Statistical Methods in Finance – Midterm One":
 *   33 multiple-choice questions · 3 points each · 75 minutes
 *   exactly one correct response per question · no notes/calculators
 *
 * These questions are ORIGINAL. They are written to the same syllabus,
 * topic distribution and difficulty as the real exam — not copied from it,
 * and deliberately approaching each idea from a different angle than
 * Practice Midterm One so the two are worth sitting separately.
 *
 * `ref` points at the module that covers the idea.
 * `fig` renders an inline SVG figure where a plot is needed.
 */

export const EXAM_B_META = {
  title: "Practice Midterm Two",
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

export const EXAM_B = [
/* ================================================ Part 1 — the model (8) */
{ id: "b1", ref: "f3", topic: "Brownian motion",
  q: "Let $\\{W(t)\\}$ be a standard Brownian motion. What is $\\Var\\big(W(9)-W(4)\\big)$?",
  choices: [
    "$5$",
    "$13$",
    "$\\sqrt{5}$",
    "$1$",
  ], answer: 0,
  why: "By definition an increment satisfies $W(t)-W(s)\\sim N(0,\\,t-s)$, so the variance **is** the elapsed time: $9-4=5$. The trap is answering $\\sqrt5$ — that is the standard deviation, not the variance." },

{ id: "b2", ref: "f3", topic: "GBM",
  q: "Which of the following is **not** implied by $\\{S(t)\\}$ being a geometric Brownian motion?",
  choices: [
    "$S(t)$ is lognormally distributed for each fixed $t$",
    "$S(t_2)-S(t_1)$ is normally distributed",
    "$\\log\\big(S(t_2)/S(t_1)\\big)$ is normally distributed",
    "$S(t_2)/S(t_1)$ and $S(t_4)/S(t_3)$ are independent for $t_1\\le t_2\\le t_3\\le t_4$",
  ], answer: 1,
  why: "GBM is well behaved in **ratios**, not differences. A difference of two lognormal variables is neither normal nor lognormal — it has no convenient distribution at all. The other three are GBM properties 4, 6 and 2." },

{ id: "b3", ref: "f2", topic: "Lognormal",
  q: "Suppose $X$ has the lognormal$(\\mu,\\sigma^2)$ distribution with $\\mu=1$ and $\\sigma^2=4$. What is $\\E(X)$?",
  choices: [
    "$e$",
    "$e^{2}$",
    "$e^{3}$",
    "$4e$",
  ], answer: 2,
  why: "$\\E(X)=\\exp(\\mu+\\sigma^2/2)=\\exp(1+2)=e^{3}$. Answering $e$ confuses the mean with the **median** $e^{\\mu}$; the gap between them is the lognormal's skew, and it grows with $\\sigma^2$." },

{ id: "b4", ref: "f1", topic: "Options",
  q: "A stock trades at \\$50. A European call with strike \\$50 expiring in six months costs \\$4. At what expiry price does the **holder** break even overall?",
  choices: [
    "The holder cannot lose money",
    "\\$46",
    "\\$50",
    "\\$54",
  ], answer: 3,
  why: "The payoff is $(P_T-50)^+$, but \\$4 was paid up front. Break-even needs the payoff to recover the premium: $P_T-50=4$, so $P_T=\\$54$. Below \\$50 the payoff is zero and the full \\$4 is lost; between \\$50 and \\$54 the payoff is positive but smaller than the premium." },

{ id: "b5", ref: "f4", topic: "Returns",
  q: "Why is the $k$-period log return $r_t(k)$ equal to $r_t+r_{t-1}+\\cdots+r_{t-k+1}$?",
  choices: [
    "Because the log of a ratio is a difference of logs, so the intermediate terms cancel",
    "Because log returns are always small enough to approximate",
    "Because prices are assumed independent across periods",
    "It is not — that identity holds for simple returns, not log returns",
  ], answer: 0,
  why: "$\\log(P_t/P_{t-k})=\\log P_t-\\log P_{t-k}$. Inserting and subtracting every intermediate log price telescopes the sum, leaving one-period log returns. No approximation and no independence assumption is needed — it is an algebraic identity. **Simple** returns compound multiplicatively instead." },

{ id: "b6", ref: "f4", topic: "Volatility scaling",
  q: "Why does the standard deviation of a $k$-period log return scale with $\\sqrt{k}$ rather than with $k$?",
  choices: [
    "Because volatility is estimated with error, and that error grows over time",
    "Because the **variances** of independent one-period returns add, and the standard deviation is the square root of the variance",
    "Because log returns are bounded below, which dampens the growth",
    "Because the mean also grows with $\\sqrt{k}$, and the two must match",
  ], answer: 1,
  why: "Independence makes **variances** additive, so the $k$-period variance is $k\\sigma^2$. Taking the square root to return to the original units gives $\\sigma\\sqrt{k}$ — there is no finance in that step, it is a units conversion. Standard deviations themselves do **not** add, because a square root does not distribute over a sum. Note the mean does scale with $k$ in full, which is why a trend eventually outruns the noise." },

{ id: "b7", ref: "f2", topic: "Lognormal",
  q: "Which is the strongest reason to model prices as lognormal rather than normal?",
  choices: [
    "Only the lognormal distribution has a finite mean",
    "The lognormal distribution has a smaller variance",
    "A normal distribution assigns positive probability to negative prices",
    "The lognormal distribution is symmetric, which simplifies the algebra",
  ], answer: 2,
  why: "A share can fall to zero but no further, and a normal distribution always leaks probability below zero — that is fatal before you start. The lognormal is **not** symmetric (it is right-skewed, which is a second reason to prefer it), and both distributions have finite means." },

{ id: "b8", ref: "f1", topic: "Options",
  q: "An American call and a European call are written on the same stock with the same strike and expiry. Which statement is correct?",
  choices: [
    "Their relative value depends on which continent they trade on",
    "The European option is worth at least as much, since it is simpler to price",
    "They always have exactly the same value",
    "The American option is worth at least as much, since early exercise is an extra right",
  ], answer: 3,
  why: "The distinction is **when** you may exercise, not geography. Early exercise is an additional right, and extra rights cannot reduce value — so the American option is worth at least as much as its European twin. Black-Scholes prices the European case precisely because removing that choice makes the mathematics tractable." },

/* ================================= Part 2 — is it normal? (7) */
{ id: "b9", ref: "f5", topic: "KDE",
  q: "A kernel density estimate is built with a bandwidth $h$ that is far **too large**. What is the consequence?",
  choices: [
    "Low variance and high bias — real features get smoothed away",
    "Both bias and variance are minimized",
    "The estimate no longer integrates to 1",
    "High variance and low bias — the estimate chases individual observations",
  ], answer: 0,
  why: "Wide bumps blend distant points together, so the estimate barely changes between samples (**low variance**) but systematically erases genuine structure such as a second peak or a fat tail (**high bias**). The $\\frac{1}{nh}$ factor keeps the area at 1 regardless of $h$." },

{ id: "b10", ref: "f5", topic: "KDE",
  q: "In practice, which choice affects a kernel density estimate more?",
  choices: [
    "The kernel function, by a wide margin",
    "The bandwidth, by a wide margin",
    "Both matter about equally",
    "Neither matters once $n>100$",
  ], answer: 1,
  why: "Gaussian, Epanechnikov and triangular kernels give visually similar results; the **bandwidth** decides whether you see noise, structure, or a featureless mound. Kernel choice is second-order, bandwidth is first-order — a standard exam point." },

{ id: "b11", ref: "f6", topic: "QQ plots", fig: "qqbend",
  q: "The normal probability plot below is computed from daily log returns. What does it show?",
  choices: [
    "The returns are approximately normal",
    "The returns are left-skewed but have normal tails",
    "The returns have heavier tails than a normal distribution",
    "The plot is uninformative without a p-value",
  ], answer: 2,
  why: "The points track the line through the middle but the lowest sit **below** it and the highest **above** it — the S-bend of tails heavier than normal. Skew would bend **one** end only; fat tails bend **both**, in opposite directions." },

{ id: "b12", ref: "f6", topic: "Kurtosis",
  q: "A sample has skewness $\\widehat\\gamma_1\\approx0.02$ and kurtosis $\\widehat\\gamma_2\\approx9$. What is the best description?",
  choices: [
    "Strongly right-skewed and platykurtic",
    "Impossible — kurtosis cannot exceed 3",
    "Approximately normal, since the skewness is near zero",
    "Roughly symmetric but strongly leptokurtic",
  ], answer: 3,
  why: "Skewness near 0 means roughly **symmetric**; kurtosis of 9 against the normal's 3 means far heavier tails — **leptokurtic**. Symmetry alone does not imply normality, which is exactly why Jarque-Bera tests both moments rather than one." },

{ id: "b13", ref: "f6", topic: "Normality tests",
  q: "A Jarque-Bera test on $n=2500$ log returns returns a p-value reported as $0.000$. What is the correct conclusion?",
  choices: [
    "There is strong evidence the returns are not drawn from a normal distribution",
    "There is strong evidence the returns are drawn from a normal distribution",
    "The returns are normal with probability less than 0.001",
    "The test is invalid at this sample size",
  ], answer: 0,
  why: "A tiny p-value rejects $H_0$, and here $H_0$ is normality — so this is strong evidence **against** normality. You can never conclude the data *are* normal (that is accepting a null), and the p-value is a statement about the data given the hypothesis, never the reverse." },

{ id: "b14", ref: "f6", topic: "Normality tests",
  q: "Why is the Shapiro-Wilk test generally preferred to Jarque-Bera for assessing normality?",
  choices: [
    "It runs faster on large samples",
    "It is built from the order statistics themselves, so it has more power",
    "It does not require a null hypothesis",
    "It reports the probability that the data are normal",
  ], answer: 1,
  why: "Jarque-Bera compresses the whole sample into two numbers — skewness and kurtosis — and discards the rest, which costs it power. Shapiro-Wilk's statistic uses the sorted values $x_{(i)}$ directly, so it can detect departures that leave the third and fourth moments looking normal." },

{ id: "b15", ref: "f5", topic: "Bias-variance",
  q: "Estimator A has bias $0.3$ and variance $0.02$. Estimator B has bias $0.1$ and variance $0.15$. Which has the smaller mean squared error?",
  choices: [
    "A, with MSE $0.32$",
    "They are equal",
    "A, with MSE $0.11$",
    "B, with MSE $0.16$",
  ], answer: 2,
  why: "MSE $=$ bias$^2+$ variance. A gives $0.09+0.02=0.11$; B gives $0.01+0.15=0.16$. A wins **despite being three times as biased** — accepting bias to buy a larger reduction in variance is often the better trade, and that is the whole content of the tradeoff." },

/* ============================ Part 3 — time series (9) */
{ id: "b16", ref: "f7", topic: "Stationarity",
  q: "For a weakly stationary time series, which of the following is necessarily true?",
  choices: [
    "The series is constant over time",
    "Consecutive observations are independent",
    "The series never has long runs above its mean",
    "$\\E(X_t)$ is the same constant for every $t$",
  ], answer: 3,
  why: "Weak stationarity requires a constant mean, finite variance, and an autocovariance depending only on the lag. It says nothing about independence — a stationary series can have enormous memory — and nothing about long runs, which stationary series certainly can have." },

{ id: "b17", ref: "f7", topic: "Dependence",
  q: "An ARCH(1) process with $0\\le\\alpha<1$ has $\\text{Corr}(X_t,X_{t+h})=0$ for all $h\\ne0$. What does that tell you?",
  choices: [
    "The process is uncorrelated but not necessarily independent",
    "The process is not stationary",
    "The conditional variance must be constant",
    "The process is iid",
  ], answer: 0,
  why: "Zero correlation rules out a **linear** relationship, not every relationship. In an ARCH process the levels are uncorrelated while the **squares** are clearly dependent. Uncorrelated $\\ne$ independent — the single most important distinction in Part 4." },

{ id: "b18", ref: "f7", topic: "AR models",
  q: "In the AR(1) model $X_t=\\mu+\\phi(X_{t-1}-\\mu)+\\epsilon_t$, what does $|\\phi|<1$ guarantee?",
  choices: [
    "The series is independent across time",
    "Shocks decay geometrically, so the series is stationary",
    "The series has no autocorrelation",
    "The conditional variance rises after large values",
  ], answer: 1,
  why: "Each step multiplies the deviation from $\\mu$ by $\\phi$, so shocks fade and the variance settles at $\\sigma_\\epsilon^2/(1-\\phi^2)$. Note mean reversion **coexists** with autocorrelation — at $\\phi=0.9$ the series has both, strongly. A rising conditional variance describes ARCH, not AR." },

{ id: "b19", ref: "f8", topic: "Unit root tests",
  q: "You run `adfuller()` on a series and obtain a p-value of $0.004$. Using a 5% level, what do you conclude?",
  choices: [
    "The result is inconclusive",
    "There is strong evidence the series has a unit root",
    "There is strong evidence the series is stationary",
    "You failed to find evidence that the series is stationary",
  ], answer: 2,
  why: "For ADF the **null** is a unit root and the **alternative** is stationarity — the reverse of most tests you meet. A small p-value therefore rejects the unit root and supports stationarity. Small p is the *good* news here." },

{ id: "b20", ref: "f12", topic: "Market indices",
  q: "The DJIA weights its components by **current share price**. One member announces a 2-for-1 stock split. What happens to that firm's influence on the index?",
  choices: [
    "It is unchanged, because the company's total value is unchanged",
    "It doubles, because there are now twice as many shares",
    "It is unchanged, because the index divisor absorbs the split entirely",
    "It is **halved**, even though the company's total value is unchanged",
  ], answer: 3,
  why: "Under price weighting a firm's weight is its **share price**, which is an essentially arbitrary number. A 2-for-1 split halves the price overnight while the business is worth exactly the same, so its influence halves for no economic reason — the major criticism of the DJIA. Market-cap weighting (price × shares outstanding), used by the **S&P 500**, is immune: the share count doubles and the product is unchanged." },

{ id: "b21", ref: "f8", topic: "ACF", fig: "acfslow",
  q: "The autocorrelation function below was computed from a single series. What does it most suggest?",
  choices: [
    "A series with a unit root, or very close to one",
    "A seasonal pattern with period 4",
    "White noise",
    "A stationary AR(1) with small $\\phi$",
  ], answer: 0,
  why: "The bars stay high and decay only slightly across many lags. A stationary AR decays **geometrically** — visibly shrinking by a constant factor — while white noise shows nothing outside the band. Near-flat, slowly decaying autocorrelation is the visual signature of a unit root." },

{ id: "b22", ref: "f8", topic: "Ljung-Box",
  q: "What is the null hypothesis of the Ljung-Box test with $H=20$?",
  choices: [
    "The series is normally distributed",
    "$\\rho_X(h)=0$ for all $h=1,\\dots,20$",
    "$\\rho_X(h)\\ne0$ for at least one $h\\le20$",
    "$\\rho_X(20)=0$",
  ], answer: 1,
  why: "It is a **portmanteau** test: the null is no autocorrelation anywhere in the first $H$ lags. Rejecting tells you autocorrelation exists *somewhere* in that range but not which lag — for that you read the ACF plot." },

{ id: "b23", ref: "f12", topic: "VIX",
  q: "What does the **VIX** measure?",
  choices: [
    "The average implied volatility across all individual US equities",
    "The spread between the S&P 500 and the Dow Jones Industrial Average",
    "The **implied volatility** of options written on the S&P 500 index",
    "The realized volatility of the S&P 500 over the preceding 30 days",
  ], answer: 2,
  why: "The CBOE sells options whose underlying “asset” is the value of the S&P 500 itself, and the VIX tracks their **implied** volatility. Because the index is broad-based, that says something about the future variability investors anticipate for **the market as a whole** — so it is **forward-looking**, which is why it is nicknamed the *fear index*. Realized volatility over past data is the backward-looking quantity it is most often confused with." },

{ id: "b24", ref: "f8", topic: "Significance",
  q: "Ljung-Box on several thousand daily log returns gives small p-values at $H=10$ and $H=20$. Does this contradict market efficiency?",
  choices: [
    "No — the Ljung-Box test is not valid on financial data",
    "Yes, but only if the autocorrelations are negative",
    "Yes — predictable returns are incompatible with efficiency",
    "No — with a large $n$, tiny correlations become detectable but remain too small to trade through transaction costs",
  ], answer: 3,
  why: "This is the distinction between **statistical** and **practical** significance. Thousands of observations make minute correlations detectable; acting on them would be swamped by transaction costs. Real, detectable, and useless." },

/* ================================= Part 4 — volatility (6) */
{ id: "b25", ref: "f9", topic: "Volatility clustering",
  q: "What does *volatility clustering* refer to?",
  choices: [
    "Large changes tend to be followed by large changes, and small by small, regardless of sign",
    "Returns are positively autocorrelated at short lags",
    "Several stocks in the same sector move together",
    "Volatility is higher at the start of each trading day",
  ], answer: 0,
  why: "Clustering is about **magnitude**, not direction and not cross-sectional co-movement. The phrase \u201cregardless of sign\u201d is doing real work: it is why the diagnostic is the ACF of **squared** returns rather than the returns themselves." },

{ id: "b26", ref: "f10", topic: "ARCH",
  q: "In an ARCH(2) process, the conditional variance $\\sigma_t^2$ is modelled as a function of which quantities?",
  choices: [
    "$\\sigma_{t-1}^2$ and $\\sigma_{t-2}^2$",
    "$X_{t-1}^2$ and $X_{t-2}^2$",
    "$X_{t-1}$ and $X_{t-2}$, keeping their signs",
    "$X_t$ and $X_{t-1}$",
  ], answer: 1,
  why: "ARCH($p$) sets $\\sigma_t^2=\\omega+\\sum_{i=1}^{p}\\alpha_iX_{t-i}^2$ — past **squared** observations only. Feeding back past conditional variances is what makes it a GARCH; keeping the signs is what standard ARCH and GARCH deliberately cannot do." },

{ id: "b27", ref: "f10", topic: "GARCH",
  q: "A GARCH(1,1) is fitted and returns $\\alpha_1=0.11$, $\\beta_1=0.92$. What should you report?",
  choices: [
    "Nothing unusual — only $\\alpha_1<1$ is required",
    "A well-behaved fit with moderate persistence",
    "$\\alpha_1+\\beta_1=1.03>1$, so the stationarity condition fails and the unconditional variance is undefined",
    "The model is invalid because $\\beta_1>\\alpha_1$",
  ], answer: 2,
  why: "Stationarity requires $\\sum(\\alpha_i+\\beta_i)<1$, and $0.11+0.92=1.03$ fails it. Shocks to volatility never fully decay and $\\omega/(1-\\alpha-\\beta)$ is not a valid variance. Fitted equity models often sit just *below* 1 — crossing it is worth flagging." },

{ id: "b28", ref: "f10", topic: "GARCH",
  q: "Why can a GARCH(1,1) capture strong volatility persistence with far fewer parameters than an ARCH model?",
  choices: [
    "Because it also models the conditional mean",
    "Because it uses a different likelihood function",
    "Because it allows negative coefficients, giving extra flexibility",
    "Because the $\\beta\\sigma_{t-1}^2$ term recycles the smoother past-variance series, whereas squared returns are noisier predictors",
  ], answer: 3,
  why: "$X_t$ carries the extra randomness of $\\epsilon_t$, so $X_{t-i}^2$ is a noisy proxy for volatility, while $\\sigma_{t-j}^2$ is the smoothed quantity itself. Regressing on the cleaner signal carries information forward efficiently — one $\\beta$ does the work of many $\\alpha$ lags. GARCH requires $\\beta_j\\ge0$, so \u201cnegative coefficients\u201d is simply false." },

{ id: "b29", ref: "f10", topic: "Model selection",
  q: "Four models are fitted to one return series: ARCH(1) AIC $=1042.8$, ARCH(4) AIC $=1019.5$, GARCH(1,1) AIC $=988.1$, GARCH(3,1) AIC $=991.7$. Which is preferred?",
  choices: [
    "GARCH(1,1)",
    "Cannot compare ARCH with GARCH by AIC",
    "ARCH(4)",
    "GARCH(3,1)",
  ], answer: 0,
  why: "Lower AIC wins, so GARCH(1,1) at $988.1$. GARCH(3,1) fits the training data at least as well in raw likelihood terms yet scores worse once $2(\\#\\text{params})$ is charged — the penalty doing its job. AIC **is** comparable across families fitted to the same data." },

{ id: "b30", ref: "f9", topic: "Diagnostics",
  q: "You want to check a return series for volatility clustering. What is the right diagnostic?",
  choices: [
    "The ACF of the returns $X_t$",
    "The ACF of the squared returns $X_t^2$",
    "A QQ plot of the returns",
    "An ADF test on the returns",
  ], answer: 1,
  why: "Returns have a mean near zero, so $X_t^2$ is a direct proxy for that period's variance, and squaring removes the sign — exactly what you want when the question is about magnitude. The ACF of $X_t$ typically shows nothing; the ACF of $X_t^2$ is strongly significant." },

/* ============================= Part 5 — Black-Scholes (3) */
{ id: "b31", ref: "f11", topic: "Discounting",
  q: "The Black-Scholes price of a European call is $e^{-rt}\\,\\E\\big((P_t-K)^+\\big)$ rather than $\\E\\big((P_t-K)^+\\big)$ alone. What is the $e^{-rt}$ factor doing?",
  choices: [
    "Converting the volatility from a daily basis to an annual one",
    "Correcting for the skewness of the lognormal distribution",
    "**Discounting** the expected payoff, because money spent on the option today could instead have earned the risk-free rate",
    "Adjusting for the possibility that the option expires worthless",
  ], answer: 2,
  why: "$\\E\\big((P_t-K)^+\\big)$ is what you expect to receive **at time $t$**, but you pay for the option **today** — and that money could otherwise have been put into a risk-free investment returning $r$. Multiplying by $e^{-rt}$ converts the future amount to its value today. The chance of expiring worthless is already inside the expectation, via the positive part." },

{ id: "b32", ref: "f11", topic: "Moneyness",
  q: "A **put** option has $P_0=\\$80$ and $K=\\$95$. What is its moneyness status?",
  choices: [
    "Undefined for puts",
    "Out of the money",
    "At the money",
    "In the money",
  ], answer: 3,
  why: "A put is the right to **sell** at $K$. With the spot below the strike, exercising today would pay $\\$15$ — it is **in the money**. Note $M=\\log(P_0/K)<0$ here: for a put every inequality flips relative to a call, which is why drawing the payoff is safer than memorizing signs." },

{ id: "b33", ref: "f11", topic: "Leverage effect",
  q: "Which of the following can capture **asymmetric** volatility effects, where falls raise volatility more than equal-sized rises?",
  choices: [
    "APARCH",
    "A random walk",
    "GARCH",
    "ARIMA",
  ], answer: 0,
  why: "**APARCH** (Asymmetric Power ARCH) is designed for exactly this, along with EGARCH and GJR-GARCH. Standard **GARCH** cannot: it depends on $X_{t-i}^2$, and squaring erases the sign, so $-5\\%$ and $+5\\%$ move the forecast variance identically. ARIMA models the conditional *mean*." },
];

export const EXAM_B_FIGURES = {
  qqbend: {
    caption: "Normal probability plot of daily log returns.",
    viewBox: "0 0 420 240",
    line: { x1: 60, y1: 200, x2: 360, y2: 30 },
    paths: [{ d: "M64,228 Q92,202 132,168 T212,112 T292,58 Q332,22 356,6", stroke: "var(--blue-bright)" }],
    xlabel: "Theoretical Quantiles", ylabel: "Sample Quantiles",
  },
  acfslow: {
    caption: "Autocorrelation function of the series.",
    viewBox: "0 0 420 240",
    acf: [1.0, 0.97, 0.94, 0.91, 0.88, 0.86, 0.83, 0.80, 0.78, 0.75, 0.73, 0.70, 0.68, 0.66, 0.63, 0.61],
    xlabel: "Lag", ylabel: "Correlation",
  },
};
