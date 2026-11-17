import { WORLD } from "@/data/world";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export type TerrainKind = "grass" | "cobble" | "plaza" | "bridge";

type Key = { x: number; y: number; kind: TerrainKind };

export const BASE = 792;

export const FEATURES = {
  bridge: { x0: 3540, x1: 3860, y: BASE },
  arch: { x: 7100 },
};

const KEYS: Key[] = [
  { x: 0, y: BASE + 6, kind: "grass" },
  { x: 420, y: BASE, kind: "grass" },
  { x: 520, y: BASE, kind: "cobble" },
  { x: 2140, y: BASE, kind: "cobble" },
  { x: 2360, y: BASE, kind: "plaza" },
  { x: FEATURES.bridge.x0, y: BASE, kind: "plaza" },
  { x: FEATURES.bridge.x1, y: BASE, kind: "bridge" },
  { x: 6400, y: BASE, kind: "cobble" },
  { x: WORLD.width, y: BASE, kind: "cobble" },
];

function segment(x: number) {
  const max = KEYS.length - 2;
  let i = 0;
  while (i < max && KEYS[i + 1].x < x) i += 1;
  return { a: KEYS[i], b: KEYS[i + 1] };
}

export function groundAt(x: number) {
  const { a, b } = segment(x);
  const span = Math.max(1, b.x - a.x);
  const t = clamp((x - a.x) / span, 0, 1);
  return lerp(a.y, b.y, t);
}

export function slopeAt(x: number) {
  return Math.abs(groundAt(x + 10) - groundAt(x - 10)) / 20;
}

export function kindAt(x: number): TerrainKind {
  return segment(x).b.kind;
}
