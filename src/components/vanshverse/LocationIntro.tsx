"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { LocationId } from "@/data/world";
import { gameApi, gameBus, type HudAnchor } from "@/game/events";

export const INTRO_META: Record<
  LocationId,
  { category: string; tone: "gold" | "teal"; motif: LocationId }
> = {
  home: { category: "Residence", tone: "gold", motif: "home" },
  code: { category: "Systems", tone: "teal", motif: "code" },
  projects: { category: "Archive", tone: "gold", motif: "projects" },
  lab: { category: "Research", tone: "teal", motif: "lab" },
  career: { category: "Record", tone: "gold", motif: "career" },
  connect: { category: "Signal", tone: "teal", motif: "connect" },
  clients: { category: "Atelier", tone: "gold", motif: "clients" },
};

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.35,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Emblem({ id }: { id: LocationId | "client" }) {
  if (id === "home") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path {...STROKE} d="M5 16 L16 6 L27 16" />
        <path {...STROKE} d="M8 15.5 V26 H24 V15.5" />
        <path {...STROKE} d="M14 26 V19.5 H18 V26" />
        <path {...STROKE} d="M16 10.5 V13" />
        <circle {...STROKE} cx="16" cy="8.4" r="1.2" />
      </svg>
    );
  }
  if (id === "code") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect {...STROKE} x="6" y="8" width="20" height="16" />
        <path {...STROKE} d="M11 14 L8.6 16 L11 18" />
        <path {...STROKE} d="M21 14 L23.4 16 L21 18" />
        <path {...STROKE} d="M16.6 13.4 L14.6 18.6" />
        <circle cx="16" cy="8" r="1.1" fill="currentColor" />
      </svg>
    );
  }
  if (id === "projects") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path {...STROKE} d="M8 24 V12 L16 7 L24 12 V24 Z" />
        <path {...STROKE} d="M12 24 V16 H20 V24" />
        <path {...STROKE} d="M12 12 H20" />
      </svg>
    );
  }
  if (id === "lab") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <circle {...STROKE} cx="16" cy="16" r="3.2" />
        <circle {...STROKE} cx="8" cy="11" r="2" />
        <circle {...STROKE} cx="24" cy="11" r="2" />
        <circle {...STROKE} cx="10" cy="23" r="2" />
        <circle {...STROKE} cx="23" cy="22" r="2" />
        <path {...STROKE} d="M13.4 14.2 L9.7 12.2 M18.6 14.2 L22.4 12.2 M14 18.7 L11.5 21.5 M18.3 18.6 L21.4 20.8" />
      </svg>
    );
  }
  if (id === "career") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path {...STROKE} d="M10 12 L16 6 L22 12" />
        <path {...STROKE} d="M13 12 V26 H19 V12" />
        <path {...STROKE} d="M13 17 H19 M13 21 H19" />
        <circle cx="16" cy="6" r="1.2" fill="currentColor" />
      </svg>
    );
  }
  if (id === "connect") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path {...STROKE} d="M11 16 H21" />
        <circle {...STROKE} cx="8" cy="16" r="2.3" />
        <circle {...STROKE} cx="24" cy="16" r="2.3" />
        <path {...STROKE} d="M16 9 V13 M16 19 V23" />
        <circle {...STROKE} cx="16" cy="7.4" r="1.7" />
        <circle {...STROKE} cx="16" cy="24.6" r="1.7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path {...STROKE} d="M16 25 C16 25 7.5 19 7.5 13.6 C7.5 10.7 9.8 8.7 12.4 8.7 C14.1 8.7 15.5 9.6 16 11 C16.5 9.6 17.9 8.7 19.6 8.7 C22.2 8.7 24.5 10.7 24.5 13.6 C24.5 19 16 25 16 25 Z" />
      <path {...STROKE} d="M12 14.5 H20" />
    </svg>
  );
}

function Frame() {
  return (
    <svg className="plaque-frame" viewBox="0 0 320 216" preserveAspectRatio="none" aria-hidden="true">
      <path
        className="plaque-frame-fill"
        d="M22 3 H298 L317 22 V194 L298 213 H22 L3 194 V22 Z"
      />
      <path
        className="plaque-frame-edge"
        d="M22 3 H298 L317 22 V194 L298 213 H22 L3 194 V22 Z"
      />
      <path
        className="plaque-frame-inner"
        d="M28 11 H292 L307 26 V190 L292 205 H28 L13 190 V26 Z"
      />
      <path className="plaque-frame-ornament" d="M40 8 H88 M232 8 H280 M40 208 H88 M232 208 H280" />
      <path className="plaque-frame-ornament" d="M8 40 V88 M8 128 V176 M312 40 V88 M312 128 V176" />
      <circle className="plaque-gem" cx="22" cy="22" r="2.2" />
      <circle className="plaque-gem" cx="298" cy="22" r="2.2" />
      <circle className="plaque-gem" cx="22" cy="194" r="2.2" />
      <circle className="plaque-gem" cx="298" cy="194" r="2.2" />
    </svg>
  );
}

function placePlaqueMobile(
  el: HTMLElement,
  a: Pick<HudAnchor, "x" | "y" | "width" | "height">,
  w: number,
  h: number,
) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const nav = 58;
  const dock = 72;
  const pad = 10;
  let left = a.x;
  let top = Math.min(a.y - 10, vh - dock);
  if (top - h < nav + 6) top = nav + h + 6;
  if (top > vh - dock) top = Math.min(vh - dock, nav + h + 6);
  left = Math.min(Math.max(left, pad + w / 2), vw - pad - w / 2);
  el.style.left = `${left}px`;
  el.style.top = `${top}px`;
  el.dataset.mode = "above";
  el.dataset.connect = "down";
  el.style.setProperty("--tail-shift", `${a.x - left}px`);
}

function placePlaque(el: HTMLElement, a: Pick<HudAnchor, "x" | "y" | "width" | "height">) {
  const shell = el.querySelector(".plaque-shell");
  if (!(shell instanceof HTMLElement)) return;
  const w = shell.offsetWidth;
  const h = shell.offsetHeight;
  if (window.matchMedia("(max-width: 640px)").matches) {
    placePlaqueMobile(el, a, w, h);
    return;
  }
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const nav = 62;
  const hud = 84;
  const gap = 20;
  const pad = 12;
  const atlasLeft = vw - 230;
  const atlasBottom = 148;
  let left = a.x;
  let top = a.y - gap;
  let mode: "above" | "side" = "above";
  let connect: "down" | "left" | "right" = "down";
  const compact = a.width < 120;
  const spaceAbove = a.y - nav;
  const hitsAtlas = (cx: number, cy: number) => cx + w / 2 > atlasLeft && cy - h < atlasBottom;

  if (!compact && spaceAbove < h + gap + 12) {
    const rightX = a.x + a.width / 2 + 18 + w / 2;
    const leftX = a.x - a.width / 2 - 18 - w / 2;
    const sideTop = Math.min(Math.max(a.y + Math.min(a.height * 0.16, 64), nav + h), vh - hud);
    if (rightX + w / 2 < vw - pad && !hitsAtlas(rightX, sideTop)) {
      mode = "side";
      connect = "left";
      left = rightX;
      top = sideTop;
    } else if (leftX - w / 2 > pad) {
      mode = "side";
      connect = "right";
      left = leftX;
      top = sideTop;
    } else if (top - h < nav) {
      top = nav + h;
    }
  } else if (top - h < nav) {
    top = nav + h;
  }

  const rightLimit = (top - h < atlasBottom ? atlasLeft : vw - pad) - w / 2;
  left = Math.min(Math.max(left, pad + w / 2), Math.max(pad + w / 2, rightLimit));
  el.style.left = `${left}px`;
  el.style.top = `${top}px`;
  el.dataset.mode = mode;
  el.dataset.connect = connect;
  el.style.setProperty("--tail-shift", `${a.x - left}px`);
}

export default function LocationIntro({
  id,
  index,
  category,
  title,
  description,
  action,
  actionLabel,
  motif,
  tone,
  open,
  onAction,
  onExited,
}: {
  id: LocationId | "client";
  index: string;
  category: string;
  title: string;
  description: string;
  action: "enter" | "view" | "hint";
  actionLabel: string;
  motif: LocationId;
  tone: "gold" | "teal";
  open: boolean;
  onAction?: () => void;
  onExited?: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const pop = useRef<HTMLDivElement>(null);
  const reduced = useRef(false);
  const exited = useRef(onExited);
  exited.current = onExited;

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useLayoutEffect(() => {
    const node = root.current;
    const anchor = gameApi.lastAnchor;
    if (!node || !anchor) return;
    if (id === "client") {
      if (anchor.kind !== "client") return;
    } else if (anchor.kind !== "location" || anchor.id !== id) {
      return;
    }
    placePlaque(node, anchor);
  }, [id]);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    return gameBus.on("hud-anchor", (anchor) => {
      if (!anchor) return;
      if (id === "client") {
        if (anchor.kind !== "client") return;
      } else if (anchor.kind !== "location" || anchor.id !== id) return;
      placePlaque(node, anchor);
    });
  }, [id]);

  useEffect(() => {
    const node = pop.current;
    if (!node) return;
    const reducedMotion = reduced.current;
    const frame = node.querySelector(".plaque-frame");
    const body = node.querySelector(".plaque-body");
    const medal = node.querySelector(".plaque-medallion");
    const kicker = node.querySelector(".plaque-kicker");
    const heading = node.querySelector(".plaque-title");
    const copy = node.querySelector(".plaque-copy");
    const actionNode = node.querySelector(".plaque-action");
    const connector = node.querySelector(".plaque-connector");

    gsap.killTweensOf([node, frame, body, medal, kicker, heading, copy, actionNode, connector]);

    if (!open) {
      if (reducedMotion) {
        exited.current?.();
        return;
      }
      const leave = gsap.timeline({ onComplete: () => exited.current?.() });
      leave
        .to([actionNode, copy, heading, kicker], { opacity: 0, y: -6, duration: 0.16, stagger: 0.03, ease: "power1.in" }, 0)
        .to(medal, { scale: 0.6, opacity: 0, duration: 0.16, ease: "power2.in" }, 0.04)
        .to(connector, { scaleY: 0, opacity: 0, duration: 0.18, ease: "power2.in" }, 0.02)
        .to([frame, body], { scaleY: 0.18, opacity: 0, duration: 0.22, ease: "power2.in" }, 0.06);
      return () => {
        leave.kill();
      };
    }

    if (reducedMotion) {
      gsap.set([node, frame, body, medal, kicker, heading, copy, actionNode, connector], { opacity: 1, scale: 1, y: 0, scaleY: 1 });
      return;
    }

    gsap.set(node, { opacity: 1 });
    gsap.set([frame, body], { transformOrigin: "50% 100%", scaleY: 0.16, opacity: 0 });
    gsap.set(medal, { scale: 0.4, opacity: 0 });
    gsap.set(connector, { transformOrigin: "50% 0%", scaleY: 0, opacity: 0 });
    gsap.set([kicker, heading, copy, actionNode], { opacity: 0, y: 10 });

    const enter = gsap.timeline();
    enter
      .to(connector, { scaleY: 1, opacity: 1, duration: 0.22, ease: "power2.out" }, 0)
      .to(medal, { scale: 1, opacity: 1, duration: 0.28, ease: "back.out(1.6)" }, 0.06)
      .to([frame, body], { scaleY: 1, opacity: 1, duration: 0.42, ease: "power3.out" }, 0.1)
      .to(kicker, { opacity: 1, y: 0, duration: 0.24, ease: "power3.out" }, 0.28)
      .to(heading, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, 0.34)
      .to(copy, { opacity: 1, y: 0, duration: 0.26, ease: "power2.out" }, 0.42)
      .to(actionNode, { opacity: 1, y: 0, duration: 0.26, ease: "power2.out" }, 0.48);

    return () => {
      enter.kill();
    };
  }, [id, open]);

  const enterLabel = action === "view" ? "View Portfolio" : "Enter Location";

  return (
    <div ref={root} className="plaque-dock" data-tone={tone} data-motif={motif}>
      <div ref={pop} className="plaque-pop">
        <article className="plaque-shell pointer-events-auto" aria-label={`${title} discovered`}>
          <Frame />
          <div className="plaque-medallion">
            <Emblem id={id === "client" ? "clients" : id} />
          </div>
          <div className="plaque-body">
            <p className="plaque-kicker">
              <span className="plaque-num">{index}</span>
              <i />
              <span>{category}</span>
            </p>
            <h2 className="plaque-title">{title}</h2>
            <p className="plaque-copy">{description}</p>
            <div className="plaque-action">
              {action === "hint" ? (
                <p className="plaque-hint">{actionLabel}</p>
              ) : (
                <button
                  type="button"
                  className="plaque-enter"
                  onClick={(event) => {
                    event.stopPropagation();
                    onAction?.();
                  }}
                >
                  <span className="plaque-key">E</span>
                  <span>{enterLabel}</span>
                </button>
              )}
            </div>
          </div>
        </article>
        <div className="plaque-connector" aria-hidden="true">
          <span className="plaque-finial" />
          <span className="plaque-stem" />
          <span className="plaque-jewel" />
        </div>
      </div>
    </div>
  );
}
