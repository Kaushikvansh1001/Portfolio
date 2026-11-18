import type { ClientId, LocationId } from "@/data/world";

export type HudAnchor = {
  kind: "location" | "client";
  id: LocationId | ClientId;
  side: "left" | "right";
  x: number;
  y: number;
  width: number;
  height: number;
};

export type GameEventMap = {
  "location-near": LocationId | null;
  "location-open": LocationId;
  "npc-near": ClientId | null;
  "client-open": ClientId;
  "player-progress": number;
  "hud-anchor": HudAnchor | null;
  "game-ready": boolean;
  "game-error": string;
  "world-jump": LocationId;
};

type Handler<T> = (payload: T) => void;

class GameBus {
  private target = new EventTarget();

  on<K extends keyof GameEventMap>(type: K, handler: Handler<GameEventMap[K]>) {
    const listener = (event: Event) => {
      handler((event as CustomEvent<GameEventMap[K]>).detail);
    };
    this.target.addEventListener(type, listener);
    return () => this.target.removeEventListener(type, listener);
  }

  emit<K extends keyof GameEventMap>(type: K, payload: GameEventMap[K]) {
    this.target.dispatchEvent(new CustomEvent(type, { detail: payload }));
  }
}

export const gameBus = new GameBus();

export const gameApi = {
  travelTo: null as null | ((id: LocationId) => void),
  teleportTo: null as null | ((id: LocationId) => void),
  focusLocation: null as null | ((id: LocationId) => void),
  focusClient: null as null | ((id: ClientId) => void),
  clearFocus: null as null | (() => void),
  openNear: null as null | (() => void),
  holdMove: null as null | ((dir: -1 | 0 | 1) => void),
  lastAnchor: null as HudAnchor | null,
};
