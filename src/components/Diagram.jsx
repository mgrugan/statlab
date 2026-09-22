import { useMemo } from "react";

/* ============================================================
   Inline SVG diagrams for lesson intuition blocks.
   Hand-authored; series-style diagrams use a seeded PRNG so
   they are deterministic across renders and builds.
   Colors come from the DESIGN.md tokens.
   ============================================================ */

const C = {
  ink: "var(--foreground)",
  muted: "var(--muted-foreground)",
  border: "var(--border)",
  blue: "var(--blue-bright)",
  emerald: "var(--emerald)",
  red: "var(--destructive)",
  amber: "var(--amber)",
  tint: "var(--blue-tint)",
};

/* deterministic PRNG so diagrams never jitter between renders */
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}
function gauss(r) {
  return Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r());
}
function pathFrom(pts) {
  return pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
}

function Axes({ x0 = 44, y0 = 178, x1 = 396, y1 = 16, xlabel, ylabel }) {
  return (
    <>
      <line x1={x0} y1={y0} x2={x1} y2={y0} stroke={C.border} strokeWidth="1.5" />
      <line x1={x0} y1={y0} x2={x0} y2={y1} stroke={C.border} strokeWidth="1.5" />
      {xlabel && <text x={(x0 + x1) / 2} y={y0 + 26} textAnchor="middle" fontSize="10.5" fill={C.muted} fontFamily="var(--font-mono)">{xlabel}</text>}
      {ylabel && <text x={x0 - 30} y={(y0 + y1) / 2} textAnchor="middle" fontSize="10.5" fill={C.muted} fontFamily="var(--font-mono)" transform={`rotate(-90 ${x0 - 30} ${(y0 + y1) / 2})`}>{ylabel}</text>}
    </>
  );
}

const L = (props) => <text fontSize="10.5" fontFamily="var(--font-mono)" {...props} />;
const T = (props) => <text fontSize="11.5" {...props} />;

/* ---------------------------------------------------------- */
const DIAGRAMS = {

  /* f1 — the call payoff, and where its value comes from */
  payoff: {
    caption: "Call payoff $(P_T-K)^+$: losses truncate at zero, gains do not.",
    render: () => (
      <>
        <Axes xlabel="Price at expiration  P_T" ylabel="Payoff" />
        {/* zero region */}
        <line x1="44" y1="178" x2="210" y2="178" stroke={C.red} strokeWidth="3" />
        {/* upside */}
        <line x1="210" y1="178" x2="380" y2="32" stroke={C.emerald} strokeWidth="3" />
        {/* strike marker */}
        <line x1="210" y1="178" x2="210" y2="26" stroke={C.border} strokeDasharray="4 4" />
        <L x="210" y="196" textAnchor="middle" fill={C.muted}>K</L>
        {/* what the option would have been without truncation */}
        <line x1="120" y1="255" x2="210" y2="178" stroke={C.muted} strokeWidth="1.2" strokeDasharray="3 3" />
        <L x="70" y="164" fill={C.red}>floor at 0</L>
        <L x="300" y="60" fill={C.emerald}>unbounded</L>
        <T x="60" y="40" fill={C.ink} fontWeight="600">The kink is the whole story</T>
        <T x="60" y="58" fill={C.muted}>below K you lose nothing more;</T>
        <T x="60" y="74" fill={C.muted}>above K there is no ceiling.</T>
      </>
    ),
  },

  /* f1 — Jensen's inequality, drawn */
  jensen: {
    caption: "Jensen: averaging two outcomes through a convex kink beats the kink of the average.",
    render: () => {
      // convex g(x)=x^+ with two outcomes and their average
      const kx = 190, ky = 150;
      return (
        <>
          <Axes y0={150} xlabel="P_T" ylabel="payoff" />
          <line x1="44" y1="150" x2={kx} y2="150" stroke={C.ink} strokeWidth="2.5" />
          <line x1={kx} y1="150" x2="370" y2="34" stroke={C.ink} strokeWidth="2.5" />
          <L x={kx} y="168" textAnchor="middle" fill={C.muted}>K</L>

          {/* two equally likely outcomes */}
          <line x1="110" y1="150" x2="110" y2="30" stroke={C.border} strokeDasharray="3 3" />
          <line x1="330" y1="150" x2="330" y2="30" stroke={C.border} strokeDasharray="3 3" />
          <circle cx="110" cy="150" r="4.5" fill={C.blue} />
          <circle cx="330" cy="63" r="4.5" fill={C.blue} />
          <L x="104" y="168" textAnchor="middle" fill={C.blue}>low</L>
          <L x="330" y="168" textAnchor="middle" fill={C.blue}>high</L>

          {/* chord: average of the two payoffs */}
          <line x1="110" y1="150" x2="330" y2="63" stroke={C.emerald} strokeWidth="2" strokeDasharray="5 3" />
          <circle cx="220" cy="106.5" r="4.5" fill={C.emerald} />
          <L x="234" y="102" fill={C.emerald}>E( (P−K)⁺ )</L>

          {/* g of the mean */}
          <line x1="220" y1="150" x2="220" y2="106.5" stroke={C.border} />
          <circle cx="220" cy="150" r="4.5" fill={C.red} />
          <L x="234" y="146" fill={C.red}>( E(P)−K )⁺</L>
          <L x="220" y="168" textAnchor="middle" fill={C.muted}>E(P)</L>

          {/* the gap */}
          <line x1="212" y1="150" x2="212" y2="106.5" stroke={C.amber} strokeWidth="2.5" />
          <L x="150" y="92" fill={C.amber}>this gap = option value</L>
          <L x="150" y="106" fill={C.amber}>a point forecast throws away</L>
        </>
      );
    },
  },

  /* f2 — lognormal shape as sigma grows */
  lognormal: {
    caption: "Lognormal densities. Support is positive, and the right tail stretches as σ grows.",
    render: () => {
      const dens = (sig, color, dash) => {
        const pts = [];
        for (let i = 1; i <= 200; i++) {
          const x = (i / 200) * 5;
          const y = (1 / (x * sig * Math.sqrt(2 * Math.PI))) * Math.exp(-((Math.log(x)) ** 2) / (2 * sig * sig));
          pts.push([44 + (x / 5) * 340, 178 - Math.min(y, 1.0) * 155]);
        }
        return <path d={pathFrom(pts)} fill="none" stroke={color} strokeWidth="2" strokeDasharray={dash} />;
      };
      return (
        <>
          <Axes xlabel="x" ylabel="density" />
          {dens(0.5, C.blue)}
          {dens(1.0, C.amber, "6 3")}
          {dens(1.5, C.emerald, "2 3")}
          <L x="300" y="40" fill={C.blue}>σ = 0.5</L>
          <L x="300" y="56" fill={C.amber}>σ = 1.0</L>
          <L x="300" y="72" fill={C.emerald}>σ = 1.5</L>
          <T x="150" y="150" fill={C.muted}>never negative →</T>
        </>
      );
    },
  },

  /* f3 — Brownian motion: many paths, variance grows like t */
  bmfan: {
    caption: "Twelve Brownian paths. Each is one realization; the spread grows like √t.",
    render: () => {
      const paths = [];
      for (let k = 0; k < 12; k++) {
        const r = rng(7 + k * 977);
        let w = 0;
        const pts = [[44, 100]];
        for (let i = 1; i <= 120; i++) {
          w += gauss(r) * 0.36;
          pts.push([44 + (i / 120) * 340, 100 - w * 15]);
        }
        paths.push(<path key={k} d={pathFrom(pts)} fill="none" stroke={C.blue} strokeWidth="1" opacity="0.4" />);
      }
      // sqrt(t) envelope
      const up = [], dn = [];
      for (let i = 0; i <= 120; i++) {
        const t = i / 120;
        const s = Math.sqrt(t) * 2 * 15 * 0.36 * Math.sqrt(120);
        up.push([44 + t * 340, 100 - s]);
        dn.push([44 + t * 340, 100 + s]);
      }
      return (
        <>
          <Axes y0={178} xlabel="t" ylabel="W(t)" />
          <line x1="44" y1="100" x2="384" y2="100" stroke={C.border} />
          <path d={pathFrom(up)} fill="none" stroke={C.red} strokeWidth="1.6" strokeDasharray="5 3" />
          <path d={pathFrom(dn)} fill="none" stroke={C.red} strokeWidth="1.6" strokeDasharray="5 3" />
          {paths}
          <L x="300" y="30" fill={C.red}>±2√t</L>
          <T x="120" y="196" fill={C.muted} fontSize="11">W(0)=0 · independent increments · W(t) ~ N(0, t)</T>
        </>
      );
    },
  },

  /* f3 — price scale vs log scale */
  driftscales: {
    caption: "The same GBM path on the price scale (curved) and the log scale (straight-ish).",
    render: () => {
      const r = rng(4242);
      const b = [0];
      for (let i = 1; i <= 120; i++) b.push(b[i - 1] + 0.012 + gauss(r) * 0.055);
      const logPts = b.map((v, i) => [44 + (i / 120) * 155, 96 - v * 42]);
      const pxPts = b.map((v, i) => [230 + (i / 120) * 155, 168 - (Math.exp(v) - 1) * 150]);
      return (
        <>
          {/* left: log scale */}
          <line x1="44" y1="178" x2="199" y2="178" stroke={C.border} strokeWidth="1.5" />
          <line x1="44" y1="178" x2="44" y2="16" stroke={C.border} strokeWidth="1.5" />
          <path d={pathFrom(logPts)} fill="none" stroke={C.blue} strokeWidth="1.8" />
          <line x1="44" y1="96" x2="199" y2="45" stroke={C.red} strokeWidth="1.5" strokeDasharray="5 3" />
          <L x="121" y="196" textAnchor="middle" fill={C.muted}>log P(t)</L>
          <L x="150" y="38" fill={C.red}>slope ν</L>

          {/* right: price scale */}
          <line x1="230" y1="178" x2="385" y2="178" stroke={C.border} strokeWidth="1.5" />
          <line x1="230" y1="178" x2="230" y2="16" stroke={C.border} strokeWidth="1.5" />
          <path d={pathFrom(pxPts)} fill="none" stroke={C.emerald} strokeWidth="1.8" />
          <L x="307" y="196" textAnchor="middle" fill={C.muted}>P(t)</L>
          <L x="300" y="38" fill={C.emerald}>grows like e^(μt)</L>
          <T x="230" y="212" fill={C.muted} fontSize="11">μ = ν + σ²/2 &gt; ν</T>
        </>
      );
    },
  },

  /* f5 — bandwidth effect */
  bandwidth: {
    caption: "The same three points at three bandwidths: too small, about right, too large.",
    render: () => {
      const data = [1.5, 4, 5];
      const panel = (ox, h, label, color) => {
        const pts = [];
        for (let i = 0; i <= 120; i++) {
          const x = -1 + (i / 120) * 8;
          let y = 0;
          data.forEach((d) => { y += Math.exp(-((x - d) ** 2) / (2 * h * h)) / (h * Math.sqrt(2 * Math.PI)); });
          y /= data.length;
          pts.push([ox + (i / 120) * 108, 150 - Math.min(y, 1.4) * 92]);
        }
        return (
          <g key={label}>
            <line x1={ox} y1="150" x2={ox + 108} y2="150" stroke={C.border} strokeWidth="1.2" />
            <path d={pathFrom(pts)} fill="none" stroke={color} strokeWidth="2" />
            {data.map((d, i) => (
              <line key={i} x1={ox + ((d + 1) / 8) * 108} y1="150" x2={ox + ((d + 1) / 8) * 108} y2="142" stroke={C.ink} strokeWidth="1.5" />
            ))}
            <L x={ox + 54} y="170" textAnchor="middle" fill={color}>{label}</L>
          </g>
        );
      };
      return (
        <>
          {panel(30, 0.18, "h = 0.1", C.red)}
          {panel(156, 0.6, "h = 0.5", C.emerald)}
          {panel(282, 1.8, "h = 2", C.amber)}
          <T x="30" y="190" fill={C.muted} fontSize="11">high variance</T>
          <T x="156" y="190" fill={C.muted} fontSize="11">balanced</T>
          <T x="282" y="190" fill={C.muted} fontSize="11">high bias</T>
        </>
      );
    },
  },

  /* f5 — bias-variance tradeoff */
  biasvar: {
    caption: "MSE = bias² + variance. The best bandwidth sits at the minimum of the sum.",
    render: () => {
      const bias = [], varr = [], mse = [];
      for (let i = 0; i <= 120; i++) {
        const h = 0.15 + (i / 120) * 2.6;
        const b = 22 * h * h, v = 9 / h;
        const x = 44 + (i / 120) * 340;
        bias.push([x, 178 - Math.min(b, 155)]);
        varr.push([x, 178 - Math.min(v, 155)]);
        mse.push([x, 178 - Math.min(b + v, 155)]);
      }
      return (
        <>
          <Axes xlabel="bandwidth  h" ylabel="error" />
          <path d={pathFrom(bias)} fill="none" stroke={C.amber} strokeWidth="2" strokeDasharray="5 3" />
          <path d={pathFrom(varr)} fill="none" stroke={C.red} strokeWidth="2" strokeDasharray="2 3" />
          <path d={pathFrom(mse)} fill="none" stroke={C.blue} strokeWidth="2.5" />
          <L x="300" y="50" fill={C.amber}>bias²</L>
          <L x="80" y="50" fill={C.red}>variance</L>
          <L x="215" y="146" fill={C.blue}>MSE</L>
          <circle cx="188" cy="123" r="4" fill={C.blue} />
          <L x="196" y="118" fill={C.muted}>optimal h</L>
        </>
      );
    },
  },

  /* f6 — QQ plot tail behaviour */
  qqtails: {
    caption: "Heavy tails splay away from the line; light tails tuck toward it.",
    render: () => {
      const line = (ox) => <line x1={ox + 12} y1="158" x2={ox + 140} y2="26" stroke={C.red} strokeWidth="1.5" />;
      const heavy = [], light = [];
      for (let i = 0; i <= 60; i++) {
        const z = -2.4 + (i / 60) * 4.8;
        const h = z + 0.34 * z * z * z / 3.2;       // heavier tails
        const l = Math.tanh(z * 0.85) * 2.1;         // lighter tails
        heavy.push([30 + ((z + 2.6) / 5.2) * 140, 158 - ((h + 3.4) / 6.8) * 132]);
        light.push([252 + ((z + 2.6) / 5.2) * 140, 158 - ((l + 3.4) / 6.8) * 132]);
      }
      return (
        <>
          {line(18)}{line(240)}
          <path d={pathFrom(heavy)} fill="none" stroke={C.blue} strokeWidth="2.2" />
          <path d={pathFrom(light)} fill="none" stroke={C.emerald} strokeWidth="2.2" />
          <T x="30" y="182" fill={C.blue} fontWeight="600">Heavy-tailed</T>
          <T x="30" y="198" fill={C.muted} fontSize="11">below left, above right — real returns</T>
          <T x="252" y="182" fill={C.emerald} fontWeight="600">Light-tailed</T>
          <T x="252" y="198" fill={C.muted} fontSize="11">flattens at both ends</T>
          <L x="30" y="20" fill={C.muted}>sample</L>
          <L x="150" y="172" fill={C.muted}>theoretical</L>
        </>
      );
    },
  },

  /* f7 — AR(1) wanders in level; ARCH(1) wanders in spread */
  arvsarch: {
    caption: "AR(1) drifts in level. ARCH(1) stays centered but its spread comes and goes.",
    render: () => {
      const r1 = rng(31);
      let y = 0; const ar = [];
      for (let i = 0; i <= 160; i++) { y = 0.88 * y + gauss(r1) * 0.5; ar.push([30 + (i / 160) * 165, 56 - y * 13]); }
      const r2 = rng(77);
      let e = 0, s2 = 0.4; const arch = [];
      for (let i = 0; i <= 160; i++) {
        s2 = 0.06 + 0.92 * e * e; e = Math.sqrt(s2) * gauss(r2);
        arch.push([222 + (i / 160) * 165, 56 - Math.max(-3.6, Math.min(3.6, e)) * 13]);
      }
      return (
        <>
          <line x1="30" y1="56" x2="195" y2="56" stroke={C.border} />
          <path d={pathFrom(ar)} fill="none" stroke={C.blue} strokeWidth="1.3" />
          <T x="30" y="124" fill={C.blue} fontWeight="600">AR(1), φ = 0.88</T>
          <T x="30" y="140" fill={C.muted} fontSize="11">runs above and below the mean —</T>
          <T x="30" y="155" fill={C.muted} fontSize="11">mean reversion, constant variance</T>

          <line x1="222" y1="56" x2="387" y2="56" stroke={C.border} />
          <path d={pathFrom(arch)} fill="none" stroke={C.emerald} strokeWidth="1.3" />
          <T x="222" y="124" fill={C.emerald} fontWeight="600">ARCH(1), α = 0.92</T>
          <T x="222" y="140" fill={C.muted} fontSize="11">centered at zero throughout, but</T>
          <T x="222" y="155" fill={C.muted} fontSize="11">calm and violent stretches alternate</T>
        </>
      );
    },
  },

  /* f8 — ACF for positive vs negative phi */
  acfsign: {
    caption: "A positive φ decays from above; a negative φ alternates sign.",
    render: () => {
      const stems = (ox, phi, color) =>
        Array.from({ length: 11 }, (_, h) => {
          const v = Math.pow(phi, h);
          const x = ox + h * 14;
          return (
            <g key={h}>
              <line x1={x} y1="96" x2={x} y2={96 - v * 70} stroke={color} strokeWidth="2" />
              <circle cx={x} cy={96 - v * 70} r="2.6" fill={color} />
            </g>
          );
        });
      return (
        <>
          <rect x="24" y="86" width="160" height="20" fill={C.blue} opacity="0.1" />
          <line x1="24" y1="96" x2="184" y2="96" stroke={C.muted} strokeWidth="1" />
          {stems(30, 0.75, C.blue)}
          <T x="24" y="140" fill={C.blue} fontWeight="600">φ = +0.75</T>
          <T x="24" y="156" fill={C.muted} fontSize="11">all positive, geometric decay</T>

          <rect x="240" y="86" width="160" height="20" fill={C.amber} opacity="0.1" />
          <line x1="240" y1="96" x2="400" y2="96" stroke={C.muted} strokeWidth="1" />
          {stems(246, -0.75, C.amber)}
          <T x="240" y="140" fill={C.amber} fontWeight="600">φ = −0.75</T>
          <T x="240" y="156" fill={C.muted} fontSize="11">alternating sign at each lag</T>
          <L x="105" y="180" textAnchor="middle" fill={C.muted}>lag</L>
          <L x="320" y="180" textAnchor="middle" fill={C.muted}>lag</L>
        </>
      );
    },
  },

  /* f9 — why higher volatility raises the call value */
  volvalue: {
    caption: "Raising σ fattens both tails — but only the upper one pays.",
    render: () => {
      const dens = (sd, color, dash) => {
        const pts = [];
        for (let i = 0; i <= 160; i++) {
          const x = -3.6 + (i / 160) * 7.2;
          const y = Math.exp(-(x * x) / (2 * sd * sd)) / sd;
          pts.push([44 + ((x + 3.6) / 7.2) * 340, 150 - y * 52]);
        }
        return <path d={pathFrom(pts)} fill="none" stroke={color} strokeWidth="2" strokeDasharray={dash} />;
      };
      return (
        <>
          <line x1="44" y1="150" x2="390" y2="150" stroke={C.border} strokeWidth="1.5" />
          {/* strike */}
          <line x1="180" y1="150" x2="180" y2="28" stroke={C.ink} strokeDasharray="4 4" />
          <L x="180" y="168" textAnchor="middle" fill={C.muted}>log K</L>
          {/* payoff region shading */}
          <rect x="180" y="28" width="210" height="122" fill={C.emerald} opacity="0.07" />
          {dens(0.62, C.blue)}
          {dens(1.25, C.red, "6 3")}
          <L x="290" y="44" fill={C.blue}>low σ</L>
          <L x="290" y="60" fill={C.red}>high σ</L>
          <T x="196" y="88" fill={C.emerald} fontSize="11">payoff grows with distance →</T>
          <T x="52" y="88" fill={C.muted} fontSize="11">← all worthless,</T>
          <T x="52" y="103" fill={C.muted} fontSize="11">equally worthless</T>
          <T x="44" y="192" fill={C.ink} fontSize="11.5" fontWeight="600">Left tail: more mass, same zero payoff. Right tail: more mass, bigger payoff.</T>
        </>
      );
    },
  },

  /* f9 — volatility clustering, observed vs lognormal model */
  volclust: {
    caption: "Rolling realized volatility: the real series swings and persists; the model's does not.",
    render: () => {
      const r1 = rng(9090);
      let s = 0.5; const obs = [];
      for (let i = 0; i <= 170; i++) {
        s += (0.5 - s) * 0.012 + gauss(r1) * 0.055;
        s = Math.max(0.2, Math.min(1.05, s));
        obs.push([40 + (i / 170) * 348, 176 - (s - 0.15) * 150]);
      }
      const r2 = rng(2323);
      const sim = [];
      for (let i = 0; i <= 170; i++) {
        const v = 0.55 + gauss(r2) * 0.028;
        sim.push([40 + (i / 170) * 348, 176 - (v - 0.15) * 150]);
      }
      return (
        <>
          <Axes x0={40} y0={176} xlabel="time" ylabel="annualized vol" />
          <path d={pathFrom(obs)} fill="none" stroke={C.blue} strokeWidth="1.8" />
          <path d={pathFrom(sim)} fill="none" stroke={C.red} strokeWidth="1.4" strokeDasharray="4 3" />
          <L x="250" y="32" fill={C.blue}>observed</L>
          <L x="250" y="48" fill={C.red}>lognormal model</L>
        </>
      );
    },
  },

  /* f10 — the GARCH feedback loop */
  garchloop: {
    caption: "GARCH feeds back the smoother σ² series, not just the noisy squared returns.",
    render: () => {
      const box = (x, y, w, h, fill, stroke) => <rect x={x} y={y} width={w} height={h} rx="6" fill={fill} stroke={stroke} strokeWidth="1.5" />;
      return (
        <>
          {box(26, 62, 96, 44, "var(--blue-tint)", C.blue)}
          <T x="74" y="80" textAnchor="middle" fill={C.blue} fontWeight="600">X²(t−1)</T>
          <T x="74" y="96" textAnchor="middle" fill={C.muted} fontSize="10">squared return</T>

          {box(26, 122, 96, 44, "var(--emerald-soft)", C.emerald)}
          <T x="74" y="140" textAnchor="middle" fill={C.emerald} fontWeight="600">σ²(t−1)</T>
          <T x="74" y="156" textAnchor="middle" fill={C.muted} fontSize="10">past variance</T>

          {box(176, 92, 96, 44, "var(--muted)", C.muted)}
          <T x="224" y="110" textAnchor="middle" fill={C.ink} fontWeight="600">σ²(t)</T>
          <T x="224" y="126" textAnchor="middle" fill={C.muted} fontSize="10">ω + αX² + βσ²</T>

          {box(320, 92, 74, 44, "var(--blue-tint)", C.blue)}
          <T x="357" y="116" textAnchor="middle" fill={C.blue} fontWeight="600">X(t)</T>

          <path d="M122,84 L176,104" stroke={C.blue} strokeWidth="1.8" markerEnd="url(#ar)" />
          <path d="M122,144 L176,124" stroke={C.emerald} strokeWidth="1.8" markerEnd="url(#ar)" />
          <path d="M272,114 L320,114" stroke={C.ink} strokeWidth="1.8" markerEnd="url(#ar)" />
          {/* feedback arc */}
          <path d="M224,136 C224,186 74,192 74,166" fill="none" stroke={C.emerald} strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#ar)" />
          <L x="148" y="80" fill={C.blue}>α</L>
          <L x="148" y="152" fill={C.emerald}>β</L>
          <T x="150" y="204" fill={C.muted} fontSize="11">the β path carries volatility forward cheaply</T>
          <defs>
            <marker id="ar" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill={C.muted} />
            </marker>
          </defs>
        </>
      );
    },
  },

  /* f11 — moneyness */
  moneyness: {
    caption: "Moneyness $M=\\log(P_0/K)$ — and how the labels flip between calls and puts.",
    render: () => (
      <>
        <line x1="44" y1="92" x2="390" y2="92" stroke={C.border} strokeWidth="2" />
        <line x1="217" y1="70" x2="217" y2="114" stroke={C.ink} strokeWidth="2" />
        <L x="217" y="132" textAnchor="middle" fill={C.ink}>M = 0</L>
        <L x="217" y="148" textAnchor="middle" fill={C.muted}>P₀ = K</L>
        <L x="70" y="64" fill={C.muted}>M &lt; 0  (P₀ &lt; K)</L>
        <L x="300" y="64" fill={C.muted}>M &gt; 0  (P₀ &gt; K)</L>

        <rect x="44" y="160" width="173" height="26" fill={C.red} opacity="0.1" />
        <rect x="217" y="160" width="173" height="26" fill={C.emerald} opacity="0.12" />
        <T x="130" y="178" textAnchor="middle" fill={C.red} fontSize="11.5" fontWeight="600">CALL: out of the money</T>
        <T x="304" y="178" textAnchor="middle" fill={C.emerald} fontSize="11.5" fontWeight="600">CALL: in the money</T>

        <rect x="44" y="192" width="173" height="26" fill={C.emerald} opacity="0.12" />
        <rect x="217" y="192" width="173" height="26" fill={C.red} opacity="0.1" />
        <T x="130" y="210" textAnchor="middle" fill={C.emerald} fontSize="11.5" fontWeight="600">PUT: in the money</T>
        <T x="304" y="210" textAnchor="middle" fill={C.red} fontSize="11.5" fontWeight="600">PUT: out of the money</T>
      </>
    ),
  },

  /* f4 — k-period return is a sum */
  ksum: {
    caption: "Log returns add across periods; that is the whole reason finance uses them.",
    render: () => {
      const xs = [60, 128, 196, 264, 332];
      const ys = [150, 118, 132, 86, 54];
      return (
        <>
          <line x1="40" y1="170" x2="390" y2="170" stroke={C.border} strokeWidth="1.5" />
          <path d={pathFrom(xs.map((x, i) => [x, ys[i]]))} fill="none" stroke={C.blue} strokeWidth="2" />
          {xs.map((x, i) => <circle key={i} cx={x} cy={ys[i]} r="4" fill={C.blue} />)}
          {xs.map((x, i) => <L key={i} x={x} y="188" textAnchor="middle" fill={C.muted}>{`log P${i === 0 ? "₀" : i === 4 ? "₄" : "₋"}`}</L>)}
          {xs.slice(0, 4).map((x, i) => (
            <g key={i}>
              <line x1={x} y1={ys[i]} x2={xs[i + 1]} y2={ys[i]} stroke={C.muted} strokeDasharray="2 2" />
              <line x1={xs[i + 1]} y1={ys[i]} x2={xs[i + 1]} y2={ys[i + 1]} stroke={C.emerald} strokeWidth="2.5" />
              <L x={xs[i + 1] + 6} y={(ys[i] + ys[i + 1]) / 2 + 4} fill={C.emerald}>{`r${i + 1}`}</L>
            </g>
          ))}
          <line x1="48" y1={ys[0]} x2="48" y2={ys[4]} stroke={C.amber} strokeWidth="3" />
          <L x="56" y="100" fill={C.amber}>r(4) = r₁+r₂+r₃+r₄</L>
          <T x="40" y="26" fill={C.ink} fontSize="11.5" fontWeight="600">Each step is a difference of logs; the total is their sum.</T>
        </>
      );
    },
  },

  /* f7 — stationary vs not */
  stationarity: {
    caption: "A stationary series reverts; a random walk does not.",
    render: () => {
      const r1 = rng(555); let y = 0; const st = [];
      for (let i = 0; i <= 170; i++) { y = 0.8 * y + gauss(r1) * 0.55; st.push([30 + (i / 170) * 165, 96 - y * 15]); }
      const r2 = rng(808); let w = 0; const rw = [];
      for (let i = 0; i <= 170; i++) { w += gauss(r2) * 0.42; rw.push([222 + (i / 170) * 165, 96 - w * 12]); }
      return (
        <>
          <line x1="30" y1="96" x2="195" y2="96" stroke={C.border} strokeDasharray="3 3" />
          <path d={pathFrom(st)} fill="none" stroke={C.emerald} strokeWidth="1.4" />
          <T x="30" y="150" fill={C.emerald} fontWeight="600">Stationary (log returns)</T>
          <T x="30" y="166" fill={C.muted} fontSize="11">keeps returning to a fixed level</T>

          <line x1="222" y1="96" x2="387" y2="96" stroke={C.border} strokeDasharray="3 3" />
          <path d={pathFrom(rw)} fill="none" stroke={C.red} strokeWidth="1.4" />
          <T x="222" y="150" fill={C.red} fontWeight="600">Random walk (prices)</T>
          <T x="222" y="166" fill={C.muted} fontSize="11">wanders off; no level to revert to</T>
        </>
      );
    },
  },

  /* f6 — kurtosis families */
  kurtosis: {
    caption: "Same mean and variance, different fourth moment.",
    render: () => {
      const dens = (kind, color, dash) => {
        const pts = [];
        for (let i = 0; i <= 200; i++) {
          const x = -3.8 + (i / 200) * 7.6;
          let y;
          if (kind === "lepto") y = 0.62 * Math.exp(-Math.abs(x) * 1.55) * 1.55 / 2 + 0.38 * Math.exp(-(x * x) / 4.2) / Math.sqrt(4.2 * Math.PI);
          else if (kind === "platy") y = Math.abs(x) < 1.95 ? 0.255 : 0.004;
          else y = Math.exp(-(x * x) / 2) / Math.sqrt(2 * Math.PI);
          pts.push([44 + ((x + 3.8) / 7.6) * 340, 160 - y * 235]);
        }
        return <path d={pathFrom(pts)} fill="none" stroke={color} strokeWidth="2" strokeDasharray={dash} />;
      };
      return (
        <>
          <Axes y0={160} xlabel="x" ylabel="density" />
          {dens("platy", C.emerald, "2 3")}
          {dens("meso", C.muted)}
          {dens("lepto", C.blue)}
          <L x="288" y="34" fill={C.blue}>leptokurtic  γ₂ &gt; 3</L>
          <L x="288" y="50" fill={C.muted}>normal  γ₂ = 3</L>
          <L x="288" y="66" fill={C.emerald}>platykurtic  γ₂ &lt; 3</L>
          <T x="52" y="146" fill={C.blue} fontSize="11">heavier here →</T>
        </>
      );
    },
  },
};

export function Diagram({ name }) {
  const d = DIAGRAMS[name];
  const body = useMemo(() => (d ? d.render() : null), [d, name]);
  if (!d) return null;
  return (
    <figure className="my-4 border rounded-lg bg-card overflow-hidden">
      <svg viewBox="0 0 420 224" className="w-full block" role="img" aria-label={d.caption}>
        {body}
      </svg>
      <figcaption className="text-[12px] text-muted-foreground px-4 pb-3 pt-1 leading-relaxed">
        {d.caption.replace(/\$/g, "")}
      </figcaption>
    </figure>
  );
}

export const DIAGRAM_NAMES = Object.keys(DIAGRAMS);
