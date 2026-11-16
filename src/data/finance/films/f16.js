/* f16 — Properties of MLEs (full lecture) */

import { PALETTE as P, linspace, normals, normPdf, clamp01, easeOut, lerp } from "@/lib/anim";
import { compile, title, jargon, points, formula, derive, plot, code, recap, revealed } from "@/lib/scenes";

const D = (() => {
  const nrm = normals(613);
  /* negative log-likelihood for Exponential(1.5) at three sample sizes,
     shifted to a common minimum so the curvature is the comparison */
  const LAM = 1.5;
  const nll = (n) => linspace(0.9, 2.3, 180).map((l) => {
    const v = -n * Math.log(l) + l * (n / LAM);
    const vmin = -n * Math.log(LAM) + n;
    return [l, (v - vmin) / n * 14];
  });

  /* the Gamma MLE scatter: alpha-hat against beta-hat, strongly correlated */
  const gam = Array.from({ length: 110 }, () => {
    const z = nrm();
    return [2.16 + 0.288 * z + 0.09 * nrm(), 1.25 + 0.164 * z + 0.05 * nrm()];
  });

  /* a loss distribution with VaR and CVaR marked */
  const dens = linspace(-3.6, 4.2, 220).map((x) => [x, normPdf(x)]);
  const Z = 2.326, PHI = normPdf(Z);          // alpha = 0.01
  const CVAR = PHI / 0.01;

  /* Uniform(0,theta): the density of the MLE, which is never normal */
  const unif = (n) => linspace(0, 1, 160).map((t) => [t, n * t ** (n - 1)]);
  return { LAM, nll, gam, dens, Z, CVAR, unif,
    cov: { va: 0.081, vb: 0.034, cab: 0.047, corr: 0.9 } };
})();

export default compile({
  id: "f16",
  title: "Properties of MLEs",
  blurb: "Curvature as uncertainty, the regularity conditions and the case that breaks them, the Hessian as a covariance matrix, invariance, the Delta Method, and VaR/CVaR.",
  takeaway: "Sharpness of the minimum is certainty about the parameter. Everything in this Part — Hessians, Jacobians, the Delta Method — is machinery for turning that one idea into a standard error.",
  data: D,
  scenes: [

    /* ---------- 1. curvature ---------- */
    title({ n: 1, title: "Curvature is uncertainty", tone: "slate", chapter: "Curvature",
      sub: "The one idea this whole Part rests on.",
      say: "Chapter one. Curvature is uncertainty — the single idea that the whole of this Part rests on.", dur: 10 }),

    points({ dur: 24, heading: "Start with calculus", tone: "slate",
      items: [
        "For a function $f(t)$ minimized at $\\hat t$ and twice differentiable there, $\\left.\\frac{d^2f}{dt^2}\\right|_{t=\\hat t}>0$.",
        "Its **magnitude** quantifies how **sharp** the function is at the minimum.",
        "A sharply-curved valley pins the minimum down precisely. A broad, flat valley leaves it vague.",
      ],
      say: "Start with a concept from calculus. Consider a univariate function f of t that is minimized at t hat. Assuming f is twice differentiable there, the second derivative at that point is positive. And the magnitude of that second derivative quantifies how sharp the function is at the minimum. A sharply curved valley pins the minimum down precisely. A broad, flat valley leaves it vague. Hold that picture." }),

    formula({ dur: 28, heading: "Normality of the MLE — single parameter", tone: "blue",
      tex: "V(\\widehat\\theta)\\approx\\left(-\\left.\\frac{d^2\\ell(\\theta)}{d\\theta^2}\\right|_{\\theta=\\widehat\\theta}\\right)^{-1}",
      notes: [
        "Under **regularity conditions**, $\\widehat\\theta$ is approximately normal with mean equal to its **true value**.",
        "**Sharp** minimum (large second derivative) → greater certainty → **smaller** variance.",
        "The approximate normality is a direct result of the **central limit theorem**.",
        "Note the **inverse**. Forgetting it reverses the entire relationship.",
      ],
      say: "Now apply that to the negative log likelihood, and you get the central result of this Part. Assume theta hat is the maximum likelihood estimator for a real valued parameter. Under regularity conditions, theta hat is approximately normal, with mean equal to its true value, and variance equal to the inverse of minus the second derivative of the log likelihood, evaluated at theta hat. The intuition is exactly the picture we just drew: when the negative log likelihood has a sharp minimum — a large second derivative — there is greater certainty in the location of the true parameter value, which means a smaller variance for theta hat. The approximate normality is a direct result of the central limit theorem, and this result leads to a simple way to construct confidence intervals and hypothesis tests. One warning: note the inverse. Forget to invert and you have the relationship backwards." }),

    plot({ dur: 34, chapter: "Curvature",
      caption: "Negative log-likelihood for iid Exponential data at $n=100$, $250$, $400$. As $n$ grows, the minimum **narrows** — and the estimator gets more certain.",
      say: "Here is that claim made visible. These are three negative log likelihood functions for iid exponential data, based on samples simulated with n equal to one hundred, two hundred and fifty, and four hundred. They all bottom out in the same place. But note how broad the minimum is in the case of n equals one hundred, reflecting the greater uncertainty in the estimator — and how sharply it narrows by n equals four hundred. More data, sharper valley, smaller variance.",
      note: "same minimum, different curvature — that difference **is** the standard error",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0.9, 2.3], y: [0, 9], W, H, pad: { l: 56, r: 24, t: 56, b: 46 } });
        a.grid(5, 3).frame();
        a.ticks({ xs: [1.0, 1.5, 2.0], ys: [0, 3, 6, 9], xfmt: (v) => v.toFixed(1) });
        const sizes = [[100, P.blue], [250, P.amber], [400, P.emerald]];
        const k = clamp01((t - 1.2) / (dur * 0.62));
        sizes.forEach(([n, col], i) => {
          if (k * 3 < i) return;
          a.line(data.nll(n), { color: col, width: 2.2 });
          a.chip(`n=${n}`, a.L + 12, a.T + 16 + i * 22, { color: col, bg: "rgba(148,163,184,0.10)" });
        });
        a.vline(data.LAM, { color: P.muted, width: 1.2 });
        a.note("λ̂", a.sx(data.LAM) + 7, a.B - 14, { color: P.muted, size: 12, weight: 700 });
      } }),

    derive({ dur: 30, heading: "The Exponential case, worked", chapter: "Curvature",
      lines: [
        ["-\\ell(\\lambda)=-n\\log(\\lambda)+\\lambda\\sum_{i=1}^{n}x_i", "the negative log-likelihood from Part 8"],
        ["-\\frac{d^2\\ell(\\lambda)}{d\\lambda^2}=n/\\lambda^2", "differentiate twice; the linear term vanishes"],
        ["V(\\widehat\\lambda)\\approx\\left(n/\\widehat\\lambda^2\\right)^{-1}=\\widehat\\lambda^2/n", "invert"],
        ["\\text{SE}(\\widehat\\lambda)=\\widehat\\lambda/\\sqrt{n}", "take the square root — the familiar $1/\\sqrt{n}$ shrinkage"],
      ],
      say: "Let us do it concretely. We derived the negative log likelihood for iid exponential data in the last Part: minus n log lambda, plus lambda times the sum of the x's. Differentiate that twice with respect to lambda. The linear term vanishes, and we are left with n over lambda squared. Invert it, and the variance of the maximum likelihood estimator is approximately lambda hat squared over n. Take the square root, and the standard error is lambda hat over the square root of n — the familiar one over root n shrinkage, falling straight out of the curvature." }),

    /* ---------- 2. regularity ---------- */
    title({ n: 2, title: "The regularity conditions", tone: "amber", chapter: "Regularity",
      sub: "And the standard case that breaks them.",
      say: "Chapter two. The regularity conditions — and the standard case that breaks them.", dur: 9 }),

    points({ dur: 34, heading: "What “regularity conditions” means here", tone: "amber",
      items: [
        "Casella and Berger: *“under suitable regularity conditions” is a somewhat abused phrase, as with enough assumptions we can probably prove whatever we want.*",
        "**1.** The space of models must have a **shared support** — the support should **not change with $\\theta$**.",
        "**2.** The true value of $\\theta$ should **not lie on the boundary** of the space of possible values.",
        "**3.** The model must be **identifiable**: two distinct parameter values imply two distinct probability models.",
        "**4.** The likelihood must be sufficiently **smooth and differentiable** with respect to $\\theta$.",
      ],
      say: "What are regularity conditions? In their classic text Statistical Inference, Casella and Berger write that under suitable regularity conditions is a somewhat abused phrase, as with enough assumptions we can probably prove whatever we want. However, they say, regularity conditions are typically very technical, rather boring, and usually satisfied in most reasonable problems. In our case the important conditions are four. One: the space of models, as theta varies, needs to have a shared support — that is, the support of the distribution for the observable random variables should not change with theta. Two: the true value of theta should not lie on the boundary of the space of possible values. Three: the model should be identifiable, meaning two distinct parameter values imply two distinct probability models. And four: the likelihood function needs to be sufficiently smooth and differentiable with respect to theta." }),

    plot({ dur: 34, chapter: "Regularity",
      caption: "$X_1,\\ldots,X_n$ iid Uniform$(0,\\theta)$. The MLE is $\\widehat\\theta=X_{(n)}$, the **maximum**, and its density $n\\,t^{n-1}/\\theta^n$ is **never normal** — at any $n$.",
      say: "Here is the counterexample worth knowing. Suppose X one through X n are iid uniform on zero to theta. The likelihood is one over theta, to the n, on the region where theta is at least the largest observation — which is a decreasing function of theta. So the maximum likelihood estimator is theta hat equals X n, the sample maximum. Derive its distribution. The probability theta hat is at most t is the probability all n observations are at most t, which is t over theta, all to the n. Differentiate and you get the density: n t to the n minus one, over theta to the n. And look at it. It rises and then stops dead at theta. It is never normal, at any sample size — and as n grows it gets more lopsided, not less. The reason is condition one: the support of the uniform zero theta distribution is zero to theta, which moves as theta moves.",
      note: "it gets **more** lopsided as $n$ grows, not less",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 1.12], y: [0, 26], W, H, pad: { l: 56, r: 24, t: 56, b: 46 } });
        a.grid(4, 4).frame();
        a.ticks({ xs: [0, 0.5, 1], ys: [0, 10, 20], xfmt: (v) => v.toFixed(1) });
        const ns = [4, 10, 25];
        const k = clamp01((t - 1.5) / (dur * 0.6));
        ns.forEach((n, i) => {
          if (k * 3 < i) return;
          const col = [P.blue, P.amber, P.red][i];
          a.line(data.unif(n), { color: col, width: 2.2 });
          a.chip(`n=${n}`, a.L + 12, a.T + 16 + i * 22, { color: col, bg: "rgba(148,163,184,0.10)" });
        });
        a.vline(1, { color: P.muted, width: 1.4 });
        a.note("θ", a.sx(1) + 8, a.T + 20, { color: P.muted, size: 13, weight: 700 });
        a.note("support ends AT θ — that is the problem", a.L + 12, a.B - 18,
          { color: P.red, size: 11.5, weight: 600 });
      } }),

    /* ---------- 3. multiparameter ---------- */
    title({ n: 3, title: "More than one parameter", tone: "blue", chapter: "Multiparameter",
      sub: "The Hessian, and why the off-diagonal matters.",
      say: "Chapter three. More than one parameter — which brings in the Hessian, and a reason the off diagonal entries matter more than you might expect.", dur: 11 }),

    jargon({ dur: 26, term: "The Hessian", chapter: "Multiparameter",
      plain: "The $p\\times p$ matrix of **second derivatives** of a real-valued function, with $(i,j)$ entry $\\partial^2f/\\partial t_i\\partial t_j$. Denoted $\\nabla^2$.",
      formal: "Strictly it is not a matrix of *numbers* — its entries are functions of $t_1,\\ldots,t_p$. Evaluate it at a particular vector and a matrix of real values is produced. It is **positive definite** at a local minimum.",
      say: "Most models of interest have more than a single parameter to be estimated. We extend the notion of the second derivative using the Hessian. The Hessian of a real valued function of p variables is a p by p matrix whose i j entry is the second partial derivative with respect to t i and t j. The Hessian operator is often denoted del squared. Strictly speaking, the Hessian is not a matrix of numbers — its entries are themselves functions of the variables. If you evaluate the Hessian at a particular vector, then a matrix of real values is produced. And it will be positive definite when evaluated at a point which is a local minimum of the function. You will not be asked to compute one by hand. What you should know is that it is made of second derivatives, why that is the relevant information for estimating uncertainty, and that such matrices can be approximated numerically." }),

    formula({ dur: 26, heading: "Normality of the MLE — multiparameter", tone: "blue",
      tex: "V(\\widehat{\\boldsymbol\\theta})\\approx-\\Big(\\nabla^2\\ell(\\boldsymbol\\theta)\\big|_{\\boldsymbol\\theta=\\widehat{\\boldsymbol\\theta}}\\Big)^{-1}",
      notes: [
        "The **inverse of the Hessian** of the negative log-likelihood, evaluated at the MLE.",
        "The result is a **covariance matrix**, not just a list of variances.",
        "That is crucial, because in some cases there are **significant correlations between the estimators**.",
      ],
      say: "Assume theta hat is the maximum likelihood estimator for a parameter vector theta. Under regularity conditions, theta hat is approximately normal with mean equal to its true value, and variance equal to the inverse of the Hessian of the negative of the log likelihood function, evaluated at the maximum likelihood estimate. Note that the result of this is a covariance matrix for the MLE — not merely a list of variances. This is crucial, because in some cases there are significant correlations between the estimators that need to be considered." }),

    plot({ dur: 36, chapter: "Multiparameter",
      caption: "Fitting Gamma$(\\alpha,\\beta)$ repeatedly. $V(\\widehat\\alpha)\\approx0.081$, $V(\\widehat\\beta)\\approx0.034$, $\\text{Cov}\\approx0.047$ — so $\\text{Corr}\\approx0.9$.",
      say: "Here is why that matters, made concrete. Fit a Gamma distribution with parameters alpha and beta to a sample, a hundred separate times, and plot the estimated alpha against the estimated beta. The variance of alpha hat is about nought point zero eight one; the variance of beta hat about nought point zero three four; and the covariance between them about nought point zero four seven. Divide the covariance by the square root of the product of the variances and you get a correlation of about nought point nine. Very strong. The estimators move together, along a line of roughly constant alpha over beta.",
      note: "they travel along a line of roughly constant $\\alpha/\\beta$ — which is $\\E(X)$",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [1.4, 3.1], y: [0.65, 1.85], W, H, pad: { l: 60, r: 24, t: 56, b: 46 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [1.6, 2.0, 2.4, 2.8], ys: [0.8, 1.2, 1.6], xfmt: (v) => v.toFixed(1), yfmt: (v) => v.toFixed(1) });
        const n = revealed(t, dur, data.gam.length, { start: 0.06, end: 0.55 });
        a.dots(data.gam.slice(0, n), { color: P.blue, r: 3 });
        const k = clamp01((t - dur * 0.56) / (dur * 0.2));
        if (k > 0) {
          a.line([[1.5, 1.5 * 0.577], [3.0, 3.0 * 0.577]], { color: P.muted, width: 1.5, alpha: k });
          a.note("α/β constant", a.sx(2.75), a.sy(1.68), { color: P.muted, size: 11.5, weight: 600, alpha: k });
        }
        const k2 = clamp01((t - dur * 0.74) / (dur * 0.2));
        if (k2 > 0) {
          a.dots([[2.8, 0.8]], { color: P.red, r: 6, alpha: k2 });
          a.note("α=2.8, β=0.8 — plausible alone,", a.L + 12, a.T + 18, { color: P.red, size: 11.5, weight: 700, alpha: k2 });
          a.note("highly unlikely together", a.L + 12, a.T + 38, { color: P.red, size: 11.5, weight: 700, alpha: k2 });
        }
      } }),

    points({ dur: 30, heading: "Why the off-diagonal matters", tone: "amber",
      items: [
        "Consider $\\alpha=2.8$, $\\beta=0.8$. Judging each parameter **separately**, both look perfectly plausible.",
        "But $\\E(X)=\\alpha/\\beta$, and the covariance shows **this particular combination is highly unlikely**.",
        "If I ignore the covariance, that pair seems quite reasonable. **With** the covariance, I can see it is not.",
        "Ignore the off-diagonal entries and you will believe nonsense about what the data actually support.",
      ],
      say: "Here is the practical implication, and it is the kind of thing worth being able to explain. Consider the parameter combination alpha equals two point eight, beta equals nought point eight. Looking at each parameter on its own, against its own variance, both of those look quite plausible. But recall that the expected value of a Gamma is alpha over beta. With the covariance in hand, you can see that this particular combination is highly unlikely — it sits well off the ridge the estimators actually travel along. Ignore the covariance and you will believe nonsense about what the data support." }),

    code({ dur: 28, heading: "Hessian and covariance in code", file: "hessian.py", chapter: "Multiparameter",
      body: `import numdifftools as nd

def gammamle(x):
    def neg_loglike_gamma(pars, x):
        return (-1)*sum(gamma.logpdf(x, pars[0], scale=1/pars[1]))

    mleout = minimize(neg_loglike_gamma, [1,1], args=(x), method="Nelder-Mead")

    Hess_gamma = nd.Hessian(neg_loglike_gamma)              # returns a FUNCTION
    covout = np.linalg.inv(Hess_gamma(mleout.x, x))         # evaluate, then invert

    return mleout.x, covout`,
      caption: "`nd.Hessian(f)` takes a multivariate function and returns **another function** — you evaluate it at a parameter vector.",
      say: "Fortunately Python has built in functions that allow for easy approximation of the Hessian, and this works in the one parameter case as well. We use Hessian from the package numdifftools. The thing to notice when reading this: n d dot Hessian takes the multivariate function as input, and returns another function. You then evaluate that function at a particular parameter pair, supplying the other input arguments the original function needs — here, the vector of observations. Then n p dot linalg dot inv inverts the result, and you have the covariance matrix." }),

    points({ dur: 32, heading: "Three further properties", tone: "slate",
      items: [
        "**Observed vs expected curvature.** We use the curvature in the **observed** log-likelihood — a fixed data set. The **expected** curvature over random data sets is the **Fisher Information Matrix**, $\\mathbf{I}_n(\\theta)$.",
        "**Bias.** MLEs are **not necessarily unbiased**, but they are **asymptotically unbiased** — the bias converges to zero as $n$ increases.",
        "**Cramér-Rao.** The lower bound on the variance of **any unbiased estimator** of $\\theta$ is $\\mathbf{I}_n(\\theta)^{-1}$.",
        "Together: the MLE has (approximately) the **smallest possible MSE**. That is the primary reason for preferring it.",
      ],
      say: "Three comments to round out the theory. First, we are using the curvature in the observed log likelihood function to approximate the variance of theta hat — that is, using a fixed data set. In some cases, with simpler probability models, it is possible to derive the expected curvature over random data sets. That is referred to as the Fisher Information Matrix. Second, maximum likelihood estimators are not necessarily unbiased estimators of the parameters, but they are asymptotically unbiased, meaning the bias converges to zero as the sample size increases. And third, it is possible to show that the lower bound on the variance of any unbiased estimator of theta is the inverse of the Fisher information. That is the Cramér-Rao Lower Bound. In combination with the previous point, we now have assurance that the maximum likelihood estimator has approximately the smallest possible mean squared error — which is a primary reason for preferring it as a method for constructing estimators." }),

    /* ---------- 4. invariance ---------- */
    title({ n: 4, title: "Invariance and the Delta Method", tone: "emerald", chapter: "Invariance",
      sub: "Getting the estimate, then getting its standard error.",
      say: "Chapter four. Invariance and the Delta Method — one gets you the estimate of a transformed parameter, the other gets you its standard error.", dur: 11 }),

    points({ dur: 30, heading: "The invariance property", tone: "emerald",
      items: [
        "Often we are not interested in $\\boldsymbol\\theta$ itself, but in estimating $\\mathbf{g}(\\boldsymbol\\theta)$ — the mean $\\alpha/\\beta$, the variance $\\alpha/\\beta^2$, or the probability of an extreme **tail event** for risk management.",
        "**Invariance:** if $\\widehat{\\boldsymbol\\theta}$ is the MLE for $\\boldsymbol\\theta$, then $\\mathbf{g}(\\widehat{\\boldsymbol\\theta})$ is the MLE for $\\mathbf{g}(\\boldsymbol\\theta)$.",
        "Another way to see it: reparameterize the model in terms of $\\mathbf{g}(\\boldsymbol\\theta)$ and maximize over the new parameters — you end up with the **same fitted model**.",
        "**Example.** For iid Exponential, $\\widehat\\lambda=1/\\bar X$. Since $P(X_i>a)=e^{-\\lambda a}$, the MLE for that probability is $e^{-a/\\bar X}$.",
      ],
      say: "It is often the case that we are not interested specifically in the value of theta, but instead in estimating some function g of theta. In the Gamma example the model contains alpha and beta, but maybe we actually want the mean, alpha over beta, or the variance, alpha over beta squared. Another example: we may want to estimate the probability of an extreme tail event, for the purposes of risk management. Fortunately, maximum likelihood estimators satisfy the invariance property: if theta hat is the MLE for theta, then g of theta hat is the MLE for g of theta. Another way to view this: if you were to rewrite the probability model in terms of g of theta and maximize the likelihood over those new parameters, you would end up with the same fitted model. Concretely: when X one through X n are iid exponential, the MLE for lambda is one over X bar. Since the probability X exceeds a is e to the minus lambda a, the MLE for that probability is e to the minus a over X bar." }),

    points({ dur: 26, heading: "Unbiasedness does NOT have this property", tone: "amber",
      items: [
        "$s^2=\\frac{1}{n-1}\\sum(x_i-\\bar x)^2$ is an **unbiased** estimator of $\\Var(X_i)$, under general assumptions.",
        "**But** $\\E(s)\\ne\\sqrt{\\Var(X_i)}$.",
        "So $s$ is **not** an unbiased estimator of the standard deviation.",
        "Unbiasedness simply does not survive a nonlinear transformation. Invariance is special to the MLE.",
      ],
      say: "Does unbiasedness satisfy a similar invariance property? No. Take s squared, the usual sample variance with n minus one in the denominator. Under general assumptions that is an unbiased estimator of the variance of X i. But the expected value of s is not the square root of the variance of X i. So s is not an unbiased estimator of the standard deviation. Unbiasedness simply does not survive a nonlinear transformation. Invariance is a property special to maximum likelihood estimators, and that contrast is worth remembering." }),

    formula({ dur: 32, heading: "The Delta Method", tone: "blue",
      tex: "g(Y_n)\\ \\dot\\sim\\ N\\big(g(\\mu),\\ g'(\\mu)^2\\sigma_n^2\\big)\\qquad\\text{and}\\qquad V\\big(\\mathbf{g}(\\widehat{\\boldsymbol\\theta})\\big)\\approx\\mathbf{G}\\,\\Sigma\\,\\mathbf{G}^{T}",
      notes: [
        "**One-dimensional:** if $Y_n\\ \\dot\\sim\\ N(\\mu,\\sigma_n^2)$ with $\\sigma_n^2\\to0$, then $g(Y_n)$ is approximately normal — assuming $g'(\\mu)$ exists and is not zero.",
        "**Multiparameter:** $\\mathbf{G}$ is the **Jacobian** of $\\mathbf{g}$ — the $m\\times p$ matrix with $(i,j)$ entry $\\partial g_i/\\partial t_j$.",
        "$\\Sigma$ is the covariance matrix of $\\widehat{\\boldsymbol\\theta}$, from the inverse Hessian. **Two different ingredients.**",
      ],
      say: "Invariance gives the point estimate. To get its standard error you need the Delta Method. In one dimension: if Y n is approximately normal with mean mu and variance sigma n squared, and that variance goes to zero as n increases, then g of Y n is approximately normal with mean g of mu and variance g prime of mu, squared, times sigma n squared — assuming g prime of mu exists and is not zero. In the multiparameter case: suppose theta hat is approximately normally distributed with variance Sigma, and g returns an m dimensional vector with m at most p. Let G denote the Jacobian matrix of the function g — the m by p matrix whose i j entry is the partial derivative of g i with respect to t j. Then g of theta hat is approximately normal with variance G Sigma G transpose, assuming the resulting matrix is of full rank. Notice these are two different ingredients: the Jacobian is first derivatives of the transformation; Sigma is the covariance from the inverse Hessian, which is second derivatives of the log likelihood." }),

    plot({ dur: 30, chapter: "Invariance",
      caption: "**The intuition.** Replace $g$ near $\\mu$ by its tangent line $h(x)=a+g'(\\mu)x$. Then $V\\big(h(Y_n)\\big)=g'(\\mu)^2V(Y_n)$ — and as $n$ grows, $h(Y_n)$ and $g(Y_n)$ agree.",
      say: "Here is the intuition, which is worth seeing rather than memorizing. Take the function g, and near the point mu replace it by its tangent line — call that h of x, equal to a constant plus g prime of mu times x. For a straight line, the variance calculation is trivial: the variance of h of Y n is g prime of mu, squared, times the variance of Y n. And as n goes to infinity, Y n concentrates more and more tightly around mu, so h of Y n and g of Y n become approximately the same thing. That is the whole of the Delta Method. You will not be asked to do the derivation. You should know why it is relevant, and what the important ingredients are — which in the multiparameter setting means knowing what the Jacobian matrix is, even if you never have to calculate one.",
      note: "a curve, replaced by its tangent — and the tangent's variance is easy",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0.2, 4.2], y: [-0.6, 1.9], W, H, pad: { l: 56, r: 24, t: 56, b: 46 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [1, 2, 3, 4], ys: [0, 1], });
        const MU = 2.1;
        const g = (x) => Math.log(x);
        a.line(linspace(0.25, 4.2, 140).map((x) => [x, g(x)]), { color: P.blue, width: 2.4 });
        a.note("g(x)", a.sx(3.9), a.sy(g(3.9)) - 16, { color: P.blue, size: 12.5, weight: 700 });
        const k = clamp01((t - 3) / (dur * 0.35));
        if (k > 0) {
          const sl = 1 / MU;
          const tl = linspace(MU - 1.5 * k, MU + 1.9 * k, 2).map((x) => [x, g(MU) + sl * (x - MU)]);
          a.line(tl, { color: P.red, width: 2, dash: [6, 4] });
          a.note("h(x) = a + g′(μ)x", a.L + 12, a.T + 18, { color: P.red, size: 12, weight: 700 });
        }
        a.vline(MU, { color: P.muted, width: 1.2 });
        a.note("μ", a.sx(MU) + 7, a.B - 14, { color: P.muted, size: 12.5, weight: 700 });
        const k2 = clamp01((t - dur * 0.62) / (dur * 0.3));
        if (k2 > 0) {
          const sd = 0.55 * (1 - 0.6 * k2);
          ctx.save(); ctx.globalAlpha = 0.5 * k2; ctx.fillStyle = P.emeraldSoft;
          ctx.fillRect(a.sx(MU - sd), a.B - 26, a.sx(MU + sd) - a.sx(MU - sd), 18);
          ctx.restore();
          a.note("Yₙ concentrates on μ", a.sx(MU) - 56, a.B - 40, { color: P.emerald, size: 11.5, weight: 700, alpha: k2 });
        }
      } }),

    /* ---------- 5. VaR / CVaR ---------- */
    title({ n: 5, title: "Value at Risk and CVaR", tone: "amber", chapter: "VaR / CVaR",
      sub: "The whole Part, applied to one question.",
      say: "Chapter five. Value at Risk and Conditional Value at Risk — which is this entire Part applied to a single practical question.", dur: 11 }),

    formula({ dur: 30, heading: "VaR and CVaR", tone: "amber",
      tex: "P(L>c)\\le\\alpha\\ \\Rightarrow\\ \\text{VaR}_\\alpha=c,\\qquad \\text{CVaR}_\\alpha=\\E\\big(L\\mid L>\\text{VaR}_\\alpha\\big)",
      notes: [
        "**VaR** at level $\\alpha$ is the **smallest** $c$ with $P(L>c)\\le\\alpha$, where $L$ models the distribution of **losses**.",
        "**CVaR**, also called **Expected Shortfall**, quantifies the expected value of the losses that **exceed** that threshold.",
        "For normal losses: $\\text{VaR}_\\alpha=\\mu+z_\\alpha\\sigma$ and $\\text{CVaR}_\\alpha=\\frac{1}{\\alpha}\\big[\\sigma\\phi(z_\\alpha)+\\mu\\alpha\\big]$.",
      ],
      say: "Value at Risk is a risk management measure that quantifies the maximum expected financial loss a portfolio could suffer over a time period, given a confidence level. Specifically, VaR at level alpha is defined as the smallest value c such that the probability that the loss L exceeds c is at most alpha. Conditional Value at Risk, also known as Expected Shortfall, takes this a step further by quantifying the expected value of losses that exceed a VaR threshold. Mathematically, for a given confidence level alpha, CVaR is the conditional expectation of L given that L strictly exceeds the VaR at that confidence level. For normally distributed losses, VaR is mu plus z alpha sigma, and CVaR works out to one over alpha, times sigma times the standard normal density at z alpha, plus mu alpha." }),

    plot({ dur: 32, chapter: "VaR / CVaR",
      caption: "**VaR is the threshold. CVaR is the average of what lies beyond it.** VaR gives only a lower bound on the losses in that extreme event.",
      say: "Here is the distinction drawn. The shaded region is the extreme one percent of the loss distribution. The first dashed line is the Value at Risk — the threshold, the ninety ninth percentile of losses. The second line is the Conditional Value at Risk, which sits further out: it is the average of everything beyond the threshold. Why do both exist? Investors and companies find it crucial to understand what the worst case scenarios are, for the purposes of managing their risks. If I specify that I am concerned about the extreme five percent events, VaR says what is the amount that is at risk in the case of such an extreme event. CVaR is more informative, by telling you when that extreme event occurs, what my actual expected losses are. VaR is giving you the lower bound on the losses in that extreme event.",
      note: "$\\alpha=0.01$: VaR at the 99th percentile, CVaR the mean beyond it",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-3.6, 4.2], y: [0, 0.46], W, H, pad: { l: 56, r: 24, t: 56, b: 46 } });
        a.grid(5, 3).frame();
        a.ticks({ xs: [-2, 0, 2, 4], ys: [0, 0.2, 0.4], yfmt: (v) => v.toFixed(1) });
        a.area(data.dens, 0, { color: "rgba(148,163,184,0.16)" });
        a.line(data.dens, { color: P.ink, width: 2 });
        const k = clamp01((t - 2) / (dur * 0.3));
        if (k > 0) {
          const tail = data.dens.filter(([x]) => x >= data.Z);
          ctx.save(); ctx.globalAlpha = k;
          a.area(tail, 0, { color: P.redSoft });
          ctx.restore();
          a.vline(data.Z, { color: P.red, width: 1.8, alpha: k });
          a.note("VaR", a.sx(data.Z) + 7, a.T + 22, { color: P.red, size: 12.5, weight: 700, alpha: k });
        }
        const k2 = clamp01((t - dur * 0.55) / (dur * 0.3));
        if (k2 > 0) {
          a.vline(data.CVAR, { color: P.blue, width: 1.8, alpha: k2 });
          a.note("CVaR", a.sx(data.CVAR) + 7, a.T + 46, { color: P.blue, size: 12.5, weight: 700, alpha: k2 });
          a.note("the average of everything beyond", a.L + 12, a.T + 18,
            { color: P.blue, size: 11.5, weight: 600, alpha: k2 });
        }
      } }),

    code({ dur: 34, heading: "The whole Part in one function", file: "cvar.py", chapter: "VaR / CVaR",
      body: `def CVaR_mle_Norm(x, alpha):
    def neg_loglike_norm(pars, x):
        return -np.sum(norm.logpdf(x, *pars))

    minout = minimize(neg_loglike_norm, [0,1], args=(x), method="Nelder-Mead")   # 1. MLE

    Hess  = nd.Hessian(neg_loglike_norm)
    Sigma = np.linalg.inv(Hess(minout.x, x))                                     # 2. covariance

    def CVaR_Norm(pars, alpha):
        return (pars[1]/alpha)*norm.pdf(norm.ppf(1-alpha)) + pars[0]

    G = nd.Jacobian(CVaR_Norm)                                                   # 3. Jacobian

    CVaRmle = CVaR_Norm(minout.x, alpha)                      # invariance -> point estimate
    CVaRse  = np.sqrt(G(minout.x,alpha) @ Sigma @ G(minout.x,alpha).T)           # 4. Delta Method

    return CVaRmle, CVaRse, CVaRmle-2*CVaRse, CVaRmle+2*CVaRse  # 95% CI`,
      caption: "Four steps: **MLE → Hessian → Jacobian → Delta Method.** The $\\pm2\\,$SE interval works because the MLE is approximately normal.",
      say: "And here is the entire Part in a single function — the kind of code you would be asked to read and interpret. Step one: determine the maximum likelihood estimates for mu and sigma. Step two: find their covariance matrix using the Hessian. Step three: define the function g — here, CVaR as a function of mu and sigma — and find its Jacobian matrix, which in this case is one by two. Then use the invariance property to get the point estimate of CVaR by plugging the MLEs straight in. And step four: find the standard error using the Delta Method, G Sigma G transpose, with the at signs denoting matrix multiplication and dot T the transpose. The interval is the estimate plus or minus two standard errors, and that works precisely because the MLE is approximately normal — which is where this Part began. If losses are better modelled with heavier tails, the same recipe runs with the t distribution in place of the normal." }),

    recap({ dur: 36, items: [
      "**Curvature is certainty.** $V(\\widehat\\theta)\\approx$ the **inverse** of the second derivative of the negative log-likelihood at $\\widehat\\theta$.",
      "**Four regularity conditions**; the one that breaks is **shared support** — Uniform$(0,\\theta)$, whose MLE is never normal.",
      "The **inverse Hessian is a covariance matrix.** The off-diagonal matters: Gamma gives $\\text{Corr}(\\widehat\\alpha,\\widehat\\beta)\\approx0.9$.",
      "MLEs are **asymptotically unbiased**, and by **Cramér-Rao** have approximately the smallest possible MSE.",
      "**Invariance** gives the point estimate of $g(\\theta)$; the **Delta Method** gives its standard error, via the **Jacobian**.",
      "**VaR** is the threshold; **CVaR** is the mean of the losses beyond it — strictly more informative.",
    ],
    say: "To recap. Curvature is certainty: the variance of the MLE is approximately the inverse of the second derivative of the negative log likelihood at the estimate. There are four regularity conditions, and the one that famously breaks is shared support — the uniform zero theta case, whose maximum likelihood estimator is never normal at any sample size. In the multiparameter case the inverse Hessian is a full covariance matrix, and the off diagonal entries genuinely matter: for the Gamma, the correlation between alpha hat and beta hat is about nought point nine. Maximum likelihood estimators are asymptotically unbiased and, via the Cramér-Rao lower bound, have approximately the smallest possible mean squared error. Invariance gives you the point estimate of a transformed parameter; the Delta Method gives you its standard error, using the Jacobian. And finally, Value at Risk is the threshold, while Conditional Value at Risk is the mean of the losses beyond it — strictly the more informative of the two." }),
  ],
});
