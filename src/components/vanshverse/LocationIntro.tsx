"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { LocationId } from "@/data/world";

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

function Emblem({ id }: { id: LocationId | "client" }) {
  const stroke = "currentColor";
  const common = {
    fill: "none",
    stroke,
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (id === "home") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" className="h-7 w-7">
        <path {...common} d="M6 16 L16 7 L26 16" />
        <path {...common} d="M9 15.5 V25 H23 V15.5" />
        <path {...common} d="M14 25 V19 H18 V25" />
      </svg>
    );
  }
  if (id === "code") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" className="h-7 w-7">
        <rect {...common} x="6" y="8" width="20" height="16" />
        <path {...common} d="M11 14 L8.5 16 L11 18" />
        <path {...common} d="M21 14 L23.5 16 L21 18" />
        <path {...common} d="M16.5 13.5 L14.5 18.5" />
      </svg>
    );
  }
  if (id === "projects") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" className="h-7 w-7">
        <rect {...common} x="8" y="8" width="16" height="5" />
        <rect {...common} x="6" y="14" width="20" height="5" />
        <rect {...common} x="9" y="20" width="14" height="5" />
      </svg>
    );
  }
  if (id === "lab") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" className="h-7 w-7">
        <circle {...common} cx="16" cy="16" r="3" />
        <circle {...common} cx="8" cy="11" r="2" />
        <circle {...common} cx="24" cy="11" r="2" />
        <circle {...common} cx="10" cy="23" r="2" />
        <circle {...common} cx="23" cy="22" r="2" />
        <path {...common} d="M13.5 14.2 L9.6 12.2 M18.5 14.2 L22.4 12.2 M14 18.6 L11.4 21.6 M18.2 18.5 L21.4 20.8" />
      </svg>
    );
  }
  if (id === "career") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" className="h-7 w-7">
        <path {...common} d="M16 6 L19 10 H13 Z" />
        <rect {...common} x="13" y="10" width="6" height="16" />
        <path {...common} d="M13 16 H19 M13 20 H19" />
      </svg>
    );
  }
  if (id === "connect") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" className="h-7 w-7">
        <path {...common} d="M11 16 H21" />
        <circle {...common} cx="8" cy="16" r="2.2" />
        <circle {...common} cx="24" cy="16" r="2.2" />
        <path {...common} d="M16 9 V13 M16 19 V23" />
        <circle {...common} cx="16" cy="7.5" r="1.6" />
        <circle {...common} cx="16" cy="24.5" r="1.6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-7 w-7">
      <path {...common} d="M16 25 C16 25 7 19 7 13.5 C7 10.5 9.4 8.5 12.2 8.5 C14 8.5 15.4 9.4 16 10.8 C16.6 9.4 18 8.5 19.8 8.5 C22.6 8.5 25 10.5 25 13.5 C25 19 16 25 16 25 Z" />
    </svg>
  );
}

export default function LocationIntro({
  id,
  index,
  category,
  title,
  description,
  action,
  actionLabel,
  side,
  motif,
  tone,
  onAction,
}: {
  id: LocationId | "client";
  index: string;
  category: string;
  title: string;
  description: string;
  action: "enter" | "view" | "hint";
  actionLabel: string;
  side: "left" | "right";
  motif: LocationId;
  tone: "gold" | "teal";
  onAction?: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    if (reduced.current) return;

    const origin = side === "right" ? "right center" : "left center";
    const tl = gsap.timeline();
    gsap.set(node.querySelector(".intro-rule"), { transformOrigin: origin });
    tl.fromTo(node.querySelector(".intro-rule"), { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.32, ease: "power2.out" }, 0)
      .fromTo(node.querySelectorAll(".intro-corners span"), { opacity: 0 }, { opacity: 1, duration: 0.22, stagger: 0.04, ease: "power2.out" }, 0.08)
      .fromTo(node.querySelector(".intro-frame"), { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power1.out" }, 0.1)
      .fromTo(node.querySelector(".intro-index"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.28, ease: "power3.out" }, 0.18)
      .fromTo(node.querySelector(".intro-title"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, 0.26)
      .fromTo(node.querySelector(".intro-copy"), { opacity: 0 }, { opacity: 1, duration: 0.24, ease: "power1.out" }, 0.36)
      .fromTo(node.querySelector(".intro-action"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" }, 0.44);

    return () => {
      tl.kill();
    };
  }, [id, index, side, title]);

  return (
    <div
      ref={root}
      className={`intro-dock absolute bottom-24 z-20 w-[min(19.5rem,calc(100vw-1.25rem))] px-3 sm:bottom-[5.5rem] ${
        side === "left" ? "left-0 sm:left-2" : "right-0 sm:right-2"
      }`}
      data-side={side}
      data-tone={tone}
    >
      <div className="intro-rule" />
      <article
        className="intro-frame pointer-events-auto px-4 pb-3.5 pt-3.5"
        data-motif={motif}
        aria-label={`${title} discovered`}
      >
        <div className="intro-corners">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="intro-index flex items-center gap-3">
          <span className="text-[color:var(--intro-accent)]">
            <Emblem id={id === "client" ? "clients" : id} />
          </span>
          <div>
            <p className="intro-num font-mono text-[1.7rem] font-medium leading-none tracking-[0.12em] text-ivory">
              {index}
            </p>
            <p className="mt-1 font-mono text-[9px] tracking-[0.26em] text-[color:var(--intro-accent)]">{category}</p>
          </div>
        </div>
        <div className="intro-sep mt-3" />
        <h2 className="intro-title mt-3 text-[1.65rem] leading-[1.05] text-ivory">{title}</h2>
        <p className="intro-copy mt-2 text-[13px] leading-relaxed text-mist/75">{description}</p>
        <div className="intro-action mt-3.5">
          {action === "hint" ? (
            <p className="intro-hint">{actionLabel}</p>
          ) : (
            <button type="button" className="intro-enter" onClick={onAction}>
              <span className="intro-key">E</span>
              <span>{actionLabel}</span>
            </button>
          )}
        </div>
      </article>
    </div>
  );
}
