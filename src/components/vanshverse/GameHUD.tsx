"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Keyboard, Map as MapIcon } from "lucide-react";
import { freelancePortfolios } from "@/data/projects";
import { locations, type ClientId, type LocationId } from "@/data/world";
import { gameApi, type HudAnchor } from "@/game/events";
import LocationIntro, { INTRO_META } from "./LocationIntro";

function WalkButton({
  dir,
  label,
  children,
}: {
  dir: -1 | 1;
  label: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const down = (event: Event) => {
      event.preventDefault();
      if (event instanceof PointerEvent) {
        try {
          node.setPointerCapture(event.pointerId);
        } catch {
          /* synthetic/test pointers may not be capturable */
        }
      }
      gameApi.holdMove?.(dir);
    };
    const up = () => gameApi.holdMove?.(0);
    node.addEventListener("pointerdown", down);
    node.addEventListener("touchstart", down, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("touchend", up);
    window.addEventListener("touchcancel", up);
    return () => {
      node.removeEventListener("pointerdown", down);
      node.removeEventListener("touchstart", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("touchend", up);
      window.removeEventListener("touchcancel", up);
      gameApi.holdMove?.(0);
    };
  }, [dir]);

  return (
    <button
      ref={ref}
      type="button"
      className="verse-walk-btn"
      aria-label={label}
      onContextMenu={(event) => event.preventDefault()}
    >
      {children}
    </button>
  );
}

export default function GameHUD({
  near,
  nearNpc,
  progress,
  mapOpen,
  anchor: _anchor,
  onToggleMap,
  onEnter,
  onEnterClient,
}: {
  near: LocationId | null;
  nearNpc: ClientId | null;
  progress: number;
  mapOpen: boolean;
  anchor: HudAnchor | null;
  onToggleMap: () => void;
  onEnter: (id: LocationId) => void;
  onEnterClient: (id: ClientId) => void;
}) {
  const location = locations.find((item) => item.id === near);
  const client = freelancePortfolios.find((item) => item.id === nearNpc);
  const showLocation = Boolean(location && !client);
  const identity = location ? INTRO_META[location.id] : INTRO_META.clients;
  const live = client
    ? {
        key: client.id,
        id: "client" as const,
        index: locations.find((item) => item.id === "clients")?.index ?? "06",
        category: "Client",
        title: client.name,
        description: client.description,
        action: "view" as const,
        actionLabel: "View Portfolio",
        motif: "clients" as const,
        tone: "gold" as const,
        onAction: () => {
          if (gameApi.openNear) gameApi.openNear();
          else onEnterClient(client.id);
        },
      }
    : showLocation && location
      ? {
          key: location.id,
          id: location.id,
          index: location.index,
          category: identity.category,
          title: location.name,
          description: location.blurb,
          action: (location.id === "clients" ? "view" : "enter") as "view" | "enter",
          actionLabel: location.id === "clients" ? "View Portfolio" : "Enter Location",
          motif: identity.motif,
          tone: identity.tone,
          onAction: () => {
            if (gameApi.openNear) gameApi.openNear();
            else onEnter(location.id);
          },
        }
      : null;

  const [held, setHeld] = useState(live);
  const [open, setOpen] = useState(Boolean(live));

  useEffect(() => {
    if (live) {
      setHeld(live);
      setOpen(true);
      return;
    }
    setOpen(false);
  }, [live?.key]);

  return (
    <>
      {held ? (
        <LocationIntro
          key={held.key}
          id={held.id}
          index={held.index}
          category={held.category}
          title={held.title}
          description={held.description}
          action={held.action}
          actionLabel={held.actionLabel}
          motif={held.motif}
          tone={held.tone}
          open={open}
          onAction={held.onAction}
          onExited={() => {
            if (!live) setHeld(null);
          }}
        />
      ) : null}

      <div className="verse-walk">
        <WalkButton dir={-1} label="Walk left">
          <ChevronLeft size={22} />
        </WalkButton>
        <WalkButton dir={1} label="Walk right">
          <ChevronRight size={22} />
        </WalkButton>
      </div>

      <div className="verse-dock pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-2 sm:p-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="glass-panel pointer-events-auto flex w-full max-w-3xl items-center gap-2 rounded-full px-3 py-1.5 sm:gap-3 sm:px-4">
          <p className="hidden min-w-0 max-w-[34%] truncate font-mono text-[10px] uppercase tracking-[0.14em] text-mist/75 sm:block">
            {client ? client.name : showLocation && location ? location.name : "VANSHVERSE"}
          </p>
          <div className="h-1 min-w-24 flex-1 overflow-hidden rounded-full bg-void">
            <div className="h-full rounded-full bg-gold" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
          <button
            type="button"
            onClick={onToggleMap}
            className="verse-dock-map inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-mist/70 hover:text-gold"
          >
            <MapIcon size={12} />
            Map
          </button>
          <p className="hidden items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-mist/45 md:inline-flex">
            <Keyboard size={11} />
            ← → · E
          </p>
        </div>
      </div>

      {mapOpen ? (
        <div className="absolute bottom-16 left-1/2 z-20 w-[min(92vw,26rem)] -translate-x-1/2">
          <div className="glass-panel rounded-2xl p-3">
            <p className="font-mono text-[10px] tracking-[0.2em] text-gold">WORLD MAP</p>
            <ul className="mt-2 grid grid-cols-2 gap-1.5">
              {locations.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      gameApi.teleportTo?.(item.id);
                      onToggleMap();
                    }}
                    className={`w-full rounded-xl border px-2.5 py-1.5 text-left text-sm transition ${
                      item.id === near ? "border-gold/50 bg-gold/10" : "border-gold/10 hover:border-gold/35"
                    }`}
                  >
                    <span className="block font-mono text-[10px] text-gold">{item.index}</span>
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
