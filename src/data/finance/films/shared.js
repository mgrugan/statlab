/* Shared simulation fixtures for the lecture films. Computed once at module
   load, seeded, so every film that quotes a number quotes the same one. */

import { normals, normCdf, linspace } from "@/lib/anim";

export const money = (v) => `$${v.toFixed(2)}`;
export const pc = (v, d = 1) => `${(v * 100).toFixed(d)}%`;

/* reveal the first `k` fraction of a polyline */
export const upTo = (pts, k) =>
  pts.slice(0, Math.max(2, Math.round(pts.length * Math.max(0, Math.min(1, k)))));

/* The running example used across f1, f2 and f11: a one-year call, spot 100,
   strike 100, with E(P_T) = 120 so the Jensen gap is a concrete dollar figure. */
export const CALL = (() => {
  const K = 100, PREM = 8, tau = 0.3, EP = 120;
  const xi = Math.log(EP) - (tau * tau) / 2;
  const d2 = (xi - Math.log(K)) / tau;
  const d1 = d2 + tau;
  const fair = EP * normCdf(d1) - K * normCdf(d2);
  const naive = EP - K;
  const nrm = normals(4);
  const draws = Array.from({ length: 200 }, () => Math.exp(xi + tau * nrm()));
  return { K, PREM, tau, xi, EP, d1, d2, fair, naive, gap: fair - naive, draws,
    breakeven: K + PREM, Pd1: normCdf(d1), Pd2: normCdf(d2) };
})();

/* a payoff curve for a call, as data */
export const callPayoff = (K, lo, hi, n = 160) =>
  linspace(lo, hi, n).map((x) => [x, Math.max(0, x - K)]);

export const putPayoff = (K, lo, hi, n = 160) =>
  linspace(lo, hi, n).map((x) => [x, Math.max(0, K - x)]);
