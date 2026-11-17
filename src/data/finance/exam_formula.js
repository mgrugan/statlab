/* StatLab — "Formula", rebuilt to the difficulty of the real paper.
 *
 * The first version of this paper was harder than the exam will be. The
 * calibration here comes from counting what last year's real Midterm One
 * actually does with formulas:
 *
 *   - only 3 of its 33 questions print a display equation, and in every
 *     case the equation is HANDED to you and the question is conceptual:
 *     why is the beta term in GARCH there; is the k-period log return a
 *     sum or a product; what sign must phi have, read off a plot;
 *   - 5 questions put math in the choices, and those are short statements
 *     of a property or a value — "gamma(r,s) only depends on |r-s|",
 *     "the kurtosis equals 3" — never algebra to work through;
 *   - 4 ask only which distribution results, with one-word choices;
 *   - nothing on the paper asks for a derivation, a manipulation, or any
 *     arithmetic at all.
 *
 * So every question below prints or quotes a formula from Parts 6 to 11
 * and then asks what it MEANS: name a term, say what must be true, give
 * the distribution, pick the value. Six questions were dropped from the
 * previous version for being above this level — selecting which algebraic
 * line proves the memoryless property, the binomial-to-Poisson limit,
 * maximizing np(1-p), picking out which term of the normal log-likelihood
 * carries beta, reasoning about the n in the Cramer-Rao denominator, and
 * working out the log-likelihood gain an extra parameter must earn.
 *
 * Coverage is 6/6/5/7/5/4 across Parts 6 to 11, as on the other papers.
 */

export const EXAM_FORMULA_META = {
  title: "Formula",
  subtitle: "Statistical Methods in Finance · Parts 6-11, reading the equations",
  minutes: 75,
  pointsPer: 3,
  rules: [
    "33 questions, 3 points each (99 points total). Exactly one correct response each.",
    "75 minutes. The timer starts when you click Begin.",
    "Covers Parts 6 through 11 of the lecture notes, inclusive.",
    "Notes, books and calculators/laptops/phones are not allowed.",
    "Every formula you need is printed in the question. You are never asked to derive one, rearrange one, or compute with one — only to say what it means and what follows from it.",
    "\"iid\" stands for \"independent and identically distributed.\"",
  ],
};

export const EXAM_FORMULA = [
/* ----------------------------------------------- Part 6: Poisson process */
{ id: "x1", ref: "f13", topic: "Poisson pmf",
  q: "The number of events in an interval of length $t$ satisfies\n\n$$P\\big(N(t)=n\\big)=\\frac{e^{-\\lambda t}(\\lambda t)^n}{n!}.$$\n\nWhat is $\\E\\big(N(t)\\big)$?",
  choices: ["$\\lambda$", "$\\lambda t$", "$\\lambda t^2$", "$t/\\lambda$"], answer: 1,
  why: "The distribution depends on $t$ only through the product $\\lambda t$, and that product is the Poisson's parameter here — so it is both the mean and the variance. On its own $\\lambda$ is the rate **per unit time**; multiply by the length of the window to get the expected count. Twice the window, twice the expected number of events." },

{ id: "x2", ref: "f13", topic: "Exponential survival",
  q: "For $X\\sim\\text{Exponential}(\\lambda)$ the CDF is $F(x)=1-e^{-\\lambda x}$ for $x\\ge0$. Which expression gives $P(X>x)$?",
  choices: ["$e^{-\\lambda x}$", "$1-e^{-\\lambda x}$", "$\\lambda e^{-\\lambda x}$", "$e^{-x/\\lambda}$"], answer: 0,
  why: "$P(X>x)=1-F(x)=e^{-\\lambda x}$, the survival function. This is the form worth remembering, because it is what makes the memoryless property fall out in one line. Note that $\\lambda e^{-\\lambda x}$ is the **density**, and a density is not a probability — it can exceed 1 — so it cannot answer a question of this shape." },

{ id: "x3", ref: "f13", topic: "Memoryless property",
  q: "For the Exponential distribution,\n\n$$P(X>a+b\\mid X>b)=P(X>a).$$\n\nWhat does this say in words?",
  choices: [
    "The waiting times measured at different moments are independent of one another.",
    "Having already waited $b$ does not change the distribution of the remaining wait.",
    "The wait is more likely to end the longer it has lasted.",
    "The total wait $a+b$ is more likely than either part alone.",
  ], answer: 1,
  why: "This is the **memoryless property**: the elapsed wait is simply forgotten, so a component that has run ten years is as good as new. It is the reason a constant rate forces exponential gaps and nothing else — and the reason the Exponential is a questionable lifetime model for anything that wears out, since it rules out ageing by assumption." },

{ id: "x4", ref: "f13", topic: "Gamma waiting time",
  q: "The waiting time to the $k$th event of a Poisson process is $T_k=\\sum_{i=1}^{k}E_i$, where the $E_i$ are iid Exponential$(\\lambda)$. What is the distribution of $T_k$?",
  choices: ["Exponential", "Gamma", "Poisson", "Normal"], answer: 1,
  why: "A sum of $k$ iid exponentials is Gamma with shape $k$ and rate $\\lambda$ — the Exponential is the special case $k=1$. Its mean is $k/\\lambda$, which is what you would guess, but the shape changes: for $k>1$ the density is zero at the origin rather than at its maximum, and the distribution is **not** memoryless." },

{ id: "x5", ref: "f13", topic: "Poisson mean and variance",
  q: "For $X\\sim\\text{Poisson}(\\lambda)$, what is true of $\\E(X)$ and $\\Var(X)$?",
  choices: [
    "The variance is $\\lambda(1-\\lambda)$.",
    "The variance is the reciprocal of the mean.",
    "They are equal, both $\\lambda$.",
    "The variance is the square of the mean.",
  ], answer: 2,
  why: "Both equal $\\lambda$, and this is the Poisson's signature. It also makes a cheap diagnostic: a sample of supposed Poisson counts whose variance sits well away from its mean is telling you the model or the code is wrong. The form $p(1-p)$ belongs to the **Bernoulli**, and reciprocals belong to the **Exponential**." },

{ id: "x6", ref: "f13", topic: "Binomial model",
  q: "In the binomial model for stock prices, $S_t=S_0u^kd^{\\,t-k}$ after $t$ steps. Which quantity has a Binomial$(t,p)$ distribution?",
  choices: ["$k$", "$u/d$", "$\\log S_t$", "$S_t$"], answer: 0,
  why: "Each step is a Bernoulli trial — up with probability $p$ — and $k$ counts the successes over $t$ independent trials, which is exactly a Binomial$(t,p)$. The price is a *function* of $k$, and an exponential one, so it is not itself binomial; $u/d$ is a fixed constant of the model and not random at all." },

/* ---------------------------------------- Part 7: mean models and Merton */
{ id: "x7", ref: "f14", topic: "Merton log return",
  q: "Under the Merton model the log return over $s$ periods is\n\n$$r(s)=\\left(\\mu-\\tfrac12\\sigma^2\\right)s+\\sigma Z(s)+\\sum_{i=1}^{N(s)}J_i.$$\n\nWhat is $N(s)$?",
  choices: [
    "The number of trading periods.",
    "The variance of the jump sizes.",
    "The number of jumps in the period.",
    "The size of the largest jump.",
  ], answer: 2,
  why: "$N(s)$ counts the jumps and is Poisson$(\\lambda s)$; the $J_i$ are their sizes. So the final term is a sum with a **random number of random terms**, which is what makes it a compound Poisson process — and why the density gets built by conditioning on $N(s)=n$, since once the count is fixed the sum of $n$ normals is just another normal." },

{ id: "x8", ref: "f14", topic: "Merton jump sizes",
  q: "In the Merton model, what distribution is assumed for the jump sizes $J_i$ on the log scale?",
  choices: ["Exponential", "Pareto", "Uniform", "Normal"], answer: 3,
  why: "Merton takes the jump sizes to be **normal** on the log scale, which is precisely the assumption the DEJD replaces: a normal is symmetric about its mean, so Merton can produce heavy tails but not skew. Exponential jump sizes on the log scale, one rate up and another down, are Kou's version." },

{ id: "x9", ref: "f14", topic: "Drift correction",
  q: "In $r(s)=\\left(\\mu-\\tfrac12\\sigma^2\\right)s+\\sigma Z(s)+\\dots$, the term $-\\tfrac12\\sigma^2$ appears because of which fact?",
  choices: [
    "$\\E(e^X)\\ne e^{\\E(X)}$ for a random $X$.",
    "The jumps have nonzero mean.",
    "Variance must stay positive.",
    "Brownian motion has independent increments.",
  ], answer: 0,
  why: "For a lognormal, $\\E(e^X)=e^{\\mu+\\sigma^2/2}$ — exponentiating a mean is not the mean of the exponential, and the gap is exactly $\\sigma^2/2$. Subtracting it on the log scale is what makes $\\mu$ the growth rate of the **price** rather than of the log price. The same term is why a lognormal's mean sits above its median." },

{ id: "x10", ref: "f14", topic: "Least squares",
  q: "Least squares chooses $\\beta$ to minimize $\\sum_i\\big(y_i-\\hat y_i\\big)^2$. Replacing the square with $|\\,\\cdot\\,|$ gives which procedure?",
  choices: ["L1 regression", "Ridge regression", "Maximum likelihood", "Weighted least squares"], answer: 0,
  why: "Minimizing the sum of **absolute** deviations is L1 regression. It is also a maximum likelihood fit, but under **Laplace** errors rather than normal ones — a Laplace density carries $|x|$ in its exponent exactly as a normal carries $x^2$. That is the cleanest way to see why L1 is the robust choice: a Laplace has heavier tails and is less surprised by an outlier." },

{ id: "x11", ref: "f14", topic: "Weighted least squares",
  q: "Weighted least squares minimizes $\\sum_i w_i\\big(y_i-\\hat y_i\\big)^2$. What should the weight $w_i$ be?",
  choices: ["$1/n$", "$|y_i-\\hat y_i|$", "$\\sigma_i^2$", "$1/\\sigma_i^2$"], answer: 3,
  why: "The **inverse variance**. Write the normal log-likelihood allowing a separate $\\sigma_i^2$ for each observation and the sum that appears is $\\sum(y_i-\\hat y_i)^2/\\sigma_i^2$, so this is what the likelihood prescribes rather than an ad hoc fix. The logic: a precisely measured point carries more information and should count for more. Weighting by $\\sigma_i^2$ trusts the noisiest points most." },

{ id: "x12", ref: "f14", topic: "Implied volatility",
  q: "Implied volatility is the $\\sigma_{\\text{imp}}$ solving\n\n$$C_{\\text{BS}}\\big(S,K,t,r,\\sigma_{\\text{imp}}\\big)=C_{\\text{market}}.$$\n\nWhat is being done here?",
  choices: [
    "The Black-Scholes formula is being run backwards from the traded price.",
    "The market price is being forecast from past returns.",
    "The option is being priced forwards from an estimate of its volatility.",
    "The model is being tested against a null hypothesis.",
  ], answer: 0,
  why: "Black-Scholes maps a volatility to a price, and that map is strictly increasing, so it can be inverted: take the price the option actually trades at and solve for the unique $\\sigma$ that reproduces it. This makes implied volatility **forward-looking** — the market's own view of volatility to come — unlike a historical estimate computed from past returns." },

/* -------------------------------------------- Part 8: maximum likelihood */
{ id: "x13", ref: "f15", topic: "Likelihood",
  q: "For iid observations the likelihood is\n\n$$L(\\theta)=\\prod_{i=1}^{n}f(x_i;\\theta).$$\n\nWhich assumption allows the density to be written as a product?",
  choices: ["Identical distribution", "Normality", "Stationarity", "Independence"], answer: 3,
  why: "**Independence** is what lets a joint density factor into a product of marginals. Identical distribution is a separate assumption — it is what lets the *same* $f$ and the *same* $\\theta$ appear in every factor. Drop independence and the product is simply wrong, which is the GARCH situation, repaired there by conditioning on the past." },

{ id: "x14", ref: "f15", topic: "Log-likelihood",
  q: "Maximum likelihood maximizes $\\ell(\\theta)=\\sum_i\\log f(x_i;\\theta)$ rather than $L(\\theta)$ itself. Why is the answer unaffected?",
  choices: [
    "The two functions differ from one another only by an additive constant.",
    "The logarithm removes the dependence on the sample size.",
    "The logarithm is strictly increasing, so it preserves the location of the maximum.",
    "The logarithm is concave, so the maximum is guaranteed to be unique.",
  ], answer: 2,
  why: "A strictly increasing transformation preserves **order**, so whatever maximizes $L$ also maximizes $\\log L$ — the height of the peak changes but its location does not. The benefits are practical: a product of thousands of small densities underflows to zero in floating point, and a sum is far easier to differentiate." },

{ id: "x15", ref: "f15", topic: "Least squares and MLE",
  q: "For a linear model with iid normal errors, maximizing the log-likelihood over $\\beta$ is equivalent to which of the following?",
  choices: [
    "Minimizing the sum of absolute residuals.",
    "Maximizing the sample correlation.",
    "Setting the residual mean to zero.",
    "Minimizing the sum of squared residuals.",
  ], answer: 3,
  why: "With iid normal errors the only place $\\beta$ appears in the log-likelihood is inside $-\\frac{1}{2\\sigma^2}\\sum(y_i-\\hat y_i)^2$, and because that multiplier is **negative**, making it as large as possible means making the sum of squares as small as possible. So least squares and maximum likelihood coincide here — but only here: Laplace errors would give you L1 instead." },

{ id: "x16", ref: "f15", topic: "Exponential MLE",
  q: "For an iid Exponential$(\\lambda)$ sample, the MLE works out to $\\hat\\lambda=n/\\sum_i x_i$. What is this in terms of the sample mean?",
  choices: ["$\\bar x$", "$1/\\bar x$", "$\\bar x^2$", "$n\\bar x$"], answer: 1,
  why: "$n/\\sum x_i$ is the reciprocal of $\\bar x$. It should look right: an Exponential$(\\lambda)$ has mean $1/\\lambda$, so inverting the sample mean is the natural estimate of the rate. Note also that the estimate uses the data **only through the sum** — once you have $\\bar x$ the individual observations add nothing." },

{ id: "x17", ref: "f15", topic: "GARCH likelihood",
  q: "A GARCH(1,1) sets $\\sigma_t^2=\\omega+\\alpha r_{t-1}^2+\\beta\\sigma_{t-1}^2$, and the likelihood is started at $\\sigma_1^2=\\omega/(1-\\alpha-\\beta)$. What is that quantity?",
  choices: [
    "The largest variance the model allows.",
    "The variance of the first return.",
    "The unconditional, long-run variance.",
    "The variance of the parameter estimates.",
  ], answer: 2,
  why: "Setting $\\sigma^2=\\omega+\\alpha\\sigma^2+\\beta\\sigma^2$ and solving gives $\\omega/(1-\\alpha-\\beta)$, the level the conditional variance reverts to. It is needed because the recursion defines $\\sigma_t^2$ from the previous one, so the **first** has nothing to build on and must be seeded. Note it requires $\\alpha+\\beta<1$, which is the stationarity condition." },

/* ---------------------------------------- Part 9: properties of the MLE */
{ id: "x18", ref: "f16", topic: "Score equation",
  q: "The MLE is found by solving\n\n$$\\frac{\\partial\\ell}{\\partial\\theta}=0.$$\n\nWhat does this equation express?",
  choices: [
    "That the estimator is unbiased.",
    "That the data are independent.",
    "That the variance of the estimator has been minimized.",
    "That the log-likelihood is level at its peak.",
  ], answer: 3,
  why: "A zero first derivative means the surface is **level** — which is what happens at the top of a hill. On its own it does not distinguish a maximum from a minimum or a saddle; that is what the sign of the second derivative is for, and at a maximum it must be negative." },

{ id: "x19", ref: "f16", topic: "Curvature and variance",
  q: "The estimated variance of the MLE is\n\n$$\\widehat{\\Var}(\\hat\\theta)=\\left(-\\frac{\\partial^2\\ell}{\\partial\\theta^2}\\right)^{-1}.$$\n\nA sharply curved log-likelihood therefore gives which of the following?",
  choices: ["A larger sample", "A small standard error", "A large standard error", "A biased estimate"], answer: 1,
  why: "Curvature and uncertainty are **reciprocal**, which is what the inverse in the formula is doing. Sharp curvature means the log-likelihood falls away steeply, so values even slightly off explain the data much worse and $\\theta$ is pinned down. A nearly flat log-likelihood means many values fit about as well, and the standard error is large." },

{ id: "x20", ref: "f16", topic: "Fisher information",
  q: "The Fisher information is\n\n$$I(\\theta)=-\\E\\left[\\frac{\\partial^2\\ell}{\\partial\\theta^2}\\right].$$\n\nWhat does it measure?",
  choices: [
    "The height of the log-likelihood at its peak.",
    "The expected curvature of the log-likelihood.",
    "The expected value of the estimator.",
    "The bias of the estimator.",
  ], answer: 1,
  why: "It is **expected curvature** — the curvature averaged over all samples the model could produce, rather than the curvature of the one log-likelihood you happen to have. Because it is an expectation it can be computed before any data are collected, and its inverse gives both the asymptotic variance of the MLE and the Cramér-Rao bound." },

{ id: "x21", ref: "f16", topic: "Cramer-Rao",
  q: "The Cramér-Rao bound states that for an unbiased $\\hat\\theta$,\n\n$$\\Var(\\hat\\theta)\\ \\ge\\ \\frac{1}{nI(\\theta)}.$$\n\nWhat does this put a limit on?",
  choices: [
    "How many parameters may be estimated from one sample.",
    "How fast the optimizer reaches the maximum.",
    "How small the variance of an unbiased estimator can be.",
    "How large the bias of any estimator can be.",
  ], answer: 2,
  why: "It is a floor on the **variance** of any unbiased estimator, and the MLE attains it as $n\\to\\infty$ — which is what asymptotic efficiency means, and the main argument for using maximum likelihood by default. The hedge matters: a **biased** estimator is not covered, and can have smaller mean squared error than the bound." },

{ id: "x22", ref: "f16", topic: "Invariance",
  q: "By the invariance property, the MLE of $g(\\theta)$ is $g(\\hat\\theta)$. If the MLE of $\\sigma^2$ is 9, what is the MLE of $\\sigma$?",
  choices: ["3", "9", "81", "Not determined"], answer: 0,
  why: "Apply the function to the estimate: $\\sqrt{9}=3$, with no new maximization. What does **not** carry over is unbiasedness — even when $\\hat\\sigma^2$ is unbiased for $\\sigma^2$, its square root is biased for $\\sigma$, because taking a square root is nonlinear. Nor does the standard error transfer; that needs the Delta Method." },

{ id: "x23", ref: "f16", topic: "Delta Method",
  q: "The Delta Method gives\n\n$$\\Var\\big(g(\\hat\\theta)\\big)\\approx\\big(g'(\\theta)\\big)^2\\Var(\\hat\\theta).$$\n\nWhat is it used for?",
  choices: [
    "The standard error of a function of an estimated parameter.",
    "The point estimate of a function of an estimated parameter.",
    "Testing whether an estimated parameter is zero.",
    "Choosing between two competing models.",
  ], answer: 0,
  why: "Invariance hands you the point **estimate** of $g(\\theta)$ for free; the Delta Method supplies its **uncertainty**, which does not transfer for free because a nonlinear $g$ stretches the parameter space unevenly. With several parameters the same idea becomes $G\\Sigma G^{\\mathsf T}$, where $G$ holds the first derivatives." },

{ id: "x24", ref: "f16", topic: "Value at Risk",
  q: "A 1% Value at Risk satisfies\n\n$$P(L>\\text{VaR})=0.01,$$\n\nwhere $L$ is the loss. What kind of quantity is VaR?",
  choices: [
    "An average of the extreme losses.",
    "A variance of the loss distribution.",
    "A quantile of the loss distribution.",
    "A probability attached to a loss.",
  ], answer: 2,
  why: "VaR is the **threshold** exceeded with the stated probability — a quantile, measured in the units of the loss, never a probability. The average of the losses **beyond** that threshold is CVaR, or expected shortfall, and it is the more informative of the two precisely because VaR says nothing about how bad the exceedances get." },

/* ------------------------------------------- Part 10: model selection */
{ id: "x25", ref: "f17", topic: "AIC",
  q: "Models are compared using\n\n$$\\text{AIC}=-2\\log L+2k.$$\n\nIs a larger or a smaller AIC preferred?",
  choices: ["Closest to zero", "It depends on $k$", "Smaller", "Larger"], answer: 2,
  why: "The leading $-2\\log L$ flips the sign on the fit, so a better-fitting model drives AIC **down**, and the $+2k$ then charges for complexity. Lower is better throughout. The sign flip is the only thing to keep straight: a *higher* log-likelihood and a *lower* AIC both mean a better fit." },

{ id: "x26", ref: "f17", topic: "AIC penalty",
  q: "In $\\text{AIC}=-2\\log L+2k$, what is the role of the term $2k$?",
  choices: [
    "It charges for each parameter, offsetting the fit a larger model always gains.",
    "It rescales the log-likelihood so models of different sizes compare.",
    "It corrects the bias in the parameter estimates.",
    "It accounts for the number of observations the model was fitted to.",
  ], answer: 0,
  why: "A larger model can always match a smaller one it nests, so the maximized log-likelihood **cannot** fall when parameters are added — and will usually rise even when they describe nothing but noise. The penalty is what makes the comparison meaningful. Note the charge counts **parameters**, not observations; counting observations is what BIC's $\\log n$ does." },

{ id: "x27", ref: "f17", topic: "BIC",
  q: "$\\text{BIC}=-2\\log L+k\\log n$. How does this differ in behaviour from AIC?",
  choices: [
    "It charges less per parameter, so it favours larger models.",
    "It uses a different measure of fit.",
    "It cannot compare models with different parameter counts.",
    "It charges more per parameter, so it favours smaller models.",
  ], answer: 3,
  why: "The fit term is identical; only the per-parameter charge differs. $\\log n$ exceeds 2 for any $n$ past 7, and with several thousand daily returns it is around 8 — four times AIC's charge. So BIC is the stricter criterion and prefers **parsimony**, which is why the two can disagree." },

{ id: "x28", ref: "f17", topic: "Nesting",
  q: "The normal distribution is nested within the $t$ distribution under which restriction on the degrees of freedom $\\nu$?",
  choices: ["$\\nu=1$", "$\\nu=2$", "$\\nu=0$", "$\\nu\\to\\infty$"], answer: 3,
  why: "As $\\nu$ grows the $t$'s tails thin out and it converges to the normal, so the normal is the limiting case. That is what makes the comparison **nested**: the $t$ can always do at least as well, since it can imitate the normal. At the other end $\\nu=1$ is the Cauchy, which has no mean, and $\\nu=2$ has no finite variance." },

{ id: "x29", ref: "f17", topic: "GED",
  q: "The generalized error distribution has density proportional to\n\n$$\\exp\\!\\big(-|x/\\alpha|^{\\beta}\\big).$$\n\nWhich value of $\\beta$ gives the normal distribution?",
  choices: ["$\\beta=3$", "$\\beta=1/2$", "$\\beta=2$", "$\\beta=1$"], answer: 2,
  why: "A normal density carries $e^{-x^2/2\\sigma^2}$, so the exponent on $|x|$ is 2. At $\\beta=1$ the density is $e^{-|x|/\\alpha}$, the **Laplace**, with heavier tails; smaller $\\beta$ is heavier still. So $\\beta$ is the tail-thickness dial with 2 as the reference point — and the whole family is symmetric, which is why skewed versions are introduced separately." },

/* -------------------------------------------------- Part 11: the DEJD */
{ id: "x30", ref: "f18", topic: "DEJD log return",
  q: "Under the DEJD the log return is\n\n$$r(s)=\\left(\\mu-\\tfrac12\\sigma^2\\right)s+\\sigma Z(s)+U+D.$$\n\nWhat are $U$ and $D$?",
  choices: [
    "The positive and the negative parts of the diffusion term.",
    "The drift term and the volatility term.",
    "The total contributions of the up jumps and of the down jumps.",
    "The upper and lower bounds on the return.",
  ], answer: 2,
  why: "$U$ aggregates every up jump over the period and $D$ every down jump. The four terms — drift, diffusion, up jumps, down jumps — are **independent**, which is what makes the likelihood tractable. The diffusion is the single term $\\sigma Z(s)$ and is not split by sign; splitting the **jumps** by sign is the model's entire contribution." },

{ id: "x31", ref: "f18", topic: "Parameter correspondence",
  q: "Kou's parameters relate to Ramezani and Zeng's by\n\n$$\\lambda=\\lambda_u+\\lambda_d,\\qquad p=\\frac{\\lambda_u}{\\lambda_u+\\lambda_d}.$$\n\nWhat does $p$ represent?",
  choices: [
    "The proportion of days with no jump.",
    "The probability that a given jump is an up jump.",
    "The probability that any jump occurs at all in the period.",
    "The mean size of an up jump.",
  ], answer: 1,
  why: "It is the up stream's **share** of the total rate, so it is the chance that an arriving jump came from that stream. Together with $\\lambda=\\lambda_u+\\lambda_d$ it converts between the two formulations, which is why they describe the same model — the real difference between the papers is the assumed jump size distribution." },

{ id: "x32", ref: "f18", topic: "Density by conditioning",
  q: "The DEJD density is built as\n\n$$f(r)=\\sum_{m=0}^{\\infty}\\sum_{n=0}^{\\infty}f_{m,n}(r)\\,P(N_u=m)\\,P(N_d=n).$$\n\nWhat are the two sums doing?",
  choices: [
    "Adding the sizes of the up jumps to those of the down jumps.",
    "Integrating over the jump sizes.",
    "Summing the log-likelihood contributions over the whole sample.",
    "Averaging over every possible number of up and down jumps.",
  ], answer: 3,
  why: "This is the law of total probability run over two indices: condition on there having been $m$ up jumps and $n$ down jumps, handle that easy case — given the counts, the pieces are normal — then weight each case by its probability and add. The joint probability factors into two Poisson terms because the two streams are **independent**." },

{ id: "x33", ref: "f18", topic: "Log of a Pareto",
  q: "In the Ramezani-Zeng formulation up jumps multiply the price by a Pareto variable with support $(1,\\infty)$. What distribution does its logarithm have?",
  choices: ["Uniform", "Exponential", "Normal", "Pareto"], answer: 1,
  why: "This identity is what makes the two formulations one model. The support $(1,\\infty)$ maps under the logarithm to $(0,\\infty)$, where an Exponential lives, and the power-law density becomes the exponential one. So multiplying by a Pareto on the price scale is **adding** an Exponential on the log scale — precisely Kou's assumption." },
];
