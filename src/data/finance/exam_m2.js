/* StatLab — Practice Midterm Two.
 *
 * 33 original questions on Parts 6-11, written to the professor's stated
 * conditions for the second midterm:
 *   - same format and length as Midterm One; similar style of question
 *   - covers Parts 6 through 11 inclusive
 *   - no notes, calculator or computer
 *   - you will not write or debug Python; code appears only to be read
 *     and interpreted, and the emphasis is on interpreting results
 *   - you do not need to compute Hessians by hand, nor reproduce the
 *     DEJD derivations; you need the structure and the reasons
 *
 * Coverage is 6/6/5/7/5/4 across Parts 6 to 11, weighted toward Part 9,
 * which is the longest Part in the notes and the most heavily represented
 * on the review sheet. The answer key is balanced across a/b/c/d, no
 * explanation names a choice by position, and no key is the longest
 * choice more often than chance.
 */

export const EXAM_M2_META = {
  title: "Practice Midterm Two",
  subtitle: "Statistical Methods in Finance · Parts 6-11",
  minutes: 75,
  pointsPer: 3,
  rules: [
    "33 questions, 3 points each (99 points total). Exactly one correct response each.",
    "75 minutes. The timer starts when you click Begin.",
    "Covers Parts 6 through 11 of the lecture notes, inclusive.",
    "No notes, books, calculator, laptop or phone — nothing here needs arithmetic you cannot do in your head.",
    "You will not be asked to write or debug Python. Code appears only to be read, and what is tested is whether you can interpret it and its output.",
    "You are not expected to calculate Hessians or Jacobians by hand, nor to reproduce the DEJD derivations — only to know what they are and why they matter.",
    "\"iid\" stands for \"independent and identically distributed.\"",
  ],
};

export const EXAM_M2 = [
/* ------------------------------------------------ Part 6: Poisson process */
{ id: "m1", ref: "f13", topic: "Poisson distribution",
  q: "If $X\\sim\\text{Poisson}(\\lambda)$, what are $\\E(X)$ and $\\Var(X)$?",
  choices: [
    "$\\E(X)=\\lambda$ and $\\Var(X)=\\lambda$, which are equal",
    "$\\E(X)=\\lambda$ and $\\Var(X)=\\lambda^2$, the square of the mean",
    "$\\E(X)=1/\\lambda$ and $\\Var(X)=1/\\lambda^2$, both reciprocals",
    "$\\E(X)=\\lambda$ and $\\Var(X)=\\lambda(1-\\lambda)$, as for a count",
  ], answer: 0,
  why: "The Poisson is the distribution whose **mean and variance are the same number**, which is its most distinctive property and a common one-line question. The reciprocals $1/\\lambda$ and $1/\\lambda^2$ belong to the **Exponential**, which describes the gaps between Poisson events rather than the counts; $p(1-p)$ is the **Bernoulli** variance." },

{ id: "m2", ref: "f13", topic: "Exponential distribution",
  q: "For $X\\sim\\text{Exponential}(\\lambda)$, what is $P(X>x)$ for $x\\ge0$?",
  choices: [
    "$1-e^{-\\lambda x}$, which is the CDF of the distribution",
    "$\\lambda e^{-\\lambda x}$, which is the density of the distribution",
    "$e^{-\\lambda x}$, the survival function",
    "$1-e^{-x/\\lambda}$, with the rate entering as a scale",
  ], answer: 2,
  why: "The CDF is $F_X(x)=1-e^{-\\lambda x}$, so the survival probability is $P(X>x)=1-F_X(x)=e^{-\\lambda x}$. This is the form that gets used in practice — it is what makes the memoryless proof collapse to one line, since $e^{-\\lambda(a+b)}/e^{-\\lambda b}=e^{-\\lambda a}$. Note that a **density** is not a probability, so it cannot be the answer to a question of this shape." },

{ id: "m3", ref: "f13", topic: "Memoryless property",
  q: "What does the memoryless property of the Exponential distribution say, in words?",
  choices: [
    "Waiting a long time makes the next event more likely, since the rate must average out",
    "The distribution of the remaining wait does not depend on how long you have waited",
    "The expected waiting time is the same whatever the value of the rate $\\lambda$",
    "The counts of events in disjoint time intervals have the same expected value",
  ], answer: 1,
  why: "$P(X>a+b\\mid X>b)=P(X>a)$: given that you have already waited $b$ units, the probability of waiting a further $a$ is the **same as the original probability** of waiting $a$. The distribution \"forgets\" how long it has been since the previous event. This follows from the construction's assumption that each short subinterval decides independently whether an event occurs there." },

{ id: "m4", ref: "f13", topic: "Poisson process",
  q: "Events occur as a Poisson process with rate $\\lambda$. Which of these statements is **false**?",
  choices: [
    "The number of events in an interval of length $T$ is Poisson$(\\lambda T)$",
    "The times between successive events are independent Exponential$(\\lambda)$ variables",
    "The waiting time until the $k$th event has the Gamma$(k,\\lambda)$ distribution",
    "The numbers of events in overlapping time intervals are independent",
  ], answer: 3,
  why: "Property 4 states that the counts in **disjoint** intervals are independent. Overlapping intervals share events, so their counts are obviously dependent — the single word that changes is doing all the work here. The other three are Properties 1, 2 together with 3, and 5 respectively, all stated correctly." },

{ id: "m5", ref: "f13", topic: "Binomial model",
  q: "In the binomial model for stock prices, $S_t$ takes the $t+1$ values $S_0u^kd^{\\,t-k}$. Which quantity has the binomial distribution?",
  choices: [
    "The number of up steps $k$, with parameters $t$ and $p$",
    "The price $S_t$ itself, with parameters $t$ and $p$",
    "The log price $\\log S_t$, with parameters $t$ and $p$",
    "Nothing in this model has a binomial distribution",
  ], answer: 0,
  why: "Each step is an independent Bernoulli trial, so the **count of up steps** is binomial$(t,p)$, giving $P(S_t=S_0u^kd^{t-k})=\\binom{t}{k}p^k(1-p)^{t-k}$. The notes state explicitly that **$S_t$ is not binomial**: a binomial variable takes the integer values $0,\\ldots,t$, whereas $S_t$ takes $t+1$ products of $u$'s and $d$'s." },

{ id: "m6", ref: "f13", topic: "Poisson as a limit",
  q: "Divide a fixed interval into $n$ equal subintervals and place a mark in each, independently, with probability $\\lambda/n$. What happens to the total number of marks as $n$ grows?",
  choices: [
    "Its expected value grows without bound as more subintervals are added",
    "Its distribution converges to Exponential$(\\lambda)$ in the limit",
    "Its distribution converges to Poisson$(\\lambda)$ in the limit",
    "It converges to a normal distribution, by the central limit theorem",
  ], answer: 2,
  why: "The count is binomial$(n,\\lambda/n)$ at every $n$, and $\\lim_{n\\to\\infty}P(X_n=k)=\\lambda^ke^{-\\lambda}/k!$. This is the derivation of the Poisson pmf, and the $e^{-\\lambda}$ in it is nothing more than $\\lim(1-\\lambda/n)^n$. Note the expected value is $n\\cdot\\lambda/n=\\lambda$ for **every** $n$, so it does not grow at all — that is the point of letting $p$ shrink as $n$ rises." },

/* -------------------------------------------------- Part 7: Mean models */
{ id: "m7", ref: "f14", topic: "Mean models",
  q: "Why is a mean model not a probability model?",
  choices: [
    "Because it does not fully specify the distribution of the random variables",
    "Because it cannot be fitted by maximum likelihood, only by least squares",
    "Because it describes a single observation rather than a whole sample",
    "Because its parameters are not identifiable without further assumptions",
  ], answer: 0,
  why: "A mean model gives $\\E(Y_i)=m(\\theta,\\mathbf{x}_i)$ and says nothing about the scatter around that curve, so you cannot obtain variances, quantiles or likelihoods from it. A full probability model specifies the entire distribution. Adding marginal distributions for the errors **and** an independence assumption is exactly what converts one into the other." },

{ id: "m8", ref: "f14", topic: "Weighted least squares",
  q: "When is weighted least squares preferred to ordinary least squares, and how are the weights assigned?",
  choices: [
    "When the mean model is nonlinear; the weights offset its curvature",
    "When the errors are heteroskedastic; higher variance gets lower weight",
    "When the errors are heteroskedastic; higher variance gets higher weight",
    "When the parameter estimates are correlated; the weights decorrelate them",
  ], answer: 1,
  why: "WLS exists for **heteroskedasticity** — when the variance of the errors is not constant. Less reliable observations should influence the fit less, so higher variance means **lower** weight. The options example is the standard one: prices of heavily-traded options are more reliable than thinly-traded ones, so the natural weight is trading volume." },

{ id: "m9", ref: "f14", topic: "minimize()",
  q: "You want to use `scipy.optimize.minimize` to **maximize** a function. What do you do?",
  choices: [
    "Pass the keyword option `maximize=True` to the function",
    "Supply a negative starting value for the parameter being fitted",
    "Choose `method='Nelder-Mead'`, which maximizes rather than minimizes",
    "Define the function as the negative of the one you want to maximize",
  ], answer: 3,
  why: "The optimization procedure minimizes whatever function it is handed, so to maximize you define the function as the **negative** of it. This is precisely why every likelihood example in the course minimizes the **negative** log-likelihood. The `method` argument only selects the optimization technique; it never changes the direction of the search." },

{ id: "m10", ref: "f14", topic: "Volatility smile",
  q: "If Black-Scholes were literally correct, what would a plot of implied volatility against strike price look like for options sharing one expiration date?",
  choices: [
    "A U-shaped curve, which is the reason it is called a smile",
    "An upward-sloping line, since distant strikes carry more risk",
    "A flat horizontal line, since volatility is a fixed constant",
    "A downward-sloping line, since far strikes are cheaper to buy",
  ], answer: 2,
  why: "Black-Scholes treats volatility as a **fixed constant** $\\sigma$, so every option on the same underlying with the same expiry should invert to the same implied volatility whatever its strike. Real markets instead show a **smile** or **skew**, and that discrepancy is the evidence that the true return distribution is not the one Black-Scholes assumes." },

{ id: "m11", ref: "f14", topic: "Merton model",
  q: "Which three ingredients define the Merton model?",
  choices: [
    "A GARCH variance equation, Poisson jumps, and normal jump sizes",
    "Brownian diffusion, Poisson jump arrivals, and iid exponential jump sizes",
    "Brownian diffusion, jumps at fixed known dates, and normal jump sizes",
    "Brownian diffusion, Poisson jump arrivals, and iid normal jump sizes",
  ], answer: 3,
  why: "The smooth diffusion component of the log price is a Brownian motion with drift $\\nu$ and volatility $\\sigma^2$; jumps arrive as a **Poisson process** with rate $\\lambda$ per year; and jump sizes are **iid normal** with mean $\\mu_j$ and variance $\\sigma_j^2$. Exponential jump sizes, split into up and down, are what distinguishes the **DEJD**. Jumps at known dates would defeat the purpose — the Poisson assumption is precisely that shocks are unpredictable." },

{ id: "m12", ref: "f14", topic: "Merton model",
  q: "Under the Merton model, is the distribution of the daily log returns normal?",
  choices: [
    "Yes, since a sum of independent normal random variables is normal",
    "No, because the number of jumps entering the sum is itself random",
    "Yes, but only when the jump rate $\\lambda$ is sufficiently small",
    "No, because the diffusion component is not normal to begin with",
  ], answer: 1,
  why: "The log return is $X+\\sum_{k=1}^{J}U_k$ with $X$ normal and each $U_k$ normal, but $J$ **Poisson and random**. Conditional on $J=j$ it is normal; unconditionally it is a Poisson mixture of normals with differing variances, which has **heavier tails** than any single normal. That heaviness is the whole reason the model exists — it is what captures the volatility smile." },

/* --------------------------------------------------------- Part 8: MLE */
{ id: "m13", ref: "f15", topic: "Likelihood",
  q: "What is a likelihood function?",
  choices: [
    "The probability distribution of the parameter given the observed data",
    "The joint distribution of the data, as a function of the data for fixed $\\theta$",
    "The joint distribution of the data, as a function of $\\theta$ for fixed data",
    "The probability that the fitted model is in fact the correct model",
  ], answer: 2,
  why: "The likelihood is the **same object** as the joint distribution; what changes is which argument you hold fixed. In a probability course you fix $\\theta$ and read it as a function of $\\mathbf{x}$. For likelihood you fix the data and read it as a function of $\\theta$. It is emphatically **not** a probability distribution for the parameter — the notes flag this directly under the plot of $L(\\lambda)$." },

{ id: "m14", ref: "f15", topic: "Log-likelihood",
  q: "Why is the log-likelihood maximized rather than the likelihood itself?",
  choices: [
    "Because the log turns a product into a sum, preventing underflow",
    "Because the likelihood can be negative, which optimizers cannot handle",
    "Because the log-likelihood attains its maximum at a different point",
    "Because the likelihood is not differentiable in most models of interest",
  ], answer: 0,
  why: "In the iid case the likelihood is a product of $n$ densities, which at any realistic $n$ is either enormous or numerically zero. The log turns it into a **sum**, giving workable values and far simpler derivatives. The maximizer is **unchanged**, since $\\log$ is increasing and the likelihood is positive at its maximum. The curvature of the log-likelihood also carries the theory of Part 9." },

{ id: "m15", ref: "f15", topic: "MLE and least squares",
  q: "Maximizing the log-likelihood gives the same $\\theta$ as minimizing the residual sum of squares. Under what condition, and does it generalize?",
  choices: [
    "For any iid errors having mean zero and finite variance",
    "When the errors are iid normal; it extends to any symmetric error law",
    "Whenever the mean model is linear in $\\theta$; the errors are irrelevant",
    "When the errors are iid normal; it does not hold for other error laws",
  ], answer: 3,
  why: "The normal log-likelihood is a constant minus $\\frac{1}{2\\sigma^2}\\sum\\big(y_i-m(\\theta,\\mathbf{x}_i)\\big)^2$, so maximizing over $\\theta$ is identical to minimizing the sum of squares. This comes directly from the **squared term in the normal's exponent**, making it a unique property of the normal that does **not** extend to other error distributions, symmetric or otherwise. Linearity of the mean model plays no part." },

{ id: "m16", ref: "f15", topic: "GARCH likelihood",
  q: "The GARCH(1,1) likelihood is written as $\\prod_{t}f_{X_t\\mid\\mathcal{F}_{t-1}}$ rather than as a product of marginal densities. Why?",
  choices: [
    "Because the marginal density of $X_t$ has no closed-form expression",
    "Because the observations are not independent, so marginals cannot be multiplied",
    "Because conditioning avoids specifying any distribution for $X_t$ at all",
    "Because a product of marginals would force the condition $\\alpha+\\beta<1$",
  ], answer: 1,
  why: "Writing the joint density as a product of **marginals** requires independence, and GARCH exists precisely to model dependence through time. So the joint density is factored by repeatedly conditioning, using $f_{X,Y}=f_{X\\mid Y}f_Y$, and each conditional distribution is $N(0,\\sigma_t^2)$ with $\\sigma_t^2$ supplied by the recursion." },

{ id: "m17", ref: "f15", topic: "Numerical issues",
  q: "Why are log returns scaled before a GARCH model is fitted?",
  choices: [
    "Because unscaled returns violate the stationarity condition $\\alpha+\\beta<1$",
    "Because scaling makes the returns approximately normally distributed",
    "Because the arch package requires percentages rather than decimals",
    "Because the optimizer struggles when values and gradients are tiny",
  ], answer: 3,
  why: "Daily log returns are small, and smaller still once squared, so the variance of unscaled returns is minute and the optimization can underflow or fail to converge. Scaling prevents numerical underflow and helps the optimizer converge — the same reason `arch` offers `rescale=True`. It is a numerical convenience that changes neither the distribution nor the stationarity condition." },

/* ---------------------------------------------- Part 9: properties of MLEs */
{ id: "m18", ref: "f16", topic: "Variance of the MLE",
  q: "What is the approximate variance of a single-parameter MLE $\\widehat\\theta$?",
  choices: [
    "The second derivative of the negative log-likelihood at $\\widehat\\theta$",
    "The inverse of that second derivative, evaluated at $\\widehat\\theta$",
    "The inverse of the log-likelihood itself, evaluated at $\\widehat\\theta$",
    "The square of the first derivative of the log-likelihood at $\\widehat\\theta$",
  ], answer: 1,
  why: "The variance is $\\big(-d^2\\ell(\\theta)/d\\theta^2\\big|_{\\theta=\\widehat\\theta}\\big)^{-1}$ — the **inverse** of the curvature. The direction matters: a **sharp** minimum, meaning a large second derivative, indicates greater certainty about where the parameter lies, hence a **smaller** variance. Forgetting to invert reverses the entire relationship." },

{ id: "m19", ref: "f16", topic: "Regularity conditions",
  q: "For $X_1,\\ldots,X_n$ iid Uniform$(0,\\theta)$ the MLE is $\\widehat\\theta=\\max\\{X_1,\\ldots,X_n\\}$, which is never approximately normal. Which regularity condition fails?",
  choices: [
    "The model is not identifiable, since distinct $\\theta$ give one model",
    "The likelihood is not differentiable at the point of its maximum",
    "The support of the distribution changes with the parameter $\\theta$",
    "The true parameter lies on the boundary of the parameter space",
  ], answer: 2,
  why: "The density of $\\widehat\\theta$ is $n\\,t^{n-1}/\\theta^n$ on $(0,\\theta)$ — a rising curve that stops dead at $\\theta$, nothing like a normal at any sample size. The reason is the first condition: the support of Uniform$(0,\\theta)$ is $(0,\\theta)$, which **moves as $\\theta$ moves**. The model is perfectly identifiable, and $\\theta$ itself is not on a boundary." },

{ id: "m20", ref: "f16", topic: "Hessian",
  q: "In the multiparameter case, what does the inverse Hessian of the negative log-likelihood give you?",
  choices: [
    "A vector of standard errors, with one entry for each parameter",
    "The Fisher Information Matrix for the model being fitted",
    "The Jacobian matrix of the parameter transformation $\\mathbf{g}$",
    "A covariance matrix, including covariances between the estimators",
  ], answer: 3,
  why: "$V(\\widehat{\\boldsymbol\\theta})\\approx-\\big(\\nabla^2\\ell(\\boldsymbol\\theta)|_{\\widehat{\\boldsymbol\\theta}}\\big)^{-1}$ is a full **covariance matrix**. The off-diagonal entries matter: in the Gamma example $\\text{Corr}(\\widehat\\alpha,\\widehat\\beta)\\approx0.9$, so a pair like $\\alpha=2.8,\\beta=0.8$ looks plausible parameter-by-parameter yet is revealed as highly unlikely once the covariance is accounted for. The Fisher Information is the **expected** curvature over random data sets, not this observed one." },

{ id: "m21", ref: "f16", topic: "Invariance",
  q: "The MLE for $\\lambda$ in an iid Exponential sample is $1/\\bar X$. What is the MLE for $P(X_i>a)$?",
  choices: [
    "$1-e^{-a/\\bar X}$, the complementary probability",
    "$e^{-a/\\bar X}$, by substituting the estimate",
    "$a/\\bar X$, the rate multiplied by the threshold",
    "It cannot be found without re-maximizing the likelihood",
  ], answer: 1,
  why: "By the **invariance property**, if $\\widehat\\theta$ is the MLE for $\\theta$ then $g(\\widehat\\theta)$ is the MLE for $g(\\theta)$. Here $P(X_i>a)=e^{-\\lambda a}$, so substituting $\\widehat\\lambda=1/\\bar X$ gives $e^{-a/\\bar X}$ directly, with no re-maximization needed. Note that $1-e^{-\\lambda a}$ is $P(X_i\\le a)$, which is the wrong tail." },

{ id: "m22", ref: "f16", topic: "Delta Method",
  q: "If invariance already supplies the MLE of a transformed parameter, what does the Delta Method add?",
  choices: [
    "It removes the bias that the transformation introduces",
    "It confirms that the transformation $g$ is one-to-one",
    "It gives the standard error, and hence a confidence interval",
    "It supplies the point estimate when $g$ is not invertible",
  ], answer: 2,
  why: "Plugging in gives the **point estimate** $g(\\widehat\\theta)$ and nothing else. The Delta Method supplies the **standard error** — $g'(\\mu)^2\\sigma_n^2$ in one dimension, or $\\mathbf{G}\\Sigma\\mathbf{G}^T$ with the Jacobian in the multiparameter case — which is what a confidence interval requires. The professor's review sheet asks this almost verbatim." },

{ id: "m23", ref: "f16", topic: "Delta Method",
  q: "In the multiparameter Delta Method, $\\mathbf{g}(\\widehat{\\boldsymbol\\theta})$ has approximate variance $\\mathbf{G}\\Sigma\\mathbf{G}^T$. What is $\\mathbf{G}$?",
  choices: [
    "The Jacobian of $\\mathbf{g}$, with $(i,j)$ entry $\\partial g_i/\\partial t_j$",
    "The Hessian of the negative log-likelihood at the estimate",
    "The covariance matrix of the original parameter estimates",
    "The matrix of second partial derivatives of the function $\\mathbf{g}$",
  ], answer: 0,
  why: "$\\mathbf{G}$ is the **Jacobian** — the $m\\times p$ matrix of **first** partial derivatives of the transformation. $\\Sigma$ is the covariance matrix of $\\widehat{\\boldsymbol\\theta}$, obtained from the inverse Hessian; those are two distinct ingredients, and the formula sandwiches one between two copies of the other. Second derivatives are the Hessian's business, not the Jacobian's." },

{ id: "m24", ref: "f18", topic: "Exotic options",
  q: "The DEJD is said to maintain tractable pricing formulas for **exotic** and **path-dependent** options. What is a path-dependent option?",
  choices: [
    "One whose payoff depends on the whole price history of the underlying",
    "One that may be exercised at any time before its expiration date",
    "One written on another option rather than on an underlying asset",
    "One whose strike price is reset at fixed intervals before expiry",
  ], answer: 0,
  why: "Path-dependent means the payoff depends on the **entire history** of the underlying asset's price over the time the option is held, not merely on the final price. **Barrier** options (cancelled if the price reaches a certain level) and **Asian** options (payoff computed from the **average** price) are the two standard examples. Early exercise is the American/European distinction, and an option on an option is a different sort of exotic. The DEJD captures the realistic jump trajectory needed to price these accurately." },

{ id: "m25", ref: "f16", topic: "VaR and CVaR",
  q: "What does CVaR at level $\\alpha$ tell you that VaR does not?",
  choices: [
    "The probability that the VaR threshold will be exceeded at all",
    "The expected size of the losses, given that the threshold is exceeded",
    "The largest loss that is possible under the fitted model",
    "The confidence level at which the risk estimate remains valid",
  ], answer: 1,
  why: "VaR is a **threshold** — the $1-\\alpha$ percentile of the loss distribution — so it gives only a **lower bound** on what you lose in the extreme event. CVaR, or expected shortfall, is the conditional expectation $\\E(L\\mid L>\\text{VaR}_\\alpha)$: given that the extreme event occurs, what are the actual expected losses? That is why it is described as the more informative of the two." },

/* --------------------------------------------- Part 10: model selection */
{ id: "m26", ref: "f17", topic: "Overfitting",
  q: "Why can't four candidate distributions simply be ranked by their maximized log-likelihoods?",
  choices: [
    "Because likelihoods from different families are on different scales",
    "Because the likelihood is only ever defined up to an additive constant",
    "Because only models that are nested within one another can be compared",
    "Because more complex models necessarily fit the sample better",
  ], answer: 3,
  why: "A model with more parameters has more flexibility and will fit the observed sample at least as well — strictly so when the simpler model is nested inside it. Ranking by raw likelihood therefore always selects the most complex candidate, chasing **artifacts** in the sample rather than features of the population. AIC fixes this by adding the penalty $2p$." },

{ id: "m27", ref: "f17", topic: "Nested models",
  q: "Model 1 is nested in Model 2. What follows about their maximized likelihoods?",
  choices: [
    "Model 2's is greater than or equal to Model 1's, necessarily",
    "Model 1's is greater, since fewer parameters means less noise",
    "They are equal, since nesting means the models agree at the optimum",
    "Nothing follows without knowing how many parameters each has",
  ], answer: 0,
  why: "Nesting means Model 1 is a **special case** of Model 2, so Model 2 can always reproduce whatever Model 1 does and then try to do better. Its maximized likelihood is therefore at least as large, by construction. In the running example the Normal is nested in the GED (take $\\beta=2$) and the nonstandard $t$ is nested in the skewed $t$ (take $a=b$). This is exactly why likelihood alone cannot rank them." },

{ id: "m28", ref: "f17", topic: "GED",
  q: "In the Generalized Error Distribution, what role does the shape parameter $\\beta$ play?",
  choices: [
    "It controls the skew, with $\\beta<1$ giving a negative skew",
    "It rescales the density so that it integrates to one",
    "It is a degrees-of-freedom, so larger $\\beta$ gives heavier tails",
    "It controls tail weight, with $\\beta=2$ recovering the normal",
  ], answer: 3,
  why: "$\\beta$ is the tail-weight dial. $\\beta=2$ recovers the **normal**$(\\mu,\\alpha^2/2)$, $\\beta=1$ gives the **double exponential** (Laplace), $\\beta<2$ gives heavy tails useful for returns, and $\\beta>2$ gives tails **lighter** than the normal — so larger $\\beta$ means lighter, not heavier. The GED is **symmetric** around $\\mu$ at every $\\beta$, so it cannot produce skew." },

{ id: "m29", ref: "f17", topic: "AIC",
  q: "AIC is $-2\\log L(\\theta)+2p$. Which pair of requirements applies when using it to compare models?",
  choices: [
    "The data must be the same; the models need not be nested",
    "The models must be nested; the data fitted may differ between them",
    "The data must be the same, and the models must also be nested",
    "Neither requirement applies, since the penalty corrects for both",
  ], answer: 0,
  why: "AIC **requires the vector of data being fit to remain the same**, since otherwise the likelihoods are not comparable at all. It **does not require the models to be nested** — which is exactly what lets it rank a GED against a $t$-distribution, neither of which is a special case of the other." },

{ id: "m30", ref: "f17", topic: "AIC versus BIC",
  q: "How should you choose between AIC and BIC?",
  choices: [
    "BIC for prediction; AIC when identifying the true underlying model",
    "AIC for large samples; BIC whenever the sample is small",
    "AIC for prediction; BIC when identifying the true underlying model",
    "They always select the same model, so the choice does not matter",
  ], answer: 2,
  why: "**AIC** is generally preferred when the goal is **prediction**, since it penalizes complexity less. **BIC** has a stronger penalty for extra parameters and is preferred when trying to identify the **\"true\"** underlying model. It can be surprising that these goals lead to different models, but they do — getting the best predictions and finding the true model are not the same objective." },

/* ------------------------------------------------- Part 11: the DEJD model */
{ id: "m31", ref: "f18", topic: "DEJD",
  q: "Why does the DEJD model split jumps into two independent Poisson processes rather than using one?",
  choices: [
    "Because a single Poisson process is unable to produce heavy tails",
    "Because two processes are needed for the combination to stay Poisson",
    "Because the up and down jumps must be identified separately in data",
    "Because it allows different rates and sizes for up and down jumps",
  ], answer: 3,
  why: "Separate processes let the model give a **different rate** and a **different size distribution** to the two kinds of jump, which captures the observed asymmetry — more extreme down jumps than up jumps, the leverage effect. Merton's single symmetric jump distribution produces heavy tails perfectly well; what it cannot produce is **skew**. And up and down jumps are in fact **never identified in the data**." },

{ id: "m32", ref: "f18", topic: "PBJD",
  q: "In the Ramezani-Zeng formulation, why are up jumps Pareto and down jumps Beta?",
  choices: [
    "Because the Pareto has heavier tails, and up moves exceed down moves",
    "Because the Beta is bounded, keeping the likelihood numerically stable",
    "Because the Pareto's support exceeds 1 and the Beta's lies in $(0,1)$",
    "Because the log of a Pareto is normal and the log of a Beta is lognormal",
  ], answer: 2,
  why: "It is entirely about **support**, because these jumps **multiply** the current price. The Pareto takes values above 1, so multiplying increases the price — an up jump. The Beta takes values in $(0,1)$, so multiplying decreases it — a down jump that can never push the price negative. For the record the log of a Pareto is **Exponential**, which is exactly why this price-scale formulation matches Kou's log-scale one." },

{ id: "m33", ref: "f18", topic: "Combining Poisson processes",
  q: "Two independent Poisson processes have rates $\\lambda_1$ and $\\lambda_2$. What is the combined process?",
  choices: [
    "A Poisson process whose rate is the product $\\lambda_1\\lambda_2$",
    "A Poisson process whose rate is the sum $\\lambda_1+\\lambda_2$",
    "Not a Poisson process, since superposition destroys independence",
    "A Gamma process with shape parameter equal to two",
  ], answer: 1,
  why: "Let $T=\\min(T_1,T_2)$ be the wait to the next event of either type. Then $P(T>t)=P(T_1>t)P(T_2>t)=e^{-\\lambda_1t}e^{-\\lambda_2t}=e^{-(\\lambda_1+\\lambda_2)t}$, so $T\\sim$ Exponential$(\\lambda_1+\\lambda_2)$ and the combined process is Poisson with the rates **added**. This is what makes Kou's single-process formulation and Ramezani-Zeng's two-process formulation equivalent, with $\\lambda=\\lambda_u+\\lambda_d$ and $p=\\lambda_u/(\\lambda_u+\\lambda_d)$." },
];
