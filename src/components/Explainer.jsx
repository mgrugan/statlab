import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Film } from "lucide-react";
import { Panel, SectionLabel } from "@/components/shared";
import { Rich } from "@/components/Math";
import { EXPLAINERS } from "@/data/finance/explainers";
import { PALETTE, axes, fade } from "@/lib/anim";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------- speech */

/* Browser speech synthesis, driven by the timeline rather than by its own
   queue: each scene's line is spoken once when the playhead enters it, and
   everything is cancelled on pause, scrub or unmount. Voices load
   asynchronously on most browsers, hence the voiceschanged listener. */
function useNarrator(enabled) {
  const voiceRef = useRef(null);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!supported) return;
    const pick = () => {
      const vs = speechSynthesis.getVoices().filter((v) => v.lang.startsWith("en"));
      if (!vs.length) return;
      // prefer a natural-sounding local voice, else whatever English exists
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
    u.rate = 1.0; u.pitch = 1.0; u.volume = 1;
    speechSynthesis.speak(u);
  }, [supported, enabled]);

  useEffect(() => stop, [stop]);
  return { say, stop, supported };
}

/* ---------------------------------------------------------------- player */

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function Explainer({ moduleId }) {
  const film = EXPLAINERS[moduleId];
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const rafRef = useRef(0);
  const clockRef = useRef({ t: 0, last: 0 });
  const spokenRef = useRef(-1);
  const errRef = useRef(null);       // written during render, lifted after

  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [sound, setSound] = useState(true);
  const [started, setStarted] = useState(false);
  const [sceneError, setSceneError] = useState(null);

  const { say, stop, supported } = useNarrator(sound);
  const duration = film?.duration ?? 0;

  /* which scene owns the playhead */
  const sceneIdx = useMemo(() => {
    if (!film) return 0;
    let i = 0;
    for (let k = 0; k < film.scenes.length; k++) if (t >= film.scenes[k].at) i = k;
    return i;
  }, [film, t]);
  const scene = film?.scenes[sceneIdx];

  /* ---- draw one frame ---- */
  const render = useCallback((time) => {
    const cv = canvasRef.current;
    if (!cv || !film) return;
    const ctx = cv.getContext("2d");
    const W = cv.width / (window.devicePixelRatio || 1);
    const H = cv.height / (window.devicePixelRatio || 1);

    ctx.save();
    ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = PALETTE.paper;
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < film.scenes.length; i++) {
      const s = film.scenes[i];
      const end = i + 1 < film.scenes.length ? film.scenes[i + 1].at : film.duration;
      if (time < s.at || time >= end) continue;
      const dur = end - s.at;
      const local = time - s.at;
      ctx.save();
      try {
        s.draw({ ctx, W, H, t: local, dur, k: dur ? local / dur : 0, data: film.data, axes, fade });
      } catch (err) {
        // surface it in the DOM rather than only painting it onto the canvas,
        // where a screenshot check would happily read it as "content"
        const msg = `scene ${i}: ${err.message}`;
        errRef.current = msg;
        ctx.restore();
        ctx.save();
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

  /* ---- size the canvas to its container, at device resolution ---- */
  useEffect(() => {
    const cv = canvasRef.current, wrap = wrapRef.current;
    if (!cv || !wrap) return;
    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = wrap.clientWidth;
      const h = Math.round(Math.min(430, Math.max(260, w * 0.52)));
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

  /* ---- the clock ---- */
  useEffect(() => {
    if (!playing || !film) return;
    clockRef.current.last = performance.now();
    const step = (now) => {
      const c = clockRef.current;
      c.t = Math.min(film.duration, c.t + (now - c.last) / 1000);
      c.last = now;
      setT(c.t);
      render(c.t);
      if (c.t >= film.duration) { setPlaying(false); return; }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, film, render]);

  /* ---- speak a scene's line as the playhead enters it ---- */
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
    spokenRef.current = -1;          // re-speak whichever scene we land in
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
    <Panel className="p-5 md:p-6 mt-6 min-w-0 overflow-hidden" data-explainer={moduleId}>
      <div className="flex items-center gap-2.5 mb-3">
        <span className="grid place-items-center size-7 rounded-md bg-slate-deep text-white">
          <Film className="size-3.5" strokeWidth={2} />
        </span>
        <SectionLabel className="text-muted-foreground">Watch it happen</SectionLabel>
        <span className="text-[15px] font-semibold ml-0.5"><Rich text={film.title} /></span>
      </div>

      {film.blurb && (
        <p className="text-[14px] leading-relaxed text-muted-foreground max-w-[74ch] mb-4">
          <Rich text={film.blurb} />
        </p>
      )}

      {/* stage */}
      {sceneError && (
        <div data-scene-error className="mb-3 rounded-md border border-destructive/30 bg-[#ffdad6]/50 px-3 py-2 text-[12.5px] font-mono text-destructive">
          {sceneError}
        </div>
      )}

      <div ref={wrapRef} className="relative rounded-lg border bg-card overflow-hidden">
        <canvas ref={canvasRef} className="block w-full" />

        {/* poster overlay before first play */}
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
              <span className="text-[13px] font-semibold tracking-wide">
                Play · {fmt(duration)}
              </span>
            </span>
          </button>
        )}
      </div>

      {/* transport */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-3">
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
            type="range"
            min={0}
            max={duration}
            step={0.05}
            value={t}
            onChange={(e) => seek(Number(e.target.value))}
            data-act="scrub"
            aria-label="Scrub"
            className="w-full h-1.5 appearance-none rounded-full cursor-pointer bg-muted
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-3.5
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-bright
              [&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-bright"
            style={{ background: `linear-gradient(to right, var(--color-blue-bright) ${pct}%, var(--color-muted) ${pct}%)` }}
          />
          {/* scene markers */}
          <div className="relative h-3 mt-0.5">
            {film.scenes.map((s, i) => (
              <button
                key={i}
                onClick={() => seek(s.at)}
                title={s.caption}
                data-scene={i}
                className={cn("absolute top-0 -translate-x-1/2 h-2 w-[3px] rounded-full transition-colors",
                  i === sceneIdx ? "bg-blue-bright" : "bg-border hover:bg-muted-foreground")}
                style={{ left: `${(s.at / duration) * 100}%` }}
              />
            ))}
          </div>
        </div>

        <span className="label-mono text-muted-foreground tabular-nums shrink-0" data-clock>
          {fmt(t)} / {fmt(duration)}
        </span>

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

      {/* caption — always on, whether or not the narration is audible */}
      <div className="mt-3 rounded-lg border-l-[3px] border-blue-bright bg-blue-tint/40 px-4 py-3 min-h-[68px]">
        <div className="label-mono text-blue mb-1.5">
          {sceneIdx + 1} / {film.scenes.length}
        </div>
        <div className="text-[14.5px] leading-relaxed max-w-[74ch]" data-caption>
          <Rich text={scene?.caption || ""} />
        </div>
      </div>

      {film.takeaway && (
        <p className="text-[13px] leading-relaxed text-muted-foreground mt-3 max-w-[74ch]">
          <Rich text={film.takeaway} />
        </p>
      )}
    </Panel>
  );
}
