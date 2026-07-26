import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Home from "@/pages/Home";
import Drills from "@/pages/Drills";
import Applied from "@/pages/Applied";
import ProgressPage from "@/pages/ProgressPage";

/* Hash routing (#/drills) — works on GitHub Pages with no server config. */
function useHashRoute() {
  const get = () => (location.hash || "#/").replace(/^#\//, "");
  const [route, setRoute] = useState(get);
  useEffect(() => {
    const onChange = () => { setRoute(get()); window.scrollTo({ top: 0 }); };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

const NAV = [
  ["drills", "Command Drills"],
  ["applied", "Applied Problems"],
  ["progress", "Progress"],
];

export default function App() {
  const route = useHashRoute();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-6 px-5 md:px-8 py-4 bg-card border-b">
        <a href="#/" className="font-display text-[26px] font-bold tracking-tight">
          Stat<span className="text-evergreen">Lab</span>
        </a>
        <nav className="flex gap-1 flex-wrap">
          {NAV.map(([key, label]) => (
            <a
              key={key}
              href={`#/${key}`}
              className={cn(
                "text-sm font-semibold px-3.5 py-2 rounded-lg transition-colors duration-150",
                route === key
                  ? "bg-evergreen text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-background",
              )}
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      <main className="w-full max-w-[1120px] mx-auto px-4 md:px-6 py-10 pb-20 flex-1">
        {route === "drills" ? <Drills />
          : route === "applied" ? <Applied />
          : route === "progress" ? <ProgressPage />
          : <Home />}
      </main>

      <footer className="flex justify-between flex-wrap gap-3 px-5 md:px-8 py-5 border-t text-muted-foreground text-xs tracking-wide">
        <span>StatLab · practice environment for statistical computing in R &amp; Python</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-evergreen" /> R</span>
          <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-amber" /> Python</span>
          <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-slate" /> SQL</span>
        </span>
      </footer>
    </div>
  );
}
