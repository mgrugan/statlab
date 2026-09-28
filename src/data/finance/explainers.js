/* Motion-graphics explainers, one per finance module.
 *
 * Each film is a list of scenes; a scene draws into a canvas given its local
 * time and gets a caption (always shown) and a spoken line. Nothing here is
 * drawn by eye: the paths come from the simulators in lib/anim, the areas are
 * real normal integrals, and every number quoted in a caption is computed in
 * the `data` block below it so the words and the picture cannot drift apart.
 */

import {
  PALETTE, normals, normCdf, normPdf, normQuantile, tSample,
  gbmPath, ar1, garch, acf, kde, moments, linspace,
  clamp01, ease, easeOut, lerp,
} from "@/lib/anim";

const P = PALETTE;
const money = (v) => `$${v.toFixed(2)}`;
const pc = (v) => `${(v * 100).toFixed(1)}%`;

/* reveal the first `k` fraction of a series */
const upTo = (pts, k) => pts.slice(0, Math.max(2, Math.round(pts.length * clamp01(k))));

/* =================================================================== f1 */

const F1 = (() => {
  const K = 100, PREM = 8, tau = 0.3;
  const xi = Math.log(120) - (tau * tau) / 2;          // so E(P_T) = 120
  const d2 = (xi - Math.log(K)) / tau;
  const d1 = d2 + tau;
  const fair = 120 * normCdf(d1) - K * normCdf(d2);     // E[(P_T-K)^+]
  const naive = 120 - K;                                // (E P_T - K)^+
  const nrm = normals(4);
  const draws = Array.from({ length: 160 }, () => Math.exp(xi + tau * nrm()));
  return { K, PREM, tau, xi, d1, d2, fair, naive, gap: fair - naive, draws, EP: 120 };
})();

const f1 = {
  title: "Why the option is worth more than the forecast",
  blurb: "A point forecast says the stock will be worth \\$120. The option is worth **more** than that forecast suggests — and the reason is visible the moment you draw the payoff.",
  duration: 52,
  data: F1,
  takeaway: "The gap you just watched open up is Jensen's inequality. It is not a modelling artifact — it is the value of being allowed to walk away.",
  scenes: [
    { at: 0,
      caption: "A **call** with strike $K=\\$100$. If the stock finishes above \\$100 you buy at \\$100 and pocket the difference. Below \\$100 you simply walk away.",
      say: "Here is a call option with a strike of one hundred dollars. If the stock finishes above one hundred, you buy at one hundred and pocket the difference. Below one hundred, you simply walk away.",
      draw({ ctx, W, H, t, dur, data, axes, fade }) {
        const a = axes(ctx, { x: [60, 180], y: [-20, 80], W, H });
        const f = fade(t, dur);
        a.grid(6, 5).frame();
        a.ticks({ xs: [60, 100, 140, 180], ys: [0, 40, 80], xfmt: (v) => `$${v}`, yfmt: (v) => `$${v}` });
        a.hline(0, { color: P.grid, dash: null });
        a.vline(data.K, { color: P.amber, width: 2, alpha: f });
        a.label("K = $100", { x: data.K + 2, y: 74, color: P.amber, alpha: f, size: 12.5 });
        a.note("payoff at expiry", 16, 22, { color: P.muted, size: 11 });
      } },

    { at: 8,
      caption: "The payoff is $(P_T-K)^+$. Watch what it does at the strike: below it the line is **flat at zero** — your loss is truncated. Above it the line rises **one-for-one, forever**.",
      say: "The payoff is P minus K, positive part. Watch what happens at the strike. Below it the line is flat at zero — your loss is truncated. Above it the line rises one for one, with no ceiling.",
      draw({ ctx, W, H, t, dur, data, axes, fade }) {
        const a = axes(ctx, { x: [60, 180], y: [-20, 80], W, H });
        a.grid(6, 5).frame();
        a.ticks({ xs: [60, 100, 140, 180], ys: [0, 40, 80], xfmt: (v) => `$${v}`, yfmt: (v) => `$${v}` });
        a.hline(0, { color: P.grid, dash: null });
        a.vline(data.K, { color: P.amber, width: 2, alpha: 0.5 });
        const k = easeOut(clamp01(t / (dur - 1)));
        const xmax = lerp(60, 180, k);
        const pts = linspace(60, xmax, 120).map((x) => [x, Math.max(0, x - data.K)]);
        a.line(pts, { color: P.blue, width: 3 });
        if (xmax > 100) {
          a.note("truncated at zero", a.sx(72), a.sy(6) - 14, { color: P.emerald, size: 11.5, weight: 600 });
          a.note("unbounded", a.sx(150), a.sy(56), { color: P.blue, size: 11.5, weight: 600 });
        }
        a.label("K", { x: data.K, y: -12, color: P.amber, align: "center", size: 12 });
      } },

    { at: 18,
      caption: "Now drop 160 simulated outcomes onto it. The ones that land below the strike all pay **exactly the same thing: nothing**. The ones above are spread out across a long tail.",
      say: "Now drop a hundred and sixty simulated outcomes onto it. Everything that lands below the strike pays exactly the same thing — nothing. Everything above is spread across a long tail.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [60, 180], y: [-20, 80], W, H });
        a.grid(6, 5).frame();
        a.ticks({ xs: [60, 100, 140, 180], ys: [0, 40, 80], xfmt: (v) => `$${v}`, yfmt: (v) => `$${v}` });
        a.hline(0, { color: P.grid, dash: null });
        a.vline(data.K, { color: P.amber, width: 2, alpha: 0.5 });
        a.line(linspace(60, 180, 160).map((x) => [x, Math.max(0, x - data.K)]), { color: P.blue, width: 3 });

        const k = clamp01(t / (dur - 1.2));
        const n = Math.round(data.draws.length * k);
        for (let i = 0; i < n; i++) {
          const x = data.draws[i];
          if (x > 180 || x < 60) continue;
          const age = clamp01((k - i / data.draws.length) * 9);
          const y = lerp(74, Math.max(0, x - data.K), easeOut(age));
          const win = x > data.K;
          a.dots([[x, y]], { color: win ? P.emerald : P.red, r: 2.6, alpha: 0.28 + 0.5 * age });
        }
        const inm = data.draws.slice(0, n).filter((x) => x > data.K).length;
        if (n > 8) a.chip(`in the money: ${inm} / ${n}`, a.R - 10, a.T + 16, { align: "right", color: P.emerald, bg: "rgba(0,164,114,0.10)" });
      } },

    { at: 29,
      caption: "A colleague reasons: the stock will average \\$120, the strike is \\$100, so the option is worth \\$20. That is the payoff **of the average**.",
      say: "A colleague reasons like this. The stock will average one hundred and twenty. The strike is one hundred. So the option is worth twenty dollars. But that is the payoff of the average.",
      draw({ ctx, W, H, t, dur, data, axes, fade }) {
        const a = axes(ctx, { x: [60, 180], y: [-20, 80], W, H });
        const f = fade(t, dur);
        a.grid(6, 5).frame();
        a.ticks({ xs: [60, 100, 140, 180], ys: [0, 40, 80], xfmt: (v) => `$${v}`, yfmt: (v) => `$${v}` });
        a.hline(0, { color: P.grid, dash: null });
        a.vline(data.K, { color: P.amber, width: 2, alpha: 0.4 });
        a.line(linspace(60, 180, 160).map((x) => [x, Math.max(0, x - data.K)]), { color: P.blue, width: 3 });
        a.dots(data.draws.filter((x) => x < 180).map((x) => [x, Math.max(0, x - data.K)]),
          { color: P.muted, r: 2.2, alpha: 0.28 });

        a.vline(data.EP, { color: P.ink, width: 1.8, dash: [5, 4], alpha: f });
        a.label("E(P_T) = $120", { x: data.EP + 2, y: 74, color: P.ink, alpha: f, size: 12 });
        a.dots([[data.EP, data.naive]], { color: P.ink, r: 5, alpha: f });
        a.chip(`payoff of the average = ${money(data.naive)}`, a.L + 10, a.T + 16, { color: P.ink, bg: "rgba(30,41,59,0.08)", alpha: f });
      } },

    { at: 38,
      caption: "But you get the **average of the payoffs**, not the payoff of the average — and those are different numbers. The true expected payoff is $\\$25.44$.",
      say: "But you don't get the payoff of the average. You get the average of the payoffs. And those are different numbers. The true expected payoff is twenty five dollars and forty four cents.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [60, 180], y: [-20, 80], W, H });
        a.grid(6, 5).frame();
        a.ticks({ xs: [60, 100, 140, 180], ys: [0, 40, 80], xfmt: (v) => `$${v}`, yfmt: (v) => `$${v}` });
        a.hline(0, { color: P.grid, dash: null });
        a.line(linspace(60, 180, 160).map((x) => [x, Math.max(0, x - data.K)]), { color: P.blue, width: 3 });
        a.dots(data.draws.filter((x) => x < 180).map((x) => [x, Math.max(0, x - data.K)]),
          { color: P.muted, r: 2.2, alpha: 0.22 });

        const k = easeOut(clamp01(t / 2.4));
        const lvl = lerp(data.naive, data.fair, k);
        a.hline(data.naive, { color: P.ink, width: 1.6, dash: [5, 4], alpha: 0.55 });
        a.hline(lvl, { color: P.emerald, width: 2.4, dash: null });
        a.chip(`payoff of the average  ${money(data.naive)}`, a.L + 10, a.T + 16, { color: P.ink, bg: "rgba(30,41,59,0.08)" });
        a.chip(`average of the payoffs  ${money(lvl)}`, a.L + 10, a.T + 44, { color: P.emerald, bg: "rgba(0,164,114,0.12)" });

        if (k > 0.9) {
          const y0 = a.sy(data.naive), y1 = a.sy(data.fair), x = a.R - 54;
          ctx.save();
          ctx.strokeStyle = P.emerald; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x - 5, y1 + 6); ctx.lineTo(x, y1); ctx.lineTo(x + 5, y1 + 6); ctx.stroke();
          ctx.restore();
          a.note(`+${money(data.gap)}`, x + 9, (y0 + y1) / 2, { color: P.emerald, size: 12.5, weight: 700 });
        }
      } },

    { at: 45,
      caption: "That \\$5.44 gap **is** the option's extra value — the part a point forecast throws away. It exists only because the downside was truncated and the upside was not.",
      say: "That five dollar forty four cent gap is the option's extra value — exactly the part a point forecast throws away. It exists only because the downside was truncated and the upside was not.",
      draw({ ctx, W, H, t, dur, data, axes, fade }) {
        const a = axes(ctx, { x: [60, 180], y: [-20, 80], W, H });
        const f = fade(t, dur);
        a.grid(6, 5).frame();
        a.ticks({ xs: [60, 100, 140, 180], ys: [0, 40, 80], xfmt: (v) => `$${v}`, yfmt: (v) => `$${v}` });
        a.hline(0, { color: P.grid, dash: null });

        const flat = linspace(60, data.K, 40).map((x) => [x, 0]);
        const up = linspace(data.K, 180, 80).map((x) => [x, x - data.K]);
        a.area(up, 0, { color: P.emeraldSoft, alpha: f });
        a.line(flat, { color: P.red, width: 4 });
        a.line(up, { color: P.emerald, width: 4 });
        a.note("losses stop here", a.sx(70), a.sy(0) - 16, { color: P.red, size: 12, weight: 600 });
        a.note("gains do not", a.sx(138), a.sy(44), { color: P.emerald, size: 12, weight: 600 });
        a.chip(`fair value ${money(data.fair)}  ·  forecast says ${money(data.naive)}`, a.L + 10, a.B - 18,
          { color: P.blue, bg: "rgba(33,112,228,0.10)", alpha: f });
      } },
  ],
};

/* =================================================================== f2 */

const F2 = (() => {
  const xi = 0, tau = 0.45, K = 1.15;
  const lk = Math.log(K);
  const d2 = (xi - lk) / tau, d1 = d2 + tau;
  return { xi, tau, K, lk, d1, d2, P2: normCdf(d2), P1: normCdf(d1), EP: Math.exp(xi + tau * tau / 2) };
})();

const f2 = {
  title: "Where the extra $+\\tau^2$ comes from",
  blurb: "The pricing formula has two $\\Phi$ terms whose arguments differ by exactly $\\tau$. This is the algebra step that puts it there — and what it means.",
  duration: 54,
  data: F2,
  takeaway: "Multiplying a normal density by $e^{y}$ does not break it. It slides the mean up by $\\tau^2$ and leaves a constant outside. That one sentence is the whole proof.",
  scenes: [
    { at: 0,
      caption: "Start on the log scale, where the model is simple: $Y=\\log P_t$ is a plain **normal** bell curve.",
      say: "Start on the log scale, where the model is simple. Y, the log of the price, is a plain normal bell curve.",
      draw({ ctx, W, H, t, dur, data, axes, fade }) {
        const a = axes(ctx, { x: [-1.6, 1.6], y: [0, 1.05], W, H });
        const f = fade(t, dur);
        a.grid(6, 4).frame();
        a.ticks({ xs: [-1.5, -0.75, 0, 0.75, 1.5], ys: [], xfmt: (v) => v.toFixed(2) });
        const pts = linspace(-1.6, 1.6, 200).map((y) => [y, normPdf((y - data.xi) / data.tau)]);
        a.area(upTo(pts, easeOut(clamp01(t / 1.6))), 0, { color: P.blueSoft });
        a.line(upTo(pts, easeOut(clamp01(t / 1.6))), { color: P.blue, width: 2.6 });
        a.vline(data.xi, { color: P.blue, alpha: f * 0.8 });
        a.label("ξ", { x: data.xi + 0.04, y: 0.98, color: P.blue, alpha: f, size: 13 });
        a.note("density of Y = log P", 16, 22, { color: P.muted, size: 11 });
      } },

    { at: 8,
      caption: "The payoff is zero whenever $P_t<K$ — that is, whenever $Y<\\log K$. So only the shaded right-hand region contributes anything at all.",
      say: "The payoff is zero whenever the price finishes below the strike — that is, whenever Y is below log K. So only the shaded right hand region contributes anything at all.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-1.6, 1.6], y: [0, 1.05], W, H });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-1.5, -0.75, 0, 0.75, 1.5], ys: [], xfmt: (v) => v.toFixed(2) });
        const pts = linspace(-1.6, 1.6, 200).map((y) => [y, normPdf((y - data.xi) / data.tau)]);
        a.area(pts, 0, { color: "rgba(148,163,184,0.16)" });
        a.line(pts, { color: P.muted, width: 2 });
        const k = easeOut(clamp01(t / 2));
        const edge = lerp(1.6, data.lk, k);
        const right = pts.filter(([y]) => y >= edge);
        if (right.length > 1) a.area(right, 0, { color: P.blueSoft });
        a.vline(data.lk, { color: P.amber, width: 2 });
        a.label("log K", { x: data.lk + 0.05, y: 0.95, color: P.amber, size: 12.5 });
        if (k > 0.85) a.chip(`P(Y > log K) = Φ(d₂) = ${data.P2.toFixed(3)}`, a.L + 10, a.T + 16, { color: P.blue });
      } },

    { at: 18,
      caption: "But the payoff is not just *whether* you exercise — it is **how much the stock is worth** when you do. So each outcome gets weighted by $e^{y}$.",
      say: "But the payoff isn't just whether you exercise. It's how much the stock is worth when you do. So each outcome has to be weighted by e to the y — the price at that point.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-1.6, 1.6], y: [0, 1.05], W, H });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-1.5, -0.75, 0, 0.75, 1.5], ys: [], xfmt: (v) => v.toFixed(2) });
        const base = linspace(-1.6, 1.6, 200);
        const pts = base.map((y) => [y, normPdf((y - data.xi) / data.tau)]);
        a.line(pts, { color: P.muted, width: 2 });
        const k = easeOut(clamp01(t / 2.6));
        // e^y as a rising weight curve, drawn on its own scale
        const wts = base.map((y) => [y, clamp01(Math.exp(y) / Math.exp(1.6)) * 0.95]);
        a.line(upTo(wts, k), { color: P.amber, width: 2.2, dash: [5, 4] });
        a.note("weight = e^y  (the price)", a.sx(0.35), a.sy(0.72), { color: P.amber, size: 12, weight: 600 });
        a.note("high outcomes count for more", a.sx(-1.5), a.sy(0.28), { color: P.muted, size: 11.5 });
      } },

    { at: 27,
      caption: "Multiply them together and something remarkable happens: the result is **still a normal curve, just shifted right**. Its mean has moved from $\\xi$ to $\\xi+\\tau^2$.",
      say: "Multiply the density by that weight, and something remarkable happens. The result is still a normal curve — just shifted to the right. Its mean has moved from xi to xi plus tau squared.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-1.6, 1.6], y: [0, 1.05], W, H });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-1.5, -0.75, 0, 0.75, 1.5], ys: [], xfmt: (v) => v.toFixed(2) });
        const k = easeOut(clamp01(t / 3.2));
        const shift = data.tau * data.tau * k;
        const orig = linspace(-1.6, 1.6, 200).map((y) => [y, normPdf((y - data.xi) / data.tau)]);
        const moved = linspace(-1.6, 1.6, 200).map((y) => [y, normPdf((y - data.xi - shift) / data.tau)]);
        a.line(orig, { color: P.muted, width: 1.8, dash: [4, 4] });
        a.area(moved, 0, { color: P.emeraldSoft });
        a.line(moved, { color: P.emerald, width: 2.8 });
        a.vline(data.xi, { color: P.muted, alpha: 0.6 });
        a.vline(data.xi + shift, { color: P.emerald, width: 2 });
        a.label("ξ", { x: data.xi - 0.05, y: 0.98, color: P.muted, align: "right", size: 12.5 });
        a.label("ξ + τ²", { x: data.xi + shift + 0.05, y: 0.98, color: P.emerald, size: 12.5 });
        a.chip(`shift = τ² = ${(data.tau ** 2).toFixed(3)}`, a.L + 10, a.T + 16, { color: P.emerald, bg: "rgba(0,164,114,0.12)" });
      } },

    { at: 38,
      caption: "So the same threshold $\\log K$ now cuts off a **bigger** area: $\\Phi(d_1)=0.653$ against $\\Phi(d_2)=0.500$. Same strike, larger probability — because the curve moved.",
      say: "So the same threshold, log K, now cuts off a bigger area. Phi of d one against Phi of d two. Same strike, larger probability — because the curve moved underneath it.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-1.6, 1.6], y: [0, 1.05], W, H });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-1.5, -0.75, 0, 0.75, 1.5], ys: [], xfmt: (v) => v.toFixed(2) });
        const s = data.tau * data.tau;
        const o = linspace(-1.6, 1.6, 200).map((y) => [y, normPdf((y - data.xi) / data.tau)]);
        const m = linspace(-1.6, 1.6, 200).map((y) => [y, normPdf((y - data.xi - s) / data.tau)]);
        a.area(o.filter(([y]) => y >= data.lk), 0, { color: P.blueSoft });
        a.line(o, { color: P.blue, width: 2, alpha: 0.85 });
        a.area(m.filter(([y]) => y >= data.lk), 0, { color: P.emeraldSoft });
        a.line(m, { color: P.emerald, width: 2.4 });
        a.vline(data.lk, { color: P.amber, width: 2 });
        a.label("log K", { x: data.lk + 0.05, y: 0.99, color: P.amber, size: 12 });
        const f = clamp01(t / 1.4);
        a.chip(`Φ(d₂) = ${data.P2.toFixed(3)}`, a.L + 10, a.T + 16, { color: P.blue, alpha: f });
        a.chip(`Φ(d₁) = ${data.P1.toFixed(3)}`, a.L + 10, a.T + 44, { color: P.emerald, bg: "rgba(0,164,114,0.12)", alpha: f });
        a.note("d₁ = d₂ + τ  — exactly one standard deviation", a.L + 10, a.B - 16, { color: P.muted, size: 11.5 });
      } },

    { at: 47,
      caption: "That is the entire formula: **what you collect** (weighted by price, hence $\\Phi(d_1)$) minus **what you pay** (weighted only by whether you exercise, hence $\\Phi(d_2)$).",
      say: "And that is the entire formula. What you collect, weighted by the price, giving Phi of d one. Minus what you pay, weighted only by whether you exercise, giving Phi of d two.",
      draw({ ctx, W, H, t, dur, data, axes, fade }) {
        const f = fade(t, dur);
        const cx = W / 2;
        ctx.save();
        ctx.globalAlpha = f;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillStyle = P.ink;
        ctx.font = "600 17px Inter, system-ui, sans-serif";
        ctx.fillText("E (P − K)⁺", cx, H * 0.28);
        ctx.font = "700 15px ui-monospace, monospace";
        ctx.fillStyle = P.emerald;
        ctx.fillText(`E(P) · Φ(d₁)`, cx - 96, H * 0.5);
        ctx.fillStyle = P.ink;
        ctx.font = "600 18px Inter, system-ui, sans-serif";
        ctx.fillText("−", cx, H * 0.5);
        ctx.fillStyle = P.blue;
        ctx.font = "700 15px ui-monospace, monospace";
        ctx.fillText(`K · Φ(d₂)`, cx + 92, H * 0.5);
        ctx.font = "500 12.5px Inter, system-ui, sans-serif";
        ctx.fillStyle = P.muted;
        ctx.fillText("what you collect", cx - 96, H * 0.5 + 26);
        ctx.fillText("what you pay", cx + 92, H * 0.5 + 26);
        ctx.fillStyle = P.muted;
        ctx.font = "500 12.5px Inter, system-ui, sans-serif";
        ctx.fillText("…averaged only over the futures where you exercise", cx, H * 0.76);
        ctx.restore();
      } },
  ],
};

/* =================================================================== f3 */

const F3 = (() => {
  const path = gbmPath({ S0: 100, nu: 0.05, sigma: 0.22, T: 1, n: 252, seed: 19 });
  const many = Array.from({ length: 24 }, (_, i) =>
    gbmPath({ S0: 100, nu: 0.05, sigma: 0.22, T: 1, n: 252, seed: 100 + i * 7 }));
  return { path, many, nu: 0.05, sigma: 0.22, mu: 0.05 + 0.22 ** 2 / 2 };
})();

const f3 = {
  title: "A price path being built, one shock at a time",
  blurb: "Geometric Brownian motion is one sentence: the log of the price is a straight line with noise piled on, and the noise never washes out.",
  duration: 56,
  data: F3,
  takeaway: "Two numbers, easy to confuse: $\\nu=0.05$ is the drift you see on the log scale, $\\mu=\\nu+\\sigma^2/2=0.074$ is the drift you see in the price. The gap is pure volatility.",
  scenes: [
    { at: 0,
      caption: "On the **log** scale the model is a straight line — expected growth $\\nu t$ — and nothing else.",
      say: "On the log scale, the model is just a straight line. Expected growth, nu times t. Nothing else.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 1], y: [-0.35, 0.45], W, H });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 0.5, 1], ys: [-0.3, 0, 0.3], xfmt: (v) => `${(v * 12).toFixed(0)}m`, yfmt: (v) => v.toFixed(2) });
        const k = easeOut(clamp01(t / 2.4));
        a.line([[0, 0], [k, data.nu * k]], { color: P.amber, width: 2.4, dash: [6, 4] });
        a.note("ν t  — the trend", a.sx(0.55), a.sy(0.1), { color: P.amber, size: 12, weight: 600 });
        a.note("log price, relative to today", 16, 22, { color: P.muted, size: 11 });
      } },

    { at: 7,
      caption: "Now let the shocks arrive. Each one is a small independent nudge — and crucially, **each is added to the level and never taken back**.",
      say: "Now let the shocks arrive. Each one is a small, independent nudge. And crucially, each one is added to the level and never taken back.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 1], y: [-0.35, 0.45], W, H });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 0.5, 1], ys: [-0.3, 0, 0.3], xfmt: (v) => `${(v * 12).toFixed(0)}m`, yfmt: (v) => v.toFixed(2) });
        a.line([[0, 0], [1, data.nu]], { color: P.amber, width: 2, dash: [6, 4], alpha: 0.75 });
        const k = clamp01(t / (dur - 1));
        const n = Math.max(2, Math.round(252 * easeOut(k)));
        const p = data.path;
        const pts = p.t.slice(0, n).map((tt, i) => [tt, p.logS[i] - p.logS[0]]);
        a.line(pts, { color: P.blue, width: 2 });
        if (n > 4) {
          const last = pts[pts.length - 1];
          a.dots([last], { color: P.blue, r: 4 });
          a.chip(`day ${n} of 252`, a.R - 10, a.T + 16, { align: "right" });
        }
      } },

    { at: 18,
      caption: "The finished path wanders around the trend but is **never pulled back to it**. That is what \"independent increments\" buys — and what makes the series non-stationary.",
      say: "The finished path wanders around the trend, but is never pulled back toward it. That's what independent increments buys you. It is also exactly what makes the series non-stationary.",
      draw({ ctx, W, H, t, dur, data, axes, fade }) {
        const a = axes(ctx, { x: [0, 1], y: [-0.35, 0.45], W, H });
        const f = fade(t, dur);
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 0.5, 1], ys: [-0.3, 0, 0.3], xfmt: (v) => `${(v * 12).toFixed(0)}m`, yfmt: (v) => v.toFixed(2) });
        const p = data.path;
        // the sqrt(t) cone
        const k = easeOut(clamp01(t / 2.4));
        const hi = linspace(0, 1, 60).map((tt) => [tt, data.nu * tt + 2 * data.sigma * Math.sqrt(tt) * k]);
        const lo = linspace(1, 0, 60).map((tt) => [tt, data.nu * tt - 2 * data.sigma * Math.sqrt(tt) * k]);
        a.area([...hi, ...lo], -0.35, { color: "rgba(33,112,228,0.07)", alpha: f });
        a.line(hi, { color: P.blue, width: 1.2, dash: [4, 4], alpha: f * 0.7 });
        a.line(lo.slice().reverse(), { color: P.blue, width: 1.2, dash: [4, 4], alpha: f * 0.7 });
        a.line([[0, 0], [1, data.nu]], { color: P.amber, width: 2, dash: [6, 4] });
        a.line(p.t.map((tt, i) => [tt, p.logS[i] - p.logS[0]]), { color: P.blue, width: 2 });
        if (k > 0.7) a.note("±2σ√t  — uncertainty widens like a square root", a.L + 10, a.T + 18, { color: P.blue, size: 11.5, weight: 600 });
      } },

    { at: 29,
      caption: "Twenty-four paths from the same model. They fan out in a **square-root cone**, not a straight-sided one: four times the horizon, only twice the spread.",
      say: "Here are twenty four paths from the same model. They fan out in a square root cone, not a straight sided one. Four times the horizon gives only twice the spread.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 1], y: [-0.55, 0.65], W, H });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 0.5, 1], ys: [-0.5, 0, 0.5], xfmt: (v) => `${(v * 12).toFixed(0)}m`, yfmt: (v) => v.toFixed(2) });
        const k = clamp01(t / (dur - 1.5));
        const show = Math.round(data.many.length * easeOut(k));
        for (let i = 0; i < show; i++) {
          const p = data.many[i];
          a.line(p.t.map((tt, j) => [tt, p.logS[j] - p.logS[0]]), { color: P.blue, width: 1.1, alpha: 0.32 });
        }
        a.line([[0, 0], [1, data.nu]], { color: P.amber, width: 2.4, dash: [6, 4] });
        const hi = linspace(0, 1, 60).map((tt) => [tt, data.nu * tt + 2 * data.sigma * Math.sqrt(tt)]);
        const lo = linspace(0, 1, 60).map((tt) => [tt, data.nu * tt - 2 * data.sigma * Math.sqrt(tt)]);
        a.line(hi, { color: P.ink, width: 1.4, dash: [5, 4], alpha: 0.65 });
        a.line(lo, { color: P.ink, width: 1.4, dash: [5, 4], alpha: 0.65 });
        a.chip(`${show} paths`, a.R - 10, a.T + 16, { align: "right" });
      } },

    { at: 41,
      caption: "Exponentiate and you are back in dollars. The symmetric spread on the log scale becomes a **lopsided** one: bounded below by zero, with a long tail upward.",
      say: "Now exponentiate, and you are back in dollars. The symmetric spread on the log scale becomes a lopsided one. Bounded below by zero, with a long tail stretching upward.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 1], y: [55, 190], W, H });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 0.5, 1], ys: [60, 100, 140, 180], xfmt: (v) => `${(v * 12).toFixed(0)}m`, yfmt: (v) => `$${v}` });
        const k = easeOut(clamp01(t / 2.6));
        for (const p of data.many) {
          a.line(p.t.map((tt, j) => [tt, lerp(100 + (p.logS[j] - p.logS[0]) * 100, p.S[j], k)]),
            { color: P.emerald, width: 1.1, alpha: 0.3 });
        }
        a.line(linspace(0, 1, 60).map((tt) => [tt, 100 * Math.exp(data.mu * tt)]), { color: P.emerald, width: 2.6 });
        a.line(linspace(0, 1, 60).map((tt) => [tt, 100 * Math.exp(data.nu * tt)]), { color: P.amber, width: 2, dash: [6, 4] });
        a.hline(100, { color: P.grid, dash: null });
        if (k > 0.8) {
          a.chip(`E(S) grows at μ = ${pc(data.mu)}`, a.L + 10, a.T + 16, { color: P.emerald, bg: "rgba(0,164,114,0.12)" });
          a.chip(`median grows at ν = ${pc(data.nu)}`, a.L + 10, a.T + 44, { color: P.amber, bg: "rgba(194,129,10,0.12)" });
        }
      } },

    { at: 50,
      caption: "And there is the catch: the **mean** grows faster than the **median**. Zero log drift would still give you a rising average — that gap is $\\sigma^2/2$.",
      say: "And there is the catch. The mean grows faster than the median. Even zero log drift would still give you a rising average price. That gap is sigma squared over two.",
      draw({ ctx, W, H, t, dur, data, axes, fade }) {
        const a = axes(ctx, { x: [0, 1], y: [95, 125], W, H });
        const f = fade(t, dur);
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 0.5, 1], ys: [100, 110, 120], xfmt: (v) => `${(v * 12).toFixed(0)}m`, yfmt: (v) => `$${v}` });
        const mean = linspace(0, 1, 60).map((tt) => [tt, 100 * Math.exp(data.mu * tt)]);
        const med = linspace(0, 1, 60).map((tt) => [tt, 100 * Math.exp(data.nu * tt)]);
        a.area([...mean, ...med.slice().reverse()], 95, { color: "rgba(0,164,114,0.12)", alpha: f });
        a.line(mean, { color: P.emerald, width: 2.8 });
        a.line(med, { color: P.amber, width: 2.4, dash: [6, 4] });
        a.label("mean  E(S) = S₀e^{μt}", { x: 0.06, y: 121, color: P.emerald, size: 12.5 });
        a.label("median  S₀e^{νt}", { x: 0.06, y: 117, color: P.amber, size: 12.5 });
        a.chip(`μ − ν = σ²/2 = ${pc(data.sigma ** 2 / 2)}`, a.R - 10, a.B - 18, { align: "right", color: P.emerald, bg: "rgba(0,164,114,0.12)", alpha: f });
      } },
  ],
};

/* =================================================================== f4 */

const F4 = (() => {
  const sd = 0.02, ann = sd * Math.sqrt(252), wrong = sd * 252;
  const nrm = normals(31);
  const daily = Array.from({ length: 252 }, () => sd * nrm());
  const cum = daily.reduce((acc, v) => (acc.push((acc[acc.length - 1] ?? 0) + v), acc), []);
  return { sd, ann, wrong, daily, cum, nu: 0.0003 };
})();

const f4 = {
  title: "Why volatility scales with $\\sqrt{k}$, not $k$",
  blurb: "The single most-made arithmetic error in this course, and the one-line reason it is wrong.",
  duration: 50,
  data: F4,
  takeaway: "Variances add; standard deviations do not. Over $k$ days some shocks are up and some are down, and they partly cancel — the gap between $\\sigma k$ and $\\sigma\\sqrt{k}$ *is* that cancellation.",
  scenes: [
    { at: 0,
      caption: "252 daily log returns, each with standard deviation $0.02$. Individually tiny, and as many negative as positive.",
      say: "Here are two hundred and fifty two daily log returns, each with a standard deviation of two percent. Individually tiny, and as many negative as positive.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 252], y: [-0.07, 0.07], W, H });
        a.grid(6, 4).frame();
        a.ticks({ xs: [0, 126, 252], ys: [-0.05, 0, 0.05], yfmt: (v) => pc(v) });
        a.hline(0, { color: P.grid, dash: null });
        const n = Math.round(252 * clamp01(t / (dur - 1)));
        a.bars(data.daily.slice(0, n).map((v, i) => [i, v]),
          { color: P.blue, width: 2, alpha: 0.7 });
        a.chip(`daily SD = ${pc(data.sd)}`, a.L + 10, a.T + 16);
      } },

    { at: 9,
      caption: "Add them up as they arrive. Because log returns **sum**, the running total *is* the multi-day return — and it zig-zags rather than marching.",
      say: "Now add them up as they arrive. Because log returns sum, the running total is literally the multi day return. Notice it zig zags rather than marching in one direction.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 252], y: [-0.45, 0.45], W, H });
        a.grid(6, 4).frame();
        a.ticks({ xs: [0, 126, 252], ys: [-0.3, 0, 0.3], yfmt: (v) => pc(v) });
        a.hline(0, { color: P.grid, dash: null });
        const n = Math.max(2, Math.round(252 * clamp01(t / (dur - 1))));
        a.line(data.cum.slice(0, n).map((v, i) => [i, v]), { color: P.blue, width: 2.2 });
        a.chip(`sum after ${n} days = ${pc(data.cum[n - 1])}`, a.L + 10, a.T + 16);
      } },

    { at: 19,
      caption: "Here is the wrong answer and the right one. Multiplying the SD by $k$ gives the straight red cone. The truth is the green $\\sqrt{k}$ curve — far narrower.",
      say: "Here is the wrong answer and the right one, side by side. Multiplying the standard deviation by k gives the straight red cone. The truth is the green square root curve, and it is far narrower.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 252], y: [-0.75, 0.75], W, H });
        a.grid(6, 4).frame();
        a.ticks({ xs: [0, 126, 252], ys: [-0.6, 0, 0.6], yfmt: (v) => pc(v) });
        a.hline(0, { color: P.grid, dash: null });
        const k = easeOut(clamp01(t / 3));
        const lin = linspace(0, 252 * k, 60);
        a.line(lin.map((d) => [d, data.sd * d]), { color: P.red, width: 2, dash: [6, 4] });
        a.line(lin.map((d) => [d, -data.sd * d]), { color: P.red, width: 2, dash: [6, 4] });
        a.line(lin.map((d) => [d, data.sd * Math.sqrt(d)]), { color: P.emerald, width: 2.6 });
        a.line(lin.map((d) => [d, -data.sd * Math.sqrt(d)]), { color: P.emerald, width: 2.6 });
        a.line(data.cum.map((v, i) => [i, v]), { color: P.blue, width: 1.6, alpha: 0.75 });
        if (k > 0.6) {
          a.note("σ·k   ✗", a.sx(200), a.sy(0.52), { color: P.red, size: 12.5, weight: 700 });
          a.note("σ·√k  ✓", a.sx(200), a.sy(0.21), { color: P.emerald, size: 12.5, weight: 700 });
        }
      } },

    { at: 31,
      caption: "At one year the difference is not subtle: $0.02\\times252=5.04$, an absurd **504%**. The correct $0.02\\sqrt{252}$ is about **32%** — a believable equity volatility.",
      say: "At one year the difference is not subtle. Two percent times two fifty two is five point oh four — an absurd five hundred and four percent. The correct figure, two percent times the square root of two fifty two, is about thirty two percent. A believable equity volatility.",
      draw({ ctx, W, H, t, dur, data, axes, fade }) {
        const f = fade(t, dur);
        ctx.save();
        ctx.globalAlpha = f;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        const cx = W / 2;
        ctx.font = "500 13px Inter, system-ui, sans-serif";
        ctx.fillStyle = P.muted;
        ctx.fillText("annualizing a 2% daily volatility", cx, H * 0.2);

        ctx.font = "700 15px ui-monospace, monospace";
        ctx.fillStyle = P.red;
        ctx.fillText(`0.02 × 252  =  ${data.wrong.toFixed(2)}   →   ${(data.wrong * 100).toFixed(0)}%`, cx, H * 0.42);
        ctx.font = "500 12px Inter, system-ui, sans-serif";
        ctx.fillText("nobody's stock moves 504% a year", cx, H * 0.42 + 22);

        ctx.font = "700 17px ui-monospace, monospace";
        ctx.fillStyle = P.emerald;
        ctx.fillText(`0.02 × √252  =  ${data.ann.toFixed(3)}   →   ${(data.ann * 100).toFixed(1)}%`, cx, H * 0.68);
        ctx.font = "500 12px Inter, system-ui, sans-serif";
        ctx.fillStyle = P.muted;
        ctx.fillText("if your annualized vol exceeds 100%, you multiplied by k", cx, H * 0.68 + 24);
        ctx.restore();
      } },

    { at: 40,
      caption: "One more consequence, and it matters: the **mean** scales with $k$ in full while the noise only scales with $\\sqrt{k}$. Given enough time, the trend outruns the noise.",
      say: "One more consequence, and it matters. The mean scales with k in full, while the noise only scales with the square root of k. So given enough time, the trend outruns the noise.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 2520], y: [0, 1.2], W, H });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 1260, 2520], ys: [0, 0.5, 1], xfmt: (v) => `${(v / 252).toFixed(0)}y`, yfmt: (v) => v.toFixed(1) });
        const k = easeOut(clamp01(t / 3.2));
        const xs = linspace(0, 2520 * k, 80);
        a.line(xs.map((d) => [d, data.nu * d]), { color: P.emerald, width: 2.6 });
        a.line(xs.map((d) => [d, data.sd * Math.sqrt(d)]), { color: P.blue, width: 2.6 });
        a.note("drift  ν·k", a.sx(1900), a.sy(0.72), { color: P.emerald, size: 12.5, weight: 700 });
        a.note("noise  σ·√k", a.sx(1900), a.sy(0.92), { color: P.blue, size: 12.5, weight: 700 });
        const cross = (data.sd / data.nu) ** 2;
        if (k > 0.6 && cross < 2520) {
          a.vline(cross, { color: P.muted });
          a.note("they cross here", a.sx(cross) + 8, a.T + 20, { color: P.muted, size: 11.5 });
        }
      } },
  ],
};

/* =================================================================== f5 */

const F5 = (() => {
  const nrm = normals(57);
  // a bimodal sample, so over-smoothing visibly destroys a real feature
  const x = Array.from({ length: 90 }, (_, i) => (i % 2 ? -1.15 : 1.15) + 0.42 * nrm());
  const grid = linspace(-3.2, 3.2, 220);
  const truth = grid.map((g) => 0.5 * normPdf((g + 1.15) / 0.42) / 0.42 + 0.5 * normPdf((g - 1.15) / 0.42) / 0.42);
  return { x, grid, truth };
})();

const f5 = {
  title: "The bandwidth dial, and what it costs you",
  blurb: "A kernel density estimate has one knob that matters. Watch both ways it fails.",
  duration: 50,
  data: F5,
  takeaway: "$h$ answers one question: how far away is a data point still allowed to speak about this location? Too few neighbours and you hear noise; too many and you hear the average of things that aren't alike.",
  scenes: [
    { at: 0,
      caption: "Ninety observations, drawn as ticks. Your job is to guess the density that produced them — without assuming a formula for it.",
      say: "Ninety observations, drawn here as ticks along the axis. Your job is to guess the density that produced them, without assuming any formula for it.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-3.2, 3.2], y: [0, 0.62], W, H });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-3, -1.5, 0, 1.5, 3], ys: [], xfmt: (v) => v.toFixed(1) });
        const n = Math.round(data.x.length * clamp01(t / (dur - 1)));
        a.bars(data.x.slice(0, n).map((v) => [v, 0.05]), { color: P.blue, width: 1.6, alpha: 0.65 });
        a.chip(`n = ${n}`, a.L + 10, a.T + 16);
      } },

    { at: 8,
      caption: "The idea is simple: drop one small **bump** on every data point, then add them up. The total height at any spot is your density estimate there.",
      say: "The idea is simple. Drop one small bump on top of every data point, then add them all up. The total height at any given spot is your density estimate there.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-3.2, 3.2], y: [0, 0.62], W, H });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-3, -1.5, 0, 1.5, 3], ys: [], xfmt: (v) => v.toFixed(1) });
        a.bars(data.x.map((v) => [v, 0.04]), { color: P.muted, width: 1.4, alpha: 0.5 });
        const h = 0.3, k = clamp01(t / (dur - 1.5));
        const n = Math.round(data.x.length * easeOut(k));
        for (let i = 0; i < n; i++) {
          const xi = data.x[i];
          const b = linspace(xi - 3 * h, xi + 3 * h, 26).map((g) => [g, normPdf((g - xi) / h) / (h * data.x.length) * 6]);
          a.line(b, { color: P.blue, width: 1, alpha: 0.35 });
        }
        if (k > 0.55) a.line(data.grid.map((g, i) => [g, kde(data.x, h, [g])[0]]), { color: P.blue, width: 2.6 });
      } },

    { at: 19,
      caption: "Now turn the dial down. With $h$ tiny each bump is a spike, and the estimate traces **this particular sample** — including its accidents.",
      say: "Now turn the dial down. With h very small, each bump is a narrow spike, and the estimate traces this particular sample, including all of its accidents.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-3.2, 3.2], y: [0, 0.62], W, H });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-3, -1.5, 0, 1.5, 3], ys: [], xfmt: (v) => v.toFixed(1) });
        a.bars(data.x.map((v) => [v, 0.03]), { color: P.muted, width: 1.4, alpha: 0.45 });
        a.line(data.grid.map((g, i) => [g, data.truth[i]]), { color: P.muted, width: 1.6, dash: [5, 4] });
        const h = lerp(0.36, 0.045, easeOut(clamp01(t / 3.2)));
        a.line(data.grid.map((g) => [g, kde(data.x, h, [g])[0]]), { color: P.red, width: 2.2 });
        a.chip(`h = ${h.toFixed(3)}`, a.L + 10, a.T + 16, { color: P.red, bg: "rgba(186,26,26,0.10)" });
        a.note("high variance — re-sample and this changes completely", a.L + 10, a.T + 42, { color: P.red, size: 11.5, weight: 600 });
      } },

    { at: 30,
      caption: "Turn it up instead and the two peaks **melt into one**. Stable across samples — and stably wrong. A real feature has been smoothed out of existence.",
      say: "Turn it up instead, and watch the two peaks melt into one. This estimate is stable across samples, and stably wrong. A real feature has just been smoothed out of existence.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-3.2, 3.2], y: [0, 0.62], W, H });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-3, -1.5, 0, 1.5, 3], ys: [], xfmt: (v) => v.toFixed(1) });
        a.bars(data.x.map((v) => [v, 0.03]), { color: P.muted, width: 1.4, alpha: 0.45 });
        a.line(data.grid.map((g, i) => [g, data.truth[i]]), { color: P.muted, width: 1.6, dash: [5, 4] });
        const h = lerp(0.22, 1.5, easeOut(clamp01(t / 3.6)));
        a.line(data.grid.map((g) => [g, kde(data.x, h, [g])[0]]), { color: P.amber, width: 2.6 });
        a.chip(`h = ${h.toFixed(3)}`, a.L + 10, a.T + 16, { color: P.amber, bg: "rgba(194,129,10,0.12)" });
        if (h > 0.8) a.note("high bias — the second peak is gone", a.L + 10, a.T + 42, { color: P.amber, size: 11.5, weight: 600 });
      } },

    { at: 41,
      caption: "Somewhere between is the $h$ that minimises MSE. Note **where** the two choices disagree most: in the **tails** — exactly what we use a KDE of returns to look at.",
      say: "Somewhere in between is the h that minimises mean squared error. But notice where the two bad choices disagree the most — in the tails. Which is exactly what we use a KDE of returns to look at in the first place.",
      draw({ ctx, W, H, t, dur, data, axes, fade }) {
        const a = axes(ctx, { x: [-3.2, 3.2], y: [0, 0.62], W, H });
        const f = fade(t, dur);
        a.grid(6, 4).frame();
        a.ticks({ xs: [-3, -1.5, 0, 1.5, 3], ys: [], xfmt: (v) => v.toFixed(1) });
        a.line(data.grid.map((g, i) => [g, data.truth[i]]), { color: P.muted, width: 2, dash: [5, 4] });
        a.line(data.grid.map((g) => [g, kde(data.x, 0.06, [g])[0]]), { color: P.red, width: 1.6, alpha: 0.75 });
        a.line(data.grid.map((g) => [g, kde(data.x, 1.1, [g])[0]]), { color: P.amber, width: 1.8, alpha: 0.8 });
        a.line(data.grid.map((g) => [g, kde(data.x, 0.3, [g])[0]]), { color: P.emerald, width: 2.8 });
        a.chip("h too small — noise", a.L + 10, a.T + 16, { color: P.red, bg: "rgba(186,26,26,0.10)", alpha: f });
        a.chip("h too large — blur", a.L + 10, a.T + 44, { color: P.amber, bg: "rgba(194,129,10,0.12)", alpha: f });
        a.chip("about right", a.L + 10, a.T + 72, { color: P.emerald, bg: "rgba(0,164,114,0.12)", alpha: f });
      } },
  ],
};

/* =================================================================== f6 */

const F6 = (() => {
  const nrm = normals(71);
  const n = 400;
  const gauss = Array.from({ length: n }, () => nrm());
  const fat = Array.from({ length: n }, () => tSample(nrm, 3) * 0.6);
  const qq = (s) => {
    const srt = [...s].sort((a, b) => a - b);
    const m = moments(srt);
    return srt.map((v, i) => [normQuantile((i + 0.5) / srt.length), (v - m.mean) / m.sd]);
  };
  return { gauss, fat, qqG: qq(gauss), qqF: qq(fat), mG: moments(gauss), mF: moments(fat) };
})();

const f6 = {
  title: "Fat tails, caught on a QQ plot",
  blurb: "What a normality violation actually looks like — and why it always shows up at the ends of the line.",
  duration: 52,
  data: F6,
  takeaway: "Jarque-Bera multiplies by $n/6$. A fixed departure that gives $T=4$ at $n=300$ gives $T=40$ at $n=3000$ — which is why returns always reject, and why the statistic tells you *that*, never *how badly*.",
  scenes: [
    { at: 0,
      caption: "A QQ plot sorts your data and plots it against what a normal **should** have produced. If the data really are normal, the points land on a straight line.",
      say: "A QQ plot sorts your data, then plots it against what a normal distribution should have produced. If the data really are normal, the points land on a straight line.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-3.6, 3.6], y: [-5, 5], W, H });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-3, 0, 3], ys: [-4, 0, 4], xfmt: (v) => v.toFixed(0), yfmt: (v) => v.toFixed(0) });
        a.line([[-3.6, -3.6], [3.6, 3.6]], { color: P.muted, width: 1.6, dash: [5, 4] });
        const n = Math.round(data.qqG.length * clamp01(t / (dur - 1)));
        a.dots(data.qqG.slice(0, n), { color: P.blue, r: 2.2, alpha: 0.65 });
        a.note("theoretical normal quantile", W / 2 - 60, H - 14, { color: P.muted, size: 11 });
        a.chip("simulated normal data", a.L + 10, a.T + 16);
      } },

    { at: 10,
      caption: "Now swap in fat-tailed data — a $t$ with 3 degrees of freedom, scaled to the same spread. The middle still hugs the line.",
      say: "Now swap in fat tailed data. A t distribution with three degrees of freedom, rescaled to the same spread. Notice the middle still hugs the line perfectly.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-3.6, 3.6], y: [-5, 5], W, H });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-3, 0, 3], ys: [-4, 0, 4], xfmt: (v) => v.toFixed(0), yfmt: (v) => v.toFixed(0) });
        a.line([[-3.6, -3.6], [3.6, 3.6]], { color: P.muted, width: 1.6, dash: [5, 4] });
        const k = easeOut(clamp01(t / 2.6));
        const pts = data.qqG.map(([qx, qy], i) => [qx, lerp(qy, data.qqF[i][1], k)]);
        a.dots(pts, { color: P.amber, r: 2.2, alpha: 0.7 });
        a.chip("t(3), same spread", a.L + 10, a.T + 16, { color: P.amber, bg: "rgba(194,129,10,0.12)" });
      } },

    { at: 20,
      caption: "The ends are where it breaks. The lowest points sit **below** the line and the highest sit **above** — the tell-tale S-bend of tails heavier than normal.",
      say: "But the ends are where it breaks. The lowest points sit below the line, and the highest sit above it. That S bend is the tell tale sign of tails heavier than normal.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [-3.6, 3.6], y: [-5, 5], W, H });
        a.grid(6, 4).frame();
        a.ticks({ xs: [-3, 0, 3], ys: [-4, 0, 4], xfmt: (v) => v.toFixed(0), yfmt: (v) => v.toFixed(0) });
        a.line([[-3.6, -3.6], [3.6, 3.6]], { color: P.muted, width: 1.6, dash: [5, 4] });
        a.dots(data.qqF, { color: P.amber, r: 2.2, alpha: 0.55 });
        const f = clamp01(t / 1.6);
        const tail = data.qqF.filter(([qx]) => Math.abs(qx) > 1.9);
        a.dots(tail, { color: P.red, r: 3.4, alpha: f });
        if (f > 0.5) {
          a.note("below the line →", a.sx(-3.3), a.sy(-3.4), { color: P.red, size: 11.5, weight: 600 });
          a.note("← above the line", a.sx(1.6), a.sy(3.6), { color: P.red, size: 11.5, weight: 600 });
          a.note("bigger extremes than a normal allows", a.L + 10, a.T + 20, { color: P.red, size: 12, weight: 600 });
        }
      } },

    { at: 31,
      caption: "Measured: kurtosis climbs from about 3 to well past it, while skewness stays near zero. **Symmetric and still badly non-normal** — which is why Jarque-Bera tests both.",
      say: "Measured, kurtosis climbs from about three to well past it, while skewness stays near zero. Symmetric, and still badly non normal. Which is exactly why Jarque Bera has to test both.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 1], y: [0, 1], W, H });
        const k = easeOut(clamp01(t / 2.6));
        const rows = [
          ["skewness", data.mG.skew, data.mF.skew, "normal ≈ 0"],
          ["kurtosis", data.mG.kurt, data.mF.kurt, "normal = 3"],
        ];
        ctx.save();
        ctx.textBaseline = "middle";
        rows.forEach(([name, g, fv, ref], i) => {
          const y = H * (0.3 + i * 0.26);
          ctx.textAlign = "left";
          ctx.font = "600 13px Inter, system-ui, sans-serif";
          ctx.fillStyle = P.ink; ctx.fillText(name, 40, y);
          ctx.font = "500 11.5px Inter, system-ui, sans-serif";
          ctx.fillStyle = P.muted; ctx.fillText(ref, 40, y + 18);
          ctx.textAlign = "center";
          ctx.font = "700 20px ui-monospace, monospace";
          ctx.fillStyle = P.blue; ctx.fillText(g.toFixed(2), W * 0.52, y);
          ctx.fillStyle = P.amber;
          ctx.fillText(lerp(g, fv, k).toFixed(2), W * 0.78, y);
        });
        ctx.textAlign = "center";
        ctx.font = "500 12px Inter, system-ui, sans-serif";
        ctx.fillStyle = P.muted;
        ctx.fillText("normal sample", W * 0.52, H * 0.16);
        ctx.fillText("fat-tailed sample", W * 0.78, H * 0.16);
        ctx.restore();
      } },

    { at: 41,
      caption: "And the sting: $T=\\frac{n}{6}(\\ldots)$ scales **linearly with sample size**. Watch the same data reject harder and harder simply because there is more of it.",
      say: "And here's the sting. The Jarque Bera statistic scales linearly with sample size. Watch the very same data reject harder and harder, simply because there is more of it.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 5000], y: [0, 900], W, H });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 2500, 5000], ys: [0, 300, 600, 900], yfmt: (v) => String(v) });
        const m = data.mF;
        const per = (m.skew ** 2 + ((m.kurt - 3) ** 2) / 4) / 6;
        const k = easeOut(clamp01(t / 3.4));
        const xs = linspace(0, 5000 * k, 80);
        a.line(xs.map((n) => [n, n * per]), { color: P.red, width: 2.8 });
        a.hline(5.99, { color: P.emerald, width: 2 });
        a.note("χ²₂ critical value = 5.99  (never moves)", a.L + 10, a.sy(5.99) - 14, { color: P.emerald, size: 11.5, weight: 600 });
        const nNow = Math.round(5000 * k);
        if (nNow > 200) a.chip(`n = ${nNow}   T = ${(nNow * per).toFixed(0)}`, a.L + 10, a.T + 16, { color: P.red, bg: "rgba(186,26,26,0.10)" });
      } },
  ],
};

/* =================================================================== f7 */

const F7 = (() => {
  const n = 220;
  const rev = ar1({ phi: 0.9, mu: 0, sd: 1, n, seed: 13 });
  const walk = ar1({ phi: 1, mu: 0, sd: 1, n, seed: 13 });   // identical shocks
  return { rev, walk, phi: 0.9, acfTheory: Array.from({ length: 20 }, (_, h) => 0.9 ** (h + 1)) };
})();

const f7 = {
  title: "Memory that fades, and memory that doesn't",
  blurb: "Two series, the very same shocks. The only difference is $\\phi$ — and it decides whether the series is stationary.",
  duration: 48,
  data: F7,
  takeaway: "Mean reversion and autocorrelation are not opposites. An AR(1) with $\\phi=0.9$ has both, strongly, and they are the same fact: the series is pulled home *slowly*.",
  scenes: [
    { at: 0,
      caption: "An AR(1) keeps a fraction $\\phi$ of yesterday's **deviation from the mean**, then adds fresh news. Here $\\phi=0.9$.",
      say: "An AR one model keeps a fraction phi of yesterday's deviation from the mean, then adds fresh news on top. Here phi is nought point nine.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 220], y: [-9, 9], W, H });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 110, 220], ys: [-6, 0, 6] });
        a.hline(0, { color: P.amber, width: 1.8, dash: [6, 4] });
        const n = Math.max(2, Math.round(220 * clamp01(t / (dur - 1))));
        a.line(data.rev.slice(0, n).map((v, i) => [i, v]), { color: P.blue, width: 2 });
        a.note("μ", a.L - 16, a.sy(0), { color: P.amber, size: 12, weight: 700 });
        a.chip("φ = 0.9", a.L + 10, a.T + 16);
      } },

    { at: 8,
      caption: "Now the same shocks, but $\\phi=1$ — nothing decays. Watch them separate: one keeps coming home, the other never does.",
      say: "Now the same shocks, but with phi equal to one, so nothing decays. Watch the two separate. One keeps coming home. The other never does.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 220], y: [-16, 16], W, H });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 110, 220], ys: [-12, 0, 12] });
        a.hline(0, { color: P.amber, width: 1.6, dash: [6, 4] });
        const n = Math.max(2, Math.round(220 * clamp01(t / (dur - 1))));
        a.line(data.rev.slice(0, n).map((v, i) => [i, v]), { color: P.blue, width: 2 });
        a.line(data.walk.slice(0, n).map((v, i) => [i, v]), { color: P.red, width: 2 });
        a.note("φ = 0.9  stationary", a.L + 10, a.T + 18, { color: P.blue, size: 12, weight: 600 });
        a.note("φ = 1  random walk", a.L + 10, a.T + 38, { color: P.red, size: 12, weight: 600 });
      } },

    { at: 20,
      caption: "Follow a single shock. At $\\phi=0.9$ it is multiplied by $0.9$ every step: $0.9,\\,0.81,\\,0.73\\ldots$ — a geometric fade back to the mean.",
      say: "Follow a single shock. At phi equal to nought point nine, it gets multiplied by nought point nine every step. Point nine, point eight one, point seven three. A geometric fade back to the mean.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 40], y: [-0.2, 1.15], W, H });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 20, 40], ys: [0, 0.5, 1], yfmt: (v) => v.toFixed(1) });
        a.hline(0, { color: P.amber, width: 1.6, dash: [6, 4] });
        const k = clamp01(t / (dur - 1.2));
        const n = Math.round(40 * easeOut(k));
        a.bars(Array.from({ length: n }, (_, i) => [i, data.phi ** i]), { color: P.blue, width: 4, alpha: 0.85 });
        a.line(linspace(0, 40, 60).map((h) => [h, 1, 0].slice(0, 2)).map(([h]) => [h, data.phi ** h]),
          { color: P.blue, width: 1.6, dash: [4, 4], alpha: 0.6 });
        a.line(linspace(0, 40, 60).map((h) => [h, 1]), { color: P.red, width: 2, dash: [5, 4] });
        a.note("φ = 1 — the shock never fades", a.sx(12), a.sy(1) - 14, { color: P.red, size: 11.5, weight: 600 });
        if (n > 6) a.chip(`after ${n} steps: ${(data.phi ** n).toFixed(3)} left`, a.R - 10, a.T + 16, { align: "right" });
      } },

    { at: 32,
      caption: "That decay **is** the ACF. Bars shrinking by a constant *factor* means AR-type memory — and the lag-1 bar reads off $\\phi$ directly.",
      say: "And that decay is exactly the autocorrelation function. When you see bars shrinking by a constant factor, you are looking at AR type memory. The lag one bar reads off phi directly.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 21], y: [-0.25, 1.05], W, H });
        a.grid(6, 4).frame();
        a.ticks({ xs: [1, 5, 10, 15, 20], ys: [0, 0.5, 1], yfmt: (v) => v.toFixed(1) });
        const bandHi = 1.96 / Math.sqrt(data.rev.length);
        a.band(-bandHi, bandHi, { color: "rgba(33,112,228,0.10)" });
        a.hline(0, { color: P.grid, dash: null });
        const emp = acf(data.rev, 20);
        const k = clamp01(t / (dur - 1));
        const n = Math.round(20 * easeOut(k));
        a.bars(emp.slice(0, n).map((v, i) => [i + 1, v]), { color: P.blue, width: 6 });
        a.dots(data.acfTheory.slice(0, n).map((v, i) => [i + 1, v]), { color: P.amber, r: 3 });
        if (k > 0.4) a.note("dots = φ^h, the theoretical value", a.R - 10, a.T + 18, { color: P.amber, size: 11.5, weight: 600, align: "right" });
        a.note("shaded = not significantly different from zero", a.L + 10, a.B - 16, { color: P.muted, size: 11 });
      } },

    { at: 41,
      caption: "Contrast this with the GBM of Module 3, where shocks are **permanent**. That is the whole difference between a stationary series and a non-stationary one.",
      say: "Contrast this with the geometric Brownian motion of module three, where shocks are permanent. That is the whole difference between a stationary series and a non stationary one.",
      draw({ ctx, W, H, t, dur, data, axes, fade }) {
        const a = axes(ctx, { x: [0, 220], y: [-16, 16], W, H });
        const f = fade(t, dur);
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 110, 220], ys: [-12, 0, 12] });
        a.hline(0, { color: P.amber, width: 1.6, dash: [6, 4] });
        a.line(data.rev.map((v, i) => [i, v]), { color: P.blue, width: 2 });
        a.line(data.walk.map((v, i) => [i, v]), { color: P.red, width: 2, alpha: 0.9 });
        a.chip("|φ| < 1  → shocks decay → finite variance → stationary", a.L + 10, a.T + 16,
          { color: P.blue, alpha: f });
        a.chip("|φ| = 1  → shocks persist → variance grows → not stationary", a.L + 10, a.T + 44,
          { color: P.red, bg: "rgba(186,26,26,0.10)", alpha: f });
      } },
  ],
};

/* =================================================================== f8 */

const F8 = (() => {
  const g = garch({ omega: 8e-6, alpha: 0.08, beta: 0.91, n: 900, seed: 37 });
  const sq = g.x.map((v) => v * v);
  return { x: g.x, sq, acfX: acf(g.x, 20), acfSq: acf(sq, 20), band: 1.96 / Math.sqrt(900) };
})();

const f8 = {
  title: "The same series, two autocorrelation functions",
  blurb: "Run the ACF on returns and it looks like noise. Run it on *squared* returns and the picture changes completely. That contrast is the whole motivation for Part 4.",
  duration: 46,
  data: F8,
  takeaway: "Uncorrelated is not independent. The levels carry no linear signal; the squares carry plenty. ARCH and GARCH exist precisely to reproduce that pattern.",
  scenes: [
    { at: 0,
      caption: "900 simulated log returns. Direction looks unpredictable — up and down with no discernible pattern.",
      say: "Here are nine hundred simulated log returns. The direction looks unpredictable. Up and down, with no discernible pattern.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 900], y: [-0.06, 0.06], W, H });
        a.grid(6, 4).frame();
        a.ticks({ xs: [0, 450, 900], ys: [-0.04, 0, 0.04], yfmt: (v) => pc(v) });
        a.hline(0, { color: P.grid, dash: null });
        const n = Math.round(900 * clamp01(t / (dur - 1)));
        a.line(data.x.slice(0, n).map((v, i) => [i, v]), { color: P.blue, width: 1, alpha: 0.85 });
      } },

    { at: 8,
      caption: "The ACF of the returns confirms it: every bar sits inside the significance band. **No linear predictability** — markets look efficient.",
      say: "The autocorrelation function of the returns confirms it. Every bar sits inside the significance band. No linear predictability. Markets look efficient.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 21], y: [-0.22, 0.6], W, H });
        a.grid(6, 4).frame();
        a.ticks({ xs: [1, 5, 10, 15, 20], ys: [0, 0.25, 0.5], yfmt: (v) => v.toFixed(2) });
        a.band(-data.band, data.band, { color: "rgba(33,112,228,0.12)" });
        a.hline(0, { color: P.grid, dash: null });
        const n = Math.round(20 * easeOut(clamp01(t / (dur - 1))));
        a.bars(data.acfX.slice(0, n).map((v, i) => [i + 1, v]), { color: P.blue, width: 6 });
        a.chip("ACF of  Xₜ", a.L + 10, a.T + 16);
        a.note("all inside the band", a.R - 10, a.T + 18, { color: P.muted, size: 11.5, align: "right" });
      } },

    { at: 17,
      caption: "Now square every value. Sign is gone; all that survives is **size**. Suddenly the clustering is unmistakable — quiet stretches and violent ones.",
      say: "Now square every value. The sign is gone, and all that survives is size. Suddenly the clustering is unmistakable. Quiet stretches, and violent ones.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 900], y: [0, 0.0022], W, H });
        a.grid(6, 4).frame();
        a.ticks({ xs: [0, 450, 900], ys: [0, 0.001, 0.002], yfmt: (v) => v.toFixed(4) });
        const k = easeOut(clamp01(t / 2.4));
        const pts = data.x.map((v, i) => [i, lerp(Math.abs(v) * 0.0, v * v, k)]);
        a.bars(pts, { color: P.amber, width: 1, alpha: 0.85 });
        a.chip("Xₜ²", a.L + 10, a.T + 16, { color: P.amber, bg: "rgba(194,129,10,0.12)" });
      } },

    { at: 27,
      caption: "And the ACF of the squares is nothing like the first one — bars far outside the band, decaying slowly across twenty lags.",
      say: "And the autocorrelation function of the squares looks nothing like the first one. Bars far outside the band, decaying slowly across twenty lags.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 21], y: [-0.22, 0.6], W, H });
        a.grid(6, 4).frame();
        a.ticks({ xs: [1, 5, 10, 15, 20], ys: [0, 0.25, 0.5], yfmt: (v) => v.toFixed(2) });
        a.band(-data.band, data.band, { color: "rgba(33,112,228,0.12)" });
        a.hline(0, { color: P.grid, dash: null });
        const n = Math.round(20 * easeOut(clamp01(t / (dur - 1))));
        a.bars(data.acfSq.slice(0, n).map((v, i) => [i + 1, v]), { color: P.amber, width: 6 });
        a.chip("ACF of  Xₜ²", a.L + 10, a.T + 16, { color: P.amber, bg: "rgba(194,129,10,0.12)" });
      } },

    { at: 36,
      caption: "Side by side. Same data. **Uncorrelated but not independent** — you cannot predict direction, but you can absolutely predict turbulence.",
      say: "Side by side. The same data, twice. Uncorrelated, but not independent. You cannot predict direction, but you can absolutely predict turbulence.",
      draw({ ctx, W, H, t, dur, data, axes, fade }) {
        const f = fade(t, dur);
        const half = W / 2;
        const A = axes(ctx, { x: [0, 21], y: [-0.22, 0.6], W: half, H, pad: { l: 46, r: 10, t: 34, b: 34 } });
        A.grid(4, 4).frame();
        A.ticks({ xs: [1, 10, 20], ys: [0, 0.25, 0.5], yfmt: (v) => v.toFixed(2) });
        A.band(-data.band, data.band, { color: "rgba(33,112,228,0.12)" });
        A.hline(0, { color: P.grid, dash: null });
        A.bars(data.acfX.map((v, i) => [i + 1, v]), { color: P.blue, width: 5, alpha: f });
        A.note("returns  Xₜ", A.L, A.T - 14, { color: P.blue, size: 12, weight: 700 });

        ctx.save();
        ctx.translate(half, 0);
        const B = axes(ctx, { x: [0, 21], y: [-0.22, 0.6], W: half, H, pad: { l: 46, r: 10, t: 34, b: 34 } });
        B.grid(4, 4).frame();
        B.ticks({ xs: [1, 10, 20], ys: [0, 0.25, 0.5], yfmt: (v) => v.toFixed(2) });
        B.band(-data.band, data.band, { color: "rgba(33,112,228,0.12)" });
        B.hline(0, { color: P.grid, dash: null });
        B.bars(data.acfSq.map((v, i) => [i + 1, v]), { color: P.amber, width: 5, alpha: f });
        B.note("squared  Xₜ²", B.L, B.T - 14, { color: P.amber, size: 12, weight: 700 });
        ctx.restore();
      } },
  ],
};

/* =================================================================== f9 */

const F9 = (() => {
  const n = 600;
  const nrm = normals(83);
  const g = garch({ omega: 8e-6, alpha: 0.09, beta: 0.9, n, seed: 91 });
  const sd = Math.sqrt(g.x.reduce((s, v) => s + v * v, 0) / n);
  const iid = Array.from({ length: n }, () => sd * nrm());
  const roll = (x, w) => x.map((_, i) => {
    if (i < w) return null;
    const s = x.slice(i - w, i);
    const m = s.reduce((a, v) => a + v, 0) / w;
    return Math.sqrt(s.reduce((a, v) => a + (v - m) ** 2, 0) / w);
  });
  return { iid, clustered: g.x, rollIid: roll(iid, 25), rollC: roll(g.x, 25), sd };
})();

const f9 = {
  title: "What volatility clustering looks like",
  blurb: "Two series with **identical** overall variance. One is independent, one is not — and you can tell them apart by eye.",
  duration: 44,
  data: F9,
  takeaway: "Both series have the same unconditional variance. The difference is entirely in the *conditional* variance — which is what ARCH and GARCH model, and what a single $\\sigma$ cannot.",
  scenes: [
    { at: 0,
      caption: "Independent normal returns with a fixed $\\sigma$ — what Black-Scholes assumes. The band of activity is **the same width everywhere**.",
      say: "First, independent normal returns with a single fixed sigma. This is what Black Scholes assumes. Notice the band of activity is the same width everywhere.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 600], y: [-0.075, 0.075], W, H });
        a.grid(6, 4).frame();
        a.ticks({ xs: [0, 300, 600], ys: [-0.05, 0, 0.05], yfmt: (v) => pc(v) });
        a.hline(0, { color: P.grid, dash: null });
        const n = Math.round(600 * clamp01(t / (dur - 1)));
        a.bars(data.iid.slice(0, n).map((v, i) => [i, v]), { color: P.blue, width: 1.2, alpha: 0.8 });
        a.chip("iid normal — constant σ", a.L + 10, a.T + 16);
      } },

    { at: 9,
      caption: "Now a series with clustering, scaled to the **same overall variance**. Same average turbulence, completely different texture.",
      say: "Now a series with volatility clustering, scaled to exactly the same overall variance. Same average turbulence, completely different texture.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 600], y: [-0.075, 0.075], W, H });
        a.grid(6, 4).frame();
        a.ticks({ xs: [0, 300, 600], ys: [-0.05, 0, 0.05], yfmt: (v) => pc(v) });
        a.hline(0, { color: P.grid, dash: null });
        const k = easeOut(clamp01(t / 2.4));
        a.bars(data.iid.map((v, i) => [i, lerp(v, data.clustered[i], k)]),
          { color: P.amber, width: 1.2, alpha: 0.85 });
        a.chip("volatility clusters", a.L + 10, a.T + 16, { color: P.amber, bg: "rgba(194,129,10,0.12)" });
      } },

    { at: 19,
      caption: "Put a 25-day rolling volatility underneath each. The flat one barely moves. The clustered one **swings by a factor of three** — and does so slowly, in runs.",
      say: "Put a twenty five day rolling volatility underneath each. The flat one barely moves. The clustered one swings by a factor of three, and does so slowly, in long runs.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const k = easeOut(clamp01(t / 2));
        const top = { l: 52, r: 18, t: 16, b: H / 2 + 8 };
        const bot = { l: 52, r: 18, t: H / 2 + 14, b: 30 };
        const A = axes(ctx, { x: [0, 600], y: [0, 0.035], W, H, pad: top });
        A.grid(6, 3).frame();
        A.ticks({ ys: [0, 0.015, 0.03], yfmt: (v) => pc(v) });
        A.line(data.rollIid.map((v, i) => [i, v ?? 0]).filter((_, i) => i >= 25), { color: P.blue, width: 2 });
        A.note("rolling σ — iid", A.L + 8, A.T + 14, { color: P.blue, size: 11.5, weight: 700 });

        const B = axes(ctx, { x: [0, 600], y: [0, 0.035], W, H, pad: bot });
        B.grid(6, 3).frame();
        B.ticks({ xs: [0, 300, 600], ys: [0, 0.015, 0.03], yfmt: (v) => pc(v) });
        const pts = data.rollC.map((v, i) => [i, v ?? 0]).filter((_, i) => i >= 25);
        B.line(upTo(pts, k), { color: P.amber, width: 2.4 });
        B.note("rolling σ — clustered", B.L + 8, B.T + 14, { color: P.amber, size: 11.5, weight: 700 });
      } },

    { at: 31,
      caption: "Both have the same **unconditional** variance. What differs is the **conditional** variance — what you'd forecast for tomorrow *given* what just happened.",
      say: "Both series have the same unconditional variance. What differs is the conditional variance. What you would forecast for tomorrow, given what just happened. And that is the quantity ARCH and GARCH were invented to model.",
      draw({ ctx, W, H, t, dur, data, axes, fade }) {
        const f = fade(t, dur);
        ctx.save();
        ctx.globalAlpha = f;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        const cx = W / 2;
        ctx.font = "600 14px Inter, system-ui, sans-serif";
        ctx.fillStyle = P.ink;
        ctx.fillText("same unconditional variance", cx, H * 0.24);
        ctx.font = "700 22px ui-monospace, monospace";
        ctx.fillStyle = P.blue; ctx.fillText(pc(data.sd), cx - 90, H * 0.42);
        ctx.fillStyle = P.amber; ctx.fillText(pc(data.sd), cx + 90, H * 0.42);
        ctx.font = "500 12px Inter, system-ui, sans-serif";
        ctx.fillStyle = P.muted;
        ctx.fillText("iid", cx - 90, H * 0.42 + 24);
        ctx.fillText("clustered", cx + 90, H * 0.42 + 24);
        ctx.font = "600 14px Inter, system-ui, sans-serif";
        ctx.fillStyle = P.ink;
        ctx.fillText("completely different conditional variance", cx, H * 0.68);
        ctx.font = "500 12.5px Inter, system-ui, sans-serif";
        ctx.fillStyle = P.muted;
        ctx.fillText("σ²ₜ = Var(Xₜ | everything up to t−1)", cx, H * 0.68 + 24);
        ctx.restore();
      } },
  ],
};

/* =================================================================== f10 */

const F10 = (() => {
  const omega = 1e-5, alpha = 0.09, beta = 0.9;
  const g = garch({ omega, alpha, beta, n: 260, seed: 41, shockAt: 80, shockSize: 6 });
  const persist = alpha + beta;
  return {
    ...g, omega, alpha, beta, persist,
    halfLife: Math.log(0.5) / Math.log(persist),
    uncondVol: Math.sqrt(omega / (1 - persist)),
    annual: Math.sqrt(omega / (1 - persist)) * Math.sqrt(252),
  };
})();

const f10 = {
  title: "A GARCH forecast absorbing a shock",
  blurb: "Three parameters. Watch what each one does when a big day arrives.",
  duration: 50,
  data: F10,
  takeaway: "$\\alpha+\\beta$ is the whole personality of a fitted GARCH: the fraction of a volatility shock still present tomorrow. Below 1 and it fades; at 1 it never does, and there is no long-run variance to speak of.",
  scenes: [
    { at: 0,
      caption: "A quiet stretch. The conditional volatility $\\sigma_t$ sits near its long-run level, $\\sqrt{\\omega/(1-\\alpha-\\beta)}$.",
      say: "We start in a quiet stretch. The conditional volatility sits near its long run level — omega over one minus alpha minus beta, all square rooted.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 80], y: [0, 0.055], W, H });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 40, 80], ys: [0, 0.02, 0.04], yfmt: (v) => pc(v) });
        const n = Math.max(2, Math.round(80 * clamp01(t / (dur - 1))));
        a.line(data.vol.slice(0, n).map((v, i) => [i, v]), { color: P.emerald, width: 2.4 });
        a.hline(data.uncondVol, { color: P.muted, width: 1.6 });
        a.note("long-run σ", a.L + 10, a.sy(data.uncondVol) - 13, { color: P.muted, size: 11.5, weight: 600 });
        a.chip(`ω=${data.omega}  α=${data.alpha}  β=${data.beta}`, a.R - 10, a.T + 16, { align: "right" });
      } },

    { at: 9,
      caption: "Then a six-sigma day. The $\\alpha X_{t-1}^2$ term reacts **immediately** — tomorrow's forecast jumps.",
      say: "Then a six sigma day arrives. The alpha times X squared term reacts immediately, and tomorrow's forecast jumps.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const top = { l: 52, r: 18, t: 16, b: H / 2 + 8 };
        const bot = { l: 52, r: 18, t: H / 2 + 14, b: 30 };
        const k = clamp01(t / 2.4);
        const upto = 80 + Math.round(60 * easeOut(k));
        const A = axes(ctx, { x: [40, 200], y: [-0.13, 0.13], W, H, pad: top });
        A.grid(5, 3).frame(); A.ticks({ ys: [-0.08, 0, 0.08], yfmt: (v) => pc(v) });
        A.hline(0, { color: P.grid, dash: null });
        A.bars(data.x.slice(0, upto).map((v, i) => [i, v]).filter(([i]) => i >= 40), { color: P.blue, width: 1.6 });
        A.note("returns", A.L + 8, A.T + 14, { color: P.blue, size: 11.5, weight: 700 });

        const B = axes(ctx, { x: [40, 200], y: [0, 0.075], W, H, pad: bot });
        B.grid(5, 3).frame(); B.ticks({ xs: [40, 120, 200], ys: [0, 0.03, 0.06], yfmt: (v) => pc(v) });
        B.line(data.vol.slice(0, upto).map((v, i) => [i, v]).filter(([i]) => i >= 40), { color: P.emerald, width: 2.4 });
        B.hline(data.uncondVol, { color: P.muted, width: 1.4 });
        if (upto > 82) B.vline(81, { color: P.red, width: 1.6 });
        B.note("conditional σₜ", B.L + 8, B.T + 14, { color: P.emerald, size: 11.5, weight: 700 });
      } },

    { at: 21,
      caption: "Then it decays — but slowly, multiplied by $\\alpha+\\beta=0.99$ each day. The $\\beta$ term is doing the remembering.",
      say: "Then it decays. But slowly, multiplied by alpha plus beta — nought point nine nine — every single day. The beta term is what's doing the remembering.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [70, 260], y: [0, 0.075], W, H });
        a.grid(5, 4).frame();
        a.ticks({ xs: [80, 160, 240], ys: [0, 0.03, 0.06], yfmt: (v) => pc(v) });
        const k = clamp01(t / (dur - 1));
        const upto = 80 + Math.round(180 * easeOut(k));
        a.line(data.vol.slice(0, upto).map((v, i) => [i, v]).filter(([i]) => i >= 70), { color: P.emerald, width: 2.4 });
        a.hline(data.uncondVol, { color: P.muted, width: 1.6 });
        a.vline(81, { color: P.red, width: 1.6 });
        a.note("shock", a.sx(81) + 6, a.T + 18, { color: P.red, size: 11.5, weight: 700 });
        if (upto > 95) a.chip(`α + β = ${data.persist.toFixed(2)}`, a.R - 10, a.T + 16, { align: "right", color: P.emerald, bg: "rgba(0,164,114,0.12)" });
      } },

    { at: 33,
      caption: "How long is the memory? Half the shock is still there after **69 days**. That single number — $\\alpha+\\beta$ — is the whole personality of a fitted model.",
      say: "So how long is the memory? Half the shock is still present after sixty nine days. That single number, alpha plus beta, is the whole personality of a fitted GARCH model.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 200], y: [0, 1.05], W, H });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 100, 200], ys: [0, 0.5, 1], yfmt: (v) => v.toFixed(1) });
        const k = easeOut(clamp01(t / 3));
        const xs = linspace(0, 200 * k, 90);
        a.line(xs.map((d) => [d, 0.99 ** d]), { color: P.emerald, width: 2.6 });
        a.line(xs.map((d) => [d, 0.95 ** d]), { color: P.blue, width: 2, dash: [5, 4] });
        a.hline(0.5, { color: P.muted });
        a.note("half the shock remains", a.L + 10, a.sy(0.5) - 13, { color: P.muted, size: 11.5 });
        a.note("α+β = 0.99  →  69 days", a.sx(120), a.sy(0.66), { color: P.emerald, size: 12, weight: 700 });
        a.note("α+β = 0.95  →  14 days", a.sx(60), a.sy(0.18), { color: P.blue, size: 12, weight: 700 });
      } },

    { at: 43,
      caption: "And the condition: at $\\alpha+\\beta\\ge1$ shocks never fade, the long-run variance $\\omega/(1-\\alpha-\\beta)$ blows up, and the model is no longer stationary.",
      say: "And here's where the stationarity condition comes from. At alpha plus beta equal to one or more, shocks never fade, the long run variance blows up, and the model is no longer stationary.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0.8, 1.0], y: [0, 0.12], W, H });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0.8, 0.9, 0.95, 1.0], ys: [0, 0.05, 0.1], xfmt: (v) => v.toFixed(2), yfmt: (v) => pc(v) });
        const k = easeOut(clamp01(t / 3));
        const xs = linspace(0.8, lerp(0.8, 0.998, k), 120);
        a.line(xs.map((s) => [s, Math.min(0.12, Math.sqrt(data.omega / (1 - s)))]), { color: P.red, width: 2.8 });
        a.vline(1, { color: P.ink, width: 2, dash: null });
        a.note("α + β → 1", a.sx(1) - 8, a.T + 20, { color: P.ink, size: 12, weight: 700, align: "right" });
        a.note("long-run volatility →  ∞", a.L + 10, a.T + 20, { color: P.red, size: 12, weight: 600 });
        const now = lerp(0.8, 0.998, k);
        a.chip(`α+β = ${now.toFixed(3)}   long-run σ = ${pc(Math.sqrt(data.omega / (1 - now)))}`,
          a.L + 10, a.B - 18, { color: P.red, bg: "rgba(186,26,26,0.10)" });
      } },
  ],
};

/* =================================================================== f11 */

const F11 = (() => {
  const P0 = 100, K = 100, T = 1, nu = 0.03;
  const call = (sig) => {
    const M = Math.log(P0 / K);
    const d2 = (M + nu * T) / (sig * Math.sqrt(T));
    const d1 = d2 + sig * Math.sqrt(T);
    return { d1, d2, price: P0 * Math.exp((nu + sig * sig / 2) * T) * normCdf(d1) - K * normCdf(d2) };
  };
  return { P0, K, T, nu, call, sigs: linspace(0.02, 0.8, 90) };
})();

const f11 = {
  title: "Turning up the volatility dial",
  blurb: "The comparative static that sounds wrong: **more uncertainty makes the option worth more.** Watch why.",
  duration: 52,
  data: F11,
  takeaway: "$d_1$ and $d_2$ are always exactly $\\sigma\\sqrt{t}$ apart. Raising $\\sigma$ widens that gap, and the gap is the option's value above its intrinsic worth.",
  scenes: [
    { at: 0,
      caption: "An at-the-money call: $P_0=K=\\$100$, one year out. Start with almost no volatility — the price is nearly pinned to \\$100.",
      say: "An at the money call. Spot and strike both one hundred dollars, one year to expiry. Start with almost no volatility, so the price at expiry is nearly pinned to one hundred.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [40, 200], y: [0, 0.075], W, H });
        a.grid(6, 4).frame();
        a.ticks({ xs: [40, 100, 160, 200], ys: [], xfmt: (v) => `$${v}` });
        const sig = 0.08;
        const xi = Math.log(data.P0) + data.nu;
        const pts = linspace(40, 200, 200).map((x) => [x, normPdf((Math.log(x) - xi) / sig) / (x * sig)]);
        a.area(upTo(pts, easeOut(clamp01(t / 1.8))), 0, { color: P.blueSoft });
        a.line(upTo(pts, easeOut(clamp01(t / 1.8))), { color: P.blue, width: 2.4 });
        a.vline(data.K, { color: P.amber, width: 2 });
        a.label("K", { x: data.K + 3, y: 0.07, color: P.amber, size: 12.5 });
        a.chip(`σ = ${pc(sig)}   call = ${money(data.call(sig).price)}`, a.L + 10, a.T + 16);
      } },

    { at: 9,
      caption: "Now widen it. The distribution spreads **both ways** — but only the right half can ever pay you, and it stretches much further than the left half can fall.",
      say: "Now widen it. The distribution spreads both ways. But only the right hand half can ever pay you — and it stretches much further out than the left half can fall.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [40, 200], y: [0, 0.075], W, H });
        a.grid(6, 4).frame();
        a.ticks({ xs: [40, 100, 160, 200], ys: [], xfmt: (v) => `$${v}` });
        const sig = lerp(0.08, 0.45, easeOut(clamp01(t / 4)));
        const xi = Math.log(data.P0) + data.nu;
        const pts = linspace(40, 200, 240).map((x) => [x, normPdf((Math.log(x) - xi) / sig) / (x * sig)]);
        a.area(pts.filter(([x]) => x <= data.K), 0, { color: "rgba(148,163,184,0.20)" });
        a.area(pts.filter(([x]) => x >= data.K), 0, { color: P.emeraldSoft });
        a.line(pts, { color: P.blue, width: 2.4 });
        a.vline(data.K, { color: P.amber, width: 2 });
        a.note("pays nothing", a.sx(58), a.sy(0.012), { color: P.muted, size: 11.5, weight: 600 });
        a.note("pays more, the further right", a.sx(122), a.sy(0.03), { color: P.emerald, size: 11.5, weight: 600 });
        a.chip(`σ = ${pc(sig)}   call = ${money(data.call(sig).price)}`, a.L + 10, a.T + 16);
      } },

    { at: 21,
      caption: "In the formula that shows as $d_1$ and $d_2$ pulling apart. They are **always exactly $\\sigma\\sqrt{t}$ apart** — so more volatility literally widens the gap.",
      say: "In the formula, that shows up as d one and d two pulling apart. They are always exactly sigma root t apart. So more volatility literally widens the gap between them.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 0.8], y: [-0.8, 0.8], W, H });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 0.2, 0.4, 0.6, 0.8], ys: [-0.5, 0, 0.5], xfmt: (v) => pc(v), yfmt: (v) => v.toFixed(1) });
        a.hline(0, { color: P.grid, dash: null });
        const k = easeOut(clamp01(t / 3.4));
        const xs = data.sigs.filter((s) => s <= lerp(0.02, 0.8, k));
        a.line(xs.map((s) => [s, data.call(s).d1]), { color: P.emerald, width: 2.6 });
        a.line(xs.map((s) => [s, data.call(s).d2]), { color: P.blue, width: 2.6 });
        const sNow = xs[xs.length - 1] ?? 0.02;
        const c = data.call(sNow);
        a.vline(sNow, { color: P.muted, alpha: 0.6 });
        a.note("d₁", a.sx(0.72), a.sy(data.call(0.72).d1) - 12, { color: P.emerald, size: 12.5, weight: 700 });
        a.note("d₂", a.sx(0.72), a.sy(data.call(0.72).d2) + 14, { color: P.blue, size: 12.5, weight: 700 });
        a.chip(`d₁ − d₂ = σ√t = ${(c.d1 - c.d2).toFixed(3)}`, a.L + 10, a.T + 16, { color: P.emerald, bg: "rgba(0,164,114,0.12)" });
      } },

    { at: 33,
      caption: "Because $\\Phi$ is increasing, a wider gap means $\\Phi(d_1)$ climbs away from $\\Phi(d_2)$ — you collect over a bigger effective probability than you pay over.",
      say: "And because Phi is an increasing function, a wider gap means Phi of d one climbs away from Phi of d two. You collect over a bigger effective probability than the one you pay over.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 0.8], y: [0, 1], W, H });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 0.2, 0.4, 0.6, 0.8], ys: [0, 0.5, 1], xfmt: (v) => pc(v), yfmt: (v) => v.toFixed(1) });
        const k = easeOut(clamp01(t / 3.2));
        const xs = data.sigs.filter((s) => s <= lerp(0.02, 0.8, k));
        const hi = xs.map((s) => [s, normCdf(data.call(s).d1)]);
        const lo = xs.map((s) => [s, normCdf(data.call(s).d2)]);
        if (hi.length > 2) a.area([...hi, ...lo.slice().reverse()], 0, { color: "rgba(0,164,114,0.12)" });
        a.line(hi, { color: P.emerald, width: 2.6 });
        a.line(lo, { color: P.blue, width: 2.6 });
        a.note("Φ(d₁)", a.sx(0.68), a.sy(normCdf(data.call(0.68).d1)) - 13, { color: P.emerald, size: 12.5, weight: 700 });
        a.note("Φ(d₂)", a.sx(0.68), a.sy(normCdf(data.call(0.68).d2)) + 15, { color: P.blue, size: 12.5, weight: 700 });
      } },

    { at: 43,
      caption: "Net result: the call price rises **monotonically** with $\\sigma$. Your downside was capped at the premium all along — so more uncertainty is pure upside.",
      say: "The net result is that the call price rises monotonically with sigma. Your downside was capped at the premium all along. So more uncertainty is pure upside for the holder. That is the payoff asymmetry from module one, now visible as a comparative static.",
      draw({ ctx, W, H, t, dur, data, axes }) {
        const a = axes(ctx, { x: [0, 0.8], y: [0, 36], W, H });
        a.grid(5, 4).frame();
        a.ticks({ xs: [0, 0.2, 0.4, 0.6, 0.8], ys: [0, 12, 24, 36], xfmt: (v) => pc(v), yfmt: (v) => `$${v}` });
        const k = easeOut(clamp01(t / 3.4));
        const xs = data.sigs.filter((s) => s <= lerp(0.02, 0.8, k));
        const pts = xs.map((s) => [s, data.call(s).price]);
        a.area(pts, 0, { color: P.emeraldSoft });
        a.line(pts, { color: P.emerald, width: 3 });
        const sNow = xs[xs.length - 1] ?? 0.02;
        a.dots([[sNow, data.call(sNow).price]], { color: P.emerald, r: 5 });
        a.chip(`σ = ${pc(sNow)}   call = ${money(data.call(sNow).price)}`, a.L + 10, a.T + 16,
          { color: P.emerald, bg: "rgba(0,164,114,0.12)" });
        a.note("more risk → more value", a.R - 10, a.B - 18, { color: P.emerald, size: 12.5, weight: 700, align: "right" });
      } },
  ],
};

/* ===================================================================== */

export const EXPLAINERS = { f1, f2, f3, f4, f5, f6, f7, f8, f9, f10, f11 };
