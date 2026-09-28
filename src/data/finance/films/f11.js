/* f11 — Black-Scholes, Moneyness, and the Leverage Effect (full lecture) */

import { PALETTE as P, linspace, normPdf, normCdf, normals, garch, clamp01, easeOut, lerp } from "@/lib/anim";
import { compile, title, jargon, points, formula, plot, recap, revealed } from "@/lib/scenes";
import { money, pc, callPayoff, upTo } from "./shared";

const D = (() => {
  const P0 = 100, K = 100, T = 1, nu = 0.03;
  const call = (sig) => {
    const M = Math.log(P0 / K);
    const d2 = (M + nu * T) / (sig * Math.sqrt(T));
    const d1 = d2 + sig * Math.sqrt(T);
    return { d1, d2, price: P0 * Math.exp((nu + sig * sig / 2) * T) * normCdf(d1) - K * normCdf(d2) };
  };
  // a leverage-effect series: volatility reacts more to falls than to rises
  const nrm = normals(63);
  const n = 500;
  const x = [], vol = [];
  let s2 = 1e-4;
  for (let i = 0; i < n; i++) {
    const e = nrm();
    const xi = Math.sqrt(s2) * e;
    x.push(xi); vol.push(Math.sqrt(s2));
    const asym = xi < 0 ? 0.16 : 0.04;         // bad news raises vol far more
    s2 = 8e-6 + asym * xi * xi + 0.88 * s2;
  }
  return { P0, K, T, nu, call, sigs: linspace(0.03, 0.8, 100), x, vol,
    compound: [["once a year", 1], ["monthly", 12], ["daily", 365], ["continuously", Infinity]] };
})();

export default compile({
  id: "f11",
  title: "Black-Scholes, Moneyness, and the Leverage Effect",
  blurb: "The formula everything has been building toward — read input by input — and the three empirical facts from Parts 2 to 4 that tell you exactly where it stops being true.",
  takeaway: "Black-Scholes is not wrong so much as **too smooth**. Every departure the course measured — fat tails, clustering, asymmetry — is a way the world is rougher than one normal distribution with one fixed $\\sigma$.",
  data: D,
  scenes: [

    /* ---------- 1. compounding ---------- */
    title({ n: 1, title: "Why $e$ is everywhere in finance", tone: "slate", chapter: "Compounding",
      sub: "One limit explains it.",
      say: "Chapter one. Why the number e is everywhere in finance. One limit explains all of it.", dur: 9 }),

    jargon({ dur: 26, term: "Compounding", chapter: "Compounding",
      plain: "Earning interest **on your interest**. The more often it is paid, the more you end up with — because each payment starts earning immediately.",
      formal: "\\$100 at 5% paid once a year gives \\$105. Paid monthly, each month earns on the previous month's interest, so you finish slightly ahead.",
      say: "Compounding is earning interest on your interest. The more often the interest is paid, the more you end up with — because each payment starts earning immediately. A hundred dollars at five percent paid once a year gives you a hundred and five. Paid monthly, each month earns on the previous month's interest, so you finish slightly ahead." }),

    plot({ dur: 30,
      caption: "Push the frequency up and the total rises — but it does not rise forever. It **converges**, and the limit is $e^{r}$.",
      say: "Now push the frequency up and watch what happens. Yearly, then monthly, then daily, then hourly. The total rises each time — but notice it isn't rising by much any more. It converges. And the limit, as you compound infinitely often, is exactly e to the r. That is where the exponential in every finance formula comes from. It isn't decoration; it's the answer to a limit.",
      note: "$\\big(1+r/n\\big)^{n}\\to e^{r}$ as $n\\to\\infty$",
      draw({ ctx, W, H, t, dur, axes }) {
        const r = 0.05;
        const a = axes(ctx, { x: [0, 3.2], y: [1.0505, 1.0515], W, H, pad: { l: 74, r: 22, t: 54, b: 48 } });
        a.grid(4, 4).frame();
        a.ticks({ ys: [1.0506, 1.051, 1.0514], yfmt: (v) => v.toFixed(4) });
        const labels = ["yearly", "monthly", "daily", "hourly"];
        const ns = [1, 12, 365, 8760];
        const k = revealed(t, dur, 4, { start: 0.08, end: 0.62 });
        for (let i = 0; i < k; i++) {
          const v = (1 + r / ns[i]) ** ns[i];
          ctx.save();
          ctx.fillStyle = P.blue; ctx.globalAlpha = 0.65;
          const x0 = a.sx(i + 0.16), x1 = a.sx(i + 0.84);
          ctx.fillRect(x0, a.sy(v), x1 - x0, a.sy(1.0505) - a.sy(v));
          ctx.restore();
          a.note(labels[i], (x0 + x1) / 2 - 20, a.B + 16, { color: P.muted, size: 11 });
        }
        if (t > dur * 0.55) {
          a.hline(Math.exp(r), { color: P.emerald, width: 2.4, dash: [6, 4] });
          a.note(`e^0.05 = ${Math.exp(r).toFixed(5)} — the limit`, a.L + 10, a.sy(Math.exp(r)) - 14,
            { color: P.emerald, size: 12, weight: 700 });
        }
      } }),

    formula({ dur: 26,
      heading: "Continuous compounding, and its inverse",
      tex: "\\lim_{n\\to\\infty}\\Big(1+\\frac{r}{n}\\Big)^{n}=e^{r}\\quad\\Longrightarrow\\quad P_t=P_0e^{rt},\\qquad P_0=P_te^{-rt}",
      notes: [
        "$P_t=P_0e^{rt}$ grows a present amount forward. \\$1000 at 6% for 2 years is $1000e^{0.12}\\approx\\$1127.50$.",
        "Multiplying by $e^{-rt}$ instead runs it **backwards** — that is **discounting**, converting a future amount to today's value.",
        "Note the rate is multiplied by $t$. Forgetting that is a standard exam slip: $e^{0.06}$ is one year, not two.",
      ],
      say: "So continuous compounding gives P t equals P zero e to the r t. A thousand dollars at six percent for two years is a thousand times e to the nought point one two, about eleven twenty seven fifty. Multiplying by e to the minus r t instead runs it backwards — that's discounting, converting a future amount to what it's worth today. And note the rate is multiplied by t. Forgetting that is a standard exam slip: e to the nought six is one year, not two." }),

    /* ---------- 2. the formula ---------- */
    title({ n: 2, title: "The Black-Scholes formula", tone: "blue", chapter: "The formula",
      sub: "Module 2's Claim, with the GBM parameters substituted in.",
      say: "Chapter two. The Black Scholes formula. It is module two's Claim, with the geometric Brownian motion parameters substituted in.", dur: 11 }),

    formula({ dur: 30, chapter: "The formula",
      heading: "Substituting $\\xi=\\log P_0+\\nu t$ and $\\tau^2=\\sigma^2t$ into the Claim",
      tex: "\\E\\big((P_t-K)^+\\big)=P_0e^{(\\nu+\\sigma^2/2)t}\\,\\Phi\\!\\Big(\\tfrac{M+\\nu t+\\sigma^2t}{\\sigma\\sqrt{t}}\\Big)-K\\,\\Phi\\!\\Big(\\tfrac{M+\\nu t}{\\sigma\\sqrt{t}}\\Big)",
      notes: [
        "$M=\\log(P_0/K)$ is the **moneyness** — the only place $P_0$ and $K$ ever meet.",
        "Why those substitutions? GBM property 4 gives $\\log P_t\\sim N\\big(\\log P_0+\\nu t,\\ \\sigma^2t\\big)$ — so $\\xi$ and $\\tau^2$ **are** those two quantities.",
        "This is the heart of **Black-Scholes-Merton** theory, for **European-style** options.",
      ],
      say: "Substituting the geometric Brownian motion parameters into the Claim gives the Black Scholes formula. M is the moneyness, log of P zero over K, and it's the only place the spot price and the strike ever meet. Why those particular substitutions? Because GBM property four says the log price is normal with mean log P zero plus nu t, and variance sigma squared t. So xi and tau squared simply are those two quantities. This equation is the heart of Black Scholes Merton theory, for European style options." }),

    points({ dur: 30, heading: "Five inputs — and only three are facts", tone: "blue",
      items: [
        "**Known today:** the strike $K$, the time to expiration $t$, and the spot price $P_0$.",
        "**Not known:** the drift $\\nu$ and the volatility $\\sigma$. These must be estimated or calibrated.",
        "So the formula is a machine for converting your **beliefs** about drift and volatility into a price.",
        "That is precisely why the statistics of Parts 2 to 4 matter to what looks like a pricing formula.",
      ],
      say: "There are five inputs, and only three of them are facts. Known today: the strike, the time to expiration, and the current spot price. Not known: the drift and the volatility. Those have to be estimated or calibrated from somewhere. So the formula is really a machine for converting your beliefs about drift and volatility into a price. And that is precisely why the statistics of Parts two through four matter to something that looks like a pure pricing formula." }),

    /* ---------- 3. moneyness ---------- */
    title({ n: 3, title: "Moneyness", tone: "amber", chapter: "Moneyness",
      sub: "If it expired right now, would it pay anything?",
      say: "Chapter three. Moneyness. It answers one question: if this option expired right now, would it pay anything?", dur: 10 }),

    jargon({ dur: 28, term: "Moneyness, $M=\\log(P_0/K)$", chapter: "Moneyness",
      plain: "How far in or out of the money you currently are. It is a **ratio** inside a log, so it is scale-free — doubling both spot and strike leaves it unchanged.",
      formal: "For a **call**: $M>0$ is **in the money**, $M\\approx0$ **at the money**, $M<0$ **out of the money**. For a **put**, every inequality flips.",
      say: "Moneyness is log of the spot over the strike. It measures how far in or out of the money you currently are. Because it's a ratio inside a log, it's scale free — doubling both the spot and the strike leaves it completely unchanged. For a call, positive M is in the money, near zero is at the money, and negative is out of the money. For a put, every one of those inequalities flips." }),

    plot({ dur: 30,
      caption: "Sanity-check it against the payoff. A call is **in the money** when the spot is already above the strike — exercising today would pay. For a put, everything mirrors.",
      say: "Sanity check it against the payoff diagram. A call is in the money when the spot is already above the strike, because exercising today would pay you something. Below the strike it's out of the money and worth nothing on immediate exercise. For a put, everything mirrors: you profit when the spot is below the strike, so in the money means M is negative. If you ever forget which way round it goes, draw the payoff and read it off. That's faster and more reliable than memorizing four inequalities.",
      note: "call: in the money when $P_0>K$ · put: the mirror image",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [50, 160], y: [-8, 55], W, H, pad: { l: 58, r: 22, t: 54, b: 40 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [60, 100, 140], ys: [0, 25, 50], xfmt: (v) => `$${v}`, yfmt: (v) => `$${v}` });
        a.hline(0, { color: P.grid, dash: null });
        a.line(callPayoff(data.K, 50, 160), { color: P.blue, width: 2.8 });
        a.line(linspace(50, 160, 120).map((x) => [x, Math.max(0, data.K - x)]), { color: P.emerald, width: 2.2, dash: [5, 4] });
        a.vline(data.K, { color: P.amber, width: 2 });
        const k = clamp01(t / (dur * 0.5));
        if (k > 0.3) {
          ctx.save();
          ctx.globalAlpha = 0.10; ctx.fillStyle = P.emerald;
          ctx.fillRect(a.sx(data.K), a.T, a.R - a.sx(data.K), a.B - a.T);
          ctx.globalAlpha = 0.10; ctx.fillStyle = P.red;
          ctx.fillRect(a.L, a.T, a.sx(data.K) - a.L, a.B - a.T);
          ctx.restore();
          a.note("call: out of the money", a.L + 10, a.T + 20, { color: P.red, size: 11.5, weight: 700 });
          a.note("call: in the money", a.R - 10, a.T + 20, { color: P.emerald, size: 11.5, weight: 700, align: "right" });
        }
        a.note("call", a.sx(146), a.sy(44), { color: P.blue, size: 11.5, weight: 700 });
        a.note("put", a.sx(56), a.sy(44), { color: P.emerald, size: 11.5, weight: 700 });
      } }),

    /* ---------- 4. reading the formula ---------- */
    title({ n: 4, title: "Reading it input by input", tone: "blue", chapter: "Comparative statics",
      sub: "Nudge each input. Which way does the price move, and why?",
      say: "Chapter four. Reading it input by input. Here's the question that actually gets asked: nudge each input, and which way does the price move — and why?", dur: 12 }),

    plot({ dur: 32, chapter: "Comparative statics",
      caption: "Turn up $\\sigma$ and watch the distribution widen. It spreads **both** ways — but only the right half can ever pay you, and it stretches much further than the left half can fall.",
      say: "Start with volatility, because it's the one that sounds wrong. Turn sigma up and watch the distribution of the final price widen. It spreads both ways. But only the right half can ever pay you — the shaded green region. And because we're on the price scale with a lognormal distribution, that right half stretches much further out than the left half can possibly fall. The left is squashed against zero. So widening helps you far more than it hurts you.",
      note: "only the green region ever pays",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [30, 220], y: [0, 0.055], W, H, pad: { l: 58, r: 22, t: 54, b: 40 } });
        a.grid(6, 4).frame();
        a.ticks({ xs: [50, 100, 150, 200], ys: [], xfmt: (v) => `$${v}` });
        const sig = lerp(0.1, 0.5, easeOut(clamp01(t / (dur * 0.65))));
        const xi = Math.log(data.P0) + data.nu;
        const pts = linspace(30, 220, 260).map((x) => [x, normPdf((Math.log(x) - xi) / sig) / (x * sig)]);
        a.area(pts.filter(([x]) => x <= data.K), 0, { color: "rgba(148,163,184,0.22)" });
        a.area(pts.filter(([x]) => x >= data.K), 0, { color: P.emeraldSoft });
        a.line(pts, { color: P.blue, width: 2.6 });
        a.vline(data.K, { color: P.amber, width: 2 });
        a.chip(`σ = ${pc(sig, 0)}    call = ${money(data.call(sig).price)}`, a.L + 10, a.T + 16,
          { color: P.emerald, bg: "rgba(0,164,114,0.12)" });
        a.note("pays nothing", a.sx(48), a.sy(0.008), { color: P.muted, size: 11.5, weight: 600 });
      } }),

    plot({ dur: 30,
      caption: "In the formula that shows as $d_1$ and $d_2$ **pulling apart**. They are always exactly $\\sigma\\sqrt{t}$ apart — so more volatility literally widens the gap.",
      say: "In the formula, that shows up as d one and d two pulling apart. They are always exactly sigma root t apart — that's not a coincidence, it's the shift from completing the square back in module two. So raising sigma literally widens the gap between them. And since Phi is an increasing function, a wider gap means you collect over a bigger effective probability than the one you pay over.",
      note: "$d_1-d_2=\\sigma\\sqrt{t}$, always",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 0.8], y: [-0.9, 0.9], W, H, pad: { l: 58, r: 22, t: 54, b: 40 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 0.2, 0.4, 0.6, 0.8], ys: [-0.5, 0, 0.5], xfmt: (v) => pc(v, 0), yfmt: (v) => v.toFixed(1) });
        a.hline(0, { color: P.grid, dash: null });
        const k = easeOut(clamp01(t / (dur * 0.6)));
        const xs = data.sigs.filter((s) => s <= lerp(0.03, 0.8, k));
        const hi = xs.map((s) => [s, data.call(s).d1]);
        const lo = xs.map((s) => [s, data.call(s).d2]);
        if (hi.length > 2) a.area([...hi, ...lo.slice().reverse()], -0.9, { color: "rgba(0,164,114,0.10)" });
        a.line(hi, { color: P.emerald, width: 2.6 });
        a.line(lo, { color: P.blue, width: 2.6 });
        const sNow = xs[xs.length - 1] ?? 0.03;
        const c = data.call(sNow);
        a.note("d₁", a.sx(0.73), a.sy(data.call(0.73).d1) - 12, { color: P.emerald, size: 12.5, weight: 700 });
        a.note("d₂", a.sx(0.73), a.sy(data.call(0.73).d2) + 14, { color: P.blue, size: 12.5, weight: 700 });
        a.chip(`d₁ − d₂ = σ√t = ${(c.d1 - c.d2).toFixed(3)}`, a.L + 10, a.T + 16,
          { color: P.emerald, bg: "rgba(0,164,114,0.12)" });
      } }),

    plot({ dur: 30,
      caption: "Net result: the call price rises **monotonically** with $\\sigma$. Your downside was capped at the premium all along, so more uncertainty is pure upside.",
      say: "The net result is that the call price rises monotonically with sigma — it never turns around. Your downside was capped at the premium all along, so more uncertainty is pure upside for the holder. Here's the full set of comparative statics for the exam: a call is worth more when the spot is higher, the strike is lower, the time is longer, the drift is higher, or the volatility is higher. The first four are obvious. The fifth — more risk, more value — is the one that sounds wrong, and it is the whole point of owning an option.",
      note: "more risk → more value",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 0.8], y: [0, 36], W, H, pad: { l: 58, r: 22, t: 54, b: 40 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 0.2, 0.4, 0.6, 0.8], ys: [0, 12, 24, 36], xfmt: (v) => pc(v, 0), yfmt: (v) => `$${v}` });
        const k = easeOut(clamp01(t / (dur * 0.65)));
        const xs = data.sigs.filter((s) => s <= lerp(0.03, 0.8, k));
        const pts = xs.map((s) => [s, data.call(s).price]);
        a.area(pts, 0, { color: P.emeraldSoft });
        a.line(pts, { color: P.emerald, width: 3 });
        const sNow = xs[xs.length - 1] ?? 0.03;
        a.dots([[sNow, data.call(sNow).price]], { color: P.emerald, r: 5 });
        a.chip(`σ = ${pc(sNow, 0)}   call = ${money(data.call(sNow).price)}`, a.L + 10, a.T + 16,
          { color: P.emerald, bg: "rgba(0,164,114,0.12)" });
      } }),

    /* ---------- 5. implied vol ---------- */
    title({ n: 5, title: "Running the formula backwards", tone: "emerald", chapter: "Implied volatility",
      sub: "Nobody observes $\\sigma$. So ask the market what it thinks.",
      say: "Chapter five. Running the formula backwards. Nobody observes sigma — so instead of estimating it, ask the market what it thinks.", dur: 11 }),

    jargon({ dur: 28, term: "Implied volatility", chapter: "Implied volatility",
      plain: "Take the option's **market price** as given, and solve for the volatility that makes Black-Scholes return exactly that price.",
      formal: "It is the market's collective forecast of future volatility, expressed in the model's language. It is **not** an average of past squared returns, and **not** a standard deviation of option prices across strikes.",
      say: "Implied volatility means taking the option's market price as given, and solving backwards for the volatility that makes Black Scholes return exactly that price. Since the call price is monotonic in sigma, there's exactly one answer. It's the market's collective forecast of future volatility, expressed in the model's language. And two classic distractors: it is not an average of past squared returns, and it is not a standard deviation of option prices across strikes." }),

    points({ dur: 28, heading: "Two routes to $\\sigma$, and what each one knows", tone: "emerald",
      items: [
        "**Historical / realized** (module 9): estimate $\\sigma$ from past returns. Backward-looking, and assumes stability.",
        "**Implied**: invert the formula on today's market price. **Forward-looking**, and it prices in events the past has never seen.",
        "If the model were perfectly true, every strike would imply the **same** $\\sigma$. They do not — the *volatility smile*.",
        "That smile is the market pricing in the **fat tails** module 6 found. It is the model's failure, quoted daily.",
      ],
      say: "So there are two routes to sigma, and they know different things. Historical or realized volatility, from module nine, estimates sigma from past returns — backward looking, and it assumes stability. Implied volatility inverts the formula on today's market price: it's forward looking, and it prices in events the past has never seen. Now here's the punchline. If the model were perfectly true, every strike would imply the same sigma. They don't. That pattern is called the volatility smile, and it is the market pricing in exactly the fat tails module six found. It's the model's failure, quoted daily." }),

    /* ---------- 6. leverage ---------- */
    title({ n: 6, title: "The leverage effect", tone: "amber", chapter: "The leverage effect",
      sub: "One more asymmetry — and GARCH cannot see it.",
      say: "Chapter six. The leverage effect. One more asymmetry in the data, and standard GARCH cannot see it at all.", dur: 11 }),

    plot({ dur: 32, chapter: "The leverage effect",
      caption: "Volatility rises **more after falls** than after rises of the same size. Watch the conditional volatility jump after the red bars and barely move after the green ones.",
      say: "The leverage effect says volatility tends to rise more following negative returns than following positive returns of the same magnitude. Markets fall faster than they rise, and the turbulence after a drop is worse. Watch the conditional volatility underneath: it jumps sharply after the red bars, the down days, and barely moves after equally large green ones. The traditional explanation is about financial leverage — as a firm's equity falls, its debt to equity ratio rises, making the equity riskier — though the empirical effect is stronger than that story alone justifies.",
      note: "red = down days · volatility reacts asymmetrically",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const top = { l: 60, r: 22, t: 46, b: H / 2 + 10 };
        const bot = { l: 60, r: 22, t: H / 2 + 16, b: 34 };
        const n = Math.max(2, revealed(t, dur, 500, { start: 0.02, end: 0.8 }));
        const A = axes(ctx, { x: [0, 500], y: [-0.06, 0.06], W, H, pad: top });
        A.grid(5, 3).frame(); A.ticks({ ys: [-0.04, 0, 0.04], yfmt: (v) => pc(v, 0) });
        A.hline(0, { color: P.grid, dash: null });
        const up = [], dn = [];
        data.x.slice(0, n).forEach((v, i) => (v >= 0 ? up : dn).push([i, v]));
        A.bars(up, { color: P.emerald, width: 1.2, alpha: 0.8 });
        A.bars(dn, { color: P.red, width: 1.2, alpha: 0.85 });
        A.note("returns", A.L + 8, A.T + 14, { color: P.ink, size: 11.5, weight: 700 });

        const B = axes(ctx, { x: [0, 500], y: [0, 0.035], W, H, pad: bot });
        B.grid(5, 3).frame();
        B.ticks({ xs: [0, 250, 500], ys: [0, 0.015, 0.03], yfmt: (v) => pc(v, 0) });
        B.line(data.vol.slice(0, n).map((v, i) => [i, v]), { color: P.amber, width: 2.2 });
        B.note("conditional σₜ", B.L + 8, B.T + 14, { color: P.amber, size: 11.5, weight: 700 });
      } }),

    points({ dur: 30, heading: "Why standard GARCH is blind to it", tone: "amber",
      items: [
        "ARCH and GARCH are built on **squared** past values, $X_{t-i}^2$.",
        "Squaring **destroys the sign**, so $-5\\%$ and $+5\\%$ have **identical** effects on the forecast variance.",
        "By construction, standard GARCH **cannot** capture the leverage effect. It is a structural blind spot, not a tuning problem.",
        "Models that can: **APARCH** (Asymmetric Power ARCH), **EGARCH**, and **GJR-GARCH**.",
      ],
      say: "Why is standard GARCH blind to this? Because ARCH and GARCH are built on squared past values. And squaring destroys the sign, so minus five percent and plus five percent have absolutely identical effects on the forecast variance. By construction, standard GARCH cannot capture the leverage effect. It's a structural blind spot, not something you can fix by tuning parameters. The models that can handle it are APARCH — asymmetric power ARCH — along with EGARCH and GJR GARCH." }),

    points({ dur: 26, heading: "And one piece of vocabulary", tone: "slate",
      items: [
        "A **stock market index** such as the S&P 500 is a **summary measure** of the overall performance of a market, or a defined segment of it.",
        "It is a weighted aggregate of its constituents — not a regulatory instrument, and not something you can trade directly.",
        "Index moves correlate with component moves, but the index is fundamentally a **summary**.",
      ],
      say: "And one piece of vocabulary that shows up in the exam. A stock market index, such as the S and P five hundred, is a summary measure of the overall performance of a market or a defined segment of it. It's a weighted aggregate of its constituents. It is not a regulatory instrument, and it isn't something you can trade directly. Index moves correlate with the moves of the components, but the index is fundamentally a summary." }),

    /* ---------- 7. where it breaks ---------- */
    title({ n: 7, title: "Where the model stops being true", tone: "red", chapter: "Where it breaks",
      sub: "Four assumptions, and which module breaks each one.",
      say: "Chapter seven. Where the model stops being true. Four assumptions — and you should be able to name which module of this course breaks each one.", dur: 12 }),

    points({ dur: 24, heading: "Assumption 1 and 2, and their executioners", chapter: "Where it breaks", tone: "amber",
      items: [
        "**\u201cThe log price is normal.\u201d** Broken by modules 5-6 — QQ plots, excess kurtosis and Jarque-Bera all reject it. So Black-Scholes **under-prices far out-of-the-money options**: the crashes it calls impossible do happen.",
        "**\u201cVolatility is one constant.\u201d** Broken by modules 9-10 — volatility clusters and is itself a time series. Hence the volatility smile.",
      ],
      say: "Here's each assumption with its executioner. First: the log price is normal. Broken by modules five and six, where QQ plots, excess kurtosis and Jarque Bera all reject it decisively. The consequence is that Black Scholes under prices far out of the money options, because the crashes it treats as impossible do actually happen. Second: volatility is one constant. Broken by modules nine and ten, where volatility clusters and is itself a time series. Hence the smile." }),

    points({ dur: 24, heading: "Assumption 3 and 4", tone: "amber",
      items: [
        "**\u201cIncrements are independent.\u201d** *Half* broken by module 8 — returns are near-uncorrelated, so the ACF of $X_t$ looks fine. The ACF of $X_t^2$ does not.",
        "**\u201cUp and down moves are alike.\u201d** Broken by the leverage effect — and inherited by GARCH, which squares the sign away.",
      ],
      say: "Third: increments are independent. This one is only half broken. Returns really are near uncorrelated, so the autocorrelation function of the returns looks fine. But the autocorrelation function of the squares does not. Uncorrelated is not independent, and the difference is where all the money is. Fourth: up and down moves are alike. Broken by the leverage effect, and inherited by GARCH, which squares the sign away." }),

    points({ dur: 30, heading: "So why does anyone still use it?", tone: "emerald",
      items: [
        "Black-Scholes is not so much **wrong** as **too smooth**. Every departure this course measured is a way the world is rougher than one normal with one fixed $\\sigma$.",
        "Practitioners do not use it to **predict**. They use it as a **common language**.",
        "Quoting a price as an implied volatility is a way of saying **where you disagree with the model** — and everybody knows which model.",
        "A shared, precisely-wrong benchmark is more useful than no benchmark at all.",
      ],
      say: "So why does anyone still use it? Because Black Scholes is not so much wrong as too smooth. Every departure this course measured — fat tails, clustering, asymmetry — is a way the world is rougher than one normal distribution with one fixed sigma. And practitioners don't use it to predict. They use it as a common language. Quoting a price as an implied volatility is a way of saying where you disagree with the model, and everybody knows which model you mean. A shared, precisely wrong benchmark turns out to be far more useful than no benchmark at all." }),

    /* ---------- recap ---------- */
    recap({ dur: 26, chapter: "Recap", items: [
      "**Continuous compounding** gives $P_t=P_0e^{rt}$; multiplying by $e^{-rt}$ instead is **discounting**.",
      "Five inputs: $K$, $t$, $P_0$ are **known**; $\\nu$ and $\\sigma$ are **not** — which is why the statistics mattered.",
      "$M=\\log(P_0/K)$ is moneyness; for a **call** positive is in the money, and a put mirrors it.",
    ],
    say: "To recap. Continuous compounding gives P t equals P zero e to the r t, and multiplying by e to the minus r t instead is discounting. There are five inputs: the strike, the time and the spot are known, while the drift and volatility are not — which is exactly why all the statistics mattered. And moneyness is log of spot over strike, where for a call, positive means in the money." }),

    recap({ dur: 28, chapter: "Recap", items: [
      "A call is worth more with higher $P_0$, lower $K$, longer $t$, higher $\\nu$ — and **higher $\\sigma$**, because the downside is capped.",
      "**Implied volatility** inverts the formula on the market price. The **smile** it produces is the model's failure, quoted daily.",
      "The **leverage effect** is real, and squared-return models like GARCH are blind to it. Use **APARCH**, EGARCH or GJR-GARCH.",
    ],
    say: "And to close the course. A call is worth more with a higher spot, a lower strike, a longer time, a higher drift — and a higher volatility, because the downside is capped. Implied volatility inverts the formula on the market price, and the smile it produces is the model's failure, quoted daily. And the leverage effect is real, but squared return models like GARCH are structurally blind to it. For that you need APARCH, EGARCH, or GJR GARCH." }),
  ],
});
