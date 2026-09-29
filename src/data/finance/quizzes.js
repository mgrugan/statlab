/* StatLab — end-of-module quizzes.
 *
 * Five questions per module. A perfect 5/5 is required to pass; anything
 * less sends you back. Questions are deliberately harder than the inline
 * self-checks: they test whether you can REASON with the idea, not whether
 * you remember the sentence it was stated in.
 *
 * Fields: q, choices, answer (index), why.
 */

export const QUIZZES = {

/* ================================================================ f1 */
f1: [
  { q: "A stock trades at \\$100. A European call with strike \\$100 expiring in one year costs \\$8. Under what circumstance does the *holder* of this call lose money overall?",
    choices: [
      "If the stock finishes anywhere below \\$108",
      "Only if the stock finishes below \\$92",
      "The holder can never lose money, because the option can be abandoned",
      "Only if the stock finishes below \\$100",
    ], answer: 0,
    why: "The payoff is $(P_T-100)^+$, but you paid \\$8 for it. You break even at \\$108. Below \\$100 the payoff is zero and you lose the full \\$8; between \\$100 and \\$108 the payoff is positive but smaller than the premium. The “never lose money” choice confuses *abandoning the option* with *not having paid for it*." },

  { q: "Which statement correctly distinguishes American from European options?",
    choices: [
      "American options are traded on US exchanges; European options on European ones",
      "An American option can be exercised at any time up to expiration, so it is never worth less",
      "European options can be exercised early only when they are in the money",
      "American options must be exercised at expiration; European ones expire automatically",
    ], answer: 1,
    why: "The distinction is *when* you may exercise, not geography. Early exercise is an extra right, and extra rights cannot reduce value — so an American option is worth at least as much as its European twin. European options are what Black-Scholes prices, precisely because removing that choice makes the math tractable." },

  { q: "You must price a call and you know $\\E(P_T)=\\$120$ with strike $K=\\$100$. A colleague says the option is therefore worth \\$20. What is wrong?",
    choices: [
      "Nothing — \\$20 is exactly $\\E\\big((P_T-K)^+\\big)$ in this case",
      "\\$20 over-states the value, because the option can expire worthless",
      "\\$20 under-states the value, because $x^+$ is convex and Jensen's inequality applies",
      "The calculation is invalid unless $P_T$ is normally distributed",
    ], answer: 2,
    why: "\\$20 is $\\big(\\E(P_T)-K\\big)^+$, and Jensen gives $\\E\\big((P_T-K)^+\\big)\\ge\\big(\\E(P_T)-K\\big)^+$ for the convex function $x^+$. “Over-states, because the option can expire worthless” is the intuitive-sounding trap: yes it *can* expire worthless, but the unbounded upside more than compensates in expectation." },

  { q: "A backtest of a momentum strategy on \"all S&P 500 stocks\" reports a 14% annual return. Why should you distrust it before looking at anything else?",
    choices: [
      "Because the S&P 500 is not stationary over such a long sample",
      "Because momentum strategies require adjusting for the leverage effect",
      "Because a 14% return exceeds the market return, which is impossible",
      "Because index membership changes, so the ticker list omits firms that failed",
    ], answer: 3,
    why: "The available ticker list contains today's survivors. Firms that went bankrupt or were delisted are silently absent, so the sample is conditioned on having *not failed* — which inflates returns. This is a data-construction flaw, and no amount of statistical sophistication downstream repairs it." },

  { q: "A stock splits 10-for-1. You download its price history with `auto_adjust=False` and compute log daily returns. What happens?",
    choices: [
      "It shows a spurious one-day return of about $\\log(1/10)$ on the split date",
      "Every single return in the whole series is scaled by a factor of exactly ten",
      "The entire return series becomes non-stationary from the split date onward",
      "Nothing unusual at all — a stock split does not affect the computed returns",
    ], answer: 0,
    why: "Unadjusted, the raw price drops by a factor of 10 overnight purely mechanically. The log return that day is $\\log(P_t/P_{t-1})=\\log(0.1)\\approx-2.3$ — a catastrophic-looking crash that never happened. Only that one observation is corrupted, which is what makes it so easy to miss. Hence `auto_adjust=True` by default." },
],

/* ================================================================ f2 */
f2: [
  { q: "$X$ is lognormal with $\\log X\\sim N(\\mu,\\sigma^2)$. Which ordering of the mean, median and mode of $X$ is correct (for $\\sigma>0$)?",
    choices: [
      "mean $<$ median $<$ mode",
      "mode $<$ median $<$ mean",
      "mean $=$ median $=$ mode",
      "median $<$ mode $<$ mean",
    ], answer: 1,
    why: "The lognormal is right-skewed, and for a right-skewed distribution the long right tail drags the mean above the median, which sits above the mode. Concretely: mode $=e^{\\mu-\\sigma^2}$, median $=e^{\\mu}$, mean $=e^{\\mu+\\sigma^2/2}$ — increasing in that order." },

  { q: "Two lognormal variables have the same $\\mu=0$ but $\\sigma_A=0.5$ and $\\sigma_B=1.5$. Which is true of their medians and means?",
    choices: [
      "A has the larger median and the larger mean",
      "Both medians and both means are equal",
      "The medians are equal but B has the larger mean",
      "The means are equal but B has the larger median",
    ], answer: 2,
    why: "The median is $e^{\\mu}=1$ for both — $\\sigma$ does not move it. The mean is $e^{\\mu+\\sigma^2/2}$, so A has $e^{0.125}\\approx1.13$ and B has $e^{1.125}\\approx3.08$. Raising volatility inflates the *mean* of a lognormal without touching the median: the extra mass all goes into the right tail." },

  { q: "In the Claim, $\\E\\big((P_t-K)^+\\big)=\\exp(\\xi+\\tau^2/2)\\,\\Phi(d_1)-K\\,\\Phi(d_2)$. What is the interpretation of the factor $\\exp(\\xi+\\tau^2/2)$?",
    choices: [
      "The probability that the option finishes in the money",
      "The strike price expressed on the log scale",
      "The standard deviation of the terminal price",
      "$\\E(P_t)$, the expected terminal price",
    ], answer: 3,
    why: "That is exactly the lognormal mean formula applied to $\\log P_t\\sim N(\\xi,\\tau^2)$. The structure of the whole expression is then readable: *expected price × (a probability) − strike × (a probability)*. The probability attached to the strike, $\\Phi(d_2)$, is the chance of finishing in the money." },

  { q: "In the derivation, why do the two $\\Phi$ arguments differ by exactly $\\tau^2/\\tau=\\tau$?",
    choices: [
      "Because completing the square shifts the mean to $\\xi+\\tau^2$ in the first integral",
      "Because the standard identity $\\Phi(x)=1-\\Phi(-x)$ was applied to the second term alone",
      "It is only a convention; either of the two arguments could carry the extra term",
      "Because the strike price must be discounted by exactly one standard deviation",
    ], answer: 0,
    why: "The first term carries an $e^y$ inside the integral. Absorbing it into the exponent and completing the square produces a normal density with mean $\\xi+\\tau^2$ rather than $\\xi$. The second term has no $e^y$, so its mean stays $\\xi$. That single algebraic step is the entire source of the difference." },

  { q: "As the strike $K$ shrinks toward zero, what should $\\E\\big((P_t-K)^+\\big)$ approach, and does the formula deliver it?",
    choices: [
      "Zero, and yes — both $\\Phi$ terms vanish in the limit",
      "$\\E(P_t)$, and yes — both $\\Phi$'s go to 1, leaving $\\E(P_t)$",
      "Infinity, and yes — the formula diverges in this limit",
      "$K$, and no — the formula fails badly in this limit",
    ], answer: 1,
    why: "With $K\\to0$ the option is certain to be exercised and the payoff becomes just $P_t$, so the value must approach $\\E(P_t)$. In the formula, $-\\log K\\to+\\infty$ drives both $\\Phi$ arguments to $+\\infty$, hence both $\\Phi\\to1$, and $K\\Phi(d_2)\\to0$. You are left with $\\exp(\\xi+\\tau^2/2)=\\E(P_t)$. Checking limiting cases like this is a fast way to verify you have written the formula down correctly." },
],

/* ================================================================ f3 */
f3: [
  { q: "For a standard Brownian motion, which pair of quantities is **independent**?",
    choices: [
      "All of $W(1)$, $W(2)$, $W(3)$ are mutually independent",
      "$W(1)$ and $W(2)$",
      "$W(2)-W(1)$ and $W(3)-W(2)$",
      "$W(1)$ and $W(2)-W(1)$ are dependent, but $W(1)$ and $W(2)$ are not",
    ], answer: 2,
    why: "The independent-increments property concerns *changes over disjoint intervals*. $W(1)$ and $W(2)$ are strongly dependent — if the path is at $+3$ at time 1 it will likely be near $+3$ at time 2. The increments over $[1,2]$ and $[2,3]$ share no overlap and are genuinely independent." },

  { q: "You simulate Brownian motion with `dW = np.random.normal(0, dt, N)` instead of `np.sqrt(dt)`. With $T=1$ and $N=10{,}000$, what goes wrong?",
    choices: [
      "The simulated path becomes discontinuous almost everywhere",
      "The simulated increments are no longer independent of one another",
      "Nothing goes wrong at all — the two are equivalent after `cumsum`",
      "The variance at time $T$ is far too small, so the path looks flat",
    ], answer: 3,
    why: "The second argument of `np.random.normal` is the **standard deviation**, not the variance. With $dt=10^{-4}$ you would be using SD $=10^{-4}$ instead of $10^{-2}$ — a hundredfold too small. Var$(W(T))$ comes out at $N\\cdot dt^2=10^{-4}$ instead of 1, so the path barely moves. This is the single most common simulation bug in the course." },

  { q: "$\\{S(t)\\}$ is a GBM with $\\nu=0$ (no drift on the log scale) and $\\sigma=0.4$. What is $\\E(S(1))/S(0)$?",
    choices: [
      "$e^{0.08}\\approx1.083$",
      "$e^{0.4}\\approx1.492$",
      "$e^{-0.08}\\approx0.923$",
      "$1$, since there is no drift",
    ], answer: 0,
    why: "$\\E(S(t))=S(0)e^{\\mu t}$ with $\\mu=\\nu+\\sigma^2/2=0+0.08=0.08$. Zero drift **on the log scale** still produces positive expected growth **on the price scale**, because exponentiating a symmetric distribution pushes the mean up. This gap between $\\mu$ and $\\nu$ is the same convexity effect as Jensen's inequality." },

  { q: "Which of the following is **not** implied by $\\{S(t)\\}$ being a geometric Brownian motion?",
    choices: [
      "$S(t_2)/S(t_1)$ and $S(t_4)/S(t_3)$ are independent for $t_1\\le t_2\\le t_3\\le t_4$",
      "$S(t_2)-S(t_1)$ is normally distributed",
      "$S(t)$ is lognormally distributed for each fixed $t$",
      "$\\log\\big(S(t_2)/S(t_1)\\big)$ is normal",
    ], answer: 1,
    why: "GBM has independent, stationary behaviour in **ratios**, not differences, and normality on the **log** scale, not the price scale. A difference of two lognormals is neither normal nor lognormal. The other three — lognormal $S(t)$, normal log ratios, independent ratios — are properties 4, 6 and 2 of GBM." },

  { q: "Under GBM, $\\log\\big(S(10)/S(5)\\big)$ and $\\log\\big(S(4)/S(1)\\big)$ have the same distribution as which single quantity?",
    choices: [
      "Neither has a known distribution without the value of $S(0)$",
      "They have the same distribution as each other, both $N(5\\nu,5\\sigma^2)$",
      "$\\log\\big(S(5)/S(0)\\big)$ and $\\log\\big(S(3)/S(0)\\big)$ respectively",
      "Both are standard normal after dividing by $\\sigma$",
    ], answer: 2,
    why: "The increment distribution depends only on elapsed time: $\\log(S(t_2)/S(t_1))\\sim N(\\nu(t_2-t_1),\\sigma^2(t_2-t_1))$. The first spans 5 units, the second spans 3, so they are *not* identically distributed — which rules out the “both $N(5\\nu,5\\sigma^2)$” choice. And $S(0)$ cancels in every log ratio, so the choice demanding $S(0)$ is wrong too." },
],

/* ================================================================ f4 */
f4: [
  { q: "A stock goes \\$100 → \\$110 → \\$99 on consecutive days. Which statement is true?",
    choices: [
      "Both the log and the simple returns are additive over the two days",
      "Neither is additive; both must be compounded multiplicatively instead",
      "The simple returns (+10%, −10%) sum to 0%, matching the two-day result",
      "The log returns sum to the two-day log return; the simple returns do not",
    ], answer: 3,
    why: "Log returns: $\\log(1.1)+\\log(0.9)=0.0953-0.1054=-0.0101=\\log(99/100)$. ✓ Simple returns: $+10\\%-10\\%=0\\%$, but the true two-day simple return is $-1\\%$. ✗ Simple returns compound as $(1+R_1)(1+R_2)-1$; only logs add." },

  { q: "Under the lognormal pricing model, a daily log return has SD $0.02$. Assuming 252 trading days, what is the SD of the annual log return?",
    choices: [
      "$0.02\\times\\sqrt{252}\\approx0.317$",
      "$0.02/\\sqrt{252}\\approx0.0013$",
      "$0.02$, unchanged — SD does not depend on horizon",
      "$0.02\\times252=5.04$",
    ], answer: 0,
    why: "The $k$-period log return is $N(\\nu k,\\sigma^2 k)$. The **variance** scales with $k$, so the **SD** scales with $\\sqrt{k}$: $0.02\\sqrt{252}\\approx0.317$, i.e. about 32% annualized volatility. Multiplying the SD by $k$ instead of $\\sqrt{k}$ is the classic error." },

  { q: "Empirically, log *monthly* returns look closer to normal than log *daily* returns. What is the standard explanation?",
    choices: [
      "Monthly data has fewer observations, so normality tests lose their power",
      "A monthly return is a sum of ~21 daily returns, so the CLT pulls it toward normality",
      "Monthly returns are computed from adjusted prices while daily returns are not",
      "The Black-Scholes theory guarantees normality at all longer horizons",
    ], answer: 1,
    why: "Log returns *add* across periods, so the monthly return is literally a sum of the daily ones — the CLT setting. The “fewer observations, so less power” choice describes a real statistical effect, but it is not the substantive reason: the monthly *distribution* is genuinely closer to normal, not merely harder to reject." },

  { q: "The CLT argument suggests short-horizon log returns should be approximately normal. Why does it fail in practice?",
    choices: [
      "Log returns have infinite variance, so the CLT simply does not apply here",
      "The CLT requires the summands themselves to be normal to begin with, which fails",
      "Short-horizon log returns are neither independent nor identically distributed",
      "The CLT applies only to sums of at least thirty independent and identical terms",
    ], answer: 2,
    why: "The CLT needs iid (or near enough) summands with finite variance. Real returns violate both halves: volatility varies over time (not identically distributed) and squared returns are autocorrelated (not independent). Infinite variance is a real alternative theory for some markets, but it is not the course's explanation." },

  { q: "For a daily log return of $r_t=0.0198$, the corresponding simple return $R_t$ is approximately:",
    choices: [
      "exactly $0.0198$",
      "$0.0396$ — about double",
      "$0.0196$ — slightly smaller than $r_t$",
      "$0.0200$ — slightly larger than $r_t$",
    ], answer: 3,
    why: "$R_t=e^{r_t}-1=e^{0.0198}-1\\approx0.0200$. Since $\\log(1+x)\\le x$, the log return is always slightly *below* the simple return for positive moves — and the gap grows with the size of the move. At daily magnitudes the difference is in the fourth decimal, which is why the approximation $r_t\\approx R_t$ is safe there and unsafe for annual figures." },
],

/* ================================================================ f5 */
f5: [
  { q: "A kernel density estimate of 500 observations is built with $h=0.01$ when the data span roughly $[-3,3]$. What will the plot look like, and why?",
    choices: [
      "A spiky curve with roughly one bump per observation — the estimator has high variance",
      "A flat line, because the bandwidth is below the resolution of the data itself",
      "A perfect reproduction of the true density, since small $h$ means low bias",
      "A smooth unimodal curve, because 500 observations is plenty of data",
    ], answer: 0,
    why: "With $h$ far smaller than the typical spacing between points, each kernel stays isolated and you essentially see the raw data back as spikes. That is **high variance**: resample the data and the picture changes completely. Bias is indeed low, but the estimate is useless — which is the point of the tradeoff." },

  { q: "You must estimate the density of a strongly bimodal sample and you choose the bandwidth with the `silverman` rule. What is the specific risk?",
    choices: [
      "There is no real risk at all; Silverman is optimal for any distribution",
      "Silverman is a normal-reference rule, so it may blur the two modes into one",
      "Silverman only works in combination with the Epanechnikov kernel function",
      "Silverman will under-smooth instead, producing several spurious extra modes",
    ], answer: 1,
    why: "`scott` and `silverman` are **normal-reference** rules — derived to be optimal *when the underlying distribution is normal*. A normal has one mode, so the rule picks a bandwidth appropriate for a single hump and tends to smooth genuine bimodality away. For such data prefer a cross-validation or ISJ bandwidth." },

  { q: "Two density estimators of the same data have MSE decomposed as: estimator A has bias$^2=0.01$, variance $=0.09$; estimator B has bias$^2=0.06$, variance $=0.02$. Which has the lower MSE?",
    choices: [
      "Cannot be determined without the sample size",
      "A, because it has the lower bias",
      "B, because MSE $=0.08$ versus A's $0.10$",
      "They are equal",
    ], answer: 2,
    why: "MSE $=$ bias$^2+$ variance, so A gives $0.01+0.09=0.10$ and B gives $0.06+0.02=0.08$. B wins despite being the *more biased* estimator. This is the whole content of the bias-variance tradeoff: accepting some bias to buy a larger reduction in variance is often the better deal." },

  { q: "Why is the KDE of log daily returns plotted against the fitted normal on a **logarithmic** $y$-axis?",
    choices: [
      "Because kernel density estimates are only valid on a logarithmic scale",
      "Because log returns can be negative and a log axis handles that",
      "Because the normal density becomes a straight line on a log axis, making deviations obvious",
      "Because on a linear axis both curves are crushed to zero in the tails",
    ], answer: 3,
    why: "In the tails both densities are tiny, so on a linear axis they overlap visually at zero and the comparison is useless. A log axis expands small values, revealing the empirical curve sitting well above the normal in both tails. (The “normal becomes a straight line” choice is close but wrong on the detail: $\\log$ of $e^{-x^2/2}$ is a **parabola**, not a line.)" },

  { q: "Which statement about kernel choice versus bandwidth choice is correct?",
    choices: [
      "The bandwidth matters far more; any smooth kernel performs adequately",
      "Neither matters once the sample exceeds a thousand observations",
      "Both matter roughly equally and should always be tuned jointly",
      "The kernel matters far more; the bandwidth is a purely cosmetic choice",
    ], answer: 0,
    why: "This is a standard result in density estimation and is stated explicitly in the notes: the choice of kernel is not too important, while $h$ is highly influential. The intuition is that all smooth kernels look similar once scaled — it is the *width* of the smoothing that decides whether you see real structure or noise." },
],

/* ================================================================ f6 */
f6: [
  { q: "On a normal probability plot the points form an S-curve that is **above** the reference line on the left and **below** it on the right. What does this indicate?",
    choices: [
      "Heavy tails relative to the normal",
      "Light tails relative to the normal",
      "Right skew",
      "The sample mean differs from zero",
    ], answer: 1,
    why: "Above-left and below-right means the *observed* extremes are less extreme than the normal predicts — the sample's smallest values aren't as small, and the largest aren't as large. That is **light tails** (platykurtic). Heavy tails give the opposite: below-left, above-right. Note a shifted mean would move the whole line, not bend it." },

  { q: "A distribution has skewness $\\gamma_1=0$ and kurtosis $\\gamma_2=7$. What can you conclude?",
    choices: [
      "The values are contradictory; $\\gamma_2$ cannot exceed 3 when $\\gamma_1=0$",
      "It must be normal, since the skewness is zero",
      "It is symmetric but has heavier tails than a normal",
      "It is right-skewed with heavy tails",
    ], answer: 2,
    why: "Zero skewness means symmetric, but the normal is pinned at $\\gamma_2=3$ and this has 7 — decisively leptokurtic. A symmetric heavy-tailed distribution (the $t$, say) fits exactly. This is why Jarque-Bera checks **both** moments: matching one is not enough." },

  { q: "A Jarque-Bera test on $n=3000$ log returns gives a statistic of $T=4100$. The 5% critical value from $\\chi^2_2$ is about 5.99. What is the conclusion?",
    choices: [
      "Strong evidence that the returns are drawn from a normal distribution",
      "We fail to find evidence against normality",
      "The test is inconclusive because $T$ is implausibly large",
      "Strong evidence that the returns are not drawn from a normal distribution",
    ], answer: 3,
    why: "$T=4100$ is astronomically beyond 5.99, so the p-value is effectively 0 and $H_0$ (normality) is rejected — strong evidence the sample is **not** normal. Such enormous statistics are routine for financial returns given large $n$ and fat tails. Note you can never conclude “evidence the returns *are* normal”: you cannot accept a null." },

  { q: "Why is the Shapiro-Wilk test generally preferred to Jarque-Bera?",
    choices: [
      "It uses the full ordered sample rather than a two-number summary",
      "It does not require the observations to be independent of each other",
      "It is computationally faster on large samples, so it scales better",
      "It tests a different, substantially weaker null hypothesis",
    ], answer: 0,
    why: "Jarque-Bera compresses the distribution into skewness and kurtosis, discarding information; that costs it power and it does not achieve its stated Type I error rate. Shapiro-Wilk's statistic is built from the order statistics $x_{(i)}$ themselves, so it can detect departures that leave the third and fourth moments looking normal." },

  { q: "A test has significance level $\\alpha=0.05$ and power $0.30$ against a particular alternative. Which statement is correct?",
    choices: [
      "There is only a 30% chance that the null hypothesis is true",
      "If that alternative is the truth, the test will miss it 70% of the time",
      "The test will produce a false positive 30% of the time it runs",
      "Power is the probability of correctly accepting the null hypothesis",
    ], answer: 1,
    why: "Power $=P(\\text{reject }H_0\\mid H_1\\text{ true})=0.30$, so the miss rate (Type II error) is $0.70$. Low power is a real practical hazard: failing to reject normality with a low-power test tells you almost nothing. “A 30% chance the null is true” is the classic misreading of a probability *about the data* as a probability *about the hypothesis*." },
],

/* ================================================================ f7 */
f7: [
  { q: "Which of these processes is stationary?",
    choices: [
      "A random walk $X_t=X_{t-1}+\\epsilon_t$",
      "An AR(1) with $\\phi=1.02$",
      "An ARCH(1) with $\\omega=0.1$, $\\alpha=0.5$",
      "A series with a linear time trend $X_t=0.3t+\\epsilon_t$",
    ], answer: 2,
    why: "ARCH(1) with $\\alpha<1$ is stationary — it is white noise with mean 0 and variance $\\omega/(1-\\alpha)$, even though its *conditional* variance moves around. The random walk has variance growing with $t$; the AR(1) with $|\\phi|>1$ explodes; the trending series has a mean that depends on $t$." },

  { q: "A process is stationary. Which of the following is then **guaranteed**?",
    choices: [
      "$X_t$ and $X_{t-1}$ are independent",
      "$\\E(X_t\\mid X_{t-1}=x)$ does not depend on $x$",
      "$\\Var(X_t\\mid X_{t-1}=x)$ does not depend on $x$",
      "$\\Var(X_t)$ does not depend on $t$",
    ], answer: 3,
    why: "Stationarity fixes the **unconditional** moments: $\\Var(X_t)=\\gamma_X(0)$, constant in $t$. It says nothing about conditional moments — and that freedom is exactly what AR models (varying conditional mean) and ARCH models (varying conditional variance) exploit while remaining stationary." },

  { q: "\"White noise\" and \"iid\" are not the same thing. Which example shows the difference?",
    choices: [
      "An ARCH(1) process: uncorrelated at every lag, yet the squares are dependent",
      "An AR(1) with $\\phi=0.5$: correlated, but still identically distributed throughout",
      "A deterministic sequence: independent, but certainly not identically distributed",
      "A random walk: uncorrelated increments, but strongly dependent levels over time",
    ], answer: 0,
    why: "ARCH is the textbook case. Corr$(X_t,X_{t+h})=0$ for $h\\ne0$, satisfying white noise, but $X_t^2$ and $X_{t+h}^2$ are correlated, so the values are clearly *dependent*. iid would forbid that. Uncorrelated means no **linear** relationship; independence forbids relationships of every kind." },

  { q: "For the AR(1) model $X_t=\\mu+\\phi(X_{t-1}-\\mu)+\\epsilon_t$ with $|\\phi|<1$, what happens after an unusually large value of $X_{t-1}$?",
    choices: [
      "The series tends to drift further in the same direction",
      "The series tends to be pulled back toward $\\mu$ — mean reversion",
      "The conditional variance increases",
      "Nothing systematic; the next value is independent of the last",
    ], answer: 1,
    why: "With $|\\phi|<1$ the deviation from $\\mu$ is multiplied by a factor smaller than one each step, so shocks decay and the series returns toward its mean. This is mean reversion *coexisting with* autocorrelation — a point the notes stress. The rising-conditional-variance choice describes ARCH, not AR." },

  { q: "You observe a series whose plot stays centered on zero throughout but alternates between long calm stretches and long violent ones. Which model is the best fit?",
    choices: [
      "A random walk",
      "White noise with constant variance",
      "ARCH(1) with $\\alpha$ close to 1",
      "AR(1) with $\\phi$ close to 1",
    ], answer: 2,
    why: "Centered at zero with a *spread* that comes and goes in clumps is the signature of conditional heteroskedasticity — ARCH. An AR(1) with high $\\phi$ would wander in **level**, drifting above and below the mean; a random walk would not revert at all; plain white noise would have uniform spread throughout." },
],

/* ================================================================ f8 */
f8: [
  { q: "An ADF test returns a p-value of $0.32$. Which conclusion is correct?",
    choices: [
      "We failed to find evidence that the series has a unit root",
      "Strong evidence the series is stationary",
      "Strong evidence the series is not stationary",
      "We failed to find evidence that the series is stationary",
    ], answer: 3,
    why: "$H_1$ is stationarity, so a *large* p-value means no evidence for it. Crucially that is **not** evidence *against* stationarity — failing to reject a null never establishes it. “Strong evidence the series is not stationary” is the direction error the exam is looking for, and “no evidence of a unit root” inverts which hypothesis is the null." },

  { q: "You apply `adfuller` to a series with an obvious upward linear trend using the default settings. What is the concern?",
    choices: [
      "The default `regression=\"c\"` fits only a constant, so a real trend is unmodelled",
      "The default already handles trends, so there is nothing to worry about",
      "`adfuller` cannot legitimately be applied to trending data at all",
      "The default `regression=\"n\"` forces the series mean to be zero",
    ], answer: 0,
    why: "The default is `\"c\"` — constant, non-zero mean, no trend. For a trend-stationary series $Y_t=f(t)+\\delta_t$ you want `regression=\"ct\"` so the linear trend is fitted and the test can assess stationarity of the *deviations*. (`\"n\"` is the classic no-constant Dickey-Fuller.)" },

  { q: "Why is it economically unsurprising that a raw stock price series fails the stationarity test?",
    choices: [
      "Because prices are always strictly positive and stationarity requires symmetry",
      "Because stationarity implies mean reversion, which would be a money machine",
      "Because prices are recorded only once a day rather than in continuous time",
      "Because the ADF test has notoriously low power on very long return series",
    ], answer: 1,
    why: "A stationary price would revert to a fixed long-run level, so you could reliably buy below it and sell above it. Markets do not hand out free money, so prices should not be stationary — and empirically the ADF p-value for AMGN prices is about 0.95. Returns, by contrast, test stationary at $p\\approx10^{-30}$." },

  { q: "Ljung-Box with $H=10$ gives $p=0.61$; with $H=20$ it gives $p=0.03$. How should you read this?",
    choices: [
      "The two results contradict each other, so the test is invalid here",
      "There is no autocorrelation at any lag up to 10, and definitely some at lag 20",
      "Pooling over 20 lags picked up dependence the first 10 lags did not reveal",
      "The $H=20$ result must be a false positive since the $H=10$ result was insignificant",
    ], answer: 2,
    why: "Ljung-Box is a **joint** test over lags $1..H$; changing $H$ changes the question. Structure sitting at lags 11-20 can be invisible at $H=10$ and detectable at $H=20$. $H$ is left to the experimenter, which is exactly why you should report it and why results across $H$ are not contradictory." },

  { q: "Ljung-Box on 3000 daily returns yields $p=0.004$, indicating real autocorrelation. Your colleague proposes a trading strategy on that basis. What is the strongest objection?",
    choices: [
      "The test assumes normality, which log returns clearly violate",
      "The p-value is not small enough to act on",
      "Autocorrelation in returns is mathematically impossible, so the test must be wrong",
      "With $n=3000$ even economically trivial correlations become detectable",
    ], answer: 3,
    why: "This is the statistical-versus-practical significance point. Large samples make tiny effects detectable; detectable is not the same as tradeable. The measured correlations are real but minute, and the bid-ask spread plus commissions consume any edge. The notes make exactly this argument." },
],

/* ================================================================ f9 */
f9: [
  { q: "Daily log returns have SD $0.015$. What is the approximate annualized volatility (252 trading days)?",
    choices: [
      "$0.015\\times\\sqrt{252}\\approx0.238$, i.e. about 24%",
      "$\\sqrt{0.015\\times252}\\approx1.94$",
      "$0.015$, i.e. 1.5% — volatility is horizon-free",
      "$0.015\\times252\\approx3.78$, i.e. 378%",
    ], answer: 0,
    why: "Annualize the **variance** by 252 then square-root: $\\sqrt{252\\times0.015^2}=0.015\\sqrt{252}\\approx0.238$. In code this is `ldr.std() * np.sqrt(252)`. Scaling the SD by 252 directly (option a) is the standard blunder and gives a nonsensical answer." },

  { q: "Two otherwise identical call options differ only in the volatility of the underlying: $\\sigma_A=0.2$, $\\sigma_B=0.6$. Which is worth more, and why?",
    choices: [
      "A, because lower volatility means the option is more likely to finish in the money",
      "B, because although the probability of expiring worthless rises, the unbounded upside grows faster",
      "They are worth the same, since volatility affects only variance and the payoff depends on the mean",
      "B, but only if the option is currently in the money",
    ], answer: 1,
    why: "Higher $\\sigma$ fattens *both* tails. The downside is capped — worthless is worthless, whether you miss by \\$1 or \\$50 — while the upside is unbounded and pays proportionally more the further it goes. The asymmetry means expected payoff rises with $\\sigma$, which is why volatility is a crucial pricing input and why implied volatility is quoted at all." },

  { q: "The ACF of a return series shows nothing significant, but the ACF of the **squared** returns shows large positive values at lags 1-5. What does this tell you?",
    choices: [
      "The returns must be an iid sequence",
      "There is a linear trend in the return series",
      "The returns are uncorrelated but not independent",
      "The squaring operation has induced spurious correlation",
    ], answer: 2,
    why: "Zero autocorrelation in levels means no *linear* predictability of direction. Positive autocorrelation in squares means the *size* of moves is predictable: big days follow big days. Uncorrelated-but-dependent is precisely volatility clustering, and it is the empirical fact ARCH/GARCH were invented to model." },

  { q: "You compare rolling realized volatility for a real stock against a series simulated from the lognormal pricing model with matched mean and SD. What difference do you expect?",
    choices: [
      "The real series will trend upward while the simulated one stays flat",
      "The simulated series will show larger swings, because simulation adds noise",
      "Both will look the same — that is the whole point of matching the SD",
      "The real series will show sustained periods of high and low volatility",
    ], answer: 3,
    why: "Matching the *overall* SD matches the average level of volatility, not its dynamics. The lognormal model assumes constant $\\sigma$, so its rolling estimate only wiggles from sampling noise. The real series swings from ~0.3 to above 1.0 and *persists* there for months. That visible gap is the case against the Part 1 model." },

  { q: "Under the lognormal pricing model with scaling $\\sigma$, the SD of the log return over $k$ periods is $\\sigma\\sqrt{k}$. What does this imply about comparing a 1-day and a 4-day return?",
    choices: [
      "The 4-day return has 2 times the SD of the 1-day return",
      "The 4-day return has 16 times the SD of the 1-day return",
      "They have the same SD, since the drift also scales",
      "The 4-day return has 4 times the SD of the 1-day return",
    ], answer: 0,
    why: "SD scales as $\\sqrt{k}$, so going from $k=1$ to $k=4$ multiplies it by $\\sqrt{4}=2$. The *variance* quadruples, but the SD only doubles. This square-root-of-time rule is the same one behind the $\\sqrt{252}$ annualization factor." },
],

/* ================================================================ f10 */
f10: [
  { q: "An ARCH(1) is fitted with $\\widehat\\omega=0.2$ and $\\widehat\\alpha_1=0.6$. What is the unconditional variance of the process?",
    choices: [
      "$0.2$",
      "$0.5$",
      "$0.8$",
      "$0.12$",
    ], answer: 1,
    why: "For a stationary ARCH(1), Var$(X_t)=\\omega/(1-\\alpha_1)=0.2/0.4=0.5$. Note this exceeds $\\omega$ itself: the feedback from past squared values inflates the long-run variance above the constant term. If $\\alpha_1$ approached 1 the unconditional variance would blow up — which is the stationarity condition in disguise." },

  { q: "Which statement about an ARCH(1) process with $\\alpha_1<1$ is correct?",
    choices: [
      "It is nonstationary whenever $\\alpha_1>0$",
      "It is autocorrelated at lag 1, with correlation $\\alpha_1$",
      "It is white noise, so Corr$(X_t,X_{t+h})=0$ for $h\\ne0$, but it is not iid",
      "It is iid, since $\\epsilon_t$ is iid",
    ], answer: 2,
    why: "The process has zero mean and zero autocorrelation at every nonzero lag — it satisfies white noise. But successive values are *dependent*, because a large $X_{t-1}^2$ inflates the conditional variance of $X_t$. Independence would rule that out. This uncorrelated-but-dependent structure is the entire design goal." },

  { q: "A GARCH(1,1) fit reports $\\widehat\\alpha_1=0.09$ and $\\widehat\\beta_1=0.93$. What should you notice?",
    choices: [
      "$\\beta_1>\\alpha_1$, which is impossible for a valid GARCH fit",
      "The fit is fine; the coefficients are individually below 1",
      "$\\alpha_1$ is too small for the model to be identified",
      "$\\alpha_1+\\beta_1=1.02>1$, violating the stationarity condition",
    ], answer: 3,
    why: "The stationarity condition is $\\sum(\\alpha_i+\\beta_i)<1$, and $0.09+0.93=1.02$ fails it. That signals an integrated (IGARCH-like) fit where shocks to volatility never fully die out and the unconditional variance is undefined. Fitted equity GARCH models often sit just *below* 1 (e.g. 0.948) — crossing it is a red flag worth reporting." },

  { q: "Why can GARCH capture strong volatility persistence with fewer parameters than ARCH?",
    choices: [
      "Because $\\beta\\sigma_{t-j}^2$ recycles the smoother past-variance series",
      "Because GARCH allows negative coefficients, giving more flexibility",
      "Because GARCH models the conditional mean as well as the variance",
      "Because GARCH uses a completely different likelihood function",
    ], answer: 0,
    why: "$X_t$ carries the extra randomness of $\\epsilon_t$, so $X_{t-i}^2$ is a noisy proxy for volatility; $\\sigma_{t-j}^2$ is the smoothed quantity itself. Regressing on the cleaner signal carries information forward efficiently — one $\\beta$ does the work of many $\\alpha$ lags. Note GARCH requires $\\beta_j\\ge0$, so the “allows negative coefficients” choice is simply false." },

  { q: "Four models are fitted to the same return series: ARCH(2) AIC $=900.3$, ARCH(3) AIC $=890.6$, GARCH(1,1) AIC $=832.3$, GARCH(2,2) AIC $=835.1$. Which is preferred and what does the GARCH(2,2) result show?",
    choices: [
      "GARCH(2,2), because more parameters always fit the data better",
      "GARCH(1,1); GARCH(2,2) shows extra parameters can worsen the AIC",
      "ARCH(3), because it is the simplest adequate model available",
      "You cannot compare ARCH and GARCH models by AIC at all",
    ], answer: 1,
    why: "Lower AIC wins, so GARCH(1,1) at 832.3. GARCH(2,2) fits the training data at least as well in raw likelihood terms, yet scores *worse* once $2(\\#\\text{params})$ is charged — the penalty term doing its job. AIC *is* comparable across model families fitted to the same data, so the “cannot compare ARCH and GARCH” choice is false." },
],

/* ================================================================ f11 */
f11: [
  { q: "\\$1000 is invested at an annual rate of 6% with continuous compounding. What is the value after 2 years?",
    choices: [
      "$1000\\,e^{0.06}\\approx\\$1061.84$",
      "$1000(1.06)^2\\approx\\$1123.60$",
      "$1000\\,e^{0.12}\\approx\\$1127.50$",
      "$1000(1+0.06\\times2)=\\$1120.00$",
    ], answer: 2,
    why: "Continuous compounding gives $P_t=P_0e^{rt}=1000e^{0.06\\times2}=1000e^{0.12}\\approx1127.50$. $1000(1.06)^2$ is annual compounding and $1000(1+0.06\\times2)$ is simple interest — both under-state it, since more frequent compounding always pays more. $1000e^{0.06}$ forgets to multiply the rate by the 2-year horizon." },

  { q: "A put option has spot $P_0=\\$90$ and strike $K=\\$100$. What is its moneyness status and the sign of $M=\\log(P_0/K)$?",
    choices: [
      "In the money; $M>0$",
      "At the money; $M=0$",
      "Out of the money; $M<0$",
      "In the money; $M<0$",
    ], answer: 3,
    why: "A put is the right to **sell** at $K$. Selling at \\$100 when the market pays \\$90 is profitable, so the put is **in the money**. And $M=\\log(90/100)<0$. The trap is that $M<0$ means *out* of the money for a **call** — the labels invert between calls and puts while the formula for $M$ does not." },

  { q: "Of the five Black-Scholes inputs, which two are **not** known at time zero?",
    choices: [
      "The drift $\\nu$ and the volatility $\\sigma$",
      "The spot price $P_0$ and the volatility $\\sigma$",
      "The strike $K$ and the spot price $P_0$",
      "The time to expiration $t$ and the strike $K$",
    ], answer: 0,
    why: "$K$, $t$ and $P_0$ are all observable today — they are contract terms and a market quote. The drift $\\nu$ and volatility $\\sigma$ describe the *future* behaviour of the price and must be estimated or calibrated. That is precisely why a pricing formula needs the statistics of Parts 2-4." },

  { q: "Under the **risk-neutral measure** $\\mathbb{Q}$, what should the log-scale drift $\\nu$ be set to?",
    choices: [
      "$\\nu=r-\\sigma^2/2$, where $r$ is the risk-free rate",
      "$\\nu=r$, the risk-free rate itself",
      "$\\nu=\\mu$, the observed drift in market data",
      "$\\nu=0$, since risk-neutral investors expect no growth",
    ], answer: 0,
    why: "Risk-neutrality says the price should grow at the **risk-free rate**, or there would be an arbitrage — so the *price-scale* drift is $\\mu=r$. But the formula takes the **log-scale** drift, and $\\mu=\\nu+\\sigma^2/2$, so $\\nu=r-\\sigma^2/2$. Setting $\\nu=r$ directly is the trap: it confuses the two scales. Calibrating to the observed drift instead is the **real-world** measure $\\mathbb{P}$." },

  { q: "An option's market price implies a volatility of 38%, while the realized volatility over the past year was 25%. What does the gap most directly represent?",
    choices: [
      "An arbitrage opportunity of about 13 percentage points",
      "A calculation error, since implied and realized volatility must agree",
      "The market's forward-looking expectation of future volatility",
      "The leverage effect applied to the historical returns",
    ], answer: 2,
    why: "Implied volatility is obtained by solving the pricing formula *backwards* from the market price, so it encodes the market's expectation of volatility over the option's remaining life. Realized volatility is a backward-looking measurement. They answer different questions, and a gap is normal — commonly positive, since buyers pay up for protection." },
],

/* ============================================================ pandas */
p1: [
  { q: "`df[\"price\"]` and `df[[\"price\"]]` differ in what way?",
    choices: [
      "The first returns a copy while the second returns a view",
      "The second raises an error unless multiple columns are named",
      "They are identical; the extra pair of brackets is ignored",
      "The first returns a Series (1-D), the second a DataFrame (2-D)",
    ], answer: 3,
    why: "Single brackets with a string select one column as a **Series**; passing a *list* of names returns a **DataFrame**, even when the list has one element. This matters because many libraries expect 2-D features and 1-D targets — `.shape` will be `(n,)` versus `(n, 1)`." },

  { q: "You build `pd.DataFrame({\"a\": s1, \"b\": s2})` where `s1` has index `[0,1,2]` and `s2` has index `[1,2,3]`. What happens?",
    choices: [
      "The result has index `[0,1,2,3]`, with NaN where a Series had none",
      "The result has index `[1,2]`, keeping only the overlapping labels",
      "`s2` is silently reindexed to match `[0,1,2]`",
      "An error is raised, because the indexes do not match",
    ], answer: 0,
    why: "pandas **aligns on the index** rather than on position. The union of the two indexes becomes the result's index, and any missing combination is filled with `NaN`. This alignment is a feature — it prevents silent off-by-one errors — but it surprises people expecting positional stacking." },

  { q: "What is the most accurate description of a DataFrame's relationship to a Series?",
    choices: [
      "A DataFrame is a list of Series with mutually independent indexes",
      "A DataFrame is a dict-like collection of Series sharing one index",
      "A Series is just a DataFrame with a single row",
      "They are unrelated types that happen to share similar methods",
    ], answer: 1,
    why: "Each column is a Series, and all of them are aligned to one shared row index — which is what makes column arithmetic like `df[\"a\"] / df[\"b\"]` well-defined elementwise. A Series is one **column**, not one row (option c)." },

  { q: "For a price Series indexed by date, why does the index matter more than it would for a list of numbers?",
    choices: [
      "It makes the Series immutable and hashable",
      "It doesn't matter; the index is purely cosmetic here",
      "It enables date-aware operations like `.resample()`",
      "It is required for `.mean()` to work on the Series",
    ], answer: 2,
    why: "A `DatetimeIndex` unlocks the time-series machinery this course depends on: resampling daily to monthly, aligning two series by date rather than position, and slicing with `prices[\"2024\"]`. Without it you have a bare array and must track dates by hand." },

  { q: "`type(df[\"col\"])` returns `pandas.core.series.Series`. You pass it to a function expecting a 2-D array and get an error. What is the minimal fix?",
    choices: [
      "`pd.DataFrame(df)`",
      "`df[\"col\"].reset_index()`",
      "`df[\"col\"].to_numpy()`",
      "`df[[\"col\"]]`",
    ], answer: 3,
    why: "Double brackets return a one-column DataFrame, shape `(n, 1)` — exactly what a 2-D-expecting API wants. `.to_numpy()` on a Series still gives a 1-D array; `reset_index()` adds an index column you did not ask for." },
],

p2: [
  { q: "You save with `df.to_csv(\"out.csv\")` and reload with `pd.read_csv(\"out.csv\")`. The result has an extra column called `Unnamed: 0`. Why?",
    choices: [
      "`to_csv` wrote the index as a column; pass `index=False`",
      "`read_csv` always adds a row-number column by default",
      "The DataFrame had a duplicate column name in it",
      "The file was corrupted while it was being written",
    ], answer: 0,
    why: "`to_csv` writes the index by default. On reload, that unnamed column of row numbers becomes ordinary data. Fix it at write time with `index=False`, or at read time with `index_col=0`. Round-tripping a file repeatedly without this accumulates columns." },

  { q: "You want to read a CSV from GitHub directly into pandas. What must you use?",
    choices: [
      "The ordinary `github.com/...` page URL works fine",
      "The `raw.githubusercontent.com` (\"raw\") link, not the page URL",
      "A local download first; pandas cannot read from URLs",
      "`pd.read_html` in place of `pd.read_csv` here",
    ], answer: 1,
    why: "The normal GitHub URL serves an HTML page with the file *displayed* inside it; `read_csv` would try to parse that markup. The raw link serves the file bytes themselves. pandas reads URLs fine — it just needs to be pointed at actual CSV content." },

  { q: "A CSV has dates in the first column. Which read gives you a time-series-ready object in one step?",
    choices: [
      "`pd.read_csv(f, dtype=\"datetime\").set_index(0)`",
      "`pd.read_csv(f)` on its own",
      "`pd.read_csv(f, index_col=0, parse_dates=True)`",
      "`pd.read_csv(f).set_index(\"date\")`",
    ], answer: 2,
    why: "`index_col=0` makes the first column the index and `parse_dates=True` converts it to a real `DatetimeIndex`. Without `parse_dates` you get an index of *strings*, which silently disables `.resample()` and date slicing while still looking correct when printed." },

  { q: "Which statement about writing files in Google Colab is correct?",
    choices: [
      "Colab is simply unable to write files to its local disk at all",
      "`to_csv` automatically saves the resulting file into your Google Drive",
      "Files written into the working directory persist there indefinitely",
      "Files in the working directory are lost when the runtime recycles",
    ], answer: 3,
    why: "Colab's local filesystem is ephemeral. `drive.mount('/content/drive')` attaches your Drive, after which paths under `/content/drive/MyDrive/...` survive the session. Forgetting this loses work in a way that is easy to blame on the code." },

  { q: "For a price Series indexed by date, should you export with `index=False`?",
    choices: [
      "No — the dates *are* the index, so you would lose the time information",
      "It makes no practical difference for a time series",
      "Yes, because the dates are stored in a separate metadata block",
      "Yes — `index=False` is always the right default to use",
    ], answer: 0,
    why: "`index=False` is good advice when the index is a meaningless 0,1,2… counter. For a `DatetimeIndex` the index carries the data's most important column, and dropping it leaves you with anonymous numbers. Always ask what the index *means* before discarding it." },
],

p3: [
  { q: "`df.dtypes` shows `Price` as `object`. Which sequence correctly repairs a column formatted like `\"$4,000.00\"`?",
    choices: [
      "`df[\"Price\"].astype(float, errors=\"ignore\")`",
      "`df[\"Price\"].str.replace(r\"[$,]\", \"\", regex=True).astype(float)`",
      "`pd.to_numeric(df[\"Price\"].str.strip(), errors=\"ignore\")`",
      "`df[\"Price\"].round(2).astype(float)`",
    ], answer: 1,
    why: "You must strip the non-numeric characters *before* converting. A direct `.astype(float)` raises on the `$`; `errors=\"ignore\"` silently returns the original strings, which is worse than an error because it looks like it worked." },

  { q: "`car_sales.sum()` returns a row where the `Make` entry is `\"ToyotaHondaBMW\"`. What happened, and what is the fix?",
    choices: [
      "`sum()` should be replaced by `agg(\"sum\")` throughout",
      "This is a bug in pandas; you should report it",
      "`sum()` concatenated the strings; pass `numeric_only=True`",
      "The column had a corrupted dtype, so recast it first",
    ], answer: 2,
    why: "For strings, `+` means concatenation, so summing a text column glues the values together. It is technically well-defined and almost never what you want. `numeric_only=True` restricts the operation to numeric columns." },

  { q: "What does `df.describe()` do with a column of dtype `object`?",
    choices: [
      "Raises a TypeError as soon as it hits that column",
      "Converts the column to numeric automatically first",
      "Includes it anyway, showing the mean and std as NaN",
      "Excludes it by default; use `include=\"all\"` to see it",
    ], answer: 3,
    why: "`describe()` restricts itself to numeric columns unless told otherwise. With `include=\"all\"` it adds the categorical summary — count, number of unique values, most frequent value and its frequency — which is genuinely useful for auditing a text column." },

  { q: "Which pair of calls is the fastest reliable way to spot that a dataset has missing values?",
    choices: [
      "`df.info()` and `df.isna().sum()`",
      "`df.describe()` and `df.columns`",
      "`len(df)` and `df.shape`",
      "`df.head()` and `df.tail()`",
    ], answer: 0,
    why: "`info()` prints non-null counts per column, so any column below the row total has gaps; `isna().sum()` gives the exact count per column. `head()`/`tail()` only show the ends and will miss missingness in the middle — a genuinely common trap with large files." },

  { q: "`df.shape` returns `(1000, 8)` but `df.describe()` shows only 3 columns. What does that tell you?",
    choices: [
      "997 rows were dropped",
      "Only 3 of the 8 columns are numeric",
      "The DataFrame is corrupted",
      "`describe()` samples the data for speed",
    ], answer: 1,
    why: "`describe()` defaults to numeric columns only, so 3 numeric plus 5 non-numeric accounts for it. This is a useful quick diagnostic: if a column you *expect* to be numeric is missing from `describe()`, it arrived as text." },
],

p4: [
  { q: "A DataFrame has index labels `[10, 20, 30, 40]`. What does `df.loc[10:30]` return?",
    choices: [
      "An error, because the labels are not consecutive integers",
      "Rows with labels 10 and 20 — endpoint excluded",
      "Rows with labels 10, 20 and 30 — endpoint included",
      "Rows in positions 10 through 30, i.e. an empty result",
    ], answer: 2,
    why: "`.loc` slices by **label** and is **inclusive** of the endpoint — unlike every other kind of Python slicing. So you get labels 10, 20 and 30. (`.iloc[10:30]` would be positional and would return nothing here, since there are only 4 rows.)" },

  { q: "Why does `df[df[\"a\"] > 5 & df[\"b\"] < 3]` fail?",
    choices: [
      "You cannot combine two boolean conditions inside a single mask",
      "The two columns must be of the same dtype",
      "`&` is invalid in pandas; you must write `and`",
      "`&` binds tighter than `>`, so each condition needs parentheses",
    ], answer: 3,
    why: "Python's operator precedence puts `&` above `<` and `>`, so the expression is parsed as `df[\"a\"] > (5 & df[\"b\"]) < 3`. Write `df[(df[\"a\"] > 5) & (df[\"b\"] < 3)]`. Note `and` would fail too, since it demands a single truth value from an array." },

  { q: "A Series has index `[3, 3, 9, 12]`. What is the difference between `s.loc[3]` and `s.iloc[3]`?",
    choices: [
      "`s.loc[3]` returns the two rows labelled 3; `s.iloc[3]` the fourth row",
      "`s.loc[3]` errors out because the label 3 is duplicated",
      "They are equivalent whenever the index happens to be integer-valued",
      "They both return the value sitting at position 3",
    ], answer: 0,
    why: "`.loc` matches **labels** and returns *all* matches, so a duplicated label yields multiple rows. `.iloc` counts **positions** from zero, so index 3 is the fourth element. “Equivalent whenever the index happens to be integer-valued” is the dangerous half-truth: with integer labels they coincide only when the labels happen to equal the positions." },

  { q: "Which expression selects the `Colour` column for every row, using label-based indexing?",
    choices: [
      "`df.loc[\"Colour\"]`",
      "`df.loc[:, \"Colour\"]`",
      "`df.iloc[:, \"Colour\"]`",
      "`df.loc[:][\"Colour\"]` is the only valid form",
    ], answer: 1,
    why: "`.loc[rows, cols]` takes both axes, and `:` means \"all\" along that axis. `df.loc[\"Colour\"]` would look for a *row* labelled Colour; `.iloc` takes integers only, never names." },

  { q: "You filter with `big = df[df[\"x\"] > 100]` and then assign `big[\"y\"] = 0`. pandas warns about setting on a copy. Why?",
    choices: [
      "`y` must already exist in the frame before assignment",
      "The warning is spurious here and can safely be ignored",
      "Boolean filtering may return a view or a copy of the data",
      "You cannot assign to a filtered DataFrame under any circumstances",
    ], answer: 2,
    why: "Chained selection then assignment is ambiguous — pandas cannot guarantee whether `big` shares memory with `df`. If you meant to modify `df`, use `df.loc[df[\"x\"] > 100, \"y\"] = 0`. If you meant a standalone object, make the copy explicit with `.copy()`." },
],

p5: [
  { q: "`df[\"Make\"].str.lower()` runs without error, but `df` is unchanged. Why?",
    choices: [
      "The column was not actually of dtype string to begin with",
      "`.lower()` would require `inplace=True` in order to work",
      "The `.str` accessors are read-only in pandas by design",
      "Most pandas methods return a **copy**; assign it back",
    ], answer: 3,
    why: "Non-mutating-by-default is the pandas convention. Write `df[\"Make\"] = df[\"Make\"].str.lower()`. This is the single most common source of \"my code ran but nothing happened\" — and it applies to `rename`, `drop`, `fillna`, `sort_values` and most of the rest." },

  { q: "You fill a column's missing values with its mean. What is the statistical cost?",
    choices: [
      "It keeps the mean but shrinks the variance and weakens correlations",
      "It shifts the column's mean upward noticeably",
      "It converts the whole column to dtype object",
      "None at all — mean imputation is unbiased in every respect",
    ], answer: 0,
    why: "Every imputed value sits exactly at the centre, so the spread of the column falls and its relationships with other columns are diluted toward zero. The mean survives; almost nothing else does. Whether that trade is acceptable depends on *why* the data are missing." },

  { q: "`df.drop(\"Price\", axis=1)` versus `df.drop(\"Price\", axis=0)` — what is the difference?",
    choices: [
      "`axis=1` drops the first column regardless of its name",
      "`axis=1` drops the column; `axis=0` looks for a **row** labelled `Price`",
      "They are exactly equivalent; `axis` only affects the performance",
      "`axis=0` drops the column while `axis=1` drops the row",
    ], answer: 1,
    why: "**axis=0 is rows, axis=1 is columns** — the convention that trips everyone up. It is worth internalizing via aggregation too: `.mean(axis=1)` averages *across* columns, producing one value per row." },

  { q: "After `shuffled = df.sample(frac=1)`, why is `reset_index(drop=True)` usually the next call?",
    choices: [
      "Because it is required before you can do any further filtering at all",
      "Because `sample` corrupts the underlying index values as it shuffles",
      "Because the shuffled rows keep their original, now-scrambled labels",
      "Because `sample(frac=1)` returns a Series instead of a whole DataFrame",
    ], answer: 2,
    why: "Shuffling reorders rows but each row carries its original label, so you get an index like 7, 2, 9, 0. `reset_index()` renumbers it — and without `drop=True` the old index is *preserved as a new column*, which is rarely wanted." },

  { q: "Which is preferable for converting kilometres to miles across a column, and why?",
    choices: [
      "A `for` loop over `df.iterrows()` — the most explicit option",
      "They all perform identically in practice",
      "`df[\"km\"].apply(lambda x: x / 1.6)` — clearest intent",
      "`df[\"km\"] / 1.6` — vectorized, so substantially faster",
    ], answer: 3,
    why: "Plain column arithmetic is vectorized in C and operates on the whole array at once. `.apply` calls a Python function per element and is typically an order of magnitude slower; `iterrows` is slower still. Reserve `.apply` for logic that cannot be expressed as array operations." },
],

p6: [
  { q: "`df.groupby(\"Make\")` prints `<DataFrameGroupBy object ...>` rather than data. Why?",
    choices: [
      "`groupby` is lazy; nothing computes until you aggregate",
      "You must call `.compute()` on it first",
      "The grouping column contains missing values throughout",
      "The grouping operation silently failed",
    ], answer: 0,
    why: "`groupby` returns an object describing *how* to split the data. Nothing is evaluated until you ask for a result — `.mean()`, `.size()`, `.agg([...])`. This laziness is what lets pandas plan the whole operation efficiently." },

  { q: "What is the difference between `df.groupby(\"g\").size()` and `df.groupby(\"g\").count()`?",
    choices: [
      "They are completely identical in every case",
      "`size()` counts rows; `count()` counts **non-null** values",
      "`count()` includes the group key as an extra row",
      "`size()` only works on numeric data columns",
    ], answer: 1,
    why: "`size()` counts rows regardless of missingness and gives a single Series. `count()` counts non-null entries *per column*, so a group with NaNs shows different numbers across columns. When the two disagree you have located your missing data." },

  { q: "`pd.crosstab(df[\"Make\"], df[\"Doors\"])` produces what, and what is a natural next step?",
    choices: [
      "A merged DataFrame; next, reset the index on it",
      "A scatter plot; next, add a fitted regression line",
      "A contingency table of counts; next, a chi-squared test",
      "A correlation matrix; next, take its leading eigenvalues",
    ], answer: 2,
    why: "`crosstab` cross-tabulates two categoricals into a counts table — pandas' answer to R's `table(x, y)`. Chi-square contingency testing is the standard follow-up, and it accepts the crosstab directly." },

  { q: "`car_sales[\"Odometer\"].plot()` produces a line chart, but you wanted a distribution. What should you call?",
    choices: [
      "`.plot.scatter()`",
      "`.describe().plot()`",
      "`.plot(kind=\"line\")`",
      "`.hist()` or `.plot.hist()`",
    ], answer: 3,
    why: "`Series.plot()` defaults to a line chart, which plots values against index order — meaningless for unordered data. `.hist()` bins the values and shows the distribution. pandas wraps matplotlib, so both are one-liners during exploration." },

  { q: "`df.groupby(\"Make\").mean()` raises a TypeError on a DataFrame containing text columns. What is the fix?",
    choices: [
      "`mean(numeric_only=True)`, or select the column first",
      "Convert the text columns to categorical first",
      "Use `.agg(\"mean\")` instead, which ignores the dtypes",
      "Drop all of the text columns permanently first",
    ], answer: 0,
    why: "`numeric_only=True` restricts the aggregation to columns where a mean is meaningful. Alternatively be explicit: `df.groupby(\"Make\")[\"Price\"].mean()` — usually clearer, since it states which quantity you are averaging." },
],

p7: [
  { q: "Why does `np.log(prices).diff()` produce a leading `NaN`?",
    choices: [
      "Because `np.log` is undefined for the very first observation",
      "Because `.diff()` needs a predecessor and the first row has none",
      "Because the price index itself starts at zero",
      "Because `diff` drops the first row and pads out the end",
    ], answer: 1,
    why: "Differencing needs a previous value, and the first row has none, so the result is `NaN` by construction. Leaving it in will break `adfuller`, `plot_acf` and `arch_model` downstream — hence the habitual `.dropna()`." },

  { q: "`prices.pct_change()` and `np.log(prices).diff()` — which is which, and when does the difference matter?",
    choices: [
      "They differ only in the way they handle missing values",
      "Both give log returns; the two are interchangeable",
      "`pct_change` gives simple returns; the other gives log returns",
      "`pct_change` gives log returns; the other gives simple returns",
    ], answer: 2,
    why: "`pct_change` computes $P_t/P_{t-1}-1=R_t$. Only the log version is additive across periods, so summing daily values to get a monthly return requires logs. For small daily moves the two agree to several decimals, which is exactly why the mix-up survives so long undetected." },

  { q: "`ldrEQ.rolling(50).std()` produces 49 leading NaNs. Why, and what does that imply for the annualized version?",
    choices: [
      "The NaNs mean the window size exceeds the length of the data",
      "`.std()` requires at least 50 non-null values globally present",
      "It is a bug; the window should produce a value from row 1",
      "The first complete 50-observation window only ends at row 50",
    ], answer: 3,
    why: "A rolling window needs `w` observations before it can report anything, so rows 1-49 are `NaN`. Multiplying by $\\sqrt{252}$ preserves the NaNs (NaN times anything is NaN), so `.dropna()` is needed either way — the order does not matter." },

  { q: "Why does `arch_model(...)` warn unless you pass `rescale=True` on log return data?",
    choices: [
      "Because log returns are tiny (~0.01), and rescaling helps the optimizer",
      "Because `rescale=True` is required for the mean to come out zero",
      "Because it converts the Series into a NumPy array first",
      "Because the arch package requires percentages rather than decimals",
    ], answer: 0,
    why: "Daily log returns are on the order of $10^{-2}$, and the variance parameters end up around $10^{-4}$ — small enough to stress the likelihood optimizer. Rescaling improves numerical performance; the fitted model is reported back on a consistent scale." },

  { q: "`monthly = prices.resample(\"ME\").last()` then `np.log(monthly).diff()`. Which identity does this illustrate?",
    choices: [
      "That monthly returns are the product of that month's daily returns",
      "That the monthly log return is the **sum** of the daily log returns",
      "That resampling actually changes the whole distribution of returns",
      "That `.last()` and `.mean()` are fully interchangeable in this case",
    ], answer: 1,
    why: "Log returns telescope: $\\log(P_{\\text{end}}/P_{\\text{start}})$ equals the sum of the daily log returns in between. So computing it from month-end prices and summing daily values agree exactly — the $k$-period identity $r_t(k)=\\sum r_{t-i}$ expressed in pandas. `.mean()` would give the *average* daily return, a different quantity." },
],

/* =============================================================== f12 */
f12: [
  { q: "The DJIA is **price-weighted**. A component announces a 2-for-1 stock split. What happens?",
    choices: [
      "The company's weight in the index is unchanged, since its market value is unchanged",
      "The company's weight in the index is halved, even though the company is worth the same",
      "The company is removed from the index until the split settles",
      "The index level doubles",
    ], answer: 1,
    why: "Price weighting makes a firm's influence depend on its **share price**, which is an arbitrary number a company can change at will. A 2-for-1 split halves the price overnight while the business is worth exactly the same, so its weight halves for no economic reason — the central criticism of the DJIA. **Market-cap** weighting (price × shares outstanding), used by the S&P 500, is immune: the share count doubles and the product is unchanged." },

  { q: "What does the VIX actually measure?",
    choices: [
      "The realized volatility of the S&P 500 over the past 30 days",
      "The implied volatility of options written on the S&P 500 index",
      "The number of S&P 500 constituents that fell on a given day",
      "The spread between the S&P 500 and the DJIA",
    ], answer: 1,
    why: "The CBOE sells options whose underlying “asset” is the value of the S&P 500 index, and the VIX tracks the **implied volatility** of those options. So it is **forward-looking** — what investors anticipate for future variability of the market as a whole — which is why it is nicknamed the *fear index*. Realized volatility over past data is the backward-looking quantity it is most often confused with." },

  { q: "Plotting the daily **change in the VIX** against the same day's **S&P 500 log return** shows what?",
    choices: [
      "No discernible relationship",
      "A strong positive relationship",
      "A strong negative relationship",
      "A relationship that is positive for small moves and negative for large ones",
    ], answer: 2,
    why: "The dominant feature is a strong **negative** relationship: on days the market falls, expected future volatility jumps; on days it rises, expected volatility eases. This is the leverage effect seen at the level of the whole market. Note it concerns **changes** — it is not a claim that volatility is high whenever prices are low." },

  { q: "Which explanation of the leverage effect is the **more widely accepted** one?",
    choices: [
      "Falling equity prices raise firms' debt-to-equity ratios, which makes those stocks riskier",
      "Rising uncertainty raises expected volatility, so investors force the price down",
      "Trading volume rises sharply after bad news, mechanically increasing the measured volatility",
      "Short-selling restrictions prevent prices from adjusting symmetrically to news",
    ], answer: 1,
    why: "The debt-to-equity story is where the **name** comes from, but the volatility-feedback story is the more widely accepted explanation: a shock raises expected volatility, risk-averse investors demand a larger expected return to hold the asset, and generating a higher *future* return requires the current price to fall **immediately**. So the effect is named after the theory that does not best explain it." },

  { q: "In the regression $\\Delta\\text{VIX}_t=\\beta_0+\\beta_1 r_t+\\beta_2\\big(r_t\\times\\mathbf{1}\\{r_t\\ge0\\}\\big)+\\epsilon_t$, what is the interaction term doing?",
    choices: [
      "Letting the **slope** differ between days with $r_t<0$ and days with $r_t\\ge0$",
      "Letting the **intercept** differ between up days and down days",
      "Correcting for autocorrelation in the VIX series",
      "Testing whether the residuals are normally distributed",
    ], answer: 0,
    why: "The interaction multiplies the return by an indicator, so it shifts the **slope** rather than the level: $\\beta_1$ is the slope on down days and $\\beta_1+\\beta_2$ on up days. Fitted on S&P 500 data the coefficient is about **37.71** and statistically significant — evidence the relationship really is asymmetric. An indicator entering on its own, without the return, would shift the intercept instead." },
],

};

export const QUIZ_PASS_MARK = 5;   // all five required
