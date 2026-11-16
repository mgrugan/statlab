/* StatLab — Parts 6 through 11, the material on Midterm Two.
 *
 * Built from Lectures 9-18 (24 Sept - 10 Nov 2026), which are scans of the
 * printed notes with the professor's own worked answers in the margins.
 * Where a margin answer settles a question, it is reproduced here, because
 * that is what the exam is written against.
 *
 * The second midterm covers Parts 6-11 inclusive, in the same format as
 * the first: short multiple-choice questions testing understanding, no
 * notes, no calculator, no computer. Code appears only to be read and
 * interpreted — never written or debugged.
 */

export const FINANCE_MODULES_3 = [

/* ==================================================================== f13 */
{
  id: "f13",
  part: "Part 6",
  title: "The Poisson Process",
  minutes: 22,
  summary: "Bernoulli, binomial, Poisson and exponential; the memoryless property; the five properties of a Poisson process; and how jumps enter a pricing model.",
  blocks: [
    { kind: "plain", title: "Why this Part exists",
      body: "At the end of Part 5 the lognormal pricing model was left with **four** known deficiencies:\n\n1. the **heavy-tailed** (leptokurtic) nature of log returns;\n2. **volatility clustering**;\n3. the **leverage effect**, including the asymmetry in the relationship;\n4. **discontinuities in prices** — *to be covered*.\n\nThat fourth one is this Part. Real prices do not move smoothly: news arrives, and the price **jumps**. The Poisson process is the machinery for modelling when those jumps happen.",
      after: "Why bother getting the pricing model right at all? Three reasons from the notes: **mispricing of derivatives**; **managing risk**, where the tail behaviour of the pricing model is crucial to understanding how much risk you are carrying; and **portfolio optimization**, which relies on an accurate understanding of how real prices behave." },

    { kind: "math", title: "Bernoulli and binomial",
      body: "A **Bernoulli trial** has two outcomes, \"success\" and \"failure\". $X\\sim\\text{Bernoulli}(p)$ takes the value 1 on a success and 0 on a failure, with $P(X=1)=p$.\n\nIts pmf, mean and variance:",
      tex: ["f_X(x)=\\begin{cases}p,&x=1\\\\1-p,&x=0\\end{cases}\\qquad \\E(X)=p\\qquad \\Var(X)=p(1-p)"],
      after: "The variance follows from $\\Var(X)=\\E(X^2)-\\E(X)^2=p-p^2=p(1-p)$, using $X^2=X$ for a 0/1 variable.\n\nCount the successes in $n$ **independent** Bernoulli trials and you have the **binomial**:" },

    { kind: "math", title: "The binomial$(n,p)$ distribution",
      body: "If $X$ is the number of successes in $n$ independent trials each with success probability $p$, then $X\\sim\\text{binomial}(n,p)$:",
      tex: ["f_X(k)=\\binom{n}{k}p^k(1-p)^{n-k},\\quad k=0,1,\\ldots,n", "\\E(X)=np\\qquad \\Var(X)=np(1-p)"],
      after: "Roll a die ten times and count the 1's: $X\\sim\\text{binomial}(n=10,\\,p=1/6)$, where \"success\" means rolling a 1." },

    { kind: "trap", title: "The binomial model for stock prices — and what is NOT binomial",
      body: "The **binomial model** describes prices in discrete time. Starting at $S$, next period the value is $uS$ with probability $p$ or $dS$ with probability $1-p$, with $u>d$ and usually $u=1/d$ so the tree recombines.\n\nAfter $t$ steps, $S_t$ has $t+1$ possible values, namely\n\n$$S_0\\,u^k d^{\\,t-k},\\qquad k=0,1,\\ldots,t$$\n\nwhere $k$ is the number of \"up\" steps. Since steps are independent,\n\n$$P\\big(S_t=S_0u^kd^{\\,t-k}\\big)=\\binom{t}{k}p^k(1-p)^{t-k}.$$",
      after: "**The trap:** the *number of up steps* is binomial$(t,p)$. **$S_t$ itself is NOT binomial.** It is a discrete random variable whose possible values are those $t+1$ products, and whose probabilities happen to be binomial probabilities. A binomial random variable takes the values $0,1,\\ldots,t$; $S_t$ does not." },

    { kind: "math", title: "The Poisson$(\\lambda)$ distribution",
      body: "$X$ has the Poisson$(\\lambda)$ distribution, $\\lambda>0$, if",
      tex: ["f_X(k)=\\frac{e^{-\\lambda}\\lambda^k}{k!},\\quad k=0,1,2,\\ldots", "\\E(X)=\\lambda\\qquad \\Var(X)=\\lambda"],
      after: "**The mean and the variance are the same number.** That is worth remembering — it is the Poisson's signature, and it is the kind of thing a one-line exam question asks for directly.\n\nIt is the natural model for **counts**: how many times something happens in a fixed period of time." },

    { kind: "idea", title: "Where the Poisson comes from: a limit of binomials",
      body: "Fix $\\lambda>0$ and let $X_n\\sim\\text{binomial}(n,\\,p=\\lambda/n)$. Then for every $k$,\n\n$$\\lim_{n\\to\\infty}P(X_n=k)=P(Y=k),\\qquad Y\\sim\\text{Poisson}(\\lambda).$$\n\n**The picture to hold.** Divide a fixed time interval into $n$ equal subintervals. In each one, independently, place a mark with probability $\\lambda/n$. Let $X$ be the total number of marks. Then $X\\sim\\text{binomial}(n,\\lambda/n)$, and as $n$ grows the distribution of $X$ converges to Poisson$(\\lambda)$.",
      after: "Notice what the construction builds in: **each subinterval decides independently**, and the chance in each is the same. Those two assumptions are the whole content of \"events arrive independently at a constant rate\" — and they are why the memoryless property appears a page later." },

    { kind: "math", title: "Why the limit works",
      body: "For $n\\ge k$,",
      steps: [
        ["P(X_n=k)=\\left(\\frac{n!}{k!(n-k)!}\\right)\\left(\\frac{\\lambda}{n}\\right)^k\\left(1-\\frac{\\lambda}{n}\\right)^{n-k}", "the binomial pmf with $p=\\lambda/n$"],
        ["=\\left(\\frac{\\lambda^k}{k!}\\right)\\left(\\frac{n(n-1)\\cdots(n-k+1)}{n^k}\\right)\\left(1-\\frac{\\lambda}{n}\\right)^{n}\\left(1-\\frac{\\lambda}{n}\\right)^{-k}", "split the factorial and the powers into four pieces"],
        ["\\lim_{n\\to\\infty}P(X_n=k)=\\frac{\\lambda^k}{k!}\\cdot 1\\cdot e^{-\\lambda}\\cdot 1=\\frac{\\lambda^ke^{-\\lambda}}{k!}", "first piece constant, second $\\to1$, third $\\to e^{-\\lambda}$, fourth $\\to1$"],
      ],
      after: "The $e^{-\\lambda}$ in the Poisson pmf is nothing more than $\\lim(1-\\lambda/n)^n$." },

    { kind: "math", title: "The Exponential$(\\lambda)$ distribution",
      body: "For $X\\sim\\text{Exponential}(\\lambda)$ with $\\lambda>0$:",
      tex: ["f_X(x)=\\begin{cases}\\lambda e^{-\\lambda x},&x\\ge0\\\\0,&\\text{otherwise}\\end{cases}",
            "\\E(X)=\\frac{1}{\\lambda}\\qquad \\Var(X)=\\frac{1}{\\lambda^2}",
            "F_X(x)=P(X\\le x)=\\begin{cases}1-e^{-\\lambda x},&x\\ge0\\\\0,&x<0\\end{cases}"],
      after: "Mind the direction of $\\lambda$: a **large** rate means events arrive **often**, so the mean waiting time $1/\\lambda$ is **small**. The survival probability $P(X>x)=e^{-\\lambda x}$ is the form you actually use." },

    { kind: "math", title: "The memoryless property",
      body: "For $a>0$ and $b>0$, the exponential satisfies $P(X>a+b\\mid X>b)=P(X>a)$:",
      steps: [
        ["P(X>a+b\\mid X>b)=\\frac{P(X>a+b\\ \\text{and}\\ X>b)}{P(X>b)}", "rule for conditional probability, valid since $P(X>b)>0$"],
        ["=\\frac{P(X>a+b)}{P(X>b)}=\\frac{1-F_X(a+b)}{1-F_X(b)}=\\frac{e^{-\\lambda(a+b)}}{e^{-\\lambda b}}", "$X>a+b$ already implies $X>b$, so the intersection is just $X>a+b$"],
        ["=e^{-\\lambda a}=P(X>a)", "the $b$ cancels completely"],
      ],
      after: "**What it means in words.** Model the times between events — jumps, say — as Exponential$(\\lambda)$. Given that you have already waited $b$ time units, the probability you must wait a further $a$ is **the same as the original probability** of waiting $a$. The distribution \"forgets\" how long it has been since the previous event.\n\nSo: **no**, a jump does not become more likely just because none has happened for a while." },

    { kind: "key", title: "The Poisson Process — the five properties",
      body: "Take the subinterval construction and extend the time interval to infinity. That is a **Poisson Process with rate $\\lambda$**. Saying \"events occur as a Poisson process with rate $\\lambda$\" means all five of:\n\n1. If $Y$ is the number of events in an interval of length $T$, then $Y\\sim\\textbf{Poisson}(\\lambda T)$.\n2. The **times between events** are $\\textbf{Exponential}(\\lambda)$ random variables.\n3. Those times between events are **independent**.\n4. The numbers of events in **disjoint** time intervals are **independent**.\n5. The waiting time for $k$ events has the $\\textbf{Gamma}(k,\\lambda)$ distribution (also called the **Erlang**).\n\nProperty 5 is just properties 2 and 3 together: if $X_1,\\ldots,X_k$ are independent Exponential$(\\lambda)$, then $\\sum X_i\\sim\\text{Gamma}(k,\\lambda)$." },

    { kind: "math", title: "Property 1 implies Property 2",
      body: "Let $U$ be the time to the next event, and take $u>0$:",
      steps: [
        ["F_U(u)=P(U\\le u)=1-P(U>u)", "complement"],
        ["=1-P(\\text{no events during }(0,u))=1-P(X=0),\\quad X\\sim\\text{Poisson}(\\lambda u)", "waiting longer than $u$ is exactly the event that nothing happened in $(0,u)$; by Property 1 that count is Poisson$(\\lambda u)$"],
        ["=1-\\frac{e^{-\\lambda u}(\\lambda u)^0}{0!}=1-e^{-\\lambda u}", "plug $k=0$ into the Poisson pmf"],
      ],
      after: "For $u\\le0$, $F_U(u)=0$. That is precisely the CDF of the Exponential$(\\lambda)$ distribution, and by uniqueness of the CDF, $U\\sim\\text{Exponential}(\\lambda)$." },

    { kind: "idea", title: "Why this is the right model for market jumps",
      body: "The Poisson process models situations where events arrive **independently of each other** and at a **constant rate** — the classic example being calls into a call centre.\n\n\"Constant rate\" means the **expected** number in an interval of fixed length does not change over time. The number in any given interval is still random.\n\nThe independent-arrival property and the memoryless waiting time are two sides of the same coin: if events truly arrive independently, then however long it has been since the last one tells you nothing about the next.",
      after: "Applied to prices: the Poisson process is used to model how **news and other events** affect a stock price, since real prices are subject to larger fluctuations when such events occur. **The assumption being made is that these shocks are not predictable and arrive independently** — which is also the assumption's main weakness, since it rules out crashes clustering in time." },

    { kind: "math", title: "Putting a jump into the pricing model",
      body: "Let $X_2$ be the number of jumps between now and maturity, arriving as a Poisson process with rate $\\lambda$ per day, and let $T$ be the time to maturity in days. When a jump occurs its size is normal with mean zero and variance $\\psi^2$. Underneath, the ordinary fluctuations are still normal on the log scale. Then the price at maturity is",
      tex: ["P_T=\\exp\\left(X_1+\\sum_{i=1}^{X_2}Z_i\\right)"],
      after: "with $X_1\\sim\\text{Normal}(\\nu,\\xi^2)$, $X_2\\sim\\text{Poisson}(\\lambda T)$ and $Z_i\\sim\\text{Normal}(0,\\psi^2)$, all independent.\n\n**This is the foundation of the Merton jump diffusion model**, which is Part 7." },

    { kind: "math", title: "Pricing the option by conditioning on the number of jumps",
      body: "The trick is to condition on how many jumps occurred, because *given* that number everything is lognormal again:",
      steps: [
        ["\\E\\big((P_T-K)^+\\big)=\\sum_{j=0}^{\\infty}\\E\\big((P_T-K)^+\\mid X_2=j\\big)\\,P(X_2=j)", "law of total probability, in the form $\\E(X)=\\sum_i\\E(X\\mid Y=i)P(Y=i)$"],
        ["X_1+\\sum_{i=1}^{j}Z_i\\ \\sim\\ \\text{Normal}\\big(\\nu,\\ \\xi^2+j\\psi^2\\big)", "when $X_2=j$: independent normals add, means add, variances add"],
        ["P_T\\mid (X_2=j)\\ \\sim\\ \\text{lognormal}\\big(\\nu,\\ \\xi^2+j\\psi^2\\big)", "so each term is the Part 2 lognormal result with the variance updated from $\\xi^2$ to $\\xi^2+j\\psi^2$"],
        ["P(X_2=j)=\\frac{e^{-\\lambda T}(\\lambda T)^j}{j!}", "the Poisson weights, using $X_2\\sim\\text{Poisson}(\\lambda T)$"],
      ],
      after: "So the jump-model price is a **Poisson-weighted average of Black-Scholes prices**, each computed with a larger variance. That is exactly what `merton_price` does in code — and why it has to truncate an infinite sum." },

    { kind: "check",
      q: "A jump has not occurred for an unusually long stretch. Under a Poisson process, what does that imply about the chance of one in the next instant?",
      choices: [
        "It is higher, because a jump is overdue and the rate must average out",
        "It is unchanged — the process is memoryless",
        "It is lower, because the recent calm is evidence the rate has fallen",
        "It cannot be determined without knowing the time since the last jump",
      ],
      answer: 1,
      explain: "Waiting times between events are Exponential, and the exponential is **memoryless**: $P(X>a+b\\mid X>b)=P(X>a)$. However long you have waited, the distribution of the remaining wait is the same as it was at the start. Note that the last option gets it exactly backwards — the time since the last jump is precisely the thing that does *not* matter." },

    { kind: "check",
      q: "In the binomial model for stock prices, with $S_t=S_0u^kd^{\\,t-k}$ after $t$ steps, which quantity has the binomial distribution?",
      choices: [
        "The price $S_t$ itself, with parameters $t$ and $p$",
        "The log return over the $t$ periods",
        "The number of \"up\" steps $k$, with parameters $t$ and $p$",
        "Neither — nothing in this model is binomial",
      ],
      answer: 2,
      explain: "Each step is an independent Bernoulli trial, so the **count of up steps** is binomial$(t,p)$. The price is a different object: it takes the $t+1$ values $S_0u^kd^{\\,t-k}$, which are products, not the integers $0,\\ldots,t$. The notes are explicit on this — $S_t$ is **not** binomial, even though its probabilities are binomial probabilities." },

    { kind: "check",
      q: "Events occur as a Poisson process with rate $\\lambda$. What is the distribution of the number of events in an interval of length $T$?",
      choices: [
        "Poisson$(\\lambda T)$",
        "Exponential$(\\lambda T)$",
        "Poisson$(\\lambda)$, regardless of the length $T$",
        "Gamma$(T,\\lambda)$, since $T$ periods have elapsed",
      ],
      answer: 0,
      explain: "That is Property 1. The rate $\\lambda$ is *per unit time*, so a window of length $T$ expects $\\lambda T$ events and the count is Poisson$(\\lambda T)$. The Exponential describes the **gaps between** events, not the count; the Gamma$(k,\\lambda)$ describes the waiting time until the $k$th event." },
  ],
},

/* ==================================================================== f14 */
{
  id: "f14",
  part: "Part 7",
  title: "Mean Models, Least Squares, and the Merton Model",
  minutes: 24,
  summary: "What a mean model is and is not, why least squares rather than L1, minimize() in Python, the volatility smile, and the Merton jump diffusion model fitted to it.",
  blocks: [
    { kind: "key", title: "What a mean model is",
      body: "A **mean model** characterizes how the **expected value** of a modelling random variable depends on unknown parameters and other known quantities — and nothing more.\n\n$$\\E(Y_i)=m(\\theta,\\mathbf{x}_i)$$\n\nwhere $m$ is the mean model, $\\theta$ are the unknown parameters, and $\\mathbf{x}_i$ are the known covariates / predictors / features. Equivalently,\n\n$$Y_i=m(\\theta,\\mathbf{x}_i)+\\epsilon_i$$\n\nwith $\\epsilon_i$ a mean-zero random variable.\n\n**A mean model is NOT a probability model**, because it does not fully specify the distribution of the modelling random variables. It is often an important *component* of one." },

    { kind: "plain", title: "Mean model versus full probability model",
      body: "This distinction is worth being able to state cleanly, because the professor's Q&A sheet asks for it directly.\n\n• A **mean model** specifies only the expected value of the observable random variables as a function of the parameters.\n• A **full probability model** specifies the **entire distribution** of the observables — so you can compute variances, quantiles, likelihoods and so on.\n\nOrdinary linear regression is the familiar example: $Y_i=\\beta_0+\\beta_1x_i+\\epsilon_i$ gives $m(\\theta,x_i)=\\beta_0+\\beta_1x_i$.",
      after: "**Why use a mean model at all?** The professor's answer is deliberately unromantic: models like the Merton specification of the volatility surface, or the Nelson-Siegel model for yield curves, come from **financial theory** — someone has a theory about how things behave, and that leads to a simple, smooth form for the relationship. Real data are never that smooth, so when fitting we must allow for scatter around the smooth curve. But the theory typically makes **no prediction about the distribution of that scatter**. Hence the model only specifies the mean. It is not that there is \"value\" in this; it is just what you are often handed." },

    { kind: "math", title: "Least squares",
      body: "With a training set of $(\\mathbf{x}_i,y_i)$ pairs, the popular way to fit a mean model is **least squares**: find the $\\theta$ minimizing the **residual sum of squares**",
      tex: ["\\text{RSS}(\\theta)=\\sum_{i=1}^{n}\\big(y_i-m(\\theta,\\mathbf{x}_i)\\big)^2"],
      after: "The motivation is to find the $\\theta$ that forces the mean model closest to the observations." },

    { kind: "idea", title: "Why squares rather than absolute values?",
      body: "A fair question: why not minimize $\\sum_i\\big|y_i-m(\\theta,\\mathbf{x}_i)\\big|$, which is **L1 regression**? Three reasons from the notes:\n\n**1. Tractability.** The square is differentiable, continuous, and easier to work with analytically. L1 regression is only possible numerically.\n\n**2. The Gauss-Markov Theorem.** Least squares estimators are the **best linear unbiased estimators** of the parameters in the case of linear regression — \"best\" meaning *smallest variance*, \"linear\" meaning *a linear function of the $Y_i$*.\n\n**3. The link to MLE.** When the $\\epsilon_i$ are **iid normal**, the least squares estimators **are** the maximum likelihood estimators. That result is derived in Part 8.",
      after: "A quick exercise worth knowing: if $Y_1,\\ldots,Y_n$ are iid with mean $\\mu$, the mean model is $m(\\mu,\\mathbf{x}_i)=\\mu$ — the covariates do nothing — so you are minimizing $\\sum(y_i-\\mu)^2$, and the answer is $\\widehat\\mu=\\bar y$. The sample mean **is** a least squares estimator." },

    { kind: "math", title: "Weighted least squares",
      body: "\"OLS\" means **ordinary** least squares. **Weighted least squares** attaches a weight to each term:",
      tex: ["\\text{WRSS}(\\theta)=\\sum_{i=1}^{n}w_i\\big(y_i-m(\\theta,\\mathbf{x}_i)\\big)^2"],
      after: "**When to use it:** when some observations are known to be subject to much larger errors than others — **heteroskedasticity**. Observations with higher variance get **lower** weight.\n\n**The options example.** Prices of heavily-traded options are much more reliable than those of lightly-traded ones, so they deserve more weight. In the Merton fit below, the natural choice is to weight by trading **volume**." },

    { kind: "code", title: "minimize() — what each argument does", lang: "python", file: "minimize.py",
      body: "`scipy.optimize.minimize` minimizes a function you supply. You will be asked to **read** this, not write it.",
      code: `from scipy.optimize import minimize
import numpy as np

def sumofsqr(c, x):
    return sum((x-c)**2)

x = np.array([4,2,6,8,6,1])
res = minimize(sumofsqr, 0, method='Nelder-Mead',
               options={'disp': True}, args=(x))

res.x        # array([4.5])  -- the minimizing value, here the sample mean`,
      after: "**The six things to know:**\n\n1. The first argument is the **function** to be minimized — just its name, no parentheses.\n2. The second is the **starting value** for the parameter(s). It should be in the *interior* of the parameter space, not on the boundary. More than one parameter → pass an array.\n3. `method` picks the optimization technique (`Nelder-Mead`, `L-BFGS-B`, …).\n4. `options` sets tolerance, maximum iterations, how much is displayed.\n5. `args` passes any **additional** arguments through to your function.\n6. `res.x` is where the minimum occurred.\n\n**Two rules about the function itself:** to *maximize*, define the function as the **negative** of what you want; and the **first argument must be the variable(s) being optimized over** (as an array if there is more than one), with extras coming second onward." },

    { kind: "plain", title: "The volatility smile",
      body: "Under Black-Scholes, volatility is a fixed constant $\\sigma$. If that were true, **all options on the same underlying with the same expiration date would have equal implied volatility, regardless of strike price.**\n\nThey do not. Real markets exhibit a **volatility smile** (or **volatility skew**): plot Black-Scholes implied volatility against strike price and you get a curve, not a flat line.\n\nModels such as the **Merton model** have heavier tails than the normal, and this is what captures the smile.",
      after: "**Why heavier tails produce the smile.** Take out-of-the-money call options and let the true log-return distribution be heavier-tailed than normal. Then there is a **greater chance of the underlying making a large shift before expiration and ending up in the money**. That makes the option more valuable than Black-Scholes implies — and since the only dial Black-Scholes has is $\\sigma$, inverting the observed price forces the implied volatility **higher**. The effect becomes **more pronounced the further out of the money you go**, which is exactly the upward sweep of the smile." },

    { kind: "key", title: "The Merton model — the three ingredients",
      body: "The Merton model introduces **jumps** into an otherwise smooth model for the log price. Its crucial elements:\n\n1. The **smooth (diffusion) component** of the log price is a Brownian motion with drift $\\nu$ and scaling (volatility) $\\sigma^2$.\n2. **Jumps arrive as a Poisson process** with rate $\\lambda$ per year.\n3. The **sizes of the jumps are iid normal** with mean $\\mu_j$ and variance $\\sigma_j^2$.\n\nBefore the jumps are added, the Merton model is **just geometric Brownian motion** — the same continuous diffusion model underlying Black-Scholes. The word *diffusion model* means a stochastic process with **continuous paths**.",
      after: "Jumps come from events specific to the equity or from macroeconomic ones: earnings surprises, mergers and acquisitions, management changes, product launches or failures, legal rulings, monetary policy shifts, geopolitical shocks, economic data releases, market-wide crashes or rallies." },

    { kind: "trap", title: "The distribution of Merton log returns is NOT normal",
      body: "Work it through. The diffusion component contributes a **normal** increment to the log price — call it $X$. The number of jumps $J$ in a day is **Poisson**. Each jump size is **normal** — call them $U_1,\\ldots,U_J$. So\n\n$$\\text{log return}=X+\\sum_{k=1}^{J}U_k.$$\n\n**Since $J$ is random, this sum is NOT normally distributed.**",
      after: "That is the entire point of the model. Conditional on $J=j$ it *is* normal — which is what makes the pricing formula computable — but unconditionally it is a Poisson mixture of normals, and mixtures of normals with different variances have **heavier tails** than any single normal. Hence the smile." },

    { kind: "code", title: "Simulating Merton log returns", lang: "python", file: "sim_merton.py",
      body: "`dt` is the time interval in years, so `dt=1/252` gives daily returns; `T` is how many intervals to simulate.",
      code: `from scipy.stats import norm, poisson

def sim_merton(T, mu, sigma, lam, mu_j, sigma_j, dt=1/252):
    returns = []
    numjumps = []
    for _ in range(T):
        Z = np.random.normal()                 # smooth contribution
        N = np.random.poisson(lam * dt)        # number of jumps
        J = np.sum(np.random.normal(mu_j, sigma_j, N)) if N > 0 else 0
        r = mu * dt + sigma * np.sqrt(dt) * Z + J     # jump contribution
        numjumps.append(N)
        returns.append(r)
    return np.array(returns), np.array(numjumps)`,
      after: "**Reading the key line:** `r = mu*dt + sigma*np.sqrt(dt)*Z + J` is drift + diffusion + jumps. Note $\\sigma$ and $\\sigma_j$ are **not on comparable scales**: $\\sigma$ is annual, so the SD of the diffusion part of each daily log return is $\\sigma/\\sqrt{252}$, hence the `np.sqrt(dt)`.\n\nSimulating with `mu=0.1, sigma=0.2, lam=7, mu_j=-0.02, sigma_j=0.1` and plotting a normal probability plot of the result shows **visibly heavier tails than the normal would expect** — the simulation reproduces the stylized fact it was built for." },

    { kind: "idea", title: "Why calibrate to implied vols rather than to prices",
      body: "When fitting the Merton model to an observed volatility surface, the comparison is made in terms of **Black-Scholes implied volatilities**, not in terms of prices. Why?\n\nThis is a **mean model** — the Merton model only specifies what we would call the *expected value* for either the implied vol or the market price.\n\nLeast squares puts greater emphasis on the **larger fluctuations** around the fitted model, since $\\sum\\big(y_i-m(\\theta,\\mathbf{x}_i)\\big)^2$ is dominated by the big residuals. Option **prices** range from near 100 down to near 0 across the strikes, so if you fit to prices the few large values on the left completely control the fit.\n\nWhen you fit to the **implied vols** instead, there is a far more even distribution of errors across the range of strike prices — not a wide range of \"response\" values as in the case of prices.",
      after: "And recall: **OLS is optimal when the spread around the mean model is normal error.** A response variable whose scale varies by two orders of magnitude across the data is not that." },

    { kind: "check",
      q: "What distinguishes a mean model from a full probability model?",
      choices: [
        "A mean model specifies only the expected value; a probability model specifies the whole distribution",
        "A mean model has fewer parameters, which is why it is easier to fit numerically",
        "A mean model can only be fitted by least squares, never by maximum likelihood",
        "A mean model applies to a single observation, a probability model to a whole sample",
      ],
      answer: 0,
      explain: "A mean model gives $\\E(Y_i)=m(\\theta,\\mathbf{x}_i)$ and stops there — it says nothing about the scatter around that curve, so you cannot get variances, quantiles or likelihoods from it. A full probability model specifies the entire distribution of the observables. This is exactly why Black-Scholes and Merton are best thought of as mean models: they say how volatility or market price varies with the inputs, but not that the additional noise is normal." },

    { kind: "check",
      q: "Under what condition is weighted least squares preferred to ordinary least squares?",
      choices: [
        "When the parameters are correlated with one another",
        "When the mean model is nonlinear in the parameters",
        "When the errors do not have constant variance — heteroskedasticity",
        "When the sample size is too small for the central limit theorem",
      ],
      answer: 2,
      explain: "WLS exists for **heteroskedasticity**: when some observations carry much larger errors than others, they should not influence the fit equally. Observations with higher variance get **lower** weight. The options example is the standard one — heavily-traded options have more reliable prices, so they are weighted up, naturally by volume." },

    { kind: "check",
      q: "Why do out-of-the-money options show increasing implied volatility as the strike moves further out?",
      choices: [
        "Because Black-Scholes systematically misprices options with low trading volume",
        "Because the true return distribution is heavier-tailed, making a large move into the money likelier than the normal allows",
        "Because the risk-free rate used in the inversion is too low for distant strikes",
        "Because implied volatility is measured with more error for thinly-traded contracts",
      ],
      answer: 1,
      explain: "With heavier tails than the normal there is a greater chance of the underlying making a large shift before expiration and finishing in the money. That makes the option worth more than Black-Scholes implies, and since the only free parameter is $\\sigma$, inverting the richer market price returns a **higher** implied volatility — more so the further out of the money you go. Measurement error is a real nuisance in the data (hence weighting by volume) but it is not what produces the systematic smile." },
  ],
},

/* ==================================================================== f15 */
{
  id: "f15",
  part: "Part 8",
  title: "Maximum Likelihood Estimation",
  minutes: 22,
  summary: "The likelihood function, why we take logs, the equivalence of least squares and MLE under normal errors, and fitting GARCH(1,1) by numerical maximization.",
  blocks: [
    { kind: "plain", title: "Why MLE exists",
      body: "Many models **cannot** be adequately expressed as a mean model plus irreducible errors, so least squares is not an option. Maximum likelihood works with virtually any case where there is a **probability model**.\n\nA fully-specified probability model defines the **joint distribution** of the observable data, $f_{X_1,X_2,\\ldots,X_n}(x_1,x_2,\\ldots,x_n)$.",
      after: "**What must you add to a mean model to get a probability model?** Take $Y_i=m(\\theta,x_i)+\\epsilon_i$ with $\\E(\\epsilon_i)=0$. You need to specify the individual (**marginal**) distributions for the $\\epsilon_i$ — e.g. assume they are normal — **and** you must assume the $\\epsilon_i$ are **independent**. Independence of the $\\epsilon_i$ makes the $Y_i$ independent, which is what lets you write\n\n$$f_{Y_1,\\ldots,Y_n}=\\prod_{i=1}^{n}f_{Y_i}.$$" },

    { kind: "key", title: "The likelihood function",
      body: "In a probability course you view the joint distribution $f(\\mathbf{x}\\mid\\theta)$ as a function of $\\mathbf{x}$ for a **fixed parameter** $\\theta$ — \"assume $X$ is Exponential(3), what is $P(X\\le5)$?\"\n\nA **likelihood function** is the same object, except you think of it as a function of the **parameter** $\\theta$, for **fixed data** $\\mathbf{x}$. It is written $L(\\theta)$.\n\n**The idea of MLE.** We know $f(\\mathbf{x}\\mid\\theta)$ is largest for values of $\\mathbf{x}$ in regions of high probability under the model. Fix $\\mathbf{x}$ and turn it around: *what value of $\\theta$ makes the observed $\\mathbf{x}$ the most likely?* Which model maximizes the probability of having seen data close to what was actually observed?",
      after: "**Why \"close to\" rather than \"equal to\"?** Because for a continuous $X$, $P(X=a)=0$ for every $a$. You cannot interpret the joint density as giving \"the probability\" of different possible data values. What you *can* say is that the density is largest in areas where the probability of observing data **nearby** is largest." },

    { kind: "math", title: "The likelihood for iid Exponential data",
      body: "Suppose $X_1,\\ldots,X_n$ are iid Exponential$(\\lambda)$ and we observe $x_1,\\ldots,x_n$:",
      steps: [
        ["f_{X_i}(x)=\\lambda e^{-\\lambda x},\\quad x>0", "the density for one observation"],
        ["f_{X_1,\\ldots,X_n}(x_1,\\ldots,x_n)=\\prod_{i=1}^{n}\\lambda e^{-\\lambda x_i}", "independence makes the joint density a product of marginals"],
        ["=\\lambda^n e^{-\\lambda\\sum x_i},\\quad x_i>0", "collect the terms"],
        ["L(\\lambda)=\\lambda^n e^{-\\lambda\\sum x_i},\\quad \\lambda>0", "same formula, now read as a function of $\\lambda$ with the $x_i$ fixed"],
      ],
      after: "For the five observations $0.92,\\ 0.54,\\ 1.20,\\ 0.051,\\ 1.13$ this function peaks at $\\lambda=1.3$, so $\\widehat\\lambda=1.3$.\n\n**Important:** that plot is **not** a probability distribution for $\\lambda$ and **not** a density. It shows, for each possible value of the unknown $\\lambda$, the likelihood that the observed data would have arisen." },

    { kind: "idea", title: "Why the log-likelihood",
      body: "The likelihood is positive at its maximum, so the **log-likelihood** $\\ell(\\theta)=\\log L(\\theta)$ is maximized at exactly the same place. For the exponential case,\n\n$$\\ell(\\lambda)=\\log\\!\\big(\\lambda^ne^{-\\lambda\\sum x_i}\\big)=n\\log\\lambda-\\lambda\\sum x_i.$$\n\nThree reasons to use it:\n\n**1. Numerical stability.** In the iid case the likelihood is a product of $n$ densities. Even at moderate $n$ that product is either enormous or indistinguishable from zero. The log turns it into a **sum**, giving reasonable values and avoiding **underflow**.\n\n**2. Easier optimization.** Derivatives of a sum are far easier than derivatives of a product.\n\n**3. Theory.** The **curvature** of the log-likelihood turns out to relate directly to the uncertainty in the estimator — the whole of Part 9.",
      after: "In practice you minimize the **negative** log-likelihood, because `minimize()` minimizes." },

    { kind: "math", title: "Least squares IS maximum likelihood under normal errors",
      body: "This is flagged in the notes as an **Important Result**. Assume $Y_i=m(\\theta,\\mathbf{x}_i)+\\epsilon_i$ with $\\epsilon_i$ iid normal$(0,\\sigma^2)$:",
      steps: [
        ["Y_i\\sim N\\big(m(\\theta,\\mathbf{x}_i),\\ \\sigma^2\\big),\\quad Y_1,\\ldots,Y_n\\ \\text{independent}", "shifting a mean-zero normal by a constant"],
        ["f_{Y_i}(y_i)=\\frac{1}{\\sqrt{2\\pi}\\,\\sigma}\\exp\\left(-\\frac{\\big(y_i-m(\\theta,\\mathbf{x}_i)\\big)^2}{2\\sigma^2}\\right)", "the normal density"],
        ["L(\\theta,\\sigma^2)=\\left(\\frac{1}{\\sqrt{2\\pi}\\,\\sigma}\\right)^{n}\\exp\\left(-\\frac{\\sum_i\\big(y_i-m(\\theta,\\mathbf{x}_i)\\big)^2}{2\\sigma^2}\\right)", "multiply the marginals — independence again"],
        ["\\ell(\\theta,\\sigma^2)=n\\log\\left(\\frac{1}{\\sqrt{2\\pi}\\,\\sigma}\\right)-\\frac{\\sum_i\\big(y_i-m(\\theta,\\mathbf{x}_i)\\big)^2}{2\\sigma^2}", "take logs: the product becomes a sum, the exponential disappears"],
      ],
      after: "Look at the last line as a function of $\\theta$. The first term does not involve $\\theta$ at all, and the second is a **negative constant times the residual sum of squares**. So **maximizing $\\ell$ over $\\theta$ is exactly minimizing $\\sum\\big(y_i-m(\\theta,\\mathbf{x}_i)\\big)^2$.**\n\n**This relationship does NOT hold for other error distributions.** It is a special property of the normal — a direct consequence of the squared term in its exponent." },

    { kind: "code", title: "Numerical maximum likelihood", lang: "python", file: "mle.py",
      body: "Build the **negative** log-likelihood, then minimize it.",
      code: `from scipy.optimize import minimize

def neg_loglike_exp(lamda, x):
    return (-1)*len(x)*np.log(lamda) + lamda*np.sum(x)

res = minimize(neg_loglike_exp, 1, method='Nelder-Mead',
               options={'disp': True}, args=(x))

print(f"The MLE for lambda is {res.x[0]:6.3f}")   #  1.302`,
      after: "For a different distribution you **change the log-likelihood function being optimized** — nothing else. To fit a Gamma instead of a Normal, you evaluate the log-pdf of the Gamma instead of that of the Normal:\n\n```\ndef neg_loglike(pars, x):\n    return (-1)*sum(gamma.logpdf(x, pars[0], scale=1/pars[1]))\n```\n\nBe careful with each function's **parameterization**: `scipy`'s gamma takes a `scale`, which here is $1/\\beta$. For $X\\sim\\text{Gamma}(\\alpha,\\beta)$, $\\E(X)=\\alpha/\\beta$ and $\\Var(X)=\\alpha/\\beta^2$." },

    { kind: "math", title: "The GARCH(1,1) likelihood",
      body: "GARCH is the showcase: a model with no mean-model-plus-error form, fitted by MLE. Here $X_t$ is normal with mean zero and variance $\\sigma_t^2=\\omega+\\alpha X_{t-1}^2+\\beta\\sigma_{t-1}^2$, and $\\theta=(\\omega,\\alpha,\\beta)$.",
      steps: [
        ["f_{X_1,\\ldots,X_n}=f_{X_n\\mid X_1,\\ldots,X_{n-1}}\\cdot f_{X_1,\\ldots,X_{n-1}}", "since $f_{X,Y}=f_{X\\mid Y}f_Y$"],
        ["=\\prod_{t=1}^{n}f_{X_t\\mid\\mathcal{F}_{t-1}}", "repeat the factorization all the way down; $\\mathcal{F}_{t-1}$ is all information available at time $t-1$"],
        ["X_t\\mid\\mathcal{F}_{t-1}\\ \\sim\\ N\\big(0,\\ \\omega+\\alpha X_{t-1}^2+\\beta\\sigma_{t-1}^2\\big)", "this is what the GARCH model says, so the joint density is a product of normal densities"],
        ["\\sigma_1^2=\\frac{\\omega}{1-\\alpha-\\beta}", "the tricky part: $\\sigma_1^2$ is unspecified. The common fix is to set it to the unconditional variance, since $\\Var(X_t)=\\omega/(1-\\alpha-\\beta)$"],
      ],
      after: "Notice that the independence assumption is **not** available here — the whole point of GARCH is dependence — so the joint density is built by **conditioning** instead of by multiplying marginals. That is the step worth understanding." },

    { kind: "code", title: "GARCH(1,1) by hand, and via arch", lang: "python", file: "garch_mle.py",
      body: "The recursion fills in $\\sigma_t^2$, then the log-likelihood is a sum of normal log-densities.",
      code: `def neg_loglike_garch11(params, x):
    omega, alpha, beta = params
    sigma2 = np.zeros(len(x))
    sigma2[0] = omega/(1-alpha-beta)
    for t in range(1, len(x)):
        sigma2[t] = omega + alpha * x[t-1]**2 + beta * sigma2[t-1]
    return -np.sum(norm.logpdf(x, loc=0, scale=np.sqrt(sigma2)))

scl_data = np.array(EQldr)/np.std(EQldr)        # scale before fitting

res = minimize(neg_loglike_garch11, [np.var(scl_data), 0.1, 0.1],
               args=(scl_data,), method='L-BFGS-B',
               bounds=((0, None), (0, 0.999), (0, 0.999)))`,
      after: "**Why scale the returns first?** Raw daily log returns are tiny, and tinier still once squared, so gradients are extremely small and the optimizer struggles or underflows. Scaling prevents numerical underflow and helps convergence — the same reason `arch` has a `rescale=True` option.\n\n**Why bounds?** They force the iterative algorithm to respect the constraints on the parameters ($\\omega>0$, $\\alpha,\\beta\\ge0$). This works with `L-BFGS-B` but not with every method. If a lower bound of exactly zero causes trouble, replace it with something like `1e-6`.\n\nThe hand-rolled fit gives $\\widehat\\omega=0.274$, $\\widehat\\alpha=0.264$, $\\widehat\\beta=0.483$, with a negative log-likelihood of 1011.92 at the minimum — essentially what `arch_model(..., vol='GARCH', p=1, q=1, mean=\"Zero\")` reports (1011.66), confirming both routes do the same thing." },

    { kind: "key", title: "MLE is a method, not a model",
      body: "Worth being crisp about, because the professor answers this question directly: *\"what is the relationship between MLE and models such as GARCH?\"*\n\nIt is like asking the difference between a **linear regression model** and **least squares**. Linear regression is a *model*; least squares is a *method* for estimating its parameters.\n\nLikewise **GARCH is a model** — a particular way of explaining how a series changes over time. It has parameters ($\\omega,\\alpha,\\beta$) which must be estimated. Those parameters are **typically estimated using MLE**, by writing down the log-likelihood of the returns given the time-varying variance equation and maximizing it." },

    { kind: "check",
      q: "Why is the log-likelihood maximized rather than the likelihood itself?",
      choices: [
        "Because the log-likelihood has a unique maximum while the likelihood may have several",
        "Because the likelihood is a probability distribution for the parameter and the log is not",
        "Because taking logs turns a product into a sum, avoiding underflow and easing differentiation",
        "Because the likelihood can be negative, which breaks numerical optimizers",
      ],
      answer: 2,
      explain: "In the iid case the likelihood is a product of $n$ densities, which is either enormous or numerically zero at any realistic $n$. The log turns it into a sum, giving workable numbers and far easier derivatives — and the maximizer is unchanged because $\\log$ is increasing. The likelihood is strictly positive, and it is **not** a distribution for the parameter." },

    { kind: "check",
      q: "Maximizing the likelihood gives the same estimates as minimizing the sum of squared errors. Under what assumption?",
      choices: [
        "Whenever the mean model is linear in its parameters",
        "Only when the errors are iid normal",
        "For any error distribution, provided the errors have mean zero",
        "Whenever the sample is large enough for the central limit theorem",
      ],
      answer: 1,
      explain: "The normal log-likelihood is a constant minus $\\frac{1}{2\\sigma^2}\\sum\\big(y_i-m(\\theta,\\mathbf{x}_i)\\big)^2$, so maximizing it over $\\theta$ is identical to minimizing the sum of squares. **This relationship is unique to the normal** — it comes directly from the squared term in its exponent — and does not hold for other error distributions. Linearity of the mean model has nothing to do with it." },

    { kind: "check",
      q: "In the GARCH(1,1) likelihood, why is the joint density built by conditioning rather than by multiplying marginal densities?",
      choices: [
        "Because the observations are not independent — that dependence is the whole model",
        "Because the marginal distribution of $X_t$ is unknown in closed form",
        "Because conditioning is numerically more stable than multiplication",
        "Because the normal distribution does not factor into marginals",
      ],
      answer: 0,
      explain: "Writing $f=\\prod f_{X_i}$ requires independence, and GARCH is built precisely to capture dependence through time. So the joint density is factored as $\\prod_t f_{X_t\\mid\\mathcal{F}_{t-1}}$ instead, and each conditional distribution is $N(0,\\sigma_t^2)$ with $\\sigma_t^2$ given by the recursion. The one loose end is $\\sigma_1^2$, conventionally set to the unconditional variance $\\omega/(1-\\alpha-\\beta)$." },
  ],
},

/* ==================================================================== f16 */
{
  id: "f16",
  part: "Part 9",
  title: "Properties of MLEs",
  minutes: 24,
  summary: "Approximate normality and the curvature of the negative log-likelihood, regularity conditions, the Hessian as a covariance matrix, invariance, the Delta Method, and VaR/CVaR.",
  blocks: [
    { kind: "idea", title: "Curvature is uncertainty",
      body: "Start with calculus. For a function $f(t)$ minimized at $\\hat t$ and twice differentiable there, $\\left.\\frac{d^2f}{dt^2}\\right|_{t=\\hat t}>0$, and its **magnitude** quantifies how **sharp** the function is at the minimum.\n\nA sharply-curved valley pins the minimum down precisely. A broad, flat valley leaves it vague.\n\nThat is the entire intuition behind the central result of this Part: apply it to the **negative log-likelihood**, and sharpness of the minimum becomes certainty about the parameter." },

    { kind: "key", title: "Normality of the MLE — single parameter",
      body: "Let $\\widehat\\theta$ be the MLE for a real-valued parameter. Under **regularity conditions**, $\\widehat\\theta$ is approximately normal with mean equal to its true value and variance\n\n$$\\left(-\\left.\\frac{d^2\\ell(\\theta)}{d\\theta^2}\\right|_{\\theta=\\widehat\\theta}\\right)^{-1}.$$\n\n**The intuition:** when the negative log-likelihood has a **sharp** minimum (large second derivative), there is greater certainty about where the true parameter lies, which means a **smaller** variance for $\\widehat\\theta$.\n\nThe approximate normality is a direct result of the **central limit theorem**. It leads to a simple way to build confidence intervals and hypothesis tests.",
      after: "**Worked example.** For iid Exponential$(\\lambda)$ data, $-\\ell(\\lambda)=-n\\log\\lambda+\\lambda\\sum x_i$, so $-\\frac{d^2\\ell}{d\\lambda^2}=n/\\lambda^2$ and the variance of the MLE is approximately $\\widehat\\lambda^2/n$, giving a standard error of $\\widehat\\lambda/\\sqrt{n}$. Plot the negative log-likelihood for $n=100,250,400$ and the minimum visibly narrows as $n$ grows." },

    { kind: "trap", title: "The regularity conditions — and the one that fails",
      body: "Casella and Berger call \"under suitable regularity conditions\" a somewhat abused phrase, since with enough assumptions one can prove almost anything. Here the conditions that matter are:\n\n1. The space of models must have a **shared support** — the support of the distribution should **not change with $\\theta$**.\n2. The true value of $\\theta$ should **not lie on the boundary** of the parameter space.\n3. The model must be **identifiable**: two distinct parameter values imply two distinct probability models.\n4. The likelihood must be sufficiently **smooth and differentiable** in $\\theta$.",
      after: "**The counterexample to know.** For $X_1,\\ldots,X_n$ iid Uniform$(0,\\theta)$, the likelihood is $(1/\\theta)^n$ on $\\{X_{(n)}\\le\\theta\\}$, which is **decreasing** in $\\theta$ — so the MLE is $\\widehat\\theta=X_{(n)}=\\max\\{X_1,\\ldots,X_n\\}$. Its CDF is $(t/\\theta)^n$ and its density $n\\,t^{n-1}/\\theta^{n}$ on $(0,\\theta)$.\n\nThat density is **never normal**, at any sample size. The reason is **condition 1**: the support of the Uniform$(0,\\theta)$ depends on $\\theta$." },

    { kind: "math", title: "The multiparameter case: the Hessian",
      body: "The **Hessian** of a real-valued $f(t_1,\\ldots,t_p)$ is the $p\\times p$ matrix whose $(i,j)$ entry is",
      tex: ["\\frac{\\partial^2f}{\\partial t_i\\,\\partial t_j}"],
      after: "It is denoted $\\nabla^2$. Strictly it is not a matrix of *numbers* — its entries are themselves functions of $t_1,\\ldots,t_p$; evaluate it at a particular vector and you get real values. It is **positive definite** when evaluated at a local minimum.\n\nYou will **not** be asked to compute one by hand. You should know it is made of **second derivatives**, why that is the relevant information for estimating uncertainty, and that it can be approximated **numerically**." },

    { kind: "key", title: "Normality of the MLE — multiparameter",
      body: "Under regularity conditions, $\\widehat{\\boldsymbol\\theta}$ is approximately normal with mean the true value and variance\n\n$$V(\\widehat{\\boldsymbol\\theta})\\approx-\\Big(\\nabla^2\\ell(\\boldsymbol\\theta)\\big|_{\\boldsymbol\\theta=\\widehat{\\boldsymbol\\theta}}\\Big)^{-1}$$\n\n— the **inverse of the Hessian of the negative log-likelihood, evaluated at the MLE**.\n\nThe result is a **covariance matrix**, not just a list of variances. That is crucial, because in some cases there are significant **correlations between the estimators**.",
      after: "**Why the correlations matter.** Fitting a Gamma$(\\alpha,\\beta)$ gives $V(\\widehat\\alpha)\\approx0.081$, $V(\\widehat\\beta)\\approx0.034$ and $\\text{Cov}(\\widehat\\alpha,\\widehat\\beta)\\approx0.047$, so\n\n$$\\text{Corr}(\\widehat\\alpha,\\widehat\\beta)\\approx\\frac{0.047}{\\sqrt{0.081\\times0.034}}\\approx0.9.$$\n\nVery strong. Now consider $\\alpha=2.8,\\ \\beta=0.8$. Judging each parameter separately, both look perfectly plausible. But $\\E(X)=\\alpha/\\beta$, and the covariance shows that **this particular combination is highly unlikely** — the estimators move together along a line of roughly constant $\\alpha/\\beta$. Ignore the off-diagonal and you will believe nonsense." },

    { kind: "code", title: "Hessian and covariance in code", lang: "python", file: "hessian.py",
      body: "`numdifftools` approximates the Hessian numerically; `np.linalg.inv` inverts it.",
      code: `import numdifftools as nd
from scipy.stats import gamma

def gammamle(x):
    def neg_loglike_gamma(pars, x):
        return (-1)*sum(gamma.logpdf(x, pars[0], scale=1/pars[1]))

    mleout = minimize(neg_loglike_gamma, [1,1], args=(x), method="Nelder-Mead")

    Hess_gamma = nd.Hessian(neg_loglike_gamma)
    covout = np.linalg.inv(Hess_gamma(mleout.x, x))      # covariance at the MLE

    return mleout.x, covout`,
      after: "`nd.Hessian(f)` takes a multivariate function and returns **another function** — you then evaluate it at a parameter vector, supplying any other arguments the original function needs." },

    { kind: "plain", title: "Three further properties",
      body: "**1. Observed versus expected curvature.** We are using the curvature in the **observed** log-likelihood — a fixed data set. With simpler models it is sometimes possible to derive the **expected** curvature over random data sets; that is the **Fisher Information Matrix**, $\\mathbf{I}_n(\\theta)$.\n\n**2. Bias.** MLEs are **not necessarily unbiased**, but they are **asymptotically unbiased** — the bias converges to zero as the sample size increases.\n\n**3. The Cramér-Rao Lower Bound.** The lower bound on the variance of **any unbiased estimator** of $\\theta$ is $\\mathbf{I}_n(\\theta)^{-1}$. Combined with point 2, this assures us the MLE has (approximately) the **smallest possible MSE** — the primary reason for preferring maximum likelihood as a way of constructing estimators.",
      after: "Related: MLE is **asymptotically efficient** — as the sample grows, the variance of the MLE approaches the smallest possible variance for an unbiased estimator." },

    { kind: "key", title: "The invariance property",
      body: "Often we do not care about $\\boldsymbol\\theta$ itself but about some function $\\mathbf{g}(\\boldsymbol\\theta)$ — the mean $\\alpha/\\beta$, the variance $\\alpha/\\beta^2$, or the probability of an extreme **tail event** for risk management.\n\n**Invariance:** if $\\widehat{\\boldsymbol\\theta}$ is the MLE for $\\boldsymbol\\theta$, then $\\mathbf{g}(\\widehat{\\boldsymbol\\theta})$ is the MLE for $\\mathbf{g}(\\boldsymbol\\theta)$.\n\nAnother way to see it: reparameterize the model in terms of $\\mathbf{g}(\\boldsymbol\\theta)$ and maximize over the new parameters — you end up with the same fitted model.",
      after: "**Example.** For iid Exponential$(\\lambda)$, the MLE for $\\lambda$ is $1/\\bar X$. Then $\\pi=P(X_i>a)=e^{-\\lambda a}$, so by invariance the MLE for $\\pi$ is $e^{-\\widehat\\lambda a}=e^{-a/\\bar X}$.\n\n**Unbiasedness does NOT have this property.** $s^2=\\frac{1}{n-1}\\sum(x_i-\\bar x)^2$ is unbiased for $\\Var(X_i)$, but $\\E(s)\\ne\\sqrt{\\Var(X_i)}$ — $s$ is **not** an unbiased estimator of the standard deviation." },

    { kind: "key", title: "The Delta Method",
      body: "Invariance gives the **point estimate** of $g(\\theta)$. To get its **standard error** — and hence a confidence interval — you need the **Delta Method**.\n\n**One-dimensional.** If $Y_n$ is approximately $N(\\mu,\\sigma_n^2)$ with $\\sigma_n^2\\to0$ as $n$ increases, then $g(Y_n)$ is approximately\n\n$$N\\big(g(\\mu),\\ g'(\\mu)^2\\sigma_n^2\\big)$$\n\nassuming $g'(\\mu)$ exists and is not zero.\n\n**Multiparameter.** Suppose $\\widehat{\\boldsymbol\\theta}$ is approximately normal with variance $\\Sigma$ ($p\\times p$), and $\\mathbf{g}$ returns an $m$-dimensional vector, $m\\le p$. Let $\\mathbf{G}$ be the **Jacobian** of $\\mathbf{g}$ — the $m\\times p$ matrix whose $(i,j)$ entry is $\\partial g_i/\\partial t_j$. Then $\\mathbf{g}(\\widehat{\\boldsymbol\\theta})$ is approximately normal with variance\n\n$$\\mathbf{G}\\,\\Sigma\\,\\mathbf{G}^{T}$$\n\nassuming that matrix is of full rank.",
      after: "**The intuition.** Replace $g$ near $\\mu$ by its tangent line $h(x)=a+g'(\\mu)x$. Then $V\\big(h(Y_n)\\big)=g'(\\mu)^2V(Y_n)$, and as $n\\to\\infty$, $h(Y_n)$ and $g(Y_n)$ become approximately the same thing because $Y_n$ concentrates near $\\mu$.\n\nYou will not be asked to do the derivation. **You should know why it is relevant and what the ingredients are** — in the multiparameter setting that means knowing what the **Jacobian matrix** is, even if you never have to compute one." },

    { kind: "math", title: "Value at Risk and Conditional Value at Risk",
      body: "**VaR** quantifies the maximum expected loss over a time period at a given confidence level. At level $\\alpha$ it is the smallest $c$ with\n\n$$P(L>c)\\le\\alpha$$\n\nwhere $L$ models the distribution of **losses**. **CVaR**, also called **Expected Shortfall**, goes further and asks for the expected size of the losses that exceed that threshold:",
      tex: ["\\text{CVaR}_\\alpha=\\E\\big(L\\mid L>\\text{VaR}_\\alpha\\big)"],
      after: "**Why both exist.** Investors and companies need to understand their worst-case scenarios in order to manage risk. If you care about the extreme 5% of events, **VaR tells you the amount at risk in such an event** — it is the 95th percentile of the distribution of losses. **CVaR is more informative**: given that the extreme event occurs, what are the actual expected losses? VaR gives only a **lower bound** on the losses in that extreme event." },

    { kind: "math", title: "VaR and CVaR for normal losses",
      body: "Assume $L\\sim N(\\mu,\\sigma^2)$ and let $z_\\alpha$ be the point with $P(Z>z_\\alpha)=\\alpha$ for $Z\\sim N(0,1)$:",
      steps: [
        ["P\\left(\\frac{L-\\mu}{\\sigma}>\\frac{\\text{VaR}_\\alpha-\\mu}{\\sigma}\\right)=\\alpha", "standardize; the left side is standard normal"],
        ["\\text{VaR}_\\alpha=\\mu+z_\\alpha\\sigma", "true exactly when $(\\text{VaR}_\\alpha-\\mu)/\\sigma=z_\\alpha$"],
        ["\\E(L\\mid L>\\text{VaR}_\\alpha)=\\frac{1}{\\alpha}\\int_{z_\\alpha}^{\\infty}(v\\sigma+\\mu)\\,\\phi(v)\\,dv", "conditional expectation, substituting $v=(u-\\mu)/\\sigma$; the denominator $P(L>\\text{VaR}_\\alpha)$ is $\\alpha$"],
        ["=\\frac{1}{\\alpha}\\big[\\sigma\\phi(z_\\alpha)+\\mu\\alpha\\big]=g(\\mu,\\sigma^2)", "using $v\\phi(v)=-\\phi'(v)$, so $\\int_{z_\\alpha}^{\\infty}v\\phi(v)dv=\\phi(z_\\alpha)$"],
      ],
      after: "**The four-step recipe in code**, which is what you would be asked to read:\n\n1. Determine the MLE for $\\mu,\\sigma^2$.\n2. Find $V\\big((\\widehat\\mu,\\widehat\\sigma^2)\\big)$ using the **Hessian**.\n3. Find the **Jacobian** matrix for $g\\big((\\mu,\\sigma^2)\\big)$.\n4. Calculate the SE for $g\\big((\\widehat\\mu,\\widehat\\sigma^2)\\big)$ via the **Delta Method**, giving a 95% interval of estimate $\\pm\\,2\\,$SE since the MLE is approximately normal.\n\nIf losses are better modelled with heavier tails, the same recipe runs with the $t$-distribution in place of the normal." },

    { kind: "check",
      q: "The negative log-likelihood has a very sharp minimum. What does that say about the MLE?",
      choices: [
        "Its variance is small — the data pin the parameter down precisely",
        "Its variance is large, because a sharp minimum is numerically unstable",
        "It is unbiased, which a flat minimum would not guarantee",
        "Nothing, unless the sample size is also known",
      ],
      answer: 0,
      explain: "The variance of the MLE is the **inverse** of the second derivative of the negative log-likelihood at the minimum. Large curvature therefore means small variance: a sharp valley means the data strongly favour one parameter value, so there is less uncertainty. A broad, flat valley means many values fit nearly as well." },

    { kind: "check",
      q: "Why is the inverse Hessian a **covariance matrix** rather than just a collection of variances?",
      choices: [
        "Because it must be positive definite, and only covariance matrices are",
        "Because its off-diagonal entries give the covariances between parameter estimators, which can be substantial",
        "Because the parameters are themselves random variables with a joint prior",
        "Because the Hessian is symmetric, so its inverse must be too",
      ],
      answer: 1,
      explain: "The off-diagonal entries matter. In the Gamma example $\\text{Corr}(\\widehat\\alpha,\\widehat\\beta)\\approx0.9$, so the estimators move together. Judge each parameter alone and a combination like $\\alpha=2.8,\\beta=0.8$ looks plausible; account for the covariance and it is revealed as highly unlikely. Symmetry and positive definiteness are both true but neither is the reason the off-diagonals are informative." },

    { kind: "check",
      q: "If the MLE of a transformed parameter is just the transformation applied to the original MLE, why is the Delta Method needed at all?",
      choices: [
        "Because invariance only holds for linear transformations",
        "Because invariance gives the point estimate, while the Delta Method gives its standard error",
        "Because the transformed estimator is biased and the Delta Method removes the bias",
        "Because invariance fails when the transformation is not one-to-one",
      ],
      answer: 1,
      explain: "Plugging in gives you the **point estimate** $g(\\widehat\\theta)$ and nothing more. The Delta Method is what supplies the **standard error**, and hence the confidence interval, for that transformed estimate — via $g'(\\mu)^2\\sigma_n^2$ in one dimension, or $\\mathbf{G}\\Sigma\\mathbf{G}^T$ with the Jacobian in the multiparameter case." },

    { kind: "check",
      q: "What does CVaR tell you that VaR does not?",
      choices: [
        "The probability that the extreme event occurs at all",
        "The expected size of the losses given that the VaR threshold is exceeded",
        "The maximum loss that is possible under the model",
        "The confidence level at which the risk estimate is valid",
      ],
      answer: 1,
      explain: "VaR is the threshold — the 95th percentile of losses for $\\alpha=0.05$ — so it gives only a **lower bound** on the losses in the extreme event. CVaR is the conditional expectation $\\E(L\\mid L>\\text{VaR}_\\alpha)$: given that the extreme event occurs, what are the actual expected losses? That is why it is described as the more informative of the two." },
  ],
},

/* ==================================================================== f17 */
{
  id: "f17",
  part: "Part 10",
  title: "Model Selection",
  minutes: 22,
  summary: "Heavy-tailed alternatives to the normal — GED, nonstandard t, skewed t — overfitting and nested models, and AIC as a penalized likelihood.",
  blocks: [
    { kind: "plain", title: "Comparing models, not just fitting one",
      body: "So far, maximum likelihood has estimated parameters **after a model has been assumed**. The natural extension is to compare different candidate models. **As long as the data being fit remains exactly the same, likelihood values can be compared.**\n\nBut if we only seek to maximize the likelihood over candidate models, we will be led to **overfitting**: a model with more complexity — more parameters, more flexibility — will **necessarily** fit the data better.",
      after: "So model selection needs a likelihood **plus a penalty**. That is AIC, at the end of this module." },

    { kind: "idea", title: "Why the normal fails for log returns",
      body: "The running example is Procter & Gamble daily log returns, 2015-2025. A normal probability plot and a KDE on a log density axis both show the problem immediately: the empirical density sits far above the fitted normal in **both** tails.\n\n**The mechanism.** The normal distribution's tails decay **exponentially**, which makes extreme events virtually \"impossible\" under it. Real markets experience extreme events — crashes — far more often than that. Heavier-tailed distributions assign higher probabilities to these extreme observations.\n\nThe $t$-distribution's tails decay at a slower **polynomial** rate, which matches empirical market crashes much better.",
      after: "This matters beyond aesthetics: the tail behaviour of the pricing model is exactly what risk management depends on." },

    { kind: "math", title: "The Generalized Error Distribution (GED)",
      body: "Also called the **generalized normal distribution**. $X$ has the GED with mean $\\mu$, scale $\\alpha$ and shape $\\beta$ if",
      tex: ["f_X(x)=\\frac{\\beta}{2\\alpha\\Gamma(1/\\beta)}\\exp\\left[-\\left(\\frac{|x-\\mu|}{\\alpha}\\right)^{\\beta}\\right],\\quad -\\infty<x<\\infty,\\ \\beta>0,\\ \\alpha>0"],
      after: "**The shape parameter is the whole story.**\n\n• $\\beta=2$ gives the **normal**$(\\mu,\\alpha^2/2)$.\n• $\\beta=1$ gives the **double exponential**, or **Laplace**, distribution — heavier tails.\n• $\\beta<2$ gives heavy tails, useful for financial returns.\n• $\\beta>2$ gives tails **lighter** than the normal.\n\nThe distributions are **symmetric** around $\\mu$. In Python: `scipy.stats.gennorm`.\n\nThe main thing to recognize is that **there is a parameter that controls how heavy the tails are**, and that the GED includes the normal — and even lighter-tailed distributions — as special cases." },

    { kind: "math", title: "The nonstandard $t$-distribution",
      body: "Let $T$ have the standard $t$-distribution with $\\nu$ degrees of freedom, and define",
      tex: ["X=\\mu+\\sigma T,\\qquad \\sigma>0"],
      after: "This has the **shape** of the $t$-distribution but mean $\\mu$ and scale $\\sigma$. In Python: `scipy.stats.t`.\n\nIts variance follows directly: $V(X)=V(\\mu+\\sigma T)=\\sigma^2V(T)=\\sigma^2\\cdot\\dfrac{\\nu}{\\nu-2}$, provided $\\nu\\ge3$." },

    { kind: "math", title: "The skewed $t$-distribution",
      body: "Jones and Faddy (2003) introduced a **skewed** generalization of the $t$, allowing asymmetry. The skew is captured by a pair of positive parameters $a$ and $b$:\n\n• $a<b$ → the distribution is **negatively skewed**\n• $a>b$ → **positively skewed**\n• $a=b$ → equivalent to the **nonstandard $t$ with $2a$ degrees of freedom**\n\nIn Python: `scipy.stats.jf_skew_t`.",
      after: "**How is it fitted?** Exactly like any other distribution: write out the likelihood function, take its log, and numerically find where it is maximized. There is nothing special about the skew parameters.\n\n**The summary to memorize:** the **GED** and the **$t$** both model **symmetric** heavy tails; the GED additionally includes the normal and lighter-tailed distributions as special cases. The **skewed $t$** models heavy tails **and** asymmetry." },

    { kind: "code", title: "Fitting all four, and why likelihood alone is not enough", lang: "python", file: "fits.py",
      body: "`.fit()` returns the MLE. The returns are scaled by 100 first, since the raw values are small enough to create numerical problems.",
      code: `ldrPGscl = ldrPG * 100          # scale before fitting

normalfit = norm.fit(ldrPGscl)       # .fit() returns the MLE
GEDfit    = gennorm.fit(ldrPGscl)
tfit      = t.fit(ldrPGscl)
skewTfit  = jf_skew_t.fit(ldrPGscl)

print(f"Normal:   {sum(norm.logpdf(ldrPGscl, *normalfit)):6.2f}")   # -4346.11
print(f"GED:      {sum(gennorm.logpdf(ldrPGscl, *GEDfit)):6.2f}")   # -4023.61
print(f"Nonstd T: {sum(t.logpdf(ldrPGscl, *tfit)):6.2f}")           # -3982.99
print(f"Skewed T: {sum(jf_skew_t.logpdf(ldrPGscl, *skewTfit)):6.2f}") # -3980.38`,
      after: "**Should these four models be ranked using their likelihoods?** No. They are of **varying complexity**, and simply maximizing the likelihood leads to **overfitting**." },

    { kind: "key", title: "Nested models and overfitting",
      body: "Model 1 is **nested** in Model 2 if Model 1 is a **special case** of Model 2. In that situation the likelihood maximized under Model 2 is **necessarily greater than or equal to** the likelihood maximized under Model 1 — the bigger model can always just reproduce the smaller one.\n\nIn our example: the **Normal is nested in the GED** (take $\\beta=2$), and the **nonstandard $t$ is nested in the skewed $t$** (take $a=b$).\n\n**But increased likelihood may not be a sign of a better-fitting model.** It is possible we are simply **overfitting** to the available sample.\n\nOur objective is to fit well to the **population**, not just to the observed sample. The sample may contain **artifacts** which look like real features but would disappear with a larger sample size.",
      after: "**The illustration.** Draw $n=50$ from Uniform$(0,1)$. The histogram will not be flat, just from natural variability. Fitting a Beta$(\\alpha,\\beta)$ to chase those bumps would be a mistake — the bumps are artifacts, not features." },

    { kind: "key", title: "AIC",
      body: "Models with more parameters have greater flexibility to fit features — but also **artifacts** — in observed data, so the risk of overfitting increases greatly with complexity.\n\nThe widely-used tool is the **Akaike Information Criterion**:\n\n$$\\text{AIC}=-2\\log L(\\theta)+2p$$\n\nwhere $p$ is the **number of parameters** in the model. The $2p$ is a **penalty** on the likelihood for the complexity of the model. **We seek the model with the smallest AIC.**",
      after: "**Two conditions, easy to confuse:**\n\n• AIC **requires** the vector of data being fit to remain **the same** across the models compared.\n• AIC does **not** require the models to be **nested**.\n\nThe $2p$ is not arbitrary. It is derived from information theory (Kullback-Leibler divergence) to correct for the expected overfitting bias that occurs when estimating $p$ parameters on the same data." },

    { kind: "code", title: "AIC picks the skewed t", lang: "python", file: "aic.py",
      body: "Same four fits, now penalized. Normal has 2 parameters, GED 3, nonstandard $t$ 3, skewed $t$ 4.",
      code: `print(f"Normal:   {-2*sum(norm.logpdf(ldrPGscl,*normalfit))+4:6.2f}")    # 8696.23
print(f"GED:      {-2*sum(gennorm.logpdf(ldrPGscl,*GEDfit))+6:6.2f}")     # 8053.23
print(f"Nonstd T: {-2*sum(t.logpdf(ldrPGscl,*tfit))+6:6.2f}")             # 7971.98
print(f"Skewed T: {-2*sum(jf_skew_t.logpdf(ldrPGscl,*skewTfit))+8:6.2f}") # 7968.76`,
      after: "Among these four, the **skewed $t$ is the best choice** — it wins on AIC even after paying for its extra parameter.\n\nExtending to a grid over GARCH$(p,q)$ with $X_t=\\mu+\\sigma_t\\epsilon_t$ and $\\epsilon_t$ drawn from normal / GED / $t$ / skewed $t$, the preferred model by AIC is **$p=1$, $q=1$, skewed $t$** at AIC 7737.47. Re-fitting that same model with `mean=\"zero\"` gives 7739.25 — **larger**, so including the mean $\\mu$ **is** worthwhile." },

    { kind: "trap", title: "AIC versus BIC, and when AIC is not the last word",
      body: "**BIC** is a relative of AIC with a **stronger penalty** for extra parameters.\n\n• **AIC** is generally preferred when your goal is **prediction** — it penalizes complexity less.\n• **BIC** is preferred when you are trying to identify the **\"true\" underlying model** — the stronger penalty guards harder against overfitting.\n\nIt can be surprising that these goals lead to different models, but they do: finding the true model and getting the best predictions are not the same objective.",
      after: "**Is the smaller AIC always the better choice?** If you are using AIC to do model selection, then yes, smaller is better. But if the AIC is only **slightly** larger for a significantly **simpler** model, the professor would lean toward the simpler one — while noting this is subjective and hard to put into any sort of rule.\n\nAlso worth knowing: **AIC can favour a simpler model even when a complex one better captures extreme market events**, if those events are so rare that the improvement in overall log-likelihood does not outweigh the penalty for the extra parameters.\n\nAnd: **the choice of time period matters a great deal.** Including a crisis period (2008, 2020) will necessitate a heavy-tailed distribution, whereas a quiet market might look more normal." },

    { kind: "check",
      q: "Why can't four candidate distributions simply be ranked by their maximized log-likelihoods?",
      choices: [
        "Because likelihoods from different distributions are on different scales",
        "Because more complex models necessarily fit the sample better, so ranking by likelihood rewards overfitting",
        "Because the likelihood is only defined up to a constant",
        "Because only nested models can be compared at all",
      ],
      answer: 1,
      explain: "A model with more parameters has more flexibility and will fit the observed sample at least as well — strictly so when nested. Ranking by raw likelihood therefore always picks the most complex candidate, chasing **artifacts** in the sample rather than features of the population. AIC fixes this by subtracting a penalty $2p$. Non-nested models *can* be compared by AIC; what must stay fixed is the data." },

    { kind: "check",
      q: "In the GED, what role does the shape parameter $\\beta$ play?",
      choices: [
        "It controls how heavy the tails are, with $\\beta=2$ giving the normal",
        "It controls the skew, with $\\beta<1$ giving negative skew",
        "It is the degrees of freedom, so larger $\\beta$ means heavier tails",
        "It rescales the distribution so that it integrates to one",
      ],
      answer: 0,
      explain: "$\\beta$ is the tail-weight dial. $\\beta=2$ recovers the normal, $\\beta=1$ gives the double exponential (Laplace), $\\beta<2$ gives heavy tails useful for returns and $\\beta>2$ gives tails lighter than the normal. The GED is **symmetric** around $\\mu$ at every $\\beta$, so it cannot produce skew — that is what the skewed $t$ is for." },

    { kind: "check",
      q: "Which pair of conditions does AIC impose when comparing candidate models?",
      choices: [
        "The models must be nested, and must have the same number of parameters",
        "The data must be the same, and the models must be nested",
        "The data must be the same; the models need not be nested",
        "Neither the data nor the models need match, since the penalty corrects for both",
      ],
      answer: 2,
      explain: "AIC **requires the vector of data being fit to remain the same** — otherwise the likelihoods are not comparable at all — but it **does not require the models to be nested**. That is what lets it rank the GED against the $t$, which are not special cases of one another." },
  ],
},

/* ==================================================================== f18 */
{
  id: "f18",
  part: "Part 11",
  title: "The Double Exponential Jump Diffusion Model",
  minutes: 20,
  summary: "Why jumps up and down deserve separate treatment, combining Poisson processes, Pareto and Beta jumps on the price scale, and what the DEJD buys you.",
  blocks: [
    { kind: "plain", title: "Where the DEJD comes from",
      body: "This Part explores a second jump diffusion model: the **double exponential jump diffusion (DEJD)** model, described in **Kou (2002)** (*Management Science* 48), presented here through a paper by **Ramezani and Zeng (2007)** (*Annals of Finance* 3).\n\nInstead of using the **normal** distribution to model jump sizes — as the Merton model does — the DEJD uses **exponential** distributions. And it makes a distinction between **\"up jumps\"** and **\"down jumps\"**, each with its own parameter for its corresponding exponential distribution.",
      after: "**Why model the jump sizes separately?** The **leverage effect**: reactions to negative news tend to be more extreme than reactions to positive news. A single symmetric jump distribution cannot express that.\n\nIf the up and down rates happen to be equal, $\\lambda_d=\\lambda_u$, the two-sided exponential is the **double exponential (Laplace)** distribution — which is where the model gets its name." },

    { kind: "key", title: "The key limitation of the Merton model",
      body: "Stated plainly in the notes, and the cleanest way to motivate the DEJD:\n\n**There is a single Poisson process describing the occurrence of jumps, and the jump size distribution (on the log scale) is symmetric around zero.**\n\nSo Merton can produce heavy tails, but not **asymmetric** ones. It cannot say that crashes are both more frequent and larger than rallies.",
      after: "Note also that Ramezani and Zeng's formulation of the Merton model allows the **mean of the jumps to be nonzero** (via a parameter $\\alpha$), which is a slight generalization of how it was presented in Part 7." },

    { kind: "math", title: "Two Poisson processes combine into one",
      body: "This result is what makes the two formulations of the DEJD equivalent. Suppose events of Type I occur with rate $\\lambda_1$ and Type II with rate $\\lambda_2$, independently. Let $T$ be the time to the next event of **either** type, and $T_1,T_2$ the times to the next of each type:",
      steps: [
        ["T=\\min(T_1,T_2)", "the next event of either type is whichever comes first"],
        ["P(T\\le t)=1-P\\big(\\min(T_1,T_2)>t\\big)=1-P(T_1>t\\ \\text{and}\\ T_2>t)", "the minimum exceeds $t$ exactly when both do"],
        ["=1-P(T_1>t)P(T_2>t)=1-e^{-\\lambda_1t}e^{-\\lambda_2t}", "independence, then the exponential survival function"],
        ["=1-e^{-(\\lambda_1+\\lambda_2)t},\\quad t>0", "which is the CDF of an Exponential$(\\lambda_1+\\lambda_2)$"],
      ],
      after: "So $T\\sim\\text{Exponential}(\\lambda_1+\\lambda_2)$, and **the combined process is also a Poisson process, with rate $\\lambda_1+\\lambda_2$.**" },

    { kind: "idea", title: "Kou versus Ramezani-Zeng — equivalent formulations",
      body: "**Kou's model** has a **single** Poisson process for the occurrence of jumps, and when a jump occurs it is an **up jump with probability $p$**.\n\n**Ramezani and Zeng** use **two independent Poisson processes** for the up jumps and the down jumps.\n\nAs just proved, the combined process remains a Poisson process — so **these two modeling approaches are equivalent.**\n\nThe real difference between the authors is in the **distribution assumed for the jump sizes**:\n\n• **Kou** assumes that **on the log scale**, the size of a jump has an **exponential** distribution. Jumps up have mean size $1/\\eta_1$; jumps down have mean size $1/\\eta_2$.\n• **Ramezani and Zeng** work **on the original price scale**, and assume jumps up are drawn from a **Pareto** distribution, while down jumps are drawn from a **Beta** distribution. These jumps **multiply** the current price, hence are **additive on the log scale**.",
      after: "The Pareto/Beta version is distinguished as the **PBJD model**, though it turns out to be equivalent to the DEJD in some cases." },

    { kind: "key", title: "Why Pareto up and Beta down — and not the other way round",
      body: "This is a favourite short question, and the reasoning is purely about **support**.\n\nBoth models construct **multiplicative factors** to represent the jumps, so the question is what multiplying by the random variable does to the price.\n\n• The **Pareto** distribution has support starting at **1**, i.e. all of its values are larger than 1. So when you multiply the current price by a Pareto random variable, its value **increases** — an up jump.\n• The **Beta** distribution takes values between **0 and 1**. So when you multiply by it, the price **decreases** — a down jump.\n\nPrices cannot go negative, so multiplying by a Beta random variable is a sensible model for the down jumps.",
      after: "The Pareto pdf is also, separately, often used to model **tail behaviour**.\n\nOne further connection: the **log of a Pareto$(\\eta_u)$ random variable** (whose support starts at 1) is **Exponential$(\\eta_u)$**, and the **log of a Beta$(\\eta_d,1)$ random variable** is **Exponential$(\\eta_d)$**. That is precisely why the price-scale Pareto/Beta formulation and the log-scale exponential formulation are the same model." },

    { kind: "math", title: "The two parameter sets and how they match up",
      body: "**DEJD** parameters: $(\\mu,\\ \\sigma,\\ \\lambda,\\ p,\\ \\eta_u,\\ \\eta_d)$ — where $\\mu,\\sigma$ are the **diffusion**, $\\lambda$ the **rate of jumps**, $p$ the **probability of an up jump**, and $\\eta_u,\\eta_d$ define the distributions for up and down jumps.\n\n**PBJD** parameters: $(\\mu,\\ \\sigma,\\ \\lambda_u,\\ \\lambda_d,\\ \\eta_u,\\ \\eta_d)$ — with $\\lambda_u$ the rate of up jumps, $\\lambda_d$ the rate of down jumps, $\\eta_u$ defining the Pareto and $\\eta_d$ the Beta.\n\nThe translation between them:",
      tex: ["\\lambda=\\lambda_u+\\lambda_d\\qquad\\text{and}\\qquad p=\\frac{\\lambda_u}{\\lambda_u+\\lambda_d}"],
      after: "Both lines follow from the combination result: the overall jump rate is the sum, and the chance that a given jump is an up jump is the up rate's share of the total." },

    { kind: "math", title: "The log returns under the model",
      body: "You are **not** expected to derive this — the professor is explicit that it is not about doing derivations — but you **must know the resulting equation and its components**. For the $s$-period log return:",
      tex: ["r(s)=\\left(\\mu-\\tfrac{1}{2}\\sigma^2\\right)s+\\sigma Z(s)+U+D"],
      after: "**The four pieces:**\n\n• $\\left(\\mu-\\tfrac{1}{2}\\sigma^2\\right)s$ — the **drift** over $s$ periods;\n• $\\sigma Z(s)$ — the **diffusion**, with $Z(t)$ a standard Brownian motion;\n• $U$ — the total contribution of the **up jumps**;\n• $D$ — the total contribution of the **down jumps**.\n\n**All of these components are independent.** That independence is what makes the likelihood tractable." },

    { kind: "math", title: "How the density of a one-period return is assembled",
      body: "Let $N_u$ and $N_d$ be the numbers of up and down jumps in the period:",
      steps: [
        ["f(r)=\\sum_{m=0}^{\\infty}\\sum_{n=0}^{\\infty}f\\big(r\\mid N_u=m,N_d=n\\big)\\,P(N_u=m,N_d=n)", "law of total probability, conditioning on how many of each kind of jump occurred"],
        ["=\\sum_{m=0}^{\\infty}\\sum_{n=0}^{\\infty}f_{m,n}(r)\\,P(N_u=m)\\,P(N_d=n)", "$N_u$ and $N_d$ are independent, so the joint probability factors"],
        ["P(N_u=m)=\\frac{e^{-\\lambda_uT}(\\lambda_uT)^m}{m!},\\qquad P(N_d=n)=\\frac{e^{-\\lambda_dT}(\\lambda_dT)^n}{n!}", "both from the Poisson pmf"],
      ],
      after: "**How are the two processes parameterized and maximized?** The likelihood is derived and **includes all of the parameters** describing the normal diffusion together with the two Poisson jump distributions. The optimizer maximizes this **joint likelihood over all parameters simultaneously**. There is no need to separate out different components — and in fact, **at no point are up and down jumps ever identified in the data.**\n\nWith a likelihood this complicated there are real numerical challenges; taking **bounds** on the parameters into consideration helps, as does choosing **starting values** wisely." },

    { kind: "plain", title: "Exotic and path-dependent options",
      body: "The headline claim for the DEJD is that it **leads to tractable pricing formulas for exotic and path dependent options**. Worth knowing what those are.\n\n**Exotic option** has no fixed definition, but refers to options that are not the basic **vanilla** calls and puts. For example:\n\n1. **Options on options** — a call option giving you the right to purchase a call option at a certain price.\n2. **Barrier options** — cancelled if the price of the underlying reaches a certain level.\n3. **Asian options** — the payoff is calculated from the **average** of the underlying's price over some time period.\n\nA **path dependent option** is one whose payoff depends on the **entire history** of the underlying asset's price over the time the option is held.",
      after: "Barrier and Asian options are the two standard path-dependent examples: both depend on the **price trajectory**, not just the final price. The DEJD captures the realistic jump trajectory needed to price these accurately.\n\nAlso from this passage: a **leptokurtic** distribution is one whose kurtosis is larger than 3 (positive **excess** kurtosis), so it has heavier tails than the normal." },

    { kind: "trap", title: "Jump models versus simply using a heavy-tailed distribution",
      body: "Both a heavy-tailed distribution and a jump diffusion model can explain unusually large returns. What does a **jump model** give you that fitting a heavy-tailed distribution to the returns does not?\n\n**A jump-diffusion model describes how the price changes over time** — it covers the fact that tomorrow's price is probably close to today's.\n\n**Fitting a heavy-tailed distribution to log daily returns is a statement about the marginal distribution only**, and does not capture anything about the **day-to-day dependence**.\n\nBoth have a role to play, depending on the goals of the particular analysis.",
      after: "Related framing from the Q&A: **Brownian motion captures the continuous, symmetric day-to-day volatility; Poisson jumps are added to capture rare, large shocks.** The heavy tails come from including those jumps in the distribution — they generate the extreme values. The **skew** comes from allowing the rates of up and down jumps to vary, and from allowing the sizes of up and down jumps to have different distributions." },

    { kind: "key", title: "What the paper concludes",
      body: "• **Table 3** shows the additional complexity of the DEJD is typically **warranted**, with the result being a better fit to the data.\n• **Table 4** gives parameter estimates with standard errors; **bolded** estimates are those for which a level-0.05 test of the parameter being zero is **rejected** — commonly said as the parameter being **\"significant.\"**\n• The professor's caution: **the importance of significance is greatly exaggerated.** Often a lack of significance is due to insufficient sample size, or simply too much noise.\n• **The authors express concerns over the fit**, consistent with what was seen fitting the Merton model in Part 7: the **rate of jumps seems too large, while the jump sizes are too small**. They suggest this might be alleviated by reconsidering the jump distribution.\n\nMaximum likelihood is preferred throughout because of its properties, including that it is **asymptotically efficient** — as the sample size grows, the variance of the MLE approaches the smallest possible variance of an unbiased estimator." },

    { kind: "check",
      q: "Why does the DEJD split jumps into two independent Poisson processes rather than using one?",
      choices: [
        "Because a single Poisson process cannot produce heavy tails",
        "Because it allows different rates and different size distributions for up and down jumps",
        "Because two processes are required for the combined process to remain Poisson",
        "Because the Merton model's jumps are not independent of the diffusion",
      ],
      answer: 1,
      explain: "A separate process for the up and down jumps lets the model specify a **different rate** for the two types and a **different distribution for their sizes**. We often observe more extreme down jumps than up jumps — the leverage effect — and incorporating this can be important for matching real price behaviour. Merton's single symmetric jump distribution produces heavy tails perfectly well; what it cannot produce is **asymmetry**." },

    { kind: "check",
      q: "In the Ramezani-Zeng formulation, why are up jumps Pareto and down jumps Beta?",
      choices: [
        "Because the Pareto has heavier tails, and up moves are larger than down moves",
        "Because the Beta is bounded, which keeps the likelihood numerically stable",
        "Because the Pareto's support starts at 1 so multiplying raises the price, while the Beta lies in $(0,1)$ so multiplying lowers it",
        "Because the log of a Pareto is normal and the log of a Beta is lognormal",
      ],
      answer: 2,
      explain: "It is entirely about **support**. These jumps **multiply** the current price. The Pareto takes values above 1, so multiplying increases the price — an up jump. The Beta takes values in $(0,1)$, so multiplying decreases it — a down jump, and one that can never push the price negative. (For the record, the log of a Pareto is **Exponential**, not normal — which is exactly why this price-scale formulation matches Kou's log-scale one.)" },

    { kind: "check",
      q: "Two independent Poisson processes have rates $\\lambda_1$ and $\\lambda_2$. What is the combined process?",
      choices: [
        "A Poisson process with rate $\\lambda_1+\\lambda_2$",
        "A Poisson process with rate $\\lambda_1\\lambda_2$",
        "Not a Poisson process, since the superposition destroys independence",
        "A Gamma process with shape 2",
      ],
      answer: 0,
      explain: "Let $T=\\min(T_1,T_2)$ be the wait to the next event of either type. Then $P(T>t)=P(T_1>t)P(T_2>t)=e^{-\\lambda_1t}e^{-\\lambda_2t}=e^{-(\\lambda_1+\\lambda_2)t}$, so $T\\sim$ Exponential$(\\lambda_1+\\lambda_2)$ and the combined process is Poisson with the rates **added**. This is exactly what makes Kou's single-process formulation and Ramezani-Zeng's two-process formulation equivalent, with $\\lambda=\\lambda_u+\\lambda_d$ and $p=\\lambda_u/(\\lambda_u+\\lambda_d)$." },
  ],
},
];
