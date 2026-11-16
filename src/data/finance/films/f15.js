/* f15 — Maximum Likelihood Estimation (full lecture) */

import { PALETTE as P, linspace, normals, rng, clamp01, easeOut, lerp } from "@/lib/anim";
import { compile, title, jargon, points, formula, derive, plot, code, recap, revealed } from "@/lib/scenes";

const D = (() => {
  const nrm = normals(55);
  /* the five observations from the notes, and the likelihood they generate */
  const xs = [0.92, 0.54, 1.20, 0.051, 1.13];
  const S = xs.reduce((a, b) => a + b, 0), n = xs.length;
  const lik = linspace(0.02, 3, 220).map((l) => [l, l ** n * Math.exp(-l * S)]);
  const loglik = linspace(0.08, 3, 220).map((l) => [l, n * Math.log(l) - l * S]);
  const mle = n / S;

  /* a GARCH(1,1) series and its fitted conditional variance */
  const W = 0.2742, A = 0.2643, B = 0.4830;
  const x = [], s2 = [W / (1 - A - B)];
  for (let t = 0; t < 420; t++) {
    const v = t === 0 ? s2[0] : W + A * x[t - 1] ** 2 + B * s2[t - 1];
    if (t > 0) s2.push(v);
    x.push(Math.sqrt(v) * nrm());
  }
  return { xs, lik, loglik, mle, x, s2, pars: { W, A, B }, negll: 1011.92 };
})();

export default compile({
  id: "f15",
  title: "Maximum Likelihood Estimation",
  blurb: "The likelihood function, why we take logs, the exact sense in which least squares is maximum likelihood, and fitting GARCH(1,1) by numerical maximization.",
  takeaway: "Likelihood is the joint distribution read backwards — as a function of the parameter, with the data held fixed. Everything else in this Part is machinery for maximizing it numerically.",
  data: D,
  scenes: [

    /* ---------- 1. why ---------- */
    title({ n: 1, title: "Why maximum likelihood", tone: "slate", chapter: "Motivation",
      sub: "When least squares is not an option.",
      say: "Chapter one. Why maximum likelihood exists — which is to say, what you do when least squares is not an option.", dur: 10 }),

    points({ dur: 28, heading: "Where least squares runs out", tone: "slate",
      items: [
        "Many models **cannot** be adequately expressed as a mean model plus irreducible errors.",
        "For those, the least squares approach — or alternatives like **L1 regression** — is simply not available.",
        "Maximum likelihood works with **virtually any case where there is a probability model**.",
        "A fully-specified probability model defines the **joint distribution** for the observable data, $f_{X_1,\\ldots,X_n}(x_1,\\ldots,x_n)$.",
      ],
      say: "Many models cannot be adequately expressed as a mean model plus irreducible errors, and in those cases the least squares approach — or related alternatives such as L one regression — is not an option. Here we discuss an approach to estimation that works with virtually any case where there is a probability model. And recall what that means: a fully specified probability model defines the joint distribution for the observable data." }),

    points({ dur: 32, heading: "What a mean model is missing", tone: "amber",
      items: [
        "Take $Y_i=m(\\theta,x_i)+\\epsilon_i$ with $\\E(\\epsilon_i)=0$. What must you add to get a probability model?",
        "You must specify the **individual distributions** for the $\\epsilon_i$ — the **marginal** distributions. E.g. assume they are normal.",
        "**But also:** you must assume the $\\epsilon_i$ are **independent**.",
        "Independence of the $\\epsilon_i$ makes the $Y_i$ independent, which is what lets you write $f_{Y_1,\\ldots,Y_n}=\\prod_i f_{Y_i}$.",
      ],
      say: "Consider a case where the assumption is that Y i equals m of theta and x i, plus epsilon i, with the expected value of epsilon i equal to zero. What do we need to add to these assumptions in order to have a probability model for Y one through Y n? We need to specify the individual distributions for the epsilons — often called the marginal distributions. For example, we may assume the epsilons are normally distributed. But there is a second requirement that is easy to forget: we also need to assume the epsilons are independent. Independence of the epsilons implies the Y's are independent, which is what allows us to write the joint density as a product of the marginals. If the epsilons are normal, that product is a product of normal densities." }),

    /* ---------- 2. the likelihood ---------- */
    title({ n: 2, title: "The likelihood function", tone: "blue", chapter: "Likelihood",
      sub: "The same object, read backwards.",
      say: "Chapter two. The likelihood function — which is the same object you already know, simply read backwards.", dur: 10 }),

    jargon({ dur: 30, term: "Likelihood function", chapter: "Likelihood",
      plain: "The joint distribution, thought of as a function of the **parameter** $\\theta$, for **fixed data** $\\mathbf{x}$. Written $L(\\theta)$.",
      formal: "In a probability course you view $f(\\mathbf{x}\\mid\\theta)$ as a function of $\\mathbf{x}$ for a fixed $\\theta$ — “assume $X$ is Exponential(3), what is $P(X\\le5)$?” The likelihood swaps which argument is held fixed.",
      say: "In a probability course, we typically view the joint distribution f of x given theta as a function of x, for a fixed parameter theta. For example: assume X is exponential three; what is its expected value, its variance, the probability it is at most five? A likelihood function is simply the same thing as the joint distribution, except that we think of it as a function of the parameter theta, for fixed data x. A likelihood function is often denoted L of theta. Nothing has changed about the formula. What has changed is which argument you hold still." }),

    derive({ dur: 30, heading: "The likelihood for iid Exponential data", chapter: "Likelihood",
      lines: [
        ["f_{X_i}(x)=\\lambda e^{-\\lambda x},\\quad x>0", "the density for one observation"],
        ["f_{X_1,\\ldots,X_n}=\\prod_{i=1}^{n}\\lambda e^{-\\lambda x_i}", "independence makes the joint a product of marginals"],
        ["=\\lambda^n e^{-\\lambda\\sum x_i},\\quad x_i>0", "collect the terms"],
        ["L(\\lambda)=\\lambda^n e^{-\\lambda\\sum x_i},\\quad \\lambda>0", "same formula, now a function of $\\lambda$"],
      ],
      say: "Here it is concretely. Suppose our assumed model is that X one through X n are iid exponential with rate lambda, and observations are made. The density for a single observation is lambda e to the minus lambda x. Independence makes the joint distribution the product of those marginals, which collects into lambda to the n, times e to the minus lambda times the sum of the x's. And the likelihood function is that same formula, now read as a function of lambda with the x's held fixed." }),

    plot({ dur: 34, chapter: "Likelihood",
      caption: "Five observations: 0.92, 0.54, 1.20, 0.051, 1.13. The likelihood peaks at $\\lambda=1.3$, so $\\widehat\\lambda=1.3$.",
      say: "Suppose we assume a reasonable model for five observations is that they were drawn iid from an exponential lambda distribution, and the five observations are nought point nine two, nought point five four, one point two, nought point zero five one, and one point one three. Here is the likelihood function for that data set. It is maximized when lambda is about one point three, so the maximum likelihood estimate of lambda is one point three. Now, something important about this plot. It does not depict a probability distribution for lambda. It is not a density. Instead, it shows, for each possible value of the unknown lambda, the likelihood that the observed data would have arisen.",
      note: "**not** a density, and **not** a distribution for $\\lambda$ — a likelihood",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 3], y: [0, 0.028], W, H, pad: { l: 64, r: 24, t: 56, b: 46 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 1, 2, 3], ys: [0, 0.01, 0.02], yfmt: (v) => v.toFixed(3) });
        const n = Math.max(2, revealed(t, dur, data.lik.length, { start: 0.06, end: 0.6 }));
        a.line(data.lik.slice(0, n), { color: P.blue, width: 2.4 });
        const k = clamp01((t - dur * 0.6) / (dur * 0.25));
        if (k > 0) {
          a.vline(data.mle, { color: P.red, width: 1.8, alpha: k });
          a.note(`λ̂ = ${data.mle.toFixed(1)}`, a.sx(data.mle) + 9, a.T + 24,
            { color: P.red, size: 13, weight: 700, alpha: k });
        }
        a.note("L(λ) = λⁿ e^(−λΣxᵢ)", a.L + 12, a.T + 20, { color: P.blue, size: 12, weight: 600 });
      } }),

    points({ dur: 28, heading: "The idea behind maximum likelihood", tone: "blue",
      items: [
        "We know $f(\\mathbf{x}\\mid\\theta)$ is largest for values of $\\mathbf{x}$ in regions of **high probability** under the model, for that $\\theta$.",
        "Fix $\\mathbf{x}$ and turn it around: **what value of $\\theta$ makes the observed $\\mathbf{x}$ the most likely?**",
        "**Why “close to” rather than “equal to”?** For a continuous $X$, $P(X=a)=0$ for every $a$ — so you cannot read the joint density as “the probability” of a data value.",
        "What you *can* say is that the density is largest where the probability of observing data **nearby** is largest.",
      ],
      say: "The maximum likelihood approach is built on the following idea. We know that f of x given theta is largest for values of x which are in regions of high probability under the model, for this particular value of theta. Once we fix x, we can turn this around and ask: what value of theta makes the observed x the most likely? In other words, what value of theta gives us the model which maximizes the probability of having seen data close to what was observed? And why say close to, rather than equal to? Because if X has a continuous distribution, the probability X equals any particular value a is zero. So we cannot interpret the joint density as giving the probability of different possible data values. What we can say is that the joint density is largest in areas where the probability of observing the data is largest." }),

    /* ---------- 3. logs ---------- */
    title({ n: 3, title: "Why the log-likelihood", tone: "amber", chapter: "Log-likelihood",
      sub: "Three reasons, one of which is the whole of Part 9.",
      say: "Chapter three. Why we work with the log likelihood — three reasons, and the third one turns into the whole of Part nine.", dur: 10 }),

    plot({ dur: 32, chapter: "Log-likelihood",
      caption: "$\\ell(\\lambda)=\\log L(\\lambda)=n\\log\\lambda-\\lambda\\sum x_i$. **Same maximizer**, because $\\log$ is increasing and $L$ is positive at its peak.",
      say: "The likelihood is positive at its maximum. For that reason, the log likelihood function is maximized at exactly the same value as the likelihood function itself. The log likelihood is denoted by a script l of theta. For our exponential example, taking the log of lambda to the n, e to the minus lambda sum x, gives n log lambda minus lambda times the sum of the x's. Here it is plotted — and notice the maximum sits in exactly the same place, at one point three. Nothing about the answer has changed. What has changed is how easy the function is to work with.",
      note: "the peak has not moved — only the vertical scale",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 3], y: [-12, -3], W, H, pad: { l: 58, r: 24, t: 56, b: 46 } });
        a.grid(5, 3).frame();
        a.ticks({ xs: [0, 1, 2, 3], ys: [-12, -9, -6, -3] });
        const n = Math.max(2, revealed(t, dur, data.loglik.length, { start: 0.06, end: 0.65 }));
        a.line(data.loglik.slice(0, n), { color: P.amber, width: 2.4 });
        const k = clamp01((t - dur * 0.62) / (dur * 0.25));
        if (k > 0) {
          a.vline(data.mle, { color: P.red, width: 1.8, alpha: k });
          a.note("same λ̂ = 1.3", a.sx(data.mle) + 9, a.T + 24, { color: P.red, size: 13, weight: 700, alpha: k });
        }
        a.note("ℓ(λ) = n log λ − λΣxᵢ", a.L + 12, a.T + 20, { color: P.amber, size: 12, weight: 600 });
      } }),

    points({ dur: 32, heading: "Three reasons to take the log", tone: "amber",
      items: [
        "**1. Numerical stability.** In the iid case the likelihood is a **product** of $n$ densities. Even at moderate $n$ that product is either enormous or indistinguishable from zero. The log makes it a **sum**, avoiding **underflow**.",
        "**2. Easier optimization.** Derivatives of a sum are far easier than derivatives of a product.",
        "**3. Theory.** The **curvature** of the log-likelihood relates directly to the **uncertainty in the estimator** — the whole of Part 9.",
        "In practice we minimize the **negative** log-likelihood, because `minimize()` minimizes.",
      ],
      say: "Three reasons. One, numerical stability. In the iid case the likelihood is calculated as the product of the marginal densities. Even if the sample size is only moderately large, that product will be either very large or very close to zero. The log function switches this into a sum over terms, and results in more reasonable values that avoid numerical issues. Two, easier optimization: derivatives of a sum are far simpler than derivatives of a product. And three, the log likelihood has desirable theoretical properties — specifically, its curvature relates directly to the uncertainty in the estimator, which is the entire subject of Part nine. In practice you will see us minimize the negative of the log likelihood, because the minimize function minimizes." }),

    /* ---------- 4. least squares again ---------- */
    title({ n: 4, title: "Least squares IS maximum likelihood", tone: "emerald", chapter: "LS = MLE",
      sub: "Under normal errors — and only under normal errors.",
      say: "Chapter four. The result the notes flag as important: least squares is maximum likelihood, under normal errors. And only under normal errors.", dur: 11 }),

    derive({ dur: 40, heading: "Maximizing $\\ell$ over $\\theta$ is minimizing the RSS", chapter: "LS = MLE",
      lines: [
        ["Y_i\\sim N\\big(m(\\theta,\\mathbf{x}_i),\\ \\sigma^2\\big),\\quad\\text{independent}", "shifting a mean-zero normal by a constant"],
        ["f_{Y_i}(y_i)=\\frac{1}{\\sqrt{2\\pi}\\,\\sigma}\\exp\\left(-\\frac{\\big(y_i-m(\\theta,\\mathbf{x}_i)\\big)^2}{2\\sigma^2}\\right)", "the normal density"],
        ["L(\\theta,\\sigma^2)=\\left(\\frac{1}{\\sqrt{2\\pi}\\,\\sigma}\\right)^{n}\\exp\\left(-\\frac{\\sum_i\\big(y_i-m(\\theta,\\mathbf{x}_i)\\big)^2}{2\\sigma^2}\\right)", "multiply the marginals — independence"],
        ["\\ell(\\theta,\\sigma^2)=n\\log\\left(\\frac{1}{\\sqrt{2\\pi}\\,\\sigma}\\right)-\\frac{\\sum_i\\big(y_i-m(\\theta,\\mathbf{x}_i)\\big)^2}{2\\sigma^2}", "take logs"],
      ],
      say: "Suppose our model assumes Y i equals m of theta and x i, plus epsilon i, where the epsilons are iid normal with mean zero and variance sigma squared. Then each Y i is normal with mean m of theta and x i, and variance sigma squared, and the Y's are independent. Write down the normal density for each one. Multiply them, using independence, to get the joint density — which is therefore also the likelihood function for theta and sigma squared. Now take the log. The product becomes a sum, and the exponential disappears, leaving n times log of one over root two pi sigma, minus the sum of squared residuals, over two sigma squared." }),

    points({ dur: 30, heading: "Read the last line as a function of $\\theta$", tone: "emerald",
      items: [
        "The **first term does not involve $\\theta$ at all.**",
        "The second is a **negative constant times the residual sum of squares**.",
        "So **maximizing $\\ell$ over $\\theta$ is exactly minimizing $\\sum\\big(y_i-m(\\theta,\\mathbf{x}_i)\\big)^2$.**",
        "**This relationship does NOT hold for other error distributions.** It is a special property of the normal — a direct consequence of the **squared term in its exponent**.",
      ],
      say: "Now look at that last line as a function of theta alone. The first term does not involve theta at all — it is a constant as far as theta is concerned. The second term is a negative constant times the residual sum of squares. Maximizing the whole expression over theta is therefore exactly the same as minimizing the sum of squared residuals. That is the result. And here is the part that gets tested: this unique relationship does not hold for other error distributions. It is a special property of the normal, and it comes directly from the squared term sitting in the normal's exponent. The professor strongly recommends looking through this derivation, and it is easy to see why." }),

    /* ---------- 5. numerical MLE ---------- */
    title({ n: 5, title: "Doing it numerically", tone: "blue", chapter: "Numerical MLE",
      sub: "Minimize the negative log-likelihood.",
      say: "Chapter five. Doing it numerically — which in practice means minimizing the negative log likelihood.", dur: 10 }),

    code({ dur: 30, heading: "Numerical maximum likelihood", file: "mle.py", chapter: "Numerical MLE",
      body: `from scipy.optimize import minimize

def neg_loglike_exp(lamda, x):
    return (-1)*len(x)*np.log(lamda) + lamda*np.sum(x)

res = minimize(neg_loglike_exp, 1, method='Nelder-Mead',
               options={'disp': True}, args=(x))

print(f"The MLE for lambda is {res.x[0]:6.3f}")   #  1.302`,
      caption: "Build the **negative** log-likelihood, then minimize it. The answer, 1.302, matches the peak we read off the plot.",
      say: "For most models of interest, the most direct way to obtain maximum likelihood estimates is to use numerical optimization procedures. We use minimize again, in order to minimize the negative of the log likelihood function. Start by building the function to be minimized — the negative of the log likelihood. For the exponential that is minus n log lambda, plus lambda times the sum of the x's. Then call minimize. The answer comes back as one point three zero two, which matches the peak we read off the plot a moment ago." }),

    points({ dur: 26, heading: "Changing the distribution", tone: "slate",
      items: [
        "To fit a different distribution, you **change the log-likelihood function being optimized** — nothing else.",
        "For a Gamma, you evaluate the **log-pdf of the Gamma** instead of that of the Normal: `gamma.logpdf(x, pars[0], scale=1/pars[1])`.",
        "Be careful with each function's **parameterization**. `scipy`'s gamma takes a `scale`, which here is $1/\\beta$.",
        "For $X\\sim\\text{Gamma}(\\alpha,\\beta)$: $\\E(X)=\\alpha/\\beta$ and $\\Var(X)=\\alpha/\\beta^2$.",
      ],
      say: "A question that comes up: how do we adapt the MLE calculation for different distributions? The answer is that you change the log likelihood function that you are optimizing, and nothing else. For a Gamma distribution, you evaluate the log p d f of the Gamma instead of that of the Normal. The one thing to be careful about is each function's parameterization — scipy's gamma takes a scale argument, which in our notation is one over beta. And recall that for a Gamma with parameters alpha and beta, the expected value is alpha over beta and the variance is alpha over beta squared." }),

    /* ---------- 6. GARCH ---------- */
    title({ n: 6, title: "The GARCH(1,1) likelihood", tone: "amber", chapter: "GARCH",
      sub: "A model with no mean-model-plus-error form.",
      say: "Chapter six. The GARCH one one likelihood — the showcase, because GARCH is a model with no mean model plus error form at all.", dur: 11 }),

    formula({ dur: 22, heading: "The model", tone: "amber",
      tex: "X_t\\mid\\mathcal{F}_{t-1}\\sim N(0,\\sigma_t^2),\\qquad \\sigma_t^2=\\omega+\\alpha X_{t-1}^2+\\beta\\sigma_{t-1}^2",
      notes: [
        "The observation at time $t$ is normal with **mean zero** and **variance $\\sigma_t^2$**.",
        "Distribution assumptions other than the normal can be used — which is where Part 10 goes.",
        "The three parameters $\\theta=(\\omega,\\alpha,\\beta)$ are estimated by maximum likelihood.",
      ],
      say: "Recall the GARCH model — a class of models capable of capturing the volatility clustering often present in financial time series, especially in log returns. Although we could consider the more general GARCH p q model, here we focus on GARCH one one. The observation at time t, denoted X t, is normal with mean zero and variance sigma t squared, where sigma t squared equals omega, plus alpha times X t minus one squared, plus beta times sigma t minus one squared. Distribution assumptions other than the normal can be used, and that is exactly where Part ten goes. The three parameters — omega, alpha and beta — can be estimated using maximum likelihood." }),

    derive({ dur: 40, heading: "Deriving the likelihood by conditioning", chapter: "GARCH",
      lines: [
        ["f_{X_1,\\ldots,X_n}=f_{X_n\\mid X_1,\\ldots,X_{n-1}}\\cdot f_{X_1,\\ldots,X_{n-1}}", "since $f_{X,Y}=f_{X\\mid Y}f_Y$"],
        ["=\\prod_{t=1}^{n}f_{X_t\\mid\\mathcal{F}_{t-1}}", "repeat all the way down; $\\mathcal{F}_{t-1}$ is the information at time $t-1$"],
        ["X_t\\mid\\mathcal{F}_{t-1}\\sim N\\big(0,\\ \\omega+\\alpha X_{t-1}^2+\\beta\\sigma_{t-1}^2\\big)", "so the joint is a product of normal densities"],
        ["\\sigma_1^2=\\frac{\\omega}{1-\\alpha-\\beta}", "the tricky part: $\\sigma_1^2$ is unspecified, so set it to the unconditional variance"],
      ],
      say: "Here is the derivation, and the step worth understanding. We cannot write the joint density as a product of marginals, because the independence assumption is simply not available — the whole point of GARCH is dependence. So instead we factor by conditioning. Using the rule that a joint density equals a conditional times a marginal, peel off X n, then X n minus one, and so on all the way down. That gives a product over t of the density of X t given F t minus one, where F t minus one denotes all information available at time t minus one. And the GARCH model tells us exactly what that conditional distribution is: normal with mean zero and variance omega plus alpha X t minus one squared plus beta sigma t minus one squared. So the joint distribution is a product of normal densities. The tricky part is that sigma one squared is unspecified. The common approach is to set it to omega over one minus alpha minus beta, since that is the unconditional variance of X t." }),

    plot({ dur: 32, chapter: "GARCH",
      caption: "The series and the fitted conditional variance. **$\\sigma_t^2$ is what the recursion fills in** — and the likelihood is a sum of normal log-densities evaluated at those values.",
      say: "Here is what the recursion is actually doing. The blue series is the observed data. The amber line beneath it is the conditional variance sigma t squared, reconstructed step by step from the parameters. Notice how the variance rises right after a large observation and decays gradually afterwards — that is the clustering the model is built to capture. Once you have that whole sigma squared series, the negative log likelihood is just a sum of normal log densities, each evaluated with its own standard deviation.",
      note: "large shock → variance rises → decays gradually. That is $\\alpha$ then $\\beta$.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 420], y: [-4.5, 4.5], W, H, pad: { l: 56, r: 24, t: 54, b: 70 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 210, 420], ys: [-4, 0, 4] });
        const n = Math.max(2, revealed(t, dur, data.x.length, { start: 0.04, end: 0.85 }));
        a.line(data.x.slice(0, n).map((v, i) => [i, v]), { color: P.blue, width: 1, alpha: 0.75 });
        a.hline(0, { color: P.muted, width: 1, dash: null });
        const b = axes(ctx, { x: [0, 420], y: [0, 6], W, H, pad: { l: 56, r: 24, t: H - 62, b: 30 } });
        b.frame();
        b.line(data.s2.slice(0, n).map((v, i) => [i, v]), { color: P.amber, width: 1.8 });
        b.note("σ²ₜ", b.L + 8, b.T + 12, { color: P.amber, size: 12, weight: 700 });
      } }),

    code({ dur: 34, heading: "The negative log-likelihood in code", file: "garch_mle.py", chapter: "GARCH",
      body: `def neg_loglike_garch11(params, x):
    omega, alpha, beta = params
    sigma2 = np.zeros(len(x))
    sigma2[0] = omega/(1-alpha-beta)          # the unconditional variance
    for t in range(1, len(x)):
        sigma2[t] = omega + alpha*x[t-1]**2 + beta*sigma2[t-1]
    return -np.sum(norm.logpdf(x, loc=0, scale=np.sqrt(sigma2)))

scl_data = np.array(EQldr)/np.std(EQldr)      # scale before fitting

res = minimize(neg_loglike_garch11, [np.var(scl_data), 0.1, 0.1],
               args=(scl_data,), method='L-BFGS-B',
               bounds=((0, None), (0, 0.999), (0, 0.999)))`,
      caption: "Note `loc=0` and `scale=np.sqrt(sigma2)` — mean zero, and the **standard deviation**, not the variance.",
      say: "Here is the whole thing in code. The recursion fills in sigma squared; then the negative log likelihood is minus the sum of normal log densities, with location zero and scale equal to the square root of sigma squared. Note that scale means standard deviation, not variance — a classic place to slip. Two practical details. Why scale the returns first? Because raw daily log returns are tiny, and tinier still once squared, so gradients are extremely small and the optimizer struggles or underflows. Scaling prevents numerical underflow and helps convergence — the same reason the arch package has a rescale equals true option. And why bounds? They force the iterative algorithm to observe the constraints on the parameters. That works with L B F G S B but not with every method, and if a lower bound of exactly zero causes trouble, replace it with something like one times ten to the minus six." }),

    points({ dur: 28, heading: "The fit, and a sanity check", tone: "emerald",
      items: [
        "Hand-rolled: $\\widehat\\omega=0.274$, $\\widehat\\alpha=0.264$, $\\widehat\\beta=0.483$, negative log-likelihood **1011.92** at the minimum.",
        "The `arch` package, on the same data: **1011.66**. Essentially identical.",
        "Two different routes to the same answer — which is the point of writing it out by hand once.",
      ],
      say: "Running that on three years of observed log returns gives omega hat about nought point two seven, alpha hat about nought point two six, and beta hat about nought point four eight, with a negative log likelihood of one thousand and eleven point nine two at the minimum. Compare that with what the arch package reports on the same data: one thousand and eleven point six six. Essentially identical. Two completely different routes to the same answer, which is exactly why it is worth writing the likelihood out by hand once." }),

    points({ dur: 28, heading: "MLE is a method, not a model", tone: "slate",
      items: [
        "The question gets asked directly: *what is the relationship between MLE and models such as GARCH?*",
        "It is like asking the difference between a **linear regression model** and **least squares**. Regression is a model; least squares is a **method** for estimating its parameters.",
        "Likewise **GARCH is a model** — a particular way of explaining how a series changes over time. It has parameters $(\\omega,\\alpha,\\beta)$ which must be estimated.",
        "Those parameters are **typically estimated using MLE**, by defining the log-likelihood of the returns given the time-varying variance equation.",
      ],
      say: "One last thing worth being crisp about, because the professor answers this question directly. What is the relationship between maximum likelihood estimation and models such as GARCH? It is somewhat like asking what the difference is between a linear regression model and least squares. Linear regression is a model; least squares is a method for estimating the parameters of that model. Likewise, GARCH is a model — a particular way of explaining how a series changes over time. That model has parameters which must be estimated. And those parameters are typically estimated using maximum likelihood, by defining the log likelihood of the returns given the time varying variance equation, and maximizing it." }),

    recap({ dur: 34, items: [
      "A **likelihood** is the joint distribution read as a function of $\\theta$, with the data fixed. It is **not** a distribution for $\\theta$.",
      "Take **logs**: products become sums (no underflow), derivatives get easier, and the curvature carries the theory of Part 9.",
      "Under **iid normal errors**, maximizing $\\ell$ over $\\theta$ **is** minimizing the RSS — and **only** under normal errors.",
      "**GARCH:** no independence, so the joint density is built by **conditioning**, with $\\sigma_1^2$ set to $\\omega/(1-\\alpha-\\beta)$.",
      "**Scale** the returns before fitting; use **bounds** with `L-BFGS-B` to respect the parameter constraints.",
      "MLE is a **method**; GARCH is a **model**. Do not confuse the two.",
    ],
    say: "To recap. A likelihood is the joint distribution of the data, read as a function of the parameter with the data held fixed — and it is not a probability distribution for the parameter. We take logs because products become sums, which avoids underflow and simplifies derivatives, and because the curvature of the log likelihood carries the whole theory of Part nine. Under iid normal errors, maximizing the log likelihood over theta is exactly minimizing the residual sum of squares — and that holds only under normal errors. For GARCH there is no independence, so the joint density is built by conditioning, with sigma one squared set to the unconditional variance. Scale the returns before fitting, and use bounds with L B F G S B to respect the parameter constraints. And finally: maximum likelihood is a method, GARCH is a model." }),
  ],
});
