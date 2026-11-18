"use client";

import dynamic from "next/dynamic";

const GameCanvas = dynamic(() => import("@/components/vanshverse/GameCanvas"), {
  ssr: false,
  loading: () => (
    <div
      className="h-dvh bg-void"
      style={{
        background: "radial-gradient(ellipse at 50% 58%, rgba(197,161,91,0.2), #151719 62%)",
      }}
    />
  ),
});

export default function ExplorePage() {
  return <GameCanvas />;
}
