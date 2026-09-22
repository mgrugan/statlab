/* StatLab — Statistical Methods in Finance: learning modules
 *
 * Built from Lectures 1-7 (Parts 1-5) of Schafer, "Statistical Methods in
 * Finance" (2026). Block kinds:
 *   idea     — plain-English intuition (what it MEANS)
 *   math     — formal statement / derivation (tex: display equations)
 *   code     — Python you should be able to reproduce from memory
 *   trap     — exam trap / common confusion
 *   key      — takeaway worth memorizing
 *   check    — inline self-check MCQ
 * Prose supports $tex$, **bold**, `code`, *italic*.
 */

export const FINANCE_MODULES = [

/* ===================================================================== */
{
  id: "f1",
  part: "Part 1",
  title: "Assets, Options, and the Payoff Function",
  minutes: 12,
  summary: "What we are pricing and why it forces us into probability. Payoffs, Jensen's inequality, and the data pitfalls of yfinance.",
  blocks: [
    { kind: "plain", title: "Start here: what are we even doing?",
      body: "Someone offers to sell you a contract. The contract says: *in six months, you may buy one share of Google for $165 \u2014 but only if you want to.*\n\nHow much is that contract worth today?\n\nThat is the whole question this course answers. It is hard because the payoff depends on a price six months from now that nobody knows. Our answer will be: **describe that unknown price with a probability model, then average the payoff over all the ways it could turn out.** Everything in Parts 1-5 is either building that model, or checking whether it is honest." },

    { kind: "idea", title: "The cast of characters",
      body: "Let $P_t$ be the price of an asset at time $t$. Three kinds matter for this course:\n\n• **Equity** (= stock) — a share of ownership in a company.\n• **Bonds** — sold by institutions to raise money; promise periodic interest payments (*coupons*) plus repayment of the loan at the *maturity date*.\n• **Derivatives** — contracts whose value is *derived* from another asset. The option is our running example." },

    { kind: "idea", title: "Calls, puts, European, American",
      body: "A **call option** gives the holder the *right but not the obligation* to **buy** a share at a set **strike price** $K$ on or before the **expiration date**. A **put option** is the same but the right to **sell**.\n\nA **European** option can be exercised *only at expiration*. An **American** option can be exercised at any time up to expiration. European options are easier to analyze mathematically, and they are what Black-Scholes prices." },

    { kind: "math", title: "The payoff function",
      body: "Suppose you hold a European call with strike $K$ expiring at time $T$. At expiration you compare $P_T$ to $K$:\n\n• If $P_T > K$: exercise, buy at $K$, sell at $P_T$, pocket $P_T - K$.\n• If $P_T \\le K$: the option is worthless — you simply don't exercise.\n\nSo the payoff is the **positive part**:",
      tex: ["(P_T-K)^+ \\quad\\text{where}\\quad Y^+=\\begin{cases} Y, & Y>0\\\\ 0, & \\text{otherwise.}\\end{cases}"],
      diagram: "payoff",
      after: "Ignoring the risk-free rate for now, you should not pay more than the *expected* payoff $\\E\\big((P_T-K)^+\\big)$." },

    { kind: "idea", title: "Two ways to get at $P_T$ — and why we pick the second",
      body: "You don't know $P_T$. There are two approaches:\n\n1. **Predict** $P_T$ from financial information about the company, the economy, politics. (This is fundamental analysis — not this course.)\n2. **Put forth a probability model** for $P_T$ that realistically reflects how stock prices behave, then compute $\\E\\big((P_T-K)^+\\big)$.\n\nThis course takes route 2. That single choice is why a *statistics* course can price a derivative at all." },

    { kind: "trap", title: "You cannot swap the expectation and the positive part",
      body: "A tempting shortcut is to predict $\\E(P_T)$ and plug it in. That is **wrong**:",
      tex: ["\\E\\big((P_T-K)^+\\big) \\;\\ne\\; \\big(\\E(P_T)-K\\big)^+"],
      diagram: "jensen",
      after: "In fact $g(x) = x^+$ is a **convex** function, so by **Jensen's inequality**\n\n$$\\E\\big((P_T-K)^+\\big) \\;\\ge\\; \\big(\\E(P_T)-K\\big)^+.$$\n\nIntuition: the option truncates your losses at zero but leaves your gains unbounded. That asymmetry has value, and it is exactly the value a point prediction throws away. A model for $P_T$ will have unspecified parameters, which must be *calibrated* using other considerations." },

    { kind: "code", title: "Getting price data",
      lang: "python", file: "prices.py",
      body: "The `yfinance` package is the course's data source.",
      code: `import yfinance as yf

NVDAdat = yf.Ticker("NVDA")
NVDAprices = NVDAdat.history(start="2024-01-01", end="2025-06-30")

# other fields live on the Ticker object, e.g.
NVDAdat.dividends`,
      after: "Explore what's available with `dir(NVDAdat)`." },

    { kind: "trap", title: "Three data pitfalls the exam likes",
      body: "1. **Survivorship bias** — the available collection of ticker symbols *excludes companies that went out of business*. Any backtest built only on survivors is optimistically biased.\n2. **Open ≠ previous close** — the reported price is the price of the *most recent transaction*. News between the close and the open, plus after-hours trading, move the price.\n3. **Splits and dividends** — a *stock split* exchanges one share for several (NVDA split 10-for-1 on 2024-06-10), which increases *liquidity* and makes the stock look affordable; a *reverse split* goes the other way. **Dividends** are per-share payments to shareholders. Historical prices must be **adjusted** for both. The `history` method's `auto_adjust` argument does this, and it defaults to `True`." },

    { kind: "check",
      q: "You price a call by computing $\\big(\\E(P_T)-K\\big)^+$ instead of $\\E\\big((P_T-K)^+\\big)$. What have you done?",
      choices: [
        "Under-valued the option, because $x^+$ is convex and Jensen's inequality runs the other way",
        "Over-valued the option, because the expectation of a maximum always exceeds the maximum of expectations",
        "Nothing — the two are equal whenever $P_T$ is lognormal",
        "Made an error that vanishes as $T \\to \\infty$",
      ],
      answer: 0,
      explain: "Jensen gives $\\E(g(X)) \\ge g(\\E(X))$ for convex $g$. Since $g(x)=x^+$ is convex, the correct price $\\E((P_T-K)^+)$ is at least $(\\E(P_T)-K)^+$, so the shortcut under-values the option. It discards the value of the payoff's asymmetry." },
  ],
},

/* ===================================================================== */
{
  id: "f2",
  part: "Part 1",
  title: "The Lognormal Distribution and the Pricing Claim",
  minutes: 18,
  summary: "The distribution behind the model, and the full derivation of the expected-payoff formula that becomes Black-Scholes.",
  blocks: [
    { kind: "plain", title: "What is a lognormal distribution?",
      body: "You already know the **normal** distribution \u2014 the symmetric bell curve.\n\nA **lognormal** distribution is what you get when you take a bell curve and **exponentiate it**. Start with a normal random variable $Y$, then look at $X=e^{Y}$. That $X$ is lognormal.\n\nThree consequences, and they are the only three you need:\n\n\u2022 **It is never negative.** $e^{\\text{anything}}$ is positive, so $X>0$ always. Good \u2014 prices can't be negative.\n\u2022 **It is lopsided (right-skewed).** Most values bunch near the low end with a long tail stretching right. Good \u2014 a stock can triple but can only fall to zero.\n\u2022 **Its logarithm is normal.** So if you ever get stuck, take logs and you are back in familiar bell-curve territory.\n\nThat last point is why the phrase \"$X$ is lognormal\" is *defined* as \"$\\log X$ is normal.\" The name is literal: **log-normal** = the thing whose log is normal." },

    { kind: "math", title: "Definition",
      body: "$X$ has the **lognormal$(\\mu,\\sigma^2)$** distribution if $\\log(X)$ is Normal$(\\mu,\\sigma^2)$. Note carefully: $\\mu$ and $\\sigma^2$ are the mean and variance **of the log**, not of $X$.",
      tex: ["\\E(\\log X)=\\mu, \\qquad \\Var(\\log X)=\\sigma^2"],
      after: "The moments of $X$ itself are:\n\n$$\\E(X)=\\exp\\!\\big(\\mu+\\sigma^2/2\\big), \\qquad \\Var(X)=\\big(e^{\\sigma^2}-1\\big)e^{2\\mu+\\sigma^2}.$$" },

    { kind: "decode", title: "Why the mean carries a $+\\sigma^2/2$",
      body: "This tiny term causes more confusion than anything else in the course, so it is worth pinning down before it reappears inside Black-Scholes.",
      formula: "\\underbrace{\\E(X)}_{\\text{mean price}}=\\exp\\Big(\\underbrace{\\mu}_{\\text{median}}+\\underbrace{\\sigma^2/2}_{\\text{skew premium}}\\Big)",
      parts: [
        ["e^{\\mu}", "the median",
         "Half the time $\\log X$ lands below $\\mu$, half above. Exponentiating preserves order, so half the time $X$ lands below $e^{\\mu}$. That makes $e^{\\mu}$ the **middle** outcome — the one you'd bet on."],
        ["e^{\\sigma^2/2}", "the skew premium",
         "The **average** sits above the middle. Going up by one log-unit multiplies the price by $e\\approx2.72$; going down by one divides by $2.72$. The gain is bigger in dollars than the loss, so averaging over both tilts the mean upward. The more uncertain you are (bigger $\\sigma$), the bigger the tilt."],
        ["\\sigma \\to 0", "the sanity check",
         "With no uncertainty the premium vanishes and $\\E(X)=e^{\\mu}$: mean and median coincide, exactly as they do for a constant."],
      ],
      reading: "“On average the price is the typical price, multiplied by a bonus that grows with uncertainty.”\n\nThat bonus is not free money — it is an artifact of measuring gains multiplicatively. It is the same convexity that makes Jensen's inequality bite, and it is why a stock with **zero expected log return** still has a **positive expected return**." },

    { kind: "proof", title: "Proof of the lognormal mean",
      body: "Worth doing once: it is the same completing-the-square move that drives the whole Black-Scholes derivation, in miniature.",
      claim: "X\\sim\\text{lognormal}(\\mu,\\sigma^2)\\ \\Longrightarrow\\ \\E(X)=e^{\\mu+\\sigma^2/2}",
      setup: "Write $Y=\\log X\\sim N(\\mu,\\sigma^2)$, so $X=e^Y$ and $\\E(X)=\\E(e^Y)$ — the moment generating function of a normal, evaluated at $1$.",
      steps: [
        ["\\E(e^{Y})=\\int_{-\\infty}^{\\infty}e^{y}\\,\\frac{1}{\\sqrt{2\\pi}\\,\\sigma}\\exp\\!\\left(-\\frac{(y-\\mu)^2}{2\\sigma^2}\\right)dy", "LOTUS"],
        ["=\\int_{-\\infty}^{\\infty}\\frac{1}{\\sqrt{2\\pi}\\,\\sigma}\\exp\\!\\left(\\frac{2\\sigma^2y-(y-\\mu)^2}{2\\sigma^2}\\right)dy", "pull $e^{y}$ into the exponent"],
        ["2\\sigma^2y-(y-\\mu)^2=-\\big(y-(\\mu+\\sigma^2)\\big)^2+2\\mu\\sigma^2+\\sigma^4", "complete the square in $y$"],
        ["=e^{\\mu+\\sigma^2/2}\\int_{-\\infty}^{\\infty}\\frac{1}{\\sqrt{2\\pi}\\,\\sigma}\\exp\\!\\left(-\\frac{\\big(y-(\\mu+\\sigma^2)\\big)^2}{2\\sigma^2}\\right)dy", "the leftover constant is $e^{(2\\mu\\sigma^2+\\sigma^4)/(2\\sigma^2)}$"],
        ["=e^{\\mu+\\sigma^2/2}\\cdot 1=e^{\\mu+\\sigma^2/2}\\qquad\\blacksquare", "the integral is an $N(\\mu+\\sigma^2,\\sigma^2)$ density, so it is $1$"],
      ],
      after: "**The step that matters.** Multiplying a normal density by $e^{y}$ does not break it — it *slides its mean up by $\\sigma^2$* and leaves a constant $e^{\\mu+\\sigma^2/2}$ outside. Remember that one sentence and both this proof and the Black-Scholes proof become the same proof." },

    { kind: "idea", title: "Why lognormal is the natural price model",
      body: "Three reasons, all worth being able to say out loud:\n\n• **Prices can't go negative.** $e^{\\text{anything}} > 0$, so a lognormal price never goes below zero, while a normal price would.\n• **Returns are multiplicative.** Prices compound: a 10% gain then a 10% loss isn't flat. Working on the log scale turns multiplication into addition, which is where all our normal-theory tools live.\n• **It is right-skewed.** A stock can 10× but can only lose 100%. The lognormal has exactly that asymmetry — as $\\sigma$ grows the density's peak slides left while the right tail stretches out." },

    { kind: "plain", title: "What is $\\Phi$?",
      body: "The formula on the next card is full of $\\Phi(\\cdot)$. It is not as scary as it looks.\n\n$\\Phi$ is the **standard normal CDF** \u2014 the running total of area under the standard bell curve. $\\Phi(z)$ = the probability that a standard normal lands **below** $z$.\n\nSo $\\Phi(0)=0.5$ (half the bell is left of center), $\\Phi(2)\\approx0.977$, $\\Phi(-2)\\approx0.023$. It always returns a number between 0 and 1, because it is a probability.\n\nWhenever you see $\\Phi(\\text{something})$ in an option formula, read it as **\"the probability that things end up on the good side of this threshold.\"** In Python it is `scipy.stats.norm.cdf`." },

    { kind: "math", title: "The Claim (the engine of Black-Scholes)",
      body: "Suppose $\\log(P_t)$ has the Normal$(\\xi,\\tau^2)$ distribution, and $K>0$. Then",
      tex: ["\\E\\big((P_t-K)^+\\big)=\\exp\\!\\big(\\xi+\\tau^2/2\\big)\\,\\Phi\\!\\left(\\frac{\\xi+\\tau^2-\\log K}{\\tau}\\right)-K\\,\\Phi\\!\\left(\\frac{\\xi-\\log K}{\\tau}\\right)"],
      after: "where $\\Phi$ is the **standard normal CDF**. Both $\\Phi$ terms are probabilities; the first factor $\\exp(\\xi+\\tau^2/2)$ is exactly $\\E(P_t)$ from the lognormal mean formula." },

    { kind: "decode", title: "What the Claim is actually saying",
      body: "Before the proof, get the *shape* of the answer. The formula is a **difference of two terms**, and each one is something you already understand.",
      formula: "\\E\\big((P_t-K)^+\\big)=\\underbrace{\\E(P_t)\\,\\Phi(d_1)}_{\\text{what you receive}}-\\underbrace{K\\,\\Phi(d_2)}_{\\text{what you pay}},\\quad d_1=\\frac{\\xi+\\tau^2-\\log K}{\\tau},\\ \\ d_2=\\frac{\\xi-\\log K}{\\tau}",
      parts: [
        ["\\Phi(d_2)", "the probability you exercise",
         "$d_2$ is just $\\log K$ standardized against the distribution of $\\log P_t$: it counts how many standard deviations the strike sits below the expected log price. So $\\Phi(d_2)=P(P_t>K)$ — **the chance the option finishes in the money.** If it is $0.30$, you exercise 30% of the time."],
        ["K\\,\\Phi(d_2)", "the expected cost",
         "You hand over $K$, but only in the worlds where you exercise. Average cost $=$ strike $\\times$ probability of paying it. This term is *exactly* as complicated as it looks and no more."],
        ["\\Phi(d_1)", "the same probability, price-weighted",
         "$d_1=d_2+\\tau$. The shift by one full standard deviation is the $+\\sigma^2/2$ effect again: when you weight each outcome by *how much the stock is worth there*, the high outcomes count for more, so the effective probability rises. $\\Phi(d_1)>\\Phi(d_2)$ always."],
        ["\\E(P_t)\\,\\Phi(d_1)", "the expected receipt",
         "You get the stock, but only in the worlds where you exercise — and those are the **expensive** worlds. So it is not $\\E(P_t)\\times P(\\text{exercise})$; it is the average price *conditional on ending above $K$*, times that probability. $\\Phi(d_1)$ does both jobs at once."],
        ["\\tau=\\sigma\\sqrt{t}", "total uncertainty",
         "Everything enters through this one number. Double the volatility or quadruple the time and the formula cannot tell the difference — it only ever sees how far the price might wander before expiry."],
      ],
      reading: "“The option is worth **what you expect to collect, minus what you expect to pay** — where both are averaged only over the futures in which you actually exercise.”\n\nThat one sentence is the entire formula. Everything else is bookkeeping to make “only over the futures in which you exercise” precise, and $\\Phi$ is how that bookkeeping is written down.\n\n**The check that proves you understand it:** as $K\\to0$ the option becomes the stock itself; both $\\Phi$ terms $\\to1$ and the value $\\to\\E(P_t)-0$. As $K\\to\\infty$ both $\\to0$ and the option is worthless. The formula passes." },

    { kind: "plain", title: "Two tools used in the proof",
      body: "The derivation coming up uses two standard moves. Know what each *does* and the proof reads easily.\n\n**LOTUS** (Law of the Unconscious Statistician) says: to average a function of a random variable, you don't need the distribution of the function \u2014 just integrate the function against the density you already have.\n\n$$\\E(g(X))=\\int g(x)\\,f_X(x)\\,dx$$\n\n**Completing the square** is the high-school algebra trick of rewriting $y^2+by$ as $(y+b/2)^2-b^2/4$. In this proof it gets used on the exponent of a normal density. The payoff: after rearranging, the exponent *looks like a normal density again* \u2014 just with a shifted mean. That shift is where the mysterious extra $+\\tau^2$ in the formula comes from.\n\nYou will almost certainly not be asked to reproduce every line. You should be able to say what each step accomplishes." },

    { kind: "math", title: "Proof, step by step",
      body: "Write $Y=\\log(P_t)$, so $Y\\sim N(\\xi,\\tau^2)$ and $P_t=e^Y$.",
      steps: [
        ["\\E\\big((P_t-K)^+\\big)=\\E\\big((e^Y-K)^+\\big)", "rewrite in terms of $Y$"],
        ["=\\int_{-\\infty}^{\\infty}(e^y-K)^+f_Y(y)\\,dy", "Law of the Unconscious Statistician"],
        ["=\\int_{\\log K}^{\\infty}(e^y-K)f_Y(y)\\,dy", "the integrand is $0$ when $y<\\log K$, since then $e^y<K$"],
        ["=\\int_{\\log K}^{\\infty}e^yf_Y(y)\\,dy-K\\,P\\big(Y>\\log K\\big)", "split the integral"],
        ["=\\int_{\\log K}^{\\infty}e^yf_Y(y)\\,dy-K\\,\\Phi\\!\\left(\\frac{\\xi-\\log K}{\\tau}\\right)", "standardize, then use $\\Phi(x)=1-\\Phi(-x)$"],
      ],
      after: "The second term is done. The remaining integral is handled by **completing the square** in the exponent — the one algebra step worth rehearsing:" },

    { kind: "math", title: "Completing the square",
      body: "Plug in the normal density and collect the $e^y$ into the exponent:",
      steps: [
        ["\\int_{\\log K}^{\\infty}\\frac{e^y}{\\sqrt{2\\pi}\\,\\tau}\\exp\\!\\left(-\\frac{(y-\\xi)^2}{2\\tau^2}\\right)dy", "start"],
        ["=\\int_{\\log K}^{\\infty}\\frac{1}{\\sqrt{2\\pi}\\,\\tau}\\exp\\!\\left(-\\frac{y^2-2\\xi y+\\xi^2-2\\tau^2y}{2\\tau^2}\\right)dy", "absorb $e^y$ (add $-2\\tau^2y$ to the numerator)"],
        ["=\\int_{\\log K}^{\\infty}\\frac{1}{\\sqrt{2\\pi}\\,\\tau}\\exp\\!\\left(-\\frac{y^2-2y(\\xi+\\tau^2)+\\xi^2}{2\\tau^2}\\right)dy", "group the $y$ terms: the mean has shifted to $\\xi+\\tau^2$"],
        ["=\\exp\\!\\left(\\frac{(\\xi+\\tau^2)^2-\\xi^2}{2\\tau^2}\\right)P\\big(X>\\log K\\big),\\; X\\sim N(\\xi+\\tau^2,\\tau^2)", "complete the square, pull the constant out"],
        ["=\\exp\\!\\left(\\xi+\\frac{\\tau^2}{2}\\right)\\Phi\\!\\left(\\frac{\\xi+\\tau^2-\\log K}{\\tau}\\right)", "simplify the constant and standardize"],
      ],
      after: "Substituting both pieces gives the Claim. $\\blacksquare$" },

    { kind: "key", title: "What to remember about this proof",
      body: "You are unlikely to be asked to reproduce all the algebra under time pressure, but you should be able to say **what each step does**:\n\n• LOTUS turns an expectation of a function into an integral against the density.\n• The lower limit becomes $\\log K$ because the payoff is zero below the strike — that's where the *positive part* does its work.\n• Completing the square shifts the normal mean from $\\xi$ to $\\xi+\\tau^2$, which is precisely why the first $\\Phi$ argument carries the extra $+\\tau^2$.\n• The two $\\Phi$ terms differ by exactly that $\\tau^2$." },

    { kind: "idea", title: "Where this lands",
      body: "This calculation is the basis of the classic **Black-Scholes (Black-Scholes-Merton) formula** for pricing European options; Merton and Scholes won a Nobel Prize for it. The theory makes several simplifying assumptions about the market, but the one this course interrogates is the assumption that the price follows a **geometric Brownian motion** — which is what Module 3 builds, and Modules 5-10 tear apart." },

    { kind: "check",
      q: "$X$ is lognormal$(\\mu,\\sigma^2)$ with $\\mu=0,\\ \\sigma^2=2$. What is $\\E(X)$?",
      choices: ["$0$", "$1$", "$e$", "$e^2$"],
      answer: 2,
      explain: "$\\E(X)=\\exp(\\mu+\\sigma^2/2)=\\exp(0+1)=e\\approx 2.718$. The trap is answering $1$ by confusing $\\E(X)$ with $e^{\\mu}$ — that's the *median*, not the mean. The gap between them is the lognormal's skew." },
  ],
},

/* ===================================================================== */
{
  id: "f3",
  part: "Part 1",
  title: "Brownian Motion and Geometric Brownian Motion",
  minutes: 20,
  summary: "The stochastic process underneath the price model: standard BM, drift and scaling, then GBM and its six properties.",
  blocks: [
    { kind: "plain", title: "What is a stochastic process?",
      body: "A **random variable** is one uncertain number \u2014 say tomorrow's closing price.\n\nA **stochastic process** is a whole *collection* of random variables, one for each point in time. Instead of one uncertain number you have an uncertain **path**: the price today, tomorrow, the day after, and so on.\n\nTwo words that will keep coming up:\n\n\u2022 A **realization** (or **path**) is one complete run of the process \u2014 one squiggly line. When you plot a simulated Brownian motion you are looking at *one* draw, not the process itself.\n\u2022 **\"Almost surely\"** just means *with probability 1*. Treat it as \"always, for our purposes.\"\n\nThis module builds the specific process used to model stock prices, in three steps: standard Brownian motion \u2192 add drift and scale \u2192 exponentiate it." },

    { kind: "idea", title: "Stochastic process vocabulary",
      body: "A **stochastic process** is a random process indexed by something — usually time. Write $\\{W(t): t\\ge 0\\}$: the set $\\{t \\ge 0\\}$ is the **index space**.\n\n• For **$t$ fixed**, $W(t)$ is a *random variable*.\n• The whole collection $\\{W(t): t\\ge 0\\}$ is an entire **path**, also called a **realization** — one single draw from the sample space. When you plot a simulated Brownian motion you are looking at *one* realization, not the process.\n• **\"Almost surely\"** means *with probability 1*." },

    { kind: "math", title: "Standard Brownian motion (Wiener process)",
      body: "$\\{W(t):t\\ge0\\}$ is a **standard Brownian motion** if:",
      list: [
        "$W(0)=0$ (almost surely). — *It starts at the origin.*",
        "$W(t)$ is continuous as a function of $t$ (almost surely). — *No jumps: the path can be drawn without lifting your pen.*",
        "$W(t_4)-W(t_3)$ and $W(t_2)-W(t_1)$ are independent for $t_1\\le t_2\\le t_3\\le t_4$. — ***Independent increments***.",
        "The distribution of $W(t_2)-W(t_1)$ depends only on $|t_1-t_2|$. — ***Stationary increments***: only elapsed time matters, not when you started.",
        "$W(t)$ is Normal$(0,t)$ for all $t$. — *Variance grows linearly in time; the process spreads out like $\\sqrt{t}$.*",
      ] },

    { kind: "trap", title: "Independent increments ≠ independent values",
      body: "Property 3 is about **changes**, not levels. $W(t_1)$ and $W(t_2)$ are definitely **dependent** — if the process is at $+3$ at time 1, it is likely near $+3$ shortly after. What is independent is the *increment* over disjoint time intervals. This distinction is a favorite exam target." },

    { kind: "code", title: "Simulating a standard Brownian motion",
      lang: "python", file: "bm.py",
      body: "The key idea: increments over a step $dt$ are independent Normal$(0, dt)$, so simulate increments and **cumulatively sum** them.",
      code: `# Set the parameters
T = 2.0          # Total time
N = 1000         # Number of time steps
dt = T / N       # Time step size

# Generate Brownian increments   (note: sqrt(dt) is the SD, not dt)
dW = np.random.normal(0, np.sqrt(dt), N)

# Generate Brownian path
W = np.cumsum(dW)

# Time vector
t = np.linspace(0, T, N)

plt.plot(t, W)
plt.title('Standard Brownian Motion')
plt.xlabel('Time'); plt.ylabel('W(t)')
plt.show()`,
      after: "**Reproduce-from-memory checklist:** `np.random.normal(0, np.sqrt(dt), N)` → `np.cumsum` → `np.linspace` for the time axis. The single most common slip is passing `dt` instead of `np.sqrt(dt)` as the scale." },

    { kind: "math", title: "Brownian motion with drift and scaling",
      body: "$\\{B(t)\\}$ is a **Brownian motion with drift $\\nu$ and scaling $\\sigma^2$** if $\\{W(t)\\}$ is a standard BM and",
      tex: ["B(t)=\\nu t+\\sigma W(t)"],
      after: "Properties 1-4 carry over unchanged; property 5 becomes\n\n$$B(t)\\sim\\text{Normal}\\big(\\nu t,\\;\\sigma^2 t\\big).$$\n\nSo $\\nu$ tilts the path and $\\sigma$ stretches it." },

    { kind: "math", title: "Geometric Brownian motion",
      body: "$\\{S(t):t\\ge0\\}$ is a **geometric Brownian motion** if $\\{B(t)\\}$ is a BM with drift $\\nu$ and scaling $\\sigma^2$, and",
      tex: ["S(t)=S(0)\\,e^{B(t)},\\qquad S(0)>0, \\qquad \\mu \\equiv \\nu+\\sigma^2/2"],
      after: "This implies all six properties below — this is the list to memorize." },

    { kind: "key", title: "The six GBM properties",
      body: "",
      list: [
        "$S(t)$ is continuous in $t$ (almost surely).",
        "$S(t_4)/S(t_3)$ and $S(t_2)/S(t_1)$ are independent for $t_1\\le t_2\\le t_3\\le t_4$. — *Increments become **ratios** on the price scale.*",
        "The distribution of $S(t_2)/S(t_1)$ depends only on $|t_1-t_2|$.",
        "$S(t)$ is **lognormal**$\\big(\\log S(0)+\\nu t,\\ \\sigma^2 t\\big)$ for all $t$.",
        "$S(t)$ has expected value $S(0)e^{\\mu t}$.",
        "$\\log\\big(S(t_2)/S(t_1)\\big)$ is **Normal**$\\big(\\nu(t_2-t_1),\\ \\sigma^2(t_2-t_1)\\big)$ for $t_1\\le t_2$.",
      ] },

    { kind: "math", title: "Why property 6 works — the log turns ratios into differences",
      body: "This one-line computation is worth being able to do cold:",
      steps: [
        ["\\log\\!\\left(\\frac{S(t_2)}{S(t_1)}\\right)=\\log S(t_2)-\\log S(t_1)", "log of a quotient"],
        ["=\\log\\big(S(0)e^{B(t_2)}\\big)-\\log\\big(S(0)e^{B(t_1)}\\big)", "substitute the GBM definition"],
        ["=B(t_2)-B(t_1)", "the $\\log S(0)$ terms cancel"],
        ["\\sim N\\big(\\nu(t_2-t_1),\\ \\sigma^2(t_2-t_1)\\big)", "BM increments are normal"],
      ],
      after: "So **log ratios of prices are just Brownian increments** — the entire reason log returns are the natural object of study." },

    { kind: "math", title: "Drift on the price scale vs. the log scale",
      body: "In this notation, $\\mu$ is the drift on the **price** scale while $\\nu$ is the drift on the **log price** scale. Derive the link from the lognormal mean:",
      steps: [
        ["S(t)\\ \\text{is lognormal}\\big(\\log S(0)+\\nu t,\\ \\sigma^2 t\\big)", "property 4"],
        ["\\E(S(t))=\\exp\\!\\big(\\log S(0)+\\nu t+\\sigma^2t/2\\big)", "lognormal mean $\\exp(\\mu+\\sigma^2/2)$"],
        ["=S(0)\\exp\\!\\big((\\nu+\\sigma^2/2)t\\big)=S(0)e^{\\mu t}", "collect; this defines $\\mu=\\nu+\\sigma^2/2$"],
      ],
      after: "So: if $\\mu=0$ the price does not drift; $\\mu>0$ drifts up; $\\mu<0$ drifts down. Note $\\mu>\\nu$ always (when $\\sigma>0$) — a consequence of the same convexity that drove Jensen's inequality in Module 1." },

    { kind: "decode", title: "What geometric Brownian motion is claiming about the world",
      body: "Strip the notation away and GBM is three assertions about how prices move. Each one is a modelling choice you can argue with — and the second half of the course does.",
      formula: "S(t)=S(0)\\,\\exp\\big(\\underbrace{\\nu t}_{\\text{trend}}+\\underbrace{\\sigma W(t)}_{\\text{noise}}\\big)",
      parts: [
        ["S(0)\\times\\cdots", "prices move by **multiplication**",
         "Everything is a factor applied to the starting price, never an amount added to it. That is why a \\$10 move matters more for a \\$20 stock than a \\$2000 one, and why the model can never produce a negative price: you cannot multiply your way below zero."],
        ["\\exp(\\cdot)", "the randomness lives in the **exponent**",
         "Growth is compounded continuously, so the natural place for the noise is on the log scale. Take logs and this whole equation collapses to $\\log S(t)=\\log S(0)+\\nu t+\\sigma W(t)$ — a straight line plus noise. **Every GBM question becomes easy the moment you take logs.**"],
        ["\\nu t", "the trend is a straight line on the log scale",
         "Constant expected log growth per unit time. Not per dollar, per *proportion* — $\\nu=0.08$ means about 8% a year regardless of the price level."],
        ["\\sigma W(t)", "shocks are independent and never forgotten",
         "$W(t)$ accumulates independent increments, so today's shock is unrelated to yesterday's, but it is **permanently** baked into the level. Prices wander; they do not return to where they came from. Contrast this with the mean-reverting AR(1) of Module 7."],
        ["\\Var\\big(\\sigma W(t)\\big)=\\sigma^2t", "uncertainty grows like $\\sqrt{t}$",
         "Variance grows linearly in time, so *standard deviation* grows as $\\sqrt{t}$. Looking four times further ahead makes you only twice as unsure. This one fact drives volatility annualization, the $\\sigma\\sqrt{t}$ in Black-Scholes, and the classic exam trap of multiplying by $t$."],
      ],
      reading: "“The log of the price is a straight line with noise piled on top, and the noise accumulates forever.”\n\nThat is the entire model. The six properties are consequences of that sentence, not extra assumptions — which is why you can reconstruct them under exam pressure instead of memorizing them.\n\n**The one distinction worth over-learning:** $\\nu$ is the drift you see *on the log scale*, $\\mu=\\nu+\\sigma^2/2$ is the drift you see *in the price*. They are different numbers, and the gap is pure volatility. A stock with zero log drift still rises on average." },

    { kind: "check",
      q: "$\\{S(t)\\}$ is a geometric Brownian motion. What are the distributions of $S(10)$ and of $\\log\\big(S(10)/S(5)\\big)$?",
      choices: [
        "Lognormal and lognormal",
        "Lognormal and normal",
        "Normal and lognormal",
        "Normal and normal",
      ],
      answer: 1,
      explain: "Property 4: $S(t)$ itself is **lognormal**. Property 6: the **log** of a ratio of prices is a Brownian increment, hence **normal**. Keeping straight which scale you're on — price or log price — is the single most reliable source of exam points in Part 1." },
  ],
},

/* ===================================================================== */
{
  id: "f4",
  part: "Part 1",
  title: "Log Returns and Simple Returns",
  minutes: 12,
  summary: "The two definitions of return, why logs win, the k-period result, and the central limit argument (plus the reason it fails).",
  blocks: [
    { kind: "plain", title: "What is a return, and why take logs?",
      body: "A **return** is just the percent change in price. If a stock goes from \\$100 to \\$105, the **simple return** is 5%.\n\nA **log return** is the log of the price ratio: $\\log(105/100)=0.0488$, so about 4.88%. Nearly the same number.\n\nSo why bother with logs? **Because log returns add up and simple returns don't.**\n\nGo from \\$100 \u2192 \\$110 \u2192 \\$99. The simple returns are +10% and \u221210%, which look like they cancel \u2014 but you ended at \\$99, down 1%. The log returns are +0.0953 and \u22120.1054, and those *do* sum to \u22120.0101, the true log return for the whole stretch.\n\nThat additivity is the entire reason finance runs on logs. It also means a multi-day return is a **sum** of daily returns, which is exactly the setup where normal-distribution theory works." },

    { kind: "math", title: "The two definitions",
      body: "The **one-period log return**:",
      tex: ["r_t=\\log\\!\\left(\\frac{P_t}{P_{t-1}}\\right)=\\log(P_t)-\\log(P_{t-1})"],
      after: "The **one-period simple return**:\n\n$$R_t=\\frac{P_t-P_{t-1}}{P_{t-1}}=\\frac{P_t}{P_{t-1}}-1.$$\n\nThey are linked by\n\n$$r_t=\\log(1+R_t)\\approx R_t,$$\n\nsince $\\log(1+x)\\approx x$ for $x$ near $0$. For daily equity data $R_t$ is usually a fraction of a percent, so the two are numerically almost identical — but only the log version has the clean additive theory." },

    { kind: "math", title: "The $k$-period log return telescopes",
      body: "",
      tex: ["r_t(k)=\\log\\!\\left(\\frac{P_t}{P_{t-k}}\\right)=\\sum_{i=0}^{k-1}\\big(\\log(P_{t-i})-\\log(P_{t-i-1})\\big)=r_t+r_{t-1}+\\cdots+r_{t-k+1}"],
      after: "**The $k$-period log return is the sum of the $k$ one-period log returns.** Simple returns do *not* add like this — they compound multiplicatively, i.e. $1+R_t(k)=\\prod(1+R_{t-i})$. This additivity is the whole reason finance defaults to logs." },

    { kind: "math", title: "Distribution of the $k$-period log return under GBM",
      body: "Under the lognormal pricing model, $\\log P_t\\sim N(\\nu t,\\sigma^2t)$ (taking $\\log P_0 = 0$ for simplicity), and the $k$-period log return is a Brownian increment, so it is **normal**:",
      tex: ["r_t(k)\\sim\\text{Normal}\\big(\\nu k,\\ \\sigma^2 k\\big)"],
      after: "Both the mean and variance scale **linearly in $k$**, so the standard deviation scales as $\\sigma\\sqrt{k}$. That square-root-of-time scaling comes back in Module 9 when we annualize volatility." },

    { kind: "decode", title: "Why volatility scales with $\\sqrt{k}$ and not $k$",
      body: "This is the single most examined consequence of the model, and the error — multiplying by $k$ — is the single most common one. The reason is one line of algebra with a very physical meaning.",
      formula: "\\Var\\Big(\\textstyle\\sum_{i=1}^{k}r_i\\Big)=\\sum_{i=1}^{k}\\Var(r_i)=k\\sigma^2 \\;\\Longrightarrow\\; \\text{SD}=\\sigma\\sqrt{k}",
      parts: [
        ["\\Var(\\sum)=\\sum\\Var", "**variances** add, standard deviations do not",
         "This step needs independence — which GBM grants. Variance is the quantity with the additive algebra; SD is a square root, and square roots do not distribute over sums. Everything else follows."],
        ["k\\sigma^2\\to\\sigma\\sqrt{k}", "the square root is just undoing the square",
         "You added $k$ copies of a *squared* quantity, so pulling back to the original units costs you a square root. There is no finance in this step at all — it is a units conversion."],
        ["\\text{shocks partly cancel}", "the physical reading",
         "Over $k$ days some shocks are up and some are down, and they partially offset. If every day moved the same direction you *would* get $k\\sigma$ — that is what perfectly correlated returns would look like. The gap between $\\sigma k$ and $\\sigma\\sqrt{k}$ **is** the benefit of independence."],
        ["0.02\\sqrt{252}\\approx0.317", "the number you will actually be asked for",
         "A 2% daily SD annualizes to about **32%**, not 504%. Whenever an annualized volatility comes out above 100%, you multiplied by $k$."],
      ],
      reading: "“Uncertainty grows, but it grows lazily — four times the horizon buys only twice the uncertainty.”\n\nThe mean is the opposite: it scales with $k$, in full. So over a long horizon **the trend outruns the noise**, at a rate of $\\nu k$ versus $\\sigma\\sqrt k$. That single comparison is the entire mathematical case for long-horizon investing, and it is visible right here in the two parameters of $N(\\nu k,\\sigma^2k)$." },

    { kind: "idea", title: "The central limit argument for normality",
      body: "Here's an appealing argument for why returns *should* be normal. Fix an interval of time — say an hour — and divide it into $n$ equal subintervals. If the one-period log returns are **iid** with finite mean and variance, then because the $n$-period log return is their **sum**, the **central limit theorem** says that for large $n$ it is approximately **normal**.\n\nThis is a genuinely good argument, and it explains an empirical fact you'll be asked about: **log monthly returns are closer to normal than log daily returns**, because a monthly return is the sum of ~21 daily ones." },

    { kind: "trap", title: "...and why the argument breaks down",
      body: "The problem with this setup: **log returns on short enough time scales are not iid.**\n\n• They are not *identically distributed* — volatility changes over time (Part 4: volatility clustering).\n• They are not *independent* — squared returns are autocorrelated, even when returns themselves are nearly uncorrelated.\n\nSo the CLT's hypotheses fail exactly where we most want to apply them. This tension — a beautiful model that the data reject — is the plot of the entire course. Parts 2-4 are the prosecution's case." },

    { kind: "code", title: "Computing log daily returns",
      lang: "python", file: "returns.py",
      body: "This three-line idiom appears in nearly every lecture and every exam figure:",
      code: `import numpy as np
import yfinance as yf

EQdat = yf.Ticker("AMGN").history(start="2015-01-01", end="2026-08-01")
ldrEQ = np.log(EQdat['Close']).diff().dropna()`,
      after: "Read it right-to-left: take `Close`, take logs, **difference** consecutive values (that's exactly $\\log P_t-\\log P_{t-1}$), then drop the leading `NaN` that differencing creates. Writing `np.log(...).diff()` rather than `.pct_change()` is what makes these *log* returns." },

    { kind: "check",
      q: "Which statement about $r_t(k)$, the $k$-period log return, is correct?",
      choices: [
        "$r_t(k)=\\sum_{i=0}^{k-1}r_{t-i}$",
        "$r_t(k)=\\prod_{i=0}^{k-1}r_{t-i}$",
        "$r_t(k)=\\frac1k\\sum_{i=0}^{k-1}r_{t-i}$",
        "No relationship holds without further assumptions",
      ],
      answer: 0,
      explain: "Logs turn the telescoping product $P_t/P_{t-k}$ into a **sum** of one-period log returns — no distributional assumptions needed, it's pure algebra. (Simple returns are the ones that multiply, and even then it's $1+R$ that multiplies, not $R$.)" },
  ],
},

/* ===================================================================== */
{
  id: "f5",
  part: "Part 2",
  title: "Kernel Density Estimation",
  minutes: 18,
  summary: "Nonparametric density estimation, the bandwidth, and the bias-variance tradeoff — the tool used to convict the normality assumption.",
  blocks: [
    { kind: "plain", title: "What is a density, and what does \"nonparametric\" mean?",
      body: "A **density** is the curve whose *area* gives probability. The bell curve is a density: the area under it between 90 and 110 is the probability of landing in that range. The curve's height alone isn't a probability \u2014 the area is.\n\nNow, two ways to estimate a density from data:\n\n\u2022 **Parametric** \u2014 you *assume* a shape (\"it's a bell curve\") and just estimate the handful of numbers that pin it down (the mean and SD). Simple, but if the shape is wrong, everything downstream is wrong.\n\u2022 **Nonparametric** \u2014 you assume *no* shape and let the data draw the curve. More honest, needs more data.\n\nThis module builds the standard nonparametric method, the **kernel density estimator**. We need it because we want to *check* whether the bell-curve assumption is true \u2014 and you can't check an assumption using a method that already assumes it." },

    { kind: "idea", title: "Parametric vs. nonparametric",
      body: "Most model-fitting you've seen is **parametric**: assume a form (normal, exponential), estimate its parameters (often by maximum likelihood). For continuous data, that is *parametric density estimation*.\n\n**Nonparametric density estimation** estimates the distribution **without assuming a parametric form** — a \"smoothing\" of the observed data that lets the data define the shape.\n\nA **histogram** is the simplest nonparametric density estimator. But it has real limitations: the **arbitrariness of the binning** (where do bin edges go?) and its **discontinuous, jagged** nature, when the underlying density is usually assumed smooth. Smooth estimators also have statistical efficiency advantages." },

    { kind: "math", title: "The kernel density estimator",
      body: "Put a smooth **kernel function** at each observed data point and add them up:",
      tex: ["\\widehat{f}_h(x)=\\frac{1}{nh}\\sum_{i=1}^{n}K\\!\\left(\\frac{x-x_i}{h}\\right)"],
      after: "Reading the pieces:\n\n• $x$ — the value at which the density is being estimated.\n• $x_i$ — the observed data, $i=1,\\dots,n$.\n• $K(\\cdot)$ — the **kernel function**, itself a density: smooth, peaked at zero, symmetric about zero.\n• $h$ — the **bandwidth** (or smoothing parameter). It rescales the kernel.\n• $1/(nh)$ — the normalizing constant that makes $\\widehat f_h$ integrate to 1." },

    { kind: "key", title: "Kernel choice barely matters; bandwidth matters enormously",
      body: "`KDEpy` offers nine kernels — *gaussian, exponential, box, tri, epa (Epanechnikov), biweight, triweight, tricube, cosine*. **The choice of kernel is not too important**: any smooth kernel does an adequate job.\n\n**The bandwidth $h$ is influential:**\n• **Larger $h$** → a **smoother** estimate.\n• **Smaller $h$** → a **rough, \"wiggly\"** estimate.\n\nThe classroom example: with data $\\{1.5, 4, 5\\}$, $h=2$ smears everything into one broad hump; $h=0.5$ resolves the gap between 1.5 and the pair; $h=0.1$ degenerates into three spikes — you're just seeing the data points back again." },

    { kind: "math", title: "Bias-variance tradeoff",
      body: "When constructing an estimator $\\widehat\\theta$ of $\\theta$, we want to minimize the **mean squared error**:",
      tex: ["\\text{MSE}(\\widehat\\theta)=\\E\\big[(\\widehat\\theta-\\theta)^2\\big]=\\text{bias}^2(\\widehat\\theta)+\\Var(\\widehat\\theta)"],
      after: "where $\\text{bias}(\\widehat\\theta)=\\E(\\widehat\\theta)-\\theta$ (an **unbiased** estimator has $\\E(\\widehat\\theta)=\\theta$).\n\n• **Bias** quantifies **accuracy** — on average, how close is it to the truth?\n• **Variance** quantifies **precision** — how repeatable are the estimates?\n• The MSE combines the two." },

    { kind: "decode", title: "The bandwidth $h$, read as a dial",
      body: "The KDE formula has one knob that matters. Here is what turning it actually does \u2014 and why the answer is not \u201Cturn it down for a better estimate\u201D.",
      formula: "\\widehat{f}_h(x)=\\frac{1}{nh}\\sum_{i=1}^{n}K\\!\\left(\\frac{x-x_i}{h}\\right)",
      parts: [
        ["K\\!\\left(\\frac{x-x_i}{h}\\right)", "one little bump per data point",
         "Every observation $x_i$ contributes a small hill centred on itself. The estimate at $x$ is the total height of all the hills above that spot. That is the whole idea \u2014 a histogram where the bars are smooth and can overlap."],
        ["h\\ \\text{in the denominator}", "how wide each bump is",
         "$h$ is a **distance on the $x$ axis**, in the units of your data. Small $h$ \u2192 narrow spikes that only notice nearby points. Large $h$ \u2192 broad hills that blend distant points together. This is the smoothing dial."],
        ["\\tfrac{1}{nh}", "the bookkeeping that keeps it a density",
         "Wider bumps are also shorter, so the total area stays $1$. No intuition needed here \u2014 it is there so the thing you draw is a probability density and not just a shape."],
        ["h\\ \\text{too small}", "low bias, high variance",
         "Each bump is so narrow that the curve traces individual data points. You faithfully reproduce **this sample** \u2014 including the accidents in it. Re-draw the sample and the picture changes completely."],
        ["h\\ \\text{too large}", "low variance, high bias",
         "Everything blurs into one broad mound. Stable across samples \u2014 and stably **wrong**: real features like a second peak or a fat tail get smoothed out of existence."],
        ["K(\\cdot)\\ \\text{itself}", "barely matters",
         "Gaussian, Epanechnikov, triangular \u2014 the choice of *shape* changes the result far less than the choice of *width*. A standard exam question: kernel choice is second-order, bandwidth is first-order."],
      ],
      reading: "\u201CHow far away is a data point still allowed to speak about this location?\u201D\n\nThat is the only question $h$ answers, and the bias-variance tradeoff is just its two failure modes: listen to too few neighbours and you hear noise; listen to too many and you hear the average of things that aren't alike.\n\n**Why this matters here rather than in a statistics course:** the whole reason we plot a KDE of log returns is to see the **tails**, and the tails are where data is scarcest \u2014 exactly where the choice of $h$ does the most damage. Pick $h$ by a normal-reference rule (`scott`, `silverman`) and you have quietly assumed the answer to the question you were asking." },

    { kind: "key", title: "How $h$ sits on that tradeoff — the exam's favorite KDE question",
      body: "• **$h$ too large** (too much smoothing) → **low variance, high bias**. The estimate is stable but *misses real features* of the density.\n• **$h$ too small** (not enough smoothing) → **high variance, low bias**. You capture real features, but also **artifacts of this particular sample**.\n\nSomewhere in between is the $h$ that minimizes MSE. For densities the target is the **integrated** MSE:\n\n$$\\text{IMSE}_h=\\int \\E\\Big[\\big(\\widehat f_h(x)-f(x)\\big)^2\\Big]dx.$$\n\nMethods for choosing $h$ minimize $\\text{IMSE}_h$ — **cross-validation**, for example." },

    { kind: "code", title: "KDE in Python",
      lang: "python", file: "kde.py",
      body: "`KDEpy`'s `FFTKDE` uses a fast Fourier transform for a significant speedup. `kernel` defaults to `\"gaussian\"`. For `bw` you may give a number or a method: `\"ISJ\"` (an improved Sheather-Jones), or `scott` and `silverman`, which are **normal-reference** rules — optimized to work well *when the underlying distribution is normal*.",
      code: `from KDEpy import FFTKDE
import scipy as sc

n = 1000
data = sc.stats.norm.rvs(size=n)
x, y = FFTKDE(kernel='gaussian', bw="ISJ").fit(data).evaluate()

fig, ax = plt.subplots(figsize=[6,4])
ax.plot(x, y)
ax.plot(x, sc.stats.norm.pdf(x), color="red", linestyle="dotted")
plt.show()`,
      after: "Seaborn is the quick route for a single series — `sns.kdeplot(ldrEQ, bw_method='silverman')`." },

    { kind: "code", title: "The plot that convicts normality",
      lang: "python", file: "tails.py",
      body: "Overlay the KDE of log daily returns with the best-fitting normal density, **on a log y-scale**:",
      code: `import seaborn as sns

fig, ax = plt.subplots(figsize=[6,4])
sns.kdeplot(ldrEQ, bw_method='silverman', color='red')

x = np.linspace(min(ldrEQ), max(ldrEQ), 100)
y = sc.stats.norm.pdf(x, np.mean(ldrEQ), np.std(ldrEQ))

ax.plot(x, y, color='blue', linestyle='--')
plt.yscale('log')          # <-- the crucial line
ax.set_xlabel("Log Daily Return"); ax.set_ylabel("Density")
plt.show()`,
      after: "**Why `yscale('log')`?** On a linear scale both curves look like bells and the tails are visually crushed to zero. On the log scale the normal density is a downward **parabola** (since $\\log$ of $e^{-x^2}$ is quadratic), and the empirical density sits visibly **above** it in both tails.\n\nConclusion: the observed log daily returns have **heavier tails than the normal distribution**. This is the central empirical finding of Part 2." },

    { kind: "check",
      q: "A KDE is built with a bandwidth that is far too small. What has gone wrong?",
      choices: [
        "The estimate is overly smooth",
        "The variance of the estimator is too large",
        "The bias of the estimator is too large",
        "The data are effectively ignored",
      ],
      answer: 1,
      explain: "Small $h$ = little smoothing = the estimate chases every observation, so it has **high variance** (and low bias): you see sample artifacts alongside real features. Too-*large* $h$ is the opposite — low variance, high bias, features smoothed away." },
  ],
},

];
