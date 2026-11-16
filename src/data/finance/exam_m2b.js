/* StatLab — Practice Midterm Two, Paper B.
 *
 * 33 original questions on Parts 6-11, same conditions as Paper A:
 * same format and length as Midterm One, no notes or calculator, code
 * only to be read, no Hessians or DEJD derivations by hand.
 *
 * Coverage 6/6/5/7/5/4 across Parts 6 to 11. No question repeats one
 * from Paper A — where a topic recurs it is approached from a different
 * side. The key is balanced across a/b/c/d, no explanation names a
 * choice by position, and the key is not the longest choice more often
 * than chance.
 */

export const EXAM_M2B_META = {
  title: "Practice Midterm Two · Paper B",
  subtitle: "Statistical Methods in Finance · Parts 6-11",
  minutes: 75,
  pointsPer: 3,
  rules: [
    "33 questions, 3 points each (99 points total). Exactly one correct response each.",
    "75 minutes. The timer starts when you click Begin.",
    "Covers Parts 6 through 11 of the lecture notes, inclusive.",
    "No notes, books, calculator, laptop or phone.",
    "You will not be asked to write or debug Python. Code appears only to be read, and what is tested is whether you can interpret it and its output.",
    "You are not expected to calculate Hessians or Jacobians by hand, nor to reproduce the DEJD derivations.",
    "\"iid\" stands for \"independent and identically distributed.\"",
  ],
};

export const EXAM_M2B = [
/* ---------------------------------------------- Part 6: the Poisson process */
{ id: "b1", ref: "f13", topic: "Binomial distribution",
  q: "A single trading day either has a jump, with probability $p$, or does not. Over $n$ independent days, what is the variance of the number of jump days?",
  choices: [
    "$np$, the same as the mean of the count",
    "$np(1-p)$, which is largest when $p=1/2$",
    "$\\sqrt{np(1-p)}$, since the count is a sum",
    "$p(1-p)$, regardless of how many days are observed",
  ], answer: 1,
  why: "The count is Binomial$(n,p)$, a sum of $n$ iid Bernoulli$(p)$ variables. Each contributes variance $p(1-p)$, and variances of independent terms **add**, giving $np(1-p)$. The mean is $np$ — equal to the variance only for a **Poisson**, not a binomial. The square root is the standard deviation, and $p(1-p)$ alone is the variance of a single day." },

{ id: "b2", ref: "f13", topic: "Poisson limit",
  q: "Under what circumstances does the Binomial$(n,p)$ distribution become well approximated by a Poisson?",
  choices: [
    "When $n$ is large and $p$ is small, with $np$ held at a moderate value",
    "When $n$ is small, so the count is concentrated on a few values",
    "When $p$ is large, so the count is near its upper bound $n$",
    "When $n$ is large and $p$ is close to $1/2$, so the count is symmetric",
  ], answer: 0,
  why: "The Poisson arises as the limit of the binomial with **many trials, each unlikely**, and the product $np$ settling to a finite rate $\\lambda$. That is exactly the regime jumps live in — thousands of days, a small chance each day, a handful of jumps a year. With $p$ near $1/2$ the binomial is instead well approximated by a **normal**, and in that regime mean and variance are nowhere near equal." },

{ id: "b3", ref: "f13", topic: "Poisson process properties",
  q: "Which of the following is **not** one of the defining properties of a Poisson process?",
  choices: [
    "The number of events in an interval depends only on its length",
    "Counts in disjoint intervals are independent of one another",
    "The number of events in an interval of length $t$ is Poisson$(\\lambda t)$",
    "The gaps between consecutive events are iid Gamma random variables",
  ], answer: 3,
  why: "The gaps are iid **Exponential**$(\\lambda)$, not Gamma. A Gamma appears only once you add several gaps together — the wait to the $k$th event is Gamma, being a sum of $k$ exponentials. The other three statements are stationarity, independent increments, and the Poisson count law, all of which are genuinely part of the definition." },

{ id: "b4", ref: "f13", topic: "Counts and gaps",
  q: "Events arrive as a Poisson process with rate $\\lambda=3$ per year. What does that imply about the waiting times between events?",
  choices: [
    "They are Poisson with mean 3, as the counts and gaps share a law",
    "They are Exponential with rate 3, so the mean wait is $1/3$ of a year",
    "They are Exponential with rate $1/3$, so the mean wait is 3 years",
    "They are exactly $1/3$ of a year apart, since the rate is fixed",
  ], answer: 1,
  why: "The two descriptions are the same model seen from either side: counts of events are Poisson with rate $\\lambda$, and the gaps are Exponential with the **same** $\\lambda$. An Exponential$(\\lambda)$ has mean $1/\\lambda$, so three events a year means an average gap of a third of a year. The rate being constant does **not** make the gaps equal — their randomness is the whole point." },

{ id: "b5", ref: "f13", topic: "Memoryless property",
  q: "A machine's lifetime is Exponential. It has already run 10 years. What is the probability it runs at least 15 more?",
  choices: [
    "Larger than for a new machine, since it has proven itself reliable",
    "Impossible to say without knowing the rate parameter $\\lambda$",
    "Smaller than for a new machine, since it has already aged 10 years",
    "The same as the probability a new machine runs at least 15 years",
  ], answer: 3,
  why: "This is the **memoryless property**: $P(X>a+b\\mid X>b)=P(X>a)$. The algebra is one line, $e^{-\\lambda(a+b)}/e^{-\\lambda b}=e^{-\\lambda a}$. The elapsed 10 years are simply forgotten. The answer does not depend on $\\lambda$, because the statement holds for every $\\lambda$ — that is what makes it a property of the distribution rather than of a particular fit." },

{ id: "b6", ref: "f13", topic: "Why Poisson for jumps",
  q: "Why is a Poisson process a natural model for the arrival of jumps in an asset price?",
  choices: [
    "Because jumps are rare, independent events arriving at some rate",
    "Because it makes the price process continuous at every time point",
    "Because it forces jumps to be evenly spaced through the year",
    "Because it guarantees the resulting log returns are normal",
  ], answer: 0,
  why: "The Poisson process is the canonical model for **rare events arriving independently at a constant rate**, which is exactly how news shocks behave. It makes jumps randomly spaced rather than evenly spaced, it makes the price **discontinuous** at the jump times, and adding jumps to a diffusion is precisely what destroys normality — generating the heavy tails that a pure diffusion cannot." },

/* ------------------------------------------ Part 7: mean models and Merton */
{ id: "b7", ref: "f14", topic: "Mean vs probability model",
  q: "What is the difference between a mean model and a probability model?",
  choices: [
    "A mean model is always wrong; a probability model is always right",
    "A mean model describes the average; a probability model describes the full distribution",
    "A mean model is estimated by least squares; a probability model by the method of moments",
    "A mean model applies to returns; a probability model applies to prices",
  ], answer: 1,
  why: "A mean model says how the **expected value** of the response moves with the predictors, and nothing more. A probability model specifies the **whole distribution**, which is what you need for likelihood, for prediction intervals, and for anything about tails. Least squares happens to be a common way to fit a mean model, but that is a consequence, not the definition." },

{ id: "b8", ref: "f14", topic: "Least squares vs L1",
  q: "Which is **not** one of the reasons given for preferring least squares to minimizing the sum of absolute deviations?",
  choices: [
    "Least squares has a closed-form solution in the linear case",
    "Squared error is differentiable everywhere, which helps optimizers",
    "Least squares coincides with maximum likelihood under normal errors",
    "Least squares is less sensitive to outliers than absolute deviations",
  ], answer: 3,
  why: "The claim about outliers is **backwards**: squaring magnifies large residuals, so least squares is **more** sensitive to outliers, and L1 is the more robust of the two. The genuine reasons are the closed-form normal-equations solution, differentiability at zero where $|x|$ has a kink, and the equivalence with maximum likelihood when the errors are iid normal." },

{ id: "b9", ref: "f14", topic: "Gauss-Markov",
  q: "What does the Gauss-Markov theorem establish about the least squares estimator?",
  choices: [
    "It is the maximum likelihood estimator, whatever the error distribution",
    "It is consistent, so it converges to the truth as $n$ grows",
    "It has the smallest variance among linear unbiased estimators",
    "It is normally distributed in finite samples, without further assumptions",
  ], answer: 2,
  why: "Gauss-Markov says least squares is **BLUE** — Best Linear Unbiased Estimator — meaning minimum variance within the class of linear unbiased estimators, and it needs only uncorrelated errors of constant variance, not normality. Note how heavily hedged that guarantee is: a **biased** or **nonlinear** estimator can beat it, which is exactly the door that ridge regression and shrinkage walk through." },

{ id: "b10", ref: "f14", topic: "Weighted least squares",
  q: "When is weighted least squares preferred to ordinary least squares, and how are the weights chosen?",
  choices: [
    "When the errors have unequal variances; weights inversely proportional to those variances",
    "When the sample is small; weights proportional to the number of observations",
    "When the response is skewed; weights chosen to symmetrize the residuals",
    "When the predictors are correlated; weights proportional to each predictor's variance",
  ], answer: 0,
  why: "Unequal error variances — heteroskedasticity — are the motivation. Observations measured precisely carry more information, so they should count for more: the weight on each is **inversely proportional to its variance**. Correlated predictors are a multicollinearity problem and are not addressed by weighting; a skewed response calls for a transformation or a different distribution." },

{ id: "b11", ref: "f14", topic: "Merton jump diffusion",
  q: "What are the components of the Merton jump diffusion model?",
  choices: [
    "A GARCH volatility process together with normally distributed jumps",
    "Two independent Poisson processes, one governing up jumps and one governing down jumps, with exponential sizes",
    "A geometric Brownian motion plus jumps arriving as a Poisson process, with normal jump sizes",
    "A Student-$t$ diffusion with the degrees of freedom estimated from the tails",
  ], answer: 2,
  why: "Merton has three ingredients: a **GBM** for the ordinary day-to-day movement, a **Poisson process** governing when jumps occur, and a **normal** distribution for the jump sizes on the log scale. Two separate Poisson processes for up and down is the Ramezani-Zeng formulation of the **DEJD**, a later model built specifically to repair Merton's symmetry." },

{ id: "b12", ref: "f14", topic: "Calibration",
  q: "When fitting an option pricing model, why is it standard to calibrate to implied volatilities rather than to option prices?",
  choices: [
    "Because implied volatility is the only quantity the model actually predicts",
    "Because implied volatilities are observed directly, while prices must be estimated",
    "Because implied volatilities put option contracts on a comparable scale",
    "Because prices violate no-arbitrage bounds, while implied volatilities cannot",
  ], answer: 2,
  why: "Prices across strikes and maturities differ by orders of magnitude — a deep out-of-the-money option is worth pennies while an in-the-money one is worth dollars — so a sum of squared price errors would be dominated by a handful of expensive contracts. Implied volatility is a **common scale**, and errors in it are comparable across the surface. Note that it is the **price** that is quoted in the market; implied volatility is backed out of it." },

/* ------------------------------------------------ Part 8: likelihood / MLE */
{ id: "b13", ref: "f15", topic: "Likelihood",
  q: "Which statement correctly describes the likelihood function?",
  choices: [
    "The probability that the parameters take particular values given the data",
    "The joint density of the data, read as a function of the data with the parameters fixed",
    "The average of the density over all possible parameter values",
    "The joint density of the data, read as a function of the parameters with the data fixed",
  ], answer: 3,
  why: "The likelihood and the joint density are the same formula with the roles of the two arguments **swapped**. As a density you hold the parameters fixed and vary the data; as a likelihood you hold the **data** fixed, as observed, and vary the parameters. It is emphatically not a probability statement about the parameters — that would be a posterior, which requires a prior." },

{ id: "b14", ref: "f15", topic: "Log-likelihood",
  q: "A fit reports the log of the likelihood rather than the likelihood. What are the reasons for working on that scale?",
  choices: [
    "Because the log-likelihood has a different maximizer that is more efficient",
    "Because the log transformation removes bias from the resulting estimator",
    "Because the log-likelihood is guaranteed to have a single maximum, so the optimizer cannot be trapped at a local one",
    "Because logs turn the product into a sum, avoid numerical underflow, and simplify the derivatives",
  ], answer: 3,
  why: "Three practical reasons, all of them about convenience rather than correctness. The product over $n$ observations becomes a sum; a product of thousands of small densities underflows to zero in floating point while its log does not; and differentiating a sum of logs is far easier than differentiating a product. And because the logarithm is strictly increasing, the **maximizer is unchanged** — which is the point." },

{ id: "b15", ref: "f15", topic: "LS and MLE",
  q: "Under what assumption on the errors does least squares coincide with maximum likelihood?",
  choices: [
    "The errors are uncorrelated with the predictors",
    "The errors are iid normal with constant variance",
    "The errors have mean zero and finite variance",
    "The errors are iid from any symmetric distribution",
  ], answer: 1,
  why: "With iid normal errors, the log-likelihood contains the residual sum of squares inside a negative multiplier plus terms free of the coefficients, so **maximizing** the likelihood and **minimizing** the sum of squares are the same operation. Symmetry alone is not enough: with iid Laplace errors, for instance, maximum likelihood gives you **L1** regression instead." },

{ id: "b16", ref: "f15", topic: "GARCH likelihood",
  q: "In writing down the likelihood for a GARCH(1,1) model, what role does $\\sigma_1^2=\\omega/(1-\\alpha-\\beta)$ play?",
  choices: [
    "It is the long-run variance forecast that the model's multi-step predictions converge to as the horizon grows",
    "It is the constraint that keeps the parameter estimates positive",
    "It is a starting value for the recursion, since $\\sigma_1^2$ has no prior observation",
    "It is the variance of the parameter estimates at the optimum",
  ], answer: 2,
  why: "The GARCH recursion defines $\\sigma_t^2$ from $\\sigma_{t-1}^2$ and $r_{t-1}$, so the very first variance has nothing to build on and must be **initialized**. The unconditional variance $\\omega/(1-\\alpha-\\beta)$ is the natural choice. That quantity is also the long-run variance the forecasts revert to, which is why the formula looks familiar — but the question is about what it is doing **in the likelihood**, where it is the seed for the recursion." },

{ id: "b17", ref: "f15", topic: "Reading MLE output",
  q: "You fit a GARCH(1,1) with your own likelihood code and get a log-likelihood of $1011.92$; the `arch` package reports $1011.66$ for the same data and model. What should you conclude?",
  choices: [
    "The models differ, since two different log-likelihood values cannot have come from one specification",
    "Your code has a bug, since two correct implementations must agree exactly",
    "The package is wrong, since your value is higher and higher is better",
    "The two agree to the precision that differing initializations and optimizer tolerances allow",
  ], answer: 3,
  why: "A difference in the third decimal place of a log-likelihood near 1012 is a **numerical** difference, not a modeling one. Implementations differ in how they seed $\\sigma_1^2$, in optimizer tolerance, and in whether the first observation enters the sum. A match this close is the cross-check **passing**. Comparing log-likelihoods to pick a winner only makes sense between **different models** on the same data, not between two fits of the same model." },

/* ------------------------------------------- Part 9: properties of the MLE */
{ id: "b18", ref: "f16", topic: "Curvature and variance",
  q: "Two datasets give the same MLE, but one log-likelihood is sharply peaked and the other nearly flat. What does that say?",
  choices: [
    "The flat one indicates more uncertainty about the parameter",
    "The sharp one indicates the model is misspecified for that dataset",
    "The flat one indicates a larger sample size was used",
    "They carry the same information, since the estimates are identical",
  ], answer: 0,
  why: "**Curvature is information.** A sharp peak means the data rule out nearby parameter values strongly, so the standard error is small; a flat likelihood means many values fit nearly as well, so the estimate is imprecise. This is the whole idea behind using the **second derivative** to get standard errors — and more data usually makes the peak **sharper**, not flatter." },

{ id: "b19", ref: "f16", topic: "Regularity conditions",
  q: "For $X_1,\\dots,X_n$ iid Uniform$(0,\\theta)$, the MLE is $\\hat\\theta=\\max_i X_i$. Why is this the standard counterexample?",
  choices: [
    "Because the likelihood has two maxima, so the MLE is not unique",
    "Because the maximum is not a sufficient statistic for $\\theta$",
    "Because the estimator is inconsistent, so it never converges to $\\theta$ however much data is collected",
    "Because the support depends on $\\theta$, so the usual regularity conditions fail",
  ], answer: 3,
  why: "The range of the data **depends on the parameter** — no observation can exceed $\\theta$ — which violates a regularity condition the standard asymptotic theory needs. The consequence is that the usual results do not apply: the MLE is not asymptotically normal here, and its distribution has a different scaling. It is still consistent and still the MLE; what fails is the **theory about** it." },

{ id: "b20", ref: "f16", topic: "Hessian",
  q: "After a numerical maximization, what is the Hessian used for?",
  choices: [
    "To obtain the estimated covariance matrix of the parameter estimates",
    "To test whether the fitted model is correctly specified",
    "To confirm the optimizer reached the global rather than a local maximum",
    "To rescale the parameters so the optimizer converges faster",
  ], answer: 0,
  why: "The Hessian is the matrix of second derivatives of the log-likelihood at the optimum. Negate it and invert it and you have the estimated **covariance matrix** of the MLE: square roots of the diagonal are standard errors, and the off-diagonal entries give the correlations between estimates. Nothing about it distinguishes a local from a global maximum, since curvature is purely local." },

{ id: "b21", ref: "f16", topic: "Cramer-Rao",
  q: "What does the Cramér-Rao lower bound say, and why does it matter for maximum likelihood?",
  choices: [
    "The variance of any estimator decreases at rate $1/\\sqrt{n}$ at best",
    "No estimator of any kind can have smaller mean squared error than the maximum likelihood estimator achieves",
    "No unbiased estimator can have variance below the inverse Fisher information, and the MLE attains it asymptotically",
    "The MLE has the smallest variance in every finite sample",
  ], answer: 2,
  why: "The bound sets a floor on the variance of any **unbiased** estimator, and the floor is the inverse of the Fisher information. The MLE reaches that floor as $n\\to\\infty$, which is what **asymptotic efficiency** means — and it is the main reason maximum likelihood is the default. Note the two hedges: unbiased, and asymptotically. In a small sample a biased estimator can beat the bound." },

{ id: "b22", ref: "f16", topic: "Invariance",
  q: "The MLE of a variance is $\\hat\\sigma^2=4$. What is the MLE of $\\sigma$?",
  choices: [
    "$4$, since the MLE is unchanged under transformation",
    "$2$, by the invariance property of maximum likelihood",
    "Not determined, since a new maximization is required",
    "Slightly less than $2$, after a correction for the nonlinearity",
  ], answer: 1,
  why: "**Invariance**: if $\\hat\\theta$ maximizes the likelihood then $g(\\hat\\theta)$ is the MLE of $g(\\theta)$, for any function $g$. So the MLE of $\\sigma$ is $\\sqrt{4}=2$, with no new optimization. What does **not** carry over is unbiasedness: even when $\\hat\\sigma^2$ is unbiased for $\\sigma^2$, its square root is biased for $\\sigma$, because the square root is nonlinear." },

{ id: "b23", ref: "f16", topic: "Unbiasedness",
  q: "Which statement about the bias of maximum likelihood estimators is correct?",
  choices: [
    "MLEs are unbiased, which is why they are preferred",
    "MLEs are unbiased only when the likelihood is correctly specified",
    "MLEs need not be unbiased, though the bias vanishes as $n$ grows",
    "MLEs are biased in all cases, so a correction is always applied",
  ], answer: 2,
  why: "Unbiasedness is simply **not** one of the properties maximum likelihood promises. The MLE of $\\sigma^2$ in the normal model divides by $n$ rather than $n-1$ and is biased downward; the sample standard deviation $s$ is biased for $\\sigma$ even though $s^2$ is unbiased for $\\sigma^2$. What maximum likelihood does promise is **consistency** and asymptotic efficiency, and consistency makes the bias disappear in the limit." },

{ id: "b24", ref: "f16", topic: "Delta method",
  q: "You have the MLE of a GARCH model's parameters and their covariance matrix, and you want a standard error for the implied long-run variance $\\omega/(1-\\alpha-\\beta)$. What do you use?",
  choices: [
    "The Fisher information for $\\omega$ alone, since it is the numerator",
    "The invariance property, which transfers the standard error directly",
    "A bootstrap, since no analytic standard error exists for a ratio",
    "The Delta Method, with the gradient of the function evaluated at the estimates",
  ], answer: 3,
  why: "The Delta Method is exactly the tool for the standard error of a **function** of estimated parameters: with gradient $G$ and covariance $\\Sigma$, the variance of $g(\\hat\\theta)$ is approximately $G\\Sigma G^{\\mathsf T}$. All three parameters enter the function, so their correlations matter and $\\omega$ alone will not do. Invariance gives you the point **estimate** of the function, but says nothing about its variability." },

/* ---------------------------------------------- Part 10: model selection */
{ id: "b25", ref: "f17", topic: "Generalized error distribution",
  q: "In the generalized error distribution, what does the shape parameter control?",
  choices: [
    "The skewness, with values away from zero tilting one tail",
    "The thickness of the tails, with the normal arising as one special case",
    "The scale, so that larger values widen the whole distribution without changing its shape",
    "The number of modes the density is allowed to have",
  ], answer: 1,
  why: "The GED has an exponent on the absolute deviation; moving it changes **how fast the tails decay**. One particular value returns the normal exactly, another the Laplace, and smaller values give tails heavier than normal. The GED as presented is **symmetric** — tilting the tails is what the *skewed* versions are for — and the scale is a separate parameter." },

{ id: "b26", ref: "f17", topic: "Skewed t",
  q: "Why fit a skewed $t$ distribution to daily log returns rather than a symmetric $t$?",
  choices: [
    "Because a symmetric $t$ cannot produce tails heavier than the normal",
    "Because the skewed $t$ has fewer parameters and is therefore preferred",
    "Because losses and gains are not mirror images, so the two tails need separate shapes",
    "Because the skewed $t$ guarantees a finite variance at any degrees of freedom",
  ], answer: 2,
  why: "Returns are **left skewed**: the large moves down are bigger and more frequent than the large moves up. A symmetric $t$ captures heavy tails perfectly well but forces the two tails to match, so it cannot express that asymmetry. The skewed $t$ adds a parameter, not removes one — and that extra parameter is what the likelihood comparison has to justify." },

{ id: "b27", ref: "f17", topic: "Nested models",
  q: "What does it mean for one model to be nested within another?",
  choices: [
    "The two models are fitted to the same data by the same method",
    "The smaller model has a higher log-likelihood than the larger one",
    "The two models have the same number of parameters but different distributions",
    "The smaller model is a special case of the larger, reached by restricting parameters",
  ], answer: 3,
  why: "Nesting means the simpler model sits **inside** the richer one as a parameter restriction — the normal is a $t$ with infinite degrees of freedom, a GARCH(1,1) with $\\alpha=\\beta=0$ is constant variance. It matters because the larger model can never fit **worse**: its log-likelihood is at least as high by construction, which is why a raw likelihood comparison between nested models tells you nothing without a penalty." },

{ id: "b28", ref: "f17", topic: "Overfitting",
  q: "Why does adding parameters always raise the log-likelihood of a nested model, and what follows from that?",
  choices: [
    "Because more parameters reduce the residual variance, so a likelihood ratio test is unnecessary",
    "Because the extra freedom can only help the fit, so model choice needs a penalty for complexity",
    "Because the data are fixed, so the likelihood is monotone in the sample size",
    "Because the optimizer searches a larger space, so it converges to a better optimum",
  ], answer: 1,
  why: "The restricted model's parameter values are still **available** to the larger model, so the larger fit can match it and will usually beat it — even when the extra parameters describe nothing but noise. The consequence is that maximized likelihood alone cannot be used to choose a model; you need a criterion that **charges for parameters**, which is what AIC and BIC do." },

{ id: "b29", ref: "f17", topic: "AIC vs BIC",
  q: "How do AIC and BIC differ, and what does that difference do in practice?",
  choices: [
    "AIC is computed on a holdout sample, while BIC uses the full data",
    "AIC penalizes each parameter by $2$, BIC by $\\log n$, so BIC favors smaller models in large samples",
    "AIC uses the log-likelihood and BIC uses the residual sum of squares",
    "AIC applies only to models that are nested within one another, while BIC can compare any two fitted models",
  ], answer: 1,
  why: "Both take $-2$ times the maximized log-likelihood and add a per-parameter charge; the charge is the only difference. Since $\\log n$ exceeds 2 for any $n$ beyond 7, BIC charges more and therefore picks **more parsimonious** models as the sample grows. With daily returns over years, $\\log n$ is around 8, so the two criteria can easily disagree — and when they do, BIC is the stricter one." },

/* ----------------------------------------------------- Part 11: the DEJD */
{ id: "b30", ref: "f18", topic: "Merton's limitation",
  q: "What is the key limitation of the Merton model that the DEJD is built to address?",
  choices: [
    "The jump sizes are symmetric about zero, so the model cannot produce skew",
    "The jump rate is allowed to vary over time, making the model unstable",
    "The diffusion component is normal, so the returns cannot have heavy tails",
    "The jump times are not independent of the diffusion component",
  ], answer: 0,
  why: "Merton has a **single** Poisson process and a jump size distribution **symmetric** around zero on the log scale. That gives heavy tails without difficulty — the jumps supply them — but it cannot say that crashes are both larger and more frequent than rallies. Splitting the jumps in two, with a separate rate and a separate size distribution each way, is precisely what the DEJD adds." },

{ id: "b31", ref: "f18", topic: "Parameter correspondence",
  q: "Kou parameterizes the DEJD with a jump rate $\\lambda$ and an up-jump probability $p$; Ramezani and Zeng use separate rates $\\lambda_u$ and $\\lambda_d$. How do these correspond?",
  choices: [
    "$\\lambda=\\lambda_u+\\lambda_d$ and $p=\\lambda_u/(\\lambda_u+\\lambda_d)$",
    "They do not correspond, since the two models are genuinely different",
    "$\\lambda=\\lambda_u\\lambda_d$ and $p=\\lambda_u/\\lambda_d$",
    "$\\lambda=\\max(\\lambda_u,\\lambda_d)$ and $p=1/2$ by construction",
  ], answer: 0,
  why: "Two independent Poisson processes superimpose into a single Poisson process whose rate is the **sum**, and the chance that a given event came from the up stream is that stream's **share** of the total rate. So the two formulations describe the same model with different coordinates — the real difference between the papers is the distribution assumed for the jump sizes, not the number of processes." },

{ id: "b32", ref: "f18", topic: "Path-dependent options",
  q: "What distinguishes a path-dependent option from a vanilla European option?",
  choices: [
    "Its strike is set at expiry rather than when the contract is written",
    "It may be exercised at any time before expiry rather than only at expiry",
    "Its payoff depends on the whole price history, not only the price at expiry",
    "It is written on a basket of assets rather than on a single underlying",
  ], answer: 2,
  why: "A barrier option is cancelled if the price ever touches a level; an Asian option pays off on the **average** price over a period. Either way the entire trajectory matters, not just the endpoint — which is exactly why a jump model, describing how the price **moves through time**, is more use here than a heavy-tailed marginal distribution. Early exercise is what defines an **American** option, a separate idea." },

{ id: "b33", ref: "f18", topic: "Fit of the jump models",
  q: "Ramezani and Zeng report a concern about their fitted model that echoes what was seen when fitting Merton. What is it?",
  choices: [
    "The jump rate comes out too large while the jump sizes come out too small",
    "The diffusion volatility absorbs all of the variation, leaving no jumps",
    "The likelihood has multiple maxima, so the estimates are not reproducible",
    "The up and down jumps cannot be told apart in the estimation output",
  ], answer: 0,
  why: "The fitted models want **many small jumps** rather than the rare large ones the story calls for — the same symptom that showed up with Merton — and the authors suggest that reconsidering the jump size distribution might help. That up and down jumps are never identified in the data is true, but it is a **feature** of how the likelihood works, not the concern they raise about the fit." },
];
