"use client";

import { Keyboard, Map as MapIcon } from "lucide-react";
import { freelancePortfolios } from "@/data/projects";
import { locations, type ClientId, type LocationId } from "@/data/world";
import { gameApi, type HudAnchor } from "@/game/events";
import LocationIntro, { INTRO_META } from "./LocationIntro";

export default function GameHUD({
  near,
  nearNpc,
  progress,
  mapOpen,
  anchor,
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
  const side = anchor?.side === "left" ? "left" : "right";
  const showLocation = Boolean(location && !client);
  const identity = location ? INTRO_META[location.id] : INTRO_META.clients;

  return (
    <>
      {client ? (
        <LocationIntro
          key={client.id}
          id="client"
          index="07"
          category="Client"
          title={client.name}
          description={client.description}
          action="view"
          actionLabel="View portfolio"
          side={side}
          motif="clients"
          tone="gold"
          onAction={() => onEnterClient(client.id)}
        />
      ) : showLocation && location ? (
        <LocationIntro
          key={location.id}
          id={location.id}
          index={location.index}
          category={identity.category}
          title={location.name}
          description={location.blurb}
          action={location.id === "clients" ? "hint" : "enter"}
          actionLabel={location.id === "clients" ? "Approach a client" : "Enter"}
          side={side}
          motif={identity.motif}
          tone={identity.tone}
          onAction={location.id === "clients" ? undefined : () => onEnter(location.id)}
        />
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-2 sm:p-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
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
            className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-mist/70 hover:text-gold"
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
                      gameApi.travelTo?.(item.id);
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
