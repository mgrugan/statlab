/* StatLab — Practice Midterm Two, Paper C.
 *
 * 33 original questions on Parts 6-11. Leans harder on reading code and
 * interpreting output than Papers A and B, which is the professor's
 * stated emphasis: you will not write Python, but you will be asked what
 * a listing does and what its output means.
 *
 * Coverage 6/6/5/7/5/4 across Parts 6 to 11. Key balanced across a/b/c/d,
 * no explanation names a choice by position, no length tell.
 */

export const EXAM_M2C_META = {
  title: "Practice Midterm Two · Paper C",
  subtitle: "Statistical Methods in Finance · Parts 6-11",
  minutes: 75,
  pointsPer: 3,
  rules: [
    "33 questions, 3 points each (99 points total). Exactly one correct response each.",
    "75 minutes. The timer starts when you click Begin.",
    "Covers Parts 6 through 11 of the lecture notes, inclusive.",
    "No notes, books, calculator, laptop or phone.",
    "Several questions show a short listing or a block of output. You are never asked to write or debug code — only to say what it does, or what the numbers mean.",
    "You are not expected to calculate Hessians or Jacobians by hand, nor to reproduce the DEJD derivations.",
    "\"iid\" stands for \"independent and identically distributed.\"",
  ],
};

export const EXAM_M2C = [
/* ---------------------------------------------- Part 6: the Poisson process */
{ id: "c1", ref: "f13", topic: "Reading a simulation",
  q: "What does this loop simulate?\n\n```python\nt, times = 0.0, []\nwhile t < T:\n    t += rng.exponential(1 / lam)\n    if t < T:\n        times.append(t)\n```",
  choices: [
    "A single draw from a Poisson distribution with mean `lam * T`",
    "A random walk whose steps are exponentially distributed",
    "A sequence of equally spaced event times over the window $[0,T]$",
    "The event times of a Poisson process of rate `lam` on $[0,T]$",
  ], answer: 3,
  why: "Each pass draws an Exponential gap with mean $1/\\lambda$ and accumulates it, so `times` holds the **event times** of a Poisson process with rate `lam`. Note that `numpy`'s `exponential` takes a **scale**, which is $1/\\lambda$, not the rate — a standard place to slip. The count `len(times)` would be the Poisson draw; the gaps are random, so the times are not equally spaced." },

{ id: "c2", ref: "f13", topic: "Poisson mean and variance",
  q: "A simulation of many Poisson$(\\lambda)$ draws reports a sample mean of $2.48$ and a sample variance of $6.21$. What should you suspect?",
  choices: [
    "That $\\lambda$ was set near $2.5$ and the variance estimate is simply noisy",
    "That the draws are not Poisson, since the variance should match the mean",
    "That the sample size is too small for the mean to have converged",
    "Nothing — the mean and variance of a Poisson are unrelated",
  ], answer: 1,
  why: "For a Poisson the mean and variance are the **same number**, so a variance two and a half times the mean is a red flag — the sampler, or the code around it, is not doing what you think. Sampling noise can move a variance estimate a little, but not that far with many draws. This equality is both the Poisson's signature and a cheap diagnostic." },

{ id: "c3", ref: "f13", topic: "Independent increments",
  q: "Over a Poisson process with rate $\\lambda$, four events occurred in the first hour. What is the distribution of the count in the second hour?",
  choices: [
    "Poisson$(\\lambda)$ but negatively correlated with the first hour's count",
    "Binomial, since the total over two hours is now constrained",
    "Poisson$(\\lambda)$, independent of what happened in the first hour",
    "Poisson$(4)$, since the observed rate is four per hour",
  ], answer: 2,
  why: "**Independent increments**: counts in disjoint intervals are independent, so the first hour tells you nothing about the second. The rate stays $\\lambda$ — four events is a realization, not an updated parameter. The process has no memory of its own history, which is the continuous-time counterpart of the Exponential's memoryless property." },

{ id: "c4", ref: "f13", topic: "Memoryless property",
  q: "Which distribution on $(0,\\infty)$ has the memoryless property?",
  choices: [
    "The Gamma, since it is the sum of exponential waits",
    "The lognormal, since its logarithm is normal",
    "The Exponential, and it is the only continuous one that does",
    "Any distribution with a constant mean, by definition of stationarity",
  ], answer: 2,
  why: "The Exponential is the **unique** continuous distribution for which $P(X>a+b\\mid X>b)=P(X>a)$, and that uniqueness is the reason the Poisson process is as rigid as it is: constant rate forces exponential gaps and nothing else. A Gamma with shape above one is **not** memoryless — having waited raises the chance the next event is soon, since you are further along a sum." },

{ id: "c5", ref: "f13", topic: "Compound Poisson",
  q: "In a jump model, what is the role of the Poisson process and what is the role of the jump size distribution?",
  choices: [
    "The Poisson process handles down jumps and the size distribution handles up jumps",
    "The Poisson process sets when jumps happen; the size distribution sets how large each is",
    "The Poisson process sets how large each jump is; the size distribution sets when they happen",
    "Both describe the timing, one in calendar time and one in business time",
  ], answer: 1,
  why: "The two pieces answer **separate** questions — *when* and *how big* — and that separation is what makes jump models tractable: you can condition on the number of jumps, which is Poisson, and then handle the sizes. It also means a model has two independent knobs, and the DEJD's contribution is to give each **direction** its own pair." },

{ id: "c6", ref: "f13", topic: "Rate scaling",
  q: "Jumps arrive as a Poisson process at $\\lambda=2$ per year. What is the distribution of the number of jumps in a six-month window?",
  choices: [
    "Poisson with mean $2$, since the rate is a property of the process",
    "Poisson with mean $1$, since the mean scales with the length of the window",
    "Poisson with mean $4$, since there are two such windows in a year",
    "Exponential with mean $1/2$, as the window is half a year",
  ], answer: 1,
  why: "The count on an interval of length $t$ is Poisson$(\\lambda t)$, so half a year at two per year gives a mean of **one**. The rate $\\lambda$ is per unit time; the **mean count** is what scales with the window. Exponential is the law of the **gaps**, not of a count, so it cannot be the answer to a question about a number of events." },

/* ------------------------------------------ Part 7: mean models and Merton */
{ id: "c7", ref: "f14", topic: "Reading minimize()",
  q: "What is this code doing?\n\n```python\ndef sse(beta, x, y):\n    return np.sum((y - beta[0] - beta[1] * x) ** 2)\n\nres = minimize(sse, [0.0, 1.0], args=(x, y))\n```",
  choices: [
    "Fitting a straight line by maximum likelihood with $t$-distributed errors",
    "Minimizing the sum of the absolute deviations of $y$ about a straight line",
    "Computing the correlation between $x$ and $y$ by searching over candidate slopes",
    "Fitting a straight line by least squares, numerically rather than in closed form",
  ], answer: 3,
  why: "The objective squares the residuals and sums them, and `minimize` searches over the intercept and slope — so this is **least squares**, obtained by numerical search rather than the normal equations. The second entry of the starting vector is a slope guess of 1. Nothing here is a likelihood, and L1 would need `np.abs` in place of the square." },

{ id: "c8", ref: "f14", topic: "Starting values",
  q: "Why does `minimize` require a starting value, and when does the choice of starting value matter most?",
  choices: [
    "It sets the number of iterations allowed; a poor choice slows convergence only",
    "It is where the search begins; the choice matters when the objective has several local optima",
    "It determines the gradient; the choice matters only for non-differentiable objectives",
    "It fixes the scale of the parameters; the choice is irrelevant to the answer",
  ], answer: 1,
  why: "`minimize` performs a **local** search downhill from wherever you put it. With a single well-behaved optimum any sensible start lands in the same place, but a complicated surface — a GARCH or jump-diffusion likelihood is the standard example — can have several local optima, and then different starts give different answers. This is why bounds and sensible starts are discussed alongside these fits." },

{ id: "c9", ref: "f14", topic: "Volatility smile",
  q: "Implied volatilities computed from traded option prices are plotted against strike and form a U shape. What does that tell you?",
  choices: [
    "The implied volatilities were computed with the wrong risk-free rate",
    "Volatility is genuinely higher for options far from the money than for those struck at the money",
    "Black-Scholes is rejected by the data, since it implies one volatility for all strikes",
    "The options are mispriced, since volatility cannot depend on strike",
  ], answer: 2,
  why: "Black-Scholes assumes a **single** volatility for the underlying, so every option on it should imply the same number and the plot should be flat. A smile is the market pricing in fatter tails than lognormal — large moves in either direction are more likely than the model says. Volatility is a property of the **underlying**, not of a strike, so a strike-dependent 'true volatility' is not a coherent reading." },

{ id: "c10", ref: "f14", topic: "Merton and the smile",
  q: "Why does adding jumps to a geometric Brownian motion help reproduce the observed volatility smile?",
  choices: [
    "Because jumps fatten the tails, raising the value of options far from the money",
    "Because jumps remove the no-arbitrage constraint that forces a flat smile",
    "Because jumps allow a different risk-free rate at each strike",
    "Because jumps make the volatility time-varying, which flattens the curve",
  ], answer: 0,
  why: "A far out-of-the-money option only pays if the price makes a large move, so its value is driven almost entirely by the **tail** of the return distribution. Jumps put more probability out there than a lognormal does, so those options are worth more — and backing out an implied volatility from a higher price gives a higher number, which is the smile. No-arbitrage is not what makes the Black-Scholes smile flat; the **single volatility** assumption is." },

{ id: "c11", ref: "f14", topic: "Simulating Merton",
  q: "In code that simulates a Merton jump diffusion one day at a time, which line is doing the jump part?\n\n```python\nfor i in range(1, n):\n    N = rng.poisson(lam * dt)                      # A\n    J = rng.normal(mu_j, sig_j, N).sum()           # B\n    z = rng.normal()                               # C\n    S[i] = S[i-1] * np.exp(m * dt + s * np.sqrt(dt) * z + J)   # D\n```",
  choices: [
    "Lines A and B together: how many jumps, then how large in total",
    "Line A alone, since the Poisson draw is the jump",
    "Line C, which draws the shock that moves the price",
    "Line D, which is where the exponential makes the move multiplicative",
  ], answer: 0,
  why: "The jump component needs **both** questions answered: `A` draws how many jumps occurred on this day, with mean $\\lambda\\,dt$, and `B` draws that many normal jump sizes and adds them. Either alone is incomplete — note that when `N` is zero, `B` sums an empty array and correctly returns zero. Line `C` is the ordinary diffusion shock and `D` assembles the pieces." },

{ id: "c12", ref: "f14", topic: "Mean models",
  q: "A GARCH model is fitted with the mean equation set to a constant, and the estimated constant is not significantly different from zero. What is the usual conclusion?",
  choices: [
    "The sample is too short for a GARCH model to be fitted to it at all reliably",
    "The model is misspecified, since daily returns must have a nonzero mean",
    "Daily returns have almost no predictable mean, and a zero-mean model is defensible",
    "The variance equation must be refitted, since the mean and variance are estimated jointly",
  ], answer: 2,
  why: "The predictable part of a daily return is **tiny** next to its volatility, so a constant mean is routinely indistinguishable from zero and setting the mean to zero costs almost nothing — it can even improve AIC by saving a parameter. This is the opposite of a misspecification warning. The variance equation is where the structure in daily returns actually lives." },

/* ------------------------------------------------ Part 8: likelihood / MLE */
{ id: "c13", ref: "f15", topic: "Likelihood of an exponential sample",
  q: "Five observations are drawn from an Exponential$(\\lambda)$ and their sample mean is $0.77$. What is the MLE of $\\lambda$?",
  choices: [
    "About $1.3$, the reciprocal of the sample mean",
    "About $3.85$, the sum of the observations",
    "Undetermined without the five individual values",
    "$0.77$, the sample mean itself",
  ], answer: 0,
  why: "Maximizing the log-likelihood gives $\\hat\\lambda=n/\\sum x_i=1/\\bar x$, so about $1.3$. Two things are worth noting: the mean is $1/\\lambda$, so inverting it is exactly what you would guess; and the estimate depends on the data **only** through the sum, so the individual values add nothing once you have the mean." },

{ id: "c14", ref: "f15", topic: "Reading a likelihood function",
  q: "What does this function return?\n\n```python\ndef negll(theta, r):\n    mu, sig = theta\n    return -np.sum(norm.logpdf(r, mu, sig))\n```",
  choices: [
    "The log-likelihood of an iid normal sample, ready to be handed to a maximizer",
    "The sum of the squared residuals of `r` about `mu`, with no distribution involved",
    "The negative of the normal density, evaluated separately at each of the returns",
    "The negative log-likelihood of an iid normal sample, ready for a minimizer",
  ], answer: 3,
  why: "It sums the log densities and **negates** the sum. The negation is a convention, not a modeling choice: `scipy.optimize.minimize` only minimizes, so you hand it the negative of what you want maximized. The sum of squares is what this reduces to once the constants are dropped and $\\sigma$ is held fixed — which is the sense in which least squares and this likelihood coincide." },

{ id: "c15", ref: "f15", topic: "Conditioning in the GARCH likelihood",
  q: "The GARCH likelihood is built by conditioning. What exactly is being conditioned on?",
  choices: [
    "The unconditional variance, which is substituted for each $\\sigma_t^2$ in turn to simplify the product",
    "The past returns, which make $\\sigma_t^2$ known and each term a simple normal density",
    "The future returns, which are needed to smooth the variance path",
    "The parameter values, which are held fixed while the data vary",
  ], answer: 1,
  why: "Given everything up to time $t-1$, the GARCH recursion makes $\\sigma_t^2$ a **known number**, so $r_t$ is just normal with that variance and its density is easy. Multiply those conditional densities down the sample and you have the joint likelihood. This is why a model with dependent data can still be fitted by a product of one-observation terms." },

{ id: "c16", ref: "f15", topic: "MLE as a method",
  q: "What is meant by the remark that maximum likelihood is a method while GARCH is a model?",
  choices: [
    "That GARCH model parameters cannot be estimated by any method other than maximum likelihood",
    "That maximum likelihood requires no distributional assumption of any kind to be made",
    "That maximum likelihood can only be applied to models in which the conditional variance is explicitly specified",
    "That the model specifies the distribution, and maximum likelihood is one way to estimate its parameters",
  ], answer: 3,
  why: "They answer different questions. The **model** says where the data came from — which is how the likelihood gets written down in the first place. Maximum likelihood is a general **recipe** for turning any such specification into estimates, and it applies equally to a linear regression, a $t$ distribution or a jump diffusion. Far from needing no assumptions, it needs the distribution in order to exist." },

{ id: "c17", ref: "f15", topic: "Comparing fits",
  q: "Two distributions are fitted to the same returns by maximum likelihood and report log-likelihoods of $-4023.61$ and $-3982.99$. Which fits better, and does that settle the choice?",
  choices: [
    "Neither, since log-likelihoods are only comparable between models in a single family",
    "The first fits better, since it is more negative and log-likelihoods behave as costs",
    "The second fits better, and that settles the choice as long as both were fitted to exactly the same data",
    "The second fits better, but the comparison is not settled until parameter counts are accounted for",
  ], answer: 3,
  why: "**Higher** is better, so $-3982.99$ is the better fit; log-likelihoods are not costs. But a richer model will almost always fit better, so the raw comparison is uninformative on its own — that is exactly the gap AIC fills, by charging for each parameter. The comparison does require the same data, and does **not** require the same family." },

/* ------------------------------------------- Part 9: properties of the MLE */
{ id: "c18", ref: "f16", topic: "Standard error of an MLE",
  q: "For an Exponential sample, the MLE is $\\hat\\lambda=1/\\bar x$ and its standard error works out to $\\hat\\lambda/\\sqrt n$. What does the form of that expression tell you?",
  choices: [
    "Precision does not improve with sample size, since $\\hat\\lambda$ appears in the numerator",
    "The estimate is biased, since its standard error depends on itself",
    "Precision improves with $\\sqrt n$, and the error scales with the size of the estimate",
    "Precision improves with $n$, and the error is free of the parameter",
  ], answer: 2,
  why: "Two readings, both standard. The $\\sqrt n$ in the denominator is the usual rate — quadruple the data to halve the uncertainty. And $\\hat\\lambda$ in the numerator means the error is **proportional** to the estimate, so what is roughly constant is the **relative** error. A standard error depending on the estimate is completely ordinary and says nothing about bias." },

{ id: "c19", ref: "f16", topic: "Correlated estimates",
  q: "A Gamma distribution is fitted by maximum likelihood and the estimated correlation between $\\hat\\alpha$ and $\\hat\\beta$ is about $0.9$. What follows?",
  choices: [
    "The two parameters are redundant, so one of them should be dropped and the model refitted with the other",
    "The standard errors are invalid and must be recomputed by bootstrap",
    "The fit has failed, since parameter estimates must be uncorrelated",
    "Either parameter alone is poorly determined, though a combination of them is pinned down well",
  ], answer: 3,
  why: "High correlation means the likelihood has a long diagonal **ridge**: many $(\\alpha,\\beta)$ pairs along it fit about as well, so each parameter on its own is imprecise even though their combination — here roughly the mean, $\\alpha/\\beta$ — is determined sharply. This is why the off-diagonal entries of the covariance matrix matter and why a function of both parameters needs the Delta Method rather than one standard error." },

{ id: "c20", ref: "f16", topic: "Fisher information",
  q: "What is the Fisher information, in terms of the log-likelihood?",
  choices: [
    "The number of observations, which is what determines precision",
    "The value of the log-likelihood at its maximum",
    "The expected value of the score, which is zero at the true parameter",
    "The negative expected second derivative of the log-likelihood",
  ], answer: 3,
  why: "Information is **expected curvature**: minus the expectation of the second derivative of the log-likelihood. Its inverse is the asymptotic variance of the MLE and the Cramér-Rao bound, which is why sharper curvature means a more precise estimate. The expected score is indeed zero at the truth — that is the identity the whole theory is built on, but it is not the information." },

{ id: "c21", ref: "f16", topic: "Delta method",
  q: "What does the Jacobian do in the multiparameter Delta Method?",
  choices: [
    "It supplies the second derivatives needed for the standard errors",
    "It rescales the parameters so the covariance matrix becomes diagonal",
    "It converts the covariance matrix of the parameters into that of the transformed quantities",
    "It measures how far the log-likelihood departs from a quadratic near its maximum, bounding the error",
  ], answer: 2,
  why: "The Jacobian $G$ holds the first derivatives of the transformation at the estimates, and the sandwich $G\\Sigma G^{\\mathsf T}$ carries the parameters' covariance matrix through to the transformed quantities. It is a **local linearization** of the function, which is why the result is an approximation. Second derivatives belong to the Hessian, a separate object." },

{ id: "c22", ref: "f16", topic: "Value at Risk",
  q: "What is the 1% Value at Risk of a portfolio over one day?",
  choices: [
    "The largest loss observed anywhere in the sample, rescaled to a 1% tail",
    "The loss exceeded on 1% of days, that is, the 1st percentile of the return distribution",
    "The average loss incurred on the worst 1% of days, taken over that part of the distribution",
    "The probability that the portfolio loses more than 1% of its value in a single day",
  ], answer: 1,
  why: "VaR is a **quantile**: the threshold a loss exceeds with the stated probability. The average loss **beyond** that threshold is CVaR, also called expected shortfall, and it is the more informative of the two precisely because VaR says nothing about how bad the bad days get. A VaR is a loss in currency or return units, never a probability." },

{ id: "c23", ref: "f16", topic: "VaR and CVaR in code",
  q: "Given simulated one-day returns in `r`, which pair of lines gives the 1% VaR and CVaR?",
  choices: [
    "`v = np.quantile(r, 0.01)` then `c = r[r <= v].mean()`",
    "`v = np.quantile(r, 0.99)` then `c = r[r >= v].mean()`",
    "`v = r.mean() - 2.33 * r.std()` then `c = r.min()`",
    "`v = np.quantile(r, 0.01)` then `c = r.mean()`",
  ], answer: 0,
  why: "The VaR is the 1% **quantile** of the simulated return distribution, and the CVaR is the mean of the draws **at or below** it. The upper-tail version answers a question about gains; the normal formula with $2.33$ is only right if the returns are normal, which is the assumption this whole simulation approach exists to avoid; and the overall mean is not a tail quantity at all." },

{ id: "c24", ref: "f16", topic: "Why simulate the risk measures",
  q: "Why compute VaR and CVaR by simulating from a fitted model rather than from a closed-form normal formula?",
  choices: [
    "Because Value at Risk has no definition outside of a simulation from a fitted model",
    "Because simulation is faster than evaluating a normal quantile in closed form for each horizon",
    "Because the normal formula requires a much longer sample before its quantile estimates become reliable",
    "Because the fitted model may be heavy-tailed or skewed, where a normal quantile understates the tail",
  ], answer: 3,
  why: "The entire point of fitting a $t$, a skewed $t$ or a jump model is that the tails are **not** normal — and the normal quantile is exactly where that mismatch does the most damage, understating how bad a bad day can be. Simulating from the fitted model propagates its actual tail shape into the risk measure. Closed-form evaluation is of course faster; it is just answering the wrong question." },

/* ---------------------------------------------- Part 10: model selection */
{ id: "c25", ref: "f17", topic: "Diagnosing non-normality",
  q: "Daily log returns are plotted against a fitted normal density on a logarithmic vertical axis. What is the log axis for?",
  choices: [
    "To correct for the skewness of the return distribution",
    "To stabilize the variance so the two curves can be compared",
    "To make the behaviour far out in the tails visible, where the densities are tiny",
    "To turn the fitted normal density into a straight line, in the same way that a QQ plot does",
  ], answer: 2,
  why: "In the tails both densities are so small that on a linear axis they are indistinguishable from the axis itself — and the tails are precisely where the models differ. Taking logs stretches that region out, and the normal's quadratic decay becomes an obvious **parabola** falling away far faster than the data. A QQ plot is a different device for the same job." },

{ id: "c26", ref: "f17", topic: "Nonstandard t",
  q: "Why is a location-scale, or nonstandard, $t$ used for returns rather than the standard $t$?",
  choices: [
    "Because the standard $t$ has no finite variance once the degrees of freedom fall to two or below, so it cannot be fitted",
    "Because returns are not centered at zero with unit scale, so location and scale parameters are needed",
    "Because the standard $t$ cannot have tails heavier than the normal",
    "Because the degrees of freedom must be an integer in the standard version",
  ], answer: 1,
  why: "The textbook $t$ has a fixed centre and scale, which no real return series happens to match. Adding location and scale parameters lets the same tail shape be fitted to data on its own units. The tail weight is controlled separately by the degrees of freedom — which is also why that parameter must be estimated rather than assumed, and why it does **not** need to be an integer." },

{ id: "c27", ref: "f17", topic: "AIC arithmetic",
  q: "Two models fitted to the same returns give log-likelihoods $-3982.99$ with 3 parameters and $-3980.38$ with 4. Which does AIC prefer?",
  choices: [
    "The four-parameter model, since the gain of $2.61$ in log-likelihood exceeds the cost of one parameter",
    "The three-parameter model, since one extra parameter costs $2$ while the gain is only $2.61$",
    "Neither, since AIC cannot compare models with different numbers of parameters",
    "The four-parameter model, since its log-likelihood is higher and a higher log-likelihood is a better fit",
  ], answer: 0,
  why: "AIC is $-2\\log L+2k$, so adding a parameter is worth it when the log-likelihood rises by **more than 1**. Here it rises by $2.61$, so AIC does prefer the larger model — $7971.98$ against $7968.76$, lower being better. The trap is comparing the gain of $2.61$ against the penalty of $2$ on the wrong scale: the penalty is $2k$ while the gain enters doubled as well." },

{ id: "c28", ref: "f17", topic: "Model selection across families",
  q: "A GARCH(1,1) with skewed-$t$ innovations is compared to a GARCH(1,1) with normal innovations on the same returns, and the skewed-$t$ version has much the lower AIC. What is the right reading?",
  choices: [
    "Nothing can be concluded from the comparison, since the two models are not nested within one another",
    "The volatility equation should be refitted, since the innovation distribution changed",
    "The extra tail and skew parameters earn their cost, so the innovations are genuinely non-normal",
    "The skewed-$t$ fit is overfitting, since AIC always favours the larger model",
  ], answer: 2,
  why: "A **much** lower AIC means the improvement in fit far exceeds the two-per-parameter charge — the data want heavy, asymmetric innovations even after the GARCH has absorbed the volatility clustering. AIC emphatically does not always favour the larger model; that is what the penalty is for. And AIC does not require nesting, though these two happen to be nested." },

{ id: "c29", ref: "f17", topic: "Scope of a selected model",
  q: "A model is selected by AIC on daily returns from 2015 to 2020. What is the main caution in applying it to 2024?",
  choices: [
    "The market may have changed, so the model chosen on one period need not be best for another",
    "Log-likelihoods are not comparable across time periods, so the selection is void",
    "AIC is only valid for the sample it was computed on, so a new criterion is needed",
    "The selected model will have too many parameters for a shorter sample to support",
  ], answer: 0,
  why: "Model selection is a statement about the **period you fitted**. Volatility regimes, market structure and the shape of the tails all move, so the best model for one stretch of history is not automatically the best for another — which is why a selection ought to be revisited rather than inherited. This is a caution about the world, not a technical defect in AIC." },

/* ----------------------------------------------------- Part 11: the DEJD */
{ id: "c30", ref: "f18", topic: "Log returns under the DEJD",
  q: "Under the DEJD the $s$-period log return is $r(s)=(\\mu-\\tfrac12\\sigma^2)s+\\sigma Z(s)+U+D$. What are $U$ and $D$?",
  choices: [
    "The up and down components of the diffusion term, separated according to the sign of $Z(s)$",
    "The unconditional drift term and the conditional drift term, respectively",
    "The upper and lower bounds that the return cannot pass over the period",
    "The total contributions of the up jumps and of the down jumps over the period",
  ], answer: 3,
  why: "$U$ aggregates every up jump in the period and $D$ every down jump, and the four terms — drift, diffusion, up jumps, down jumps — are **independent**, which is what makes the likelihood tractable. The diffusion is the single term $\\sigma Z(s)$ and is not split by sign; splitting the **jumps** by sign is the model's whole contribution." },

{ id: "c31", ref: "f18", topic: "Identification of jumps",
  q: "After fitting the DEJD by maximum likelihood, which days were up-jump days?",
  choices: [
    "The question has no answer: individual jumps are never identified in the data",
    "Those with returns more than three fitted standard deviations above the mean",
    "Those whose returns exceed the upper jump threshold the fit reports",
    "Those the optimizer assigns to the up-jump process during estimation",
  ], answer: 0,
  why: "The likelihood sums over **all** possible numbers of up and down jumps for each observation, so no day is ever labelled. The parameters describe the two streams in aggregate; the estimation never commits to a classification, and there is no threshold in the model to compare a return against. This surprises people, and it is a favourite thing to ask about." },

{ id: "c32", ref: "f18", topic: "Jumps versus heavy tails",
  q: "What does a jump diffusion model tell you that fitting a heavy-tailed distribution to the returns does not?",
  choices: [
    "How the price evolves through time, including the dependence between consecutive days",
    "The precise quantiles of the return distribution, which a fitted density cannot give",
    "Nothing additional — the two approaches are equivalent reparameterizations",
    "That large returns are more likely than under a normal distribution",
  ], answer: 0,
  why: "A fitted heavy-tailed density is a statement about the **marginal** distribution of a single day's return and is silent about how days connect. A jump diffusion is a model of the price **process**: it says tomorrow's price is usually near today's and occasionally is not, which is what you need for a path-dependent option. Both describe large returns well; only one describes the path." },

{ id: "c33", ref: "f18", topic: "Significance",
  q: "The paper bolds the parameter estimates for which a test of the parameter being zero is rejected at the 5% level. What caution is attached to that?",
  choices: [
    "Significance at the 5% level implies that the model as a whole is correctly specified for the data",
    "The importance of significance is commonly exaggerated: a non-significant estimate may just reflect noise or too small a sample",
    "Bolded estimates should be dropped from the model, since a parameter indistinguishable from zero contributes nothing to the fit",
    "The tests are invalid, because standard errors taken from a numerical Hessian cannot support them",
  ], answer: 1,
  why: "Researchers lean on significance far more heavily than it deserves. A failure to reject often means the sample was too small or the series too noisy, not that the effect is absent — and conversely, with enough data a negligible effect becomes significant. Note also which way round the bolding goes: a **rejected** test is the one that gets bolded, meaning the parameter is distinguishable from zero." },
];
