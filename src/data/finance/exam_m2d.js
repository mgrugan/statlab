/* StatLab — Practice Midterm Two, Paper D.
 *
 * 33 original questions on Parts 6-11, written as the hardest of the four
 * papers: more questions that turn on a distinction rather than a
 * definition, and more that ask why something is done the way it is.
 * Still no arithmetic beyond mental, and still no code to write.
 *
 * Coverage 6/6/5/7/5/4 across Parts 6 to 11. Key balanced across a/b/c/d,
 * no explanation names a choice by position, no length tell.
 */

export const EXAM_M2D_META = {
  title: "Practice Midterm Two · Paper D",
  subtitle: "Statistical Methods in Finance · Parts 6-11",
  minutes: 75,
  pointsPer: 3,
  rules: [
    "33 questions, 3 points each (99 points total). Exactly one correct response each.",
    "75 minutes. The timer starts when you click Begin.",
    "Covers Parts 6 through 11 of the lecture notes, inclusive.",
    "No notes, books, calculator, laptop or phone.",
    "The harder of the four papers: several questions turn on a distinction between two things that sound alike. If two choices both look defensible, the question is asking you to separate them.",
    "You will not be asked to write or debug Python, to compute a Hessian by hand, or to reproduce the DEJD derivations.",
    "\"iid\" stands for \"independent and identically distributed.\"",
  ],
};

export const EXAM_M2D = [
/* ---------------------------------------------- Part 6: the Poisson process */
{ id: "d1", ref: "f13", topic: "Discrete vs continuous",
  q: "Which pairing of a distribution with what it describes in a jump model is correct?",
  choices: [
    "Binomial for the number of jumps; Gamma for the sizes of jumps",
    "Exponential for the number of jumps; Normal for the gaps between jumps",
    "Poisson for the gaps between jumps; Exponential for the number of jumps",
    "Poisson for the number of jumps; Exponential for the gaps between jumps",
  ], answer: 3,
  why: "Counts are **discrete** and gaps are **continuous**, so the pairing is forced: the Poisson is a distribution on $\\{0,1,2,\\dots\\}$ and can only count, while the Exponential lives on $(0,\\infty)$ and can only measure time. Getting these the wrong way round is the single most common slip in this Part, and a quick sanity check on the support rules it out immediately." },

{ id: "d2", ref: "f13", topic: "Stationarity of the process",
  q: "What does it mean for a Poisson process to have stationary increments?",
  choices: [
    "The gaps between events are identically distributed but may be dependent",
    "The count's distribution depends only on the interval's length, not on where it sits",
    "The expected number of events is the same in every interval, whatever its length",
    "The process has a constant mean and variance at each fixed time point",
  ], answer: 1,
  why: "Stationarity here is about **location not mattering**: an hour this morning and an hour next Tuesday have the same count distribution. It does not say intervals of different lengths agree — a longer interval has a larger mean, $\\lambda t$. And the gaps are not merely identically distributed; they are **independent** as well, which is a separate part of the definition." },

{ id: "d3", ref: "f13", topic: "Sum of exponentials",
  q: "What is the distribution of the waiting time until the third event of a Poisson process with rate $\\lambda$?",
  choices: [
    "Poisson$(3)$, since the third event is being counted",
    "Exponential$(\\lambda/3)$, since the mean wait triples",
    "Gamma, being the sum of three iid Exponential$(\\lambda)$ gaps",
    "Exponential$(3\\lambda)$, since three events must occur",
  ], answer: 2,
  why: "The wait to the $k$th event is the **sum** of $k$ iid exponential gaps, and that sum is Gamma with shape $k$ and rate $\\lambda$. Its mean is $3/\\lambda$, so the mean wait does triple — but the **distribution** is not exponential, and that matters: a Gamma with shape above one is not memoryless, and its density is zero at the origin rather than at its maximum." },

{ id: "d4", ref: "f13", topic: "Memorylessness and its consequence",
  q: "Why does the memoryless property make the Exponential a questionable model for the lifetime of a physical component?",
  choices: [
    "Because it is defined only on the positive half line, excluding immediate failure",
    "Because it implies the component never fails, since the hazard is constant",
    "Because it implies a used component is as good as new, ruling out wear",
    "Because it has infinite variance, so the mean lifetime is undefined",
  ], answer: 2,
  why: "A constant hazard means the chance of failing in the next hour never changes, however long the component has already run — so **wear-out is impossible by assumption**. For components that degrade, a Gamma or Weibull with increasing hazard is more honest. The Exponential has perfectly finite mean and variance, and being supported on the positives is a feature of any lifetime model." },

{ id: "d5", ref: "f13", topic: "Rate interpretation",
  q: "Two stocks have jump rates $\\lambda_A=0.8$ and $\\lambda_B=4$ per year. What follows about the gaps between jumps?",
  choices: [
    "A's gaps have a mean of 1.25 years, five times B's mean of 0.25",
    "A's gaps are more variable in absolute terms, but B's are more variable relative to their mean",
    "The gaps have the same distribution; only the counts differ",
    "B's gaps are five times as long on average as A's",
  ], answer: 0,
  why: "The mean gap is $1/\\lambda$, so a rate five times higher gives gaps five times **shorter** — not longer. On relative variability the two are identical: an Exponential's standard deviation equals its mean, so the coefficient of variation is 1 whatever $\\lambda$ is. And the gap distribution plainly does change with $\\lambda$; counts and gaps are two views of the same parameter." },

{ id: "d6", ref: "f13", topic: "Jumps and the price path",
  q: "What does adding a Poisson jump component to a geometric Brownian motion change about the price path?",
  choices: [
    "The path becomes mean-reverting, pulling back toward the pre-jump level",
    "The path's drift changes, but the price distribution at each fixed time remains lognormal",
    "The path becomes discontinuous at the jump times, and the returns acquire heavy tails",
    "The path stays continuous but its volatility becomes time-varying instead",
  ], answer: 2,
  why: "Jumps are instantaneous moves, so the path genuinely **breaks** at those times — unlike a pure diffusion, which is continuous though nowhere differentiable. And the mixture of ordinary days with occasional jump days is what produces returns with tails far heavier than lognormal. Time-varying volatility with a continuous path is **GARCH**, a different repair to the same deficiency." },

/* ------------------------------------------ Part 7: mean models and Merton */
{ id: "d7", ref: "f14", topic: "What a mean model omits",
  q: "A mean model is fitted to returns and the residuals turn out to be strongly heteroskedastic. What does that imply about the mean model?",
  choices: [
    "It is invalid and its coefficient estimates are meaningless",
    "It may describe the mean adequately while saying nothing useful about risk",
    "It needs an extra predictor, since heteroskedasticity signals omitted variables",
    "It should be refitted by maximum likelihood rather than least squares",
  ], answer: 1,
  why: "A mean model makes a claim about the **centre** only, and that claim can be fine while the spread is wildly non-constant. The coefficients stay consistent; what breaks are the **standard errors** and anything to do with intervals or tails. The remedy is to model the variance as well — weighted least squares, or a GARCH — not to abandon the mean equation." },

{ id: "d8", ref: "f14", topic: "L1 regression",
  q: "In what sense is minimizing absolute deviations a maximum likelihood procedure?",
  choices: [
    "It is maximum likelihood for any symmetric error distribution whatsoever",
    "It is maximum likelihood when the errors are normal but the design is unbalanced",
    "It is never maximum likelihood, since the objective is not differentiable",
    "It is maximum likelihood when the errors are iid Laplace, that is, double exponential",
  ], answer: 3,
  why: "A Laplace density has $|x|$ in the exponent, so its log-likelihood is a negative multiple of the sum of **absolute** residuals — exactly as the normal density puts the sum of **squares** there. So the choice between L2 and L1 is a choice of error distribution, which is the cleanest way to see why L1 is robust: a Laplace has heavier tails than a normal and is less surprised by an outlier." },

{ id: "d9", ref: "f14", topic: "Gauss-Markov limits",
  q: "The Gauss-Markov theorem says least squares is best among linear unbiased estimators. Why is that weaker than it sounds?",
  choices: [
    "Because it assumes normality, which daily returns violate",
    "Because biased or nonlinear estimators can achieve a smaller mean squared error",
    "Because it holds only asymptotically, so it says nothing in finite samples",
    "Because it requires the predictors to be uncorrelated with one another",
  ], answer: 1,
  why: "The guarantee is confined to a **class** — linear and unbiased — and stepping outside it is often profitable: ridge regression accepts a little bias for a large drop in variance and beats least squares on mean squared error. Note what Gauss-Markov does **not** require: normality is unnecessary, the result is exact in finite samples, and correlated predictors are permitted." },

{ id: "d10", ref: "f14", topic: "Weighted least squares as likelihood",
  q: "How does weighted least squares arise from a likelihood?",
  choices: [
    "From Laplace errors, where the weights turn out to be the absolute residuals",
    "From normal errors sharing a common variance, where the weights instead encode prior information",
    "It does not arise from a likelihood at all; the weights are chosen by judgment",
    "From normal errors with observation-specific variances, weighting each by its inverse variance",
  ], answer: 3,
  why: "Write the normal log-likelihood with a different $\\sigma_i^2$ for each observation and the sum that appears is $\\sum (y_i-\\hat y_i)^2/\\sigma_i^2$ — the weighted sum of squares, with weights $1/\\sigma_i^2$. So the weighting is not an ad hoc fix but what the likelihood prescribes once you admit the variances differ. In practice the $\\sigma_i^2$ must themselves be modelled or estimated." },

{ id: "d11", ref: "f14", topic: "Merton's jump sizes",
  q: "In the Merton model the jump sizes are normal on the log scale. What does that imply on the price scale?",
  choices: [
    "Jumps are additive in dollars, with a symmetric effect on the price",
    "Jumps multiply the price by a lognormal factor, which is always positive",
    "Jumps can drive the price negative when a large down jump occurs",
    "Jumps are symmetric in dollars, so up and down jumps are equally large",
  ], answer: 1,
  why: "A normal on the log scale exponentiates to a **lognormal** multiplier, which is strictly positive — so the price cannot be driven to or below zero however large a down jump is. That is the main reason jump models are built on the log scale. Symmetry in logs does **not** mean symmetry in dollars: a $+20\\%$ and a $-20\\%$ log move are mirror images in logs but not in price." },

{ id: "d12", ref: "f14", topic: "What the smile is evidence of",
  q: "Why is the existence of a volatility smile evidence against Black-Scholes rather than evidence of mispricing?",
  choices: [
    "Because the smile is stable over time, and mispricings would be arbitraged away",
    "Because implied volatility is model-dependent, so a smile means the inversion model is wrong",
    "Because a mispricing would show up in the overall price level, not in the shape across strikes",
    "Because Black-Scholes was never intended to price options away from the money",
  ], answer: 1,
  why: "An implied volatility is defined **through** Black-Scholes — it is the number you must feed the formula to recover the market price. So a systematic pattern across strikes says the formula, not the market, is the thing failing to be internally consistent: real tails are fatter than lognormal. The smile's persistence is corroborating, but the logic turns on the inversion being model-dependent in the first place." },

/* ------------------------------------------------ Part 8: likelihood / MLE */
{ id: "d13", ref: "f15", topic: "Likelihood is not a probability",
  q: "Why is it wrong to say the likelihood gives the probability that a parameter takes a particular value?",
  choices: [
    "Because the likelihood is a density rather than a probability mass",
    "Because the likelihood does not integrate to one over the parameter",
    "Because the parameter is fixed and unknown, not random, in this framework",
    "Because the likelihood is only defined up to a multiplicative constant",
  ], answer: 2,
  why: "In the frequentist setting the parameter is a **fixed** unknown number; what is random is the data. So there is no probability distribution over the parameter for the likelihood to be. Attaching one requires a **prior**, which is the Bayesian route to a posterior. The other statements are each true of likelihoods in some sense, but none of them is the reason this reading is wrong." },

{ id: "d14", ref: "f15", topic: "Score equations",
  q: "What characterizes the maximum likelihood estimate in terms of derivatives?",
  choices: [
    "The first derivative of the log-likelihood is maximized over the parameter space",
    "The second derivative of the log-likelihood is zero, giving an inflection point",
    "The first derivative of the likelihood equals the first derivative of the log-likelihood",
    "The first derivative of the log-likelihood is zero and the second is negative there",
  ], answer: 3,
  why: "The MLE solves the **score equations** — derivative of the log-likelihood set to zero — and the second derivative must be negative for that stationary point to be a maximum rather than a minimum or a saddle. A zero second derivative is exactly the **degenerate** case, where the likelihood is locally flat and the parameter is poorly determined." },

{ id: "d15", ref: "f15", topic: "Numerical maximization",
  q: "Why is maximum likelihood for a GARCH model done numerically rather than in closed form?",
  choices: [
    "Because the score equations are nonlinear in the parameters and have no analytic solution",
    "Because the likelihood is unbounded, so no exact maximum exists",
    "Because the data are dependent, which rules out writing a likelihood at all",
    "Because the likelihood is not differentiable in the GARCH parameters, so no gradient exists to follow",
  ], answer: 0,
  why: "Each $\\sigma_t^2$ is a recursive function of **all** earlier returns and of $\\omega,\\alpha,\\beta$, so differentiating the log-likelihood gives a tangle of nonlinear equations with no closed-form root — hence an optimizer. The likelihood is perfectly differentiable and bounded, and the dependence is exactly what **conditioning** handles, letting the likelihood be written as a product." },

{ id: "d16", ref: "f15", topic: "Comparing nested fits",
  q: "A GARCH(1,1) and a GARCH(2,1) are fitted to the same returns. The larger model's log-likelihood is higher by $0.4$. What is the honest conclusion?",
  choices: [
    "The gain is less than a parameter is worth, so the smaller model is preferred",
    "The comparison is invalid because the models have different orders",
    "The larger model fits better and should be preferred",
    "The two models fit equally well, since a difference this small is well within noise",
  ], answer: 0,
  why: "A nested model **cannot** fit worse, so a positive gain is guaranteed and proves nothing by itself. On the AIC scale an extra parameter costs 2, which requires a log-likelihood gain above 1 to be worthwhile; $0.4$ does not clear it, so the extra lag is picking up noise. Nested comparisons are perfectly valid — they are the case where a penalty is most obviously needed." },

{ id: "d17", ref: "f15", topic: "Likelihood and the model",
  q: "Two analysts fit the same GARCH(1,1) to the same returns, one assuming normal innovations and one assuming $t$ innovations, and compare log-likelihoods. What are they comparing?",
  choices: [
    "The same model specification fitted twice under two different optimizers",
    "Two different estimation methods applied to one and the same model specification",
    "Two models, since the innovation distribution is part of the model specification",
    "Nothing comparable at all, since the two log-likelihoods are measured in different units",
  ], answer: 2,
  why: "A model is the **whole** specification, and the innovation distribution is part of it — change it and you have changed the model, even with the variance equation untouched. Maximum likelihood is the method, unchanged across the two. The log-likelihoods are directly comparable because they are evaluated on the same data, which is precisely what lets AIC adjudicate between them." },

/* ------------------------------------------- Part 9: properties of the MLE */
{ id: "d18", ref: "f16", topic: "Consistency vs unbiasedness",
  q: "What is the difference between an estimator being consistent and being unbiased?",
  choices: [
    "Consistency concerns the limit as $n$ grows; unbiasedness is a property at each fixed $n$",
    "Consistency is a statement about the estimator's variance; unbiasedness is a statement about its mean",
    "They are the same property, described on different scales",
    "Consistency holds only for MLEs; unbiasedness can hold for any estimator",
  ], answer: 0,
  why: "Unbiasedness says the estimator is centred on the truth **in every sample size**; consistency says it converges to the truth as the sample grows. Neither implies the other: the MLE of $\\sigma^2$ is biased at every $n$ yet consistent, and one can construct unbiased estimators that never converge. Maximum likelihood promises **consistency**, not unbiasedness." },

{ id: "d19", ref: "f16", topic: "Why regularity conditions matter",
  q: "What goes wrong in the Uniform$(0,\\theta)$ example that makes it the standard warning about asymptotic theory?",
  choices: [
    "The likelihood attains no maximum, so the MLE does not exist for this model",
    "The usual asymptotic normality and the Hessian-based standard errors do not apply",
    "The Fisher information comes out negative, so the Cramér-Rao bound becomes vacuous",
    "The MLE is inconsistent, so no amount of data ever recovers the true $\\theta$",
  ], answer: 1,
  why: "Because the support depends on $\\theta$, the likelihood is **discontinuous** at $\\hat\\theta=\\max_i X_i$ — it jumps to zero below it — so the differentiate-and-invert machinery has nothing to work with and the limiting distribution is not normal. The MLE itself is fine: it exists, it is consistent, it converges faster than $\\sqrt n$. What fails is the **standard theory about it**." },

{ id: "d20", ref: "f16", topic: "Reading a covariance matrix",
  q: "The estimated covariance matrix of $(\\hat\\alpha,\\hat\\beta)$ has a large negative off-diagonal entry. What does that mean practically?",
  choices: [
    "Overstating one parameter tends to go with understating the other, so their sum is better determined than either alone",
    "The two parameters cannot both be positive at the optimum, so one must be constrained",
    "The fit is numerically unstable and the model should be respecified with fewer parameters before its output is used",
    "One of the two standard errors has been computed with the wrong sign somewhere in the code",
  ], answer: 0,
  why: "Negative covariance means the likelihood ridge runs **down-and-right**: trade one parameter off against the other and the fit barely changes. So a function like the sum is pinned down much more tightly than either component — and getting its standard error right requires the off-diagonal entry, which is exactly why the Delta Method uses the whole matrix. A covariance can be negative without anything being wrong." },

{ id: "d21", ref: "f16", topic: "Efficiency",
  q: "What does it mean to say the MLE is asymptotically efficient?",
  choices: [
    "It converges to the truth faster than any other estimator",
    "It requires fewer observations than any competing method before it becomes unbiased",
    "Its computation takes time proportional to the sample size",
    "Its variance approaches the smallest value attainable by an unbiased estimator",
  ], answer: 3,
  why: "Efficiency is about **variance**, not speed of computation or of convergence: as $n$ grows the MLE's variance approaches the Cramér-Rao bound, the floor for unbiased estimators. This is the central argument for using maximum likelihood by default. Note the word asymptotically — in a small sample a competitor can do better, and bias is not what the property is about." },

{ id: "d22", ref: "f16", topic: "Invariance and standard errors",
  q: "Invariance gives the MLE of $g(\\theta)$ as $g(\\hat\\theta)$. What does it not give you?",
  choices: [
    "The sign of $g(\\hat\\theta)$, which depends on the parameterization",
    "The point estimate, which still requires its own maximization",
    "The standard error of $g(\\hat\\theta)$, which needs the Delta Method",
    "Consistency of $g(\\hat\\theta)$, which can fail for nonlinear $g$",
  ], answer: 2,
  why: "Invariance is a statement about the **point estimate** and nothing else: plug in and you are done, no re-maximization needed. The **uncertainty** does not transfer for free, because a nonlinear $g$ stretches the parameter space unevenly — that is the Delta Method's job. Consistency does carry over for continuous $g$, by the continuous mapping theorem." },

{ id: "d23", ref: "f16", topic: "VaR vs CVaR",
  q: "Why is CVaR often considered more informative than VaR at the same level?",
  choices: [
    "Because it averages over the losses beyond the threshold, so it reflects how bad the tail is",
    "Because it does not depend on the fitted distribution in any way, only on the observed sample",
    "Because it is a quantile and therefore easier to estimate from a simulation",
    "Because it is always smaller in magnitude, giving a more conservative figure",
  ], answer: 0,
  why: "VaR tells you where the threshold is and then goes silent: two portfolios with identical VaR can have wildly different losses **beyond** it. CVaR averages over that region and so responds to the tail's shape. It is larger in magnitude than VaR, not smaller; it is a tail **mean** rather than a quantile; and it depends on the fitted distribution just as much." },

{ id: "d24", ref: "f16", topic: "Delta Method assumptions",
  q: "When is the Delta Method likely to give a poor approximation?",
  choices: [
    "When the parameter estimates are correlated with one another",
    "When the sample size is large, since the linearization degrades",
    "When the function is monotone over the parameter space, since the gradient never changes sign",
    "When the function is strongly curved over the range of plausible parameter values",
  ], answer: 3,
  why: "The method replaces $g$ by its **tangent plane** at the estimate, so it is accurate exactly when $g$ is close to linear over the region the estimate plausibly occupies. Strong curvature there — or an estimate so imprecise that the region is wide — is what breaks it. Correlated parameters are handled by the covariance matrix, and a **larger** sample narrows the region and makes the approximation better." },

/* ---------------------------------------------- Part 10: model selection */
{ id: "d25", ref: "f17", topic: "What the GED nests",
  q: "Which distributions arise as special cases of the generalized error distribution?",
  choices: [
    "The Laplace and the Cauchy, at two values of the shape parameter",
    "The normal and the lognormal, depending on the scale parameter",
    "The normal and the Student-$t$, at two values of the shape parameter",
    "The normal and the Laplace, at two values of the shape parameter",
  ], answer: 3,
  why: "The GED's exponent on $|x|$ gives the **normal** when it is 2 and the **Laplace** when it is 1, with values below 1 giving tails heavier still. The $t$ and the Cauchy are not in the family: they have power-law tails while the GED's are exponential-type, which is precisely why both get fitted and compared rather than one standing in for the other." },

{ id: "d26", ref: "f17", topic: "Tails and the choice of family",
  q: "A skewed $t$ and a GED are both fitted to the same returns. What is the substantive difference between them?",
  choices: [
    "The GED can be skewed while the $t$ cannot, so only the GED captures asymmetry",
    "They differ in the shape of the tails and in whether asymmetry is permitted",
    "The GED has heavier tails than any $t$, whatever the parameters",
    "They are the same family under a reparameterization, so the fits must agree",
  ], answer: 1,
  why: "Two separate axes are in play: how the tails decay — the $t$'s are power-law and heavier far out, the GED's are exponential-type — and whether the two tails are allowed to differ, which the plain GED does not permit but a skewed $t$ does. Comparing them by AIC is asking which pair of answers the data prefer, and skewed versions of the GED exist too." },

{ id: "d27", ref: "f17", topic: "Why AIC penalizes",
  q: "What is the AIC penalty actually correcting for?",
  choices: [
    "The optimism of the maximized log-likelihood as an estimate of out-of-sample fit",
    "The bias in the parameter estimates that is introduced by maximizing a likelihood",
    "The dependence between consecutive observations in a time series",
    "The fact that different models may be fitted on different samples",
  ], answer: 0,
  why: "The maximized log-likelihood is evaluated at parameters **chosen to suit that very sample**, so it flatters the model — and more parameters means more flattery. AIC's charge of 2 per parameter is an estimate of that optimism, which turns an in-sample number into an approximate out-of-sample one. It is not a bias correction for the estimates themselves, and comparing fits on different samples is simply not allowed." },

{ id: "d28", ref: "f17", topic: "AIC disagreement",
  q: "AIC prefers a four-parameter model and BIC prefers a three-parameter one, on several thousand daily returns. What is going on?",
  choices: [
    "The models are not nested within one another, so neither criterion can legitimately compare them",
    "BIC is the correct one here, since it is consistent for model selection",
    "One of the two criteria must have been computed incorrectly somewhere",
    "The log-likelihood gain is worth more than 2 but less than $\\tfrac12\\log n$ per parameter",
  ], answer: 3,
  why: "The two criteria differ only in the per-parameter charge — 2 against $\\log n$, which is around 8 here — so the gain from the extra parameter can easily clear the smaller bar and miss the larger one. Disagreement in that band is expected, not an error. BIC's consistency is for the case where the true model is in the candidate set, which is a strong thing to assume about returns." },

{ id: "d29", ref: "f17", topic: "Model selection and purpose",
  q: "A normal model and a skewed-$t$ model differ by very little in AIC on a long return series. Why might you still prefer the skewed $t$ for a risk calculation?",
  choices: [
    "Because the normal model cannot be fitted by maximum likelihood to skewed data at all",
    "Because the two models can agree near the centre and still differ sharply in the tail, which is what a VaR depends on",
    "Because a skewed $t$ always produces a larger VaR than a normal, which is more conservative",
    "Because AIC systematically understates the value of extra parameters once the sample runs to several thousand observations",
  ], answer: 1,
  why: "AIC is an aggregate measure of fit over the **whole** distribution, where the bulk of the observations sit near the centre, so two models can score alike while their 1% quantiles are far apart — and a VaR lives entirely out there. Fit criteria answer the question they were built for; the **purpose** of the model has to be weighed separately. There is also no guarantee the skewed $t$ gives a larger VaR, since skew can go either way." },

/* ----------------------------------------------------- Part 11: the DEJD */
{ id: "d30", ref: "f18", topic: "Equivalence of the formulations",
  q: "Kou uses one Poisson process with an up-jump probability; Ramezani and Zeng use two independent processes. Which result makes these equivalent?",
  choices: [
    "That the sum of independent Poisson random variables is Poisson",
    "That a Poisson process has independent increments over disjoint intervals",
    "That the superposition of independent Poisson processes is Poisson with the rates summed",
    "That a thinned Poisson process is Poisson with rate reduced by the thinning probability",
  ], answer: 2,
  why: "Superposition is the one that does the work: $P(\\min(T_1,T_2)>t)=e^{-\\lambda_1t}e^{-\\lambda_2t}$, so the merged stream has exponential gaps at rate $\\lambda_1+\\lambda_2$ and is itself a Poisson process. Thinning is the same statement read backwards and is a fair way to get from Kou to Ramezani-Zeng; the sum of Poisson **variables** is about counts at a fixed time and is not enough to conclude the merged **process** is Poisson." },

{ id: "d31", ref: "f18", topic: "Pareto and Beta as multipliers",
  q: "Why does the Ramezani-Zeng formulation use a Pareto for up jumps and a Beta for down jumps rather than, say, two Gammas?",
  choices: [
    "Because a Gamma distribution has no closed-form likelihood contribution when it enters as a multiplier on the price",
    "Because the Pareto and the Beta are the conjugate priors for a Poisson rate parameter",
    "Because their supports, above 1 and inside $(0,1)$, make the multipliers raise and lower the price respectively",
    "Because the Pareto and the Beta have tails heavier than those of any Gamma distribution",
  ], answer: 2,
  why: "These jumps **multiply** the current price, so the direction of a jump is decided entirely by whether the multiplier exceeds 1. The Pareto's support starts at 1 and the Beta's ends there, which forces the two directions without any further constraint — and keeps the price positive. A Gamma spans both sides of 1 and so could not be assigned a direction." },

{ id: "d32", ref: "f18", topic: "Log scale and price scale",
  q: "Why do the price-scale Pareto/Beta formulation and the log-scale double-exponential formulation describe the same model?",
  choices: [
    "Because the log of a Pareto and the log of a Beta are both Exponential",
    "Because both formulations are fitted by maximum likelihood to the same data",
    "Because the Pareto and Beta are limits of the exponential as the rate grows",
    "Because multiplying prices and adding log prices are different operations with the same mean",
  ], answer: 0,
  why: "Multiplication on the price scale is addition on the log scale, and the two jump distributions transform into exactly the pieces Kou assumes: $\\log$ of a Pareto$(\\eta_u)$ is Exponential$(\\eta_u)$, and $\\log$ of a Beta$(\\eta_d,1)$ is Exponential$(\\eta_d)$ with a sign flip. Same model, two coordinate systems. Using the same estimation method on the same data would not make two models equivalent." },

{ id: "d33", ref: "f18", topic: "What the DEJD is for",
  q: "The DEJD's headline selling point is tractable pricing for exotic and path-dependent options. Why is a jump model particularly suited to that?",
  choices: [
    "Because the exponential jump size distributions admit a closed-form price for any payoff whatsoever, however the contract is written",
    "Because jumps make the payoff function differentiable at the barrier, which closed forms need",
    "Because exotic payoffs depend on the whole trajectory, which a process model describes and a marginal distribution does not",
    "Because jumps eliminate the need for risk-neutral pricing of the contract altogether",
  ], answer: 2,
  why: "A barrier option cares whether the price **ever** touched a level and an Asian option about its **average**, so both need a model of the path through time — which is what a jump diffusion is, and what a fitted heavy-tailed density for daily returns is not. The exponential jump sizes are what make the mathematics come out, but not for arbitrary payoffs, and risk-neutral pricing is still required." },
];
