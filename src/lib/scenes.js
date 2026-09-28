/* Scene templates for the full-lecture films.
 *
 * A film is a flat list of scenes, each declaring how long it runs; compile()
 * turns durations into absolute start times so a 25-scene lecture never needs
 * hand-maintained timestamps.
 *
 * Two layers draw a scene:
 *   - the canvas, via `draw`, for anything that moves or is plotted;
 *   - an HTML overlay, via `overlay`, for titles, definitions and formulas,
 *     so text is real text and math is real KaTeX rather than fillText.
 * The overlay changes once per scene and animates with CSS, which keeps the
 * per-frame work on the canvas where it belongs.
 */

import { PALETTE as P, clamp01, easeOut, lerp } from "@/lib/anim";

/* ---------------------------------------------------------------- compile */

/* Comfortable narration pace, in words per second. Browser speech synthesis at
   rate 1 lands around 2.7-2.9; below that a scene reads as unhurried. */
const WPS = 2.75;

/* A scene may not be shorter than the time its own narration needs. Authors
   declare the pacing they want; the compiler guarantees the line actually
   fits, so a scene can never cut its own voiceover off. */
export function compile({ id, title, blurb, takeaway, data, scenes }) {
  let at = 0;
  const out = [];
  for (const s of scenes) {
    if (!s) continue;
    const words = String(s.say || s.caption || "").trim().split(/\s+/).filter(Boolean).length;
    const dur = Math.max(s.dur, Math.ceil(words / WPS));
    out.push({ ...s, at, dur });
    at += dur;
  }
  return { id, title, blurb, takeaway, data, duration: at, scenes: out };
}

/* A soft tinted backdrop so text scenes are not floating on bare white. */
export function backdrop(ctx, W, H, tone = "blue") {
  const c = { blue: "#f1f6fe", emerald: "#eefbf5", amber: "#fdf7ec", slate: "#f4f6f9" }[tone] || "#f6f8fb";
  ctx.save();
  ctx.fillStyle = c;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

/* ------------------------------------------------------------- templates */

/* Chapter card. `n` is the chapter number shown large. */
export function title({ dur = 7, n, title: t, sub, chapter, say, tone = "slate" }) {
  return {
    dur, chapter: chapter ?? t,
    caption: sub ? `**${t}** — ${sub}` : `**${t}**`,
    say: say ?? `${t}. ${sub || ""}`,
    overlay: { kind: "title", n, title: t, sub, tone },
    draw: ({ ctx, W, H }) => backdrop(ctx, W, H, tone),
  };
}

/* A piece of jargon, defined before it is used. */
export function jargon({ dur = 16, term, plain, formal, say, chapter }) {
  return {
    dur, chapter,
    caption: `**${term}** — ${plain}`,
    say: say ?? `${term}. ${stripTex(plain)} ${formal ? stripTex(formal) : ""}`,
    overlay: { kind: "jargon", term, plain, formal },
    draw: ({ ctx, W, H }) => backdrop(ctx, W, H, "amber"),
  };
}

/* A short build of bullet points, staggered in by CSS. */
export function points({ dur = 18, heading, items, caption, say, chapter, tone = "slate" }) {
  return {
    dur, chapter,
    // the caption bar is the read-along surface, so it carries the heading AND
    // the first point rather than just repeating the title on screen
    caption: caption ?? `**${heading}** — ${items[0]}`,
    say: say ?? `${heading}. ${items.map(stripTex).join(". ")}`,
    overlay: { kind: "points", heading, items, tone },
    draw: ({ ctx, W, H }) => backdrop(ctx, W, H, tone),
  };
}

/* A formula, with optional annotations under it. */
export function formula({ dur = 18, heading, tex, notes = [], caption, say, chapter, tone = "blue" }) {
  return {
    dur, chapter,
    caption: caption ?? (notes.length ? `**${heading}** — ${notes[0]}` : `**${heading}**`),
    say: say ?? `${heading}. ${notes.map(stripTex).join(". ")}`,
    overlay: { kind: "formula", heading, tex, notes, tone },
    draw: ({ ctx, W, H }) => backdrop(ctx, W, H, tone),
  };
}

/* A derivation revealed one line at a time, paced across the scene. */
export function derive({ dur = 26, heading, lines, caption, say, chapter }) {
  return {
    dur, chapter,
    caption: caption ?? `**${heading}** — ${lines.length} steps; each line's justification sits to its right.`,
    say: say ?? `${heading}. ${lines.map((l) => stripTex(l[1] || "")).filter(Boolean).join(". ")}`,
    overlay: { kind: "derive", heading, lines },
    draw: ({ ctx, W, H }) => backdrop(ctx, W, H, "blue"),
  };
}

/* A graph scene: `draw` owns the canvas, `note` is an optional caption card. */
export function plot({ dur = 20, draw, caption, say, chapter, note, place = "top" }) {
  return {
    dur, chapter, caption, say: say ?? stripTex(caption),
    overlay: note ? { kind: "note", text: note, place } : null,
    draw,
  };
}

/* Code, shown as a listing rather than spoken line by line. */
export function code({ dur = 20, heading, file, body, caption, say, chapter }) {
  return {
    dur, chapter,
    caption: caption ?? `**${heading}** — \`${file}\`. Read it through; you should be able to reproduce this without help.`,
    say: say ?? `${heading}.`,
    overlay: { kind: "code", heading, file, body },
    draw: ({ ctx, W, H }) => backdrop(ctx, W, H, "slate"),
  };
}

/* Closing card: the handful of things to carry out of the module. */
export function recap({ dur = 22, items, say, chapter = "Recap" }) {
  return {
    dur, chapter,
    caption: "**Recap** — the things worth carrying out of this module.",
    say: say ?? `To recap. ${items.map(stripTex).join(". ")}`,
    overlay: { kind: "recap", items },
    draw: ({ ctx, W, H }) => backdrop(ctx, W, H, "emerald"),
  };
}

/* --------------------------------------------------------------- helpers */

/* Narration is spoken, so TeX and markdown have to come out of it. Keeps a
   readable phrase for the common symbols rather than dropping them silently. */
const SPOKEN = [
  [/\\sqrt\{([^}]*)\}/g, "the square root of $1"],
  [/\\frac\{([^}]*)\}\{([^}]*)\}/g, "$1 over $2"],
  [/\\sigma\^2/g, "sigma squared"], [/\\sigma/g, "sigma"],
  [/\\mu/g, "mu"], [/\\nu/g, "nu"], [/\\tau/g, "tau"], [/\\phi/g, "phi"],
  [/\\alpha/g, "alpha"], [/\\beta/g, "beta"], [/\\epsilon/g, "epsilon"],
  [/\\gamma_1/g, "skewness"], [/\\gamma_2/g, "kurtosis"], [/\\gamma/g, "gamma"],
  [/\\rho/g, "rho"], [/\\omega/g, "omega"], [/\\lambda/g, "lambda"],
  [/\\Phi/g, "Phi"], [/\\chi\^2/g, "chi squared"],
  [/\\E\b/g, "the expected value of"], [/\\Var\b/g, "the variance of"],
  [/\\Cov\b/g, "the covariance of"],
  [/\\log/g, "log"], [/\\exp/g, "exp"], [/\\infty/g, "infinity"],
  [/\\le\b/g, "less than or equal to"], [/\\ge\b/g, "greater than or equal to"],
  [/\\ne\b/g, "not equal to"], [/\\approx/g, "approximately"],
  [/\\cdot|\\times/g, "times"], [/\\pm/g, "plus or minus"],
  [/\\sum/g, "the sum of"], [/\\int/g, "the integral of"],
  [/\\big[lr]?|\\left|\\right|\\!|\\,|\\;|\\quad|\\qquad/g, " "],
  [/\\text\{([^}]*)\}/g, "$1"], [/\\mathbb\{([^}]*)\}/g, "$1"],
  [/\\operatorname\{([^}]*)\}/g, "$1"],
  [/\\[a-zA-Z]+/g, " "],
];

export function stripTex(s = "") {
  let out = String(s);
  // math spans first, so the symbol rules only see math
  out = out.replace(/\$\$?([^$]*)\$\$?/g, (_, inner) => {
    let m = inner;
    for (const [re, to] of SPOKEN) m = m.replace(re, to);
    return ` ${m.replace(/[{}^_\\]/g, " ")} `;
  });
  return out
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]*)\*\*/g, "$1")
    .replace(/\*([^*]*)\*/g, "$1")
    .replace(/\\\$/g, "$")
    .replace(/[•·]/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
}

/* Progressive reveal helper for canvas scenes: how many of `n` items are in
   by local time `t`, easing so the last few do not all land at once. */
export function revealed(t, dur, n, { start = 0.05, end = 0.75 } = {}) {
  const k = clamp01((t / dur - start) / (end - start));
  return Math.round(n * easeOut(k));
}

export { P, clamp01, easeOut, lerp };
