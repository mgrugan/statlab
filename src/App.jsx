import { useEffect, useState } from "react";
import { LayoutDashboard, GraduationCap, Code2, Trophy, Zap, BookOpen, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgress } from "@/lib/progress";
import { rankFor } from "@/lib/stats";
import Dashboard from "@/pages/Dashboard";
import Learn from "@/pages/Learn";
import Practice from "@/pages/Practice";
import Leaderboard from "@/pages/Leaderboard";
import Study from "@/pages/Study";
import Lesson from "@/pages/Lesson";
import Exam from "@/pages/Exam";

/* Hash routing (#/learn, #/practice?q=ap12) — works on GitHub Pages
   with no server config. Old v1/v2 routes redirect to their successors. */
const REDIRECTS = { drills: "learn", applied: "practice", progress: "" };

function parseHash() {
  const raw = (location.hash || "#/").replace(/^#\//, "");
  const [path, query] = raw.split("?");
  if (path in REDIRECTS) {
    location.hash = `#/${REDIRECTS[path]}`;
    return { path: REDIRECTS[path], params: {} };
  }
  const params = Object.fromEntries(new URLSearchParams(query || ""));
  return { path, params };
}

function useHashRoute() {
  const [route, setRoute] = useState(parseHash);
  useEffect(() => {
    const onChange = () => { setRoute(parseHash()); window.scrollTo({ top: 0 }); };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

const NAV = [
  { key: "",            label: "Dashboard",   icon: LayoutDashboard },
  { key: "study",       label: "Study",       icon: BookOpen },
  { key: "exam",        label: "Exam",        icon: FileText },
  { key: "learn",       label: "Learn",       icon: GraduationCap },
  { key: "practice",    label: "Practice",    icon: Code2 },
  { key: "leaderboard", label: "Leaderboard", icon: Trophy },
];

export default function App() {
  const route = useHashRoute();
  const progress = useProgress();
  const rank = rankFor(progress.xp);

  return (
    <div className="min-h-screen flex flex-col">
      {/* top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-6 h-14 bg-card border-b">
        <a href="#/" className="flex items-center gap-2.5 font-semibold tracking-tight text-[17px]">
          <span className="grid place-items-center size-7 rounded-md bg-slate-deep text-emerald-bright font-mono text-sm font-bold">Σ</span>
          StatCode
          <span className="hidden sm:inline label-mono text-muted-foreground font-normal">StatLab</span>
        </a>
        <div className="flex items-center gap-3">
          <span data-xp className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-tint text-blue text-[13px] font-semibold tabular-nums">
            <Zap className="size-3.5" /> {progress.xp.toLocaleString()} XP
          </span>
          <span
            className="grid place-items-center size-8 rounded-full bg-slate-deep text-white text-[11px] font-bold"
            title={rank.current.name}
          >
            YO
          </span>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* sidebar */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 border-r bg-card py-4 px-3 gap-1 sticky top-14 h-[calc(100vh-3.5rem)]">
          {NAV.map(({ key, label, icon: Icon }) => (
            <a
              key={key || "dash"}
              href={`#/${key}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150",
                route.path === key
                  ? "bg-blue-bright text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <Icon className="size-4" strokeWidth={1.75} /> {label}
            </a>
          ))}
          <div className="mt-auto px-3 pb-1">
            <div className="label-mono text-muted-foreground mb-1.5">{rank.current.name}</div>
            <div className="h-1 rounded-sm bg-muted overflow-hidden">
              <div className="h-full bg-blue-bright rounded-sm" style={{ width: `${rank.pct}%` }} />
            </div>
            {rank.next && (
              <div className="text-[11px] text-muted-foreground mt-1.5 tabular-nums">
                {progress.xp.toLocaleString()} / {rank.next.xp.toLocaleString()} XP to {rank.next.name}
              </div>
            )}
          </div>
        </aside>

        {/* mobile nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 flex bg-card border-t">
          {NAV.map(({ key, label, icon: Icon }) => (
            <a
              key={key || "dash"}
              href={`#/${key}`}
              className={cn(
                "flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium",
                route.path === key ? "text-blue-bright" : "text-muted-foreground",
              )}
            >
              <Icon className="size-4.5" strokeWidth={1.75} /> {label}
            </a>
          ))}
        </nav>

        <main className="flex-1 min-w-0 px-4 md:px-8 py-6 pb-24 md:pb-10 max-w-[1280px]">
          {route.path === "learn" ? <Learn />
            : route.path === "practice" ? <Practice jumpTo={route.params.q} />
            : route.path === "leaderboard" ? <Leaderboard />
            : route.path === "study" ? <Study />
            : route.path === "lesson" ? <Lesson id={route.params.id} />
            : route.path === "exam" ? <Exam />
            : <Dashboard />}
        </main>
      </div>
    </div>
  );
}
