/* StatLab — Statistical Methods in Finance: modules 6-11 (Parts 2-5) */

export const FINANCE_MODULES_2 = [

/* ===================================================================== */
{
  id: "f6",
  part: "Part 2",
  title: "QQ Plots, Skewness, Kurtosis, and Normality Tests",
  minutes: 20,
  summary: "The rest of the normality toolkit: normal probability plots, the moment-based shape measures, Jarque-Bera and Shapiro-Wilk.",
  blocks: [
    { kind: "plain", title: "What is a quantile, and what is a p-value?",
      body: "Two bits of vocabulary this module leans on constantly.\n\n**Quantile / percentile.** The 90th percentile is the value that 90% of the data falls below. \"Quantile\" is the same idea on a 0-to-1 scale. Sorting your data smallest-to-largest gives you the **order statistics**, written $x_{(1)}\\le x_{(2)}\\le\\cdots$ \u2014 and those sorted values *are* the sample quantiles. A **QQ plot** just graphs your sorted data against the sorted values a normal distribution would have produced. Same shape \u27f9 straight line.\n\n**p-value.** Suppose the boring explanation is true (the data really are normal). The p-value is the probability of seeing data at least as weird as yours. **Small p-value = your data would be surprising if the boring explanation were true**, so you reject it. A large p-value means: nothing surprising here, which is *not* the same as proving the boring explanation right." },

    { kind: "idea", title: "Normal probability plots",
      body: "A **normal probability plot** compares a **sorted** sample against the percentiles of the **standard normal** distribution. The sorted values $x_{(1)}\\le x_{(2)}\\le\\cdots\\le x_{(n)}$ are the **order statistics**.\n\nIf the sample was drawn from a normal distribution, the plot shows (approximately) a **straight line**. It is a special case of a **quantile-quantile (QQ) plot**." },

    { kind: "trap", title: "Why compare against the *standard* normal?",
      body: "Students often object: shouldn't we compare against the *best-fitting* normal? No — and this matters.\n\nChanging the mean **shifts** the points vertically; changing the SD **scales** them. Neither operation can bend a straight line. So *any* normal distribution produces a straight line, just with a different intercept and slope. Comparing against the standard normal loses nothing, and the question \"is it straight?\" answers \"is it normal?\" regardless of $\\mu$ and $\\sigma$." },

    { kind: "key", title: "Reading the tails — worth drawing until it's automatic",
      body: "Sample quantiles on the $y$-axis, theoretical on the $x$-axis.\n\n• **Heavy tails** (leptokurtic, what real returns look like): the extreme sample values are *more extreme* than normal theory predicts. The plot bends **below** the line on the left and **above** it on the right — an S-curve steepening at both ends.\n\n• **Light tails** (platykurtic): the extremes are *less extreme* than predicted. The plot **flattens** at both ends, lying above the line on the left and below it on the right — an S-curve that levels off.\n\nA quick mnemonic: **heavy tails splay outward, light tails tuck inward.**" },

    { kind: "code", title: "QQ plot in Python",
      lang: "python", file: "qq.py",
      code: `from statsmodels.graphics.gofplots import qqplot

qqplot(sc.stats.norm.rvs(size=100), line="s")
plt.show()`,
      after: "The argument `line=\"s\"` adds the reference line (standardized). Remember the import path — `statsmodels.graphics.gofplots`." },

    { kind: "math", title: "Skewness and kurtosis",
      body: "**Skewness** measures asymmetry:",
      tex: ["\\gamma_1=\\frac{\\E\\big[(X-\\mu)^3\\big]}{\\sigma^3}"],
      after: "If a distribution is **symmetric** about its mean, then $\\E(X-\\mu)^p=0$ for any **odd** $p$, so $\\gamma_1=0$.\n\n**Kurtosis** quantifies tail and peak behavior:\n\n$$\\gamma_2=\\frac{\\E\\big[(X-\\mu)^4\\big]}{\\sigma^4}.$$" },

    { kind: "key", title: "The three kurtosis words",
      body: "• **High kurtosis — *leptokurtic***: heavy tails and a sharp peak. More data in the tails *and* the center, i.e. more outliers. **This is what financial log returns look like.**\n• **Low kurtosis — *platykurtic***: light tails, flatter peak, fewer outliers than a normal.\n• **Normal kurtosis — *mesokurtic***: the normal distribution has kurtosis exactly $\\gamma_2=3$, *regardless of $\\mu$ and $\\sigma^2$*. Sometimes $\\gamma_2-3$ is reported as the **excess kurtosis**, so \"normal\" reads as 0." },

    { kind: "math", title: "Sample versions",
      body: "Using the $k$th **sample moment** $m_k=\\frac1n\\sum_{i=1}^n(x_i-\\bar x)^k$:",
      tex: ["\\widehat\\gamma_1=\\frac{m_3}{m_2^{3/2}}\\qquad\\text{and}\\qquad \\widehat\\gamma_2=\\frac{m_4}{m_2^{2}}"],
      after: "Note $m_2^{3/2}=\\widehat\\sigma^3$ and $m_2^2=\\widehat\\sigma^4$ — the sample formulas mirror the population ones exactly. These are **biased** estimators, i.e. $\\E(\\widehat\\gamma_1)\\ne\\gamma_1$; unbiased versions apply correction factors.\n\nIn Python: `scipy.stats.skew` and `scipy.stats.kurtosis`, with `bias=False` for the unbiased versions." },

    { kind: "plain", title: "Skewness and kurtosis, without the formulas",
      body: "Both are just numbers summarizing the *shape* of a distribution.\n\n**Skewness** = lopsidedness. Zero means symmetric. Positive means a longer tail to the right.\n\n**Kurtosis** = how much lives in the tails. The benchmark is the normal distribution, which scores exactly **3**. Higher than 3 means **fatter tails** \u2014 extreme events happen more often than a bell curve predicts. Lower than 3 means thinner tails.\n\nFinancial returns are famously high-kurtosis. Crashes and melt-ups happen far more often than the normal distribution says they should, which is precisely the finding of this Part.\n\nThe test on the next card is simply: *measure both numbers, and check how far they sit from (0, 3).*" },

    { kind: "math", title: "The Jarque-Bera test",
      body: "A formal hypothesis test for normality built from exactly those two numbers:",
      tex: ["T=\\frac{n}{6}\\left(\\widehat\\gamma_1^{\\,2}+\\frac{(\\widehat\\gamma_2-3)^2}{4}\\right)"],
      after: "Under $H_0$ (the data are sampled from a normal distribution), $T$ is **asymptotically chi-squared with 2 degrees of freedom**. The null is rejected for **large** values of $T$.\n\nThe structure is transparent: it penalizes skewness away from 0 and kurtosis away from 3. If both match the normal, $T\\approx 0$.\n\nIn Python: `scipy.stats.jarque_bera(ldrEQ)`." },

    { kind: "trap", title: "How to phrase a normality-test conclusion",
      body: "The test is set up as\n\n$H_0$: sample drawn from a normal distribution\n$H_1$: sample **not** drawn from a normal distribution\n\nHypothesis tests are designed to detect **strong evidence in favor of $H_1$**. So there are only two honest conclusions:\n\n1. We find **strong evidence that the sample is not normal**, or\n2. We **fail to find such evidence**.\n\nYou can *never* conclude \"the data are normal\" — that's accepting the null. For AMGN log returns the p-value is reported as 0.0 (the statistic is far out in the tail), so: strong evidence the sample is **not** drawn from a normal distribution." },

    { kind: "math", title: "Shapiro-Wilk, and the notion of power",
      body: "The Jarque-Bera test is widely used in finance but has known deficiencies: it does not achieve the specified **Type I error** probability rate, and it has **low power** in some situations.\n\n**Power** $=P(\\text{reject }H_0\\mid H_1\\text{ true})$. You want it large while holding $P(\\text{Type I error})\\le\\alpha$. JB's low power follows from the fact that it compresses the whole distribution into a **two-number summary**, losing information.\n\nThe **Shapiro-Wilk test** has better Type I error probability and power in general situations:",
      tex: ["W=\\frac{\\left(\\sum_{i=1}^{n}a_ix_{(i)}\\right)^2}{\\sum_{i=1}^{n}(x_i-\\bar x)^2}"],
      after: "where $x_{(i)}$ are the **order statistics** (sorted observations) and the $a_i$ are specially-formed coefficients. In Python: `scipy.stats.shapiro(ldrEQ)`. Because it uses the whole ordered sample rather than two moments, it sees more." },

    { kind: "check",
      q: "Which of the following is **not** a tool for assessing normality?",
      choices: ["The Ljung-Box test", "The Shapiro-Wilk test", "The Jarque-Bera test", "A normal probability plot"],
      answer: 0,
      explain: "**Ljung-Box** tests for **autocorrelation** — whether $\\rho(h)=0$ for all $h \\le H$ — and says nothing about the shape of the marginal distribution. Shapiro-Wilk and Jarque-Bera are normality tests; the normal probability plot is the graphical version." },
  ],
},

/* ===================================================================== */
{
  id: "f7",
  part: "Part 3",
  title: "Time Series Foundations and Stationarity",
  minutes: 18,
  summary: "Autocovariance, the three conditions for stationarity, what stationarity does and does not promise, and the three example models.",
  blocks: [
    { kind: "plain", title: "What does \"stationary\" actually mean?",
      body: "Forget the formal definition for a second.\n\nA series is **stationary** if it looks statistically *the same* no matter which stretch of it you examine. Chop out 2019 and chop out 2024, and the two chunks have the same average level, the same typical size of wiggle, and the same pattern of one day relating to the next.\n\nWhy anyone cares: **if the past and the future have the same statistical character, a model fit on history means something tomorrow.** If they don't, you're extrapolating from a world that no longer exists.\n\nStock *prices* are not stationary \u2014 a price near \\$10 in 2015 and near \\$400 today plainly don't share an average. Stock *returns* mostly are \u2014 daily percentage moves in 2015 look much like daily percentage moves today. That single fact is why this course studies returns rather than prices.\n\nOne more term: **covariance** measures whether two quantities move together. Positive means they rise and fall together, negative means one rises as the other falls, zero means no *linear* relationship. **Correlation** is covariance rescaled to sit between \u22121 and 1." },

    { kind: "idea", title: "From stochastic process to time series",
      body: "A **stochastic process** is a collection of random variables $\\{X_t(\\omega),\\ t\\in\\mathcal{T}\\}$ where $\\mathcal{T}$ is the **index space** and $\\omega$ is an outcome from the sample space $\\Omega$. Brownian motion was one, with $\\mathcal{T}$ the real line.\n\nA **realization** is the function $X_t(\\omega)$ of $t$ holding $\\omega$ fixed — a set of numbers indexed by $t$.\n\nA **time series** is a stochastic process for which $\\mathcal{T}$ is a set of points in time; technically $\\mathcal{T}=\\{0,\\pm1,\\pm2,\\dots\\}$, though in practice we observe only $t = 0,1,\\dots,n$.\n\nWhy do it: to **forecast** future values (or rather, to produce *predictive distributions* for them), and to **understand the generating process** — for simulation, or to see how variables correlate." },

    { kind: "math", title: "The autocovariance function (ACVF)",
      body: "",
      tex: ["\\gamma_X(r,s)=\\Cov(X_r,X_s)=\\E\\big[(X_r-\\E X_r)(X_s-\\E X_s)\\big]=\\E(X_rX_s)-\\E X_r\\,\\E X_s"],
      after: "**What it means in practical terms:** covariance measures **linear association**. If $\\Cov(X,Y)=0$ there is no linear relationship (\"uncorrelated\") — a regression line fit through a sample from $(X,Y)$ would have slope zero. $\\Cov>0$ means an increasing linear relationship, $\\Cov<0$ a decreasing one. Standardizing gives correlation:\n\n$$\\text{Corr}(X,Y)=\\frac{\\Cov(X,Y)}{\\text{SD}(X)\\,\\text{SD}(Y)}.$$" },

    { kind: "key", title: "Stationarity — the three conditions",
      body: "A time series $\\{X_t\\}$ is **stationary** if:",
      list: [
        "$\\Var(X_t)<\\infty$",
        "$\\E X_t=\\mu$ for all $t$ ($\\mu$ does not depend on $t$)",
        "$\\gamma_X(t,t+h)=\\gamma_X(s,s+h)$ for all integers $t,s,h$",
      ],
      after: "Condition 3 means the ACVF can be written as a function of the **lag only**, $\\gamma_X(h)$. And since $\\Var(X_t)=\\gamma_X(0)$, the variance is also constant in $t$.\n\n**Why we want it:** for time series methods to be useful there must be some confidence that **past behavior of the series continues into the future** — otherwise a model fit on historical data tells you nothing about tomorrow. Stationarity provides that, and it is *weaker* than assuming observations are independent (which is unrealistic for financial series).\n\nIn practical terms: condition 2 says the **unconditional (marginal) mean** doesn't change; condition 3 says the **degree of linear association doesn't change over time**." },

    { kind: "trap", title: "What stationarity does NOT say",
      body: "Stationarity does **not** imply that\n\n$$\\E(X_t\\mid X_{t-1}=x)$$\n\nis constant. Indeed, modeling how the random variables in a series **depend on each other** is one of the most important aspects of time series analysis. Likewise $\\Var(X_t\\mid X_{t-1}=x)$ **can depend on $x$** — that freedom is exactly what ARCH/GARCH will exploit in Part 4.\n\nStationarity constrains the **unconditional (marginal)** mean and variance, not the conditional ones. A consequence: stationary series exhibit **mean reversion** and **variance reversion** — over the long term they fluctuate around constant $\\mu$ and $\\sigma^2$." },

    { kind: "math", title: "Three example models",
      body: "**White noise.** If $\\E(X_t)=\\mu$, $\\Var(X_t)=\\sigma^2$, and $\\Cov(X_s,X_t)=0$ for $s\\ne t$, then $\\{X_t\\}$ is **white noise**. (Some references also require $\\mu=0$.) White noise assumptions are **weaker** than assuming $X_1,X_2,\\dots$ are iid — uncorrelated is not the same as independent. Both white noise and iid models are stationary.\n\n**AR(1)** — the classic autoregressive model of order one:",
      tex: ["X_t=\\mu+\\phi(X_{t-1}-\\mu)+\\epsilon_t"],
      after: "It is *autoregressive* because it fits $X_t$ like a regression model on **itself**; of *order one* because only the previous time step is a predictor. $\\{\\epsilon_t\\}$ is mean-zero white noise. **The AR(1) model is stationary if $|\\phi|<1$.** (If $|\\phi|\\ge1$, $\\Var(X_t)$ is not finite.) Note that an AR(1) shows mean reversion *even though* there is clear autocorrelation.\n\n**ARCH(1)** — the autoregressive conditionally heteroskedastic process of order one:\n\n$$X_t=\\epsilon_t\\sqrt{\\omega+\\alpha X_{t-1}^2},\\qquad \\omega>0,\\ 0\\le\\alpha<1.$$\n\nLarge $X_{t-1}^2$ tends to be followed by large $X_t^2$, and small by small — that's what \"conditionally heteroskedastic\" buys. But the variance still fluctuates around $\\Var(X_t)=\\sigma^2$: the model is **stationary**, and in fact $\\{X_t\\}$ is mean-zero **white noise**." },

    { kind: "code", title: "Simulating AR(1) and ARCH(1)",
      lang: "python", file: "sim.py",
      body: "Both follow the same skeleton — allocate, seed, loop. Learn the loop shape once:",
      code: `# ---- AR(1) ----
n, phi, sigma = 200, 0.7, 1.0
np.random.seed(1)
epsilon = np.random.normal(0, sigma, n)
y = np.zeros(n)
y[0] = epsilon[0]
for t in range(1, n):
    y[t] = phi * y[t-1] + epsilon[t]

# ---- ARCH(1) ----
n, omega, alpha = 200, 0.1, 0.9
np.random.seed(1)
epsilon = np.zeros(n); sigma2 = np.zeros(n)
z = np.random.normal(0, 1, n)            # standard normal innovations

sigma2[0] = omega / (1 - alpha)          # unconditional variance
epsilon[0] = np.sqrt(sigma2[0]) * z[0]
for t in range(1, n):
    sigma2[t] = omega + alpha * epsilon[t-1]**2
    epsilon[t] = np.sqrt(sigma2[t]) * z[t]`,
      after: "**Note the difference in character.** The AR(1) plot wanders in *level* — runs above and below the mean. The ARCH(1) plot stays centered at zero but wanders in *spread* — calm stretches punctuated by bursts. That's **volatility clustering**, and you should be able to identify each on sight." },

    { kind: "check",
      q: "For a stationary time series, what is necessarily true of the autocovariance $\\gamma_X(r,s)$?",
      choices: [
        "$\\gamma_X(r,s)=0$ for $r\\ne s$",
        "$\\gamma_X(r,s)$ depends only on $|r-s|$",
        "$\\gamma_X(r,s)$ is nonnegative for all $r$ and $s$",
        "$\\gamma_X(r,s)$ decreases as $|r-s|$ increases",
      ],
      answer: 1,
      explain: "Condition 3 of stationarity says the ACVF depends only on the **lag**, so it can be written $\\gamma_X(h)$. Option (a) describes white noise (a special case, not a requirement); (c) is false — autocovariances can be negative (an AR(1) with $\\phi<0$); (d) is a common pattern but not required." },
  ],
},

/* ===================================================================== */
{
  id: "f8",
  part: "Part 3",
  title: "Unit Root Tests, the ACF, and Ljung-Box",
  minutes: 18,
  summary: "How to test stationarity (ADF), how to measure serial dependence (ACF), and how to test it formally (Ljung-Box).",
  blocks: [
    { kind: "plain", title: "What is a hypothesis test doing, and what is the ACF?",
      body: "**Hypothesis tests only ever give you one kind of answer.** You set up a boring default ($H_0$) and an interesting claim ($H_1$), then ask: would my data be surprising if the boring default were true? If yes (small p-value), you have **strong evidence for the interesting claim**. If no, you learned nothing \u2014 you did *not* prove the default.\n\nThat asymmetry is why the direction of the test matters so much, and this module has two tests where students routinely get the direction backwards. Slow down on both.\n\n**The ACF** (autocorrelation function) answers: *how strongly does today relate to yesterday? to the day before? to a week ago?* One number per **lag**. Lag 0 is always 1 (today is perfectly correlated with itself). If the series has no memory, every other bar sits near zero." },

    { kind: "math", title: "The Dickey-Fuller test",
      body: "Hypothesis tests for stationarity are called **unit root tests**, because of the relationship between nonstationarity of autoregressive models and the presence of unit roots in a particular function.\n\nThe simplest version, the **Dickey-Fuller test**, is based on the AR(1) model",
      tex: ["Y_t=\\phi Y_{t-1}+\\epsilon_t"],
      after: "with $\\{\\epsilon_t\\}$ mean-zero white noise, and tests\n\n$$H_0:\\ \\phi=1\\qquad\\text{versus}\\qquad H_1:\\ \\phi<1\\ \\ (\\text{stationary}).$$" },

    { kind: "key", title: "Why the hypotheses are arranged this way",
      body: "This is a classic exam question. By setting $H_1:\\phi<1$, the test has the potential to give us **strong evidence that the series was drawn from a stationary model**.\n\nThat's the good outcome: hypothesis tests only ever produce strong evidence *for the alternative*, and stationarity is the assumption we want to license. So a **small p-value** ⟹ strong evidence of stationarity. A large p-value means we simply *failed to find evidence* of stationarity — not evidence of nonstationarity." },

    { kind: "math", title: "The Augmented Dickey-Fuller (ADF) test",
      body: "The basic DF test assumes $\\E(Y_t)=0$. The **ADF test** extends it to allow a nonzero mean and a **deterministic trend**.\n\nA series is **trend stationary** if $Y_t=f(t)+\\delta_t$ where $f(t)$ is deterministic and $\\{\\delta_t\\}$ is stationary. The ADF variants are:",
      tex: [
        "Y_t=\\beta_0+\\phi Y_{t-1}+\\delta_t \\quad\\text{(constant mean)}",
        "Y_t=\\beta_0+\\beta_1 t+\\phi Y_{t-1}+\\delta_t \\quad\\text{(linear deterministic trend)}",
      ],
      after: "In Python, `statsmodels.tsa.stattools.adfuller`. The `regression` argument controls the trend component:\n\n• `regression=\"c\"` — a constant, non-zero mean is fit. **This is the default.**\n• `regression=\"ct\"` — a linear trend is fit.\n• `regression=\"n\"` — no constant; this gives the classic Dickey-Fuller test." },

    { kind: "code", title: "Running the ADF test",
      lang: "python", file: "adf.py",
      code: `from statsmodels.tsa.stattools import adfuller

result = adfuller(y)

print(f"Test Statistic: {result[0]}")
print(f"p-value: {result[1]}")
print("Critical Values:")
for key, value in result[4].items():
    print(f"   {key}: {value}")`,
      after: "**Reading the output:** `result[0]` is the test statistic, `result[1]` the p-value, `result[4]` the dict of critical values. A **small p-value** (say < 0.05) ⟹ strong evidence the series is stationary. Equivalently, the test statistic is **more negative** than the critical value." },

    { kind: "key", title: "The headline empirical result",
      body: "Applied to Amgen data:\n\n• **Raw price series $\\{P_t\\}$**: ADF p-value $\\approx 0.95$. We **cannot** claim evidence the data came from a stationary series.\n• **Log daily returns**: ADF p-value $\\approx 2.8\\times10^{-30}$. **Strong evidence** the log returns are drawn from a stationary model.\n\n**You will see this result with any stock series.**\n\n**Why should we have guessed prices aren't stationary?** Stationarity implies **mean reversion** in prices — which would imply a simple way to make money (buy when below the long-run mean, sell when above). We know that is impossible, so prices can't be stationary." },

    { kind: "plain", title: "Reading an ACF plot",
      body: "An ACF plot is a row of vertical bars, one per **lag**.\n\n\u2022 **Lag 0** is always exactly 1 and carries no information \u2014 today equals today.\n\u2022 **Lag 1** asks how strongly today relates to yesterday, lag 2 to two days ago, and so on.\n\u2022 The **shaded band** is a rough \"nothing to see here\" zone. Bars inside it are consistent with zero correlation; bars poking outside suggest real structure.\n\nWith 20 lags plotted you should *expect* roughly one bar to poke out by chance, so don't over-read a single excursion.\n\nShapes worth recognizing: bars decaying smoothly from a positive value \u27f9 positive AR coefficient. Bars alternating positive/negative \u27f9 negative AR coefficient. Everything inside the band \u27f9 no linear memory." },

    { kind: "math", title: "The autocorrelation function",
      body: "For a stationary process, the **ACF** is the standardized ACVF:",
      tex: ["\\rho_X(h)=\\frac{\\gamma_X(h)}{\\gamma_X(0)},\\qquad -1\\le\\rho_X(h)\\le1"],
      after: "since $\\gamma_X(0)=\\Var(X_t)$ — this is just $\\text{Corr}(X_t,X_{t+h})$. It quantifies the degree of correlation in the series at different **lags**.\n\nThe **sample autocovariance function**:\n\n$$\\widehat\\gamma_X(h)=\\frac1n\\sum_{j=1}^{n-h}(x_{j+h}-\\bar x)(x_j-\\bar x),\\qquad 0\\le h<n,$$\n\nwhere $\\bar x$ is the sample average of **all** the observations. The **sample ACF** is then $\\widehat\\rho_X(h)=\\widehat\\gamma_X(h)/\\widehat\\gamma_X(0)$. \"ACF\" commonly means the sample version." },

    { kind: "code", title: "Plotting the ACF",
      lang: "python", file: "acf.py",
      body: "A plot of the ACF is standard exploratory analysis in time series — **but it is only meaningful for a stationary series.**",
      code: `from statsmodels.graphics.tsaplots import plot_acf

fig, ax = plt.subplots(figsize=(8, 5))
plot_acf(y, ax=ax, lags=20)
plt.title('Autocorrelation Function (ACF)')
plt.xlabel('Lag'); plt.ylabel('Correlation')
plt.show()`,
      after: "**Reading it:** lag 0 is always exactly 1 (a series is perfectly correlated with itself). The **shaded band is two standard errors around zero** — spikes outside it are \"significant\" deviations, *but this should only be taken as a guide*.\n\nA negative spike at lag 1 followed by a positive spike at lag 2, alternating and decaying, indicates an AR(1) with **negative** $\\phi$." },

    { kind: "math", title: "The Ljung-Box test",
      body: "A hypothesis test for significant lags in an ACF. Here \"significant\" means strong evidence that $\\rho(h)\\ne0$.",
      tex: [
        "H_0:\\ \\rho_X(h)=0 \\ \\text{ for \\textbf{all} } h=1,2,\\dots,H",
        "H_1:\\ \\rho_X(h)\\ne0 \\ \\text{ for \\textbf{at least one} } h=1,2,\\dots,H",
      ],
      after: "The value of $H$ is left up to the experimenter. In Python: `statsmodels.stats.diagnostic.acorr_ljungbox`, where the `lags` argument accepts multiple values of $H$ at once.\n\n```python\nfrom statsmodels.stats.diagnostic import acorr_ljungbox\nljung_box_result = acorr_ljungbox(y, lags=[10, 20])\n```" },

    { kind: "trap", title: "Statistical vs. practical significance",
      body: "Run on Amgen log returns, Ljung-Box gives **small p-values at both $H=10$ and $H=20$** — strong evidence of significant autocorrelation in log returns.\n\nDoesn't that contradict market efficiency? Here is the resolution, and it is the point of the whole discussion: **there is a difference between statistical significance and practical significance.** With thousands of observations, tiny correlations become statistically detectable. But could you trade on them? **No — your transaction costs would swamp any small gains you could make off the correlations.**\n\nSo: real, detectable, and useless. Keep the distinction ready." },

    { kind: "check",
      q: "You run `adfuller()` and get a p-value of 0.011. Using a 5% cutoff, what do you conclude?",
      choices: [
        "There is strong evidence that the series is stationary",
        "There is strong evidence that the series is not stationary",
        "We failed to find evidence that the series is stationary",
        "We failed to find evidence that the series is not stationary",
      ],
      answer: 0,
      explain: "$H_1$ is *stationary*, so a small p-value (0.011 < 0.05) means **strong evidence for stationarity**. The trap is (b) — reading it as if the alternative were nonstationarity. Always re-derive which hypothesis is which before answering an ADF question." },
  ],
},

/* ===================================================================== */
{
  id: "f9",
  part: "Part 4",
  title: "Volatility and Volatility Clustering",
  minutes: 18,
  summary: "What σ really means, why volatility raises option value, realized/annualized volatility, and how to diagnose clustering.",
  blocks: [
    { kind: "plain", title: "What is volatility?",
      body: "**Volatility is just how much the price jumps around** \u2014 the standard deviation of returns. High volatility means big daily swings in both directions; low volatility means the price drifts quietly.\n\nTwo things about it drive this whole Part:\n\n\u2022 **It is quoted annually, but measured daily.** You compute the SD of daily returns, then scale up to a year. The scaling factor is $\\sqrt{252}$, not 252, because *variances* add over time while standard deviations grow like the square root. (252 = trading days in a year.)\n\u2022 **It is not constant.** Real markets have calm months and violent months, and the violent ones come in clumps. That clumping is called **volatility clustering**, and the lognormal model of Part 1 flatly fails to produce it. Diagnosing that failure is the job of this module; fixing it is the job of the next one." },

    { kind: "idea", title: "What volatility is",
      body: "**Volatility** (\"vol\") refers to the **variability in log returns** — and hence in prices. Increases in price volatility can be caused by unexpected economic news, changes in interest rates, geopolitical tensions, earnings surprises, or shifts in investor sentiment producing rapid buying or selling." },

    { kind: "math", title: "How to interpret $\\sigma$",
      body: "Recall the lognormal pricing model builds from $B(t)=\\nu t+\\sigma W(t)$. So the lag-$k$ log return is a Brownian increment:",
      steps: [
        ["\\log\\!\\left(\\frac{P(t)}{P(t-k)}\\right)=B(t)-B(t-k)", "GBM property 6"],
        ["\\sim N\\big(\\nu k,\\ \\sigma^2k\\big)", "BM increment distribution"],
        ["\\text{SD}\\!\\left(\\log\\frac{P(t)}{P(t-k)}\\right)=\\sigma\\sqrt{k}", "take the square root of the variance"],
      ],
      after: "**So $\\sigma$ is scaled by the square root of the lag to get the SD of the log return at that lag.** This square-root-of-time rule is what lets you move between daily, monthly, and annual volatility. Also note $\\tau^2=\\sigma^2t$ — that's the substitution that connects Part 1's Claim to the volatility parameter." },

    { kind: "key", title: "Why higher volatility makes an option *more* valuable",
      body: "Take a call with spot $P_0=100$, strike $K=90$, one year to expiration, no drift. Plot $\\E\\big((P_t-K)^+\\big)$ against $\\sigma$ and it **increases** — steeply. That can feel backwards, so here's the mechanism:\n\nAs $\\sigma$ increases, the spread of $\\log P(t)$ at time 1 increases. So $P\\big(\\log P(t)<\\log 90\\big)=P(\\text{option worthless})$ **grows**. Bad news.\n\n**But** as $\\sigma$ increases the **upper tail is also growing**, and *there is no bound on your gain*. Your loss is capped at the premium; your gain is not.\n\n**That asymmetry leads to an increase in the value of the option as $\\sigma$ increases** — which can be counterintuitive. It is the same convexity that produced Jensen's inequality in Module 1. **Volatility is a crucial input to determining the value of options.**" },

    { kind: "math", title: "Realized and historical volatility",
      body: "The **realized volatility** over a period is the *actual, measured* variability over that period. A natural definition uses the **sample variance of the daily log returns** (the **close-to-close** approach).\n\nIt is then **annualized** by multiplying by the number of trading periods in a year — **typically 252 trading days** — and taking the square root to get interpretable units:",
      tex: ["\\widehat\\sigma_{\\text{ann}}=\\sqrt{252\\cdot\\widehat{\\Var}(r_t)}"],
      after: "When calculated from past data it is called the **historical volatility**." },

    { kind: "code", title: "Realized volatility, and a rolling window",
      lang: "python", file: "vol.py",
      code: `Symb = "NVDA"
EqDat = yf.Ticker(Symb).history(start="2020-01-01", end="2025-12-31")
ldrEq = pd.Series(np.log(EqDat['Close']).diff().dropna(), name="Log Returns")

# annualized realized volatility over the whole period
RealizedVol = np.sqrt(np.var(ldrEq) * 252)
print(f"Realized Volatility for {Symb}: {round(RealizedVol,3)}")   # ~0.529

# rolling / sliding / moving window version
windowsize = 50
RVrollwind = ldrEq.rolling(windowsize).std().dropna() * np.sqrt(252)`,
      after: "The **rolling window** computes realized vol over a window of $s$ days, then shifts the interval one time unit (so successive windows overlap heavily) — like a moving average. Pandas makes it one line: `.rolling(w).std()`.\n\nThe `* np.sqrt(252)` at the end is the annualization; note we take `.std()` and multiply by $\\sqrt{252}$, which is the same as $\\sqrt{252\\,\\widehat\\sigma^2}$." },

    { kind: "key", title: "The plot that motivates Part 4",
      body: "Overlay the rolling realized vol of the **observed** NVDA series against the same calculation on a series **simulated from the lognormal pricing model** with matching mean and SD.\n\nResult: **the observed series shows much stronger evidence of periods of high and low vol** than the lognormal model produces. The simulated series hovers in a narrow band; the real one swings from ~0.3 to above 1.0 and *stays* there for months at a stretch.\n\nThat is **volatility clustering**: periods of time when volatility is larger, and other periods when it is smaller. The vol does appear to fluctuate around a common level — the **variance reversion** we expect from a stationary process." },

    { kind: "math", title: "Diagnosing clustering with the ACF of *squared* log returns",
      body: "Second diagnostic: instead of the ACF of the log return series, look at the ACF of the **squared** log return series.\n\n**Why does that make sense?** Log returns have a mean very close to zero. So squared log returns are essentially the **squared distance from the mean** — which is what the variance measures:",
      tex: ["\\E\\big[(X-\\mu)^2\\big]=\\Var(X)"],
      after: "By looking at correlation in squared log returns at different lags, you are inspecting the **correlation in the variance of log returns** at those lags. If there is no volatility clustering, there should be no correlation at any lag.\n\nFor NVDA: `plot_acf(ldrEq**2)` shows **significant correlation at lags $\\le 5$** — consistent with the presence of volatility clustering.\n\n```python\nfrom statsmodels.graphics.tsaplots import plot_acf\nplot_acf(ldrEq**2)\nplt.title(f\"ACF of Squared Log Returns for {Symb}\")\n```" },

    { kind: "check",
      q: "What does *volatility clustering* refer to in the behavior of financial returns?",
      choices: [
        "There is conditional homoskedasticity in the log returns",
        "The general trend is for volatility to increase over time",
        "Volatility is higher during times when prices are higher",
        "There are stretches of time of high volatility, and periods of low volatility",
      ],
      answer: 3,
      explain: "Clustering means volatility **persists** — calm follows calm and turbulence follows turbulence. Option (a) is exactly backwards (the phenomenon is conditional *hetero*skedasticity); (b) describes a trend, which would contradict the variance reversion we actually observe." },
  ],
},

/* ===================================================================== */
{
  id: "f10",
  part: "Part 4",
  title: "ARCH and GARCH Models",
  minutes: 22,
  summary: "Conditional variance models: ARCH(1), ARCH(p), GARCH(p,q), their stationarity conditions, fitting with the arch package, and AIC.",
  blocks: [
    { kind: "plain", title: "What is conditional variance?",
      body: "Here is the one idea this whole module rests on.\n\n**Unconditional variance** is the spread of returns over the whole history \u2014 one number, computed once. **Conditional variance** is the spread you'd expect *tomorrow specifically*, given everything you've seen up to today.\n\nThey are different, and the gap matters. Over ten years a stock might have 30% annualized volatility (unconditional). But if the last week has been chaotic, tomorrow's expected volatility is much higher than 30% (conditional). The market has *memory* about turbulence.\n\nEvery model so far let the **mean** depend on the past while holding the variance fixed. ARCH and GARCH flip that: the mean is fixed (usually zero) and the **variance** depends on the past. That is what \"conditionally heteroskedastic\" means \u2014 *heteroskedastic* just means \"non-constant variance,\" and *conditionally* means \"given what we've seen so far.\"\n\nThe trick they use: predict tomorrow's variance from **recent squared returns**. Squaring throws away the direction of a move and keeps only its size \u2014 and size is exactly what variance is about." },

    { kind: "math", title: "Conditional mean and conditional variance",
      body: "For a time series $\\{X_t\\}$, define",
      tex: ["\\mu_t=\\E\\big(X_t\\mid\\mathcal{F}_{t-1}\\big),\\qquad \\sigma_t^2=\\Var\\big(X_t\\mid\\mathcal{F}_{t-1}\\big)"],
      after: "where $\\mathcal{F}_{t-1}$ indicates the **information available at time $t-1$**.\n\nIn models considered to this point (e.g. ARMA), $\\mu_t$ is allowed to vary as a function of $t$, but $\\sigma_t^2$ **does not vary**. For an AR(1):\n\n$$\\mu_t=\\mu+\\phi(X_{t-1}-\\mu),\\qquad \\sigma_t^2=\\sigma_\\epsilon^2\\ \\ (\\text{not a function of } t).$$\n\nIn **conditionally heteroskedastic** models the opposite is true: $\\mu_t$ is **constant** (usually zero) and $\\sigma_t^2$ is allowed to **vary**.\n\n**GARCH** stands for *Generalized AutoRegressive Conditionally Heteroskedastic*. These models use the **squared** past observations as predictors for $\\sigma_t^2$." },

    { kind: "math", title: "The ARCH(1) model",
      body: "Let $\\{\\epsilon_t\\}$ be iid white noise with mean zero and **unit** variance. Define",
      tex: ["X_t=\\epsilon_t\\sqrt{\\omega+\\alpha_1X_{t-1}^2},\\qquad \\omega>0,\\ \\alpha_1\\ge0"],
      after: "Then $\\{X_t\\}$ is an **ARCH(1)** process, and\n\n$$\\mu_t = 0, \\qquad \\sigma_t^2=\\omega+\\alpha_1X_{t-1}^2=\\Var(X_t\\mid X_{t-1}).$$\n\nRead $X_{t-1}^2$ as \"the (squared) distance of $X_{t-1}$ from 0\": a big move last period inflates this period's conditional variance, regardless of direction." },

    { kind: "key", title: "The three ARCH(1) facts to memorize",
      body: "• If $\\alpha_1<1$, then $\\{X_t\\}$ is **stationary**. If $\\alpha_1\\ge1$, the variance grows with $t$, so it is **not** stationary.\n• If $\\alpha_1<1$, then $\\{X_t\\}$ is **white noise** with mean 0 and variance $\\dfrac{\\omega}{1-\\alpha_1}$.\n• Consequently $\\text{Corr}(X_t,X_{t+h})=0$ for $h\\ne0$.\n\n**This last point is the conceptual heart of Part 4:** an ARCH process is **uncorrelated but not independent**. The *levels* show no linear association, yet the *squares* do. That is precisely the pattern we observed in real log returns — ACF of returns ≈ flat, ACF of squared returns ≈ significant. The model was built to reproduce it." },

    { kind: "math", title: "ARCH(p)",
      body: "",
      tex: ["X_t=\\epsilon_t\\sqrt{\\omega+\\sum_{i=1}^{p}\\alpha_iX_{t-i}^2},\\qquad \\sigma_t^2=\\omega+\\sum_{i=1}^{p}\\alpha_iX_{t-i}^2"],
      after: "with $\\omega>0$ and $\\alpha_i\\ge0$ for all $i$. The ARCH($p$) process also generates a stationary, uncorrelated sequence under appropriate conditions on the $\\alpha_i$." },

    { kind: "code", title: "Simulating ARCH(p)",
      lang: "python", file: "arch_sim.py",
      code: `def simulate_arch(omega, alpha, n):
    # Initialize arrays
    p = len(alpha)
    y = np.zeros(n)
    eps = np.random.normal(0, 1, n)

    # Simulate ARCH(p) process
    for t in range(p, n):
        sigma2 = omega + sum(alpha[i] * y[t-i-1]**2 for i in range(0, p))
        y[t] = eps[t] * np.sqrt(sigma2)

    return y

omega = 0.2
alpha = [0.5, 0.2, 0.1]     # len(alpha) = 3  ->  ARCH(3)
arch_series = simulate_arch(omega, alpha, 200)`,
      after: "Note the loop starts at `t = p` (you need $p$ lags of history) and `len(alpha)` *is* the order $p$." },

    { kind: "math", title: "The GARCH(p, q) model",
      body: "In simulated ARCH processes, the variability and degree of **persistence** in the volatility was not that extreme unless $p$ was chosen large. **GARCH($p,q$) models have greater ability to fit more extreme volatility clustering using fewer parameters.**\n\nLet $\\{\\epsilon_t\\}$ be iid white noise with unit variance. Then",
      tex: [
        "X_t=\\sigma_t\\epsilon_t",
        "\\sigma_t^2=\\omega+\\sum_{i=1}^{p}\\alpha_iX_{t-i}^2+\\sum_{j=1}^{q}\\beta_j\\sigma_{t-j}^2",
      ],
      after: "Assumed: $\\omega>0$, $\\alpha_i\\ge0$, $\\beta_j\\ge0$, and\n\n$$\\sum_{i=1}^{\\max\\{p,q\\}}(\\alpha_i+\\beta_i)<1.$$\n\nThese conditions guarantee each $X_t$ has **finite variance** and the process is **stationary**.\n\n**The ARCH($p$) model is the GARCH($p,q$) model with $q=0$.**" },

    { kind: "key", title: "Why the extra $\\beta$ term buys persistence",
      body: "The GARCH term feeds back **past conditional variances** $\\sigma_{t-j}^2$ rather than only past squared observations.\n\nWhy does that help? The data values $X_1,X_2,\\dots$ are **noisier** than $\\sigma_1^2,\\sigma_2^2,\\dots$, because each $X_i$ carries a contribution from the random $\\epsilon_i$. **Noisier predictors are less useful.** By regressing volatility on the smoother $\\sigma^2$ series, GARCH carries information forward with far less parameter cost — so it can model a **greater extent of volatility clustering** than an ARCH model of comparable size.\n\n**What if $p=0$?** You need $p>0$. With $p=0$ the model fits a constant variance: the algorithm fixes $\\sigma_0^2=1$, then $\\sigma_1^2=\\omega+\\beta_1\\sigma_0^2$ and so on, with no data entering. You need $X_{t-1}^2$ in there to have any variability in the model." },

    { kind: "code", title: "Fitting with the `arch` package",
      lang: "python", file: "fit_garch.py",
      code: `from arch import arch_model

# ARCH(2), mean assumed zero
model   = arch_model(ldrEq, vol='ARCH', p=2, rescale=True, mean="Zero")
results = model.fit()
results.summary()

# GARCH(1,1)
model   = arch_model(ldrEq, vol='GARCH', p=1, q=1, rescale=True, mean="Zero")
results = model.fit()`,
      after: "**Arguments that matter:** `p` (and `q`) set the order; `mean=\"Zero\"` assumes a mean of zero in the fit; `rescale=True` scales the series to improve **numerical performance** — without it you may see a warning, since log returns are relatively small values." },

    { kind: "plain", title: "What is AIC, and what is maximum likelihood?",
      body: "**Maximum likelihood** is how these models get fit. Among all possible parameter values, pick the ones that make the data you actually observed most probable. That's it.\n\n**AIC** is how you choose between models. Here is the problem it solves: a model with more parameters will *always* fit the training data better, so \"better fit\" alone would always pick the biggest model \u2014 which then fails on new data.\n\nAIC scores a model as\n\n$$\\text{AIC}=\\underbrace{-2\\log(\\text{likelihood})}_{\\text{how well it fits}}+\\underbrace{2(\\#\\text{ parameters})}_{\\text{fine for complexity}}$$\n\nA better fit pushes the first term down; every extra parameter pushes the second term up. **Lower AIC wins.** The absolute value is meaningless \u2014 only differences between models fit to the *same data* matter." },

    { kind: "math", title: "Reading the output, and AIC",
      body: "A fitted ARCH(2) on AMGN log returns gives $\\widehat\\omega=0.0798$ (SE 0.009399), $\\widehat\\alpha_1=0.1129$, $\\widehat\\alpha_2=0.1871$. The summary reports, for each parameter,",
      tex: ["t=\\frac{\\widehat\\theta}{\\text{SE}(\\widehat\\theta)}"],
      after: "with p-values for tests of $H_0:\\theta=0$ versus $H_1:\\theta>0$.\n\nThe summary also reports the **AIC**:\n\n$$\\text{AIC}=-2\\log(\\text{likelihood})+2(\\#\\text{ of parameters}).$$\n\nThe first term measures **fit to the training set**; the second is a **penalty for complexity**. **Prefer the model with smaller AIC.**\n\nComparing fits on the AMGN log returns:\n\n| Model | AIC |\n|---|---|\n| ARCH(1) | 931.411 |\n| ARCH(2) | 900.264 |\n| ARCH(3) | 890.582 |\n| **GARCH(1,1)** | **832.283** |\n| GARCH(1,2) | 834.283 |\n\nGARCH(1,1) — $\\widehat\\omega=0.0062$, $\\widehat\\alpha_1=0.1013$, $\\widehat\\beta_1=0.8467$ — is preferred to **any** of the ARCH($p$) models, and beats GARCH(1,2) too. Three parameters outperform three lags of ARCH by a wide margin, which is exactly the parsimony argument.\n\nNote also $\\widehat\\alpha_1+\\widehat\\beta_1=0.948<1$: the stationarity condition holds, but only just — high persistence is typical of fitted equity GARCH models." },

    { kind: "check",
      q: "In the ARCH(2) process, the conditional variance is modeled as a function of what?",
      choices: [
        "The squared value of the series at lag 2",
        "The two immediately previous predicted variances",
        "The two immediately previous squared values of the series",
        "External economic indicators",
      ],
      answer: 2,
      explain: "ARCH($p$) uses $\\sigma_t^2=\\omega+\\alpha_1X_{t-1}^2+\\alpha_2X_{t-2}^2$ — the **two immediately previous squared observations**. Option (b) describes the GARCH $\\beta$ terms (past *variances*), which is what distinguishes GARCH from ARCH." },
  ],
},

/* ===================================================================== */
{
  id: "f11",
  part: "Part 5",
  title: "Black-Scholes, Moneyness, and the Leverage Effect",
  minutes: 16,
  summary: "Continuous compounding, the five Black-Scholes inputs, moneyness, implied volatility, and the asymmetry ARCH/GARCH can't capture.",
  blocks: [
    { kind: "plain", title: "What is compounding, and what is moneyness?",
      body: "**Compounding.** Put \\$100 in an account at 5% a year. Paid once a year you have \\$105. Paid monthly, each month earns interest on the previous month's interest, so you end slightly ahead. Pay it *continuously* \u2014 infinitely often \u2014 and the limit is $100\\,e^{0.05}$. That is **continuous compounding**, and it is why $e$ shows up everywhere in finance. Running it backwards (what is a future dollar worth today?) is **discounting**.\n\n**Moneyness** answers: if this option expired right now, would it pay anything? A call lets you buy at the strike $K$. If the stock is already *above* $K$, exercising is profitable \u2014 the option is **in the money**. Below $K$, worthless today \u2014 **out of the money**. Right at $K$ \u2014 **at the money**. For a put, which lets you *sell* at $K$, everything flips.\n\nThe formula packages this as $M=\\log(P_0/K)$, which is just positive when $P_0>K$ and negative when $P_0<K$." },

    { kind: "math", title: "Continuous compounding",
      body: "Interest rates are quoted in annual terms — but *how often is the interest compounded?*\n\nCompounded once per year: $P_1=P_0(1+r)$. Compounded $n$ times per year: $P_1=P_0\\big(1+r/n\\big)^n$. Let $n\\to\\infty$:",
      tex: ["\\lim_{n\\to\\infty}\\left(1+\\frac{r}{n}\\right)^{n}=e^{r}"],
      after: "This is **continuous compounding**: $P_1=P_0e^r$, and more generally\n\n$$P_t=P_0e^{rt}.$$\n\nThe inverse operation, multiplying by $e^{-rt}$, is called **discounting** — converting a future amount to its value today." },

    { kind: "math", title: "The Black-Scholes formula in usable form",
      body: "Start from the Claim of Module 2 and substitute the GBM parameters $\\xi=\\log(P_0)+\\nu t$ and $\\tau^2=\\sigma^2t$:",
      tex: ["\\E\\big((P_t-K)^+\\big)=P_0\\exp\\!\\big(\\nu t+\\sigma^2t/2\\big)\\,\\Phi\\!\\left(\\frac{M+\\nu t+\\sigma^2t}{\\sigma\\sqrt{t}}\\right)-K\\,\\Phi\\!\\left(\\frac{M+\\nu t}{\\sigma\\sqrt{t}}\\right)"],
      after: "where $M=\\log(P_0/K)$.\n\n**Why those substitutions?** Under the lognormal pricing model, GBM property 4 gives $\\E(\\log P_t)=\\log(P_0)+\\nu t$ and $\\Var(\\log P_t)=\\sigma^2t$, i.e. $\\log P_t\\sim N\\big(\\log(P_0)+\\nu t,\\ \\sigma^2t\\big)$. So $\\xi$ and $\\tau^2$ *are* those two quantities." },

    { kind: "key", title: "The five inputs",
      body: "This equation lies at the heart of the **Black-Scholes-Merton theory for option pricing**, for **European-style** options. Five inputs:",
      list: [
        "The **strike price** $K$.",
        "The **time to expiration** $t$.",
        "The current price of the underlying asset — the **spot price** $P_0$.",
        "The **drift** in the price on the log scale, $\\nu$.",
        "The **volatility** in the underlying asset, $\\sigma$.",
      ],
      after: "**The first three are known at the current time** (time zero). The last two are not — they must be estimated or calibrated, which is why the statistics of Parts 2-4 matter to a pricing formula." },

    { kind: "math", title: "Moneyness",
      body: "The quantity $M=\\log(P_0/K)$ captures the **moneyness** of the option.\n\nFor a **call** option:\n• $P_0>K$: **in the money** ($M>0$)\n• $P_0\\approx K$: **at the money** ($M\\approx0$)\n• $P_0<K$: **out of the money** ($M<0$)\n\nFor a **put** option, the inequalities flip:\n• $P_0<K$: **in the money** ($M<0$)\n• $P_0\\approx K$: **at the money** ($M\\approx0$)\n• $P_0>K$: **out of the money** ($M>0$)",
      after: "Sanity check the call case: if the spot is already above the strike, exercising *today* would pay off — hence \"in the money.\" For a put you profit when the spot is *below* the strike, so everything reverses." },

    { kind: "idea", title: "Implied volatility",
      body: "Of the five inputs, $\\sigma$ is the one nobody observes. Two ways to get it:\n\n• **Historical / realized volatility** — estimate $\\sigma$ from past returns (Module 9).\n• **Implied volatility** — run the formula *backwards*: take the option's **market price** as given and **solve for the volatility that equates the Black-Scholes price to the market price**.\n\nImplied vol is therefore the market's collective forecast of future volatility, expressed in the language of the model. It is not computed by averaging past squared returns, and it is not a standard deviation of option prices across strikes — those are classic distractors." },

    { kind: "idea", title: "The leverage effect",
      body: "The **leverage effect** is another observed property of log returns: **volatility tends to increase following negative returns** more than it does following positive returns of the same magnitude. Markets fall faster than they rise, and the turbulence after a drop is worse.\n\nThe traditional explanation is about financial leverage — as a firm's equity value falls, its debt-to-equity ratio rises, making the equity riskier — though the empirical effect is stronger than that story alone justifies.\n\n**Why this matters for our models:** ARCH and GARCH are built on **squared** past values, $X_{t-i}^2$. Squaring destroys the sign, so $-5\\%$ and $+5\\%$ have *identical* effects on the forecast variance. By construction, standard GARCH **cannot** capture the leverage effect.\n\nModels that can handle **asymmetric volatility effects** include **APARCH** (Asymmetric Power ARCH) and other asymmetric extensions such as EGARCH and GJR-GARCH." },

    { kind: "idea", title: "Stock market indices",
      body: "Indices such as the **S&P 500** serve as a **summary measure of the overall performance of the stock market** (or a defined segment of it). They are not regulatory instruments, and while index moves are correlated with component moves, the index is fundamentally a *summary* — a weighted aggregate of its constituents." },

    { kind: "check",
      q: "Which model has the ability to capture **asymmetric** volatility effects?",
      choices: ["ARIMA", "GARCH", "APARCH", "VAR"],
      answer: 2,
      explain: "**APARCH** (Asymmetric Power ARCH) is designed for asymmetry. Standard **GARCH** cannot be the answer — it depends on $X_{t-i}^2$, and squaring erases the sign of the return, so positive and negative shocks of equal size move the conditional variance identically. ARIMA and VAR model the conditional *mean*, not the variance." },
  ],
},

];
