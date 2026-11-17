/* StatLab — "Formula", a Midterm Two paper built on the equations.
 *
 * Where "Get Ready" tests whether you know what things mean, this one
 * tests whether you can read the mathematics. Every question prints an
 * actual formula from Parts 6 to 11 and asks you to do something with it:
 * name a term, state the condition that makes it valid, say what happens
 * when a parameter moves, or connect it to another formula.
 *
 * Still no arithmetic beyond what fits in your head, and still nothing
 * requiring a Hessian or a DEJD derivation by hand — the professor is
 * explicit that the structure and the reasons are what is examined, not
 * the derivations. What is assumed is that you have seen these
 * expressions before and can say what each piece is doing.
 *
 * Coverage is 6/6/5/7/5/4 across Parts 6 to 11, as on the other papers.
 */

export const EXAM_FORMULA_META = {
  title: "Formula",
  subtitle: "Statistical Methods in Finance · Parts 6-11, on the equations",
  minutes: 75,
  pointsPer: 3,
  rules: [
    "33 questions, 3 points each (99 points total). Exactly one correct response each.",
    "75 minutes. The timer starts when you click Begin.",
    "Covers Parts 6 through 11 of the lecture notes, inclusive.",
    "Notes, books and calculators/laptops/phones are not allowed.",
    "Every question is built on a formula from the notes. Nothing here needs arithmetic you cannot do in your head, and you are not asked to derive anything — only to read what is written and say what it means.",
    "\"iid\" stands for \"independent and identically distributed.\"",
  ],
};

export const EXAM_FORMULA = [
/* ----------------------------------------------- Part 6: Poisson process */
{ id: "x1", ref: "f13", topic: "Poisson pmf",
  q: "The number of events in an interval of length $t$ satisfies\n\n$$P\\big(N(t)=n\\big)=\\frac{e^{-\\lambda t}(\\lambda t)^n}{n!}.$$\n\nWhat is $\\E\\big(N(t)\\big)$?",
  choices: ["$\\lambda t^2$", "$t/\\lambda$", "$\\lambda$", "$\\lambda t$"], answer: 3,
  why: "The whole distribution depends on $t$ only through the product $\\lambda t$, which is the Poisson's single parameter here — so that product is both the mean and the variance. $\\lambda$ alone is the rate **per unit time**; multiply by the length of the window to get the expected count. Doubling the window doubles the expected number of events, which is what stationary increments demands." },

{ id: "x2", ref: "f13", topic: "Exponential survival",
  q: "For $X\\sim\\text{Exponential}(\\lambda)$ the CDF is $F(x)=1-e^{-\\lambda x}$ for $x\\ge0$. What is $P(X>x)$?",
  choices: ["$1-e^{-\\lambda x}$", "$\\lambda e^{-\\lambda x}$", "$e^{-x/\\lambda}$", "$e^{-\\lambda x}$"], answer: 3,
  why: "The survival function is $1-F(x)=e^{-\\lambda x}$. This is the form that gets used, because it is what makes the memoryless proof collapse to one line. Note that $\\lambda e^{-\\lambda x}$ is the **density**, and a density is not a probability — it can exceed 1 — so it can never answer a question of this shape." },

{ id: "x3", ref: "f13", topic: "Memoryless property",
  q: "The memoryless property is the statement that\n\n$$P(X>a+b\\mid X>b)=P(X>a).$$\n\nWhich line establishes it for the Exponential?",
  choices: [
    "$\\dfrac{e^{-\\lambda(a+b)}}{e^{-\\lambda b}}=e^{-\\lambda a}$",
    "$\\dfrac{\\lambda e^{-\\lambda(a+b)}}{\\lambda e^{-\\lambda b}}=e^{-\\lambda(a+b)}$",
    "$e^{-\\lambda(a+b)}=e^{-\\lambda a}+e^{-\\lambda b}$",
    "$\\dfrac{1-e^{-\\lambda(a+b)}}{1-e^{-\\lambda b}}=1-e^{-\\lambda a}$",
  ], answer: 0,
  why: "Conditional probability is $P(X>a+b\\ \\text{and}\\ X>b)/P(X>b)$, and since $a+b>b$ the intersection is just $\\{X>a+b\\}$. So it is a ratio of two **survival** functions, and the exponents subtract: $-\\lambda(a+b)-(-\\lambda b)=-\\lambda a$. Using CDFs instead of survival functions gives a ratio that does not simplify, which is why the survival form is the one to remember." },

{ id: "x4", ref: "f13", topic: "Gamma waiting time",
  q: "The waiting time to the $k$th event of a Poisson process is $T_k=\\sum_{i=1}^{k}E_i$, where the $E_i$ are iid Exponential$(\\lambda)$. What is $\\E(T_k)$?",
  choices: ["$1/(k\\lambda)$", "$k\\lambda$", "$\\lambda/k$", "$k/\\lambda$"], answer: 3,
  why: "Expectation is linear whatever the dependence, and each gap has mean $1/\\lambda$, so the sum has mean $k/\\lambda$ — three events at two per year take about one and a half years. The **distribution** of $T_k$ is Gamma with shape $k$, not Exponential, which matters: a Gamma with shape above one is not memoryless and its density is zero at the origin." },

{ id: "x5", ref: "f13", topic: "Binomial to Poisson",
  q: "The Binomial$(n,p)$ pmf $\\binom{n}{k}p^k(1-p)^{n-k}$ converges to the Poisson pmf in which limit?",
  choices: [
    "$n\\to\\infty$ with $p$ fixed.",
    "$n\\to\\infty$, $p\\to0$, with $np\\to\\lambda$.",
    "$n\\to\\infty$, $p\\to1$, with $n(1-p)\\to\\lambda$.",
    "$n$ fixed, $p\\to0$.",
  ], answer: 1,
  why: "Many trials, each unlikely, with the product settling at a finite rate — exactly the regime jumps live in: thousands of trading days, a small chance each day, a handful of jumps a year. Holding $p$ fixed while $n$ grows sends the mean $np$ to infinity and the binomial toward a **normal** instead, where mean and variance are nowhere near equal." },

{ id: "x6", ref: "f13", topic: "Binomial variance",
  q: "For $X\\sim\\text{Binomial}(n,p)$, $\\Var(X)=np(1-p)$. At which $p$ is this largest, for fixed $n$?",
  choices: ["$p=1/2$", "$p=1$", "It increases with $p$ throughout.", "$p=0$"], answer: 0,
  why: "$p(1-p)$ is a downward parabola in $p$, zero at both ends and maximized halfway. The reasoning behind the algebra: at $p=0$ or $p=1$ the outcome is certain, so there is no variability at all, and uncertainty is greatest when the two outcomes are equally likely. Contrast the **Poisson**, whose variance equals its mean and so just grows with $\\lambda$." },

/* ---------------------------------------- Part 7: mean models and Merton */
{ id: "x7", ref: "f14", topic: "Least squares objective",
  q: "Least squares chooses $\\beta$ to minimize\n\n$$\\sum_{i=1}^{n}\\big(y_i-\\beta_0-\\beta_1x_i\\big)^2.$$\n\nReplacing the square with an absolute value gives which procedure?",
  choices: [
    "L1 regression, the maximum likelihood fit under Laplace errors.",
    "Ridge regression, which shrinks the coefficients.",
    "Maximum likelihood under normal errors.",
    "Weighted least squares, with weights given by the inverse variances.",
  ], answer: 0,
  why: "A Laplace density carries $|x|$ in its exponent, so its log-likelihood is a negative multiple of the sum of **absolute** residuals, exactly as the normal density puts the sum of **squares** there. Choosing between L2 and L1 is therefore choosing an error distribution — and it explains the robustness: a Laplace has heavier tails than a normal and so is less surprised by an outlier." },

{ id: "x8", ref: "f14", topic: "Weighted least squares",
  q: "Weighted least squares minimizes\n\n$$\\sum_{i=1}^{n}w_i\\big(y_i-\\hat y_i\\big)^2.$$\n\nWhat should $w_i$ be?",
  choices: [
    "$\\sigma_i^2$", "$1/\\sigma_i^2$", "$1/\\sigma_i$", "$1/n$",
  ], answer: 1,
  why: "Write the normal log-likelihood with a separate $\\sigma_i^2$ for each observation and the sum that appears is $\\sum(y_i-\\hat y_i)^2/\\sigma_i^2$ — so the weights the likelihood prescribes are the **inverse variances**. The logic is that a precisely measured observation carries more information and should count for more. Weighting by $\\sigma_i^2$ gets it exactly backwards, trusting the noisy points most." },

{ id: "x9", ref: "f14", topic: "Merton log return",
  q: "In the Merton model the log return over $s$ periods is\n\n$$r(s)=\\left(\\mu-\\tfrac12\\sigma^2\\right)s+\\sigma Z(s)+\\sum_{i=1}^{N(s)}J_i.$$\n\nWhat is $N(s)$?",
  choices: [
    "The normalizing constant of the jump distribution.",
    "The number of jumps in the period, which is Poisson.",
    "The size of the largest jump in the period.",
    "The number of trading periods, which is fixed.",
  ], answer: 1,
  why: "$N(s)$ counts the jumps, and it is Poisson$(\\lambda s)$; the $J_i$ are their sizes, iid normal on the log scale. The sum therefore has a **random number of random terms**, which is what a compound Poisson process is. It is also why the density is built by conditioning on $N(s)=n$: given the count, the sum of $n$ normals is just another normal." },

{ id: "x10", ref: "f14", topic: "Drift correction",
  q: "In $r(s)=\\left(\\mu-\\tfrac12\\sigma^2\\right)s+\\sigma Z(s)+\\dots$, why does $-\\tfrac12\\sigma^2$ appear?",
  choices: [
    "It is a penalty that keeps the volatility estimate positive.",
    "It makes the process stationary.",
    "It corrects for the jump component so that the mean return is left unchanged.",
    "It converts between the mean of the log price and the log of the mean price.",
  ], answer: 3,
  why: "For a lognormal, $\\E(e^X)=e^{\\mu+\\sigma^2/2}$ — taking the exponential of a mean is not the mean of the exponential, and the gap is exactly $\\sigma^2/2$. Subtracting it on the log scale is what makes $\\mu$ the growth rate of the **price** rather than of the log price. The same term is why the lognormal's mean sits above its median, and it has nothing to do with the jump component." },

{ id: "x11", ref: "f14", topic: "Normal equations",
  q: "The least squares solution can be written $\\hat\\beta=(X^{\\mathsf T}X)^{-1}X^{\\mathsf T}y$. What does the existence of this expression tell you?",
  choices: [
    "The estimator is unbiased only when the columns of $X$ are orthogonal.",
    "The model must have exactly one predictor.",
    "The errors must be normally distributed.",
    "The fit has a closed form, with no numerical search required.",
  ], answer: 3,
  why: "This is one of the three stated advantages of squaring: differentiate the sum of squares, set the derivative to zero, and the normal equations are **linear** in $\\beta$, so they solve outright. Minimizing absolute deviations has no such formula and needs an optimizer. Normality is not required for the algebra — it is required for the fit to coincide with maximum likelihood, which is a separate claim." },

{ id: "x12", ref: "f14", topic: "Implied volatility",
  q: "Implied volatility $\\sigma_{\\text{imp}}$ is defined as the solution of\n\n$$C_{\\text{BS}}\\big(S,K,t,r,\\sigma_{\\text{imp}}\\big)=C_{\\text{market}}.$$\n\nWhat makes this well defined?",
  choices: [
    "$C_{\\text{BS}}$ is strictly increasing in $\\sigma$, so the solution is unique.",
    "$C_{\\text{market}}$ is observed without error.",
    "The same equation holds at every strike simultaneously, with one $\\sigma$.",
    "$C_{\\text{BS}}$ is a linear function of $\\sigma$.",
  ], answer: 0,
  why: "More volatility widens the distribution of the terminal price, and since the payoff $(P_t-K)^+$ caps losses at zero while leaving the upside open, extra spread is always worth more. That strict monotonicity makes the map from $\\sigma$ to price invertible, so backing out a unique $\\sigma_{\\text{imp}}$ is legitimate. It emphatically does **not** hold at every strike at once with the same number — that failure is the volatility smile." },

/* -------------------------------------------- Part 8: maximum likelihood */
{ id: "x13", ref: "f15", topic: "Likelihood",
  q: "For iid observations the likelihood is\n\n$$L(\\theta)=\\prod_{i=1}^{n}f(x_i;\\theta).$$\n\nWhich assumption justifies the product?",
  choices: [
    "The parameter is one-dimensional.",
    "The observations are identically distributed.",
    "The observations are independent.",
    "The density is continuous.",
  ], answer: 2,
  why: "**Independence** is what lets a joint density factor into a product of marginals. Identical distribution is what lets the *same* $f$ and the *same* $\\theta$ appear in every factor, which is a separate assumption. Drop independence and the product is wrong — which is exactly the GARCH situation, repaired by conditioning on the past instead." },

{ id: "x14", ref: "f15", topic: "Log-likelihood",
  q: "Taking logs gives $\\ell(\\theta)=\\sum_{i=1}^{n}\\log f(x_i;\\theta)$. Why does this not change the answer?",
  choices: [
    "Because the logarithm is concave.",
    "Because $\\log$ and $\\prod$ commute.",
    "Because the log-likelihood is unbiased.",
    "Because the logarithm is strictly increasing.",
  ], answer: 3,
  why: "A strictly increasing transformation preserves **order**, so whatever maximizes $L$ also maximizes $\\log L$ — the location of the peak is untouched even though its height changes. Concavity is a convenience for the optimizer, not the reason the maximizer is preserved, and a concave likelihood is not guaranteed in general." },

{ id: "x15", ref: "f15", topic: "Exponential MLE",
  q: "For an iid Exponential$(\\lambda)$ sample, $\\ell(\\lambda)=n\\log\\lambda-\\lambda\\sum x_i$. What is $\\hat\\lambda$?",
  choices: ["$\\sum x_i$", "$\\bar x$", "$1/\\bar x$", "$n/\\!\\sum x_i^2$"], answer: 2,
  why: "Differentiate: $n/\\lambda-\\sum x_i=0$, so $\\hat\\lambda=n/\\sum x_i=1/\\bar x$. Two things worth noting. The mean of an Exponential is $1/\\lambda$, so inverting the sample mean is exactly what intuition suggests. And the estimate depends on the data **only through the sum**, so once you have $\\bar x$ the individual observations add nothing." },

{ id: "x16", ref: "f15", topic: "Normal log-likelihood",
  q: "The iid normal log-likelihood is\n\n$$\\ell(\\beta,\\sigma)=-\\frac{n}{2}\\log(2\\pi\\sigma^2)-\\frac{1}{2\\sigma^2}\\sum\\big(y_i-\\hat y_i\\big)^2.$$\n\nWhy does maximizing it over $\\beta$ give least squares?",
  choices: [
    "Because $\\sigma^2$ must be estimated first.",
    "Because the logarithm is strictly increasing.",
    "Because the first term of the expression is itself maximized at the least squares fit.",
    "Because $\\beta$ appears only in the second term, which is the negative sum of squares.",
  ], answer: 3,
  why: "The first term is free of $\\beta$, so it is a constant as far as the coefficients are concerned. All the $\\beta$ dependence sits in $-\\frac{1}{2\\sigma^2}\\sum(y_i-\\hat y_i)^2$, and because the multiplier is **negative**, making that as large as possible means making the sum of squares as small as possible. Maximizing the likelihood and minimizing the sum of squares are then literally the same operation." },

{ id: "x17", ref: "f15", topic: "GARCH recursion",
  q: "A GARCH(1,1) sets $\\sigma_t^2=\\omega+\\alpha r_{t-1}^2+\\beta\\sigma_{t-1}^2$, and the likelihood is started at $\\sigma_1^2=\\omega/(1-\\alpha-\\beta)$. Why that value?",
  choices: [
    "It is the variance of the parameter estimates.",
    "It maximizes the likelihood with respect to $\\omega$.",
    "It is the unconditional variance, used because $\\sigma_1^2$ has no predecessor.",
    "It is the constraint that keeps the estimates of $\\alpha$ and $\\beta$ positive throughout.",
  ], answer: 2,
  why: "The recursion defines $\\sigma_t^2$ from the previous variance and return, so the very first one has nothing to build on and must be **seeded**. Solving $\\sigma^2=\\omega+\\alpha\\sigma^2+\\beta\\sigma^2$ for a constant level gives $\\omega/(1-\\alpha-\\beta)$, the long-run variance, which is the natural choice. Note this requires $\\alpha+\\beta<1$ — the stationarity condition, without which the expression is negative or undefined." },

/* ---------------------------------------- Part 9: properties of the MLE */
{ id: "x18", ref: "f16", topic: "Score equation",
  q: "The MLE solves $\\left.\\dfrac{\\partial\\ell}{\\partial\\theta}\\right|_{\\hat\\theta}=0$. What additional condition confirms a maximum?",
  choices: [
    "$\\partial^2\\ell/\\partial\\theta^2<0$ at $\\hat\\theta$.",
    "$\\partial^2\\ell/\\partial\\theta^2=0$ at $\\hat\\theta$.",
    "$\\ell(\\hat\\theta)>0$.",
    "$\\partial^2\\ell/\\partial\\theta^2>0$ at $\\hat\\theta$.",
  ], answer: 0,
  why: "A zero first derivative only says the surface is level — it could be a minimum or a saddle. **Negative** curvature is what makes it a peak, the log-likelihood bending downward on both sides. A zero second derivative is the degenerate case where the likelihood is locally flat and the parameter is barely determined. The height $\\ell(\\hat\\theta)$ is routinely negative and says nothing." },

{ id: "x19", ref: "f16", topic: "Variance from curvature",
  q: "In one dimension the estimated variance of the MLE is\n\n$$\\widehat{\\Var}(\\hat\\theta)=\\left(-\\frac{\\partial^2\\ell}{\\partial\\theta^2}\\right)^{-1}.$$\n\nWhat does a large second derivative in magnitude imply?",
  choices: [
    "A large standard error.",
    "A small standard error.",
    "A biased estimate.",
    "That the model is misspecified.",
  ], answer: 1,
  why: "Curvature and uncertainty are **reciprocal**, which is what the inverse in the formula is doing. Sharp curvature means the log-likelihood falls away steeply, so nearby parameter values explain the data much worse and $\\theta$ is pinned down — a small variance. A nearly flat log-likelihood means many values fit about as well, giving a large one. Nothing here concerns bias." },

{ id: "x20", ref: "f16", topic: "Fisher information",
  q: "The Fisher information is $I(\\theta)=-\\E\\left[\\dfrac{\\partial^2\\ell}{\\partial\\theta^2}\\right]$. How does it differ from the observed Hessian?",
  choices: [
    "It is evaluated at the true parameter value rather than at the estimate.",
    "It is an expectation, so it does not depend on the particular sample.",
    "It is always larger than the observed Hessian.",
    "It uses first derivatives instead of second.",
  ], answer: 1,
  why: "Both measure curvature; the information is the **expected** curvature, averaged over all samples the model could produce, while the Hessian is the curvature of the one log-likelihood you actually have. That is why the information can be computed before collecting data — it is a property of the model and the sample size — and why its inverse gives the Cramér-Rao bound rather than a sample-specific standard error." },

{ id: "x21", ref: "f16", topic: "Cramer-Rao",
  q: "The Cramér-Rao bound states that for an unbiased $\\hat\\theta$,\n\n$$\\Var(\\hat\\theta)\\ \\ge\\ \\frac{1}{nI(\\theta)}.$$\n\nWhat does the $n$ in the denominator tell you?",
  choices: [
    "The bound is only valid once the sample size is reasonably large.",
    "The bound grows with the sample size.",
    "Each observation must be weighted by $1/n$.",
    "The bound tightens as $1/n$, so standard errors shrink like $1/\\sqrt{n}$.",
  ], answer: 3,
  why: "Independent observations each contribute $I(\\theta)$ of information, so information **adds** and the floor on the variance falls like $1/n$. Taking the square root gives the familiar $1/\\sqrt{n}$ rate for the standard error — quadruple the data to halve the uncertainty. The bound itself holds at every $n$; it is the MLE's *attainment* of it that is asymptotic." },

{ id: "x22", ref: "f16", topic: "Covariance matrix",
  q: "With several parameters the estimated covariance matrix is $\\big(-H\\big)^{-1}$, where $H$ is the Hessian. What do its off-diagonal entries give?",
  choices: [
    "The second derivatives with respect to the data.",
    "The constraints linking the parameters.",
    "The biases of the estimates.",
    "The covariances between parameter estimates.",
  ], answer: 3,
  why: "The diagonal gives variances, whose square roots are the standard errors, and the off-diagonal entries give the **covariances between estimates**. These matter: a large one means the likelihood has a long diagonal ridge, so each parameter alone is imprecise while some combination of them is pinned down tightly. It is also why a function of several parameters needs the whole matrix, not one standard error." },

{ id: "x23", ref: "f16", topic: "Delta Method",
  q: "The one-dimensional Delta Method gives\n\n$$\\Var\\big(g(\\hat\\theta)\\big)\\approx\\big(g'(\\theta)\\big)^2\\Var(\\hat\\theta).$$\n\nWhy is it only an approximation?",
  choices: [
    "Because $g$ is replaced by its tangent line at $\\hat\\theta$.",
    "Because $\\hat\\theta$ is a biased estimator of $\\theta$.",
    "Because the formula ignores the sample size.",
    "Because $\\Var(\\hat\\theta)$ is itself estimated.",
  ], answer: 0,
  why: "The method linearizes: over the range $\\hat\\theta$ plausibly occupies, $g$ is treated as a straight line with slope $g'$. That is accurate when $g$ is nearly linear there and degrades when it is strongly curved, or when the estimate is so imprecise that the range is wide. A **larger** sample narrows the range and so makes the approximation better." },

{ id: "x24", ref: "f16", topic: "VaR",
  q: "A $1\\%$ Value at Risk satisfies $P(L>\\text{VaR})=0.01$, where $L$ is the loss. Which quantity is this?",
  choices: [
    "The largest loss in the sample.",
    "The mean of the losses falling in the worst $1\\%$ of cases.",
    "The $99$th percentile of the loss distribution.",
    "The probability of a large loss.",
  ], answer: 2,
  why: "The threshold exceeded only $1\\%$ of the time is the $99$th percentile of **losses**, equivalently the $1$st percentile of returns — the same number read from either end. The mean beyond that threshold is **CVaR**, and it is the more informative measure precisely because VaR says nothing about how bad the exceedances are. A VaR is an amount, never a probability." },

/* ------------------------------------------- Part 10: model selection */
{ id: "x25", ref: "f17", topic: "AIC",
  q: "$\\text{AIC}=-2\\log L+2k$. Two models give $\\text{AIC}=8053.23$ and $7971.98$. Which is preferred, and why?",
  choices: [
    "The first, because it has fewer parameters.",
    "The first, because larger AIC means a better fit.",
    "The second, because AIC is to be minimized.",
    "Neither, because the parameter counts are not given.",
    ], answer: 2,
  why: "The leading $-2\\log L$ flips the sign on the fit, so a better-fitting model drives AIC **down**, and the $+2k$ then charges for complexity. Lower is better throughout. The parameter counts are already baked into the numbers, which is the point of the criterion — it lets you compare models of different sizes on one scale." },

{ id: "x26", ref: "f17", topic: "AIC trade-off",
  q: "Under $\\text{AIC}=-2\\log L+2k$, how much must $\\log L$ rise for one extra parameter to be worthwhile?",
  choices: ["By more than $1$", "By more than $2$", "By more than $4$", "By more than $0.5$"], answer: 0,
  why: "An extra parameter adds 2 to the penalty, and the fit term is $-2\\log L$, so a gain of $\\Delta$ in the log-likelihood lowers AIC by $2\\Delta$. Setting $2\\Delta>2$ gives $\\Delta>1$. The common slip is to compare the raw log-likelihood gain against the penalty of 2 and demand twice as much improvement as AIC actually requires — the factor of 2 applies to **both** terms." },

{ id: "x27", ref: "f17", topic: "BIC",
  q: "$\\text{BIC}=-2\\log L+k\\log n$. For daily returns over several years, how does its behaviour compare with AIC?",
  choices: [
    "It is identical, since $\\log n$ is close to 2.",
    "It charges more per parameter, so it prefers smaller models.",
    "It charges less per parameter, so it prefers larger models.",
    "It cannot be compared, since it uses a different fit term.",
  ], answer: 1,
  why: "The fit term is the same; only the per-parameter charge differs. $\\log n$ exceeds 2 for any $n$ beyond 7, and with several thousand daily returns it is around 8 — four times AIC's charge. So BIC is the stricter criterion and favours **parsimony**, and the two can disagree whenever the log-likelihood gain lands between the two thresholds." },

{ id: "x28", ref: "f17", topic: "Nesting",
  q: "The normal is nested within the $t$ as which restriction?",
  choices: [
    "$\\nu=1$", "$\\nu=2$", "$\\nu\\to\\infty$", "$\\nu=0$",
  ], answer: 2,
  why: "As the degrees of freedom grow the $t$'s tails thin out and it converges to the normal, so the normal is the limiting case. That is what makes the comparison a **nested** one: the $t$ can always do at least as well, because it can imitate the normal by sending $\\nu$ up. At the other end, $\\nu=1$ is the Cauchy, which has no mean at all, and $\\nu=2$ has no finite variance." },

{ id: "x29", ref: "f17", topic: "GED",
  q: "The generalized error distribution has density proportional to $\\exp\\!\\big(-|x/\\alpha|^{\\beta}\\big)$. Which $\\beta$ returns the normal?",
  choices: ["$\\beta=1$", "$\\beta=2$", "$\\beta=3$", "$\\beta\\to\\infty$"], answer: 1,
  why: "A normal density carries $e^{-x^2/2\\sigma^2}$, so the exponent on $|x|$ is 2. Setting $\\beta=1$ gives $e^{-|x|/\\alpha}$, the **Laplace**, with heavier tails; smaller $\\beta$ still is heavier again. So $\\beta$ is the tail-thickness dial, with 2 as the reference point — and note the whole family is symmetric, which is why skewed variants are introduced separately." },

/* -------------------------------------------------- Part 11: the DEJD */
{ id: "x30", ref: "f18", topic: "DEJD log return",
  q: "Under the DEJD, $r(s)=\\left(\\mu-\\tfrac12\\sigma^2\\right)s+\\sigma Z(s)+U+D$. What property of the four terms makes the likelihood tractable?",
  choices: [
    "They are all normally distributed.",
    "They are identically distributed.",
    "They are independent.",
    "They each have mean zero.",
  ], answer: 2,
  why: "**Independence** of drift, diffusion, up jumps and down jumps is what lets the density be assembled by conditioning on the jump counts and multiplying the pieces. They are certainly not identically distributed — one is deterministic, one normal, two compound Poisson — nor are they all normal: the jump terms are sums of exponentials, which is the model's whole point." },

{ id: "x31", ref: "f18", topic: "Parameter correspondence",
  q: "Kou writes the DEJD with a total jump rate $\\lambda$ and an up-jump probability $p$; Ramezani and Zeng use rates $\\lambda_u$ and $\\lambda_d$. What is $p$?",
  choices: [
    "$1/2$ by construction",
    "$\\lambda_u/\\lambda_d$",
    "$\\lambda_u/(\\lambda_u+\\lambda_d)$",
    "$\\lambda_u\\lambda_d$",
  ], answer: 2,
  why: "Two independent Poisson streams superimpose into one with rate $\\lambda=\\lambda_u+\\lambda_d$, and the chance that a given event came from the up stream is that stream's **share** of the total rate. So the two formulations are the same model in different coordinates; the real difference between the papers is the assumed jump size distribution, not the number of processes." },

{ id: "x32", ref: "f18", topic: "Density by conditioning",
  q: "The DEJD density is written\n\n$$f(r)=\\sum_{m=0}^{\\infty}\\sum_{n=0}^{\\infty}f_{m,n}(r)\\,P(N_u=m)\\,P(N_d=n).$$\n\nWhat justifies factoring the joint probability?",
  choices: [
    "The jump sizes are exponential.",
    "$N_u$ and $N_d$ are independent.",
    "The sums converge absolutely.",
    "The diffusion is normal.",
  ], answer: 1,
  why: "The two jump streams are modelled as **independent** Poisson processes, so their counts are independent and the joint probability is the product of two Poisson pmfs. The double sum is just the law of total probability run over both indices at once — condition on how many of each kind occurred, handle that easy case, then average over all the possibilities." },

{ id: "x33", ref: "f18", topic: "Log of a Pareto",
  q: "If $Y$ has a Pareto distribution with parameter $\\eta_u$ and support $(1,\\infty)$, what is the distribution of $\\log Y$?",
  choices: [
    "Exponential$(\\eta_u)$",
    "Pareto$(\\eta_u)$",
    "Uniform on $(0,1)$",
    "Normal",
  ], answer: 0,
  why: "This is the identity that makes the two formulations one model. Support $(1,\\infty)$ maps under the logarithm to $(0,\\infty)$, which is where an Exponential lives, and the power-law density becomes the exponential one. So multiplying the price by a Pareto on the price scale is **adding** an Exponential on the log scale — precisely Kou's assumption — and likewise $\\log$ of a Beta$(\\eta_d,1)$ is Exponential$(\\eta_d)$ with a sign flip." },
];
