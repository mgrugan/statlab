/* Simulation + plotting primitives for the module explainers.
 *
 * Everything an explainer draws is COMPUTED, not hand-drawn: the paths are
 * real simulated paths, the ACF bars are a real ACF, the normal areas are
 * real integrals. Every generator is seeded, so the picture is identical on
 * every replay and the numbers quoted in the narration always match what is
 * on screen. */

/* ---------------------------------------------------------------- random */

/* mulberry32 — small, fast, and good enough that simulated paths look real */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Box-Muller, returning one standard normal per call */
export function normals(seed) {
  const u = rng(seed);
  let spare = null;
  return () => {
    if (spare !== null) { const s = spare; spare = null; return s; }
    let a = u(), b = u();
    if (a < 1e-12) a = 1e-12;
    const r = Math.sqrt(-2 * Math.log(a));
    spare = r * Math.sin(2 * Math.PI * b);
    return r * Math.cos(2 * Math.PI * b);
  };
}

/* ------------------------------------------------------- distributions */

/* Abramowitz & Stegun 26.2.17 — plenty accurate for drawing */
export function normCdf(z) {
  const s = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t
    - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return 0.5 * (1 + s * y);
}

export const normPdf = (z) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);

/* Acklam's inverse normal CDF — used for QQ-plot theoretical quantiles */
export function normQuantile(p) {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
    1.383577518672690e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
    6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838,
    -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996,
    3.754408661907416];
  const pl = 0.02425;
  let q, r;
  if (p < pl) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p > 1 - pl) return -normQuantile(1 - p);
  q = p - 0.5; r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

/* Student-t via the normal/chi mixture — the fat-tailed foil for the QQ plot */
export function tSample(nrm, df) {
  let c = 0;
  for (let i = 0; i < df; i++) { const z = nrm(); c += z * z; }
  return nrm() / Math.sqrt(c / df);
}

/* ------------------------------------------------------------ processes */

/* Geometric Brownian motion, returned on both scales plus its increments. */
export function gbmPath({ S0 = 100, nu = 0.06, sigma = 0.2, T = 1, n = 250, seed = 7 }) {
  const nrm = normals(seed);
  const dt = T / n;
  const sd = sigma * Math.sqrt(dt);
  const logS = [Math.log(S0)];
  const inc = [];
  for (let i = 1; i <= n; i++) {
    const e = nu * dt + sd * nrm();
    inc.push(e);
    logS.push(logS[i - 1] + e);
  }
  return {
    t: logS.map((_, i) => (i * T) / n),
    logS, inc,
    S: logS.map(Math.exp),
    mu: nu + (sigma * sigma) / 2,
  };
}

/* AR(1): x_t = mu + phi (x_{t-1} - mu) + eps. phi = 1 gives a random walk.
   Passing the same seed to two calls reuses the same shocks, which is what
   makes the "same news, different memory" comparison honest. */
export function ar1({ phi = 0.9, mu = 0, sd = 1, n = 200, seed = 11, x0 = null }) {
  const nrm = normals(seed);
  const x = [x0 === null ? mu : x0];
  for (let i = 1; i <= n; i++) x.push(mu + phi * (x[i - 1] - mu) + sd * nrm());
  return x;
}

/* GARCH(1,1). Returns the series and the conditional volatility that drove it. */
export function garch({ omega = 1e-5, alpha = 0.09, beta = 0.9, n = 400, seed = 23, shockAt = null, shockSize = 5 }) {
  const nrm = normals(seed);
  const uncond = omega / (1 - alpha - beta);
  let s2 = uncond;
  const x = [], vol = [];
  for (let i = 0; i < n; i++) {
    const e = i === shockAt ? shockSize : nrm();
    const xi = Math.sqrt(s2) * e;
    x.push(xi); vol.push(Math.sqrt(s2));
    s2 = omega + alpha * xi * xi + beta * s2;
  }
  return { x, vol, uncond: Math.sqrt(uncond), halfLife: Math.log(0.5) / Math.log(alpha + beta) };
}

/* ------------------------------------------------------------ estimators */

/* Sample autocorrelation, the same estimator statsmodels plots. */
export function acf(x, maxLag) {
  const n = x.length;
  const m = x.reduce((s, v) => s + v, 0) / n;
  const d = x.map((v) => v - m);
  const c0 = d.reduce((s, v) => s + v * v, 0) / n;
  const out = [];
  for (let h = 1; h <= maxLag; h++) {
    let c = 0;
    for (let i = 0; i < n - h; i++) c += d[i] * d[i + h];
    out.push(c / n / c0);
  }
  return out;
}

/* Gaussian KDE evaluated on a grid. */
export function kde(x, h, grid) {
  const n = x.length;
  return grid.map((g) => {
    let s = 0;
    for (const xi of x) s += normPdf((g - xi) / h);
    return s / (n * h);
  });
}

export function moments(x) {
  const n = x.length;
  const m = x.reduce((s, v) => s + v, 0) / n;
  let m2 = 0, m3 = 0, m4 = 0;
  for (const v of x) { const d = v - m; m2 += d * d; m3 += d ** 3; m4 += d ** 4; }
  m2 /= n; m3 /= n; m4 /= n;
  const skew = m3 / m2 ** 1.5;
  const kurt = m4 / (m2 * m2);
  return { mean: m, sd: Math.sqrt(m2), skew, kurt, jb: (n / 6) * (skew * skew + ((kurt - 3) ** 2) / 4) };
}

export const linspace = (a, b, n) =>
  Array.from({ length: n }, (_, i) => a + ((b - a) * i) / (n - 1));

/* ---------------------------------------------------------------- easing */

export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const ease = (k) => (k < 0.5 ? 2 * k * k : 1 - ((-2 * k + 2) ** 2) / 2);
export const easeOut = (k) => 1 - (1 - k) ** 3;
export const lerp = (a, b, k) => a + (b - a) * k;

/* ------------------------------------------------------------- plotting */

export const PALETTE = {
  ink: "#1e293b",
  muted: "#94a3b8",
  grid: "#e2e8f0",
  blue: "#2170e4",
  blueSoft: "rgba(33,112,228,0.16)",
  emerald: "#00a472",
  emeraldSoft: "rgba(0,164,114,0.18)",
  amber: "#c2810a",
  amberSoft: "rgba(194,129,10,0.20)",
  red: "#ba1a1a",
  redSoft: "rgba(186,26,26,0.16)",
  paper: "#ffffff",
};

/* A linear mapping from data space to canvas pixels, plus the drawing verbs
   every scene needs. Scenes never touch raw pixel coordinates. */
export function axes(ctx, { x: [x0, x1], y: [y0, y1], pad = { l: 52, r: 18, t: 18, b: 34 }, W, H }) {
  const L = pad.l, R = W - pad.r, T = pad.t, B = H - pad.b;
  const sx = (v) => L + ((v - x0) / (x1 - x0)) * (R - L);
  const sy = (v) => B - ((v - y0) / (y1 - y0)) * (B - T);

  const api = {
    sx, sy, L, R, T, B, x0, x1, y0, y1,

    grid(xticks = 5, yticks = 4) {
      ctx.save();
      ctx.strokeStyle = PALETTE.grid; ctx.lineWidth = 1;
      for (let i = 0; i <= yticks; i++) {
        const v = y0 + ((y1 - y0) * i) / yticks;
        ctx.beginPath(); ctx.moveTo(L, sy(v)); ctx.lineTo(R, sy(v)); ctx.stroke();
      }
      for (let i = 0; i <= xticks; i++) {
        const v = x0 + ((x1 - x0) * i) / xticks;
        ctx.beginPath(); ctx.moveTo(sx(v), T); ctx.lineTo(sx(v), B); ctx.stroke();
      }
      ctx.restore();
      return api;
    },

    frame() {
      ctx.save();
      ctx.strokeStyle = PALETTE.muted; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();
      ctx.restore();
      return api;
    },

    ticks({ xs = [], ys = [], xfmt = String, yfmt = String } = {}) {
      ctx.save();
      ctx.fillStyle = PALETTE.muted;
      ctx.font = "11px ui-monospace, monospace";
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (const v of ys) ctx.fillText(yfmt(v), L - 8, sy(v));
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (const v of xs) ctx.fillText(xfmt(v), sx(v), B + 8);
      ctx.restore();
      return api;
    },

    label(text, { x, y, color = PALETTE.ink, align = "left", baseline = "middle", size = 12, weight = 600, alpha = 1 }) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.font = `${weight} ${size}px Inter, system-ui, sans-serif`;
      ctx.textAlign = align; ctx.textBaseline = baseline;
      ctx.fillText(text, sx(x), sy(y));
      ctx.restore();
      return api;
    },

    /* pixel-space label, for annotations pinned to the panel rather than data */
    note(text, px, py, { color = PALETTE.muted, align = "left", size = 12, weight = 500, alpha = 1 } = {}) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.font = `${weight} ${size}px Inter, system-ui, sans-serif`;
      ctx.textAlign = align; ctx.textBaseline = "middle";
      ctx.fillText(text, px, py);
      ctx.restore();
      return api;
    },

    line(pts, { color = PALETTE.blue, width = 2, alpha = 1, dash = null } = {}) {
      if (pts.length < 2) return api;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color; ctx.lineWidth = width;
      ctx.lineJoin = "round"; ctx.lineCap = "round";
      if (dash) ctx.setLineDash(dash);
      ctx.beginPath();
      ctx.moveTo(sx(pts[0][0]), sy(pts[0][1]));
      for (let i = 1; i < pts.length; i++) ctx.lineTo(sx(pts[i][0]), sy(pts[i][1]));
      ctx.stroke();
      ctx.restore();
      return api;
    },

    area(pts, base, { color = PALETTE.blueSoft, alpha = 1 } = {}) {
      if (pts.length < 2) return api;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(sx(pts[0][0]), sy(base));
      for (const [px, py] of pts) ctx.lineTo(sx(px), sy(py));
      ctx.lineTo(sx(pts[pts.length - 1][0]), sy(base));
      ctx.closePath(); ctx.fill();
      ctx.restore();
      return api;
    },

    dots(pts, { color = PALETTE.blue, r = 2.4, alpha = 1 } = {}) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      for (const [px, py] of pts) {
        ctx.beginPath(); ctx.arc(sx(px), sy(py), r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
      return api;
    },

    bars(vals, { color = PALETTE.blue, width = 3, alpha = 1, from = 0 } = {}) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = "round";
      vals.forEach(([px, py]) => {
        ctx.beginPath(); ctx.moveTo(sx(px), sy(from)); ctx.lineTo(sx(px), sy(py)); ctx.stroke();
      });
      ctx.restore();
      return api;
    },

    band(lo, hi, { color = PALETTE.grid, alpha = 1 } = {}) {
      ctx.save();
      ctx.globalAlpha = alpha; ctx.fillStyle = color;
      ctx.fillRect(L, sy(hi), R - L, sy(lo) - sy(hi));
      ctx.restore();
      return api;
    },

    vline(x, { color = PALETTE.muted, width = 1.4, dash = [4, 4], alpha = 1 } = {}) {
      ctx.save();
      ctx.globalAlpha = alpha;
      // `dash: null` is how scenes ask for a solid rule; setLineDash rejects null
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash || []);
      ctx.beginPath(); ctx.moveTo(sx(x), T); ctx.lineTo(sx(x), B); ctx.stroke();
      ctx.restore();
      return api;
    },

    hline(y, { color = PALETTE.muted, width = 1.4, dash = [4, 4], alpha = 1 } = {}) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash || []);
      ctx.beginPath(); ctx.moveTo(L, sy(y)); ctx.lineTo(R, sy(y)); ctx.stroke();
      ctx.restore();
      return api;
    },

    /* a readout chip, for the live numbers the narration refers to */
    chip(text, px, py, { color = PALETTE.blue, bg = "rgba(33,112,228,0.10)", alpha = 1, align = "left" } = {}) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = "600 12px ui-monospace, monospace";
      const w = ctx.measureText(text).width + 16;
      const x = align === "right" ? px - w : px;
      ctx.fillStyle = bg;
      ctx.beginPath(); ctx.roundRect(x, py - 11, w, 22, 6); ctx.fill();
      ctx.fillStyle = color;
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(text, x + 8, py + 1);
      ctx.restore();
      return api;
    },
  };
  return api;
}

/* Fade a scene's contents in over its first `d` seconds and out over its last. */
export function fade(local, dur, d = 0.45) {
  return Math.min(clamp01(local / d), clamp01((dur - local) / d));
}
