"use client";

import dynamic from "next/dynamic";

const GameCanvas = dynamic(() => import("@/components/vanshverse/GameCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-dvh items-center justify-center bg-void font-mono text-sm tracking-[0.2em] text-mist">
      INITIALIZING WORLD...
    </div>
  ),
});

export default function ExplorePage() {
  return <GameCanvas />;
}
