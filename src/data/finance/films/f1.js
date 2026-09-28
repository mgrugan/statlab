/* f1 — Assets, Options, and the Payoff Function (full lecture) */

import { PALETTE as P, linspace, clamp01, easeOut, lerp, normPdf } from "@/lib/anim";
import { compile, title, jargon, points, formula, plot, code, recap, revealed } from "@/lib/scenes";
import { CALL, money, callPayoff, putPayoff, upTo } from "./shared";

const D = CALL;

export default compile({
  id: "f1",
  title: "Assets, Options, and the Payoff Function",
  blurb: "The whole module in one sitting: what an option is, what its payoff looks like, and why the single most natural way to price one is wrong.",
  takeaway: "Everything later in the course exists to put a number on $\\E\\big((P_T-K)^+\\big)$. This module is about why that expression, and not something simpler, is the thing to compute.",
  data: D,
  scenes: [

    /* ---------------- 1. the goal ---------------- */
    title({ n: 1, title: "What are we actually doing?", tone: "slate", chapter: "What are we doing?",
      sub: "Nine modules of statistics, aimed at one number.",
      say: "Chapter one. What are we actually doing? This whole course is nine modules of statistics aimed at computing one number.", dur: 8 }),

    points({ dur: 22, heading: "The course in three sentences", chapter: "What are we doing?",
      items: [
        "Somebody wants to buy the **right** to purchase a stock later, at a price fixed today.",
        "That right is worth something now — but how much? You cannot look it up; you have to **compute** it.",
        "Computing it means making a **statistical model** of where the price might end up. Everything else follows from that.",
      ],
      say: "The course in three sentences. Somebody wants to buy the right to purchase a stock later, at a price fixed today. That right is worth something now — but how much? You cannot look it up, you have to compute it. And computing it means making a statistical model of where the price might end up. Everything else in this course follows from that one problem." }),

    /* ---------------- 2. the cast ---------------- */
    title({ n: 2, title: "The cast of characters", tone: "amber",
      sub: "Four words you will see on every slide from here on.",
      say: "Chapter two. The cast of characters — four words you will see on every slide from here on.", dur: 7 }),

    jargon({ dur: 20, term: "Asset", chapter: "The cast of characters",
      plain: "Anything you can own that has a price. A share of stock, a barrel of oil, a bond.",
      formal: "In this course the asset is almost always a **stock**, and its price at time $t$ is written $P_t$. Today is $t=0$, so today's price is $P_0$.",
      say: "An asset is anything you can own that has a price. A share of stock, a barrel of oil, a bond. In this course the asset is almost always a stock, and we write its price at time t as P sub t. Today is time zero, so today's price is P sub zero." }),

    jargon({ dur: 15, term: "Derivative",
      plain: "A contract whose value is **derived** from something else's price. It has no value of its own — it just watches the asset and pays out accordingly.",
      formal: "The asset it watches is called the **underlying**.",
      say: "A derivative is a contract whose value is derived from something else's price. It has no value of its own. It just watches the asset and pays out accordingly. The asset it watches is called the underlying." }),

    jargon({ dur: 18, term: "Option",
      plain: "A derivative that gives you a **right, not an obligation**. That single word is where all the interesting mathematics comes from.",
      formal: "Because you can walk away, your losses stop at zero while your gains do not. That asymmetry is the whole subject.",
      say: "An option is a derivative that gives you a right, not an obligation. That single word — right, not obligation — is where all the interesting mathematics comes from. Because you can walk away, your losses stop at zero while your gains do not. That asymmetry is the whole subject." }),

    jargon({ dur: 14, term: "Strike price, $K$",
      plain: "The price written into the contract — the price you are allowed to trade at, no matter what the market is doing.",
      formal: "Fixed today, and it never changes. The market price $P_T$ moves; $K$ does not.",
      say: "The strike price, written K, is the price written into the contract. It's the price you're allowed to trade at, no matter what the market is doing. It's fixed today and never changes. The market price moves; K does not." }),

    /* ---------------- 3. calls and puts ---------------- */
    title({ n: 3, title: "Calls and puts", tone: "blue",
      sub: "Two contracts, mirror images of each other.",
      say: "Chapter three. Calls and puts — two contracts that are mirror images of each other.", dur: 7 }),

    plot({ dur: 20, chapter: "Calls and puts",
      caption: "A **call** gives you the right to **buy** at $K$. You use it when the price ends up **above** $K$ — you buy cheap and sell at the market price.",
      say: "A call gives you the right to buy at K. You'd use it when the price ends up above K, because then you buy cheap at K and sell at the higher market price. Below K you just walk away, and the contract pays nothing.",
      note: "**Call** — the right to *buy* at $K$",
      draw({ ctx, W, H, t, dur, axes }) {
        const a = axes(ctx, { x: [40, 180], y: [-12, 80], W, H, pad: { l: 56, r: 22, t: 54, b: 38 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [40, 100, 140, 180], ys: [0, 40, 80], xfmt: (v) => `$${v}`, yfmt: (v) => `$${v}` });
        a.hline(0, { color: P.grid, dash: null });
        a.vline(D.K, { color: P.amber, width: 2 });
        a.label("K = $100", { x: D.K + 3, y: 73, color: P.amber, size: 12.5 });
        const k = easeOut(clamp01(t / (dur * 0.55)));
        a.line(upTo(callPayoff(D.K, 40, 180), k), { color: P.blue, width: 3 });
        if (k > 0.8) {
          a.note("walk away — pays nothing", a.sx(46), a.sy(4) - 16, { color: P.muted, size: 11.5, weight: 600 });
          a.note("buy at $100, sell higher", a.sx(126), a.sy(52), { color: P.blue, size: 11.5, weight: 600 });
        }
      } }),

    plot({ dur: 20,
      caption: "A **put** is the mirror: the right to **sell** at $K$. It pays when the price ends up **below** $K$ — and note its upside is capped, because the price can only fall to zero.",
      say: "A put is the mirror image: the right to sell at K. It pays when the price ends up below K. Notice its upside is capped, because a price can only fall as far as zero. A call's upside has no such ceiling. That difference matters later.",
      note: "**Put** — the right to *sell* at $K$",
      draw({ ctx, W, H, t, dur, axes }) {
        const a = axes(ctx, { x: [40, 180], y: [-12, 80], W, H, pad: { l: 56, r: 22, t: 54, b: 38 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [40, 100, 140, 180], ys: [0, 40, 80], xfmt: (v) => `$${v}`, yfmt: (v) => `$${v}` });
        a.hline(0, { color: P.grid, dash: null });
        a.vline(D.K, { color: P.amber, width: 2 });
        a.line(callPayoff(D.K, 40, 180), { color: P.blue, width: 1.6, alpha: 0.35, dash: [5, 4] });
        const k = easeOut(clamp01(t / (dur * 0.55)));
        a.line(upTo(putPayoff(D.K, 40, 180).slice().reverse(), k).reverse(), { color: P.emerald, width: 3 });
        a.note("call", a.sx(150), a.sy(44), { color: P.blue, size: 11.5, weight: 600, align: "right" });
        if (k > 0.7) a.note("capped at $100 — the price can only fall to zero", a.sx(46), a.sy(66), { color: P.emerald, size: 11.5, weight: 600 });
      } }),

    points({ dur: 25, heading: "European or American — it is about *when*, not where", tone: "blue",
      items: [
        "**European**: exercisable only **at expiration**, on date $T$. This is what Black-Scholes prices.",
        "**American**: exercisable **any time up to** $T$.",
        "Extra rights cannot reduce value, so an American option is worth **at least** as much as its European twin.",
        "The names are historical accident. Both trade everywhere.",
      ],
      say: "European or American is about when you may exercise, not about geography. A European option is exercisable only at expiration, on date T — and that is what Black-Scholes prices. An American option is exercisable any time up to T. Extra rights cannot reduce value, so an American option is worth at least as much as its European twin. The names are a historical accident; both trade everywhere." }),

    /* ---------------- 4. the payoff function ---------------- */
    title({ n: 4, title: "The payoff function", tone: "blue",
      sub: "One line of notation that does a lot of work.",
      say: "Chapter four. The payoff function — one line of notation that does a lot of work.", dur: 7 }),

    formula({ dur: 28, chapter: "The payoff function",
      heading: "What the contract pays at expiry",
      tex: "\\text{payoff}=(P_T-K)^+=\\max(P_T-K,\\;0)",
      notes: [
        "The superscript $+$ means **positive part**: keep the number if it is positive, otherwise take zero.",
        "$P_T$ is the price at expiry — unknown today, which is why this is a **random variable**.",
        "$K$ is fixed and known. All the uncertainty sits in $P_T$.",
      ],
      say: "Here is what the contract pays at expiry. P sub T minus K, positive part — which is the same as the maximum of P minus K and zero. The superscript plus means positive part: keep the number if it's positive, otherwise take zero. P sub T is the price at expiry, unknown today, which is exactly why it's a random variable. K is fixed and known. All the uncertainty sits in P sub T." }),

    plot({ dur: 22,
      caption: "Draw it and the positive part becomes obvious: a **flat floor** at zero, then a **45-degree line**. The kink sits exactly at the strike.",
      say: "Draw it and the positive part becomes obvious. A flat floor at zero, then a forty five degree line rising with no ceiling. The kink sits exactly at the strike. Statisticians call this a hockey stick, and the bend is the single most important feature in this course.",
      note: "the kink at $K$ is where the option stops being worthless",
      draw({ ctx, W, H, t, dur, axes }) {
        const a = axes(ctx, { x: [40, 180], y: [-12, 80], W, H, pad: { l: 56, r: 22, t: 54, b: 38 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [40, 100, 140, 180], ys: [0, 40, 80], xfmt: (v) => `$${v}`, yfmt: (v) => `$${v}` });
        a.hline(0, { color: P.grid, dash: null });
        const k = easeOut(clamp01(t / (dur * 0.5)));
        const flat = linspace(40, D.K, 40).map((x) => [x, 0]);
        const up = linspace(D.K, 180, 80).map((x) => [x, x - D.K]);
        a.line(flat, { color: P.red, width: 4 });
        if (k > 0.05) a.line(upTo(up, k), { color: P.emerald, width: 4 });
        a.vline(D.K, { color: P.amber, width: 1.6 });
        a.note("loss stops here", a.sx(48), a.sy(0) - 16, { color: P.red, size: 12, weight: 600 });
        if (k > 0.75) a.note("gain does not", a.sx(132), a.sy(46), { color: P.emerald, size: 12, weight: 600 });
      } }),

    /* ---------------- 5. two routes ---------------- */
    title({ n: 5, title: "Two ways to get at $P_T$", tone: "slate",
      sub: "One is hopeless. The other is this course.",
      say: "Chapter five. Two ways to get at P sub T. One of them is hopeless. The other one is this course.", dur: 8 }),

    points({ dur: 18, heading: "Route one — predict the price", chapter: "Two ways to get at $P_T$", tone: "slate",
      items: [
        "Forecast a **single number** for $P_T$ and plug it into the payoff.",
        "If you could do this reliably, you would not be watching a statistics lecture — you would be on a beach.",
      ],
      say: "Route one: predict the price. Forecast a single number for P sub T and plug it into the payoff. If you could do that reliably, you would not be watching a statistics lecture. You would be on a beach." }),

    points({ dur: 24, heading: "Route two — model the whole distribution", tone: "emerald",
      items: [
        "Do not ask *what will the price be*. Ask **what is the range of things it could be, and how likely is each**.",
        "This is achievable — and it turns out to be **enough**, because a payoff averaged over a distribution is a perfectly good price.",
        "So the object we need is $\\E\\big((P_T-K)^+\\big)$: the **average payoff** over everything that might happen.",
      ],
      say: "Route two: model the whole distribution. Don't ask what the price will be. Ask what is the range of things it could be, and how likely is each. This is achievable, and it turns out to be enough, because a payoff averaged over a distribution is a perfectly good price. So the object we need is the expected value of P sub T minus K, positive part. The average payoff over everything that might happen." }),

    /* ---------------- 6. Jensen ---------------- */
    title({ n: 6, title: "The mistake everyone makes", tone: "amber",
      sub: "You cannot swap the expectation and the positive part.",
      say: "Chapter six. The mistake everyone makes. You cannot swap the expectation and the positive part.", dur: 8 }),

    plot({ dur: 24, chapter: "The mistake everyone makes",
      caption: "Suppose you know $\\E(P_T)=\\$120$ and $K=\\$100$. The tempting move is to say the option is worth \\$20. Watch what that actually computes.",
      say: "Suppose you know the expected price is a hundred and twenty dollars, and the strike is a hundred. The tempting move is to say, well then, the option is worth twenty dollars. Let's watch what that calculation is actually doing. It takes the average price first, then applies the payoff to that single number. It's the payoff of the average.",
      note: "the tempting move: average first, **then** apply the payoff",
      draw({ ctx, W, H, t, dur, axes, fade }) {
        const a = axes(ctx, { x: [40, 200], y: [-12, 90], W, H, pad: { l: 56, r: 22, t: 54, b: 38 } });
        const f = fade(t, dur);
        a.grid(5, 4).frame();
        a.ticks({ xs: [40, 100, 140, 180], ys: [0, 40, 80], xfmt: (v) => `$${v}`, yfmt: (v) => `$${v}` });
        a.hline(0, { color: P.grid, dash: null });
        a.line(callPayoff(D.K, 40, 200), { color: P.blue, width: 2.6 });
        a.vline(D.K, { color: P.amber, width: 1.4, alpha: 0.6 });
        const k = easeOut(clamp01(t / (dur * 0.45)));
        a.vline(D.EP, { color: P.ink, width: 2, dash: [5, 4], alpha: k });
        a.label("E(P_T) = $120", { x: D.EP + 3, y: 84, color: P.ink, alpha: k, size: 12 });
        if (k > 0.5) {
          a.dots([[D.EP, D.naive]], { color: P.ink, r: 5 });
          a.chip(`payoff of the average = ${money(D.naive)}`, a.L + 10, a.T + 16, { color: P.ink, bg: "rgba(30,41,59,0.08)", alpha: f });
        }
      } }),

    plot({ dur: 26,
      caption: "But you do not get the average outcome — you get **all** the outcomes. Drop 200 of them on the payoff curve and average the **payoffs** instead.",
      say: "But you don't get the average outcome. You get all of the outcomes. So let's drop two hundred simulated prices onto the payoff curve, and average the payoffs instead of applying the payoff to the average. Notice what happens to the ones that land below the strike. They all pay exactly the same thing — nothing. The ones above are spread across a long tail.",
      note: "each dot falls onto the payoff curve — then we average **those**",
      draw({ ctx, W, H, t, dur, axes, data }) {
        const a = axes(ctx, { x: [40, 200], y: [-12, 90], W, H, pad: { l: 56, r: 22, t: 54, b: 38 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [40, 100, 140, 180], ys: [0, 40, 80], xfmt: (v) => `$${v}`, yfmt: (v) => `$${v}` });
        a.hline(0, { color: P.grid, dash: null });
        a.line(callPayoff(D.K, 40, 200), { color: P.blue, width: 2.6 });
        a.vline(D.K, { color: P.amber, width: 1.4, alpha: 0.6 });
        const n = revealed(t, dur, data.draws.length, { start: 0.02, end: 0.8 });
        for (let i = 0; i < n; i++) {
          const x = data.draws[i];
          if (x > 200 || x < 40) continue;
          const age = clamp01((n - i) / 26);
          const y = lerp(84, Math.max(0, x - D.K), easeOut(age));
          a.dots([[x, y]], { color: x > D.K ? P.emerald : P.red, r: 2.6, alpha: 0.3 + 0.5 * age });
        }
        const inm = data.draws.slice(0, n).filter((x) => x > D.K).length;
        if (n > 10) a.chip(`${inm} of ${n} finish in the money`, a.R - 10, a.T + 16, { align: "right", color: P.emerald, bg: "rgba(0,164,114,0.10)" });
      } }),

    plot({ dur: 24,
      caption: "The honest answer is $\\$25.44$, not $\\$20$. The \\$5.44 gap is real money, and it is there because the payoff curve **bends**.",
      say: "The honest answer is twenty five dollars and forty four cents, not twenty. That five dollar forty four cent gap is real money. And it is there entirely because the payoff curve bends at the strike. Averaging before the bend and averaging after the bend are different operations.",
      note: "**Jensen's inequality** in dollars",
      draw({ ctx, W, H, t, dur, axes }) {
        const a = axes(ctx, { x: [40, 200], y: [-12, 90], W, H, pad: { l: 56, r: 22, t: 54, b: 38 } });
        a.grid(5, 4).frame();
        a.ticks({ xs: [40, 100, 140, 180], ys: [0, 40, 80], xfmt: (v) => `$${v}`, yfmt: (v) => `$${v}` });
        a.hline(0, { color: P.grid, dash: null });
        a.line(callPayoff(D.K, 40, 200), { color: P.blue, width: 2.2, alpha: 0.75 });
        a.dots(D.draws.filter((x) => x < 200).map((x) => [x, Math.max(0, x - D.K)]), { color: P.muted, r: 2.1, alpha: 0.22 });
        const k = easeOut(clamp01(t / (dur * 0.4)));
        a.hline(D.naive, { color: P.ink, width: 1.6, dash: [5, 4], alpha: 0.6 });
        a.hline(lerp(D.naive, D.fair, k), { color: P.emerald, width: 2.6, dash: null });
        a.chip(`payoff of the average  ${money(D.naive)}`, a.L + 10, a.T + 16, { color: P.ink, bg: "rgba(30,41,59,0.08)" });
        a.chip(`average of the payoffs  ${money(lerp(D.naive, D.fair, k))}`, a.L + 10, a.T + 44, { color: P.emerald, bg: "rgba(0,164,114,0.12)" });
        if (k > 0.95) {
          const y0 = a.sy(D.naive), y1 = a.sy(D.fair), x = a.R - 52;
          ctx.save();
          ctx.strokeStyle = P.emerald; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x - 5, y1 + 6); ctx.lineTo(x, y1); ctx.lineTo(x + 5, y1 + 6); ctx.stroke();
          ctx.restore();
          a.note(`+${money(D.gap)}`, x + 8, (y0 + y1) / 2, { color: P.emerald, size: 12.5, weight: 700 });
        }
      } }),

    formula({ dur: 29, tone: "amber",
      heading: "Jensen's inequality — the rule behind the gap",
      tex: "\\E\\big((P_T-K)^+\\big)\\;\\ge\\;\\big(\\E(P_T)-K\\big)^+",
      notes: [
        "It holds for any **convex** function, and $x^+$ is convex — that is what the kink buys.",
        "The inequality points one way only. The true value is **never** below the naive one.",
        "Read it as: *averaging, then bending* gives less than *bending, then averaging*.",
      ],
      say: "This is Jensen's inequality, and it's the rule behind the gap. The expected value of the payoff is greater than or equal to the payoff of the expected value. It holds for any convex function, and the positive part is convex — that's exactly what the kink buys us. Note the inequality points one way only: the true value is never below the naive one. Read it as, averaging then bending gives you less than bending then averaging." }),

    points({ dur: 20, heading: "Why this is the whole module", tone: "amber",
      items: [
        "A point forecast of $P_T$ — even a **perfect** one — is not enough to price an option.",
        "You need the **spread**, because the bend treats the two sides of the distribution differently.",
        "That is why the next nine modules are about distributions, not predictions.",
      ],
      say: "And this is why this is the whole module. A point forecast of P sub T — even a perfect one — is not enough to price an option. You need the spread, because the bend treats the two sides of the distribution differently. That is exactly why the next nine modules are about distributions, and not about predictions." }),

    /* ---------------- 7. data ---------------- */
    title({ n: 7, title: "Getting the data", tone: "slate",
      sub: "Before any of this, you need prices.",
      say: "Chapter seven. Getting the data. Before any of this works, you need prices.", dur: 6 }),

    code({ dur: 18, chapter: "Getting the data",
      heading: "Downloading prices", file: "prices.py",
      body: `import yfinance as yf

# daily bars for one ticker
amgn = yf.download("AMGN", start="2015-01-01", end="2024-12-31")

# 'Close' is adjusted for splits and dividends
px = amgn["Close"]`,
      say: "In Python, y finance downloads daily bars for a ticker straight into a data frame. The Close column is the one you want, because it's already adjusted for splits and dividends." }),

    points({ dur: 19, heading: "Pitfall 1 — unadjusted prices", tone: "amber",
      items: [
        "A 2-for-1 split halves the quoted price overnight while your holding is unchanged.",
        "Unadjusted, that reads as a $-50\\%$ return **that never happened**. Always use adjusted closes.",
      ],
      say: "Pitfall one: unadjusted prices. A two for one split halves the quoted price overnight, while what you actually hold is unchanged. Unadjusted, that reads as a minus fifty percent return that never happened. Always use adjusted closing prices." }),

    points({ dur: 20, heading: "Pitfall 2 — survivorship bias", tone: "amber",
      items: [
        "An index's **current** members are, by definition, the ones that did not go bust.",
        "Backtest on today's list and you have quietly assumed you only ever bought the winners.",
      ],
      say: "Pitfall two: survivorship bias. An index's current members are, by definition, the ones that did not go bust. So if you backtest on today's list, you have quietly assumed that you only ever bought the winners." }),

    points({ dur: 19, heading: "Pitfall 3 — the calendar", tone: "amber",
      items: [
        "Markets close at weekends and on holidays.",
        "There are about **252** trading days in a year, not 365 — which is why $\\sqrt{252}$ appears whenever we annualize.",
      ],
      say: "Pitfall three: the calendar. Markets close at weekends and on holidays. There are about two hundred and fifty two trading days in a year, not three hundred and sixty five. That is why the square root of two fifty two shows up whenever we annualize." }),

    /* ---------------- recap ---------------- */
    recap({ dur: 32, items: [
      "An option is a **right, not an obligation** — so losses truncate at zero and gains do not.",
      "The payoff is $(P_T-K)^+$: flat below the strike, 45 degrees above it.",
      "We price by **modelling the distribution** of $P_T$, not by predicting it.",
      "$\\E\\big((P_T-K)^+\\big)\\ne\\big(\\E(P_T)-K\\big)^+$. Jensen's inequality says the true value is the larger one — by \\$5.44 in our example.",
      "Use **adjusted** prices, beware survivorship bias, and remember there are ~252 trading days a year.",
    ],
    say: "To recap. An option is a right, not an obligation, so losses truncate at zero while gains do not. The payoff is flat below the strike and forty five degrees above it. We price it by modelling the distribution of the final price, not by predicting it. And crucially, the expected payoff is not the payoff of the expected value. Jensen's inequality says the true value is the larger one, by five dollars forty four in our example." }),
  ],
});
