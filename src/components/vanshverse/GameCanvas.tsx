"use client";

import { useEffect, useRef, useState } from "react";
import type Phaser from "phaser";
import { gameApi, gameBus, type HudAnchor } from "@/game/events";
import type { ClientId, LocationId } from "@/data/world";
import GameHUD from "./GameHUD";
import LocationPanel from "./LocationPanel";
import ClientPanel from "./ClientPanel";
import SiteNav from "./SiteNav";

export default function GameCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [near, setNear] = useState<LocationId | null>(null);
  const [nearNpc, setNearNpc] = useState<ClientId | null>(null);
  const [open, setOpen] = useState<LocationId | null>(null);
  const [clientOpen, setClientOpen] = useState<ClientId | null>(null);
  const [progress, setProgress] = useState(0);
  const [mapOpen, setMapOpen] = useState(false);
  const [anchor, setAnchor] = useState<HudAnchor | null>(null);
  const [error, setError] = useState("");
  const panelOpen = useRef(false);
  const archiveOpen = useRef(false);
  panelOpen.current = Boolean(open || clientOpen || mapOpen);
  archiveOpen.current = Boolean(open || clientOpen);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (archiveOpen.current) return;
        setMapOpen(false);
        return;
      }
      if (event.key === "Enter" || event.key === "e" || event.key === "E") {
        if (panelOpen.current) return;
        const target = event.target;
        if (target instanceof HTMLElement) {
          const tag = target.tagName;
          if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
          if (event.key === "Enter" && target.closest(".plaque-enter")) return;
        }
        event.preventDefault();
        gameApi.openNear?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (clientOpen) gameApi.focusClient?.(clientOpen);
    else if (open) gameApi.focusLocation?.(open);
    else gameApi.clearFocus?.();
  }, [open, clientOpen]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let game: Phaser.Game | null = null;

    const boot = async () => {
      try {
        const { createGame } = await import("@/game/config");
        if (cancelled || hostRef.current !== host) return;
        host.replaceChildren();
        game = createGame(host);
        if (cancelled) {
          game.destroy(true);
          game = null;
          return;
        }
        gameRef.current = game;
      } catch {
        if (!cancelled) setError("The world could not start. Refresh the page to try again.");
      }
    };

    void boot();

    const offNear = gameBus.on("location-near", setNear);
    const offNpc = gameBus.on("npc-near", setNearNpc);
    const offOpen = gameBus.on("location-open", (id) => {
      setClientOpen(null);
      setOpen(id);
    });
    const offClient = gameBus.on("client-open", (id) => {
      setOpen(null);
      setClientOpen(id);
    });
    const offProgress = gameBus.on("player-progress", setProgress);
    const offJump = gameBus.on("world-jump", () => {
      setOpen(null);
      setClientOpen(null);
      setMapOpen(false);
    });
    const offAnchor = gameBus.on("hud-anchor", (next) => {
      setAnchor((prev) => {
        if (!next) return prev ? null : prev;
        if (prev && prev.kind === next.kind && prev.id === next.id) return prev;
        return next;
      });
    });

    return () => {
      cancelled = true;
      offNear();
      offNpc();
      offOpen();
      offClient();
      offProgress();
      offJump();
      offAnchor();
      gameApi.travelTo = null;
      gameApi.teleportTo = null;
      gameApi.focusLocation = null;
      gameApi.focusClient = null;
      gameApi.clearFocus = null;
      gameApi.openNear = null;
      gameApi.holdMove = null;
      game?.destroy(true);
      if (gameRef.current && gameRef.current !== game) gameRef.current.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div className="relative h-dvh overflow-hidden bg-void">
      <SiteNav compact={Boolean(open || clientOpen)} />
      <div ref={hostRef} className="absolute inset-0 overflow-hidden [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full" />
      {error ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
          <div className="glass-panel max-w-md rounded-3xl p-6 text-center">
            <p>{error}</p>
            <button
              type="button"
              className="mt-4 text-gold"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <GameHUD
          near={open || clientOpen ? null : near}
          nearNpc={open || clientOpen ? null : nearNpc}
          progress={progress}
          mapOpen={mapOpen}
          anchor={anchor}
          onToggleMap={() => setMapOpen((value) => !value)}
          onEnter={setOpen}
          onEnterClient={setClientOpen}
        />
      )}
      {open ? <LocationPanel id={open} onClose={() => setOpen(null)} onNavigate={setOpen} /> : null}
      {clientOpen ? <ClientPanel id={clientOpen} onClose={() => setClientOpen(null)} /> : null}
    </div>
  );
}
