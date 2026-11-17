"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Map, SkipForward } from "lucide-react";
import { profile } from "@/data/profile";

const LINES = [
  "VK // DIGITAL UNIVERSE",
  "INITIALIZING VANSHVERSE...",
  "LOADING DEVELOPER PROFILE...",
  "CONNECTING PROJECT DATABASE...",
  "AI LABORATORY: ONLINE",
  "WORLD GENERATION: COMPLETE",
];

export default function StartScreen() {
  const router = useRouter();
  const [line, setLine] = useState(0);
  const [ready, setReady] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 18, letterSpacing: "0.3em" },
      { opacity: 1, y: 0, letterSpacing: "0.12em", duration: 0.9, ease: "power2.out" },
    );
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setLine(LINES.length);
      setReady(true);
      return;
    }

    const id = window.setInterval(() => {
      setLine((current) => {
        if (current >= LINES.length - 1) {
          window.clearInterval(id);
          window.setTimeout(() => setReady(true), 280);
          return current + 1;
        }
        return current + 1;
      });
    }, 380);

    return () => window.clearInterval(id);
  }, []);

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-void px-5 py-10 text-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 10%, rgba(197,161,91,0.22), transparent 58%), radial-gradient(ellipse 40% 40% at 82% 82%, rgba(85,201,181,0.1), transparent 50%)",
        }}
      />

      <p className="relative font-mono text-[11px] tracking-[0.28em] text-teal">
        SYSTEM BOOT
      </p>

      <ul className="relative mt-6 min-h-[8.5rem] space-y-1 font-mono text-xs text-mist/70 sm:text-sm">
        {LINES.slice(0, Math.max(line, 1)).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h1
        ref={titleRef}
        className="relative mt-8 font-display text-5xl font-extrabold tracking-[0.12em] text-ivory sm:text-7xl"
      >
        {profile.universe.name}
      </h1>
      <p className="relative mt-3 font-display text-lg tracking-[0.22em] text-lavender sm:text-2xl">
        {profile.universe.headline}
      </p>
      <p className="relative mt-4 max-w-xl text-sm text-mist/80 sm:text-base">
        {profile.universe.subtitle}
      </p>
      <p className="relative mt-2 text-xs uppercase tracking-[0.28em] text-mist/50">
        {profile.universe.tagline}
      </p>

      <div
        className={`relative mt-10 flex flex-col gap-3 transition duration-500 sm:flex-row ${
          ready ? "translate-y-0 opacity-100" : "translate-y-2 opacity-70"
        }`}
      >
        <button
          type="button"
          onClick={() => router.push("/explore")}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-void transition hover:brightness-110"
        >
          <Map size={16} />
          Enter VANSHVERSE
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          setLine(LINES.length);
          setReady(true);
        }}
        className="relative mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-mist/55 hover:text-mist"
      >
        <SkipForward size={14} />
        Skip intro
      </button>
    </main>
  );
}
