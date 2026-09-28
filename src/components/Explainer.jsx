import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Film, List, Gauge } from "lucide-react";
import { Panel, SectionLabel } from "@/components/shared";
import { Rich, TeX } from "@/components/Math";
import { EXPLAINERS } from "@/data/finance/explainers";
import { PALETTE, axes, fade } from "@/lib/anim";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------- speech */

/* Browser speech synthesis, driven by the timeline rather than its own queue:
   a scene's line is spoken once when the playhead enters it, and everything is
   cancelled on pause, scrub or unmount. Voices load asynchronously on most
   browsers, hence the voiceschanged listener. */
function useNarrator(enabled, rate) {
  const voiceRef = useRef(null);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!supported) return;
    const pick = () => {
      const vs = speechSynthesis.getVoices().filter((v) => v.lang.startsWith("en"));
      if (!vs.length) return;
      voiceRef.current =
        vs.find((v) => /natural|neural|premium|enhanced/i.test(v.name)) ||
        vs.find((v) => v.localService && /samantha|daniel|karen|moira/i.test(v.name)) ||
        vs.find((v) => v.default) || vs[0];
    };
    pick();
    speechSynthesis.addEventListener("voiceschanged", pick);
    return () => speechSynthesis.removeEventListener("voiceschanged", pick);
  }, [supported]);

  const stop = useCallback(() => { if (supported) speechSynthesis.cancel(); }, [supported]);

  const say = useCallback((text) => {
    if (!supported || !enabled || !text) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voiceRef.current) u.voice = voiceRef.current;
    u.rate = rate; u.pitch = 1; u.volume = 1;
    speechSynthesis.speak(u);
  }, [supported, enabled, rate]);

  useEffect(() => stop, [stop]);
  return { say, stop, supported };
}

/* --------------------------------------------------------------- overlay */

const TONE = {
  blue: "text-blue", emerald: "text-emerald-deep", amber: "text-amber", slate: "text-slate-deep",
};

/* Staggered entrance without re-rendering per frame: the overlay remounts once
   per scene (keyed on the index), so CSS replays the animation each time. */
const step = (i) => ({ animationDelay: `${i * 110}ms`, animationFillMode: "backwards" });

function Overlay({ o, idx }) {
  if (!o) return null;
  const box = "absolute inset-0 flex flex-col justify-center px-6 md:px-10 py-6 pointer-events-none";

  if (o.kind === "note") {
    return (
      <div className={cn("absolute px-4 md:px-6 pointer-events-none",
        o.place === "bottom" ? "left-0 right-0 bottom-3" : "left-0 right-0 top-3")}>
        <div key={idx} className="animate-in fade-in slide-in-from-top-1 duration-300 inline-block max-w-[74ch]
          rounded-md bg-card/92 border px-3.5 py-2 text-[13.5px] leading-snug shadow-sm backdrop-blur-[1px]">
          <Rich text={o.text} />
        </div>
      </div>
    );
  }

  if (o.kind === "title") {
    return (
      <div className={box} key={idx}>
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {o.n != null && (
            <div className={cn("label-mono mb-2", TONE[o.tone] || "text-muted-foreground")}>
              Chapter {o.n}
            </div>
          )}
          <h3 className="text-[26px] md:text-[34px] font-semibold tracking-tight leading-tight max-w-[22ch]">
            <Rich text={o.title} />
          </h3>
          {o.sub && (
            <p className="text-[15px] md:text-[17px] text-muted-foreground mt-3 max-w-[48ch] leading-relaxed"
               style={step(1)}>
              <Rich text={o.sub} />
            </p>
          )}
        </div>
      </div>
    );
  }

  if (o.kind === "jargon") {
    return (
      <div className={box} key={idx}>
        <div className="animate-in fade-in duration-300">
          <div className="label-mono text-amber mb-2">The word means</div>
          <div className="text-[24px] md:text-[30px] font-semibold tracking-tight">
            <Rich text={o.term} />
          </div>
          <p className="text-[16px] md:text-[18px] leading-relaxed mt-3 max-w-[54ch]" style={step(1)}>
            <Rich text={o.plain} />
          </p>
          {o.formal && (
            <p className="text-[14px] leading-relaxed mt-3 max-w-[54ch] text-muted-foreground border-l-2 border-amber pl-3"
               style={step(2)}>
              <Rich text={o.formal} />
            </p>
          )}
        </div>
      </div>
    );
  }

  if (o.kind === "points") {
    return (
      <div className={box} key={idx}>
        {o.heading && (
          <h4 className="text-[17px] md:text-[20px] font-semibold mb-4 animate-in fade-in duration-300">
            <Rich text={o.heading} />
          </h4>
        )}
        <ul className="grid gap-2.5 max-w-[62ch]">
          {o.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-[14.5px] md:text-[16px] leading-relaxed
              animate-in fade-in slide-in-from-left-2 duration-400" style={step(i + 1)}>
              <span className={cn("label-mono mt-1 shrink-0", TONE[o.tone] || "text-blue")}>{i + 1}</span>
              <span><Rich text={it} /></span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (o.kind === "formula") {
    return (
      <div className={box} key={idx}>
        {o.heading && (
          <h4 className="text-[16px] md:text-[18px] font-semibold mb-3 animate-in fade-in duration-300">
            <Rich text={o.heading} />
          </h4>
        )}
        <div className="rounded-lg bg-card/85 border px-4 py-4 overflow-x-auto animate-in fade-in zoom-in-95 duration-400"
             style={step(1)}>
          <TeX block>{o.tex}</TeX>
        </div>
        {o.notes?.length > 0 && (
          <ul className="grid gap-1.5 mt-3 max-w-[64ch]">
            {o.notes.map((n, i) => (
              <li key={i} className="text-[13.5px] md:text-[14.5px] leading-relaxed text-foreground/85
                animate-in fade-in duration-300" style={step(i + 2)}>
                <Rich text={n} />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (o.kind === "derive") {
    return (
      <div className={cn(box, "justify-start pt-5")} key={idx}>
        {o.heading && (
          <h4 className="text-[15px] md:text-[17px] font-semibold mb-3 shrink-0 animate-in fade-in duration-300">
            <Rich text={o.heading} />
          </h4>
        )}
        <div className="grid gap-1 overflow-y-auto min-h-0">
          {o.lines.map(([tex, why], i) => (
            <div key={i} className="flex flex-wrap items-baseline gap-x-3 rounded-md px-2.5 py-1.5 bg-card/75
              animate-in fade-in slide-in-from-left-2 duration-400" style={step(i + 1)}>
              <span className="overflow-x-auto"><TeX>{tex}</TeX></span>
              {why && <span className="text-[12px] text-muted-foreground"><Rich text={why} /></span>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (o.kind === "code") {
    return (
      <div className={cn(box, "justify-start pt-5")} key={idx}>
        <div className="flex items-center gap-2 mb-2 animate-in fade-in duration-300">
          <h4 className="text-[15px] font-semibold"><Rich text={o.heading} /></h4>
          {o.file && <span className="label-mono text-muted-foreground">{o.file}</span>}
        </div>
        <pre className="font-mono text-[11.5px] md:text-[13px] leading-relaxed text-code-fg bg-code-bg
          rounded-lg p-3.5 overflow-auto min-h-0 animate-in fade-in duration-400" style={step(1)}>{o.body}</pre>
      </div>
    );
  }

  if (o.kind === "recap") {
    return (
      <div className={box} key={idx}>
        <div className="label-mono text-emerald-deep mb-3 animate-in fade-in duration-300">Carry this out</div>
        <ul className="grid gap-2.5 max-w-[64ch]">
          {o.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-[14.5px] md:text-[16px] leading-relaxed
              animate-in fade-in slide-in-from-bottom-1 duration-400" style={step(i + 1)}>
              <span className="text-emerald-deep mt-0.5 shrink-0">✓</span>
              <span><Rich text={it} /></span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return null;
}

/* ---------------------------------------------------------------- player */

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const RATES = [0.9, 1, 1.25, 1.5];

export default function Explainer({ moduleId }) {
  const film = EXPLAINERS[moduleId];
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const rafRef = useRef(0);
  const clockRef = useRef({ t: 0, last: 0 });
  const spokenRef = useRef(-1);
  const errRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [sound, setSound] = useState(true);
  const [rate, setRate] = useState(1);
  const [started, setStarted] = useState(false);
  const [showChapters, setShowChapters] = useState(false);
  const [sceneError, setSceneError] = useState(null);

  const { say, stop, supported } = useNarrator(sound, rate);
  const duration = film?.duration ?? 0;

  const sceneIdx = useMemo(() => {
    if (!film) return 0;
    let i = 0;
    for (let k = 0; k < film.scenes.length; k++) if (t >= film.scenes[k].at) i = k;
    return i;
  }, [film, t]);
  const scene = film?.scenes[sceneIdx];

  /* chapters: the scenes that declared one, with where they start */
  const chapters = useMemo(() => {
    if (!film) return [];
    const out = [];
    film.scenes.forEach((s, i) => {
      if (s.chapter && out[out.length - 1]?.label !== s.chapter) out.push({ label: s.chapter, at: s.at, i });
    });
    return out;
  }, [film]);
  const chapterIdx = useMemo(() => {
    let c = -1;
    chapters.forEach((ch, i) => { if (t >= ch.at) c = i; });
    return c;
  }, [chapters, t]);

  const render = useCallback((time) => {
    const cv = canvasRef.current;
    if (!cv || !film) return;
    const ctx = cv.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const W = cv.width / dpr, H = cv.height / dpr;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = PALETTE.paper;
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < film.scenes.length; i++) {
      const s = film.scenes[i];
      const end = s.at + s.dur;
      if (time < s.at || time >= end) continue;
      const local = time - s.at;
      ctx.save();
      try {
        s.draw?.({ ctx, W, H, t: local, dur: s.dur, k: s.dur ? local / s.dur : 0, data: film.data, axes, fade });
      } catch (err) {
        errRef.current = `scene ${i}: ${err.message}`;
      }
      ctx.restore();
    }
    ctx.restore();

    if (errRef.current) {
      const msg = errRef.current;
      errRef.current = null;
      setSceneError((prev) => (prev === msg ? prev : msg));
    }
  }, [film]);

  useEffect(() => {
    const cv = canvasRef.current, wrap = wrapRef.current;
    if (!cv || !wrap) return;
    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = wrap.clientWidth;
      const h = Math.round(Math.min(460, Math.max(300, w * 0.56)));
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
      render(clockRef.current.t);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [render]);

  useEffect(() => {
    if (!playing || !film) return;
    clockRef.current.last = performance.now();
    const step_ = (now) => {
      const c = clockRef.current;
      c.t = Math.min(film.duration, c.t + ((now - c.last) / 1000) * rate);
      c.last = now;
      setT(c.t);
      render(c.t);
      if (c.t >= film.duration) { setPlaying(false); return; }
      rafRef.current = requestAnimationFrame(step_);
    };
    rafRef.current = requestAnimationFrame(step_);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, film, render, rate]);

  useEffect(() => {
    if (!playing || !scene) return;
    if (spokenRef.current === sceneIdx) return;
    spokenRef.current = sceneIdx;
    say(scene.say || scene.caption);
  }, [playing, sceneIdx, scene, say]);

  useEffect(() => { if (!playing) stop(); }, [playing, stop]);
  useEffect(() => stop, [stop]);

  if (!film) return null;

  const seek = (v) => {
    clockRef.current.t = v;
    spokenRef.current = -1;
    stop();
    setT(v);
    render(v);
  };
  const toggle = () => {
    setStarted(true);
    if (t >= duration) seek(0);
    setPlaying((p) => !p);
  };
  const replay = () => { seek(0); setPlaying(true); setStarted(true); };
  const pct = duration ? (t / duration) * 100 : 0;

  return (
    <Panel className="p-4 md:p-6 min-w-0 overflow-hidden" data-explainer={moduleId}>
      <div className="flex flex-wrap items-center gap-2.5 mb-3">
        <span className="grid place-items-center size-7 rounded-md bg-slate-deep text-white shrink-0">
          <Film className="size-3.5" strokeWidth={2} />
        </span>
        <SectionLabel className="text-muted-foreground">The whole module, as a film</SectionLabel>
        <span className="label-mono text-muted-foreground tabular-nums ml-auto">
          {fmt(duration)} · {chapters.length} chapters
        </span>
      </div>

      <h3 className="text-[17px] md:text-[19px] font-semibold leading-snug mb-1.5">
        <Rich text={film.title} />
      </h3>
      {film.blurb && (
        <p className="text-[14px] leading-relaxed text-muted-foreground max-w-[74ch] mb-4">
          <Rich text={film.blurb} />
        </p>
      )}

      {sceneError && (
        <div data-scene-error className="mb-3 rounded-md border border-destructive/30 bg-[#ffdad6]/50 px-3 py-2 text-[12.5px] font-mono text-destructive">
          {sceneError}
        </div>
      )}

      {/* stage */}
      <div ref={wrapRef} className="relative rounded-lg border bg-card overflow-hidden">
        <canvas ref={canvasRef} className="block w-full" />
        <Overlay o={scene?.overlay} idx={sceneIdx} />

        {!started && (
          <button
            onClick={toggle}
            data-act="play-explainer"
            className="absolute inset-0 grid place-items-center bg-slate-deep/70 backdrop-blur-[2px] transition-colors hover:bg-slate-deep/60"
          >
            <span className="flex flex-col items-center gap-2.5 text-white">
              <span className="grid place-items-center size-14 rounded-full bg-white/95 text-slate-deep shadow-lg">
                <Play className="size-6 ml-0.5" fill="currentColor" />
              </span>
              <span className="text-[13px] font-semibold tracking-wide">Play the lecture · {fmt(duration)}</span>
            </span>
          </button>
        )}
      </div>

      {/* transport */}
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 mt-3">
        <button
          onClick={toggle}
          data-act="toggle-explainer"
          aria-label={playing ? "Pause" : "Play"}
          className="grid place-items-center size-9 shrink-0 rounded-md bg-slate-deep text-white hover:bg-navy transition-colors"
        >
          {playing ? <Pause className="size-4" fill="currentColor" /> : <Play className="size-4 ml-0.5" fill="currentColor" />}
        </button>
        <button
          onClick={replay}
          aria-label="Replay from the start"
          className="grid place-items-center size-9 shrink-0 rounded-md border bg-card text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="size-4" />
        </button>

        <div className="flex-1 order-last w-full min-w-[min(100%,220px)] sm:order-none sm:w-auto">
          <input
            type="range" min={0} max={duration} step={0.05} value={t}
            onChange={(e) => seek(Number(e.target.value))}
            data-act="scrub" aria-label="Scrub"
            className="w-full h-1.5 appearance-none rounded-full cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-3.5
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-bright
              [&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-bright"
            style={{ background: `linear-gradient(to right, var(--color-blue-bright) ${pct}%, var(--color-muted) ${pct}%)` }}
          />
          <div className="relative h-3 mt-0.5">
            {film.scenes.map((s, i) => (
              <button
                key={i} onClick={() => seek(s.at)} title={s.chapter || s.caption} data-scene={i}
                className={cn("absolute top-0 -translate-x-1/2 rounded-full transition-colors",
                  s.chapter ? "h-2.5 w-[3px]" : "h-1.5 w-[2px] mt-0.5",
                  i === sceneIdx ? "bg-blue-bright" : "bg-border hover:bg-muted-foreground")}
                style={{ left: `${(s.at / duration) * 100}%` }}
              />
            ))}
          </div>
        </div>

        <span className="label-mono text-muted-foreground tabular-nums shrink-0" data-clock>
          {fmt(t)} / {fmt(duration)}
        </span>

        <button
          onClick={() => setRate(RATES[(RATES.indexOf(rate) + 1) % RATES.length])}
          data-act="rate" title="Playback speed"
          className="flex items-center gap-1 h-9 px-2 shrink-0 rounded-md border bg-card text-muted-foreground hover:text-foreground transition-colors label-mono"
        >
          <Gauge className="size-3.5" /> {rate}×
        </button>

        <button
          onClick={() => setShowChapters((s) => !s)}
          data-act="toggle-chapters" title="Chapters"
          className={cn("grid place-items-center size-9 shrink-0 rounded-md border transition-colors",
            showChapters ? "bg-blue-tint border-blue/25 text-blue" : "bg-card text-muted-foreground hover:text-foreground")}
        >
          <List className="size-4" />
        </button>

        {supported && (
          <button
            onClick={() => { setSound((s) => !s); stop(); }}
            aria-label={sound ? "Mute narration" : "Unmute narration"}
            title={sound ? "Narration on" : "Narration off"}
            data-act="toggle-sound"
            className={cn("grid place-items-center size-9 shrink-0 rounded-md border transition-colors",
              sound ? "bg-blue-tint border-blue/25 text-blue" : "bg-card text-muted-foreground hover:text-foreground")}
          >
            {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          </button>
        )}
      </div>

      {/* caption */}
      <div className="mt-3 rounded-lg border-l-[3px] border-blue-bright bg-blue-tint/40 px-4 py-3 min-h-[70px]">
        {/* no label-mono here: it uppercases, which mangles inline math */}
        <div className="text-[11px] font-mono font-medium tracking-wide text-blue mb-1.5">
          {chapterIdx >= 0
            ? <Rich text={chapters[chapterIdx].label} />
            : `${sceneIdx + 1} / ${film.scenes.length}`}
        </div>
        <div className="text-[14.5px] leading-relaxed max-w-[74ch]" data-caption>
          <Rich text={scene?.caption || ""} />
        </div>
      </div>

      {showChapters && (
        <div className="mt-3 border rounded-lg overflow-hidden" data-chapters>
          {chapters.map((ch, i) => (
            <button
              key={i} onClick={() => seek(ch.at)} data-chapter={i}
              className={cn("w-full text-left flex items-center gap-3 px-3.5 py-2 text-[13.5px] transition-colors",
                i > 0 && "border-t", i === chapterIdx ? "bg-blue-tint text-blue font-medium" : "hover:bg-muted")}
            >
              <span className="label-mono tabular-nums text-muted-foreground shrink-0">{fmt(ch.at)}</span>
              <span className="min-w-0 truncate"><Rich text={ch.label} /></span>
            </button>
          ))}
        </div>
      )}

      {film.takeaway && (
        <p className="text-[13px] leading-relaxed text-muted-foreground mt-3 max-w-[74ch]">
          <Rich text={film.takeaway} />
        </p>
      )}
    </Panel>
  );
}
